/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/


/** api: (define)
 *  module = gxp
 *  class = LayerPanel
 *  base_link = `Ext.TabPanel <http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: WMxSLayerPanel(config)
 *   
 *      Abstract class to create a dialog for setting for WMS, WMTS, etc
 *      layer properties like title, abstract, opacity, transparency and
 *      image format.
 * 
 *      It should be extended for each specific layer type to be supported.
 */
gxp.LayerPanel = Ext.extend(Ext.TabPanel, {
    
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

    map: null,
    
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
    
    /** i18n */
    aboutText: "About",
    titleText: "Title",
    nameText: "Name",
    descriptionText: "Description",
    displayText: "Display",
    opacityText: "Opacity",
    
    initComponent: function() {
        this.addEvents(
            /** api: event[change]
             *  Fires when the ``layerRecord`` is changed using this dialog.
             */
            "change"
        );
		
        this.items = this.createItems();
        gxp.LayerPanel.superclass.initComponent.call(this);
    },
    
    createItems: function() {
        var items = [
            this.createAboutPanel(),
            this.createDisplayPanel()
        ];
        return items;
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
    
    createDisplayPanel: function() {
        var layer = this.layerRecord.getLayer();
        var opacity = layer.opacity;
        if(opacity == null) {
            opacity = 1;
        }      
        var config = {
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
            }]
        };
        return config;
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
    }
});

Ext.reg('gxp_layerpanel', gxp.LayerPanel); 
