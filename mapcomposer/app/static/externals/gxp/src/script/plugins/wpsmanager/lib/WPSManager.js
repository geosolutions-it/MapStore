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
 * requires GeoStoreClient/lib/GeoStoreClient.js 
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
gxp.plugins.WPSManager =  Ext.extend(gxp.plugins.Tool,{
    
    /** api: ptype = gxp_wpsmanager */
    ptype: "gxp_wpsmanager",


    /** api: config[id] 
     *  ``String`` Web Processing Server identifier
     */
    id: null,

    
    /** private: property[wpsClient]
     *  ``{<OpenLayers.WPSClient>}``
     */
    wpsClient: null,
    
    
    /** private: property[geoStoreClient]
     *  ``{<gxp.plugins.GeoStoreClient>}``
     */
    geoStoreClient: null,
    
    
    /** private: property[instancePrefix]
     *  ``String``
     */
    instancePrefix: "wpsExecute",
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.WPSManager.superclass.constructor.apply(this, arguments);    
        
        this.wpsClient = new OpenLayers.WPSClient({
            servers: {
                opengeo: config.url
            }
        });
        
        this.geoStoreClient = new gxp.plugins.GeoStoreClient({
			url: config.geostoreUrl,
			user: config.geostoreUser,
			password: config.geostorePassword,
			proxy: config.geostoreProxy,
			listeners: {
				"geostorefailure": function(tool, msg){
					Ext.Msg.show({
						title: "Geostore Exception",
						msg: msg,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			}
		});
    },
    
    
    init: function(target){
       gxp.plugins.WPSManager.superclass.init.apply(this, arguments); 
       OpenLayers.ProxyHost = this.target.proxy;

       var geoStore= this.geoStoreClient;
      
        var wpsCategory= {
            type:"category", 
            name: this.id
        };
        
      
        geoStore.existsEntity(wpsCategory,
            function(exists){
                if(! exists){
                    geoStore.createEntity(wpsCategory, function(categoryID){
                        if( !categoryID){
                            geoStore.fireEvent("geostorefailure", this, "Geostore: create WPS category error");
                        }   
                    });
                } 
        });    
       
    },
    
    /** api: method[getExecuteInstances]
     *
     *  :arg process: ``String`` Optional process name for filter the instnances
     *  :arg callback: ``Function`` Optional callback to call when the
     *      instances are retrieved. 
     *      
     *  Get All WPS Execute Process instances. All asyncrhonous Execute instances not completed are updated.      
     */
    getExecuteInstances: function(process, callback) {
        var me= this;
        if(process == null){
            this.geoStoreClient.getCategoryResources(this.id, 
                function(instances){
                    me.updateInstances(null,instances, callback);
                });
        }else{
            this.geoStoreClient.getLikeName({ 
                type: "resource", 
                regName: this.getPrefixInstanceName(process)+"*"
            }, 
            function(instances){
                me.updateInstances(process,instances, callback);
            });
        } 
    },
    
    
    
    /** api: method[getExecuteInstance]
     *
     *  Get WPS Execute Process instance from id
     
     *  :arg instanceID: ``String`` instance ID
     *  :arg callback: ``Function`` Optional callback to call when the
     *      instance is retrieved. 
     */
    getExecuteInstance: function(instanceID, callback) {
        var me= this;
   
        me.geoStoreClient.getLikeName({ 
            type: "resource",
            name: instanceID
        }, 
        function(instances){
            var statusInfo= JSON.parse(instances[0].description);
                 
            if(statusInfo.status == "Process Started" || 
                statusInfo.status == "Process Accepted" ||
                statusInfo.status == "Process Paused"){ 
                  
                var updateCallback= function(instanceID){
                    me.getEntityByID({type: "resource", id: instanceID}, function(resource){
                        
                        var instance= resource;
                        instance.store= JSON.parse(resource.store);
                        instance.description= JSON.parse(resource.description);
                        callback.call(me, instance);
                    });  
                }      
                this.updateInstance(instances[0].name, null, null,
                statusInfo.statusLocation, updateCallback);  
            }else
                me.getEntityByID({type: "resource", id: instances[0].id}, function(resource){  
                    var instance= resource;
                    instance.store= JSON.parse(resource.store);
                    instance.description= JSON.parse(resource.description);
                    callback.call(me, instance);
                });
        });
       
    },
    
    
    /** private: method[updateInstances]
     */
    updateInstances: function(process,instances, callback){
        var pr=process;
        var me=this;

        var updateCallback= function(currentInstanceIndex, statusUpdated){
            statusUpdated[currentInstanceIndex]= true;
            var check= true;
                
            for(var i=0; i<statusUpdated.length; i++)
                check = check && statusUpdated[i];
            
            if(check){
                
                if(pr== null){
                    me.geoStoreClient.getCategoryResources(me.id, 
                        callback/*, function(){
                            me.fireEvent("geoStoreFailure", me);
                        }*/);
                }else{
                    me.geoStoreClient.getLikeName({ 
                        type: "resource", 
                        regName: me.getPrefixInstanceName(process)+"*"
                    }, 
                    callback/*, function(){
                        me.fireEvent("geoStoreFailure", me);
                    }*/);
                }
                
            }
        };
        delete statusUpdated;
        var statusUpdated=new Array();
        
        for(var i=0; i<instances.length; i++)
            statusUpdated[i]=false;
       
        for( i=0; i<instances.length; i++){
            var statusInfo= JSON.parse(instances[i].description);
            if(statusInfo.status == "Process Started" || 
                statusInfo.status == "Process Accepted" ||
                statusInfo.status == "Process Paused"){
                this.updateInstance(instances[i].name, statusUpdated, i,statusInfo.statusLocation, updateCallback);  
            }else
                statusUpdated[i]=true; 
        }
    },
    
    
    /** private: method[updateInstances]
     */
    updateInstance: function(instanceName, statusUpdated, instanceIndex, statusLocation, callback){
        var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost; 
        var url;
        var me= this;
        
        mHost=pattern.exec(statusLocation); 
        url = mHost[2] == location.host ? statusLocation :
        OpenLayers.ProxyHost + encodeURIComponent(statusLocation);
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function(response, opts){  
                var responseObj=new OpenLayers.Format.WPSExecute().read(response.responseText);
                me.responseManager(responseObj,instanceName, callback, statusUpdated, instanceIndex);
            },
            failure:  function(response, opts){
                
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
    execute: function(processName, executeRequest,callback) {
        var process = this.wpsClient.getProcess('opengeo', processName);    
        var instanceName=null;
        var executeOptions;
        var me= this;
        if(executeRequest instanceof Object){

            executeOptions= executeRequest;
        }else{

            executeOptions= new OpenLayers.Format.WPSExecuteRequest().read(executeRequest).processInput;
        
        }   
        instanceName=this.getInstanceName(processName);
        executeOptions.scope= this;
        executeOptions.success= function(response, processInstance){
            me.responseManager(response, processInstance);
            if(callback)
              callback.call(this, response);
        };
        executeOptions.success= this.responseManager;
        executeOptions.processInstance=instanceName;
      
        process.execute(executeOptions);    
        
        return instanceName;
    },
    
    
    
    /** private: method[responseManager]
     */
    responseManager: function(executeProcessResponse, processInstance, 
        callback, instancesStatusUpdated, instanceIndex) {
        var instanceInfo;
        var geoStore;
        var me= this;
        var stautsInfo;
        
        var resourceInstance={
            type: "resource",
            name: processInstance,
            metadata: "",
            category: me.id,
            store: JSON.stringify(executeResponse)
        };
        
        if(executeProcessResponse instanceof OpenLayers.Format.WPSExecute){
            resourceInstance.store= JSON.stringify(executeProcessResponse);

            var executeResponse= executeProcessResponse.executeResponse;
            if(executeResponse.exceptionReport){
                stautsInfo={
                    status: "Process Failed",
                    raw: false
                };
            }else{
                if(executeResponse.processSucceeded){
                    stautsInfo={
                        status: "Process Succeeded",
                        raw: false
                    };
                }else{
                    stautsInfo={
                        status: executeResponse.status.name,
                        percentCompleted: executeResponse.status.percentCompleted,
                        statusLocation: executeResponse.statusLocation,
                        creationTime: executeResponse.status.creationTime,
                        raw: false
                    };
                }
	
            }
        }else{
            resourceInstance.store= executeProcessResponse;  
            stautsInfo={
                status: "Process Succeeded",
                raw: true
            };
            
        } 
        resourceInstance.description= JSON.stringify(stautsInfo);
        
        geoStore=this.geoStoreClient;
        
        geoStore.getLikeName(resourceInstance, function(res){
            if(res != null){
                resourceInstance.id=res.id;
                geoStore.updateEntity(resourceInstance, function(entityID){
                    if(! entityID){
                        geoStore.fireEvent("geostorefailure", this, "Geostore: update WPS Instance Error"); 
                    }else{
                        if(callback)
                            callback.call(this,instanceIndex, instancesStatusUpdated);
                    }
                }/*, function(){
                    me.fireEvent("geostorefailure", this); 
                }*/);
                
            }else{
                geoStore.createEntity(resourceInstance, function(entityID){
                    if(! entityID){
                        me.fireEvent("geostorefailure", this, "Geostore: creation WPS Instance Error"); 
                    }else{
                        if(callback)
                            callback.call(this,instanceIndex, instancesStatusUpdated);
                    }
                }/*, function(){
                    me.fireEvent("geostorefailure", this); 
                }*/);   
            }
       
        }/*, function(){
            me.fireEvent("geostorefailure", this); 
        }*/); 
      
        return instanceInfo;
    }
    
});

Ext.preg(gxp.plugins.WPSManager.prototype.ptype, gxp.plugins.WPSManager);


