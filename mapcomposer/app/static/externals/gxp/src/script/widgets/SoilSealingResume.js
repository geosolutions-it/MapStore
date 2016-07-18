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
 *  class = SoilSealingResume
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets");

/** api: constructor
 *  .. class:: SoilSealingResume(config)
 *
 *    Show a resume for a record
 */
gxp.widgets.SoilSealingResume = Ext.extend(gxp.widgets.WFSResume, {

	/** api: ptype = gxp_soilsealingresume */
	ptype : "gxp_soilsealingresume",

	// Begin i18n.
	defaultTitle: 'Coverage Ratio',
	referenceTimeTitleText: 'Reference Time',
	currentTimeTitleText: 'Current Time',
	administrativeUnitsTitleText: 'Administrative Units',
	barChartTitleText: 'Bar Chart',
	intervalTitleText: 'Time interval',
	addLayerButtonText: "Add '{0}' layer",
	// LUC (land use/cover)
	basedOnCLCText: 'Based on CLC',
	coverText: 'Coefficiente di Copertura',
	changingTaxText: 'Tasso di Variazione',
	marginConsumeText: 'Consumo Marginale di Suolo',
	sprawlText: 'Sprawl Urbano',
	// Second fieldset (impervious)
	basedOnImperviousnessText: 'Based on Imperviousness',
	urbanDispersionText: 'Sprawl Urbano',
	edgeDensityText: 'Edge Density',
	urbanDiffusionText: 'Diffusione Urbana',
	urbanDiffusionAText: 'Urban Area',
	urbanDiffusionBText: 'Largest Class Patch Index',
	urbanDiffusionCText: 'Residual Mean Patch Surface',
	framesText: 'Frammentazione',
	consumeOnlyText: 'Consumo Suolo',
	consumeOnlyConfText: 'Perdita Approvvigionamento Alimentare',
	urbanFabricClassesText: 'Modello di Sviluppo Urbano',
    urbanDevelPolycentricLabel: "Policentrica",
    urbanDevelMonocentricDispersedLabel: "Monocentrica Dispersa",
    urbanDevelWidespreadLabel: "Diffusa",
    urbanDevelMonocentricCompactLabel: "Monocentrica Compatta",
    newUrbanizationText: 'Nuova Urbanizzazione',
    newEcologicalCorridorText: 'Nuovo Corridoio Ecologico',
	// EoF i18n
    
    /** api: config[url]
     *  ``String`` URL for the layer creation
     */
	url: null,

    /** private: config[translatedIndexNames]
     *  ``Object`` Translated index names by id
     */
	translatedIndexNames:{},

    /** private: config[splitAdmUnitsInTabs]
     *  ``Boolean`` Flag to split admin units by 10 units
     */
	splitAdmUnitsInTabs: false,

    /** private: config[pieChartHeight]
     *  ``Integer`` Pie chart height on administrative units
     */
	pieChartHeight: 400,

	/** api: method[initComponent]
	 *  Generate a panel with the configuration present on this
	 */
	initComponent: function(config){

		// Use translations
		Ext.apply(this.translatedIndexNames,{
			1: this.coverText,
			2: this.changingTaxText,
			3: this.marginConsumeText,
			4: this.sprawlText,
			5: this.urbanDispersionText,
			6: this.edgeDensityText,
			7: {
				"a": this.urbanDiffusionAText,
				"b": this.urbanDiffusionBText,
				"c": this.urbanDiffusionCText
			},
			8: this.framesText,
			9: this.consumeOnlyText,
			10: this.consumeOnlyConfText,
			11: this.urbanFabricClassesText,
			12: this.newUrbanizationText,
			13: this.newEcologicalCorridorText
		});

		if(gxp.widgets.SoilSealingResume.superclass.initComponent){
			gxp.widgets.SoilSealingResume.superclass.initComponent.call(this, config);	
		}
	},


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
		return gxp.widgets.SoilSealingResume.superclass.addOutput.call(this, config);
	},

    /** api: method[createResultsGrid]
     *  :arg data: ``Object`` Data with the wfs content
     *  :arg rasterName: ``String`` Name of the layer requested
     *  :arg referenceName: ``String`` Reference name of the layer requested
     *  :arg featureType: ``String`` Name featureType requested
     *  :returns: ``Ext.Panel`` With the resume.
     */
	createResultsGrid : function(data, rasterName, refYear, nowYear, referenceName) {
		var me = this;
		var refTimePieChartsData = null, curTimePieChartsData = null, 
			refTimeColChartsData = null, curTimeColChartsData = null;
		var referenceTimeTitle = this.referenceTimeTitleText;
		var currentTimeTitle   = this.currentTimeTitleText;

		// get translated name of the index
		if(data.index 
			&& data.index.id 
			&& this.translatedIndexNames[data.index.id]){
			if(this.translatedIndexNames[data.index.id] instanceof Object){
				if(data.index.subindex){
					data.index.name = this.translatedIndexNames[data.index.id][data.index.subindex];
				}
			}else{
				data.index.name = this.translatedIndexNames[data.index.id];	
			}
		}

		// Generate data for the charts
		if(data && data.index && data.refTime && data.refTime.output.values[0]){
			var title = data.index.name || this.defaultTitle;
			refTimePieChartsData = this.getPieChartsData(data.index.id, data.index.subindex, data.refTime.output);
			refTimeColChartsData = this.getColChartsSeries(data.index.id, data.index.subindex, data.refTime.output);
			if(data.curTime 
				// check if it have values (is not an array with [0])
				&& this.validData(data.curTime.output)){
				// 2 years
				curTimePieChartsData = this.getPieChartsData(data.index.id, data.index.subindex, data.curTime.output);
				curTimeColChartsData = this.getColChartsSeries(data.index.id, data.index.subindex, data.curTime.output);
			}else if(data.curTime){
				data.refTime.time += " - " + data.curTime.time;
				referenceTimeTitle = this.intervalTitleText;
			}
		}

		var adminUnitsTabs;
		
		var chartTitle = referenceTimeTitle;
		var chartTime  = refYear;
		
		if (!data.curTime && nowYear) {
			chartTitle = this.intervalTitleText; 
			//chartTime  = refYear + " -> " + nowYear;
			chartTime  = " Diff: " + refYear + "/" + nowYear;
		}

		// Administrative units tab only for index 1
		if(data.index.id == 1) {
			adminUnitsTabs = [];
			var adminUnitsItems = [];
			var tabIndex = 1;
			var tabItemIndex = -1;
			for(var i = 0; i < data.refTime.output.admUnits.length; i++){
				tabItemIndex++;
				var unitItems = [];
				unitItems.push(this.generatePieChart(referenceTimeTitle, refYear, refTimePieChartsData[i]));
				if(curTimePieChartsData){
					unitItems.push(this.generatePieChart(currentTimeTitle, nowYear, curTimePieChartsData[i]));
				}
				adminUnitsItems.push({
					title: data.refTime.output.admUnits[i],
					items: unitItems
				});
				if(this.splitAdmUnitsInTabs && (tabItemIndex == 9 || tabItemIndex == 12 || tabItemIndex == 13)){
					var adminUnitsTab = new Ext.Panel({
						border : false,
						layout : "accordion",
						disabled : false,
						autoScroll : false,
						title : this.administrativeUnitsTitleText + " - " + tabIndex,
						items: adminUnitsItems
					});
					adminUnitsTabs.push(adminUnitsTab);
					adminUnitsItems = [];
					tabItemIndex = -1;
					tabIndex++;
				}
			}
			if(!this.splitAdmUnitsInTabs || tabItemIndex<9){
				var admUnitsTitle = this.administrativeUnitsTitleText;
				if(tabIndex > 1){
					admUnitsTitle += " - " + tabIndex;
				}
				var adminUnitsTab = new Ext.Panel({
					border : false,
					layout : "accordion",
					disabled : false,
					autoScroll : true,
					title : admUnitsTitle,
					items: adminUnitsItems,
					defaults: {
						listeners:{
							// resize inner divs to make it visible for long accordions
							render:function(panel){
								try{
									var pieCharts = panel.items.length;
									var panelJQ = $('#' + panel.id);
									var item = panelJQ.find("div.x-panel-bwrap");
									item.height(this.pieChartHeight * pieCharts);
									var innerBody = panelJQ.find("div.x-panel-body");
									panel.on("bodyresize", function(){
										innerBody.height(this.pieChartHeight * pieCharts);
									}, this);
								}catch (e){
									// error on resizing: could not occur
									console.error("Error on panel accordion resizing");
								}
							},
							scope: this
						}
					}
				});
				adminUnitsTabs.push(adminUnitsTab);
			}
		}

		// Bar chart tab
		var barChartItems = [];
		var barChartTitle = this.barChartTitleText + " [" + chartTime + "]";
		
		var clcLevels;
		if( data.index.id == 3 )
		{
			// Marginal Land Take
			clcLevels = ["Land Use (ha/person)"];
		}
		else
		{
			clcLevels = this.getLevels(data.index.id, data.index.subindex, data.refTime.output.referenceName, data.refTime.output.clcLevels);
		}

		var indexUoM = "";
		switch(data.index.id) {
			case 1:
			case 2:
			case 5:
				indexUoM = "%";
				break;
			case 3:
				indexUoM = "ha/person";
				break;
			case 4:
				indexUoM = "";
				break;
			case 6:
				indexUoM = "m/ha";
				break;
			case 7:
				if (data.index.subindex == "c") indexUoM = "ha";
				else  indexUoM = "%";
				break;
			case 8:
				indexUoM = "No pixels";
				break;
			case 9:
				indexUoM = "ha";
				break;
			case 10:
				indexUoM = "persons/year";
				break;
			case 11:
				indexUoM = "";
				break;
			case 12:
			case 13:
				indexUoM = "No pixels";
				break;
		}

		// Prepare xAxis
		var xAxis = {
			categories: (clcLevels.length==2 && clcLevels[0].length>0?clcLevels[0]:clcLevels)
		};
		if(clcLevels.length == 0 || (clcLevels.length==2 && clcLevels[0].length==0) || 
		   (refTimeColChartsData && refTimeColChartsData[0].data.length < clcLevels.length)){
		   	var axisName = data.indexName;
		   	switch(data.index.id) {
		   		case 7:
		   			axisName = data.index.subindex;
		   	}
			xAxis.categories = [axisName + " ("+indexUoM+")"];
		}

		// title for the layers and the tab
		var title = data.indexName ? data.indexName : this.defaultTitle;
		    title+= " ("+indexUoM+(data.index.subindex?","+data.index.subindex:"")+")";
		    title+= data.jobUid ? " [" + data.jobUid + "]" : "";
		    title+= data.jcuda ? " " + data.jcuda : "";
		    //title+= " [" + chartTime + "]";

		// yAxis
		var yAxis = {};

		// add layers bar
		var addLayersBar = this.generateBar(data, title, refYear, nowYear);

		// reference time chart
		if(data.index.id === 11) {
			var quadrantsLabels = [];
    		quadrantsLabels[0] = this.urbanDevelPolycentricLabel;
    		quadrantsLabels[1] = this.urbanDevelMonocentricDispersedLabel;
    		quadrantsLabels[2] = this.urbanDevelWidespreadLabel;
    		quadrantsLabels[3] = this.urbanDevelMonocentricCompactLabel;

			barChartItems.push(
				this.generateModelScatterMultiAxisChart(
					this.urbanFabricClassesText, 
					//data.refTime.time.split(" - ")[0],
					refYear, 
					data.refTime.output,
					quadrantsLabels,
					0 // Ref Time Index
				)
			);
			
			if (data.curTime && data.curTime.output && data.curTime.output.complexValues)
			{
				barChartItems.push(
					this.generateModelScatterMultiAxisChart(
						this.urbanFabricClassesText, 
						//data.curTime.time.split(" - ")[0],
						nowYear, 
						data.curTime.output,
						quadrantsLabels,
						1 // Cur Time Index
					)
				);
			}
		} else {
			barChartItems.push(
				this.generateColumnChart(
					chartTitle,
					chartTime, 
					refTimeColChartsData, 
					xAxis, 
					yAxis)
			);
		}

		// curr time chart
		if(curTimeColChartsData){
			var clcLevels1 = this.getLevels(data.index.id, data.index.subindex, data.curTime.output.referenceName, data.curTime.output.clcLevels);
			barChartItems.push(
				this.generateColumnChart(
					this.currentTimeTitleText, 
					nowYear, 
					curTimeColChartsData, 
					xAxis, 
					yAxis)
			);
		/*}else{
			if (data.index.id === 8 || data.index.id === 11){
				barChartTitle = referenceTimeTitle;
			}else{
				barChartTitle += " - " + referenceTimeTitle;
			}*/
		}
		
		// bar charts
		var barChartTab = new Ext.Panel({
			border : false,
			disabled : false,
			autoScroll : true,
			tbar: addLayersBar,
			title : barChartTitle,
			items: []		
		});
		
		if(data.index.id !== 8 && data.index.id !== 9 && data.index.id !== 12 && data.index.id !== 13){
			barChartTab.add(barChartItems);
		};
				
		// Generated items
		var items = [];
		if(adminUnitsTabs && adminUnitsTabs.length > 0){
			for(var i = 0; i < adminUnitsTabs.length; i++){
				items.push(adminUnitsTabs);	
			}
		}
		items.push(barChartTab);


		// ///////////////////////////////////////
		// Main Tab Panel
		// ///////////////////////////////////////
		var outcomeTabPanel = new Ext.TabPanel({
			title : title,
			// height : 300,
			// width : 300,
			closable : true,
			renderTo : Ext.getBody(),
			activeTab : 0,
			items : items
		});
		
		// ///////////////////////////////////////
		// Drawing the Panel
		// ///////////////////////////////////////
		return outcomeTabPanel;
	},

    /** api: method[validData]
     *  :arg yearData: ``Object`` Data in the year
     *  :returns: ``Boolean`` True if there are some data different to 0 and false otherwise.
     */
	validData: function(yearData){
		var valid = false;
		var chartsSeries = [];
		if(yearData.admUnits 
			&& yearData.clcLevels 
			&& yearData.values
			&& yearData.admUnits.length == yearData.values.length){
			for(var i = 0; i < yearData.admUnits.length; i++){
				if(yearData.values[i]){
					valid = true;
					break;
				}
			}
		}
		return valid;
	},

    /** api: method[getPieChartsData]
     *  :arg yearData: ``Object`` Data in the year
     *  :returns: ``Array`` With the pie chart data.
     */
	getPieChartsData: function(indexId, subIndex, yearData){
		var chartsData = [];
		if(yearData.admUnits 
			&& yearData.clcLevels 
			&& yearData.values
			&& yearData.admUnits.length == yearData.values.length){
			var clcLevels = this.getLevels(indexId, subIndex, yearData.referenceName, yearData.clcLevels);
			for(var i = 0; i < yearData.admUnits.length; i++){
									
				//var colorRGB = this.randomColorsRGB(yearData.values[i].length);
				//var colorHEX = this.randomColorsHEX(yearData.values[i].length);	
				
				if(yearData.clcLevels.length == yearData.values[i].length){
					var pieChartData = [];
					var pieChartDataColor = [];
					// for(var j = 0; j < yearData.clcLevels.length; j++){
					for(var j = 0; j < clcLevels[0].length; j++){
						//pieChartData.push([yearData.clcLevels[j], yearData.values[i][j]]);
						if( yearData.values[i][j] > 0 ){
							//pieChartDataColor.push(colorHEX[j]);
							pieChartDataColor.push(clcLevels[1][j]);
							pieChartData.push([clcLevels[0][j], yearData.values[i][j]]);
						}
							
					}
					chartsData.push([pieChartData,pieChartDataColor]);
				}
			}
		}
		return chartsData;
	},

    /** api: method[getColChartsSeries]
     *  :arg yearData: ``Object`` Data in the year
     *  :returns: ``Array`` With the cols chart data.
     */
	getColChartsSeries: function(indexId, subIndex, yearData){
		var chartsSeries = [];
		if(yearData.admUnits 
			&& yearData.clcLevels 
			&& yearData.values
			&& yearData.admUnits.length == yearData.values.length){
			var clcLevels = this.getLevels(indexId, subIndex, yearData.referenceName, yearData.clcLevels);
			
			for(var i = 0; i < yearData.admUnits.length; i++){
				
				var data = [];
				if (clcLevels.length == 2 && clcLevels[1].length == yearData.values[i].length) {
					for(var j = 0; j < yearData.values[i].length; j++) {
						data.push(({ y: yearData.values[i][j], color: clcLevels[1][j] }));
					}	
				} else {
					data = yearData.values[i];
				}
				
				var colChartSeries = {
					name: yearData.admUnits[i],
					data: data,
					colors: clcLevels[1]
				};
				chartsSeries.push(colChartSeries);
			}
		}
		return chartsSeries;
	},

    /** api: method[generatePieChart]
     *  :arg title: ``String`` Title for the pie chart
     *  :arg subTitle: ``String`` Subtitle for the pie chart
     *  :arg data: ``Object`` Data for the pie chart
     *  :returns: ``Ext.ux.HighChart`` Pie Chart component.
     */
	generatePieChart: function(title, subTitle, data){
		var pieChartConfig = {};
		Ext.apply(pieChartConfig, this.pieChartConfig);
		Ext.apply(pieChartConfig, {
			title : title
		});
		Ext.apply(pieChartConfig.series[0], {
			name: subTitle,
			data : data
		});
		Ext.apply(pieChartConfig.chartConfig, {
			title : {
				text : title
			},
			subtitle : {
				text : subTitle
			}
		});
		return new Ext.ux.HighChart(pieChartConfig);
	},

    /** api: method[generateColumnChart]
     *  :arg title: ``String`` Title for the columns chart
     *  :arg subTitle: ``String`` Subtitle for the columns chart
     *  :arg series: ``Array`` Series for the columns chart
     *  :arg xAxis: ``Array`` xAxis for the columns chart
     *  :arg yAxis: ``Array`` yAxis for the columns chart
     *  :returns: ``Ext.ux.HighChart`` Columns Chart component.
     */
	generateColumnChart: function(title, subTitle, series, xAxis, yAxis){
		var columnsChartConfig = {};
		Ext.apply(columnsChartConfig, this.columnsChartConfig);
		Ext.apply(columnsChartConfig, {
			title : title,
			series : series
		});
		Ext.apply(columnsChartConfig.chartConfig, {
			title : {
				text : title
			},
			subtitle : {
				text : subTitle
			},
		    scrollbar: {
		        enabled: true
		    },
			xAxis: xAxis,
			yAxis: yAxis || columnsChartConfig.chartConfig.yAxis
		});
		return new Ext.ux.HighChart(columnsChartConfig);
	},

    /** api: method[generatePieChart]
     *  :arg title: ``String`` Title for the pie chart
     *  :arg subTitle: ``String`` Subtitle for the pie chart
     *  :arg data: ``Object`` Data for the pie chart
     *  :returns: ``Ext.ux.HighChart`` Pie Chart component.
     */
	generatePieChart: function(title, subTitle, data){
		return new Ext.ux.HighChart({
			title : title,
			animation : true,
			animShift : true,
			series : [{
				type : 'pie',
				name: subTitle,
				data : data[0]
			}],
			chartConfig : {
				chart : {
					plotBackgroundColor : null,
					plotBorderWidth : null,
					plotShadow : true,
					spacingBottom : 65
				},
				title : {
					text : title
				},
				subtitle : {
					text : subTitle
				},
				tooltip : {
	                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
	                footerFormat: '</table>',
	                shared: true,
	                useHTML: true
				},
				plotOptions : {
					pie : {
						allowPointSelect : true,
						cursor : 'pointer',
						colors: data[1],
						dataLabels : {
							enabled : true,
							color : '#000000',
							connectorColor : '#000000',
							format : '<b>{point.name}</b>: {point.percentage:.4f} %'
						}
					}
				}
			}
		});
	},

    /** api: method[generateColumnChart]
     *  :arg title: ``String`` Title for the columns chart
     *  :arg subTitle: ``String`` Subtitle for the columns chart
     *  :arg series: ``Array`` Series for the columns chart
     *  :arg xAxis: ``Array`` xAxis for the columns chart
     *  :arg yAxis: ``Array`` yAxis for the columns chart
     *  :returns: ``Ext.ux.HighChart`` Columns Chart component.
     */
	generateColumnChart: function(title, subTitle, series, xAxis, yAxis){
		return new Ext.ux.HighChart({
			title : title,
			animation : true,
			animShift : true,
			series : series,
			animShift: true,
			chartConfig : {
				chart : {
					zoomType: 'x',
					type : 'column'
				},
				title : {
					text : title
				},
				subtitle : {
					text : subTitle
				},
				// tooltip : {
				// 	pointFormat : '{point.name}: <b>{point.percentage:.4f}%</b>'
				// },
				yAxis : yAxis,
				xAxis: xAxis
			}
		});
	},

	generateModelScatterMultiAxisChart: function(title, subTitle, data, quadrants, timeIndex){

		admUnits = data.admUnits;
		values   = data.complexValues;
				
		var edClassObjects = [];
		var rmpsObjects    = [];
		
		// here I should set the feasible {min,max} values for each axis (i.e. variable)
		var xMin = 0, xMax = 0, xBuffer = 1;
		var yMin = 0, yMax = 0, yBuffer = 1;
		var zMin = 0, zMax = 0, zBuffer = 50;
		
		for(var i=0; i<admUnits.length; i++)
		{
			admName   = admUnits[i];
			admValues = values[i][timeIndex]; // Ref Time || Cur Time
			
			// CHECKING NODE (are values within prescribed range?)
			// xMin, xMax
			if(xMin>admValues[0] && admValues[0]>0){
				xMin=admValues[0];// avoid assignment, it is done below, here manage a warning to be given to GUI user
			}
			if(xMax<admValues[0]){
				xMax=admValues[0];
			}
			
			// yMin, yMax
			if(yMin>admValues[1] && admValues[1]>0){
				yMin=admValues[1];
			}
			if(yMax<admValues[1]){
				yMax=admValues[1];
			}

			// zMin, zMax
			if(zMin>admValues[2] && admValues[2]>0){
				zMin=admValues[2];
			}
			if(zMax<admValues[2]){
				zMax=admValues[2];
			}
			
			edClassObjects[i] = {x: admValues[0], y: admValues[1], z: admValues[2], name: admName};
			rmpsObjects[i]    = [admValues[0], (admValues[2]/1000)*30, admValues[1]];
		}

		// ASSIGNING NODE
		// xMin=max(xMin,admValues[0]-xBuffer);
		// and write xmin in xAxis directly!!
		// apply to y & z axis too!
		xMin = Math.max(0, xMin-xBuffer);
		xMax = xMax+xBuffer;

		yMin = Math.max(0, yMin-yBuffer);
		yMax = yMax+yBuffer;

		zMin = Math.max(0, zMin-zBuffer);
		zMax = zMax+zBuffer;

        var text1;
        var text2;
        var text3;
        var text4;
	    
	    // Give the points a 3D feel by adding a radial gradient
	    /*Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
	        return {
	            radialGradient: {
	                cx: 0.4,
	                cy: 0.3,
	                r: 0.5
	            },
	            stops: [
	                [0, color],
	                [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
	            ]
	        };
	    });*/
	    		
		return new Ext.ux.HighChart({
			title : title,
			loadMask:true,
			animation : true,
			height: 600,
			chartConfig : {
		        chart: {
		        	//zoomType: 'xy',
		            margin: 100,
		            type: 'scatter',
		            options3d: {
		                enabled: true,
		                alpha: 10,
		                beta: 30,
		                depth: 600,
		                viewDistance: 5,
		                fitToPlot: false,
		                frame: {
		                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
		                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
		                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
		                }
		            },
		            events: {
		            	load: function() {
		            		var chart = this;

		            		text1 = chart.renderer.text(quadrants[0]).attr({x: chart.xAxis[0].toPixels(21), y: chart.yAxis[0].toPixels(28)}).add();
					        text2 = chart.renderer.text(quadrants[1]).attr({x: chart.xAxis[0].toPixels(88), y: chart.yAxis[0].toPixels(28)}).add();
					        text3 = chart.renderer.text(quadrants[2]).attr({x: chart.xAxis[0].toPixels(21), y: chart.yAxis[0].toPixels(1)}).add();
					        text4 = chart.renderer.text(quadrants[3]).attr({x: chart.xAxis[0].toPixels(88), y: chart.yAxis[0].toPixels(1)}).add();		            		

		            		$(this.container).bind('mousedown.hc touchstart.hc', function (eStart) {
						        eStart = chart.pointer.normalize(eStart);
						
						        var posX = eStart.pageX,
						            posY = eStart.pageY,
						            alpha = chart.options.chart.options3d.alpha,
						            beta = chart.options.chart.options3d.beta,
						            newAlpha,
						            newBeta,
						            sensitivity = 5; // lower is more sensitive
						
						        $(document).bind({
						            'mousemove.hc touchdrag.hc': function (e) {
						                // Run beta
						                newBeta = beta + (posX - e.pageX) / sensitivity;
						                chart.options.chart.options3d.beta = newBeta;
						
						                // Run alpha
						                newAlpha = alpha + (e.pageY - posY) / sensitivity;
						                chart.options.chart.options3d.alpha = newAlpha;
						
						                chart.redraw(false);
						            },
						            'mouseup touchend': function () {
						                $(document).unbind('.hc');
						            }
						        });
						    });
		            	},
		            	redraw: function () {
		            		var chart = this;
		            		
		            		text1.destroy();
		            		text2.destroy();
		            		text3.destroy();
		            		text4.destroy();

					        text1 = chart.renderer.text(quadrants[0]).attr({x: chart.xAxis[0].toPixels(21), y: chart.yAxis[0].toPixels(28)}).add();
					        text2 = chart.renderer.text(quadrants[1]).attr({x: chart.xAxis[0].toPixels(88), y: chart.yAxis[0].toPixels(28)}).add();
					        text3 = chart.renderer.text(quadrants[2]).attr({x: chart.xAxis[0].toPixels(21), y: chart.yAxis[0].toPixels(1)}).add();
					        text4 = chart.renderer.text(quadrants[3]).attr({x: chart.xAxis[0].toPixels(88), y: chart.yAxis[0].toPixels(1)}).add();		            		
		            	}
		            }
		        },
		        title: {
		            text: title
		        },
		        subtitle: {
		            text: subTitle
		        },
		        credits: {
		            text: 'Data from <a href="www.isprambiente.gov.it/en">ISPRA</a>',
		            href: 'www.isprambiente.gov.it/en',
		            position: {
		                x: -40
		            }
		        },
		        plotOptions: {
		            scatter: {
		                width: 10,
		                height: 10,
		                depth: 10,
		            	dataLabels: {
		                    enabled: true,
		                    format: '{point.name}',
		                    rotation: 30,
		                    x: 5,
		                    y: 0,
		                    align: 'left',
		                    verticalAlign: 'middle',
		                    style: {
		                      fontSize: '9px',
		                      fontWeight: 'bold',
		                      color: 'red'
		                    }
		               }
		            }
		        },
		        xAxis: {
		        	min: xMin,
		            max: xMax,
		            gridLineWidth: 1,
		            title: {
		                text: 'LCPI',
		                style: {
		                    color: Highcharts.getOptions().colors[1]
		                }
		            },
		            plotLines: [{
		                color: 'black',
		                dashStyle: 'dot',
		                width: 2,
		                value: 70,// Threshold
		                label: {
		                    rotation: 0,
		                    y: 15,
		                    style: {
		                        fontStyle: 'italic'
		                    },
		                    //ext: 'Monocentrica'
		                }
		            }]
		        },
		        zAxis: { 
		            min: zMin,
		            max: zMax,
		            gridLineWidth: 1,
		            tickInterval: 100,
		            title: {
		                text: 'EDClass',
		                style: {
		                    color: Highcharts.getOptions().colors[0]
		                }
		            },
		            opposite: false
		        },
		        yAxis: { // Primary yAxis
		        	min: yMin,
		            max: yMax,
		            tickInterval: 3,
		            gridLineWidth: 1,
		            title: {
		                text: 'RMPS',
		                style: {
		                    color: Highcharts.getOptions().colors[0]
		                }
		            },
		            plotLines: [{
		                color: 'black',
		                dashStyle: 'dot',
		                width: 2,
		                value: 9,// Threshold for classifying Type of Urban Dev
		                label: {
		                    align: 'right',
		                    style: {
		                        fontStyle: 'italic'
		                    },
		                    //text: 'Compatta',
		                    x: -10
		                }
		            }]
		        },
		        legend: {
		            enabled: false
		        },
		        // Enable for both axes
		        tooltip: {
		            shared: false,
		            crosshairs: [true,true],
		            backgroundColor: '#FFFFFF',
		            borderColor: 'black',
		            borderRadius: 10,
		            borderWidth: 3,
 		            formatter: function(chart) {
		               var p = this.point;
		               return '<b>' + p.name + '</b>' + '<br>' + 
		                      '<b>LCPI:</b> ' + Highcharts.numberFormat(p.x, 2, ',') + '<br>' + 
		                      '<b>RMPS:</b> ' + Highcharts.numberFormat(p.y, 2, ',') + '<br>' + 
		                      '<b>EDClass:</b> ' + Highcharts.numberFormat(p.z, 2, ',');
		            }
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'left',
		            x: 80,
		            verticalAlign: 'top',
		            y: 55,
		            floating: true,
		            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
		            enabled: false
		        },
		        series: [{
		            name: title,
		            colorByPoint: true,
		            pointPlacement:0.0,
		            data: edClassObjects,
		            shadow: false,
		            visible: true
		        }]
			}
		});
	},
	
    /** api: method[generatePieChart]
     *  :arg title: ``String`` Title for the pie chart
     *  :arg subTitle: ``String`` Subtitle for the pie chart
     *  :arg data: ``Object`` Data for the pie chart
     *  :returns: ``Ext.ux.HighChart`` Pie Chart component.
     */
	generateModelScatterMultiAxisChart2: function(title, subTitle, data, quadrants){
		
		admUnits = data.admUnits;
		values   = data.complexValues;
				
		var edClassObjects = [];
		var rmpsObjects    = [];
		
		for(var i=0; i<admUnits.length; i++)
		{
			admName   = admUnits[i];
			admValues = values[i][0]; // Ref Time
			
			edClassObjects[i] = {x: admValues[0], y: admValues[2], name: admName};
			rmpsObjects[i]    = [admValues[0], (admValues[2]/1000)*30, admValues[1]];
		}

        var text1;
        var text2;
        var text3;
        var text4;
		
		return new Ext.ux.HighChart({
			title : title,
			loadMask:true,
			animation : true,
			chartConfig : {
		        chart: {
		            zoomType: 'xy',
		            type: 'boxplot',
		            events: {
		            	load: function() {
					        text1 = this.renderer.text(quadrants[0]).attr({x: this.xAxis[0].toPixels(21), y: this.yAxis[1].toPixels(28)}).add();
					        text2 = this.renderer.text(quadrants[1]).attr({x: this.xAxis[0].toPixels(88), y: this.yAxis[1].toPixels(28)}).add();
					        text3 = this.renderer.text(quadrants[2]).attr({x: this.xAxis[0].toPixels(21), y: this.yAxis[1].toPixels(1)}).add();
					        text4 = this.renderer.text(quadrants[3]).attr({x: this.xAxis[0].toPixels(88), y: this.yAxis[1].toPixels(1)}).add();		            		
		            	},
		            	redraw: function () {
		            		text1.destroy();
		            		text2.destroy();
		            		text3.destroy();
		            		text4.destroy();

					        text1 = this.renderer.text(quadrants[0]).attr({x: this.xAxis[0].toPixels(21), y: this.yAxis[1].toPixels(28)}).add();
					        text2 = this.renderer.text(quadrants[1]).attr({x: this.xAxis[0].toPixels(88), y: this.yAxis[1].toPixels(28)}).add();
					        text3 = this.renderer.text(quadrants[2]).attr({x: this.xAxis[0].toPixels(21), y: this.yAxis[1].toPixels(1)}).add();
					        text4 = this.renderer.text(quadrants[3]).attr({x: this.xAxis[0].toPixels(88), y: this.yAxis[1].toPixels(1)}).add();		            		
		            	}
		            }
		        },
		        title: {
		            text: title
		        },
		        subtitle: {
		            text: subTitle
		        },
		        credits: {
		            text: 'Data from <a href="www.isprambiente.gov.it/en">ISPRA</a>',
		            href: 'www.isprambiente.gov.it/en',
		            position: {
		                x: -40
		            }
		        },
				series: [{
		            name: 'EDClass',
		            type: 'scatter',
		            pointPlacement:0.0,
		            data: edClassObjects,
		            shadow: false,
		            visible: true
		        },{
		            name: 'RMPS',
		            type: 'errorbar',
		            yAxis: 1,
		            data: rmpsObjects
		        }],		        
		        xAxis: [{
		        	min: 20,
		            max: 100,
		            title: {
		                text: 'LCPI',
		                style: {
		                    color: Highcharts.getOptions().colors[1]
		                }
		            },
		            plotLines: [{
		                color: 'black',
		                dashStyle: 'dot',
		                width: 2,
		                value: 70,
		                label: {
		                    rotation: 0,
		                    y: 15,
		                    style: {
		                        fontStyle: 'italic'
		                    },
		                    //ext: 'Monocentrica'
		                },
		                zIndex: 100
		            }]
		        }],
		        yAxis: [{ // Primary yAxis
		            min: 0,
		            gridLineWidth: 0,
		            tickInterval: 100,
		            title: {
		                text: 'EDClass',
		                style: {
		                    color: Highcharts.getOptions().colors[0]
		                }
		            },
		            plotLines: [{
		                color: 'black',
		                dashStyle: 'dot',
		                width: 2,
		                value: 250,
		                label: {
		                    align: 'right',
		                    style: {
		                        fontStyle: 'italic'
		                    },
		                    //text: 'Compatta',
		                    x: -10
		                },
		                zIndex: 100
		            }],
		            opposite: true
		        }, { // Secondary yAxis
		        	min: 0,
		            max: 30,
		            tickInterval: 3,
		            title: {
		                text: 'RMPS',
		                style: {
		                    color: Highcharts.getOptions().colors[0]
		                }
		            },
		            opposite: false
		        }],
		        // Enable for both axes
		        tooltip: {
		            shared: false,
		            crosshairs: [true,true],
		            backgroundColor: '#FFFFFF',
		            borderColor: 'black',
		            borderRadius: 10,
		            borderWidth: 3
		        },
		        legend: {
		            layout: 'vertical',
		            align: 'left',
		            x: 80,
		            verticalAlign: 'top',
		            y: 55,
		            floating: true,
		            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
		            enabled: false
		        },
		        plotOptions: {
		        	scatter: {
		            	dataLabels: {
		                    enabled: true,
		                    format: '{point.name}',
		                    rotation: 30,
		                    x: 20,
		                    y: 2,
		                    style: {
		                      fontSize: '9px',
		                      fontWeight: 'bold',
		                      color: 'red'
		                    }
		                },
		                tooltip: {
		                    headerFormat: '<b>{series.name}</b><br>',
		                    pointFormat: 'LCPI value: {point.x}, {series.name} value: {point.y}'
		                }
		            },
		            errorbar: {
		                dataLabels: {
		                    enabled: true,
		                    format: '{point.name}',
		                    rotation: 30,
		                    x: 20,
		                    y: 2,
		                    style: {
		                      fontSize: '8px',
		                      color: 'black'
		                    }
		                },
		                tooltip: {
		                    headerFormat: '<b>{series.name}</b><br>',
		                    pointFormat: 'LCPI value: {point.x}, {series.name} value: {point.y} - low: {point.low}'
		                }
		            }
		        }
			}
		});
	},
	
	getLevels: function(indexId, subIndex, referenceName, clcLevels){
		var indexUoM = "";
		switch(indexId) {
			case 1:
			case 2:
			case 5:
				indexUoM = "%";
				break;
			case 3:
				indexUoM = "ha/person";
				break;
			case 4:
				indexUoM = "";
				break;
			case 6:
				indexUoM = "m/ha";
				break;
			case 7:
				if (subIndex == "c") indexUoM = "ha";
				else  indexUoM = "%";
				break;
			case 8:
				indexUoM = "No pixels";
				break;
			case 9:
				//indexUoM = "ha/person";
				indexUoM = "ha";
				break;
			case 10:
				indexUoM = "persons/year";
				break;
			case 11:
				indexUoM = "";
				break;
		}
		
		try{
			//layer level
			var classDataIndex = 0;
			for ( classDataIndex = 0; classDataIndex < this.classes.length; classDataIndex++) {
				if (this.classes[classDataIndex].layer == referenceName)
					break;
			}
			if (classDataIndex >= this.classes.length) {
				return clcLevels;
			}else{
				var classes = [];
				var colors = [];
				var classesSelected = clcLevels;
				for(var i = 0; i < classesSelected.length; i++){
					var classIndex = parseInt(classesSelected[i]);
					for(var j = 0; j < this.classesIndexes[classDataIndex][1].length; j++){
						if(this.classesIndexes[classDataIndex][1][j][0] == classIndex){
							classes.push(this.classesIndexes[classDataIndex][1][j][1] + "("+indexUoM+")");
							colors.push(this.classesIndexes[classDataIndex][1][j][2]);
							break;
						}
					}
				}

				return [classes, colors];
			}
		}catch(e){
			return clcLevels;
		}
	},

    /** api: method[generateBar]
     *  :arg config: ``Object`` Response data
     *  :arg title: ``String`` Title for the layers
     *  :returns: ``Ext.Toolbar`` for the bar or null if it's not need
     *  Obtain bar.
     */
	generateBar: function(config, title, refYear, nowYear){
		// generate bar for add layers
		var items = [];
		var item1 = null, item0 = null;

		// ref time layer
		if(config.refTime
			&& config.refTime.output
			&& config.refTime.output.layerName){
			
			item0 = this.generateBarItem(config.refTime.output.layerName, refYear+
                     (config.index.id == 3 || config.index.id == 4 || config.index.id == 9 ? "/"+nowYear+" Diff" : " ["+this.referenceTimeTitleText+"]"), title);	
		}

		// curr time layer
		if(config.curTime
			&& config.curTime.output
			&& config.curTime.output.layerName){

			item1 = this.generateBarItem(config.curTime.output.layerName, nowYear+" ["+this.currentTimeTitleText+"]", title);	
		}

		// push items
		if(item0){
			items.push(item0);
		}
		if(config.diffImageName){
			var item = this.generateBarItem(config.diffImageName, refYear+"/"+nowYear+" Diff", title);
			items.push(item);
		}
		if(item1){
			//items.push("->");
			items.push(item1);
		}

		// return toolbar if exist one add layer button
		if(items.length > 0){
			return new Ext.Toolbar({
				items : items
			});
		}else{
			null;
		}
	},

    /** api: method[generateButtom]
     *  :arg layerName: ``Object`` Configuration for the layer name
     *  :arg timeName: ``String`` Name for the add layer buttom
     *  :arg title: ``String`` Title for the layer
     *  :returns: ``Ext.Toolbar`` for the buttom bar.
     *  Obtain bar item.
     */
	generateBarItem: function(layerName, timeName, title){
		var layerTitle = title && timeName ? title + " - " + timeName: layerName;
		if(layerName && layerName != ""){
			return {
				text : String.format(this.addLayerButtonText, timeName),
				iconCls : 'gxp-icon-addlayers',
				handler : function(){
					var src;				                            
					for (var id in this.target.layerSources) {
						  var s = this.target.layerSources[id];    
						  
						  // //////////////////////////////////////////
						  // Checking if source URL aldready exists
						  // //////////////////////////////////////////
						  if(s != undefined && s.id == this.geocoderConfig.source){
							  src = s;
							  break;
						  }
					}
					var group = "Soil Sealing";
                    var props ={
                			source: this.target.layerSources.jrc.id,
                            name: layerName,
                            url: this.url,
                            title: layerTitle,
                            tiled: true,
                            group: group,
                            layers: layerName
                    };
												
				    var index = src.store.findExact("name", layerName);
				    
				    var tree = Ext.getCmp("layertree");
				    var groupExists = false;
				    for (var node=0; node<tree.root.childNodes.length; node++)
				    	if (group == tree.root.childNodes[node].text)
				    		groupExists = true;
				    
				    if (!groupExists) {
				    	var node = new GeoExt.tree.LayerContainer({
                            text: group,
                            iconCls: "gxp-folder",
                            expanded: true,
                            checked: true,
                            group: group == "default" ? undefined : group,
                            loader: new GeoExt.tree.LayerLoader({
                                baseAttrs: undefined,
                                store: this.target.mapPanel.layers,
                                filter: (function(group) {
                                    return function(record) {
                                        return (record.get("group") || "default") == group &&
                                            record.getLayer().displayInLayerSwitcher == true;
                                    };
                                })(group)
                            }),
                            singleClickExpand: true,
                            allowDrag: true,
                            listeners: {
                                append: function(tree, node) {
                                    node.expand();
                                }
                            }
                        });
                        
                        tree.root.insertBefore(node, tree.root.firstChild.nextSibling);
				    }
					
					// ///////////////////////////////////////////////////////////////
					// In this case is necessary reload the local store to refresh 
					// the getCapabilities records 
					// ///////////////////////////////////////////////////////////////
					var addLayer = this.target.tools["addlayer"];
                                        
		            var options = {
						msLayerTitle: layerTitle,
						msLayerName: layerName,
						wmsURL: this.url,
						msLayerUUID: layerName,
						msGroupName: group
					};
					
					addLayer.addLayer(
						options
					);

					/*
					 * Check if tabs exists and if so switch to View Tab 
					 */
					var hasTabPanel = false;
					if (this.target.renderToTab) {
						var container = Ext.getCmp(this.target.renderToTab);
						if (container.isXType('tabpanel'))
							hasTabPanel = true;
					}
			
					if (hasTabPanel) {
						if (this.win)
							this.win.destroy();
						if(container)
							container.setActiveTab(0);
					}
				},
				scope:this
			};
		}else{
			return null;
		}
	},
	
    randomColorsRGB: function(total){
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v) {
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return rgb;
        };
        
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.57, 0.63)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        
        return r;
    },
	
    randomColorsHEX: function(total){
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        };
        
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.57, 0.63)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        
        return r;
    }
	
});

Ext.preg(gxp.widgets.SoilSealingResume.prototype.ptype, gxp.widgets.SoilSealingResume);
