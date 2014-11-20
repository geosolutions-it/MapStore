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

/** api: (define)
 *  module = mxp.widgets
 *  class = ManagerViewport
 *  base_link = `Ext.Viewport <http://extjs.com/deploy/dev/docs/?class=Ext.Viewport>`_
 */
Ext.ns('mxp.widgets');

/**
 * Class: ManagerViewport
 * Viewport for the Manager application
 * 
 * Inherits from:
 *  - <Ext.Viewport>
 *
 */
mxp.widgets.ManagerViewport = Ext.extend(Ext.Viewport, {

    /** api: xtype = mxp_viewport */
    xtype: "mxp_viewport",

    /**
     * Property: config
     * {object} object for configuring the component. See <config.js>
     *
     */
    config : null,
    /**
     * Property: layout
     * {string} sets the type of layout
     * 
     */ 
    layout:'border',

    /** api: config[tools]
     *  ``Array`` Custom tools to include by default
     */

    /** api: config[tools]
     *  ``Array`` Custom tools to include in a logged user. TODO: Remove when load logged tools.
     */

    /** api: config[currentTools]
     *  ``Array`` Current active tools.
     */
    currentTools: {},

    /** private: config[logged]
     *  ``Boolean`` Login status. By default false.
     */
    logged: false, 

    /** private: config[pluggableByUserGroupConfig]
     *  ``Boolean`` Try to get ADMINCONFIG from geostore when an user is logged. By default false.
     */
    pluggableByUserGroupConfig: false,
    
    /**
     * api: config[loginDataStorage]
     * {string} actually supports null or a value: "sessionStorage" to emulate the session
     * persistence using the session storage object
     */
    loginDataStorage:null,
    
    initComponent : function() {
        
        // save initial config
        this.initialConfig = {};
        Ext.apply(this.initialConfig, this);
        Ext.apply(this.initialConfig, this.config);

        // copy pluggableByUserGroupConfig config
        this.pluggableByUserGroupConfig = this.initialConfig.pluggableByUserGroupConfig;

        // /////////////////////////
        // Init useful URLs
        // /////////////////////////
        var config = this.config;
        var geoStoreBase = config.geoStoreBase;
        this.murl = config.composerUrl;
        this.socialUrl = config.socialUrl;
        this.adminUrl = config.adminUrl;
        this.geoStoreBase = config.geoStoreBase;
        this.geoBaseUsersUrl= geoStoreBase + 'users';
        this.geoBaseMapsUrl = geoStoreBase + 'resources';
        this.geoSearchUrl = geoStoreBase + 'extjs/search/category/MAP/';
        // this.geoSearchUrl = geoStoreBase + 'extjs/search/';
        this.geoSearchUsersUrl = geoStoreBase + 'extjs/search/users';
        this.geoSearchCategoriesUrl = geoStoreBase + 'extjs/search/category';
        //this.items=[];
        var mergedItems = [];
        
        // this component is the tool bar at top
        var center = {
            region: "center",
            layout:'fit',
            id: this.id + "_north",
            border: false,
            tbar: ["-", "->", "-"],
            items: this.items
        };

        
        
        mergedItems.push(center);
        mergedItems.push(this.getDecoration());
        this.items = mergedItems;
        
        mxp.widgets.ManagerViewport.superclass.initComponent.call(this, arguments);

        this.fireEvent("portalready");
        var user = this.restoreLoginState();
        if(!this.logged && user){
            var auth = user.token;
            this.cleanTools();
            this.user = user.user;
            this.auth = auth ? auth: this.auth;
            this.logged = true;

            this.defaultHeaders = {
                'Accept': 'application/json', 
                'Authorization' : this.auth
            };

            
        }
        // load config if present
        this.reloadConfig();
    },
    
    initTools: function() {
        this.loadTools(this.initialConfig.tools);
    },

    cleanTools: function(){
        for(var id in this.currentTools){
            this.currentTools[id].remove();
        }
        var mainPanel = Ext.getCmp("mainTabPanel");
        try{
            mainPanel.removeAll();
        }catch (e){
            // FIXME: some error here
        }
        this.currentTools = {};
    },
    
    loadTools: function(tools) {
        this.tools = {};
        if (tools && tools.length > 0) {
            var tool;
            for (var i=0, len=tools.length; i<len; i++) {
                try {

                    if(tools[i].needsAuthorization && !this.auth)
                        continue;
                    
                    tool = Ext.ComponentMgr.createPlugin(
                        tools[i], this.defaultToolType
                    );

                } catch (err) {
                    throw new Error("Could not create tool plugin with ptype: " + this.initialConfig.tools[i].ptype);
                }
                tool.init(this);
                this.currentTools[tool.pluginId ? tool.pluginId : tool.id] = tool;
            }
        }
    },

    /** private: method[reloadConfig]
     *  Load existing configs available for the user logged/GUEST
     */
    reloadConfig: function(){
        if(this.pluggableByUserGroupConfig){
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
                    url: this.config.geoStoreBase + 'extjs/search/category/ADMINCONFIG',
                    restful: true,
                    method : 'GET',
                    disableCaching: true,
                    headers:{
                        'Accept': 'application/json', 
                        'Authorization' : this.auth
                    },
                    failure: function (response) {
                        Ext.Msg.show({
                           title: "Error",
                           msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                           buttons: Ext.Msg.OK,
                           icon: Ext.MessageBox.ERROR
                        });                                
                    }
                }),
                listeners:{
                    load: this.adminConfigLoad,
                    scope: this
                }
            });
            
            this.adminConfigStore.load();
        }else{
            // Load default config
            this.adminConfigLoad(null);
        }
    },

    /** private: method[adminConfigLoad]
     *  Load the admin config from the configuration present on the store
     */
    adminConfigLoad: function(store){
        if(store && store.getCount && store.getCount() > 0){
            var pendingConfig = store.getCount();
            // TODO: use config to extent this functionality
            var config = {
                tools: this.initialConfig.loggedTools
            };
            this.on("loadcustomconfig", function(customConfig){
                pendingConfig--;
                if(customConfig && customConfig instanceof Array){
                    // now only add tools
                    config["tools"] = this.addAll(customConfig, config["tools"]);
                }else if(customConfig && customConfig instanceof Object){
                    // in the future we can add different configs (removeTools, headers...?)
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
                // TODO: use config to extent this functionality
                this.applyUserConfig(pendingConfig, config.tools);
            });
            store.each(function(item){
                this.loadData(null, item.get("id"), "loadcustomconfig");
            }, this);
        }else{
            // load default logged tools
            var applyConfig = this.logged ? this.initialConfig.loggedTools : this.initialConfig.tools;
            if( this.initialConfig.adminTools && this.user && this.user.role == 'ADMIN'){
                applyConfig =this.initialConfig.adminTools;
            }
            this.applyUserConfig(0,applyConfig);
        }
    },

    /** private: method[loadData]
     *  Load a configuration from an url
     */
    loadData: function (url, dataId, eventListener){
        var url = (url ? url: this.initialConfig.geoStoreBase + "data/" + dataId);
        if(url.indexOf("/") != 0){
            url = this.initialConfig.proxy + url;
        }
        Ext.Ajax.request({
            method: 'GET',
            scope: this,
            url: url,
            success: function(response, opts){
                try{
                    var loadedConfig = Ext.util.JSON.decode(response.responseText);
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
        //TODO: checkall, now only check ptype
        var isAlreadyPresent = false;
        if(elements && element){
            for(var i = 0; i < elements.length; i++){
                if(elements[i].ptype == element.ptype){
                    isAlreadyPresent = true;   
                    break;
                }
            }
        }
        return isAlreadyPresent;
    },

    /** private: method[applyUserConfig]
     *  Apply tools available for logged user
     */
    applyUserConfig: function(pendingConfig, tools){
        if(pendingConfig == 0 && tools && tools.length > 0){
            this.cleanTools();
            this.loadTools(tools);
            this.fireEvent("portalready");   
        }
    },

    /** private: method[onLogin]
     *  Listener with actions to be executed when an user makes login.
     */
    onLogin: function(user, auth, details){
        if(!this.logged && user){
            this.cleanTools();
            this.user = details;
            this.auth = auth ? auth: this.auth;
            this.logged = true;

            this.defaultHeaders = {
                'Accept': 'application/json', 
                'Authorization' : this.auth
            };
            this.saveLoginState();
            // reload config
            this.reloadConfig();
        }
        
    },

    /** private: method[onLogout]
     *  Listener with actions to be executed when an user makes logout.
     */
    onLogout: function(){
        if(this.logged){
            this.auth = null;

            // Remove headers
            this.defaultHeaders = {
                'Accept': 'application/json',
                'Authorization' : ""
            };

            this.cleanTools();
            this.initTools();
            this.logged = false;
            this.resetLoginState();
            this.fireEvent("portalready");   
        }
    },

    /** private: method[saveLoginState]
     *  Save the login status in the session Storage.
     */
    saveLoginState: function(){
      //TODO Update user data
      if(sessionStorage && this.config.loginDataStorage){
        sessionStorage["userDetails"] = this.user;
      }
      
    },
    
    /** private: method[resetLoginState]
     *  Reset the login status (on Logout)
     */
    resetLoginState: function(){
      if(sessionStorage ){
        sessionStorage.removeItem("userDetails");
      }
      
    },
    
    /** private: method[restoreLoginState]
     *  Load login status from the session storage.
     */
    restoreLoginState: function(){
      if(sessionStorage && this.config.loginDataStorage){
      var ud = sessionStorage["userDetails"];
      
        if(ud){
          return Ext.util.JSON.decode(ud) ;
        }
      }
      return null;
        
    },
    getDecoration: function(){
         //Manage Header and Footer
        var header = this.config.header;
        var footer = this.config.footer;
        var panels = [];  

        var parseKnowIntegers = function(section){
            var knownInteger = {'height':true, 'maxHeight': true, 'minWidth':true};
            for(var key in knownInteger){
                if(section[key]){
                    try{
                        section[key] = parseInt(section[key]);	
                    }catch (e){
                        // unknown parameter value
                    }
                }	
            }
            return section;
        }

        if(header){
            var north = {
                header: false,
                region: 'north',
                id: 'msheader'
            };
            north = Ext.applyIf(north, (header.container ? parseKnowIntegers(header.container) : {}));
            var html = header.html;
            if(header.html instanceof Array){
                html = header.html.join("");
            }
            north.html = (header.css || '') + (html || '');
            panels.push(north);
        }



        if(footer){
             var south = {
                header: false,
                region: 'south',
                id: 'msfooter'
            };
            south = Ext.applyIf(south, (footer.container ? parseKnowIntegers(footer.container) : {}));
            var html = footer.html;
            if(footer.html instanceof Array){
                html = footer.html.join("");
            }
            south.html = (footer.css || '') + (html || '');
            panels.push(south);
        }
        return panels;

    }
});

/** api: xtype = mxp_viewport */
Ext.reg(mxp.widgets.ManagerViewport.prototype.xtype, mxp.widgets.ManagerViewport);
