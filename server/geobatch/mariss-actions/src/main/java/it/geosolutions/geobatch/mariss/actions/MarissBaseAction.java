package it.geosolutions.geobatch.mariss.actions;

import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.flow.event.action.BaseAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationUtils;
import it.geosolutions.geobatch.mariss.actions.netcdf.IngestionActionConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.NetCDFAction;
import it.geosolutions.geobatch.mariss.actions.netcdf.ShipDetection;
import it.geosolutions.geobatch.mariss.actions.netcdf.NetCDFAction.SARType;

import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.EventObject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.commons.io.filefilter.IOFileFilter;
import org.apache.commons.io.filefilter.RegexFileFilter;
import org.geotools.geometry.GeneralEnvelope;
import org.geotools.jdbc.JDBCDataStore;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.QNameMap;
import com.thoughtworks.xstream.io.xml.StaxDriver;
import com.thoughtworks.xstream.mapper.MapperWrapper;

import ucar.nc2.Variable;

/**
 * Base Class with common method common all actions for mariss netcdf and geotiff
 * 
 * TODO: many of the methods in this class can be placed in a Utility class.
 * 
 * @author Lorenzo Natali, GeoSolutions
 *
 */
public abstract class MarissBaseAction extends BaseAction<EventObject> {
	
	 /**
     * a container for ingested element attribute
     */
    public static class AttributeBean {

        public Map<String, Variable> foundVariables = new HashMap<String, Variable>();

        public Map<String, String> foundVariableLongNames = new HashMap<String, String>();

        public Map<String, String> foundVariableBriefNames = new HashMap<String, String>();

        public Map<String, String> foundVariableUoM = new HashMap<String, String>();

        public Date timedim;

        public SARType type;

        public GeneralEnvelope env;

        public String absolutePath;

        public String identifier;

        public JDBCDataStore dataStore;

        public boolean maskOneIsValid;

        public int numShipDetections;
        
        public int numOilSpills;
    }
	protected IngestionActionConfiguration configuration;
	protected ConfigurationContainer container;

	/**
	 * Constructor. TODO check the proper configuration needed
	 * @param actionConfiguration
	 */
	public MarissBaseAction(IngestionActionConfiguration actionConfiguration) {
		super(actionConfiguration);
		configuration = actionConfiguration;
		ConfigurationContainer container = actionConfiguration.getContainer();
		if (container == null
				|| container.getParams() == null
				|| !container.getParams().containsKey(
						ConfigurationUtils.NETCDF_DIRECTORY_KEY)) {
			throw new RuntimeException("Wrong configuration defined");
		} else {
			this.container = container;
		}
	}

	/**
	 * Create datastore file
	 * 
	 * @param mosaicDir
	 * @param varName
	 * @throws IOException
	 */
	protected void createDatastoreFile(File mosaicDir, String varName)
			throws IOException {
		Map<String, Serializable> dsParams = configuration.getOutputFeature()
				.getDataStore();

		// ---
		final String host = (String) dsParams.get("host");
		final String port = (String) dsParams.get("port");
		final String database = (String) dsParams.get("database");
		final String schema = (String) dsParams.get("schema");
		final String user = (String) dsParams.get("user");
		final String passwd = (String) dsParams.get("passwd");
		// ---
		File datastore = new File(mosaicDir, "datastore.properties");
		datastore.createNewFile();
		String properties = "user=" + user + "\n" + "port=" + port + "\n"
				+ "passwd=" + passwd + "\n" + "host=" + host + "\n"
				+ "database=" + database + "\n"
				+ "driver=org.postgresql.Driver\n" + "schema=" + schema + "\n"
				+ "Estimated\\ extends=false\n"
				+ "SPI=org.geotools.data.postgis.PostgisNGDataStoreFactory";
		FileUtils.write(datastore, properties);
	}
	
	/**
	 * Create the indexer file for a mosaic
	 * @param mosaicDir
	 * @param varName
	 * @param serviceName
	 * @param additionalDimensions
	 * @throws IOException
	 */
	protected void createIndexerFile(File mosaicDir, String varName, String serviceName,
            Map<String, String> additionalDimensions) throws IOException {
        File indexer = new File(mosaicDir, "indexer.properties");
        indexer.createNewFile();

        String schema = "*the_geom:Polygon,location:String,time:java.util.Date,service:String,identifier:String";
        String propertyCollectors = "StringFileNameExtractorSPI[serviceregex](service),StringFileNameExtractorSPI[identifierregex](identifier)";

        if (additionalDimensions != null && additionalDimensions.size() > 0) {
            for (Entry<String, String> entry : additionalDimensions.entrySet()) {
                schema += "," + entry.getKey() + ":String";
                propertyCollectors += ",StringFileNameExtractorSPI[" + entry.getKey() + "regex]("
                        + entry.getKey() + ")";
            }
        }

//        String properties = "TimeAttribute=time\n" + "Schema=" + schema + "\n"
//                + "PropertyCollectors=" + propertyCollectors;
        String properties = "Schema=" + schema + "\n"
              + "PropertyCollectors=" + propertyCollectors;
        FileUtils.write(indexer, properties);
    }
	
	protected File untarFile(File inputFile) throws ActionException {
        // Getting file base name without extension
        String fileName = FilenameUtils.getBaseName(inputFile.getName());
        final File outputFile = new File(getTempDir(), fileName);
        // Getting the stream
        GZIPInputStream in = null;
        FileOutputStream out = null;
        try {
            in = new GZIPInputStream(new FileInputStream(inputFile));
            out = new FileOutputStream(outputFile);
            IOUtils.copy(in, out);
        } catch (IOException e) {
            throw new ActionException(MarissBaseAction.class, e.getLocalizedMessage());
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }
        // Create another temporary Directory for the tar file
        File finalDir = new File(getTempDir(), fileName + "dir");

        extractTar(outputFile, finalDir);

        return finalDir;
    }
	/**
	 * Unzip a zip archive
	 * @param inputFile the archive
	 * @return the directory where the file is unzipped
	 * @throws ActionException
	 */
	protected File unzipFile(File inputFile) throws ActionException {
        // Getting file base name without extension
        String fileName = FilenameUtils.getBaseName(inputFile.getName());
        final File outputFile = new File(getTempDir(), fileName);
        // Getting the stream
        FileInputStream in = null;
        FileOutputStream out = null;
        try {
            in = new FileInputStream(inputFile);
            out = new FileOutputStream(outputFile);
            IOUtils.copy(in, out);
        } catch (IOException e) {
            throw new ActionException(MarissBaseAction.class, e.getLocalizedMessage());
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }
        // Create another temporary Directory for the tar file
        File finalDir = new File(getTempDir(), fileName + "dir");

        extractZip(outputFile, finalDir);

        return finalDir;
    }
	
	/**
	 * Extract an archive into a directory
	 * @param outputFile the file to read
	 * @param finalDir the directory where unzip to
	 * @throws ActionException
	 */
	protected void extractZip(final File outputFile, File finalDir)
			throws ActionException {
		// Extracting the tar file
        ZipArchiveInputStream zipStream = null;
        try {
            // Create the final directory
            FileUtils.forceMkdir(finalDir);
            zipStream = new ZipArchiveInputStream(new FileInputStream(outputFile));
            // Accessing the entries
            ArchiveEntry entry = zipStream.getNextEntry();

            do {
                int offset = 0;
                byte[] content = new byte[(int) entry.getSize()];
                int byteRead = 0;
                while (offset < content.length && byteRead != -1) {
                    byteRead = zipStream.read(content, offset, content.length - offset);
                    offset += byteRead;
                }

                // Writing Entry to file
                String entryName = entry.getName();

                File f = new File(finalDir, entryName);
                FileUtils.writeByteArrayToFile(f, content);
                entry = zipStream.getNextEntry();
            } while (entry != null);
        } catch (FileNotFoundException e) {
            throw new ActionException(MarissBaseAction.class, e.getLocalizedMessage());
        } catch (IOException e) {
            throw new ActionException(MarissBaseAction.class, e.getLocalizedMessage());
        } finally {
            if (zipStream != null) {
                try {
                    zipStream.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }
	}
	
	/**
	 * Extract a archive into a directory
	 * @param outputFile the file to read
	 * @param finalDir the directory where write to
	 * @throws ActionException
	 */
	protected void extractTar(final File outputFile, File finalDir)
			throws ActionException {
		// Extracting the tar file
        TarArchiveInputStream tarStream = null;
        try {
            // Create the final directory
            FileUtils.forceMkdir(finalDir);
            tarStream = new TarArchiveInputStream(new FileInputStream(outputFile));
            // Accessing the entries
            ArchiveEntry entry = tarStream.getNextEntry();

            do {
                int offset = 0;
                byte[] content = new byte[(int) entry.getSize()];
                int byteRead = 0;
                while (offset < content.length && byteRead != -1) {
                    byteRead = tarStream.read(content, offset, content.length - offset);
                    offset += byteRead;
                }

                // Writing Entry to file
                String entryName = entry.getName();

                File f = new File(finalDir, entryName);
                FileUtils.writeByteArrayToFile(f, content);
                entry = tarStream.getNextEntry();
            } while (entry != null);
        } catch (FileNotFoundException e) {
            throw new ActionException(MarissBaseAction.class, e.getLocalizedMessage());
        } catch (IOException e) {
            throw new ActionException(MarissBaseAction.class, e.getLocalizedMessage());
        } finally {
            if (tarStream != null) {
                try {
                    tarStream.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }
	}
	
	/**
     * Private method for zipping an array of files
     * 
     * @param temp
     * @param files
     * @param filename
     * @return
     * @throws ActionException
     */
    protected File zipAll(File temp, File[] files, String filename) throws ActionException {
        File zippedFile = new File(temp, filename + ".zip");
        FileOutputStream fos = null;
        ZipOutputStream zos = null;
        try {
            // Create the new file
            zippedFile.createNewFile();

            // create byte buffer
            byte[] buffer = new byte[1024];
            // Open the stream
            fos = new FileOutputStream(zippedFile);
            zos = new ZipOutputStream(fos);
            // Loop on the array
            for (int i = 0; i < files.length; i++) {
                FileInputStream fis = null;
                try {
                    fis = new FileInputStream(files[i]);
                    // begin writing a new ZIP entry, positions the stream to the start of the entry data
                    zos.putNextEntry(new ZipEntry(files[i].getName()));
                    int length;

                    while ((length = fis.read(buffer)) > 0) {
                        zos.write(buffer, 0, length);
                    }
                    zos.closeEntry();
                } catch (Exception e) {
                    throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
                } finally {
                    if (fis != null) {
                        // close the ZipOutputStream
                        try {
                            fis.close();
                        } catch (Exception e) {
                            LOGGER.error(e.getLocalizedMessage());
                        }
                    }
                }
            }
            zos.finish();
        } catch (Exception e) {
            throw new ActionException(NetCDFAction.class, e.getLocalizedMessage());
        } finally {
            if (fos != null) {
                // close the ZipOutputStream
                try {
                    fos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
            if (zos != null) {
                // close the ZipOutputStream
                try {
                    zos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
        }

        return zippedFile;
    }

    /**
     * Zip a list of file into one zip file.
     * 
     * @param files files to zip
     * @param targetZipFile target zip file
     * @throws IOException IO error exception can be thrown when copying ...
     */
    protected void zipFile(final File[] files, final File targetZipFile) throws IOException {
        FileOutputStream fos = null;
        ZipOutputStream zos = null;
        try {
            fos = new FileOutputStream(targetZipFile);
            zos = new ZipOutputStream(fos);
            byte[] buffer = new byte[128];
            for (int i = 0; i < files.length; i++) {
                File currentFile = files[i];
                if (!currentFile.isDirectory()) {
                    ZipEntry entry = new ZipEntry(currentFile.getName());
                    FileInputStream fis = null;
                    try {
                        fis = new FileInputStream(currentFile);
                        zos.putNextEntry(entry);
                        int read = 0;
                        while ((read = fis.read(buffer)) != -1) {
                            zos.write(buffer, 0, read);
                        }
                    } catch (Exception e) {
                        LOGGER.error(e.getMessage());
                    } finally {
                        if (fis != null) {
                            try {
                                fis.close();
                            } catch (Exception e) {
                                LOGGER.error(e.getMessage());
                            }
                        }
                        if (zos != null) {
                            try {
                                zos.closeEntry();
                            } catch (Exception e) {
                                LOGGER.error(e.getMessage());
                            }
                        }
                    }
                }
            }
        } catch (FileNotFoundException e) {
            LOGGER.error("File not found : " + e);
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getMessage());
                }
            }
            if (zos != null) {
                try {
                    zos.close();
                } catch (Exception e) {
                    LOGGER.error(e.getMessage());
                }
            }
        }
    }
    
    /**
     * Method that gets the ship detection from the directory
     * @param attributeBean the attributebean to populate
     * @param dir the directory
     * @return
     */
	protected File[] getShipDetections(AttributeBean attributeBean, File dir) {

		IOFileFilter file = FileFilterUtils.fileFileFilter();
		IOFileFilter xml = FileFilterUtils.suffixFileFilter("xml");
		IOFileFilter dsFilter = new RegexFileFilter(".*_DS.*");
		FileFilter and = FileFilterUtils.and(file, xml, dsFilter);
		File[] files = dir.listFiles(and);

		attributeBean.numShipDetections = (files != null ? files.length : 0);
		return files;
	}
	
	/**
     * Read ship detection from the list of files provided
     * @param files the xml files with ship detections
     * @return
     */
	protected List<ShipDetection> readShipDetections(File[] files) {
		QNameMap qmap = new QNameMap();
		qmap.setDefaultNamespace("http://ignore.namespace/prefix");
		qmap.setDefaultPrefix("");
		StaxDriver staxDriver = new StaxDriver(qmap); 
		XStream xstream = new XStream(staxDriver){
		    @Override
		    protected MapperWrapper wrapMapper(MapperWrapper next) {
		        return new MapperWrapper(next) {
		            @Override
		            public boolean shouldSerializeMember(Class definedIn, String fieldName) {
		                if (definedIn == Object.class) {
		                    return false;
		                }
		                return super.shouldSerializeMember(definedIn, fieldName);
		            }
		        };
		    }
		};
		
		xstream.processAnnotations(ShipDetection.class);     // inform XStream to parse annotations in Data 
		
		List<ShipDetection> shipDetections = new ArrayList<ShipDetection>();
		
		for (File fileDsXml : files) {
		    try {
		        ShipDetection shpDs = (ShipDetection) xstream.fromXML(fileDsXml);
		        
		        shipDetections.add(shpDs);
		        
		    } catch (Exception e) {
		        LOGGER.warn(e.getMessage(), e);
		    }
		    
		}
		return shipDetections;
	}

}
