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

import it.geosolutions.geobatch.ftp.client.FTPHelperBare;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.util.LinkedList;
import java.util.List;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.apache.commons.vfs2.FileObject;
import org.apache.commons.vfs2.FileSystemException;
import org.apache.commons.vfs2.FileSystemOptions;
import org.apache.commons.vfs2.VFS;
import org.apache.commons.vfs2.impl.DefaultFileSystemManager;
import org.apache.commons.vfs2.provider.sftp.SftpFileSystemConfigBuilder;

import com.enterprisedt.net.ftp.FTPConnectMode;
import com.enterprisedt.net.ftp.FTPException;
import com.enterprisedt.net.ftp.FTPFile;
import com.enterprisedt.net.ftp.FTPTransferType;
import com.enterprisedt.net.ftp.WriteMode;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

/**
 * Utilities class for remote files handling with {@link RemoteBrowserProtocol}
 * protocols
 * 
 * @author adiaz
 */
public class RemoteBrowserUtils {

/**
 * File separator
 */
private static String SEPARATOR = System.getProperty("file.separator");

/**
 * File system manager for the remote operations
 */
private static DefaultFileSystemManager fsManager = null;

/**
 * Default file system options
 */
private static FileSystemOptions fsOptions;

/**
 * Initialize the file system manager with a specific timeout
 * 
 * @param timeout
 * @throws FileSystemException
 */
private static void initFsManager(int timeout) throws FileSystemException {
    // init fsManager
    if (fsManager == null) {
        // we first set strict key checking off
        fsOptions = new FileSystemOptions();
        SftpFileSystemConfigBuilder.getInstance().setStrictHostKeyChecking(
                fsOptions, "no");
        // now we create a new file system manager
        fsManager = (DefaultFileSystemManager) VFS.getManager();
        SftpFileSystemConfigBuilder.getInstance().setUserDirIsRoot(fsOptions,
                false);
    }
    SftpFileSystemConfigBuilder.getInstance().setTimeout(fsOptions, timeout);
}

/**
 * Download a file from a remote server
 * 
 * @param serverProtocol
 * @param serverUser
 * @param serverPWD
 * @param serverHost
 * @param serverPort
 * @param remotePath absolute path for the remote file
 * @param localPath to download the file
 * @param timeout
 * @return File with the remote content
 * @throws IOException
 */
public static File downloadFile(RemoteBrowserProtocol serverProtocol,
        String serverUser, String serverPWD, String serverHost, int serverPort,
        String remotePath, String localPath, int timeout) throws IOException {
	if(RemoteBrowserProtocol.local.equals(serverProtocol)){
		return copyfile(remotePath, localPath);
	}else{
		initFsManager(timeout);
	    FileObject file = fsManager.resolveFile(
	            getURI(serverProtocol, serverUser, serverPWD, serverHost,
	                    serverPort, remotePath), fsOptions);
	    return downloadFile(file, localPath);
	}
}

/**
 * Delete a remote file
 * 
 * @param protocol
 * @param user
 * @param password
 * @param host
 * @param port
 * @param timeout
 * @param filePath
 * @param fileName
 * @param connectMode only used for {@link RemoteBrowserProtocol#ftp} protocol
 * @throws FTPException
 * @throws IOException
 */
public static void deleteFile(RemoteBrowserProtocol protocol, String user,
        String password, String host, int port, int timeout, String filePath,
        String fileName, FTPConnectMode connectMode) throws FTPException,
        IOException {
    if (RemoteBrowserProtocol.ftp.equals(protocol)) {
        FTPHelperBare
                .deleteFileOrDirectory(host, fileName, false,
                        cleanRoot(filePath), user, password, port, connectMode,
                        timeout);
    } else if (RemoteBrowserProtocol.sftp.equals(protocol)) {
        initFsManager(timeout);
        FileObject file = fsManager.resolveFile(
                getURI(protocol, user, password, host, port, filePath
                        + SEPARATOR + fileName), fsOptions);
        file.delete();
    }else{
    	// delete the local file
    	File file = new File(filePath
                + SEPARATOR + fileName);
    	file.delete();
    }
}

/**
 * Clean first separator for {@link RemoteBrowserProtocol#ftp} protocol
 * 
 * @param path absolute remote path, for example: '/path/to/file'
 * @return path without starter '/', for example: 'path/to/file'
 */
private static String cleanRoot(String path) {
    if (path.startsWith("/")) {
        return path.replaceFirst("/", "");
    } else {
        return path;
    }
}

/**
 * Ls simple command for a remote folder
 * 
 * @param protocol
 * @param userName
 * @param password
 * @param host
 * @param port
 * @param path
 * @param connectMode
 * @param timeout
 * @return name of files or directories inside the remote folder
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
public static List<String> ls(RemoteBrowserProtocol protocol, String userName,
        String password, String host, int port, String path,
        FTPConnectMode connectMode, int timeout) throws IOException,
        FTPException, ParseException {
    return ls(protocol, userName, password, host, port, path, connectMode, timeout, null);
}

/**
 * Ls simple command for a remote folder
 * 
 * @param protocol
 * @param userName
 * @param password
 * @param host
 * @param port
 * @param path
 * @param connectMode
 * @param timeout
 * @param pattern to match specific files
 * @return name of files or directories inside the remote folder
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
public static List<String> ls(RemoteBrowserProtocol protocol, String userName,
        String password, String host, int port, String path,
        FTPConnectMode connectMode, int timeout, Pattern pattern) throws IOException,
        FTPException, ParseException {

    if (RemoteBrowserProtocol.ftp.equals(protocol)) {
        return ftpLS(userName, password, host, port, path, connectMode, timeout, pattern, null);
    } else {
        return sftpLS(userName, password, host, port, path, timeout, pattern, null);
    }
}

/**
 * Ls simple command for a remote folder
 * 
 * @param protocol
 * @param userName
 * @param password
 * @param host
 * @param port
 * @param path
 * @param connectMode
 * @param timeout
 * @param pattern to match specific files
 * @return name of files or directories inside the remote folder
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
public static List<String> ls(RemoteBrowserProtocol protocol, String userName,
        String password, String host, int port, String path,
        FTPConnectMode connectMode, int timeout, Pattern pattern, Boolean foldersFlag) throws IOException,
        FTPException, ParseException {

    if (RemoteBrowserProtocol.ftp.equals(protocol)) {
        return ftpLS(userName, password, host, port, path, connectMode, timeout, pattern, foldersFlag);
    } else if (RemoteBrowserProtocol.sftp.equals(protocol)) {
        return sftpLS(userName, password, host, port, path, timeout, pattern, foldersFlag);
    } else {
        return localLS(path, pattern, foldersFlag);
    }
}

/**
 * SFTP protocol ls
 * 
 * @param userName
 * @param password
 * @param host
 * @param port
 * @param path
 * @param timeout
 * @param pattern
 * @param foldersFlag return only folders (true), only files(false) or everything (null)
 * @return name of files or directories inside the remote folder
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
private static List<String> sftpLS(String userName, String password,
        String host, int port, String path, int timeout, Pattern pattern, Boolean foldersFlag) throws IOException {
    
    Session session = null;
    Channel channel = null;
    ChannelSftp sftpChannel = null;
    List<String> names = new LinkedList<String>();

    try {
        JSch jsch = new JSch();
        session = jsch.getSession(userName, host, port);
        session.setPassword(password);
        java.util.Properties config = new java.util.Properties();
        config.put("StrictHostKeyChecking", "no");
        session.setConfig(config);
        session.connect();
        channel = session.openChannel(RemoteBrowserProtocol.sftp.name());
        channel.connect();
        sftpChannel = (ChannelSftp) channel;
        sftpChannel.cd(path);
        @SuppressWarnings("unchecked")
        Vector<LsEntry> filelist = sftpChannel.ls(path);
        for (int i = 0; i < filelist.size(); i++) {
        	LsEntry lsEntry = filelist.get(i);
        	boolean mustCheck = true;
        	if(foldersFlag != null){
        		if(foldersFlag.equals(lsEntry.getAttrs().isDir())){
        			mustCheck = true;
        		}else{
        			mustCheck = false;
        		}
        	}
        	if(mustCheck){
        		String fileName = lsEntry.getFilename();
                if(pattern != null){
                    Matcher m = pattern.matcher(fileName);
                    if (m.matches()) {
                        names.add(fileName);
                    }
                }else{
                    if (!fileName.equals(".") && !fileName.equals("..")) {
                        names.add(fileName);
                    }
                }
        	}
        }

    } catch (Exception e) {
        throw new IOException("Error on ls", e);
    } finally {
        if (sftpChannel != null) {
            sftpChannel.exit();
        }
        if (session != null) {
            session.disconnect();
        }
    }

    return names;
}

/**
 * FTP protocol ls
 * 
 * @param userName
 * @param password
 * @param host
 * @param port
 * @param path
 * @param connectMode
 * @param timeout
 * @param pattern
 * @param foldersFlag return only folders (true), only files(false) or everything (null)
 * @return name of files or directories inside the remote folder
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
private static List<String> ftpLS(String userName, String password,
        String host, int port, String path, FTPConnectMode connectMode,
        int timeout, Pattern pattern, Boolean foldersFlag) throws IOException, FTPException, ParseException {

    FTPFile[] files = FTPHelperBare.dirDetails(host, path, SEPARATOR, userName,
            password, port, FTPTransferType.BINARY, WriteMode.OVERWRITE,
            connectMode, timeout);

    List<String> names = new LinkedList<String>();

    // For each file on the remote directory
    for (FTPFile file : files) {
    	boolean mustCheck = true;
    	if(foldersFlag != null){
    		if(foldersFlag.equals(file.isDir())){
    			mustCheck = true;
    		}else{
    			mustCheck = false;
    		}
    	}
    	if(mustCheck){
            String fileName = file.getName();
            if(pattern != null){
                Matcher m = pattern.matcher(fileName);
                if (m.matches()) {
                    names.add(fileName);
                }
            }else{
                names.add(fileName);
            }
    	}
    }

    return names;
}

/**
 * List for local protocol
 * 
 * @param userName 
 * @param path local path
 * @param pattern
 * @param foldersFlag
 * @return
 */
private static List<String> localLS(String path, Pattern pattern, Boolean foldersFlag) {
	List<String> names = new LinkedList<String>();
	File folder = new File(path);
	if(folder.exists() && folder.isDirectory()){
		for(String fileName: folder.list()){
			boolean mustCheck = true;
	    	if(foldersFlag != null){
	    		if(foldersFlag.equals(new File(path + SEPARATOR + fileName).isDirectory())){
	    			mustCheck = true;
	    		}else{
	    			mustCheck = false;
	    		}
	    	}
	    	if(mustCheck){
	            if(pattern != null){
	                Matcher m = pattern.matcher(fileName);
	                if (m.matches()) {
	                    names.add(fileName);
	                }
	            }else{
	                names.add(fileName);
	            }
	    	}
		}
	}
	return names;
}

/**
 * Put file on a remote path
 * 
 * @param protocol
 * @param username
 * @param host
 * @param password
 * @param port
 * @param remotefile absolute path for the remote put
 * @param localfile to save on remote server
 * @param connectMode
 * @param timeout
 * @throws IOException
 * @throws FTPException
 */
public static void putFile(RemoteBrowserProtocol protocol, String username,
        String host, String password, int port, String remotefile,
        String localfile, FTPConnectMode connectMode, int timeout)
        throws IOException, FTPException {
    if (RemoteBrowserProtocol.ftp.equals(protocol)) {
        // FTP put
        String remotePath = remotefile.substring(0,
                remotefile.lastIndexOf("/"));
        FTPHelperBare.putBinaryFileTo(host, localfile, cleanRoot(remotePath),
                username, password, port, WriteMode.OVERWRITE, connectMode,
                5000);
    } else if (RemoteBrowserProtocol.sftp.equals(protocol)) {
        // SFTP put
        sftpPutFile(username, host, password, port, remotefile, localfile,
                timeout);
    }else{
    	// local copy
    	copyfile(localfile, remotefile);
    }
}

/**
 * Put file on a remote path
 * 
 * @param protocol
 * @param username
 * @param host
 * @param password
 * @param port
 * @param remotefile absolute path for the remote put
 * @param localfile to save on remote server
 * @param timeout
 * @throws IOException
 */
private static void sftpPutFile(String username, String host, String password,
        int port, String remotefile, String localfile, int timeout)
        throws IOException {
    JSch jsch = new JSch();
    Session session = null;
    ChannelSftp sftpChannel = null;
    try {
        session = jsch.getSession(username, host, port);
        session.setConfig("StrictHostKeyChecking", "no");
        session.setPassword(password);
        session.setTimeout(timeout);
        session.connect();

        Channel channel = session
                .openChannel(RemoteBrowserProtocol.sftp.name());
        channel.connect();
        sftpChannel = (ChannelSftp) channel;
        sftpChannel.put(localfile, remotefile);
    } catch (Exception e) {
        throw new IOException("Error putting file", e);
    } finally {
        if (sftpChannel != null) {
            sftpChannel.exit();
        }
        if (session != null) {
            session.disconnect();
        }
    }
}

/**
 * Download a remote file to a local path
 * 
 * @param fo
 * @param localPath
 * @return File with the content
 * @throws IOException
 */
public static File downloadFile(FileObject fo, String localPath)
        throws IOException {

    // open input stream from the remote file
    BufferedInputStream is = null;
    OutputStream os = null;

    try {
        is = new BufferedInputStream(fo.getContent().getInputStream());
        // open output stream to local file
        os = new BufferedOutputStream(new FileOutputStream(localPath));
        int c;
        // do copying
        while ((c = is.read()) != -1) {
            os.write(c);
        }
    } catch (FileSystemException e) {
        throw new IOException("Can't open input stream", e);
    } finally {
        if (os != null) {
            os.close();
        }
        if (is != null) {
            is.close();
        }
    }

    return new File(localPath);
}

/**
 * Copy a local file to a target folder
 * @param originFile
 * @param targetPath
 * @return
 * @throws IOException
 */
private static File copyfile(String originFile, String targetPath) throws IOException {

	// copy to target path
	FileUtils.copyFile(new File(originFile), new File(targetPath));

    return new File(targetPath);
}

/**
 * Get URI for a remote file
 * 
 * @param protocol
 * @param userName
 * @param password
 * @param host
 * @param port
 * @param path
 * @return URI for the file
 */
public static String getURI(RemoteBrowserProtocol protocol, String userName,
        String password, String host, int port, String path) {
    String uri = protocol.name() + "://" + userName + ":" + password + "@"
            + host + ":" + port + path;
    return uri;
}

/**
 * Check if exists a file on a remote folder
 * 
 * @param serverProtocol
 * @param serverUser
 * @param serverHost
 * @param serverPWD
 * @param serverPort
 * @param path
 * @param fileName
 * @param connectMode
 * @param timeout
 * @return true if exists
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
public static boolean checkIfExists(RemoteBrowserProtocol serverProtocol,
        String serverUser, String serverHost, String serverPWD, int serverPort,
        String path, String fileName, FTPConnectMode connectMode, int timeout)
        throws IOException, FTPException, ParseException {
	
	String child = fileName;
	String parentFolder = path;
	if(fileName != null && fileName.contains(SEPARATOR)){
		if(!child.startsWith(SEPARATOR)){
			parentFolder += SEPARATOR; 
		}
		parentFolder += child.substring(0, child.lastIndexOf(SEPARATOR));
		child = child.substring(child.lastIndexOf(SEPARATOR) + 1);
	}else if (fileName == null && parentFolder.contains(SEPARATOR)){
		parentFolder = path.substring(0, path.lastIndexOf(SEPARATOR));
		child = path.substring(path.lastIndexOf(SEPARATOR) + 1);
	}

    // obtain filenames
    List<String> fileNames = RemoteBrowserUtils.ls(serverProtocol, serverUser,
            serverPWD, serverHost, serverPort, parentFolder, connectMode, timeout,
            Pattern.compile(child));

    return fileNames != null && fileNames.size() > 0;
}

/**
 * Create a new folder for a remote server in recursive mode
 * 
 * @param serverProtocol
 * @param serverUser
 * @param serverHost
 * @param serverPWD
 * @param serverPort
 * @param path
 * @param fileName
 * @param connectMode
 * @param timeout
 * @return true if create or false otherwise
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
public static boolean forceMkdir(RemoteBrowserProtocol protocol,
        String serverUser, String serverHost, String serverPWD, int serverPort,
        String path, String relativeFolder, FTPConnectMode connectMode, int timeout)
        throws IOException, FTPException, ParseException {

	String currentPath = path;
	
	for(String subFolder: relativeFolder.split(SEPARATOR)){
		if(!RemoteBrowserUtils.checkIfExists(protocol, serverUser, serverHost, serverPWD, serverPort, currentPath, subFolder, connectMode, timeout)){
			RemoteBrowserUtils.mkdir(protocol, serverUser, serverHost, serverPWD, serverPort, currentPath, subFolder, connectMode, timeout);
		}
		currentPath += SEPARATOR + subFolder;
	}
	
	return RemoteBrowserUtils.checkIfExists(protocol, serverUser, serverHost, serverPWD, serverPort, path, relativeFolder, connectMode, timeout);
}

/**
 * Create a new folder for a remote folder
 * 
 * @param serverProtocol
 * @param serverUser
 * @param serverHost
 * @param serverPWD
 * @param serverPort
 * @param path
 * @param fileName
 * @param connectMode
 * @param timeout
 * @return true if create or false otherwise
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
public static boolean mkdir(RemoteBrowserProtocol protocol,
        String serverUser, String serverHost, String serverPWD, int serverPort,
        String path, String folderName, FTPConnectMode connectMode, int timeout)
        throws IOException, FTPException, ParseException {

    if (RemoteBrowserProtocol.ftp.equals(protocol)) {
        return ftpmkdir(serverUser,
                serverPWD, serverHost, serverPort, path, connectMode, timeout, folderName);
    } else {
        return sftpmkdir(serverUser,
                serverPWD, serverHost, serverPort, path, connectMode, timeout, folderName);
    }
}

/**
 * Create a folder for a remote sftp server
 * 
 * @param serverUser
 * @param serverPWD
 * @param serverHost
 * @param serverPort
 * @param path
 * @param connectMode
 * @param timeout
 * @param folderName
 * @return
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
private static boolean sftpmkdir(String serverUser, String serverPWD,
		String serverHost, int serverPort, String path,
		FTPConnectMode connectMode, int timeout, String folderName) throws IOException, FTPException, ParseException {
    JSch jsch = new JSch();
    Session session = null;
    ChannelSftp sftpChannel = null;
    try {
        session = jsch.getSession(serverUser, serverHost, serverPort);
        session.setConfig("StrictHostKeyChecking", "no");
        session.setPassword(serverPWD);
        session.setTimeout(timeout);
        session.connect();

        Channel channel = session
                .openChannel(RemoteBrowserProtocol.sftp.name());
        channel.connect();
        sftpChannel = (ChannelSftp) channel;
        sftpChannel.mkdir(path + SEPARATOR + folderName);
    } catch (Exception e) {
        throw new IOException("Error putting file", e);
    } finally {
        if (sftpChannel != null) {
            sftpChannel.exit();
        }
        if (session != null) {
            session.disconnect();
        }
    }
	return checkIfExists(RemoteBrowserProtocol.sftp, serverUser, serverHost, serverPWD, serverPort, path, folderName, connectMode, timeout);
}

/**
 * Create a folder for a ftp server
 * 
 * @param serverUser
 * @param serverPWD
 * @param serverHost
 * @param serverPort
 * @param path
 * @param connectMode
 * @param timeout
 * @param folderName
 * @return
 * @throws IOException
 * @throws FTPException
 * @throws ParseException
 */
private static boolean ftpmkdir(String serverUser, String serverPWD,
		String serverHost, int serverPort, String path,
		FTPConnectMode connectMode, int timeout, String folderName) throws IOException, FTPException, ParseException {
	// just create the folder and check
	FTPHelperBare.createDirectory(serverHost, path + SEPARATOR + folderName, path  + SEPARATOR, serverUser, serverPWD, serverPort, FTPTransferType.BINARY, WriteMode.OVERWRITE, connectMode, timeout);
	return checkIfExists(RemoteBrowserProtocol.ftp, serverUser, serverHost, serverPWD, serverPort, path, folderName, connectMode, timeout);
}
}
