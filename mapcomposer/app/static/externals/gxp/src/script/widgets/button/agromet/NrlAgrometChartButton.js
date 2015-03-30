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
 *  .. class:: NrlAgrometChartButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlAgrometChartButton = Ext.extend(Ext.SplitButton, {

    /** api: xtype = gxp_nrlchart */
	url: null,
    xtype: 'gxp_nrlAgrometChartButton',
    targetTab: 'agromet_tab',
	tabPanel: 'id_mapTab',
    iconCls: "gxp-icon-nrl-chart",
	text: 'Generate Chart',
    form: null,
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Agromet"},
    /**
     * private method[createOptionsFildset]
     * ``String`` title the title of the fieldset 
     * ``Object`` opts the chartopts object to manage
     * ``String`` prefix the prefix to use in radio names
     */
    
    menu : {
        
        items:[{
            ref:'../chartoptions',
            iconCls:'ic_wrench',
            text: 'Options', handler: function(option){
                //get mode
                var mainButton = this.refOwner;
                var form = mainButton.form.output.getForm();
				var data = form.getValues();
				var mode = data.mode;
                var fieldSetList = [];
                //create fieldsets for the mode selected
                if (mode === 'compareTime'){
                    var options = mainButton.chartOpt;
                    var current =  nrl.chartbuilder.util.createOptionsFildset("Reference Year",options.series['current'],'current');
                    var previous =  nrl.chartbuilder.util.createOptionsFildset("Previous Year",options.series['previous'],'previous');
                    var aggregated =  nrl.chartbuilder.util.createOptionsFildset("Period Mean",options.series['aggregated'],'aggregated');
                    fieldSetList = [current,previous,aggregated]
                } else if (mode == 'composite') {
                    var optionsCompare = mainButton.optionsCompareComposite;
                    for (var id in optionsCompare.series){
                        var opt = optionsCompare.series[id];
                        var label = opt.name;
                        fieldSetList.push(nrl.chartbuilder.util.createOptionsFildset(label,opt,id));
                    }
                    
                    
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
    chartOpt:{
		series:{
			current:{
					color: '#FF0000',
                    lcolor: 'rgb(207,235,148)',                    
					type: 'line',
					dataIndex: 'current',
					unit:'(000 tons)',
					xField:'s_dec'

				},
			previous:{
					type: 'line',
					color: '#4572A7',
                    lcolor: 'rgb(139,184,237)',
					dataIndex: 'previous',
					unit:'(kg/ha)',
					xField:'s_dec'

				},
			aggregated:{
					color: '#808080',
                    lcolor: 'rgb(240,140,137)', 
                    dashStyle: 'dash',                    
					type: 'line',
					dataIndex: 'aggregated',
					unit:'(000 ha)',
					xField:'s_dec'
			}
		},
        height: 400
	},
	
    handler: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd} 
        if(mm<10){mm='0'+mm} 
        var today = mm+'/'+dd+'/'+yyyy;    
        
        var numRegion = [];
        var regStore = this.form.output.aoiFieldSet.AreaSelector.store
        var records = regStore.getRange();
		
        for (var i=0;i<records.length;i++){
			var attrs = records[i].get("attributes");
			var region = attrs.district ? attrs.district + "," + attrs.province : attrs.province;
            numRegion.push(region.toLowerCase());
        }
        
        var data = this.form.output.getForm().getValues();
        var regionList = data.region_list.toLowerCase();
        var season = data.season.toLowerCase();
        var granType = data.areatype;
        var fromYear = data.startYear;
        var toYear = data.endYear;
        var mode = data.mode;
        var compositevalues = (mode == 'composite' ? data.compositevalues : undefined);
        //get start and end dekads.
        var months = this.form.output.monthRangeSelector.slider.getValues();
        var start_dec = (months[0])*3;
        var end_dec = (months[1]+1)*3; //the end month is included
        var factorStore = this.form.output.factors.getSelectionModel().getSelections();
        var factorValues = [];
        var factorList = "";
        if (factorStore.length === 0){
            Ext.Msg.alert("Grid Factors","Must be selected at least one Factor!");
            return;
        }else{
            for (var i=0;i<factorStore.length;i++){
                var factor = factorStore[i].data;
                var factorValue = factor.factor;
                factorValues.push(factorValue);
                if( i == factorStore.length - 1){
                    factorList += "'" + factorValue + "'";
                }else{
                    factorList += "'" + factorValue.concat("'\\,");                    
                }
            }
        }

        var chartTitle = "";
        var splitRegion;
        
        /*if (listVar.numRegion.length == 1){
            if (listVar.granType == "province"){
                chartTitle = listVar.numRegion[0].slice(0,1).toUpperCase() + listVar.numRegion[0].slice(1);
            }else{
                splitRegion = listVar.numRegion[0].split(',');
                chartTitle = splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + ")";
            }
        }else{*/
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
        //} 
        
        var listVar = {
            today: today,
            chartTitle: chartTitle,
            numRegion: numRegion,
            season: season,
            granType: granType,
            fromYear: fromYear,
            toYear: toYear,
            factorValues: factorValues,
			factorStore: factorStore,
            startDec: start_dec,
            endDec: end_dec,
            mode: mode,
            compositevalues: compositevalues
        };
        
        //loading mask
        var loadingMsg ="Please wait...";
        /* not needed anymore
        if( (granType == "province" || numRegion.length >20 ) && factorValues.lenth >1){
            loadingMsg += "<br/>This request could take a long time to be served";        
        }
        */
        var myMask = new Ext.LoadMask(this.findParentByType('form').getEl(),
        {msg:loadingMsg} );
        
        myMask.show();
		var store = new Ext.data.JsonStore({
			url: this.url,
			 sortInfo: {field: "s_dec", direction: "ASC"},
			root: 'features',
			
			fields: [{
				name: 'factor',
				mapping: 'properties.factor'
			},{
				name: 'month',
				mapping: 'properties.month'
			},{
				name: 'dec',
				mapping: 'properties.dec'
			},{
				name: 's_dec',
				mapping: 'properties.order'
			}, {
				name: 'current',
				mapping: 'properties.current'
			},{
				name: 'previous',
				mapping: 'properties.previous'
			},{
				name: 'aggregated',
				mapping: 'properties.aggregated'
			}]			
		});

		var params =             
			(fromYear   ? "start_year:"  + fromYear + ";" : "") +
            (toYear     ? "end_year:"    + (compositevalues == 'avg' ? parseInt(toYear)+1+'' : toYear) + ";" : "") +
            (factorList ? "factor_list:" + factorList + ";" : "") +
            (regionList ? "region_list:" + regionList + ";" : "") +
            (start_dec  ? "start_dec:"   + start_dec + ";" : "") +
            (end_dec    ? "end_dec:"     + end_dec + ";" : "") +
            (granType   ? (granType != "pakistan" ? "gran_type:" + granType + ";" : "gran_type:province;") : "") ;
            
            
			
		var viewparams = params;
					
		store.load({
			callback:function(){
				var allPakistanRegions = (granType == "pakistan");
				this.createResultPanel(store, listVar, allPakistanRegions);
                myMask.hide();
			},
			scope:this,
			params :{
				service: "WFS",
				version: "1.0.0",
				request: "GetFeature",
				typeName: "nrl:agromet_aggregated2",
				outputFormat: "json",
				viewparams: viewparams /*season == 'rabi' ? "start_year:"+ fromYear + ";" +
                    "end_year:"+ toYear + ";" +
                    "factor_list:"+ factorList + ";" +
                    "region_list:"+ regionList + ";" +
                    "gran_type:" + granType + ";" +                            
                    "season_flag:NOT" :  
                    "start_year:"+ fromYear + ";" +
                    "end_year:"+ toYear + ";" +
                    "factor_list:"+ factorList + ";" +
                    "region_list:"+ regionList + ";" +
                    "gran_type:" + granType*/
			}
		});         
    },
	
	createResultPanel:function(store, listVar, allPakistanRegions){
        customOpt = {
            highChartExportUrl : this.highChartExportUrl
        };
        var mode = listVar.mode;
        var opt = this.chartOpt;
        if(mode == "composite"){
            opt = this.optionsCompareComposite
        }else{
        
        }
		var charts  = nrl.chartbuilder.agromet[mode].makeChart(store, opt, listVar, allPakistanRegions,customOpt);
		
        var wins = gxp.WindowManagerPanel.Util.createChartWindows(charts,listVar);
        gxp.WindowManagerPanel.Util.showInWindowManager(wins,this.tabPanel,this.targetTab,this.windowManagerOptions);
	}
});

Ext.reg(gxp.widgets.button.NrlAgrometChartButton.prototype.xtype, gxp.widgets.button.NrlAgrometChartButton);