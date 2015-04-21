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

/**
 * @requires plugins/client/lib/GeoStoreClient.js 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WPSManager
 */

/** api: (extends)
 *  
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WPSManager(config)
 *
 * The WPS Manager Plugin provides a high level API for interaction with Web Processing Services (WPS) and manager the Process instances.  
 * An gxp.plugins.WPSManager uses a OpenLayersExt.WPSClient for the WPS intercation and a gxp.plugins.GeoStoreClient to store the Execute instances.
 * The WPS Manager Plguin supports synchronous and  asynchronus Execute requests. For the asynchronous request supports the status update, for the synchronous requests supports the "raw" data outputs.
 * When the WPSManager plugin is instantiated a "Geostore Category" called as plugin id is created.
 * For each Execute request a "Geostore Resource" is created. The resource description contains a execute status information and the output type (raw or not raw).
 * The resource store data contains directly the output if the output type is raw or a JSON Object wich contains the Execute response information.
 * For the Execute response parsing is used the OpenLayersExt.Format.WPSExecute object.
 */  

/** api: example
 *  
 *  TODO
 *
 */
gxp.plugins.WPSClusterManager =  Ext.extend(gxp.plugins.Tool,{
    
    /** api: ptype = gxp_wpsmanager */
    ptype: "gxp_wpsclustermanager",


    /** api: config[id] 
     *  ``String`` Web Processing Server identifier
     */
    id: null,

    
    /** private: property[wpsClient]
     *  ``{<OpenLayers.WPSClient>}``
     */
    wpsClient: null,    
    
    /** private: property[instancePrefix]
     *  ``String``
     */
    instancePrefix: "wpsExecute",
	
	silentErrors: false,
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WPSClusterManager.superclass.constructor.apply(this, arguments);   
        
        this.wpsClient = new OpenLayers.WPSClient({
            servers: {
                opengeo: this.url
            }
        });
    },
    
    init: function(target){
        gxp.plugins.WPSManager.superclass.init.apply(this, arguments); 
    },
	
	/**
	* api: method[setWPSClient]
	*
	* Method to re-set on the fly the WPS client in order to point to a different WPS server
	*/
	setWPSClient: function(url){
		this.wpsClient = new OpenLayers.WPSClient({
            servers: {
                opengeo: url
            }
        });
	},
    
    /** private: method[getPrefixInstanceName]
     */
    getPrefixInstanceName: function(processName){
        return this.instancePrefix+"_"+this.id+"_"+processName;
    },
    
    /** private: method[getInstanceName]
     */
    getInstanceName: function(processName){
        return this.getPrefixInstanceName(processName)+"_"+new Date().getTime();
    },
    
    /** api: method[execute]
     *  :arg processName: ``String`` WPS Process name 
     *  :arg executeRequest: ``OpenlayersExt.Format.WPSExecuteRequest || Object || String`` The executeRequest can be an Object which contains the request properties or a String  which contains directly the WPS Execute request.
     *                      For the WPS Execute request parsing is used the OpenlayersExt.Format.WPSExecuteRequest which define a object with the request properties.
     *                      This object properties are:
     *                              - storeExecuteResponse: ``Boolean`` Optional.  Indicates if the execute response document shall be stored (if true Asynchronous instance).
     *                              - lineage: ``Boolean`` Optional. Indicates if the Execute operation response shall include the DataInputs and OutputDefinitions elements.
     *                              - status: ``Boolean`` Optional.  Indicates if the stored execute response document shall be updated to provide ongoing reports on the status of execution.
     *                              - type: ``String`` Optional. Type of output ("data" or "raw")
     *                              - inputs: ``Object`` Mandatory. The inputs for the process, keyed by input identifier.
     *                                             The data input types currently supported are:  
     *                                                  OpenLayers.WPSProcess.LiteralData
     *                                                  OpenLayers.WPSProcess.ComplexData
     *                                                  OpenLayers.WPSProcess.BoundingBoxData
     *                                                  OpenLayers.WPSProcess.ReferenceData
     *                              - outputs: ``Array`` Mandatory. Array of OpenLayers.WPSProcess.Output Object
     *                           
     *  :returns: ``String`` Execute instance ID.
     *  
     *   Send Execute Process request.
     *  
     *  api: example
     *          
     *  var executeRequestObj = {
     *                           type: "raw",
     *			         inputs:{
     *                               userId: new OpenLayers.WPSProcess.LiteralData({value:"userId"}),
     *			             outputUrl: new OpenLayers.WPSProcess.LiteralData({value:"outputUrl"})
     *                           }					
     *                           outputs: [{
     *					   identifier: "result",
     *					   mimeType: "text/xml; subtype=wfs-collection/1.0"
     *				          }]
     *				};
     *  
     */
    execute: function(processName, executeRequest, callback, scope) {
		if(!scope)
			scope = this;
			
		var process = this.wpsClient.getProcess('opengeo', processName);    
		var instanceName = null;
		var executeOptions;
		var me = this;
		
		if(executeRequest instanceof Object){                
			executeOptions = executeRequest;
		}else{                
			executeOptions = new OpenLayers.Format.WPSExecuteRequest().read(executeRequest).processInput;                        
		}   
		
		instanceName = this.getInstanceName(processName);
		executeOptions.scope = this;
		
		executeOptions.success = function(response, processInstance){				
			callback.call(scope, response);
		};
	   
		executeOptions.processInstance = instanceName;                        
		process.execute(executeOptions);      
		
		return instanceName;
	}
	
});

Ext.preg(gxp.plugins.WPSClusterManager.prototype.ptype, gxp.plugins.WPSClusterManager);


