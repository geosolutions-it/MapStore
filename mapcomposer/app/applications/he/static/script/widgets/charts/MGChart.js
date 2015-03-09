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
gxp.charts.MGChart = Ext.extend(Ext.Container, {
    data: [
        
    ],
    /* ptype =  gxp_chartpanel */
    xtype: "gxp_MGChart",
    updateDelay: 0,
    deferredRender: false,
    autoScroll: false,

    initComponent: function () {

        this.on('resize', this.onResize, this);
        this.on('afterlayout', this.afterLayout, this);
        gxp.charts.MGChart.superclass.initComponent.call(this);
    },
    afterLayout: function () {
        if (this.chart) {
            this.setChartDimensions();

        }


    },

    createChart: function (data, options) {
        this.setChartDimensions();
        /*
        MG.data_graphic({
            title: "Downloads",
            description: "This graphic shows a time-series of downloads.",
            data: [{'date':new Date('2014-11-01'),'value':12},
                   {'date':new Date('2014-11-02'),'value':18}],
            width: 600,
            height: 250,
            target: '#'+ this.canvasBox.getId(),
            x_accessor: 'date',
            y_accessor: 'value',
        })
        
        */
        var me = this;
        //d3.json('data/fake_users1.json', function(data) {
        var data=[]
        if(this.data){
            var min = Number.POSITIVE_INFINITY;
            var max = Number.NEGATIVE_INFINITY;
            for(var i = 0; i< this.data.length; i++){
                var datum = this.data[i];
                datum.date = new Date(datum.date);
                data.push(datum);
                max = max > datum.value ? max : datum.value;
                min = min < datum.value ? min : datum.value;
            }
            var fake_baselines = [{value: 160000000, label: 'a baseline'}];
            
                // add a line chart
            MG.data_graphic({
                    title: this.title,
                    y_label: this.y_label,
                    x_label: this.x_label,
                    buffer:10,
                    data: this.data,
                    full_width:true,
                    full_height:true,
                    small_text:true,
                    inflator: 9/10,
                    max_y: max,
                    //min_y_from_data: true,
                    //right: torso.right,
                   // baselines: fake_baselines,
                    target: '#'+ me.canvasBox.getId(),
                    x_accessor: 'date',
                    y_accessor: 'value',
                    interpolate: "monotone"
                //});


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
                
                style: {
                    
                    width: "100% !important",
                    maxWidth: "1500px",
                    overflow: 'hidden',
                    height: "100%  !important"
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
        gxp.charts.MGChart.superclass.afterRender.call(this);

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

        gxp.charts.MGChart.superclass.onResize.call(this);

        this.update();
    },
    onMove: function () {
        if (this.chart) {
            this.chart.flush();
        }
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
        if(this.data){
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
        if (this.canvasBox) {
            var svg = $(this.canvasBox.getEl()).find('svg');
            this.canvasBox.setWidth(width);
            this.canvasBox.setHeight(height);
            svg.attr("height",height);
        }
    },
    refresh: function(){
        this.data = [];
        var items = this.store.data.items;
        for (var x = 0; x < items.length; x++) {
            var record = items[x];
            if (this.xField) {
                this.data.push({
                    date: record.data[this.xField],
                    value: record.data[this.yField]
                });
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
Ext.reg(gxp.charts.MGChart.prototype.xtype, gxp.charts.MGChart);