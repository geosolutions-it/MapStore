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
    gaugeMaxText: "Max",

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
            handler: function() {
                Ext.MessageBox.show({
                    title: 'Info',
                    msg: 'This functionality is not yet implemented!',
                    buttons: Ext.Msg.OK,
                    animEl: 'elId',
                    icon: Ext.MessageBox.INFO
                });
            },
            scope: this
        }];
        return bar;
    },

    createChartTypeCombo: function() {
        var data = [
            [0,this.histogramChartText],
            [1,this.lineChartText],
            [2,this.pieChartText],
            [3,this.gaugeChartText]
        ];
        return {
            xtype: "combo",
            fieldLabel: this.chartTypeLabel,
            store: new Ext.data.SimpleStore({
                data: data,
                fields: ["value", "name"]
            }),
            value: 0,
            originalValue: 0,
            ref: "../chartTypeCombo",
            displayField: "name",
            valueField: "value",
            triggerAction: "all",
            mode: "local",
            editable: false,
            listeners: {
                select: function(combo, record) {
                    if(record.get('value') === 3){
                        this.manageGaugeOptions(true);
                    }else{
                        this.manageGaugeOptions();
                    }
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
            id: "xaxis_id",
            name: "xaxis",
            fieldLabel: this.xAxisLabel,
            attributes: this.attributes,
            allowBlank: true,
            listeners: {
                change: function() {

                },
                scope: this
            }
        };

        var xAxisContainerCfg = Ext.applyIf({
            xtype: "container",
            layout: "form",
            labelWidth: 130,
            hideLabels: false,
            defaults: {anchor: "100%"},
            items: xAxisFieldCfg
        }, xAxisFieldCfg);

        var yAxisFieldCfg = {
            xtype: "gxp_chartfield",
            id: "yaxis_id",
            name: "yaxis",
            fieldLabel: this.yAxisLabel,
            attributes: this.attributes,
            allowBlank: true,
            listeners: {
                change: function() {

                },
                scope: this
            }
        };

        var yAxisContainerCfg = Ext.applyIf({
            xtype: "container",
            layout: "form",
            labelWidth: 130,
            hideLabels: false,
            defaults: {anchor: "100%"},
            items: yAxisFieldCfg
        }, yAxisFieldCfg);

        var gaugeMaxFieldCfg = {
            xtype: "compositefield",
            id: "gaugemax_id",
            name: "gaugemax",
            fieldLabel: this.gaugeMaxText,
            items:[{
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

    manageGaugeOptions: function(show){
        var items = this.childChartContainer.items.items;
        for(var i = 0; i<items.length; i++){
            if(items[i].name === 'gaugemax'){
                show ? items[i].show() : items[i].hide();
                this.childChartContainer.doLayout();
            }
        }
    }

});

/** api: xtype = gxp_chartbuilder */
Ext.reg('gxp_chartbuilder', gxp.ChartBuilder);
