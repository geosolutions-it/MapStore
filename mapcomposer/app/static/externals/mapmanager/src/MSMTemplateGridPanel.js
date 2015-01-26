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
 * Class: MSMTemplateGridPanel
 * Template panel that includes the templates grid.
 * 
 * Inherits from:
 *  - <Ext.Panel>
 *
 */
MSMTemplateGridPanel = Ext.extend(Ext.grid.GridPanel, {

 	/** xtype = msm_templategrid **/
	xtype: "msm_templategrid",

	/** i18n **/
	textId: "Id",
	textName: "Name",
	textOwner: "Owner",
	textCreation: "Date Creation",
	textLastUpdate: "Last Update", 
    tooltipSearch: "Type a name to search",
    textReset: "Reset",
    tooltipReset: "Clean search",
    failSuccessTitle: "Error",
    resizerText: "Templates per page",
    tooltipDelete: "Delete template",
	deleteTemplateTitleText: "Attention",
	deleteTemplateBodyText: "Do you want to delete this template?",
    /** EoF i18n **/
            
    /**
	 * Property: pageSize
	 * {int} templates grid page size
	 * 
	 */			
	pageSize: 50,
 
    /**
     * Property: expandCollapseOnTopBar
     * {boolean} Include row expander and collapser buttons on top bar (otherwise it will be added at bottom bar)
     * 
     */
    expandCollapseOnTopBar: true,

	// layout config
	// layout:'fit',
	// defaults: {
	//     split: true,
	//     bodyStyle: 'padding:15px'
	// },

	// specific config
    categoryName: "TEMPLATE",
	currentFilter: "",
	auth: null,
    autoExpandColumn:'name',
    /**
    * Constructor: initComponent 
    * Initializes the component
    * 
    */
    initComponent : function() {
    	var me = this;

		this.addEvents('delete_template');
		
    	// search box
    	var searchField = new Ext.form.TextField({
			name: "templateSearch"
		});
		this.searchField = searchField;
			
		 // search button
	    var searchButton =  {
            tooltip: this.tooltipSearch,
            iconCls: 'find',
            disabled: false,
            handler: function() {  
                this.searchTemplate();		     				
            },
            scope: this
		};
	            
		// reset search button
		var resetSearchButton =  {
			text: this.textReset,
			tooltip: this.tooltipReset,
			iconCls: 'reset',
			disabled: false,
			handler : function() {
				this.searchField.setValue('');
                this.searchTemplate();	                 
			},
            scope: this
		};

    	// data store
		var store = new Ext.data.JsonStore({
            autoDestroy: true,
            autoLoad: true,
            root: 'results',
            totalProperty: 'totalCount',
            successProperty: 'success',
            idProperty: 'id',
            remoteSort: false,
            fields: ['id', 'name', 'owner', 'creation', 'lastUpdate', 'description'],
            proxy: new Ext.data.HttpProxy({
                url: this.getSearchUrl(),
                restful: true,
                method : 'GET',
                disableCaching: true,
                failure: function (response) {
                      Ext.Msg.show({
                       title: me.failSuccessTitle,
                       msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                    });                                
                },
                headers: {'Accept': 'application/json', 'Authorization' : this.auth}
            }),
            
            sortInfo: { field: "name", direction: "ASC" }
		 });

		var expander = new Ext.ux.grid.RowExpander({
            /**
            * Property: scope
            * {object} set the scope
            * 
            */
            scope: this,

            enableCaching:false,
            
            /**
             * Private: expandAll all rows of the grid
             * 
             */
            expandAll : function() {
                for (var i = 0; i < this.grid.store.getCount(); i++) {
                    this.expandRow(i);
                }
            },
            
            /**
             * Private: Collapse all rows of the grid
             * 
             */
            collapseAll : function() {
                for (var i = 0; i < this.grid.store.getCount(); i++) {
                    this.collapseRow(i);
                }
            },
            listeners: {
                 scope: this,
                 expand: function(rowExpander, record, content){

                 	var deleteButton = Ext.get(record.id + "_deleteBtn");
                 	var me = this;

                 	deleteButton.on('click', function(e){
                            var id = record.id;
                            Ext.Msg.confirm(me.deleteTemplateTitleText, me.deleteTemplateBodyText, function(btn,text){
                                if (btn == 'yes'){
									// //////////////////////////////////
									// Get info about logged user if any
									// //////////////////////////////////
									var auth = me.login.getToken();
									
									// ////////////////////
									// Fetch base url
									// ////////////////////
									var url =  me.geoBaseMapsUrl; 

									// ///////////////////////////
									// Get the api for GeoStore
									// ///////////////////////////
									var geostore = new GeoStore.Templates({ 
										authorization: auth,
										url: url
									});
									
									geostore.failure( 
										function(response){ 
											console.error(response); 
											Ext.MessageBox.alert(grid.msgFailureDeleteMapTitle, grid.msgFailureDeleteMapBody);	
										}
									);
									
									geostore.deleteByPk(id, function(response){
										me.searchTemplate();
										me.fireEvent("delete_template", response);
									});
									
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        });
                }                
            },
            tpl: new Ext.XTemplate( 
                this.createTemplate(this.murl, this.lang), {
                   /**
                    * Private: getButtonDMId
                    * 
                    * values - {array} fields of the column grid
                    * button - {string} name button
                    * 
                    */
                    getButtonDMId: function(values,button) {
                        return values.id + button;
                    }
			})
		});

        // the top bar of the template grid
        var topBar = [searchField, searchButton, resetSearchButton];

        // bbar as paging
        var pagingBbar = new MSMPagingToolbar({
            pageSize : this.pageSize,
            store : store,
            grid: this,
            addMapControls: false,
            addExpandCollapseControls: !this.expandCollapseOnTopBar,
            displayInfo: true,
            plugins: [
                new Ext.ux.plugin.PagingToolbarResizer( {
                    options : [5, 10, 20, 50, 100],
                    displayText: this.resizerText
                })
            ]
        });

        // row expander/collapser on top
        if(this.expandCollapseOnTopBar){
            topBar.push("->");
            topBar.push({
                text: pagingBbar.textExpandAll,
                tooltip: pagingBbar.tooltipExpandAll,
                iconCls: 'row_expand',
                disabled: false,
                handler : function() {
                    expander.expandAll();               
                },
                scope: this
            });
            topBar.push({
                text: pagingBbar.textCollapseAll,
                tooltip: pagingBbar.tooltipCollapseAll,
                iconCls: 'row_collapse',
                disabled: false,
                handler : function() {
                    expander.collapseAll();
                },
                scope: this
            });
        }

		Ext.apply(this, {
			store: store,
			cm: new Ext.grid.ColumnModel({
				columns: [ expander,
	        	/*{
	            	id       :'id',
	            	header   : this.textId, 
	            	sortable : true, 
	            	dataIndex: 'id'
	        	},*/
		        {
		            id       :'name',
		            header   : this.textName, 
		            sortable : true, 
		            dataIndex: 'name'
		        },
		        /*{
		            header   : this.textOwner, 
		            sortable : true, 
		            dataIndex: 'owner'
		        },*/
		        {
		            header   : this.textCreation, 
		            sortable : true,
                    width: 135,
		            dataIndex: 'creation'
		        },
		        {
		            header   : this.textLastUpdate, 
		            sortable : true, 
                    width: 135,
		            dataIndex: 'lastUpdate'
		        }
		    ]}),		
			// the top bar of the template grid
			tbar: topBar,
            // bbar as paging
            bbar: pagingBbar,
        	plugins: expander          
        });
		
        MSMTemplateGridPanel.superclass.initComponent.call(this, arguments);
    },

	createTemplate: function(murl, lang){
		var tpl = 
			'<div style="background-color: #f9f9f9; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;<b>Description:</b> {description}<br/>'+

            '<table class="x-btn x-btn-text-icon" align="right" cellspacing="5" cellpadding="5" border="0" style="table-layout:auto">'+
                '<tr>';
		// /////////////////////////////////////////////////////
		// In IE7 we need to set button property "padding" and 
		// table width otherwise buttons are stretched			
		// /////////////////////////////////////////////////////
        tpl +=  '<td >'+
                    '<td >'+
                        '<table class="x-btn x-btn-text-icon"  style="width:30px" cellspacing="0"  >' +
                        '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonDMId(values,\'_deleteBtn\')]}\'>' +
                        '<tr>'+
                        '<td class="x-btn-tl">' +
                        '<i>&nbsp;</i>' +
                        '</td>' +
                        '<td class="x-btn-tc"></td>' +
                        '<td class="x-btn-tr">' +
                        '<i>&nbsp;</i>' +
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="x-btn-ml">' +
                        '<i>&nbsp;</i>' +
                        '</td>' +
                        '<td class="x-btn-mc">' +
                        '<em unselectable="on" class="">'+
                        '<button type="button" style="background-position:center;padding:10px;"  class=" x-btn delete" title="' + this.tooltipDelete + '" ></button></em>'+
                        '</td>'+
                        '<td class="x-btn-mr">'+
                        '<i>&nbsp;</i>'+
                        '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="x-btn-bl">' +
                        '<i>&nbsp;</i>' +
                        '</td>' +
                        '<td class="x-btn-bc"></td>' +
                        '<td class="x-btn-br">' +
                        '<i>&nbsp;</i>' +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                    '</td>';
	                    
              tpl +=  '</tr>'+
            '</table>'+
        '</div>';
		
		tpl +=  '</tr></table></div><br/>';
        
		return tpl;
	},

    /**
     *  api:method[searchTemplate]
     **/
    searchTemplate: function(){  
        var keyword = this.searchField.getValue();
        
        if ( !keyword || keyword==='' ){
            this.currentFilter = '*';                    
        } else {
            this.currentFilter = '*'+keyword+'*';                                        
        }
        var store = this.store;

        store.proxy.api.read.url = this.getSearchUrl();
        store.load({
			params:{
				start:0,
				limit:this.pageSize
			}
		});
    },
            
    getSearchUrl: function() {
        return this.searchUrl + '/' + this.categoryName + '/' + this.currentFilter;
    },

    // refresh grid 
    refresh: function(){
        this.store.load();
    }
});

/** api: xtype = msm_templategrid */
Ext.reg(MSMTemplateGridPanel.prototype.xtype, MSMTemplateGridPanel);