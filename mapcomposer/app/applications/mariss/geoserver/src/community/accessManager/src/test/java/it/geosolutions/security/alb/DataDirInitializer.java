package it.geosolutions.security.alb;

import java.io.File;
import java.io.IOException;

import org.geoserver.data.test.MockTestData;
import org.geoserver.data.util.IOUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class DataDirInitializer implements ApplicationContextAware {

    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException {
        MockTestData mockData = applicationContext.getBean(MockTestData.class);
        
        try {
            IOUtils.copy(
                AlbAccessManagerTestUtils.lookupAccessManagerConf(),
                new File(mockData.getDataDirectoryRoot(), AlbAccessManager.CONFIG_LOCATION));
        } catch (IOException e) {
            String errMsg = "Failed to copy access manager configuration to data directory";
            throw new BeanInitializationException(errMsg, e);
        }
    }

}
