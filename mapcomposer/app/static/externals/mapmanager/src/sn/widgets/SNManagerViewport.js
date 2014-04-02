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
 *  module = sn.widgets
 *  class = SNManagerViewport
 *  base_link = `Ext.Viewport <http://extjs.com/deploy/dev/docs/?class=Ext.Viewport>`_
 */
Ext.ns('sn.widgets');

/**
 * Class: SNManagerViewport
 * Viewport for the SN Manager application
 * 
 * Inherits from:
 *  - <Ext.Viewport>
 *
 */
sn.widgets.SNManagerViewport = Ext.extend(Ext.Viewport, {

    /** api: xtype = sn_viewport */
    xtype: "sn_viewport",

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
        
        sn.widgets.SNManagerViewport.superclass.initComponent.call(this, arguments);

        this.initTools();
        this.fireEvent("portalready");
    },
    
    initTools: function() {
        this.loadTools(this.initialConfig.tools);
    },

    cleanTools: function(){
        for(var id in this.currentTools){
            this.currentTools[id].remove();
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

    /** private: method[onLogin]
     *  Listener with actions to be executed when an user makes login.
     */
    onLogin: function(user){
        if(!this.logged){
            this.cleanTools();
            this.auth = user;
            this.logged = true;
            this.loadTools(this.initialConfig.loggedTools);
            this.fireEvent("portalready");   
        }
    },

    /** private: method[onLogout]
     *  Listener with actions to be executed when an user makes logout.
     */
    onLogout: function(){
        if(this.logged){
            this.cleanTools();
            this.initTools();
            this.auth = null;
            this.logged = false;
            this.fireEvent("portalready");   
        }
    }
});

/** api: xtype = sn_viewport */
Ext.reg(sn.widgets.SNManagerViewport.prototype.xtype, sn.widgets.SNManagerViewport);
