/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp
 *  class = GazetteerCombobox
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: GazetteerCombobox(config)
 *   
 *      Combobox to query a Gazetteer service
 */
gxp.GazetteerCombobox = Ext.extend(Ext.form.ComboBox, {
    
    //configs
    /** api: config[addressUrl]
     *  ``String``
     *  URL to the address service
     */
    addressUrl: null,
    addressRegExp: /\d/,
    
    gazetteerUrl: null,
    srsName: null,
    featureNS: null,
    featurePrefix: null,
    featureType: null,
    geometryName: null,
    filterProperty: null,
    
    tpl: '<tpl for=\".\"><div class="x-combo-list-item"><b>{name}</b><br>{type}</div><hr></tpl>',
    valueField: 'name',
    displayField: 'name',
    listWidth: 350,
    autoWidth: true,
    minChars: 3,
    resizable: true,
    
    initComponent: function() {
		// /////////////////////////////////////
		// Create a GazetteerStore, that will switch between services depending on the search key
		// /////////////////////////////////////
        this.store = new GeoExt.data.GazetteerStore({
            services: [{
                regExp: this.addressRegExp,
                reader: new GeoExt.data.AddressReader(),
                proxy: new GeoExt.data.AddressProxy({
                    url: this.addressUrl
                })
            },{
                reader: new GeoExt.data.GazetteerReader({
                    formatConfig: {
                        featureNS: this.featureNS,
                        featurePrefix: this.featurePrefix,
                        featureType: this.featureType,
                        geometryName: this.geometryName
                    }
                }),
                proxy: new GeoExt.data.ProtocolProxy({
                    protocol: new OpenLayers.Protocol.WFS({
                        url: this.gazetteerUrl,
                        srsName: this.srsName,
                        featureNS: this.featureNS,
                        featurePrefix: this.featurePrefix,
                        featureType: this.featureType,
                        geometryName: this.geometryName,
                        version: '1.1.0',
                        outputFormat: 'application/gml+xml; version=3.2'
                    })
                })
            }],
            filterProperty: this.filterProperty
        });
        
        gxp.GazetteerCombobox.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('gazetteercombobox', gxp.GazetteerCombobox);