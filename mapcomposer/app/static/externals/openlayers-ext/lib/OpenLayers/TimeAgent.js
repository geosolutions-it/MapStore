/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
* full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the
* full text of the license. */


/**
 * requires OpenLayers/Control/TimeManager.js
 */

/**
 * Class: OpenLayers.TimeAgent.WMS
 * Class to display and animate WMS layers across time.
 * This class is created by {OpenLayers.Control.TimeManager} instances
 *
 * Inherits From:
 *  - <OpenLayers.Class>
 */
OpenLayers.TimeAgent = OpenLayers.Class({
    /**
     * APIProperty: timeManager
     * {<OpenLayers.Control.TimeManager>}
     */
    timeManager : null,
    /**
     * Property: canTick
     * {Boolean}
     */
    canTick : true,
    /**
     * Property: intervals
     * {Array(Date)}
     */
    intervals : null,
    /**
     * Property: range
     * {Array(Date)}
     */
    range : null,
    /**
     * Property: layers
     * {Array(<OpenLayers.Layer>)}
     */
    layers : null,
    /**
     * APIProperty: rangeMode
     * {String} This property will control if and how the animation time is
     *     translated into a time range to display on each tick
     *     Must be one of:
     *      false - set to false to only use single value time parameters (Default)
     *      "range" - use a value range for time
     *      "cumulative" - use a range from the start time to the current time
     */
    rangeMode : false,
    /**
     * APIProperty: rangeInterval
     * {Number} Number of units to add or subtract of the current time to build
     *      a time range to display with each tick.
     *      ONLY used if intervalMode is 'range'
     */
    rangeInterval : null,
    /**
     * Constructor: OpenLayers.Control.TimeManager
     * Create a new time manager control for temporal layers.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     control.
     */
    initialize : function(options) {

        OpenLayers.Util.extend(this, options);

        this.events = new OpenLayers.Events(this, null);

        if(this.eventListeners instanceof Object) {
            this.events.on(this.eventListeners);
        }

        if(this.layers && this.layers.length) {
            var timeConfig = this.buildRangeAndIntervals(this.layers);
            this.range = timeConfig.range;
            this.intervals = timeConfig.intervals;
            this.timeSpans = timeConfig.timeSpans;
            for(var i=0;i<this.layers.length;i++){
                var layer = this.layers[i];
                layer.calculateInRange = OpenLayers.Function.bind(this.calculateLayerInRange, this, layer);
            }
        }
    },

    destroy : function() {
        this.events.destroy();
        this.timeManager.events.unregister('tick', this, this.onTick);
        this.timeManager = this.layers = this.range = this.intervals = null;
    },

    onTick : function() {
        //Implemented By Subclasses
    },

    addLayer : function(layer) {
        this.layers = (!this.layers) ? [layer] : this.layers.concat(layer);
        var timeInterval = layer.metadata.timeInterval;
        if(timeInterval.length == 2) {
            if(timeInterval[0] < this.range[0]) {
                this.range[0] = new Date(timeInterval[0].getDate());
            }
            if(timeInterval[1] > this.range[1]) {
                this.range[1] = new Date(timeInterval[1].getDate());
            }
        }
        else {
            var timeConfig = this.buildRangeAndIntervals(this.layers);
            this.range = timeConfig.range;
            this.intervals = timeConfig.intervals;
            this.timeSpans = timeConfig.timeSpans;
        }
        layer.calculateInRange = OpenLayers.Function.bind(this.calculateLayerInRange, this, layer);
    },

    removeLayer : function(layer) {
        var timespan;
        for(var i = 0, len = this.layers.length; i < len; i++) {
            if(layer == this.layers[i]) {
                this.layers.splice(i, 1);
                if(this.timeSpans){
                    timespan = this.timeSpans[i];
                    this.timeSpans.splice(i, 1);
                }
                break;
            }
        }

            //var timeInterval = layer.metadata.timeInterval;
    
            /*this.timespans should follow the exact same order as the layer array
             timespans are already properly processed into date parts, whereas the
             timeInterval is unpredictable*/
    
            /*if we only had a range and this layer wasn't one of the end points
             then we don't need to do anything, otherwise we might as well rebuild
             the range & intervals*/
            if(this.intervals || timespan.start.getTime() == this.range[0].getTime() || timespan.end.getTime() == this.range[1].getTime()) {
                var timeConfig = this.buildRangeAndIntervals(this.layers);
                this.range = timeConfig.range;
                this.intervals = timeConfig.intervals;
                this.timeSpans = timeConfig.timeSpans;
            }
    },

    buildRangeAndIntervals : function(layers) {
        var range = [], intervals = [], validTimes = [];
        for(var i = 0, len = layers.length; i < len; i++) {
            var timeInterval = (layers[i].metadata) ? layers[i].metadata.timeInterval : null;
            if(!timeInterval && layers[i].dimensions && layers[i].dimensions.time) {
                layers[i].metadata.timeInterval = OpenLayers.Control.TimeManager.prototype.timeExtentsToIntervals.call(null, layers[i].dimensions.time.values);
                timeInterval = layers[i].metadata.timeInterval;
            }
            if(timeInterval) {
                for(var j = 0; j < timeInterval.length; j++) {
                    var tinterval = timeInterval[j];
                    if( tinterval instanceof Array) {
                        var min = OpenLayers.Date.parse(tinterval[0]), max = OpenLayers.Date.parse(tinterval[1]), resolution = tinterval[2] ? this.parseISOPeriod(tinterval[2]) : null;
                        var timeRangeObj = {
                            start : min,
                            end : max,
                            'resolution' : (resolution) ? resolution : null
                        };
                        validTimes.push(timeRangeObj);
                        tinterval = timeRangeObj;
                        if(!range[0] || min < range[0]) {
                            range[0] = min;
                        }
                        if(!range[1] || max > range[1]) {
                            range[1] = max;
                        }
                    }
                    else {
                        if( typeof tinterval == "string") {
                            tinterval = OpenLayers.Date.parse(tinterval);
                        }
                        if(tinterval.start) {
                            intervals.push(tinterval.start, tinterval.end);
                            validTimes.push(tinterval);
                        }
                        else {
                            intervals.push(tinterval);
                        }
                    }
                }
            }
        }
        if(intervals.length) {
            intervals = OpenLayers.Control.TimeManager.prototype.getUniqueDates.call(this,intervals);
            var last = intervals.length - 1;
            if(!range[0] || intervals[0] < range[0]) {
                range[0] = intervals[0];
            }
            if(!range[1] || intervals[last] > range[1]) {
                range[1] = intervals[last];
            }
        }
        else {
            intervals = null;
        }
        return {
            'range' : range,
            'intervals' : intervals,
            'timeSpans' : (validTimes.length) ? validTimes : null
        };
    },

    parseISOPeriod : function(period) {
        var dateRE = [/(\d+)Y/, /(\d+)M/, /(\d+)D/], timeRE = [/(\d+)H/, /(\d+)M/, /(\d+)S/], periods = period.split('P')[1].split('T'), intervalPeriod, d = {};
        if(periods[0]) {
            var dt = periods[0];
            d.years = dt.match(dateRE[0]) ? dt.match(dateRE[0])[1] : null;
            d.months = dt.match(dateRE[1]) ? dt.match(dateRE[1])[1] * ((d.years) ? 12 * d.years : 1) : null;
            d.days = dt.match(dateRE[2]) ? dt.match(dateRE[2])[1] * ((d.months) ? 30 * d.months : 1) : null;
        }
        if(periods[1]) {
            var tm = periods[1];
            d.hours = tm.match(timeRE[0]) ? tm.match(timeRE[0])[1] * ((d.days) ? 24 * d.days : 1) : null;
            d.minutes = tm.match(timeRE[1]) ? tm.match(timeRE[1])[1] * ((d.hours) ? 60 * d.hours : 1) : null;
            d.seconds = tm.match(timeRE[2]) ? tm.match(timeRE[2])[1] * ((d.hours) ? 60 * 60 * d.hours : (d.minutes) ? 60 * d.minutes : 1) : null;
        }
        var unitTest = ['seconds', 'minutes', 'hours', 'days', 'months', 'years'];
        for(var i = 0; i < unitTest.length; ++i) {
            var u = unitTest[i];
            if(d[u]) {
                intervalPeriod = {
                    step : d[u],
                    units : OpenLayers.TimeUnit[u.toUpperCase()]
                };
                break;
            }
        }
        return intervalPeriod;
    },
    
    calculateLayerInRange: function(layer){
        var inRange = OpenLayers.Layer.prototype.calculateInRange.call(layer);
        if(inRange){ 
            var time = this.currentTime || this.timeManager.currentTime;
            if(time){
                var range = [layer.metadata.timeInterval[0],layer.metadata.timeInterval[layer.metadata.timeInterval.length-1]];
                if(time<range[0] || time>range[1]){
                    inRange = false;
                }
            }
        }
        return inRange;
    },

    CLASS_NAME : 'OpenLayers.TimeAgent'
});