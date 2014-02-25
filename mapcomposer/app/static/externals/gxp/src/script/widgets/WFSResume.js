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
 *  module = gxp.widgets
 *  class = WFSResume
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets");

/** api: constructor
 *  .. class:: WFSResume(config)
 *
 *    Show a resume for a WFS record
 */
gxp.widgets.WFSResume = Ext.extend(gxp.plugins.Tool, {

	/** api: ptype = gxp_wfsresume */
	ptype : "gxp_wfsresume",
    
    /** api: config[url]
     *  ``String`` URL for the layer creation
     */
	url: null,

    /** api: config[resultMapping]
     *  ``Object`` Plugin type by feature type
     */
	resultMapping:{
		'soilsealing': 'gxp_soilsealingresume',
		'changematrix': 'gxp_changematrixresume'
	},

    /** api: config[detaultPtype]
     *  ``String`` Default plugin to generate the WFS Resume
     */
	detaultPtype: 'gxp_changematrixresume',

	/** private: method[addOutput]
	 *  :arg config: ``Object``
	 */
	addOutput : function(config) {

		var finalConfig = {};

		Ext.apply(finalConfig, config || {});

		// Get panel
		if(finalConfig.data 
			&& finalConfig.name 
			&& finalConfig.referenceName){
			var resultGrid = this.createResultsGrid(finalConfig.data, finalConfig.name, finalConfig.referenceName);
			Ext.apply(finalConfig, resultGrid);
		}

		// ///////////////////
		// Call super class addOutput method and return the panel instance
		// ///////////////////
		return gxp.widgets.WFSResume.superclass.addOutput.call(this, config);
	},

	/**
	 * Add support for some classes.
	 **/
	addSupport: function(classesIndexes, classes, geocoderConfig){
		// TODO: add classes and classes indexes
		this.classesIndexes = classesIndexes;
		this.classes = classes;
		this.geocoderConfig = geocoderConfig;
	},

    /** api: method[createResultsGrid]
     *  :arg data: ``Object`` Data with the wfs content
     *  :arg rasterName: ``String`` Name of the layer requested
     *  :arg referenceName: ``String`` Reference name of the layer requested
     *  :arg featureType: ``String`` Name featureType requested
     *  :returns: ``Ext.Panel`` With the resume.
     */
	createResultsGrid: function(data, rasterName, referenceName, featureType){
		// Create instance for the configured plugin
		var ptype = this.detaultPtype;
		if(featureType 
			&& this.resultMapping 
			&& this.resultMapping[featureType]){
			ptype = this.resultMapping[featureType];
		}
		// Get or creat the plugin
		var showResumeWidget = this.target.tools[ptype];
		if(!showResumeWidget){
			showResumeWidget = Ext.ComponentMgr.createPlugin({
				ptype: ptype
			});
			this.target.tools[ptype] = showResumeWidget;
		}
		// Delegate configuration
		Ext.apply(showResumeWidget, {
			classesIndexes: this.classesIndexes,
			classes: this.classes,
			geocoderConfig: this.geocoderConfig,
			url: this.url,
			target: this.target
		});
		// init component
		if(showResumeWidget.initComponent){
			showResumeWidget.initComponent();	
		}
		return showResumeWidget.createResultsGrid(data, rasterName, referenceName, featureType);
	}

});

Ext.preg(gxp.widgets.WFSResume.prototype.ptype, gxp.widgets.WFSResume);
