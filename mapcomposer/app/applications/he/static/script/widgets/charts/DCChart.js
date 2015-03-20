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
gxp.charts.DCChart = Ext.extend(Ext.Container, {
    
    /* ptype =  gxp_chartpanel */
    xtype: "gxp_DCChart",
    updateDelay: 0,
    deferredRender: false,
    autoScroll: false,

    initComponent: function () {

        this.on('resize', this.onResize, this);
        this.on('afterlayout', this.afterLayout, this);
        gxp.charts.DCChart.superclass.initComponent.call(this);
    },
    afterLayout: function () {
        if (this.chart) {
            this.setChartDimensions();

        }


    },

    createChart: function (data, options) {
        this.setChartDimensions();

        this.chart = dc.lineChart("#"+ this.canvasBox.getId());
          
          this.chart.width(960)
            .height(150)
         //   .transitionDuration(500)
        //    .mouseZoomable(true)
        //    .margins({top: 10, right: 10, bottom: 20, left: 40})
            .dimension(this.dateDim) //DATA
            .group(this.hits)
        //    .brushOn(false)			// added for title
            
            .elasticY(true)
            .x(d3.time.scale().domain([this.minDate,this.maxDate]))
            .xAxis();
        dc.renderAll();
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
                    margin:5,
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
        gxp.charts.DCChart.superclass.afterRender.call(this);

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

        gxp.charts.DCChart.superclass.onResize.call(this);

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
        //Data
        // time chart
      this.loadTestData();
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
            this.chart.width(width).height(height);
        }
    },
    loadTestData: function  (){
       var data = [
			{date: "12/27/2012", http_404: 2, http_200: 190, http_302: 100},
			{date: "12/28/2012", http_404: 2, http_200: 10, http_302: 100},
			{date: "12/29/2012", http_404: 1, http_200: 300, http_302: 200},
			{date: "12/30/2012", http_404: 2, http_200: 90, http_302: 0},
			{date: "12/31/2012", http_404: 2, http_200: 90, http_302: 0},
			{date: "01/01/2013", http_404: 2, http_200: 90, http_302: 0},
			{date: "01/02/2013", http_404: 1, http_200: 10, http_302: 1},
			{date: "01/03/2013", http_404: 2, http_200: 90, http_302: 0},
			{date: "01/04/2013", http_404: 2, http_200: 90, http_302: 0},
			{date: "01/05/2013", http_404: 2, http_200: 90, http_302: 0},
			{date: "01/06/2013", http_404: 2, http_200: 200, http_302: 1},
			{date: "01/07/2013", http_404: 1, http_200: 200, http_302: 100}
			];
            var ndx = crossfilter(data);
            var parseDate = d3.time.format("%m/%d/%Y").parse;
            data.forEach(function(d) {
                d.date = Date.parse(d.date);
                d.total= d.http_404+d.http_200+d.http_302;
            });
            this.data = 
            this.dateDim = ndx.dimension(function(d) {return d.date;});
            this.hits = this.dateDim.group().reduceSum(function(d) {return d.total;});
            this.minDate = this.dateDim.bottom(1)[0].date;
            this.maxDate = this.dateDim.top(1)[0].date;

            hitslineChart
    },
    print_filter: function (filter){
        var f=eval(filter);
        if (typeof(f.length) != "undefined") {}else{}
        if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
        if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
        console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
    } 

});
Ext.reg(gxp.charts.DCChart.prototype.xtype, gxp.charts.DCChart);