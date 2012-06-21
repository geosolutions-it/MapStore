package it.geosolutions.xmlJsonTranslate;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import net.sf.json.xml.XMLSerializer;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

/**
 * HTTPWebGISFileUpload class.
 * 
 * @author Tobia di Pisa
 * 
 */
public class HTTPWebGISFileUpload extends HttpServlet {

	/**
	 * Serialization UID.
	 */
	private static final long serialVersionUID = 2097550601489338403L;
	private final static Logger LOGGER = Logger
			.getLogger(HTTPWebGISFileDownload.class.toString());

	private Properties props;

	/**
	 * Initialize the <code>ProxyServlet</code>
	 * 
	 * @param servletConfig
	 *            The Servlet configuration passed in by the servlet conatiner
	 */
	public void init(ServletConfig servletConfig) throws ServletException {
		super.init(servletConfig);

		InputStream inputStream = getServletContext().getResourceAsStream(
				"/WEB-INF/classes/app.properties");
		Properties props = new Properties();

		try {
			props.load(inputStream);
			this.props = props;
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
						"Error encountered while processing properties file", e);
		} finally {
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
	}

	/**
	 * Performs an HTTP GET request
	 * 
	 * @param httpServletRequest
	 *            The {@link HttpServletRequest} object passed in by the servlet
	 *            engine representing the client request
	 * @param httpServletResponse
	 *            The {@link HttpServletResponse} object by which we can
	 *            response to the client
	 */
	public void doGet(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse) throws IOException,
			ServletException {
	}

	/**
	 * Performs an HTTP POST request
	 * 
	 * @param httpServletRequest
	 *            The {@link HttpServletRequest} object passed in by the servlet
	 *            engine representing the client request
	 * @param httpServletResponse
	 *            The {@link HttpServletResponse} object by which we can
	 *            response to the client
	 */
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		String temp = this.props.getProperty("temp");
		int buffSize = Integer.valueOf(this.props.getProperty("bufferSize"));

		File tempDir = new File(temp);

		try {
			if (tempDir != null && tempDir.exists()) {
				DiskFileItemFactory fileItemFactory = new DiskFileItemFactory();

				/*
				 * Set the size threshold, above which content will be stored on
				 * disk.
				 */
				fileItemFactory.setSizeThreshold(buffSize); // 1 MB

				/*
				 * Set the temporary directory to store the uploaded files of
				 * size above threshold.
				 */
				fileItemFactory.setRepository(tempDir);

				ServletFileUpload uploadHandler = new ServletFileUpload(
						fileItemFactory);

				/*
				 * Parse the request
				 */
				List<FileItem> items = uploadHandler.parseRequest(request);
				Iterator<FileItem> itr = items.iterator();

				while (itr.hasNext()) {
					FileItem item = (FileItem) itr.next();

					if (item.getName().toLowerCase().endsWith(".map")) {
						/*
						 * Handle Form Fields.
						 */
						if (!item.isFormField()) {
							String xml = item.getString();

							XMLSerializer xmlSerializer = new XMLSerializer();
							JSON json = xmlSerializer.read(xml);

							response.setContentType("text/html");

							JSONObject jsonObj = new JSONObject();
							jsonObj.put("success", true);
							jsonObj.put("result",
									URLEncoder.encode(json.toString(), "UTF-8"));

							writeResponse(response, jsonObj);
						}
					} else {
						throw new ServletException(
								"Invalid file type, we have to upload an .map file");
					}
				}
			} else {
				if (tempDir != null) {
					if (!tempDir.mkdir())
						throw new IOException(
								"Unable to create temporary directory "
										+ tempDir);
				}
			}
		} catch (FileUploadException ex) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
						"Error encountered while parsing the request");

			response.setContentType("text/html");

			JSONObject jsonObj = new JSONObject();
			jsonObj.put("success", false);
			jsonObj.put("errorMessage", ex.getLocalizedMessage());

			writeResponse(response, jsonObj);

		} catch (ServletException ex) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
						"Error encountered while uploading file");

			response.setContentType("text/html");

			JSONObject jsonObj = new JSONObject();
			jsonObj.put("success", false);
			jsonObj.put("errorMessage", ex.getLocalizedMessage());

			writeResponse(response, jsonObj);
		}
	}

	/**
	 * @param response
	 * @param jsonObj
	 * @throws IOException
	 */
	private void writeResponse(HttpServletResponse response, JSONObject jsonObj)
			throws IOException {
		Writer writer = null;
		try {
			writer = response.getWriter();
			writer.write(jsonObj.toString());
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE, e.getMessage());
		} finally {
			if (writer != null) {
				writer.flush();
				writer.close();
			}
		}
	}
}
