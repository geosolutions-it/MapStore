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

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = WMSGetFeatureInfoMenu
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSGetFeatureInfoMenu(config)
 *
 *    This plugins provides a menu with two actions. When active,
 *    these actions issue GetFeatureInfo requests.
 *    The first will issue a GetFeatureInfo request to the WMS
 *    of all layers on the map once the user click.
 *    The second,  will issue a GetFeatureInfo request 
 *    to the selected layer in layertree (if any) on mouse Hover.
 *    The output will be displayed in a popup.
 */   
gxp.plugins.WMSGetFeatureInfoMenu = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wmsgetfeatureinfo_menu */
    ptype: "gxp_wmsgetfeatureinfo_menu",
    
    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** private: property[popupCache]
     *  ``Object``
     */
    popupCache: null,

    /** api: config[infoActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    infoActionTip: "Get Feature Info",
	
	/** api: config[activActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    activeActionTip: "Active Feature Info on selected Layer",

    /** api: config[popupTitle]
     *  ``String``
     *  Title for info popup (i18n).
     */
    popupTitle: "Feature Info",
	
	/** api: config[closePrevious]	
     *  ``Boolean``
     *  Close previous popups when opening a new one.
     */
	closePrevious: true,
	
	/** api: config[loadingMask]
     *  ``Boolean``
     *  Use a loading mask during get feature info.
     */
	loadingMask: true,
	
	/** api: config[maskMessage]
     *  ``String``
     *  Message for the loading mask.
     */
	maskMessage: 'Getting info...',
	
	/** api: config[useTabPanel]
     *  ``Boolean``
     *  Use a loading mask during get feature info.
     */
	useTabPanel: false,
    
    noDataMsg: "No data returned from the server",
    
    /** api: config[vendorParams]
     *  ``Object``
     *  Optional object with properties to be serialized as vendor specific
     *  parameters in the requests (e.g. {buffer: 10}).
     */
     
    /** api: method[addActions]
     */
    addActions: function() {
        this.popupCache = {};
        this.activeIndex = 0;
        
		var items = [new Ext.menu.CheckItem({
            tooltip: this.infoActionTip,
			text: this.infoActionTip,
            iconCls: "gxp-icon-getfeatureinfo",
            toggleGroup: this.toggleGroup,
            group: this.toggleGroup,
			listeners: {
				checkchange: function(item, checked) {
					this.activeIndex = 0;
					this.button.toggle(checked);
					if (checked) {
						this.button.setIconClass(item.iconCls);
					}
					for (var i = 0, len = info.controls.length; i < len; i++){
                    if (checked) {
							info.controls[i].activate();
						} else {
							info.controls[i].deactivate();
							
						}
					}
				},
				scope: this
			}
		}),new Ext.menu.CheckItem({
            tooltip: this.activeActionTip,
			text: this.activeActionTip,
            iconCls: "gxp-icon-mouse-map",
			
            toggleGroup: this.toggleGroup,
            group: this.toggleGroup,
			allowDepress:false,
			listeners: {
				checkchange: function(item, checked) {
					this.activeIndex = 1;
					this.button.toggle(checked);
					if (checked) {
						this.button.setIconClass(item.iconCls);
					}
					this.toggleActiveControl(checked);
				},
				scope: this
			}
		})];
		
		this.button = new Ext.SplitButton({
            iconCls: "gxp-icon-getfeatureinfo",
            tooltip: this.measureTooltip,
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
                            i.setChecked(false);
                        });
                    }
                },
                render: function(button) {
                    // toggleGroup should handle this
                    Ext.ButtonToggleMgr.register(button);
                }
            },
            menu: new Ext.menu.Menu({
                items: items
            })
        });
		
		var actions = gxp.plugins.WMSGetFeatureInfoMenu.superclass.addActions.call(this, [this.button]);
        var infoButton = items[0];

        var info = {controls: []};
		var layersToQuery = 0;
		
        var updateInfo = function() {
            var queryableLayers = this.target.mapPanel.layers.queryBy(function(x){
                return x.get("queryable");
            });

            var map = this.target.mapPanel.map;
            var control;
            for (var i = 0, len = info.controls.length; i < len; i++){
                control = info.controls[i];
                control.deactivate();  // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
                control.destroy();
            }
			
            info.controls = [];
            var started = false;
            var atLeastOneResponse = false;
			this.masking = false;
			
            queryableLayers.each(function(x){                
                var l = x.getLayer();
                var control = new OpenLayers.Control.WMSGetFeatureInfo({
                    url: l.url,
                    queryVisible: true,
                    layers: [x.getLayer()],
                    vendorParams: x.getLayer().vendorParams || this.vendorParams,
                    eventListeners: {
                        beforegetfeatureinfo: function(evt) {
							//first getFeatureInfo in chain
							if(!started){
								started= true;
								atLeastOneResponse=false;
								layersToQuery=queryableLayers.length;
							}
                            
							if(this.loadingMask && !this.masking) {
								this.target.mapPanel.el.mask(this.maskMessage);
								this.masking = true;
							}
                        },
                        getfeatureinfo: function(evt) {
                            layersToQuery--;
							//last get feature info in chain
							if(layersToQuery === 0) {
								this.unmask();
								started=false;
								
							}
							
							// ////////////////////////////////////////////////////
							// This function assume that teh body is empty in order 
							// to return noDataMsg (no features)
							// ////////////////////////////////////////////////////
                            var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                            if (match && !match[1].match(/^\s*$/)) {
                                atLeastOneResponse = true;
                                this.displayPopup(
                                    evt, x.get("title") || x.get("name"), match[1], function() {
										/*layersToQuery=0;
										this.unmask();*/
									}, this
                                );
                            // no response at all
                            } else if(layersToQuery === 0 && !atLeastOneResponse) {
                                Ext.Msg.show({
                                    title: this.popupTitle,
                                    msg: this.noDataMsg,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.MessageBox.WARNING
                                });
                            }
                            
                        },
						nogetfeatureinfo: function(evt) {
							layersToQuery--;							
							this.unmask();							
						},
                        scope: this
                    }
                });
                map.addControl(control);
                info.controls.push(control);
                if(infoButton.checked) {
                    control.activate();
                }
            }, this);

        };
        
		var updateInfoEvent = function() {
			if(layersToQuery === 0) {
				updateInfo.call(this);
			}
		};
        this.target.mapPanel.layers.on("update", updateInfoEvent, this);
        this.target.mapPanel.layers.on("add", updateInfoEvent, this);
        this.target.mapPanel.layers.on("remove", updateInfoEvent, this);
        
        return actions;
    },

	unmask: function() {
		if(this.loadingMask) {
			this.target.mapPanel.el.unmask();
			this.masking = false;
		}
	},
	
	/** private: method[removeAllPopups] removes all open popups
     */
    removeAllPopups: function(evt, title, text) {
		for(var key in this.popupCache) {
			if(this.popupCache.hasOwnProperty(key)) {
				this.popupCache[key].close();
				delete this.popupCache[key];
			}
		}
	},
	
    /** private: method[displayPopup]
     * :arg evt: the event object from a 
     *     :class:`OpenLayers.Control.GetFeatureInfo` control
     * :arg title: a String to use for the title of the results section 
     *     reporting the info to the user
     * :arg text: ``String`` Body text.
     */
    displayPopup: function(evt, title, text, onClose, scope) {
        var popup;
        var popupKey = evt.xy.x + "." + evt.xy.y;
						
		var item = this.useTabPanel ? {
			title: title,										
			html: text,
			autoScroll: true
		} : {
            title: title,			
            layout: "fit",			
            html: text,
            autoScroll: true,
            autoWidth: true,
            collapsible: true
        };
						
        if (!(popupKey in this.popupCache)) {
			if(this.closePrevious) {
				this.removeAllPopups();
			}
			var items = this.useTabPanel ? [{
				xtype: 'tabpanel',
				activeTab: 0,
				items: [item]
			}] : [item];
			
            popup = this.addOutput({
                xtype: "gx_popup",
                title: this.popupTitle,
                layout: this.useTabPanel ? "fit" : "accordion",
                location: evt.xy,
                map: this.target.mapPanel,
                width: 490,
                height: 320,
                /*anchored: true,
                unpinnable : true,*/
				items: items,
                draggable: true,
                listeners: {
                    close: (function(key) {
                        return function(panel){
							if(onClose) {
								onClose.call(scope);
							}
                            delete this.popupCache[key];
                        };
                    })(popupKey),
                    scope: this
                }
            });
            this.popupCache[popupKey] = popup;
        } else {
            popup = this.popupCache[popupKey];
			
			var container = this.useTabPanel ? popup.items.first() : popup;
			container.add(item);
        }
		        
        popup.doLayout();
    },
	
	/** private: method[toggleActiveControl] 
	 *  toggles the active control (on Mouse Hover).
     */
	toggleActiveControl: function(checked){

		//get selectionModel of layer tree
		var sm = Ext.getCmp('layertree').getSelectionModel();

		if(checked){
			var sel = sm.getSelectedNode() ;
			//if a layer is selected create and activate the layer
			if(sel){
			 var layer = sel.layer
			 if(layer){
				this.activateActiveControl(layer,sel.text);
			}
		}
		//bind event selection change to create new control
		
			sm.on('selectionchange',this.changeSelected,this);
		}else{
			this.cleanActiveControl();
			sm.un('selectionchange',this.changeSelected,this);
		}
	},
	/** private: method[activateActiveControl] 
	 *  activate the active control. called on tool activation
	 *  if a layer is selected, or on selectionchangeEvent
     */
	activateActiveControl: function(layer,title){
		this.cleanActiveControl();
		var tooltip;
		var cleanup = function() {
			if (tooltip) {
				tooltip.destroy();
			}  
		};
		
		var control = new OpenLayers.Control.WMSGetFeatureInfo({
		
			title: 'Identify features by clicking',
			layers: [layer],
			hover: true,
			queryVisible: true,
			handlerOptions:{	
				hover: {delay: 200,pixelTolerance:2}
			},
			eventListeners:{
				scope:this,
				
				getfeatureinfo:function(evt){
					cleanup();
					// ////////////////////////////////////////////////////
					// This function assume that teh body is empty in order 
					// to return noDataMsg (no features)
					// ////////////////////////////////////////////////////
					var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
					if (match && !match[1].match(/^\s*$/)) {
						tooltip = new GeoExt.Popup({
							
							map: this.target.mapPanel,
							panIn:true,
							title: title || this.popupTitle,
							width:490,
							height:320,
							autoScroll:false,
							layout:'fit',
							location:evt.xy,
							resizable:true,
							items:{xtype:'panel',autoScroll:true,html:'<div style="padding:5px">'+match[1]+'</div>'},
							closable: true,
							draggable: false,
							listeners: {hide: cleanup}
						});
						
						tooltip.show();
					}
					

				},deactivate: cleanup
			}
		});
		this.target.mapPanel.map.addControl(control);
		this.activeControl=control;
		control.activate();
		
	},
	/**
	 * private:[changeSelected]
	 * method called on selection change. Is defined out the space
	 * becouse this method have to be unique, to allow unbinding once
	 * the active tool is deactivated
	 */
	changeSelected: function(sm,sel,eOpts){
		var sel = sm.getSelectedNode();
		if(!sel){
			this.cleanActiveControl();return;
		}
		this.activateActiveControl(sel.layer,sel.text);
	},
	/** 
	 *  private: method[cleanActiveControl] 
     *  utility routine to remove active control
     */	 
	cleanActiveControl: function(){
		if (this.activeControl){
			this.activeControl.deactivate();
			this.activeControl.destroy();
		}
	}
	
    
});

Ext.preg(gxp.plugins.WMSGetFeatureInfoMenu.prototype.ptype, gxp.plugins.WMSGetFeatureInfoMenu);
