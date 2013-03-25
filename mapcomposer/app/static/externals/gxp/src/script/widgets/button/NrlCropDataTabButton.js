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
    form: null,
	text: 'Generate Table',
    handler: function () {    

            //Ext.Msg.alert("Generate Table","Not Yet Implemented");
			var target = this.target;
			var form = this.form.output.getForm();
			var values =  this.form.output.getForm().getValues();
			var fieldValues = form.getFieldValues();
			
			var nextYr =parseInt(values.endYear)%100 +1;
			var crop =values.crop;
			
			var varparam ="";
			switch(values.variable) {
				case "Area" : varparam='area';break;
				case  "Production" : varparam ='prod';break;
				case "Yield" : varparam= 'yield';break;
			}
			var yieldFactor = fieldValues.production_unit == "000 bales" ? 170 : 1000;
			
			
			var viewParams= "crop:" + values.crop.toLowerCase() + ";" +
					"gran_type:" + values.areatype.toLowerCase() + ";" +
					"start_year:" + values.startYear +";" + //same year for start and end.
					"end_year:" + values.endYear +";" + 
					"yield_factor:" + yieldFactor +";" +
					"region_list:" + values.region_list.toLowerCase() + ";";
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
		this.createResultPanel(store);
		
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
	
	createResultPanel: function( store ){
		var tabPanel = Ext.getCmp('id_mapTab');

        var tabs = Ext.getCmp('cropData_tab');
		var grid = new Ext.grid.GridPanel({
			bbar:[
				"->",{xtype:'button',text:'export',iconCls:'icon-disk',handler:function(){
					var store =this.ownerCt.ownerCt.getStore();
					var lastParams = store.lastParams;
					var dwl = store.url + "?";
					lastParams.outputFormat="CSV";
					for (var i in lastParams){
						dwl+=i + "=" +encodeURIComponent(lastParams[i])+"&";
					}
					window.open(dwl);
				}}],
			style:'padding:10px 10px 10px 10px',
			loadMask:true,
			layout:'fit',
			forceFit:true,
			height:300,
			store:store,
			autoExpandColumn:'region',
			
			title:'',
			tools: [{
                id: 'info',
                handler: function () {
                    var checkCommodity = this.commodity ? "<li><p><em> Commodity: </em>" + this.commodity + "</p></li>" : "<li><p><em></em></p></li>";
                    var iframe = "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                            "<ol>" +
                                checkCommodity +
                                "<li><p><em> Season: </em>" + this.season + "</p></li>" +
                                "<li><p><em> From year: </em>" + this.fromYear + "</p></li>" +
                                "<li><p><em> To year: </em>" + this.toYear + "</p></li>" +
                            "</ol>" +                                        
                            "</div>";
                 
                    var appInfo = new Ext.Panel({
                        header: false,
                        html: iframe
                    });

                    var win = new Ext.Window({
                        title:  "Charts Info",
                        modal: true,
                        layout: "fit",
                        width: 200,
                        height: 180,
                        items: [appInfo]
                    });
                    
                    win.show(); 
                                                            
                },
                scope: this
            }, {
                id: 'close',
                handler: function (e, target, panel) {
                    panel.ownerCt.remove(panel, true);
                }
            }],
            collapsible: true,
			header:true,
			columns:[{
				
				id:'region',
				header:'Region',
				name: 'region',
				dataIndex: 'region'
			},{

				header:'Crop',
				name: 'crop',
				dataIndex: 'crop'
			},{

				header:'Year',
				name: 'year',
				dataIndex: 'year'
			}, {

				header:'Production',
				name: 'production',
				dataIndex: 'production'
			},{

				header:'Area',
				name: 'area',
				dataIndex: 'area'
			},{
				header:'Yield',
				name: 'yield',
				dataIndex: 'yield'
			}
			
			
			]
		
		});
		
			if(!tabs){
				var cropDataTab = new Ext.Panel({
					title: 'Crop Data',
					id:'cropData_tab',
					itemId:'cropData_tab',
					border: true,
					layout: 'form',
					autoScroll: true,
					tabTip: 'Crop Data',
					closable: true,
					items: grid
				});
				tabPanel.add(cropDataTab);  
			   
			}else{
				tabs.items.each(function(a){a.collapse()});
				tabs.add(grid);
			}
			Ext.getCmp('id_mapTab').doLayout();
			Ext.getCmp('id_mapTab').setActiveTab('cropData_tab');

	}	
});

Ext.reg(gxp.widgets.button.NrlCropDataTabButton.prototype.xtype, gxp.widgets.button.NrlCropDataTabButton);