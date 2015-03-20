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
 * @include widgets/form/spatialselector/BBOXSpatialSelectorMethod.js
 * @include widgets/form/spatialselector/BufferSpatialSelectorMethod.js
 * @include widgets/form/spatialselector/CircleSpatialSelectorMethod.js
 * @include widgets/form/spatialselector/GeocoderSpatialSelectorMethod.js
 * @include widgets/form/spatialselector/PolygonSpatialSelectorMethod.js
 */
 
/**
 * @author Alejandro Diaz
 */

/** api: (define)
 *  module = gxp.widgets.form.spatialselector
 *  class = SpatialSelectorMethod
 */

/** api: (extends)
 *  Container.js
 */
Ext.namespace('gxp.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: SpatialSelectorMethod(config)
 *
 *    Common code for plugins for spatial selection.
 *    Known plugins: <ul>
 *       <li>BBOXSpatialSelectorMethod: `gxp_spatial_bbox_selector` ptype</li>
 *       <li>BufferSpatialSelectorMethod: `gxp_spatial_buffer_selector` ptype</li>
 *       <li>CircleSpatialSelectorMethod: `gxp_spatial_circle_selector` ptype</li>
 *       <li>GeocoderSpatialSelectorMethod: `gxp_spatial_geocoding_selector` ptype</li>
 *       <li>PolygonSpatialSelectorMethod: `gxp_spatial_polygon_selector` ptype</li>
 * 	  </ul>
 */
gxp.widgets.form.spatialselector.SpatialSelectorMethod = Ext.extend(Ext.Container, {

	/** api: config[name]
	 *  ``String``
	 *  Name to show on the combo box of the spatial selected.
	 */

	/** api: config[label]
	 *  ``String``
	 *  Label to show on the combo box of the spatial selected.
	 */

	/** api: config[output]
	 *  ``Object``
	 *  Output for this plugin
	 */

	/** api: config[currentGeometry]
	 *  ``Object``
	 *  Selected geometry
	 */

	/** api: config[filterGeometryName]
	 *  ``Object``
	 *  Parameter to perform the filter
	 */
   
   /** api: config[metricUnit]
	 *  ``Object``
	 *  The metric unit to display summary
	 */
    metricUnit :"km",
	
	/** api: config[hideWhenDeactivate]
	 *  ``Boolean``
	 *  Flag to hide output when the selection method is deactivated. Default is true
	 */
	hideWhenDeactivate: true,

	/** api: config[zoomToCurrentExtent]
	 *  ``Boolean``
	 *  Flag to zoom the current map to the selected geometry when you select one. Default is false
	 */
	zoomToCurrentExtent: false,

	/** api: config[defaultStyle]
	 *  ``Object``
	 */
	defaultStyle : {
        "fillColor"   : "#FFFFFF",
        "strokeColor" : "#FF0000",
        "fillOpacity" : 0.5,
        "strokeWidth" : 1
	},

	/** api: config[selectStyle]
	 *  ``Object``
	 */
	selectStyle : {
        "fillColor"   : "#FFFFFF",
        "strokeColor" : "#FF0000",
        "fillOpacity" : 0.5,
        "strokeWidth" : 1
	},

	/** api: config[temporaryStyle]
	 *  ``Object``
	 */
	temporaryStyle : {
		"strokeColor": "#ee9900",
		"fillColor": "#ee9900",
		"fillOpacity": 0.4,
		"strokeWidth": 1
	},
	
	/** api: config[showSelectionSummary]
	 *  ``Boolean``
	 *  Whether we want to show or not the selection summary as a pop-up on the map.
	 */
	showSelectionSummary : true,

	/** api: config[addGeometryOperation]
	 *  ``Boolean``
	 *  Append geometry operation as fieldset.
	 */
	addGeometryOperation: true,

	/** api: config[geometryOperations]
	 *  ``Array``
	 *  With allowed geometry operations.
	 */
	geometryOperations:[{
		name: "INTERSECTS",
		label: "INTERSECTS",
		value: OpenLayers.Filter.Spatial.INTERSECTS
	},{
		name: "BBOX",
		label: "BBOX",
		value: OpenLayers.Filter.Spatial.BBOX
	},{
		name: "CONTAINS",
		label: "CONTAINS",
		value: OpenLayers.Filter.Spatial.CONTAINS
	},{
		name: "DWITHIN",
		label: "DWITHIN",
		value: OpenLayers.Filter.Spatial.DWITHIN
	},{
		name: "WITHIN",
		label: "WITHIN",
		value: OpenLayers.Filter.Spatial.WITHIN
	}],

	/** api: config[defaultGeometryOperation]
	 *  ``String``
	 *  Default geometry operation selected.
	 */
	defaultGeometryOperation: OpenLayers.Filter.Spatial.INTERSECTS,

	/** api: config[areaLabel]
	 * ``String``
	 * Text for the Selection Summary Area Label (i18n).
	 */
	areaLabel : "Area",

	/** api: config[lengthLabel]
	 * ``String``
	 * Text for the Selection Summary Perimeter Label (i18n).
	 */
	lengthLabel : "Length",

	/** api: config[perimeterLabel]
	 * ``String``
	 * Text for the Selection Summary Perimeter Label (i18n).
	 */
	perimeterLabel : "Perimeter",

	/** api: config[selectionSummary]
	 * ``String``
	 * Text for the Selection Summary (i18n).
	 */
	selectionSummary : "Selection Summary",

	/** api: config[radiusLabel]
	 * ``String``
	 * Text for the Selection Summary Radius Label (i18n).
	 */
	radiusLabel : "Radius",

	/** api: config[centroidLabel]
	 * ``String``
	 * Text for the Selection Summary Centroid Label (i18n).
	 */
	centroidLabel : "Centroid",

	/** api: config[geometryOperationText]
	 * ``String``
	 * Text for the Geometry Operation Label (i18n).
	 */
	geometryOperationText: "Geometry operation",

	/** api: config[geometryOperationEmptyText]
	 * ``String``
	 * Text for the empty geometry operation combo (i18n).
	 */
	geometryOperationEmptyText: "Select a operation",

	/** api: config[distanceTitleText]
	 * ``String``
	 * Text for the Distance field label (i18n).
	 */
	distanceTitleText: "Distance",

	/** api: config[centroidLabel]
	 * ``String``
	 * Text for distance unit field label (i18n).
	 */
	distanceUnitsTitleText: "Distance units",

	/** api: config[noOperationTitleText]
	 * ``String``
	 * Text for no valud operation title msg (i18n).
	 */
	noOperationTitleText: "No valid operation",

	/** api: config[noOperationMsgText]
	 * ``String``
	 * Text for no operation msg (i18n).
	 */
	noOperationMsgText: "Please, select an operation before query",

	/** api: config[noCompleteMsgText]
	 * ``String``
	 * Text msg for no complete form (i18n).
	 */
	noCompleteMsgText: "Please, complete form before query",

	// init spatialSelector method
	constructor : function(config) {
		Ext.apply(this, config);
		
		return gxp.widgets.form.spatialselector.SpatialSelectorMethod.superclass.constructor.call(this, arguments);
	},

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function(config) {   

		Ext.apply(this, config);

		if(!this.output){
			this.output = this;
		}

		if(this.addGeometryOperation){
			if (!this.items){
				this.items = [];
			}
			this.items.push({
				xtype: 'fieldset',
				ref: "geometryOperationFieldset",
				title: this.geometryOperationText,
                checkboxToggle: true,
                collapsed : true,
				items: [this.getGeometryOperationCombo()]
			});
			this.items.push(this.getDistanceFieldset());
		}

        gxp.widgets.form.spatialselector.SpatialSelectorMethod.superclass.initComponent.call(this);
    },

	/** api: method[getSelectionMethodItem]
     *  :returns: ``Object`` For the selection type combo
	 * Generate a item for the selection type combo
	 */
	getSelectionMethodItem: function(){
        return {
        	label: this.label, 
        	name: this.name
        };
	},

	/** api: method[getQueryFilter]
     *  :returns: ``Object`` filter to perform a WFS query
	 * Generate a filter for the selected method
	 */
	getQueryFilter: function(){
		var operation = null;
		if(this.addGeometryOperation && !this.geometryOperationFieldset.collapsed){
			if(this.geometryOperation.isValid() ){
				operation = this.geometryOperation.getValue();
			}else{
                Ext.Msg.show({
                    title: this.noOperationTitleText,
                    msg: this.noOperationMsgText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
				return null;
			}
		}else{
			operation = OpenLayers.Filter.Spatial.INTERSECTS;
		}
		if(this.currentGeometry){
			switch (operation){
				case OpenLayers.Filter.Spatial.CONTAINS:
				case OpenLayers.Filter.Spatial.INTERSECTS:
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: operation,
						property:  this.filterGeometryName,
						value: this.currentGeometry,
						bounds: this.currentGeometry.getBounds()
					});
					break;
				case OpenLayers.Filter.Spatial.WITHIN:
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: operation,
						property:  this.filterGeometryName,
						value: this.currentGeometry
					});
					break;
				case OpenLayers.Filter.Spatial.DWITHIN:
					if(this.distance.isValid()
						&& this.dunits.isValid()){
						this.currentFilter = new OpenLayers.Filter.Spatial({
							type: operation,
							property:  this.filterGeometryName,
					        distanceUnits: this.dunits.getValue(),
					        distance: this.distance.getValue(),
							value: this.currentGeometry
						});
					}else{
		                Ext.Msg.show({
		                    title: this.noOperationTitleText,
		                    msg: this.noCompleteMsgText,
		                    buttons: Ext.Msg.OK,
		                    icon: Ext.MessageBox.ERROR
		                });
		                return null;
					}
					break;
				case OpenLayers.Filter.Spatial.BBOX:
				default: 
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: OpenLayers.Filter.Spatial.BBOX,
						property:  this.filterGeometryName,
						value: this.currentGeometry.getBounds()
					});
			}
			
		}else{
	        this.currentFilter = null;
		}

		return this.currentFilter;
	},

	/** api: method[activate]
     *  Trigger action when activate the plugin
	 */
	activate: function(){
		this.reset();
		this.doLayout();
		this.show();
	},

	/** api: method[deactivate]
     *  Trigger action when deactivate the plugin
	 */
	deactivate: function(){
		this.reset();
		if(this.distanceFieldset){
         		this.distanceFieldset.hide();
		}
		if(this.geometryOperationFieldset){
	        	this.geometryOperationFieldset.collapse();
		}
		this.hide();		
	},

    /** api: method[addOutput]
     */
    addOutput: function() {
    	// TODO: Override it on plugins
    },

	/** api: method[reset]
     *  Trigger action when reset the plugin
	 */
    reset: function(){
    	this.currentGeometry = null;
    	this.currentFilter = null;

		if(this.featureSummary && this.featureSummary.isVisible()){
			this.featureSummary.hide();
		}
    },

	/** api: method[setCurrentGeometry]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Set current geometry
	 */
    setCurrentGeometry: function(geometry){
		this.currentGeometry = geometry;
    	if (geometry) {

			if (this.zoomToCurrentExtent && geometry && geometry.getBounds) {
				var dataExtent = geometry.getBounds();
				this.target.mapPanel.map.zoomToExtent(dataExtent, closest=false);
			}

			this.addFeatureSummary(geometry);
			this.output.fireEvent("geometrySelect", geometry);
		} 
    },

	/** api: method[addFeatureSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Add feature summary if needed
	 */
    addFeatureSummary: function(geometry){
		if(this.showSelectionSummary){
			if(this.featureSummary && this.featureSummary.isVisible()){
				this.featureSummary.hide();
			}
			this.featureSummary = new Ext.ToolTip({
				xtype : 'tooltip',
				target : Ext.getBody(),
				html : this.getSummary(geometry),
				title : this.selectionSummary,
				autoHide : false,
				closable : true,
				draggable : false,
				mouseOffset : [0, 0],
				showDelay : 1,
				listeners : {
					scope : this,
					hide : function(cmp) {
						this.featureSummary.destroy();
					}
				}
			});

			var vertex = geometry.getVertices();
			var point;
			if ( geometry instanceof OpenLayers.Bounds) {
				point = vertex[1];
			} else{
				point = vertex[vertex.length - 1];
			}

			var px = this.target.mapPanel.map.getPixelFromLonLat(new OpenLayers.LonLat(point.x, point.y));
			var p0 = this.target.mapPanel.getPosition();

			this.featureSummary.targetXY = [p0[0] + px.x, p0[1] + px.y];
			this.featureSummary.show();
		}
    },

	/** api: method[getSummary]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Obtain selection summary
	 */
    getSummary: function(geometry){

		var summary = "", metricUnit = this.metricUnit;

		var area = this.getArea(geometry, metricUnit);
		var length = this.getLength(geometry, metricUnit);
		if (area) {
			summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
		}else if (length) {
			summary += this.lengthLabel + ": " + length + " " + metricUnit + '<br />';
		}else if(geometry instanceof OpenLayers.Geometry.Point){
			summary += "X: " + geometry.x + ", Y:" + geometry.y + '<sup>2</sup>' + '<br />';
		}

		return summary;
    },

	/**
	 * Method: getArea
	 *
	 * Parameters:
	 * geometry - {<OpenLayers.Geometry>}
	 * units - {String} Unit abbreviation
	 *
	 * Returns:
	 * {Float} The geometry area in the given units.
	 */
	getArea : function(geometry, units) {
		var area, geomUnits;
		area = geometry.getArea();
		if(area > 0){
			area = geometry.getGeodesicArea(this.target.mapPanel.map.getProjectionObject());
			geomUnits = "m";

			var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
			if (inPerDisplayUnit) {
				var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
				area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
			}
		}
		return area;
	},

	/**
	 * Method: getLength
	 *
	 * Parameters:
	 * geometry - {<OpenLayers.Geometry>}
	 * units - {String} Unit abbreviation
	 *
	 * Returns:
	 * {Float} The geometry length in the given units.
	 */
	getLength : function(geometry, units) {
		var length, geomUnits;
		length = geometry.getLength();
		if(length){
			length = geometry.getGeodesicLength(this.target.mapPanel.map.getProjectionObject());
			geomUnits = "m";

			var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
			if (inPerDisplayUnit) {
				var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
				length *= (inPerMapUnit / inPerDisplayUnit);
			}
		}
		return length;
	},

	/** api: method[getGeometryOperationCombo]
     *  Obtain the geometry operation combo
	 */
	getGeometryOperationCombo : function() {
		var geometryOperationMethodCombo = {
			xtype : 'combo',
			ref : '../geometryOperation',
			fieldLabel : this.geometryOperationText,
			typeAhead : true,
			triggerAction : 'all',
			lazyRender : false,
			mode : 'local',
			name : 'geometryOperation',
			forceSelected : true,
			value: this.defaultGeometryOperation,
			emptyText : this.geometryOperationEmptyText,
			allowBlank : false,
			autoLoad : true,
			displayField : 'label',
			valueField : 'value',
			editable : false,
			readOnly : false,
			store : new Ext.data.JsonStore({
				fields : [{
					name : 'name',
					dataIndex : 'name'
				}, {
					name : 'label',
					dataIndex : 'label'
				}, {
					name : 'value',
					dataIndex : 'value'
				}],
				data : this.geometryOperations
			}),
			listeners : {
				// SHOW /Hide distance units for DWITHIN
				select : function(c, record, index) {
					if(c.getValue() == OpenLayers.Filter.Spatial.DWITHIN){
						this.distanceFieldset.show();
					}else if(this.distanceFieldset.isVisible()){
						this.distanceFieldset.hide();
					}
				},
				scope : this
			}
		};
		return geometryOperationMethodCombo;
	},

	/** api: method[getDistanceFieldset]
     *  Obtain the distance fieldset for DWITHIN
	 */
	getDistanceFieldset: function(){
		return {
			xtype: 'fieldset',
			title: this.distanceTitleText,
			ref: "distanceFieldset",
			hidden: true,
			items: [{
				xtype: "textfield",
				fieldLabel: this.distanceUnitsTitleText,
				name: "dunits",
				ref: "../dunits",
				labelStyle: 'width: 130px;',
				value: this.target.mapPanel.map.units,
				allowBlank: false
			},{
				xtype: "numberfield",
				fieldLabel: this.distanceTitleText,
				name: "distance",
				ref: "../distance",
				labelStyle: 'width: 130px;',
				allowBlank: false
			}]
		}
	}
});
