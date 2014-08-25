package it.geosolutions.geobatch.action.egeos.emsa.raster;

import java.io.File;
import java.io.FilenameFilter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class ProParser {

    private final static Logger LOGGER = Logger.getLogger(ProParser.class.toString());

    final static class ProType {
        public ProType() {
        };

        /*
         * The absolute dir path containing this image/xml: it represents the path of the PRO
         * package
         */
        String imageParentPath;

        String imageFileName;

        String productID;

        String startTime;
        // ...
    }

    /**
     * 
     * Parse an xml:
     * 
     * <?xml version="1.0" encoding="UTF-8"?> <sat:image
     * xmlns:sat="http://cweb.ksat.no/cweb/schema/satellite" xmlns="http://www.w3.org/1999/xlink"
     * xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     * xsi:schemaLocation=
     * "http://cweb.ksat.no/cweb/schema/satellite http://cweb.ksat.no/cweb/schema/satellite/img.xsd"
     * > <sat:imageFileName>RS1_20100707050441.046.SCN8.NEAR.1.00000_geo8.tif</sat:imageFileName>
     * <sat:pixelSpacingX>200</sat:pixelSpacingX> <sat:pixelSpacingY>200</sat:pixelSpacingY>
     * <sat:samplesPerPixel>1</sat:samplesPerPixel> <sat:bitsPerSample>8</sat:bitsPerSample>
     * <sat:sampleType>Unsigned Integer</sat:sampleType>
     * <sat:resamplingMethod>CUBIC</sat:resamplingMethod> <sat:modelTiepoint>
     * <sat:I>0</sat:I><sat:J>0</sat:J><sat:K>0</sat:K>
     * <sat:X>17.67849810</sat:X><sat:Y>63.34124212</sat:Y><sat:Z>0</sat:Z> </sat:modelTiepoint>
     * <sat:modelPixelScale> <sat:ScaleX>0.0037778637</sat:ScaleX>
     * <sat:ScaleY>-0.0017906864</sat:ScaleY> <sat:ScaleZ>0</sat:ScaleZ> </sat:modelPixelScale>
     * <sat:GTModelTypeGeoKey>ModelTypeGeographic</sat:GTModelTypeGeoKey>
     * <sat:GTRasterTypeGeoKey>RasterPixelIsArea</sat:GTRasterTypeGeoKey>
     * <sat:GeographicTypeGeoKey>GCS_WGS_84</sat:GeographicTypeGeoKey>
     * <sat:GeogCitationGeoKey>"WGS 84"</sat:GeogCitationGeoKey>
     * <sat:GeogAngularUnitsGeoKey>Angular_Degree</sat:GeogAngularUnitsGeoKey> <sat:GCS>4326/WGS
     * 84</sat:GCS> <sat:Datum>6326/World Geodetic System 1984</sat:Datum> <sat:Ellipsoid>7030/WGS
     * 84 (6378137.00,6356752.31)</sat:Ellipsoid> <sat:PrimeMeridian>8901/Greenwich (0.000000/ 0d 0'
     * 0.00"E)</sat:PrimeMeridian> <sat:LowerLeft srsName="EPSG:4326"> <gml:pos>59.8960
     * 17.6785</gml:pos> </sat:LowerLeft> <sat:LowerRight srsName="EPSG:4326"> <gml:pos>59.8960
     * 25.4647</gml:pos> </sat:LowerRight> <sat:UpperLeft srsName="EPSG:4326"> <gml:pos>63.3412
     * 17.6785</gml:pos> </sat:UpperLeft> <sat:UpperRight srsName="EPSG:4326"> <gml:pos>63.3412
     * 25.4647</gml:pos> </sat:UpperRight> <sat:Center srsName="EPSG:4326"> <gml:pos>61.6186
     * 21.5716</gml:pos> </sat:Center> <sat:requestID>N/A</sat:requestID> <sat:source>
     * <sat:productID>RS1_20100707050441.046.SCN8.NEAR.1.00000</sat:productID>
     * <sat:satellite>RADARSAT1</sat:satellite> <sat:sensor>SAR</sat:sensor>
     * <sat:orbit>76584</sat:orbit> <sat:beamMode>SCN-HH</sat:beamMode>
     * <sat:direction>DESCENDING</sat:direction> <sat:resolution>50.0</sat:resolution>
     * <sat:station>ITMA</sat:station> <sat:startTime>2010-07-07T05:04:41.854Z</sat:startTime>
     * <sat:stopTime>2010-07-07T05:05:28.590Z</sat:stopTime> <sat:cornerPoint srsName="EPSG:4326">
     * <gml:pos>62.5987 25.4259</gml:pos> </sat:cornerPoint> <sat:cornerPoint srsName="EPSG:4326">
     * <gml:pos>63.3228 18.8011</gml:pos> </sat:cornerPoint> <sat:cornerPoint srsName="EPSG:4326">
     * <gml:pos>59.9137 23.8023</gml:pos> </sat:cornerPoint> <sat:cornerPoint srsName="EPSG:4326">
     * <gml:pos>60.6023 17.7146</gml:pos> </sat:cornerPoint> <sat:centerPoint srsName="EPSG:4326">
     * <gml:pos>62.9996033 22.1541824</gml:pos> </sat:centerPoint>
     * <sat:acrossTrackIncidenceAngle>0.0</sat:acrossTrackIncidenceAngle>
     * <sat:alongTrackIncidenceAngle>N/A</sat:alongTrackIncidenceAngle>
     * <sat:illuminationAzimuthAngle>N/A</sat:illuminationAzimuthAngle> </sat:source> </sat:image>
     * 
     * @param xmlFile
     * @return
     * @throws Exception
     */
    public static ProType parse(File xmlFile) throws Exception {
        if (xmlFile == null) {
            throw new NullPointerException("ProParser.parse() argument could not be null.");
        }
        // parse the document into a dom
        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(xmlFile);
        doc.getDocumentElement().normalize();

        ProType ret = new ProType();
        boolean complete = false;
        NodeList list = doc.getDocumentElement().getChildNodes();
        int size = list.getLength();
        for (int i = 0; i < size; i++) {
            Node proNode = list.item(i);
            if (proNode.getNodeName() == "sat:imageFileName") {
                ret.imageParentPath = xmlFile.getParent();
                ret.imageFileName = proNode.getTextContent();
                if (LOGGER.isLoggable(Level.INFO))
                    LOGGER.info("ProParser.parse() sat:imageFileName:" + proNode.getTextContent());

            } else if (proNode.getNodeName() == "sat:source") {
                NodeList sourceList = proNode.getChildNodes();
                int sourceSize = sourceList.getLength();
                for (int j = 0; j < sourceSize; j++) {
                    Node sourceNode = sourceList.item(j);
                    if (sourceNode.getNodeName() == "sat:startTime") {
                        ret.startTime = sourceNode.getTextContent();
                        complete = true;
                        if (LOGGER.isLoggable(Level.INFO))
                            LOGGER.info("ProParser.parse() sat:startTime:"
                                    + sourceNode.getTextContent());
                        break;
                    }
                }
            }
        }
        if (complete) {
            return ret;
        }
        return null;
    }

    /**
     * Move the tif file referenced by the obj argument to the specified destDir renaming the tif
     * as: destName/imageFileName_startTime.tif
     * 
     * @param obj
     *            object representing a PRO tif
     * @param destDir
     *            destination dir
     * @param seconds
     *            seconds to wait (maximum) for nfs propagate. If -1 no check is performed.
     * @return the moved file 
     * @throws Exception
     */
    public static File copyTif(ProType obj, File destDir, final int seconds) throws Exception {
        if (obj == null || destDir == null) {
            throw new NullPointerException("ProParser.moveTiff() arguments could not be null.");
        }
        if (!destDir.exists() || !destDir.isDirectory() || !destDir.canWrite()) {
            throw new IllegalArgumentException(
                    "ProParser.copyTif() destDir argument do not refer to a writeable or existent directory: \""
                            + destDir.getAbsolutePath() + "\"");
        }

        String sourceName = new String(obj.imageParentPath + File.separator + obj.imageFileName);
        File source = new File(sourceName);
        if (!source.exists() || !source.canWrite()) {
            throw new IllegalArgumentException(
                    "ProParser.copyTif() ProType argument do not refer to a writeable or existent file: \""
                            + sourceName + "\"");
        }

        // change date format
        final TimeZone tz = TimeZone.getTimeZone("UTC");
        final SimpleDateFormat sdf_in = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        sdf_in.setTimeZone(tz);
        Date d = sdf_in.parse(obj.startTime);

        final SimpleDateFormat sdf_out = new SimpleDateFormat("yyyyMMdd'T'HHmmssSSS'Z'");
        sdf_out.setTimeZone(tz);
        final String outDate = sdf_out.format(d);
        /*
         * building path to move to as: destName/imageFileName_startTime.tiff
         */
        StringBuilder destName = new StringBuilder();
        destName.append(destDir).append(File.separator)
                .append(FilenameUtils.getBaseName(obj.imageFileName))// or -> obj.productID
                .append("_").append(outDate).append(".tif");
        
//////////NOTICE: THIS FUNCTION IS IN GB-TOOLS->Path class/////////////////////////
        File dest = new File(destName.toString());

        try {
            // copy the file
            FileUtils.copyFile(source, dest);
            if (seconds>0){
                if (!FileUtils.waitFor(dest, seconds)){
                    dest=null;
                    if (LOGGER.isLoggable(Level.SEVERE))
                        LOGGER.severe("ProParser.copyTif() : failed to propagate tif to->"+dest.getAbsolutePath());
                } else if (LOGGER.isLoggable(Level.INFO)){
                    LOGGER.info("ProParser.copyTif() : file: "+source.getAbsoluteFile()
                            +" succesfully copied and propagated over nfs to: "+dest.getAbsolutePath());
                }
            }
            else if (LOGGER.isLoggable(Level.INFO)){
                LOGGER.info("ProParser.copyTif() : source file: "+source.getAbsoluteFile()
                        +" succesfully copied to: "+dest.getAbsolutePath());
            }
        } catch (Exception e) {
            if (LOGGER.isLoggable(Level.SEVERE))
                LOGGER.severe("ProParser.copyTif() : failed to copy tif to->"+dest.getAbsolutePath()+
                        "message is: "+e.getLocalizedMessage());
            dest = null;
        }
        return dest;
        /////////////////////////////////////
    }

    // TODO JUnit tests
    public static void main(String[] args0) throws Exception {
        File proDir = new File(
                "/home/carlo/work/data/EMSAWorkingDir/out/test_1/569_RS1_20100707050441.046.SCN8.NEAR.1.00000_PRO/");
        File[] proFiles = proDir.listFiles((FilenameFilter) new WildcardFileFilter("*.xml"));
        if (proFiles != null)
            for (File f : proFiles)
                copyTif(ProParser.parse(f), new File("/home/carlo/Downloads/"),-1);
    }
}
