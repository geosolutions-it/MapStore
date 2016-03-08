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
 *    Base class to create chart in a panel with legend
 *
 */
gxp.charts.ChartJsChart = Ext.extend(Ext.Container, {
    _types: {
        line: 'Line',
        pie: 'Pie',
        dougnut: 'Doughnut',
        bar: 'Bar',
        radar: 'Radar',
        polar: 'PolarArea'
    },
    _legendTemplate: {
        bar: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        line: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        pie: "<ul class=\"<%=name.toLowerCase()%>-legend\"><div><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><div class=\"comm-how\"><%if(segments[i].label){%><%=segments[i].label%><%}%></br><%=Ext.util.Format.number(segments[i].value, '0,000')%></div></div></li><%}%></ul>",
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
    chartOpt: {
        //this.chart = new Chart(ctx).Line(this.lineData,{
        responsive: false,
        animation: false,
        beizerCurve: false,
        maintainAspectRatio: false,
        tooltipTemplate:"<%if (label){%><%=label%>: <%}%><%= Ext.util.Format.number(value, '0,000') %>",
        customTooltips: function(tooltip){
            
            // Hide if no tooltip
            if (!tooltip) {
                return;
            }
            
            var ctx = this.chart.ctx;

            // The following data was already set
            //ctx.font = fontString(this.fontSize,this.fontStyle,this.fontFamily);
            this.xAlign = "center";
            this.yAlign = "above";

            //Distance between the actual element.y position and the start of the tooltip caret
            var caretPadding = this.caretPadding = 2;

            var tooltipWidth = ctx.measureText(this.text).width + 2*this.xPadding,
                tooltipRectHeight = this.fontSize + 2*this.yPadding,
                tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;

            var brokenText;
            if ((this.x + tooltipWidth/2 >this.chart.width)||(this.x - tooltipWidth/2 < 0)){
                // Break the tooltip in 2 parts
                var splitPosition = this.text.lastIndexOf(": ");
                brokenText = [];
                brokenText[0] = this.text.substr(0, splitPosition);
                brokenText[1] = this.text.substr(splitPosition+2, this.text.length);
                
                // Recompute values
                tooltipWidth = Math.max(
                                    ctx.measureText(brokenText[0]).width + 2*this.xPadding,
                                    ctx.measureText(brokenText[1]).width + 2*this.xPadding),
                tooltipRectHeight = 2*this.fontSize + 3*this.yPadding,
                tooltipHeight = tooltipRectHeight + this.caretHeight + caretPadding;
            }
                
            if (this.x + tooltipWidth/2 >this.chart.width){
                this.xAlign = "left";
            } else if (this.x - tooltipWidth/2 < 0){
                this.xAlign = "right";
            }

            if (this.y - tooltipHeight < 0){
                this.yAlign = "below";
            }


            var tooltipX = this.x - tooltipWidth/2,
                tooltipY = this.y - tooltipHeight;
            var caretPadding = this.caretPadding;
            
            switch(this.yAlign)
            {
            case "above":
                //Draw a caret above the x/y
                ctx.beginPath();
                ctx.moveTo(this.x,this.y - caretPadding);
                ctx.lineTo(this.x + this.caretHeight, this.y - (caretPadding + this.caretHeight));
                ctx.lineTo(this.x - this.caretHeight, this.y - (caretPadding + this.caretHeight));
                ctx.closePath();
                ctx.fill();
                break;
            case "below":
                tooltipY = this.y + caretPadding + this.caretHeight;
                //Draw a caret below the x/y
                ctx.beginPath();
                ctx.moveTo(this.x, this.y + caretPadding);
                ctx.lineTo(this.x + this.caretHeight, this.y + caretPadding + this.caretHeight);
                ctx.lineTo(this.x - this.caretHeight, this.y + caretPadding + this.caretHeight);
                ctx.closePath();
                ctx.fill();
                break;
            }

            switch(this.xAlign)
            {
            case "left":
                tooltipX = this.x - tooltipWidth + (this.cornerRadius + this.caretHeight);
                break;
            case "right":
                tooltipX = this.x - (this.cornerRadius + this.caretHeight);
                break;
            }
            
            // Fix ToolTip horizontal alignment
            if (tooltipX > this.chart.width - tooltipWidth/2){
                tooltipX = this.chart.width - tooltipWidth/2 ;
            }
            if (tooltipX - tooltipWidth/2 < 0){
                tooltipX = 0;
            } 
                
            Chart.helpers.drawRoundedRectangle(ctx,tooltipX,tooltipY,tooltipWidth,tooltipRectHeight,this.cornerRadius);

            ctx.fill();

            ctx.fillStyle = this.textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if(brokenText){
                ctx.fillText(brokenText[0], tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2 - this.fontSize + this.yPadding/2);
                ctx.fillText(brokenText[1], tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2 + this.fontSize - this.yPadding/2);
            }else{
                ctx.fillText(this.text, tooltipX + tooltipWidth/2, tooltipY + tooltipRectHeight/2);
            }
        }
    },
    /* ptype =  gxp_chartpanel */
    xtype: "gxp_ChartJsChart",
    updateDelay: 0,
    layout: 'fit',
    deferredRender: false,
    autoScroll: false,
    otherGroupLabel:'Other',
    initComponent: function () {
        this.addEvents('chartrefresh');
        this.addEvents('animationend');
        this.on('resize', this.onResize, this);
        this.on('afterlayout', this.afterLayout, this);
        if(this.initialConfig && this.initialConfig.chartOpt){
            this.chartOpt = Ext.apply(this.chartOpt, this.initialConfig.chartOpt);
        }
        gxp.charts.ChartJsChart.superclass.initComponent.call(this);
    },
    afterLayout: function () {
        if (this.chart) {
            this.setChartDimensions();
            this.chart.stop();
            this.chart.resize(this.chart.render, true);

        }

        var me = this;
        this.chartOpt.onAnimationComplete =  function(){
            me.fireEvent('animationend');
        }
    },

    createChart: function (data, options) {
        this.setChartDimensions();
        if(!this.canvas.getContext){
            G_vmlCanvasManager.initElement(this.canvas);
        }
        var ctx = this.canvas.getContext("2d");
        //apply default configs
        this.chartOpt = Ext.apply(this.chartOpt,{
            responsive: false,
            segmentStrokeWidth : 1,
            legendTemplate : this._legendTemplate[this.type],
            //compatibility with IE <9
            animation: !Ext.isIE8 && !Ext.isIE7 && this.chartOpt.animation
        })
        if(this.data){
            this.chart = new Chart(ctx)[this._types[this.type]](this.data, this.chartOpt);
            if (this.legendRef && this.refOwner[this.legendRef]) {
                var legendHtml = this.chart.generateLegend();
                if(this.ownerCt.ownerCt.chartConfig.chartType === 'bar' || this.ownerCt.ownerCt.chartConfig.chartType === 'line'){
                    this.refOwner[this.legendRef].update('<div><ul class="bar-line-legend"><div><li><span style="background-color:#'+this.color+'"></span><div class="comm-how"> '+this.ownerCt.ownerCt.chartConfig.aggFunction + '(' + this.ownerCt.ownerCt.chartConfig.yaxisValue + ')</br></div></div></li></ul></div>');    
                }else{
                    this.refOwner[this.legendRef].update(legendHtml);
                }
                
            }
        }

    },
    //add the canvas
    afterRender: function () {
        this.canvas = document.createElement("canvas");
       
        var myel = new Ext.Element(this.canvas);
                        //height: "auto !important"
       
        this.canvas.setAttribute("style",'width: 100% !important;maxWidth: 1500px;overflow: hidden;');
        this.canvas.setAttribute("width","200");
        this.canvas.setAttribute("height","200");
        this.getEl().appendChild(myel.dom);
         if(!this.canvas.getContext){
            G_vmlCanvasManager.initElement(this.canvas);
        }
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
            if (this.autoColorOptions && this.data) {
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
         if(!this.canvas.getContext){
            G_vmlCanvasManager.initElement(this.canvas);
        }
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    setChartDimensions: function () {
        var width = this.getWidth(),
            height = this.getHeight() - 5;
        if (this.chart) {
            this.chart.aspectRatio = width / height;
        } else {
            this.canvas.setAttribute("width", width );
            this.canvas.setAttribute("height", height);
        }
    },

    randomColorsRGB: function (total) {
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        //var i = total / 360; // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function (h, s, v, i) {
            var rgb = Ext.ux.ColorPicker.prototype.hsvToRgb(h, s, v);
            return rgb;
            //return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        }
        for (var x = 0; x < total; x++) {
            r.push(hsvToRgb(i * x, 0.57, 0.63, x)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },
    createColorsForData: function () {
        var length = this.data.length;
        var colors = this.generateColors(length);
        //console.log(colors);
        if(colors){
            for (var i = 0; i < length; i++) {
                this.data[i].color = colors[i];
            }
        }
    },


    generateColors: function (total) {
        if (this.autoColorOptions.base) {
            return this.sameToneRangeColors(this.autoColorOptions.base, this.autoColorOptions.range, total, this.autoColorOptions);
        } else {
            return this.randomColorsHEX(total);
        }
    },

    randomColorsHEX: function (total) {
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        //var i = total / 360; // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function (h, s, v, i) {
            var rgb = Ext.ux.ColorPicker.prototype.hsvToRgb(h, s, v);
            //return rgb;
            return "#" + Ext.ux.ColorPicker.prototype.rgbToHex(rgb);
        }
        for (var x = 0; x < total; x++) {
            r.push(hsvToRgb(i * x, 0.57, 0.63, x)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },

    sameToneRangeColors: function (base, range, total, options) {
        //if base is a string i suppose is an hex color
        if(isNaN(parseFloat(base))){
           var hsvbase = this.hexToHsv(base);
            base = hsvbase[0];
        }
        var svstep = 0.50 / (total - 1); // distribute the colors evenly on the sat/value range
        var hstep = range / (total - 1); // distribute the colors evenly on the hue range
        //var i = total / 360; // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        
        if(total == 1){
            svstep = 0.50;
            hstep= range /2;

        }
        for (var x = 0; x < total; x++) {
            var h = base + x * hstep - range / 2;
            var s = v = svstep * x + 0.30
            if (options) {
                h = options.h || h;
                s = options.s || s;
                v = options.v || v;
            }
            //console.log(h,s,v);
            //this is a 1 dimension diagonal sampling of points
            r.push(this.hsvToRgb(h, s, v, x));
        }
        return r;

    },
    hsvToRgb : function (h, s, v, i) {
            var rgb = Ext.ux.ColorPicker.prototype.hsvToRgb(h, s, v);
            //return rgb;
            return "#" + Ext.ux.ColorPicker.prototype.rgbToHex(rgb);
    },
    hexToHsv : function(hex){
        if(hex.length >0){
            if(hex[0]=='#'){
                hex = hex.substring(1);
            }
            var rgb = Ext.ux.ColorPicker.prototype.hexToRgb(hex);
            return Ext.ux.ColorPicker.prototype.rgbToHsv(rgb);
        }
        
    },
    hexToRgba(hex,opacity){
        hex = hex.replace('#','');
        r = parseInt(hex.substring(0,2), 16);
        g = parseInt(hex.substring(2,4), 16);
        b = parseInt(hex.substring(4,6), 16);

        result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
        return result;
    },
    refresh: function(){

        this.datasets = [{
            label: "My First dataset",
            fillColor: this.hexToRgba(this.color,20), // "rgba(151,187,205,0.2)",
            strokeColor: this.hexToRgba(this.color,100), //"rgba(151,187,205,1)",
            pointColor: this.hexToRgba(this.color,100), //"rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: this.hexToRgba(this.color,100), //"rgba(151,187,205,1)",
            data: []
        }];
        
        this.data = this._types[this.type] === 'Pie' ? [] : {
            labels: [],
            datasets: this.datasets
        };
        
        var items = this.store.data.items;
        var othersValue = 0;
        var othersArr = [];
        for (var x = 0; x < items.length; x++) {
            var record = items[x];
            if (this.valueField) {
                
                if(this.groupResultsMoreThan && x >= this.groupResultsMoreThan){
                    //if options groupResultsMoreThan
                    othersValue+=record.data[this.valueField];
                    othersArr.push({
                        value: record.data[this.valueField],
                        label: record.data[this.labelField]
                    });
                }else {
                    if(this._types[this.type] === 'Pie'){
                        this.data.push({
                            value: record.data[this.valueField],
                            label: record.data[this.labelField]
                        });
                    }else{
                        this.data.datasets[0].label = this.labelField;
                        this.data.labels.push(record.data[this.labelField]);
                        this.data.datasets[0].data.push(record.data[this.valueField]);
                    }
                }
            }
        }
        if(this.groupResultsMoreThan){
            
            if(othersArr.length > 1){
                this.data.push({
                    label:this.otherGroupLabel,
                    value:othersValue
                });
            }else if (othersArr.length == 1){
                //if others are only one, show it.
                this.data.push(othersArr[0])
            }
                
        }
        if (this.autoColorOptions && this.data) {
            this.createColorsForData();
        }
        this.createChart();
        this.fireEvent('chartrefresh', this, this.chart);
    },
     bindStore: function (store, initial) {
        if (!initial && this.store) {
            if (store !== this.store && this.store.autoDestroy) {
                this.store.destroy();
            } else {
                this.store.un("datachanged", this.onDataChange, this);
                this.store.un("load", this.onLoad, this);
                this.store.un("loadexception",this.onLoadException,this);
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
    onLoad: function() {
        this.refresh();
        this.getEl().unmask();
    },
    onLoadException: function(){
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
        if(this.mask){
            this.getEl().mask("Please wait...","x-mask-loading");
        }
    }

});
Ext.reg(gxp.charts.ChartJsChart.prototype.xtype, gxp.charts.ChartJsChart);