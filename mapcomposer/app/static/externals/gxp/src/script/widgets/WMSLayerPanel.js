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
    sliderRischioText: "Rischio",
    sliderRischioSocialeText: "Sociale",
    sliderRischioAmbientaleText: "Ambientale",
    minRangeSliderText: "Basso",
    medRangeSliderText: "Medio",
    maxRangeSliderText: "Alto",
    riskTabTitle: "Tematizzazione",
    riskTabSubmitText: "Applica",
    
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
        
        // only add the Risk panel for SIIG layers.
        if (this.layerRecord.get("layer").params.RISKPANEL) {
            this.items.push(this.createRiskPanel());
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
    
    /** private: createRiskPanel
     *  Creates the slider risk panels.
     */
    createRiskPanel: function(){

        var sliderEnv = this.layerRecord.get("layer").params.ENV.split(";");
        var envArray=[];
        
        var checkEnv = ["low","medium","lowsociale","mediumsociale","lowambientale","mediumambientale"];
        
        var hasBoth = false;        
        
        for (var i = 0;i<sliderEnv.length;i++){
            if (checkEnv.indexOf(sliderEnv[i].split(":")[0]) != -1){
                if(sliderEnv[i].indexOf('sociale') != -1 || sliderEnv[i].indexOf('ambientale') != -1) {
                    hasBoth = true;
                }               
                envArray.push(sliderEnv[i]);
            }
        }
        
        
        
        var sliderFiledRischioSocialePanel=new gxp.form.SliderRangesFieldSet({
            title: this.sliderRischioSocialeText,
            id:"rischio_sociale_panel",    
            labels: true,
            multiSliderConf:{
                vertical : false,
                anchor: "99%",
                decimalPrecision: 1,
                increment: 0.1,
                ranges: [
                {
                    maxValue: envArray[0].split(":")[1],
                    name:this.minRangeSliderText, 
                    id:"range_low_sociale_panel"
                },
                {
                    maxValue: envArray[1].split(":")[1],
                    name:this.medRangeSliderText, 
                    id:"range_medium_sociale_panel"
                },
                {
                    maxValue: 1000,
                    name:this.maxRangeSliderText
                }
                ],                                        
                width   : 328,
                minValue: 0,
                maxValue: 1000
            }
        });
        
        var sliderFiledRischioAmbientalePanel=new gxp.form.SliderRangesFieldSet({
            title: this.sliderRischioAmbientaleText,
            id:"rischio_ambientale_panel",    
            labels: true,
            multiSliderConf:{
                vertical : false,
                anchor: "99%",
                decimalPrecision: 1,
                increment: 0.1,
                ranges: [
                {
                    maxValue: envArray.length > 2 ? envArray[2].split(":")[1] : envArray[0].split(":")[1],
                    name:this.minRangeSliderText,
                    id:"range_low_ambientale_panel"
                },

                {
                    maxValue: envArray.length > 2 ? envArray[3].split(":")[1] : envArray[1].split(":")[1],
                    name:this.medRangeSliderText, 
                    id:"range_medium_ambientale_panel"
                },
                {
                    maxValue: 1000, 
                    name:this.maxRangeSliderText
                }
                ],                                        
                width   : 328,
                minValue: 0,
                maxValue: 1000
            }
        });
        
        var sliderFiledRischioPanel=new gxp.form.SliderRangesFieldSet({
            title: this.sliderRischioText,
            id:"rischio_panel",    
            labels: true,
            multiSliderConf:{
                vertical : false,
                anchor: "99%",
                decimalPrecision: 1,
                increment: 0.1,
                ranges: [
                {
                    maxValue: sliderEnv[0].split(":")[1],
                    name:this.minRangeSliderText,
                    id:"range_low_panel"
                },

                {
                    maxValue: sliderEnv[1].split(":")[1],
                    name:this.medRangeSliderText, 
                    id:"range_medium_panel"
                },
                {
                    maxValue: 1000, 
                    name:this.maxRangeSliderText
                }
                ],                                        
                width   : 328,
                minValue: 0,
                maxValue: 1000
            }
        });
        
        var riskPanel = [];
        
        if (hasBoth){
            riskPanel = [{   
				title: this.sliderRischioSocialeText,
				listeners: {
					activate: function(p){
					   sliderFiledRischioSocialePanel.render(Ext.get('rischio_sociale_slider_panel'));
					},
                    scope: this
				},
				html: "<div id='rischio_sociale_slider_panel'/>"
			},{   
				title: this.sliderRischioAmbientaleText,
				listeners: {
					activate: function(p){
					   sliderFiledRischioAmbientalePanel.render(Ext.get('rischio_ambientale_slider_panel'));
					},                 
                    scope: this
				},
				html: "<div id='rischio_ambientale_slider_panel'/>"
			}];
        
        }else {
            riskPanel = [{   
				title: this.sliderRischioText,
				listeners: {
					activate: function(p){
					   sliderFiledRischioPanel.render(Ext.get('rischio_ambientale_slider_panel'));
					},                 
                    scope: this
				},
				html: "<div id='rischio_ambientale_slider_panel'/>"
			}];       
        }               
        
		var temasPanel = new Ext.TabPanel({
			autoTabs:true,
			activeTab:0,
			deferredRender:false,
			border:false
		});        
        
        temasPanel.add(riskPanel);
        temasPanel.doLayout(false,true);
        
        var panel = new Ext.FormPanel({
            border: false,
            layout: "fit",
            autoScroll: true,
            items:[temasPanel]
        });
            
        return {
            title: this.riskTabTitle,
            style: {"padding": "2px"},
            layout: "form",
            labelWidth: 70,
            items: [panel],
            buttons: [{
                text: this.riskTabSubmitText,
                iconCls: 'elab-button',
                scope: this,
                handler: function(){
                
                    var layer = this.layerRecord.get("layer");
                    var env = layer.params.ENV;
                    var sliderEnv = env.split(";");
                    var envArray = [];
                    
                    var checkEnv = ["low","medium","lowsociale","mediumsociale","lowambientale","mediumambientale"];
                    
                    for (var i = 0;i<sliderEnv.length;i++){
                        if (checkEnv.indexOf(sliderEnv[i].split(":")[0]) == -1){
                            envArray.push(sliderEnv[i]);
                        }
                    }
                    
                    var envStringa = envArray.join(";") == "" ? "" : envArray.join(";")+";";
                    
                    if (hasBoth){
                        
                        var socialMin = Ext.getCmp('rischio_sociale_panel_multislider').getValue(0);
                        var socialMax = Ext.getCmp('rischio_sociale_panel_multislider').getValue(1);
                        var ambMin = Ext.getCmp('rischio_ambientale_panel_multislider').getValue(0);
                        var ambMax = Ext.getCmp('rischio_ambientale_panel_multislider').getValue(1);

                        
                        layer.mergeNewParams({
                            ENV: envStringa+"lowsociale:"+socialMin+";mediumsociale:"+socialMax+";lowambientale:"+ambMin+";mediumambientale:"+ambMax
                        });                        
                        
                    } else {
                        
                        var min = Ext.getCmp('rischio_panel_multislider').getValue(0);
                        var max = Ext.getCmp('rischio_panel_multislider').getValue(1);                
                        
                        layer.mergeNewParams({
                            ENV: envStringa+"low:"+min+";medium:"+max
                        });                         
                        
                    }
                }
            }],
            scope: this        
        };  
    }
});

Ext.reg('gxp_wmslayerpanel', gxp.WMSLayerPanel); 
