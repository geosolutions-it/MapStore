/**
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

/**
 * @requires widgets/form/spatialselector/SpatialSelectorMethod.js
 */
 
/**
 * @author Alejandro Diaz
 */

/** api: (define)
 *  module = gxp.widgets.form.spatialselector
 *  class = BufferSpatialSelectorMethod
 */

/** api: (extends)
 *  widgets/form/spatialselector/SpatialSelectorMethod.js
 */
Ext.namespace('gxp.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: CircleSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on circle drawing
 */
gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod = Ext.extend(gxp.widgets.form.spatialselector.PolygonSpatialSelectorMethod, {

	/* xtype = gxp_spatial_circle_selector */
	xtype : 'gxp_spatial_circle_selector',
  
  /** api: config[metricUnit]
	 *  ``Object``
	 *  The metric unit to display summary
	 */
  metricUnit :"km",
  
  /** api: config[displayProjection]
	 *  ``Object``
	 *  The projection for coordinate display (if null, the native) default null
	 */
  displayProjection: null,
  
/** api: config[CRSDecimalPrecision]
	 *  ``Object``
	 *  The decimal precision of lon lat
	 */
  CRSDecimalPrecision: 3,
	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */
	name  : 'Circle',

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */
	label : 'Circle',

	// obtain draw control
	getDrawControl: function(){
        var polyOptions = {sides: 100};
        
        return new OpenLayers.Control.DrawFeature(
            this.drawings,
            OpenLayers.Handler.RegularPolygon,
            {
                handlerOptions: polyOptions
            }
        );
	},

    // Reset method
    reset: function(){
		gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod.superclass.reset.call(this);
		if(this.circleCentroidLayer){
			this.circleCentroidLayer.removeAllFeatures();
		}
    },

	/** api: method[getSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Obtain selection summary
	 */
    getSummary: function(geometry){

		var summary = "", metricUnit = this.metricUnit;

		var area = this.getArea(geometry, metricUnit);
		if (area) {
			summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
		}

		var radius = Math.sqrt(area / Math.PI);
		if (radius) {
			summary += this.radiusLabel + ": " + radius + " " + metricUnit + '<br />';
		}

		// //////////////////////////////////////////////////////////
		// Draw also the circle center as a part of summary report
		// //////////////////////////////////////////////////////////
		var circleSelectionCentroid = geometry.getCentroid();

		if (circleSelectionCentroid) {
			var lon = circleSelectionCentroid.x;
			var lat = circleSelectionCentroid.y;
      var xField,yField;
      var projWGS84 = new OpenLayers.Projection("EPSG:4326");
      
      if(this.displayProjection){
        var dProj = new OpenLayers.Projection(this.displayProjection);
        var point = new OpenLayers.Geometry.Point(lon,lat).transform(this.target.mapPanel.map.projection,dProj);
        lon = point.x;
        lat = point.y;
        xField = "Lon"; //TODO distinguish if projected or not
        yField= "Lat";
        
      }else{
        xField = this.target.mapPanel.map.projection == "EPSG:4326" ? "Lon" : "X";
        yField = this.target.mapPanel.map.projection == "EPSG:4326" ? "Lat" : "Y";
        
      }
      summary += this.centroidLabel + ": " + lon.toFixed(this.CRSDecimalPrecision) + " ("+xField+") " + lat.toFixed(this.CRSDecimalPrecision) + " ("+yField+")" + '<br />';
			
		}

		var options = {};
		var centroidStyle = {
			pointRadius : 4,
			graphicName : "cross",
			fillColor : "#FFFFFF",
			strokeColor : "#FF0000",
			fillOpacity : 0.5,
			strokeWidth : 2
		};

		if (centroidStyle) {
			var style = new OpenLayers.Style(centroidStyle);
			var options = {
				styleMap : style,
				displayInLayerSwitcher: false
			};
		}

		var circleCentroidLayer = null;
		if(!this.circleCentroidLayer){
			circleCentroidLayer = new OpenLayers.Layer.Vector("bboxqf-circleCentroid", options);
			this.circleCentroidLayer = circleCentroidLayer;
			this.target.mapPanel.map.addLayer(circleCentroidLayer);
		}else{
			circleCentroidLayer = this.circleCentroidLayer;
			this.circleCentroidLayer.removeAllFeatures();
		}

		var pointFeature = new OpenLayers.Feature.Vector(circleSelectionCentroid);
		circleCentroidLayer.addFeatures([pointFeature]);

		circleCentroidLayer.displayInLayerSwitcher = false;

		return summary;
    }
});

Ext.reg(gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod.prototype.xtype, gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod);
