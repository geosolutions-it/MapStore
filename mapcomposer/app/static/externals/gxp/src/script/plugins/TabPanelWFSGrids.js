/**
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
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = TabPanelWFSGrids
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: TabPanelWFSGrids(config)
 *
 *    WFS interface to show data in a Ext.Grid
 */   
gxp.plugins.TabPanelWFSGrids = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_featuregrid */
    ptype: "gxp_tabpanelwfsgrids",
    
    /** api: config[featureType]
     *  ``String``
     */
    featureType: null,
    
    /** api: config[wfsURL]
     *  ``String``
     */
    wfsURL: null,
    
    /** api: config[id]
     *  ``String``
     */
    id: "featuregrid",
    
    /** api: config[panels] panels configuration object
     *  ``Object``
     */
    panels: {},
    
    /** api: config[currentPanel] currentPanel configuration object
     *  ``Object``
     */
    currentPanel: '',
          
    zoomToIconPath: "theme/app/img/silk/map_magnify.png",
    
    zoomToTooltip: 'Zoom all\'elemento',
    
    displayMsgPaging: "Displaying topics {0} - {1} of {2}",
    emptyMsg: "No topics to display",
    loadMsg: "Loading...",
    noRecordFoundLabel: "Nessun elemento trovato",
    noRecordFoundCls: "empty-grid",
        
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.TabPanelWFSGrids.superclass.constructor.apply(this, arguments);         
    },
    
    buildGrid: function(cfg) {
            return new gxp.plugins.WFSGrid(cfg);
    },    
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
   
        this.grids = {};
        var info = {
            currentlyLoading: 0,
            hasData : false
        };
        
        var me = this;
        for(var panelName in this.panels) {
            if(this.panels.hasOwnProperty(panelName)) {
                var panel = this.panels[panelName];
                
                var panelGrids = [];
                
                for(var gridName in panel) {
                    if(panel.hasOwnProperty(gridName)) {
                        var gridCfg = panel[gridName];
                        var title = gridCfg.title || gridName;
                        if(title instanceof Array) {
                            title = title[GeoExt.Lang.getLocaleIndex()];
                        }
                        // build grid
                        var wfsGridConf={
                            "outputTarget": this.id,
                            "title": title,
                            "name": gridCfg.name || '',
                            "type": gridCfg.type || '',
                            "id": gridCfg.id || gridName,
                            "protocolType": "GET",
                            "fields": gridCfg.fields || null,
                            "wfsURL": this.wfsURL,
                            "loadMsg": me.loadMsg,
                            "emptyMsg": me.emptyMsg,
                            "displayMsgPaging": me.displayMsgPaging,
                            "featureType": gridCfg.featureType,
                            "sortAttribute": gridCfg.sortBy,
                            "pageSize": 10/*this.pageSize*/,
                            "srsName": this.srsName, 
                            "version": "1.1.0",
                            "columns" : gridCfg.columns,
                            "actionColumns" : gridCfg.actionColumns || this.actionColumns, //change to set editActionColumn only in roads_edit layer
                            "noPaging": gridCfg.noPaging || false
                        };
                        
                        gridCfg.grid = this.buildGrid(wfsGridConf);
                        
                        Ext.apply(gridCfg.grid, config || {});
                        panelGrids.push(gridCfg.grid);
                    }
              }
              this.grids[panelName] = panelGrids;
           }
        } 
                    
        var me= this;
        var tabPanel = new Ext.TabPanel({
            enableTabScroll: true,
            id: this.id,
            activeTab: 0,
            items: [],
            targets: this.targets,
            layoutOnTabChange: true,
            /** api: method[hideAllBut]
             */    
                        listeners: {
                            "afterrender": function(){
                                
                                
                            }
                        },
            hideAllBut: function(attribute, attributeValue) {
                var gridsLoad  = [];
                var grids = me.grids[me.currentPanel];
                for(var i=0; i<grids.length; i++) {
                   if(attribute) {
                    var value = grids[i][attribute];
                    if(value == attributeValue) {
                        gridsLoad.push(grids[i]);
                    } 
                   } else {
                    
                    gridsLoad.push(grids[i]);
                  } 
                }
                return gridsLoad;
            },
                        
            removeAllGrids: function(){
                var toRemove = [];
                var active = null;
                for(var i=0; i<this.items.items.length;i++){
                    if(this.items.items[i] == this.activeTab) {
                        active = this.items.items[i];
                    } else {
                        toRemove.push(this.items.items[i]);                                   
                    }
                }
                for(i=0; i<toRemove.length;i++){
                    toRemove[i].destroy();
                }
                if(active) {
                    active.destroy();
                }
            },
            
            setCurrentPanel: function(currentPanel) {
                me.currentPanel = currentPanel;
            },
            
            /** api: method[loadGrids]
             */    
            loadGrids: function(attributeName, attributeValue, projection, viewParams, tplData) {
                this.removeAllGrids();
                var grids = this.hideAllBut(attributeName, attributeValue);
                
                                
                if(grids.length === 0) {
                    Ext.Msg.show({
                        title: 'Avviso',
                        msg: me.noRecordFoundLabel,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    this.collapse();
                }    
                var tabPanel = this;
                for(var i=0; i<grids.length;i++){
                    grids[i].target= me.target;
                    grids[i].viewParams= viewParams;
                    grids[i].addOutput({},i === 0);
                    grids[i].tplData = tplData;
                    grids[i].onEmpty=function(grid) {                        
                        // no record found message
                        var noRecordFoundEl = grid.wfsGrid.el.child('.x-grid3-scroller');
                        noRecordFoundEl.addClass(me.noRecordFoundCls);
                        noRecordFoundEl.update(me.noRecordFoundLabel);                        
                    };
                    if(i === 0) {
                        this.setActiveTab(i);
                    }
                }
                
                //this.setActiveTab(0);                               
            },
            
            loadGridsFromJson: function(attributeName, attributeValue, data, tplData) {
                this.removeAllGrids();
                var grids = this.hideAllBut(attributeName, attributeValue);
                
                                
                if(grids.length === 0) {
                    Ext.Msg.show({
                        title: 'Avviso',
                        msg: me.noRecordFoundLabel,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    this.collapse();
                }    
                var tabPanel = this;
                for(var i=0; i<grids.length;i++){
                    grids[i].target= me.target;
                    grids[i].data= data[grids[i].name];
                    grids[i].tplData = tplData;
                    grids[i].addOutput({},i === 0);
                    grids[i].onEmpty=function(grid) {                        
                        // no record found message
                        var noRecordFoundEl = grid.wfsGrid.el.child('.x-grid3-scroller');
                        noRecordFoundEl.addClass(me.noRecordFoundCls);
                        noRecordFoundEl.update(me.noRecordFoundLabel);                        
                    };
                    if(i === 0) {
                        this.setActiveTab(i);
                    }
                }
                
                //this.setActiveTab(0);                               
            }
            
        });

                      
        return gxp.plugins.TabPanelWFSGrids.superclass.addOutput.call(this, tabPanel);        
    }
    
    
});

Ext.preg(gxp.plugins.TabPanelWFSGrids.prototype.ptype, gxp.plugins.TabPanelWFSGrids);
