/*  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
 *  module = gxp.widgets.form
 *  class = SoilToolPanel
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets.form");

/** api: constructor
 *  .. class:: ChangeMatrix(config)
 *
 *    Show a change matrix of changes between two rasters
 */
gxp.widgets.form.SoilPanel = Ext.extend(gxp.widgets.form.AbstractOperationPanel, {

	/** api: xtype = gxp_soilpanel */
	xtype : "gxp_soilpanel",

	/** i18n **/
	// First fieldset
	basedOnCLCText: 'Based on CLC',
	coverText: 'Coefficiente Copertura',
	changingTaxText: 'Tasso di Variazione',
	marginConsumeText: 'Consumo Marginale del Suolo',
	sprawlText: 'Sprawl Urbano',

	// Second fieldset
	basedOnImperviousnessText: 'Based on Imperviousness',
	urbanDispersionText: 'Dispersione Urbana',
	edgeDensityText: 'Edge Density',
	urbanDiffusionText: 'Diffusione Urbana',
	framesText: 'Frammentazione',
	consumeOnlyText: 'Consumo Suolo',
	consumeOnlyConfText: 'Coefficiente Ambientale Cons. Suolo',

	// Validation
	invalidFormDialogText: "Please review the form fields:<ul>",
	invalidFormTitleText: "Error",
	invalidYearsFormDialogText: "Years range not selected",
	invalidROIFormDialogText: "ROI not selected",
	invalidCLCLevelFormDialogText: "CLC level not selected",
	invalidClassesFormDialogText: "CLC Level builder not selected",
	invalidSealingIndexFormDialogText: "Soil Sealing index not selected",
	invalidRange0IndexFormDialogText: "Reference time not selected",
	invalidRange1IndexFormDialogText: "Current time not selected",

	/** EoF i18n **/
    
    /** api: config[defaultAction]
     *  ``Object`` Time selection set disable elements
     */
	enableOrDisableConfig:{
		1:{
			sealingIndexCLC:{
				0: false,
				1: true,
				2: true,
				3: true
			},
			sealingIndexImpervious:{
				0: false,
				1: false,
				2: false,
				3: false,
				4: true,
				5: true
			},
			rasterComboBox: false,
			filterT1ComboBox: true,
			classesselector: false
		},
		2:{
			sealingIndexCLC:{
				0: false,
				1: false,
				2: false,
				3: false
			},
			sealingIndexImpervious:{
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
				5: false
			},
			filterT1ComboBox: false
		},
		'sealingIndexImpervious':{
			rasterComboBox: true,
			classesselector: true
		},
		'sealingIndexCLC':{
			rasterComboBox: false,
			classesselector: false
		},
		'default':{
			sealingIndexCLC:{
				0: false,
				1: false,
				2: false,
				3: false
			},
			sealingIndexImpervious:{
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
				5: false
			},
			rasterComboBox: false,
			filterT1ComboBox: false,
			classesselector: false
		}
	},

    /** api: config[clcLevelsConfig]
     *  ``Object`` CLC levels cconfiguration
     */
	clcLevelsConfig:{
		filter: 'corine_L',
		decorator: 'Corine Land Cover Level {0}'
	},

    /** api: method[generateItems]
     *  :arg config: ``String`` Configuration to be applied on this
     *  :returns: ``Array`` items for the form.
     *  Custom elements for the soil sealing panel
     */
	generateItems: function(config){
		return [{
    		title: this.timeSelectionTitleText,
    		// layout : 'fit',
	        items: this.getTimeSelectionItems(config)
	    },{
    		title: this.soilSealingIndexTitleText,
	        items: this.getSealingIndexItems(config)
	    },{
    		title: this.clcLevelTitleText,
    		layout : 'fit',
	        items: this.getCclLevelItems(config)
	    },{
    		title: this.clcLegendBuilderTitleText,
			layout : 'table',
			columns: 1,
	        items: this.getCclLegendItems(config)
	    },{
    		title: this.roiTitleText,
			layout : 'vBox',
	        items: this.getRoiItems(config)
	    }];
	},


    /** api: method[getSealingIndexItems]
     *  :arg config: ``String`` for this element. Unused
     *  :returns: ``Array`` items for the sealing index element.
     *  Obtain sealing index elements.
     */
	getSealingIndexItems: function(config){

		var me = this;

		return [{
			title : this.basedOnCLCText,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '../../sealingIndexCLC',
				id: me.id + "_sealingIndexCLC",
	            cls: 'x-check-group-alt',
				name : 'sealingIndex',
            	columns: 1,
            	items:[{
                	boxLabel: this.coverText, 
                	name: 'sealingIndex', 
                	inputValue: this.coverText
                },{
                	boxLabel: this.changingTaxText, 
                	name: 'sealingIndex', 
                	inputValue: this.changingTaxText
                },{
                	boxLabel: this.marginConsumeText, 
                	name: 'sealingIndex', 
                	inputValue: this.marginConsumeText
                },{
                	boxLabel: this.sprawlText, 
                	name: 'sealingIndex', 
                	inputValue: this.sprawlText
                }],
            	listeners:{
            		change: this.sealingIndexSelect,
            		scope: this
            	}
            }]
        },{
			title : this.basedOnImperviousnessText,
			xtype : 'fieldset',
			autoWidth : true,
			collapsible : false,
			layout : 'fit',
			defaultType : 'radiogroup',
			items : [{
				ref   : '../../sealingIndexImpervious',
				id: me.id + "_sealingIndexImpervious",
	            cls: 'x-check-group-alt',
				name : 'sealingIndex',
            	columns: 1,
			    defaults: {
			        // applied to each contained panel
			        bodyStyle: 'padding:15px'
			    },
            	items:[{
                	boxLabel: this.urbanDispersionText, 
                	name: 'sealingIndex', 
                	inputValue: this.urbanDispersionText
                },{
                	boxLabel: this.edgeDensityText, 
                	name: 'sealingIndex', 
                	inputValue: this.edgeDensityText
                },{
                	boxLabel: this.urbanDiffusionText, 
                	name: 'sealingIndex', 
                	inputValue: this.urbanDiffusionText
                },{
                	boxLabel: this.framesText, 
                	name: 'sealingIndex', 
                	inputValue: this.framesText
                },{
                	boxLabel: this.consumeOnlyText, 
                	name: 'sealingIndex', 
                	inputValue: this.consumeOnlyText
                },{
                	boxLabel: this.consumeOnlyConfText, 
                	name: 'sealingIndex', 
                	inputValue: this.consumeOnlyConfText
                }],
            	listeners:{
            		change: this.sealingIndexSelect,
            		scope: this
            	}
            }]
        }];
	},

    /** api: method[selectTimeIndex]
     *  Callback when a time selection item is selected
     */
	selectTimeIndex: function(){
		var filter0 = Ext.getCmp(this.id + '_filterT0ComboBox');
		var filter1 = Ext.getCmp(this.id + '_filterT1ComboBox');
		var yearsSelection = Ext.getCmp(this.id + '_yearsSelection');
		if(filter0  && filter0.getValue() 
			&& filter1 && filter1.getValue()
			&& yearsSelection && yearsSelection.getValue()){
			this.activeElementByTitle(this.soilSealingIndexTitleText);
		}
	},

    /** api: method[selectTimeIndex]
     *  Callback when a time selection item is selected
     */
	sealingIndexSelect: function(parent, selected){
		if(parent 
			&& parent.ref){
			// Enable or disable elements based on parent.ref
			var selectedType = parent.ref.replace("../../", "");
			this.enableOrDisableElements(selectedType);
			// If is a sealingIndexImpervious, expand ROI
			if(selectedType == 'sealingIndexImpervious'){
				// disable check on the other radiogroup
				this.sealingIndexCLC.items.each(function(item){
					item.checked = false;
				});
				this.activeElementByTitle(this.roiTitleText);
			}else{
				// disable check on the other radiogroup
				this.sealingIndexImpervious.items.each(function(item){
					item.checked = false;
				});
				// Active next accordion: TODO: change to clcLevelTitleText
				this.activeElementByTitle(this.clcLegendBuilderTitleText);
			}
		}
	},

    /** api: method[submitForm]
     *  Submit form. FIXME: include new functionalities
     */
	submitForm: function() {
		if(this.validate()){
			//TODO: Get result from WPS process
			var responseData = this.getFakeResponse();
			this.showResult(responseData);
		}
	},

    /** api: method[validate]
     *  Validate form content after commit
     */
	validate: function(){
		var form = this.getForm();
		var values = form.getValues();
		var valid = true;
		var msg = this.invalidFormDialogText;

		// Time selection validation
		if(values.years){
			switch(parseInt(values.years)){
				case 2:
					if(values.filterT1){
						valid = valid && true;
					}else{
						valid = false;
						msg += "<li>" + this.invalidRange1IndexFormDialogText + "</li>";
					}
				default: 
					if(values.filterT0){
						valid = valid && true;
					}else{
						valid = false;
						msg += "<li>" + this.invalidRange0IndexFormDialogText + "</li>";
					}
			}
		}else{
			msg += "<li>" + this.invalidYearsFormDialogText + "</li>";
			valid = false;
		}

		// Soil Sealing index validation
		if(values.sealingIndex){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidSealingIndexFormDialogText + "</li>";
		}

		// CLC Level  validation
		if(this.rasterComboBox.disabled || values.raster){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidCLCLevelFormDialogText + "</li>";
		}

		// CLC Level builder validation
		if(this.classesselector.disabled || values.classesselector){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidClassesFormDialogText + "</li>";
		}

		// ROI validation
		if(this.roiFieldSet.getSelectedAreas()){
			valid = valid && true;
		}else{
			valid = false;
			msg += "<li>" + this.invalidROIFormDialogText + "</li>";
		}

		// Show message if is invalid
		if(!valid){
			msg += "</ul>";
			Ext.Msg.show({
			   title: this.invalidFormTitleText,
			   msg: msg,
			   width: 250,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.WARNING,
			   scope: this
			});
		}
		return valid;
	},

    /** api: method[showResult]
     *  :arg config: ``Object`` with the response of the process
     *  Show result as tabpanel. It uses the ´gxp_wfsresume´ plugin.
     */
	showResult: function(responseData){
		// Show resume of the response data
		var me = this;
		var wfsResumeTool = this.target.tools['gxp_wfsresume'];
        if(wfsResumeTool){
        	var grid = wfsResumeTool.createResultsGrid(responseData, 'soilsealing', 'soilsealing', 'soilsealing');
        	// var grid = wfsResumeTool.createResultsGrid(this.defaultInput2, 'soilsealing', 'soilsealing', 'soilsealing');
			var hasTabPanel = false;
			if (me.target.renderToTab) {
				var container = Ext.getCmp(me.target.renderToTab);
				if (container.isXType('tabpanel'))
					hasTabPanel = true;
			}
	
			if (hasTabPanel) {
				if (grid.win)
					grid.win.destroy();
				var now = new Date();
				grid.title += ' - ' + Ext.util.Format.date(now, 'H:i:s');
				container.add(grid);
				container.setActiveTab(container.items.length - 1);
			} else {
				if (me.resultWin)
					me.resultWin.destroy();
	
				//remove title to avoid double header
				grid.title = undefined;
	
				me.resultWin = new Ext.Window({
					width : 450,
					height : 450,
					layout : 'fit',
					title : grid.changeMatrixResultsTitle,
					constrainHeader : true,
					renderTo : me.target.mapPanel.body,
					items : [grid]
				});
				me.resultWin.show();
			}
			//if(this.win) this.win.destroy();
			grid.doLayout();
        }
	},

	// TODO: Remove all code before this one
	defaultInput: {
	  "index": {
	    "id": 1,
	    "name": "Coverage Ratio (Demo)"
	  },
	  "refTime": {
	    "time": "2000-01-01",
	    "output": {
	      "admUnits": [
	        "Pisa",
	        "Livorno"
	      ],
	      "clcLevels": [
	        "Class-1",
	        "Class-2",
	        "Class-3"
	      ],
	      "values": [
	        [
	          20,
	          30,
	          50
	        ],
	        [
	          12,
	          63,
	          25
	        ]
	      ]
	    }
	  }
	},

	defaultInput2: {
	  "index": {
	    "id": 1,
	    "name": "Coverage Ratio (Demo)"
	  },
	  "refTime": {
	    "time": "2000-01-01",
	    "output": {
	      "admUnits": [
	        "Pisa",
	        "Livorno"
	      ],
	      "clcLevels": [
	        "Class-1",
	        "Class-2",
	        "Class-3"
	      ],
	      "values": [
	        [
	          20,
	          30,
	          50
	        ],
	        [
	          12,
	          63,
	          25
	        ]
	      ]
	    }
	  },
	  "curTime": {
	    "time": "2006-01-01",
	    "output": {
	      "admUnits": [
	        "Pisa",
	        "Livorno"
	      ],
	      "clcLevels": [
	        "Class-1",
	        "Class-2",
	        "Class-3"
	      ],
	      "values": [
	        [
	          10,
	          40,
	          50
	        ],
	        [
	          32,
	          21,
	          47
	        ]
	      ]
	    }
	  }
	},

	getFakeResponse: function(){
		var responseData = null;
		var values = this.getForm().getValues();
		try{
			var adminUnits = [];
			// TODO: change it if localited!!
			if(values.roiSelectionMethod != "Administrative Areas" 
				|| values.roiReturnMethod == 'Geometry Union'){
				adminUnits.push(values.roiSelectionMethod);
			}else{
				var selectedAreas = this.roiFieldSet.getSelectedAreas().split(this.roiFieldSet.selectedAreasSeparator);
				for (var i = 0; i < selectedAreas.length; i++){
					var areaAndParent = selectedAreas[i].split(this.roiFieldSet.selectedAreaParentSeparator);
					adminUnits.push(areaAndParent[0] + " - " + areaAndParent[1]);
				}
			}
			// Generate random values
			var clcLevels =this.fakeLevelsGenerator(values);
			var clcValues = this.fakeValuesGenerator(adminUnits, clcLevels);
			var responseData = {
			  "index": {
			    "id": 1,
			    "name": values.sealingIndex
			  },
			  "refTime": {
			    "time": values.filterT0,
			    "output": {
			      "referenceName": values.raster,
			      "admUnits": adminUnits,
			      "clcLevels": clcLevels,
			      "values": clcValues
			    }
			  }
			};
			if(values.filterT1){
				var clcValuesT1 = this.fakeValuesGenerator(adminUnits, clcLevels);
				responseData["curTime"] = {
				    "time": values.filterT1,
				    "output": {
			          "referenceName": values.raster,
				      "admUnits": adminUnits,
				      "clcLevels": clcLevels,
				      "values": clcValuesT1
				    }
			  	};
			}
		}catch(e){
			if(values.years && values.years == 2){
				responseData = this.defaultInput2;
			}else{
				responseData = this.defaultInput;
			}
		}
		return responseData;
	},

	fakeValuesGenerator: function(adminUnits, clcLevels){
		// Generate random values
		var clcValues = [];
		for(var i = 0; i < adminUnits.length; i++){
			var clcValue = [];
			for(var j = 0; j < clcLevels.length; j++){
				clcValue.push(Math.floor((Math.random()*100)+1));
			}
			clcValues.push(clcValue);
		}
		return clcValues;
	},

	fakeLevelsGenerator: function(values){
		// try{
		// 	var referenceName = values.raster;
		// 	//layer level
		// 	var classDataIndex = 0;
		// 	for ( classDataIndex = 0; classDataIndex < this.classes.length; classDataIndex++) {
		// 		if (this.classes[classDataIndex].layer == referenceName)
		// 			break;
		// 	}
		// 	if (classDataIndex >= this.classes.length) {
		// 		return values.classesselector.split(",");
		// 	}else{
		// 		var classes = [];
		// 		var classesSelected = values.classesselector.split(",");
		// 		for(var i = 0; i < classesSelected.length; i++){
		// 			var classIndex = parseInt(classesSelected[i]);
		// 			for(var j = 0; j < this.classesIndexes[classDataIndex][1].length; j++){
		// 				if(this.classesIndexes[classDataIndex][1][j][0] == classIndex){
		// 					classes.push(this.classesIndexes[classDataIndex][1][j][1]);
		// 					break;
		// 				}
		// 			}
		// 		}
		// 		return classes;
		// 	}
		// }catch(e){
			return values.classesselector.split(",");
		// }
	}

});

Ext.reg(gxp.widgets.form.SoilPanel.prototype.xtype, gxp.widgets.form.SoilPanel);
