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
	// EoF i18n
    
    /** api: config[url]
     *  ``String`` URL for the layer creation
     */
	url: null,

    /** api: config[columnsChartConfig]
     *  ``Object`` Default configuration for the column chart
     */
	columnsChartConfig: {
		animation : true,
		animShift : true,
		chartConfig : {
			chart : {
				type : 'column'
			},
			yAxis: {
				min: 0
			}
		}
	},

    /** api: config[pieChartConfig]
     *  ``Object`` Default configuration for the pie chart
     */
	pieChartConfig: {
		animation : true,
		animShift : true,
		series : [{
			type : 'pie'
		}],
		chartConfig : {
			chart : {
				plotBackgroundColor : null,
				plotBorderWidth : null,
				plotShadow : true,
				spacingBottom : 65
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
					dataLabels : {
						enabled : true,
						color : '#000000',
						connectorColor : '#000000'
						// ,
						// format : '<b>{point.name}</b>: {point.percentage:.4f} %'
					}
				}
			}
		}
	},

	defaultInput: {
	  "index": {
	    "id": 1,
	    "name": "Coverage Ratio"
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
	    "name": "Coverage Ratio"
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
	createResultsGrid : function(data, rasterName, referenceName) {
		var me = this;
		var refTimePieChartsData = null, curTimePieChartsData = null, 
			refTimeColChartsData = null, curTimeColChartsData = null;

		// Generate data for the charts
		if(data && data.index && data.refTime){
			var title = data.index.name || this.defaultTitle;
			refTimePieChartsData = this.getPieChartsData(data.refTime.output);
			refTimeColChartsData = this.getColChartsSeries(data.refTime.output);
			if(data.curTime){
				// 2 years
				curTimePieChartsData = this.getPieChartsData(data.curTime.output);
				curTimeColChartsData = this.getColChartsSeries(data.curTime.output);
			}
		}

		// Administrative units tab
		var adminUnitsItems = [];
		for(var i = 0; i < data.refTime.output.admUnits.length; i++){
			var unitItems = [];
			unitItems.push(this.generatePieChart(this.referenceTimeTitleText, data.refTime.time, refTimePieChartsData[i]));
			if(curTimePieChartsData){
				unitItems.push(this.generatePieChart(this.currentTimeTitleText, data.curTime.time, curTimePieChartsData[i]));
			}
			adminUnitsItems.push({
				title: data.refTime.output.admUnits[i],
				items: unitItems
			});
		}
		var adminUnitsTab = new Ext.Panel({
			border : false,
			layout : "accordion",
			disabled : false,
			autoScroll : false,
			title : this.administrativeUnitsTitleText,
			items: adminUnitsItems
		});

		// Bar chart tab
		var barChartItems = [];
		var barChartTitle = this.barChartTitleText;
		barChartItems.push(
			this.generateColumnChart(
				this.referenceTimeTitleText, 
				data.refTime.time, 
				refTimeColChartsData, 
				{
					categories: data.refTime.output.clcLevels
				}, {
					min: 0
				})
		);
		if(curTimeColChartsData){
			barChartItems.push(
				this.generateColumnChart(
					this.currentTimeTitleText, 
					data.curTime.time, 
					curTimeColChartsData, 
					{
						categories: data.curTime.output.clcLevels
					}, {
						min: 0
					})
			);
		}else{
			barChartTitle += " - " + this.referenceTimeTitleText;
		}
		var barChartTab = new Ext.Panel({
			title : barChartTitle,
			items: barChartItems
		});

		// ///////////////////////////////////////
		// Main Tab Panel
		// ///////////////////////////////////////
		var outcomeTabPanel = new Ext.TabPanel({
			title : this.defaultTitle,
			// height : 300,
			// width : 300,
			closable : true,
			renderTo : Ext.getBody(),
			activeTab : 0,
			items : [adminUnitsTab, barChartTab]
		});
		
		// ///////////////////////////////////////
		// Drawing the Panel
		// ///////////////////////////////////////
		return outcomeTabPanel;
	},

    /** api: method[getPieChartsData]
     *  :arg yearData: ``Object`` Data in the year
     *  :returns: ``Array`` With the pie chart data.
     */
	getPieChartsData: function(yearData){
		var chartsData = [];
		if(yearData.admUnits 
			&& yearData.clcLevels 
			&& yearData.values
			&& yearData.admUnits.length == yearData.values.length){
			for(var i = 0; i < yearData.admUnits.length; i++){
				if(yearData.clcLevels.length == yearData.values[i].length){
					var pieChartData = [];
					for(var j = 0; j < yearData.clcLevels.length; j++){
						pieChartData.push([yearData.clcLevels[j], yearData.values[i][j]]);
					}
					chartsData.push(pieChartData);
				}
			}
		}
		return chartsData;
	},

    /** api: method[getColChartsSeries]
     *  :arg yearData: ``Object`` Data in the year
     *  :returns: ``Array`` With the cols chart data.
     */
	getColChartsSeries: function(yearData){
		var chartsSeries = [];
		if(yearData.admUnits 
			&& yearData.clcLevels 
			&& yearData.values
			&& yearData.admUnits.length == yearData.values.length){
			for(var i = 0; i < yearData.admUnits.length; i++){
				var colChartSeries = {
					name: yearData.admUnits[i],
					data: yearData.values[i]
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
				data : data
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
			chartConfig : {
				chart : {
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
	}

});

Ext.preg(gxp.widgets.SoilSealingResume.prototype.ptype, gxp.widgets.SoilSealingResume);
