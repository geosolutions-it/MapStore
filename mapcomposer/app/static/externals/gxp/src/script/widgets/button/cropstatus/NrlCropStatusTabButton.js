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
 *  .. class:: NrlCropStatusTabButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlCropStatusTabButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlCropStatusTabButton',
	
    iconCls: "gxp-icon-nrl-tab",
	
    form: null,
	
	text: 'Generate Table',
    tabPanel: 'id_mapTab',
    targetTab: 'cropstatus_tab',
	/**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Crop Status"},
	
    handler: function () {
		//Ext.Msg.alert("Generate Table","Not Yet Implemented");
		//return;
		
		var target = this.target;
		var form = this.form.output.getForm();
		var values = this.form.output.getForm().getValues();
        var granType = values.areatype;
        var district = this.form.output.singleFeatureSelector.singleSelector.selectButton.store.data.items[0].data.attributes.district;
        var province = this.form.output.singleFeatureSelector.singleSelector.selectButton.store.data.items[0].data.attributes.province;
        var region_list = "'" + (granType == 'PROVINCE' ? province : district).toLowerCase() +"'" ;
		var fieldValues = form.getFieldValues();
		var season_flag = values.season.toLowerCase() == "rabi" ? "season_flag:NOT;" : "";
		var factorList = "";
		var factorValues = [];
		var factorStore = this.form.output.factors.getSelectionModel().getSelections();
		
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
		
		//view params generation
		var viewParams = 
				(values.crop     ? "crop:" + values.crop.toLowerCase() + ";" : "") +
				(values.areatype ? "gran_type:" + values.areatype.toLowerCase() + ";" : "") +
				(values.year     ? "year:" + values.year +";" : "") + //same year for start and end.
				(factorList      ? "factor_list:" + factorList +";" : "") +
				(region_list     ? "region_list:" + region_list.toLowerCase() + ";" : "") +
				season_flag;
				
		var store = new Ext.data.JsonStore({
			url: this.url,
			sortInfo: {field: "factor", direction: "ASC"},
			root: 'features',			
			fields: [{
				name: 'factor',
				mapping: 'properties.label'
			},{
				name: 'crop',
				mapping: 'properties.crop'
			},{
				name: 'month',
				mapping: 'properties.month'
			},{
				name: 'year',
				mapping: 'properties.year'
			},{
				name: 'dec',
				mapping: 'properties.dec'
			},{
				name: 's_dec',
				mapping: 'properties.s_dec'
			},{
				name: 'value',
				mapping: 'properties.value'
			},{
				name: 'max',
				mapping: 'properties.max'
			},{
				name: 'min',
				mapping: 'properties.min'
			},{
				name: 'opt',
				mapping: 'properties.opt'
			},{
				name: 'unit',
				mapping: 'properties.unit'
			}]			
		});
		
		var isProvince = values.areatype.toLowerCase() == "province";
		this.createResultPanel(store, fieldValues, values, isProvince);
		
		store.load({
			callback:function(records,req){
				this.lastParams = req.params;
			},
			params:{				
				service: "WFS",
				version: "1.0.0",
				request: "GetFeature",
				typeName: "nrl:crop_status",
				outputFormat: "json",
				viewparams: viewParams
			}
		});         
    },
	
	createResultPanel: function(store, fieldValues, values, isProvince){
		var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = Ext.getCmp('cropStatusTable_tab');
		var grid = new Ext.grid.GridPanel({
			bbar:[
				"->",
				// Export button disabled
				// {
				// 	xtype:'button',
				// 	text: 'Export All Districts',
				// 	tooltip: 'Export All Districts',
				// 	hidden: !isProvince,
				// 	iconCls: 'icon-disk-multiple',
				// 	handler:function(){
				// 		var store = this.ownerCt.ownerCt.getStore();
				// 		var lastParams = Ext.applyIf({}, store.lastParams);						
						
				// 		var dwl = store.url + "?";
				// 		lastParams.outputFormat = "CSV";
						
				// 		if(lastParams.typeName && isProvince){
				// 			lastParams.typeName = "nrl:crop_status_district";
				// 		}
						
				// 		for (var i in lastParams){
				// 			dwl += i + "=" +encodeURIComponent(lastParams[i])+"&";
				// 		}
						
				// 		window.open(dwl);
				// 	}
				// },
				{
					xtype:'button',
					text:'Export',
					iconCls:'icon-disk',
					handler:function(){
						var store = this.ownerCt.ownerCt.getStore();
						var lastParams = store.lastParams;
						var dwl = store.url + "?";
						lastParams.outputFormat="CSV";
						for (var i in lastParams){
							dwl += i + "=" +encodeURIComponent(lastParams[i])+"&";
						}
						window.open(dwl);
					}
				}],
			forceFit:true,
			loadMask:true,
			border:false,
			layout:'fit',
			store:store,
			autoExpandColumn:'factor',			
			title:'',		
			columns:[{
				sortable: true, 
				id:'factor',
				header:'Factor',
				name: 'factor',
				dataIndex: 'factor'
			},{
				sortable: true, 
				header:'Crop',
				name: 'crop',
				dataIndex: 'crop',
				width:70
			},{
				sortable: true, 
				header:'Year',
				name: 'year',
				dataIndex: 'year',
				width:50
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
			},{
				sortable: true, 
				header:'Value',
				name: 'value',
				dataIndex: 'value',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				width:60
			},{
				sortable: true, 
				header:'Threshold Max',
				name: 'max',
				dataIndex: 'max',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				width:100
			},{
				sortable: true, 
				header:'Threshold Min',
				name: 'min',
				dataIndex: 'min',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				width:100
			},{
				sortable: true, 
				header:'Optimum',
				name: 'opt',
				dataIndex: 'opt',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				width:70
			},{
				sortable: true, 
				header:'Unit',
				name: 'unit',
				dataIndex: 'unit',
				align: 'right',
				width:40
			}]	
		});
		
		var oldPosition = (tabs && tabs.items && tabs.items.getCount() ? [tabs.items.getCount()*20,tabs.items.getCount()*20]:[0,0]);
		
		var win = new Ext.Window({
			title:'Crop Status:' + fieldValues.crop + "Year:" +values.year,
			collapsible: true,
			constrainHeader: true,
			maximizable: true,
			height: 400,
			width: 800,
			x: oldPosition[0] +20,y:oldPosition[1]+20,
			autoScroll: false,
			header: true,			
			layout: 'fit',
			items: grid,
			//floating: {shadow: false},
			tools: [{
                id: 'help',
                handler: function () {
                    var checkCommodity = fieldValues.crop ? "<li><p><em> Commodity: </em>" + fieldValues.crop + "</p></li>" : "<li><p><em></em></p></li>";
                    var iframe = 
							"<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
								"<ol>" +
									checkCommodity +
									"<li><p><em> Season: </em>" + values.season + "</p></li>" +
									"<li><p><em>Year: </em>" + values.year + "</p></li>" +
								"</ol>" +                                        
                            "</div>";
                 
                    var appInfo = new Ext.Panel({
                        header: false,
                        html: iframe
                    });

                    var win = new Ext.Window({
                        title:  "Table Info",
                        modal: true,
                        layout: "fit",
                        width: 200,
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

Ext.reg(gxp.widgets.button.NrlCropStatusTabButton.prototype.xtype, gxp.widgets.button.NrlCropStatusTabButton);