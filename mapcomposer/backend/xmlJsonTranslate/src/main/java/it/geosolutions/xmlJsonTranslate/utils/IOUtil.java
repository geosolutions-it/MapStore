package it.geosolutions.xmlJsonTranslate.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ConnectException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;

public class IOUtil {
	
	private final static Logger LOGGER = Logger.getLogger(IOUtil.class.toString());
		
	public static void copy(InputStream in, OutputStream out) throws IOException {
		byte[] data = new byte[1024];
		int amountRead = 0;
		while ((amountRead = in.read(data)) != -1) {
			out.write(data, 0, amountRead);
		}
		in.close();
		out.flush();
		out.close();
	}	

	public static String read(File file) {
		try {
			FileInputStream fis = new FileInputStream(file);
			return stream2String(fis);
		} catch (IOException ex) {
			Logger.getLogger(IOUtil.class.getName()).log(Level.SEVERE, null, ex);
			return null;
		}
	}

    public static String stream2String(InputStream is) throws IOException {
        InputStreamReader isr = new InputStreamReader(is);
		char buff[] = new char[1024];
        StringBuffer sb = new StringBuffer();
        int read;
        while((read = isr.read(buff)) != -1) {
            sb.append(buff,0,read);            
        }
        return sb.toString();
    }

	public static boolean stream2file(InputStream is, File outFile) {
		FileOutputStream fout = null;
		try {
			fout = new FileOutputStream(outFile);
			copy(is, fout);
			return true;
		} catch (IOException ex) {
			Logger.getLogger(IOUtil.class.getName()).log(Level.SEVERE, null, ex);
			return false;
		} finally {
			try {
				fout.close();
			} catch (IOException ex) {
				Logger.getLogger(IOUtil.class.getName()).log(Level.SEVERE, null, ex);
			}
		}
	}
	
	public static boolean httpPing(String url) {
		try {
			HttpClient client = new HttpClient();
			GetMethod g = new GetMethod(url);
			client.getHttpConnectionManager().getParams().setConnectionTimeout(2000);
			int status = client.executeMethod(g);
			return status == HttpStatus.SC_OK;
			
		} catch (ConnectException e) {
			return false;
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
	}


    public static File stream2tempfile(InputStream oin, String origname) throws IOException {
		int ppos = origname.lastIndexOf(".");

		String name = "___";
		String suff = "tmp";
		if(ppos > -1) {
			name = (origname.substring(0,ppos));
			suff = origname.substring(ppos);
		}

		File tempFile = File.createTempFile(name, suff);


		InputStream in = new BufferedInputStream(oin);
		OutputStream out = new BufferedOutputStream(new FileOutputStream(tempFile));

		IOUtil.copy(in, out);
		return tempFile;
    }

    public static File stream2localfile(InputStream oin, String filename, String parent)
			throws IOException {
		return stream2localfile(oin, filename, new File(parent));
	}

    public static File stream2localfile(InputStream oin, String filename, File parent)
			throws IOException {
		
		if (!parent.exists()){
			parent.mkdir();
		}
		
		File localFile = new File(parent, filename);

		InputStream in = new BufferedInputStream(oin);
		OutputStream out = new BufferedOutputStream(new FileOutputStream(localFile));

		IOUtil.copy(in, out);
		return localFile;
    }
    
    public static File stringToFile(String data, String parent, String filename) throws IOException{
    	
    	File file = new File(parent, filename);

        FileWriter fileout = new FileWriter(file);

        for (int i = 0; i < data.length(); i++)
            fileout.write(data.charAt(i));

        fileout.close();
        
        return file;
    }

    /**
     * Zip the contents of the directory, and save it in the zipfile. 
     * 
     * @param dir
     * @param zipfile
     * @throws IOException
     * @throws IllegalArgumentException
     */
    public static void zipDirectory(final String dir, final String zipfile, final int buffSize)
    throws IOException, IllegalArgumentException {

    	// Check that the directory is a directory, and get its contents
    	File d = new File(dir);
    	
    	if (!d.isDirectory())
    		throw new IllegalArgumentException("Not a directory:  "
    				+ dir);
    	
    	String[] entries = d.list();

    	// Create a buffer for copying
    	byte[] buffer = new byte[buffSize]; 
    	int bytesRead;

    	ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipfile));
    	FileInputStream in = null;

    	try {
    		for (int i = 0; i < entries.length; i++) {
    			File f = new File(d, entries[i]);
    			
    			//Ignore directory
    			if (f.isDirectory())
    				continue;

    			// Stream to read file
    			in = new FileInputStream(f); 

    			// Make a ZipEntry
    			ZipEntry entry = new ZipEntry(d.getName() + File.separatorChar + f.getName()); 

    			// Store entry
    			out.putNextEntry(entry); 

    			while ((bytesRead = in.read(buffer)) != -1)
    				out.write(buffer, 0, bytesRead);

    			in.close(); 
    		}

    	} catch (IOException e) {
    		LOGGER.log(Level.SEVERE, e.getLocalizedMessage(), e);
    	}finally{
    		// Complete the ZIP file
        	if(out!=null)
        		IOUtils.closeQuietly(out);
        	
        	if(in!=null)
        		IOUtils.closeQuietly(in);
    	}
    }
    
    /**
     * @param dir
     * @return boolean
     */
    public static boolean deleteDirectory(File dir){
    	try{
        	if (dir.isDirectory()){

        		String[] contenuto = dir.list();

        		for (int i=0; i<contenuto.length; i++){
        			boolean success = deleteDirectory(new File(dir, contenuto[i]));
        			
        			if (!success) { 
        				return false; 
        			}
        		}
        	}
        	
        	return dir.delete();
    		
    	}catch(Exception exc){
    		LOGGER.log(Level.SEVERE, exc.getLocalizedMessage(), exc);
    		return false;
    	}
    }
}
