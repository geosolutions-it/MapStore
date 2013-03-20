/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = AOI
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AOI(config)
 *
 *    Plugin for set the  Area Of Interest on the map
 */   
gxp.plugins.AOI = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_aoi */
    ptype: "gxp_aoi",
    
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "aoi",
    
    /** api: config[aoiProjectionCode]
     *  ``String``
     *  
     */
    aoiProjectionCode: null,
    
    
    
    
    /** api: config[layerName]
     *  ``String``
     *  
     */
    layerName: "AOI",
    
    /** api: config[infoEPSGURL]
     *  ``String``
     *  
     */
    infoEPSGURL: null,
    
    /** api: config[epsgWinWidth]
     *  ``String``
     *  
     */
    epsgWinWidth: null,
    
    
    /** api: config[epsgWinHeight]
     *  ``String``
     *  
     */
    epsgWinHeight: null,
    
    
    /** api: config[updateMapMove]
     *  ``Boolean``
     *  
     */
    // updateMapMove: false,
    
    
    
    
    // start i18n
    northLabel:"Nord",
    westLabel:"Ovest",
    eastLabel:"Est",
    southLabel:"Sud",
    aoiFieldSetTitle: "Ambito Territoriale",
    setAoiText: "Seleziona Area",        
    setAoiTooltip: "Abilita la selezione della regione di interesse sulla mappa",
    waitEPSGMsg: "Attendere... Caricamento in corso",
    // end i18n
    
    
    /** api: config[spatialFilterOptions]
     *  ``Object``
     *  
     */
    spatialFilterOptions: {
        lonMax: 20037508.34,   
        lonMin: -20037508.34,
        latMax: 20037508.34,   
        latMin: -20037508.34  
    },
    
    
    /** api: config[urlEPSG]
     *  ``URL``
     *  
     */
    urlEPSG: null,
    
    
    
	
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.AOI.superclass.constructor.apply(this, arguments); 
   
    },
    

    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        if(this.outputTarget)
            this.show();
    },
    
    
    /** api: method[show]
     *  
     *  
     */
    show: function() {
        var me= this;
        this.map=this.target.mapPanel.map;

        this.aoiProjection = this.aoiProjectionCode ? new OpenLayers.Projection(this.aoiProjectionCode) : this.mapProjection;

        this.northField = new Ext.form.NumberField({
            fieldLabel: this.northLabel,
            id: me.id+"_NorthBBOX",
            width: 100,
            allowBlank: false,
            minValue: this.spatialFilterOptions.lonMin,
            maxValue: this.spatialFilterOptions.lonMax,
            decimalPrecision: 5,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        this.westField = new Ext.form.NumberField({
            fieldLabel: this.westLabel,
            id: me.id+"_WestBBOX",
            width: 100,
            allowBlank: false,
            minValue: this.spatialFilterOptions.latMin,
            maxValue: this.spatialFilterOptions.latMax,
            decimalPrecision: 5,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        this.eastField = new Ext.form.NumberField({
            fieldLabel: this.eastLabel,
            id: me.id+"_EastBBOX",
            width: 100,
            allowBlank: false,
            minValue: this.spatialFilterOptions.latMin,
            maxValue: this.spatialFilterOptions.latMax,
            decimalPrecision: 5,
            allowDecimals: true,
            hideLabel : false                    
        });
              
        this.southField = new Ext.form.NumberField({
            fieldLabel: this.southLabel,
            id: me.id+"_SouthBBOX",
            width: 100,
            allowBlank: false,
            minValue: this.spatialFilterOptions.lonMin,
            maxValue: this.spatialFilterOptions.lonMax,
            decimalPrecision: 5,
            allowDecimals: true,
            hideLabel : false                    
        });
        

        /*if(this.updateMapMove)
            this.map.events.register("move", this, this.aoiUpdater);*/
          

        this.aoiButton = new Ext.Button({
            text: this.setAoiText,
            tooltip: this.setAoiTooltip,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            iconCls: 'aoi-button',
            height: 50,
            width: 50,
            listeners: {
                scope: this, 
                toggle: function(button, pressed) {
                    if(pressed){      
                        //
                        // Reset the previous control
                        //
                        this.reset();

                        //
                        // Activating the new control
                        //   
                        
                        this.selectAOI.activate();
                    }else{
                        this.selectAOI.deactivate();
                    }
                }
            }
        }); 
        
        
        this.spatialFieldSet = new Ext.form.FieldSet({
            title:  me.aoiFieldSetTitle+" <a href='#' id='"+me.id+"_bboxAOI-set-EPSG'>["+this.aoiProjection.getCode()+"]</a>",
            id: me.id+"_bboxAOI-set",
            autoHeight: true,
            layout: 'table',
            layoutConfig: {
                columns: 3
            },
            defaults: {
                // applied to each contained panel
                bodyStyle:'padding:5px;'
            },
            bodyCssClass: 'aoi-fields',
            items: [                     
            {
                layout: "form",
                cellCls: 'spatial-cell',
                labelAlign: "top",
                border: false,
                colspan: 3,
                items: [
                this.northField
                ]
            },{
                layout: "form",
                cellCls: 'spatial-cell',
                labelAlign: "top",
                border: false,
                items: [
                this.westField
                ]
            },{
                layout: "form",
                cellCls: 'spatial-cell',
                border: false,
                items: [
                this.aoiButton
                ]                
            },{
                layout: "form",
                cellCls: 'spatial-cell',
                labelAlign: "top",
                border: false,
                items: [
                this.eastField
                ]
            },{
                layout: "form",
                cellCls: 'spatial-cell',
                labelAlign: "top",
                border: false,
                colspan: 3,
                items: [
                this.southField
                ]
            }]
        });
        
        var aoiPanel= new Ext.FormPanel({
            border: false,
            layout: "fit",
            id: me.id+"_mainPanel",
            autoScroll: true,
            listeners: {
                "afterlayout": function(){
                    Ext.get(me.id+"_bboxAOI-set-EPSG").addListener("click", me.openEPSGWin, me);  
                    me.mapProjection = new OpenLayers.Projection(me.map.getProjection());
                    
                    me.selectAOI = new OpenLayers.Control.SetBox({      
                        map: me.map,            
                        onChangeAOI: function(){  
                            me.setAOI(new OpenLayers.Bounds.fromString(this.currentAOI)); 
                            this.deactivate();
                            me.aoiButton.toggle();
                        } 
                    }); 
        
                    me.map.addControl(me.selectAOI);
                    me.map.enebaleMapEvent = true;
                },
                "resize": function(){
                   
                }
            },
            items:[
            this.spatialFieldSet,		
            ]
        });
        
        return aoiPanel;
        
    },
    
    /** public: method[removeAOILayer]	 
	 *     remove the AOI selection layer from the map
     */
    removeAOILayer: function(){
        var aoiLayer = this.map.getLayersByName(this.layerName)[0];
      
        if(aoiLayer)
            this.map.removeLayer(aoiLayer);    
    },
    
    
    /** public: method[reset]	 
	 *    reset AOI Panel
     */
    reset: function(){
         this.removeAOILayer();
         this.northField.reset();
         this.southField.reset();
         this.eastField.reset();
         this.westField.reset();  
    },
    
    /** public: method[setAOI]
     *  :arg bounds: ``Object``
	 *     change the current AOI, to the given bounds, converting it to AOI projection if needed
     */
    setAOI: function(bounds) {
        var aoiBounds;

        if(this.map.getProjection() != this.aoiProjection.getCode())
            aoiBounds = bounds.transform(this.mapProjection,this.aoiProjection);
        else
            aoiBounds= bounds;  
      
        this.northField.setValue(aoiBounds.top);
        this.southField.setValue(aoiBounds.bottom);
        this.westField.setValue(aoiBounds.left);
        this.eastField.setValue(aoiBounds.right); 
        
        this.fireEvent('select', this, aoiBounds);
    },
    
    
    /** public: method[isValid]
     *  
	 *     
     */
    isValid: function(){
        return(this.westField.isValid() &&
            this.southField.isValid() && 
                this.eastField.isValid() && 
                    this.northField.isValid());
    },
    
    
    /** public: method[isDirty]
     *  
	 *     
     */
    isDirty: function(){
        return(this.westField.isDirty() &&
            this.southField.isDirty() && 
                this.eastField.isDirty() && 
                    this.northField.isDirty());
    },


    
    
    /** public: method[getAOIMapBounds]
     *  
	 *   return the selected AOI bounds defined with the Map Projection  
     */
    getAOIMapBounds: function(){
        if(this.map.getProjection() != this.aoiProjection.getCode())  
            return this.getAOIBounds().transform(this.aoiProjection,this.mapProjection);
        else
            return this.getAOIBounds();
    },
    
    
    /** public: method[getAOIBounds]
     *  
	 *  return the selected AOI bounds defined with the Panel Projection   
     */
    getAOIBounds: function(){
        return new OpenLayers.Bounds(
                this.westField.getValue(), 
                this.southField.getValue(), 
                this.eastField.getValue(), 
                this.northField.getValue()
            )
    },
    
    
    
    
    /*   aoiUpdater:function() {			
        var extent=this.map.getExtent().clone();
        this.setAOI(extent);                    
        this.removeAOILayer(this.map);			
    },*/
    
    /** private: method[openEpsgWin]
	 *    Opens a popup with current AOI CRS description 
     */
    openEPSGWin: function() {
      
        this.epsgWinHeight= this.epsgWinHeight ? this.epsgWinHeight : Ext.getBody().getHeight()*.7;
        this.epsgWinWidth=  this.epsgWinWidth ? this.epsgWinWidth : Ext.getBody().getWidth()*.8;
     
        var me= this;
        var win= new Ext.Window({
            layout:'fit', 
            id: me.id+'_epsg_info_win',
            width:me.epsgWinWidth,
            height:me.epsgWinHeight,
            closeAction:'destroy',
            html: '<div id="'+me.id+'_loaderIframe"><iframe id="'+me.id+'_epsgIframe" src="'+ (me.infoEPSGURL ? me.infoEPSGURL : "http://spatialreference.org/ref/epsg/"+this.aoiProjection.getCode().split(":")[1]+"/") +'" width="99%" height="99%"></iframe></div>',
            listeners: {
                afterrender: function(el, eOpts) {
                  
                    var ml=new Ext.LoadMask(document.getElementById(me.id+'_loaderIframe'), 
                    {
                        msg: me.waitEPSGMsg,
                        removeMask: true
                    });
                    ml.show();   
                    function rml(){
                        ml.hide();
                    }
                    var iframe = document.getElementById(me.id+'_epsgIframe');
                    if (iframe.attachEvent) {
                        iframe.attachEvent("onload", rml);
                    } else if (iframe.addEventListener) {
                        iframe.addEventListener("load", rml, false);
                    } 
                }   
            }
        }); 
        win.show();
    }
});

Ext.preg(gxp.plugins.AOI.prototype.ptype, gxp.plugins.AOI);
