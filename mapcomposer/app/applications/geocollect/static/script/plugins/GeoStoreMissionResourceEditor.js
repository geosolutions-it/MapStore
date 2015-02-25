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
 *  .. class:: GeostoreMissionResourceEditor(config)
 *
 *    Open a plugin to interact with GeoStore for editing Resources of a category 
 *    
 */
mxp.plugins.GeostoreMissionResourceEditor = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_geostore_mission_resource_edito */
    ptype: "mxp_geostore_mission_resource_editor",
    
    buttonText: "Mission Configuration",
    outputItemId: "MissionResourceEditor",

    loginManager: null,    
    setActiveOnOutput: true,
    category:"MAP",
    /**
     * icon for the plugin
     */
    iconCls: 'mission_resource_edit',

    
    /** api: method[addActions]
     */
    addActions: function() {
        
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

        return mxp.plugins.GeostoreMissionResourceEditor.superclass.addActions.apply(this, [actions]);
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

        var uploadUrl = this.uploadUrl ? this.uploadUrl : // the upload URL is configured in th plugin
            this.target.adminUrl ? this.target.adminUrl + "mvc/fileManager/upload" : // use relative path from adminUrl
            "/opensdi2-manager/mvc/fileManager/upload"; // by default search on root opensdi-manager2
            
        var me = this;
        
       
        this.outputConfig = Ext.apply(this.outputConfig,{
            xtype:'geostore_category_manger',
            category:this.category,
            tpl : this.tpl,
            attributeFields:this.attributeFields,
            iconCls: this.iconCls,
            geoStoreBase:this.target.config.geoStoreBase,
            auth:this.auth,
            layout: 'border',
            itemId: this.outputItemId,
            closable: true,
            closeAction: 'close',
            header: false,
            deferredReneder:false,
            resourceEditor:this.resourceEditor,
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
                        var isCurrentItem = this.outputItemId == item.initialConfig["itemId"];
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    } 
                }
            }
        }
         
        return mxp.plugins.GeostoreMissionResourceEditor.superclass.addOutput.apply(this, arguments);
    }
    
});

Ext.preg(mxp.plugins.GeostoreMissionResourceEditor.prototype.ptype, mxp.plugins.GeostoreMissionResourceEditor);

