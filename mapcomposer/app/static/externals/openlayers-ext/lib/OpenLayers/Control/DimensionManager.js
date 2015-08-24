/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
* full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the
* full text of the license. */

/**
 * Class: OpenLayers.Control.DimensionManager
 * Control to display and animate map layers across a non-geographic dimension (time, elevation, etc..).
 *
 * Inherits From:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.DimensionManager = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Constant: EVENT_TYPES
     *
     * Supported event types:
     *  - *tick* Triggered when the control advances one step in value.
     *      Listeners receive an event object with a *currentValue* parameter.
     *      Event is fired after the value has been incremented but before the
     *      map or layer display is modified.
     *  - *play* Triggered when the control begins a series animation.
     *  - *stop* Triggered when the control stops a series animation.
     *      Listeners receive an event object with a {Boolean} *rangeExceeded*
     *      property indicating the control stopped due to reaching the end of
     *      its configured value range (true) or due to the stop function call
     *      (false). This event will only fire on the stop function call when
     *      a loop-mode animation is playing.
     *  - *rangemodified* Triggered when the control adds or removes layers which
     *      affect the range or interval of the control or when the range is set
     *      programattically.
     *  - *reset* Triggered when the control resets a series animation.
     *      Listeners receive an event object with a {Boolean} *looped*
     *      property indicating the control reset due to running in looped mode
     *      (true) or the reset function call (false)
     */
    EVENT_TYPES : ["beforetick", "tick", "play", "stop", "reset", "rangemodified"],


    /**
     * APIProperty: layers
     * {Array(<OpenLayers.Layer>)}
     */
    layers : null,

    /**
     * APIProperty: units
     */
    units : null,

    /**
     * APIProperty: dimension
     * {String} The dimension this control manages
     *     Examples: 'time', 'elevation'
     */
    dimension : null,

    /**
     * APIProperty: step
     * {Number} The number of units each tick will advance the current
     *     dimension. Negative units will tick the dimension in reverse.
     *     Default : 1.
     */
    step : 1,

    /**
     * APIProperty: range
     * {Array(Number)} 2 member array containing the minimum and maximum
     *     dimensions that the animation will use. (Optional if using
     *     the intervals property). The 1st value should ALWAYS be less than
     *     the second value. Use negative step values to do reverse stepping.
     */
    range : null,

    /**
     * APIProperty: intervals
     * {Array(Number)} Array of valid distinct dimension values that the
     *     animation can use. (Optional)
     */
    intervals : null,

    /**
     * APIProperty: timespans
     * {Array(Object)} Array of valid start,end,resolution objects
     *     series animation can use. (Optional)
     */
    timespans : null,

    /**
     * APIProperty: frameRate
     * {Number} A positive floating point number of frames (or ticks) per
     *     second to use in series animations. Values less than 1 will
     *     make each tick last for more than 1 second. Example: 0.5 = 1 tick
     *     every 2 seconds. 3 = 3 ticks per second.
     *     Default : 1.
     */
    frameRate : 1,

    /**
     * APIProperty: loop
     * {Boolean} true to continue running the animation until stop is called
     *     Default:false
     */
    loop : false,

    /**
     * APIProperty: snapToIntervals
     * {Boolean} If intervals are configured and this property is true then
     *     tick will advance to the next value in the intervals array
     *     regardless of the step value.
     */
    snapToIntervals : false,

    /**
     * APIProperty: maxFrameDelay
     * {Number} The number of frame counts to delay the firing of the tick event
     *     while the control waits for its dimension agents to be ready to advance.
     *     Default: 1
     */
    maxFrameDelay : 1,

    /**
     * APIProperty: currentValue
     * {Number} The current value of the series animation
     */
    currentValue : null,

    /**
     * Property: timeAgents
     * {Array(<OpenLayers.DimensionAgent>)} An array of the agents that
     *     this control "manages". Read-Only
     */
    dimensionAgents : null,

    /**
     * Property: lastValueIndex
     * {Number} The array index of the last value used in the control when
     * snapToIntevals is true.
     */
    lastValueIndex : -1,

    /**
     * Constructor: OpenLayers.Control.DimensionManager
     * Create a new dimension manager control.
     *
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     control.
     */

    initialize : function(options) {
        options = options || {};
        OpenLayers.Control.prototype.initialize.call(this, options);
        //Handle pre-configured intervals
        if(this.intervals) {
            for(var i = 0, len = this.intervals.length; i < len; i++) {
                var interval = this.intervals[i];
            }
            this.intervals.sort(function(a, b) {
                return a - b;
            });


            this.range = [this.intervals[0], this.intervals[this.intervals.length - 1]];
            this.fixedIntervals = true;
        }
        //Handle pre-configured range
        else if(this.range) {
            if(!(this.range instanceof Array)) {
                this.range = null;
                //TODO throw error rather than failing silently
            }
            else {
                this.fixedRange = true;
            }
        }
        if(this.range && this.range.length) {
            this.currentValue = this.currentValue || this.range[0];
        }
        if(options.layers && !this.dimensionAgents) {
            this.dimensionAgents = this.buildDimensionAgents(options.layers);
            if(this.dimensionAgents.length) {
                this.fixedLayers = true;
            }
        }
        else if(this.dimensionAgents) {
            for(var i = 0, len = this.dimensionAgents.length; i < len; i++) {
                var agent = this.dimensionAgents[i];
                agent.dimensionManager = this;
                this.events.on({
                    'tick' : agent.onTick,
                    scope : agent
                });
            }
        }
        this.events.on({
            'play' : function() {
                if(this.dimensionAgents) {
                    if(!this.units) {
                        this.guessPlaybackRate();
                    }
                    else {
                        this.events.un({
                            'play' : arguments.callee,
                            scope : this
                        });
                    }
                }
                else {
                    //console.warn("Attempting to play a dimension manager control without any dimensional layers");
                    return false;
                }
            },

            scope : this
        });
    },

    /**
     * APIMethod: destroy
     * Destroys the control
     */
    destroy : function() {
        for(var i = this.dimensionAgents.length - 1; i > -1; i--) {
            this.dimensionAgents[i].destroy();
        }
        this.layers = null;
        OpenLayers.Control.prototype.destroy.call(this);
    },

    /**
     * APIMethod: setMap
     * Sets the map parameter of the control. Also called automattically when
     * the control is added to the map.
     * Parameter:
     *    map {<OpenLayers.Map>}
     */
    setMap : function(map) {
        OpenLayers.Control.prototype.setMap.call(this, map);
        //if the control was not directly initialized with specific layers, then
        //get layers from map and build appropiate time agents
        var layers = this.layers || map.layers;
        if(layers) {
            this.layers = [];
        }
        for(var i = 0, len = layers.length; i < len; i++) {
            var lyr = layers[i];
            var dim = this.dimension;
            if(lyr.dimensions && lyr.dimensions[dim]) {!lyr.metadata && (lyr.metadata = {});
                var intervals = this.constructor.extentsToIntervals(lyr.dimensions[dim]);
                if(intervals && intervals.length) {
                    lyr.metadata[dim + 'Interval'] = intervals;
                    this.layers.push(lyr);
                }
            }
        }

        if(!this.dimensionAgents) {
            this.dimensionAgents = this.buildDimensionAgents(this.layers);
        }
        this.validSpans = this.getValidSpans();

        //if no interval was specified & interval !== false, get from dimensionAgents
        if(!this.intervals && this.intervals !== false) {
            this.intervals = this.buildIntervals(this.dimensionAgents);
        }
        //if no range was specified then get from timeAgents
        if(!this.range) {
            this.range = this.buildRange(this.dimensionAgents);
            if(this.range) {
                this.currentValue = this.range[(this.step > 0) ? 0 : 1];
            }
        }
        if(this.range || this.intervals) {
            this.events.triggerEvent('rangemodified');
        }
        //set map agents for layer additions and removal
        this.map.events.on({
            'addlayer' : this.onAddLayer,
            'removelayer' : this.onRemoveLayer,
            scope : this
        });
    },

    onAddLayer : function(evt) {
        var lyr = evt.layer;
        var dim = this.dimension;
        if(lyr.dimensions && lyr.dimensions[dim]) {
            lyr.metadata[dim + 'Interval'] = this.constructor.extentsToIntervals(lyr.dimensions[dim]);
        }
        //don't do anything if layer is non-dimensional
        if(!lyr.metadata[dim + 'Interval']) {
            return;
        }
        else {
            var added = false;
            if(!this.fixedLayers) {
                this.timeAgents || (this.timeAgents = []);
                added = this.addAgentLayer(lyr);
                //check if layer could be used in a dimension agent & if so modify the
                //control range & interval as needed.
                if(added) {
                    var lyrIntervals = lyr.metadata[this.dimension + 'Interval'];
                    if(lyrIntervals.length && !this.fixedIntervals) {
                        this.intervals || (this.intervals = []);
                        var oldIntervalsLen = this.intervals.length, oldRange = [this.range[0] || -1, this.range[1] || 1];
                        this.intervals = this.constructor.getUniqueValues(this.intervals.concat(lyrIntervals));
                        this.validSpans = this.getValidSpans();
                        //adjust range as needed
                        if(!this.range) {
                            this.setRange([this.intervals[0], this.intervals[this.intervals.length - 1]]);
                        }
                        else if(this.intervals[0] < this.range[0] || this.intervals[1] > this.range[1]) {
                            this.setRange([Math.min(this.intervals[0], this.range[0]), Math.max(this.intervals[1], this.range[1])]);
                        }
                        if(oldIntervalsLen != this.intervals.length || oldRange[0] != range[0] || oldRange[1] != range[1]) {
                            this.events.triggerEvent('rangemodified');
                        }
                    }
                    else if(!this.fixedRange) {
                        if(!this.range) {
                            this.setRange([lyrIntervals.start, lyrIntervals.end]);
                        }
                        else if(lyrIntervals.start < this.range[0] || lyrIntervals.end > this.range[1]) {
                            this.setRange([Math.min(lyrIntervals.start, this.range[0]), Math.max(lyrIntervals.end, this.range[1])]);
                        }
                    }
                }
            }
        }
    },

    onRemoveLayer : function(evt) {
        var lyr = evt.layer;
        if(lyr.metadata[this.dimension + 'Interval']) {
            var lyrIntervals = lyr.metadata[this.dimension + 'Interval'];
            var lyrIndex = OpenLayers.Util.indexOf(this.layers, lyr);
            this.layers.splice(lyrIndex, 1);
            this.removeAgentLayer(lyr);

            if(lyrIntervals.length && !this.fixedIntervals) {
                this.intervals = this.buildIntervals(this.dimensionAgents);
                if(this.intervals) {
                    if(this.intervals[0] < this.range[0] || this.intervals[1] > this.range[1]) {
                        this.setRange([Math.max(this.intervals[0], this.range[0]), Math.min(this.intervals[1], this.range[1])]);
                    }
                }
            }
            else if(!this.fixedRange) {
                if(this.timeSpans) {
                    if(lyrIntervals.start < this.range[0] || lyrIntervals.end > this.range[1]) {
                        this.setRange([Math.max(lyrIntervals.start, this.range[0]), Math.min(lyrIntervals.end, this.range[1])]);
                    }
                }
            }
            if(!this.fixedRange && !this.fixedIntervals && !this.intervals && !this.timeSpans) {
                //we have NO time layers
                this.setRange([null, null]);
            }
        }
    },

    /**
     * Method: tick
     * Advance/reverse dimension values one step forward/backward. Fires the 'tick' event
     * if value can be incremented without exceeding the value range.
     *
     */
    tick : function() {
        if(this.intervals && this.snapToIntervals) {
            var newIndex = this.lastValueIndex + ((this.step > 0) ? 1 : -1);
            if(newIndex < this.intervals.length && newIndex > -1) {
                this.currentValue = this.intervals[newIndex];
                this.lastValueIndex = newIndex;
            }
            else {
                //force the currentTime beyond the range
                this.currentValue = (this.step > 0) ? this.range[1] + 100 : this.range[0] - 100;
            }
        }
        else {
            this.incrementValue();
        }
        //test if we have reached the end of our range
        if(this.currentValue > this.range[1] || this.currentValue < this.range[0]) {
            //loop in looping mode
            if(this.loop) {
                this.clearTimer();
                this.currentValue = (this.step > 0) ? this.range[0] : this.range[1];
                this.lastValueIndex = -1;
                this.events.triggerEvent('reset', {
                    'looped' : true
                });
                this.play();
            }
            //stop in normal mode
            else {
                this.clearTimer();
                this.events.triggerEvent('stop', {
                    'rangeExceeded' : true
                });
            }
        }
        else {
            if(this.canTickCheck()) {
                this.events.triggerEvent('tick', {
                    currentValue : this.currentValue
                });
            }
            else {
                var intervalId, checkCount = 0, maxDelays = this.maxFrameDelay * 4;
                intervalId = setInterval(OpenLayers.Function.bind(function() {
                    var doTick = this.canTickCheck() || checkCount++ >= maxDelays;
                    /*if(checkCount > maxDelays) {
                     console.debug('ADVANCED DUE TO TIME LIMIT');
                     }*/
                    if(doTick) {
                        clearInterval(intervalId);
                        this.events.triggerEvent('tick', {
                            currentValue : this.currentValue
                        });
                    }
                }, this), 1000 / (this.frameRate * 4));
            }
        }
    },

    /**
     * APIMethod: play
     * Begins/resumes the series animation. Fires the 'play' event,
     * then calls 'tick' at the interval set by the frameRate property
     */
    play : function() {
        //ensure that we don't have multiple timers running
        this.clearTimer();
        //start playing
        if(this.events.triggerEvent('play') !== false) {
            this.tick();
            this.timer = setInterval(OpenLayers.Function.bind(this.tick, this), 1000 / this.frameRate);
        }
    },

    /**
     * APIMethod: stop
     * Stops the time-series animation. Fires the 'stop' event.
     */
    stop : function() {
        this.clearTimer();
        this.events.triggerEvent('stop', {
            'rangeExceeded' : false
        });
    },

    /**
     * APIMethod: setRange
     * Sets the value range used by this control. Will modify the
     * current value only if the animation is not currently running
     *
     * Parameters:
     * range - {Array(Number)}
     */
    setRange : function(range) {
        var oldRange = [this.range[0], this.range[1]];
        this.range = range;
        //set current value to correct location if the timer isn't running yet.
        if(!this.timer) {
            this.currentValue = this.range[(this.step > 0) ? 0 : 1];
        }
        if(this.range[0] != oldRange[0] || this.range[1] != oldRange[1]) {
            this.events.triggerEvent("rangemodified");
        }
    },

    /**
     * APIMethod: setStart
     * Sets the start value for an animation. If the step is negative then this
     * sets the maximum value in the control's range parameter. Will only effect
     * the currentValue if an animation has not begun.
     *
     * Parameters:
     * value - {Number}
     */
    setStart : function(value) {
        this.range[(this.step > 0) ? 0 : 1] = time;
        //set current value to this start time if we haven't already started
        if(!this.timer) {
            this.currentValue = value;
        }
        this.events.triggerEvent("rangemodified");
    },

    /**
     * APIMethod:setEnd
     * Sets the end value for an animation. If the step is negative then this
     * sets the minimum value in the control's range parameter. Will not effect
     * the current value.
     *
     * Parameters:
     * value - {Number}
     */
    setEnd : function(value) {
        this.range[(this.step > 0) ? 1 : 0] = value;
        this.events.triggerEvent("rangemodified");
    },

    /**
     * APIMethod:setValue
     * Manually sets the currentValue used in the control's animation.
     *
     * Parameters:
     * value - {Number}
     */
    setValue : function(value) {
        if(this.snapToIntervals) {
            var nearest = OpenLayers.Control.DimensionManager.findNearestValues(value, this.intervals);
            if(nearest && nearest.exact > -1) {
                this.currentValue = this.intervals[nearest.exact];
                this.lastValueIndex = nearest.exact;
            }
            else if(nearest && nearest.before > -1) {
                this.currentValue = this.intervals[nearest.before];
                this.lastValueIndex = nearest.before;
            }
        }
        else {
            this.currentValue = value;
        }
        this.events.triggerEvent('tick', {
            'currentValue' : this.currentValue
        });
    },

    /**
     * APIMethod:reset
     * Resets the current value to the animation start value. Fires the 'reset'
     *    event.
     *
     * Returns:
     * {Number} the control's currentValue, which is also the control's start
     *    value
     */
    reset : function() {
        this.clearTimer();
        this.currentValue = this.range[(this.step > 0) ? 0 : 1];
        this.lastValueIndex = (this.step > 0) ? 0 : this.intervals.length - 1;
        this.events.triggerEvent('reset', {
            'looped' : false
        });
        this.events.triggerEvent('tick', {
            'currentValue' : this.currentValue
        });
        return this.currentValue;
    },

    /**
     * APIMethod: incrementValue
     * Moves the current animation value forward by the specified step
     *
     * Parameters:
     * step - {Number}
     */
    incrementValue : function(step) {
        step = step || this.step;
        this.currentValue = parseFloat(this.currentValue) + parseFloat(step);
    },

    /**
     * Method: buildDimensionAgents
     * Creates the agents "managed" by this control.
     *
     * Parameters:
     * layers - {Array(<OpenLayers.Layer>)}
     * dimension - {String} (OPTIONAL) Dimension agents will control.
     *    Defaults to this.dimension
     *
     * Returns:
     * {Array(<OpenLayers.DimensionAgent>)}
     */
    buildDimensionAgents : function(layers, dimension) {
        layers = layers || this.layers || [];
        dimension = dimension || this.dimension;
        var layerTypes = {};
        var agents = [];
        //categorize layers and separate into arrays for use in subclasses
        for(var i = 0, len = layers.length; i < len; i++) {
            var lyr = layers[i];
            if(lyr.dimensions && lyr.dimensions[dimension] && lyr.metadata && !lyr.metadata[dimension + 'Interval']) {
                lyr.metadata[dimension + 'Interval'] = this.constructor.extentsToIntervals(lyr.dimensions[dimension]);
            }
            //allow user specified overrides and custom behavior
            if(lyr.dimensionAgent) {
                var agent;
                if(lyr.dimensionAgent instanceof Function) {
                    agent = new OpenLayers.DimensionAgent({
                        onTick : lyr.dimensionAgent,
                        layers : [lyr],
                        'dimension' : dimension,
                        dimensionManager : this
                    });
                    delete lyr.dimensionAgent;
                }
                this.events.on({
                    tick : agent.onTick,
                    scope : agent
                });
                agents.push(agent);
            }
            else {
                var lyrClass = lyr.CLASS_NAME.match(/\.Layer\.(\w+)/)[1];
                if(OpenLayers.DimensionAgent[lyrClass]) {
                    if(!layerTypes[lyrClass]) {
                        layerTypes[lyrClass] = [];
                    }
                    layerTypes[lyrClass].push(lyr);
                }
            }
        }

        //create subclassed time agents
        for(var k in layerTypes) {
            var agentOpts = {
                layers : layerTypes[k],
                'dimension' : dimension,
                dimensionManager : this
            };
            var agent;
            if(this.agentOptions && this.agentOptions[k]) {
                OpenLayers.Util.applyDefaults(agentOpts, this.agentOptions[k]);
            }
            agent = new OpenLayers.DimensionAgent[k](agentOpts);
            this.events.on({
                'tick' : agent.onTick,
                scope : agent
            });
            agents.push(agent);
        }
        return (agents.length) ? agents : null;
    },

    removeAgentLayer : function(lyr) {
        //find the agent with the layer
        for(var i = 0, len = this.dimensionAgents.length; i < len; i++) {
            var agent = this.dimensionAgents[i];
            if(OpenLayers.Util.indexOf(agent.layers, lyr) > -1) {
                agent.removeLayer(lyr);
                //if the agent doesn't handle any layers, get rid of it
                if(!agent.layers.length) {
                    this.dimensionAgents.splice(i, 1);
                    agent.destroy();
                }
                this.validSpans = this.getValidSpans();
                break;
            }
        }

    },

    addAgentLayer : function(layer) {
        var added = false;
        var agentClass = layer.CLASS_NAME.match(/\.Layer\.(\w+)/)[1];
        if( agentClass in OpenLayers.DimensionAgent) {
            for(var i = 0, len = this.dimensionAgents.length; i < len; i++) {
                if(!layer.dimensionAgent && this.dimensionAgents[i] instanceof OpenLayers.DimensionAgent[agentClass]) {
                    this.dimensionAgents[i].addLayer(lyr);
                    added = true;
                    break;
                }
            }
        }
        if(!added) {
            var agents = this.buildDimensionAgents([layer]);
            if(agents) {
                this.dimensionAgents.push(agents[0]);
                added = true;
            }
        }
        return added;
    },

    /**
     * Method: buildIntervals
     * Builds an array of distinct values that the dimension agents are
     * configured with
     * Parameters:
     *    agents - {Array(<OpenLayers.DimensionAgent>)}
     *       (Optional) An array of dimension agents to calculate the intervals from.
     *       Defaults to the control's dimensionAgents property.
     * Returns: {Array(Number)}
     */
    buildIntervals : function(agents) {
        agents = agents || this.dimensionAgents || [];
        var intervals = [];
        for(var i = 0, len = agents.length; i < len; i++) {
            var agent = agents[i];
            if(agent.intervals) {
                intervals = intervals.concat(agent.intervals);
            }
        }
        intervals = (intervals.length) ? this.getUniqueDates(intervals) : null;
        return intervals;
    },

    /**
     * Method: buildRange
     * Builds an 2 member array with the overall min & max values that
     * the dimension agents are configured with.
     * Parameters:
     *    agents - {Array(<OpenLayers.DimensionAgent>)}
     *       (Optional) An array of dimension agents to calculate the intervals from.
     *       Defaults to the control's dimensionAgents property.
     * Returns: {Array(Number)}
     */
    buildRange : function(agents) {
        agents = agents || this.timeAgents || [];
        var range = [];
        for(var i = 0, len = agents.length; i < len; i++) {
            var subrange = agents[i].range;
            if(!range[0] || subrange[0] < range[0]) {
                range[0] = subrange[0];
            }
            if(!range[1] || subrange[1] > range[1]) {
                range[1] = subrange[1];
            }
        }
        return (range.length) ? range : null;
    },

    guessPlaybackRate : function() {
        if(!this.dimensionAgents) {
            return false;
        }
        var validDims = this.getValidSpans();
        if(validDims) {
            validDims.sort(function(a, b) {
                //sort by most restrictive range
                var arange = a.end - a.start, brange = b.end - b.start;
                if(arange != brange) {
                    return (arange < brange) ? 1 : -1;
                }
                else {
                    //same range pick largest step
                    return a.resolution.step - b.resolution.step;
                }
            });


            this.setRange([validDims[0].start, validDims[0].end]);
            this.step = validDims[0].resolution.step;
        }
        else if(this.intervals) {
            this.snapToIntervals = true;
        }
        else {
            //guess based on range, take 1/20th of range
            var diff = this.range[1] - this.range[0];
            this.step = diff / 20;
        }
    },

    getValidSpans : function(agents) {
        agents = agents || this.dimensionAgents || [];
        var validDims = [];
        for(var i = 0, len = agents.length; i < len; i++) {
            if(agents[i].validSpans) {
                validDims = validDims.concat(agents[i].validSpans);
            }
        }
        return (validDims.length) ? validDims : null;
    },

    canTickCheck : function() {
        var canTick = false;
        for(var i = 0, len = this.dimensionAgents.length; i < len; i++) {
            canTick = this.dimensionAgents[i].canTick;
            if(!canTick) {
                break;
            }
        }
        return canTick;
    },

    clearTimer : function() {
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    CLASS_NAME : 'OpenLayers.Control.DimensionManager'
});

/** Static Methods **/

OpenLayers.Util.extend(OpenLayers.Control.DimensionManager, {

    /**
     * Method: findNearestValues
     *    Finds the nearest value(s) index for a given test value. If an exact
     *    match is found, it will return the index for that value. However, if
     *    no exact match is found, then it will return the indexes before &
     *    after the test values. If the nearest value is a the end of the range
     *    then it returns -1 for the other values.
     * Parameters:
     *    testValue - {Number} the value to test against the value array.
     *    values - {Array{Number}} the sorted value array.
     * Returns: {Object} or {Boolean} with the following properties:
     *    exact, before, after
     *    All values will be either -1 or the index of the appropriate key. If
     *    an exact value is found both 'before'  and 'after' will always be -1.
     *    If the test value is outside of the range of the values array, then
     *    the function returns false.
     */

    findNearestValues : function(testValue, values) {
        var retObj = {
            exact : -1,
            before : -1,
            after : -1
        };
        //first check if this value is in the array
        var index = OpenLayers.Util.indexOf(values, testValue);
        if(index > -1) {
            //found an exact value
            retObj.exact = index;
        }
        else {
            //no exact value was found. test that this is even in the range
            if(testValue < values[0] || testValue > values[values.length - 1]) {
                //outside of the range, return false
                return false;
            }
            else {
                //test value is within the range, find the nearest indices
                for(var i = 0, len = values.length; i < len; i++) {
                    var diff = testValue - values[i];
                    if(diff < 0) {
                        retObj.after = i;
                        retObj.before = i - 1;
                        break;
                    }
                    else {
                        retObj.before = i;
                    }
                }
            }
        }
        return retObj;
    },

    extentsToIntervals : function(dimension) {
        var intervals = [];
        var values = dimension.values;
        for(var i = 0; i < values.length; ++i) {
            var valueParts = values[i].split("/");
            if(valueParts.length > 1) {
                var min = valueParts[0], max = valueParts[1], res = valueParts[2];
                intervals.push([min, max, res]);
            }
            else {
                intervals.push(valueParts[0]);
            }
        }
        return (intervals.length) ? intervals : null;
    },

    getUniqueValues : function(values) {
        //sort the values
        values.sort(function(a, b) {
            return a - b;
        });

        for(var i = values.length - 1; i > 0; i--) {
            if(values[i] == values[i - 1]) {
                values.splice(i, 1);
            }
        }

        return values;
    }

});
