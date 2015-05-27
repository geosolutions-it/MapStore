package it.geosolutions.geobatch.mariss.actions.sartiff;

import it.geosolutions.geobatch.mariss.actions.netcdf.ShipDetection;

import java.io.File;
import java.util.List;

/**
 * Container class with informations 
 * to update database and publish data from an <SarGeoTIFFAction>
 * @author Lorenzo Natali, GeoSolutions
 *
 */
public class SarGeoTiffProcessingResult {
	private List<ShipDetection> shipDetections;
	private File geoTiff;
	public List<ShipDetection> getShipDetections() {
		return shipDetections;
	}
	public void setShipDetections(List<ShipDetection> shipDetections) {
		this.shipDetections = shipDetections;
	}
	public File getGeoTiff() {
		return geoTiff;
	}
	public void setGeoTiff(File geoTiff) {
		this.geoTiff = geoTiff;
	}
}
