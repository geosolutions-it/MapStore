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
 *  class = WeatherProgResume
 */

/** api: (extends)
 *  Ext.Panel.js
 */
Ext.namespace("gxp.widgets");

/** api: constructor
 *  .. class:: WeatherProgResume(config)
 *
 *    Show a resume for a record
 */
gxp.widgets.WeatherProgResume = Ext.extend(gxp.widgets.WFSResume, {

	/** api: ptype = gxp_weatherprogresume */
	ptype : "gxp_weatherprogresume",

	// Begin i18n.
	addLayerButtonText: "Add '{0}' layer",
    higherBoundChartText: "Higher Bound",
    lowerBoundChartText: "Lower Bound",
    resultChartText: "Result",    
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

		if(gxp.widgets.WeatherProgResume.superclass.initComponent){
			gxp.widgets.WeatherProgResume.superclass.initComponent.call(this, config);	
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
		return gxp.widgets.WeatherProgResume.superclass.addOutput.call(this, config);
	},

    createResultsGrid : function(data, rasterName, refYear, nowYear, referenceName) {
    
        var me = this;
        
        var barChartItems = [];
        
        var series = [];
        
		var xAxis = {
			categories: data.times,
            type: 'datetime',
            labels: {
                rotation: -30,
                y: 10
            }
		};

		// yAxis
		var yAxis = {};

        var plotsChartSeries1 = {
            name: this.higherBoundChartText,
            data: data.higherBound.splice(-data.higherBound.length,data.times.length),
            type: 'spline'
        };
        
        var plotsChartSeries2 = {
            name: this.lowerBoundChartText,
            data: data.lowerBound.splice(-data.lowerBound.length,data.times.length),
            type: 'spline'
        };

        var plotsChartSeries3 = {
            name: this.resultChartText,
            data: data.result.splice(-data.result.length,data.times.length),
            type: 'scatter'
        };
        
        //chartsSeries.push(colChartSeries);
                
        series.push(plotsChartSeries1);
        series.push(plotsChartSeries2);
        series.push(plotsChartSeries3);
        
		// reference time chart
		barChartItems.push(
			this.generateLineChart(
				"Statistic: "+data.stat+" - " + referenceName, 
				"Start Date: " + data.startTime + " - End Time: " + data.endTime, 
				series, 
				xAxis, 
				yAxis)
		);

		// add layers bar
		var addLayersBar = this.generateBar(data, "Raster");
        
		// bar charts
		var barChartTab = new Ext.Panel({
			tbar: addLayersBar,
			title : "Statistic: "+data.stat+" - " + referenceName,
			items: barChartItems
		});

		// Generated items
		var items = [];
        
		items.push(barChartTab);
        
        // ///////////////////////////////////////
        // Main Tab Panel
        // ///////////////////////////////////////
        var outcomeTabPanel = new Ext.TabPanel({
            title : "Weather Prog: " + referenceName,
			rasterName: rasterName,
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

    /** api: method[generateLineChart]
     *  :arg title: ``String`` Title for the columns chart
     *  :arg subTitle: ``String`` Subtitle for the columns chart
     *  :arg series: ``Array`` Series for the columns chart
     *  :arg xAxis: ``Array`` xAxis for the columns chart
     *  :arg yAxis: ``Array`` yAxis for the columns chart
     *  :returns: ``Ext.ux.HighChart`` Columns Chart component.
     */
	generateLineChart: function(title, subTitle, series, xAxis, yAxis){
		return new Ext.ux.HighChart({
			title : title,
			animation : true,
			animShift : true,
			series : series,
			animShift: true,
			chartConfig : {
				chart : {
					zoomType: 'x',
					type : 'spline'
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
				xAxis : xAxis
			}
		});
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
				if(yearData.values[i] != 0){
					valid = true;
					break;
				}
			}
		}
		return valid;
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

    /** api: method[generateBar]
     *  :arg config: ``Object`` Response data
     *  :arg title: ``String`` Title for the layers
     *  :returns: ``Ext.Toolbar`` for the bar or null if it's not need
     *  Obtain bar.
     */
	generateBar: function(config, title){
		// generate bar for add layers
		var items = [];
		var item1 = null, item0 = null;
        
		if(config.rasterName){
			item0 = this.generateBarItem(config.rasterName, title);	
		}

		// push items
		if(item0){
			items.push(item0);
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
     *  :arg title: ``String`` Title for the layer
     *  :returns: ``Ext.Toolbar`` for the buttom bar.
     *  Obtain bar item.
     */
	generateBarItem: function(layerName, title){
		if(layerName && layerName != ""){
			return {
				text : String.format(this.addLayerButtonText, layerName),
				iconCls : 'gxp-icon-addlayers',
				handler : function(){
                
                    this.addLayer(layerName, title);

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

	/**  
	 * api: method[addLayerRecord]
     */
	addLayerRecord: function(src, props){
		var record = src.createLayerRecord(props);   
				  
		if (record) {
			var layerStore = this.target.mapPanel.layers; 
			
			layerStore.data.each(function(rr, index, totalItems ) {
                if(rr.get('group') == record.get('group')){
                    layers.remove(rr);
                }
            });
            
            
			layerStore.add([record]);

			modified = true; // TODO: refactor this

			// Merge Params
            var layerObject = record.get("layer");
					
		    //
			// If tabs are used the View tab is Activated
			//
			if(this.target.renderToTab && this.enableViewTab){
				var portalContainer = Ext.getCmp(this.target.renderToTab);
				
				if(portalContainer instanceof Ext.TabPanel){
					portalContainer.setActiveTab(1);
				}				
			}					
						
			// //////////////////////////
			// Zoom To Layer extent
			// //////////////////////////
			var layer = record.get('layer');
			var extent = layer.restrictedExtent || layer.maxExtent || this.target.mapPanel.map.maxExtent;
			var map = this.target.mapPanel.map;

			// ///////////////////////////
			// Respect map properties
			// ///////////////////////////
			var restricted = map.restrictedExtent || map.maxExtent;
			if (restricted) {
				extent = new OpenLayers.Bounds(
					Math.max(extent.left, restricted.left),
					Math.max(extent.bottom, restricted.bottom),
					Math.min(extent.right, restricted.right),
					Math.min(extent.top, restricted.top)
				);
			}

			map.zoomToExtent(extent, true);
		}
	},
    
	/**  
	 * api: method[addLayer]
     */    
    addLayer: function(layerName, title, featureType){
        var layerTitle = title && layerName ? title + " - " + layerName: layerName;
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
        var group = "Weather Prog";
        var props ={
                    source: this.target.layerSources.jrc.id,
                    name: this.geocoderConfig.nsPrefix + ":" + layerName,
                    url: this.url,
                    title: layerTitle,
                    tiled:true,
                    group: group,
                    layers: layerName
            };
                                    
        var index = src.store.findExact("name", this.geocoderConfig.nsPrefix + ":" + layerName);
        
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
                checked: false,
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
        //src.store.reload();

        if (index < 0) {
            src.on('ready', function(){
                this.addLayerRecord(src, props);
            }, this);
        }else{
            this.addLayerRecord(src, props);
        }    
    
    }

});

Ext.preg(gxp.widgets.WeatherProgResume.prototype.ptype, gxp.widgets.WeatherProgResume);
