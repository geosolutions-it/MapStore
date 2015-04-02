/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * requires plugins/Tool.js
 * requires plugins/FeatureEditorGrid.js
 * requires GeoExt/widgets/Popup.js
 * requires OpenLayers/Control/WMSGetFeatureInfo.js
 * requires OpenLayers/Format/WMSGetFeatureInfo.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WMSGetFeatureInfo
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSGetFeatureInfo(config)
 *
 *    This plugins provides an action which, when active, will issue a
 *    GetFeatureInfo request to the WMS of all layers on the map. The output
 *    will be displayed in a popup.
 */   
gxp.plugins.WFSGetGraphs = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wmsgetfeatureinfo */
    ptype: "gxp_wfsgetgraphs",
    
    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** private: property[popupCache]
     *  ``Object``
     */
    popupCache: null,

    /** api: config[infoActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    infoActionTip: "View stations's graph",

    /** api: config[popupTitle]
     *  ``String``
     *  Title for info popup (i18n).
     */
    popupTitle: "Graph",
    
    /** api: config[text]
     *  ``String`` Text for the GetFeatureInfo button (i18n).
     */
    buttonText: "View stations's graph",
    
    mainLoadingMask: "Please wait, loading...",
    
    csvExportText: "CSV Export",
    
    /** api: config[format]
     *  ``String`` Either "html" or "grid". If set to "grid", GML will be
     *  requested from the server and displayed in an Ext.PropertyGrid.
     *  Otherwise, the html output from the server will be displayed as-is.
     *  Default is "html".
     */
    format: "grid",
    
    url: null,
    
    /** api: config[vendorParams]
     *  ``Object``
     *  Optional object with properties to be serialized as vendor specific
     *  parameters in the requests (e.g. {buffer: 10}).
     */
    
    /** api: config[layerParams]
     *  ``Array`` List of param names that should be taken from the layer and
     *  added to the GetFeatureInfo request (e.g. ["CQL_FILTER"]).
     */
     layerParams: ["TIME","ELEVATION","CQL_FILTER"],    

    /** private: method[constructor]
     */
    constructor: function(config) {		
        gxp.plugins.WFSGetGraphs.superclass.constructor.apply(this, arguments);
    },

    /** private: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
		gxp.plugins.WFSGetGraphs.superclass.init.apply(this, arguments);
        this.layers = target.map.layers;
	},
    
    /** api: config[itemConfig]
     *  ``Object`` A configuration object overriding options for the items that
     *  get added to the popup for each server response or feature. By default,
     *  each item will be configured with the following options:
     *
     *  .. code-block:: javascript
     *
     *      xtype: "propertygrid", // only for "grid" format
     *      title: feature.fid ? feature.fid : title, // just title for "html" format
     *      source: feature.attributes, // only for "grid" format
     *      html: text, // responseText from server - only for "html" format
     */

    /** api: method[addActions]
     */
    addActions: function() {

        this.popupCache = {};
        var actions = gxp.plugins.WFSGetGraphs.superclass.addActions.call(this, [{
            tooltip: this.infoActionTip,
            iconCls: "gxp-icon-graph-wfs",
            //text: this.buttonText,           
            //buttonText: this.buttonText,
            toggleGroup: this.toggleGroup,
            enableToggle: true,
            allowDepress: true,
            toggleHandler: function(button, pressed) {
                for (var i = 0, len = info.controls.length; i < len; i++){
                    if (pressed) {
                        info.controls[i].activate();
                    } else {
                        info.controls[i].deactivate();
                    }
                }
             }
        }]);
        var infoButton = this.actions[0].items[0];

        var info = {controls: []};
        var valueData = new Array();
        var timeData = new Array();
        var count=0;
        var updateInfo = function() {
            var queryableLayers = this.target.mapPanel.layers.queryBy(function(x){
                return x.get("queryable");
            });

            var map = this.target.mapPanel.map;
            var control;
            for (var i = 0, len = info.controls.length; i < len; i++){
                control = info.controls[i];
                control.deactivate();  // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
                control.destroy();
            }

            info.controls = [];
            queryableLayers.each(function(x){
                var layer = x.getLayer();
                var vendorParams = Ext.apply({}, this.vendorParams), param;
                if (this.layerParams) {
                    for (var i=this.layerParams.length-1; i>=0; --i) {
                        param = this.layerParams[i].toUpperCase();
                        vendorParams[param] = layer.params[param];
                    }
                }
                var infoFormat = x.get("infoFormat");
                if (infoFormat === undefined) {
                    // TODO: check if chosen format exists in infoFormats array
                    // TODO: this will not work for WMS 1.3 (text/xml instead for GML)
                    infoFormat = this.format == "html" ? "text/html" : "application/vnd.ogc.gml";
                }
                var control = new OpenLayers.Control.WMSGetFeatureInfo(Ext.applyIf({
                    url: layer.url,
                    queryVisible: true,
                    layers: [layer],
                    infoFormat: infoFormat,
                    vendorParams: vendorParams,
                    maxFeatures: 100,
                    eventListeners: {
                        getfeatureinfo: function(evt) {
                            var title = x.get("title") || x.get("name");
                            var displayGraph = x.get("getGraph") || false;
                            var cumulative = x.get("cumulative") || false;
                            var graphTable = x.get("graphTable") || null;
                            var graphAttribute = x.get("graphAttribute") || null;
                            var tabCode = x.get("tabCode") || null;
                            
                            if (infoFormat == "text/html") {
                                var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                                if (match && !match[1].match(/^\s*$/)) {
                                    this.displayPopup(evt, title, match[1]);
                                }
                            } else if (infoFormat == "text/plain") {
                                this.displayPopup(evt, title, '<pre>' + evt.text + '</pre>');
                            } else if (evt.features && evt.features.length > 0) {
                                    if(graphAttribute){
                                        this.displayChart(
                                                count,
                                                evt,
                                                title,
                                                x.get("getFeatureInfo"),
                                                graphTable,
                                                graphAttribute,
                                                cumulative,
                                                displayGraph,
                                                tabCode
                                            );
                                    }
                                    
                            }
                        },
                        scope: this
                    }
                }, this.controlOptions));
                map.addControl(control);
                info.controls.push(control);
                if(infoButton.pressed) {
                    control.activate();
                }
            }, this);

        };
        
        this.target.mapPanel.layers.on("update", updateInfo, this);
        this.target.mapPanel.layers.on("add", updateInfo, this);
        this.target.mapPanel.layers.on("remove", updateInfo, this);
        
        return actions;
    },
    
    displayChart: function(count, evt, title, featureinfo, table, attribute, cumulative, displayGraph, tabCode){


            
        var protocol = new OpenLayers.Protocol.WFS({
            url: this.url,
            version: "1.1.0",
            featureType: evt.features[0].gml.featureType,
            featureNS: evt.features[0].gml.featureNS,
            //geometryName: "wkb_geometry",
            srsName: "EPSG:4326",
            extractAttribute: true
        });          
            
        var featureFilter = new OpenLayers.Filter.Comparison({
            type: OpenLayers.Filter.Comparison.EQUAL_TO,
            property: tabCode,
            value: evt.features[0].data[tabCode]
        });
        
        var delLastChar = function (str){
            len = str.length;
            str = str.substring(0,len-1);
            return str;
        }
        
        var findCampo = function() {
            return attribute;
        }
        
        var checkCumulative = function() {
            return cumulative;
        }   

        
        var checkListValues = function() {
            var listValue = {
                attribute: findCampo(),
                layers: evt.features[0].gml.featureType,
                id: evt.features[0].data[tabCode]
            };
            return listValue;
        }         
        
        var popup;
        var tabPanel;
        var popupKey = evt.xy.x + "." + evt.xy.y;
        featureinfo = featureinfo || {};
        
        if (!(popupKey in this.popupCache)) {
        
            for(var oldkey in this.popupCache){
                this.popupCache[oldkey].close();
            }
        
            popup = this.addOutput({
                xtype: "gx_popup",
                title: this.popupTitle,
                layout: "fit",
                fill: false,
                autoScroll: true,
                location: evt.xy,
                map: this.target.mapPanel,
                width:605,
                height:380,
                items  : {
                    xtype           : 'tabpanel',
                    activeTab       : 0,
                    minTabWidth     : 10,
                    tabWidth        : 170,           
                    id              : 'wfsGraphTab',
                    enableTabScroll : true,
                    resizeTabs      : true,
                    layoutOnTabChange:true,
                    deferredRender:false
                },
                listeners: {
                    close: (function(key) {
                        return function(panel){
                            delete this.popupCache[key];
                        };
                    })(popupKey),
                    scope: this
                }
            });
            this.popupCache[popupKey] = popup;
        } else {
            popup = this.popupCache[popupKey];
        }
        
        var features = evt.features, config = [];

        //popup.doLayout();
        
        Ext.getCmp('wfsGraphTab').add({
            title: title,
            resizeTabs: true,
            html: "<div id='chartContainer_" + title + "' style='min-height: 305px; min-width: 584px'></div>",
			/*bbar:[
				"->",{xtype:'button',text:this.csvExportText,iconCls:'icon-disk',handler:function(){
                    var campo = checkListValues();
                    var geoUrl = this.ownerCt.ownerCt.scope.url;
                    var attributes = campo.attribute.length > 1 ? campo.attribute[0] + "%2C" + campo.attribute[1] : campo.attribute[0];
					window.open(geoUrl + "propertyName=fornitore%2Cnome%2Cid%2Cdata_ora%2Cquota%2C"+attributes+"&service=WFS&version=1.0.0&request=GetFeature&typeName="+evt.features[0].gml.featureNSPrefix+"%3A"+campo.layers+"&outputFormat=CSV&sortby=data_ora&CQL_FILTER=id="+campo.id);
				}}],*/
            scope: this
        });
        
        Ext.getCmp('wfsGraphTab').doLayout();
        
        Ext.getCmp('wfsGraphTab').setActiveTab(0);
        
        var mask = new Ext.LoadMask(Ext.getCmp('wfsGraphTab').el, {msg:this.mainLoadingMask});
        mask.show();
        
        var chart;
        var protRead = protocol.read({
            filter: featureFilter,
            callback: function(response) {
            
                if(response.features.length > 0) {
                    if(displayGraph){
                        var campo = findCampo();
                        var data = "[";
                        
                        for (var i = 0; i<response.features.length; i++){
                            var time = OpenLayers.Date.parse(response.features[i].data.data_ora);
                            var cccc = new Date(time);
                            data += "[" + cccc.getTime() + "," + response.features[i].data[campo[0]] + "],";
                        }
                        
                        data = delLastChar(data);   
                        data += "]";
                        data = Ext.util.JSON.decode(data);
                        data = data.sort();
                        
                        var cum = checkCumulative();
                        
                        if (cum){
                            var makeCumulative = parseFloat(data[0].slice(1));
                            data[0].splice(1,1,makeCumulative);
                            
                            for (var  i = 1; i<data.length; i++){
                                makeCumulative = makeCumulative + parseFloat(data[i].slice(1));
                                data[i].splice(1,1,parseFloat(makeCumulative.toFixed(2)));
                            }
                        }

                        Ext.onReady(function () {
                            var chart = new Highcharts.StockChart({
                                chart : {
                                    type: 'line',
                                    renderTo : "chartContainer_" + title
                                },
                                rangeSelector : {                                
                                    buttons: [{
                                        type: 'day',
                                        count: 0.25,
                                        text: '6 h'
                                    },{
                                        type: 'day',
                                        count: 0.5,
                                        text: '12 h'
                                    },{
                                        type: 'day',
                                        count: 1,
                                        text: '1 d'
                                    }, {
                                        type: 'all',
                                        text: 'All'
                                    }],                                
                                    selected : 3,
                                    enabled: true
                                },
                                legend: {
                                    enabled: false
                                },

                                title : {
                                    text : title,
                                    style: {
                                        color: '#3E576F',
                                        fontSize: '12px'
                                    }        
                                },
                                subtitle : {
                                    //text : response.features[0].data.fornitore + " - " + response.features[0].data.nome + " - Quota: " + response.features[0].data.quota,
                                    text : response.features[0].data.temp_med_acq ? "Average Sea Temperature" : "Quota: " + response.features[0].data.quota,
                                    style: {
                                        color: '#3E576F',
                                        fontSize: '10px'
                                    }        
                                },                            
                                series : [{
                                    name : title,
                                    data: data,
                                    tooltip: {
                                        valueDecimals: 2
                                    }
                                }]
                            }
                            );
         
                        });
                    }else{
                        var doc = document.getElementById("chartContainer_" + title);
                        doc.style.backgroundImage = "url('../theme/app/img/silk/nograph.png')";
                        doc.style.backgroundPosition = "center";
                        doc.style.backgroundRepeat = "no-repeat";             
                        mask.hide();
                    }
                    mask.hide();
                }
            }, scope: this
        });
    }  
});

Ext.preg(gxp.plugins.WFSGetGraphs.prototype.ptype, gxp.plugins.WFSGetGraphs);
