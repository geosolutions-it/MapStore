/*  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 *  class = TableableTool
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: TableableTool(config)
 *
 *    Show a tool with different tabs
 */
gxp.plugins.TableableTool = Ext.extend(gxp.plugins.Tool, {

	/** api: ptype = gxp_tableabletool */
	ptype : "gxp_tableabletool",

	/** api: config[splitPanels]
	 *  ``Boolean``
	 *  Flag to split panelsConfig in different tabs.
	 */
	splitPanels: false,

	/** api: config[panelsConfig]
	 *  ``Object``
	 *  Array of configurations for split on tab panels.
	 */
	panelsConfig: null,

	panelConfig: {
		// width : 355,
		// height : 380
		// border : false,
		layout : "fit"
		// disabled : false,
		// autoScroll : true
	},

	formConfig:{
		// width : 355,
		// height : 380,
		// autoScroll : true,
		// labelAlign : 'top'
	},
	
	formItems: [],

	/** private: method[addOutput]
	 *  :arg config: ``Object``
	 */
	addOutput : function(config) {

		// Get panel
		config = this.getPanel(config);

		// ///////////////////
		// Call super class addOutput method and return the panel instance
		// ///////////////////
		return gxp.plugins.TableableTool.superclass.addOutput.call(this, config);
	},

	/** private: method[getPanel]
	 *  :arg config: ``Object``
	 *  Obtain the final panel with all tabs or a tab panel
	 */
	getPanel: function(config){

		// Recursive case: Generate Tab panels 
		if(this.splitPanels && this.panelsConfig){
			var items = [];
			// One panel for each panelsConfig;
			if(this.panelsConfig){
				for(var i = 0; i< this.panelsConfig.length; i++){
					var newTab = new gxp.plugins.TableableTool();
					// copy all general config
					Ext.apply(newTab, this);
					// We need to generate another 
					// one with the configuration in this.panelsConfig[i]
					Ext.apply(newTab, this.panelsConfig[i]);
					// Set splitPanels to false to force base case
					newTab.splitPanels = false;
					// copy target
					newTab.target = this.target;
					// generate new id
					newTab.id = this.id + "_tab_" + i;
					items.push(newTab.getPanel());
				}	
			}

			// The final configuration is a TabPanel
			var tabPanel = new Ext.TabPanel({
			    // renderTo: this.outputTarget,
			    // renderTo: Ext.getBody(),
			    activeTab: 0,
			    items: items
			});

			// use tabPanel with the recursive tabs
			config = Ext.apply(tabPanel, config || {});
		}else{
			// Base case: not use tabPanel
			config = Ext.apply(this.generatePanel(config), config || {});
		}

		return config;

	},

	/** private: method[generatePanel]
	 *  Generate a panel with the configuration present on this
	 */
	generatePanel: function(config){
		var panelConfig = {
			id : this.id + '_panel',
			items : [this.getPanelContent(config)]
		};
		Ext.apply(panelConfig, this.panelConfig);
		panelConfig.title = this.title;
		// copy all general config
		if(config){
			Ext.apply(panelConfig, config);
		}

		return new Ext.Panel(panelConfig);
	},

	/** private: method[getPanelContent]
	 *  Generate a form with the configuration present on this
	 */
	getPanelContent: function(config){
		var formConfig = {
			id : this.id + '_form',
			items: this.getFormItems(config)
		};
		Ext.apply(formConfig, this.formConfig);
		return new Ext.form.FormPanel(formConfig);
	},

	getFormItems: function(config){
		return this.formItems
	}

});

Ext.preg(gxp.plugins.TableableTool.prototype.ptype, gxp.plugins.TableableTool);
