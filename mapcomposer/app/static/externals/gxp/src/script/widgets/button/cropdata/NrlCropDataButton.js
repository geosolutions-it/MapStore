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

Ext.namespace('gxp.widgets.button');





/** api: constructor
 *  .. class:: NrlCropDataButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlCropDataButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlCropDataButton',
    iconCls: "gxp-icon-nrl-chart",
	text: 'Generate Chart',
    optionsTitle: "Chart Options",
    tabPanel:'id_mapTab',
    targetTab: 'cropData_tab',
    form: null,
    url: null,
    typeName:"nrl:CropData2",
	stackedCharts: {
		series: {
			stacking:null
		}
	},
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Crop Data"},
    /**
     * private method[createOptionsFildset]
     * ``String`` title the title of the fieldset 
     * ``Object`` opts the chartopts object to manage
     * ``String`` prefix the prefix to use in radio names
     */
    createOptionsFildset: function(title,opts,prefix){
        
        var fieldSet = {
                xtype:'fieldset',
                title:title,
                items:[{
                    //type
                    fieldLabel:"Type",
                    xtype:"radiogroup", 
                    columns:2,
                     items:[
                        {  boxLabel:"<span class=\"icon_span ic_chart-line\">Line</span>",name:prefix+"_chart_type",inputValue:"line", checked : opts.type == "line"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-spline\">Curve</span>",name:prefix+"_chart_type",inputValue:"spline", checked : opts.type == "spline"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-bar\">Bar</span>",name:prefix+"_chart_type", inputValue:"column",checked : opts.type == "column"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-area\">Area</span>",name:prefix+"_chart_type", inputValue:"area",checked : opts.type == "area"}
                        
                    ],
                    listeners: {
                        change: function(group,checked){
                            if(checked){
                                opts.type = checked.inputValue;
                            }
                        }
                    }
                },{ //color
                    fieldLabel: 'Color', 
                    xtype:'colorpickerfield',
                    anchor:'100%',
                    value : opts.color.slice(1),
                     listeners: {
                        select: function(comp,hex,a,b,c,d,e){
                            if(hex){
                                opts.color = '#' + hex;
                                var rgb = comp.menu.picker.hexToRgb(hex);
                                opts.lcolor = "rgb(" +rgb[0]+ "," +rgb[1]+ ","+rgb[2]+ ")";
                            }
                        }
                    }
                }]
        }
        return fieldSet;
    },
    createStackChartsOptions: function(stackedCharts, cmpVar){
		
        var stackFielSetContent;
        if (cmpVar != 'yield'){
            stackFielSetContent = [{
                xtype: 'radiogroup',
                columns:1,
                fieldLabel: "Stack charts",
                hideLabel: true,
                items:[{
                    checked: stackedCharts.series.stacking == null,
                    boxLabel: 'Do not stack',
                    name: 'stackcharts',
                    inputValue: null
                }, {
                    checked: stackedCharts.series.stacking == "normal",
                    boxLabel: 'Stack',
                    name: 'stackcharts',
                    inputValue: 'normal'
                }, {
                    checked: stackedCharts.series.stacking == "percent",
                    boxLabel: 'Stack as percent of the total',
                    labelSeparator: '',
                    name: 'stackcharts',
                    inputValue: 'percent'
                }],
                listeners: {
                    change: function(c,checked){
                        stackedCharts.series.stacking = checked.inputValue;
                    }
                }
            }];
        }else{
            stackFielSetContent = [{
                xtype: 'label',
                html: '<h3>No options available</h3>' +
                      '<p>The stacking plot style is not available for <b>yield</b> variable.</p>'
            }];
            // avoid stacking for yield if previously selected for other variables.
            stackedCharts.series.stacking = null;
        }

		var fieldSet = {
			xtype: 'fieldset',
			title: 'Stack charts of the same type',
			items: stackFielSetContent
		};
		return fieldSet;
		
	},	
    menu : {
        
        items:[{
            ref:'../chartoptions',
            iconCls:'ic_wrench',
            text: 'Options',
			handler:function(option){
				//get mode
                var mainButton = this.refOwner;
                var form = mainButton.form.output.getForm();
				var data = form.getValues();
				var mode = data.mode;
				var options = mainButton.chartOpt;
				var optionsCompare = mode == 'compareRegion' ? mainButton.chartOptCompare : mainButton.optionsCompareCommodities;
				var stackedCharts = mainButton.stackedCharts;
				var fieldSetList = [];
				
				
				
				if (mode === 'composite'){
					
					var prodOpt =  mainButton.createOptionsFildset("Production",options.series['prod'],'prod');
					var areaOpt =  mainButton.createOptionsFildset("Area",options.series['area'],'area');
					var yieldOpt =  mainButton.createOptionsFildset("Yield",options.series['yield'],'yield');
					
					fieldSetList = [prodOpt,areaOpt,yieldOpt];
					
				} else if(mode === 'compareRegion'){
					for (var compareRegion in optionsCompare.series){
						fieldSetList.push(mainButton.createOptionsFildset(compareRegion,optionsCompare.series[compareRegion],compareRegion));
					}
					fieldSetList.push(mainButton.createStackChartsOptions(stackedCharts, data.compare_variable));
				}else if(mode === 'compareCommodity'){
                    for (var compareRegion in optionsCompare.series){
						fieldSetList.push(mainButton.createOptionsFildset(compareRegion,optionsCompare.series[compareRegion],compareRegion));
					}
					fieldSetList.push(mainButton.createStackChartsOptions(stackedCharts, data.compare_variable));
                }
                var win = new Ext.Window({
                    iconCls:'ic_wrench',
                    title:   mainButton.optionsTitle,
                    height: 400,
                    width:  350, 
                    minWidth:250,
                    minHeight:200,
                    layout:'fit',
                    autoScroll:true,
                    maximizable: true, 
                    modal:true,
                    resizable:true,
                    draggable:true,
                    layout:'fit',
                    items:  {
                        ref:'form',
                        xtype:'form',
						autoScroll:true,
                        frame:'true',
                        layout:'form',
                        items: fieldSetList
                    }
                    
                    
                });
                win.show();
				
            }
        }]
    },
	
	chartOptCompare:{},	
	
    chartOpt:{
		series:{
			prod:{
				name: 'Production (000 tons)',
				color: '#89A54E',
				lcolor: 'rgb(207,235,148)',                    
				type: 'column',
				yAxis: 1,
				dataIndex: 'prod',
				unit:'(000 tons)'
			},
			yield:{
				name: 'Yield (kg/ha)',
				dashStyle: 'shortdot',
				type: 'column',
				color: '#4572A7',
				lcolor: 'rgb(139,184,237)',
				yAxis: 2,
				dataIndex: 'yield',
				unit:'(kg/ha)'
			},
			area:{
				name: 'Area (000 hectares)',
				color: '#AA4643',
				lcolor: 'rgb(240,140,137)',                    
				type: 'column',
				dataIndex: 'area',
				unit:'(000 ha)'
			}
		},
        height: 500
	},
    /**
     * api method[handler]
     * generate the chart
     */
    handler: function () {   
    
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = mm+'/'+dd+'/'+yyyy; 
        
        var numRegion = [];
        var regStore = this.form.output.aoiFieldSet.AreaSelector.store
        var records = regStore.getRange();
		
        for (var i=0;i<records.length;i++){
			var attrs = records[i].get("attributes");
            var region = attrs.district ? attrs.district + "," + attrs.province : attrs.province;
            numRegion.push(region.toLowerCase());
        }
		
        var form = this.form.output.getForm();
        var data = form.getValues();
        var data2 = form.getFieldValues();
        var units = this.form.output.units;
        
        var regionList = data.region_list.toLowerCase();
        regionList = regionList.replace("'khyber pakhtunkhwa'","'fata'\\,'kpk'");

        var commodity = data2.crop; // fixes #66 issue;
        var season = data.season.toLowerCase();
        var granType = data.areatype;
        var fromYear = data.startYear;
        var toYear = data.endYear;

        var compositeMode = data.outputmode;
		/* START COMPARE SECTION*/
		
		this.mode = data.mode;		
		this.variableCompare = data.compare_variable;
		
		var selectedCommodities  = this.form.output.commodities.getSelectionModel().getSelections();
		var crops;
        cropTitles = [];
        // get selected crops to genereate the proper viewparam
		if (this.mode === 'compareCommodity'){
            cropIds = [];
            
			if (selectedCommodities.length === 0){
				Ext.Msg.alert("Grid Commodities","Must be selected at least one Commodity!");
				return;
			}else{
				var commodities = selectedCommodities[0].data;
				for (var i=0;i<selectedCommodities.length;i++){
					var cropId = selectedCommodities[i].get('crop');
                    var cropTitle = selectedCommodities[i].get('label');
					cropIds.push(cropId);
                    cropTitles.push(cropTitle);
				}
                //create string " 'crop1'\,'crop2' " as view param
                crops = "'" + cropIds.join("'\\,'") + "'";
			}
		} else if (this.mode === 'compareRegion'){                                         // sends commodity label to 'CropChartBuilders.js'
            var cropTitle = this.form.output.Commodity.getSelectedRecord().get("label");   // to build chart title (part of issue #104 fixing)
            cropTitles.push(cropTitle);                                                    // in 'comparsion by region' mode.
        }

		/* END
		###############################
		## new var for compareRegion ##
		###############################
		*/
        
        //get unit of measure id
        var prodUnits = data2.production_unit;
        var areaUnit = data2.area_unit;
        var yieldUnit = data2.yield_unit;
        //get the full record 
        var getSelectedRecord = function(combo,uid){
            var store = combo.getStore();
            var i = store.findExact('uid',uid);
            return store.getAt(i);
        }
        // get selected record for each combo
        var prodRec = units.production.getUnitRecordById( prodUnits );
        var areaRec = units.area.getUnitRecordById( areaUnit );
        var yieldRec = units.yield.getUnitRecordById( yieldUnit );
        
        if(!(prodRec && areaRec && yieldRec)){
            //DEBUG
            console.log(prodRec);
            console.log(areaRec);
            console.log(yieldRec);
            //alert("prod "+prodCoeffUnits+"area "+ areaCoeffUnits+ "yield "+ yieldCoeffUnits)
        }
        
        // get coefficient for yield,area and production
        var prodCoeffUnits = prodRec &&  prodRec.get('coefficient');
        var areaCoeffUnits = areaRec && areaRec.get('coefficient');
        var yieldCoeffUnits = yieldRec && yieldRec.get('coefficient');
        
		
        //set labels for chart opts
        if (compositeMode == 'percent'){
        	this.chartOpt.series.prod.unit  = '(%)';
	        this.chartOpt.series.area.unit = '(%)';
	        this.chartOpt.series.yield.unit = '(%)';
	        
	        this.chartOpt.series.prod.name  = 'Production (%)';
	        this.chartOpt.series.area.name = 'Area (%)';
	        this.chartOpt.series.yield.name = 'Yield (%)';
		}else{
	        this.chartOpt.series.prod.unit  = '('+prodRec.get('shortname')+')';
	        this.chartOpt.series.area.unit = '('+areaRec.get('shortname')+')';
	        this.chartOpt.series.yield.unit = '('+yieldRec.get('shortname')+')';
	        
	        this.chartOpt.series.prod.name  = 'Production ('+prodRec.get('name')+')';
	        this.chartOpt.series.area.name = 'Area ('+areaRec.get('name')+')';
	        this.chartOpt.series.yield.name = 'Yield ('+yieldRec.get('name')+')';
		}
		for (var compareRegion in this.chartOptCompare.series){
			switch (this.variableCompare) {
				case ('prod'):
					this.chartOptCompare.unit = '('+prodRec.get('shortname')+')';
					this.chartOptCompare.name = 'Production ('+prodRec.get('name')+')';
					break;
				case ('area'):
					this.chartOptCompare.unit = '('+areaRec.get('shortname')+')';
					this.chartOptCompare.name = 'Area ('+areaRec.get('name')+')';
					break;
				case ('yield'):
					this.chartOptCompare.unit = '('+yieldRec.get('shortname')+')';
					this.chartOptCompare.name = 'Yield ('+yieldRec.get('name')+')';
					break;
			}
		}	
		
        var chartTitle = "";
        var splitRegion;
        
        for (var i = 0;i<numRegion.length;i++){
            if (granType == "province"){
                if(i==numRegion.length-1){
                    chartTitle += numRegion[i].slice(0,1).toUpperCase() + numRegion[i].slice(1);
                }else{
                    chartTitle += numRegion[i].slice(0,1).toUpperCase() + numRegion[i].slice(1) + ", ";
                }                
            }else{
                splitRegion = numRegion[i].split(',');
                if(i==numRegion.length-1){
                    chartTitle += splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + ")";
                }else{
                    chartTitle += splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + "), ";
                }                       
            }            
        }
        
		// check if composite or compareRegion
		var viewParamsCrop = crops ? crops : "'" + commodity+  "'";
		//var viewParamsCrop = commodities ? commodities.crop : commodity;
		
        var listVar = {
            today: today,
            chartTitle: chartTitle,
            numRegion: numRegion,
            season: season,
            fromYear: fromYear,
            toYear: toYear,
            commodity: viewParamsCrop,
			variableCompare: this.variableCompare,
            cropTitles: cropTitles
        };       
        
        var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = Ext.getCmp('cropData_tab');
		
		var viewparams = (viewParamsCrop     ? "crops:" + viewParamsCrop + ";" : "") +
                         (granType        ? (granType != "pakistan" ? "gran_type:" + granType + ";" : "gran_type:province;") : "") +
                         (fromYear        ? "start_year:" + fromYear + ";" : "") +
                         (toYear          ? "end_year:" + toYear + ";" : "") +
                         (regionList      ? "region_list:" + regionList + ";" : "") +
                         (prodCoeffUnits  ? "prod_factor:" + prodCoeffUnits + ";" : "") +
                         (areaCoeffUnits  ? "area_factor:" + areaCoeffUnits + ";" : "") +
                         (yieldCoeffUnits ? "yield_factor:" + yieldCoeffUnits + ";" : "");
			
        Ext.Ajax.request({
            scope:this,
            url : this.url,
            method: 'POST',
            params :{
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: this.typeName,
                outputFormat: "json",
                propertyName: "region,crop,year,production,area,yield",
                viewparams: viewparams 
            },
            success: function ( result, request ) {
                try{
                    var jsonData = Ext.util.JSON.decode(result.responseText);
                }catch(e){
                    Ext.Msg.alert("Error","Error parsing data from the server");
                    return;
                }
                if (jsonData.features.length <=0){
                    Ext.Msg.alert("No data","Data not available for these search criteria");
                    return;
                }
				
				var aggregatedDataOnly = (granType == "pakistan");
				var customOpt = {
                    stackedCharts: this.stackedCharts,
                    highChartExportUrl: this.target.highChartExportUrl,
                    variableCompare: this.variableCompare,
                    compositeMode: compositeMode
                }
				
				if (this.mode === 'composite'){
					var data = nrl.chartbuilder.crop.composite.getData(jsonData, aggregatedDataOnly,customOpt);
					var charts  = nrl.chartbuilder.crop.composite.makeChart(data, this.chartOpt, listVar, aggregatedDataOnly,customOpt);
				}else if(this.mode === 'compareRegion'){
					var data = nrl.chartbuilder.crop.compareRegion.getData(jsonData, aggregatedDataOnly,customOpt);
					var charts  = nrl.chartbuilder.crop.compareRegion.makeChart(data, this.chartOptCompare, listVar, aggregatedDataOnly, customOpt);
				}else if (this.mode ==='compareCommodity'){
                    var data = nrl.chartbuilder.crop.compareCommodity.getData(jsonData, aggregatedDataOnly,customOpt);
                    this.optionsCompareCommodities.unit = this.chartOptCompare.unit;
                    this.optionsCompareCommodities.name = this.chartOptCompare.name;

                    /*
                     * removes from 'listVar.numRegion' the entries that aren't in
                     * 'data'
                     */
                    for(var i=0; i<listVar.numRegion.length; i++){
                        var findOut = false;
                        var numRegionItem = listVar.numRegion[i].toUpperCase();

                        for(var j=0; j<data.length; j++){
                            var dataRegionItem = data[j].region.toUpperCase();
                            findOut = findOut || (numRegionItem.search(dataRegionItem) != -1);
                        }

                        if (!findOut){
                            listVar.numRegion.remove(listVar.numRegion[i]);
                            i--;
                        }
                    }
					var charts  = nrl.chartbuilder.crop.compareCommodity.makeChart(data, this.optionsCompareCommodities, listVar, aggregatedDataOnly, customOpt);
                }

                var wins = gxp.WindowManagerPanel.Util.createChartWindows(charts,listVar);
                gxp.WindowManagerPanel.Util.showInWindowManager(wins,this.tabPanel,this.targetTab, this.windowManagerOptions);
            },
            failure: function ( result, request ) {
                Ext.Msg.alert("Error","Server response error");
            }
        });       
        
    }
	
    
});


Ext.reg(gxp.widgets.button.NrlCropDataButton.prototype.xtype, gxp.widgets.button.NrlCropDataButton);
