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

/** api: (define)
 *  module = GeoExt.ux
 *  class = LegendStylePanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("GeoExt.ux");


/** api: constructor
 *  .. class:: LegendStylePanel(config)
 *
 *    Class to edit legend style for print
 */   
GeoExt.ux.LegendStylePanel = Ext.extend(Ext.Panel, {
    
    /** api: ptype = gx_legendstyle */
    xtype: "gx_legendstyle",
    
    /* begin i18n */
    /** api: config[iconsSizeText] ``String`` i18n */
    iconsSizeText: "Icons size",
    /** api: config[fontSizeText] ``String`` i18n */
    fontSizeText: "Font size",
    /** api: config[fontFamilyText] ``String`` i18n */
    fontFamilyText: "Font Family",
    /** api: config[forceLabelsText] ``String`` i18n */
    forceLabelsText: "Force label",
    /** api: config[dpiText] ``String`` i18n */
    dpiText: "Dpi",
    /** api: config[fontStyleText] ``String`` i18n */
    fontStyleText: "Font style",
    /** api: config[fontEditorText] ``String`` i18n */
    fontEditorText: "Label config",
	
	antiAliasingText: "Font Anti Aliasing",
	
    /** api: config[sizeText] ``String`` i18n */
    sizeText: "Size",
    /* end i18n */

    /** api: config[fieldsetConfig]
     *  Default configuration for the fieldset.
     **/
    fieldsetConfig:{
        // Form parameters
        // anchor:'100%',
        layout: "fit",
        border: false,    
        layout: "form"
        // ,
        // collapsible:true,
        // collapsed:true
    },

    /** api: config[addFormParameters]
     *  Flag indicates that we need to add the form parameters fieldset or not
     **/
    addFormParameters: false,

    /** api: config[ignoreLegendParametersKey]
     *  ``String`` key that indicates this parameter.
     */
    ignoreLegendParametersKey: "_ignore_",  

    /** api: config[formParameters]
     *  Base configuration parameters to manage in the form panel
     **/
    formParameters: null, 

    /** api: config[formParameters]
     *  Default legend parameters
     **/
    legendParameters:{
        height: "8",
        width: "8",
        minSymbolSize: "8",
        fontFamily: "Verdana",
        forceLabels: true,
		fontAntiAliasing: true,
        dpi: "96"
    },

    /** api: config[formParameters]
     *  Default legend parameters in LEGEND_OPTIONS
     *  See http://docs.geoserver.org/latest/en/user/services/wms/get_legend_graphic/legendgraphic.html
     **/
    legendParametersInLegendOptions:{
        fontName: true, //(string) the name of the font to be used when generating rule titles. The font must be available on the server
        fontStyle: true, //(string) can be set to italic or bold to control the text style. Other combination are not allowed right now but we could implement that as well.
        fontSize: true, // (integer) allows us to set the Font size for the various text elements. Notice that default size is 12.
        fontColor: true, // (hex) allows us to set the color for the text of rules and labels (see above for recommendation on how to create values). Values are expressed in 0xRRGGBB format
        fontAntiAliasing: true, // (true/false) when true enables antialiasing for rule titles
        bgColor: true, // (hex) background color for the generated legend, values are expressed in 0xRRGGBB format
        dpi: true, // (integer) sets the DPI for the current request, in the same way as it is supported by GetMap. Setting a DPI larger than 91 (the default) makes all fonts, symbols and line widths grow without changing the current scale, making it possible to get a high resolution version of the legend suitable for inclusion in printouts
        forceLabels: true // “on” means labels will always be drawn, even if only one rule is available. “off” means labels will never be drawn, even if multiple rules are available. Off by default
    },

    /** api: config[replaceLegendParametersInUrl]
     *  ``Boolean`` Flag indicates if it's needed to replace legend parameters on the url.
     */
    changeLegendParameters: false,

    /** api: config[legendParametersConfig]
     *  ``Object`` Legend parameters configuration.
     */
    legendParametersConfig:{
        paramatersSearches: [
            // simple parameters inside the url
            "&{0}=[A-Za-z0-9]+&",
            "&{0}=[A-Za-z0-9]+",
            "{0}=[A-Za-z0-9]+&",
            "{0}=[A-Za-z0-9]+",
            // encoded options for as LEGEND_OPTIONS=...
            "%3B{0}%3A[A-Za-z0-9]+%3B",
            "%3B{0}%3A[A-Za-z0-9]+",
            "{0}%3A[A-Za-z0-9]+%3B",
            "{0}%3A[A-Za-z0-9]+"],
        paramatersSetters: [
            // simple parameters inside the url
            "&{0}={1}&",
            "&{0}={1}",
            "{0}={1}&",
            "{0}={1}",
            // encoded options for as LEGEND_OPTIONS=...
            "%3B{0}%3A{1}%3B",
            "%3B{0}%3A{1}",
            "{0}%3A{1}%3B",
            "{0}%3A{1}"]
    },
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        Ext.apply(this, config);
        Ext.apply(this,{
            /** api: config[formParameters]
             *  Base configuration parameters to manage in the form panel
             **/
            formParameters:{
                // Form parameters
                height: {
                    xtype: "numberfield",
                    fieldLabel: "Icons height",
                    value: "8",
                    hidden: true
                },
                width: {
                    xtype: "numberfield",
                    fieldLabel: "Icons width",
                    value: "8",
                    hidden : true
                },
                fontStyle:{
                    xtype: "textfield",
                    fieldLabel: "fontStyle",
                    value: "normal",
                    hidden : true  
                },
                _ignore_fontEditor: {
                    cls: "x-html-editor-tb",
                    fieldLabel: "fontEditorText",
                    style: "background: transparent; border: none; padding: 0 0em 0.5em;",
                    xtype: "toolbar",
                    items: [{
                            xtype: "gxp_fontcombo",
                            fonts: this.fonts || undefined,
                            width: 110,
                            value: "Verdana",
                            listeners: {
                                select: function(combo, record) {
                                    var value = record.get("field1");
                                    this.setFieldsetValue("fontName", value);
                                },
                                scope: this
                            }
                        }, {
                            xtype: "tbtext",
                            text: this.sizeText + ": "
                        }, {
                            xtype: "numberfield",
                            allowNegative: false,
                            emptyText: OpenLayers.Renderer.defaultSymbolizer.fontSize,
                            value: 8,
                            width: 30,
                            listeners: {
                                change: function(field, value) {
                                    value = parseFloat(value);
                                    this.setFieldsetValue("fontSize", value);
                                },
                                scope:this
                            }
                        }, {
                            // now you only add italic *OR* bold, if this change, change listener!!
                            enableToggle: true,
                            cls: "x-btn-icon",
                            iconCls: "x-edit-bold",
                            pressed: false,
                            group: "fontStyle",
                            listeners: {
                                toggle: function(button, pressed) {
                                    var value = pressed ? "bold" : "normal";
                                    if(pressed){
                                        for(var i = 0; i < button.ownerCt.items.keys.length; i++){
                                            var key = button.ownerCt.items.keys[i];
                                            var formParam = button.ownerCt.items.get(key);
                                            if(formParam.id != button.id
                                                && formParam.group == button.group){
                                                formParam.toggle(false);
                                                return;
                                            }
                                        };
                                    }
                                    this.setFieldsetValue("fontStyle", value);
                                },
                                scope:this
                            }
                        }, {
                            // now you only add italic *OR* bold, if this change, change listener!!
                            enableToggle: true,
                            cls: "x-btn-icon",
                            iconCls: "x-edit-italic",
                            pressed: false,
                            group: "fontStyle",
                            listeners: {
                                toggle: function(button, pressed) {
                                    var value = pressed ? "italic" : "normal";
                                    if(pressed){
                                        for(var i = 0; i < button.ownerCt.items.keys.length; i++){
                                            var key = button.ownerCt.items.keys[i];
                                            var formParam = button.ownerCt.items.get(key);
                                            if(formParam.id != button.id
                                                && formParam.group == button.group){
                                                formParam.toggle(false);
                                            }
                                        }
                                    }
                                    this.setFieldsetValue("fontStyle", value);
                                },
                                scope:this
                            }
                        }]
                },
                fontName: {
                    xtype: "textfield",
                    fieldLabel: "fontFamilyText",
                    value: "Verdana",
                    hidden : true
                },
                fontSize: {
                    xtype: "textfield",
                    fieldLabel: "fontSizeText",
                    value: "8",
                    hidden: true
                },
                _ignore_forceLabel: {
                    xtype: "checkbox",
                    fieldLabel: "forceLabelsText", 
                    name: "_ignore_forceLabel",
                    checked: false,
                    listeners:{
                        change: function (chk, value){
                            chk.ownerCt.fieldSet.items.keys.forEach(function(key){
                                var formParam = chk.ownerCt.fieldSet.items.get(key);
                                if(formParam.name == "forceLabels"){
                                    formParam.setValue(value ? "on" : "off");
                                }
                            });
                        },
                        scope:this
                    }
                },
			    fontAntiAliasing: {
                    xtype: "checkbox",
                    fieldLabel: this.antiAliasingText,
                    checked: true
                },
                minSymbolSize: {
                    xtype: "numberfield",
                    fieldLabel: "iconsSizeText",
                    value: "8",
                    listeners:{
                        change: function (numberField, value){
                            this.setFieldsetValue("height", value);
                            this.setFieldsetValue("width", value);
                        },
                        scope:this
                    }
                },
                forceLabels: {
                    // Managed as a checkbox
                    xtype: "textfield",
                    fieldLabel: "forceLabelsText",
                    value: "off",
                    hidden: true
                },
                dpi: {
                    xtype: "numberfield",
                    fieldLabel: "dpiText",
                    value: "96"
                }
            }
        });
        Ext.apply(this, this.getFormParamatersFieldsetConfig());
        this.fieldSet = this;
        // var formConfig = this.getFormParamatersFieldsetConfig();
        // this.fieldSet = new Ext.form.FormPanel(formConfig);
        // this.items = [this.fieldSet];
        GeoExt.ux.LegendStylePanel.superclass.constructor.apply(this, arguments);
    },

    // private:. set value on fieldset
    setFieldsetValue: function(paramName, value){
        for(var i = 0; i < this.fieldSet.fieldSet.items.keys.length; i++){
            var key =this.fieldSet.fieldSet.items.keys[i];
            var formParam = this.fieldSet.items.get(key);
            if(formParam.name == paramName){
                formParam.setValue(value);
                return;
            }
        }
    },

    /** api: method[writeFormParameters]
     *  :arg spec: ``Map`` With the information of the print
     *  :returns: ``Map`` with the configuration overwrited by the fieldset form
     */
    writeFormParameters: function(spec){
        if(this.fieldSet){
            // copy the form fieldset
            for(var i = 0; i < this.fieldSet.fieldSet.items.keys.length; i++){
                var key = this.fieldSet.fieldSet.items.keys[i];
                var formParam = this.fieldSet.items.get(key);
                if(formParam.name.indexOf(this.ignoreLegendParametersKey) < 0){
                    spec[formParam.name] = formParam.getValue();
                }
            };
        }else{
            // copy the default value
            for(var field in this.formParameters){
                if(field.indexOf(this.ignoreLegendParametersKey) < 0){
                    var itemConfig = this.formParameters[field];
                    spec[field] = itemConfig.value;
                }
            }
        }

        return spec;
    },
    
    /** api: method[getFormParamatersFieldset]
     *  :arg extraParameters: ``Map`` Optional parameters to show in the form panel
     *  :arg overrideConfig: ``Map`` Optional config for the form panel
     *  :returns: ``FormPanel`` with text fields composed by this.formParameters 
     *  and extraParameters initialized with the values of the map
     */
    getFormParamatersFieldset: function(extraParameters, overrideConfig){

        this.fieldSet = new Ext.form.FieldSet(this.getFormParamatersFieldsetConfig(extraParameters, overrideConfig));

        return this.fieldSet;
    },
    
    /** api: method[getFormParamatersFieldsetConfig]
     *  :arg extraParameters: ``Map`` Optional parameters to show in the form panel
     *  :arg overrideConfig: ``Map`` Optional config for the form panel
     *  :returns: ``Object`` with the config to initialize a form panel or a fieldset
     */
    getFormParamatersFieldsetConfig: function(extraParameters, overrideConfig){

        var fieldsetConfig = {};
        
        for(var config in this.fieldsetConfig){
            fieldsetConfig[config] = this.fieldsetConfig[config];
        }

        if(overrideConfig){
            Ext.apply(fieldsetConfig, overrideConfig);
        }

        var items = [];
        for(var field in this.formParameters){
            var itemConfig = this.formParameters[field];
            itemConfig.name = field;
            if(itemConfig.fieldLabel && this[itemConfig.fieldLabel]){
                itemConfig.fieldLabel = this[itemConfig.fieldLabel];
            }
            items.push(itemConfig);
        }

        if(extraParameters){
            for(var field in extraParameters){
                var itemConfig = extraParameters[field];
                itemConfig.name = field;
                if(itemConfig.fieldLabel && this[itemConfig.fieldLabel]){
                    itemConfig.fieldLabel = this[itemConfig.fieldLabel];
                }
                items.push(itemConfig);
            }
        }

        fieldsetConfig.items = items;

        return fieldsetConfig;
    },

    /** private: method[getLegendUrl]
     *  :param layerName: ``String`` A sublayer.
     *  :param layerNames: ``Array(String)`` The array of sublayers,
     *      read from this.layerRecord if not provided.
     *  :return: ``String`` The legend URL.
     *
     *  Get the legend URL of a sublayer.
     */
    getLegendUrl: function(layerName, layerNames, legend) {
        var rec = legend.layerRecord;
        var url;
        var styles = rec && rec.get("styles");
        var layer = rec.getLayer();
        layerNames = layerNames || [layer.params.LAYERS].join(",").split(",");

        var styleNames = layer.params.STYLES &&
                             [layer.params.STYLES].join(",").split(",");
        var idx = layerNames.indexOf(layerName);
        var styleName = styleNames && styleNames[idx];
        if(!url) {
            url = layer.getFullRequestString({
                REQUEST: "GetLegendGraphic",
                SERVICE: "WMS",
                WIDTH: null,
                HEIGHT: null,
                EXCEPTIONS: "application/vnd.ogc.se_xml",
                LAYER: layerName,
                LAYERS: null,
                STYLE: (styleName !== '') ? styleName: null,
                STYLES: null,
                SRS: null,
                FORMAT: null
            });
        }
        
        var params = this.getLegendParameters() || {};
        
        // add scale parameter - also if we have the url from the record's
        // styles data field and it is actually a GetLegendGraphic request.
        if(this.useScaleParameter === true) {
            var scale = layer.map.getScale();
            if(this.minScale !== -1 && scale < legend.minScale) {
                scale = this.minScale;
            }
            if(this.maxScale !== -1 && scale > legend.maxScale) {
                scale = this.maxScale;
            }
            params["SCALE"] = scale;
        }

        // only png format!!
        Ext.applyIf(params, {FORMAT: 'image/png'});
        
        if (layer.params._OLSALT) {
            // update legend after a forced layer redraw
            params._OLSALT = layer.params._OLSALT;
        }

        params.LEGEND_OPTIONS = this.encodeLegendOptions(params.LEGEND_OPTIONS);
            
        url = Ext.urlEncode(params, url);

        
        return url;
    },

    getLegendParameters: function(){
        var legendParams = {};
        var legendOptionsParam = {};

        for(var key in this.legendParameters){
            if(this.legendParametersInLegendOptions[key]){
                legendOptionsParam[key] = this.legendParameters[key];
            }else{
                legendParams[key] = this.legendParameters[key];
            }
        }

        legendParams['LEGEND_OPTIONS'] = legendOptionsParam;

        return legendParams;

    },

    encodeLegendOptions: function(legendOptions){
        var legendOptionsString = "";
        for (var opt in legendOptions){
            legendOptionsString += opt + ":" + legendOptions[opt] + ";";
        }
        return legendOptionsString;
    }

});

Ext.preg(GeoExt.ux.LegendStylePanel.prototype.xtype, GeoExt.ux.LegendStylePanel);