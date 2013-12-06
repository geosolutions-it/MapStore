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
 *  class = GraticuleStylePanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("GeoExt.ux");


/** api: constructor
 *  .. class:: GraticuleStylePanel(config)
 *
 *    Class to edit graticule style for print
 */   
GeoExt.ux.GraticuleStylePanel = Ext.extend(Ext.Panel, {
    
    /** api: xtype = gx_graticulestyle */
    xtype: "gx_graticulestyle",
    
    /* begin i18n */
    /** api: config[graticuleFieldLabelText] ``String`` i18n */
    graticuleFieldLabelText: 'Active graticule',
    /** api: config[sizeText] ``String`` i18n */
    sizeText: "Font size",
    /** api: config[colorText] ``String`` i18n */
    colorText: "Color",
    /** api: config[fontFamilyText] ``String`` i18n */
    fontFamilyText: "Font Family",
    /** api: config[fontStyleText] ``String`` i18n */
    fontStyleText: "Font style",
    /** api: config[fontEditorText] ``String`` i18n */
    fontEditorText: "Label config",
    /* end i18n */

    /** api: config[layerName]
     *  Graticule layer name to manage from this widget.
     **/
    layerName: "_hidden_print_graticule",

    /** api: config[fieldsetConfig]
     *  Default configuration for the fieldset.
     **/
    fieldsetConfig:{
        border: false,    
        layout: "form",
        cls: "x-form-item",
        style:"text-align:left",
        ref: 'fieldSet'
    },

    /** api: config[deactivate]
     *  Deactivate graticule as default. If you have an active control in the sourceMap, this parameter it's ovewritten
     **/
    deactivate: true,

    /** api: config[addFormParameters]
     *  Flag indicates that we need to add the form parameters fieldset or not
     **/
    addFormParameters: false,


    /** api: config[sourceMap]
     *  Original map to generate the printPreview map
     **/
    sourceMap: null,


    /** api: config[map]
     *  Map for the print preview
     **/
    map: null,


    /** api: config[addColorControl]
     *  Flag indicates that we need to add the color control or not
     **/
    addColorControl: true,

    /** api: config[addLabelStyleControl]
     *  Flag indicates that we need to add label control or not
     **/
    addLabelStyleControl: true,

    /** api: config[graticuleOptions]
     *  `Object` map with default parameters for the `OpenLayer.Control.Graticule` control
     **/
    graticuleOptions: {},
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        Ext.apply(this, config);
        var fieldsetConfig = {};
        Ext.apply(fieldsetConfig, this.fieldsetConfig);
        fieldsetConfig.items = this.getFieldSetItems();
        this.fieldSet = new Ext.form.FieldSet(fieldsetConfig);
        this.items = [this.fieldSet];
        GeoExt.ux.GraticuleStylePanel.superclass.constructor.apply(this, arguments);
    },

    // private: Get Fieldset with items
    getFieldSetItems: function(){
        var items = [];
        items.push(this.getGraticuleCheckBox());
        if(this.addColorControl){
            this.colorPicker = {
                xtype: "gxp_colorfield",
                fieldLabel: this.colorText,
                name: "color",
                ref: "colorPicker",
                disabled: this.deactivate,
                emptyText: OpenLayers.Renderer.defaultSymbolizer.strokeColor,
                value: this.graticuleControl.labelSymbolizer.fontColor,
                defaultBackground: this.graticuleControl.labelSymbolizer.fontColor ||
                    OpenLayers.Renderer.defaultSymbolizer.strokeColor,
                listeners: {
                    valid: function(field) {
                        var newValue = field.getValue();
                        this.setSymbolizerParam("fontColor", newValue);
                        this.setSymbolizerParam("strokeColor", newValue);
                    },
                    scope: this
                }
            };
            items.push(this.colorPicker);
        }
        if(this.addLabelStyleControl){
            items.push(this.getLabelStyleControl());
        }
        return items;
    },

    // private: Get label style control
    getLabelStyleControl: function(){
        this.textSymbolizer = {
            cls: "x-html-editor-tb",
            fieldLabel: this.fontEditorText,
            style: "background: transparent; border: none; padding: 0 0em 0.5em;",
            xtype: "toolbar",
            ref: "textSymbolizer",
            disabled: this.deactivate,
            items: [{
                    xtype: "gxp_fontcombo",
                    fonts: this.fonts || undefined,
                    width: 110,
                    value: this.graticuleControl.labelSymbolizer.fontFamily || "Verdana",
                    listeners: {
                        select: function(combo, record) {
                            var value = record.get("field1");
                            this.setSymbolizerParam("fontFamily", value);
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
                    value: this.graticuleControl.labelSymbolizer.fontSize || 8,
                    width: 30,
                    listeners: {
                        change: function(field, value) {
                            value = parseFloat(value);
                            this.setSymbolizerParam("fontSize", value);
                        },
                        scope:this
                    }
                }, {
                    // now you only add italic *OR* bold, if this change, change listener!!
                    enableToggle: true,
                    cls: "x-btn-icon",
                    iconCls: "x-edit-bold",
                    pressed: this.graticuleControl.labelSymbolizer.fontWeight && this.graticuleControl.labelSymbolizer.fontWeight == "bold",
                    group: "fontWeight",
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
                            this.setSymbolizerParam("fontWeight", value);
                        },
                        scope:this
                    }
                }, {
                    // now you only add italic *OR* bold, if this change, change listener!!
                    enableToggle: true,
                    cls: "x-btn-icon",
                    iconCls: "x-edit-italic",
                    pressed: this.graticuleControl.labelSymbolizer.fontStyle && this.graticuleControl.labelSymbolizer.fontStyle == "italic",
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
                            this.setSymbolizerParam("fontStyle", value);
                        },
                        scope:this
                    }
                }]
        };

        return this.textSymbolizer;
    },

    // private: set value on graticule symbolizers
    setSymbolizerParam: function(paramName, value){
        // Change parameters into graticule control
        this.graticuleControl.labelSymbolizer[paramName] = value;
        this.graticuleControl.lineSymbolizer[paramName] = value;
        this.graticuleControl.update();
    },

    // private: Enable/disable graticule costumization
    deactiveGraticuleControls: function(deactivate){
        this.fieldSet.colorPicker.setDisabled(deactivate);
        this.fieldSet.textSymbolizer.setDisabled(deactivate);
    },
    
    /** api: method[getGraticuleCheckBox]
     *  :returns: ``Checkbox`` to put on or off the graticule inside the printPanel
     */
    getGraticuleCheckBox: function(){
        //This code is the similar that Graticule control.
        var graticuleOptions = { 
              displayInLayerSwitcher: false,
              labelled: true, 
              visible: true,
              layerName: this.layerName
        };

        var map = this.map;
        var ctrl = this.sourceMap.getControlsByClass("OpenLayers.Control.Graticule");

        // If already exist a graticule control and it's activated, we need to remove the graticule layer before continue
        var sourceGraticule = null;
        if(ctrl.length > 0){
            sourceGraticule = ctrl[0];
            // Copy style from the source control
            if(!graticuleOptions.labelSymbolizer){
                graticuleOptions.labelSymbolizer  = {};
                Ext.apply(graticuleOptions.labelSymbolizer, sourceGraticule.labelSymbolizer);
            }
            if(!graticuleOptions.lineSymbolizer){
                graticuleOptions.lineSymbolizer  = {};
                Ext.apply(graticuleOptions.lineSymbolizer, sourceGraticule.lineSymbolizer);
            }
            // Copy state of the graticule
            if(sourceGraticule.active){
                this.deactivate = false;
            }else{
                this.deactivate = true;
            }
        }

        // Add control with default options and deactivate
        Ext.apply(graticuleOptions, this.graticuleOptions);
        var graticule = new OpenLayers.Control.Graticule(graticuleOptions);
        map.addControl(graticule);
        graticule.deactivate();

        // this listener remove source layer and add the new graticule if it's activate
        this.mapPanel.on("afterlayout", function(){
            if(!this._updating){
                // Remove layer from sourceControl in the preview map
                if(sourceGraticule && map.getLayersByName(sourceGraticule.layerName).length > 0){
                    var graticuleLayer = map.getLayersByName(sourceGraticule.layerName)[0];
                    map.removeLayer(graticuleLayer);
                }
                // Apply this.deactivate on graticule
                if(!this.deactivate){
                    this._updating = true;
                    if(map.getLayersByName(this.graticuleControl.layerName).length > 0){
                        this.graticuleControl.deactivate();   
                    }
                    this.graticuleControl.activate();
                    this._updating = false;
                }
                // Remove duplicated controls from sourceMap
                if(map.getControlsByClass("OpenLayers.Control.Graticule").length > 1){
                    this._updating = true;
                    var graticuleControls = map.getControlsByClass("OpenLayers.Control.Graticule");
                    for(var i = 0; i<graticuleControls.length; i++){
                        if(graticuleControls[i].layerName != this.layerName){
                            map.removeControl(graticuleControls[i]);
                        }
                    }
                    this._updating = false;
                }
            }
        }, this);

        this.graticuleControl = graticule;

        // just activate or deactivate controls and graticule with checked value
        return  new Ext.form.Checkbox({
            name: "graticuleTool",
            checked: !this.deactivate,
            boxLabel: this.graticuleFieldLabelText,
            hideLabel: true,
            ref: "checkbox",
            ctCls: "gx-item-nowrap",
            handler: function(cb, value) {
                if(map){
                    if(value){
                        graticule.activate();
                        this.deactiveGraticuleControls(false);
                    }else{
                        graticule.deactivate();
                        this.deactiveGraticuleControls(true);
                    } 
                }
            },
            cls : "gx-item-margin-left",
            scope: this
        });
    }

});

Ext.preg(GeoExt.ux.GraticuleStylePanel.prototype.xtype, GeoExt.ux.GraticuleStylePanel);