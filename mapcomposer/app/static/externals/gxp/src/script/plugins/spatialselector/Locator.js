/**
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 * @requires widgets/form/spatialselector/SpatialSelectorMethod.js
 */
 
/**
 * @author Alejandro Diaz
 */

/** api: (define)
 *  module = gxp.plugins.spatialselector
 *  class = Locator
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace('gxp.plugins.spatialselector');

/** api: constructor
 *  .. class:: Locator(config)
 *
 *    Locator tool to include geocoder and reverse geocoder plugins in one
 */
gxp.plugins.spatialselector.Locator = Ext.extend(gxp.plugins.Tool, {

	/* ptype = gxp_spatial_selector_locator */
	ptype : 'gxp_spatial_selector_locator',

	titleText: "Locator",

	/** api: config[pluginsConfig]
	 * ``Object``
	 * Configuration for the plugins.
	 */
	pluginsConfig:{

	},

	/** api: config[pluginsLayoutConfigs]
	 * ``Object``
	 * Configuration for each accordion plugin.
	 */
	pluginsLayoutConfigs:{
		header: false,
		border : false,
		autoScroll : true,
		defaults:{
			maxWidth: 100,
			width: 240,
			maxHeight: 200
		}
	},

	/** api: config[translatedKeys]
	 * ``String``
	 * Translated keys for spatial selectors (i18n).
	 */
	translatedKeys: {
		"geocoder": "Search",
		"reverse": "Address"
	},

	/** api: config[plugins]
	 * ``Object``
	 * Initialized plugins.
	 */
	plugins:{

	},

	/** api: method[constructor]
	 * Init spatialSelectors .
	 */
	constructor : function(config) {
    
		// default layout configuration
		this.layoutConfig = {
    		xtype: "panel",
    		layout: "accordion",
    		animate: true,
    		autoScroll : true
		};

		// Apply config
		Ext.apply(this, config);
		
		return gxp.plugins.spatialselector.Locator.superclass.constructor.call(this, arguments);
	},
    /** api: method[addActions]
     */
    addActions: function (config) {

        if (this.actionTarget.panelTarget) {
            var actions = [{
                    iconCls: "gxp-icon-geolocationmenu",
                    tooltip: "Locator",
                    enableToggle: true,
                    allowDepress: true,
                    scope: this, 
                    listeners: {
                        toggle: function(button, pressed) {
                        
                            if(!this.outputTarget){
                                this.outputTarget = this.actionTarget.panelTarget;
                                this.addOutput();                        
                            }
                            
                            if(pressed){
                                Ext.getCmp(this.outputTarget).show();                            
                                Ext.getCmp(this.outputTarget).expand();                                
                            }else{
                                Ext.getCmp(this.outputTarget).hide();                            
                                Ext.getCmp(this.outputTarget).collapse();
                            } 
                        },
                        scope: this
                    }
                }
            ];
            return gxp.plugins.MetadataExplorer.superclass.addActions.apply(this, [actions]);
        }else{
            this.addOutput();
            return;
        }

    },
    /** api: method[addOutput]
     */
    addOutput: function() {

    	// prepare layout
    	var layout = {};
		Ext.apply(layout, this.layoutConfig);
		if(!layout.title){
			layout.title = this.titleText;
		}

		// Create accordion items and init plugins
		var items = [];
		if(this.pluginsConfig){
			for (var key in this.pluginsConfig){
				var item = {
					id: this.id + "_" + key,
					title: key
				};
				// create plugin
				var spConfig = this.pluginsConfig[key];
				spConfig.target = this.target;
				spConfig.outputTarget = this.id + "_" + key;
				spConfig.layoutConfig = this.pluginsLayoutConfigs;
				var plugin = Ext.ComponentMgr.createPlugin(spConfig);
				// Add i18n support by spatial selector 
				if(plugin.titleText){
					item["title"] = plugin.titleText;	
				}
				if(this.translatedKeys[key]){
					item["title"] = this.translatedKeys[key];
				}
				items.push(item);
				this.plugins[key] = plugin;
			}	
		}
	    layout.items = items;

	    var output = gxp.plugins.spatialselector.Locator.superclass.addOutput.call(this, layout);

		// initialize plugins
		var items = [];
		if(this.plugins){
			for (var key in this.plugins){
				var plugin = this.plugins[key];
				var poutput = plugin.addOutput();
				poutput.doLayout();
			}	
		}
	    //output.doLayout();

    	return output;
    }

});

Ext.preg(gxp.plugins.spatialselector.Locator.prototype.ptype, gxp.plugins.spatialselector.Locator);