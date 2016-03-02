/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include widgets/form/ChartField.js
 */

/** api: (define)
 *  module = gxp
 *  class = ChartBuilder
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: ChartBuilder(config)
 *
 *      Create a panel for assembling Chart Options.
 */
gxp.ChartBuilder = Ext.extend(Ext.Container, {

    /** api: config[allowBlank]
     *  ``Boolean`` Do we allow blank ChartFields? It is safe to say true
     *  here, but for compatibility reasons with old applications, the default
     *  is true.
     */
    allowBlank: true,

    /** api: config[cls]
     *  ``String``
     *  The CSS class to be added to this panel's element (defaults to
     *  ``"gxp-chartbuilder"``).
     */
    cls: "gxp-chartbuilder",
    
    /** i18n */
    createChartText: "Generate",
    histogramChartText: "Histogram",
    lineChartText: "Line",
    pieChartText: "Pie",
    gaugeChartText: "Gauge",
    chartTypeLabel: "Chart type",
    xAxisLabel: "X axis",
    yAxisLabel: "Y axis, Aggregation",
    groupByLabel: "Group by",
    valueLabel: "Value, Aggregation",
    gaugeMaxText: "Max",
    chartPanelTitle: "Chart Panel",

    wpsUrl: null,

    spatialSelectorForm: null,

    getFeaturesFilter: function() {
        return "";
    },

    initComponent: function() {

        this.items = [{
            xtype: "container",
            layout: "form",
            ref: "form",
            //defaults: {anchor: "100%"},
            hideLabels: false,
            labelWidth: 130,
            items: [
                this.createChartTypeCombo(),
                this.createChildChartPanel(),
                {
                    xtype: "toolbar",
                    ref: "../chartToolbar",
                    items: this.createToolBar()
                }
            ]
        }];

        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * builder - {gxp.ChartBuilder} This filter builder.  Call
             *     ``getFilter`` to get the updated filter.
             */
            "change"
        );

        gxp.ChartBuilder.superclass.initComponent.call(this);
    },

    /** private: method[createToolBar]
     */
    createToolBar: function() {
        var bar = [{
            text: this.createChartText,
            iconCls: "gxp-icon-buildchart",
            disabled: false,
            handler: function() {
                var state = this.spatialSelectorForm.getState();
                // Chart configuration
                var chartConfig = {
                    chartType: this.chartTypeCombo.getValue(),
                    title: "New " + this.chartTypeCombo.getValue() + " Chart",
                    typeName:this.attributes.baseParams.TYPENAME,
                    url: this.wpsUrl,
                    // aggType: this.form.yaxisAttributeField.chartAggCombo.getValue(),
                    xaxisValue: this.form.xaxisAttributeField.property.getValue(),
                    yaxisValue: this.form.yaxisAttributeField.property.getValue(),
                    gaugeMax: this.form.gaugemax.gaugemaxfield.getValue(),
                    color:"98BCCE",
                    xFieldType: this.form.xaxisAttributeField.xFieldType.split(":")[1],
                    yFieldType: this.form.yaxisAttributeField.yFieldType.split(":")[1],
                    aggFunction: this.form.yaxisAttributeField.chartAggCombo.lastSelectionText,
                    ogcFilter: this.getFeaturesFilter(),
                    spatialSelectorFormState: state
                };
                this.chartReportingTool.addChart(chartConfig, true);
                this.openReportingTool();
            },
            scope: this
        }];
        return bar;
    },
    openReportingTool: function(){
        
    },
    createChartTypeCombo: function() {
        var data = [
            ['bar',this.histogramChartText],
            ['line',this.lineChartText],
            ['pie',this.pieChartText],
            ['gauge',this.gaugeChartText]
        ];
        return {
            xtype: "combo",
            fieldLabel: this.chartTypeLabel,
            store: new Ext.data.SimpleStore({
                data: data,
                fields: ["value", "name"]
            }),
            value: 'bar',
            originalValue: 'bar',
            ref: "../chartTypeCombo",
            displayField: "name",
            valueField: "value",
            triggerAction: "all",
            mode: "local",
            editable: false,
            listeners: {
                select: function(combo, record) {
                    if(record.get('value') === 'pie'){
                        this.manageChartsFieldsOptions(false,true);
                    }else if(record.get('value') === 'gauge'){
                        this.manageChartsFieldsOptions(true,true);
                    }else{
                        this.manageChartsFieldsOptions(false,false);
                    }
                    
                    this.childChartContainer.ownerCt.xaxisAttributeField.enableDisableChartButton();
                },
                scope: this
            },
            width: 223,
            scope: this
        };
    },

    /** private: method[createChildChartPanel]
     *  :return: ``Ext.Container``
     *
     */
    createChildChartPanel: function() {
        this.childChartContainer = new Ext.Container();

        var xAxisFieldCfg = {
            xtype: "gxp_chartfield",
            name: "xaxis",
            fieldLabel: this.xAxisLabel,
            attributes: this.attributes,
            ref: "../../xaxisAttributeField",
            listeners: {
                change: function() {

                },
                scope: this
            }
        };

        var xAxisContainerCfg = {
            xtype: "container",
            id: "xaxis_id",
            name: "xaxiscontainer",
            layout: "form",
            labelWidth: 130,
            hideLabels: false,
            defaults: {anchor: "100%"},
            items: xAxisFieldCfg
        };

        var yAxisFieldCfg = {
            xtype: "gxp_chartfield",
            name: "yaxis",
            fieldLabel: this.yAxisLabel,
            attributes: this.attributes,
            ref: "../../yaxisAttributeField",
            listeners: {
                change: function() {

                },
                scope: this
            }
        };

        var yAxisContainerCfg = {
            xtype: "container",
            id: "yaxis_id",
            name: "yaxiscontainer",
            layout: "form",
            labelWidth: 130,
            hideLabels: false,
            defaults: {anchor: "100%"},
            items: yAxisFieldCfg
        };

        var gaugeMaxFieldCfg = {
            xtype: "compositefield",
            id: "gaugemax_id",
            name: "gaugemax",
            ref: "../../gaugemax",
            fieldLabel: this.gaugeMaxText,
            items:[{
                ref: "gaugemaxfield",
                xtype: 'numberfield',
                width: 60,
                allowBlank: true
            }],
            listeners: {
                change: function() {

                },
                scope: this
            }
        };

        var gaugeMaxContainerCfg = Ext.applyIf({
            xtype: "container",
            layout: "form",
            labelWidth: 130,
            hideLabels: false,
            hidden: true,
            defaults: {anchor: "100%"},
            items: gaugeMaxFieldCfg
        }, gaugeMaxFieldCfg);

        this.childChartContainer.add(
                xAxisContainerCfg,
                yAxisContainerCfg,
                gaugeMaxContainerCfg
            );

        return this.childChartContainer;
    },

    manageChartsFieldsOptions: function(showMax,groupBy){
        var items = this.childChartContainer.items.items;
        for(var i = 0; i<items.length; i++){
            if(items[i].name === 'gaugemax'){
                if(showMax){
                    items[i].show();
                }else{
                    items[i].hide();
                    items[i].items.items[0].reset();
                }
                this.childChartContainer.doLayout();
            }
            if(items[i].name === 'xaxiscontainer'){
                if(groupBy){
                    if(items[i].el)
                        items[i].el.dom.lastChild.children[0].innerHTML = this.groupByLabel + ":";
                    this.childChartContainer.doLayout();
                }else{
                    if(items[i].el)
                        items[i].el.dom.lastChild.children[0].innerHTML = this.xAxisLabel + ":";
                    this.childChartContainer.doLayout();
                }
            }
            if(items[i].name === 'yaxiscontainer'){
                if(groupBy){                
                    if(items[i].el)
                        items[i].el.dom.lastChild.children[0].innerHTML = this.valueLabel + ":";
                    this.childChartContainer.doLayout();
                }else{
                    if(items[i].el)
                        items[i].el.dom.lastChild.children[0].innerHTML = this.yAxisLabel + ":";
                    this.childChartContainer.doLayout();
                }
            }
        }
    },
    
    checkAxisFilled: function(chartConfig){
        if(!chartConfig.xaxis || !chartConfig.xaxis){
            Ext.MessageBox.show({
                title: 'Info',
                msg: 'Devi selezionare ',
                buttons: Ext.Msg.OK,
                animEl: 'elId',
                icon: Ext.MessageBox.INFO
            });
            return;
        }
    }

});

/** api: xtype = gxp_chartbuilder */
Ext.reg('gxp_chartbuilder', gxp.ChartBuilder);
