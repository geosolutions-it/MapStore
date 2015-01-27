/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 * api: (define)
 * module = GeoExplorerLoader
 * extends = Ext.util.Observable
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */

/** api: constructor
 *  .. class:: GeoExplorerLoader(config)
 *     Prepare a GeoExplorer configuration based on some custom configurations
 */
var GeoExplorerLoader = Ext.extend(Ext.util.Observable, {  
   

    /** private: method[constructor]
     */
    constructor: function(config, customConfigName, mapStoreDebug, mapId, auth, fScreen, templateId) {

        this.config = config || {};
        this.mapId = mapId;
        
        this.auth= this.getAuth();
        this.fScreen = fScreen;
        this.templateId = templateId;
        this.geoStoreBaseURL = config != null && config.geoStoreBaseURL ? config.geoStoreBaseURL : ('http://' + window.location.host + '/geostore/rest/');
        this.mapStoreDebug = mapStoreDebug;
        this.proxy = "";
        
        this.addEvents(
            /** api: event[loaddefaultconfig]
             *  Fired when the default configuration is loaded.
             *
             *  Listener arguments:
             *  * config - :class:`Object` the configuration loaded
             */
            "loaddefaultconfig",
            /** api: event[loadtemplateconfig]
             *  Fired when the template configuration is loaded.
             *
             *  Listener arguments:
             *  * config - :class:`Object` the configuration loaded
             */
            "loadtemplateconfig",
            /** api: event[configfinished]
             *  Fired when the all configurations are loaded.
             *
             *  Listener arguments:
             *  * config - :class:`Object` the configuration loaded
             */
            "configfinished"
        );
            
        GeoExplorerLoader.superclass.constructor.apply(this, arguments);

        this.loadDefaultConfig(customConfigName, mapStoreDebug);
    },

    /** private: method[loadDefaultConfig]
     *  Load default configuration
     */
    loadDefaultConfig: function(customConfigName, mapStoreDebug){
        var serverConfig = this.config;
        var templateId = this.templateId;

        this.on("loaddefaultconfig", function(config){
            Ext.apply(this.config, config);
            this.geoStoreBaseURL = config != null && config.geoStoreBase ? config.geoStoreBase : this.geoStoreBaseURL;
            this.proxy = this.mapStoreDebug === true ? "/proxy/?url=" : config.proxy ? config.proxy : "";
            this.loadTemplateConfig();
        });

        this.loadData(customConfigName ? "config/" + customConfigName + ".js"  : "config/mapStoreConfig.js", null, "loaddefaultconfig");      
    },

    /** private: method[loadTemplateConfig]
     *  Load template configuration
     */
    loadTemplateConfig: function(){
        var serverConfig = this.config;
        var templateId = this.templateId;

        if(templateId){
            this.on("loadtemplateconfig", function(config){
                Ext.apply(this.config, config);
                this.loadCustomConfigs();
            });
            // template can be a config file or a geostore resource
            if(typeof(templateId) == "number"){
                this.loadData(null, templateId, "loadtemplateconfig");
            }else{
                this.loadData("config/" + templateId + ".js", null, "loadtemplateconfig");
            }
        }else{
            this.loadCustomConfigs();
        }

    },

    /** private: method[loadCustomConfigs]
     *  Load existing configs available for the user logged/GUEST
     */
    loadCustomConfigs: function(){
        var config = this.config;
        var me = this;
        var url = this.geoStoreBaseURL + 'extjs/search/category/MAPSTORECONFIG';
        /*if(url.indexOf("http") == 0){
            url = this.proxy + url;
        }*/
        var h = {
            'Accept': 'application/json'
        };
        if(this.auth){
            h['Authorization'] = this.auth;
        }
        url = OpenLayers.Request.makeSameOrigin(url, this.proxy);
        this.adminConfigStore = new Ext.data.JsonStore({
            root: 'results',
            autoLoad: false,
            totalProperty: 'totalCount',
            successProperty: 'success',
            idProperty: 'id',
            fields: [
                'id',
                'name'
            ],
            proxy: new Ext.data.HttpProxy({
                url: url,
                restful: true,
                method : 'GET',
                disableCaching: true,
                headers: h,
                failure: function (response) {
                    // no custom configs available
                    me.fireEvent("configfinished", config);                                
                }
            }),
            listeners:{
                load: this.adminConfigLoad,
                scope: this
            }
        });
        this.adminConfigStore.load();
    },

    /** private: method[adminConfigLoad]
     *  Load the admin config from the configuration present on the store
     */
    adminConfigLoad: function(store){
        if(store && store.getCount && store.getCount() > 0){
            var pendingConfig = store.getCount();
            // config is this.config
            var config = this.config;
            // default tools
            var tools = [];
            this.on("loadcustomconfig", function(customConfig){
                pendingConfig--;
                if(customConfig && customConfig instanceof Object){
                    for(var key in customConfig) {
                        if(!config[key]){
                            config[key] = customConfig[key];
                        }else if(config[key] instanceof Array){
                            config[key] = this.addAll(customConfig[key], config[key]);
                        }else if(config[key] instanceof Object){
                            Ext.apply(config[key], customConfig[key]);
                        }else{
                            config[key] = customConfig[key];
                        }
                    }   
                }
                this.applyUserConfig(pendingConfig, config);
            });
            store.each(function(item){
                this.loadData(null, item.get("id"), "loadcustomconfig");
            }, this);
        }else{
            this.fireEvent("configfinished", config);
        }
    },

    /** private: method[loadData]
     *  Load a configuration from an url
     */
    loadData: function (url, dataId, eventListener){
        var url = (url ? url : this.geoStoreBaseURL + "data/" + dataId);
        url = OpenLayers.Request.makeSameOrigin(url, this.proxy);
        var h = {
            'Accept': 'application/json'
        };
        if(this.auth){
            h['Authorization'] = this.auth;
        }
        Ext.Ajax.request({
            method: 'GET',
            headers:h,
            scope: this,
            url: url,
            success: function(response, opts){
                try{
                    var loadedConfig = Ext.util.JSON.decode(response.responseText);
					// ////////////////////////////////////////////////////////////////////////////
					// TODO: Fix this in GeoStore also for maps configuration. At the first time 
					// GeoStore incapsulates the JSON in a "data" object. This is a temporary fix 
					// useful for template configurations.
					// ////////////////////////////////////////////////////////////////////////////
					if(loadedConfig.data){
						loadedConfig = Ext.util.JSON.decode(loadedConfig.data); 
					}
                    this.fireEvent(eventListener, loadedConfig);
                }catch(e){
                    console.error("Error getting config");
                    this.fireEvent(eventListener, {});
                }
            },
            failure:  function(response, opts){
                console.error("Error getting config");
                    this.fireEvent(eventListener, {});
            }
        });
    },

    /** private: method[addAll]
     */
    addAll: function(toAdd, target){
        var componentsNotPresent = [];
        if(toAdd instanceof Array){
            for(var i = 0; i < toAdd.length; i++){
                if(!this.isAlreadyPresent(toAdd[i], target)){
                    componentsNotPresent.push(toAdd[i]);
                }
            }   
        }else if(toAdd instanceof Object){
            if(!this.isAlreadyPresent(toAdd, target)){
                componentsNotPresent.push(toAdd);
            }
        }
        return target.concat(componentsNotPresent);
    },

    /** private: method[isAlreadyPresent]
     */
    isAlreadyPresent: function(element, elements){
        var isAlreadyPresent = false;
        if(elements && element){
            for(var i = 0; i < elements.length; i++){
                if(isAlreadyPresent){
                    break;
                }else{
                    isAlreadyPresent = true;   
                }
                for(var key in elements[i]){
                    isAlreadyPresent = isAlreadyPresent && (element[key] == elements[i][key]);
                    if(!isAlreadyPresent){
                        break;
                    }
                }
            }
        }
        return isAlreadyPresent;
    },

    /** private: method[applyUserConfig]
     *  Apply tools available for logged user
     */
    applyUserConfig: function(pendingConfig, config){
        if(pendingConfig == 0){
            this.fireEvent("configfinished", config);
        }
    },
     /**
     * Retrieves auth from (in this order)
     * * the session storage (if enabled userDetails, see ManagerViewPort.js class of mapmanager)
     * * the parent window (For usage in manager)
     * We should imagine to get the auth from other contexts.
     */
    getAuth: function(){
        var auth;
        
        //get from the session storage
        var existingUserDetails = sessionStorage["userDetails"];
        if(existingUserDetails){
            this.userDetails = Ext.util.JSON.decode(sessionStorage["userDetails"]);
            auth = this.userDetails.token;
        } else if(window.parent && window.parent.window && window.parent.window.manager && window.parent.window.manager.auth){
          //get from the parent
          auth = window.parent.window.manager.auth;
          return auth;
        }
        
        return auth;
    }

});

