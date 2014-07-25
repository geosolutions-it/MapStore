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
package it.geosolutions.geobatch.egeos.wave;

import it.geosolutions.filesystemmonitor.monitor.FileSystemEvent;
import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.metocs.commons.MetocActionConfiguration;
import it.geosolutions.geobatch.metocs.commons.MetocBaseAction;
import it.geosolutions.geobatch.metocs.jaxb.model.MetocElementType;
import it.geosolutions.geobatch.metocs.utils.io.METOCSActionsIOUtils;
import it.geosolutions.geobatch.metocs.utils.io.Utilities;
import it.geosolutions.imageio.plugins.netcdf.NetCDFConverterUtilities;
import it.geosolutions.imageio.plugins.netcdf.NetCDFUtilities;

import java.awt.image.Raster;
import java.awt.image.SampleModel;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.bind.JAXBException;

import org.apache.commons.io.FilenameUtils;

import ucar.ma2.Array;
import ucar.ma2.ArrayFloat;
import ucar.ma2.DataType;
import ucar.ma2.Index;
import ucar.ma2.InvalidRangeException;
import ucar.nc2.Attribute;
import ucar.nc2.Dimension;
import ucar.nc2.NetcdfFile;
import ucar.nc2.NetcdfFileWriteable;
import ucar.nc2.Variable;

/**
 * 
 * Public class to transform E-GEOS::SARWave Derived Data
 * 
 */
@Action(configurationClass = SARWaveActionConfiguration.class)
public class SARWaveAction extends MetocBaseAction {

    private final static Logger LOGGER = Logger.getLogger(SARWaveAction.class.getName());

    private NetcdfFileWriteable ncFileOut = null;

    private NetcdfFile ncFileIn = null;

    private Attribute referenceTime;

    @Override
	public boolean canProcess(FileSystemEvent event) {
		File file = event.getSource();
		if(file.getName().contains("wave")
				&& (file.getName().toLowerCase().endsWith(".nc")
						|| file.getName().toLowerCase().endsWith(".netcdf"))){
			return true;
		}else{
			return false;
		}
	}

    public SARWaveAction(MetocActionConfiguration configuration) throws IOException {
        super(configuration);
    }

    @Override
    protected File writeDownNetCDF(File outDir, String inputFileName) throws IOException,
            InvalidRangeException, ParseException, JAXBException {

        File outputFile = null;
        
        try {
            ncFileIn = NetcdfFile.open(inputFileName);

            // input dimensions
            //final Dimension ra_size = ncFileIn.findDimension("ra_size");
            //final Dimension az_size = ncFileIn.findDimension("az_size");
            // use custom find. the default one is case sensible 
            final Dimension ra_size = findDimension(ncFileIn, "ra_size");
            final Dimension az_size = findDimension(ncFileIn, "az_size");

            // final Dimension n_partitions = ncFileIn.findDimension("n_partitions");

            // input VARIABLES
            // use custom find. the default one is case sensible
            //final Variable lonOriginalVar = ncFileIn.findVariable("longitude");
            final Variable lonOriginalVar = findVariable(ncFileIn, "longitude");
            final DataType lonDataType = lonOriginalVar.getDataType();

            //final Variable latOriginalVar = ncFileIn.findVariable("latitude");
            final Variable latOriginalVar = findVariable(ncFileIn, "latitude");
            final DataType latDataType = latOriginalVar.getDataType();

            final Array lonOriginalData = lonOriginalVar.read();
            final Array latOriginalData = latOriginalVar.read();

            // building envelope
            buildEnvelope(ra_size, az_size, lonOriginalData, latOriginalData);

            // the output
            outputFile = createOutputFile(outDir, inputFileName);
            // ////
            // ... create the output file data structure
            // ////
            ncFileOut = NetcdfFileWriteable.createNew(outputFile.getAbsolutePath());

            // copying NetCDF input file global attributes
            NetCDFConverterUtilities.copyGlobalAttributes(ncFileOut,
                    ncFileIn.getGlobalAttributes());

            // Grabbing the Variables Dictionary
            getMetocsDictionary();

            // finding specific model variables
            fillVariablesMaps();

            if (foundVariables != null && foundVariables.size() > 0) {
                // defining the file header and structure
                double noData = definingOutputVariables(false, az_size.getLength(),
                        ra_size.getLength(), 1, 0, METOCSActionsIOUtils.UP);

                // normalizingTimes
                // MERCATOR OCEAN MODEL Global Attributes
                referenceTime = ncFileIn
                        .findGlobalAttributeIgnoreCase("SOURCE_ACQUISITION_UTC_TIME");
                // e.g. 20100902211637.870628
                final SimpleDateFormat toSdf = new SimpleDateFormat("yyyyMMddHHmmss");
                toSdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                final Date timeOriginDate = toSdf.parse(referenceTime.getStringValue().trim()
                        .toLowerCase());

                final int TAU = normalizingTimes(null, null, timeOriginDate);

                // Setting up global Attributes ...
                final SimpleDateFormat fromSdf = new SimpleDateFormat("yyyyMMdd'T'HHmmssSSS'Z'");
                fromSdf.setTimeZone(TimeZone.getTimeZone("GMT+0"));

                ncFileOut.addGlobalAttribute("base_time", fromSdf.format(timeOriginDate));
                ncFileOut.addGlobalAttribute("tau", TAU);
                ncFileOut.addGlobalAttribute("nodata", noData);

                // writing bin data ...
                writingDataSets(ra_size, az_size, null, null, false, lonOriginalData,
                        latOriginalData, null, noData, null, latDataType, lonDataType);
            }
        } finally {
            try {
                if (ncFileIn != null) {
                    ncFileIn.close();
                }

                if (ncFileOut != null) {
                    ncFileOut.close();
                }
            } catch (IOException e) {
                if (LOGGER.isLoggable(Level.WARNING))
                    LOGGER.log(Level.WARNING, e.getLocalizedMessage(), e);
            }
        }

        return outputFile;
    }

	// ////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Utility and conversion specific methods implementations...
    //
    // ////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 
     * @param ncFileOut
     * @param referenceTime
     * @return
     */
    private static void setTime(NetcdfFileWriteable ncFileOut, final Attribute referenceTime) {
        // e.g. 20100902211637.870628
        final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

        long millisFromStartDate = 0;
        if (referenceTime != null) {
            Date startDate = null;
            try {
                startDate = sdf.parse(referenceTime.getStringValue().trim().toLowerCase());
                long timeInMillis = startDate.getTime();

                long ncMillis = Long.parseLong(referenceTime.getStringValue().substring(
                        referenceTime.getStringValue().indexOf(".") + 1)) / 1000;

                millisFromStartDate = (timeInMillis + ncMillis)
                        - MetocActionConfiguration.startTime;
            } catch (ParseException e) {
                throw new IllegalArgumentException("Unable to parse time origin");
            }
        }

        // writing time variable data
        ArrayFloat timeData = new ArrayFloat(new int[] { 1 });
        Index timeIndex = timeData.getIndex();
        timeData.setFloat(timeIndex.set(0), millisFromStartDate / 1000.0f);
        try {
            ncFileOut.write(METOCSActionsIOUtils.TIME_DIM, timeData);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (InvalidRangeException e) {
            throw new IllegalArgumentException(
                    "Unable to store time data to the output NetCDF file.");
        }
    }

    private File createOutputFile(File outDir, String inputFileName) throws IOException {
        File outputFile = new File(outDir, "EGEOS-SARWave-T" + new Date().getTime()
                + FilenameUtils.getBaseName(inputFileName).replaceAll("-", "") + ".nc");
        return outputFile;
    }

    private double definingOutputVariables(boolean hasDepth, int nLat, int nLon, int nTimes,
            int nDepths, String depthName) {
        /**
         * createNetCDFCFGeodeticDimensions( NetcdfFileWriteable ncFileOut, final boolean
         * hasTimeDim, final int tDimLength, final boolean hasZetaDim, final int zDimLength, final
         * String zOrder, final boolean hasLatDim, final int latDimLength, final boolean hasLonDim,
         * final int lonDimLength)
         */
        final List<Dimension> outDimensions = METOCSActionsIOUtils
                .createNetCDFCFGeodeticDimensions(ncFileOut, true, 1, false, 0,
                        METOCSActionsIOUtils.UP, true, nLat, true, nLon);

        // Adding Wave Partitions dimension
        // outDimensions.add(1, ncFileOut.addDimension(n_partitions.getName(),
        // n_partitions.getLength()));

        double noData = Double.NaN;

        // defining output variable
        for (String varName : foundVariables.keySet()) {
            // SIMONE: replaced foundVariables.get(varName).getDataType()
            // with DataType.DOUBLE
            ncFileOut.addVariable(foundVariableBriefNames.get(varName), foundVariables.get(varName)
                    .getDataType(), outDimensions);
            ncFileOut.addVariableAttribute(foundVariableBriefNames.get(varName), "long_name",
                    foundVariableLongNames.get(varName));
            ncFileOut.addVariableAttribute(foundVariableBriefNames.get(varName), "units",
                    foundVariableUoM.get(varName));
            ncFileOut.addVariableAttribute(foundVariableBriefNames.get(varName),
                    NetCDFUtilities.DatasetAttribs.MISSING_VALUE, noData);
        }

        return noData;
    }

    private void fillVariablesMaps() throws UnsupportedEncodingException {
        for (Object obj : ncFileIn.getVariables()) {
            final Variable var = (Variable) obj;
            final String varName = var.getName();
            if (!varName.equalsIgnoreCase("longitude") && !varName.equalsIgnoreCase("latitude")
                    && !varName.equalsIgnoreCase("valid")) {

                if (foundVariables.get(varName) == null) {
                    String longName = null;
                    String briefName = null;
                    String uom = null;

                    for (MetocElementType m : metocDictionary.getMetoc()) {
                        if ((varName.equalsIgnoreCase("Hs") && m.getName().equals(
                                "sea surface swell wave significant height"))
                                || (varName.equalsIgnoreCase("Wl") && m.getName().equals(
                                        "dominant wave length"))
                                || (varName.equalsIgnoreCase("Dirmet") && m.getName().equals(
                                        "sea surface swell wave to direction"))) {
                            longName = m.getName();
                            briefName = m.getBrief();
                            uom = m.getDefaultUom();
                            uom = uom.indexOf(":") > 0 ? URLDecoder.decode(
                                    uom.substring(uom.lastIndexOf(":") + 1), "UTF-8") : uom;
                            break;
                        }
                    }

                    if (longName != null && briefName != null) {
                        foundVariables.put(varName, var);
                        foundVariableLongNames.put(varName, longName);
                        foundVariableBriefNames.put(varName, briefName);
                        foundVariableUoM.put(varName, uom);
                    }
                }
            }
        }
    }

    private int normalizingTimes(Array timeOriginalData, Dimension timeDim, Date timeOriginDate)
            throws ParseException, NumberFormatException {
        long timeInMillis = timeOriginDate.getTime();
        long ncMillis = Long.parseLong(referenceTime.getStringValue().substring(
                referenceTime.getStringValue().indexOf(".") + 1)) / 1000;
        timeOriginDate.setTime(timeInMillis + ncMillis);
        final int TAU = 0;

        return TAU;
    }

    private void writingDataSets(Dimension ra_size, Dimension az_size, Dimension depthDim,
            Dimension timeDim, boolean hasDepth, Array lonOriginalData, Array latOriginalData,
            Array depthOriginalData, double noData, Array timeOriginalData, DataType latDataType,
            DataType lonDataType) throws IOException, InvalidRangeException {

        double[] bbox = new double[] { envelope.getLowerCorner().getOrdinate(0),
                envelope.getLowerCorner().getOrdinate(1), envelope.getUpperCorner().getOrdinate(0),
                envelope.getUpperCorner().getOrdinate(1) };

        //final Variable maskOriginalVar = ncFileIn.findVariable("valid");
        final Variable maskOriginalVar = findVariable(ncFileIn, "valid");
        
        final Array maskOriginalData = maskOriginalVar.read();

        // writing bin data ...
        ncFileOut.create();

        // writing time Variable data
        setTime(ncFileOut, referenceTime);

        // lat Variable data
        Array lat1Data = NetCDFConverterUtilities.getArray(az_size.getLength(), latDataType);
        final double resY = (bbox[3] - bbox[1]) / az_size.getLength();
        for (int lat = 0; lat < az_size.getLength(); lat++) {
            lat1Data.setDouble(lat, bbox[1] + resY * lat);
        }
        ncFileOut.write(METOCSActionsIOUtils.LAT_DIM, lat1Data);

        // lon Variable data
        Array lon1Data = NetCDFConverterUtilities.getArray(ra_size.getLength(), lonDataType);
        final double resX = (bbox[2] - bbox[0]) / ra_size.getLength();
        for (int lon = 0; lon < ra_size.getLength(); lon++) {
            lon1Data.setDouble(lon, bbox[0] + resX * lon);
        }
        ncFileOut.write(METOCSActionsIOUtils.LON_DIM, lon1Data);

        for (String varName : foundVariables.keySet()) {
            final Variable var = foundVariables.get(varName);

            // //
            // defining the SampleModel data type
            // //
            final SampleModel outSampleModel = Utilities.getSampleModel(var.getDataType(),
                    ra_size.getLength(), az_size.getLength(), /* n_partitions.getLength() */1);

            Array originalVarArray = var.read();

            for (int partition = /* n_partitions.getLength() */1 - 1; partition >= 0; partition--) {
                WritableRaster userRaster = Raster.createWritableRaster(outSampleModel, null);

                Index varIndex = originalVarArray.getIndex();
                Index maskIndex = maskOriginalData != null ? maskOriginalData.getIndex() : null;

                for (int yPos = 0; yPos < az_size.getLength(); yPos++) {
                    for (int xPos = 0; xPos < ra_size.getLength(); xPos++) {
                        float sVal = originalVarArray.getFloat(varIndex.set(yPos, xPos, partition));
                        if (maskOriginalData != null) {
                            int validByte = 1;
                            if (maskOriginalData.getByte(maskIndex.set(yPos, xPos)) != validByte) {
                                sVal = Float.NaN;
                            }
                        }
                        // Flipping y
                        boolean flipY = false;
                        int newYpos = yPos;
                        // Flipping y
                        if (flipY) {
                            newYpos = az_size.getLength() - yPos - 1;
                        }
                        userRaster.setSample(xPos, newYpos, 0, sVal); // setSample(
                        // x, y,
                        // band,
                        // value )
                    }
                }

                // Resampling to a Regular Grid ...
                if (LOGGER.isLoggable(Level.INFO))
                    LOGGER.info("Resampling to a Regular Grid ...");
                userRaster = METOCSActionsIOUtils.warping(bbox, lonOriginalData, latOriginalData,
                        ra_size.getLength(), az_size.getLength(), 2, userRaster, (float) noData,
                        false);

                final Variable outVar = ncFileOut
                        .findVariable(foundVariableBriefNames.get(varName));
                final Array outVarData = outVar.read();

                for (int y = 0; y < az_size.getLength(); y++)
                    for (int x = 0; x < ra_size.getLength(); x++) {
                        outVarData.setFloat(outVarData.getIndex().set(0/* , partition */, y, x),
                                userRaster.getSampleFloat(x, y, partition));
                    }

                ncFileOut.write(foundVariableBriefNames.get(varName), outVarData);
            }
        }
        
        if (LOGGER.isLoggable(Level.FINEST))
        	LOGGER.info("File Resampling completed in file: "+ ncFileOut.getDetailInfo());
    }

	@Override
	public boolean checkConfiguration() {
		// TODO Auto-generated method stub
		return true;
	}
}