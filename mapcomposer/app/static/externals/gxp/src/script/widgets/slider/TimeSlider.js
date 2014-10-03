/**
 * Copyright (c) 2008-2012 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */
 
/** api: (define)
 *  module = gxp.slider
 *  class = TimeSlider
 *  base_link = `Ext.slider.MultiSlider <http://extjs.com/deploy/dev/docs/?class=Ext.slider.MultiSlider>`_
 */
Ext.ns("gxp.slider");

gxp.slider.TimeSlider = Ext.extend(Ext.slider.MultiSlider, {
    ref : 'slider',
    cls : 'gx_timeslider',
    indexMap : null,
    width : 200,
    animate : false,
    timeFormat : "l, F d, Y g:i:s A",
    timeManager : null,
    playbackMode : 'track',
    autoPlay : false,
    map: null,
    initComponent : function() {
        if(!this.timeManager) {
            this.timeManager = new OpenLayers.Control.TimeManager();
            this.map.addControl(this.timeManager);
        }
                
        if(this.timeManager.timeAgents) {
            if(!this.timeManager.units) {
                this.timeManager.guessPlaybackRate();
            }
            if(this.playbackMode && this.playbackMode != 'track') {
                if(this.timeManager.units) {
                    this.timeManager.incrementTime(this.timeManager.rangeInterval, this.timeManager.units);
                }
            }
        }
        
        var sliderInfo = this.buildSliderValues();
        if(sliderInfo) {
			// TOFIX force timeManager rage to default values
			var oldRange = this.timeManager.range;
			// this method changes rage to the largest interval read from the server
            this.timeManager.guessPlaybackRate();
			this.timeManager.range = oldRange;
			
            var initialSettings = {
                maxValue: sliderInfo.maxValue,
                minValue: sliderInfo.minValue,
                increment : sliderInfo.interval,
                keyIncrement : sliderInfo.interval,
                indexMap : sliderInfo.map,
                values: sliderInfo.values
                //values: [sliderInfo.minValue,sliderInfo.maxValue]
            };
            //set an appropiate time format if one was not specified
            if(!this.initialConfig.timeFormat){
                this.setTimeFormat(gxp.PlaybackToolbar.guessTimeFormat(sliderInfo.interval));
            }
            //modify initialConfig so that it properly
            //reflects the initial state of this component
            Ext.applyIf(this.initialConfig,initialSettings);
            Ext.apply(this,this.initialConfig);
        }
        
        this.timeManager.events.on({
            'rangemodified': this.onRangeModified,
            'tick': this.onTimeTick,
            scope: this
        });
        
        this.plugins = (this.plugins || []).concat(
            [new Ext.slider.Tip({getText:this.getThumbText})]);

        this.listeners = Ext.applyIf(this.listeners || {}, {
            //'changecomplete' : this.onSliderChangeComplete,
            'change' : this.onSliderChangeComplete,
            'dragstart' : function() {
                if(this.timeManager.timer) {
                    this.timeManager.stop();
                    this._restartPlayback = true;
                }
            },
            'beforechange' : function(slider, newVal, oldVal, thumb) {
                var allow = true;
                if(!(this.timeManager.units || this.timeManager.snapToIntervals)) {
                    allow = false;
                }
                 //deny tail slider motion in cumulative playback mode
                else if(this.playbackMode == 'cumulative' && slider.indexMap[thumb.index] == 'tail') {
                    allow = false;
                }
                //deny negative intervals
                if (this.playbackMode !="track"){
                    if (slider.indexMap[thumb.index] == 'tail'){
                        var indexPrimary = thumb.index == 0 ? 1:0;
                        if ( newVal > slider.thumbs[indexPrimary].value) allow = false;
                    }else{
                        var indexTail = thumb.index == 0 ? 1:0;
                        if ( newVal < slider.thumbs[indexTail].value) allow = false;
                    }
                }
                return allow;
            },
           
            'afterrender' : function(slider) {
                this.sliderTip = slider.plugins[0];
                if(this.timeManager.units && slider.thumbs.length > 1) {
                    slider.setThumbStyles();
                }
                //start playing after everything is rendered when autoPlay is true
                if(this.autoPlay) {
                    this.timeManager.play();
                }
            },
            scope : this
        });

        gxp.slider.TimeSlider.superclass.initComponent.call(this);
    },

    beforeDestroy : function(){
        this.map = null;
        gxp.slider.TimeSlider.superclass.beforeDestroy.call(this);
    },

    /** api: method[setPlaybackMode]
     * :arg mode: {String} one of 'track',
     * 'cumulative', or "range"
     *  
     *  Set the playback mode of the control.
     */
    setPlaybackMode: function(mode){
        this.playbackMode = mode;
        var sliderInfo = this.buildSliderValues();
        this.reconfigureSlider(sliderInfo);
        if (this.playbackMode != 'track') {
            this.timeManager.incrementTime(this.timeManager.rangeInterval, 
                this.timeManager.units || 
                    OpenLayers.TimeUnit[gxp.PlaybackToolbar.smartIntervalFormat(sliderInfo.interval).units.toUpperCase()]);
            this.setValue(0,this.timeManager.currentTime.getTime());
        }
        this.setThumbStyles();
    },
    
    setTimeFormat : function(format){
        if(format){
            this.timeFormat = format;
        }
    },
    
    onRangeModified : function(evt) {
        var ctl = this.timeManager;
        if(!ctl.timeAgents || !ctl.timeAgents.length) {
            //we don't have any time agents which means we should get rid of the time manager control
            //we will automattically add the control back when a time layer is added via handlers on the
            //playback plugin or the application code if the playback toolbar was not build via the plugin
            ctl.map.removeControl(this.ctl);
            ctl.destroy();
            ctl = null;
        }
        else {
            var oldvals = {
                start : ctl.range[0].getTime(),
                end : ctl.range[1].getTime(),
                resolution : {
                    units : ctl.units,
                    step : ctl.step
                }
            };
            //ctl.guessPlaybackRate();
            if(ctl.range[0].getTime() != oldvals.start || ctl.range[1].getTime() != oldvals.end ||
                 ctl.units != oldvals.units || ctl.step != oldvals.step) {
                this.reconfigureSlider(this.buildSliderValues());
                
                 if (this.playbackMode == "range") {
                    this.timeManager.incrementTime(ctl.rangeInterval, ctl.units);
                 }
                 
                this.setThumbStyles();
                this.fireEvent('rangemodified', this, ctl.range);
            }
        }
    },
    
    onTimeTick : function(evt) {
        var currentTime = evt.currentTime;
        var curTime = evt.curTime;
        if (currentTime) {
            var toolbar = this.refOwner; //TODO use relay event instead
            var tailIndex = this.indexMap ? this.indexMap.indexOf('tail') : -1;
            var offset = (tailIndex > -1) ? currentTime.getTime() - this.thumbs[0].value : 0;
            
            if(tailIndex > -1) {
                if (!curTime){
                    this.setValue(tailIndex, this.thumbs[tailIndex].value + offset);
                } else{
                    //this.setValue(tailIndex, this.thumbs[tailIndex].value);
                    this.setValue(tailIndex, this.timeManager.range[0].getTime());
                }
            }
            this.setValue(0, evt.currentTime.getTime());
            this.updateTimeDisplay();
            //TODO use relay event instead, fire this directly from the slider
            toolbar.fireEvent('timechange', toolbar, currentTime);
        }
    },
    
    updateTimeDisplay: function(){
		if(this.sliderTip){
			this.sliderTip.onSlide(this,null,this.thumbs[0]);
			this.sliderTip.el.alignTo(this.el, 'b-t?', this.offsets);
		}
    },
    
    buildSliderValues : function() {
        if(!this.timeManager.units && !this.timeManager.snapToIntervals){
            //timeManager is essentially empty if both of these are false/null
            return false;
        }
        else{
            var indexMap = ['primary'], 
                values = [this.timeManager.currentTime.getTime()], 
                min = this.timeManager.range[0].getTime(), 
                max = this.timeManager.range[1].getTime(), 
                then = new Date(min), 
                interval;
            
            if(this.timeManager.units) {
                if (this.timeManager.units == "Days"){
                    var step = parseFloat(then['getUTCDate']()) + parseFloat(this.timeManager.step);
                    var stepTime = then['setUTCDate'](step);
                    interval = stepTime - min;
                }else{
                    var step = parseFloat(then['getUTC' + this.timeManager.units]()) + parseFloat(this.timeManager.step);
                    var stepTime = then['setUTC' + this.timeManager.units](step);
                    interval = stepTime - min;                    
                }
            }
            else {
                interval = false;
            }
            if(this.dynamicRange) {
                var rangeAdj = (min - max) * 0.1;
                values.push( min = min - rangeAdj, max = max + rangeAdj);
                indexMap[1] = 'minTime';
                indexMap[2] = 'maxTime';
            }
            if(this.playbackMode && this.playbackMode != 'track') {
                values.push(min);
                indexMap[indexMap.length] = 'tail';
            }
            //set slider interval based on the interval steps if not determined yet
            if(!interval && this.timeManager.intervals && this.timeManager.intervals.length>2){
                interval = Math.round((max-min)/this.timeManager.intervals.length);
            }

            return {
                'values' : values,
                'map' : indexMap,
                'maxValue' : max,
                'minValue' : min,
                'interval' : interval
            };
        }
    },

    reconfigureSlider : function(sliderInfo) {
        var slider = this;
        slider.setMaxValue(sliderInfo.maxValue);
        slider.setMinValue(sliderInfo.minValue);       
        Ext.apply(slider, {
            increment : sliderInfo.interval,
            keyIncrement : sliderInfo.interval,
            indexMap : sliderInfo.map
        });
        for(var i = 0; i < sliderInfo.values.length; i++) {
            if(slider.thumbs[i]) {
                slider.setValue(i, sliderInfo.values[i]);
            }
            else {
                slider.addThumb(sliderInfo.values[i]);
            }
        }
        //set format of slider based on the interval steps
        if(!sliderInfo.interval && slider.timeManager.intervals && slider.timeManager.intervals.length > 2) {
            sliderInfo.interval = Math.round((sliderInfo.maxValue - sliderInfo.minValue) / this.timeManager.intervals.length);
        }
        this.setTimeFormat(gxp.PlaybackToolbar.guessTimeFormat(sliderInfo.interval));
    },

    setThumbStyles : function() {
        var slider = this;
        var tailIndex = slider.indexMap.indexOf('tail');
        if(slider.indexMap[1] == 'min') {
            slider.thumbs[1].el.addClass('x-slider-min-thumb');
            slider.thumbs[2].el.addClass('x-slider-max-thumb');
        }
        if(tailIndex > -1) {
            var tailThumb = slider.thumbs[tailIndex];
            var headThumb = slider.thumbs[0];
            tailThumb.el.addClass('x-slider-tail-thumb');
            tailThumb.constrain = false;
            headThumb.constrain = false;
        }
        
    },    

    getThumbText: function(thumb) {
	    function prettify( duration ){
			// adapted from http://ejohn.org/files/pretty.js
			var secDiff = ( duration / 1000);
			var dayDiff = Math.floor(secDiff / 86400);
			return dayDiff == 0 && (
						secDiff < 60 && "few seconds" ||
						secDiff < 3600 && Math.floor( secDiff / 60 ) + " minutes" ||
						secDiff < 86400 && Math.floor( secDiff / 3600 ) + " hours") ||
					dayDiff < 7 && dayDiff + " days" ||
					Math.ceil( dayDiff / 7 ) + " weeks";			
		}
		var timeManager = thumb.slider.timeManager;
		var left = prettify(timeManager.range[1].getTime() - timeManager.currentTime.getTime() ) ;
        if(thumb.slider.indexMap[thumb.index] != 'tail') {
            return (new Date(thumb.value).format(thumb.slider.timeFormat))+" - " + left + " left";
        }
        else {
            var formatInfo = gxp.PlaybackToolbar.smartIntervalFormat.call(thumb, thumb.slider.thumbs[0].value - thumb.value);
            return formatInfo.value + ' ' + formatInfo.units;
        }
    },

    onSliderChangeComplete: function(slider, value, thumb, silent){
        var slideTime = new Date(value);
        var timeManager = slider.timeManager;
        //test if this is the main time slider
        switch (slider.indexMap[thumb.index]) {
            case 'primary':
                //if we have a tail slider, then the range interval should be updated first
                var tailIndex = slider.indexMap.indexOf('tail'); 
                if (tailIndex>-1){
                    slider.onSliderChangeComplete(slider,slider.thumbs[tailIndex].value,slider.thumbs[tailIndex],true);
                }
                if (!timeManager.snapToIntervals && timeManager.units) {
                    timeManager.setTime(slideTime);
                }
                else if (timeManager.snapToIntervals && timeManager.intervals.length) {
                    var targetIndex=0;
                    Ext.each(timeManager.intervals,function(date, index, intervals){
                        if(date.getTime() == value){
                            targetIndex = index;
                            //stop processing
                            return false;
                        }
                        else{
                            var diffPrev = value - intervals[targetIndex].getTime();
                            var diffCurr = date.getTime() - value;
                            if(diffPrev<diffCurr){
                                //targetIndex is at the right place, stop
                                return false;
                            } else {
                                targetIndex = index;
                            }
                        }
                    });
                    timeManager.setTime(timeManager.intervals[targetIndex]);
                }
                break;
            case 'min':
                if (value >= timeManager.initialRange[0].getTime()) {
                    timeManager.setStart(new Date(value));
                }
                break;
            case 'max':
                if (value <= timeManager.initialRange[1].getTime()) {
                    timeManager.setEnd(new Date(value));
                }
                break;
            case 'tail':
                var adj = 1;
                //Purposely falling through from control units down to seconds to avoid repeating the conversion factors
                switch (timeManager.units) {
                    case OpenLayers.TimeUnit.YEARS:
                        adj *= 12;
                    case OpenLayers.TimeUnit.MONTHS:
                        adj *= (365 / 12);
                    case OpenLayers.TimeUnit.DAYS:
                        adj *= 24;
                    case OpenLayers.TimeUnit.HOURS:
                        adj *= 60;
                    case OpenLayers.TimeUnit.MINUTES:
                        adj *= 60;
                    case OpenLayers.TimeUnit.SECONDS:
                        adj *= 1000;
                        break;
                }
                for (var i = 0, len = timeManager.timeAgents.length; i < len; i++) {
                    if(timeManager.timeAgents[i].rangeMode == 'range'){    
                        timeManager.timeAgents[i].rangeInterval = (slider.thumbs[0].value - value) / adj;    
                    }
                }
                if(!silent){
                    timeManager.setTime(new Date(slider.thumbs[0].value));
                }
        }
        if (this._restartPlayback) {
            delete this._restartPlayback;
            timeManager.play();
        }
    }

});

Ext.reg('gxp_timeslider', gxp.slider.TimeSlider);