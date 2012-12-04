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
 * @requires 
 */


/** api: (define)
 *  module = gxp.plugins
 *  class = GeoStoreClient
 */

/** api: (extends)
 *  
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GeoStoreClient(config)
 *
 *
 * The GeoStoreClient Plugin provides a high level API for interaction with Geostore.  
 * An gxp.plugins.GeoStoreClient uses a OpenLayersExt.Format.GeoStore class in order to create Geostore request and to parse the Geostore response.
 */ 
   
/** api: example
 *  
 *  new gxp.plugins.GeoStoreClient({
 *			url: "http://localhost:8080/geostore",
 *			user: "user",
 *			password: "password",
 *			proxy: "/http_proxy/proxy?url=",
 *			listeners: {
 *				"geostorefailure": function(tool, msg){
 *					Ext.Msg.show({
 *						title: "Geostore Exception",
 *						msg: msg,
 *						buttons: Ext.Msg.OK,
 *						icon: Ext.Msg.ERROR
 *					});
 *				}
 *			}
 *		});
 *
 */
gxp.plugins.GeoStoreClient =  Ext.extend(gxp.plugins.Tool,{
    
    /** api: ptype = gxp_geostore */
    ptype: "gxp_geostoreclient",
    
    
    /** api: config[url] 
     *  ``String`` GeoStore URL
     */
    url: null, 
    
    
    /** api: config[proxy] 
     *  ``String`` Http Proxy URL
     */
    proxy: null, 
    

    /** private: property[user]
     *  ``String`` Username for the authenticate requests
     */
    user: null,
    
    /** private: property[password]
      *  ``String`` Password for the authenticate requests
     */
    password: null,
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        this.addEvents(
            /** api: event[geostorefailure]
            *  Fired when an geoStore request fails.
            *
            *  Listener arguments:
            *
            *  * tool - :class:`gxp.plugins.GeoStoreClient` this tool
            *  * error - ``String`` geostore error message
            */
            "geostorefailure"
            );
        
        gxp.plugins.GeoStoreClient.superclass.constructor.apply(this, arguments);   

    },
    
    

    /** private: method[sendRequest]
     *
     *  Send GeoStore request
     */
    sendRequest: function(restPath, method, content, contentType, success, failure) {
        var headers= {
            'Accept' : 'application/json, text/plain, text/xml'
        };
	
        if(contentType)
            headers['Content-Type']= contentType;
	
        if(this.user && this.password){
            headers['Authorization']= 'Basic ' + Base64.encode(this.user + ':' + this.password);
        }
	
        var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
        var mHost=pattern.exec(this.url); 
        var mUrl = this.url+restPath;
        var url = mHost[2] == location.host ? mUrl : this.proxy + mUrl;
	
        
        Ext.Ajax.disableCaching=false;
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: headers,
            params: content,
            scope: this,
            success: success,
            failure: failure
        });	
    },
    
   
    
    /** api: method[createEntity]
     *
     *  :arg entity: ``Object`` Object which contains the Geostore entity properties.
     *                          The Object properties are  defined in the OpenlayersExt.Format.Geostore class.
     *  :arg success: ``Function`` Optional callback to call when request the has been executed successfully
     *  :arg failure: ``Function`` Optional callback to call when the request fails
     *       
     *       
     *  Send create Geostore entity request
     */
    createEntity: function (entity, success, failure){
        var restPath="";
        var method= "POST";
        var contentType= "text/xml";
        var content= null;
        var callFailure= null;
        
        
        switch (entity.type){
            case "resource":
                restPath="/resources";
                break;
            case "user":
                restPath="/users";
                break;
            case "category":
                restPath="/categories";
                break;    
            default:
                throw "Entity type not supported"; 
        }
	
        var callSuccess= function(response, opts){
            var entityID= response.responseText;
	  
            success.call(this, entityID);
        };
	
	
        if(failure)
            callFailure= failure;
        else{
            var me=this;
            callFailure= function(response, opts){
                var msg="Create entity: \"" + entity.type +"\" failed. "
                    + response.responseText;
                me.fireEvent("geostorefailure", this, msg);
                
            };
        }    
	
	
        if(entity instanceof String){
            content= entity;
        }else {
            if(entity instanceof Object){
                content= new OpenLayers.Format.GeoStore().write(entity);
            }
        }
       
        this.sendRequest(restPath, method, content, contentType, callSuccess, callFailure);
    },
    
    
    /** api: method[deleteEntity]
     *
     *  :arg entity: ``Object`` Object which contains the Geostore entity properties.
     *                          This object properties are:
     *                              - type: ``String`` Mandatory. Defines the entity type. Available values: category, resource, user
     *                              - id: ``Number`` Mandatory. Entity identifier
     *  :arg success: ``Function`` Optional callback to call when request the has been executed successfully
     *  :arg failure: ``Function`` Optional callback to call when the request fails
     *  
     *  Send delete entity request
     */
    deleteEntity: function (entity, success, failure){
        var restPath="";
        var method= "DELETE";
        var callFailure;
        
        switch (entity.type){
            case "resource":
                restPath="/resources/resource/"+entity.id;
                break;
            case "user":
                restPath="/users/user/"+entity.id;
                break;
            case "category":
                restPath="/categories/category/"+entity.id;
                break;    
            default:
                throw "Entity type not supported";     
        }
        
        if(failure)
            callFailure= failure;
        else{
            var me=this;
            callFailure= function(response, opts){
                var msg="Delete entity: \"" + entity.type +"\" request failed. "
                    + response.responseText;
                me.fireEvent("geostorefailure", this, msg);
                
            };
        } 
        
        this.sendRequest(restPath, method, null, null, success, callFailure);
    },
    
    
    
    /** api: method[updateEntity]
     *
     *  :arg entity: ``Object`` Object which contains the Geostore entity properties.
     *                          The Object properties are  defined in the OpenlayersExt.Format.Geostore class.
     *  :arg success: ``Function`` Optional callback to call when request the has been executed successfully
     *  :arg failure: ``Function`` Optional callback to call when the request fails
     *
     *  Send update entity request
     */
    updateEntity: function (entity, success, failure){
        var restPath="";
        var method= "PUT";
        var contentType= "text/xml";
        var content= null;
        var callFailure;
        switch (entity.type){
            case "resource":
                restPath="/resources/resource/"+entity.id;
                break;
            case "user":
                restPath="/users/user/"+entity.id;
                break;
            case "category":
                restPath="/categories/category/"+entity.id;
                break;    
            default:
                throw "Entity type not supported";     
        }
        
        var callSuccess= function(response, opts){
            var entityID= response.responseText;
	  
            success.call(this, entityID);
        };
        
        
        if(failure)
            callFailure= failure;
        else{
            var me=this;
            callFailure= function(response, opts){
                var msg="Update entity: \"" + entity.type +"\" failed. "
                    + response.responseText;
                me.fireEvent("geostorefailure", this, msg);
                
            };
        } 
        
        if(entity instanceof String){
            content= entity;
        }else {
            if(entity instanceof Object){
                content= new OpenLayers.Format.GeoStore().write(entity);
            }
        }
        
        this.sendRequest(restPath, method, content, contentType, callSuccess, callFailure);
    },
    
    
    
    
    /** api: method[getCategoryResources]
     *
     *  :arg categoryName: ``String`` Category name
     *  :arg success: ``Function`` Optional callback to call when request the has been executed successfully
     *  :arg failure: ``Function`` Optional callback to call when the request fails
     *  
     *  Send get all resources by category request
     */
    getCategoryResources: function (categoryName, success, failure){
        var restPath="/misc/category/name/"+categoryName+"/resources";
        var method= "GET";
        var callFailure;

        var callSuccess= function(response, opts){
            var jsonResponse= JSON.parse(response.responseText);
            var resources;
          
            if(jsonResponse.ResourceList.Resource instanceof Array)
                resources=jsonResponse.ResourceList.Resource;
            else{
                resources= new Array();
                resources.push(jsonResponse.ResourceList.Resource);
            }
	  
            success.call(this, resources);
        };
        
        
        if(failure)
            callFailure= failure;
        else{
            var me=this;
            callFailure= function(response, opts){
                var msg="Get all resources by category failed. "
                    + response.responseText;
                me.fireEvent("geostorefailure", this, msg);
                
            };
        } 
        
        this.sendRequest(restPath, method, null, null, callSuccess, callFailure);
    },
    
    
    
    /** api: method[getLikeName]
     *
     *  :arg entity: ``Object`` Object which contains the Geostore entity properties.
     *                          This object properties are:
     *                              - type: ``String`` Mandatory. Defines the entity type. Available values: resource, user
     *                              - regName: ``String`` Regular Expression for the entity name
     *  :arg success: ``Function`` Optional callback to call when request the has been executed successfully
     *  :arg failure: ``Function`` Optional callback to call when the request fails
     *
     *  Send get entity by like name request
     */
    getLikeName: function (entity, success, failure){
        var restPath="";
        var method= "GET";
        var callFailure;
        switch (entity.type){
            case "resource":
                restPath="/resources/search/"+entity.regName;
                break;
            case "user":
                restPath="/users/search/"+entity.regName;
                break;
            default:
                throw "Entity type not supported";     
        }

        var callSuccess= function(response, opts){
            var jsonResponse= JSON.parse(response.responseText);
            var entity= null;
          
            if(jsonResponse.ResourceList){
                if(jsonResponse.ResourceList.Resource instanceof Object){
                    entity= jsonResponse.ResourceList.Resource;
                }
            }
            
            if(jsonResponse.UsersList){
                if(jsonResponse.UsersList.User instanceof Object){
                    entity= jsonResponse.UsersList.User;
                }
            }

	  
            success.call(this, entity);
        };
        
        if(failure)
            callFailure= failure;
        else{
            var me=this;
            callFailure= function(response, opts){
                var msg="Get entity: \"" + entity.type +"\" by like name request failed. "
                    + response.responseText;
                me.fireEvent("geostorefailure", this, msg);
                
            };
        } 
        
        this.sendRequest(restPath, method, null, null, callSuccess, callFailure);
    },
    
    
    /** api: method[existsEntity]
     *
     * :arg entity: ``Object`` Object which contains the Geostore entity properties.
     *                          This object properties are:
     *                              - type: ``String`` Mandatory. Defines the entity type. Available values: category, resource, user
     *                              - id: ``Number`` Mandatory. Entity identifier               
     *  :arg success: ``Function`` Optional callback to call when request the has been executed successfully
     *  :arg failure: ``Function`` Optional callback to call when the request fails
     *                                       
     *  Send "exists entity by name" request (The method uses the count request)
     */
    existsEntity: function (entity, success, failure){
     
        var restPath="";
        var method= "GET";

        switch (entity.type){
            case "resource":
                restPath="/resources/count/";
                break;
            case "user":
                restPath="/users/count/";
                break;
            case "category":
                restPath="/categories/count/";
                break;    
            default:
                throw "Entity type not supported";     
        }
        
        restPath+=entity.name;
        var callFailure;
        
        var callSuccess= function(response, opts){
            var count= response.responseText;
	  
            success.call(this, parseInt(count)>0);
        };
	
	
        if(failure)
            callFailure= failure;
        else{
            var me=this;
            callFailure= function(response, opts){
                var msg="Exists entity: \"" + entity.type +"\" request failed. "
                    + response.responseText;
                me.fireEvent("geostorefailure", this, msg);
                
            };
        } 
	
        this.sendRequest(restPath, method, null, null, callSuccess, callFailure);
    },
    
    
   
    /** api: method[getEntityByID]
     *
     * :arg entity: ``Object`` Object which contains the Geostore entity properties.
     *                          This object properties are:
     *                              - type: ``String`` Mandatory. Defines the entity type. Available values: category, resource, user
     *                              - id: ``Number`` Mandatory. Entity identifier               
     *  :arg success: ``Function`` Optional callback to call when request the has been executed successfully
     *  :arg failure: ``Function`` Optional callback to call when the request fails
     *
     *  Send "get entity by ID" request
     */
    
    getEntityByID: function (entity, success, failure){
        var restPath="";
        var method= "GET";
        var advPar="";

        switch (entity.type){
            case "resource":
                restPath="/resources/resource/";
                advPar="?full=true";
                break;
            case "user":
                restPath="/users/user/";
                break;
            case "category":
                throw "/categories/category/";
                break;    
            default:
                throw "Entity type not supported";     
        }
        
        restPath+=entity.id+advPar;
        var callFailure;
        
        var callSuccess= function(response, opts){
            var entity= JSON.parse(response.responseText);
     
            success.call(this, entity);
        };
	
	
        
        if(failure)
            callFailure= failure;
        else{
            var me=this;
            callFailure= function(response, opts){
                var msg="Get entity by ID: \"" + entity.type +"\" request failed. "
                    + response.responseText;
                me.fireEvent("geostorefailure", this, msg);
                
            };
        } 

        this.sendRequest(restPath, method, null, null, callSuccess, callFailure);
    }


    
});

Ext.preg(gxp.plugins.GeoStoreClient.prototype.ptype, gxp.plugins.GeoStoreClient);



