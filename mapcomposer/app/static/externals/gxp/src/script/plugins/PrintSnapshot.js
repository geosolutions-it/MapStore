/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = PrintSnapshot
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: PrintSnapshot(config)
 *
 *    Provides an action to print a snapshot of the map.
 */
gxp.plugins.PrintSnapshot = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_printsnapshot */
    ptype: "gxp_printsnapshot",

	/** private: property[iconCls]
     */
    iconCls: "gxp-icon-printsnapshot",
    
	/** api: config[customParams]
     *  ``Object`` Key-value pairs of custom data to be sent to the print
     *  service. Optional. This is e.g. useful for complex layout definitions
     *  on the server side that require additional parameters.
     */
    customParams: null,
    
    /** api: config[menuText]
     *  ``String``
     *  Text for print menu item (i18n).
     */
    menuText: "Snapshot",

    /** api: config[tooltip]
     *  ``String``
     *  Text for print action tooltip (i18n).
     */
    tooltip: "Snapshot",
	
	/** api: config[service]
     *  ``String``
     *  The ServiceBox URL.
     */
	service: null,
	
    /** api: config[noSupportedLayersErrorMsg]
     *  ``String``
     */
	noSupportedLayersErrorMsg: "Error occurred while generating the Map Snapshot: No Supported Layers have been found!",
	
	/** api: config[generatingErrorMsg]
     *  ``String``
     */
	generatingErrorMsg: "Error occurred while generating the Map Snapshot",
	
	/** api: config[printStapshotTitle]
     *  ``String``
     */
	printStapshotTitle: "Print Snapshot",
	
	/** api: config[serverErrorMsg]
     *  ``String``
     */
	serverErrorMsg: "Error occurred while generating the Map Snapshot: Server Error",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.PrintSnapshot.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
		var me = this;
		
    	var actions = gxp.plugins.Print.superclass.addActions.call(this, [{
                menuText: this.menuText,
                tooltip: this.tooltip,
                iconCls: this.iconCls,
                disabled: false,
                handler: function() {
                	var canvas = document.getElementById("printcanvas");
                	var mapPanel = this.target.mapPanel;
                	var map = mapPanel.map;
                	
                	var width = map.div.style.width;
                	    width = width.substring(0, width.indexOf('px'));
                	var height = map.div.style.height;
                	    height = height.substring(0, height.indexOf('px'));
                	
                	var extent = map.getExtent();
                	var layers = map.layers;
                	
                	var baseURL;
                	var srsID;
                	var unSupportedLayers = [];
                	var supportedLayers = [];
                	var vectorialLayers = [];
                	var filters = [];
                	for (var i = 0; i < layers.length; i++) {
                		var layer = layers[i].clone();
                		if (layer.getVisibility()) {
                			if (layer.url && layer instanceof OpenLayers.Layer.WMS) {
	                			supportedLayers.push(layer.params.LAYERS);
	                			filters.push(layer.params.CQL_FILTER ? encodeURIComponent(layer.params.CQL_FILTER) : "INCLUDE");
	                			
	                			if (!baseURL) {
	                				baseURL = layer.url;
	                			}
	                			
	                			if (!srsID) {
	                				srsID = layer.projection.projCode;
	                			}
	                		}

                			else if (layer instanceof OpenLayers.Layer.Vector) {
                				vectorialLayers.push(layer.clone());
                			}
                			
                			else {
                				unSupportedLayers.push(layer.clone());
                			}
                		}
                	}
                    
                    var gsURL = baseURL + 
                        "SERVICE=WMS" +
                        "&LAYERS=" + supportedLayers.join(",") +
                        "&FORMAT=" + encodeURIComponent("image/png") + 
                        "&SRS=" + srsID +  
                        "&VERSION=1.1.1" +
                        "&REQUEST=GetMap" +
                        "&BBOX=" + encodeURIComponent(extent.toBBOX())+
                        "&WIDTH=" + width +
                        "&HEIGHT=" + height +
                        "&CQL_FILTER=" + filters.join(";");
						
                	var mHost = me.service.split("/");
					
                	var img = new Image();
                	
                	img.onload = function(){
                    	//Draw
                    	canvas.width  = width;     // change if you have to add legend
                    	canvas.height = height;    // change if you have to add legend
                    	var ctx = canvas.getContext("2d");

                    	//WARNING: cross domain is not allowed 
                    	ctx.drawImage(img,0, 0);
						
                    	//to avoid clear use another canvas and draw on the old after executing canvg
                    	var canvas2 = document.createElement("canvas");
                    	canvas2.width  = width;     // change if you have to add legend
                    	canvas2.height = height;    // change if you have to add legend

						// draw vectorial layers
						if (vectorialLayers) {
							for (var i = 0; i < map.div.getElementsByTagName('svg').length; i++) {
								var svgTags = map.div.getElementsByTagName('svg');
								for (var c=0; c<svgTags.length; c++) {
					                var svgTag = svgTags[c].cloneNode(true);
					                var div = document.createElement('div');
					                div.appendChild(svgTag);
					                        
					                canvg(canvas2, div.innerHTML,{
					                    ignoreMouse: true,
					                    ignoreAnimation: true,
					                    ignoreDimensions: true,
					                    ignoreClear: true,
					                    offsetX: 0,
					                    offsetY: 0
					                });
								}
							}
						}
						
						// Print final image
                    	canvas.getContext('2d').drawImage(canvas2, 0,0);
		    			
		    			// Save
                    	var canvasData = canvas.toDataURL("image/png;base64");
	                    
	                    var mUrl = me.service + "UploadCanvas";
                	    	mUrl = mHost[2] == location.host ? mUrl : proxy + mUrl;
							
						Ext.Ajax.request({
						    url: mUrl,
						    method: "POST",
						    headers:{
						    	  'Content-Type' : 'application/upload'
						    },
						    params: canvasData,
						    scope: this,
						    success: function(response, opts){
								if (response.readyState == 4 && response.status == 200){
								    if(response.responseText && response.responseText.indexOf("\"success\":false") < 0){
								        var fname = "mapstore-snapshot.png";
								    
								        var mUrl = me.service + "UploadCanvas";
								            mUrl = mHost[2] == location.host ? mUrl + "?ID=" + response.responseText + "&fn=" + fname : proxy + encodeURIComponent(mUrl + "?ID=" + response.responseText + "&fn=" + fname);
								        
								        window.location.assign(mUrl);
								        enableSaving = true;
								    }else{
								        // this error should go to failure
								        Ext.Msg.show({
								             title: me.printStapshotTitle,
								             msg: me.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
								             width: 300,
								             icon: Ext.MessageBox.ERROR
								        });
								    }
								}else if (response.status != 200){
									Ext.Msg.show({
										 title: 'Print Snapshot',
										 msg: this.serverErrorMsg,
										 width: 300,
										 icon: Ext.MessageBox.ERROR
									});
								}					
						    },
						    failure:  function(response, opts){
								Ext.Msg.show({
									 title: me.printStapshotTitle,
									 msg: me.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
									 width: 300,
									 icon: Ext.MessageBox.ERROR
								});
						    }
						});
                    };
                    
                    if (supportedLayers.length > 0)
                    	img.src = proxy + encodeURIComponent(gsURL);
                   	else {
                   		Ext.Msg.show({
			                 title: this.printStapshotTitle,
			                 msg: this.noSupportedLayersErrorMsg,
			                 width: 300,
			                 icon: Ext.MessageBox.ERROR
			            });
                   	}
                },
                scope: this,
                listeners: {
                    render: function() {
                        // wait to load until render so we can enable on success
                    }
                }
            }]);
            
		return actions;
    }
});

Ext.preg(gxp.plugins.PrintSnapshot.prototype.ptype, gxp.plugins.PrintSnapshot);
