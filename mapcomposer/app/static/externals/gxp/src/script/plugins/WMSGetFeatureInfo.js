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
 *  class = WMSGetFeatureInfo
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSGetFeatureInfo(config)
 *
 *    This plugins provides an action which, when active, will issue a
 *    GetFeatureInfo request to the WMS of all layers on the map. The output
 *    will be displayed in a popup.
 */   
gxp.plugins.WMSGetFeatureInfo = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wmsgetfeatureinfo */
    ptype: "gxp_wmsgetfeatureinfo",
    
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
        
        var actions = gxp.plugins.WMSGetFeatureInfo.superclass.addActions.call(this, [{
            tooltip: this.infoActionTip,
            iconCls: "gxp-icon-getfeatureinfo",
            toggleGroup: this.toggleGroup,
            enableToggle: true,
            allowDepress: true,
            toggleHandler: function(button, pressed) {
                for (var i = 0, len = info.controls.length; i < len; i++){
                    if (pressed) {
                        info.controls[i].activate();
                    } else {
                        info.controls[i].deactivate();
                    }
                }
             }
        }]);
        var infoButton = this.actions[0].items[0];

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
                
                var control = new OpenLayers.Control.WMSGetFeatureInfo({
                    url: x.getLayer().url,
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
                if(infoButton.pressed) {
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
    }
    
});

Ext.preg(gxp.plugins.WMSGetFeatureInfo.prototype.ptype, gxp.plugins.WMSGetFeatureInfo);
