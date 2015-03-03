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
    contractbycategorylayer: 'gascapacity:gcd_v_contract_by_category',
    contractbycustomerlayer: 'gascapacity:gcd_v_contract_by_customer',
    initComponent: function () {
        this.byCategoryStore = new Ext.data.JsonStore({
            root: 'features',
            messageProperty: 'crs',
            autoLoad: true,
            fields: [
               {name: 'category',      type: 'string', mapping: 'properties.Category'},
               {name: 'capacity',     type: 'float', mapping: 'properties.Contracted_Capacity'}
            ],
            sortInfo: {
                field: 'capacity',
                direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
            },
            url: this.url,
            baseParams:{
                service:'WFS',
                version:'1.1.0',
                request:'GetFeature',
                typeName:this.contractbycategorylayer ,
                outputFormat: 'application/json',
                viewParams: 'FERC:'+this.ferc
            },
            listeners:{
                scope:this,
                beforeload:function(){
                    this.getEl().mask("Please wait...","x-mask-loading");
                },
                load:function(){
                    this.getEl().unmask();
                },
                loadexception: function(){
                    this.getEl().unmask();
                }
            }
        });
        //ROW 1
        var me = this;
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
                    mask:false,
                    layout:'fit',
                    legendRef:'legendPanel',
                    ref: 'chart',
                    store: this.byCategoryStore,
                    valueField:'capacity',
                    labelField:'category',
                    autoColorOptions:{base:180,range:300, s: 0.67,v :0.67},
                    listeners: {
                        chartrefresh: function (chart){
                            var data = this.data;
                            var rows = me.createCustomerRows(data);
                            me.add(rows);
                            me.doLayout();
                        }
                    }
                },{
                    region:'east',
                    width:150,
                    ref:'legendPanel'
                }]
        }];
        
        gxp.he.ContractsByCategory.superclass.initComponent.call(this);
    },
    createCustomerRows: function(data){
        var rows = []
        //Create rows of 2 columns
        for(var i = 0 ; i < data.length; i = i+2){
            var column1 = data[i];
            var column1Store = new Ext.data.JsonStore({
                root: 'features',
                messageProperty: 'crs',
                autoLoad: true,
                fields: [
                   {name: 'customer',      type: 'string', mapping: 'properties.Customer'},
                   {name: 'capacity',     type: 'float', mapping: 'properties.Contracted_Capacity'}
                ],
                sortInfo: {
                    field: 'capacity',
                    direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
                },
                url: this.url,
                baseParams:{
                    service:'WFS',
                    version:'1.1.0',
                    request:'GetFeature',
                    typeName:this.contractbycustomerlayer ,
                    outputFormat: 'application/json',
                    viewParams: 'FERC:'+this.ferc+";CATEGORY:"+column1.label
                }
            });
            var row = {
                xtype: 'container',
                layout:'column',
                style:'padding-top:10px',
                border:false,
                items:[{
                    columnWidth:.5,
                    layout: 'fit',
                    xtype: 'container',
                    border:false,
                    items: [{
                        xtype:'gxp_chart_panel',
                        height: 200,
                        title: column1.label + '<i  style="font-size:.8em;color:#C47A02; float:right; ">MDth/d</i>',
                        store:column1Store,
                        chartOptions:{
                            store:column1Store,
                            valueField:'capacity',
                            labelField:'customer',
                            groupResultsMoreThan:5,
                            autoColorOptions: {
                                base: column1.color, 
                                range: 20
                            }
                        }
                    }]
                }]
            // ROW 4
            };
           
            if(data.length > i +1){
                column2 = data[i+1];
                var column2Store = new Ext.data.JsonStore({
                    root: 'features',
                    messageProperty: 'crs',
                    autoLoad: true,
                    fields: [
                       {name: 'customer',      type: 'string', mapping: 'properties.Customer'},
                       {name: 'capacity',     type: 'float', mapping: 'properties.Contracted_Capacity'}
                    ],
                    sortInfo: {
                        field: 'capacity',
                        direction: 'DESC' // or 'DESC' (case sensitive for local sorting)
                    },
                    url: this.url,
                    baseParams:{
                        service:'WFS',
                        version:'1.1.0',
                        request:'GetFeature',
                        typeName:this.contractbycustomerlayer ,
                        outputFormat: 'application/json',
                        viewParams: 'FERC:'+this.ferc+";CATEGORY:"+column2.label
                    }
                });
                row.items.push({
                        columnWidth:.5,
                        layout: 'fit',
                        border:false,
                        items: [{

                            xtype:'gxp_chart_panel',
                            header:true,
                            height:200,
                            title: column2.label + '<i  style="font-size:.8em;color:#C47A02; float:right; ">MDth/d</i>',
                            chartOptions:{
                                store:column2Store,
                                valueField:'capacity',
                                labelField:'customer',
                                groupResultsMoreThan:5,
                                autoColorOptions:{
                                    base:column2.color, 
                                    range: 20
                                }
                            },
                            store:column2Store
                            
                        }]
                    });
            }
            rows.push(row);
        }
        return rows;
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