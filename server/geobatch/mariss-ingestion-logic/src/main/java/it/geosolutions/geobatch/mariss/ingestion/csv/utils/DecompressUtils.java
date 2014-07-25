/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 * 
 *  GPLv3 + Classpath exception
 * 
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 * 
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 * 
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package it.geosolutions.geobatch.mariss.ingestion.csv.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.apache.commons.io.FileUtils;
import org.geotools.graph.util.ZipUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Decompress utilities class
 * 
 * @author alejandro.diaz at geo-solutions.it
 * 
 */
public abstract class DecompressUtils {
    static int BUFFER_MAX_SIZE = 100;

	protected final static Logger LOGGER = LoggerFactory
			.getLogger(DecompressUtils.class);

	/**
	 * Decompress the compressed file in a folder checking and cleaning the
	 * target folder
	 * 
	 * @param compressedFile
	 * @param outdir
	 * @param cleanAndCreateFolder
	 *            flag to clean and create the target folder
	 * @throws IOException
	 */
	public static void decompress(String compressedFile, String outdir,
			boolean cleanAndCreateFolder) throws IOException {
		if (cleanAndCreateFolder) {
			File zipFolder = new File(outdir);
			if (zipFolder.exists()) {
				FileUtils.deleteDirectory(zipFolder);
			}
			FileUtils.forceMkdir(zipFolder);
		}
		if (compressedFile.endsWith(".zip")) {
			DecompressUtils.unzip(compressedFile, outdir);
		} else if (compressedFile.endsWith(".tgz")) {
			DecompressUtils.untargz(compressedFile, outdir);
		} else {
			throw new IOException("Unknown file type " + compressedFile);
		}
	}
	
	/**
	 * Decompress a TAR GZ file in a target folder
	 * 
	 * @param compressedFile
	 * @param outdir
	 * @throws IOException
	 */
	public static void untargz(String compressedFile, String outdir)
			throws IOException {
		TarArchiveInputStream tarIn = null;
	    BufferedOutputStream outputStream = null;
	    
		try {
			tarIn = new TarArchiveInputStream(
					new GzipCompressorInputStream(new BufferedInputStream(
							new FileInputStream(compressedFile))));
			
			ArchiveEntry entry = tarIn.getNextEntry();
			while (entry != null){
				try{
					if (!entry.isDirectory()) {
		                File tempFile = new File(outdir + File.separator + entry.getName());

		                byte[] buffer = new byte[BUFFER_MAX_SIZE];
		                outputStream = new BufferedOutputStream(
		                        new FileOutputStream(tempFile), BUFFER_MAX_SIZE);

		                int count = 0;
		                while ((count = tarIn.read(buffer, 0, BUFFER_MAX_SIZE)) != -1) {
		                    outputStream.write(buffer, 0, count);
		                }
		            }
					entry = tarIn.getNextEntry();
				}finally {
					if(outputStream != null){
		                outputStream.flush();
		                outputStream.close();
					}
				}
			}
			tarIn.close();
		} catch (Exception e) {
			e.printStackTrace();
			throw new IOException("Error decompressing " + compressedFile,
					e);
		} finally {
			if (tarIn != null) {
				tarIn.close();
			}
		}
	}

	/**
	 * Unzip the file in a target folder. It fixes a bug for linux environments
	 * on {@link ZipUtil#unzip(String, String)} using the File.separator instead
	 * "\\"
	 * 
	 * @param zipFilename
	 * @param outdir
	 * @throws IOException
	 */
	public static void unzip(String zipFilename, String outdir)
			throws IOException {
		ZipFile zipFile = new ZipFile(zipFilename);
		@SuppressWarnings("rawtypes")
		Enumeration entries = zipFile.entries();

		while (entries.hasMoreElements()) {
			ZipEntry entry = (ZipEntry) entries.nextElement();
			byte[] buffer = new byte[1024];
			int len;

			InputStream zipin = zipFile.getInputStream(entry);
			BufferedOutputStream fileout = new BufferedOutputStream(
					new FileOutputStream(outdir + File.separator
							+ entry.getName()));

			while ((len = zipin.read(buffer)) >= 0)
				fileout.write(buffer, 0, len);

			zipin.close();
			fileout.flush();
			fileout.close();
		}
	}

}
