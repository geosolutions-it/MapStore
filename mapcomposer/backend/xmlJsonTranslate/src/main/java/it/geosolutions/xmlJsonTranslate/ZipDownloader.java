/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package it.geosolutions.xmlJsonTranslate;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringReader;
import java.util.Iterator;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

/**
 * return a list of files from server compressed as zip
 *
 * @author marco
 */
public class ZipDownloader extends HttpServlet {

    private final static Logger LOGGER = Logger.getLogger(FileDownloader.class.getSimpleName());
    private Properties properties = new Properties();
    private String tempDirectory;
    private final static String PROPERTY_FILE_PARAM = "app.properties";

    public ZipDownloader() {
        super();
    }

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
                LOGGER.log(Level.SEVERE, "Unable to create temporary directory " + tempDir);
                throw new ServletException("Unable to create temporary directory " + tempDir);
            }

        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // get parameter name
        String code = request.getParameter("code");
        String filename = request.getParameter("filename");

        if (code != null) {

            File file = null;
            InputStream is = null;
            OutputStream os = null;
            try {
                // set reponse headers
                response.setContentType("application/force-download");
                response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

                // get file
                file = new File(tempDirectory + File.separator + code);
                is = new BufferedInputStream(new FileInputStream(file));
                int totalBytesRead = 0;
                byte[] result = new byte[(int)file.length()];
                while (totalBytesRead < result.length) {
                    int bytesRemaining = result.length - totalBytesRead;
                    int bytesRead = is.read(result, totalBytesRead, bytesRemaining);
                    if (bytesRead > 0) {
                        totalBytesRead = totalBytesRead + bytesRead;
                    }
                    os = new BufferedOutputStream( response.getOutputStream() );
                    os.write( result );
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
                    if ( is != null ){
                        is.close();
                    }
                    if ( os != null ){
                        os.close();
                    }
                    
                    if (file != null) {
                        file.delete();
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
            if (LOGGER.isLoggable(Level.SEVERE)) {
                LOGGER.log(Level.SEVERE,
                        "malformed request: code param is required");
            }
            response.setContentType("text/html");
            writeResponse(response, "{ \"success\":false, \"errorMessage\":\"malformed request: code param is required\"}");
        }

    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        FileInputStream in = null;
        ZipOutputStream out = null;
        try {
            String uuid = UUID.randomUUID().toString();

            StringBuilder builder = new StringBuilder();
            String line = "";

            while ((line = request.getReader().readLine()) != null) {
                builder.append(line);
            }

            String content = builder.toString();

            JSONObject requestObj = (JSONObject) JSONSerializer.toJSON(content);

            // LOGGER.log(Level.INFO, requestObj.toString());

            // { files:[ { filename:String, path:String } ] }
            out = new ZipOutputStream(new FileOutputStream(new File(tempDirectory + File.separator + uuid)));
            JSONArray files = requestObj.getJSONArray("files");
            Iterator iterator = files.iterator();
            while (iterator.hasNext()) {
                JSONObject file = (JSONObject) iterator.next();
                String filename = file.getString("filename");
                String path = file.getString("path");
                in = new FileInputStream(path);
                
                out.putNextEntry(new ZipEntry(filename));
                byte[] b = new byte[1024];
                int count;
                while ((count = in.read(b)) > 0) {
                    out.write(b, 0, count);
                }

                
                in.close();

                response.setContentType("text/html");
                writeResponse(response, "{ \"success\":true, \"result\":{ \"code\":\"" + uuid + "\"}}");
            }
            
            out.close();

        } catch (FileNotFoundException ex) {
            if (LOGGER.isLoggable(Level.SEVERE)) {
                LOGGER.log(Level.SEVERE, "Error encountered while uploading file: {0}", ex.getMessage());
            }
            response.setContentType("text/html");
            writeResponse(response, "{ \"success\":false, \"errorMessage\":\"Error encountered while uploading file: " + ex.getMessage() + "\"}");
        } catch (IOException ex) {
            if (LOGGER.isLoggable(Level.SEVERE)) {
                LOGGER.log(Level.SEVERE, "Error encountered while uploading file: {0}", ex.getMessage());
            }
            response.setContentType("text/html");
            writeResponse(response, "{ \"success\":false, \"errorMessage\":\"Error encountered while uploading file: " + ex.getMessage() + " \"}" );
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
                if (out != null) {
                    out.close();
                }
            } catch (IOException ex) {
                if (LOGGER.isLoggable(Level.SEVERE)) {
                    LOGGER.log(Level.SEVERE,
                            "Error closing streams ", ex);
                }
                throw new ServletException(ex.getMessage());
            }
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
