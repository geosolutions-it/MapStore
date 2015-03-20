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

Ext.namespace('gxp.he');

/**
 * @author Lorenzo Natali
 */

/** api: constructor
 *  .. class:: JSChartsPanel(config)
 *
 *    Chart that renders pipeline statistics
 *
 */
gxp.he.PipelineStatistics = Ext.extend(Ext.Container, {
    url : "http://he.geo-solutions.it/geoserver/gascapacity/ows",
    params:{
        service:"WFS",
        version:"1.0.0",
        request:"GetFeature",
        outputFormat: "application/json"
    },
    generic_typeName:"gascapacity:gcd_v_pipeline_statistics",
    genInfoTemplates:{
        I:[
        '<table style="width:100%">',
          '<tr>',
            '<th>Owner: </th><td>{Owner}</td>',
            '<th>System Capacity:</th><td>{System_Capacity}</td>',
          '</tr>',
          '<tr>',
            '<th>Operator:</th><td>{Operator}</td>',
            '<th>Seasonal Storage:</th><td>{Seasonal_Storage}</td>',
          '</tr>',
          '<tr>',
            '<th>Miles of Pipeline:</th><td>{Miles_of_Pipeline}</td>',
            '<th>Compressor Stations:</th><td>{Compressor_Stations}</td>',
          '</tr>',
        '</table>'],
        S:[
        '<table style="width:100%">',
          '<tr>',
            '<th>Owner: </th><td>{Owner}</td>',
            '<th>Peak njection</th><td>{Peak_Injection}</td>',
          '</tr>',
          '<tr>',
            '<th>Storage Type:</th><td>{Storage_Type}</td>',
            '<th>Peak Withdrawal:</th><td>{Peak_Withdrawal}</td>',
          '</tr>',
          '<tr>',
            '<th>Working Gas Capacity:</th><td>{Working_Gas_Capacity}</td>',
            '<th>Cycles:</th><td>{pops01_StoCycles}</td>',
          '</tr>',
        '</table>']
    },
    fin_layer:'gascapacity:gcd_v_financial_highlights',
    tslayer:'gascapacity:gcd_v_annual_throughput_storage_quantities',
    storagecustomerslayer:'gascapacity:gcd_v_storage_customers',
    transportcustomerslayer:'gascapacity:gcd_v_transport_customers',
    contractexpirationlayer:'gascapacity:gcd_v_contract_expirations',
    /* ptype =  gxp_chartpanel */
    xtype: "he_pipeline_statistics",
    updateDelay: 0,
    deferredRender: false,
    autoScroll: true,
    style:'padding:10px',
    initComponent: function () {
        var transportDataTest = [
           /* ['Conocophillips Co',"FT1",  280],
            ['Conocophillips Co',"FT1",  270],
            ['Conocophillips Co',"FT1",  250], */
            ['Conocophillips Co',"FT1",  250],
            ['Iberdrola Energy Svcs.',"FT1",  240],
            ['Canadian Nat Rsrcs. Ltd',"FT1",  205],
            ['Conocophillips Co',"FT1",  201],
            ['Iberdrola Energy Svcs.',"FT1",  10],
            
            
        ];
        var storageDataTest = [
           /* ['Conocophillips Co',"FT1",  280],
            ['Conocophillips Co',"FT1",  270],
            ['Conocophillips Co',"FT1",  250], */
            ['Company 1',"FT1",  200],
            ['Company 2',"FT1",  100],
            ['Company 3',"FT1",  100],
            ['Company 4',"FT1",  90],
            ['Company 5',"FT1",  50]
            
        ];
        var storeTransport1 = new Ext.data.JsonStore({
            root: 'features',
            messageProperty: 'crs',
            autoLoad: true,
            fields: [
               {name: 'customername', type:'string', mapping:'properties.Customer'},
               {name: 'rate',      type: 'string', mapping: 'properties.Rate'},
               {name: 'capacity',     type: 'float', mapping: 'properties.Transp_Capacity'}
            ],
            sortInfo: {
                field: 'capacity',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            },
            url: this.url,
            limit:5,
            baseParams:{
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.transportcustomerslayer ,
                outputFormat: 'application/json',
                viewParams: 'FERC:'+this.ferc,
                maxFeatures:10,
                startIndex:0,
                sortBy:'Transp_Capacity'
            },
            listeners:{
                load:function(store,rec,opt){
                    var i = 0;
                    store.filterBy(function(rec ){
                        return i++<5
                    });
                }
            }
        });
        var storeTransport2 = new Ext.data.JsonStore({
            root: 'features',
            messageProperty: 'crs',
            autoLoad: true,
            sortInfo: {
                field: 'capacity',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            },
            fields: [
               {name: 'customername', type:'string', mapping:'properties.Customer'},
               {name: 'rate',      type: 'string', mapping: 'properties.Rate'},
               {name: 'capacity',     type: 'float', mapping: 'properties.Transp_Capacity'}
            ],
            limit:5,
            url: this.url,
            baseParams:{
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.transportcustomerslayer ,
                outputFormat: 'application/json',
                viewParams: 'FERC:'+this.ferc,
                maxFeatures:10,
                startIndex:0,
                sortBy:'Transp_Capacity',
                
            },
            listeners:{
                load:function(store,rec,opt){
                    var i = 0;
                    store.filterBy(function(rec){
                        return i++>=5
                    });
                }
            }
        });
        
        
        var storeStorage = new Ext.data.JsonStore({
            root: 'features',
            messageProperty: 'crs',
            autoLoad: true,
            sortInfo: {
                field: 'capacity',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            },
            fields: [
               {name: 'customername', type:'string', mapping:'properties.Customer'},
               {name: 'rate', type: 'string', mapping: 'properties.Rate'},
               {name: 'capacity', type: 'float', mapping: 'properties.Storage_Capacity'}
            ],
            url: this.url,
            baseParams:{
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.storagecustomerslayer ,
                outputFormat: 'application/json',
                viewParams: 'FERC:'+this.ferc
            }
        });
        
        var TSDataTest = [
           /* ['Conocophillips Co',"FT1",  280],
            ['Conocophillips Co',"FT1",  270],
            ['Conocophillips Co',"FT1",  250], */
            [2012, 1809,  200],
            [2011, 1756,  200],
            [2010, 1767,  200],
            [2009, 1728,  200],
            [2008, 1728,  200]
            
        ];
        var storetTS = new Ext.data.JsonStore({
            root: 'features',
            messageProperty: 'crs',
            autoLoad: true,
            sortInfo: {
                field: 'year',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            },
            fields: [
               {name: 'year', type: Ext.data.Types.INT , mapping: 'properties.Year'},
               {name: 'transport', type: Ext.data.Types.INT , mapping: 'properties.Transport_Throughput'},
               {name: 'storage', type: Ext.data.Types.INT , mapping: 'properties.Storage_Quantity'}
            ],
            url: this.url,
            baseParams:{
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.tslayer ,
                outputFormat: 'application/json',
                viewParams: 'FERC:'+this.ferc
            }
        });
         var finDataTest = [
           /* ['Conocophillips Co',"FT1",  280],
            ['Conocophillips Co',"FT1",  270],
            ['Conocophillips Co',"FT1",  250], */
            [2012, 288,  0,288,62],
            [2011, 296,  0,296,65],
            [2010, 286,  0,286,68],
            [2009, 287,  0,287,63]
             
        ];
        /* 
          "pop_tbl_Sect0607_FinancialHL"."pops0607_Year" AS "Year", 
          "pop_tbl_Sect0607_FinancialHL"."pops06_TranspRev" AS "Transport_Rev", 
          "pop_tbl_Sect0607_FinancialHL"."pops06_StorageRev" AS "Storage_Rev", 
          "pop_tbl_Sect0607_FinancialHL"."pops06_TotalOperRev" AS "Total_Op_Rev", 
          "pop_tbl_Sect0607_FinancialHL"."pops06_NetIncome" AS "Net_Income"
          */
        
            
        var storefin = new Ext.data.JsonStore({
            root: 'features',
            messageProperty: 'crs',
            autoLoad: true,
            sortInfo: {
                field: 'year',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            },
            fields: [
               {name: 'year',  type: Ext.data.Types.INT , mapping: 'properties.Year'},
               {name: 'transportrev', type: 'string', mapping: 'properties.Transport_Rev'},
               {name: 'storagerev', type: 'string', mapping: 'properties.Storage_Rev'},
               {name: 'totoprev', type: 'string', mapping: 'properties.Total_Op_Rev'},
               {name: 'netincome', type: 'string', mapping: 'properties.Net_Income'}
            ],
            url: this.url,
            baseParams:{
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.fin_layer ,
                outputFormat: 'application/json',
                viewParams: 'FERC:'+this.ferc
            }
        });
        
        var expirationStorage = new Ext.data.JsonStore({
            root: 'features',
            messageProperty: 'crs',
            autoLoad: true,
            sortInfo: {
                field: 'year',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            },
            fields: [
               {name: 'year', type: Ext.data.Types.INT , mapping: 'properties.Year'},
               {name: 'transport', type: Ext.data.Types.INT , mapping: 'properties.Transport'},
               {name: 'storage', type: Ext.data.Types.INT , mapping: 'properties.Storage'}
            ],
            url: this.url,
            baseParams:{
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.contractexpirationlayer ,
                outputFormat: 'application/json',
                viewParams: 'FERC:'+this.ferc
            }
        });
        //TRANSPORT Customer CAPACITY GRID
         var grid = 
        //ROW 1
        this.items = [{
                
                frame:true,
                xtype:'panel',
                header:true,
                title: 'General Information' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">FERC Code:' + this.ferc + '</i>',
                anchor:'100%',
                items:[{
                    frame:true,
                    height:55,
                    border:false,
                    ref:'../generalInfo',
                    listeners:{
                        scope: this,
                        render: function(panel){
                            var mask = new Ext.LoadMask( panel.getEl() )
                            mask.show();
                            var ferc =this.ferc;
                            var url = this.url;
                            var templates = this.genInfoTemplates;
                            var params = Ext.apply({
                                typeName:this.generic_typeName,
                                cql_filter: "FERC = '"+this.ferc+"'",
                            },this.params);
                            Ext.Ajax.request({
                                url: url,
                                params:params,
                                success: function(response,option){
                                    detailEl = panel;
                                    mask.hide();
                                    var jsonResponse = Ext.util.JSON.decode(response.responseText);
                                    response = jsonResponse.features[0]
                                    //Use the propert template
                                    if(response && response.properties){
                                        var type = response.properties.PipelineOrStorage;
                                        var template =  new Ext.XTemplate(templates[type]);
                                        var ht = template.apply(response.properties);
                                        detailEl.update(ht);
                                        //set up the grids for the pipeline type
                                        if(type == 'S'){
                                            //Hide transport if is a storage company
                                            var tsgrid = panel.refOwner.tsgrid;
                                            tsgrid.getColumnModel().setHidden(1, type == 'S');
                                            var cegrid = panel.refOwner.cegrid;
                                            cegrid.getColumnModel().setHidden(1, type == 'S');
                                        }
                                        
                                    }
                                    
                                },
                                failure:function(){
                                    mask.hide();
                                }
                                
                            });
                        }
                    }
                }]
        //ROW 2
        },{
                layout:'column',
                style:'padding-top:10px',
                header:true,
                title: 'Top 10 Transport Customers' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">Capacity(MDth/d)</i>',
                border:true,
                items:[{
                    columnWidth:.5,
                    layout: 'fit',
                    border:false,
                    items: [{
                        style:'padding:5px',
                        xtype:'panel',
                        layout:'fit',
                        border:false,
                        height:180,
                        items:[new gxp.he.grid.CustomerCapacityGrid({store:storeTransport1,viewConfig: {forceFit: true},loadMask:true})]
                    }]
                },{
                    columnWidth:.5,
                    layout: 'fit',
                    border:false,
                    items: [{
                        style:'padding:5px',
                        xtype:'panel',
                        layout:'fit',
                        border:false,
                        height:180,
                        items:[new gxp.he.grid.CustomerCapacityGrid({store:storeTransport2,viewConfig: {forceFit: true},loadMask:true})]
                        
                    }]
                }]
        //ROW 3
        },{
                xtype: 'container',
                layout:'column',
                style:'padding-top:10px',
                border:false,
                
                items:[{
                    columnWidth:.5,
                    layout: 'fit',
                    xtype: 'container',
                    border:false,
                    // Storage Consumers
                    items: [{
                        style:'padding: 0px  5px 0px 0',
                        xtype:'panel',
                        frame:true,
                        header:true,
                        layout:'fit',
                        title: 'Top 5 Storage Customers' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">Capacity (Bcf)</i>',
                        height:200,
                        items:[new gxp.he.grid.CustomerCapacityGrid({store:storeStorage,viewConfig: {forceFit: true},loadMask:true})]
                    }]
                // Contract Expirations 
                },{
                    columnWidth:.5,
                    layout: 'fit',
                     xtype: 'container',
                    border:false,
                    items: [{
                        
                        xtype:'panel',
                        frame:true,
                        header:true,
                        height:200,
                        title:'Contract Expirations'+ '<i  style="font-size:.8em;color:#C47A02; float:right; ">*Agg. Cap. (Transport - MDth/d, Storage - Bcf)</i>',
                        layout:'fit',
                        items:[new gxp.he.grid.ContractExpirationsGrid({
                            ref:'../../../cegrid',
                            store:expirationStorage,
                            viewConfig: {forceFit: true},
                            loadMask:true
                        })]
                    }]
                }]
        // ROW 4
        },{
                xtype: 'container',
                layout:'column',
                style:'padding-top:10px',
                border:false,
                
                items:[{
                    columnWidth:.5,
                    layout: 'fit',
                    xtype: 'container',
                    border:false,
                    // Storage Consumers
                    items: [{
                        style:'padding: 0px  5px 0px 0',
                        xtype:'panel',
                        frame:true,
                        header:true,
                        layout:'fit',
                        title: 'Financial Highlights (Revenue/Net Income)' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">$ Millions</i>',
                        height:200,
                        items:[new gxp.he.grid.FinancialHighlightsGrid({store:storefin,viewConfig: {forceFit: true},loadMask:true})]
                    }]
                // Contract Expirations 
                },{
                    columnWidth:.5,
                    layout: 'fit',
                    border:false,
                    items: [{
                        xtype:'panel',
                        frame:true,
                        header:true,
                        layout:'fit',
                        height:200,
                        title: 'Annual Throughput and Storage Quantities',
                        items:[new gxp.he.grid.AnnualThroughputStorageGrid({
                            ref:'../../../tsgrid',
                            store:storetTS,
                            viewConfig: {forceFit: true},
                            loadMask:true
                        })]
                    }]
                }]
        // ROW 4
        }];
        
        gxp.he.PipelineStatistics.superclass.initComponent.call(this);
    }
    
});
Ext.reg(gxp.he.PipelineStatistics.prototype.xtype, gxp.he.PipelineStatistics);