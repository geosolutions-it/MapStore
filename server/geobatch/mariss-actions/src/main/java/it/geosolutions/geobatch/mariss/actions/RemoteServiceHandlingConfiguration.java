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
package it.geosolutions.geobatch.mariss.actions;

import it.geosolutions.geobatch.actions.ds2ds.Ds2dsConfiguration;
import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;
import it.geosolutions.geobatch.mariss.actions.netcdf.ConfigurationContainer;
import it.geosolutions.geobatch.remoteBrowser.configuration.RemoteBrowserConfiguration;

import java.util.Map;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamInclude;

/**
 * Gate file handling configuration. Not use input ds (input data it's read from xml). Includes ftp connection parameters for the remote file browsing
 * 
 * @author adiaz
 */
@XStreamAlias("RemoteServiceHandlingConfiguration")
@XStreamInclude({ ConfigurationContainer.class })
public class RemoteServiceHandlingConfiguration extends Ds2dsConfiguration {

    /**
     * Configuration for the remote connection for the files to be ingested
     */
    private RemoteBrowserConfiguration remoteBrowserConfiguration;

    /**
     * Configuration for the remote connection for success or fail executions
     */
    private RemoteBrowserConfiguration remoteResultBrowserConfiguration;

    /**
     * Time format configuration for the ingestion
     */
    private TimeFormatConfiguration timeFormatConfiguration;

    /**
     * Pattern for files to be handled
     */
    private String filePattern;

    /**
     * Flag to don't retry already handled files (by name). Default it's true
     */
    private boolean checkIfExists = true;

    /**
     * Flag to save on local directory or not. Default it's true. When false, use
     * {@link RemoteServiceHandlingConfiguration#remoteResultBrowserConfiguration} to store the results
     */
    private boolean storeLocal = true;

    /**
     * Flag to delete files on the remote server after download it. Default it's false
     */
    private boolean deleteDownloadedFiles = false;

    /**
     * Base path for the remote input files
     */
    private String inputRemotePath;

    /**
     * Input directory
     */
    private String inputPath;

    /**
     * Output for done files
     */
    private String succesPath;

    /**
     * Output for fail files
     */
    private String failPath;

    /**
     * Name of the products table
     */
    private String productsTableName;

    /**
     * Absolute path to the GeoServerDataDirectory
     */
    private String geoserverDataDirectory;

    /**
     * Path to the Metoc-Dictionary file
     */
    private String metocDictionaryPath;

    /**
     * Password for the GeoServer instance
     */
    private String geoserverPWD;

    /**
     * User ID for the GeoServer instance
     */
    private String geoserverUID;

    /**
     * URL for the GeoServer instance
     */
    private String geoserverURL;

    /**
     * {@link ConfigurationContainer} map to assign to the NetCDF actions to launch after processing input data
     */
    @XStreamAlias("subconfigurations")
    private Map<String, ConfigurationContainer> subconfigurations;

    public RemoteServiceHandlingConfiguration(String id, String name, String description) {
        super(id, name, description);
    }

    /**
     * @return the failPath
     */
    public String getFailPath() {
        return failPath;
    }

    /**
     * @return the filePattern
     */
    public String getFilePattern() {
        return filePattern;
    }

    /**
     * @return the GeoServerDataDirectory path
     */
    public String getGeoserverDataDirectory() {
        return geoserverDataDirectory;
    }

    /**
     * @return the GeoServer password
     */
    public String getGeoserverPWD() {
        return geoserverPWD;
    }

    /**
     * @return the GeoServer User ID
     */
    public String getGeoserverUID() {
        return geoserverUID;
    }

    /**
     * @return the GeoServer URL
     */
    public String getGeoserverURL() {
        return geoserverURL;
    }

    /**
     * @return the inputPath
     */
    public String getInputPath() {
        return inputPath;
    }

    /**
     * @return the inputRemotePath
     */
    public String getInputRemotePath() {
        return inputRemotePath;
    }

    /**
     * @return the Metoc-Dictionary path
     */
    public String getMetocDictionaryPath() {
        return metocDictionaryPath;
    }

    /**
     * @return the Products Table name
     */
    public String getProductsTableName() {
        return productsTableName;
    }

    /**
     * @return the remoteBrowserConfiguration
     */
    public RemoteBrowserConfiguration getRemoteBrowserConfiguration() {
        return remoteBrowserConfiguration;
    }

    /**
     * @return the remoteResultBrowserConfiguration
     */
    public RemoteBrowserConfiguration getRemoteResultBrowserConfiguration() {
        return remoteResultBrowserConfiguration;
    }

    /**
     * @return the various SubConfiguration map
     */
    public Map<String, ConfigurationContainer> getSubconfigurations() {
        return subconfigurations;
    }

    /**
     * @return the succesPath
     */
    public String getSuccesPath() {
        return succesPath;
    }

    /**
     * @return the timeFormatConfiguration
     */
    public TimeFormatConfiguration getTimeFormatConfiguration() {
        return timeFormatConfiguration;
    }

    /**
     * @return the checkIfExists
     */
    public boolean isCheckIfExists() {
        return checkIfExists;
    }

    /**
     * @return the deleteDownloadedFiles
     */
    public boolean isDeleteDownloadedFiles() {
        return deleteDownloadedFiles;
    }

    /**
     * @return the storeLocal
     */
    public boolean isStoreLocal() {
        return storeLocal;
    }

    /**
     * @param checkIfExists the checkIfExists to set
     */
    public void setCheckIfExists(boolean checkIfExists) {
        this.checkIfExists = checkIfExists;
    }

    /**
     * @param deleteDownloadedFiles the deleteDownloadedFiles to set
     */
    public void setDeleteDownloadedFiles(boolean deleteDownloadedFiles) {
        this.deleteDownloadedFiles = deleteDownloadedFiles;
    }

    /**
     * @param failPath the failPath to set
     */
    public void setFailPath(String failPath) {
        this.failPath = failPath;
    }

    /**
     * @param filePattern the filePattern to set
     */
    public void setFilePattern(String filePattern) {
        this.filePattern = filePattern;
    }

    /**
     * @param geoserverDataDirectory the path to the GeoserverDataDirectory
     */
    public void setGeoserverDataDirectory(String geoserverDataDirectory) {
        this.geoserverDataDirectory = geoserverDataDirectory;
    }

    /**
     * @param geoserverPWD the password for the current GeoServer instance
     */
    public void setGeoserverPWD(String geoserverPWD) {
        this.geoserverPWD = geoserverPWD;
    }

    /**
     * @param geoserverUID the User ID for the current GeoServer instance
     */
    public void setGeoserverUID(String geoserverUID) {
        this.geoserverUID = geoserverUID;
    }

    /**
     * @param geoserverURL the URL of the current GeoServer instance
     */
    public void setGeoserverURL(String geoserverURL) {
        this.geoserverURL = geoserverURL;
    }

    /**
     * @param inputPath the inputPath to set
     */
    public void setInputPath(String inputPath) {
        this.inputPath = inputPath;
    }

    /**
     * @param inputRemotePath the inputRemotePath to set
     */
    public void setInputRemotePath(String inputRemotePath) {
        this.inputRemotePath = inputRemotePath;
    }

    /**
     * @param metocDictionaryPath the path of the Metoc Dictionary File
     */
    public void setMetocDictionaryPath(String metocDictionaryPath) {
        this.metocDictionaryPath = metocDictionaryPath;
    }

    /**
     * @param productsTableName the name of the Products Table to set
     */
    public void setProductsTableName(String productsTableName) {
        this.productsTableName = productsTableName;
    }

    /**
     * @param remoteBrowserConfiguration the remoteBrowserConfiguration to set
     */
    public void setRemoteBrowserConfiguration(RemoteBrowserConfiguration remoteBrowserConfiguration) {
        this.remoteBrowserConfiguration = remoteBrowserConfiguration;
    }

    /**
     * @param remoteResultBrowserConfiguration the remoteResultBrowserConfiguration to set
     */
    public void setRemoteResultBrowserConfiguration(
            RemoteBrowserConfiguration remoteResultBrowserConfiguration) {
        this.remoteResultBrowserConfiguration = remoteResultBrowserConfiguration;
    }

    /**
     * @param storeLocal the storeLocal to set
     */
    public void setStoreLocal(boolean storeLocal) {
        this.storeLocal = storeLocal;
    }

    /**
     * @param subconfigurations the various SubConfiguration map
     */
    public void setSubconfigurations(Map<String, ConfigurationContainer> subconfigurations) {
        this.subconfigurations = subconfigurations;
    }

    /**
     * @param succesPath the succesPath to set
     */
    public void setSuccesPath(String succesPath) {
        this.succesPath = succesPath;
    }

    /**
     * @param timeFormatConfiguration the timeFormatConfiguration to set
     */
    public void setTimeFormatConfiguration(TimeFormatConfiguration timeFormatConfiguration) {
        this.timeFormatConfiguration = timeFormatConfiguration;
    }

}
