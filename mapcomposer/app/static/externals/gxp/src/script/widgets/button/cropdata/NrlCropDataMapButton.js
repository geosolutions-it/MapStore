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
    layerName:"nrl:CropDataMap2",
	url: null,
	controlToggleGroup: 'toolGroup',
	infoActionTip: 'Crop Data info on selected layer',
    mapToolPosition: 17,
	controls:[],layers:[],
    handler: function () {    
			var target = this.target;
			var form = this.form.output.getForm();
			var values =  this.form.output.getForm().getValues();
			var fieldValues = form.getFieldValues();
			
			var nextYr =parseInt(values.endYear)%100 +1;
			var crop = fieldValues.crop; // fixes #66 issue
			
			var varparam ="";
			switch(values.variable) {
				case "Area" : 
                        varparam='area';
                        break;
				case  "Production" : 
                        varparam ='prod';
                        break;
				case "Yield" : 
                        varparam= 'yield';
                        break;
			}
            var variable = values.variable;
            var units = this.form.output.units;
            values.region_list = values.region_list.replace("'KHYBER PAKHTUNKHWA'","'FATA'\\,'KPK'");
            var region_list    = values.region_list.replace(/\\,/g   ,',');
			uoms = units.getSelectedUnits();
            
        
           
            //set up cql_filter
			var cql_filter="1=1";
            if(values.areatype=='province' &&region_list.length>0 ){
                cql_filter="province IN (" +region_list.replace('KPK', 'Khyber Pakhtunkhwa')+ ")";
            }
        
			//set up the area type
            var areatype = values.areatype.toLowerCase();
            if(values.areatype=='pakistan'){
                areatype='province';
            }else{
                areatype='district';
            }
        
            //Customize title,style and available styles
            var titleTrail ="";
            
           
            
            var uom = uoms[varparam].get("shortname");
        
            if(values.type == "difference"){
                variable = varparam + "_diff_percent" ; 
                titleTrail = " - Diff";
            }else if(values.type == "average"){
                variable = varparam + "_avg";
                titleTrail = " - Avg (" + uom +")";
                
            }else{
                titleTrail = "(" + uom +")";
            }
            //NOTE: start_list = end_year to get only the values from
            // the end_year. to get get feature info with multiple values
            // use isntead start_list_year = startYear
            //build layer 
			var viewParams= "crop:" + crop + ";" +
					"gran_type:" + areatype + ";" +
					"start_year:" + values.startYear +";" +  
                    "start_list_year:" + values.endYear + ";" + 
                    "variable:" + variable + ";" +
					"end_year:" + values.endYear +";" + 
					"yield_factor:" + uoms.yield_factor + ";" +
                    "area_factor:" + uoms.area_factor + ";" +
                    "prod_factor:" + uoms.prod_factor ;
             //GET PROPER STYLES 
            var style = this.getProperStyle(values,areatype,varparam,crop);
            
			var layerProps = {
                title: values.crop + " " + values.endYear + " - "+values.variable + titleTrail,
                name: this.layerName,
				layers: this.layerName,
				styles: style ,
				transparent: "true",
                querible:false,
                vendorParams: {
                    cql_filter:cql_filter,
                    viewParams: viewParams
                    //TODO env: parameters for style if needed
                }
			};
            
            
            var source = this.target.tools.addlayer.checkLayerSource(this.url);
            var record = source.createLayerRecord(layerProps);
            record.set('queryable', false);
            this.filterStyles(values,areatype,varparam,crop,viewParams,record);
            var wms = record.getLayer();
            
			//record.set("styles",styles);
            var tooltip;
			var cleanup = function() {
				if (tooltip) {
					tooltip.destroy();
				}  
			};
			var button = this;
        
            //create gfi control
			var control = new OpenLayers.Control.WMSGetFeatureInfo({
					infoFormat:  "application/vnd.ogc.gml" ,
					title: 'Identify features by clicking',
					maxFeatures:200,
					layers: [wms],
					hover: true,
					queryVisible: true,
					handlerOptions:{	
						hover: {delay: 200,pixelTolerance:2}
					},
					vendorParams:{
						propertyName: 'region,crop,year,production,area,yield,variable,prod_diff,area_diff,yield_diff,prod_avg,area_avg,yield_avg',
                        cql_filter:cql_filter,
						
						viewParams: "crop:" + crop + ";" +
									"gran_type:" + areatype + ";" +
									"start_year:" + values.startYear + ";" +
                                    "variable:" + values.variable + ";" +
									"end_year:" + values.endYear + ";" +
                                    "start_list_year:" + values.startYear + ";" +//
									"yield_factor:" + uoms.yield_factor + ";" +
                                    "area_factor:" + uoms.area_factor + ";" +
                                    "prod_factor:" + uoms.prod_factor 
						
					},
					generateYearlyRow:function (attrs){
						//manage NaN
						var prod = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.production).toFixed(2);
						var area = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.area).toFixed(2);
						var yield = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.yield).toFixed(2);
						return "<td><strong>"+attrs.year+"<strong></td>"+
							"<td style='text-align:right'>"+prod+"</td>"+
							"<td style='text-align:right'>"+area+"</td>"+
							"<td style='text-align:right'>"+yield+"</td>";
						
					},
                    generateDiffRow:function (attrs){
						//manage NaN
						var prod = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.prod_diff).toFixed(2);
						var area = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.area_diff).toFixed(2);
						var yield = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.yield_diff).toFixed(2);
						return "<td><strong>Difference<strong></td>"+
							"<td style='text-align:right'>"+prod+"</td>"+
							"<td style='text-align:right'>"+area+"</td>"+
							"<td style='text-align:right'>"+yield+"</td>";
						
					},
                    generateAvgRow:function (attrs){
                        //manage NaN
						var prod = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.prod_avg).toFixed(2);
						var area = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.area_avg).toFixed(2);
						var yield = isNaN(parseFloat(attrs.production))?"N/A":parseFloat(attrs.yield_avg).toFixed(2);
                        var year = values.startYear + "-"+values.endYear;
						return "<td><strong>"+year+"<strong></td>"+
							"<td style='text-align:right'>"+prod+"</td>"+
							"<td style='text-align:right'>"+area+"</td>"+
							"<td style='text-align:right'>"+yield+"</td>";
                    
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
						var short_area_unit = values.area_unit.replace('hectares','ha');
						var result = "<table class='cropdatatooltip'>"+
							"<tr><th>Region</th><th>Year</th>"+
							"<th>Production</br><strong>("+uoms.prod.get("shortname")+")</strong></th>"+ //TODO unit
							"<th>Area</br><strong>("+uoms.area.get("shortname")+")</strong></th>" +
							"<th>Yield</br><strong>("+uoms.yield.get("shortname")+")</strong></th>" +
						"</tr>";
						//cycle data
						for (var i= 0 in regions){	
							var f = regions[i];
							
							var tot = {
								production:0,
								area:0,
								yield:0
							};
							//calculate avgs
							for (var j =0; j<f.length;j++){
								var attrs =f[j].attributes;
								tot.production+=parseFloat(attrs.production);
								tot.area+=parseFloat(attrs.area);
								
							}
							//get current and previous year 
							var curr,prev,diffrow;
							for (var j =0; j<f.length;j++){
								var attrs =f[j].attributes;
								if(attrs.year == values.endYear){
									curr = this.generateYearlyRow(attrs);
                                    diffrow = this.generateDiffRow(attrs);
                                    var avg = this.generateAvgRow(attrs);
								}
								if(parseInt(attrs.year) == parseInt(values.endYear)-1){
									prev =this.generateYearlyRow(attrs);
								}
							}
							
							//avgs
							//TODO refactor
                        
							tot.production /=  f.length; //TODO use yield factors
							tot.area /=  f.length;
							tot.yield = uoms.yield_factor * tot.production / tot.area; //TODO do not multiply anymore
							tot.year = values.startYear + "-"+values.endYear;
							
							//generate block
							
							curr = curr || this.generateYearlyRow({year:values.endYear});
							prev = prev || this.generateYearlyRow({year:parseInt(values.endYear)-1});
                            if(values.type =="difference"){
                                result += "<tr class='regionblock'><th rowspan=3>"+i+"</th>"+ curr + "</tr>"+
								"<tr>" + avg + "</tr>" ;
                                
                                result += "<tr>" + diffrow + "</tr>" ;
                            }else{
							     
							result += "<tr class='regionblock'><th rowspan=3>"+i+"</th>"+ curr + "</tr>"+
								"<tr>" + prev + "</tr>"+
								"<tr>" + avg + "</tr>" ;
                            }
							
						}	 
						result +='</table>';	 
						//TODO
						
						return result;

					},
					eventListeners:{
						getfeatureinfo:function(evt){
							if(evt.features.length <1) return;
							cleanup();
							
							tooltip = new GeoExt.Popup({
								constrainHeader : true,
								map: target.mapPanel,
								width:370,
								autoScroll:true,
								xtype: 'tooltip',
								location:evt.xy,
								resizable:false,
								items:{xtype:'panel',html:'<div style="padding:5px">'+this.showResults(evt.features)+'</div>'},
								title: values.crop + " " + values.endYear + "-" + values.variable,
								autoHide: false,
								closable: true,
								draggable: false,
								mouseOffset: [0, 0],
								showDelay: 1,
								listeners: {hide: cleanup}
							});
							
							//take only the first
							
							var p0 = target.mapPanel.getPosition();
							//tooltip.targetXY = [evt.xy.x +p0[0],evt.xy.y +p0[1]];
							tooltip.show();
							
						
						},
						deactivate: cleanup
					}
					
			})
			wms.events.register('added',this,function(eventObject){
				this.layers.push(wms);
				this.controls.push(control);
			});
			
			wms.events.register('removed',this,function(eventObject){
				control.deactivate();
				var index = (this.controls.indexOf(control));
				this.controls.splice(index,1);
				this.layers.splice(index,1);
				if(this.controls.length<=0){
					var controls =this.controls;
					/* this timeout is needed becouse moving layers in layer tree
					   causes a remove and an add. so if only one layer is left
					   and the user moves the layer, the event empty the this.coltrols array
					   temporarely. Waiting some time is actually the only way to check if the layer
					   removed was added again(layer moved) or not,and so remove the button or not.					   
				   */
					setTimeout(function(){
						if(controls.length<=0){
							var action = Ext.getCmp('paneltbar').getComponent('cropDataActiveTool');
							Ext.getCmp('paneltbar').remove(action);
						}
					},500)
					
					
				}
				
				//target.mapPanel.map.removeControl(control);
			
			})

			var fields = [
                {name: "name", type: "string"}, 
                {name: "group", type: "string"},
				{name: "title", type: "string"},
                {name: "selected", type: "boolean"},
				{name: "querible", type: "boolean"}
            ];
			var Record = GeoExt.data.LayerRecord.create(fields);
			
			//target.mapPanel.map.addLayers([wms]);
			Ext.getCmp('id_mapTab').setActiveTab(0);
			target.mapPanel.map.addControl(control);
			//add to list of layers and controls 
			target.mapPanel.layers.add([record]);
			
			
			
			
            var action = Ext.getCmp('paneltbar').getComponent('cropDataActiveTool');
			var sm = Ext.getCmp('layertree').getSelectionModel();
			if(!action){
				action = new Ext.Button({
					tooltip: this.infoActionTip,
					itemId: 'cropDataActiveTool',
					iconCls: "icon-mapcursor",
					toggleGroup: this.controlToggleGroup,
					enableToggle: true,
					allowDepress: true,
					toggleHandler: function(button, pressed) {
						for (var i = 0, len = this.controls.length; i < len; i++){
							if (pressed) {
								
								if(sm.getSelectedNode() && sm.getSelectedNode().layer == this.layers[i]){
									this.controls[i].activate();
								}
							} else {
								this.controls[i].deactivate();
							}
						}
					 },scope:this
				});
				Ext.getCmp('paneltbar').insertButton(this.mapToolPosition,action);
				Ext.getCmp('paneltbar').doLayout();
			}
			
			
			
			
			//if(sm.getSelectedNode().layer == wms) { control.activate(); }
			sm.on('selectionchange',function(sm,sel,eOpts){
				if(!sm.getSelectedNode()) return;
				if(sm.getSelectedNode().layer && sm.getSelectedNode().layer.id == wms.id){
					if(action.pressed) control.activate();
					
				}else{
					control.deactivate();
					
				}
				
			
			
			},this);
			
        
    },
    getProperStyle: function(values,areatype,varparam,crop){
        if(values.type == "difference"){
                return "difference_style";
        }
        return areatype + "_" + crop + "_"+ varparam + "_style" ;
    },
    //gets the styles array that match properly with the generated layer
    filterStyles: function(values,areatype,varparam,crop,viewparams,record){
            var name = this.getProperStyle(values,areatype,varparam,crop);
            var styles = record.get("styles");
            var newStyles = [];
            for(var i = 0 ; i < styles.length; i++){
                var s = styles[i];
                if( s.name.indexOf(name) >= 0 ){
                    newStyles.push(s);
                }
            }
            record.set("styles",newStyles);
            
            return styles;
    }
});

Ext.reg(gxp.widgets.button.NrlCropDataMapButton.prototype.xtype, gxp.widgets.button.NrlCropDataMapButton);