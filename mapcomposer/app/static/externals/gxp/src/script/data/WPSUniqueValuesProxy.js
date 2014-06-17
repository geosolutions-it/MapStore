/**
* Copyright (c) 2014 Geosolutions
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.data
 *  class = WPSUniqueValuesProxy
 *  base_link = `Ext.data.DataProxy <http://extjs.com/deploy/dev/docs/?class=Ext.data.DataProxy>`_
 */
Ext.namespace("gxp.data");

/** api: constructor
 *  .. class:: WPSUniqueValuesProxy(conn)
 *   
 *      A data proxy able to get unique values from the Geoserver WPS UniqueValues process.
 *      No config parameters are required on the constructor, the proxy can be
 *      fully configured on the doRequest method
 */
gxp.data.WPSUniqueValuesProxy = Ext.extend(Ext.data.DataProxy, {
    constructor: function(conn) {
        Ext.applyIf(conn, {
            // data proxy complans if they are not defined, even if they
            // are not actually used because they are overriden on the doExecute method
            url: 'http://',
            api: {
                'read': 'load'
            }
        });
        gxp.data.WPSUniqueValuesProxy.superclass.constructor.call(this, conn);
    },
    // private
	client : null,
    // private
    getClient: function(url) {
		if (this.client==null || this.url!=url) {
			this.url = url;
			this.client = new OpenLayers.WPSClient({servers: {'main': url}});
		}
		return this.client;
	},
    /**
     * WPSUniqueValuesProxy implementation of DataProxy#doRequest
     * @param {String} action The crud action type (only read is supported)
     * @param {Ext.data.Record/Ext.data.Record[]} rs If action is load, rs will be null. Not used in this proxy
     * @param {Object} params An object containing properties which are to be used as parameters for WPSClient
     * <div class="sub-desc"><p>The following object is expected:
     * <pre>
     * {
     *     process: 'theProcessName',
     *     inputs: {
     *         anInput: 'inputValueA',
     *         aSecondInput: 'inputValueB'
     *     },
     *     output: 'outputName'
     * },
     * </pre></p>
     * </div>
     * @param {Ext.data.DataReader} reader The Reader object which converts the data
     * object into a block of Ext.data.Records.
     * @param {Function} callback
     * <div class="sub-desc"><p>A function to be called after the request.
     * The <tt>callback</tt> is passed the following arguments:<ul>
     * <li><tt>r</tt> : Ext.data.Record[] The block of Ext.data.Records.</li>
     * <li><tt>options</tt>: Options object from the action request</li>
     * <li><tt>success</tt>: Boolean success indicator</li></ul></p></div>
     * @param {Object} scope The scope (<code>this</code> reference) in which the callback function is executed. Defaults to the browser window.
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     * @protected
     */
    doRequest : function(action, rs, params, reader, cb, scope, arg) {
		var client = this.getClient(params.url);
        if (!params.inputs) {
            return;
        }
        var execOptions = {
            inputs: {},
            outputs: params.output,
            type: "raw",
            success: function(outputs) {
                var records = reader.read({responseText: outputs});
                cb.call(scope, records, arg);
            }
        };
        
        var filter;
        if(params.query) {
            var queryValue = params.query;
            if(queryValue.indexOf('*') === -1) {
                queryValue = '*'+queryValue+'*';
            }
            filter = new OpenLayers.Filter.Comparison({ 
                type: OpenLayers.Filter.Comparison.LIKE, 
                property: params.inputs.fieldName, 
                value: queryValue,
                matchCase:false                
            });
        }
        
        execOptions.inputs.features = new OpenLayers.WPSProcess.ReferenceData({
            href:'http://geoserver/wfs', 
            method:'POST', mimeType: 'text/xml', 
            body: {
                wfs: {
                    featureType: params.inputs.featureTypeName, 
                    version: '1.0.0',
                    filter: filter,
                    sortBy: params.inputs.fieldName
                }
            }
        });
        
        if (!(params.inputs.fieldName instanceof OpenLayers.WPSProcess.LiteralData)) {
			execOptions.inputs.fieldName = new OpenLayers.WPSProcess.LiteralData({value: params.inputs.fieldName});
		}
        if (params.start) {
            execOptions.inputs.startIndex = new OpenLayers.WPSProcess.LiteralData({value: params.start});
        }
        if (params.limit) {
            execOptions.inputs.maxFeatures = new OpenLayers.WPSProcess.LiteralData({value: params.limit});
        }
        if (params.sortInfo && params.sortInfo.dir) {
            execOptions.inputs.sort = new OpenLayers.WPSProcess.LiteralData({value: params.sortInfo.dir});
        }
        else {
            execOptions.inputs.sort = new OpenLayers.WPSProcess.LiteralData({value:'ASC'});
        }
        var process = client.getProcess('main', params.process);
		process.execute(execOptions);
	}
});
Ext.reg('gxp_wpsuniquevaluesproxy', gxp.data.WPSUniqueValuesProxy);