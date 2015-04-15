/**
 *  Copyright (C) 2007 - 2015 GeoSolutions S.A.S.
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
 * @author Lorenzo Natali (lorenzo.natali@geo-solutions.it)
 * @author Lorenzo Pini (lorenzo.pini@geo-solutions.it)
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
    
    /** api: Configuration of the layer to display on the map 
             and to filter with the select FERC 
    **/
    pipelineLayerConfig: {
        title: "Some fancy title",
        name: "GCD_Users_Z0:GCD_INTER_PL",
        layers: "GCD_Users_Z0:GCD_INTER_PL",
        styles: "NG_PIPE" ,
        transparent: true,
        displayInLayerSwitcher: false
    },
    
    /* Status of the results grid panel (if any)*/
    resultsGridStatus: "collapsed",
    
    /* Flag to enable the automatic updates of the min/max dates on Pipeline change */
    canUpdateDates: true ,
    
    /* Service for SnapShot feature*/
    service : "http://he.geo-solutions.it/servicebox/",
    
    /** api: config[fileName]
     *  ``String``
     *  The name of the file to download
     */
    fileName: "chart-snapshot.png",
    
    /*
     *  :arg config: ``Object``
     */
    addOutput: function (config) {
        var source = this.target.layerSources[this.source];
        this.vendorParams = {};
        if(source && source.authParam){
            this.vendorParams[source.authParam] = source.getAuthParam();
        }
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
                        scope: this,
                        change: function (c, checked) {
                            var value = c.getValue().inputValue;
                            var refineFieldset = c.refOwner.refOwner.refine;
                            refineFieldset.items.each(function (item) {
                                if (item.filter) {
                                    item.setVisible(value == item.filter);
                                    if(item.inputValue && item.inputValue == 'all' && value == item.filter){
                                        this.enableDisableDates(item, !item.checked);
                                    }
                                }
                            }, this);
                            
                            if(value == 'pipeline'){
                                c.refOwner.refOwner.buttonsContainer.contractbyCategoryButton.show();
                            }else{
                                c.refOwner.refOwner.buttonsContainer.contractbyCategoryButton.hide();
                            }
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
                    vendorParams: this.vendorParams,
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
                        }, {
                            name: "pl_FERC",
                            mapping: "properties.pl_FERC"
                        }
                    ],
                    listeners: {
                        scope: this,
                        select: function (combo, record, index) {
                            combo.refOwner.refOwner.buttonsContainer.btnLookup.setDisabled(false);
                            combo.refOwner.refOwner.buttonsContainer.contractbyCategoryButton.setDisabled(false);
                            
                            var ferc_string = record.get('pl_FERC');
                            var cql_filter_string = "FERC = '"+ferc_string+"'";
                            var new_vendorParams = Ext.apply({ cql_filter: cql_filter_string }, this.vendorParams || {});
                            // add or update layer
                            if(!this.pipelineLayer){
                                
                                var layerProps = Ext.apply(this.pipelineLayerConfig, {
                                    vendorParams: new_vendorParams
                                });

                                // Create and add layer to map
                                var source = this.target.tools.addlayer.checkLayerSource(this.geoServerUrl);
                                var layerRecord = source.createLayerRecord(layerProps);
                                this.pipelineLayer = layerRecord.getLayer();
                                this.target.mapPanel.layers.add([layerRecord]);
                                
                            }else{
                                // merge params to layer
                                this.pipelineLayer.vendorParams = Ext.apply(this.pipelineLayer.vendorParams, new_vendorParams);

                                this.pipelineLayer.mergeNewParams({
                                    cql_filter: cql_filter_string
                                });
                            }
                            
                            // Update the Date fields
                            if(this.canUpdateDates){
                                
                                var form_reference = combo.refOwner.refOwner.getForm();
                                
                                // Get values from WFS  
                                var statsStore = new Ext.data.JsonStore({
                                    root: 'features',
                                    autoLoad: true,
                                    fields: [
                                       {name: 'min_exp', type: 'date', mapping: 'properties.min_exp', dateFormat: 'Y-m-d\\Z'},
                                       {name: 'max_exp', type: 'date', mapping: 'properties.max_exp', dateFormat: 'Y-m-d\\Z'}
                                    ],
                                    url: this.geoServerUrl,
                                    baseParams: Ext.apply({
                                        service: 'WFS',
                                        version: '1.1.0',
                                        request: 'GetFeature',
                                        outputFormat: 'application/json',
                                        typeName: 'gascapacity:gcd_v_iocsections_stats' ,
                                        viewParams: 'FERC:'+ferc_string,
                                        maxFeatures: 1
                                    }, this.vendorParams),
                                    listeners:{
                                        scope: form_reference,
                                        load:function(){
                                            var stats_record = statsStore.getAt(0);
                                            // Update UI
                                            if(stats_record){
                                                this.findField('start').setValue(stats_record.data.min_exp);
                                                this.findField('end').setValue(stats_record.data.max_exp);
                                            }
                                            
                                        }
                                    }
                                });
                            }
                        }
                    }
                    
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
                    vendorParams: this.vendorParams,
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
                    ref: 'radioPipelineQryByDate',
                    filter: 'pipeline',
                    boxLabel: 'List Contracts Expiring',
                    inputValue: 'contractsexpiring',
                    name: 'pipelinelist',
                    checked: true,
                    listeners:{
                        check: this.enableDisableDates
                    }
                }, {
                    xtype: 'radio',
                    ref: 'radioShipperQryByDate',
                    filter: 'shipper',
                    boxLabel: 'List Contracted Quantities By Pipeline Expiring',
                    inputValue: 'contractsexpiring',
                    name: 'shipperlist',
                    hidden: true,
                    checked: true,
                    listeners:{
                        check: this.enableDisableDates
                    }
                }, {
                    layout: 'column',
                    ref: 'dateHolder',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                            xtype: 'datefield',
                            value: today,
                            fieldLabel: 'Between',
                            name: 'start',
                            anchor: '100%',
                            listeners :{
                                'change' : {
                                    fn: function() {
                                        // User action, disable automatic date updates
                                        this.canUpdateDates = false;
                                    },
                                    scope: this
                                },
                                'select' : {
                                    fn: function() {
                                        // User action, disable automatic date updates
                                        this.canUpdateDates = false;
                                    },
                                    scope: this
                                }
                            }
                        }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                            xtype: 'datefield',
                            value: today,
                            fieldLabel: 'And',
                            name: 'end',
                            anchor: '100%',
                            listeners :{
                                'change' : {
                                    fn: function() {
                                        // User action, disable automatic date updates
                                        this.canUpdateDates = false;
                                    },
                                    scope: this
                                },
                                'select' : {
                                    fn: function() {
                                        // User action, disable automatic date updates
                                        this.canUpdateDates = false;
                                    },
                                    scope: this
                                }
                            }
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
                    ref: 'radioPipelineQryAll',
                    filter: 'pipeline',
                    boxLabel: 'List Shippers',
                    inputValue: 'all',
                    name: 'pipelinelist'
                }, {
                    xtype: 'radio',
                    ref: 'radioShipperQryAll',
                    filter: 'shipper',
                    boxLabel: 'List Pipelines & Storage Facilities',
                    inputValue: 'all',
                    name: 'shipperlist',
                    hidden: true
                }]
            },{
                layout: 'hbox',
                pack: 'end',
                ref: 'buttonsContainer',
                items:[
                {
                    xtype: 'button',
                    ref: 'btnLookup',
                    text: 'Look Up',
                    iconCls: 'gxp-icon-find',
                    disabled: false,
                    scope: this,
                    handler: this.lookupButtonHandler
                },{
                    xtype:'spacer',
                    flex:1
                },{
                    xtype: 'button',
                    text: 'Chart Contracts By Shipper Type',
                    iconCls: 'chart-pie-icon',
                    disabled: true,
                    ref: 'contractbyCategoryButton',
                    scope: this,
                    handler: this.contractByCategoryHandler
                }
                ]
            }
            ],
            buttons: []
        };
        config = Ext.apply(form, config || {});

        this.output = gxp.plugins.he.Shippers.superclass.addOutput.call(this, config);

        // Event handlers to react to tab changes
        this.output.on('tabhide', function(){
            if(this.pipelineLayer){
                this.pipelineLayer.setVisibility(false);
            }
        }, this);
        
        this.output.on('tabshow', function(){
            if(this.pipelineLayer){
                this.pipelineLayer.setVisibility(true);
            }
            // Restore the ResultsGrid panel status
            var container = this.featureGridContainer ? Ext.getCmp(this.featureGridContainer) : null;
            if(container && this.resultsGridStatus){
                if(this.resultsGridStatus == "collapsed"){
                    container.collapse();
                }else if(this.resultsGridStatus == "expanded"){
                    container.expand();
                }
            }
        }, this);

        var container = this.featureGridContainer ? Ext.getCmp(this.featureGridContainer) : null;
        if(container){
            
            container.on({
                'collapse' : {
                    fn: this.resultsGridCollapseHandler,
                    scope: this
                },
                'expand' : {
                    fn: this.resultsGridExpandHandler,
                    scope: this
                }
            });
        }
        
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
                    
                    var fields, columns, qryLayer,
                    sortinfo = {
                            field: 'contract_number',
                            direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
                        };
                        
                    if ( values.queryby == 'pipeline' ) {
                        
                        if ( values.pipelinelist == 'all' ){
                            qryLayer = this.qryByPipelineListShippers;
                            fields =  [
                               {name: 'shippers',  type: Ext.data.Types.STRING , mapping: 'properties.Shippers'}
                            ];
                            
                            columns = [
                                {
                                    id       :'shippers',
                                    header   : 'Shippers', 
                                    width    : 50,
                                    sortable : true, 
                                    dataIndex: 'shippers'
                                }
                            ];
                            sortinfo = {
                                field: 'shippers',
                                direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
                            }
                        }else{
                        
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
                        
                        }
                        
                    } else {
                        // values.queryby == 'shipper'
                        
                        if ( values.shipperlist == 'all' ){
                            qryLayer = this.qryByShipperListPipelines;
                            fields =  [
                               {name: 'facility',  type: Ext.data.Types.STRING , mapping: 'properties.Facility'},
                               {name: 'ferc',  type: Ext.data.Types.STRING , mapping: 'properties.FERC'}
                            ];
                            
                            columns = [
                                {
                                    id       :'facility',
                                    header   : 'Facility', 
                                    width    : 50,
                                    sortable : true, 
                                    dataIndex: 'facility'
                                },
                                {
                                    id       :'ferc',
                                    header   : 'FERC', 
                                    width    : 50,
                                    sortable : true, 
                                    dataIndex: 'ferc'
                                }
                            ];
                            sortinfo = {
                                field: 'facility',
                                direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
                            }
                        }else{
                        
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
                    }
                
                    var storeShippers = new Ext.data.JsonStore({
                        root: 'features',
                        //messageProperty: 'crs',
                        autoLoad: true,
                        sortInfo: sortinfo,
                        fields: fields,
                        url: this.geoServerUrl,
                        baseParams: Ext.apply ({
                            service:'WFS',
                            version:'1.1.0',
                            request:'GetFeature',
                            typeName:qryLayer,
                            outputFormat: 'application/json',
                            viewParams: this.createViewParams()
                        }, this.vendorParams || {})
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
                        this.resultsGridStatus = "expanded";
                    }
                    
                    resultsGridPanel.doLayout();
                }

            },
    
    /**
     * Open a Window with the currently selected Pipeline statistics Charts
     */
    contractByCategoryHandler : function(){
    
         var values = this.output.getForm().getValues()
         var pipelineId = values.pipeline;
         var pipelineName = pipelineId;
         if ( this.output.refine
           && this.output.refine.pipeline
           && this.output.refine.pipeline.getRawValue()){
              pipelineName = this.output.refine.pipeline.getRawValue() ;
           }
         if(!(values.queryby == 'pipeline' && values.pipeline )){
            Ext.Msg.show({
               
               msg: 'Please select a Pipeline in the "Refine Query" box',
               buttons: Ext.Msg.OK,
               animEl: 'elId',
               icon: Ext.MessageBox.INFO
            });
            return 
        }
         var canvasWindow = new Ext.Window({
            title: pipelineName +' - Transport Customers',
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
                    border:false,
                    baseParams:Ext.apply({
                        service:'WFS',
                        version:'1.1.0',
                        request:'GetFeature',
                        outputFormat: 'application/json',
                    }, this.vendorParams || {})
                }],
            tools:[{
                id:'print',
                scope: this,
                handler: function(event, toolEl, panel){
                    var me = this;
                    var visible_items = $(panel.header.dom)
                                        .children([".x-tool"])
                                        .filter(function (index) {
                                              return $(this).css("display") === "block";
                                          });
                    $.each(visible_items, function(i, item){$(item).hide()})
                    html2canvas( panel.getEl().dom, {
                            proxy: proxy,
                           // allowTaint:true,  
                            //CORS errors not managed with ie11, so disable
                            useCORS: !Ext.isIE11,
                            //logging:true,
                            onrendered: function(c) {
                                
                                var canvasData = c.toDataURL("image/png;base64");
                                if(Ext.isIE || Ext.isIE11){
                                    me.uploadCanvas(canvasData);
                                }else{
                                    me.localDownload(canvasData);
                                }
                                $.each(visible_items, function(i, item){$(item).show()})

                            }
                    });
                    
                }
            }]
        }).show();
    },
    
    /**
     * private method[localDownload]
     * Use a link and emulate click to download the data:image in the canvasData argument. 
     * Works for Chrome and Firefox
     */
    localDownload: function(canvasData){
        var img = new Image();
        img.src= canvasData;
        var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = this.fileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    
    },
    
    /** api: method[uploadCanvas]
     * upload base64 ecoded canvas data to servicebox and finalize with download response.
     * A service that forces download is needed for Internet Explorer (now IE11 download attribute in link is not supported)
     */
    uploadCanvas: function (canvasData){
        var mHost = this.service.split("/");

        var mUrl = this.service + "UploadCanvas";
            mUrl = mHost[2] == location.host ? mUrl : proxy + mUrl;

        Ext.Ajax.request({
            url: mUrl,
            method: "POST",
            headers:{
                  'Content-Type' : 'application/upload'
            },
            params: canvasData,
            scope: this,
            success: function(response, opts){
                if (response.readyState == 4 && response.status == 200){
                    if(response.responseText && response.responseText.indexOf("\"success\":false") < 0){
                        var fname = this.fileName;

                        var mUrl = this.service + "UploadCanvas";
                            mUrl = mHost[2] == location.host ? mUrl + "?ID=" + response.responseText + 
                                "&fn=" + fname : proxy + encodeURIComponent(mUrl + "?ID=" + response.responseText + "&fn=" + fname);

                        this.target.safeLeaving =true;
                        window.location.assign(mUrl);

                    }else{
                        // this error should go to failure
                        Ext.Msg.show({
                             title: this.printStapshotTitle,
                             msg: this.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
                             width: 300,
                             icon: Ext.MessageBox.ERROR
                        });
                    }
                }else if (response.status != 200){
                    Ext.Msg.show({
                         title: 'Print Snapshot',
                         msg: this.serverErrorMsg,
                         width: 300,
                         icon: Ext.MessageBox.ERROR
                    });
                }	
            },
            failure:  function(response, opts){
                Ext.Msg.show({
                     title: this.printStapshotTitle,
                     msg: this.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
                     width: 300,
                     icon: Ext.MessageBox.ERROR
                });
            }
        });
    },
    
    createViewParams: function(){
        var values = this.output.getForm().getValues();
        var fieldValues = this.output.getForm().getFieldValues();
        var viewParams = [];
        
        if(fieldValues.start){
            var startDate = "START_DATE:" + fieldValues.start.format('Y-m-d');
            viewParams.push(startDate);
        }
        
        if(fieldValues.end){
            var endDate = "END_DATE:" + fieldValues.end.format('Y-m-d');
            viewParams.push(endDate);
        }
        
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
        
    },
    
    enableDisableDates: function(checkbox , checked){
        // Navigate the form to find alla the datefields and enable or disable them
        Ext.each(
            checkbox.refOwner.refOwner.refine.dateHolder.findByType('datefield'),
            function(obj){
                obj.setDisabled(!checked)
                }
            )
    },
    resultsGridCollapseHandler: function(cpanel){
        if(this.output.ownerCt.getActiveTab() == this.output){
            this.resultsGridStatus = "collapsed";
        }
    },
    resultsGridExpandHandler: function(cpanel){
        if(this.output.ownerCt.getActiveTab() == this.output){
            this.resultsGridStatus = "expanded";
        }
    }

});
Ext.preg(gxp.plugins.he.Shippers.prototype.ptype, gxp.plugins.he.Shippers);