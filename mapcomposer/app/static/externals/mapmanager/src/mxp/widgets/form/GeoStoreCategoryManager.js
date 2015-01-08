/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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

Ext.ns("mxp.widgets");

/**
 * Generic Category Manager for GeoStore
 *
 *
 */
mxp.widgets.GeoStoreCategoryManager = Ext.extend(Ext.Panel, {
     /** api: xtype = mxp_geostore_category_manger */
    xtype: "geostore_category_manger",
    loginManager: null,
    setActiveOnOutput: true,
    /**
     * i18n
     */
    resourceListTitle: "Resources",
    emptyMessage: 'No resource to display',
    displayMessage: 'Displaying {0} - {1} of {2}',
    /** api: config[category]
     *  ``String``
     *  The category to browse
     */
    category: "MAP",
    /** api: config[leftPanelWidth] 
     *  ``String``
     *  Width of the category list
     */
    leftPanelWidth: 430,
    /** api: config[generalPanelHeight] generalPanelHeight
     *  ``integer``
     *  size of the panel of general
     */
    
    /** api: config[iconCls]
     *  ``String``
     *  Icon for the tool
     */
    iconCls: null,
    pageSize:10,
    defaultTpl : [
        '<tpl for=".">',
            '<div style="border-bottom:1px solid lightgray;margin: 2px">',
                '<div class="dataview" style="min-height:40px">',
                    '<div float="right" style="text-align: right;color: gray;font-size: 15px;float: right;">Creation:{creation}<br>Last Update:{lastUpdate}</div>',
                    '<div style="font-weight:bold;">{name}</div>',
                    '<div>{[Ext.util.Format.ellipsis(values.description,25,false)]}</div>',
                '</div>',
            '</div>',
        '</tpl>'],
	titleConfirmDeleteMsg: "Confirm delete resource",
    textConfirmDeleteMsg: "Are you sure you want to delete this resource?",
    initComponent: function() {
        var me = this;

        var store = new MapStore.data.GeoStoreStore({
            autoload: true,
            categoryName: this.category,
            geoStoreBase: this.geoStoreBase,
            pageSize:this.pageSize,
            auth: this.auth,
            listeners: {
                scope: this,
                load: function() {
                    //restore last selected
                    if(this.lastSelected) {
                         var newrec = me.store.getById(this.lastSelected);
                         if(newrec) {
                            this.dataView.select(newrec);
                        } else {
                            this.dataView.clearSelections();

                        }

                    }
                }
            }
        });
        this.store = store;
        var left =  new Ext.DataView({
            border: false,
            ref: 'dataView',
            cls: 'chooser-view',
            store: store,
            tpl: this.tpl || this.defaultTpl,
            autoHeight: true,
            multiSelect: true,
            overClass: 'x-view-over',
            itemSelector: 'div.dataview',
            emptyText: this.emptyMessage,
            listeners: {
                scope: this,
                // load record in the editor
                selectionchange: function(dv,selection) {
                    if(selection.length > 0) {
                        dv.refOwner.deleteButton.setDisabled(false);
                        var records = dv.getSelectedRecords();
                        if(records && records.length == 1) {
                            //setup delete button
                            var record = records[0];
                            dv.refOwner.deleteButton.setDisabled(!record.get("canDelete"));
                            this.loadEditor(record);
                            return true;
                        }
                    } else {
                        //disable delete
                        dv.refOwner.deleteButton.setDisabled(true);
                    }

                }
            }

        });
        var leftPanel = {
            xtype: 'panel',
            region: 'west',
            iconCls: this.iconCls,
            title: this.resourceListTitle,
            autoScroll: true,
            layout: 'fit',
            border: false,
            width: this.leftPanelWidth,
            ref: 'leftPanel',
            collapsible: true,
            items: left,
            tbar: [{
                xtype: 'button',
                iconCls: 'add',
                text: this.createText,
                ref: '../addButton',
                scope: this,
                //create a new editor
                handler: function() {
                    this.loadEditor(null, this.category);
                }
            }, {
                xtype: 'button',
                iconCls: 'delete',
                text: this.deleteText,
                ref: '../deleteButton',
                disabled: true,
                scope: this,
                //create a new editor
                handler: function(b) {
        			Ext.Msg.confirm(
                                        this.titleConfirmDeleteMsg,
                                        this.textConfirmDeleteMsg,
                                        function(btn) {
                                            if(btn=='yes') {    //insert category in the recordType
                    var dataView = b.refOwner.dataView;
                    var selection = dataView.getSelectedNodes();
                    if(selection.length > 0) {
                        var records = dataView.getSelectedRecords();
                        if(records && records.length == 1) {
                            this.deleteResource(records[0].get('id'));
                        }
                    }
                                            }									
                                        },this);

                }
            }],
            bbar: new Ext.PagingToolbar({
                pageSize: this.pageSize,
                store: store,
                displayInfo: false,
                displayMsg: this.displayMessage,
                emptyMsg: this.emptyMessage
            })

        };

        //The editor panel
        this.editor = new Ext.Panel({
            autoWidth: false,
            xtype: 'panel',
            layout: 'fit',
            autoScroll: true,
            region: 'center',
            ref: 'editor'
        });
        this.dataView = left;
        this.items = [this.editor, leftPanel];


        mxp.widgets.GeoStoreCategoryManager.superclass.initComponent.call(this, arguments);
    },

    /**
     * Load a resource in the editor
     */
    loadEditor: function(values, cat) {
        var category = cat;
        if(values) {
            category = values.get('category');
        }
        var editor = this.editor;
        //TODO check if dirty
        editor.removeAll();
        editor.add({
            xtype: 'mxp_geostoreresourceform',
            layout: 'fit',
            ref: 'resourceform',
            border: false,
            category: category,
            geoStoreBase: this.geoStoreBase,
            resourceEditor: this.resourceEditor,
            attributeFields: this.attributeFields,
            generalPanelHeight: this.generalPanelHeight,
            hideId:this.hideId,
            auth: this.auth
        });
        editor.doLayout();
        var me = this;
        editor.resourceform.on("save", function(id) {
            //disable Delete
            //this.dataView.refOwner.deleteButton.setDisabled(false);
            //get selected
            me.lastSelected = id;

            //reload list
            me.store.reload();

        });
        editor.resourceform.on("delete", function() {
            me.store.reload();
            me.loadEditor(null, me.category);
        });
        editor.resourceform.loadResource(values);
    },
    deleteResource: function(id) {
        if(this.editor.resourceform) {
            this.editor.resourceform.deleteResource(id);
        }
    }
});
Ext.reg(mxp.widgets.GeoStoreCategoryManager.prototype.xtype, mxp.widgets.GeoStoreCategoryManager);
