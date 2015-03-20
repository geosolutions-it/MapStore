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
 * @author Lorenzo Natali
 */

/**
 * -@requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Shippers
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: Shippers(config)
 *
 *    Plugin for adding HE Capacity Data Module to a :class:`gxp.Viewer`.
 */
gxp.plugins.he.Shippers = Ext.extend(gxp.plugins.Tool, {
    /** api: ptype = he_capacity_data */
    ptype: "he_shippers",
    /** i18n **/
    titleText: 'Capacity',
    types: [//TODO get remote
        ['', '-All Types-'],
        ["B", "Bidirectional"],
        ["D", "Delivery"],
        ["I", "Injection"],
        ["R", "Receipt"],
        ["U", "Unknown"],
        ["W", "Withdrawal"]
    ],
    
 
    /*
     *  :arg config: ``Object``
     */
    addOutput: function (config) {
        var today = new Date();
        var form = {
            xtype: 'form',
            labelAlign: 'top',
            title: this.titleText,
            layout: "form",
            minWidth: 180,
            autoScroll: true,
            frame: true,
            
            items: [{
                xtype: 'fieldset',
                title: 'Query by:',
                anchor: '100%',
                ref: 'queryBy',
                collapsible: false,
                forceLayout: true, //needed to force to read values from this fieldset
                collapsed: false,
                items: [{
                    xtype: 'radiogroup',
                    anchor: '100%',
                    hideLabel: true,
                    autoHeight: true,
                    checkboxToggle: true,
                    name: 'outputType',
                    ref: 'outputType',
                    defaultType: 'radio', // each item will be a radio button
                    columns: 1,
                    items: [
                        {
                            boxLabel: 'Pipeline/Storage Facility',
                            name: 'queryby',
                            inputValue: 'pipeline',
                            checked: true
                        },
                        {
                            boxLabel: 'Shipper',
                            name: 'queryby',
                            inputValue: 'shipper'
                        }

                        ],
                    listeners: {
                        change: function (c, checked) {
                            var value = c.getValue().inputValue;
                            var refineFieldset = this.refOwner.refOwner.refine;
                            refineFieldset.items.each(function (item) {
                                if (item.filter) {
                                    item.setVisible(value == item.filter);
                                }
                            });
                        }
                    }
                    }]
                }, {
                xtype: 'fieldset',
                title: 'Refine Query By:',
                anchor: '100%',
                ref: 'refine',
                collapsible: false,
                forceLayout: true, //needed to force to read values from this fieldset
                collapsed: false,

                items: [{

                    ref: 'pipeline',
                    filter: 'pipeline',
                    xtype: 'gxp_searchboxcombo',
                    avoidSelectEvent: true,
                    emptyText: 'Select a pipeline',
                    fieldLabel: ' Pipeline Name',
                    anchor: '100%',

                    //behavior
                    avoidSelectEvent: true,
                    hideTrigger: false,
                    triggerAction: 'all',
                    forceSelected: true,
                    clearOnFocus: false,
                    allowBlank: false,
                    typeAhead: false,

                    //data
                    url: this.geoServerUrl,
                    typeName: this.pipelineNameLayer,
                    mapPanel: this.target.mapPanel,
                    displayField: 'pl_PipelineName',
                    valueField: 'pl_FERC',
                    hiddenName:'pipeline',
                    sortBy: 'pl_PipelineName',
                    queriableAttributes: [
                            "pl_PipelineName"
                         ],
                    tpl: "<tpl for=\".\"><div class=\"search-item\">{pl_PipelineName}</div></tpl>",
                    recordModel: [
                        {
                            name: 'id',
                            mapping: 'id'
                            }, {
                            name: "pl_PipelineName",
                            mapping: "properties.pl_PipelineName"
                            },
                        {
                            name: "pl_FERC",
                            mapping: "properties.pl_FERC"
                            },
                        {
                            name: "pl_FERC",
                            mapping: "properties.pl_FERC"
                            }
                         ]
                    },{

                    ref: 'shipper',
                    filter: 'shipper',
                    hidden: true,
                    xtype: 'gxp_searchboxcombo',
                    emptyText: 'Select a Shipper',
                    fieldLabel: ' Shipper',
                    anchor: '100%',

                    //behavior
                    avoidSelectEvent: true,
                    hideTrigger: false,
                    triggerAction: 'all',
                    forceSelected: true,
                    clearOnFocus: false,
                    allowBlank: false,
                    typeAhead: false,

                    //data
                    url: this.geoServerUrl,
                    typeName: this.shipperNamesLayer,
                    mapPanel: this.target.mapPanel,
                    displayField: 'iocs_ShipperName',
                    hiddenName:'shipper',
                    valueField: 'iocs_ShipperName',
                    sortBy: 'iocs_ShipperName',
                    queriableAttributes: [
                            "iocs_ShipperName"
                         ],
                    tpl: "<tpl for=\".\"><div class=\"search-item\">{iocs_ShipperName}</div></tpl>",
                    recordModel: [
                        {
                            name: "iocs_ShipperName",
                            mapping: "properties.iocs_ShipperName"
                        }
                         ]
                    }, {
                    xtype: 'radio',
                    ref: 'point',
                    filter: 'pipeline',
                    boxLabel: 'List Contracts Expiring',
                    inputValue: 'contractsexpiring',
                    name: 'pipelinelist',
                    checked: true
                    }, {
                    xtype: 'radio',
                    ref: 'point',
                    filter: 'shipper',
                    boxLabel: 'List Contracted Quantities By Pipeline Expiring',
                    inputValue: 'contractsexpiring',
                    name: 'shipperlist',
                    hidden: true,
                    checked: true
                    }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                            xtype: 'datefield',
                            value: today,
                            fieldLabel: 'Between',
                            name: 'start',
                            anchor: '100%'
                            }]
                        }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                            xtype: 'datefield',
                            value: today,
                            fieldLabel: 'And',
                            name: 'end',
                            anchor: '100%'
                            }]
                        }, {
                            xtype: 'box',
                            ref: 'separator',
                            autoEl: {
                                tag: 'div',
                                html: 'Or'
                        }
                        }]
                    }, {
                    xtype: 'radio',
                    ref: 'point',
                    filter: 'pipeline',
                    boxLabel: 'List Shippers',
                    inputValue: 'all',
                    name: 'pipelinelist'
                    }, {
                    xtype: 'radio',
                    ref: 'point',
                    filter: 'shipper',
                    boxLabel: 'List Pipelines & Storage Facilities',
                    inputValue: 'all',
                    name: 'shipperlist',
                    hidden: true
                    }]
                },
                {
                    layout: 'hbox',
                    pack: 'end',
                    items:[
                {
                    xtype: 'button',
                    text: 'Look Up',
                    iconCls: 'gxp-icon-find',
                    disabled: false,
                    scope: this,
                    handler: this.lookupButtonHandler
                },{
                xtype: 'button',
                text: 'Chart Contracts By Shipper Type',
                iconCls: 'gxp-icon-find',
                disabled: false,
                ref: 'contractbyCategoryButton',
                scope: this,
                handler: function(){
                     var values = this.output.getForm().getValues()
                     var pipelineId = this.output.getForm().getValues().pipeline;
                     if(!(values.queryby == 'pipeline' && values.pipeline )){
                        Ext.Msg.show({
                           
                           msg: 'This feature is not implemented yet. Please select "Query by Pipeline/Storage Facility" and select a pipeline in the "Refine Query" box',
                           buttons: Ext.Msg.OK,
                           animEl: 'elId',
                           icon: Ext.MessageBox.INFO
                        });
                        return 
                    }
                     var canvasWindow = new Ext.Window({
                        title: pipelineId +' - Transport Customers',
                        layout:'border',
                        autoScroll:false,
                        height:Math.min(Ext.getBody().getViewSize().height,750),
                        width:900,
                        maximizable:true,
                        items:[{
                                xtype: 'he_contractsbycategory',
                                ferc: pipelineId,
                                url: this.geoServerUrl,
                                region:'center',
                                border:false
                            }]
                    }).show();
                }
            }
            ]
                }
            
            
            ],
            buttons: []
        };
        config = Ext.apply(form, config || {});

        this.output = gxp.plugins.he.Shippers.superclass.addOutput.call(this, config);



        return this.output;
    },
    
    lookupButtonHandler : function () {        
                    var values = this.output.getForm().getValues();
                    if(!(values.queryby == 'pipeline' && values.pipeline )
                    && !(values.queryby == 'shipper' && values.shipper ) ){
                        Ext.Msg.show({
                           
                           msg: 'Please select a pipeline name or a shipper name in the "Refine Query By" box',
                           buttons: Ext.Msg.OK,
                           animEl: 'elId',
                           icon: Ext.MessageBox.INFO
                        });
                        return 
                    }
                    
                    // This is the card panel that will hold the results
                    var resultsGridPanel = this.resultsGridCardPanel ? Ext.getCmp(this.resultsGridCardPanel) : null;
                    if(resultsGridPanel){
                        
                        // Remove previously added grid panels
                        resultsGridPanel.removeAll();
                        
                        var fields, columns, qryLayer;
                        if ( values.queryby == 'pipeline' ) {
                            qryLayer = this.qryByPipelineLayerName;
                            fields =  [
                               {name: 'shipper',  type: Ext.data.Types.STRING , mapping: 'properties.Shipper'},
                               {name: 'expiration_date', type: Ext.data.Types.DATE, mapping: 'properties.Expiration_Date', dateFormat: 'Y-m-d\\Z'},
                               {name: 'contract_number', type: Ext.data.Types.STRING, mapping: 'properties.Contract_Number'},
                               {name: 'rate_schedule', type: Ext.data.Types.STRING, mapping: 'properties.Rate_Schedule'},
                               {name: 'transportation_qty', type: Ext.data.Types.INT, mapping: 'properties.Transportation_Qty'}
                            ];
                            
                            columns = [
                                {
                                    id       :'shipper',
                                    header   : 'Shipper', 
                                    width    : 50,
                                    sortable : true, 
                                    dataIndex: 'shipper'
                                },
                                {
                                    id       : 'expiration_date',
                                    header   : 'Expiration Date', 
                                    width    : 75, 
                                    sortable : true, 
                                    xtype    : 'datecolumn',
                                    //renderer : 'usMoney', 
                                    dataIndex: 'expiration_date'
                                },
                                {
                                    id       : 'contract_number',
                                    header   : 'Contract Number', 
                                    width    : 75, 
                                    sortable : true, 
                                    //renderer : 'usMoney', 
                                    dataIndex: 'contract_number'
                                },
                                {
                                    id       : 'rate_schedule',
                                    header   : 'Rate Schedule', 
                                    width    : 75, 
                                    sortable : true, 
                                    //renderer : 'usMoney', 
                                    dataIndex: 'rate_schedule'
                                },
                                {
                                    id       : 'transportation_qty',
                                    header   : 'Transportation Qty', 
                                    width    : 75, 
                                    sortable : true, 
                                    xtype    : "numbercolumn",
                                    format   : "0,000",
                                    align    : "right",
                                    //renderer : 'usMoney', 
                                    dataIndex: 'transportation_qty'
                                }

                            ];
                            
                        } else {
                            // values.queryby == 'shipper'
                            qryLayer = this.qryByShipperLayerName;
                            fields =  [
                               {name: 'shipper',  type: Ext.data.Types.STRING , mapping: 'properties.Shipper'},
                               {name: 'pipeline',  type: Ext.data.Types.STRING , mapping: 'properties.pipeline'},
                               {name: 'expiration_date', type: Ext.data.Types.DATE, mapping: 'properties.Expiration_Date', dateFormat: 'Y-m-d\\Z'},
                               {name: 'contract_number', type: Ext.data.Types.STRING, mapping: 'properties.Contract_Number'},
                               {name: 'rate_schedule', type: Ext.data.Types.STRING, mapping: 'properties.Rate_Schedule'},
                               {name: 'transportation_qty', type: Ext.data.Types.INT, mapping: 'properties.Transportation_Qty'}
                            ];
                            columns = [
                                {
                                    id       :'shipper',
                                    header   : 'Shipper', 
                                    width    : 50,
                                    sortable : true, 
                                    dataIndex: 'shipper'
                                },
                                {
                                    id       : 'pipeline',
                                    header   : 'With Pipeline', 
                                    width    : 75, 
                                    sortable : true, 
                                    //renderer : 'usMoney', 
                                    dataIndex: 'pipeline'
                                },
                                {
                                    id       : 'expiration_date',
                                    header   : 'Expiration Date', 
                                    width    : 75, 
                                    sortable : true, 
                                    xtype    : 'datecolumn',
                                    dataIndex: 'expiration_date'
                                },
                                {
                                    id       : 'contract_number',
                                    header   : 'Contract Number', 
                                    width    : 75, 
                                    sortable : true, 
                                    //renderer : 'usMoney', 
                                    dataIndex: 'contract_number'
                                },
                                {
                                    id       : 'rate_schedule',
                                    header   : 'Rate Schedule', 
                                    width    : 75, 
                                    sortable : true, 
                                    //renderer : 'usMoney', 
                                    dataIndex: 'rate_schedule'
                                },
                                {
                                    id       : 'transportation_qty',
                                    header   : 'Transportation Qty', 
                                    width    : 75, 
                                    sortable : true, 
                                    xtype    : "numbercolumn",
                                    format   : "0,000",
                                    align    : "right",
                                    //renderer : 'usMoney', 
                                    dataIndex: 'transportation_qty'
                                }

                            ];
                        }
                    
                        var storeShippers = new Ext.data.JsonStore({
                            root: 'features',
                            //messageProperty: 'crs',
                            autoLoad: true,
                            sortInfo: {
                                field: 'contract_number',
                                direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
                            },
                            fields: fields,
                            url: this.geoServerUrl,
                            baseParams:{
                                service:'WFS',
                                version:'1.1.0',
                                request:'GetFeature',
                                typeName:qryLayer,
                                outputFormat: 'application/json',
                                viewParams: this.createViewParams()
                            }
                        });
                        
                        var shippers_grid = new Ext.grid.GridPanel({
                            
                            store:storeShippers,
                            viewConfig: {
                                forceFit: true
                            },
                            loadMask:true,
                            layout:'fit',
                            autoExpandColumn:'shipper',
                            columns: columns
                        });
                        
                        
                        // Add our panel
                        resultsGridPanel.add(shippers_grid);
                        
                        
                        // Display the parent cardlayout panel
                        var container = this.featureGridContainer ? Ext.getCmp(this.featureGridContainer) : null;
                        if(container){
                            container.expand();
                        }
                        
                        resultsGridPanel.doLayout();
                    }

                },
    
    createViewParams: function(){
        var values = this.output.getForm().getValues();
        var fieldValues = this.output.getForm().getFieldValues();
        
        var startDate = "START_DATE:" + fieldValues.start.format('Y-m-d');
        var endDate = "END_DATE:" + fieldValues.end.format('Y-m-d');;
        var viewParams = [startDate,endDate];
        
        if(values.queryby == 'pipeline' && values.pipeline ){
            var ferc = "FERC:" + values.pipeline;
            viewParams.push(ferc);
        }
        
        if(values.queryby == 'shipper' && values.shipper ){
            var shipper = "SHIPPER_NAME:" + values.shipper;
            // This is a STRING and GeoServer uses the comma 
            // to separate the same viewParams for different layers
            // to use a comma inside a sting it must be escaped
            shipper = shipper.replace(',', '\\,');
            viewParams.push(shipper);
        }
        
        if(values.ptype && values.ptype != ''){
            var ptype = "PTYPE:" + values.ptype;
            viewParams.push(ptype);
        }
        
        return   viewParams.join(";");
        
    }

});
Ext.preg(gxp.plugins.he.Shippers.prototype.ptype, gxp.plugins.he.Shippers);