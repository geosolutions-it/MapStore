/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */
/**
 * @requires plugins/Tool.js
 */
/** api: (define)
 *  module = gxp.plugins
 *  class = Synchronizer
 */
/** api: (extends)
 *  plugins/Synchronizer.js
 */
Ext.namespace("gxp.plugins");

// hack from http://troubleshootsfdc.blogspot.it/2010/09/display-extjs-tooltip-on-click-on.html
Ext.ux.ClickToolTip = Ext.extend(Ext.ToolTip, {
    initTarget: function(target) {
        var t;
        if ((t = Ext.get(target))) {
            if (this.target) {
                var tg = Ext.get(this.target);
                this.mun(tg, 'click', this.onTargetOver, this);
                this.mun(tg, 'mouseout', this.onTargetOut, this);
                this.mun(tg, 'mousemove', this.onMouseMove, this);
            }
            this.mon(t, {
                click: this.onTargetOver,
                mouseout: this.onTargetOut,
                mousemove: this.onMouseMove,
                scope: this
            });
            this.target = t;
        }
        if (this.anchor) {
            this.anchorTarget = this.target;
        }
    }
});
Ext.reg('ux.ClickToolTip', Ext.ux.ClickToolTip);


/** api: constructor
 *  .. class:: Synchronizer(config)
 *
 *    update the content of layers and the status of the time slider dynamically.
 */
gxp.plugins.Synchronizer = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_synchronizer */
    ptype: "gxp_synchronizer",

    startTime: null,
    endTime: null,
    timeInterval: null,
    
    // Begin i18n.
    timeIntervalSettingFieldsetTitle: 'Time Interval Settings',
    startTimeLabel: 'Start time',
    endTimeLabel: 'End time',
    refreshIntervalSettingFieldsetTitle: 'Refresh Settings',
    refreshIntervalLabel: 'Refresh interval(s)',
    synchronizationSettingsTitle: 'Synchronization settings',
    updateSynchErrorTitle: 'Cannot update sync configuration',
    updateSynchErrorMsg: 'Invalid values.',
    realTimeSynchButtonTooltip: 'Real time sync',
    synchMenuText: 'Sync',
    settingsMenuText: 'Settings',
    saveSettingsText: 'Save',
    refreshTooltipTitle: 'Refresh attivo',
    // end i18n.
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Synchronizer.superclass.constructor.apply(this, arguments);
        this.timeInterval = config.refreshTimeInterval * 1000;
        this.range = config.range;
        this.startTime = Date.fromISO(this.range[0]);
        //
        //set endTime == currentTime;
        //
        this.d = new Date();
        this.UTC = this.d.getUTCFullYear() + '-' + this.pad(this.d.getUTCMonth() + 1) + '-' + this.pad(this.d.getUTCDate()) + 'T' + this.pad(this.d.getUTCHours()) + ':' + this.pad(this.d.getUTCMinutes()) + ':' + this.pad(this.d.getUTCSeconds()) + 'Z';

        // current date           
        this.currentTime = Date.fromISO(this.UTC);

        // config date
        this.configEndTime = Date.fromISO(this.range[1]);

        //set endTime equal to configTime only if currentTime is greater than configTime
        this.endTime = this.currentTime > this.configEndTime ? this.configEndTime : this.currentTime;

    },

    /** private: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        gxp.plugins.Synchronizer.superclass.init.apply(this, arguments);
    },

    addActions: function() {

        var map = this.target.mapPanel.map;
        var interval;
        var tooltipInterval;
        var self = this;
        var timeVisualization = map.getControlsByClass('OpenLayers.Control.OlTime');

        this.activeIndex = 0;

        this.timeIntervalSettingFieldset = new Ext.form.FieldSet({
            title: this.timeIntervalSettingFieldsetTitle,
            anchor: '100%',
            checkboxToggle : true,
            collapsed : false,
            disabled: false,
            monitorResize : true,
            preventBodyReset : true,
            items: [{
                id: "start-datefield",
                xtype: "datefield",
                fieldLabel: this.startTimeLabel,
                allowBlank: false,
                editable: false,
                width: 105,
                maxValue: self.range[1],
                minValue: self.range[0],
                format: "d/m/Y",
                value: Ext.util.Format.date(self.startTime, "d/m/Y")
            }, {
                id: "end-datefield",
                xtype: 'datefield',
                fieldLabel: this.endTimeLabel,
                allowBlank: false,
                editable: false,
                width: 105,                
                maxValue: self.range[1],
                minValue: self.range[0],
                format: "d/m/Y",
                value: Ext.util.Format.date(self.endTime, "d/m/Y")
            }]/*,
            listeners: {
                afterlayout: function(field){
                    field.syncSize();
                    field.doLayout(false,true);
                }
            }*/
        });
        
        this.refreshIntervalSetting = new Ext.form.FieldSet({
            title: this.refreshIntervalSettingFieldsetTitle,
            layout: 'form',
            items: [
                new Ext.form.NumberField({
                    id: "interval-numberfield",
                    fieldLabel: this.refreshIntervalLabel,
                    allowDecimals: false,
                    maxValue: 60 * 15,
                    minValue: 5,
                    value: self.timeInterval / 1000,
                    allowBlank: false,
                    width: 105
                })
            ]
        });    
        
                
        this.settingsWin = new Ext.Window({
            closable: true,
            title: this.synchronizationSettingsTitle,
            iconCls: "gxp-icon-sync-configuration",
            border: false,
            modal: true,
            width: 300,
            closeAction : 'hide',
            forceLayout: true,
            preventBodyReset: true,
            // height: 200,
            resizable: false,
            listeners: {
                afterlayout: function(win){
                }
            },
            items: [new Ext.form.FormPanel({
                frame: true,
                xtype: 'form',
                border: false,
                autoHeight: true,
                //bodyStyle: 'padding: 5px; 5px; 0px; 5px;',
                defaults: {
                    anchor: '100%',
                    allowBlank: false,
                    msgTarget: 'side',
                    labelWidth: 130
                },
                items: [self.timeIntervalSettingFieldset, self.refreshIntervalSetting],
                buttons: [{
                    text: this.saveSettingsText,
                    formBind: true,
                    handler: function() {
                        var startTimeField = Ext.getCmp("start-datefield");
                        var endTimeField = Ext.getCmp("end-datefield");
                        var intervalField = Ext.getCmp("interval-numberfield");
                        if (startTimeField.isValid(false) && endTimeField.isValid(true) && intervalField.isValid(true)) {
                            self.startTime = new Date(startTimeField.getValue());
                            self.endTime = new Date(endTimeField.getValue());
                            self.timeInterval = intervalField.getValue() * 1000;
                            self.settingsWin.hide();
                        } else {
                            Ext.Msg.show({
                                title: this.updateSynchErrorTitle,
                                msg: this.updateSynchErrorMsg,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    }
                }]
            })]
        });
        
        this.button = new Ext.SplitButton({
            id: "sync-button",
            iconCls: "gxp-icon-real-time",
            tooltip: this.realTimeSynchButtonTooltip,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            allowDepress: true,
            disabled: true,
            handler: function(button, event) {
                if (button.pressed) {
                    button.menu.items.itemAt(this.activeIndex).setChecked(true);
                }
            },
            scope: this,
            listeners: {
                toggle: function(button, pressed) {
                    // toggleGroup should handle this
                    if (!pressed) {
                        button.menu.items.each(function(i) {
                            if (i.setChecked) {
                                i.setChecked(false);
                            }

                        });
                    }
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                }
            },
            menu: new Ext.menu.Menu({
                items: [
                    new Ext.menu.CheckItem({
                        text: this.synchMenuText,
                        iconCls: "gxp-icon-real-time",
                        toggleGroup: this.toggleGroup,
                        group: this.toggleGroup,
                        listeners: {
                            checkchange: function(item, checked) {
                                this.activeIndex = 0;
                                this.button.toggle(checked);
                                if (checked) {

                                    this.setSynchLayersIcon(true);

                                    this.button.setIconClass(item.iconCls);

                                    var synchLayers = this.target.mapPanel.layers;

                                    var timeManager = self.getTimeManager();
                                    var timeToRefresh = self.timeInterval;
                                    
                                    var refresh = function() {
                                    
                                        //var layers = timeManager.layers;
                                        var layers = synchLayers.map.layers;

                                        for (var i = 0; i < layers.length; i++) {
                                            var layer = layers[i];
                                            if (layer.getVisibility()) {

                                                // layer.redraw(true);
                                                if (layer.synch) {
                                                    var timeParam = self.startTime.toISOString() + '/' + self.endTime.toISOString();

                                                    if (layer instanceof OpenLayers.Layer.WMS && layer.dimensions && layer.dimensions.time) {

                                                        layer.mergeNewParams({
                                                            TIME: timeParam,
                                                            fake: (new Date()).getTime()
                                                        });

                                                    } else {

                                                        layer.mergeNewParams({
                                                            fake: (new Date()).getTime()
                                                        });

                                                    }
                                                }
                                            }

                                        }
                                    };

                                    var countDown = function() {
                                        if (self.tooltip && self.tooltip.getEl()) {
                                            self.tooltip.update('next refresh in ' + timeToRefresh / 1000 + ' secs');
                                        }

                                        timeToRefresh -= 1000;
                                        if (timeToRefresh === 0) {
                                            timeToRefresh = self.timeInterval;
                                        }
                                    };

                                    if (timeManager) {
                                        timeManager.stop();
                                        timeManager.toolbar.disable();
                                    }

                                    item.ownerCt.items.items[1].disable();

                                    //timeVisualization[0].div.style.visibility = "hidden";                                                       

                                    //call function in composer.js to disable al functionality
                                    this.disableAllFunc();

                                    self.tooltip = new Ext.ToolTip({
                                        target: 'sync-button',
                                        html: interval / 1000 + ' seconds',
                                        title: '',
                                        autoHide: false,
                                        closable: true,
                                        draggable: true,
                                        autoWidth: true,
                                        anchor: 'bottom'
                                    });
                                    // force show now
                                    self.tooltip.showAt([Ext.getCmp('sync-button').getEl().getX(), Ext.getCmp('sync-button').getEl().getY() + 30]);
                                    //self.tooltip.showBy('sync-button');

                                    if(self.settingsWin.items.items[0].items.items[0].disabled === true){
                                        self.tooltip.setTitle(this.refreshTooltipTitle);
                                    }else {
                                        self.tooltip.setTitle(this.refreshTooltipTitle + '<BR/>Working interval: ' + Ext.util.Format.date(self.startTime, "d/m/Y") + ' to ' + Ext.util.Format.date(self.endTime, "d/m/Y"));                                       
                                    }                                   
                                    
                                    tooltipInterval = setInterval(countDown, 1000);

                                    //
                                    // Fire event in order to refresh the Vehicle selector
                                    //
                                    //this.target.fireEvent('refreshToolActivated');

                                    interval = setInterval(refresh, self.timeInterval);
                                } else {
                                    clearInterval(interval);
                                    var timeManager = self.getTimeManager();

                                    if (timeManager)
                                        timeManager.toolbar.enable();

                                    item.ownerCt.items.items[1].enable();

                                    //timeVisualization[0].div.style.visibility = "visible";     

                                    //call function in composer.js to enable al functionality
                                    this.enableAllFunc();

                                    if (self.tooltip) {
                                        self.tooltip.destroy();
                                        clearInterval(tooltipInterval);
                                    }

                                    this.setSynchLayersIcon(false);

                                }
                            },
                            scope: this
                        },
                        scope: this
                    }), {
                        text: this.settingsMenuText,
                        iconCls: "gxp-icon-sync-configuration",
                        toggleGroup: this.toggleGroup,
                        group: this.toggleGroup,
                        disabled: false,
                        handler: function() {
                            // open modal window
                            this.settingsWin.show();
                        },
                        scope: this
                    }
                ]
            })
        });

        this.target.on("timemanager", function() {
            self.getTimeManager();
        });

        var actions = [
            this.button
        ];
        return gxp.plugins.Synchronizer.superclass.addActions.apply(this, [actions]);
    },

    getTimeManager: function() {
        if (!this.timeManager) { // if it is not initialized
            var timeManagers = this.target.mapPanel.map.getControlsByClass('OpenLayers.Control.TimeManager');
            if (timeManagers.length <= 0) {
                //console.error('Cannot init Synchronizer: no TimeManager found');
                return;
            }
            this.timeManager = timeManagers[0];
            var self = this;
            // listen to play events
            this.timeManager.events.register('play', this,
                function() {
                    if (self.button.pressed) {
                        self.button.toggle();
                    }
                    self.button.disable();
                });
            this.timeManager.events.register('stop', this,
                function() {
                    self.button.enable();
                });
        }
        return this.timeManager;
    },

    pad: function(n) {
        return n < 10 ? '0' + n : n
    },
    
    enableDisableSynch: function(){
        var synchLayers = this.target.mapPanel.layers;
        var layers = synchLayers.map.layers;   
        var synchLayersTime = [];
        var synchLayersNoTime = [];
        
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.synch) {
                if (layer instanceof OpenLayers.Layer.WMS && layer.dimensions && layer.dimensions.time) {
                    synchLayersTime.push(i);
                } else {
                    synchLayersNoTime.push(i);
                }
            }
        }        
        if(synchLayersTime.length !== 0){
            this.actions[0].enable();
            this.timeIntervalSettingFieldset.enable();
            this.timeIntervalSettingFieldset.show();
        }else if(synchLayersNoTime.length !== 0){
            this.actions[0].enable();
            this.timeIntervalSettingFieldset.disable();
            this.timeIntervalSettingFieldset.hide();
        }else{
            this.actions[0].disable();
        }
    
    },

    setSynchLayersIcon: function(synch) {

        if (this.target.tools.layertree_plugin) {
            var output = this.target.tools.layertree_plugin.output[0];
            var selectionModel = output.getSelectionModel();
            var checked = output.getChecked();
            for (var m = 0; m < checked.length; m++) {
                if (checked[m].childNodes.length > 0) {
                    for (var c = 0; c < checked[m].childNodes.length; c++) {
                        if (checked[m].childNodes[c].layer) {
                            if (checked[m].childNodes[c].layer.synch) {
                                synch === true ? checked[m].childNodes[c].setIconCls('gx-tree-synchlayer-loading-icon') : checked[m].childNodes[c].setIconCls('gx-tree-synchlayer-icon')
                            }
                        }
                    }
                }
            }
        }

    },
    /*
     * private: method[disableAllFunc]
     */
    disableAllFunc: function() {

        var map = this.target.mapPanel.map;

        var navigation = map.getControlsByClass('OpenLayers.Control.Navigation');
        var panPanel = map.getControlsByClass('OpenLayers.Control.PanPanel');
        var zoomPanel = map.getControlsByClass('OpenLayers.Control.ZoomPanel');

        navigation[0].deactivate();
        navigation[1].deactivate();
        panPanel[0].deactivate();
        zoomPanel[0].deactivate();

        var south = Ext.getCmp('south');
        if (south) {
            south.disable();
        }

        var east = Ext.getCmp('east');
        if (east) {
            east.disable();
        }

        var tree = Ext.getCmp('tree');
        if (tree) {
            var panel = tree.findParentByType('panel');
            if (panel) {
                panel.disable();
            }
        }

        for (var map in this.target.mapPanel.items.items) {
            if (this.target.mapPanel.items.items[map].xtype == "gx_zoomslider") {
                this.target.mapPanel.items.items[map].hide();
            }
            if (this.target.mapPanel.items.items[map].xtype == "gxp_scaleoverlay") {
                this.target.mapPanel.items.items[map].hide();
            }
        }

        for (var items in this.target.toolbar.items.items) {
            if (this.target.toolbar.items.items[items].id == "full-screen-button") {
                this.target.toolbar.items.items[items].disable();
            }
        }

        this.target.toolbar.disable();

        if (this.target.tools.synchronizer_plugin)
            this.target.tools.synchronizer_plugin.actions[0].enable();

    },
    /*
     * private: method[enableAllFunc]
     */
    enableAllFunc: function() {

        var map = this.target.mapPanel.map;

        var navigation = map.getControlsByClass('OpenLayers.Control.Navigation');
        var panPanel = map.getControlsByClass('OpenLayers.Control.PanPanel');
        var zoomPanel = map.getControlsByClass('OpenLayers.Control.ZoomPanel');

        navigation[0].activate();
        navigation[1].activate();
        panPanel[0].activate();
        zoomPanel[0].activate();

        var south = Ext.getCmp('south');
        if (south) {
            south.enable();
        }

        var east = Ext.getCmp('east');
        if (east) {
            east.enable();
        }

        var tree = Ext.getCmp('tree');
        if (tree) {
            var panel = tree.findParentByType('panel');
            if (panel) {
                panel.enable();
            }
        }

        for (var a = 0; a < this.target.mapPanel.items.items.length; a++) {
            if (this.target.mapPanel.items.items[a].xtype == "gx_zoomslider") {
                this.target.mapPanel.items.items[a].show();
            }
            if (this.target.mapPanel.items.items[a].xtype == "gxp_scaleoverlay") {
                this.target.mapPanel.items.items[a].show();
            }
        }

        for (var items in this.target.toolbar.items.items) {
            if (this.target.toolbar.items.items[items].id == "full-screen-button") {
                this.target.toolbar.items.items[items].enable();
            }
        }

        this.target.toolbar.enable();
    }

});

Ext.preg(gxp.plugins.Synchronizer.prototype.ptype, gxp.plugins.Synchronizer);