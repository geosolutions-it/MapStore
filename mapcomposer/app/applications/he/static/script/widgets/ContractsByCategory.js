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
gxp.he.ContractsByCategory = Ext.extend(Ext.Container, {
    
    
    /* ptype =  gxp_chartpanel */
    xtype: "he_contractsbycategory",
    updateDelay: 0,
    deferredRender: false,
    autoScroll: true,
    style:'padding:10px',
    initComponent: function () {

        //ROW 1
        this.items = [{
                
                frame:true,
                xtype:'panel',
                header:true,
                title: 'Transport Customers by Category' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">Valid contracts as of 2014</i>',
                anchor:'100%',
                layout:'border',
                height:250,
                items:[{
                    region: 'center',
                    xtype:'gxp_ChartJsChart',
                    type:'pie',
                    layout:'fit',
                    legendRef:'legendPanel',
                    ref: 'chart',
                    data: [
                        {
                            value: 563.510,
                            label: "Producer",
                            color: '#215C2B'
                        },
                        {
                            value: 445.863,
                            label: "Trader/Marketer",
                            color: '#F9A50D'
                        },
                        {
                            value: 241.995,
                            label: "Transmission",
                            color: '#3E1E58'
                        },
                        {
                            value: 239.478,
                            label: "Utility/Power Gen.",
                            color: '#254180'
                        },
                        {
                            value: 0,
                            label: "Industrial",
                            color: '#9C1A20'
                        }
                    ],
                },{
                    region:'east',
                    width:150,
                    ref:'legendPanel'

                }]
        //ROW 2
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
                        xtype:'gxp_chart_panel',
                        height: 200,
                        title: 'Producer' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">MDth/d</i>',
                        data: this.producerTestData,
                        chartOptions:{
                            autoColorOptions: {
                                base: 130, 
                                range: 0
                            }
                        }
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
                        title: 'Trader/Marketer' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">MDth/d</i>',
                        items:[{
                            region: 'center',
                            xtype:'gxp_ChartJsChart',
                            type:'pie',
                            autoColorOptions:{
                                base:39, //center
                                range: 0
                            },
                            data: [
                                {
                                    value: 300,
                                    label: "a"
                                },
                                {
                                    value: 50,
                                    label: "b"
                                },
                                {
                                    value: 100,
                                    label: "c"
                                },
                                {
                                    value: 40,
                                    label: "d"
                                },
                                {
                                    value: 120,
                                    label: "e"
                                }
                            ]
                        }]
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
                        title: 'Transmission' + '<i  style="font-size:.8em;color:#C47A02; float:right; ">MDth/d</i>',
                        height:200,
                        items:[{
                            region: 'center',
                            xtype:'gxp_ChartJsChart',
                            type:'pie',
                            autoColorOptions:{
                                base:273, //center
                                range: 0
                            },
                            data: [
                                {
                                    value: 300,
                                    label: "a"
                                },
                                {
                                    value: 50,
                                    label: "b"
                                },
                                {
                                    value: 100,
                                    label: "c"
                                },
                                {
                                    value: 40,
                                    label: "d"
                                },
                                {
                                    value: 120,
                                    label: "e"
                                }
                            ],
                        }]
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
                        title: 'Utility/Power Generation'+ '<i  style="font-size:.8em;color:#C47A02; float:right; ">MDth/d</i>',
                        items:[{
                            region: 'center',
                            xtype:'gxp_ChartJsChart',
                            type:'pie',
                            autoColorOptions:{
                                base:222, //center
                                range: 0
                            },
                            data: [
                                {
                                    value: 300,
                                    label: "a"
                                },
                                {
                                    value: 50,
                                    label: "b"
                                },
                                {
                                    value: 100,
                                    label: "c"
                                },
                                {
                                    value: 40,
                                    label: "d"
                                },
                                {
                                    value: 120,
                                    label: "e"
                                }
                            ],
                        }]
                    }]
                }]
        // ROW 4
        }];
        
        gxp.he.ContractsByCategory.superclass.initComponent.call(this);
    },
    // TEST DATA
    producerTestData: [
                {
                    value: 196.110,
                    label: "Conocophillips Co"
                                },
                {
                    value: 96.352,
                    label: "Canadian Nat Rsrcs. Ltd"
                                },
                {
                    value: 72.707,
                    label: "Encana Mktng. (USA), Inc."
                                },
                {
                    value: 32.850,
                    label: "hevron Standard Limited"
                                },
                {
                    value: 114.867,
                    label: "All Other"
                                }
                    ]

});
Ext.reg(gxp.he.ContractsByCategory.prototype.xtype, gxp.he.ContractsByCategory);