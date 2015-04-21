/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = DownloadPanel
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: DownloadPanel(config)
 *
 *    Plugin for manager WPS Download services 
 * 
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */   
gxp.plugins.DownloadPanel = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_download */
    ptype: "gxp_download",
    
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "download",    
    
    /** api: config[container]
     *  ``String``
     */
    container: 'fieldset',   

    /** api: config[wpsUrl]
     *  ``String``
     */
    wpsUrl: null,
    
    /** api: config[geostoreUrl]
     *  ``String``
     */
    geostoreUrl: null,
    
    /** api: config[geostoreUser]
     *  ``String``
     */
    geostoreUser: null,

    /** api: config[geostorePassword]
     *  ``String``
     */
    geostorePassword: null,

	/** api: config[gazetteerUrl]
     *  ``String``
     */
	gazetteerUrl: null,
	
	/** api: config[sridLinkTpl]
     *  ``String``
     */
	sridLinkTpl: null,
	
	/** api: config[initialText]
     *  ``String``
     */
	initialText: "Select an item ...",
	
	/** api: config[formats]
     *  ``Object``
     */
	formats: {
		wfs:[
			["application/zip", "ESRI Shapefile", "zip"],
			["application/dxf", "DXF", "dxf"],
			["application/gml-2.1.2", "GML2", "gml"],
			["application/gml-3.1.1", "GML3", "gml"]
		],
		wcs:[
			["image/tiff", "GeoTIFF", "tif"]
		]
	},
	
	/** api: config[targetCSR]
     *  ``Array``
	 *  Native Record must be the first.
     */
	targetCSR: [
		["Native", "", "", ""],
		["EPSG:4326", "EPSG:4326", "epsg", "4326"],
	],
	
	/** api: config[layerStore]
     *  ``Object``
     */
	layerStore: null,
	
    /** api: config[crsStore]
     *  ``Object``
     */
	crsStore: null,
	
	/** api: config[selectedLayer]
     *  ``Object``
     */
	selectedLayer: null,
	
	/** api: config[removePreviousLayerOnSelection]
     *  ``Object``
     */
	removePreviousLayerOnSelection: true,
	
	/** api: config[formPanel]
     *  ``Object``
     */
	formPanel: null,

    /** api: config[resultPanel]
     *  ``Object``
     */
    resultPanel: null,

    /** 
     *  ``gxp.plugins.wpsClusterManager``
     */
    wpsClusterManager: null,

    /** 
     *  ``gxp.plugins.FeatureManager``
     */
    featureManager: null,
    
    /** api: config[gazetteerConfig]
     *  ``Object``
     */
    gazetteerConfig: null,

    /** api: config[bufferRequestTimeout]
     *  ``Integer``
     */
    bufferRequestTimeout: 1 * 1000,
    
	/** api: config[wfsDefaultVersion]
     *  ``String``
     */
    wfsDefaultVersion: '1.0.0',
    
	/** api: config[wcsDefaultVersion]
     *  ``String``
     */
    wcsDefaultVersion: '1.0.0',
    
	/** api: config[wpsDefaultVersion]
     *  ``String``
     */
    wpsDefaultVersion: '1.0.0',

	/** api: config[ogcFilterVersion]
     *  ``String``
     */
    ogcFilterVersion: '1.1.0',
    
    tabTitle: "Download",
    
    dselTitle: "Data Selection",
	
    dselLayer: "Layer",
	
    dselCRS: "Target CRS",
	
    dselFormat: "Format",
    
    settingTitle: "Spatial Settings",
	
    settingSel: "Selection Mode",
	
    settingCut: "Cut Mode",
    
    emailNotificationTitle: "Email notification",
	
    emailFieldLabel: "Email",

    vectorFilterTitle: "Vector Filter",
    
    placeSearchLabel: "Place",

    resTitle: "Results",
	
    resID: "ID",
	
    resExecID: "execID",
	
    resProcStatus: "Process Status",
	
    resGet: "Get",
	
    resDelete: "Delete",
	
    resPhase: "Phase",
	
    resProgress: "Progress",
	
    resResult: "Result",
    
    btnRefreshTxt: "Refresh",
	
	btnDeleteTxt: "Delete the selected processes",
	
    btnResetTxt: "Reset",
	
    btnDownloadTxt: "Download",
    
    errMissParamsTitle: "Missing parameters" ,
	
    errMissParamsMsg: "Please fill all the mandatory fields" ,
    
    errMissGeomTitle: "Missing feature" ,
	
    errMissGeomMsg: "Please draw the Area of Interest before submitting" ,

    msgRemRunningTitle:"Remove Running Instance",
	
    msgRemRunningMsg:  "You are about to delete a running instance, you will not be able to retreave the result<br/>Do you really want to delete instance ?",
	
    msgRemTitle: "Remove Instance",
	
    msgRemMsg: "Do you want to delete instance ?",
	
    msgRemDone: "Instance removed.",
    
    errWPSTitle: "DownloadProcess not supported",
	
    errWPSMsg: "This WPS server does not support gs:Download process",
	
	wpsErrorMsg: "The WPS reports the following error",
    
    errBufferTitle: "Buffer failed",
	
    errBufferMsg: "Error buffering feature",
    
    errUnknownLayerTypeTitle: "Unknown layer type",
    
    errUnknownLayerTypeMsg: "Cannot estabilish the type of the selected layer. Please select another layer to download",

    errLayerGroupTypeTitle: "Layergroup detected",
    
    errLayerGroupTypeMsg: "Layergroups cannot be downloaded. Please select another layer to download",

    msgEmptyEmailTitle: "Empty email",
	
    msgEmptyEmailMsg: "The email notification is enabled, but the email field is not filled. Continue wihout email notification?",
    
    msgEmptyFilterTitle: "Empty filter",
	
    msgEmptyFilterMsg: "The filter is enabled, but the filter is not filled. Continue wihout filter?",
    
    msgWrongCRSTitle: "Projection Mismatch",
    
    msgWrongCRSMsg: "The selected projection will be overridden by the Output Format specifications (EPSG:4326). Continue anyway?",
    
    msgTooltipPending: 'Pending',
	
    msgTooltipSuccess: 'Success',
	
    msgTooltipExecuting: 'Executing',
	
    msgTooltipFailed: 'Failed',
	
    msgTooltipAccepted: 'Accepted',
    
    msgGeostoreException: "Geostore Exception",
	
	msgNone: 'None',
    
    msgBox: 'Box',
	
    msgPolygon: 'Polygon',
	
    msgCircle: 'Circle',
	
    msgPlace: 'Place',
    
    msgIntersection: 'Intersection',
	
    msgClip: 'Clip',
    
    msgInstance: 'Instance',
    
    msgName: 'Name',
	
    msgCreation: 'Creation',
	
    msgDescription: 'Description',   
    
    msgCategory: 'Category', 
	
    msgMetadata: 'Metadata',
	
    msgAttributes: 'Attributes',
    
    errExceptionTextTitle: "Exception",
    
    errWrongResponseMsg: "Got wrong respone from server",
	
	executionIdField: "Execution ID",
	
	executionIdFieldEmptyText: "Insert an execution ID",
	
	executionIdFieldTooltip: "Insert an execution ID to follow the process status",
	
	executionIdFieldTooltipDelete: "Delete the execution ID field",
	
	executionIdPresentErrorMsg: "The provided execution ID is already present inside the Grid",
	
	executionIdEmptyErrorMsg: "The server has returned an empty execution ID",
	
	executionIdInvalidErrorMsg: "Invalid execution Id !",
	
	processExecutionEmpty: "Remote data are no longer available.",
	
	processExecutions: "Download Summary",
	
	processExecutionsLoadText: "Previous Download",
	
	processResponseErrorTitle: "Process Response Error",
	
	processResponseErrorMsg: "The process did not properly respond",
	
	describeProcessErrorMsg: "Cannot read response",
	
	bufferFieldLabel: "Approximate Buffer (m)",
	
	downloadFormFieldSetTitle: "Download Form",
	
	loadMaskMsg: "Please wait...",
	
	requiredFieldsLabel: "* These fields are mandatory for the download process.",
	
	infoBtnTooltip: "Show info about this CRS",
	
	readOnlyLayerSelection: false,
	
	selectionSummary: "Selection Summary",
	
	selectedProcessIdString: "Selected process ID: ",
	
	selectedProcessIdStringUndef: "Unknown",
	
	areaLabel: "Area",
	
	perimeterLabel: "Perimeter",
	
	radiusLabel: "Radius",
	
	centroidLabel: "Centroid",
	
	closeText: "Close",
	
	showExecutionIdText: "Show Execution ID",
	
	processIdentifierText: "Identifier",
	
	downloadIdTitle: "Download ID",
	
    /** private: method[constructor]
     */
    constructor: function(config) {
	    this.addEvents(
            /** api: event[ready]
             *  Fires at the end of the tool's initializzation.
             */
            "ready"
        );
		
        gxp.plugins.DownloadPanel.superclass.constructor.apply(this, arguments); 
    },   
	
	/** private: method[init]
     *  :arg target: ``Object``
	 * 
	 *  Provide the initialization code defining necessary listeners and controls.
     */
	init: function(target) {
		target.on({
			'ready' : function(){
			    this.addLayerTool = this.target.tools["addlayer"];
				this.addLayerTool.on({
					'ready' : function(layerRecord){
						this.selectedLayer = layerRecord;
						// ///////////////////////////////////
						// As usual reload the Formats store
						// ///////////////////////////////////
						this.formatStore.removeAll();
						if(layerRecord && layerRecord.data.wcs === true){
							this.formatStore.loadData(this.formats.wcs, false);
						}else{
							this.formatStore.loadData(this.formats.wfs, false);
                            this.showMask();
                            this.featureManager.setLayer(layerRecord);
						}
					},
					scope: this
				});
				
				var map = this.target.mapPanel.map;
				
				// ///////////////////////////////////
				// Add Plugin controls Tools
				// ///////////////////////////////////
                var rules = [];
                var style = new OpenLayers.Style();
                var rules = [new OpenLayers.Rule({
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: 'isBuffered',
                        value: true
                    }),
                    symbolizer: {fillColor: '#0011FF', fillOpacity: 0.5}
                }), new OpenLayers.Rule({
                    symbolizer: {fillOpacity: 0.4}
                })];
                style.addRules(rules);
                        
				this.spatialSelection = new OpenLayers.Layer.Vector("Spatial Selection", {
					displayInLayerSwitcher: false,
                    styleMap: new OpenLayers.StyleMap({
                        'default': style
                    })
				});
				
                this.spatialSelection.events.register("beforefeatureadded", this, function(){                    
					// //////////////////////////////////////////////////////
					// reset the buffer field when the geometry has changed
                    // the preventBufferReset is needed to avoid resetting it 
					// when the buffered feature is added
					// //////////////////////////////////////////////////////
                    if(!this.spatialSelection._addingBufferedFeature) {
                        this.formPanel.bufferField.reset();
                        
                        // //////////////////////////////////////////////////////
                        // Remove the old features before drawing other features
                        // ..if we are not adding the "buffered" version
                        // //////////////////////////////////////////////////////
                        this.spatialSelection.removeAllFeatures();
                    } else {
                        for(var i = 0; i < this.spatialSelection.features.length; i++) {
                            var feature = this.spatialSelection.features[i];
                            if(feature.attributes.isBuffered) this.spatialSelection.removeFeatures([feature]);
                        }
                    }
				});
                
				this.spatialSelection.events.register("featureadded", this, function(f){
					// //////////////////////////////////////////////////////
					// Check the form status: the buffer field shall be 
					// enabled here
					// //////////////////////////////////////////////////////
					this.updateFormStatus();
					
					this.addFeatureSummary(f.feature);
				});
				
                this.spatialSelection.events.register('featureremoved', this, function(f) {
					// //////////////////////////////////////////////////////
					// Remove the "unbuffered" copy of the feature
					// //////////////////////////////////////////////////////
                    delete this.unBufferedFeature;
					// //////////////////////////////////////////////////////
					// Check the form status: the buffer field shall be 
					// disabled here
					// //////////////////////////////////////////////////////
                    this.updateFormStatus();
					
					this.removeFeatureSummary();
                });
               
				var ev = map.events.register('addlayer', this, function(e){
					if( e.layer == this.spatialSelection ) 
						return;
					map.setLayerIndex(this.spatialSelection, map.layers.length - 1);
				});
				
				map.addLayers([this.spatialSelection]);
				
				this.drawControls = {
					polygon: new OpenLayers.Control.DrawFeature(this.spatialSelection,
						OpenLayers.Handler.Polygon),
					circle: new OpenLayers.Control.DrawFeature(this.spatialSelection,
						OpenLayers.Handler.RegularPolygon, {handlerOptions: {sides: 30}}),
                    box: new OpenLayers.Control.DrawFeature(this.spatialSelection,
                        OpenLayers.Handler.RegularPolygon, {
                            handlerOptions: {
                                sides: 4,
                                irregular: true
                            }
                        }
                    )
				};
				
				for(var key in this.drawControls) {
					this.target.mapPanel.map.addControl(this.drawControls[key]);
				}
				
				if (!this.wpsClusterManager){
				    this.wpsClusterManager = new gxp.plugins.WPSClusterManager({
                        id: "DownloadPanelwpsClusterManager",
                        url: this.wpsUrl
                    });
				}
                
                this.featureManager = this.target.tools[this.featureManager];
                this.featureManager.on({
                    scope: this,
                    layerchange: function(fm, record, schema) {
                        this.createVectorFilterForm(record, schema);
                        this.hideMask();
                    }
                });
                
				// //////////////////////////////////////////////
                // Register the toogle event on all the map tools 
				// with a toggleGroup on toggle, deactivate the 
				// selection mode.
                // ///////////////////////////////////////////////
				this.target.toolbar.items.each(function(item) {
                    if(item.toggleGroup) {
                        item.on({
                            scope: this,
                            toggle: function(tool, toggle) {
                                if(toggle) {                                   
									// Reset does not fire the select event
                                    //this.formPanel.selectionMode.fireEvent('select', this.formPanel.selectionMode);
									this.toggleControl(null, false);									
                                }
                            }
                        });
                    }
                }, this);
				
				//
				// The tool is ready for the usage.
				// 
				this.fireEvent("ready");
			},
			scope: this
		});
        
		return gxp.plugins.DownloadPanel.superclass.init.apply(this, arguments);
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
    getArea: function(geometry, units) {
        var area, geomUnits;
		area = geometry.getGeodesicArea(this.target.mapPanel.map.getProjectionObject());
		geomUnits = "m";

        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
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
    getLength: function(geometry, units) {
        var length, geomUnits;
		length = geometry.getGeodesicLength(this.target.mapPanel.map.getProjectionObject());
		geomUnits = "m";
        
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            length *= (inPerMapUnit / inPerDisplayUnit);
        }
        return length;
    },
	
   /**
	* api: method[removeFeatureSummary]
	*/
	removeFeatureSummary: function(){
		if(this.featureSummary){
			this.featureSummary.destroy();
		}		
	    
		var map = this.target.mapPanel.map;
		var layer = map.getLayersByName("circleCentroidLayer")[0];
		if(layer){
            map.removeLayer(layer);
		}
	},
	
	/**
     * Property: selectStyle
     * {Object} Configuration of OpenLayer.Style. 
     *    used to highlight the circle center point
     *     
     */
    selectStyle: {
        pointRadius: 4,
        graphicName: "cross",
        fillColor: "#FFFFFF",
        strokeColor: "#FF0000",
        fillOpacity: 0.5,
        strokeWidth: 2
    },
	
	/**
	* api: method[addFeatureSummary]
	*/
	addFeatureSummary: function(feature){		
		this.removeFeatureSummary();
		
		var summary = "", metricUnit = "km";
		
		var geom = feature.geometry;
		if(!(geom instanceof OpenLayers.Geometry.Point) &&
			!(geom instanceof OpenLayers.Geometry.LineString)){
				var area = this.getArea(feature.geometry, metricUnit);
				if(area){
					summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
				}
		}
		
		var selectionType = this.formPanel.selectionMode.getValue();
		switch(selectionType){
			case 'polygon':
			case 'box':
			case 'place':
				var perimeter = this.getLength(feature.geometry, metricUnit);
				if(perimeter){
					summary += this.perimeterLabel + ": " + perimeter + " " + metricUnit + '<br />';
				}
				break;
			case 'circle':
				var radius = Math.sqrt(area/Math.PI);
				if(radius){
					summary += this.radiusLabel + ": " + radius + " " + metricUnit + '<br />';
				}
				
				// //////////////////////////////////////////////////////////
				// Draw also the circle center as a part of summary report
				// //////////////////////////////////////////////////////////
				var circleSelectionCentroid = feature.geometry.getCentroid();
				
				if(circleSelectionCentroid){
					summary += this.centroidLabel + ": " + circleSelectionCentroid.x + "(Lon) " + circleSelectionCentroid.y + "(Lat)" +'<br />';
				}
				
				var options = {};
				if(this.selectStyle){
					var style = new OpenLayers.Style(this.selectStyle);
					var options = {styleMap: style};
				}

				var circleCentroidLayer = new OpenLayers.Layer.Vector("circleCentroidLayer", options);

				var pointFeature = new OpenLayers.Feature.Vector(circleSelectionCentroid);
				circleCentroidLayer.addFeatures([pointFeature]);
				
				circleCentroidLayer.displayInLayerSwitcher = false;
				this.target.mapPanel.map.addLayer(circleCentroidLayer);  
				
				break;				
		}
		
		this.featureSummary = new Ext.ToolTip({
			xtype: 'tooltip',
			target: Ext.getBody(),
			html: summary,
			title: this.selectionSummary,
			autoHide: false,
			closable: true,
			draggable: false,
			mouseOffset: [0, 0],
			showDelay: 1,
			listeners: {
				scope: this,
				hide: function(cmp) {
					this.featureSummary.destroy();
				}
			}
		});			
		
		var vertex = feature.geometry.getVertices()
		var lastPoint = vertex[vertex.length - 1];
		
		var px = this.target.mapPanel.map.getPixelFromLonLat(new OpenLayers.LonLat(lastPoint.x, lastPoint.y));			
		var p0 = this.target.mapPanel.getPosition();
		
		this.featureSummary.targetXY = [p0[0] + px.x, p0[1] + px.y];
		this.featureSummary.show();
	},

	/**
	* api: method[buildLayerWPSUrl]
	*
	* This method to use the specific layer's URL for WPS requests
	*/
	buildLayerWPSUrl: function(url){
		var newURL = url;
		
		if(url.indexOf("?") != -1){
			url = url.split("?")[0];
		}
		
		newURL = url.replace(/\/wms/g, "/ows");
		newURL = newURL.concat("?service=WPS");
		
		this.wpsClusterManager.setWPSClient(newURL);
		
		return newURL;
	},
	
	/** private: method[setLayer]
	 * 
	 *  Private method to select a layer from the layer from external APIs. 
     */
	setLayer: function(record){
	    this.resetForm();
		
		this.reloadLayers();
		var layerName = record.get("name");
		
	    var layerTree = Ext.getCmp("layertree");
		layerTree.contextMenu.hide();
		
		//var westPanel = Ext.getCmp("west");
		//westPanel.setActiveTab(this.formPanel);
	
		this.formPanel.layerCombo.setValue(layerName);
		
		var selectedLayerRecordIndex = this.layerStore.find("name", layerName);
		var selectedLayerRecord = this.layerStore.getAt(selectedLayerRecordIndex);
		
		this.formPanel.layerCombo.fireEvent("select", this.formPanel.layerCombo, selectedLayerRecord, selectedLayerRecordIndex);
	},
	
	/** public: method[setExecutionId]
	 * 
	 *  Public method to load the provided executioId into the Grid and follow the status. 
     */
	setExecutionId: function(executionId){
		if(executionId){
			this.showMask();			
			
			var statusLocationURL = this.wpsUrl + "&request=GetExecutionStatus&executionId=" + executionId;

			this.requestRemoteProcessStatus(statusLocationURL, function(processExecId, response){
				var executeStatusResponse = new OpenLayers.Format.WPSExecute().read(response);
				var executeResponse = executeStatusResponse.executeResponse;
				
				if(executeResponse){
					var data = {
						name: '',
						executionId: '',
						executionStatus: '',
						description: '',
						statusLocation: ''
					};

					//
					// The process name 
					//
					data.name = executeResponse.process.identifier;
					
					//
					// The process execution id
					//
					if(executeResponse.statusLocation){
						data.statusLocation = executeResponse.statusLocation;
						
						var getParams = executeResponse.statusLocation.split("?");
						if(getParams.length > 1){
							var params = Ext.urlDecode(getParams[1]);
							if(params.executionId){
								data.executionId = params.executionId;
							}
						}
					}
					
					//
					// The process description
					//
					data.description = executeResponse.process.abstract;
					
					//
					// The process execution status
					//
					switch(executeResponse.status.name){
						case 'Process Started':
						//case 'Process Running':
						//case 'Process Queued':
						case 'Process Accepted':
						case 'Process Paused':
						case 'Process Failed':
						case 'Process Succeeded':
							data.executionStatus = executeResponse.status.name.replace('Process ', '');
							break;
						default:
							data.executionStatus = executeResponse.status.name;
							break;
					}
					
					if(data.executionStatus == 'Failed'){
						var report = executeStatusResponse.executeResponse.status.exception.exceptionReport;
						data.result = report.exceptions[0].texts[0];
					}else if(data.executionStatus == 'Succeeded'){
						data.result = executeStatusResponse.executeResponse.processOutputs[0].reference.href;
						data.progress = executeStatusResponse.executeResponse.status.percentCompleted;
					}
					
					if(data.executionId){													
						var store = this.resultPanel.getStore();
						var record = new store.recordType(data); // create new record
						
						var recordIndex = store.find("executionId", data.executionId); 
						
						//
						// The process record is added only if missing inside the Grid
						//
						if(recordIndex == -1){
							store.add(record);
									
							var task2 = new Ext.util.DelayedTask(this.startRunner, this, [false]);
							task2.delay(1500);	
						}else{
							Ext.Msg.show({
								title: this.executionIdField,
								msg: this.executionIdPresentErrorMsg,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.INFO
							});
						}	
					}else{
						Ext.Msg.show({
							title: this.executionIdField,
							msg: this.executionIdEmptyErrorMsg,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.INFO
						});
					}	
				}else{
					Ext.Msg.show({
						title: this.processExecutions,
						msg: this.processExecutionEmpty,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.INFO
					});
				}
				
				this.hideMask();
			});
		}
	},
	
	/** private: method[reloadLayers]
	 * 
	 *  When the Layers Combo Box is expanded the function provides the Store 
	 *  synchronization with other WMS possibly added in the meantime. 
     */
	reloadLayers: function(callback){
		
        // /////////////////////////////////////////////////
        // Store the checks that will be done on the layer
        // It contains check for layertype (wcs, wfs)
        // and the availability of the download process
        // It's here because the layerCombo store is
        // loaded every time is expanded
        // /////////////////////////////////////////////////
        if(!this.layersAttributes) this.layersAttributes = {};

		var data = []; 
		if(this.layersFromAllCapabilities){
			// /////////////////////////////////////////////////
			// The code below allows layers selection from all 
			// loaded sources of type 'gxp_wmssource'.
			// /////////////////////////////////////////////////
			
			var source; 
			var layerSources = this.target.layerSources;
			
			for (var id in layerSources) {
				source = layerSources[id];
				
				// //////////////////////////////////////////////
				// Slide the array of WMS and concatenates the 
				// layers Records for the Store
				// //////////////////////////////////////////////
				switch(source.ptype){
					case "gxp_mapquestsource": continue;
					case "gxp_osmsource": continue;
					case "gxp_googlesource": continue;
					case "gxp_bingsource": continue;
					case "gxp_olsource": continue;
					case "gxp_wmssource": 
						var store = source.store;
						if (store) {
							var records = store.getRange();

							var size = store.getCount();
							for(var i=0; i<size; i++){
								var record = records[i]; 
								var sourceId = id;								
								data = this.buildLayerRecord(data, record, sourceId);
							}              
						}
				}
			}
		}else{
			// /////////////////////////////////////////////////
			// The code below allows layers selection only from 
			// overlays in layetree.
			// /////////////////////////////////////////////////
			
			var overlays = this.target.mapPanel.layers;
			var size = overlays.getCount();		
			var records = overlays.getRange();
			
			for(var i=0; i<size; i++){
				var record = records[i];	
				
				var group = record.get("group");
				var name = record.get("name");			
				var sourceId = record.data.source;		
				
				if (group !== "background" && name) {
					data = this.buildLayerRecord(data, record, sourceId);
				}
			}
		}

		this.layerStore.removeAll();
		this.layerStore.loadData(data, false);
	},
	
    /** private: method[buildLayerRecord]
	 * 
	 *  Create the layer record for layers combobox.
     */
	buildLayerRecord: function(data, record, sourceId){		
		if(record){	
			var bbox = record.get("bbox");
			
			var srs;
			for(var crs in bbox){
				srs = bbox[crs].srs;
				break;
			}
			
			var recordData = [sourceId, record.data.title, record.data.name, record.id, srs, record.data.uuid, record.data.gnURL];
			
			if(this.layersAttributes[record.id]) {
				recordData.push(this.layersAttributes[record.id].wcs);
				recordData.push(this.layersAttributes[record.id].wfs);
				recordData.push(this.layersAttributes[record.id].wpsdownload);
			} else {
				this.layersAttributes[record.id] = {wcs: false, wfs: false, wpsdownload: false};
				
				// ////////////////////////////////////////////////////
				// The keyword control is necessary in order         //
				// to markup a layers as Raster or Vector in order   //
				// to set a proper format in the 'Format' combo box. //
				// ////////////////////////////////////////////////////
				
				var keywords = record.get("keywords");								
				if(keywords){
					if(keywords.length == 0){
						recordData.push(false); // wcs
						recordData.push(false); // wfs
						recordData.push(false); // wpsdownload
						recordData.push(true);  // isLayerGroup
					}else{
						for(var k=0; k<keywords.length; k++){
							var keyword = keywords[k].value || keywords[k];
							
							if(keyword.indexOf("WCS") != -1){
								recordData.push(true);
								break;
							}                       
						}
					}
				}
			}
			
			data.push(recordData);  
		}

		return data;		
	},
	
	/** private: method[resetForm]
	 * 
	 *  Allows the possibility to reset the internal Form.
     */
	resetForm: function(){
		this.toggleControl(null, true);
		this.formPanel.getForm().reset();
		this.updateFormStatus();
		
		if(!this.spatialSettings.collapsed)
			this.spatialSettings.collapse();			
				
		this.formPanel.crsFieldset.infoBtn.disable();
	},
	
    /** private: method[toggleControl]
     *  :arg element: ``Object``
	 * 
	 *  Defines the behavior of the tool's controls enablement when the Radio is checked. 
     */
	toggleControl: function (value, resetForm) {
		// ////////////////////////////////////////////////
		// Remove the old features before switching OL 
		// selection control.
		// ////////////////////////////////////////////////
		if(resetForm === true){
			if(this.spatialSelection)
				this.spatialSelection.removeAllFeatures();
			this.formPanel.bufferField.reset();
			//this.formPanel.crsCombo.reset();

			/*if(value == 'place') {
				this.formPanel.placeSearch.show();
			} else {
				this.formPanel.placeSearch.hide();
			}*/
		}
		
        var toolActivated = false;
        for(key in this.drawControls) {
            var control = this.drawControls[key];
            if(value == key) {
                control.activate();
                toolActivated = true;
				
				this.activatedDrawControl = control;
            } else {
                control.deactivate();
            }
        }
        
		//
        // If a draw tool has been activated, deactivate other "toggleGroup" tools.
        //
		if(toolActivated) {
            this.target.toolbar.items.each(function(item) {
                if(item.toggleGroup) item.toggle(false);
            });
        }
	},
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
	 * 
	 *  Contains the output definitions of the download FormPanel. 
     */
    addOutput: function(config) {
		// /////////////////////////////////////
		// Stores Array stores definitions.
		// /////////////////////////////////////
		this.layerStore = new Ext.data.ArrayStore({
			fields: ["source", "title", "name", "olid", "crs", "uuid", "gnURL", {name: "wcs", type: 'boolean'}, {name: "wfs", type: 'boolean'}, {name: "wpsdownload", type: 'boolean'}, {name: "isLayerGroup", type: 'boolean'}],
			data: []
		});
			
		this.crsStore = new Ext.data.ArrayStore({
			fields: ["name", "code", "type", "subcode"],
			data: this.targetCSR
		});
		
		this.formatStore = new Ext.data.ArrayStore({
			fields: ["format", "title", "name"],
			data: this.formats.wfs.concat(this.formats.wcs)
		});
		
		// /////////////////////////////////////
		// FieldSet definitions.
		// /////////////////////////////////////
		this.laySel = new Ext.form.FieldSet({
			title: this.dselTitle,
			items: [
				{
					xtype: "combo",
					ref: "../../layerCombo",
					fieldLabel: this.dselLayer,
					lazyInit: true,
					width: 140,
					mode: 'local',
					triggerAction: 'all',
					store: this.layerStore,
					displayField: 'name',
					emptyText: this.readOnlyLayerSelection === true ? "" : this.initialText,
					labelSeparator: ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
					editable: true,
					resizable: true,
					allowBlank: false,
					readOnly: this.readOnlyLayerSelection, 
					listeners:{
					    scope: this,
						keyup : function(field){
						    var me = this, value = field.getValue();
					
                            if(me.layerTimeout) clearTimeout(me.layerTimeout);
                                
                            if(value) {
                                me.layerTimeout = setTimeout(function() {
									me.layerStore.filterBy(function(rec, recId){
										var name = rec.get("name").trim().toLowerCase();
										if(name.indexOf(value) > -1){
											me.formPanel.layerCombo.expand();
											return true;
										} else {
											return false;
										}
									});  
                                }, 100);
                            } else {
								me.layerStore.clearFilter();
							}		
						},
						beforeselect: function(combo, record, index){
							this.resetForm();
						},
						select: function(combo, record, index){		

							// ////////////////////////////////////////////////
							// Customize the Native CRS record definition. 
							// Native Record must be the first.
							// ////////////////////////////////////////////////
							
							var crsCombo = this.formPanel.crsFieldset.crsCombo;
							var crsComboStore = crsCombo.getStore();
							var crs = record.get("crs"); 
							
							// ///////////////////////////
							// Find CRS duplicates before
							// ///////////////////////////
							var dIndex = crsComboStore.find("code", crs);
							if(dIndex > 0){
								var r = crsComboStore.getAt(dIndex);	
								crsComboStore.remove(r);
							}
							
							// Leave the first unique element
							var crsRecord = crsComboStore.getAt(0);	
							if(crsRecord.get("code") != "" && crsRecord.get("code") != crs){
								var r = Ext.data.Record.create([
									{name: "name"},
									{name: "code"},
									{name: "type"},
									{name: "subcode"}
								]);
								
								crsComboStore.add(new r({
									name: crsRecord.get("code"),
									code: crsRecord.get("code"),
									type: crsRecord.get("type"),
									subcode: crsRecord.get("subcode"),
								}));
							}
							
							// Replace the firse element with the new native crs
							crsRecord.set("name", "Native - " + crs);
							crsRecord.set("code", crs);
							crsRecord.set("type", "epsg");
							crsRecord.set("subcode", crs.replace("EPSG:", ""));
							
						    // ////////////////////////////////////////
							// Remove the previous selected layer, 
							// from this tool if exists.
							// ////////////////////////////////////////
							if(this.selectedLayer && this.removePreviousLayerOnSelection){
								this.target.mapPanel.layers.remove(this.selectedLayer);
							}
							
							// //////////////////////////////////////////////////
							// Remove the layer from the map if 'name' and 
							// 'source' are the same, in order to avoid duplicate.
							// The layer will be re-added to the map from the 
							// Downlaod tool. 
							// In this way the user can view the selected layer
							// on top.
							// //////////////////////////////////////////////////
							
							var layerStore = this.target.mapPanel.layers;  
							var index = layerStore.findExact("name", record.data.name);
							if (index > -1) {
								var original = layerStore.getAt(index);
							
								if(original.get('source') == record.data.source){
									layerStore.remove(original);
								}
							}
                            
                            if(!record.get('wpsdownload')) this.checkWpsDownload(record);
        
							// ////////////////////////////
							// Add the new selected layer.
							// ////////////////////////////
							var addLayer = function(record, layerType) {							
                                var options = {
                                    msLayerTitle: record.data.title,
                                    msLayerName: record.data.name,
                                    source: record.data.source,
									msLayerUUID: record.data.uuid,
									gnUrl: record.data.gnURL,
                                    customParams: {
                                        wcs: (layerType == 'WCS')
                                    }
                                };
                                
                                this.addLayerTool.addLayer(
                                    options
                                );
                                
                                this.updateFormStatus();
                                
                                this.formPanel.downloadButton.enable();
                                this.formPanel.resetButton.enable();
                                this.formPanel.resultPanel.refreshButton.enable();
                            };
                            
							// ///////////////////////////////////////////
                            // check the layer type, if it is unknown
                            // async because it may need to check for 
							// describeFeatureType and describeCoverage
                            // ///////////////////////////////////////////
                            if(!record.get('wcs') && !record.get('wfs')) {
                                this.getLayerType(record.data, function(layerType) {
                                    if(!layerType) {
                                        this.formPanel.downloadButton.disable();
                                        //this.formPanel.resetButton.disable();
                                        //this.formPanel.resultPanel.refreshButton.disable();
                                        return Ext.Msg.show({
                                            title: this.errUnknownLayerTypeTitle,
                                            msg: this.errUnknownLayerTypeMsg,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.Msg.INFO
                                        });
                                    }
                                    
                                    if(layerType == 'group') {
                                        this.formPanel.downloadButton.disable();
                                        return Ext.Msg.show({
                                            title: this.errLayerGroupTypeTitle,
                                            msg: this.errLayerGroupTypeMsg,
                                            buttons: Ext.Msg.OK,
                                            icon: Ext.Msg.INFO
                                        });
                                    }

                                    record.set('wcs', (layerType == 'WCS'));
                                    this.layersAttributes[record.get('olid')].wcs = (layerType == 'WCS');
                                    record.set('wfs', (layerType == 'WFS'));
                                    this.layersAttributes[record.get('olid')].wfs = (layerType == 'WFS');
                                    
                                    addLayer.call(this, record, layerType);
                                }, this);
                            } else {
                                addLayer.call(this, record, (record.get('wcs') ? 'WCS' : 'WFS'));
                            }
						},
						beforequery: function(){
							this.reloadLayers();
						}
					}
				}, {
					xtype: "combo",
					ref: "../../formatCombo",
					fieldLabel: this.dselFormat,
					width: 140,
				    mode: 'local',
					triggerAction: 'all',
					store: this.formatStore,
					displayField: 'title',
					valueField: 'format',
					emptyText: this.initialText,
					editable: false,
					resizable: true,
					labelSeparator: ':' + '<span style="color: #918E8F; padding-left: 2px;">*</span>',
					allowBlank: false,
					listeners:{
					    select: {
					        scope: this,
					        fn: function(combo){
					            // GPX and KML only supported format is EPSG:4326
					            if(combo.getValue() == 'application/vnd.google-earth.kml+xml'
                                    || combo.getValue() == 'application/gpx+xml') {
									
					                this.formPanel.crsFieldset.crsCombo.setValue("EPSG:4326");
									
									var crsComboStore = this.formPanel.crsFieldset.crsCombo.getStore();
									var idx = crsComboStore.find("name", "EPSG:4326");
									
									if(idx > -1){
										this.selectedCRSRecord = crsComboStore.getAt(idx);
									}
									
                                    this.formPanel.crsFieldset.crsCombo.setReadOnly(true);
                                    this.formPanel.crsFieldset.infoBtn.enable();
					            }else{
                                    this.formPanel.crsFieldset.crsCombo.setReadOnly(false);
					            }
					        }
					    }
					}
				}, {
					xtype: "label",
					cls: "labelField",
					text: this.requiredFieldsLabel
				}
			]
		});
        
        /*this.placeSearch = new gxp.GazetteerCombobox(Ext.apply({
            xtype: 'gazetteercombobox',
            fieldLabel: this.placeSearchLabel,
			hidden: true,
            disabled: true,
			width: 140,
            ref: "../../placeSearch",
            listeners: {
                scope: this,
                'select': function(store, record) {
                    var feature = record.data.feature;
                    var bounds = feature.geometry.getBounds();
                    
                    this.spatialSelection.addFeatures([feature]);
                    
					//
                    // If the geometry is point, force the user to insert a buffer
                    //
					if(feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Point') {
                        var buffered = OpenLayers.Geometry.Polygon.createRegularPolygon(feature.geometry, 1000, 4);
                        bounds = buffered.getBounds();
                        this.formPanel.bufferField.allowBlank = false;
                    } else {
                        this.formPanel.bufferField.allowBlank = true;
                    }

                    this.target.mapPanel.map.zoomToExtent(bounds);
                }
            }
        }, this.gazetteerConfig));*/

		this.spatialSettings = new Ext.form.FieldSet({
			title: this.settingTitle,
			checkboxToggle: true,
            collapsed: true,
			listeners: {
				scope: this,
				expand: function(p){
					this.formPanel.selectionMode.setValue(null);
					this.formPanel.bufferField.setValue("");
					this.formPanel.cutMode.setValue(false);
				},
				collapse: function(){
					this.toggleControl(null, true);
				}
			},
			items: [
       			{       
                    xtype: "compositefield",
                    ref: "../../crsFieldset",
                    labelWidth: 110,
                    items: [
                        {
                            xtype: "combo",
                            ref: "crsCombo",
                            fieldLabel: this.dselCRS,
                            disabled: false,
                            width: 140,
                            mode: 'local',
                            triggerAction: 'all',
                            store: this.crsStore,
                            displayField: 'name',
                            valueField: 'name',
                            emptyText: this.initialText,
                            editable: true,
                            forceSelection: true,
                            resizable: true,
                            typeAhead: true,
                            typeAheadDelay: 3,
                            allowBlank: true,
                            listeners : {
                                select:{
                                    scope :this,
                                    fn :function(combo, record, index){
										this.selectedCRSRecord = record;
										
                                        if(combo.isValid() && combo.getValue() != "Native")
                                            this.formPanel.crsFieldset.infoBtn.enable();
                                        else
                                            this.formPanel.crsFieldset.infoBtn.disable();
                                    }
                                }
                            }
                        }, {
                            xtype: 'button',
                            ref:"infoBtn",
                            tooltip: this.infoBtnTooltip,
                            iconCls: "crsInfoButton",
                            disabled : true,
                            width: 23,
                            scope: this,
                            handler: function(){
							   var crs_record = this.selectedCRSRecord;
							   if(crs_record){
									var subcode = crs_record.get("subcode");
									var codetype = crs_record.get("type");
									window.open('http://www.spatialreference.org/ref/' + codetype + '/' + subcode + '/', '_blank');
							   }				   
                            }
                        }
                    ]
                },{
					xtype: 'combo',
					ref: "../../selectionMode",
					fieldLabel: this.settingSel,
					disabled: true,
					width: 140,
					allowBlank: true,
                    editable: false,
                    valueField: 'value',
                    displayField: 'text',
                    triggerAction: 'all',
                    mode: 'local',
                    value: null,
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [
                            [null, this.msgNone], ['box', this.msgBox], ['polygon', this.msgPolygon], ['circle', this.msgCircle]/*, ['place', this.msgPlace]*/
                        ]
                    }),
					listeners: {
						scope: this,
						select: function(combo){
							this.toggleControl(combo.getValue(), true);
                            this.updateFormStatus();
						}
					}
				},
				/*this.placeSearch,*/
				{
					xtype: "numberfield",
					ref: "../../bufferField",
					fieldLabel: this.bufferFieldLabel,
					width: 140,
                    enableKeyEvents: true,
                    disabled: true,
                    listeners: {
                        scope: this,
                        keyup: function(field) {
                            var me = this, value = field.getValue();

							//
                            // Whatever value, clear the timeouts
                            //
							if(me.bufferHideLoadMaskTimeout) clearTimeout(me.bufferHideLoadMaskTimeout);
                            if(me.bufferTimeout) clearTimeout(me.bufferTimeout);
                                
                            if(!value) {
								// ///////////////////////////////////////////////////////////////////////////////
                                // If value is empty and we have an unBufferedFeature stored, replace 
								// the buffered feature with the un-buffered one. 
								// The user deleted the buffer value, so he wants the original geometry back
                                // ///////////////////////////////////////////////////////////////////////////////
								if(me.unBufferedFeature) {
                                    this.spatialSelection.addFeatures([me.unBufferedFeature]);
                                }
                            } else {
								//
                                // Set a timeout to hide the loadmask if the buffer request fails
                                //
								me.bufferHideLoadMaskTimeout = setTimeout(function() {                                    
                                    me.loadMask.hide();
                                }, 30 * 1000);

                                me.bufferTimeout = setTimeout(function() {
                                    me.bufferSpatialSelection(value);
                                }, me.bufferRequestTimeout);
                            }
                        }
                    }
				},
                {
                    xtype: 'combo',
					ref: "../../cutMode",
                    disabled: true,
					fieldLabel: this.settingCut,
					valueField: 'value',
                    displayField: 'text',
                    triggerAction: 'all',
                    mode: 'local',
                    value: false,
                    width: 140,
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'text'],
                        data: [
                            [true, this.msgClip], [false, this.msgIntersection]
                        ]
                    })
                }
			]
		});
        
        this.vectorFilterContainer = new Ext.form.FieldSet({
            title: this.vectorFilterTitle,
            checkboxToggle: true,
            collapsed: true,
            hidden: true,
			listeners: {
				scope: this,
				expand: function(panel){
					//if(Ext.isIE){
						this.vectorFilterContainer.doLayout();
					//}
				}
			}
        });

        /*this.emailNotification = new Ext.form.FieldSet({
            title: this.emailNotificationTitle,
            ref: "../emailNotification",
            items: [
                {
                    xtype: "textfield",
                    vtype: "email",
                    allowBlank: false,
                    ref: "../../emailField",
                    fieldLabel: this.emailFieldLabel,
					width: 140
                }
            ]
        });*/
		
		//
        // Create the data store
        //
		var store = new Ext.data.ArrayStore({
            fields: [
			   {name: 'check', type: 'bool'},
               {name: 'id'},
			   {name: 'name'},
               {name: 'executionId'},
               {name: 'executionStatus'},
               {name: 'progress'},
               {name: 'result'}
            ]
        });
        
        var mydlp = this;
        this.resultPanel = new Ext.grid.GridPanel({
			ref: '../resultPanel',
            layout: 'fit',
            store: store,
			bbar: {
				xtype: 'toolbar',
				items: [
					'->',
					{
						tooltip: this.btnRefreshTxt,
						ref: '../refreshButton',
						cls: 'x-btn-text-icon',
						icon : 'theme/app/img/silk/arrow_refresh.png',
						scope: this,
						handler: function(){                           			
							store.each(function(r){
								this.updateRecord(r, true);
							}, this);
						}
					},
					{
						ref: '../deleteButton',
						tooltip: this.btnDeleteTxt,
						iconCls: 'delete',
						scope: this,
						handler: function(){                           
							var store = this.resultPanel.getStore();
							var records = store.getRange();
							var size = store.getCount();
							
							var checkedRecords = [];
							
							var pending = 0;
							for(var i=0; i<size; i++){
								var record = records[i];
								
								var checked = record.get("check");								
								if(checked){
									checkedRecords.push(record);
								}
								
								var executionStatus = record.get('executionStatus');								
								if(checked && !executionStatus || executionStatus == 'Started' || executionStatus == 'Accepted'){
									pending++;
								}
							}	
							
							if(checkedRecords.length > 0){
								if(pending > 0){                
									Ext.Msg.show({
									   title: this.msgRemRunningTitle,
									   msg: this.msgRemRunningMsg,
									   buttons: Ext.Msg.OKCANCEL,
									   fn: function(btn){
											if(btn == 'ok'){
												store.remove(checkedRecords);
												
												if(store.getCount() < 1){
													//this.resultFieldSet.processExecutionLabel.setText("");
												}
											} 
										},
									   icon: Ext.MessageBox.WARNING,
									   scope: this
									});                
								}else{                
									Ext.Msg.show({
									   title: this.msgRemTitle,
									   msg: this.msgRemMsg,
									   buttons: Ext.Msg.OKCANCEL,
									   fn: function(btn){
											if(btn == 'ok'){
												store.remove(checkedRecords);
											} 
										},
									   icon: Ext.MessageBox.QUESTION,
									   scope: this
									});
								}	
							}						
						}
					}
				]
			},
            columns: [
				{
					xtype: 'checkcolumn',
					header: '',
					dataIndex: 'check',
					width: 20
				}, {
                    id       : 'id',
                    header   : this.resID, 
                    width    : 30, 
                    hidden   : true, 
                    dataIndex: 'id'
                }, {
                    id       : 'name',
                    header   : "Name", 
                    width    : 30, 
                    hidden   : true, 
                    dataIndex: 'name'
                }, {
                    id       : 'executionId',
                    header   : this.resExecID, 
					hidden   : true,
                    width    : 45, 
                    sortable : true, 
                    dataIndex: 'executionId'
                }, {
                    id       : 'executionStatus',
                    header   : this.resProcStatus, 
					hidden   : true,
                    width    : 63, 
                    dataIndex: 'executionStatus',
					renderer:  function (val, obj, record) {
						if(!val)
							return;
						if(val != 'Failed' && record.data.executionStatus){
							return Ext.util.Format.capitalize(record.data.executionStatus);
						}
						return val;
					}
                }, {
                    xtype: 'actioncolumn',
                    header: this.resProcStatus, 
                    width: 36,
                    items: [{
						getClass: function(v, meta, rec) {
							var tooltip = '', icnClass='decline';
							var execStatus = rec.get('executionStatus');

							switch(execStatus){
								case 'Started':
									icnClass = 'loading';
									tooltip = mydlp.msgTooltipExecuting;
									break;
								case 'Accepted':
									icnClass = 'loading';
									tooltip = mydlp.msgTooltipAccepted;;
									break;
								case 'Paused':
									icnClass = 'decline';
									tooltip = mydlp.msgTooltipPending;
									break;
								case 'Failed':
									icnClass = 'decline';
									tooltip = mydlp.msgTooltipFailed;
									break;
								case 'Succeeded':
									icnClass = 'accept';
									tooltip = mydlp.msgTooltipSuccess;
									break;
								default:
									icnClass = 'loading';
									break;
							}
							
							this.items[0].tooltip = tooltip;
							return icnClass;
						}
                    }]
                }, {
                    xtype: 'actioncolumn',
                    header: this.resDelete, 
                    width: 57,
                    hidden: false,
					scope: this,
                    items: [{
                        iconCls: 'reset',
                        tooltip: this.resDelete,
                        handler: this.deleteHandler,
						scope: this
                    }]
                }, {
                    id       : 'progress',
                    header   : this.resProgress, 
                    width    : 79, 
                    sortable : true, 
                    dataIndex: 'progress'
                }, {
					id       : 'result',
                    header: this.resResult, 
                    width: 53,
                    dataIndex: 'result',
                    renderer: function (val, obj, record) {
						if(!val){
							return;
						}else{		
							//
							// Regular expression to check if we have a valid URL
							//
							var regex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;							
							if(regex.test(val)){
								return '<a href="' + val + '" target="_blank" /><img src="theme/app/img/download.png" /></a>';
							}else{
							    var message = mydlp.wpsErrorMsg;
								var val = val.replace(/[\n\r]/g, ' ');
							    var html = '<img src="theme/app/img/error.png" onclick="Ext.Msg.show({title: \'Failed\', msg: &quot;' + message + ' -  ' + val + '&quot;, buttons: Ext.Msg.OK, icon: Ext.Msg.ERROR});"/>'; 								
								return html;
							}
						}
					}
                }, {
                    xtype: 'actioncolumn',
                    header: this.showExecutionIdText, 
                    width: 57,
                    hidden: false,
					scope: this,
                    items: [{
                        iconCls: 'exec-id',
                        tooltip: this.showExecutionIdText,
                        handler: function(grid, rowIndex, colIndex) {
							var store = grid.getStore();
							var rec = store.getAt(rowIndex);
																	
							var showIdForm = new Ext.form.FormPanel({
								items: [
									{
										xtype: 'textfield',
										selectOnFocus: true,
										allowBlank: false,
										fieldLabel: this.processIdentifierText,
										value: rec.get("executionId")
									}
								],
								bbar: ["->", {
									text: this.closeText,
									scope: this,
									handler: function(){
										showIdWindow.destroy();
									}
								}]
							});
							
							var showIdWindow = new Ext.Window({
								title: this.downloadIdTitle,
								width: 300,
								modal: true,
								items: [
									showIdForm
								]
							});
							
							showIdWindow.show();
						},
						scope: this
                    }]
                }
            ],
			listeners:{
				scope: this,
				rowclick: function(grid, rowIndex, evt){
					/*var selectedProcessId = grid.getStore().getAt(rowIndex).get("executionId");
					if(selectedProcessId){
						this.resultFieldSet.processExecutionLabel.setText(this.selectedProcessIdString + grid.getStore().getAt(rowIndex).get("executionId"));
					}else{
						this.resultFieldSet.processExecutionLabel.setText(this.selectedProcessIdString + this.selectedProcessIdStringUndef);
					}*/
				}
			},
            height: 300,
            title: this.resTitle,
            scope: this
        });
		
		this.executionIdField = new Ext.form.CompositeField({		
			labelWidth: 110,
			items: [
                {
                    xtype: 'textfield',
					ref: "idField",	
					width: 140,
					fieldLabel: this.executionIdField,
                    emptyText: this.executionIdFieldEmptyText,
                    flex: 1
                }, {
                    xtype: 'button',
                    tooltip: this.executionIdFieldTooltip,
                    iconCls: "execution-cls",
                    width: 23,
					scope: this,
					handler: function(){
						var execId = this.executionIdField.idField.getValue();						
						this.setExecutionId(execId);
					}
                },{
                    xtype: 'button',
                    tooltip: this.executionIdFieldTooltipDelete,
                    iconCls: "execution-cls-delete",
                    width: 23,
					scope: this,
					handler: function(){
						this.executionIdField.idField.reset();
					}
				}
			]
		});
		
	    this.executionIdFieldSet = new Ext.form.FieldSet({
            title: this.processExecutionsLoadText,
			style:{
				marginTop: "10px"
			},
		    checkboxToggle: true,
            collapsed: true,
			items: [
				this.executionIdField
			]
        });
	    
	    this.resultFieldSet = new Ext.form.FieldSet({
            title: this.processExecutions,
			autoHeight: 342,
			items: [
				/*{
					xtype: "label",
					ref: 'processExecutionLabel',
					cls: "labelField",
					style:{
						marginBottom: "10px"
					},
					text: ""
				},*/
				this.resultPanel,
				this.executionIdFieldSet
			]
        });
		
		// /////////////////////////////////////
		// FormPanel definition
		// /////////////////////////////////////
		var downloadForm = new Ext.form.FormPanel({
			title: this.tabTitle,
			region: 'center',
			labelWidth: 110,
			monitorValid: true,
			items:[
				{
					xtype: "fieldset",
					title: this.downloadFormFieldSetTitle,
					items: [
						this.laySel,
						//this.emailNotification,
						this.spatialSettings,
						this.vectorFilterContainer
					],
					buttons:[
						{
							text: this.btnResetTxt,
							tooltip: this.btnResetTxt,
							ref: '../../resetButton',
							cls: 'x-btn-text-icon',
							icon :'theme/app/img/silk/application_form_delete.png',
							scope: this,
							handler: function(){
								// ////////////////////////////////////////
								// Remove the previous selected layer, 
								// from this tool if exists.
								// ////////////////////////////////////////
								if(this.selectedLayer && this.removePreviousLayerOnSelection){
									this.target.mapPanel.layers.remove(this.selectedLayer);
								}
								
								// ///////////////////
								// Reset From fields.
								// ///////////////////
								this.resetForm();
							}
						}, {
							text: this.btnDownloadTxt,
							tooltip: this.btnDownloadTxt,
							type: 'submit',
							ref: '../../downloadButton',
							cls: 'x-btn-text-icon',
							icon:'theme/app/img/download.png',
							handler: function(){
								var layerCombo = downloadForm.layerCombo.isValid();
								var crsCombo = downloadForm.crsFieldset.crsCombo.isValid();
								var formatCombo = downloadForm.formatCombo.isValid();
								var selectionMode = downloadForm.selectionMode.isValid();
								var bufferField = downloadForm.bufferField.isValid();
								var cutMode = downloadForm.cutMode.isValid();									
								var isValid = layerCombo && crsCombo && formatCombo && 
									selectionMode  && cutMode && bufferField;
								
								if(!isValid){
									Ext.Msg.show({
										title: this.errMissParamsTitle,
										msg: this.errMissParamsMsg,
										buttons: Ext.Msg.OK,
										icon: Ext.Msg.INFO
									});
									return;
								}
								
								var requestFunction = function() {
									var asreq = this.getAsyncRequest(downloadForm);
									
									this.showMask();
									
									this.wpsClusterManager.execute('gs:Download', asreq, this.executeCallback, this);
									
									// //////////////////////////////////////////////////
									// Scrolling to the bottom of the panel to show the 
									// status progres in the Grid
									// //////////////////////////////////////////////////
									downloadForm.body.dom.scrollTop = 350;
								};

								this.submitNotificationsCheck('mail', requestFunction);
							},
							scope:this
						}
					]
				},
				this.resultFieldSet
			]
		});
		
		this.formPanel = downloadForm;
        
		var panel = gxp.plugins.DownloadPanel.superclass.addOutput.call(this, downloadForm);		
		panel.autoScroll = true;

		return panel;
    },
    
	submitNotificationsCheck: function(cmp, callback){
		if(cmp == 'mail'){
			//
			// Check the email notification field
			//
			/*if(!this.formPanel.emailField.isValid()) {
				Ext.Msg.show({
					title: this.msgEmptyEmailTitle,
					msg: this.msgEmptyEmailMsg,
					buttons: Ext.Msg.YESNO,
					fn: function(btnValue) {
						if(btnValue == 'yes') {
							this.submitNotificationsCheck('filter', callback);
						}
					},
					scope: this,
					animEl: 'elId',
					icon: Ext.MessageBox.QUESTION
				});
			}else{*/
				this.submitNotificationsCheck('filter', callback);
			//}
		}
		
		if(cmp == 'filter'){
			// ////////////////////////////////////////////////
			// Check the filter field if it's checked but 
			// invalid, ask the user to confirm the operation 
			// without the filter.
			// ////////////////////////////////////////////////
			if(this.vectorFilterContainer.checkbox.getAttribute('checked') && !this.formPanel.filterBuilder.getFilter()) {
				Ext.Msg.show({
					title: this.msgEmptyFilterTitle,
					msg: this.msgEmptyFilterMsg,
					buttons: Ext.Msg.YESNO,
					fn: function(btnValue) {
						if(btnValue == 'yes') {
							this.submitNotificationsCheck('CRS', callback);
						}
					},
					scope: this,
					animEl: 'elId',
					icon: Ext.MessageBox.QUESTION
				});
			}else{
				this.submitNotificationsCheck('CRS', callback);
			}
		}
		
        if(cmp == 'CRS'){
            // ////////////////////////////////////////////////
            // Check the filter field if it's checked but 
            // the selected CRS is not compatible with the output format,
            // ask the user to confirm the operation without the filter.
            // ////////////////////////////////////////////////
            if(this.spatialSettings.checkbox.getAttribute('checked') && 
                (this.formPanel.formatCombo.getValue() == "application/vnd.google-earth.kml+xml" ||  this.formPanel.formatCombo.getValue() == "application/gpx+xml") &&
                this.formPanel.crsFieldset.crsCombo.getValue() != "EPSG:4326" ) {
                Ext.Msg.show({
                    title: this.msgWrongCRSTitle,
                    msg: this.msgWrongCRSMsg,
                    buttons: Ext.Msg.YESNO,
                    fn: function(btnValue) {
                        if(btnValue == 'yes') {
                            this.submitNotificationsCheck('spatial', callback);
                        }
                    },
                    scope: this,
                    animEl: 'elId',
                    icon: Ext.MessageBox.QUESTION
                });
            }else{
                this.submitNotificationsCheck('spatial', callback);
            }
        }

		if(cmp == 'spatial'){		
			if(this.spatialSettings.checkbox.getAttribute('checked') && 
				this.spatialSelection.features.length < 1 &&
				this.formPanel.selectionMode.value != null){
				Ext.Msg.show({
					title: this.errMissGeomTitle,
					msg: this.errMissGeomMsg,
					buttons: Ext.Msg.YESNO,
					fn: function(btnValue) {
						if(btnValue == 'no') {
							callback.call(this);
						}
					},
					scope: this,
					animEl: 'elId',
					icon: Ext.MessageBox.QUESTION
				});
			}else{
				callback.call(this);
			}
		}
	},
	
    /**
     * private: method[executeCallback]
     */        
    executeCallback: function(instanceOrRawData){
        this.hideMask();
		var executeResponse = instanceOrRawData.executeResponse;
		
		if(executeResponse){
			var data = {
				name: '',
				executionId: '',
				executionStatus: '',
				description: '',
				statusLocation: ''
			};

			//
			// The process name 
			//
			data.name = executeResponse.process.identifier;
			
			//
			// The process execution id
			//
			if(executeResponse.statusLocation){
			    data.statusLocation = executeResponse.statusLocation;
				data.executionId = this.getExecutionId(executeResponse.statusLocation)
			}
			
			//
			// The process execution status
			//
			switch(executeResponse.status.name){
				case 'Process Started':
				case 'Process Accepted':
				case 'Process Paused':
				case 'Process Failed':
				case 'Process Succeeded':
					data.executionStatus = executeResponse.status.name.replace('Process ', '');
					break;
				default:
					data.executionStatus = executeResponse.status.name;
					break;
			}
			
			//
			// The process description
			//
			data.description = executeResponse.process.abstract;
			
			data.progress = (executeResponse.status.percentCompleted || "0") + "%";

			var store = this.resultPanel.getStore();
			var record = new store.recordType(data); // create new record
			store.add(record);
					
			var task2 = new Ext.util.DelayedTask(this.startRunner, this, [false]);
			task2.delay(1500);
		}else{
			Ext.Msg.show({
			   title: this.processResponseErrorTitle,
			   msg: this.processResponseErrorMsg,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.WARNING
			});
		}		
    },
 
	/**
     * private: method[getAsyncRequest]
     */
    getAsyncRequest: function(dform){
    
        var crop = "false";
        var cropSel = dform.cutMode.getValue();
        
        if(cropSel)
            crop = cropSel;
        
        var layer = dform.layerCombo.getValue();
        
		var crs_record = this.selectedCRSRecord;
		
		var crs = "";
		if(crs_record){
			crs = crs_record.get("code");
			crs = crs.indexOf("EPSG:") != -1 ? crs : "";
		}
		
        var format = dform.formatCombo.getValue();
        
        var wkt, RoiCRS;
        var len = this.spatialSelection.features.length;
		
        if(len > 0){            
            var formatwkt = new OpenLayers.Format.WKT();
            
            // ///////////////////////////////////////////////
            // If there's more than a feature, one is the
            // original one, and the other is the buffered one
            // ///////////////////////////////////////////////
            if(len == 1) {
                var feature = this.spatialSelection.features[0];
            } else {
                for(var i = 0; i < len; i++) {
                    var feature = this.spatialSelection.features[i];
                    if(feature.attributes.isBuffered) break;
                }
            }
            
            var mapProj = this.target.mapPanel.map.getProjectionObject();
            
            var clone = feature.geometry.clone();
                                   
            var tf = new OpenLayers.Feature.Vector(clone);
            wkt = formatwkt.write(tf);
			
			RoiCRS = mapProj.getCode();
        }
		
        var request = {
            storeExecuteResponse: true,
            lineage:  true,
            status: true,
            inputs:{
                layerName : new OpenLayers.WPSProcess.LiteralData({value: layer}),
                outputFormat: new OpenLayers.WPSProcess.LiteralData({value: format}),
                targetCRS: new OpenLayers.WPSProcess.LiteralData({value: crs}),
				RoiCRS: new OpenLayers.WPSProcess.LiteralData({value: RoiCRS}),
                cropToROI: new OpenLayers.WPSProcess.LiteralData({value:crop})
            },
            outputs: [{
                identifier: "result",
				asReference: true,
                mimeType: "application/zip"
            }]
        };
		
		if(wkt){
			var selectionType = this.formPanel.selectionMode.getValue();
			if(selectionType == "box"){
				var isBuffered = this.formPanel.bufferField.isDirty();
				
				if(!isBuffered){
					var geometry = OpenLayers.Geometry.fromWKT(wkt);
					var bounds = geometry.getBounds();	
					
					//
					// Make a fine BBOX  WKT
					//					
					var rt = bounds.right + " " + bounds.top;
					var lb = bounds.left  + " " + bounds.bottom;
					var lt = bounds.left  + " " + bounds.top;
					var rb = bounds.right + " " + bounds.bottom;
					
					wkt = "POLYGON((" + lt + "," + rt + "," + rb + "," + lb + "," + lt + "))";
				}
			}
			
			request.inputs.ROI = new OpenLayers.WPSProcess.ComplexData({
				value: wkt,
				mimeType: "application/wkt"
			});
		}	
		
		var filter;
		if(dform.filterBuilder){
			filter = dform.filterBuilder.getFilter();
		}
        
        if(filter && this.vectorFilterContainer.checkbox.getAttribute('checked')) {
            var filterFormat = new OpenLayers.Format.Filter({version: this.ogcFilterVersion});
            var xmlFormat = new OpenLayers.Format.XML();
            var filterValue = xmlFormat.write(filterFormat.write(filter));
            // var format = new OpenLayers.Format.CQL();
            // var filterValue = format.write(filter);
            request.inputs['filter'] = new OpenLayers.WPSProcess.ComplexData({
					value: filterValue,
					mimeType: "text/xml; subtype=filter/1.1"
			});
        }
		
		/*var email = dform.emailField.getValue();

        if(dform.emailField.isValid() && email != ''){
            request.inputs['email'] = new OpenLayers.WPSProcess.LiteralData({value:email});
        }*/
        
        return request;
    },    
	
    deleteHandler: function(grid, rowIndex, colIndex) {
			var store = grid.getStore();
            var rec = store.getAt(rowIndex);
            
			var executionStatus = rec.get('executionStatus');
            if(!executionStatus || executionStatus == 'Accepted' || executionStatus == 'Started'){                
                Ext.Msg.show({
                   title: this.msgRemRunningTitle,
                   msg: this.msgRemRunningMsg,
                   buttons: Ext.Msg.OKCANCEL,
                   fn: function(btn){
                        if(btn == 'ok'){
							store.remove(rec);
						} 
                    },
                   icon: Ext.MessageBox.WARNING,
                   scope: this
                });                
            }else{                
                Ext.Msg.show({
                   title: this.msgRemTitle,
                   msg: this.msgRemMsg,
                   buttons: Ext.Msg.OKCANCEL,
                   fn: function(btn){
                        if(btn == 'ok'){
							store.remove(rec);
							//this.resultFieldSet.processExecutionLabel.setText("");
						} 
                    },
                   icon: Ext.MessageBox.QUESTION,
                   scope: this
                });
            }
			
            return false;
    },
    
    startRunner: function(){        
        var store = this.resultPanel.getStore();
        
		if(!this.runningTask){
			this.runningTask = Ext.TaskMgr.start({
				run: function(){
					store.each(function(r){
						this.updateRecord(r, false);
					}, this);
				},
				interval: 10000,
				scope: this
			}); 
		}       
    },
	
    stopRunner: function(){
        if(this.runningTask){
            Ext.TaskMgr.stop(this.runningTask);    
			this.runningTask = null;
		}
    },
    
    pendingRows: new Map(),
    
    updateRecord: function(r, force){        		
		var statusPhase = r.get('executionStatus');
		
        if((statusPhase != 'Failed' && statusPhase != 'Succeeded') || force){
			var statusLocation = r.get('statusLocation');
			r.beginEdit();
		
			var scope = this;
			this.requestRemoteProcessStatus(statusLocation, function(processExecId, response){
						
				if(processExecId && response){
					if(!scope.pendingRows.get(processExecId)){
						scope.pendingRows.set(processExecId, response);
					}			
					
					var executeStatusResponse = new OpenLayers.Format.WPSExecute().read(response);
					
					var report;
					if(executeStatusResponse.exceptionReport){
						report = executeStatusResponse.exceptionReport.exceptions[0].texts[0];
					}else if(executeStatusResponse.executeResponse.status.processSucceeded){
						executeStatusResponse.executeResponse.status.name = 'Process Succeeded';
						executeStatusResponse.executeResponse.status.percentCompleted = 100;
					}
					
					var statusName = report ? "Failed" : executeStatusResponse.executeResponse.status.name.replace('Process ', '');
					
					switch(statusName){
						case 'Started':
						case 'Accepted':
							r.set('progress', executeStatusResponse.executeResponse.status.percentCompleted + "%");
						case 'Paused':
							r.set('executionStatus', statusName);						
							break;
						case 'Failed':
							r.set('executionStatus', statusName);
							report = report || executeStatusResponse.executeResponse.status.exception.exceptionReport.exceptions[0].texts[0];
							r.set('result', report);							
							scope.pendingRows.delete(processExecId);
							break;
						case 'Succeeded':
							r.set('result', executeStatusResponse.executeResponse.processOutputs[0].reference.href);
							r.set('executionStatus', statusName);
							r.set('progress', executeStatusResponse.executeResponse.status.percentCompleted + "%");							
							scope.pendingRows.delete(processExecId);
							break;
						default:
							break;
					}
										
					if(scope.pendingRows.size == 0){
						scope.stopRunner();
					}
				}
			});
			
			r.endEdit();
		}
    },
	
	getExecutionId: function(url){
		var getParams = url.split("?");
		if(getParams.length > 1){
			var params = Ext.urlDecode(getParams[1]);
			if(params.executionId){
				return params.executionId;
			}
		}
	},
	
	requestRemoteProcessStatus: function(statusLocation, callback){
		Ext.Ajax.request({
			url: statusLocation,
			method: 'GET',
			scope: this,
			success: function(response, request) {
				var processExecId = this.getExecutionId(request.url);
				return callback.call(this, processExecId, response.responseText);
			},
			failure: function(response) {
				this.hideMask();
				var processExecId = this.getExecutionId(request.url);
				return callback.call(this, processExecId, response.responseText);
			}
		});
	},
    
    updateFormStatus: function() {
	    //
        // Enable buffer only if layer, crs and selection mode have a value.
        //
		if(this.formPanel.layerCombo.getValue() && 
			this.formPanel.selectionMode.getValue() && 
				this.spatialSelection.features.length > 0) {
			//this.formPanel.crsCombo.enable();
            this.formPanel.bufferField.enable();
			this.formPanel.cutMode.enable();
        } else {
			//this.formPanel.crsCombo.disable();
            this.formPanel.bufferField.disable();
			this.formPanel.cutMode.disable();
        }
        
		var layer = this.formPanel.layerCombo.getValue();
		
		//
		// If the layer is a raster layer the cut mode combo should not be enabled
		//
		var layerComboStore = this.formPanel.layerCombo.getStore();
		var layerRecordIndex = layerComboStore.find('name', layer);
		var layerRecord = layerComboStore.getAt(layerRecordIndex);
		var isRaster = layerRecord ? layerRecord.data.wcs : false;  

        if(layer) {
            this.formPanel.selectionMode.enable();
            //this.formPanel.placeSearch.enable();
        } else {
            this.formPanel.selectionMode.disable();
            //this.formPanel.placeSearch.disable();
        }
        
		//
        // show the vector filter fieldset if layer is selected and it is not a raster
        //
		if(layer && !isRaster) {
            this.vectorFilterContainer.show();
        } else {
            this.vectorFilterContainer.collapse();
            this.vectorFilterContainer.hide();
        }
    },
    
    bufferSpatialSelection: function(buffer) {
        if(!this.originalGeometry && this.spatialSelection.features.length == 0) return;
        var feature = this.unBufferedFeature || this.spatialSelection.features[0];
        
        this.showMask();
        
        var request = {
            type: "raw",
            inputs:{
                geom: new OpenLayers.WPSProcess.ComplexData({
                    value: feature.geometry.toString(),
                    mimeType: "application/wkt"
                }),
                distance: new OpenLayers.WPSProcess.LiteralData({value:buffer})
            },
            outputs: [{
                identifier: "result",
                mimeType: "application/wkt"
            }]
        };

        this.wpsClusterManager.execute('JTS:buffer', request, function(response) {
            if(response) {
                try {
                    var geometry = OpenLayers.Geometry.fromWKT(response);
                } catch(e) {
                    return Ext.Msg.show({
                        title: this.errBufferTitle,
                        msg: this.errBufferMsg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
                var bufferedFeature = new OpenLayers.Feature.Vector(geometry, {isBuffered: true});
                this.spatialSelection._addingBufferedFeature = true;
                this.spatialSelection.addFeatures([bufferedFeature]);
                this.spatialSelection._addingBufferedFeature = false;
                this.unBufferedFeature = feature; //copy the "original" feature, without any buffer applied
                this.target.mapPanel.map.zoomToExtent(geometry.getBounds());
				
				this.addFeatureSummary(bufferedFeature);
            }
            
            this.hideMask();
        }, this);
    },
    
    /**
	 * Check if the selected layer is raster or vector by performing a DescribeFeatureType and a DescribeCoverage
	 */
    getLayerType: function(layer, callback, scope) {
        var layerSource = this.target.layerSources[layer.source],
            url = layerSource.url,
            questionMarkIndexOf = url.indexOf('?'),
            separator, wfsUrl, wcsUrl;
        
		//
        // If we found the "wcs" keyword, just return WCS
        //
		if(layer.wcs) return callback.call(this, 'WCS');
 
        //
        // If we found no keywords, just return, it's a Layergroup
        //
        if(layer.isLayerGroup) return callback.call(this, 'group');
       
        this.showMask();
        
        if(questionMarkIndexOf > -1) {
            if(questionMarkIndexOf < url.length) separator = '&';
        } else {
            separator = '?';
        }
        
        wfsUrl = url + separator + 'service=WFS&request=DescribeFeatureType&version='+this.wfsDefaultVersion+'&typeName='+layer.name;
        wcsUrl = url + separator + 'service=WCS&request=DescribeCoverage&version='+this.wcsDefaultVersion+'&identifiers='+layer.name;
        
		// ///////////////////////////////////////////////////////
        // DescribeCoverage request: if it returns a valid 
		// DescribeCoverage response, return the WCS layer type
        // function is needed because we need to execute it 
		// if the DescribeFeatureType parsing fails and if 
		// the request fails.
        // ///////////////////////////////////////////////////////
		var checkDescribeCoverage = function() {
            var requestUrl = this.isSameOrigin(wcsUrl) ? wcsUrl : this.target.proxy + encodeURIComponent(wcsUrl);
            Ext.Ajax.request({
                url: requestUrl,
                method: 'GET',
                scope: this,
                success: function(response) {
                    this.hideMask();
                    var format = new OpenLayers.Format.XML();
                    try {
                        var xml = format.read(response.responseText);
                        if(xml.getElementsByTagName("wcs:CoverageDescription").length > 0 || xml.getElementsByTagName("CoverageDescription").length > 0) {
                            return callback.call(scope, 'WCS');
                        }
                    } catch(e) {
                        console.log('no wcs', response, e);
                    }
                    return callback.call(scope);
                },
                failure: function(response) {
                    this.hideMask();
                    return callback.call(scope);
                }
            });
        };
        
		//
        // DescribeFeatureType request: if it returns a valid DescribeFeatureType response, return the WFS layer type
        //
		var requestUrl = this.isSameOrigin(wfsUrl) ? wfsUrl : this.target.proxy + encodeURIComponent(wfsUrl);
        
		Ext.Ajax.request({
            url: requestUrl,
            method: 'GET',
            scope: this,
            success: function(response, opts){
                var format = new OpenLayers.Format.WFSDescribeFeatureType();
                try {
                    var dftResponse = format.read(response.responseXML || response.responseText);
                    if(dftResponse && dftResponse.featureTypes && dftResponse.featureTypes.length > 0) {
                        this.hideMask();
                        return callback.call(scope, 'WFS');
                    }
                } catch(e) {
                    console.log('no wfs', response, e);
                }
                checkDescribeCoverage.call(this);
            },
            failure: checkDescribeCoverage
        });     
    },
    
    createVectorFilterForm: function(record, schema) {        
        this.vectorFilterContainer.removeAll();
		
		// is current source enabled for autoComplete ?
        var autoComplete = record && this.autoComplete && this.autoComplete.sources && this.autoComplete.sources.indexOf(record.get('source')) !== -1;

        this.vectorFilterContainer.add({
            xtype: "gxp_filterbuilder",
            ref: "../../filterBuilder",
            attributes: schema,
			validators: this.validators,
			autoComplete: autoComplete,
			autoCompleteCfg: this.autoComplete || {},
            allowBlank: true,
            allowGroups: false
        });
		
		/**
		* Overriding the removeCondition method in order to manage the 
		* single filterfield reset.
		*/
		this.formPanel.filterBuilder.removeCondition = function(item, filter) {
			var parent = this.filter.filters[0].filters;
			if(parent.length > 1) {
				parent.remove(filter);
				this.childFilterContainer.remove(item, true);
			}else{
				var items = item.findByType("gxp_filterfield");
				
				var i = 0;
				while(items[i]){
					items[i].reset();
					
					items[i].items.get(1).disable();
					items[i].items.get(2).disable();
					items[i].items.get(3).disable();

					filter.value = null;
					i++;
				}
			}
			
			this.fireEvent("change", this);
		};
		
        this.vectorFilterContainer.doLayout();
    },
    
    checkWpsDownload: function(record) {
        var layerSource = this.target.layerSources[record.data.source];
        var url = this.buildLayerWPSUrl(layerSource.url);
        url += "&version=" + this.wpsDefaultVersion + "&request=DescribeProcess&identifier=gs:Download";
        
        var requestUrl = this.isSameOrigin(url) ? url : this.target.proxy + encodeURIComponent(url);
        var Request = Ext.Ajax.request({
            url: requestUrl,
            method: 'GET',
            scope: this,
            success: function(response, opts){
                if(response.responseXML || response.responseText){
                    var xml = response.responseXML || response.responseText;
					
					if(!response.responseXML){
						var format = new OpenLayers.Format.XML();
						xml = format.read(xml);						
					}
					
                    if(xml.getElementsByTagName("ProcessDescription").length == 0){
                        Ext.Msg.show({
                            title: this.errWPSTitle,
                            msg: this.errWPSMsg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                        this.formPanel.downloadButton.disable();
                    }else{
                        if(!record.get('isLayerGroup')){
                            this.formPanel.downloadButton.enable();
                            record.set('wpsdownload', true);
                            this.layersAttributes[record.get('olid')].wpsdownload = true;
                        }
                    }
                }else{		
                    Ext.Msg.show({
                        title: this.describeProcessErrorMsg,
                        msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    });   
                }
            },
            failure: function(response, opts){
                console.error(response);
            }
        });
    },
    
    showMask: function() {
        if(!this.loadMask) this.loadMask = new Ext.LoadMask(this.formPanel.getEl(), {msg: this.loadMaskMsg});
        this.loadMask.show();
    },
    
    hideMask: function() {
		if(this.loadMask){
			this.loadMask.hide();
		}        
    },
    
    isSameOrigin: function(url) {
        var pattern = /(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost = pattern.exec(url); 
        return (mHost[2] == location.host);
    }       
});

Ext.preg(gxp.plugins.DownloadPanel.prototype.ptype, gxp.plugins.DownloadPanel);
