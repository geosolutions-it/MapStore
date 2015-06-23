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
 *  .. class:: NrlCropDataTabButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlCropDataTabButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlCropDataTabButton',
    iconCls: "gxp-icon-nrl-tab",
    tabPanel:'id_mapTab',
    targetTab: 'cropData_tab',  
    form: null,
    url: null,
	text: 'Generate Table',
    /**
     * config [windowManagerOptions]
     * Options for the window manager
     */
    windowManagerOptions:{title:"Crop Data"},
    handler: function () {
		//Ext.Msg.alert("Generate Table","Not Yet Implemented");
		var target = this.target;
		var form = this.form.output.getForm();
		var values =  this.form.output.getForm().getValues();
		var fieldValues = form.getFieldValues();
		var units = this.form.output.units;
        var uoms = units.getSelectedUnits();
		var nextYr = parseInt(values.endYear)%100 +1;
		var crop = values.crop;
		
		var varparam = "";
		switch(values.variable) {
			case "Area" : varparam='area';break;
			case  "Production" : varparam ='prod';break;
			case "Yield" : varparam= 'yield';break;
		}
		
        if (values.region_list){
            values.region_list = values.region_list.toLowerCase();
            values.region_list = values.region_list.replace('khyber pakhtunkhwa', 'kpk');
        }
		
			
		var viewParams = 
			(values.crop        ? "crop:" + values.crop.toLowerCase() + ";" : "" ) +
			(values.areatype    ? "gran_type:" + values.areatype.toLowerCase() + ";" : "" ) +
			(values.startYear   ? "start_year:" + values.startYear +";" : "" ) + //same year for start and end.
			(values.endYear     ? "end_year:" + values.endYear +";" : "" ) + 
			
            "yield_factor:" + uoms.yield_factor + ";" +
            "area_factor:" + uoms.area_factor + ";" +
            "prod_factor:" + uoms.prod_factor + ";" +
			(values.region_list ? "region_list:" + values.region_list.toLowerCase() + ";" : "" );
					
		var store = new Ext.data.JsonStore({
			url: this.url,
			sortInfo: {field: "s_dec", direction: "ASC"},
			root: 'features',			
			fields: [{
				name: 'region',
				mapping: 'properties.region'
			},{
				name: 'crop',
				mapping: 'properties.crop'
			},{
				name: 'year',
				mapping: 'properties.year'
			},{
				name: 's_dec',
				mapping: 'properties.s_dec'
			}, {
				name: 'production',
				mapping: 'properties.production'
			},{
				name: 'area',
				mapping: 'properties.area'
			},{
				name: 'yield',
				mapping: 'properties.yield'
			}]			
		});
		
		var isProvince = values.areatype.toLowerCase() == "province";
		this.createResultPanel(store, fieldValues, values, isProvince);
		
		store.load({
			callback:function(records,req){
				this.lastParams = req.params;
			},
			params :{
				propertyName: "region,crop,year,production,area,yield",
				service: "WFS",
				version: "1.0.0",
				request: "GetFeature",
				typeName: "nrl:CropData",
				outputFormat: "json",
				viewparams: viewParams
			}
		});         
    },
	
	createResultPanel: function(store, fieldValues, values, isProvince){
		var tabPanel = Ext.getCmp('id_mapTab');
        var tabs = Ext.getCmp('cropDataTable_tab');
		
		var grid = new Ext.grid.GridPanel({
			bbar:[
				"->",
				{
					xtype: 'button',
					hidden: !isProvince,
					text: 'Export All District',
					tooltip: 'Export All District',
					iconCls: 'icon-disk-multiple',
					handler:function(){
						var store = this.ownerCt.ownerCt.getStore();
						var lastParams = Ext.applyIf({}, store.lastParams);						
						
						var dwl = store.url + "?";
						lastParams.outputFormat = "CSV";
						
						if(lastParams.typeName && isProvince){
							lastParams.typeName = "nrl:CropDataDistrict";
						}
						
						for (var i in lastParams){
							dwl += i + "=" +encodeURIComponent(lastParams[i])+"&";
						}
						
						window.open(dwl);
					}
				}, {
					xtype:'button',
					text: 'Export',
					tooltip: 'Export',
					iconCls: 'icon-disk',
					handler:function(){
						var store = this.ownerCt.ownerCt.getStore();
						var lastParams = store.lastParams;
						var dwl = store.url + "?";
						lastParams.outputFormat = "CSV";
						for (var i in lastParams){
							dwl += i + "=" +encodeURIComponent(lastParams[i])+"&";
						}
						window.open(dwl);
					}
				}
			],
			forceFit:true,
			loadMask:true,
			border:false,
			layout:'fit',
			store:store,
			autoExpandColumn:'region',
			
			title:'',

		
			columns:[{
				sortable: true, 
				id:'region',
				header:'Region',
				name: 'region',
				dataIndex: 'region',
                renderer: function(val){
                    var retval = '';
                    if (val.toLowerCase() == 'kpk'){
                        val = 'Khyber Pakhtunkhwa'
                    }
                    return nrl.chartbuilder.util.toTitleCase(val);
                }
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
			}, {
				sortable: true, 
				header:'Production('+fieldValues.production_unit+')',
				name: 'production',
				dataIndex: 'production',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				width:130
			},{
				sortable: true, 
				header:'Area('+fieldValues.area_unit+')',
				name: 'area',
				dataIndex: 'area',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				width:130
			},{
				sortable: true, 
				header:'Yield('+fieldValues.yield_unit+')',
				name: 'yield',
				dataIndex: 'yield',
				renderer: Ext.util.Format.numberRenderer('0.00'),
				align: 'right',
				width:90
			}
			
			
			]
		
		
		});
		var oldPosition = tabs && tabs.items && tabs.items.getCount() ? [tabs.items.getCount()*20,tabs.items.getCount()*20]:[0,0]
		
		var win = new Ext.Window({
			title:'Pakistan - Crop Data - Commodity: ' + fieldValues.crop.toUpperCase() +  " - Season: " + values.season.toUpperCase() + " - Years: "+ values.startYear + "-"+ values.endYear,
			collapsible: true,
            iconCls: "gxp-icon-nrl-tab",
			constrainHeader :true,
			maximizable:true,
			height:400,
			width:700,
			x:oldPosition[0] +20,y:oldPosition[1]+20,
			autoScroll:false,
			header:true,
			
			layout:'fit',
			items:grid,
			//floating: {shadow: false},
			tools: [{
                id: 'help',
                handler: function () {
                    var iframe = "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                            "<ol>" +
                                "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                                "<li><p><em> Commodity: </em>" + fieldValues.crop.toUpperCase() + "</p></li>" +
                                "<li><p><em> Season: </em>" + values.season + "</p></li>" +
                                "<li><p><em> Years: </em>" + values.startYear + "-" + values.endYear + "</p></li>" +
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
		gxp.WindowManagerPanel.Util.showInWindowManager([win],this.tabPanel,this.targetTab, this.windowManagerOptions);
    }
});

Ext.reg(gxp.widgets.button.NrlCropDataTabButton.prototype.xtype, gxp.widgets.button.NrlCropDataTabButton);