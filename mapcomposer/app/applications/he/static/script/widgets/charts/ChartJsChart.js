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
gxp.charts.ChartJsChart = Ext.extend(Ext.Container, {
    _types:{
        line:'Line',
        pie:'Pie',
        dougnut:'Doughnut',
        bar:'Bar',
        radar:'Radar',
        polar:'PolarArea'
        
    },
     /**
     * autoColorOptions: Object. contains the options to generate automatically colors: 
     * base : from 0 to 360 the hsv to start (e.g. 0 red)
     * range: from 0 to 360 how much have to change the color
     * h: if present, keep hue fixed.
     * s: if present, keep saturation fixed.
     * v: if present, keep value fixed.
     * e.g. To generate a chart with a same tone you kave to change value and saturation
     * and keep the same color as base. So the options will be:
     * {base:90,range:0}
     * e.g. To generate many different colors
     * {base:180,range:360, s: 0.67,v :0.67}
     */
    /**
     * chartOpt: options for the chart
     */
    chartOpt:{
            //this.chart = new Chart(ctx).Line(this.lineData,{
            responsive: false,
            animation: true,
            beizerCurve: false,
            maintainAspectRatio: false,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><div><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><div class=\"comm-how\"><%if(segments[i].label){%><%=segments[i].label%><%}%> <%=segments[i].value%></div></div></li><%}%></ul>"
        },
    /* ptype =  gxp_chartpanel */
    xtype: "gxp_ChartJsChart",
    updateDelay: 0,
    layout: 'fit',
    deferredRender: false,
    autoScroll: false,

    initComponent: function () {

        this.on('resize', this.onResize, this);
        this.on('afterlayout', this.afterLayout, this);
        gxp.charts.ChartJsChart.superclass.initComponent.call(this);
    },
    afterLayout: function () {
        if (this.chart) {
            this.setChartDimensions();
            this.chart.stop();
            this.chart.resize(this.chart.render, true);

        }


    },
    
    createChart: function (data, options) {
        this.setChartDimensions();
        var ctx = this.canvas.getContext("2d");
        this.chart = new Chart(ctx)[this._types[this.type]](this.data, this.chartOpt);
        if(this.legendRef && this.refOwner[this.legendRef]){
            var legendHtml = this.chart.generateLegend();
            this.refOwner[this.legendRef].update(legendHtml);
        }

    },
    //add the canvas
    afterRender: function () {
        this.add({
            xtype: 'box',
            ref: 'canvasBox',
            layout: 'fit',
            autoEl: {
                tag: 'canvas',
                style: {
                    width: "100% !important",
                    maxWidth: "1500px",
                    overflow: 'hidden'
                        //height: "auto !important"
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
        gxp.charts.ChartJsChart.superclass.afterRender.call(this);

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

        gxp.charts.ChartJsChart.superclass.onResize.call(this);

        this.update();
    },
    onMove: function () {
        //TODO
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
            if(this.autoColorOptions){
                this.createColorsForData();
            }
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
    clearCanvas: function () {
        var canvas = this.canvas;
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    setChartDimensions: function () {
        var width = this.getWidth(),
            height = this.getHeight() - 5;
        if (this.chart) {
            this.chart.aspectRatio = width / height;
        } else {
            this.canvas.setAttribute("width", width + "px");
            this.canvas.setAttribute("height", height + "px");
        }
    },
    
    randomColorsRGB: function(total){
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        //var i = total / 360; // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v,i){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return rgb;
            //return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x,0.57, 0.63,x)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },
    createColorsForData:function(){
        var length = this.data.length;
        var colors = this.generateColors(length);
        //console.log(colors);
        for(var i = 0; i < length; i++){
            this.data[i].color = colors[i];
        };
    },
    
    
    generateColors: function(total){
        if(this.autoColorOptions.base){
            return this.sameToneRangeColors(this.autoColorOptions.base, this.autoColorOptions.range,total,this.autoColorOptions) ;
        }else{
            return this.randomColorsHEX(total);
        }
    },
    
    randomColorsHEX: function(total){
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        //var i = total / 360; // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v,i){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            //return rgb;
            return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.57, 0.63,x)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },
    
    sameToneRangeColors: function (base,range,total,options){
         var svstep = 0.50 / (total - 1); // distribute the colors evenly on the sat/value range
         var hstep = range / (total - 1); // distribute the colors evenly on the hue range
        //var i = total / 360; // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v,i){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            //return rgb;
            return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        }
        for (var x=0; x<total; x++)
        {
            var h =base + x * hstep - range/2;
            var s = v = svstep * x + 0.30
            if(options){
                h =options.h || h;
                s =options.s || s;
                v =options.v || v;
            }
            //console.log(h,s,v);
            //this is a 1 dimension diagonal sampling of points
            r.push(hsvToRgb( h , s, v,x)); 
        }
        return r;
    
    }
    

});
Ext.reg(gxp.charts.ChartJsChart.prototype.xtype, gxp.charts.ChartJsChart);