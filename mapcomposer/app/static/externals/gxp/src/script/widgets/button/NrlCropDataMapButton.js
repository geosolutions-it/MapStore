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
 *  .. class:: NrlCropDataMapButton(config)
 *
 *    Base class to create chart
 *
 */
gxp.widgets.button.NrlCropDataMapButton = Ext.extend(Ext.Button, {

    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlCropDataMapButton',
    iconCls: "gxp-icon-nrl-map",
    form: null,
	text: 'Generate Map',
	wmsUrl: '',
	
		
    handler: function () {    
			var values =  this.form.output.getForm().getValues();
			if( values.areatype != "district" ){
				Ext.Msg.alert("Test styles not available" ,"Test data is not yet available for this selection. Please select Wheat - District and Reference year fromm 1999 to 2008");
				return;
			}
			var nextYr =parseInt(values.endYear)%100 +1;
			var crop =values.crop;
			
			var varparam ="";
			switch(values.variable) {
				case "Area" : varparam='area';break;
				case  "Production" : varparam ='prod';break;
				case "Yield" : varparam= 'yield';break;
			}
			
			
			var viewParams= "crop:" + values.crop.toLowerCase() + ";" +
					"gran_type:" + values.areatype.toLowerCase() + ";" +
					"start_year:" + values.endYear +";" + //same year for start and end.
					"end_year:" + values.endYear +";" 
			
			var wms = new OpenLayers.Layer.WMS(values.crop + " " + values.endYear + " - "+values.variable,//todo: choice the style for the needed variable
			   "http://84.33.2.24/geoserver/wms",
			   {
				layers: "nrl:CropDataMap",
				styles: "district" + "_" + values.crop.toLowerCase() + "_"+ varparam + "_style" ,
				viewParams:viewParams,
				transparent: "true"
				
			});
			var data = {
                title: values.crop + " " + values.endYear + "-" + values.variable, 
                name: "nrl:CropDataMap",
                //group: "crop_data",
                layer: wms,
				selected:true
            }
			var fields = [
                {name: "name", type: "string"}, 
                {name: "group", type: "string"},
				{name: "title", type: "string"},
                {name: "selected", type: "boolean"}
            ];
            var tooltip;
			var cleanup = function() {
				if (tooltip) {
					tooltip.destroy();
				}  
			};
			var button = this;
			var control = new OpenLayers.Control.WMSGetFeatureInfo({
					infoFormat:  "application/vnd.ogc.gml" ,
					
					title: 'Identify features by clicking',
					maxFeatures:200,
					layers: [wms],
					hover: false,
					// defining a custom format options here
					
					queryVisible: true,
					handlerOptions:{
						
					},
					vendorParams:{
						paramName: 'crop,year,production,area,yield',
						
						viewParams: "crop:" + values.crop.toLowerCase() + ";" +
									"gran_type:" + values.areatype.toLowerCase() + ";" +
									"start_year:" + values.startYear + ";" +
									"end_year:" + values.endYear + ";" //here startyear
			
						
					},
					showResults: function(features){
						
						var n=features.length;
						var regions = {};
						for(var i=0;i<n;i++){
							var f = features[i];
							var region =f.attributes.region
							if(!regions[region]){
								regions[region] = [];
							}
							regions[region].push(f);
						}
						var result = "<table border='1' CELLPADDING=1><tr><th>Region</th><th>Year</th><th>Production</th><th>Area</th><th>Yield</th></tr>";
						for (var i= 0 in regions){	
							var f = regions[i];
							result += "<tr><th rowspan=4>"+i+"</th></tr>";
							//calculate aggregated data
							var tot = {
								production:0,
								area:0,
								yield:0
							};
							for (var j =0; j<f.length;j++){
								var attrs =f[j].attributes;
								tot.production+=parseFloat(attrs.production);
								tot.area+=parseFloat(attrs.area);
								if(attrs.year == values.endYear +"-" +tempstringtrailer){
									result +="<tr><td>"+attrs.year+"</td><td>"+parseFloat(attrs.production).toFixed(2)+"</td><td>"+parseFloat(attrs.area).toFixed(2)+"</td><td>"+parseFloat(attrs.yield).toFixed(2)+"</td></tr>"
									result +="<tr><td>"+(parseInt(attrs.year)-1)+"</td><td>"+parseFloat(attrs.production).toFixed(2)+"</td><td>"+parseFloat(attrs.area).toFixed(2)+"</td><td>"+parseFloat(attrs.yield).toFixed(2)+"</td></tr>"
								}
							}
							//avgs
							tot.yield = tot.production / tot.area;
							tot.production /=  f.length;
							tot.area /=  f.length;
							tot.yield /=f.length ;
							result +="<tr><td>"+values.startYear + "-"+values.endYear+"</td><td>"+tot.production.toFixed(2)+"</td><td>"+tot.area.toFixed(2)+"</td><td>"+tot.yield.toFixed(2)+"</td></tr>"
							
						}	 
						result +='</table>'		;	 
						//TODO
						
						return result;

					},
					eventListeners:{
						getfeatureinfo:function(evt){
							if(evt.features.length <1) return;
							cleanup();
							
							tooltip = new Ext.ToolTip({
								xtype: 'tooltip',
								html:this.showResults(evt.features),
								title: values.crop + " " + values.endYear + "-" + values.variable,
								autoHide: false,
								closable: true,
								draggable: false,
								mouseOffset: [0, 0],
								showDelay: 1,
								listeners: {hide: cleanup}
							});
							
							//take only the first
							
							var p0 = app.mapPanel.getPosition();
							tooltip.targetXY = [evt.xy.x +p0[0],evt.xy.y +p0[1]];
							tooltip.show();
							
						
						}
					},
					deactivate: cleanup
				})
			app.mapPanel.map.addControl(control);
            //var Record = GeoExt.data.LayerRecord.create(fields);
            //var record = new Record(data);
			app.mapPanel.map.addLayers([wms]);
			//app.mapPanel.layers.add(record);
			wms.events.register('removed',app.mapPanel.map,function(eventObject){
				control.deactivate();
				control.destroy();
				app.mapPanel.map.removeControl(control);
			
			})
			var sm = Ext.getCmp('layertree').getSelectionModel();
			if(!sm.getSelectedNode()) return;
			if(sm.getSelectedNode().layer == wms){
				control.activate();
			}
			//if(sm.getSelectedNode().layer == wms) { control.activate(); }
			sm.on('selectionchange',function(sm,sel,eOpts){
				if(!sm.getSelectedNode()) return;
				if(sm.getSelectedNode().layer == wms){
					control.activate();
				}else{
					control.deactivate();
				}
			
			},this);
            
        
    }
});

Ext.reg(gxp.widgets.button.NrlCropDataMapButton.prototype.xtype, gxp.widgets.button.NrlCropDataMapButton);