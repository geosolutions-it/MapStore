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
package it.geosolutions.geobatch.mariss.actions;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.filesystemmonitor.monitor.FileSystemEventType;
import it.geosolutions.geobatch.catalog.impl.TimeFormat;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;
import it.geosolutions.geobatch.mariss.actions.csv.CSVIngestAction;
import it.geosolutions.geobatch.mariss.actions.csv.CSVIngestConfiguration;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVAcqListProcessor;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProductTypes1To3Processor;
import it.geosolutions.geobatch.mariss.ingestion.csv.CSVProductTypes5Processor;
import it.geosolutions.geobatch.mariss.ingestion.csv.MarissCSVServiceProcessor;

import java.io.File;
import java.io.Serializable;
import java.util.EventObject;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

import org.apache.commons.io.FileUtils;
import org.junit.Test;
import static org.junit.Assert.*;


/**
 * Tests for CSV ingestion action
 * 
 * @author adiaz
 */
public class CSVIngestActionTest {

   

    public CSVIngestActionTest() {
        super();
    }

    /**
     * Generate a CSVAcqListProcessor processor to test
     * 
     * @return the processor
     */
    private CSVAcqListProcessor getAcqProcessor() {
        return (CSVAcqListProcessor) getProcessor("acq_list", "CLS", "CLS1");
    }

    private Map<String, Serializable> getConnectionParameters() {
        Map<String, Serializable> params = new HashMap<String, Serializable>();
        params.put("dbtype", "postgis");
        params.put("host", "84.33.2.25");
        params.put("port", 5432);
        params.put("schema", "public");
        params.put("database", "mariss");
        params.put("user", "mariss");
        params.put("passwd", "mariss");
        return params;
    }

    /**
     * Generate a MarissCSVServiceProcessor processor to test
     * 
     * @return the processor
     */
    private MarissCSVServiceProcessor getProcessor(String typeName, String userName,
            String serviceName) {
        MarissCSVServiceProcessor processor = null;
        try {
            if ("acq_list".equals(typeName)) {
                processor = new CSVAcqListProcessor(
                        getConnectionParameters(),
                        typeName,
                        new TimeFormat(
                                null,
                                null,
                                "Time format default",
                                new TimeFormatConfiguration(null, null, "Time format configuration")));
            } else if ("products_1to3".equals(typeName)) {
                processor = new CSVProductTypes1To3Processor(
                        getConnectionParameters(),
                        typeName,
                        new TimeFormat(
                                null,
                                null,
                                "Time format default",
                                new TimeFormatConfiguration(null, null, "Time format configuration")));
            } else if ("products_5".equals(typeName)) {
                processor = new CSVProductTypes5Processor(
                        getConnectionParameters(),
                        typeName,
                        new TimeFormat(
                                null,
                                null,
                                "Time format default",
                                new TimeFormatConfiguration(null, null, "Time format configuration")));
            }
            processor.setUserName(userName);
            processor.setServiceName(serviceName);
        } catch (Exception e) {
            fail("Error getting the processor:" + e.getLocalizedMessage());
        }
        return processor;
    }

    /**
     * Process CSV files with the default CSV ingest action
     * 
     * @throws Exception
     */
    @Test
    public void loadAllAsEvent() throws Exception {
        CSVAcqListProcessor acqProcessor = getAcqProcessor();

        if (acqProcessor != null) {
            CSVIngestAction action = new CSVIngestAction(new CSVIngestConfiguration(null, null,
                    null));
            action.addProcessor(acqProcessor);
            action.addProcessor(getProcessor("products_1to3", "CLS", "CLS1"));
            action.addProcessor(getProcessor("products_5", "CLS", "CLS1"));
            Queue<EventObject> events = new LinkedList<EventObject>();

            for (File file : FileUtils.listFiles(new File("."), new String[] { "csv" }, true)) {
                
                FileSystemEvent event = new FileSystemEvent(file, FileSystemEventType.FILE_ADDED);
                events.add(event);
                @SuppressWarnings({ "unused", "rawtypes" })
                Queue result = action.execute(events);
            }
        } else {
            //LOGGER.info("The local database is not available");
        }
    }
    
//    @Test
//    public void testDsMarshalling() throws Exception {
//        
//        File fileDsXml = new File("C:\\work\\E-GEOS\\MARISS\\data\\data\\Phase1\\VDS\\NEREIDS_ASA_IMP_1PNIPA20100913_110107_000000162092_00495_44637_0625.N1_GMV_274.xml");
//        
//        QNameMap qmap = new QNameMap();
//        qmap.setDefaultNamespace("http://ignore.namespace/prefix");
//        qmap.setDefaultPrefix("");
//        StaxDriver staxDriver = new StaxDriver(qmap); 
//        XStream xstream = new XStream(staxDriver){
//            @Override
//            protected MapperWrapper wrapMapper(MapperWrapper next) {
//                return new MapperWrapper(next) {
//                    @Override
//                    public boolean shouldSerializeMember(Class definedIn, String fieldName) {
//                        if (definedIn == Object.class) {
//                            return false;
//                        }
//                        return super.shouldSerializeMember(definedIn, fieldName);
//                    }
//                };
//            }
//        };
//        
//        xstream.processAnnotations(ShipDetection.class);     // inform XStream to parse annotations in Data 
//        
//        ShipDetection shpDs = (ShipDetection) xstream.fromXML(fileDsXml);
//        
//        LOGGER.info(shpDs.toString());
//    }
}