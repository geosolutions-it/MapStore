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
 *  class = GWCGrid
 *  
 */
Ext.ns('mxp.widgets');

/**
 * Class: GWCGrid
 * Grid panel that shows gwc layers.
 * Allows also to truncate layers.
 * 
 * GWC REST API used (integration geoserver/geowebcache from GeoServer version 2.4.5
 * because of this issue https://jira.codehaus.org/browse/GEOS-6262) 
 * GET <GWC_REST_URL>layers the list of cached layers
 * GET <GWC_REST_URL>layers/<LAYERNAME>.xml info about a layer (not stable, don't use it for now)
 * POST <GWC_REST_URL>masstruncate truncate a layer's cache placing in the POST body the xml: <truncateLayer><layerName><<LAYER_NAME>></layerName></truncateLayer> 
 *
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 *
 */
 //FIX FOR IE10 and responseXML TODO: port this as a global fix

Ext.data.ie10XmlReader  = Ext.extend(Ext.data.XmlReader, {
    read : function(response){
                var data = response.responseXML;
                if(!data || !data.documentElement) {
                    if(window.ActiveXObject) {
                        var doc = new ActiveXObject("Microsoft.XMLDOM");
                        if(doc.loadXML(response.responseText)){
                            data = doc;
                        }
                    }
                }
                return this.readRecords(data);
            }
});
mxp.widgets.GWCGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: xtype = mxp_gwc_grid */
    xtype: "mxp_gwc_grid",
    
    /**
     * configuration: the final url for the consumers will be <GWCRestURL>/layers.xml
     */
    GWCRestURL: 'http://localhost:8080/geoserver/gwc/rest/',
    /* i18n */
    refreshText:'Refresh',
    autoload:true,
    tooltipDelete: 'Clear chache for this layer',
    tooltipLog: 'Check Info',
    autoExpandColumn: 'name',
    clearFinishedText: 'Clear Finished',
    loadingMessage: 'Loading...',
    textConfirmDeleteMsg: 'Do you confirm you want to empty the tile cache for layer {name} ?',
    errorTruncateText:'The selected layer is already empty or an error occurred during deletion',
    /* end of i18n */
    loadMask:true,
   
    initComponent : function() {
        var me = this;
        // create the Data Store
        this.store = new Ext.data.Store({
            autoLoad: this.autoload,
            // load using HTTP
            url: this.GWCRestURL + 'layers',
            reader:  new Ext.data.ie10XmlReader({
                record: 'layer',
                idPath: 'name',
                fields: [{name: 'id', mapping: 'name'},{name: 'name', mapping: 'name'}]
            }),
            scope:this,
            headers: {Authorization:this.auth},
            listeners:{
                beforeload: function(a,b,c){
                    a.proxy.conn.headers = a.proxy.conn.headers ? a.proxy.conn.headers : {};
                    if( a.proxy.conn.headers ){
                        if(me.auth){
                            a.proxy.conn.headers['Authorization'] = me.auth;
                        }
                        a.proxy.conn.headers['Accept'] = 'application/xml';
                    }else{
                        a.proxy.conn.headers = {'Accept': 'application/xml'};
                        if(me.auth){
                            a.proxy.conn.headers['Authorization'] = me.auth;
                        }
                    }
                   
                }
            },
            sortInfo: {
                field: 'name',
                direction: 'ASC' 
            }
        });
        
        this.tbar = [{
                iconCls:'refresh_ic',
                xtype:'button',
                text:this.refreshText,
                scope:this,
                handler:function(){
                    this.store.load();
                }
            }
        ];
        
        this.columns= [
            {id: 'name', header: "layer", width: 220, dataIndex: 'name', sortable: true},

            {
                    xtype:'actioncolumn',
                    width: 35,
                    items:[{
                        iconCls:'broom_ic',
                        width:25,
                        tooltip: this.tooltipDelete,
                        handler: this.confirmCleanRow,
                        scope:this,
                        getClass: function(v, meta, rec) {
                            return 'x-grid-center-icon action_column_btn';
                        }
                    }]
            }
        ],
        mxp.widgets.GWCGrid.superclass.initComponent.call(this, arguments);
    },
    /**
     *    private: method[confirmCleanRow] show the confirm message to remove a layer's cache
     *      * grid : the grid
     *      * rowIndex: the index of the row 
     *      * colIndex: the actioncolumn index
     */
    confirmCleanRow: function(grid, rowIndex, colIndex){
         var record =  grid.getStore().getAt(rowIndex);
         var name = record.get('name');
         var me = this;
         var loadMask = new Ext.LoadMask(Ext.getBody(), {msg:me.loadingMessage});
         var errorCallback = function(response, form, action) {
            Ext.Msg.show({
               msg: this.errorTruncateText,
               buttons: Ext.Msg.OK,
               icon: Ext.MessageBox.WARNING //an error occours also if the cache is already empty
            });
            this.store.load();
            loadMask.hide();
        };
        var successCallback = function(response, form, action) {
            this.store.load();
            loadMask.hide();
        };
        Ext.Msg.confirm(
            this.titleConfirmDeleteMsg,
            this.textConfirmDeleteMsg.replace('{name}',name),
            function(btn) {
                if(btn=='yes') {
                    me.truncateLayer(name,successCallback,errorCallback,me);
                    loadMask.show();
                    
                }
            });
    },
    /**
     *    private: method[truncateLayer] truncate all the layer cache
     *      * name : the name of the layer to truncate
     *      * successCallback: function to call in case of success 
     *      * errorCallback: function to call in case of error
     *      * scope: the scope of the callbacks (optional)
     */
    truncateLayer: function(name,successCallback,errorCallback,scope){
        
        var url = this.GWCRestURL + "masstruncate"
        Ext.Ajax.request({
            method: 'POST',
            url: url,
            params:'<truncateLayer><layerName>'+name+'</layerName></truncateLayer>',
            headers: {
                'Authorization' : this.auth,
                'Content-type': 'text/xml'
            },
            scope: scope || this,
            success: successCallback,
            failure: errorCallback
        });
        
    }
    
    
});

/** api: xtype = mxp_gwc_grid */
Ext.reg(mxp.widgets.GWCGrid.prototype.xtype, mxp.widgets.GWCGrid);
