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
 *  class = WMTSLayerPanel
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: WMSLayerPanel(config)
 *   
 *      Create a dialog for setting WMTS layer properties like title, abstract,
 *      opacity, image format and styles
 */
gxp.WMTSLayerPanel = Ext.extend(gxp.LayerPanel, {
    /** i18n */
    formatText: "Format",
    stylesText: "Styles",
    chooseStyleText: "Choose style",
    
    initComponent: function() {
        gxp.WMTSLayerPanel.superclass.initComponent.call(this);
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

    createItems: function() {
        var items = gxp.LayerPanel.prototype.createItems.apply(this);
        items.push(this.createStylesPanel());
        return items;
    },
    
    /** private: createDisplayPanel
     *  Creates the display panel.
     */
    createDisplayPanel: function() {
        var layer = this.layerRecord.getLayer();
        var currentFormat = layer.format;
        var config = gxp.LayerPanel.prototype.createDisplayPanel.apply(this);
        var formats = this.layerRecord.get("formats");
        config.items.push( {
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
                        // mergeNewParams() alone seems to have no effect for WMTS layer
                        layer.format = format;
                        layer.mergeNewParams({
                            format: format
                        });
                        this.fireEvent("change");
                    },
                    scope: this
                }
            });
        return config;
    },
    
    createStylesPanel: function() {
        var styles = this.layerRecord.get("styles");
        var layer = this.layerRecord.getLayer();
        var fields = [
            {name: "identifier", mapping: "identifier"}
        ];
        var displayField;
        if (styles.length>0 && styles[0].title) {
            displayField = "title";
            fields.push({name: "title", mappping: "title"});
        }
        else {
            displayField = "identifier";
        }
        var store = new Ext.data.ArrayStore({
            data: styles,
            fields: fields
            });
        var config =  {
            title: this.stylesText,
            style: {"padding": "10px"},
            layout: "form",
            labelWidth: 70,
            items: [{
                xtype: "combo",
                fieldLabel: this.chooseStyleText,
                store: store,
                value: this.layerRecord.getLayer().style,
                valueField: 'identifier',
                displayField: displayField,
                mode: "local",
                triggerAction: "all",
                editable: false,
                anchor: "99%",
                listeners: {
                    select: function(combo) {
                        var style = combo.getValue();
                        layer.style = style;
                        layer.mergeNewParams({
                            style: style
                        });
                        this.fireEvent("change");
                    },
                    scope: this
                }
            }]
        }
        return config;
    }
});

Ext.reg('gxp_wmtslayerpanel', gxp.WMTSLayerPanel); 
