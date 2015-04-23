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
 *  class = CapacityData
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: CapacityData(config)
 *
 *    Plugin for adding HE Capacity Data Module to a :class:`gxp.Viewer`.
 */
gxp.plugins.he.CapacityData = Ext.extend(gxp.plugins.Tool, {
    /** api: ptype = he_capacity_data */
    ptype: "he_capacity_data",
    /** i18n **/
    titleText: 'Flows & Statistics',
    types: [
        ["", '-All Types-'],
        //["'B'", "Bidirectional"],
        ["'D'", "Delivery"],
        //["'I'", "Injection"],
        ["'R'", "Receipt"],
        ["'T'", "Throughput"],
        ["'U'", "Unknown"]
        //,["'W'", "Withdrawal"]
    ],
    layerName: "gascapacity:test_capacity_point",
    
    /* Service for SnapShot feature*/
    service : "http://he.geo-solutions.it/servicebox/",
    
    /** api: config[fileName]
     *  ``String``
     *  The name of the file to download
     */
    fileName: "statistics-snapshot.png",

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
    //canUpdateDates: true ,
    
    /*
     *  :arg config: ``Object``
     */
    addOutput: function (config) {
        var source = this.target.layerSources[this.source];
        if(this.resultsGridID && this.target.tools[this.resultsGridID]){
            this.resultsGrid = this.target.tools[this.resultsGridID];
        }
        this.vendorParams = {};
        if(source && source.authParam){
            this.vendorParams[source.authParam] = source.getAuthParam();
        }
        var today = new Date();
        var lastweek = new Date();
        lastweek.setDate(lastweek.getDate() -7 );
        
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
                    ref: 'outputType',
                    defaultType: 'radio', // each item will be a radio button
                    columns: 1,
                    items: [{
                        boxLabel: 'Pipeline/Storage Facility',
                        name: 'queryby',
                        inputValue: 'pipeline',
                        checked: true
                    }, {
                        boxLabel: 'State/County',
                        name: 'queryby',
                        hidden: true,
                        inputValue: 'state'
                    }, {
                        boxLabel: 'Point Name/Number',
                        name: 'queryby',
                        inputValue: 'point'
                    }, {
                        boxLabel: 'Rextag\'s Map Book Points',
                        name: 'queryby',
                        inputValue: 'book',
                        hidden: true,
                        disabled: true
                    }],
                    listeners: {
                        scope: this,
                        change: function (c, checked) {
                            var value = c.getValue().inputValue;
                            var refineFieldset = c.refOwner.refOwner.refine;
                            refineFieldset.items.each(function (item) {
                                if (item.filter) {
                                    item.setVisible(value == item.filter);
                                }

                            });

                            var values = c.refOwner.refOwner.getForm().getValues();
                            //show aggregate
                            var showAggregate = value != 'point';
                            //var summarize = this.refOwner.refOwner.summarize;
                            //summarize.separator.setVisible(showAggregate);
                            //summarize.aggregate.setVisible(showAggregate);
                            if(!showAggregate){
                                // value == 'point'
                                c.refOwner.refOwner.buttonsContainer.btnLookup.setDisabled(false);
                                c.refOwner.refOwner.buttonsContainer.show_general_statistics_btn.hide();
                                c.refOwner.refOwner.refine.pointtype.hide();
                                this.pipelineLayer.setVisibility(this.pipelineLayerVisible);
                            }else{

                                c.refOwner.refOwner.refine.pointtype.show();
                                c.refOwner.refOwner.buttonsContainer.show_general_statistics_btn.show();
                                if(!values.pipeline){
                                    c.refOwner.refOwner.buttonsContainer.btnLookup.setDisabled(true);
                                    c.refOwner.refOwner.buttonsContainer.show_general_statistics_btn.setDisabled(true);
                                }else{
                                    c.refOwner.refOwner.buttonsContainer.show_general_statistics_btn.setDisabled(false);
                                }
                                this.pipelineLayer.setVisibility(true);
                            }
                        }

                    }
                }, {
                    xtype: 'box',
                    hidden: true,
                    autoEl: {
                        tag: 'i',
                        html: 'Query By Book Points Coming Soon',
                        style: 'font-size:9px;font-style:italic;font-family: Tahoma;'
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
                    //form data
                    filter: 'pipeline',
                    ref: 'pipeline',

                    hiddenName: 'pipeline',

                    //view
                    emptyText: 'Select An Operator Name',
                    fieldLabel: ' Operator Name',
                    anchor: '100%',
                    xtype: 'gxp_searchboxcombo',

                    //behiviour
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
                    sortBy: 'pl_PipelineName',
                    queriableAttributes: [
                        "pl_PipelineName"
                    ],
                    tpl: "<tpl for=\".\"><div class=\"search-item\">{pl_PipelineName}</div></tpl>",
                    recordModel: [{
                        name: 'id',
                        mapping: 'id'
                    }, {
                        name: "pl_PipelineName",
                        mapping: "properties.pl_PipelineName"
                    }, {
                        name: "pl_FERC",
                        mapping: "properties.pl_FERC"
                    }],
                    listeners: {
                        scope: this,
                        select: function (combo, record, index) {
                            combo.refOwner.refOwner.buttonsContainer.btnLookup.setDisabled(false);
                            combo.refOwner.refOwner.buttonsContainer.show_general_statistics_btn.setDisabled(false);
                            
                            var ferc_string = record.get('pl_FERC');
                            var cql_filter_string = "FERC = '"+ferc_string+"'";
                            
                            // add or update layer
                            if(!this.pipelineLayer){
                                
                                var layerProps = Ext.apply(this.pipelineLayerConfig, {
                                    vendorParams: {
                                        cql_filter: cql_filter_string
                                    }
                                });

                                // Create and add layer to map
                                var source = this.target.tools.addlayer.checkLayerSource(this.geoServerUrl);
                                var layerRecord = source.createLayerRecord(layerProps);
                                this.pipelineLayer = layerRecord.getLayer();
                                this.target.mapPanel.layers.add([layerRecord]);
                                
                            }else{
                                // merge params to layer
                                this.pipelineLayer.vendorParams = Ext.apply(this.pipelineLayer.vendorParams,{
                                    cql_filter: cql_filter_string
                                });

                                this.pipelineLayer.mergeNewParams({
                                    cql_filter: cql_filter_string
                                });
                            }
                            
                            this.pipelineLayer.setVisibility(true);
                            this.pipelineLayerVisible = true;
                                
                            /* Dates will not be updated in this tab
                            // Update the Date fields
                            if(this.canUpdateDates){
                                
                                var form_reference = combo.refOwner.refOwner.getForm();
                                
                                // Get values from WFS  
                                var statsStore = new Ext.data.JsonStore({
                                    root: 'features',
                                    autoLoad: true,
                                    fields: [
                                       {name: 'min_eff', type: 'date', mapping: 'properties.min_eff'},
                                       {name: 'max_eff', type: 'date', mapping: 'properties.max_eff'}
                                    ],
                                    url: this.geoServerUrl,
                                    baseParams: Ext.apply({
                                        service: 'WFS',
                                        version: '1.1.0',
                                        request: 'GetFeature',
                                        outputFormat: 'application/json',
                                        typeName: 'gascapacity:gcd_v_capacities_stats' ,
                                        viewParams: 'FERC:'+ferc_string,
                                        maxFeatures: 1
                                    }, this.vendorParams),
                                    listeners:{
                                        scope: form_reference,
                                        load:function(){
                                            var stats_record = statsStore.getAt(0);
                                            // Update UI
                                            if(stats_record){
                                                this.findField('start').setValue(stats_record.data.min_eff);
                                                this.findField('end').setValue(stats_record.data.max_eff);
                                            }
                                            
                                        }
                                    }
                                });
                            }
                            */
                            
                        }
                    }
                }, {
                    //TODO state/country selection (2 columns)
                    layout: 'column',
                    ref: 'state',
                    //allow to hide/show
                    filter: 'state',
                    hidden: true,
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                            xtype: 'gxp_searchboxcombo',
                            fieldLabel: 'State',
                            ref: '../state',
                            name: 'state',
                            anchor: '100%',
                            mapPanel: this.target.mapPanel,
                            //behiviour
                            avoidSelectEvent: true,
                            hideTrigger: false,
                            triggerAction: 'all',
                            forceSelected: true,
                            clearOnFocus: false,
                            allowBlank: false,
                            typeAhead: false,

                            //data
                            url: this.geoServerUrl,
                            typeName: this.statesLayer,
                            mapPanel: this.target.mapPanel,
                            displayField: 'st_StateName',
                            valueField: 'st_FIPS',
                            sortBy: 'st_StateName',
                            queriableAttributes: [
                                "st_StateName", "st_StateAbbreviation"
                            ],
                            tpl: "<tpl for=\".\"><div class=\"search-item\">{st_StateName}({st_StateAbbreviation})</div></tpl>",
                            recordModel: [{
                                name: 'id',
                                mapping: 'id'
                            }, {
                                name: "st_StateName",
                                mapping: "properties.st_StateName"
                            }, {
                                name: "st_StateAbbreviation",
                                mapping: "properties.st_StateAbbreviation"
                            }, {
                                name: "st_FIPS",
                                mapping: "properties.st_FIPS"
                            }],

                            listeners: {
                                select: {
                                    fn: function (combo, record) {
                                        var country = this.refOwner.country;
                                        country.clearValue();
                                        country.setDisabled(false);
                                        country.vendorParams = {
                                            //cql_filter: "cnty_StateFIPS = '" + record.get(combo.valueField) + "'"
                                            viewparams : this.createViewParams()
                                        };
                                    },
                                    scope: this
                                }
                            }
                        }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        fieldLabel: 'Country',
                        items: [{
                            xtype: 'gxp_searchboxcombo',
                            ref: '../country',
                            fieldLabel: 'Country',
                            displayField: 'cnty_CountyName',
                            valueField: 'id',
                            disabled: true,
                            mapPanel: this.target.mapPanel,
                            //behiviour
                            avoidSelectEvent: true,
                            hideTrigger: false,
                            triggerAction: 'all',
                            forceSelected: true,
                            clearOnFocus: false,
                            allowBlank: false,
                            typeAhead: false,

                            url: this.geoServerUrl,
                            typeName: this.countryLayer,
                            valueField: 'cnty_FIPS',
                            sortBy: 'cnty_CountyName',
                            queriableAttributes: [
                                "cnty_CountyName", "cnty_FIPS"
                            ],
                            tpl: "<tpl for=\".\"><div class=\"search-item\">{cnty_CountyName}</div></tpl>",
                            recordModel: [{
                                name: "id",
                                mapping: "id"
                            }, {
                                name: "geometry",
                                mapping: "geometry"
                            }, {
                                name: "cnty_CountyName",
                                mapping: "properties.cnty_CountyName"
                            }, {
                                name: "cnty_StateFIPS",
                                mapping: "properties.cnty_StateFIPS"
                            }, {
                                name: "cnty_FIPS",
                                mapping: "properties.cnty_FIPS"
                            }],
                            name: 'country',
                            anchor: '100%'
                        }]
                    }]

                }, {
                    xtype: 'textfield',
                    ref: 'point',
                    filter: 'point',
                    name: 'point',
                    fieldLabel: 'Enter Part of the Point\'s Name or DRN',
                    hidden: true

                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                            xtype: 'datefield',
                            value: lastweek,
                            fieldLabel: 'From Date',
                            name: 'start',
                            anchor: '100%'
                            /*,
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
                            }*/
                        }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                            xtype: 'datefield',
                            value: today,
                            fieldLabel: 'To Date',
                            name: 'end',
                            anchor: '100%'
                            /*,
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
                            }*/
                        }]
                    }]
                }, {
                    xtype: 'combo',
                    ref: 'pointtype',
                    displayField: 'label',
                    fieldLabel: 'Point Type',
                    valueField: 'id',
                    hiddenName:'ptype',
                    anchor: '100%',
                    autoLoad: true,
                    mode: 'local',
                    forceSelected: true,
                    value: "",
                    allowBlank: false,
                    triggerAction: 'all',
                    //TODO load from db and use this to add the -- All types -- record :
                    // http://www.sencha.com/forum/showthread.php?228925-Add-blank-entry-to-combobox&p=850001&viewfull=1#post850001
                    emptyText: 'Select a Type...',
                    selectOnFocus: true,
                    store: {
                        xtype: 'arraystore',
                        fields: ['id', 'label'],
                        data: this.types

                    }
                }]
            }, {
                xtype: 'fieldset',
                title: 'Summarize Results By:',
                anchor: '100%',
                ref: 'summarize',
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
                    items: [{
                        boxLabel: 'Totals',
                        name: 'aggregation',
                        inputValue: 'sum',
                        checked: true
                    }, {
                        boxLabel: 'Averages',
                        name: 'aggregation',
                        inputValue: 'avg',
                    }]
                    //SEPARATOR
                }
                /*
                , {
                    xtype: 'box',
                    ref: 'separator',
                    autoEl: {
                        tag: 'hr'

                    }
                }, {
                    xtype: 'checkbox',
                    ref: 'aggregate',
                    boxLabel: 'Also Group Aggregates',
                    name: 'aggregate',
                    inputValue: 3
                }
                */
                ]
            },{
                layout: 'hbox',
                ref: 'buttonsContainer',
                pack: 'end',
                items:[{
                    ref: 'btnLookup',
                    xtype: 'button',
                    text: 'Look Up',
                    iconCls: 'gxp-icon-find',
                    disabled: true,
                    scope: this,
                    handler: this.lookupButtonHandler
                },{
                    xtype:'spacer',
                    flex:1
                },{
                    xtype:'button',
                    ref:'show_general_statistics_btn',
                    text: 'Pipeline Statistics',
                    iconCls:'gxp-icon-csvexport-single',
                    disabled:true,
                    scope: this, 
                    handler: function(btn, evt){
                        var values = btn.refOwner.refOwner.getForm().getValues();
                        var pipelineId = values.pipeline;
                        var combobox = btn.refOwner.refOwner.getForm().findField('pipeline');
                        if(!( pipelineId )){
                            Ext.Msg.show({
                               msg: 'Please select a pipeline in the "Refine Query" box',
                               buttons: Ext.Msg.OK,
                               animEl: 'elId',
                               icon: Ext.MessageBox.INFO
                            });
                            return;
                        }
                        var pipelineName = combobox.getRawValue();
                        // record.get("pl_PipelineName");
                        //var record = combobox.findRecord(combobox.valueField, pipelineId);
                        
                        var windowTools = [];
                        if(this.target.userCanPrint()){
                            windowTools = [{
                                id:'print',
                                scope: this,
                                handler: function(event, toolEl, panel){
                                    //regex is for IE11 so we have to use a servlet
                                    if(Ext.isIE11 === undefined){
                                        Ext.isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
                                    }
                                    var me = this;
                                    var target = panel.chartsPanel.getEl().dom;
                                    var tgtparent = target.parentElement;
                                    var data = target.className;
                                    target.className += " html2canvasreset";//set className - Jquery: $(target).addClass("html2canvasreset");
                                    $(target).appendTo(document.body)
                                    html2canvas( target , {
                                            proxy: proxy,
                                           // allowTaint:true,  
                                            //CORS errors not managed with ie11, so disable
                                            useCORS: !Ext.isIE11,
                                            //logging:true,
                                            onrendered: function(c) {
                                                target.className = data;
                                                var canvasData = c.toDataURL("image/png;base64");
                                                if(Ext.isIE || Ext.isIE11){
                                                    me.uploadCanvas(canvasData);
                                                }else{
                                                    me.localDownload(canvasData);
                                                }
                                                $(target).appendTo(tgtparent)
                                            }
                                    });
                                    
                                }
                            }];

                        }
                        
                        new Ext.Window({
                            title: pipelineName +' - Pipeline Statistics',
                            layout: 'border',
                            autoScroll: false,
                            border:false,
                            height: Math.min(Ext.getBody().getViewSize().height,785),
                            maximizable:true,
                            width: 900,
                            items:[{
                                xtype: 'he_pipeline_statistics',
                                ref: 'chartsPanel', 
                                region: 'center',
                                baseParams: Ext.apply({
                                    service:'WFS',
                                    version:'1.1.0',
                                    request:'GetFeature',
                                    outputFormat: 'application/json'
                                }, this.vendorParams ),
                                ferc: pipelineId,
                                pipelineName: pipelineName,
                                border: false
                            }],
                            tools: windowTools
                        }).show();

                    }
                }]
            }],
            buttons: []
        };
        config = Ext.apply(form, config || {});
        

        this.output = gxp.plugins.he.CapacityData.superclass.addOutput.call(this, config);
        
        // Event handlers to react to tab changes
        this.output.on('tabhide', function(){
            if(this.pipelineLayer){
                this.pipelineLayerVisible = this.pipelineLayer.getVisibility();
                this.pipelineLayer.setVisibility(false);
            }
            
            if(this.layerRecord){
                var layer =this.layerRecord.getLayer();
                if(layer){
                    layer.setVisibility(false);
                }
            }

        }, this);
        
        this.output.on('tabshow', function(){
            if(this.pipelineLayer){
                this.pipelineLayer.setVisibility(this.pipelineLayerVisible);
            }
            
            if(this.layerRecord){
                var layer =this.layerRecord.getLayer();
                if(layer){
                    layer.setVisibility(true);
                }
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
            // Add another listener to force the display of the 
            // bottombar when the panel is open for the first time
            container.on({
                'expand' : {
                    fn: function(c){
                            c.doLayout()
                        },
                    scope: this,
                    single: true
                }
            });
        }

        return this.output;
    },
    
    lookupButtonHandler: function () {      
        var values = this.output.getForm().getValues();
        if(values.queryby == 'pipeline'){
            if( !values.pipeline ){
                Ext.Msg.show({
                   
                   msg: 'Please select a pipeline in the "Refine Query" box',
                   buttons: Ext.Msg.OK,
                   animEl: 'elId',
                   icon: Ext.MessageBox.INFO
                });
                return 
            }
            
            if(this.pipelineLayer){
                this.pipelineLayer.setVisibility(true);
                this.pipelineLayerVisible = true;
            }
            
            this.layerName = this.bypipelineLayerName;
        }
        
        if(values.queryby == 'point'){
            if (!values.point){
                Ext.Msg.show({
                   
                   msg: 'Please enter part of the Point\'s Name or DRN',
                   buttons: Ext.Msg.OK,
                   animEl: 'elId',
                   icon: Ext.MessageBox.INFO
                });
                return
            }
            
            if(this.pipelineLayer){
                this.pipelineLayer.setVisibility(false);
                this.pipelineLayerVisible = false;
            }
            
            this.layerName = this.bypointLayerName;
            
            if(this.resultsGrid && this.resultsGrid.ignoreFields && this.resultsGrid.ignoreFields.indexOf("Pipeline") > -1){
                
                this.resultsGrid.ignoreFields.remove("Pipeline");
                
            }
            
        }else{
            
            if(this.resultsGrid && this.resultsGrid.ignoreFields && this.resultsGrid.ignoreFields.indexOf("Pipeline") == -1){
                
                this.resultsGrid.ignoreFields = this.resultsGrid.ignoreFields.concat("Pipeline");
                
            }
            
        }
        
        var viewParams=this.createViewParams();
        var layerProps = {
            title: "Query Result",
            name: this.layerName,
            layers: this.layerName,
            transparent: "true",
            displayInLayerSwitcher: false,
            vendorParams: {
                //cql_filter: cql_filter
                viewparams: viewParams
                //TODO env: parameters for style if needed
            }
        };

        if (!this.layerRecord || this.layerRecord.getLayer().name != this.layerName) {
            
            if(this.layerRecord){
                this.target.mapPanel.layers.remove([this.layerRecord]);
            }
            
            var source = this.target.tools.addlayer.checkLayerSource(this.geoServerUrl);
            var record = source.createLayerRecord(layerProps);
            var wms = record.getLayer();

            var data = {
                title: "Query Results",
                source: this.source,
                name: this.layerName,
                group: "data",
                layer: wms,
                queryable: true,
                selected: true,
                styles: record.get("styles")
            };

            var fields = [{
                name: "name",
                type: "string"
            }, {
                name: "group",
                type: "string"
            }, {
                name: "title",
                type: "string"
            }, {
                name: "selected",
                type: "boolean"
            }, {
                name: "querible",
                type: "boolean"
            }];
            var Record = GeoExt.data.LayerRecord.create(fields);
            this.layerRecord = new Record(data);
            this.target.mapPanel.layers.add([this.layerRecord]);
        } else {
            var layer =this.layerRecord.getLayer();
            layer.mergeNewParams({
                //cql_filter: filter.toString()
                viewparams: viewParams
            });
            
        }
        
        var layer =this.layerRecord.getLayer();
        //target.mapPanel.map.addLayers([wms]);
        layer.vendorParams = Ext.apply(layer.vendorParams,{
                //cql_filter: filter.toString()
                viewparams: viewParams
            });
        // target.mapPanel.map.addControl(control);
        //add to list of layers and controls 

        
        var featureManager = this.target.tools[this.featureManager];
        featureManager.clearFeatureStore();
        featureManager.layerRecord = undefined;
        featureManager.setLayer(this.layerRecord);
        featureManager.loadFeatures();
        var container = this.featureGridContainer ? Ext.getCmp(this.featureGridContainer) : null;
        if(container){
            container.expand();
            this.resultsGridStatus = "expanded";
        }

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
    
    createFilter: function (values) {
        if (values.queryby == 'pipeline') {
            return new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "pntFERC",
                value: values.pipeline
            });
        }

    },
    createViewParams: function(){
        var values = this.output.getForm().getValues();
        var fieldValues = this.output.getForm().getFieldValues();
        
        var startDate = "START_DATE:" + fieldValues.start.format('Y-m-d');
        var endDate = "END_DATE:" + fieldValues.end.format('Y-m-d');;
        var aggregation = "AGGREGATION:" + values.aggregation;
        var viewParams = [startDate,endDate,aggregation];
        
        if(values.pipeline && values.pipeline != ''){
            var ferc = "FERC:" + values.pipeline;
            viewParams.push(ferc);
        }
        
        if(values.ptype && values.ptype != ''){
            var ptype = "PTYPE:" + values.ptype;
            viewParams.push(ptype);
        }
        
        if(values.point && values.point != ''){
            var pnt_query = "PNT_QRY:" + values.point;
            viewParams.push(pnt_query);
        }
        
        return viewParams.join(";");
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
Ext.preg(gxp.plugins.he.CapacityData.prototype.ptype, gxp.plugins.he.CapacityData);