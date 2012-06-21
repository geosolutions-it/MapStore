package it.geosolutions.xmlJsonTranslate;

import it.geosolutions.xmlJsonTranslate.utils.IOUtil;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.Writer;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * HTTPWebGISFileDownload class.
 * 
 * @author Tobia di Pisa
 * @author Lorenzo Natali
 * 
 */
public class HTTPWebGISFileDownload extends HttpServlet {

	/**
	 * Serialization UID.
	 */
	private static final long serialVersionUID = -138662992151524493L;

	private final static Logger LOGGER = Logger
			.getLogger(HTTPWebGISFileDownload.class.toString());

	private Properties props;

	/**
	 * Initialize the <code>ProxyServlet</code>
	 * 
	 * @param servletConfig
	 *            The Servlet configuration passed in by the servlet container
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
						"Error encountered while processing properties file ",
						e);
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
	 * 
	 *            Used for download a file saved from the temp directory
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException {

		String fileName = (String) request.getParameter("file");
		String temp = this.props.getProperty("temp");
		String filePath = temp + "/" + fileName;

		response.setContentType("application/force-download");
		response.setHeader("Content-Disposition", "attachment; filename="
				+ fileName);

		PrintWriter out = null;

		try {
			out = response.getWriter();
			returnFile(filePath, out);
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE, "Error writing file to download ", e);
			throw new ServletException(e.getMessage());
		} finally {
			if (out != null)
				out.close();
		}

		// ---------------
		// --Delete file--
		// ---------------

		// Make sure the file or directory exists and isn't write protected
		File f = new File(filePath);

		if (!f.exists()) {
			throw new IllegalArgumentException(
					"Delete: no such file or directory: " + fileName);
		}

		if (!f.canWrite()) {
			throw new IllegalArgumentException("Delete: write protected: "
					+ fileName);
		}

		// Attempt to delete it
		boolean success = f.delete();
		if (!success) {
			throw new IllegalArgumentException("Delete: deletion failed");

		}
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
	 * 
	 *            used to save the xml file in a temp directory.
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException {

		String temp = this.props.getProperty("temp");
		File tempDir = new File(temp);

		PrintWriter out = null;
		InputStream is = null;

		try {
			if (tempDir != null && tempDir.exists()) {
				is = request.getInputStream();

				long nanoTime = System.nanoTime();

				String fileName = "context" + nanoTime + ".map";

				IOUtil.stream2localfile(is, fileName, tempDir);

				response.setContentType("text/plain");
				response.setContentType("application/force-download");
				response.setHeader("Content-Disposition",
						"attachment; filename=" + fileName);

				out = response.getWriter();
				out.print(fileName);
			} else {
				if (tempDir != null) {
					if (!tempDir.mkdir())
						throw new IOException(
								"Unable to create temporary directory "
										+ tempDir);
				}
			}
		} catch (IOException e) {
			if (LOGGER.isLoggable(Level.SEVERE))
				LOGGER.log(Level.SEVERE, e.getMessage());
			throw new ServletException(e.getMessage());
		} finally {
			try {
				if (is != null)
					is.close();
			} catch (IOException e) {
				if (LOGGER.isLoggable(Level.SEVERE))
					LOGGER.log(Level.SEVERE, e.getMessage());
			} finally {
				if (out != null) {
					out.flush();
					out.close();
				}
			}
		}
	}

	/**
	 * @param filename
	 * @param out
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public static void returnFile(String filename, Writer out)
			throws FileNotFoundException, IOException {
		Reader in = null;

		try {
			in = new BufferedReader(new FileReader(filename));
			char[] buf = new char[4 * 1024]; // 4K char buffer
			int charsRead;
			while ((charsRead = in.read(buf)) != -1) {
				out.write(buf, 0, charsRead);
			}
		} finally {
			if (in != null)
				in.close();
		}
	}

}
