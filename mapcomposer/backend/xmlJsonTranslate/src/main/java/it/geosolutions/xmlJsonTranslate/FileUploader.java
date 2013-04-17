package it.geosolutions.xmlJsonTranslate;

import it.geosolutions.xmlJsonTranslate.utils.IOUtil;

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

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

/**
 * Servlet implementation class FileUploader
 */
public class FileUploader extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private final static String PROPERTY_FILE_PARAM = "app.properties";
	private final static Logger LOGGER = Logger.getLogger(FileUploader.class.getSimpleName());
	private Properties properties = new Properties();
	private String tempDirectory;
	
	private String moveDirectory;

	private String writeRights;
	private String executeRights;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FileUploader() {
		super();
	}

	public void init(ServletConfig servletConfig) throws ServletException {
		super.init(servletConfig);
		String appPropertyFile = getServletContext().getInitParameter(PROPERTY_FILE_PARAM); 
		InputStream inputStream = getServletContext().getResourceAsStream(appPropertyFile);	
		try {
			properties.load(inputStream);
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE)){
				LOGGER.log(Level.SEVERE, "Error encountered while processing properties file", e);
			}
		} 	finally {
			try {
				if (inputStream != null)
					inputStream.close();
			} catch (IOException e) {
				if (LOGGER.isLoggable(Level.SEVERE))
					LOGGER.log(Level.SEVERE,
							"Error building the proxy configuration ", e);
				throw new ServletException(e.getMessage());
			}
		}
		// get the file name for the temporary directory
		String temp = properties.getProperty("temp");
		String moveDir = properties.getProperty("moveDir");
		String writePermissions = properties.getProperty("setWritePermissions");
		String executePermissions = properties.getProperty("setExecutePermissions");		
		
		

		// The move directory must exists !!!
		moveDirectory = moveDir;
		
		writeRights = writePermissions;
		executeRights = executePermissions;
		
		// if it does not exists create the file
		tempDirectory = temp;
		File tempDir = new File(temp);
		if (!tempDir.exists()){
			if(!tempDir.mkdir()){
				LOGGER.log(Level.SEVERE, "Unable to create temporary directory " + tempDir);
				throw new ServletException("Unable to create temporary directory " + tempDir);
			}
		}
	}

	/**
	 * read the content of a file and delete it
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		// get parameter name
		String code = request.getParameter("code");

		if (code != null){

			File file = null;
			BufferedReader br = null;
			PrintWriter writer = null;
			try{
				// get file
				file = new File(tempDirectory + File.separatorChar + code);
				br = new BufferedReader( new FileReader( file ));
				writer = response.getWriter();
				String line = null;
				while( (line=br.readLine()) != null ){
					writer.println( line );
				}
				// delete file
				file.delete();
			} catch(IOException ex){
				if (LOGGER.isLoggable(Level.SEVERE)){
					LOGGER.log(Level.SEVERE,
							"Error encountered while downloading file");
				}
				response.setContentType("text/html");
				writeResponse( response, "{ \"success\":false, \"errorMessage\":\""+ ex.getLocalizedMessage() +"\"}" );				
			} finally {
				try {
					if(br != null){
						br.close();
					}
					
					if(writer != null){
						writer.close();
					}
				} catch (IOException e) {
					if (LOGGER.isLoggable(Level.SEVERE)) {
						LOGGER.log(Level.SEVERE,
								"Error closing streams ", e);
					}
					throw new ServletException(e.getMessage());
				}
			}

		} else {
			if (LOGGER.isLoggable(Level.SEVERE)){
				LOGGER.log(Level.SEVERE,
						"malformed request: code param is required");
			}
			response.setContentType("text/html");
			writeResponse( response, "{ \"success\":false, \"errorMessage\":\"malformed request: code param is required\"}" );
		}
	}

	/**
	 * read and save on file the content of post request
	 * return a json where the name of the file is returned
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		// get parameter name
		String moveFile = request.getParameter("moveFile");
		String fileToMoveName = request.getParameter("zipName");
		
		File fileToMove = null;
		
		try{

			// create a file with a random name
			String uuid = UUID.randomUUID().toString();

			// see http://commons.apache.org/fileupload/using.html
			if (ServletFileUpload.isMultipartContent(request)){
				// Create a factory for disk-based file items
				FileItemFactory factory = new DiskFileItemFactory();
				// Create a new file upload handler
				ServletFileUpload upload = new ServletFileUpload(factory);
				// Parse the request
				List /* FileItem */ items = upload.parseRequest(request);
				// Process the uploaded items
				Iterator iter = items.iterator();
				while (iter.hasNext()) {
					FileItem item = (FileItem) iter.next();
					
					if (!item.isFormField()) { // Process a file upload
						// TODO build file in a proper way!
						
						File uploadedFile = null;
						
						//
						// Manage the move action for the uploaded file 
						//
						if(moveFile != null && fileToMoveName != null && moveFile.equals("true")){
							String fileExtension = item.getName().toLowerCase().split("\\.")[1];
							uploadedFile = new File( tempDirectory + File.separatorChar + fileToMoveName + "." + fileExtension);
							item.write(uploadedFile);
							
							//
							// Move the uploaded file
							//
							
							fileToMove = new File(moveDirectory + File.separatorChar + fileToMoveName + "." + fileExtension); 
							
							FileInputStream in = null;
							FileOutputStream out = null;
							try{
								in = new FileInputStream(uploadedFile);
								out = new FileOutputStream(fileToMove);
								IOUtil.copy(in, out);
							}catch(IOException exc){
								System.out.println(exc.getLocalizedMessage());
								if (LOGGER.isLoggable(Level.SEVERE))
									LOGGER.log(Level.SEVERE,
											"Error encountered while moving the file");
								throw new ServletException("Error encountered while moving the file", exc);
							}finally{
								try{
									if(in != null){
										in.close();
									}
									
									if(out != null){
										out.close();
									}
									
									if(this.writeRights.equals("true")){
										fileToMove.setWritable(true, false);
									} 	
									
									if(this.executeRights.equals("true")){
										fileToMove.setExecutable(true, false);
									} 	
									
								}catch(IOException exc){
									if (LOGGER.isLoggable(Level.SEVERE))
										LOGGER.log(Level.SEVERE,
												"Error encountered while closing the file streams");
									throw new ServletException("Error encountered while closing the file streams", exc);
								}
							}
						}
						
						// 
						// Basic behavior
						//
						else{
							uploadedFile = new File( tempDirectory + File.separatorChar + uuid );
							item.write(uploadedFile);
						}
					} else if(item.getName() != null){
						response.setContentType("text/html");
						writeResponse( response, "{ \"success\":false, \"errorMessage\":\"This servlet can be used only to upload files.\"}" );
					}
				}
			}

			
				response.setContentType("text/html");	        
				writeResponse(response, "{ \"success\":true, \"result\":{ \"code\":\""+ uuid +"\"}}");	
		
			
		} catch (FileUploadException ex){
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
						"Error encountered while uploading file");

			response.setContentType("text/html");
			writeResponse( response, "{ \"success\":false, \"errorMessage\":\""+ ex.getLocalizedMessage() +"\"}" );
			
		} catch (IOException ex) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
						"Error encountered while uploading file");

			response.setContentType("text/html");
			writeResponse( response, "{ \"success\":false, \"errorMessage\":\""+ ex.getLocalizedMessage() +"\"}" );
			
		} catch (Exception ex) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
						"Error encountered while uploading file");

			response.setContentType("text/html");
			writeResponse( response, "{ \"success\":false, \"errorMessage\":\""+ ex.getLocalizedMessage() +"\"}" );
			
		} finally {
			/*try {
				// do nothing
			} catch (IOException e) {
				if (LOGGER.isLoggable(Level.SEVERE))
					LOGGER.log(Level.SEVERE,
							"Error closing streams ", e);
				throw new ServletException(e.getMessage());
			}*/
		}
	}

	/**
	 * @param response
	 * @param text
	 * @throws IOException
	 */
	private void writeResponse(HttpServletResponse response, String text)
			throws IOException {
		PrintWriter writer = null;
		try {
			writer = response.getWriter();
			writer.write( text );
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE, e.getMessage());
		} finally {
			try{
				if (writer != null) {
					writer.flush();
					writer.close();
				}				
			} catch( Exception e){
				if (LOGGER.isLoggable(Level.SEVERE))
					LOGGER.log(Level.SEVERE,
							"Error closing response stream ", e);		
			}
		}
	}	
}
