/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

//TODO remove the WMSStylesDialog and GeoServerStyleWriter includes
/**
 * @include widgets/WMSStylesDialog.js
 * @include plugins/GeoServerStyleWriter.js
 */

/** api: (define)
 *  module = gxp
 *  class = WMSLayerPanel
 *  base_link = `Ext.TabPanel <http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: WMSLayerPanel(config)
 *   
 *      Create a dialog for setting WMS layer properties like title, abstract,
 *      opacity, transparency and image format.
 */
gxp.WMSLayerPanel = Ext.extend(Ext.TabPanel, {
    
    /** api: config[layerRecord]
     *  ``GeoExt.data.LayerRecord``
     *  Show properties for this layer record.
     */
    layerRecord: null,

    /** api: config[source]
     *  ``gxp.plugins.LayerSource``
     *  Source for the layer. Optional. If not provided, ``sameOriginStyling``
     *  will be ignored.
     */
    source: null,
    
    /** api: config[wps]
     * @TODO
     */
    wps: null,
    map: null,
    
    /** api: config[sameOriginStyling]
     *  ``Boolean``
     *  Only allow editing of styles for layers whose sources have a URL that
     *  matches the origin of this application.  It is strongly discouraged to 
     *  do styling through the proxy as all authorization headers and cookies 
     *  are shared with all remotesources.  Default is ``true``.
     */
    sameOriginStyling: true,

    /** api: config[rasterStyling]
     *  ``Boolean`` If set to true, single-band raster styling will be
     *  supported.  Default is ``false``.
     */
    rasterStyling: false,
    
    /** private: property[editableStyles]
     *  ``Boolean``
     */
    editableStyles: false,
    
    /** api: config[activeTab]
     *  ``String or Number``
     *  A string id or the numeric index of the tab that should be initially
     *  activated on render.  Defaults to ``0``.
     */
    activeTab: 0,
    
    /** api: config[border]
     *  ``Boolean``
     *  Display a border around the panel.  Defaults to ``false``.
     */
    border: false,
    
    /** api: config[imageFormats]
     *  ``RegEx`` Regular expression used to test browser friendly formats for
     *  GetMap requests.  The formats displayed will those from the record that
     *  match this expression.  Default is ``/png|gif|jpe?g/i``.
     */
    imageFormats: /png|gif|jpe?g/i,
    
    /** i18n */
    aboutText: "About",
    titleText: "Title",
    nameText: "Name",
    descriptionText: "Description",
    displayText: "Display",
    opacityText: "Opacity",
    formatText: "Format",
    transparentText: "Transparent",
    cacheText: "Cache",
    cacheFieldText: "Use cached version",
    stylesText: "Styles",
    idaRasterRiskSummaryText: "Statistics",
    idaRasterRiskSummaryInfoText: "Current Viewport Raster Statistics",
    refreshText: "Refresh",
    
    initComponent: function() {
        this.addEvents(
            /** api: event[change]
             *  Fires when the ``layerRecord`` is changed using this dialog.
             */
            "change"
        );
        this.items = [
            this.createAboutPanel(),
            this.createDisplayPanel()
        ];

        // only add the Cache panel if we know for sure the WMS is GeoServer
        // which has been integrated with GWC.
        if (this.layerRecord.get("layer").params.TILED != null) {
            this.items.push(this.createCachePanel());
        }
        
        // only add the Styles panel if we know for sure that we have styles
        if (gxp.WMSStylesDialog && this.layerRecord.get("styles")) {
            var url = (this.source || this.layerRecord.get("layer")).url.split(
                "?").shift().replace(/\/(wms|ows)\/?$/, "/rest");
            if (this.sameOriginStyling) {
                // this could be made more robust
                // for now, only style for sources with relative url
                this.editableStyles = url.charAt(0) === "/";
            } else {
                this.editableStyles = true;
            }
            this.items.push(this.createStylesPanel(url));
        }
        
        // add statistics Tab only for raster layers
        var containsRasterKwrds = false;
        for(var i=0; i<this.layerRecord.get("keywords").length; i++) {
        	if (this.layerRecord.get("keywords")[i].toUpperCase() === "WCS"    || 
        	    this.layerRecord.get("keywords")[i].toUpperCase() === "RASTER" || 
        	    this.layerRecord.get("keywords")[i].toUpperCase() === "TIF"    || 
        	    this.layerRecord.get("keywords")[i].toUpperCase() === "TIFF"   || 
        	    this.layerRecord.get("keywords")[i].toUpperCase() === "GEOTIFF") {
        		containsRasterKwrds = true;
        	}
        }
        if (!this.layerRecord.get("queryable") || containsRasterKwrds) {
        	this.items.push(this.createRasterRiskSummaryPanel());
        }
        gxp.WMSLayerPanel.superclass.initComponent.call(this);
    },

    /** private: createCachePanel
     *  Creates the Cache panel.
     */
    createCachePanel: function() {
        return {
            title: this.cacheText,
            layout: "form",
            style: "padding: 10px",
            items: [{
                xtype: "checkbox",
                fieldLabel: this.cacheFieldText,
                checked: (this.layerRecord.get("layer").params.TILED === true),
                listeners: {
                    check: function(checkbox, checked) {
                        var layer = this.layerRecord.get("layer");
                        layer.mergeNewParams({
                            TILED: checked
                        });
                        this.fireEvent("change");
                    },
                    scope: this
                }
            }]    
        };
    },
    
    /** private: createStylesPanel
     *  :arg url: ``String`` url to save styles to
     *
     *  Creates the Styles panel.
     */
    createStylesPanel: function(url) {
        var config = gxp.WMSStylesDialog.createGeoServerStylerConfig(
            this.layerRecord, url
        );
        if (this.rasterStyling === true) {
            config.plugins.push({
                ptype: "gxp_wmsrasterstylesdialog"
            });
        }
        return Ext.apply(config, {
            title: this.stylesText,
            style: "padding: 10px",
            editable: false,
            listeners: Ext.apply(config.listeners, {
                "beforerender": {
                    fn: function(cmp) {
                        var render = !this.editableStyles;
                        if (!render) {
                            if (typeof this.authorized == 'boolean') {
                                cmp.editable = this.authorized;
                                cmp.ownerCt.doLayout();
                            } else {
                                Ext.Ajax.request({
                                    method: "PUT",
                                    url: url + "/styles",
                                    callback: function(options, success, response) {
                                        // we expect a 405 error code here if we are dealing with
                                        // GeoServer and have write access. Otherwise we will
                                        // create the panel in readonly mode.
                                        cmp.editable = (response.status == 405);
                                        cmp.ownerCt.doLayout();
                                    }
                                });
                            }
                        }
                        return render;
                    },
                    scope: this,
                    single: true
                }
            })
        });
    },
    
    /** private: createAboutPanel
     *  Creates the about panel.
     */
    createAboutPanel: function() {
        return {
            title: this.aboutText,
            style: {"padding": "10px"},
            defaults: {
                border: false
            },
            items: [{
                layout: "form",
                labelWidth: 70,
                items: [{
                    xtype: "textfield",
                    fieldLabel: this.titleText,
                    anchor: "99%",
                    value: this.layerRecord.get("title"),
                    listeners: {
                        change: function(field) {
                            this.layerRecord.set("title", field.getValue());
                            //TODO revisit when discussion on
                            // http://trac.geoext.org/ticket/110 is complete
                            this.layerRecord.commit();
                            this.fireEvent("change");
                        },
                        scope: this
                    }
                }, {
                    xtype: "textfield",
                    fieldLabel: this.nameText,
                    anchor: "99%",
                    value: this.layerRecord.get("name"),
                    readOnly: true
                }]
            }, {
                layout: "form",
                labelAlign: "top",
                items: [{
                    xtype: "textarea",
                    fieldLabel: this.descriptionText,
                    grow: true,
                    growMax: 150,
                    anchor: "99%",
                    value: this.layerRecord.get("abstract"),
                    readOnly: true
                }]
            }]
        };
    },
    
    /** private: createDisplayPanel
     *  Creates the display panel.
     */
    createDisplayPanel: function() {
        var record = this.layerRecord;
        var layer = record.getLayer();
        var opacity = layer.opacity;
        if(opacity == null) {
            opacity = 1;
        }
        var formats = [];
        var currentFormat = layer.params["FORMAT"].toLowerCase();
        Ext.each(record.get("formats"), function(format) {
            if(this.imageFormats.test(format)) {
                formats.push(format.toLowerCase());
            }
        }, this);
        if(formats.indexOf(currentFormat) === -1) {
            formats.push(currentFormat);
        }
        var transparent = layer.params["TRANSPARENT"];
        transparent = (transparent === "true" || transparent === true);
        
        return {
            title: this.displayText,
            style: {"padding": "10px"},
            layout: "form",
            labelWidth: 70,
            items: [{
                xtype: "slider",
                name: "opacity",
                fieldLabel: this.opacityText,
                value: opacity * 100,
                //TODO remove the line below when switching to Ext 3.2 final
                values: [opacity * 100],
                anchor: "99%",
                isFormField: true,
                listeners: {
                    change: function(slider, value) {
                        layer.setOpacity(value / 100);
                        this.fireEvent("change");
                    },
                    scope: this
                }
            }, {
                xtype: "combo",
                fieldLabel: this.formatText,
                store: formats,
                value: currentFormat,
                mode: "local",
                triggerAction: "all",
                editable: false,
                anchor: "99%",
                listeners: {
                    select: function(combo) {
                        var format = combo.getValue();
                        layer.mergeNewParams({
                            format: format
                        });
                        Ext.getCmp('transparent').setDisabled(format == "image/jpeg");
                        this.fireEvent("change");
                    },
                    scope: this
                }
            }, {
                xtype: "checkbox",
                id: 'transparent',
                fieldLabel: this.transparentText,
                checked: transparent,
                listeners: {
                    check: function(checkbox, checked) {
                        layer.mergeNewParams({
                            transparent: checked ? "true" : "false"
                        });
                        this.fireEvent("change");
                    },
                    scope: this
                }
            }]
        };
    },    

	loadMaskMsg: "Fetching data..",
	noDataMsg: "No data available in current view",
    showMask: function(cmp) {
        if(!this.loadMask) this.loadMask = new Ext.LoadMask(cmp.getEl(), {msg: this.loadMaskMsg});
        this.loadMask.show();
    },
    
    hideMask: function() {
	  if(this.loadMask){
	   this.loadMask.hide();
	  }
    },
    
    /** private: createRasterRiskSummaryPanel
     *  Creates the Raster WPS Risk Summary panel.
     */
    area:	  null,
	count: 	  null,
	min: 	  null,
	max: 	  null,
	sum: 	  null,
	avg: 	  null,
	stddev:   null,
	riskarea: null,
    createRasterRiskSummaryPanel: function() {
        //var record 	= this.layerRecord;
        //var layer  	= record.getLayer();

    	//var extent 	= this.map.getExtent().toGeometry();
    	//var crs    	= this.map.getProjection();

		this.area		= " - ";
		this.count		= " - ";
		this.min		= " - ";
		this.max		= " - ";
		this.sum		= " - ";
		this.avg		= " - ";
		this.stddev		= " - ";
    	
    	
    	var onRefreshButtonClicked = function() {
                    
                    var extent  = this.map.getExtent().toGeometry();
                    var crs     = this.map.getProjection();
                    var projection = this.map.getProjectionObject();
                    
					var poly = new OpenLayers.Geometry.MultiPolygon(extent);
					var area = poly.getGeodesicArea( projection );
					var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT["km"];
			        if(inPerDisplayUnit) {
			            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT["m"];
			            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
			        }
			        
			        	// nmi -> area = (area.toFixed(2) * 1000 * 0.000539956803);
			        	area = Math.round(area*100)/100; 
                    
                    var requestObject={
                        /* storeExecuteResponse: false,
                           lineage:  false,
                           status: false,*/
                        type: "raw",
                        inputs:{
                            layerName: new OpenLayers.WPSProcess.LiteralData({
                                value: this.layerRecord.get("name")
                            }),
                            areaOfInterest: new OpenLayers.WPSProcess.ComplexData({
                                value: extent.toString(),/*"POLYGON((-10.723 35.523, -10.723 50.884, 30.938 50.884, 30.938 35.523, -10.723 35.523))"*/
                                mimeType: "application/wkt"
                            }),
                            aoiCRS: new OpenLayers.WPSProcess.LiteralData({
                                value: crs/*"EPSG:4326"*/
                            })
                            /* geom: new OpenLayers.WPSProcess.ReferenceData({
                                     href: "http://localhost:8089/geoserver/wfs?request=GetFeature&version=1.1.0&typeName=topp:states&propertyName=STATE_NAME,PERSONS&BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326",
                                     mimeType: "text/xml; subtype=gml/3.1.1",
                                     method: "GET"
                            }),*/
                            /*geom: new OpenLayers.WPSProcess.ComplexData({
                                value: "POINT(6 40)",
                                mimeType: "text/xml; subtype=gml/3.1.1"
                            })*/
                        },
                        outputs: [{
                            identifier: "result",
                            mimeType: "text/xml"
                            //asReference: true,
                            //type: "raw"
                        }]
                    };
                    
                    this.showMask(Ext.getCmp("riskSummaryTab"));
                    
                    var me = this;
                    this.wps.execute("gs:RasterStatistics",requestObject,
                        function(response){
                            var fc = OpenLayers.Format.XML.prototype.read.apply(this, [response]);
                            var fid = OpenLayers.Ajax.getElementsByTagNameNS(fc, "http://www.opengis.net/gml","gml", "IDARiskSummaryProcess")[0];
                            
                            //me.composerList.push(fid);
                            if(!fid){
                                var wpsError=new OpenLayers.Format.WPSExecute().read(response);
                                if(wpsError && wpsError.executeResponse.status){
                                        var ex = wpsError.executeResponse.status.exception.exceptionReport.exceptions[0];
                                        if(ex)
                                        {
                                            Ext.Msg.show({
                                                title:"SPM: " + ex.code,
                                                msg: ex.texts[0] ,
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.ERROR
                                            });
                                        }
                                }
                            } else {
                                // TODO: is there a better way to get these data?
                                var count_tag = OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "count");
                                if(count_tag.length > 0){
                                	Ext.getCmp("areaStatsTextField").setValue(area + " km2");
                                	Ext.getCmp("countStatsTextField").setValue(OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "count")[0].childNodes[0].data);
                                	Ext.getCmp("minStatsTextField").setValue(OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "min")[0].childNodes[0].data);
                                	Ext.getCmp("maxStatsTextField").setValue(OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "max")[0].childNodes[0].data);
                                	Ext.getCmp("sumStatsTextField").setValue(OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "sum")[0].childNodes[0].data);
                                	Ext.getCmp("avgStatsTextField").setValue(OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "avg")[0].childNodes[0].data);
                                	Ext.getCmp("stddevStatsTextField").setValue(OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "stddev")[0].childNodes[0].data);
                                	if (OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "riskarea")[0]) {
                                		var riskArea = OpenLayers.Ajax.getElementsByTagNameNS(fid, "http://www.opengis.net/gml","gml", "riskarea")[0].childNodes[0].data;
                                		if (!(riskArea === " - "))
                                    		Ext.getCmp("riskareaStatsTextField").setValue(riskArea + " km2");
                                    }
                                }else{
                                	Ext.getCmp("areaStatsTextField").setValue(me.noDataMsg);
                                    Ext.getCmp("countStatsTextField").setValue(me.noDataMsg);
                                    Ext.getCmp("minStatsTextField").setValue(me.noDataMsg);
                                    Ext.getCmp("maxStatsTextField").setValue(me.noDataMsg);
                                    Ext.getCmp("sumStatsTextField").setValue(me.noDataMsg);
                                    Ext.getCmp("avgStatsTextField").setValue(me.noDataMsg);
                                    Ext.getCmp("stddevStatsTextField").setValue(me.noDataMsg);
                                    Ext.getCmp("riskareaStatsTextField").setValue(me.noDataMsg);
                                }           
                            }
                            
                            me.hideMask();
                        },
                        this
                    );
                }
    	
     	return {
            title: this.idaRasterRiskSummaryText,
            id: "riskSummaryTab",
            layout: "form",
            style: "padding: 10px",
            items: [{
                xtype: "label",
            	text: this.idaRasterRiskSummaryInfoText,
            	cls: "riskSummaryInfoText"
            },
            {
                xtype: "textfield",
                // ref: "../area",
                id: "areaStatsTextField",
                fieldLabel: "area",
                anchor: "99%",
                value: this.area,
                readOnly: true
            },
            {
                xtype: "textfield",
                // ref: "../count",
                id: "countStatsTextField",
                fieldLabel: "count",
                anchor: "99%",
                value: this.count,
                readOnly: true
            },
            {
                xtype: "textfield",
                // ref: "../min",
                id: "minStatsTextField",
                fieldLabel: "min",
                anchor: "99%",
                value: this.min,
                readOnly: true
            },
            {
                xtype: "textfield",
                // ref: "../max",
                id: "maxStatsTextField",
                fieldLabel: "max",
                anchor: "99%",
                value: this.max,
                readOnly: true
            },
            {
                xtype: "textfield",
                // ref: "../sum",
                id: "sumStatsTextField",
                fieldLabel: "sum",
                anchor: "99%",
                value: this.sum,
                readOnly: true
            },
            {
                xtype: "textfield",
                // ref: "../avg",
                id: "avgStatsTextField",
                fieldLabel: "avg",
                anchor: "99%",
                value: this.avg,
                readOnly: true
            },
            {
                xtype: "textfield",
                // ref: "../stddev",
                id: "stddevStatsTextField",
                fieldLabel: "stddev",
                anchor: "99%",
                value: this.stddev,
                readOnly: true
            },
            {
                xtype: "textfield",
                // ref: "../riskarea",
                id: "riskareaStatsTextField",
                fieldLabel: "riskarea",
                anchor: "99%",
                value: this.riskarea,
                readOnly: true
            }],
            bbar:[{
                tooltip: this.refreshText,
                overflowText: this.refreshText,
                iconCls: 'x-tbar-loading',
                handler: onRefreshButtonClicked,
                scope: this
            }],
            listeners: {
            	scope: this,
            	render: onRefreshButtonClicked
            }
        }
    }

});

Ext.reg('gxp_wmslayerpanel', gxp.WMSLayerPanel); 
