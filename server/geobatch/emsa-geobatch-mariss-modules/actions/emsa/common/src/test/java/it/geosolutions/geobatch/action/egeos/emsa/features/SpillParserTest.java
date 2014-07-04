/**
 * 
 */
package it.geosolutions.geobatch.action.egeos.emsa.features;

import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

import junit.framework.TestCase;

import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.postgis.PostgisNGDataStoreFactory;
import org.geotools.jdbc.JDBCDataStoreFactory;
import org.springframework.core.io.ClassPathResource;

/**
 * @author Administrator
 * 
 */
public class SpillParserTest extends TestCase {

    private static Logger LOGGER = Logger.getLogger(SpillParserTest.class.getName());

    public void testSpillParser() throws Exception {
        // connect to the store
        DataStore store = connect();

        File directory = new ClassPathResource("testOS").getFile();
        File[] spillFiles = directory.listFiles(new FilenameFilter() {

            public boolean accept(File dir, String name) {
                return name.matches(".*OS.\\.xml");
            }
        });

        for (File spillFile : spillFiles) {
            // todo: separate warnings from notifications
            LOGGER.info("About to parse " + spillFile.toString());
            SpillParser spillParser = new SpillParser();
            //FIXME: Unable to convert 2010-11-04T06:04:53 to java.sql.Timestamp
            // spillParser.parseOilSpill(store, SpillParser.xpath, spillFile);
        }

        store.dispose();
    }

    private static DataStore connect() throws IOException {
        File dsParamsFile = new ClassPathResource("datastoreTest.properties").getFile();
        if (dsParamsFile == null || !dsParamsFile.exists()) {
            throw new IOException("Cannot get 'datastoreTest.properties' file!");
        }

        Properties dsProps = new Properties();
        dsProps.load(new FileInputStream(dsParamsFile));

        Map<String, Object> params = new HashMap<String, Object>();
        params.put(JDBCDataStoreFactory.DATABASE.key, dsProps
                .get(JDBCDataStoreFactory.DATABASE.key));
        params.put(JDBCDataStoreFactory.DBTYPE.key, dsProps.get(JDBCDataStoreFactory.DBTYPE.key));
        params.put(JDBCDataStoreFactory.HOST.key, dsProps.get(JDBCDataStoreFactory.HOST.key));
        params
                .put(JDBCDataStoreFactory.PORT.key,
                        dsProps.get(JDBCDataStoreFactory.PORT.key) != null ? dsProps
                                .get(JDBCDataStoreFactory.PORT.key)
                                : PostgisNGDataStoreFactory.PORT.sample);
        params.put(JDBCDataStoreFactory.USER.key, dsProps.get(JDBCDataStoreFactory.USER.key));
        params.put(JDBCDataStoreFactory.PASSWD.key, dsProps.get(JDBCDataStoreFactory.PASSWD.key));
        // important as there are some chars that need escaping
        params.put(PostgisNGDataStoreFactory.PREPARED_STATEMENTS.key, Boolean.TRUE);
        LOGGER.info(params.toString());
        return DataStoreFinder.getDataStore(params);

    }

}
