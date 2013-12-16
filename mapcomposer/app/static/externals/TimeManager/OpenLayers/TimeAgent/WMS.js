/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
* full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the
* full text of the license. */


/**
 * requires OpenLayers/BaseTypes.js
 * requires OpenLayers/BaseTypes/Class.js
 * requires OpenLayers/BaseTypes/Date.js
 * requires OpenLayers/TimeAgent.js
 */

/**
 * Class: OpenLayers.TimeAgent.WMS
 * Class to display and animate WMS layers across time.
 * This class is created by {OpenLayers.Control.TimeManager} instances
 *
 * Inherits From:
 *  - <OpenLayers.TimeAgent>
 */
OpenLayers.TimeAgent.WMS = OpenLayers.Class(OpenLayers.TimeAgent, {
    /**
     * APIProperty: intervalMode
     * {String} If a wms layer has distinct valid time intervals,
     *     then this property will control if and how the animation time is
     *     translated into a valid time instance for the layer
     *     Must be one of:
     *     "lastValid" - continue to display it using the last valid time within
     *         the overall control time range
     *     "nearest" - (Default) use the nearest valid time within the overall
     *         control time range.
     *     "exact" - only display the layer when there's an exact match (to the
     *         grainularity of the step unit) in the control time and an interval
     */
    intervalMode : 'nearest',

    /**
     * Constructor: OpenLayers.Control.TimeManager.WMS
     * Create a new time manager control for temporal WMS layers.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     control.
     */
    initialize : function(options) {
        OpenLayers.TimeAgent.prototype.initialize.call(this, options);
        //add layer loadend listeners
        if(this.layers) {
            for(var i = 0, len = this.layers.length; i < len; i++) {
                this.layers[i].events.on({
                    'loadend' : this.onLayerLoadEnd,
                    'loadstart' : this.onLayerLoadStart,
                    scope : this
                });
            }
        }
    },

    addLayer : function(layer) {
        layer.events.on({
            'loadend' : this.onLayerLoadEnd,
            'loadstart' : this.onLayerLoadStart,
            scope : this
        });
        OpenLayers.TimeAgent.prototype.addLayer.call(this, layer);
    },

    removeLayer : function(layer) {
        layer.events.un({
            'loadend' : this.onLayerLoadEnd,
            'loadstart' : this.onLayerLoadStart,
            scope : this
        });
        OpenLayers.TimeAgent.prototype.removeLayer.call(this, layer);
    },

    destroy : function() {
        for(var i = this.layers.length - 1; i > -1; i--) {
            this.removeLayer(this.layers[i]);
        }
        OpenLayers.TimeAgent.prototype.destroy.call(this);
    },

    onTick : function(evt) {
        this.currentTime = evt.currentTime || this.timeManager.currentTime;
        //console.debug('CurrentTime:' + this.currentTime.toString());
        var inrange=true;  //needed to allow incremental intervals TODO do it in a better way
        //var inrange = this.currentTime <= this.range[1] && this.currentTime >= this.range[0];
        //this is an inrange flag for all the entire time range of layers managed by
        //this time agent and not a specific layer
        if(inrange) {
            var validLayers = OpenLayers.Array.filter(this.layers, function(lyr) {
                return lyr.visibility && lyr.calculateInRange();
            });
            this.loadQueue = validLayers.length;
            
            this.canTick = !this.loadQueue;
            //console.debug('canTick:FALSE\nQueueCount:' + this.loadQueue);
            
            for(var i=0;i<validLayers.length;i++){
                this.applyTime(validLayers[i], this.currentTime);
            }
        }
    },

    applyTime : function(layer, time) {
        var isotime, minTime;
        if(this.rangeMode && layer.metadata.allowRange !== false) {
            if(this.rangeMode == 'range') {
                minTime = new Date(time.getTime());
                if(this.timeManager.units) {
                    if (this.timeManager.units == "Days"){
                        minTime['setUTCDate'](time['getUTCDate']() - this.rangeInterval);
                    }else{
                        minTime['setUTC'+this.timeManager.units](time['getUTC'+this.timeManager.units]() - this.rangeInterval);
                    }
                }
            }
            else {
                minTime = this.range[0];
            }
            isotime = OpenLayers.Date.toISOString(minTime) + '/' + OpenLayers.Date.toISOString(time);
        }
        else if(layer.metadata.timeInterval[0] instanceof Date && this.intervalMode != "exact") {
            //find where this time fits into
            var intervals = layer.metadata.timeInterval;
            var testResults = this.findNearestTimes(time, intervals);
            var wmstime;
            if(testResults.exact !== false) {
                wmstime = intervals[testResults.exact];
            }
            else if(this.intervalMode == "lastValid") {
                wmstime = intervals[testResults.before];
            }
            else if(time - intervals[testResults.before] > time - intervals[testResults.after]) {
                wmstime = intervals[testResults.after];
            }
            else {
                wmstime = intervals[testResults.before];
            }
            isotime = OpenLayers.Date.toISOString(wmstime);
        }
        else {
            //format time in ISO:8601 format
            isotime = OpenLayers.Date.toISOString(time);
        }
        layer.mergeNewParams({
            time : isotime
        });
	
    	/*
        if(!layer.visiblity) {
            layer.setVisibility(true);
        }
	*/
    },

    /**
     *
     * @param {Object} testDate
     * @param {Array[{Date}]} dates - MUST be a sorted date array
     */
    findNearestTimes : function(testDate, dates) {
        var retObj = {
            exact : -1,
            before : -1,
            after : -1
        };
        //first check that this time is in the array
        for(var i = 0, len = dates.length; i < len; i++) {
            if(testDate.getTime() == dates[i].getTime()) {
                retObj.exact = i;
                break;
            }
            else {
                var diff = testDate - dates[i];
                if(diff < 0) {
                    retObj.after = i;
                    if(retObj.before == -1) {
                        retObj.before = 0;
                    }
                    break;
                }
                else {
                    retObj.before = i;
                }
            }
        }
        return retObj;
    },

    onLayerLoadEnd : function() {
        this.loadQueue--;
        //console.debug('QueueCount:' + this.loadQueue);
        if(this.loadQueue <= 0) {
            this.canTick = true;
            //console.debug('canTick:TRUE');
        }
    },

    CLASS_NAME : 'OpenLayers.TimeAgent.WMS'
});
