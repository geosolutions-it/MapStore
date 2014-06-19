/**
* Copyright (c) 2014 Geosolutions
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.data
 *  class = WPSUniqueValuesStore
 *  base_link = `Ext.data.Store <http://extjs.com/deploy/dev/docs/?class=Ext.data.Store>`_
 */
Ext.namespace("gxp.data");
/** api: constructor
 *  .. class:: WPSUniqueValuesStore(conn)
 *   
 *      A data store targeted to be used for the Geoserver WPS PagedUnique process.
 *      No config parameters are required on the constructor, the proxy can be
 *      fully configured on the doRequest method. Optionally a processName
 *      can be specified to override the default gs:PagedUnique process name.
 */
gxp.data.WPSUniqueValuesStore = Ext.extend(Ext.data.Store, {

    /** api: config[processName]
     * ``String``
     * Name of the WPS process
     */
    processName: 'gs:PagedUnique',
    
    constructor: function(config) {
        config.baseParams = Ext.apply(config.baseParams || {}, {
                output: [{
                    identifier:'result',
                    mimeType: 'application/json'
                }],
                process: config.processName || this.processName
        });
        gxp.data.WPSUniqueValuesStore.superclass.constructor.call(this,
            Ext.applyIf(config, {
                reader: new gxp.data.WPSUniqueValuesReader(config),
                sortInfo: {
                    field: 'value',
                    direction: 'ASC'
                },
                proxy: new gxp.data.WPSUniqueValuesProxy({})
            })
        );
    },
	 
    /** api: method[setWPSParams]
     *  Sets the WPS params to be passed to the proxy for data loading.
     *  See WPSUniqueValuesProxy.doRequest method for accepted parameters.
     */
    setWPSParams: function(params) {
        this.baseParams = Ext.apply(this.baseParams, params);
    },
    /** api: method[load]
     *  Loads data on the store (see Ext.data.Store#load).
     *  See WPSUniqueValuesProxy.doRequest method for specific WPS parameters.
     */
    load : function(options) {
        if (options) {
            this.baseParams = Ext.apply(this.baseParams, options.params);
        }
        this.superclass().load.call(this, options);
    } 
    
});

Ext.reg('gxp_wpsuniquestore', gxp.data.WPSUniqueValuesStore);