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
    
    /** api: config[fileName]
     *  ``String``
     *  The name of the file to download
     */
    fileName: "mapstore-snapshot.png",
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
     *  ``String`` (i18n).
     */
	noSupportedLayersErrorMsg: "The following layers can not be printed because of terms of usage:",
    
    /** api: config[suggestionLayersMsg]
     *  ``String`` (i18n).
     */
    suggestionLayersMsg:"try to use OpenStreetMap or MapQuest Layers instead",
	
	/** api: config[generatingErrorMsg]
     *  ``String`` (i18n).
     */
	generatingErrorMsg: "Error occurred while generating the Map Snapshot",
	
	/** api: config[printStapshotTitle]
     *  ``String`` (i18n).
     */
	printStapshotTitle: "Print Snapshot",
	
	/** api: config[serverErrorMsg]
     *  ``String`` (i18n).
     */
	serverErrorMsg: "Error occurred while generating the Map Snapshot: Server Error",
	
	/**
	 * notSupportedTooltip
     * ``String`` (i18n).
	 */
	notSupportedTooltip: "This tool is not supported by your browser",
    
    /**
	 * textLoadingTooltip
     * ``String`` (i18n).
	 */
	textLoadingTooltip: "Generating the Snapshot, Please wait...",
    
    /** 
     * private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.PrintSnapshot.superclass.constructor.apply(this, arguments);
    },
    
    /**
     * api config[addAttribution]
     * use CORS headers.
     * Does a fist request that try to download the images without using proxy. 
     * if fails, do a second request using the proxy
     */
    useCORS: true,
    
    /**
     * Add the attribution html to the generated picture
     */
    addAttribution: true,
    
    /**
     * api config[drawVectorLayers]
     * draw all vector layers.
     */
    drawVectorLayers:true,
    
    /** 
     * api: method[addActions]
     */
    addActions: function() {
		var me = this;
		var canvas = document.getElementById("printcanvas");
		//disable tool if not supported 
		var disabled = !(canvas && canvas.getContext);
    	var actions = gxp.plugins.Print.superclass.addActions.call(this, [{
                menuText: this.menuText,
                tooltip: disabled ? this.notSupportedTooltip : this.tooltip,
                iconCls: this.iconCls,
                disabled: disabled,
                scope: this,
                handler: function(btn) {
                    //regex is for IE11 so we have to use a servlet
                    if(Ext.isIE11 === undefined){
                        Ext.isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
                    }
                    if(!canvas.getContext){
						alert("Your browser doesn't support this tool");
						btn.setDisabled(true);
						return;
					}
                    //don't print unsupported layers (for terms of usage)
                    var suppLayers =this.getSupportedLayers();
                    if(suppLayers.notSupported.length>0){
                        this.notSupportedMessage(suppLayers);
                        return;
                    }
                    this.startLoading();
                    var me = this;
                    html2canvas( app.mapPanel.map.div,{
                            proxy: proxy,
                           // allowTaint:true,  
                            //CORS errors not managed with ie11, so disable
                            useCORS: me.useCORS && !Ext.isIE11,
                            //logging:true,
                            onrendered: function(c) {
                                var finish = function(c){
                                    //add vector layers on top if present
                                    if(me.drawVectorLayers && suppLayers.vectorialLayers && suppLayers.vectorialLayers.length>0){
                                        me.drawVector(c,suppLayers.vectorialLayers);
                                    }
                                    
                                    
                                     var canvasData = c.toDataURL("image/png;base64");
                                     if(Ext.isIE || Ext.isIE11){
                                        me.uploadCanvas(canvasData);
                                    }else{
                                        me.localDownload(canvasData);
                                    }
                                }
                                
                                 //debug
                                 //window.open(c.toDataURL("image/png;base64"));

                                // IE doesn't support download from link
                                // a servlet is needed
                                if( me.addAttribution ){
                                    var div = document.getElementsByClassName("olControlAttribution")[0]    ;
                                    html2canvas( div,{
                                            proxy: proxy,
                                            useCORS: me.useCORS && !Ext.isIE11,
                                            onrendered: function(canvas) {
                                                //draw attribution in  bottom-left corder.
                                                c.getContext('2d').drawImage(canvas, 0,c.height - canvas.height);
                                                finish(c);
                                            }
                                    });
                                }else{
                                   
                                   finish(c);
                                }

                            }
                    });
                    return;
                    //this.oldHandler(btn);
                	},
                
                listeners: {
                    render: function() {
                        // wait to load until render so we can enable on success
                    }
                }
            }]);
        this.button = actions[0].items[0];
		return actions;
    },
    
    /**
     * private method[startLoading]
     * Show loading message (as tooltip) and disable the button.
     */
    startLoading : function(){
        this.button.setTooltip(this.textLoadingTooltip);
        this.button.setDisabled(true);
        
    },
    
    /**
     * private method[stopLoading]
     * Remove loading message (as tooltip) and enable the button.
     */
    stopLoading : function(){
         this.button.setTooltip(this.tooltip);
        this.button.setDisabled(false);
       
    },
    
    /**
     * private method[getSupportedLayers]
     * Check if layers are supported. return an object with supported,notSupported and vectorialLayers.
     */
    getSupportedLayers: function(){
        var mapPanel = this.target.mapPanel;
        function getSupportedLayers() {
                var supported = [], notSupported = [];
                var vectorialLayers=[];
                mapPanel.layers.each(function(record) {
                    var layer = record.getLayer();
                    if (isSupported(layer)) {
                        supported.push(layer);
                        if (layer instanceof OpenLayers.Layer.Vector) {
                            vectorialLayers.push(layer.clone());
                        }
                    } else {
                        if(layer.getVisibility()){
                            if( layer.name ){
                                //add only named layers
                                notSupported.push(layer.name);
                            }
                        }
                    }
                });
                return  { 'supported' : supported, 'notSupported' : notSupported, vectorialLayers: vectorialLayers };
        }

        function isSupported(layer) {
            var map = mapPanel.map;

            var drawcontrols = map.getControlsByClass("OpenLayers.Control.DrawFeature");
            var size = drawcontrols.length;
            for (var i=0; i<size; i++){
                drawcontrols[i].deactivate();
            }

            return (
                layer instanceof OpenLayers.Layer.WMS ||
                layer instanceof OpenLayers.Layer.OSM ||
                layer.name == 'None'                  ||  
                layer instanceof OpenLayers.Layer.Vector
            );
        }
        return getSupportedLayers();
    },
    
     /**
     * private method[notSupportedMessage]
     * Show the message about the not supported layers.
     */
    notSupportedMessage: function(layers){
        var messageTrail=""; 
        for(var i = 0; i< layers.notSupported.length ; i++){
            messageTrail+=layers.notSupported[i] +",";
         } 
         Ext.Msg.show({
             title: this.printStapshotTitle,
             msg: this.noSupportedLayersErrorMsg + ":<br/>" +messageTrail +"<br/>"+ this.suggestionLayersMsg ,
             width: 300,
             icon: Ext.MessageBox.ERROR
        });
    },
    /**
     * private method[drawVector]
     * Draw the vector layers on canvas
     */
    drawVector: function(canvas,vectorialLayers){
        var map =this.target.mapPanel.map;
        var width = map.div.style.width;
                	    width = width.substring(0, width.indexOf('px'));
                	var height = map.div.style.height;
                	    height = height.substring(0, height.indexOf('px'));
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
    },
    
    /**
     * private method[localDownload]
     * Use a link and emulate click to download the data:image in the canvasData argument. 
     * Works for Chrome and Firefox
     */
    localDownload: function(canvasData){
        var img = new Image();
        img.src= canvasData;
        var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = this.fileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        this.stopLoading();
    
    },
    
    /** api: method[uploadCanvas]
     * upload base64 ecoded canvas data to servicebox and finalize with download response.
     * A service that forces download is needed for Internet Explorer (now IE11 download attribute in link is not supported)
     */
    uploadCanvas: function (canvasData){
        var mHost = this.service.split("/");

        var mUrl = this.service + "UploadCanvas";
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
                        var fname = this.fileName;

                        var mUrl = this.service + "UploadCanvas";
                            mUrl = mHost[2] == location.host ? mUrl + "?ID=" + response.responseText + 
                                "&fn=" + fname : proxy + encodeURIComponent(mUrl + "?ID=" + response.responseText + "&fn=" + fname);

                        this.target.safeLeaving =true;
                        window.location.assign(mUrl);
                        enableSaving = true;
                    }else{
                        // this error should go to failure
                        Ext.Msg.show({
                             title: this.printStapshotTitle,
                             msg: this.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
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
                this.stopLoading();
            },
            failure:  function(response, opts){
                Ext.Msg.show({
                     title: this.printStapshotTitle,
                     msg: this.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
                     width: 300,
                     icon: Ext.MessageBox.ERROR
                });
                this.stopLoading();
            }
        });
    },
    
    /**
     * private method[copy2Win]
     * debug utility fuction to check the image without a remote service. 
     * 
     */
    copy2Win : function (c){
        destWin = window.open("","destWin");
        var destWinDoc = destWin.document;
        var destWinHTML = "<!DOCTYPE html><html><head><title>POPUP</title><body><div id='destWin' style='width:640px; height:480px; border:1px solid red'><img src='" +
            c.toDataURL("image/png") + "' alt='Copy!' /></div></body></html>";
        destWinDoc.write(destWinHTML);    
        destWinDoc.appendChild(c);
    }
});

Ext.preg(gxp.plugins.PrintSnapshot.prototype.ptype, gxp.plugins.PrintSnapshot);