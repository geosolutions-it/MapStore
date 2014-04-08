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
    layout:'fit',

    /** api: config[tools]
     *  ``Array`` Custom tools to include by default
     */

    /** api: loggedTools[tools]
     *  ``Array`` Custom tools to include in a logged user. TODO: Remove when load logged tools.
     */

    /** api: loggedTools[currentTools]
     *  ``Array`` Current active tools.
     */
    currentTools: {},

    /** private: loggedTools[logged]
     *  ``Boolean`` Login status. By default false.
     */
    logged: false, 
    
    initComponent : function() {

        // save initial config
        this.initialConfig = {};
        Ext.apply(this.initialConfig, this);
        Ext.apply(this.initialConfig, this.config);

        // /////////////////////////
        // Init useful URLs
        // /////////////////////////
        var config = this.config;
        var geoStoreBase = config.geoStoreBase;
        this.murl = config.composerUrl;
        this.socialUrl = config.socialUrl;
        
        this.geoBaseUsersUrl= geoStoreBase + 'users';
        this.geoBaseMapsUrl = geoStoreBase + 'resources';
        this.geoSearchUrl = geoStoreBase + 'extjs/search/category/MAP/';
        // this.geoSearchUrl = geoStoreBase + 'extjs/search/';
        this.geoSearchUsersUrl = geoStoreBase + 'extjs/search/users';
        this.geoSearchCategoriesUrl = geoStoreBase + 'extjs/search/category';

        var mergedItems = [];

        // this component is the tool bar at top
        var north = {
            region: "north",
            layout: "fit",
            id: this.id + "_north",
            border: false,
            tbar: ["-", "->", "-"],
            items: this.items
        };

        mergedItems.push(north);

        this.items = mergedItems;
        
        mxp.widgets.ManagerViewport.superclass.initComponent.call(this, arguments);

        this.initTools();
        this.fireEvent("portalready");

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
        this.adminConfigStore.proxy.getConnection().defaultHeaders= {
            'Accept': 'application/json', 
            'Authorization' : this.auth
        };
        this.adminConfigStore.load();
    },

    /** private: method[adminConfigLoad]
     *  Load the admin config from the configuration present on the store
     */
    adminConfigLoad: function(store){
        if(store && store.getCount && store.getCount() > 0){
            var pendingConfig = store.getCount();
            var tools = [];
            store.each(function(item){
                var url = this.config.geoStoreBase + "data/" + item.get("id");
                Ext.Ajax.request({
                    method: 'GET',
                    scope: this,
                    url: url,
                    proxy: new Ext.data.HttpProxy({
                        restful: true,
                        method : 'GET',
                        disableCaching: true,
                        failure: function (response) {
                            console.error("Error getting config");
                            pendingConfig--;
                            this.applyUserConfig(pendingConfig, tools);
                        },
                        defaultHeaders: {'Accept': 'application/json', 'Authorization' : this.auth}
                    }),
                    success: function(response, opts){
                        pendingConfig--;
                        var pluginsConfig;
                        try{
                            pluginsConfig = Ext.util.JSON.decode(response.responseText);
                            if(pluginsConfig && pluginsConfig.length > 0){
                                for(var i = 0; i < pluginsConfig.length; i++) {
                                    tools.push(pluginsConfig[i]);
                                }   
                            }
                            this.applyUserConfig(pendingConfig, tools);
                        }catch(e){
                            console.error("Error getting config");
                        }
                    },
                    failure:  function(response, opts){
                        pendingConfig--;
                        console.error("Error getting config");
                        this.applyUserConfig(pendingConfig, tools);
                    }
                });
            }, this);
        }
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
    onLogin: function(user, auth){
        if(!this.logged && user){
            this.cleanTools();
            this.auth = auth ? auth: this.auth;
            this.logged = true;

            this.defaultHeaders = {
                'Accept': 'application/json', 
                'Authorization' : this.auth
            };

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

            // FIXME: Sometimes it doesn't work
            // Remove cookie for production instances
            this.defaultHeaders = {
                'Accept': 'application/json',
                'Authorization' : "",
                'Set-Cookie': ""    
            };
            Ext.util.Cookies.clear();

            this.cleanTools();
            this.initTools();
            this.logged = false;
            this.fireEvent("portalready");   
        }
    }
});

/** api: xtype = mxp_viewport */
Ext.reg(mxp.widgets.ManagerViewport.prototype.xtype, mxp.widgets.ManagerViewport);
