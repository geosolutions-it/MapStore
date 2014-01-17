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
 * @requires plugins/QueryForm.js
 * @include widgets/FilterBuilder.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = QueryBBOXForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: BBOXQueryForm(config)
 *
 *    Plugin for performing queries on feature layers
 *    TODO Replace this tool with something that is less like GeoEditor and
 *    more like filtering.
 */
gxp.plugins.BBOXQueryForm = Ext.extend(gxp.plugins.QueryForm, {
    
    /** api: ptype = gxp_querybboxform */
    ptype: "gxp_bboxqueryform",
	
	/** api: config[selectionMethodFieldSetComboTitle]
     * ``String``
     * Text for FieldSet Combo Selection Method (i18n).
     */    
    selectionMethodFieldSetComboTitle: "Set Selection Method",
	
    /** api: config[comboEmptyText]
     * ``String``
     * Text for empty Combo Selection Method (i18n).
     */    
    comboEmptyText: "Select a method..",

	/** api: config[comboSelectionMethodLabel]
     * ``String``
     * Text for Label Combo Selection Method (i18n).
     */    
    comboSelectionMethodLabel: "Selection",

    /** api: config[comboPolygonSelection]
     * ``String``
     * Text for Label Polygon (i18n).
     */        
    comboPolygonSelection: 'Polygon',
    
    /** api: config[comboCircleSelection]
     * ``String``
     * Text for Label Circle (i18n).
     */        
    comboCircleSelection: 'Circle',
    
    /** api: config[comboBBOXSelection]
     * ``String``
     * Text for Label BBOX (i18n).
     */        
    comboBBOXSelection: 'BBOX',
	
	/** api: config[comboBufferSelection]
     * ``String``
     * Text for Label comboBufferSelection (i18n).
     */  
	comboBufferSelection: "Buffer",

    /** api: config[errorDrawPolygonText]
     * ``String``
     * Text for Query Error Draw Polygon (i18n).
     */            
    errorDrawPolygonText: "You have to draw a Polygon",    
    
    /** api: config[errorDrawCircleText]
     * ``String``
     * Text for Query Error Draw Circle (i18n).
     */            
    errorDrawCircleText: "You have to draw a Circle",        

    /** api: config[errorDrawTitle]
     * ``String``
     * Text for Draw Query Error Title (i18n).
     */            
    errorDrawTitle: "Query error",
	
	/** api: config[errorDrawTitle]
     * ``String``
     * Text for BBOx Error Msg (i18n).
     */  
	errorBBOXText: "BBOX invalid",         
	
	/** api: config[errorBufferTitle]
     * ``String``
     * Text for buffer error title.
     */ 
	errorBufferTitle: "Buffer Error",

	/** api: config[errorBufferText]
     * ``String``
     * Text for buffer error text.
     */ 
	errorBufferText: "The selected buffer is invalid!",
	
	/** private
	 *  OpenLayers.Style
	 *  default style for temporary layers
	 */
	style : null,
	
	showSelectionSummary: true,
	
	areaLabel: "Area",
	
	perimeterLabel: "Perimetro",
	
	radiusLabel: "Raggio",
	
	centroidLabel: "Centroide",
	
	selectionSummary: "Sommario Selezione",
	
	geodesic: true,
    
    init: function(target) {
        
        var me = this;
      
        if(!this.style){
            this.style = new OpenLayers.Style();
            if(this.outputConfig){
                Ext.apply(this.style.defaultStyle, this.outputConfig.selectStyle);
            }
        }
        
        var confbbox = Ext.apply({
            map: target.mapPanel.map,
            checkboxToggle: false,
            ref: "spatialFieldset",
            title: this.queryByLocationText,
            id: me.id + "_bbox"
        }, this.outputConfig); 
		
        this.bboxFielset = new gxp.form.BBOXFieldset(confbbox);
		
		this.bboxFielset.on("select", function(evt, bounds){
			this.addFeatureSummary(bounds);
		}, this);
		
	    /*this.bboxFielset.on("unselect", function(evt){
			this.removeFeatureSummary();
		}, this);*/

		this.bufferFieldSet = new gxp.widgets.form.BufferFieldset({
			anchor: '100%',
			ref: "bufferFieldset",
			collapsed : false,
			hidden: true,
			map: target.mapPanel.map,
			toggleGroup: target.toggleGroup,
			minValue: this.outputConfig.bufferOptions.minValue,
            maxValue: this.outputConfig.bufferOptions.maxValue,
		    decimalPrecision: this.outputConfig.bufferOptions.decimalPrecision,
			outputSRS: this.outputConfig.outputSRS,
			selectStyle: this.outputConfig.selectStyle,
			geodesic: this.geodesic,
			listeners: {
				disable: function(){
					this.hide();
				},
				enable: function(){
					this.show();
				}
			}
		});
		
		this.bufferFieldSet.on("bufferadded", function(evt, feature){
			this.addFeatureSummary(feature);
		}, this);
		
	    this.bufferFieldSet.on("bufferremoved", function(evt, feature){
			this.removeFeatureSummary();
		}, this);
		
        this.filterCircle;
        this.filterPolygon;
        this.drawings;
        this.draw;
        
        this.id = this.id ? this.id : new Date().getTime(); 
	
		target.on("ready", function(){	
            var container = this.outputTarget ? Ext.getCmp(this.outputTarget) : null;		
			
			if(container){
				container.on("expand", function(){
					if(this.featureManagerTool && this.featureManagerTool.layerRecord && this.featureManagerTool.schema){
						this.addFilterBuilder(this.featureManagerTool, this.featureManagerTool.layerRecord, this.featureManagerTool.schema);
					}
				}, this);
			}
		}, this);
       
        return gxp.plugins.BBOXQueryForm.superclass.init.apply(this, arguments);
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
		var layer = map.getLayersByName("bboxqf-circleCentroid")[0];
		if(layer){
            map.removeLayer(layer);
		}
	},
	
   /**
	* api: method[addFeatureSummary]
	*/
	addFeatureSummary: function(obj){
		if(this.showSelectionSummary){
			this.removeFeatureSummary();
		
			var geometry;
			if(obj instanceof OpenLayers.Bounds){
				geometry = obj.toGeometry();
			}else if(obj instanceof OpenLayers.Feature.Vector){
				geometry = obj.geometry;
			}
			
			var summary = "", metricUnit = "km";
			
			var area = this.getArea(geometry, metricUnit);
			if(area){
				summary += this.areaLabel + ": " + area + " " + metricUnit + '<sup>2</sup>' + '<br />';
			}
			
			var selectionType = this.output[0].outputType.getValue();
			switch(selectionType){
				case 'polygon':
				case 'bbox':
					var perimeter = this.getLength(geometry, metricUnit);
					if(perimeter){
						summary += this.perimeterLabel + ": " + perimeter + " " + metricUnit + '<br />';
					}
					break;
				case 'circle':
				case 'buffer':
					var radius = Math.sqrt(area/Math.PI);
					if(radius){
						summary += this.radiusLabel + ": " + radius + " " + metricUnit + '<br />';
					}
					
					// //////////////////////////////////////////////////////////
					// Draw also the circle center as a part of summary report
					// //////////////////////////////////////////////////////////
					var circleSelectionCentroid = geometry.getCentroid();
					
					if(circleSelectionCentroid){
						var lon = circleSelectionCentroid.x.toFixed(3);
						var lat = circleSelectionCentroid.y.toFixed(3);
						summary += this.centroidLabel + ": " + lon + " (Lon) " + lat + " (Lat)" +'<br />';
					}
					
					if(selectionType == "circle"){
						var options = {};
						var centroidStyle = {
							pointRadius: 4,
							graphicName: "cross",
							fillColor: "#FFFFFF",
							strokeColor: "#FF0000",
							fillOpacity: 0.5,
							strokeWidth: 2
						};
						
						if(centroidStyle){
							var style = new OpenLayers.Style(centroidStyle);
							var options = {styleMap: style};
						}

						var circleCentroidLayer = new OpenLayers.Layer.Vector("bboxqf-circleCentroid", options);

						var pointFeature = new OpenLayers.Feature.Vector(circleSelectionCentroid);
						circleCentroidLayer.addFeatures([pointFeature]);
						
						circleCentroidLayer.displayInLayerSwitcher = false;
						this.target.mapPanel.map.addLayer(circleCentroidLayer);  
					}
					
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
			
			var vertex = geometry.getVertices()
			var point;
			if(obj instanceof OpenLayers.Bounds){
				point = vertex[1];
			}else if(obj instanceof OpenLayers.Feature.Vector){
				point = vertex[vertex.length - 1];
			}
			
			var px = this.target.mapPanel.map.getPixelFromLonLat(new OpenLayers.LonLat(point.x, point.y));			
			var p0 = this.target.mapPanel.getPosition();
			
			this.featureSummary.targetXY = [p0[0] + px.x, p0[1] + px.y];
			this.featureSummary.show();
		}
	},
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        this.featureManagerTool = this.target.tools[this.featureManager];
		
		var me = this;
		
        config = Ext.apply({
            border: false,
            bodyStyle: "padding: 10px",
            layout: "form",
            autoScroll: true,
            items: [
            {
                xtype: "fieldset",
                anchor: '100%',
                title : this.selectionMethodFieldSetComboTitle,
                collapsed : false,
                items : [{ 
					xtype: 'combo',
					anchor:'100%',
                    id:'selectionMethod_id',
					ref:'../outputType',
                    fieldLabel: this.comboSelectionMethodLabel,
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyRender:false,
                    mode: 'local',
                    name:'selection_method',
                    forceSelected:true,
                    emptyText: this.comboEmptyText,
                    allowBlank:false,
                    autoLoad:true,
                    displayField: 'label',
                    valueField:'value',
                    value:'bbox',
					editable: false,
                    readOnly: false,
                    store: new Ext.data.JsonStore({
                        fields:[
                                {name:'name', dataIndex:'name'},
                                {name:'label', dataIndex:'label'},
                                {name:'value', dataIndex:'value'}
                        ],
                        data:[
                            {name: 'Polygon', label: this.comboPolygonSelection, value: 'polygon'},
                            {name: 'Circle', label: this.comboCircleSelection, value: 'circle'},
							{name: 'Buffer', label: this.comboBufferSelection, value: 'buffer'},
                            {name: 'BBOX', label: this.comboBBOXSelection, value: 'bbox'}
                        ]
                    }), 
                    listeners: {
                        select: function(c,record, index ){
							me.removeFeatureSummary();
                            
							me.resetFeatureManager();     
							
                            me.bboxFielset.removeBBOXLayer();
							me.bufferFieldSet.resetPointSelection();
							me.bufferFieldSet.coordinatePicker.toggleButton(false);
							
                            var disabledItems = [];
                            this.target.toolbar.items.each(function(item) {
                                if (!item.disabled) {
                                    disabledItems.push(item);
                                }
                            });
                            
                            // For every enabled tool in the toolbar, toggle the button off (deactivating the tool)
                            // Then add a listener on 'click' and 'menushow' to reset the BBoxQueryForm to disable all active tools
                            for (var i = 0;i<disabledItems.length;i++){
                                if(disabledItems[i].toggleGroup){
                                    if(disabledItems[i].scope && disabledItems[i].scope.actions){
                                        for(var a = 0;a<disabledItems[i].scope.actions.length;a++){
                                            disabledItems[i].scope.actions[a].toggle(false);
                                            
                                            if (disabledItems[i].scope.actions[a].menu){
                                                for(var b = 0;b<disabledItems[i].scope.actions[a].menu.items.items.length;b++){
                                                    disabledItems[i].scope.actions[a].menu.items.items[b].disable();
                                                }
                                            }

                                            disabledItems[i].scope.actions[a].on({
                                                "click": function(evt) {
                                                     if (me.draw) {me.draw.deactivate();};
                                                     // TODO 'Circle' and 'Poligon' tool have no other visual way to display
                                                     // their statuses (active, not active), apart from the combobox
                                                     // The clearValue() is intended to tell user that the tool is not enabled
                                                     //me.output[0].outputType.clearValue();

                                                },
                                                "menushow": function(evt) {
                                                    var menuItems = evt.menu.items.items;
                                                    for (var i = 0;i<menuItems.length;i++){
                                                        menuItems[i].enable();
                                                    }
                                                     if (me.draw) {me.draw.deactivate();};
                                                     //me.output[0].outputType.clearValue();
                                                },
                                                scope: this
                                            });
                                        }
                                    }                    
                                }
                            }
            
                            var outputValue = c.getValue();
                            if (me.draw) {me.draw.deactivate();};
                            if (me.drawings) {me.drawings.destroyFeatures();};
                            if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
                            if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};
                            
                            if(outputValue == 'circle'){
                                queryForm.spatialFieldset.hide();
                                queryForm.spatialFieldset.disable();
								
								queryForm.bufferFieldset.disable();
								
								// Disable current active tool
                                var currently_pressed = Ext.ButtonToggleMgr.getPressed(me.bufferFieldSet.toggleGroup);
                                if(currently_pressed){
                                    currently_pressed.toggle(false);
                                    currently_pressed.on( "menushow",
										function(evt) {
											var menuItems = evt.menu.items.items;
											for (var i = 0;i<menuItems.length;i++){
												menuItems[i].enable();
											}
											if (this.draw) {
												this.draw.deactivate();
											}
										},
                                        me,
										{single : true}
									);
									
									currently_pressed.on("click",
										function(evt) {
											if (this.draw) {
												this.draw.deactivate();
											}
										},
										me,
										{single : true}
									);
                                }
                                
                                me.drawings = new OpenLayers.Layer.Vector({},
									{
										displayInLayerSwitcher:false,
										styleMap: new OpenLayers.StyleMap({
											"default": this.style
										})
									}
								);
                                
                                this.target.mapPanel.map.addLayer(me.drawings);
                                var polyOptions = {sides: 100};
                                
                                me.draw = new OpenLayers.Control.DrawFeature(
                                    me.drawings,
                                    OpenLayers.Handler.RegularPolygon,
                                    {
                                        handlerOptions: polyOptions
                                    }
                                );
                                
                                this.target.mapPanel.map.addControl(me.draw);
                                me.draw.activate();

                                me.drawings.events.on({
                                    "featureadded": function(event) {
                                        me.filterCircle = new OpenLayers.Filter.Spatial({
											type: OpenLayers.Filter.Spatial.INTERSECTS,
											property: me.featureManagerTool.featureStore.geometryName,
											value: event.feature.geometry
										});    

										me.addFeatureSummary(event.feature);										
                                    },                                
                                    "beforefeatureadded": function(event) {
                                        me.drawings.destroyFeatures();
                                    }
                                });                                 

                            }else if(outputValue == 'bbox'){                            
                                queryForm.spatialFieldset.show();
                                queryForm.spatialFieldset.enable();
								
                                queryForm.bufferFieldset.disable();
								
                                //me.bboxFielset.removeBBOXLayer();
                                //me.bboxFielset.setBBOX(me.target.mapPanel.map.getExtent());
								me.bboxFielset.reset();
                                
                            }else if(outputValue == 'polygon'){                            
                                queryForm.spatialFieldset.hide();
                                queryForm.spatialFieldset.disable();
								
                                queryForm.bufferFieldset.disable();
                                
                                // Disable current active tool
                                var currently_pressed = Ext.ButtonToggleMgr.getPressed(me.bufferFieldSet.toggleGroup);
                                if(currently_pressed){
                                    currently_pressed.toggle(false);
                                    currently_pressed.on( "menushow",
										function(evt) {
											var menuItems = evt.menu.items.items;
											for (var i = 0;i<menuItems.length;i++){
												menuItems[i].enable();
											}
											if (this.draw) {
												this.draw.deactivate();
											}
										},
                                        me,
										{single : true}
									);
									
									currently_pressed.on("click",
										function(evt) {
											if (this.draw) {
												this.draw.deactivate();
											}
										},
										me,
										{single : true}
									);
                                }
								
                                me.drawings = new OpenLayers.Layer.Vector({},
									{
										displayInLayerSwitcher:false,
										styleMap: new OpenLayers.StyleMap({
											"default": this.style
										})
									}
								);

                                this.target.mapPanel.map.addLayer(me.drawings);
                                
                                me.draw = new OpenLayers.Control.DrawFeature(
                                    me.drawings,
                                    OpenLayers.Handler.Polygon
                                );
                                
                                // disable pan while drawing
                                // TODO: make it configurable
                                me.draw.handler.stopDown = true;
                                me.draw.handler.stopUp = true;
                                
                                this.target.mapPanel.map.addControl(me.draw);
                                me.draw.activate();

                                me.drawings.events.on({
                                    "featureadded": function(event) {
                                        me.filterPolygon = new OpenLayers.Filter.Spatial({
											type: OpenLayers.Filter.Spatial.INTERSECTS,
											property: me.featureManagerTool.featureStore.geometryName,
											value: event.feature.geometry
										});
										
										me.addFeatureSummary(event.feature);	
                                    },                                
                                    "beforefeatureadded": function(event) {
                                        me.drawings.destroyFeatures();
                                    }
                                });
                                
                            }else{
							    queryForm.spatialFieldset.hide();
                                queryForm.spatialFieldset.disable();
								
                                queryForm.bufferFieldset.enable();	
								
								if(Ext.isIE){
									queryForm.bufferFieldset.doLayout();
								}
							}                           
                        },                        
                        scope: this                        
                    }
				}]
            },
			this.bufferFieldSet,     
            this.bboxFielset,
            {
                xtype: "fieldset",
                ref: "attributeFieldset",
                title: this.queryByAttributesText,
                checkboxToggle: true,
                collapsed : true,
				listeners: {
					scope: this,
					expand: function(panel){
						panel.doLayout();
					}
				}
            }],
            bbar: ["->", {   
                scope: this,    
                text: this.cancelButtonText,
                iconCls: "cancel",
                handler: function() {                
                    this.resetFeatureManager();
					
                    //this.bboxFielset.removeBBOXLayer();
                    //this.bboxFielset.setBBOX(this.target.mapPanel.map.getExtent());
					this.bboxFielset.reset();
					
					this.bufferFieldSet.resetPointSelection();
					this.bufferFieldSet.coordinatePicker.toggleButton(false);
					
                    var methodSelection = this.output[0].outputType;
                    methodSelection.setValue('bbox');
					
                    if (me.draw) {me.draw.deactivate();};
                    if (me.drawings) {me.drawings.destroyFeatures();};
                    if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
                    if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};    
					
                    var ownerCt = this.outputTarget ? queryForm.ownerCt :
                        queryForm.ownerCt.ownerCt;
                    if (ownerCt && ownerCt instanceof Ext.Window) {
                        ownerCt.hide();
                    } else {
                        this.addFilterBuilder(
                            this.featureManagerTool, this.featureManagerTool.layerRecord,
                            this.featureManagerTool.schema
                        ); 
                    }                    
                }
            }, {
                text: this.queryActionText,
                iconCls: "gxp-icon-find",
                handler: function() {
					var container = this.featureGridContainer ? Ext.getCmp(this.featureGridContainer) : null;
					if(container){
						container.expand();
					}
					
                    var methodSelection = this.output[0].outputType.getValue();
                    var filters = new Array();
					if(queryForm.spatialFieldset.hidden === false){
						if(this.bboxFielset.isValid()){

							filters.push(new OpenLayers.Filter.Spatial({
								type: OpenLayers.Filter.Spatial.BBOX,
								property: this.featureManagerTool.featureStore.geometryName,
								value: me.bboxFielset.getBBOXBounds()
							}));
								
							if (queryForm.attributeFieldset.collapsed !== true) {
								var attributeFilter = queryForm.filterBuilder.getFilter();
								attributeFilter && filters.push(attributeFilter);
							}
							this.featureManagerTool.loadFeatures(filters.length > 1 ?
								new OpenLayers.Filter.Logical({
									type: OpenLayers.Filter.Logical.AND,
									filters: filters
								}) :
								filters[0]
								);                                  
							
						}else{
							Ext.Msg.show({
								title: this.errorDrawTitle,
								msg: this.errorBBOXText,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.INFO
							});
						}
					}else if(queryForm.bufferFieldset.hidden === false){
						if(queryForm.bufferFieldset.isValid()){	

							var radius = queryForm.bufferFieldset.bufferField.getValue(); 
							
							//
							// create point from your lat and lon of your selected feature
							//
							var coordinates = queryForm.bufferFieldset.coordinatePicker.getCoordinate();
							var radiusPoint = new OpenLayers.Geometry.Point(coordinates[0], coordinates[1]);
							
							/*var units = this.target.mapPanel.map.getUnits();							
							var radiusFilter = new OpenLayers.Filter.Spatial({
								 type: OpenLayers.Filter.Spatial.DWITHIN,
								 value: radiusPoint,
								 distanceUnits: units, //me.outputConfig.bufferOptions.distanceUnits || "m",
								 distance: radius
							});*/
							
							var polygon;
							if(this.geodesic){
								polygon = OpenLayers.Geometry.Polygon.createGeodesicPolygon(
									radiusPoint,
									radius,
									100, 
									0,
									this.target.mapPanel.map.getProjectionObject()
								);
							}else{
								polygon = OpenLayers.Geometry.Polygon.createRegularPolygon(
									radiusPoint,
									radius,
									100, 
									0
								);
							}
							
							var bounds = polygon.getBounds();							
							polygon.bounds = bounds;
																
						    var radiusFilter = new OpenLayers.Filter.Spatial({
								type: OpenLayers.Filter.Spatial.INTERSECTS,
								property: this.featureManagerTool.featureStore.geometryName,
								value: polygon
							});
			 
							filters.push(radiusFilter);
							
							if (queryForm.attributeFieldset.collapsed !== true) {
								var attributeFilter = queryForm.filterBuilder.getFilter();
								attributeFilter && filters.push(attributeFilter);
							}
							
							this.featureManagerTool.loadFeatures(filters.length > 1 ?
								new OpenLayers.Filter.Logical({
									type: OpenLayers.Filter.Logical.AND,
									filters: filters
								}) :
								filters[0]
								);                                  
							
						}else{
							Ext.Msg.show({
								title: this.errorBufferTitle,
								msg: this.errorBufferText,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.INFO
							});
						}
					}else{
                        if (methodSelection === 'circle'){
                            if(me.filterCircle && me.filterCircle.value ){
                                if (queryForm.attributeFieldset.collapsed !== true) {
                                    var attributeFilter = queryForm.filterBuilder.getFilter();
                                    attributeFilter && filters.push(attributeFilter);
                                }
                                filters.push(me.filterCircle);
                                this.featureManagerTool.loadFeatures(filters.length > 1 ?
                                    new OpenLayers.Filter.Logical({
                                        type: OpenLayers.Filter.Logical.AND,
                                        filters: filters
                                    }) :
                                    filters[0]
                                    );                                  
                                
                            }else{
                                Ext.Msg.show({
                                    title: this.errorDrawTitle,
                                    msg: this.errorDrawCircleText,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        }else{
                            if(me.filterPolygon && me.filterPolygon.value ){
                                if (queryForm.attributeFieldset.collapsed !== true) {
                                    var attributeFilter = queryForm.filterBuilder.getFilter();
                                    attributeFilter && filters.push(attributeFilter);
                                }
                                filters.push(me.filterPolygon);
                                this.featureManagerTool.loadFeatures(filters.length > 1 ?
                                    new OpenLayers.Filter.Logical({
                                        type: OpenLayers.Filter.Logical.AND,
                                        filters: filters
                                    }) :
                                    filters[0]
                                    );                                  
                            }else{
                                Ext.Msg.show({
                                    title: this.errorDrawTitle,
                                    msg: this.errorDrawPolygonText,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.INFO
                                });
                            }
                        }
                    }
                },
                scope: this
            }]
        }, config || {});
		
        var queryForm = gxp.plugins.QueryForm.superclass.addOutput.call(this, config);
        
        var methodSelection = this.output[0].outputType;
        
        this.addFilterBuilder = function(mgr, rec, schema) {			
            queryForm.attributeFieldset.removeAll();
            queryForm.setDisabled(!schema);
			
            if (schema) {
                queryForm.attributeFieldset.add({
                    xtype: "gxp_filterbuilder",
                    ref: "../filterBuilder",
                    attributes: schema,
                    allowBlank: true,
                    allowGroups: false
                });
				
			   /**
				* Overriding the removeCondition method in order to manage the 
				* single filterfield reset.
				*/
				 queryForm.filterBuilder.removeCondition = function(item, filter) {
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

							filter.value = null;
							i++;
						}
					}
					
					this.fireEvent("change", this);
				};
				
                queryForm.spatialFieldset.enable();
                queryForm.spatialFieldset.show();
				
				queryForm.bufferFieldset.disable();
				queryForm.bufferFieldset.resetPointSelection();
				
                //queryForm.attributeFieldset.expand();			
				methodSelection.setValue('bbox');
				
				if (me.draw) {me.draw.deactivate();};
				if (me.drawings) {me.drawings.destroyFeatures();};
				if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
				if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};   
            } else {
                queryForm.attributeFieldset.rendered && queryForm.attributeFieldset.collapse();
                queryForm.spatialFieldset.rendered && queryForm.spatialFieldset.hide();
                methodSelection.setValue('bbox');
				
				if (me.draw) {me.draw.deactivate();};
				if (me.drawings) {me.drawings.destroyFeatures();};
				if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
				if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};  
            }
			
            queryForm.attributeFieldset.doLayout();
        };
		
        this.featureManagerTool.on("layerchange", this.addFilterBuilder);
		
        this.addFilterBuilder(this.featureManagerTool,
            this.featureManagerTool.layerRecord, this.featureManagerTool.schema
        );
		
        /*this.target.mapPanel.map.events.register("moveend", this, function() {
            this.bboxFielset.removeBBOXLayer();
            this.bboxFielset.setBBOX(this.target.mapPanel.map.getExtent())
        });*/
		
        this.featureManagerTool.on({
            "beforequery": function() {
                new Ext.LoadMask(queryForm.getEl(), {
                    store: this.featureManagerTool.featureStore,
                    msg: this.queryMsg
                }).show();
            },
            "query": function(tool, store) {
                if (store) {
                    store.getCount() || Ext.Msg.show({
                        title: this.noFeaturesTitle,
                        msg: this.noFeaturesMessage,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                    if (this.autoHide) {
                        var ownerCt = this.outputTarget ? queryForm.ownerCt :
                            queryForm.ownerCt.ownerCt;
                        ownerCt instanceof Ext.Window && ownerCt.hide();
                    }
                }
            },
            scope: this
        });
		
		// ////////////////////////////////////////////
		// In some cases when the container 
		// is collapsed at startup, sub components are 
		// not rendered. So we force the layout 
		// of them.
		// ////////////////////////////////////////////
		queryForm.ownerCt.on("expand", function(panel){
			this.bufferFieldSet.doLayout(); 
			this.bboxFielset.doLayout(); 
		}, this);
        
        return queryForm;
    }
});

/*
 * APIMethod: createGeodesicPolygon
 * Create a regular polygon around a radius. Useful for creating circles
 * and the like.
 *
 * Parameters:
 * origin - {<OpenLayers.Geometry.Point>} center of polygon.
 * radius - {Float} distance to vertex, in map units.
 * sides - {Integer} Number of sides. 20 approximates a circle.
 * rotation - {Float} original angle of rotation, in degrees.
 * projection - {<OpenLayers.Projection>} the map's projection
 */
OpenLayers.Geometry.Polygon.createGeodesicPolygon = function(origin, radius, sides, rotation, projection){
	if (projection.getCode() !== "EPSG:4326") {
		origin.transform(projection, new OpenLayers.Projection("EPSG:4326"));
	}
	var latlon = new OpenLayers.LonLat(origin.x, origin.y);
	
	var angle;
	var new_lonlat, geom_point;
	var points = [];
	
	for (var i = 0; i < sides; i++) {
		angle = (i * 360 / sides) + rotation;
		new_lonlat = OpenLayers.Util.destinationVincenty(latlon, angle, radius);
		new_lonlat.transform(new OpenLayers.Projection("EPSG:4326"), projection);
		geom_point = new OpenLayers.Geometry.Point(new_lonlat.lon, new_lonlat.lat);
		points.push(geom_point);
	}
	var ring = new OpenLayers.Geometry.LinearRing(points);
	return new OpenLayers.Geometry.Polygon([ring]);
};

Ext.preg(gxp.plugins.BBOXQueryForm.prototype.ptype, gxp.plugins.BBOXQueryForm);
