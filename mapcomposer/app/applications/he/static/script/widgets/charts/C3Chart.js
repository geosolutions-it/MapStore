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

Ext.namespace('gxp.charts');

/**
 * @author Lorenzo Natali
 */

/** api: constructor
 *  .. class:: JSChartsPanel(config)
 *
 *    Base class to create chart in a panel
 *
 */
gxp.charts.C3Chart = Ext.extend(Ext.Container, {
    data: [
        {
            value: 300,
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
        },
        {
            value: 50,
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Green"
        },
        {
            value: 100,
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Yellow"
        },
        {
            value: 40,
            color: "#949FB1",
            highlight: "#A8B3C5",
            label: "Grey"
        },
        {
            value: 120,
            color: "#4D5360",
            highlight: "#616774",
            label: "Dark Grey"
        }

    ],
    /* ptype =  gxp_chartpanel */
    xtype: "gxp_C3Chart",
    updateDelay: 0,
    deferredRender: false,
    autoScroll: false,

    initComponent: function () {

        this.on('resize', this.onResize, this);
        this.on('afterlayout', this.afterLayout, this);
        gxp.charts.C3Chart.superclass.initComponent.call(this);
    },
    afterLayout: function () {
        if (this.chart) {
            this.setChartDimensions();

        }


    },

    createChart: function (data, options) {
        this.setChartDimensions();
        if(this.data){
            this.chart = c3.generate({
                bindto: '#' + this.canvasBox.getId(),
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%dZ'
                        }
                    }
                },
                legend: {
                    inset: {
                        anchor: 'top-right',
                        x: 20,
                        y: 10,
                        step: 2
                    }
                },
                data:this.data
            });
        }

    },
    //add the canvas
    afterRender: function () {
        this.add({
            xtype: 'box',
            ref: 'canvasBox',
            layout: 'fit',
            autoEl: {
                tag: 'div',
                html: '&nbsp;',
                style: {
                    margin: 5,
                    width: "100% !important",
                    maxWidth: "1500px",
                    overflow: 'hidden',
                    height: "auto !important"
                }
            },

            listeners: {
                render: {
                    fn: function () {
                        this.refOwner.canvas = this.el.dom;

                    }
                },
                single: true
            }
        });
        //bind the store
        if (this.store) {
            this.bindStore(this.store, true);
        }
        gxp.charts.C3Chart.superclass.afterRender.call(this);

        //bind the component events
        this.bindComponent(true);

        Ext.applyIf(this.chart, {
            renderTo: this.el.dom
        });

        Ext.applyIf(this.chartConfig, {
            //DEFAULTS FOR CHARTS
        });

        this.initEvents();
        // Make a delayed call to update the chart.
        this.update(500);
    },
    bindComponent: function (bind) {
        /**
         * Make the chart update the positions
         * positions are based on the window object and not on the
         * owner object.
         */
        var getWindow = function (parent) {
            if (parent.ownerCt)
                return getWindow(parent.ownerCt)
            else
                return parent;
        }
        var w = getWindow(this);

        if (bind) {
            w.on('move', this.onMove, this);

            if (this.ownerCt)
                this.ownerCt.on('render', this.update, this);
        } else {
            if (this.ownerCt)
                this.ownerCt.un('render', this.update, this);
            w.un('move', this.onMove, this)
        }
    },
    initEvents: function () {
        if (this.loadMask) {
            this.loadMask = new Ext.LoadMask(this.el,
                Ext.apply({
                    store: this.store
                }, this.loadMask));
        }
    },
    //private
    onResize: function () {
        if (this.canvas) {
            this.setChartDimensions();
        }

        gxp.charts.C3Chart.superclass.onResize.call(this);

        this.update();
    },
    onMove: function () {
        if (this.chart) {
            this.chart.flush();
        }
    },
    bindStore: function (store, initial) {
        //TODO
    },
    update: function (delay) {

        var cdelay = delay || this.updateDelay;
        if (!this.updateTask) {
            this.updateTask = new Ext.util.DelayedTask(this.draw, this);
        }
        this.updateTask.delay(cdelay);
    },

    //@deprecated
    onContainerResize: function () {
        this.draw();
    },
    draw: function () {
        //TEST
        if (!this.chart) {
            this.createChart();
        }
        /**
         * Redraw the chart
         */
        if (this.chart && this.rendered) {
            if (this.resizable) {

                // Destroy
                //this.chart.destroy();
                //delete this.chart;
                //this.clearCanvas();

                // Create a new chart
                //this.chart = new Chart(ctx).PolarArea(this.data,{
                //    responsive:true,
                //    maintainAspectRatio:true
                //});
            }

            /**
             * Create the chart
             */
        } else if (this.rendered) {
            // Create the chart

        }
    },
    handleError: function (title, cause) {
        if (this.verbose)
            Ext.Msg.alert(title, cause);
        // TODO: Add doc for this listener and function
        this.fireEvent("charterror", title, cause);
    },

    setChartDimensions: function () {
        var width = this.getWidth(),
            height = this.getHeight();
        if (this.chart) {
            this.chart.resize({
                height: height,
                width: width
            });
        }
    },

    lineData: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    },
     bindStore: function (store, initial) {
        if (!initial && this.store) {
            if (store !== this.store && this.store.autoDestroy) {
                this.store.destroy();
            } else {
                this.store.un("datachanged", this.onDataChange, this);
                this.store.un("load", this.onLoad, this);
                this.store.un("add", this.onAdd, this);
                this.store.un("remove", this.onRemove, this);
                this.store.un("update", this.onUpdate, this);
                this.store.un("clear", this.onClear, this);
                this.store.un("beforeload",this.onBeforeLoad,this);
            }
        }

        if (store) {
            store = Ext.StoreMgr.lookup(store);
            store.on({
                scope: this,
                load: this.onLoad,
                datachanged: this.onDataChange,
                add: this.onAdd,
                remove: this.onRemove,
                update: this.onUpdate,
                beforeload:this.onBeforeLoad,
                clear: this.onClear
            });
        }

        this.store = store;
        if (store && !initial) {
            this.refresh();
        }
    },
    handleError: function (title, cause) {
        if (this.verbose)
            Ext.Msg.alert(title, cause);
        // TODO: Add doc for this listener and function
        this.fireEvent("charterror", title, cause);
    },

    setChartDimensions: function () {
        var width = this.getWidth(),
            height = this.getHeight();
        if (this.canvasBox) {
            var svg = $(this.canvasBox.getEl()).find('svg');
            this.canvasBox.setWidth(width);
            this.canvasBox.setHeight(height);
            svg.attr("height",height);
        }
    },
    refresh: function(){
        this.data = {x:'x',xFormat: '%Y-%m-%dZ'};
        var items = this.store.data.items;
        var cx = ['x'];
        var cy =  ['y'];
        this.data.columns = [cx,cy];
        for (var x = 0; x < items.length; x++) {
            var record = items[x];
            if (this.xField) {
                cx.push(record.data[this.xField]);
                cy.push(record.data[this.yField]);
            }
        }
        this.createChart();
        this.fireEvent('chartrefresh', this, this.chart);
    },
    onLoad: function() {
        this.refresh();
        this.getEl().unmask();
    },
    onDataChange: function(){
    },
    onAdd: function(){
    },
    onRemove:function(){
    },
    onClear:function(){
    },
    onUpdate: function(){
    },
    onBeforeLoad: function(){
        this.getEl().mask("Please wait...","x-mask-loading");
    }

});
Ext.reg(gxp.charts.C3Chart.prototype.xtype, gxp.charts.C3Chart);