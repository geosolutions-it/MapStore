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
 *  class = UserManager
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: UserManager(config)
 *
 *    Open a user manager panel
 */
mxp.plugins.UserManager = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_usermanager */
    ptype: "mxp_usermanager",

    buttonText: "User manager",
    tooltipText: "Open user manager",

    setActiveOnOutput: true,

    loginManager: null, 

    // default configuration for the output
    outputConfig: {
        closable: true,
        closeAction: 'close',
        autoWidth: true,
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
                // add output if not present
                this.addOutput();
            },
            scope: this
        });

        var actions = [thisButton];

        return mxp.plugins.UserManager.superclass.addActions.apply(this, [actions]);
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

        // create a user manager panel
    	Ext.apply(this.outputConfig, {
            xtype: "msm_usermanager",
            iconCls: "open_usermanager",
            title: this.buttonText,
            id: this.target.userMamanagerId,
            ASSET: this.target.config.ASSET,
            auth: login.login.getToken(),
            login: login.login,
            searchUrl: this.target.geoSearchUsersUrl,
            url: this.target.geoBaseUsersUrl,
            geoStoreBase: this.target.config.geoStoreBase,
            renderMapToTab: this.outputTarget
    	});

        // In user information the output is generated in the component and we can't check the item.initialConfig.
        if(this.output.length > 0
            && this.outputTarget){
            for(var i = 0; i < this.output.length; i++){
                if(this.output[i].ownerCt
                    && this.output[i].ownerCt.xtype 
                    && this.output[i].ownerCt.xtype == "tabpanel"
                    && !this.output[i].isDestroyed){
                    var outputConfig = config || this.outputConfig;
                    // Not duplicate tabs
                    for(var index = 0; index < this.output[i].ownerCt.items.items.length; index++){
                        var item = this.output[i].ownerCt.items.items[index];
                        // only check iconCls
                        var isCurrentItem = "open_usermanager" == item.initialConfig["iconCls"];
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    } 
                }
            }
        }

        return mxp.plugins.UserManager.superclass.addOutput.apply(this, arguments);
    }
});

Ext.preg(mxp.plugins.UserManager.prototype.ptype, mxp.plugins.UserManager);