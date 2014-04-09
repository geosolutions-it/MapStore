/*
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
 * Class: MSMPagingToolbar 
 * Extends the functionality of the paging toolbar.
 * Add the buttons Expand All and Collapse All to open, or Close all Row Expander grid.
 * Add button "New Map" to create a new map to add it to geostore
 * 
 * Inherits from: 
 * - <Ext.PagingToolbar>
 * 
 * See also:
 * - <MSMGridPanel>
 *
 */

MSMPagingToolbar = Ext.extend(Ext.PagingToolbar, {
    /**
     * Property: config
     * {object} object for configuring the component. See <config.js>
     *
     */
    config:null,
    /**
     * Property: autoWidth
     * 
     *
     */
    autoWidth:true,
    /**
     * Property: desc
     * {string} Title of the new map
     *
     */
    desc: 'New Map',
    /**
    * Property: mapUrl
    * {url} url to MapComposer
    * 
    */    
    mcUrl: null,
    /**
    * Property: limit
    * {integer} limit param for the first page load
    * 
    */    
    pageSize: 5,
    /**
    * Property: textNewMap
    * {string} text for New Map button
    * 
    */  
    textNewMap: "New Map",
    /**
    * Property: tooltipNewMap
    * {string} text for New Map tooltip
    * 
    */  
    tooltipNewMap: "Create New Map",

    /**
    * Property: textUserManager
    * {string} text for User Manager button
    * 
    */  
    textUserManager: "User Manager",
    /**
    * Property: tooltipNewMap
    * {string} text for New Map tooltip
    * 
    */  
    tooltipUserManager: "Open User Manager",

    /**
    * Property: textExpandAll
    * {string} text for Expand All button
    * 
    */  
    textExpandAll: "Expand All",
    /**
    * Property: tooltipExpandAll
    * {string} text for Collapse All tooltip
    * 
    */  
    tooltipExpandAll: "Expand All records",
    /**
    * Property: textCollapseAll
    * {string} text for Collapse All button
    * 
    */  
    textCollapseAll: "Collapse All",
    /**
    * Property: tooltipCollapseAll
    * {string} text for Collapse All tooltip
    * 
    */  
    tooltipCollapseAll: "Collapse All records",
    /**
    * Property: displayMsg
    * {string} string to add in displayMsg of Ext.PagingToolbar
    * 
    */
    displayMsg: 'Displaying results {0} - {1} of {2}',
    /**
    * Property: emptyMsg
    * {string} string to add in emptyMsg of Ext.PagingToolbar
    * 
    */    
    emptyMsg: "No results to display",
    /**
    * Property: firstText
    * {string} go to the first page of grid
    * 
    */  
    firstText: "First Page",
    /**
    * Property: lastText
    * {string} go to the last page of grid
    * 
    */  
    lastText: "Last Page",
    /**
    * Property: nextText
    * {string} go to the next page of grid
    * 
    */  
    nextText: "Next Page",
    /**
    * Property: prevText
    * {string} go to the previous page of grid
    * 
    */  
    prevText: "Previous Page",
    /**
    * Property: refreshText
    * {string} refresh the content of grid
    * 
    */  
    refreshText: "Refresh",
    /**
    * Property: beforePageText
    * {string} The text displayed before the input item (defaults to 'Page')
    * 
    */
    beforePageText: 'Page',
   /**
    * Property: afterPageText
    * {string} Customizable piece of the default paging text (defaults to 'of {0}')
    * 
    */
	afterPageText : "of {0}",
	
	/**
    * Property: resizerText
    * {string} text for the maps per page combo
    * 
    */
	resizerText: "Maps per page",

    
    /**
    * Property: templatesCategoriesUrl
    * {string} URL for the templates combo
    * 
    */
    templatesCategoriesUrl: null,
    
    /**
    * Property: addMapControls
    * {boolean} add create map and paging for maps grid.
    * Default it's true
    * 
    */
    addMapControls: true,

    /** i18n **/
    createMapText: "Create",
    createMapTitleText: "Create a new map",
    templateSeleccionErrorText: "Please select a template before create the map",
    templateText: "Template",
    
    /**
    * Property: checkTemplateId
    * {boolean} Check if you must select a template id. Default it's false.
    * 
    */
    checkTemplateId: false,
	
    /**
     * Method: initComponent
     * Initializes the component
     * 
     */
    initComponent : function() {
        
        // Check if the parameter mcUrl is configured. See <config.js>
        if (config.mcUrl) {
            this.mcUrl = config.mcUrl;
        }
        
        // Variables used to set the parameters for the creation of a new map
        var userProfile = '&auth=true';
        var idMap = -1;
        
        MSMPagingToolbar.superclass.initComponent.call(this, arguments);

        // only for maps grid
        if(this.addMapControls){
            //add openMapComposer button
            this.openMapComposer = this.addButton({
                id: 'id_openMapComposer_button',
                text: this.textNewMap,
                scope: this,
                disabled: true,
                iconCls: 'map_add',
                tooltip: this.tooltipNewMap,
                handler: this.onAddMap
            });   
        }
        
        //add expandAll buttons    
        this.expandAll = this.addButton({
            id: 'id_expandAll_button',
            text: this.textExpandAll,
            scope: this,
            iconCls: 'row_expand',
            tooltip: this.tooltipExpandAll,
            handler: function(){
                this.grid.plugins.expandAll();
            }
        });
        
        //add collapseAll buttons    
        this.collapseAll = this.addButton({
            id: 'id_collapseAll_button',
            text: this.textCollapseAll,
            scope: this,
            iconCls: 'row_collapse',
            tooltip: this.tooltipCollapseAll,
            handler: function(){
                 this.grid.plugins.collapseAll();
            }
        });
		
		this.plugins = (this.plugins || []);

        // only for maps grid
        if(this.addMapControls){
    		this.plugins.push(new Ext.ux.plugin.PagingToolbarResizer( {
    			options : [ 10, 20, 50, 100 ],
    			displayText: this.resizerText
    		}));
        }
    },

    onAddMap: function(){
        var userProfile = '&auth=' + (this.grid.auth ? encodeURI(this.grid.auth) : "false");
        var idMap = -1;
        var me = this;
        
        var win = new Ext.Window({
            title: this.createMapTitleText,
            width: 415,
            resizable: false,
            items: [
                new Ext.form.FormPanel({
                    width: 400,
                    ref: "formPanel",
                    items: [{
                        xtype: "msm_templatecombobox",
                        ref: "templateCombo",
                        name: "templateId",
                        templatesCategoriesUrl: this.templatesCategoriesUrl,
                        auth: this.auth
                    }]
                })
            ],
            bbar: new Ext.Toolbar({
                items:[
                    '->',
                    {
                        text: this.createMapText,
                        iconCls: "map_add",
                        scope: this,
                        handler: function(){      
                            var templateId = win.formPanel.templateCombo.getValue();

                            if(!this.checkTemplateId || (this.checkTemplateId && templateId)){
                                win.hide(); 
        
                                this.grid.plugins.openMapComposer(this.grid.murl, userProfile, idMap, this.desc, templateId);
                                
                                win.destroy(); 
                            }else{
                                Ext.Msg.show({
                                       title: "Error",
                                       msg: me.templateSeleccionErrorText,
                                       buttons: Ext.Msg.OK,
                                       icon: Ext.MessageBox.ERROR
                                    });   
                            }
                        }
                    }
                ]
            })
        });
        
        win.show();
        
        // this.grid.plugins.openMapComposer(this.grid.murl,userProfile,idMap,this.desc);
    }
});