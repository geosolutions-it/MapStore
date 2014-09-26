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
Ext.ux.ClickToolTip = Ext.extend(Ext.ToolTip,{
    initTarget : function(target){
        var t;
        if((t = Ext.get(target))){
            if(this.target){
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
        if(this.anchor){
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
	timeInterval:null,

    /** private: method[constructor]
     */
    constructor: function(config) {		
        gxp.plugins.Synchronizer.superclass.constructor.apply(this, arguments);
		this.timeInterval = config.refreshTimeInterval*1000;
		this.range = config.range;
		this.startTime = Date.fromISO( this.range[0] );
        //
        //set endTime == currentTime;
        //
        this.d = new Date();        
        this.UTC = this.d.getUTCFullYear() + '-'
		            + this.pad(this.d.getUTCMonth() + 1) + '-'
		            + this.pad(this.d.getUTCDate()) + 'T'
		            + this.pad(this.d.getUTCHours()) + ':'
		            + this.pad(this.d.getUTCMinutes()) + ':'
		            + this.pad(this.d.getUTCSeconds()) + 'Z';
                    
        // current date           
        this.currentTime = Date.fromISO( this.UTC );
        
        // config date
        this.configEndTime = Date.fromISO( this.range[1] );
        
        //set endTime equal to configTime only if currentTime is greater than configTime
        this.endTime = this.currentTime > this.configEndTime ? this.configEndTime : this.currentTime ;

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
		this.button = new Ext.SplitButton({
				id:"sync-button",
	            iconCls: "gxp-icon-real-time",
	            tooltip: "Real time sync",
	            enableToggle: true,
	            toggleGroup: this.toggleGroup,
	            allowDepress: true,
	            handler: function(button, event) {
	                if(button.pressed) {
	                    button.menu.items.itemAt(this.activeIndex).setChecked(true);
	                }
	            },
	            scope: this,
	            listeners: {
	                toggle: function(button, pressed) {
	                    // toggleGroup should handle this
	                    if(!pressed) {
	                        button.menu.items.each(function(i) {
								if (i.setChecked){
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
						new Ext.menu.CheckItem(
	    					{
								text: 'Sync',
		                        iconCls: "gxp-icon-real-time",
		                        toggleGroup: this.toggleGroup,
		                        group: this.toggleGroup,
								listeners: {
	                                checkchange: function(item, checked) {
	                                    this.activeIndex = 0;
	                                    this.button.toggle(checked);
	                                    if (checked) {
	                                        this.button.setIconClass(item.iconCls);
	
												  var timeManager = self.getTimeManager();
												  var timeToRefresh = self.timeInterval;

												  var refresh = function(){

															var layers = timeManager.layers;					

															for (var i=0; i<layers.length; i++){
																var layer = layers[i];
																if (layer.getVisibility()){
																	// layer.redraw(true);
																	var timeParam = self.startTime.toISOString() +'/'+ self.endTime.toISOString();
																	layer.mergeNewParams({
																		TIME: timeParam,
																		fake: (new Date()).getTime()
																	});
																}

															}	
												  };

												  var countDown = function(){	
													if (self.tooltip && self.tooltip.getEl()){
														self.tooltip.update(  'next refresh in ' +timeToRefresh/1000 + ' secs' );
													}

													timeToRefresh -= 1000;
													if ( timeToRefresh === 0){
														timeToRefresh = self.timeInterval;
													}
												  };

													timeManager.stop();
													timeManager.toolbar.disable();
                                                    item.ownerCt.items.items[1].disable();
                                                    
                                                    // What do I do with this?
                                                    //timeVisualization[0].div.style.visibility = "hidden";                                                       
                                                    
                                                    //call function in composer.js to disable al functionality
                                                    //this.target.disableAllFunc();                                                     
                                                    
													self.tooltip = 	new Ext.ToolTip({
															        target: 'sync-button',
															        html:  interval/1000 + ' seconds',
															        title: 'Working interval: ' + Ext.util.Format.date(self.startTime, "d/m/Y") + ' to ' 
																				+ Ext.util.Format.date(self.endTime, "d/m/Y" ),
															        autoHide: false,
															        closable: true,
															        draggable:true,
																	anchor: 'top'
																});
													// force show now
													self.tooltip.showAt( [ Ext.getCmp('sync-button').getEl().getX() -50, Ext.getCmp('sync-button').getEl().getY() -50  ]);
											
													tooltipInterval = setInterval( countDown, 1000 );
													
													//
													// Fire event in order to refresh the Vehicle selector
													//
													//this.target.fireEvent('refreshToolActivated');
													
													interval = setInterval(refresh, self.timeInterval);	
	                                    } else {
											clearInterval( interval );
											var timeManager = self.getTimeManager();
											timeManager.toolbar.enable();
                                            item.ownerCt.items.items[1].enable();
                                            
                                            // What do I do with this?
                                            timeVisualization[0].div.style.visibility = "visible";     
                                            
                                            //call function in composer.js to enable al functionality
                                            //this.target.enableAllFunc();
                                            
											if (self.tooltip){
												self.tooltip.destroy();
												clearInterval( tooltipInterval );
											}
										}
	                                },
	                                scope: this
	                            },
								scope:this
							}
						),
						{
								text: 'Settings',
		                        iconCls: "gxp-icon-sync-configuration",
		                        toggleGroup: this.toggleGroup,
		                        group: this.toggleGroup,
		                        handler: function(){
										// open modal window
										var win = new Ext.Window({
											   closable:true,
												   title: 'Synchronization settings',
												   iconCls: "gxp-icon-sync-configuration",
												   border:false,
												   modal: true, 
												   bodyBorder: false,
												   width: 500,
								                   // height: 200,
								                   resizable: false,
											       items: [ new Ext.FormPanel({
													frame: true,
													border:false,
												    autoHeight: true,
													bodyStyle: 'padding: 10px 10px 0 10px;',
													defaults: {
													     anchor: '95%',
													     allowBlank: false,
													     msgTarget: 'side'
													},
													items:[{
														id:"start-datefield",
											            xtype: "datefield",
											            fieldLabel: 'Start time',
														allowBlank:false,
														editable: false,
														maxValue: self.range[1],
														minValue: self.range[0],
														format:"d/m/Y",
														value:Ext.util.Format.date( self.startTime, "d/m/Y"),
														width:5
											        },{  
														id:"end-datefield",
														xtype:'datefield',
														fieldLabel: 'End time',
														allowBlank:false,
														editable: false,
														maxValue: self.range[1],
														minValue: self.range[0],
														format:"d/m/Y",
														value:Ext.util.Format.date( self.endTime , "d/m/Y"),
														width:5
													 },{  
														id:"interval-numberfield",
														xtype:'numberfield',
														fieldLabel: 'Refresh interval (s)',
														allowDecimals:false,
														width:5,
														maxValue:60*15,
														minValue:5,
														value:self.timeInterval/1000,
														allowBlank:false
													 }
											        ],
													buttons: [{
											            text: 'Save',
											            formBind: true,
											            handler: function(){
															var startTimeField = Ext.getCmp("start-datefield");
															var endTimeField = Ext.getCmp("end-datefield"); 
															var intervalField = Ext.getCmp("interval-numberfield"); 
															if (startTimeField.isValid(false) && endTimeField.isValid(true) && intervalField.isValid(true)){	
																self.startTime = new Date( startTimeField.getValue() );
																self.endTime = new Date( endTimeField.getValue() );
																self.timeInterval = intervalField.getValue() * 1000;
																win.destroy();
															} else {
																Ext.Msg.show({
													                   title: 'Cannot update sync configuration',
													                   msg: 'Invalid values.',
													                   buttons: Ext.Msg.OK,
													                   icon: Ext.MessageBox.ERROR
													                });						
															}
														}
													}]	
												}) ]
											});
										win.show();			
								
								
								},
								scope:this		
						}	
	                ]
	            })
	        });
		
		this.target.on("timemanager", function(){
				self.getTimeManager();
		});

        var actions = [
			this.button
        ];
        return gxp.plugins.Synchronizer.superclass.addActions.apply(this, [actions]);
    },

    getTimeManager: function(){
	    if ( ! this.timeManager ){ // if it is not initialized
			var timeManagers = this.target.mapPanel.map.getControlsByClass('OpenLayers.Control.TimeManager');
			if (timeManagers.length <= 0){
				console.error('Cannot init Synchronizer: no TimeManager found');
				return;
			}
			this.timeManager = timeManagers[0];
			var self = this;
			// listen to play events
			this.timeManager.events.register('play', this, 
					function(){ 
						if (self.button.pressed){
							self.button.toggle();
						}
						self.button.disable();
					});	
			this.timeManager.events.register('stop', this, 
					function(){ 
						self.button.enable();
					});	
	    }
		return this.timeManager;
    },
    pad: function (n){
        return n < 10 ? '0' + n : n 
    }  
	


});

Ext.preg(gxp.plugins.Synchronizer.prototype.ptype, gxp.plugins.Synchronizer);