package it.geosolutions.xmlJsonTranslate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Writer;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSON;
import net.sf.json.JSONObject;
import net.sf.json.xml.XMLSerializer;

/**
 * HTTPWebGISFileUpload class.
 * 
 * @author Tobia di Pisa
 * 
 */
public class HTTPWebGISXmlUpload extends HttpServlet {

	/**
	 * Serialization UID.
	 */
	private static final long serialVersionUID = 2097550601489338403L;
	private final static Logger LOGGER = Logger
			.getLogger(HTTPWebGISFileDownload.class.toString());

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
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		BufferedReader bufferedReader = null;
		InputStream inputStream = null;

		try {
			StringBuilder stringBuilder = new StringBuilder();

			URL xmlData = new URL(
					"http://demo1.geo-solutions.it/exist/rest/mapadmin/context.xml");
			URLConnection yc = xmlData.openConnection();

			inputStream = request.getInputStream();

			if (inputStream != null) {
				bufferedReader = new BufferedReader(new InputStreamReader(
						yc.getInputStream()));

				char[] charBuffer = new char[128];
				int bytesRead = -1;

				while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
					stringBuilder.append(charBuffer, 0, bytesRead);
				}
			} else {
				stringBuilder.append("");
			}

			String xml = stringBuilder.toString();

			XMLSerializer xmlSerializer = new XMLSerializer();
			JSON json = xmlSerializer.read(xml);

			response.setContentType("text/html");

			JSONObject jsonObj = new JSONObject();
			jsonObj.put("success", true);
			jsonObj.put("result", json.toString());

			writeResponse(response, jsonObj);

		} catch (IOException ex) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE,
						"Error encountered while uploading file");

			response.setContentType("text/html");
			JSONObject jsonObj = new JSONObject();
			jsonObj.put("success", false);
			jsonObj.put("errorMessage", ex.getLocalizedMessage());

			writeResponse(response, jsonObj);

		} finally {
			try {
				if (inputStream != null)
					inputStream.close();
			} catch (IOException e) {
				if (LOGGER.isLoggable(Level.SEVERE))
					LOGGER.log(Level.SEVERE, e.getMessage());
			} finally {
				if (bufferedReader != null)
					bufferedReader.close();
			}
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
