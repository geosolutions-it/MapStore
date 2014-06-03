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
 *      A data store targeted to be used for the Geoserver WPS UniqueValues process.
 *      No config parameters are required on the constructor, the proxy can be
 *      fully configured on the doRequest method
 */
gxp.data.WPSUniqueValuesStore = Ext.extend(Ext.data.Store, {
    constructor: function(config) {
        config.baseParams = Ext.apply(config.baseParams || {}, {
                output: [{
                    identifier:'result',
                    mimeType: 'application/json'
                }],
                process: 'gs:UniqueValues'
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
	 /**
     * Gets the total number of records in the dataset as returned by the server.
     * <p>If using paging, for this to be accurate, the data object used by the {@link #reader Reader}
     * must contain the dataset size. For remote data sources, the value for this property
     * (<tt>totalProperty</tt> for {@link Ext.data.JsonReader JsonReader},
     * <tt>totalRecords</tt> for {@link Ext.data.XmlReader XmlReader}) shall be returned by a query on the server.
     * <b>Note</b>: see the Important note in {@link #load}.</p>
     * @return {Number} The number of Records as specified in the data object passed to the Reader
     * by the Proxy.
     * <p><b>Note</b>: this value is not updated when changing the contents of the Store locally.</p>
     
    getTotalCount : function(){
		// as unique values process does not provide totalRecords, we
		// need to perform this trick in order to flag potential extra pages
		var length = this.superclass().getTotalCount.call(this);
        if (this.baseParams && this.baseParams.start!=null && this.baseParams.limit!=null) {
            if (length>0) {
                if (this.baseParams.limit>this.getCount()) {
                    length = this.baseParams.start + this.getCount()-1;
                }
                else {
                    length = this.baseParams.start + this.baseParams.limit + 1;
                }
            }
            else {
                length = this.baseParams.start;
                // we've got out of the limits of the store
                this.baseParams.start = Math.max((this.baseParams.start - this.baseParams.limit), 0);
                this.load();
            }
        }
		return length;
    },*/
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