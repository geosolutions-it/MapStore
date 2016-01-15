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
 *  .. class:: NrlAgrometTabButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlAgrometTabButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlAgrometTabButton',
	
    iconCls: "gxp-icon-nrl-tab",
    

    form: null,
	
    url: null,
    targetTab: 'agromet_tab',
	tabPanel: 'id_mapTab',
	/**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Agromet"},
	text: 'Generate Table',
	
    handler: function () {            
		var target = this.target;
		var form = this.form.output.getForm();
		var values =  this.form.output.getForm().getValues();
		var fieldValues = form.getFieldValues();
		
        //this is still necessary ???
		//var nextYr = parseInt(values.endYear)%100 +1;
        
        //this is still necessary ???
		//var crop = values.crop;

        //get start and end dekads.
        var months = this.form.output.monthRangeSelector.slider.getValues();
        var start_dec = (months[0])*3;
        var end_dec = (months[1]+1)*3; //the end month is included
		
		var varparam = "";
		switch(values.variable) {
			case "Area" : varparam = 'area'; break;
			case "Production" : varparam = 'prod'; break;
			case "Yield" : varparam = 'yield'; break;
		}
		
		var factorStore = this.form.output.factors.getSelectionModel().getSelections();
		var factorValues = [];
		var factorList = "";
		
		if (factorStore.length === 0){
			Ext.Msg.alert("Grid Factors","Must be selected at least one Factor!");
			return;
		}else{
			for (var i=0; i<factorStore.length; i++){
				var factor = factorStore[i].data;
				var factorValue = factor.factor;
				factorValues.push(factorValue);
				if(i == factorStore.length-1){
					factorList += "'" + factorValue + "'";
				}else{
					factorList += "'" + factorValue.concat("'\\,");						
				}
			}
		}

		var numRegion = [];
		var regStore = this.form.output.aoiFieldSet.AreaSelector.store;
		var records = regStore.getRange();
		
		for (var i=0;i<records.length;i++){
			var attrs = records[i].get("attributes");
			var region = attrs.district ? attrs.district + "," + attrs.province : attrs.province;
			numRegion.push(region.toLowerCase());
		}
		
		values.numRegion = numRegion;            
	
		var viewParams = 
				(values.areatype    ? "gran_type:" + values.areatype.toLowerCase() + ";" : "") +
				(values.startYear   ? "start_year:" + values.startYear +";" : "") + //same year for start and end.
				(values.endYear     ? "end_year:" + values.endYear +";" : "") + 
				(factorList         ? "factor_list:" + factorList + ";" : "") +
                (start_dec          ? "start_dec:"   + start_dec + ";" : "") +
                (end_dec            ? "end_dec:"     + end_dec + ";" : "") +                
				(values.region_list ? "region_list:" + values.region_list.toLowerCase() + ";" : "");
				
		/*if(values.season == "RABI"){
			viewParams += 'season_flag:NOT;'
		}*/
		
		var store = new Ext.data.JsonStore({
			url: this.url,
			sortInfo: {field: "factor", direction: "ASC"},
			root: 'features',			
			fields: [{
				name: 'factor',
				mapping: 'properties.factor'
			},{
				name: 'year',
				mapping: 'properties.year'
			},{
				name: 'month',
				mapping: 'properties.month'
			},{
				name: 'dec',
				mapping: 'properties.dec'
			},{
				name: 'dec_in_year',
				mapping: 'properties.dec_in_year'
			},{
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
		
		var isProvince = values.areatype.toLowerCase() == "province";
		this.createResultPanel(store, fieldValues, values, isProvince);
		
		store.load({
			callback:function(records,req){
				this.lastParams = req.params;
			},
			params: {				
				service: "WFS",
				version: "1.0.0",
				request: "GetFeature",
				typeName: "nrl:agromet_aggregated2",
				outputFormat: "json",
				viewparams: viewParams
			}
		});         
    },
	
	createResultPanel: function(store, fieldValues, values, isProvince){
		var tabPanel = Ext.getCmp(this.tabPanel);
        
        var region = values.region_list.split("\,");

        var chartTitle = "";
        var splitRegion;

        for (var i = 0;i<values.numRegion.length;i++){
            if (values.areatype.toLowerCase() == "province"){
                if(i==values.numRegion.length-1){
                    chartTitle += values.numRegion[i].slice(0,1).toUpperCase() + values.numRegion[i].slice(1);
                }else{
                    chartTitle += values.numRegion[i].slice(0,1).toUpperCase() + values.numRegion[i].slice(1) + ", ";
                }                
            }else{
                splitRegion = values.numRegion[i].split(',');
                if(i==values.numRegion.length-1){
                    chartTitle += splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + ")";
                }else{
                    chartTitle += splitRegion[0].slice(0,1).toUpperCase() + splitRegion[0].slice(1) + " (" + splitRegion[1].toUpperCase() + "), ";
                }                       
            }            
        }
            
        var tabs = Ext.getCmp(this.targetTab);
		var grid = new Ext.grid.GridPanel({
			bbar:[
				"->",
				{
					xtype: 'button',
					text: 'Export All Districts',
					tooltip: 'Export All Districts',
					hidden: !isProvince,
					iconCls: 'icon-disk-multiple',
					handler: function(){
						var store = this.ownerCt.ownerCt.getStore();
						var lastParams = Ext.applyIf({}, store.lastParams);						
						
						var dwl = store.url + "?";
						lastParams.outputFormat = "CSV";
						
						if(lastParams.typeName && isProvince){
							lastParams.typeName = "nrl:agromet_aggregated_district";
						}
						
						for (var i in lastParams){
							dwl += i + "=" +encodeURIComponent(lastParams[i])+"&";
						}
						
						window.open(dwl);
					}
				},
				{
					xtype: 'button',
					text: 'Export',
					tooltip: 'Export',
					iconCls: 'icon-disk',
					handler: function(){
						var store = this.ownerCt.ownerCt.getStore();
						var lastParams = store.lastParams;
						var dwl = store.url + "?";
						lastParams.outputFormat = "CSV";
						for (var i in lastParams){
							dwl+=i + "=" +encodeURIComponent(lastParams[i])+"&";
						}
						window.open(dwl);
					}
				}
			],
			forceFit: true,
			loadMask: true,
			border: false,
			layout: 'fit',
			store: store,
			autoExpandColumn: 'factor',			
			title: '',		
			columns:[{
				sortable: true, 
				id:'factor',
				header:'Factor',
				name: 'factor',
				dataIndex: 'factor'
			},{
				sortable: true, 
				header:'Year',
				name: 'year',
				dataIndex: 'year',
				width:50,
                hidden: true
			},{
				sortable: true, 
				header:'Month',
				name: 'month',
				dataIndex: 'month',
				width:50
			},{
				sortable: true, 
				header:'Ten Day Period',
				name: 'dec',
				dataIndex: 'dec',
				width: 100
			}/*,{
				sortable: true, 
				header:'Decad in Year',
				name: 'dec_in_year',
				dataIndex: 'dec_in_year',
				flex:1
			}*/, {
				sortable: true, 
				header:values.endYear,
				name: 'current',
				dataIndex: 'current',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				flex:1
			},{
				sortable: true, 
				header:values.endYear-1,
				name: 'previous',
				dataIndex: 'previous',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				flex:1
			},{
				sortable: true, 
				header:values.startYear+"-"+(values.endYear-1),
				name:  'aggregated',
				dataIndex: 'aggregated',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				flex:1
			}]
		});
		
		
		var win = new Ext.Window({
			title:'Pakistan - AgroMet Variables - AOI: ' + (region.length == 1 ? region[0] : "REGION") + ' - Season: ' + values.season + ' - Years: '+values.startYear+'-'+values.endYear,
			collapsible: true,
            iconCls: this.iconCls,
			constrainHeader: true,
			maximizable: true,
			height: 400,
			width: 700,
			autoScroll: false,
			header: true,			
			layout: 'fit',
			items: grid,
			//floating: {shadow: false},
			tools: [{
                id: 'help',
                handler: function () {
                    var iframe = 
						"<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
							"<ol>" +
								"<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
								"<li><p><em> AOI: </em>" + chartTitle + "</p></li>" +
								"<li><p><em> Season: </em>" + values.season + "</p></li>" +
								"<li><p><em> Years: </em>" + values.startYear + "-" + values.endYear + "</p></li>" +
							"</ol>" +                                        
						"</div>";
                 
                    var appInfo = new Ext.Panel({
                        header: false,
                        autoScroll: true,                        
                        html: iframe
                    });

                    var win = new Ext.Window({
                        title:  "Table Info",
                        modal: true,
                        layout: "fit",
                        width: 400,
                        height: 180,
                        items: [appInfo]
                    });
                    
                    win.show();                                                             
                },
                scope: this
            }]
		});
		
		
		gxp.WindowManagerPanel.Util.showInWindowManager([win],this.tabPanel,this.targetTab,this.windowManagerOptions);
	}	
});

Ext.reg(gxp.widgets.button.NrlAgrometTabButton.prototype.xtype, gxp.widgets.button.NrlAgrometTabButton);