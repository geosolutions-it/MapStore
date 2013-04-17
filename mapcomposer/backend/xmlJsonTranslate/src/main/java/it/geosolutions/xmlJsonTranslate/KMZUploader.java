/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package it.geosolutions.xmlJsonTranslate;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author marco
 */
public class KMZUploader extends HttpServlet {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private final static String PROPERTY_FILE_PARAM = "app.properties";
    private final static Logger LOGGER = Logger.getLogger(KMZUploader.class.getSimpleName());
    private Properties properties = new Properties();
    private String tempDirectory;

    public KMZUploader() {
        super();
    }

    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        super.init(servletConfig);
        String appPropertyFile = getServletContext().getInitParameter(PROPERTY_FILE_PARAM);
        InputStream inputStream = getServletContext().getResourceAsStream(appPropertyFile);
        try {
            properties.load(inputStream);
        } catch (IOException e) {
            if (LOGGER.isLoggable(Level.SEVERE)) {
                LOGGER.log(Level.SEVERE, "Error encountered while processing properties file", e);
            }
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException e) {
                if (LOGGER.isLoggable(Level.SEVERE)) {
                    LOGGER.log(Level.SEVERE,
                            "Error building the proxy configuration ", e);
                }
                throw new ServletException(e.getMessage());
            }
        }
        // get the file name for the temporary directory
        String temp = properties.getProperty("temp");

        // if it does not exists create the file
        tempDirectory = temp;
        File tempDir = new File(temp);
        if (!tempDir.exists()) {
            if (!tempDir.mkdir()) {
                if (LOGGER.isLoggable(Level.SEVERE)) {
                    LOGGER.log(Level.SEVERE, "Unable to create temporary directory {0}", tempDir);
                }
                throw new ServletException("Unable to create temporary directory " + tempDir);
            }

        }

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String code = request.getParameter("code");
        
        String filename = request.getParameter("filename");

        if (code != null) {

            File file = null;
            BufferedReader br = null;
            PrintWriter writer = null;
            try {
                file = new File(tempDirectory + File.separatorChar + code + File.separatorChar + filename);
                br = new BufferedReader(new FileReader(file));
                writer = response.getWriter();
                String line = null;
                while ((line = br.readLine()) != null) {
                    writer.println(line);
                }
            } catch (IOException ex) {
                if (LOGGER.isLoggable(Level.SEVERE)) {
                    LOGGER.log(Level.SEVERE,
                            "Error encountered while downloading file");
                }
                response.setContentType("text/html");
                writeResponse(response, "{ \"success\":false, \"errorMessage\":\"" + ex.getLocalizedMessage() + "\"}");
            } finally {
                try {
                    br.close();
                    writer.close();
                } catch (IOException e) {
                    if (LOGGER.isLoggable(Level.SEVERE)) {
                        LOGGER.log(Level.SEVERE,
                                "Error closing streams ", e);
                    }
                    throw new ServletException(e.getMessage());
                }

            }

        } else {
            if (LOGGER.isLoggable(Level.SEVERE)) {
                LOGGER.log(Level.SEVERE,
                        "malformed request: code param is required");
            }
            response.setContentType("text/html");
            writeResponse(response, "{ \"success\":false, \"errorMessage\":\"malformed request: code param is required\"}");
        }

    }

    @Override
    @SuppressWarnings("CallToThreadDumpStack")
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // random name for the directory where I store KMZ uncompressed files
        String uuid = UUID.randomUUID().toString();

        // file uploading is a multipart request
        if (ServletFileUpload.isMultipartContent(request)) {
            // Create a factory for disk-based file items
            FileItemFactory factory = new DiskFileItemFactory();
            // Create a new file upload handler
            ServletFileUpload upload = new ServletFileUpload(factory);
            // Parse the request
            List /* FileItem */ items = null;
            try {
                items = upload.parseRequest(request);
                // Process the uploaded items
                Iterator iter = items.iterator();
                while (iter.hasNext()) {
                    FileItem item = (FileItem) iter.next();

                    if (!item.isFormField()) { // Process a file upload

                        // uncompress (zip) the input stream and put files in a temporary directory
                        ZipInputStream zis = null;
                        FileOutputStream fos = null;
                        FileInputStream fis = null;
                        try {
                            byte[] buffer = new byte[1024];
                            String kmlFileName = null;

                            String newFileName = null;
                            
                            //get the zip file content
                            zis = new ZipInputStream(item.getInputStream());
                            //get the zipped file list entry
                            ZipEntry ze = zis.getNextEntry();

                            while (ze != null) {

                                if (!ze.isDirectory()) {
                                    String fileName = ze.getName();
                                    File dir = new File(tempDirectory);


                                    // save file "as is" in the temporary directory
                                    File originalFile = new File(tempDirectory + File.separatorChar + uuid + File.separatorChar + fileName);
                                    if (LOGGER.isLoggable(Level.INFO)) {
                                        LOGGER.log(Level.INFO, "file unzip: {0}", originalFile.getAbsoluteFile());
                                    }
                                    //create all non exists folders
                                    //else you will hit FileNotFoundException for compressed folder
                                    new File(originalFile.getParent()).mkdirs();

                                    fos = new FileOutputStream(originalFile);

                                    int len;
                                    while ((len = zis.read(buffer)) > 0) {
                                        fos.write(buffer, 0, len);
                                    }

                                    fos.close();


                                    if (fileName.toLowerCase().endsWith(".kml")) {


                                        // if the file is a kml file, read its content and modify its dom
                                        fis = new FileInputStream(originalFile);

                                        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
                                        DocumentBuilder db = null;
                                        db = dbf.newDocumentBuilder();
                                        Document doc = db.parse(fis);

                                        // change local path with full http address
                                        NodeList nodes = doc.getElementsByTagName("Icon");
                                        for (int i = 0; i < nodes.getLength(); i++) {
                                            Node node = nodes.item(i);
                                            NodeList children = node.getChildNodes();
                                            for (int j = 0; j < children.getLength(); j++) {
                                                Node child = children.item(j);
                                                if (child.getNodeName().equals("href")) {
                                                    String urlString = child.getTextContent();
                                                    if (!urlString.startsWith("http")) {
                                                        child.setTextContent(
                                                                request.getScheme() + "://"
                                                                + request.getServerName() + ":"
                                                                + request.getServerPort()
                                                                + request.getContextPath() + "/"
                                                                + dir.getName() + "/"
                                                                + uuid + "/" + urlString);
                                                    }


                                                }
                                            }
                                        }

                                        newFileName = "new_" + fileName;
                                        kmlFileName = uuid + File.separatorChar + newFileName;
                                        File newFile = new File(tempDirectory + File.separatorChar + kmlFileName);
                                        fos = new FileOutputStream(newFile);

                                        TransformerFactory tFactory =
                                                TransformerFactory.newInstance();
                                        Transformer transformer = tFactory.newTransformer();

                                        DOMSource source = new DOMSource(doc);
                                        StreamResult result = new StreamResult(fos);
                                        transformer.transform(source, result);

                                        fos.close();
                                        fis.close();

                                    }
                                }


                                ze = zis.getNextEntry();
                            }

                            zis.closeEntry();
                            zis.close();

                            response.setContentType("text/html");
                            writeResponse(response, "{ \"success\":true, \"result\":{\"code\":\"" + uuid + "\",\"newFileName\":\"" + newFileName + "\"}}");

                        } catch (IOException ex) {
                            if (LOGGER.isLoggable(Level.SEVERE)) {
                                LOGGER.log(Level.SEVERE, "Error encountered while uploading file: {0}", ex.getMessage());
                            }
                            response.setContentType("text/html");
                            writeResponse(response, "{ \"success\":false, \"errorMessage\":\"Error encountered while uploading file.\"}");
                        } finally {
                            try {
                                if (zis != null) {
                                    zis.close();
                                }
                                if ( fos != null ){
                                    fos.close();
                                }
                                if ( fis != null ){
                                    fis.close();
                                }
                            } catch (IOException ex) {
                                if (LOGGER.isLoggable(Level.SEVERE)) {
                                    LOGGER.log(Level.SEVERE,
                                            "Error closing streams ", ex);
                                }
                                throw new ServletException(ex.getMessage());
                            }
                        }
                    } else {
                        response.setContentType("text/html");
                        writeResponse(response, "{ \"success\":false, \"errorMessage\":\"This servlet can be used only to upload files.\"}");

                    }
                }


            } catch (Exception ex) {
                if (LOGGER.isLoggable(Level.SEVERE)) {
                    LOGGER.log(Level.SEVERE, "Error encountered while uploading file{0}", ex.getMessage());
                }

                response.setContentType("text/html");
                writeResponse(response, "{ \"success\":false, \"errorMessage\":\"" + ex.getLocalizedMessage() + "\"}");
            } finally {
                // do nothing
            }

        } else {
            response.setContentType("text/html");
            writeResponse(response, "{ \"success\":false, \"errorMessage\":\"Expected multipart/form-data type.\"}");
        }


    }

    private void writeResponse(HttpServletResponse response, String text)
            throws IOException {
        PrintWriter writer = null;
        try {
            writer = response.getWriter();
            writer.write(text);
        } catch (IOException e) {
            if (LOGGER.isLoggable(Level.SEVERE)) {
                LOGGER.log(Level.SEVERE, e.getMessage());
            }
        } finally {
            try {
                if (writer != null) {
                    writer.flush();
                    writer.close();
                }
            } catch (Exception e) {
                if (LOGGER.isLoggable(Level.SEVERE)) {
                    LOGGER.log(Level.SEVERE,
                            "Error closing response stream ", e);
                }
            }

        }
    }
}
