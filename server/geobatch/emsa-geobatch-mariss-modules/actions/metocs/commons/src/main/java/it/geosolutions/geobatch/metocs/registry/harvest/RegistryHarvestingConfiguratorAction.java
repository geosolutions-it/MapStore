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
package it.geosolutions.geobatch.metocs.registry.harvest;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.catalog.file.FileBaseCatalog;
import it.geosolutions.geobatch.flow.event.IProgressListener;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.global.CatalogHolder;
import it.geosolutions.geobatch.metocs.jaxb.model.MetocElementType;
import it.geosolutions.geobatch.metocs.jaxb.model.Metocs;
import it.geosolutions.geobatch.metocs.registry.RegistryActionConfiguration;
import it.geosolutions.geobatch.metocs.registry.RegistryConfiguratorAction;
import it.geosolutions.geobatch.metocs.utils.io.METOCSActionsIOUtils;
import it.geosolutions.geobatch.metocs.utils.io.Utilities;
import it.geosolutions.geobatch.metocs.utils.io.rest.PublishingRestletGlobalConfig;
import it.geosolutions.tools.commons.file.Path;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Properties;
import java.util.Queue;
import java.util.TimeZone;
import java.util.UUID;
import java.util.logging.Level;

import javax.media.jai.JAI;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.io.FilenameUtils;
import org.geotools.coverage.grid.GridEnvelope2D;
import org.geotools.coverage.grid.GridGeometry2D;
import org.geotools.coverage.grid.io.AbstractGridCoverage2DReader;
import org.geotools.coverage.grid.io.AbstractGridFormat;
import org.geotools.coverage.grid.io.GridFormatFinder;
import org.geotools.geometry.GeneralEnvelope;
import org.geotools.referencing.CRS;
import org.geotools.referencing.operation.LinearTransform;
import org.opengis.coverage.grid.Format;
import org.opengis.coverage.grid.GridEnvelope;
import org.opengis.coverage.grid.GridGeometry;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.datum.PixelInCell;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.Matrix;

/**
 * 
 * TODO: DOCUMENT ME !!
 * 
 */
public class RegistryHarvestingConfiguratorAction extends RegistryConfiguratorAction {

    /**
     * GeoTIFF Writer Default Params
     */
    public final static String GEOSERVER_VERSION = "2.x";

    protected RegistryHarvestingConfiguratorAction(RegistryActionConfiguration configuration)
            throws IOException {
        super(configuration);
    }

    /**
     * EXECUTE METHOD
     */
    public Queue<FileSystemEvent> execute(Queue<FileSystemEvent> events)
            throws ActionException {

        if (LOGGER.isLoggable(Level.INFO))
            LOGGER.info("Starting with processing...");

        try {
            // looking for file
            if (events.size() == 0)
                throw new IllegalArgumentException("Wrong number of elements for this action: "
                        + events.size());

            List<FileSystemEvent> generatedEvents = new ArrayList<FileSystemEvent>();

            while (events.size() > 0) {
                FileSystemEvent event = events.remove();

                // //
                // data flow configuration and dataStore name must not be null.
                // //
                if (configuration == null) {
                    LOGGER.log(Level.SEVERE, "DataFlowConfig is null.");
                    throw new IllegalStateException("DataFlowConfig is null.");
                }
                // ////////////////////////////////////////////////////////////////////
                //
                // Initializing input variables
                //
                // ////////////////////////////////////////////////////////////////////
                final File workingDir = Path
                        .findLocation(configuration.getWorkingDirectory(), 
                                ((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory());

                // ////////////////////////////////////////////////////////////////////
                //
                // Checking input files.
                //
                // ////////////////////////////////////////////////////////////////////
                if ((workingDir == null) || !workingDir.exists() || !workingDir.isDirectory()) {
                    LOGGER.log(Level.SEVERE, "WorkingDirectory is null or does not exist.");
                    throw new IllegalStateException("WorkingDirectory is null or does not exist.");
                }

                // ... BUSINESS LOGIC ... //
                final File inputFile = event.getSource();
                String inputFileName = inputFile.getAbsolutePath();
                final String filePrefix = FilenameUtils.getBaseName(inputFileName);
                final String fileSuffix = FilenameUtils.getExtension(inputFileName);
                final String fileNameFilter = getConfiguration().getStoreFilePrefix();

                String baseFileName = null;

                if (fileNameFilter != null) {
                    if ((filePrefix.equals(fileNameFilter) || filePrefix.matches(fileNameFilter))
                            && "layer".equalsIgnoreCase(fileSuffix)) {
                        // etj: are we missing something here?
                        baseFileName = filePrefix;
                    }
                } else if ("layer".equalsIgnoreCase(fileSuffix)) {
                    baseFileName = filePrefix;
                }

                if (baseFileName == null) {
                    LOGGER.log(Level.SEVERE, "Unexpected file '" + inputFileName + "'");
                    throw new IllegalStateException("Unexpected file '" + inputFileName + "'");
                }

                Properties props = new Properties();

                // try retrieve data from file
                try {
                    props.load(new FileInputStream(inputFile));
                }

                // catch exception in case properties file does not exist
                catch (IOException e) {
                    LOGGER.log(Level.SEVERE, e.getLocalizedMessage(), e);
                }

                final String namespace = props.getProperty("namespace");
                final String metocFields = props.getProperty("metocFields");
                final String storeid = props.getProperty("storeid");
                final String layerid = props.getProperty("layerid");
                final String driver = props.getProperty("driver");
                final String path = new File(inputFile.getParentFile(), props.getProperty("path"))
                        .getAbsolutePath();

                final File metadataTemplate = Path.findLocation(configuration
                        .getMetocHarvesterXMLTemplatePath(), 
                        ((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory());

                boolean res = harvest(new File(PublishingRestletGlobalConfig.getRootDirectory()),
                        new File(path), metadataTemplate, driver, configuration.getGeoserverURL(),
                        configuration.getRegistryURL(), configuration.getProviderURL(), new Date()
                                .getTime(), namespace, metocFields, layerid, "DOWN");

                if (res) {
                    // forwarding to the next Action
                    LOGGER.info("RegistryHarvestingAction ... forwarding to the next Action: "
                            + inputFile.getAbsolutePath());
                    generatedEvents.add(new FileSystemEvent(inputFile,
                            FileSystemEventType.FILE_ADDED));
                }
            }

            if (generatedEvents != null)
                events.addAll(generatedEvents);
            return events;
        } catch (Throwable t) {
            LOGGER.log(Level.SEVERE, t.getLocalizedMessage(), t);
            JAI.getDefaultInstance().getTileCache().flush();
            return null;
        } finally {
            JAI.getDefaultInstance().getTileCache().flush();
        }
    }

    /**
     * 
     * @param outDir
     * @param sourceFile
     * @param metadataTemplate
     * @param sourceFileType
     * @param geoserverURL
     * @param registryURL
     * @param providerURL
     * @param timestamp
     * @param namespace
     * @param metocFields
     * @param coverageName
     * @param zOrder
     * @return
     * @throws JAXBException
     * @throws IOException
     * @throws FactoryException
     * @throws ParseException
     */
    public boolean harvest(final File outDir, final File sourceFile, final File metadataTemplate,
            final String sourceFileType, final String geoserverURL, final String registryURL,
            final String providerURL, final long timestamp, final String namespace,
            final String metocFields, final String coverageName, final String zOrder)
            throws JAXBException, IOException, FactoryException, ParseException {
        // CoverageName Format:
        // CRUISEEXP_MODELNAME-MODELTYPE_VARNAME(-u/v/mag/dir)_ZLEV_BASETIMEYYYYMMDD_BASETIMEHHHMMSS_FCSTTIMEYYYYMMDD_FCSTTIMEHHHMMSS_TAU

        // Grabbing the Variables Dictionary
        JAXBContext context = JAXBContext.newInstance(Metocs.class);
        Unmarshaller um = context.createUnmarshaller();

        File metocDictionaryFile = Path.findLocation(configuration.getMetocDictionaryPath(),
                ((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory());
        Metocs metocDictionary = (Metocs) um.unmarshal(new FileReader(metocDictionaryFile));

        // reading GeoTIFF file
        final AbstractGridCoverage2DReader reader = ((AbstractGridFormat) acquireFormat(sourceFileType))
                .getReader(sourceFile.toURI().toURL());
        final CoordinateReferenceSystem crs = reader.getCrs();
        final String srsId = CRS.lookupIdentifier(crs, false);
        final GeneralEnvelope envelope = reader.getOriginalEnvelope();
        final GridGeometry originalGrid = new GridGeometry2D(reader.getOriginalGridRange(), reader
                .getOriginalGridToWorld(PixelInCell.CELL_CENTER), reader.getCrs());
        final GridEnvelope2D range = (GridEnvelope2D) ((GridGeometry2D) originalGrid)
                .getGridRange();
        final MathTransform gridToCRS = originalGrid.getGridToCRS();
        final LinearTransform tx = (LinearTransform) gridToCRS;
        final Matrix matrix = tx.getMatrix();

        final String[] metocFieldsParts = metocFields.split("_");

        final String[] metadataNames = reader.getMetadataNames();

        boolean res = false;

        String timeMetadata = null;
        String elevationMetadata = null;
        if (metadataNames != null && metadataNames.length > 0) {
            // TIME DIMENSION
            timeMetadata = reader.getMetadataValue("TIME_DOMAIN");

            // ELEVATION DIMENSION
            elevationMetadata = reader.getMetadataValue("ELEVATION_DOMAIN");

        }

        String[] timePositions = null;
        String[] elevationLevels = null;
        if (timeMetadata != null) {
            timePositions = timeMetadata.split(",");
            Utilities.reverse(timePositions);
            // LOGGER.info("timeMetadata -----------> " + timePositions);
        }

        if (elevationMetadata != null) {
            elevationLevels = elevationMetadata.split(",");
            // LOGGER.info("elevationMetadata -----------> " + elevationLevels);
        }

        // final int cols = (timePositions != null ? timePositions.length : 1);
        // final int rows = (elevationLevels != null ? elevationLevels.length :
        // 1);

        // <FOR>
        // for (int col = 0; col < cols; col++) {
        // for (int row = 0; row < rows; row++) {
        // // LOGGER.info("Harvesting -----------> ["+col+","+row+"]");
        //
        // final String timePosition = (timePositions != null ?
        // timePositions[col]
        // : null);
        // final String elevation = (elevationLevels != null ?
        // elevationLevels[row]
        // : null);
        final String fileName = coverageName
        // + (timePosition != null ? "-"
                // + timePosition.replaceAll(":", "") : "")
                // + (elevation != null ? "-" + elevation : "") + ".xml";
                + ".xml";

        readWriteMetadata(outDir, fileName, metadataTemplate, timestamp, namespace, coverageName,
                zOrder, metocDictionary, srsId, envelope, range, matrix, metocFieldsParts, /* timePosition */
                null, /* elevation */null, timePositions, elevationLevels);

        try {
            res = METOCSActionsIOUtils.sendHarvestRequest(registryURL, providerURL, fileName);
        } catch (Exception e) {
            res = false;
        }
        //
        // // if (!res) {
        // // break;
        // // }
        // }
        // }
        // </FOR>

        reader.dispose();

        return res;
    }

    

	/**
     * @param outDir
     * @param metadataTemplate
     * @param timestamp
     * @param namespace
     * @param coverageName
     * @param zOrder
     * @param metocDictionary
     * @param srsId
     * @param envelope
     * @param range
     * @param matrix
     * @param metocFields
     * @param fileName
     * @throws FileNotFoundException
     * @throws IOException
     * @throws IndexOutOfBoundsException
     * @throws ParseException
     * @throws NumberFormatException
     */
    private void readWriteMetadata(final File outDir, final String fileName,
            final File metadataTemplate, final long timestamp, final String namespace,
            final String coverageName, final String zOrder, final Metocs metocDictionary,
            final String srsId, final GeneralEnvelope envelope, final GridEnvelope range,
            final Matrix matrix, final String[] metocFields, final String timePosition,
            final String elevation, final String[] timePositions, final String[] elevationLevels)
            throws FileNotFoundException, IOException, IndexOutOfBoundsException, ParseException,
            NumberFormatException {
        // Read/Write Metadata
        final File outFile = new File(outDir, fileName);

        // Create FileReader Object
        FileReader inputFileReader = new FileReader(metadataTemplate);
        FileWriter outputFileWriter = new FileWriter(outFile);

        try {

            // Create Buffered/PrintWriter Objects
            BufferedReader inputStream = new BufferedReader(inputFileReader);
            PrintWriter outputStream = new PrintWriter(outputFileWriter);

            String inLine = null;
            // final SimpleDateFormat sdf = new
            // SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
            final SimpleDateFormat sdfMetadata = new SimpleDateFormat(
                    "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            sdfMetadata.setTimeZone(TimeZone.getTimeZone("GMT+0"));
            final SimpleDateFormat sdfMetoc = new SimpleDateFormat("yyyyMMdd'T'HHmmssSSS'Z'");
            sdfMetoc.setTimeZone(TimeZone.getTimeZone("GMT+0"));

            while ((inLine = inputStream.readLine()) != null) {
                // Handle KeyWords

                /** GENERAL **/
                if (inLine.contains("#UUID#")) {
                    inLine = inLine.replaceAll("#UUID#", "urn:uuid:" + UUID.randomUUID()
                            + ":ISO19139");
                }

                if (inLine.contains("#CREATION_DATE#")) {
                    inLine = inLine.replaceAll("#CREATION_DATE#", sdfMetadata.format(new Date(
                            timestamp)));
                }

                if (inLine.contains("#CRUISE_OR_EXP#")) {
                    inLine = inLine.replaceAll("#CRUISE_OR_EXP#", metocFields[0]);
                }

                if (inLine.contains("#SPATAL_REPR_TYPE#")) {
                    inLine = inLine.replaceAll("#SPATAL_REPR_TYPE#", "grid");
                }

                /** SRS **/
                if (inLine.contains("#SRS_CODE#")) {
                    inLine = inLine.replaceAll("#SRS_CODE#", srsId
                            .substring(srsId.indexOf(":") + 1));
                }

                if (inLine.contains("#SRS_AUTORITY#")) {
                    inLine = inLine.replaceAll("#SRS_AUTORITY#", srsId.substring(0, srsId
                            .indexOf(":")));
                }

                /** OGC SERVICES **/
                if (inLine.contains("#LAYER_NAME#")) {
                    inLine = inLine.replaceAll("#LAYER_NAME#", namespace + ":" + coverageName);
                }

                if (inLine.contains("#WCS_URL#")) {
                    final StringBuilder wcsURL = new StringBuilder(getConfiguration()
                            .getGeoserverURL());
                    wcsURL.append("/ows?");
                    inLine = inLine.replaceAll("#WCS_URL#", wcsURL.toString());
                }

                if (inLine.contains("#WMS_URL#")) {
                    final StringBuilder wmsURL = new StringBuilder(getConfiguration()
                            .getGeoserverURL());
                    wmsURL.append("/ows?");
                    inLine = inLine.replaceAll("#WMS_URL#", wmsURL.toString());
                }

                if (inLine.contains("#OWS_URL#")) {
                    final StringBuilder owsURL = new StringBuilder(getConfiguration()
                            .getGeoserverURL());
                    owsURL.append("/ows?");
                    inLine = inLine.replaceAll("#OWS_URL#", owsURL.toString());
                }

                if (inLine.contains("#WCS_GETCOVERAGE#")) {
                    final StringBuilder wcsGetCoverage = new StringBuilder(getConfiguration()
                            .getGeoserverURL());
                    wcsGetCoverage
                            .append("/ows?SERVICE=WCS&amp;VERSION=1.0.0&amp;REQUEST=GetCoverage");
                    wcsGetCoverage.append("&amp;BBOX=").append(
                            envelope.getLowerCorner().getOrdinate(0)).append(",").append(
                            envelope.getLowerCorner().getOrdinate(1)).append(",").append(
                            envelope.getUpperCorner().getOrdinate(0)).append(",").append(
                            envelope.getUpperCorner().getOrdinate(1));
                    wcsGetCoverage.append("&amp;FORMAT=geotiff");
                    wcsGetCoverage.append("&amp;COVERAGE=").append(namespace + ":" + coverageName);
                    wcsGetCoverage.append("&amp;WIDTH=").append(range.getSpan(0));
                    wcsGetCoverage.append("&amp;HEIGHT=").append(range.getSpan(1));
                    wcsGetCoverage.append("&amp;CRS=").append(srsId);
                    if (timePosition != null)
                        wcsGetCoverage.append("&amp;TIME=").append(timePosition);
                    if (elevation != null)
                        wcsGetCoverage.append("&amp;ELEVATION=").append(elevation);

                    inLine = inLine.replaceAll("#WCS_GETCOVERAGE#", wcsGetCoverage.toString());
                }

                if (inLine.contains("#WMS_GETMAP#")) {
                    final StringBuilder wmsGetMap = new StringBuilder(getConfiguration()
                            .getGeoserverURL());
                    wmsGetMap.append("/ows?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap");
                    wmsGetMap.append("&amp;BBOX=").append(envelope.getLowerCorner().getOrdinate(0))
                            .append(",").append(envelope.getLowerCorner().getOrdinate(1)).append(
                                    ",").append(envelope.getUpperCorner().getOrdinate(0)).append(
                                    ",").append(envelope.getUpperCorner().getOrdinate(1));
                    wmsGetMap.append("&amp;STYLES=");
                    wmsGetMap.append("&amp;FORMAT=image/png");
                    wmsGetMap.append("&amp;LAYERS=").append(namespace + ":" + coverageName);
                    wmsGetMap.append("&amp;WIDTH=").append(range.getSpan(0));
                    wmsGetMap.append("&amp;HEIGHT=").append(range.getSpan(1));
                    wmsGetMap.append("&amp;SRS=").append(srsId);
                    if (timePosition != null)
                        wmsGetMap.append("&amp;TIME=").append(timePosition);
                    if (elevation != null)
                        wmsGetMap.append("&amp;ELEVATION=").append(elevation);

                    inLine = inLine.replaceAll("#WMS_GETMAP#", wmsGetMap.toString());
                }

                /** VARIABLE **/
                if (inLine.contains("#VAR_NAME#")) {
                    inLine = inLine.replaceAll("#VAR_NAME#", metocFields[2]);
                }

                if (inLine.contains("#VAR_UOM#")) {
                    for (MetocElementType m : metocDictionary.getMetoc()) {
                        if (m.getBrief().equals(metocFields[2]))
                            inLine = inLine.replaceAll("#VAR_UOM#",
                                    m.getDefaultUom().indexOf(":") > 0 ? URLDecoder.decode(m
                                            .getDefaultUom().substring(
                                                    m.getDefaultUom().lastIndexOf(":") + 1),
                                            "UTF-8") : m.getDefaultUom());
                    }
                }

                if (inLine.contains("#VAR_DESCRIPTION#")) {
                    for (MetocElementType m : metocDictionary.getMetoc()) {
                        if (m.getBrief().equals(metocFields[2]))
                            inLine = inLine.replaceAll("#VAR_DESCRIPTION#", m.getName());
                    }
                }

                if (inLine.contains("#VECT_FLAG#")) {
                    if (metocFields[2].indexOf("-") > 0)
                        inLine = inLine.replaceAll("#VECT_FLAG#", "true");
                    else
                        inLine = inLine.replaceAll("#VECT_FLAG#", "false");
                }

                if (inLine.contains("#VECT_DATA_TYPE#")) {
                    if (metocFields[2].indexOf("-") > 0
                            && (metocFields[2].substring(metocFields[2].lastIndexOf("-") + 1)
                                    .equals("u") || metocFields[2].substring(
                                    metocFields[2].lastIndexOf("-") + 1).equals("v")))
                        inLine = inLine.replaceAll("#VECT_DATA_TYPE#", "cartesian");
                    else if (metocFields[2].indexOf("-") > 0
                            && (metocFields[2].substring(metocFields[2].lastIndexOf("-") + 1)
                                    .equals("mag") || metocFields[2].substring(
                                    metocFields[2].lastIndexOf("-") + 1).equals("dir")))
                        inLine = inLine.replaceAll("#VECT_DATA_TYPE#", "polar");
                    else
                        inLine = inLine.replaceAll("#VECT_DATA_TYPE#", "");
                }

                if (inLine.contains("#VECT_RELATED_DATA#")) {
                    if (metocFields[2].indexOf("-") > 0
                            && metocFields[2].substring(metocFields[2].lastIndexOf("-") + 1)
                                    .equals("u"))
                        inLine = inLine.replaceAll("#VECT_RELATED_DATA#", coverageName.replace(
                                metocFields[2], metocFields[2].substring(0, metocFields[2]
                                        .indexOf("-"))
                                        + "-v"));
                    else if (metocFields[2].indexOf("-") > 0
                            && metocFields[2].substring(metocFields[2].lastIndexOf("-") + 1)
                                    .equals("v"))
                        inLine = inLine.replaceAll("#VECT_RELATED_DATA#", coverageName.replace(
                                metocFields[2], metocFields[2].substring(0, metocFields[2]
                                        .indexOf("-"))
                                        + "-u"));
                    else if (metocFields[2].indexOf("-") > 0
                            && metocFields[2].substring(metocFields[2].lastIndexOf("-") + 1)
                                    .equals("mag"))
                        inLine = inLine.replaceAll("#VECT_RELATED_DATA#", coverageName.replace(
                                metocFields[2], metocFields[2].substring(0, metocFields[2]
                                        .indexOf("-"))
                                        + "-dir"));
                    else if (metocFields[2].indexOf("-") > 0
                            && metocFields[2].substring(metocFields[2].lastIndexOf("-") + 1)
                                    .equals("dir"))
                        inLine = inLine.replaceAll("#VECT_RELATED_DATA#", coverageName.replace(
                                metocFields[2], metocFields[2].substring(0, metocFields[2]
                                        .indexOf("-"))
                                        + "-mag"));
                    else
                        inLine = inLine.replaceAll("#VECT_RELATED_DATA#", "");
                }

                /** MODEL **/
                if (inLine.contains("#SATELLITE_NAME#")) {
                    final String satelliteName = metocFields[1].substring(0, metocFields[1]
                            .indexOf("-"));
                    inLine = inLine.replaceAll("#SATELLITE_NAME#", satelliteName);
                }

                if (inLine.contains("#SENSOR_NAME#")) {
                    final String sensorName = metocFields[1]
                            .substring(metocFields[1].indexOf("-") + 1);
                    inLine = inLine.replaceAll("#SENSOR_NAME#", sensorName);
                }

                if (inLine.contains("#ACQUISITION_TIME#"))
                    inLine = inLine.replaceAll("#ACQUISITION_TIME#", sdfMetadata.format(sdfMetoc
                            .parse(metocFields[5])));

                if (inLine.contains("#MODEL_NAME#")) {
                    inLine = inLine.replaceAll("#MODEL_NAME#", metocFields[1].substring(0,
                            metocFields[1].indexOf("-")));
                }

                if (inLine.contains("#MODEL_TYPE#")) {
                    inLine = inLine.replaceAll("#MODEL_TYPE#", metocFields[1]
                            .substring(metocFields[1].indexOf("-") + 1));
                }

                if (inLine.contains("#MODEL_TAU#")) {
                    inLine = inLine.replaceAll("#MODEL_TAU#", metocFields[7]);
                }

                if (inLine.contains("#TAU_UOM#")) {
                    inLine = inLine.replaceAll("#TAU_UOM#", "hour");
                }

                if (inLine.contains("#MODEL_RUNTIME#")) {
                    inLine = inLine.replaceAll("#MODEL_RUNTIME#", sdfMetadata.format(sdfMetoc
                            .parse(metocFields[5])));
                }

                if (inLine.contains("#FORECAST_TIME#")) {
                    inLine = inLine.replaceAll("#FORECAST_TIME#",
                            (timePosition != null ? timePosition : sdfMetadata.format(sdfMetoc
                                    .parse(metocFields[6]))));
                }

                if (inLine.contains("#START_FCST_TIME#") || inLine.contains("#START_RANGE_TIME#")) {
                    inLine = inLine.replaceAll("#START_FCST_TIME#", timePositions[0]);
                    inLine = inLine.replaceAll("#START_RANGE_TIME#", timePositions[0]);
                }
                if (inLine.contains("#END_FCST_TIME#") || inLine.contains("#END_RANGE_TIME#")) {
                    inLine = inLine.replaceAll("#END_FCST_TIME#",
                            timePositions[timePositions.length - 1]);
                    inLine = inLine.replaceAll("#END_RANGE_TIME#",
                            timePositions[timePositions.length - 1]);
                }

                if (inLine.contains("#TIME_LIST#")) {
                    final Calendar cal = new GregorianCalendar(1970, 00, 01);
                    cal.setTimeZone(TimeZone.getTimeZone("GMT+0"));

                    String tLevels = "";
                    int i = 0;
                    for (String t : timePositions) {
                        Date timeInstant = sdfMetadata.parse(t);

                        tLevels += (timeInstant.getTime() - cal.getTimeInMillis());
                        tLevels += (i++ < timePositions.length - 1 ? "," : "");
                    }
                    inLine = inLine.replaceAll("#TIME_LIST#", tLevels);
                }

                /** ENVELOPE/GRID-RANGE **/
                if (inLine.contains("#LONLATBBOX_MINX#")) {
                    inLine = inLine.replaceAll("#LONLATBBOX_MINX#", String.valueOf(envelope
                            .getLowerCorner().getOrdinate(0)));
                }

                if (inLine.contains("#LONLATBBOX_MINY#")) {
                    inLine = inLine.replaceAll("#LONLATBBOX_MINY#", String.valueOf(envelope
                            .getLowerCorner().getOrdinate(1)));
                }

                if (inLine.contains("#LONLATBBOX_MAXX#")) {
                    inLine = inLine.replaceAll("#LONLATBBOX_MAXX#", String.valueOf(envelope
                            .getUpperCorner().getOrdinate(0)));
                }

                if (inLine.contains("#LONLATBBOX_MAXY#")) {
                    inLine = inLine.replaceAll("#LONLATBBOX_MAXY#", String.valueOf(envelope
                            .getUpperCorner().getOrdinate(1)));
                }

                if (inLine.contains("#POST_PROC_FLAG#")) {
                    inLine = inLine.replaceAll("#POST_PROC_FLAG#", "false");
                }

                if (inLine.contains("#PIXEL_UOM#")) {
                    inLine = inLine.replaceAll("#PIXEL_UOM#", "deg");
                }

                if (inLine.contains("#Z_UOM#")) {
                    inLine = inLine.replaceAll("#Z_UOM#", "m");
                }

                if (inLine.contains("#Z_ORDER#")) {
                    inLine = inLine.replaceAll("#Z_ORDER#", zOrder);
                }

                if (inLine.contains("#Z_LEVEL#")) {
                    inLine = inLine.replaceAll("#Z_LEVEL#", String
                            .valueOf(elevation != null ? Double.parseDouble(elevation) : Double
                                    .parseDouble(metocFields[3])));
                }

                if (inLine.contains("#Z_LEVEL_START#")) {
                    inLine = inLine.replaceAll("#Z_LEVEL_START#", String.valueOf(Double
                            .parseDouble(elevationLevels[0])));
                }
                if (inLine.contains("#Z_LEVEL_END#")) {
                    inLine = inLine.replaceAll("#Z_LEVEL_END#", String.valueOf(Double
                            .parseDouble(elevationLevels[elevationLevels.length - 1])));
                }

                if (inLine.contains("#Z_LEVEL_LIST#")) {
                    String zLevels = "";
                    int i = 0;
                    for (String z : elevationLevels) {
                        zLevels += z;
                        zLevels += (i++ < elevationLevels.length - 1 ? "," : "");
                    }
                    inLine = inLine.replaceAll("#Z_LEVEL_LIST#", zLevels);
                }

                if (inLine.contains("#PIXEL_UOM#")) {
                    inLine = inLine.replaceAll("#PIXEL_UOM#", "deg");
                }

                if (inLine.contains("#RESX#")) {
                    inLine = inLine.replaceAll("#RESX#", String.valueOf(matrix.getElement(0, 0)));
                }

                if (inLine.contains("#RESY#")) {
                    inLine = inLine.replaceAll("#RESY#", String.valueOf(matrix.getElement(1, 1)));
                }

                if (inLine.contains("#WIDTH#")) {
                    inLine = inLine.replaceAll("#WIDTH#", String.valueOf(range.getSpan(0)));
                }

                if (inLine.contains("#HEIGHT#")) {
                    inLine = inLine.replaceAll("#HEIGHT#", String.valueOf(range.getSpan(1)));
                }

                if (inLine.contains("#GRID_ORIGIN#")) {
                    inLine = inLine.replaceAll("#GRID_ORIGIN#", matrix.getElement(0, matrix
                            .getNumCol() - 1)
                            + " "
                            + matrix.getElement(1, matrix.getNumCol() - 1)
                            + " "
                            + (zOrder.equals("DOWN") ? "-" : "")
                            + String.valueOf(Double.parseDouble(metocFields[3])));
                }

                if (inLine.contains("#GRID_OFFSETS#")) {
                    StringBuffer offsetsX = new StringBuffer();
                    StringBuffer offsetsY = new StringBuffer();
                    for (int j = 0; j < matrix.getNumCol() - 1; j++) {
                        offsetsX.append(matrix.getElement(0, j));
                        offsetsY.append(matrix.getElement(1, j));
                        if (j < matrix.getNumCol() - 2) {
                            offsetsX.append(" ");
                            offsetsY.append(" ");
                        }
                    }

                    // offsetsX.append(" 0.0");
                    // offsetsY.append(" 0.0");

                    inLine = inLine.replaceAll("#GRID_OFFSETS#", offsetsX + "  " + offsetsY /*
                                                                                             * +
                                                                                             * "  0.0 0.0 1.0"
                                                                                             */);
                }

                if (inLine.contains("#NODATA#")) {
                    inLine = inLine.replaceAll("#NODATA#", metocFields[8]);
                }

                outputStream.println(inLine);
            }

        } catch (IOException e) {
        } finally {
            inputFileReader.close();
            outputFileWriter.close();
        }
    }

    /**
     * 
     * @param type
     * @return
     * @throws IOException
     */
    @SuppressWarnings("deprecation")
    public static Format acquireFormat(String type) throws IOException {
        Format[] formats = GridFormatFinder.getFormatArray();
        Format format = null;
        final int length = formats.length;

        for (int i = 0; i < length; i++) {
            if (formats[i].getName().equals(type)) {
                format = formats[i];

                break;
            }
        }

        if (format == null) {
            throw new IOException("Cannot handle format: " + type);
        } else {
            return format;
        }
    }

	@Override
	public boolean checkConfiguration() {
		// TODO Auto-generated method stub
		return true;
	}
}