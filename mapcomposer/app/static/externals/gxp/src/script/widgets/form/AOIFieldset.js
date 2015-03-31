/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.form
 *  class = AOIFieldset
 *  base_link = `Ext.form.TextField <http://extjs.com/deploy/dev/docs/?class=Ext.form.TextField>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: AOIFieldset(config)
 *   
 *      Areo Of Interest (AOI) fieldset
 */
gxp.form.AOIFieldset = Ext.extend(Ext.form.FieldSet,  {



    /** api: ptype = gxp_aoifieldset */
    ptype: "gxp_aoifieldset",
    
    
    /** api: config[id]
     *  ``String``
     *  
     */
    id: "aoiFieldSet",
    
    
    /** api: property[map]
     *  ``Object``
     *  
     */
    map: "AOI",
    

    /** api: property[layerName]
     *  ``String``
     *  
     */
    layerName: "AOI",
    

    /**
     * Property: decimalPrecision
     * {int} precision of the AOI textFields   
     */
    decimalPrecision:5,
    
    /**
     * Property: outputSRS
     * {String} EPSG code of the AOI
     *     
     */
    outputSRS: 'EPSG:4326',
    
    /**
     * Property: searchByFeature
     * {Boolean} enables search by feature panel
     *     
     */
    searchByFeature: false,
    
    /** api: property[infoEPSG]
     *  ``Boolean``
     *  
     */
    infoSRS: true,
    
    /** api: property[infoEPSGURL]
     *  ``String``
     *  
     */
    infoEPSGURL: null,
    
    /** api: property[epsgWinWidth]
     *  ``String``
     *  
     */
    epsgWinWidth: null,
    
    
    /** api: property[epsgWinHeight]
     *  ``String``
     *  
     */
    epsgWinHeight: null,
    
    
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
    
    
    /** api: config[displayAOIInLayerSwitcher]
     *  ``Boolean``
     *  
     */
    displayAOIInLayerSwitcher: false,
    
 
    /**
     * Property: selectStyle
     * {Object} Configuration of OpenLayer.Style. 
     *    used to highlight the AOI
     *     
     */
    selectStyle:{
        fillColor: "#0000FF",
        strokeColor: "#0000FF",
        fillOpacity:0.5,
        strokeWidth:2
    },
    
    
    // start i18n
    northLabel:"Nord",
    westLabel:"Ovest",
    eastLabel:"Est",
    southLabel:"Sud",
    title: "Ambito Territoriale",
    setAoiText: "Seleziona Area",        
    setAoiTooltip: "Abilita la selezione della regione di interesse sulla mappa",
    waitEPSGMsg: "Attendere... Caricamento in corso",
    aoiMethodLabel: "Modalità",
    aoiByRectLabel: "Rettangolo",
    aoiByFeatureLabel: "Seleziona limite",
    provinceLabel: "Provincia",
    comuniLabel: "Comune",
    // end i18n
    

    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
       
       
        
        this.autoHeight= true;
        var aoiByRectOptions = {
            layout: 'table',
            layoutConfig : {
            columns: 3
            },
            defaults : {
            // applied to each contained panel
            bodyStyle:'padding:5px;'
            },
            bodyCssClass : 'aoi-fields'
        };
        
        if(this.searchByFeature) {
            this.layout = 'form';
        } else {
            Ext.apply(this, aoiByRectOptions);
        }
        
        
        
        Ext.util.CSS.createStyleSheet(".olHandlerBoxZoomBox_"+this.id+" {\n"
            +" border: "+this.selectStyle.strokeWidth+"px solid "+this.selectStyle.strokeColor+"; \n"
            +" position: absolute; \n"
            +" background-color: "+this.selectStyle.fillColor+"; \n"
            +" opacity: "+this.selectStyle.fillOpacity+"; \n"
            +" font-size: 1px; \n"
            +" filter: alpha(opacity="+this.selectStyle.fillOpacity * 100+"); \n"
            +"}",
            "olHandlerBoxZoomBox_"+this.id);
        
        var me= this;
        
       
       
        this.aoiProjection = this.outputSRS ? new OpenLayers.Projection(this.outputSRS) : this.mapProjectionObject;

       
        this.northField = new Ext.form.NumberField({
            fieldLabel: me.northLabel,
            id: me.id+"_NorthBBOX",
            width: 100,
            allowBlank: false,
            //    minValue: this.spatialFilterOptions.lonMin,
            //    maxValue: this.spatialFilterOptions.lonMax,
            decimalPrecision: me.decimalPrecision,
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
            decimalPrecision: this.decimalPrecision,
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
            decimalPrecision: this.decimalPrecision,
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
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        /*if(this.updateMapMove)
            this.map.events.register("move", this, this.aoiUpdater);*/
          

        this.aoiButton = new Ext.Button({
            text: this.setAoiText,
            tooltip: this.setAoiTooltip,
            enableToggle: true,
            //  toggleGroup: this.toggleGroup,
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
                
        var rectangleAoiItems = [{
            layout: "form",
            cellCls: 'spatial-cell',
            labelAlign: "top",
            border: false,
            colspan: 3,
            items: [this.northField]
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
        }];
            
        if(this.searchByFeature) {
        
            var provinceStore= new GeoExt.data.FeatureStore({ 
                 id: "provinceStore",
                 fields: [{
                            "name": "id",              
                            "mapping": "cod_provincia"
                  },{
                            "name": "name",              
                            "mapping": "descrizione"
                  }],
                 proxy: this.getWFSStoreProxy("v_province", undefined, "descrizione"),
                 autoLoad: true
           });
           
           provinceStore.on('load', function(str, records) {
              str.insert(0, new str.recordType({"id": '0', "name":' '}));
           }, this);
           
           var comuniStore= new GeoExt.data.FeatureStore({ 
                 id: "comuniStore",
                 fields: [{
                            "name": "id",              
                            "mapping": "cod_comune"
                  },{
                            "name": "cod_provincia",              
                            "mapping": "cod_provincia"
                  },{
                            "name": "name",              
                            "mapping": "descrizione"
                  }],
                 proxy: this.getWFSStoreProxy("v_comuni", undefined, "descrizione"),
                 autoLoad: true
           });
           
           comuniStore.on('load', function(str, records) {
              str.insert(0, new str.recordType({"id": '0', "cod_provincia": '0', "name":' '}));
           }, this);
        
            this.province = new Ext.form.ComboBox({
                fieldLabel: this.provinceLabel,
                id: "provcb",
                width: 150,
                hideLabel : false,
                store: provinceStore, 
                valueField: 'id',
                displayField: 'name',   
                lastQuery: '',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus:true,            
                resizable: true,    
                listeners: {
                    scope: this,                
                    expand: function(combo) {
                        combo.list.setWidth( 'auto' );
                        combo.innerList.setWidth( 'auto' );
                    },
                    select: function(combo, record, index) {
                        var store = this.comuni.getStore();
                        
                        var codProvincia = record.get('id');
                        if(codProvincia !== '0'){
                           store.filterBy(function(record, id) {
                                return record.get('cod_provincia') === '0' || record.get('cod_provincia') === codProvincia;
                           });
                           this.comuni.setValue('0');
                        } else {
                            store.clearFilter();
                        }
                    }
                }          
            });
            
            this.comuni = new Ext.form.ComboBox({
                fieldLabel: this.comuniLabel,
                id: "comunicb",
                width: 150,
                hideLabel : false,
                store: comuniStore, 
                valueField: 'id',
                displayField: 'name',   
                lastQuery: '',
                typeAhead: true,
                mode: 'local',
                forceSelection: true,
                triggerAction: 'all',
                selectOnFocus:true,            
                resizable: true,    
                listeners: {
                    scope: this,                
                    expand: function(combo) {
                        combo.list.setWidth( 'auto' );
                        combo.innerList.setWidth( 'auto' );
                    },
                    beforequery: function(evt) {
                    }
                }          
            });
            
            this.items = [{
                xtype: 'radiogroup',
                fieldLabel: this.aoiMethodLabel,
                items: [
                    {id: this.id + '-byrectcheck', boxLabel: this.aoiByRectLabel, name: 'aoimethod', checked: true},
                    {id: this.id + '-byfeaturecheck', boxLabel: this.aoiByFeatureLabel, name: 'aoimethod'}
                ],
                listeners: {
                    'change': function(group, checked) {
                        if(checked.id === this.id + '-byrectcheck') {
                            Ext.getCmp(this.id + '-byrect').show();
                            Ext.getCmp(this.id + '-byfeature').hide();
                        } else {
                            Ext.getCmp(this.id + '-byfeature').show();
                            Ext.getCmp(this.id + '-byrect').hide();
                        }
                    },
                    scope: this
                }
            }, Ext.apply(aoiByRectOptions, {
                xtype: 'fieldset',
                id:this.id + '-byrect',
                items: rectangleAoiItems
            }), {
                id:this.id + '-byfeature',
                xtype: 'fieldset',
                items: [this.province, this.comuni],
                hidden: true
            }];
        } else {
            this.items = rectangleAoiItems;
        }
        
        if(this.infoSRS)   
            this.title+=" <a href='#' id='"+me.id+"_bboxAOI-set-EPSG'>["+this.aoiProjection.getCode()+"]</a>";
        
        this.listeners= {
            "afterlayout": function(){
                Ext.get(me.id+"_bboxAOI-set-EPSG").addListener("click", me.openEPSGWin, me);  
                me.mapProjection = new OpenLayers.Projection(me.map.getProjection());
                    
                me.selectAOI = new OpenLayers.Control.SetBox({      
                    map: me.map,       
                    layerName: me.layerName,
                    displayInLayerSwitcher: me.displayAOIInLayerSwitcher,
                    boxDivClassName: "olHandlerBoxZoomBox_"+me.id,
                    aoiStyle: new OpenLayers.StyleMap(me.selectStyle),
                    onChangeAOI: function(){  
                        me.setAOI(new OpenLayers.Bounds.fromString(this.currentAOI)); 
                        this.deactivate();
                        me.aoiButton.toggle();
                    } 
                }); 
        
                me.map.addControl(me.selectAOI);
                me.map.enebaleMapEvent = true;
            },
            "render": function(){
                  
            }
        };
        
       
        gxp.form.AOIFieldset.superclass.initComponent.call(this);
    },
    
    getAuthKey: function() {
        var user = this.appTarget.user || {};
        if(user && user.attribute) {
            var attributes = (user.attribute instanceof Array) ? user.attribute : [user.attribute];
            for(var i=0, l = attributes.length; i < l; i++) {
                var attribute = attributes[i];
                if(attribute.name === 'UUID') {
                    return attribute.value;
                }
            }
        }
        return null;
    },
    
    getWFSStoreProxy: function(featureName, filter, sortBy){
        var authkey = this.getAuthKey();
        
        var proxy= new GeoExt.data.ProtocolProxy({ 
            protocol: new OpenLayers.Protocol.WFS({ 
                url: this.wfsUrl + (authkey ? '?authkey='+authkey : ''), 
                featureType: featureName, 
                readFormat: new OpenLayers.Format.GeoJSON(),
                featureNS: this.destinationNS, 
                filter: filter, 
                outputFormat: "application/json",
                version: this.wfsVersion,
                sortBy: sortBy || undefined
            }) 
        });
        return proxy;         
        
    },
    
    /** private: method[isDark]
     *  :arg hex: ``String`` A RGB hex color string (prefixed by '#').
     *  :returns: ``Boolean`` The color is dark.
     *  
     *  Determine if a color is dark by avaluating brightness according to the
     *  W3C suggested algorithm for calculating brightness of screen colors.
     *  http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
     */
    
    
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
        if(this.searchByFeature) {
            this.province.setValue('0');
            this.comuni.setValue('0');
        }
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
    
    
    getAoiMethod: function() {
        if(this.searchByFeature && 
            Ext.select('input[name=aoimethod]:checked').first().getAttribute('id').indexOf('byfeature') !== -1) {
            return 'byfeature';
        }
        return 'byrect';
    },
    
    /** public: method[isValid]
     *  
     *     
     */
    isValid: function(){
        if(this.getAoiMethod() === 'byrect') {
            return(this.westField.isValid() &&
                this.southField.isValid() && 
                this.eastField.isValid() && 
                this.northField.isValid());
        } else {
            return this.province.getValue() !== '0' || this.comuni.getValue() !== '0';
        }
    },
    
    
    /** public: method[isDirty]
     *  
     *     
     */
    isDirty: function(){
        if(this.getAoiMethod() === 'byrect') {
            return(this.westField.isDirty() &&
                this.southField.isDirty() && 
                this.eastField.isDirty() && 
                this.northField.isDirty());
        } else {
            return this.province.isDirty() || this.comuni.isDirty();
        }
    },


    
    
    /** public: method[getAOIMapBounds]
     *  
     *   return the selected AOI bounds defined with the Map Projection  
     */
    getAOIMapBounds: function(){
        if(this.getAoiMethod() === 'byrect') {
            if(this.map.getProjection() != this.aoiProjection.getCode())  
                return this.getAOIBounds().transform(this.aoiProjection,this.mapProjection);
            else
                return this.getAOIBounds();
        } else {
            var codProvincia = this.province.getValue();
            var codComune = this.comuni.getValue();
            var type, id, geometry, bbox;
            if(codComune !== '0') {
                type = 'comune';
                id = codComune;
                geometry = this.comuni.store.getAt(this.comuni.store.find('id', codComune)).getFeature().geometry;
              } else {
                type = 'provincia';
                id = codProvincia;
                geometry = this.province.store.getAt(this.province.store.find('id', codProvincia)).getFeature().geometry;
            }
            var bbox = new OpenLayers.Bounds.fromString(geometry.getBounds().toBBOX());
            if(this.map.getProjection() != this.aoiProjection.getCode()) {
                bbox = bbox.transform(this.aoiProjection,this.mapProjection);
            }
            return {
                bbox: bbox,
                type: type,
                id: id
            };
        }
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

Ext.reg("gxp_aoifieldset", gxp.form.AOIFieldset);
