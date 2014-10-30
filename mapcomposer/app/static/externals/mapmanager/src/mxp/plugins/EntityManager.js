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
 *  class = Tool
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: EntityManager(config)
 *
 *    Open a plugin to interact OpenSDIManager ReST services to manage entities with basic CRUD operations
 *    
 */
mxp.plugins.EntityManager = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_geostore_category_manager */
    ptype: "mxp_entity_manger",
    
    buttonText: "Entities",

    loginManager: null,    
    setActiveOnOutput: true,
    category:"MAP",
    /**
     * icon for the plugin
     */
    iconCls: 'resource_edit',


    
    /** api: method[addActions]
     */
    addActions: function() {
        this.adminUrl = this.adminUrl || this.target.adminUrl;
        var thisButton = new Ext.Button({
            iconCls: this.iconCls, 
            text: this.buttonText,
            tooltip: this.tooltipText,
            handler: function() { 
                this.addOutput(); 

               
            },
            scope: this
        });

        var actions = [thisButton];

        return mxp.plugins.EntityManager.superclass.addActions.apply(this, [actions]);
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
        this.auth = this.target.auth;
        
        this.outputConfig = this.outputConfig || {};

        var adminUrl = this.adminUrl || this.target.adminUrl
            
        var me = this;
        
       
        Ext.apply(this.outputConfig,{
            xtype:'json_entity_rest_manager',
            iconCls: this.iconCls,
            geoStoreBase:this.target.config.geoStoreBase,
            auth:this.auth,
            baseUrl: this.adminUrl,
            entities:this.entities,
            layout: 'border',
            itemId:'EntityManager',
            autoDestroy:true,
            closable: true,
            closeAction: 'close',
            header: false,
            deferredReneder:false,
            viewConfig: {
                forceFit: true
            },
            title: this.buttonText
            
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
                        var isCurrentItem = "EntityManager" == item.initialConfig["itemId"];
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    } 
                }
            }
        }
         
        return mxp.plugins.EntityManager.superclass.addOutput.apply(this, arguments);
    }
    
});

Ext.preg(mxp.plugins.EntityManager.prototype.ptype, mxp.plugins.EntityManager);

