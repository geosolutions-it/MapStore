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
    
    genericInformationTemplate:[
        '<table style="width:100%">',
          '<tr>',
            '<th>Owner: </th><td>{owner}</td>',
            '<th>System Capacity:</th><td>{SystemCapacity}</td>',
          '</tr>',
          '<tr>',
            '<th>Operator:</th><td>{operator}</td>',
            '<th>Seasonal Storage:</th><td>{seasonalStorage}</td>',
          '</tr>',
          '<tr>',
            '<th>Miles of Pipeline:</th><td>{miles}</td>',
            '<th>Compressor Stations:</th>{compressorStations}<td></td>',
          '</tr>',
        '</table>'],
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
            ['Iberdrola Energy Svcs.',"FT1",  10]
            
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
        var storeTransport = new Ext.data.ArrayStore({
            data:transportDataTest,
            fields: [
               {name: 'customername'},
               {name: 'rate',      type: 'string'},
               {name: 'capacity',     type: 'float'}
            ]
        });
        
        
        var storeStorage = new Ext.data.ArrayStore({
            data:storageDataTest,
            fields: [
               {name: 'customername'},
               {name: 'rate',      type: 'string'},
               {name: 'capacity',     type: 'float'}
            ]
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
        var storetTS = new Ext.data.ArrayStore({
            data:TSDataTest,
            fields: [
               {name: 'year'},
               {name: 'transport',type: 'float'},
               {name: 'storage',type: 'float'}
            ]
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
        var storefin = new Ext.data.ArrayStore({
            data:finDataTest,
            fields: [
               {name: 'year'},
               {name: 'transportrev',type: 'float'},
               {name: 'storagerev',type: 'float'},
               {name: 'totoprev',type: 'float'},
               {name: 'netincome',type: 'float'}
            ]
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
                    tpl : new Ext.Template(
                        this.genericInformationTemplate
                    ),
                    data:{
                        owner:"Enbridge(50%)/Veresen Inc.(50%)",
                        operator:"Alliance Pipeline KP",
                        miles:86
                    },
                    
                    frame:true,
                    border:false
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
                        items:[new gxp.he.grid.CustomerCapacityGrid({store:storeTransport,viewConfig: {forceFit: true}})]
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
                        items:[new gxp.he.grid.CustomerCapacityGrid({store:storeTransport,viewConfig: {forceFit: true}})]
                        
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
                        items:[new gxp.he.grid.CustomerCapacityGrid({store:storeStorage,viewConfig: {forceFit: true}})]
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
                        height:200,
                        title:'Contract Expirations'+ '<i  style="font-size:.8em;color:#C47A02; float:right; ">*Agg. Cap. (Transport - MDth/d, Storage - Bcf)</i>',
                        anchor:'100%',
                        html:"---"
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
                        items:[new gxp.he.grid.FinancialHighlightsGrid({store:storefin,viewConfig: {forceFit: true}})]
                    }]
                // Contract Expirations 
                },{
                    columnWidth:.5,
                    layout: 'fit',
                    border:false,
                    items: [{
                        style:'padding: 0px  5px 0px 0',
                        xtype:'panel',
                        frame:true,
                        header:true,
                        layout:'fit',
                        height:200,
                        title: 'Annual Throughput and Storage Quantities',
                        items:[new gxp.he.grid.AnnualThroughputStorageGrid({store:storetTS,viewConfig: {forceFit: true}})]
                    }]
                }]
        // ROW 4
        }];
        
        gxp.he.PipelineStatistics.superclass.initComponent.call(this);
    }
    
});
Ext.reg(gxp.he.PipelineStatistics.prototype.xtype, gxp.he.PipelineStatistics);