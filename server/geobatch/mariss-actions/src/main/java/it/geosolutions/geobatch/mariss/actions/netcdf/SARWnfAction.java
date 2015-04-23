package it.geosolutions.geobatch.mariss.actions.netcdf;

import it.geosolutions.geobatch.annotations.Action;
import it.geosolutions.geobatch.flow.event.action.ActionException;
import it.geosolutions.geobatch.metocs.jaxb.model.MetocElementType;
import it.geosolutions.geobatch.metocs.jaxb.model.Metocs;
import it.geosolutions.imageio.plugins.netcdf.NetCDFConverterUtilities;

import java.awt.image.Raster;
import java.awt.image.SampleModel;
import java.awt.image.WritableRaster;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.List;

import javax.xml.bind.JAXBException;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.geotools.geometry.GeneralEnvelope;

import ucar.ma2.Array;
import ucar.ma2.DataType;
import ucar.ma2.Index;
import ucar.ma2.InvalidRangeException;
import ucar.nc2.Dimension;
import ucar.nc2.NetcdfFile;
import ucar.nc2.NetcdfFileWriteable;
import ucar.nc2.Variable;

@Action(configurationClass = IngestionActionConfiguration.class)
public class SARWnfAction extends NetCDFAction {

    public SARWnfAction(IngestionActionConfiguration actionConfiguration) {
        super(actionConfiguration);
    }

    @Override
    protected boolean canProcessFile(File netcdfFile) {
        if (netcdfFile != null) {
            String fileName = netcdfFile.getName();
            if (fileName != null && !fileName.isEmpty()) {
                return fileName.contains("wnf");
            }
        }
        return false;
    }

    public void fillVariablesMaps(NetcdfFile ncFileIn, Metocs metocDictionary,
            AttributeBean attributeBean) throws UnsupportedEncodingException {
        for (Object obj : ncFileIn.getVariables()) {
            final Variable var = (Variable) obj;
            final String varName = var.getName();
            if (!varName.equalsIgnoreCase("longitude") && !varName.equalsIgnoreCase("latitude")
                    && !varName.equalsIgnoreCase("mask")) {

                if (attributeBean.foundVariables.get(varName) == null) {
                    String longName = null;
                    String briefName = null;
                    String uom = null;

                    // TODO CHANGE ME
                    for (MetocElementType m : metocDictionary.getMetoc()) {
                        if ((varName.equalsIgnoreCase("wind_speed") && m.getName().equals(
                                "wind speed"))
                                || (varName.equalsIgnoreCase("wind_direction") && m.getName()
                                        .equals("wind direction"))) {
                            longName = m.getName();
                            briefName = m.getBrief();
                            uom = m.getDefaultUom();
                            uom = uom.indexOf(":") > 0 ? URLDecoder.decode(
                                    uom.substring(uom.lastIndexOf(":") + 1), "UTF-8") : uom;
                            break;
                        }
                    }

                    if (longName != null && briefName != null) {
                        attributeBean.foundVariables.put(varName, var);
                        attributeBean.foundVariableLongNames.put(varName, longName);
                        attributeBean.foundVariableBriefNames.put(varName, briefName);
                        attributeBean.foundVariableUoM.put(varName, uom);
                    }
                }
            }
        }
    }

    protected String getActionName() {
        return "wnf";
    }

    @Override
    protected File[] writeNetCDF(File tempDir, String inputFileName, List<String> cfNames,
            AttributeBean attributeBean) throws IOException, ActionException {

        String fileBaseName = FilenameUtils.getBaseName(inputFileName);

        File directory = new File(tempDir, "netcdf");
        FileUtils.forceMkdir(directory);
        // Output file array
        File[] outputFiles = null;

        NetcdfFile ncFileIn = null;
        NetcdfFileWriteable ncFileOut[] = null;
        try {
            // Opening input file
            ncFileIn = NetcdfFile.open(inputFileName);
            // input dimensions
            final Dimension ra_size = NetCDFUtils.findDimension(ncFileIn, "ra_size", true);

            final Dimension az_size = NetCDFUtils.findDimension(ncFileIn, "az_size", true);

            // input Lon/Lat VARIABLES
            final Variable lonOriginalVar = NetCDFUtils.findVariable(ncFileIn, "longitude", true);
            final DataType lonDataType = lonOriginalVar.getDataType();

            final Variable latOriginalVar = NetCDFUtils.findVariable(ncFileIn, "latitude", true);
            final DataType latDataType = latOriginalVar.getDataType();

            final Array lonOriginalData = lonOriginalVar.read();
            final Array latOriginalData = latOriginalVar.read();

            // building envelope
            attributeBean.env = NetCDFUtils.buildEnvelope(ra_size, az_size, lonOriginalData,
                    latOriginalData);

            // Grabbing the Variables Dictionary
            Metocs dictionary = null;
            try {
                dictionary = NetCDFUtils
                        .getMetocsDictionary(configuration.getMetocDictionaryPath());
            } catch (JAXBException e) {
                throw new ActionException(SARWnfAction.class, e.getLocalizedMessage());
            }

            // finding specific model variables
            fillVariablesMaps(ncFileIn, dictionary, attributeBean);
            // getting Variables number
            int numVariables = attributeBean.foundVariables.size();
            ncFileOut = new NetcdfFileWriteable[numVariables];
            outputFiles = new File[numVariables];

            // Loop through the variables
            if (numVariables > 0) {
                int index = 0;
                for (String varName : attributeBean.foundVariables.keySet()) {
                    // Append variable name
                    cfNames.add(varName);
                    // ////
                    // ... create the output file
                    // ////
                    outputFiles[index] = new File(directory, fileBaseName + 
                            CUSTOM_DIM_START_SEPARATOR + "sartype" + CUSTOM_DIM_VAL_SEPARATOR + getActionName() + CUSTOM_DIM_END_SEPARATOR + 
                            SEPARATOR + varName.trim() + ".nc");
                    outputFiles[index].createNewFile();
                    // ////
                    // ... create the output file data structure
                    // ////
                    NetcdfFileWriteable writable = NetcdfFileWriteable.createNew(outputFiles[index]
                            .getAbsolutePath());
                    ncFileOut[index] = writable;

                    // copying NetCDF input file global attributes
                    NetCDFConverterUtilities.copyGlobalAttributes(writable,
                            ncFileIn.getGlobalAttributes());

                    // ////
                    // ... Write data
                    // ////
                    boolean hasTime = attributeBean.timedim != null;
                    int numTime = hasTime ? 1 : 0;

                    // defining the file header and structure
                    double noData = definingOutputVariables(false, az_size.getLength(),
                            ra_size.getLength(), writable, ncFileIn, hasTime, numTime, varName,
                            attributeBean);

                    // writing bin data ...
                    try {
                        writingDataSets(varName, ra_size, az_size, lonOriginalData,
                                latOriginalData, attributeBean.timedim, hasTime, noData,
                                latDataType, lonDataType, attributeBean.env, ncFileIn, writable,
                                attributeBean);
                    } catch (InvalidRangeException e) {
                        throw new ActionException(SARWnfAction.class, e.getLocalizedMessage());
                    }

                    index++;
                }
            }
        } finally {
            if (ncFileIn != null) {
                try {
                    ncFileIn.close();
                } catch (Exception e) {
                    LOGGER.error(e.getLocalizedMessage());
                }
            }
            if (ncFileOut != null && ncFileOut.length > 0) {
                for (NetcdfFileWriteable file : ncFileOut) {
                    if (file != null) {
                        try {
                            file.close();
                        } catch (Exception e) {
                            LOGGER.error(e.getLocalizedMessage());
                        }
                    }
                }
            }
        }

        return outputFiles;
    }

    protected void writingDataSets(String varName, Dimension ra_size, Dimension az_size,
            Array lonOriginalData, Array latOriginalData, Date time, boolean hasTime,
            double noData, DataType latDataType, DataType lonDataType, GeneralEnvelope envelope,
            NetcdfFile ncFileIn, NetcdfFileWriteable ncFileOut, AttributeBean attributeBean)
            throws IOException, InvalidRangeException {

        double[] bbox = new double[] { envelope.getLowerCorner().getOrdinate(0),
                envelope.getLowerCorner().getOrdinate(1), envelope.getUpperCorner().getOrdinate(0),
                envelope.getUpperCorner().getOrdinate(1) };

        final Variable maskOriginalVar = ncFileIn.findVariable("mask");
        final DataType maskDataType = maskOriginalVar != null ? maskOriginalVar.getDataType()
                : null;
        final Array maskOriginalData = maskDataType != null ? maskOriginalVar.read() : null;

        ncFileOut.create();

        // lat Variable data
        Array lat1Data = NetCDFConverterUtilities.getArray(az_size.getLength(), latDataType);
        final double resY = (bbox[3] - bbox[1]) / az_size.getLength();
        for (int lat = 0; lat < az_size.getLength(); lat++) {
            lat1Data.setDouble(lat, bbox[1] + resY * lat);
        }
        ncFileOut.write(NetCDFUtils.LAT_DIM, lat1Data);

        // lon Variable data
        Array lon1Data = NetCDFConverterUtilities.getArray(ra_size.getLength(), lonDataType);
        final double resX = (bbox[2] - bbox[0]) / ra_size.getLength();
        for (int lon = 0; lon < ra_size.getLength(); lon++) {
            lon1Data.setDouble(lon, bbox[0] + resX * lon);
        }
        ncFileOut.write(NetCDFUtils.LON_DIM, lon1Data);

        // time Variable data
        if (hasTime) {
            Array timeData = NetCDFConverterUtilities.getArray(1, DataType.INT);
            timeData.setObject(0, (int) (time.getTime() / 1000));
            ncFileOut.write(NetCDFUtils.TIME_DIM, timeData);
        }

        final Variable var = attributeBean.foundVariables.get(varName);

        // //
        // defining the SampleModel data type
        // //
        final SampleModel outSampleModel = NetCDFUtils.getSampleModel(var.getDataType(),
                ra_size.getLength(), az_size.getLength(), 1);

        Array originalVarArray = var.read();

        WritableRaster userRaster = Raster.createWritableRaster(outSampleModel, null);

        Index varIndex = originalVarArray.getIndex();
        Index maskIndex = maskOriginalData != null ? maskOriginalData.getIndex() : null;
        writeRaster(ra_size, az_size, maskOriginalData, originalVarArray, null, userRaster,
                varIndex, maskIndex);

        // Resampling to a Regular Grid ...
        if (LOGGER.isInfoEnabled()) {
            LOGGER.info("Resampling to a Regular Grid ...");
        }
        userRaster = NetCDFUtils.warping(bbox, lonOriginalData, latOriginalData,
                ra_size.getLength(), az_size.getLength(), 2, userRaster, (float) noData, false);

        final Variable outVar = ncFileOut.findVariable(attributeBean.foundVariableBriefNames
                .get(varName));
        final Array outVarData = outVar.read();

        int[] dimensions = new int[hasTime ? 3 : 2];

        for (int y = 0; y < az_size.getLength(); y++) {
            for (int x = 0; x < ra_size.getLength(); x++) {
                dimensions[hasTime ? 1 : 0] = y;
                dimensions[hasTime ? 2 : 1] = x;
                outVarData.setFloat(outVarData.getIndex().set(dimensions),
                        userRaster.getSampleFloat(x, y, 0));
            }
        }

        ncFileOut.write(attributeBean.foundVariableBriefNames.get(varName), outVarData);

        if (LOGGER.isInfoEnabled()) {
            LOGGER.info("File Resampling completed in file: " + ncFileOut.getDetailInfo());
        }
    }
}
