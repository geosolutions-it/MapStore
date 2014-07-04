/*
 * $Header: it.geosolutions.geobatch.nurc.tda.jgsflodess.config.global.JGSFLoDeSSGlobalConfig,v. 0.1 04/dic/2009 17:50:01 created by Fabiani $
 * $Revision: 0.1 $
 * $Date: 04/dic/2009 17:50:01 $
 *
 * ====================================================================
 *
 * Copyright (C) 2007-2008 GeoSolutions S.A.S.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. 
 *
 * ====================================================================
 *
 * This software consists of voluntary contributions made by developers
 * of GeoSolutions.  For more information on GeoSolutions, please see
 * <http://www.geo-solutions.it/>.
 *
 */
package it.geosolutions.geobatch.metocs.utils.io.rest;

import it.geosolutions.geobatch.catalog.file.FileBaseCatalog;
import it.geosolutions.geobatch.global.CatalogHolder;
import it.geosolutions.tools.commons.file.Path;

import java.io.File;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Fabiani
 * 
 */
public final class PublishingRestletGlobalConfig {

    private static final Logger LOGGER = Logger.getLogger(PublishingRestletGlobalConfig.class
            .toString());

    private static String rootDirectory;

    public PublishingRestletGlobalConfig(String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    public static String getRootDirectory() {
        return rootDirectory;
    }

    public void setRootDirectory(String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    public void init() throws Exception {
        File workingDir = null;
        try {
            workingDir = Path.findLocation(rootDirectory, 
                    ((FileBaseCatalog) CatalogHolder.getCatalog()).getBaseDirectory());
        } catch (Exception e) {
            if (LOGGER.isLoggable(Level.SEVERE))
                LOGGER.log(Level.SEVERE, e.getLocalizedMessage(), e);
            throw new IllegalArgumentException(
                    "Unable to work with the provided working directory:"
                            + (workingDir != null ? workingDir : ""));
        }
        if (workingDir == null || !workingDir.exists() || !workingDir.canRead()
                || !workingDir.isDirectory())
            throw new IllegalArgumentException(
                    "Unable to work with the provided working directory:"
                            + (workingDir != null ? workingDir : ""));
        rootDirectory = workingDir.getAbsolutePath();
    }

}
