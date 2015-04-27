/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */
/**
 * @requires widgets/PlaybackToolbar.js
 * @requires widgets/form/PlaybackModeComboBox.js
 * @requires ../../../../openlayers/lib/OpenLayers/Control/TimeManager.js
 */
/** api: (define)
 *  module = gxp
 *  class = PlaybackOptionsPanel
 *  base_link = `Ext.Panel <http://extjs.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: PlaybackOptionsPanel(config)
 *
 *      A panel for displaying and modifiying the configuration options for the PlaybackToolbar.
 */
gxp.PlaybackOptionsPanel = Ext.extend(Ext.form.FieldSet, {

    /** api: config[viewer]
     *  ``gxp.Viewer``
     */

    /** api: config[playbackToolbar]
     *  ``gxp.PlaybackToolbar``
     */

    /** api: config[timeManager]
     *  ``OpenLayers.Control.TimeManager``
     */
    title: "Date & Time Options",
    layout: "fit",
    collapsible: true,
    collapsed: false,
    height: 300,
    /** i18n */
    optionTitleText: "Date & Time Options",
    rangeFieldsetText: "Time Range",
    animationFieldsetText: "Animation Options",
    startText: 'Start',
    endText: 'End',
    saveText: 'Save',
    cancelText: 'Cancel',
    rangeText: 'Range',
    listOnlyText: 'Use Exact List Values Only',
    stepText: 'Animation Step',
    unitsText: 'Animation Units',
    frameRateText: 'Animation Delay (s)',
    noUnitsText: 'Snap To Time List',
    loopText: 'Loop Animation',
    reverseText: 'Reverse Animation',
    rangeChoiceText: 'Choose the range for the time control',
    rangedPlayChoiceText: 'Playback Mode',
    secondsText: 'Seconds',
    minutesText: 'Minutes',
    hoursText: 'Hours',
    daysText: 'Days',
    monthsText: 'Months',
    yearsText: 'Years',

    /** private: method[initComponent]
     */
    initComponent: function() {
        var config = Ext.applyIf(this.initialConfig, {
            //minHeight:400,

            //minWidth:275,
            title: this.optionTitleText,
            ref: 'optionsPanel',
            items: [{
                xtype: 'form',
                layout: 'form',
                autoScroll: true,
                ref: 'form',
                border: false,
                //bodyStyle: "padding: 10px",
                labelWidth: 10,
                defaultType: 'textfield',
                items: [{
                        xtype: 'fieldset',
                        title: this.rangeFieldsetText,
                        defaultType: 'datefield',
                        labelWidth: 60,
                        items: [{
                            xtype: 'displayfield',
                            text: this.rangeChoiceText
                        }, {
                            //fieldLabel: this.startText,
                            //format: "Y-m-d",
                            xtype: 'xdatetime',
                            disabled : true,
                            id: 'startDate_ID',
                            fieldLabel: this.startText,
                            //width:360,
                            anchor: '-18',
                            timeFormat: 'H:i:s',
                            timeConfig: {
                                altFormats: 'H:i:s',
                                allowBlank: true
                            },
                            dateFormat: 'd-m-Y',
                            dateConfig: {
                                altFormats: 'd-m-Y|Y-n-d',
                                allowBlank: true
                            },
                            listeners: {
                                'select': this.setStartTime,
                                'change': this.setStartTime,
                                scope: this
                            },
                            ref: '../../rangeStartField'
                        }, {
                            //fieldLabel: this.endText,
                            //format: "Y-m-d",
                            xtype: 'xdatetime',
                            id: 'endDate_ID',
                            disabled : true,
                            fieldLabel: this.endText,
                            //width:360,
                            anchor: '-18',
                            timeFormat: 'H:i:s',
                            timeConfig: {
                                altFormats: 'H:i:s',
                                allowBlank: true
                            },
                            dateFormat: 'd-m-Y',
                            dateConfig: {
                                altFormats: 'd-m-Y|Y-n-d',
                                allowBlank: true
                            },
                            listeners: {
                                'select': this.setEndTime,
                                'change': this.setEndTime,
                                scope: this
                            },
                            ref: '../../rangeEndField'
                        }]
                    }, {
                        xtype: 'fieldset',
                        title: this.animationFieldsetText,
                        labelWidth: 130,
                        items: [
                            /* {
                               boxLabel:this.listOnlyText,
                               hideLabel:true,
                               xtype:'checkbox',
                               handler:this.toggleListMode,
                               scope:this,
                               ref:'../../listOnlyCheck'
                             },*/
                            {
                                fieldLabel: this.frameRateText,
                                xtype: 'numberfield',
                                anchor: '-25',
                                enableKeyEvents: true,
                                listeners: {
                                    'change': this.setFrameRate,
                                    scope: this
                                },
                                ref: '../../rateValueField'
                            }, {
                                fieldLabel: this.stepText,
                                id: "animationStepID",
                                xtype: 'combo',
                                anchor: '-25',
                                anchor: '-5',
                                //TODO: i18n these time units
                                store: [
									[5, '5 minuti'],
                                    [15, '15 minuti'],
                                    [60, '1 ora'],
                                    [180, '3 ore'],
                                    [360, '6 ore'],
                                    [720, '12 ore'],
									[23040, '16 giorni']
                                ],
                                valueNotFoundText: this.noUnitsText,
                                mode: 'local',
                                forceSelection: true,
                                autoSelect: false,
                                editable: false,
                                hidden: false,
                                value: 60,
                                triggerAction: 'all',
                                listeners: {
                                    'select': function(cmp, record, index) {

                                        this.setStep(cmp, record, index);

                                        this.replaceTemporalLayers(cmp, record, index);

                                    },
                                    scope: this
                                },
                                ref: '../../stepValueField'
                            },
                            /*{
                                                    fieldLabel: this.rangeText,
                                                    xtype: 'numberfield',
                                                    anchor:'-25',
                                                    enableKeyEvents:true,
                                                    listeners: {
                                                        'change': this.setRange,
                                                        scope: this
                                                    },
                                                    ref: '../../rangeValueField'
                                                }, */
                            {
                                fieldLabel: this.unitsText,
                                xtype: 'combo',
                                anchor: '-5',
                                //TODO: i18n these time units
                                store: [
                                    [OpenLayers.TimeUnit.SECONDS, this.secondsText],
                                    [OpenLayers.TimeUnit.MINUTES, this.minutesText],
                                    [OpenLayers.TimeUnit.HOURS, this.hoursText],
                                    [OpenLayers.TimeUnit.DAYS, this.daysText],
                                    [OpenLayers.TimeUnit.MONTHS, this.monthsText],
                                    [OpenLayers.TimeUnit.YEARS, this.yearsText]
                                ],
                                valueNotFoundText: this.noUnitsText,
                                mode: 'local',
                                forceSelection: true,
                                autoSelect: false,
                                editable: false,
                                hidden: true,
                                value: OpenLayers.TimeUnit.MINUTES,
                                triggerAction: 'all',
                                listeners: {
                                    'select': this.setUnits,
                                    scope: this
                                },
                                ref: '../../stepUnitsField'
                            }, {
                                //TODO: provide user information about these modes (Change to radio group?)
                                fieldLabel: this.rangedPlayChoiceText,
                                xtype: 'gxp_playbackmodecombo',
                                timeAgents: this.timeManager && this.timeManager.timeAgents,
                                anchor: '-5',
                                listeners: {
                                    'modechange': this.setPlaybackMode,
                                    scope: this
                                },
                                ref: '../../playbackModeField',
                                hidden: true
                            }
                        ]
                    }, {
                        xtype: 'checkbox',
                        boxLabel: this.loopText,
                        handler: this.setLoopMode,
                        scope: this,
                        ref: '../loopModeCheck',
                        hidden: true
                    },
                    /*{
                                        xtype:'checkbox',
                                        boxLabel:this.reverseText,
                                        handler:this.setReverseMode,
                                        scope:this,
                                        ref:'../reverseModeCheck'
                                    }*/
                ]
            }],
            listeners: {
                'afterrender': this.populateForm,
                scope: this
            },
            bbar: [{
                text: this.saveText, //'Save',
                iconCls: 'playback-save',
                handler: this.saveValues,
                scope: this
            }, {
                text: this.cancelText, //'Cancel',
                iconCls: 'playback-cancel',
                handler: this.cancelChanges,
                scope: this
            }]
        });
        Ext.apply(this, config);
        gxp.PlaybackOptionsPanel.superclass.initComponent.call(this);
    },
    destroy: function() {
        this.timeManager = null;
        this.playbackToolbar = null;
        this.un('show', this, this.populateForm);
        gxp.PlaybackOptionsPanel.superclass.destroy.call(this);
    },
    setFrameRate: function(cmp, newVal, oldVal) {
        this.timeManager.frameRate = newVal;

    },
    setStartTime: function(cmp, date) {
        this.timeManager.setStart(date);
        this.timeManager.fixedRange = true;
        this.rangeEndField.setMinValue(date);
        this.timeManager.events.triggerEvent("rangemodified");
        this.timeManager.nowtime(false, this.timeManager.step, OpenLayers.Date.toISOString(this.timeManager.range[0]));

    },
    setEndTime: function(cmp, date) {
        this.timeManager.setEnd(date);
        this.timeManager.fixedRange = true;
        this.rangeStartField.setMaxValue(date);
        this.timeManager.events.triggerEvent("rangemodified");
        this.timeManager.nowtime(false, this.timeManager.step, OpenLayers.Date.toISOString(this.timeManager.range[0]));
    },
    toggleListMode: function(cmp, checked) {
        this.stepValueField.setDisabled(checked);
        this.stepUnitsField.setDisabled(checked);
        this.timeManager.snapToIntervals = checked;
    },
    setRange: function(cmp, newVal, oldVal) {

        var range = newVal;
        this.timeManager.nowtime(false, range, OpenLayers.Date.toISOString(this.timeManager.range[0]));

    },
    setUnits: function(cmp, record, index) {
        var units = record.get('field1');
        if (this.timeManager.units != units) {
            this.timeManager.units = units;

            // prende la data di inizio e la data di fine del pannello
            // e invoca la funzione setRange di timeManager per ricalcolare i valori della slide
            //this.timeManager.setRange([this.timeManager.range[0],this.timeManager.range[1]]);
            this.timeManager.events.triggerEvent("rangemodified");
            //this.playbackToolbar.slider.fireEvent('change',this.playbackToolbar.slider,this.playbackToolbar.slider.value,this.playbackToolbar.slider.thumbs[0],false,true);         
            this.timeManager.fixedRange = true;

            if (this.playbackToolbar.playbackMode != 'track') {
                this.timeManager.incrementTime();

                // prende la data di inizio e la data di fine del pannello
                // e invoca la funzione setRange di timeManager per ricalcolare i valori della slide
                this.timeManager.events.triggerEvent("rangemodified");

                this.timeManager.nowtime(false, this.timeManager.step, OpenLayers.Date.toISOString(this.timeManager.range[0]));
                //this.timeManager.setRange([this.timeManager.range[0],this.timeManager.range[1]]);
                this.timeManager.fixedRange = true;

            }
        }
    },
    setStep: function(cmp, record, index) {
        //if(cmp.validate() && newVal){
        var newVal = record.get('field1');
        this.timeManager.step = newVal;

        // prende la data di inizio e la data di fine del pannello
        // e invoca la funzione setRange di timeManager per ricalcolare i valori della slide               
        //this.timeManager.setRange([this.timeManager.range[0],this.timeManager.range[1]]);
        
        //###### this.timeManager.events.triggerEvent("rangemodified");
        
        //this.playbackToolbar.slider.fireEvent('change',this.playbackToolbar.slider,this.playbackToolbar.slider.value,this.playbackToolbar.slider.thumbs[0],false,true);
        
        //###### this.timeManager.fixedRange = true;

        if (this.playbackToolbar.playbackMode == 'range' &&
            this.timeManager.rangeInterval != newVal) {
            this.timeManager.rangeInterval = newVal;
            //this.timeManager.incrementTime(newVal);

            // prende la data di inizio e la data di fine del pannello
            // e invoca la funzione setRange di timeManager per ricalcolare i valori della slide

            this.timeManager.events.triggerEvent("rangemodified");      

            //this.timeManager.nowtime(false, newVal, OpenLayers.Date.toISOString(this.timeManager.range[1]));
            this.timeManager.nowtime(false, newVal, OpenLayers.Date.toISOString(new Date(this.playbackToolbar.slider.thumbs[1].value)));
      
            //this.timeManager.setRange([this.timeManager.range[0],this.timeManager.range[1]]);
            this.timeManager.fixedRange = true;

        }
        //}
    },

    replaceTemporalLayers: function(cmp, record, index) {

        var newVal = record.get('field1');

        var addLayer = app.tools["addlayer"];

        addLayer.useEvents = false;
        
        var statioGroup = app.tools["layertree_plugin"];

        var updatableLayers = app.mapPanel.map.getLayersBy("toUpdate", true);        
        
        var chartsLayers = app.mapPanel.layers.queryBy(function(x){
            return x.get("getGraph");
        });        

        var timeManager = this.timeManager;
        updatableLayers.forEach(function(lyr) {

            if (newVal === 5 && lyr.options.stationPrefix === "raf") {
                lyr.options.toUpdate = false;
            } else {
                lyr.options.toUpdate = true;
            }

            if ((lyr.dimensions && lyr.dimensions.time) || (lyr.metadata.timeInterval && lyr.metadata.timeInterval.length)) {

                if (lyr.options.toUpdate) {
                    var newLayer = lyr.options.stationPrefix + newVal + '_web';

                    app.mapPanel.map.removeLayer(lyr);

                    var resources = [];

                    resources.push({
                        msLayerTitle: lyr.name,
                        msLayerName: newLayer,
                        msGroupName: "Stazioni Meteorologiche",
                        wmsURL: "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/ows",
                        format: "image/png8",
                        customParams: {
                            style: [lyr.params.STYLES],
                            styles: [lyr.params.STYLES],                                                
                            toUpdate: lyr.toUpdate,
                            stationPrefix: lyr.stationPrefix,
                            tiled: false,
                            zoomToExtent: false,
                            visibility: lyr.visibility,
                            allowRange: ("allowRange" in lyr) ? lyr.allowRange : false,
                            getGraph: lyr.options.stationPrefix === "raf" ? false : true,
                            graphTable: newLayer,
                            graphAttribute: ["prec_mm"],
                            cumulative: true,
                            tabCode: "id"
                            
                        }
                    });
                    
                    addLayer.addLayer(
                        resources
                    );

                    timeManager.setNow(timeManager.currentTime);

                } else {

                    timeManager.setNow(timeManager.currentTime);

                }

            }

        });

        var updatableAreaAllerta = app.mapPanel.map.getLayersBy("isAreaAllerta", true);
        
        updatableAreaAllerta.forEach(function(lyr) {

            if ((lyr.dimensions && lyr.dimensions.time) || (lyr.metadata.timeInterval && lyr.metadata.timeInterval.length)) {

                var newLayer = lyr.options.stationPrefix + newVal + '_web_allerta';

                app.mapPanel.map.removeLayer(lyr);

                var resources = [];

                resources.push({
                    msLayerTitle: lyr.name,
                    msLayerName: newLayer,
                    msGroupName: "Elaborazioni Aree di Allerta",
                    wmsURL: "http://geoportale.lamma.rete.toscana.it/geoserver/lamma_stazioni/ows",
                    format: "image/png8",
                    customParams: {
                        style: [lyr.params.STYLES],
                        styles: [lyr.params.STYLES],                        
                        toUpdate: lyr.toUpdate,
                        stationPrefix: lyr.stationPrefix,
                        isAreaAllerta: lyr.isAreaAllerta,
                        tiled: false,
                        zoomToExtent: false,
                        visibility: lyr.visibility,
                        allowRange: ("allowRange" in lyr) ? lyr.allowRange : false
                    }
                });
            
                addLayer.addLayer(
                    resources
                );

                timeManager.setNow(timeManager.currentTime);

            }

        });        

    },

    setPlaybackMode: function(cmp, mode, agents) {
        switch (mode) {
            case 'cumulative':
                this.playbackToolbar.setPlaybackMode('cumulative');
                break;
            case "range":
                this.disableListMode(true);
                this.playbackToolbar.setPlaybackMode("range");
                break;
            default:
                this.playbackToolbar.setPlaybackMode('track');
                break;
        }
        if (mode != "range") {
            this.disableListMode(false);
        }
    },
    disableListMode: function(state) {
        var disable = state !== false;
        if (disable) {
            this.listOnlyCheck.setValue(!disable);
        }
        this.listOnlyCheck.setDisabled(disable);
    },
    setLoopMode: function(cmp, checked) {
        this.timeManager.loop = checked;
    },
    setReverseMode: function(cmp, checked) {
        this.timeManager.step *= -1;
    },
    populateForm: function(cmp) {
        if (this.timeManager) {
            this.rangeStartField.setValue(this.timeManager.range[0]);
            this.rangeStartField.originalValue = this.timeManager.range[0];
            this.rangeEndField.setValue(this.timeManager.range[1]);
            this.rangeEndField.originalValue = this.timeManager.range[1];
            this.rateValueField.setValue(this.timeManager.frameRate);
            this.rateValueField.originalValue = this.timeManager.frameRate;
            this.stepValueField.setValue(this.timeManager.step);
            this.stepValueField.originalValue = this.timeManager.step;
            this.stepUnitsField.setValue(this.timeManager.units);
            this.stepUnitsField.originalValue = this.timeManager.units;
            // this.listOnlyCheck.setValue(this.timeManager.snapToIntervals);
            // this.listOnlyCheck.originalValue = this.timeManager.snapToIntervals;
            var playbackMode = this.playbackToolbar.playbackMode;
            //var playbackMode = 'range';
            if (playbackMode == 'track' || !playbackMode) {
                playbackMode = false;
            }
            /*if(!this.playbackModeField.timeAgents || !this.playbackModeField.timeAgents.length){
                this.playbackModeField.timeAgents = this.timeManager.timeAgents;
            }*/
            this.playbackModeField.setValue(playbackMode);
            this.playbackModeField.originalValue = playbackMode;
            this.loopModeCheck.setValue(this.timeManager.loop);
            this.loopModeCheck.originalValue = this.timeManager.loop;

            /*this.rangeValueField.setValue(this.timeManager.rangeStep);
            this.rangeValueField.originalValue = this.timeManager.rangeStep;*/

            // this.reverseModeCheck.setValue(this.timeManager.step<0);
            // this.reverseModeCheck.originalValue=this.reverseModeCheck.getValue();
            //set min and max for not negative ranges.
            //this.rangeStartField.setMaxValue(this.timeManager.range[1]);
            //this.rangeEndField.setMinValue(this.timeManager.range[0]);
            //disable if range mode 
            /*if(playbackMode == "range"){
                this.listOnlyCheck.setDisabled(true);
            }*/
        }
    },
    saveValues: function(btn) {
        if (this.ownerCt && this.ownerCt.close) {
            this.ownerCt[this.ownerCt.closeAction]();
        }
    },
    cancelChanges: function(btn) {
        this.form.getForm().items.each(function(field) {
            field.setValue(field.originalValue);
        });

        this.timeManager.step = 60;

        this.timeManager.events.triggerEvent("rangemodified");

        this.timeManager.fixedRange = true;

        this.timeManager.currenttime(false,true);

        this.saveValues();
        
        var combo = this.stepValueField;
        combo.setValue(60);
        var record = combo.getStore().getAt(1);
        combo.fireEvent('select',combo,record,1);
        
    }
});

/** api: xtype = gxp_playbackoptions */
Ext.reg('gxp_playbackoptions', gxp.PlaybackOptionsPanel);
