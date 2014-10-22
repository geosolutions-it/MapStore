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
 *  module = mxp.plugins
 *  class = MapManager
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: MapManager(config)
 *
 *    Open the map manager
 */
mxp.plugins.MapManager = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_mapmanager */
    ptype: "mxp_mapmanager",

    buttonText: "Map manager",
    tooltipText: "Open map manager",

    loginManager: null, 

    setActiveOnOutput: true,

    // default configuration for the output
    outputConfig: {
        renderMapToTab: 'mainTabPanel',
        adminPanelsTargetTab : 'mainTabPanel',
        viewConfig: {
            forceFit: true
        }       
    },

    /** api: method[addActions]
     */
    addActions: function() {
        
        var thisButton = new Ext.Button({
            text: this.buttonText,
            tooltip: this.tooltipText,
            handler: function() { 
            	this.addOutput();                        
            },
            scope: this
        });

        var actions = [thisButton];
        // var actions = [];

        return mxp.plugins.MapManager.superclass.addActions.apply(this, [actions]);

        
    },
    
    /** api: method[addOutput]
     *  :arg config: ``Object`` configuration for the ``Ext.Component`` to be
     *      added to the ``outputTarget``. Properties of this configuration
     *      will be overridden by the applications ``outputConfig`` for the
     *      tool instance.
     *  :return: ``Ext.Component`` The component added to the ``outputTarget``. 
     *
     *  Adds output to the tool's ``outputTarget``. This method is meant to be
     *  called and/or overridden by subclasses.
     */
    addOutput: function(config) {

        var login = this.target.login ? this.target.login: 
                this.loginManager && this.target.currentTools[this.loginManager] 
                ? this.target.currentTools[this.loginManager] : null;

        // create a map manager panel
    	Ext.apply(this.outputConfig, {
            xtype: 'msm_mapgrid',
            iconCls: "server_map",
            title: this.buttonText,
            start: this.target.config.start,
            limit: this.target.config.limit,
            msmTimeout:this.target.config.msmTimeout,
            lang: this.target.config.lang,
            config: this.target.config,
            langSelector: this.target.config.langSelector,
            ASSET: this.target.config.ASSET,
            login: login.login,
            auth: this.target.auth,
            searchUrl: this.target.geoSearchUsersUrl,
            url: this.target.geoBaseUsersUrl,
            geoStoreBase: this.target.config.geoStoreBase,
            target: this.target
    	});

        // apply headers on grid
        this.on("outputadded", this.applyLoggedState, this);

        // apply login state on grid
        if(login && !login.login){
            login.on("actionsadded", function(login){
                this.login = login;
                login.on("login", this.applyLoggin, this);
                login.on("logout", this.applyLoggin, this);
            }, this);
        }

        return mxp.plugins.MapManager.superclass.addOutput.apply(this, arguments);
    },
    
    /** api: method[applyLoggin]
     *  If an user is logged, apply user information to the grid
     */
    applyLoggin: function(username){
        if(this.output){
            for(var i = 0; i < this.output.length; i++){
                this.output[i].login = this.login.login;
                this.output[i].auth = this.login.login.getToken();

                if(this.login.login && this.login.login.username){
                    this.applyLoggedState(this.output[i]);
                }
            }
        }
    },
    
    /** api: method[applyLoggedState]
     *  Apply target headers on grid
     */
    applyLoggedState: function(output){
        if(output){
            if(output.rendered && output.isVisible && output.isVisible()){
                // rendered and visible
                output.render();
                output.store.proxy.headers = this.target.defaultHeaders;
                output.getBottomToolbar().bindStore(output.store, true);
                output.getBottomToolbar().doRefresh();
                output.plugins.collapseAll();
                if(this.target.auth){
                    output.getBottomToolbar().openMapComposer.enable();
                    output.openUserManagerButton.enable();
                }else{
                    output.getBottomToolbar().openMapComposer.disable();
                    output.openUserManagerButton.disable();
                }
            }else{
                // Tab not enabled, wait for activate
                output.on("activate", function(){
                    output.render();
                    output.store.proxy.headers = this.target.defaultHeaders;
                    output.getBottomToolbar().bindStore(output.store, true);
                    output.getBottomToolbar().doRefresh();
                    output.plugins.collapseAll();
                    if(this.target.auth){
                        output.getBottomToolbar().openMapComposer.enable();
                        output.openUserManagerButton.enable();
                    }else{
                        output.getBottomToolbar().openMapComposer.disable();
                        output.openUserManagerButton.disable();
                    }
                }, this);   
            }
        }
    },
    
    /** api: method[remove]
     *  Removes all actions and outputs created by this tool
     */
    remove: function() {

        var login = this.target.login ? this.target.login: 
                this.loginManager && this.target.currentTools[this.loginManager] 
                ? this.target.currentTools[this.loginManager] : null;

        login.removeListener("login", this.onLogin, this);
        login.removeListener("logout", this.onLogout, this);
        this.removeListener("outputadded", this.applyLoggedState, this);

        return mxp.plugins.MapManager.superclass.remove.apply(this, arguments);
    }
});

Ext.preg(mxp.plugins.MapManager.prototype.ptype, mxp.plugins.MapManager);