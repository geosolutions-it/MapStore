/**
 * 
 */
package it.geosolutions.geobatch.action.egeos.emsa;


import java.io.IOException;
import java.io.OutputStream;
import java.util.logging.Logger;

/**
 * @author Administrator
 * @deprecated please use the gb-tools.Extract utilities
 */
public class EMSAIOUtils {

    protected final static Logger LOGGER = Logger.getLogger(EMSAIOUtils.class.toString());

    private EMSAIOUtils() {

    }

    /**
     ***********************************************
     * @param destBaseDir
     * @return
     * @throws IOException
     
    public static File unZip(final File inputFile, final File destBaseDir) throws IOException {
        final File tmpDestDir = createTodayDirectory(destBaseDir, FilenameUtils
                .getBaseName(inputFile.getName()));

        ZipFile zipFile = new ZipFile(inputFile);

        Enumeration<? extends ZipEntry> entries = zipFile.entries();

        while (entries.hasMoreElements()) {
            ZipEntry entry = (ZipEntry) entries.nextElement();
            InputStream stream = zipFile.getInputStream(entry);

            if (entry.isDirectory()) {
                // Assume directories are stored parents first then
                // children.
                (new File(tmpDestDir, entry.getName())).mkdir();
                continue;
            }

            File newFile = new File(tmpDestDir, entry.getName());
            FileOutputStream fos = new FileOutputStream(newFile);
            try {
                byte[] buf = new byte[1024];
                int len;

                while ((len = stream.read(buf)) >= 0)
                    saveCompressedStream(buf, fos, len);

            } catch (IOException e) {
                zipFile.close();
                IOException ioe = new IOException("Not valid COAMPS archive file type.");
                ioe.initCause(e);
                throw ioe;
            } finally {
                fos.flush();
                fos.close();

                stream.close();
            }
        }
        zipFile.close();

        return tmpDestDir;
    }
*/
    /***************************************************************************************
     * 
     * @param destBaseDir
     * @return
     * @throws IOException
     
    public static File unTar(final File inputFile, final File destBaseDir) throws IOException {
        final File tmpDestDir = createTodayDirectory(destBaseDir, FilenameUtils
                .getBaseName(inputFile.getName()));
        TarInputStream stream = null;
        try {
            stream = new TarInputStream(new FileInputStream(inputFile));
        }
        catch(IOException ioe){
            throw ioe;
        }
        finally{
            if (stream == null) {
                throw new IOException("Not valid archive file type.");
            }
        }

        TarEntry entry;
        while ((entry = stream.getNextEntry()) != null) {
            final String entryName = entry.getName();

            if (entry.isDirectory()) {
                // Assume directories are stored parents first then
                // children.
                (new File(tmpDestDir, entry.getName())).mkdir();
                continue;
            }

            byte[] buf = new byte[(int) entry.getSize()];
            stream.read(buf);

            File newFile = new File(tmpDestDir.getAbsolutePath(), entryName);
            FileOutputStream fos = new FileOutputStream(newFile);
            try {
                saveCompressedStream(buf, fos, buf.length);
            } catch (IOException e) {
                stream.close();
                IOException ioe = new IOException("Not valid archive file type.");
                ioe.initCause(e);
                throw ioe;
            } finally {
                fos.flush();
                fos.close();
            }
        }
        stream.close();

        return tmpDestDir;
    }
    */
//
//    /**
//     * 
//     * @param destDir
//     * @return
//     * @throws IOException
//     */
//    public static File unTarGz(final File inputFile, final File destDir) throws IOException {
//        File unzippedDir = unZip(inputFile, destDir);
//
//        if (unzippedDir != null && unzippedDir.exists() && unzippedDir.isDirectory()) {
//
//            File[] tarFiles = unzippedDir.listFiles(new FilenameFilter() {
//
//                public boolean accept(File dir, String name) {
//                    if (FilenameUtils.getExtension(name).equalsIgnoreCase("tar"))
//                        return true;
//                    return false;
//                }
//            });
//
//            if (tarFiles != null && tarFiles.length > 0) {
//                if (tarFiles.length == 1) {
//                    return unTar(tarFiles[0], destDir);
//                } else {
//                    for (File tarFile : tarFiles)
//                        unTar(tarFile, destDir);
//                }
//
//                return destDir;
//            }
//        }
//
//        throw new IOException(
//                "::decompressTarGz : could not find any valid tar file to decompress.");
//    }

    /**
     * Calling tar -xzf from command line
     * 
     * @return
     * @deprecated use gb-tools
     
    public static File unTarGzTaskExec(final File inputFile, final File destDir) throws IOException {
        final File tmpDestDir = createTodayDirectory(destDir, FilenameUtils.getBaseName(inputFile
                .getName()));

        final Project project = new Project();
        project.init();

        final ExecTask execTask = new ExecTask();
        execTask.setProject(project);

        // Setting execution directory
        execTask.setDir(tmpDestDir);

        // Setting executable
        execTask.setExecutable("tar");

        // Setting Error logging
        execTask.setLogError(true);
        // execTask.setError(error);
        execTask.setFailonerror(true);

        // Setting the timeout
        execTask.setTimeout(1200000);

        // Setting command line argument
        final String argument = " -xzf " + inputFile.getAbsolutePath();
        execTask.createArg().setLine(argument);

        // Executing
        execTask.execute();

        return tmpDestDir;
    }
*/
    
    /**
     * @param len
     * @param stream
     * @param fos
     * @return
     * @throws IOException
     */
    public static void saveCompressedStream(final byte[] buffer, final OutputStream out,
            final int len) throws IOException {
        try {
            out.write(buffer, 0, len);

        } catch (Exception e) {
            out.flush();
            out.close();
            IOException ioe = new IOException("Not valid archive file type.");
            ioe.initCause(e);
            throw ioe;
        }
    }
}
