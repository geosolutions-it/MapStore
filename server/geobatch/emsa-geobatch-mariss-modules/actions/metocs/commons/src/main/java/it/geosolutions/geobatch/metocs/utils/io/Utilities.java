/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://code.google.com/p/geobatch/
 *  Copyright (C) 2007-2008-2009 GeoSolutions S.A.S.
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
package it.geosolutions.geobatch.metocs.utils.io;

import java.awt.Color;
import java.awt.image.ColorModel;
import java.awt.image.DataBuffer;
import java.awt.image.SampleModel;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.measure.unit.Unit;
import javax.media.jai.PlanarImage;
import javax.media.jai.RasterFactory;
import javax.media.jai.TiledImage;

import org.geotools.coverage.Category;
import org.geotools.coverage.CoverageFactoryFinder;
import org.geotools.coverage.GridSampleDimension;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.GridCoverageFactory;
import org.geotools.coverage.grid.io.AbstractGridCoverageWriter;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.imageio.GeoToolsWriteParams;
import org.geotools.factory.Hints;
import org.geotools.gce.geotiff.GeoTiffFormat;
import org.geotools.gce.geotiff.GeoTiffWriteParams;
import org.geotools.gce.geotiff.GeoTiffWriter;
import org.geotools.resources.i18n.Vocabulary;
import org.geotools.resources.i18n.VocabularyKeys;
import org.geotools.util.NumberRange;
import org.opengis.coverage.grid.GridCoverage;
import org.opengis.geometry.Envelope;
import org.opengis.parameter.GeneralParameterValue;
import org.opengis.parameter.ParameterValueGroup;

import ucar.ma2.DataType;

/**
 * @author Alessio
 * 
 */
public class Utilities {
    /**
     * GeoTIFF Writer Default Params
     */
    public final static String DEFAULT_GEOSERVER_VERSION = "2.x";

    protected final static Logger LOGGER = Logger.getLogger(Utilities.class.toString());

    private Utilities() {

    }

    /**
     * 
     * @param outDir
     * @param fileName
     * @param varName
     * @param userRaster
     * @param envelope
     * @param compressionType
     * @param compressionRatio
     * @param tileSize
     * @return
     * @throws IOException
     * @throws IllegalArgumentException
     */
    public static File storeCoverageAsGeoTIFF(final File outDir, final String coverageName,
            final CharSequence varName, WritableRaster userRaster, final double inNoData,
            Envelope envelope, final String compressionType, final double compressionRatio,
            final int tileSize) throws IllegalArgumentException, IOException {
        // /////////////////////////////////////////////////////////////////////
        //
        // PREPARING A WRITE
        //
        // /////////////////////////////////////////////////////////////////////
        if (LOGGER.isLoggable(Level.FINE))
            LOGGER.fine("Writing down the file in the decoded directory...");
        final GeoTiffFormat wformat = new GeoTiffFormat();
        final GeoTiffWriteParams wp = new GeoTiffWriteParams();
        if (!Double.isNaN(compressionRatio)) {
            wp.setCompressionMode(GeoTiffWriteParams.MODE_EXPLICIT);
            wp.setCompressionType(compressionType);
            wp.setCompressionQuality((float) compressionRatio);
        }
        wp.setTilingMode(GeoToolsWriteParams.MODE_EXPLICIT);
        wp.setTiling(tileSize, tileSize);
        final ParameterValueGroup wparams = wformat.getWriteParameters();
        wparams.parameter(AbstractGridFormat.GEOTOOLS_WRITE_PARAMS.getName().toString()).setValue(
                wp);

        // keep original name
        final File outFile = new File(outDir, coverageName.toString() + ".tiff");

        // /////////////////////////////////////////////////////////////////////
        //
        // ACQUIRING A WRITER AND PERFORMING A WRITE
        //
        // /////////////////////////////////////////////////////////////////////
        final Hints hints = new Hints(Hints.TILE_ENCODING, "raw");
        final GridCoverageFactory factory = CoverageFactoryFinder.getGridCoverageFactory(hints);

        final SampleModel iSampleModel = userRaster.getSampleModel();
        final ColorModel iColorModel = PlanarImage.createColorModel(iSampleModel);
        TiledImage image = new TiledImage(0, 0, userRaster.getWidth(), userRaster.getHeight(), 0,
                0, iSampleModel, iColorModel);
        image.setData(userRaster);

        Unit<?> uom = null;
        final Category nan;
        final Category values;
        if (Double.isNaN(inNoData)) {
            nan = new Category(Vocabulary.formatInternational(VocabularyKeys.NODATA), new Color(0,
                    0, 0, 0), 0);
            values = new Category("values", new Color[] { new Color(255, 0, 0, 0) }, NumberRange
                    .create(1, 255), NumberRange.create(0, 9000));

        } else {
            nan = new Category(Vocabulary.formatInternational(VocabularyKeys.NODATA),
                    new Color[] { new Color(0, 0, 0, 0) }, NumberRange.create(0, 0), NumberRange
                            .create(inNoData == 0 ? -0.000001 : inNoData, inNoData == 0 ? -0.000001 : inNoData));
            values = new Category("values", new Color[] { new Color(255, 0, 0, 0) }, NumberRange
                    .create(1, 255), NumberRange.create(inNoData + Math.abs(inNoData == 0 ? -0.000001 : inNoData) * 0.1,
                    inNoData + Math.abs(inNoData == 0 ? -0.000001 : inNoData) * 10));

        }

        // ///////////////////////////////////////////////////////////////////
        //
        // Sample dimension
        //
        //
        // ///////////////////////////////////////////////////////////////////
        final GridSampleDimension band = new GridSampleDimension(coverageName, new Category[] {
                nan, values }, uom).geophysics(true);
        final Map<String, Double> properties = new HashMap<String, Double>();
        properties.put("GC_NODATA", new Double(inNoData));

        // /////////////////////////////////////////////////////////////////////
        //
        // Coverage
        //
        // /////////////////////////////////////////////////////////////////////
        GridCoverage coverage = null;
        if (iColorModel != null)
            coverage = factory.create(varName, image, envelope, new GridSampleDimension[] { band },
                    null, properties);
        else
            coverage = factory.create(varName, userRaster, envelope,
                    new GridSampleDimension[] { band });

        final AbstractGridCoverageWriter writer = (AbstractGridCoverageWriter) new GeoTiffWriter(
                outFile);
        writer.write(coverage, (GeneralParameterValue[]) wparams.values().toArray(
                new GeneralParameterValue[1]));

        // /////////////////////////////////////////////////////////////////////
        //
        // PERFORMING FINAL CLEAN UP AFTER THE WRITE PROCESS
        //
        // /////////////////////////////////////////////////////////////////////
        writer.dispose();

        return outFile;
    }

    /**
     * 
     * @param outDir
     * @param fileName
     * @param varName
     * @param userRaster
     * @param envelope
     * @param compressionType
     * @param compressionRatio
     * @param tileSize
     * @return
     * @throws IOException
     * @throws IllegalArgumentException
     */
    public static File storeCoverageAsGeoTIFF(final File outDir, final String fileName,
            final GridCoverage2D coverage, final String compressionType,
            final double compressionRatio, final int tileSize) throws IllegalArgumentException,
            IOException {
        // /////////////////////////////////////////////////////////////////////
        //
        // PREPARING A WRITE
        //
        // /////////////////////////////////////////////////////////////////////
        if (LOGGER.isLoggable(Level.INFO))
            LOGGER.info("Writing down the file in the decoded directory...");
        final GeoTiffFormat wformat = new GeoTiffFormat();
        final GeoTiffWriteParams wp = new GeoTiffWriteParams();
        if (!Double.isNaN(compressionRatio)) {
            wp.setCompressionMode(GeoTiffWriteParams.MODE_EXPLICIT);
            wp.setCompressionType(compressionType);
            wp.setCompressionQuality((float) compressionRatio);
        }
        wp.setTilingMode(GeoToolsWriteParams.MODE_EXPLICIT);
        wp.setTiling(tileSize, tileSize);
        final ParameterValueGroup wparams = wformat.getWriteParameters();
        wparams.parameter(AbstractGridFormat.GEOTOOLS_WRITE_PARAMS.getName().toString()).setValue(
                wp);

        // keep original name
        final File outFile = new File(outDir, fileName.toString() + ".tiff");

        // /////////////////////////////////////////////////////////////////////
        //
        // ACQUIRING A WRITER AND PERFORMING A WRITE
        //
        // /////////////////////////////////////////////////////////////////////
        // final Hints hints = new Hints(Hints.TILE_ENCODING, "raw");
        final AbstractGridCoverageWriter writer = (AbstractGridCoverageWriter) new GeoTiffWriter(
                outFile);
        writer.write(coverage, (GeneralParameterValue[]) wparams.values().toArray(
                new GeneralParameterValue[1]));

        // /////////////////////////////////////////////////////////////////////
        //
        // PERFORMING FINAL CLEAN UP AFTER THE WRITE PROCESS
        //
        // /////////////////////////////////////////////////////////////////////
        writer.dispose();

        return outFile;
    }

//    /**
//     * 
//     * @param tempFile
//     * @return
//     * @throws IOException
//     */
//    public static File decompress(final String prefix, final File inputFile, final File tempFile)
//            throws IOException {
//        final File tmpDestDir = createTodayPrefixedDirectory(prefix, new File(tempFile.getParent()));
//
//        String ext = FilenameUtils.getExtension(inputFile.getName());
//
//        if (ext.equalsIgnoreCase("tar")) {
//            final TarInputStream stream = new TarInputStream(new FileInputStream(inputFile));
//            final TarEntryEnumerator entryEnum = new TarEntryEnumerator(stream);
//
//            if (stream == null) {
//                throw new IOException("Not valid archive file type.");
//            }
//
//            TarEntry entry;
//            while (entryEnum.hasMoreElements()) {
//                entry = (TarEntry) entryEnum.nextElement();
//                final String entryName = entry.getName();
//
//                if (entry.isDirectory()) {
//                    // Assume directories are stored parents first then
//                    // children.
//                    (new File(tmpDestDir, entry.getName())).mkdir();
//                    continue;
//                }
//
//                byte[] buf = new byte[(int) entry.getSize()];
//                stream.read(buf);
//
//                File newFile = new File(tmpDestDir.getAbsolutePath(), entryName);
//                FileOutputStream fos = new FileOutputStream(newFile);
//                try {
//                    saveCompressedStream(buf, fos, buf.length);
//                } catch (IOException e) {
//                    stream.close();
//                    IOException ioe = new IOException("Not valid archive file type.");
//                    ioe.initCause(e);
//                    throw ioe;
//                } finally {
//                    fos.flush();
//                    fos.close();
//                }
//            }
//            stream.close();
//
//        } else if (ext.equalsIgnoreCase("zip")) {
//            ZipFile zipFile = new ZipFile(inputFile);
//
//            Enumeration<? extends ZipEntry> entries = zipFile.entries();
//
//            while (entries.hasMoreElements()) {
//                ZipEntry entry = (ZipEntry) entries.nextElement();
//                InputStream stream = zipFile.getInputStream(entry);
//
//                if (entry.isDirectory()) {
//                    // Assume directories are stored parents first then
//                    // children.
//                    (new File(tmpDestDir, entry.getName())).mkdir();
//                    continue;
//                }
//
//                File newFile = new File(tmpDestDir, entry.getName());
//                FileOutputStream fos = new FileOutputStream(newFile);
//                try {
//                    byte[] buf = new byte[1024];
//                    int len;
//
//                    while ((len = stream.read(buf)) >= 0)
//                        saveCompressedStream(buf, fos, len);
//
//                } catch (IOException e) {
//                    zipFile.close();
//                    IOException ioe = new IOException("Not valid COAMPS archive file type.");
//                    ioe.initCause(e);
//                    throw ioe;
//                } finally {
//                    fos.flush();
//                    fos.close();
//
//                    stream.close();
//                }
//            }
//            zipFile.close();
//        }
//
//        return tmpDestDir;
//    }

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

    /**
     * Create a subDirectory having the actual date as name, within a specified destination
     * directory.
     * 
     * @param destDir
     *            the destination directory where to build the "today" directory.
     * @param inputFileName
     * @return the created directory.
     */
    public final static File createTodayDirectory(File destDir, String inputFileName) {
        return createTodayDirectory(destDir, inputFileName, false);
    }

    /**
     * Create a subDirectory having the actual date as name, within a specified destination
     * directory.
     * 
     * @param destDir
     *            the destination directory where to build the "today" directory.
     * @param inputFileName
     * @return the created directory.
     */
    public final static File createTodayDirectory(File destDir, String inputFileName,
            final boolean withTime) {
        final SimpleDateFormat SDF = withTime ? new SimpleDateFormat("yyyy_MM_dd_hhmmssSSS")
                : new SimpleDateFormat("yyyy_MM_dd");
        final String newPath = (new StringBuffer(destDir.getAbsolutePath().trim()).append(
                File.separatorChar).append(SDF.format(new Date())).append("_")
                .append(inputFileName)).toString();
        File dir = new File(newPath);
        if (!dir.exists()){
            if (dir.mkdirs()){
                return dir;
            }
            else
                return null;
        }
        return dir;
    }

    /**
     * Create a subDirectory having the actual date as name, within a specified destination
     * directory.
     * 
     * @param prefix
     * @param parent
     *            the destination directory where to build the "today" directory.
     * @return the created directory.
     */
    public static File createTodayPrefixedDirectory(final String prefix, final File parent) {
        final SimpleDateFormat SDF_HMS = new SimpleDateFormat("yyyy_MM_dd_hhmmssSSS");
        final String newPath = (new StringBuffer(parent.getAbsolutePath().trim()).append(
                File.separatorChar).append(prefix).append(File.separatorChar).append(SDF_HMS
                .format(new Date()))).toString();
        File dir = new File(newPath);
        if (!dir.exists()){
            if (dir.mkdirs()){
                return dir;
            }
            else
                return null;
        }
        return dir;
        
    }

    public static int getDataType(final DataType varDataType) {
        int dataType = DataBuffer.TYPE_UNDEFINED;
        if (varDataType == DataType.FLOAT)
            dataType = DataBuffer.TYPE_FLOAT;
        else if (varDataType == DataType.DOUBLE)
            dataType = DataBuffer.TYPE_DOUBLE;
        else if (varDataType == DataType.BYTE)
            dataType = DataBuffer.TYPE_BYTE;
        else if (varDataType == DataType.SHORT)
            dataType = DataBuffer.TYPE_SHORT;
        else if (varDataType == DataType.INT)
            dataType = DataBuffer.TYPE_INT;
        return dataType;
    }

    public static SampleModel getSampleModel(final DataType varDataType, final int width,
            final int height, final int numBands) {
        final int dataType = Utilities.getDataType(varDataType);
        return RasterFactory.createBandedSampleModel(dataType, // data type
                width, // width
                height, // height
                numBands); // num bands
    }

    /**
     * @param workingDir
     * @param inputFileName
     * @return
     */
    public static File createDirectory(File workingDir, String inputFileName) {
        File newDir = new File(workingDir, inputFileName);
        if (!newDir.exists()){
            if (newDir.mkdirs()){
                return newDir;
            }
            else
                return null;
        }
        return newDir;
    }
    
    /**
     * Reverse the order of a String array.
     * @param elements
     */
    public static void reverse(String[] elements) {
    	if (elements != null){
        	final int length = elements.length;
        	final int half = length/2;
        	String temp = "";
        	for (int i=0;i<half;i++){
        		temp = elements[i];
        		elements[i] = elements[length-1-i];
        		elements[length-1-i] = temp;
        	}
        }
	}

	public static String chainValues(String[] timePositions) {
		if (timePositions != null){
			final int size = timePositions.length;
			StringBuilder sb = new StringBuilder();
			int i = 0;
			for (; i < size - 1; i++){
				sb.append(timePositions[i]).append(",");
			}
			sb.append(timePositions[i]);
			return sb.toString();
		}
		return null;
	}

}
