/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://geobatch.geo-solutions.it/
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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
package it.geosolutions.geobatch.destination.common.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Random;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockftpserver.fake.FakeFtpServer;
import org.mockftpserver.fake.UserAccount;
import org.mockftpserver.fake.filesystem.DirectoryEntry;
import org.mockftpserver.fake.filesystem.FileEntry;
import org.mockftpserver.fake.filesystem.FileSystem;
import org.mockftpserver.fake.filesystem.UnixFakeFileSystem;

import com.enterprisedt.net.ftp.FTPConnectMode;
import com.enterprisedt.net.ftp.FTPException;

/**
 * JUnit test for {@link RemoteBrowserUtils} utilities for a FTP server
 * 
 * @author adiaz
 */
public class RemoteBrowserUtilFTPTest {

	/**
	 * Mocked FTP server for testing
	 */
	private FakeFtpServer fakeFtpServer;

	/**
	 * Port to start fake FTP server
	 */
	private int FAKE_FTP_PORT = 10580;

	/**
	 * FTP credentials
	 */
	private static final String FAKE_FTP_USER = "user";

	/**
	 * FTP credentials
	 */
	private static final String FAKE_FTP_PWD = "password";

	/**
	 * Temporal directory
	 */
	private static String TMP_DIR = System.getProperty("java.io.tmpdir");

	/**
	 * File separator
	 */
	private static String SEPARATOR = System.getProperty("file.separator");

	/**
	 * Random for new file generation
	 */
	private static Random RANDOM = new Random();

	/**
	 * Prepare test for remote FTP file browsing
	 * 
	 * @throws Exception
	 */
	@Before
	public void setup() throws Exception {

		// fake FTP server
		fakeFtpServer = new FakeFtpServer();
		fakeFtpServer.setServerControlPort(FAKE_FTP_PORT);
		fakeFtpServer.addUserAccount(new UserAccount(FAKE_FTP_USER,
				FAKE_FTP_PWD, "/"));
		FileSystem fileSystem = new UnixFakeFileSystem();
		fileSystem.add(new DirectoryEntry("/tmp"));
		fileSystem.add(new DirectoryEntry("/tmp/SIIG"));
		fileSystem.add(new DirectoryEntry("/tmp/SIIG/Acquisiti"));
		fileSystem.add(new DirectoryEntry("/tmp/SIIG/Elaborati"));
		fileSystem.add(new DirectoryEntry("/tmp/SIIG/Scarti"));
		fileSystem.add(new FileEntry(
				"/tmp/SIIG/Acquisiti/00_20131218_141116.xml", "fake"));
		fileSystem.add(new FileEntry(
				"/tmp/SIIG/Acquisiti/00_20140107_142500.xml", "fake"));
		fakeFtpServer.setFileSystem(fileSystem);
		fakeFtpServer.start();
	}

	/**
	 * Test a ls for a mocked FTP server
	 * 
	 * @throws IOException
	 * @throws FTPException
	 * @throws ParseException
	 */
	@Test
	public void ftpLSTest() throws IOException, FTPException, ParseException {
		// Must return two files
		List<String> remoteLs = RemoteBrowserUtils.ls(
				RemoteBrowserProtocol.ftp, FAKE_FTP_USER, FAKE_FTP_PWD,
				"localhost", FAKE_FTP_PORT, "/tmp/SIIG/Acquisiti",
				FTPConnectMode.ACTIVE, 5000);
		assertEquals(remoteLs.size(), 2);
	}

	/**
	 * Test a download for a mocked FTP server
	 * 
	 * @throws IOException
	 * @throws FTPException
	 * @throws ParseException
	 */
	@Test
	public void ftpDownloadTest() throws IOException, FTPException,
			ParseException {
		File file = RemoteBrowserUtils.downloadFile(RemoteBrowserProtocol.ftp,
				FAKE_FTP_USER, FAKE_FTP_PWD, "localhost", FAKE_FTP_PORT,
				"/tmp/SIIG/Acquisiti/00_20140107_142500.xml", TMP_DIR
						+ SEPARATOR + "00_20140107_142500.xml", 5000);
		assertNotNull(file);
		assertTrue(file.exists());
	}

	/**
	 * Test a delte for a mocked FTP server
	 * 
	 * @throws FTPException
	 * @throws IOException
	 * @throws ParseException
	 */
	@Test
	public void ftpDeleteTest() throws FTPException, IOException,
			ParseException {
		RemoteBrowserUtils.deleteFile(RemoteBrowserProtocol.ftp, FAKE_FTP_USER,
				FAKE_FTP_PWD, "localhost", FAKE_FTP_PORT, 5000,
				"/tmp/SIIG/Acquisiti", "00_20140107_142500.xml",
				FTPConnectMode.ACTIVE);
		// must return one file
		List<String> remoteLs = RemoteBrowserUtils.ls(
				RemoteBrowserProtocol.ftp, FAKE_FTP_USER, FAKE_FTP_PWD,
				"localhost", FAKE_FTP_PORT, "/tmp/SIIG/Acquisiti",
				FTPConnectMode.ACTIVE, 5000);
		assertEquals(remoteLs.size(), 1);
	}

	/**
	 * Test a upload for a mocked FTP server
	 * 
	 * @throws FTPException
	 * @throws IOException
	 * @throws ParseException
	 */
	@Test
	public void ftpUploadTest() throws FTPException, IOException,
			ParseException {
		File file = File.createTempFile("ftp", "test");
		String filePath = file.getAbsolutePath();
		
		RemoteBrowserUtils.putFile(RemoteBrowserProtocol.ftp, FAKE_FTP_USER,
				"localhost", FAKE_FTP_PWD, FAKE_FTP_PORT,
				"/tmp/SIIG/Scarti/tmp", filePath, FTPConnectMode.ACTIVE, 5000);
		// must return one file
		List<String> remoteLs = RemoteBrowserUtils.ls(
				RemoteBrowserProtocol.ftp, FAKE_FTP_USER, FAKE_FTP_PWD,
				"localhost", FAKE_FTP_PORT, "/tmp/SIIG/Scarti",
				FTPConnectMode.ACTIVE, 5000);
		assertEquals(remoteLs.size(), 1);
	}
	
	/**
	 * Check if force mkdir works
	 * @throws IOException
	 * @throws FTPException
	 * @throws ParseException
	 */
	@Test
	public void forceMkdirTest() throws IOException, FTPException, ParseException{
		// new random path
		String folderPath = RANDOM.nextInt() + SEPARATOR + RANDOM.nextInt() + SEPARATOR + RANDOM.nextInt();
		
		assertEquals(false, RemoteBrowserUtils.checkIfExists(RemoteBrowserProtocol.ftp, FAKE_FTP_USER,
				"localhost", FAKE_FTP_PWD, FAKE_FTP_PORT,
				"/tmp", folderPath, FTPConnectMode.ACTIVE, 5000));
		RemoteBrowserUtils.forceMkdir(RemoteBrowserProtocol.ftp, FAKE_FTP_USER,
				"localhost", FAKE_FTP_PWD, FAKE_FTP_PORT,
				"tmp", folderPath, FTPConnectMode.ACTIVE, 5000);
		assertEquals(true, RemoteBrowserUtils.checkIfExists(RemoteBrowserProtocol.ftp, FAKE_FTP_USER,
				"localhost", FAKE_FTP_PWD, FAKE_FTP_PORT,
				"/tmp", folderPath, FTPConnectMode.ACTIVE, 5000));
	}

	/**
	 * Stop FTP fake server
	 */
	@After
	public void tearDown() {
		fakeFtpServer.stop();
	}

}
