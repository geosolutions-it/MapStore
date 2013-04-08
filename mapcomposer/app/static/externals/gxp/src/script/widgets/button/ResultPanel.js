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
 
Ext.namespace("gxp");
//deve prendere le configurazioni dei grafici
//
gxp.ControlPanel = Ext.extend(Ext.Panel, {
    commodity: null,
    season: null,
    province: null,
    fromYear: null,
    toYear: null,
    chart: null,
    chartHeight: null,
    collapsible: true,
    today: null,
    chartTitle: null,
	initComponent: function(){
        
    var panel;
    var panels = [];
    
    for (var i = 0; i<this.chart.length;i++){
        panel = new Ext.Panel({
            title: this.chart[i].chartConfig.title.text,
            layout: 'fit',
            style:'padding:5px 5px',
            border: true,                    
            items: [this.chart[i]],
            tools: [{
                id: 'info',
                handler: function () {
                    var iframe = this.commodity ? 
                            "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                            "<ol>" +
                                "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                                "<li><p><em> Commodity: </em>" + this.commodity.toUpperCase() + "</p></li>" +
                                "<li><p><em> Season: </em>" + this.season.toUpperCase() + "</p></li>" +
                                "<li><p><em> Years: </em>" + this.fromYear + "-" + this.toYear + "</p></li>" +
                            "</ol>" +                                        
                            "</div>" : 
                            
                            "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                            "<ol>" +
                                "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                                "<li><p><em> Date: </em>"+this.today+"</p></li>" +
                                "<li><p><em> AOI: </em>"+this.chartTitle+"</p></li>" +
                                "<li><p><em> Season: </em>" + this.season + "</p></li>" +
                                "<li><p><em> Years: </em>" + this.fromYear + "-" + this.toYear + "</p></li>" +
                            "</ol>" +                                        
                            "</div>";                            
                 
                    var appInfo = new Ext.Panel({
                        header: false,
                        autoScroll: true,
                        html: iframe
                    });

                    var win = new Ext.Window({
                        title:  "Charts Info",
                        modal: true,
                        layout: "fit",
                        width: 400,
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
            listeners: {
                removed: function(panel){
                    if (this.ownerCt.items.length == 0 && this.ownerCt.ownerCt){
                        var tabPanel = Ext.getCmp(this.ownerCt.ownerCt.id);
                        if(tabPanel){
                            tabPanel.remove(this.ownerCt);
                        }
                    }
                }
            }         
        });
        panels.push(panel);
    }
    

		this.title= this.commodity ? "Pakistan - Crop Data - Commodity: " + this.commodity.toUpperCase() +  " - Season: " + this.season.toUpperCase() + " - Years: "+ this.fromYear + "-"+ this.toYear : "Pakistan - AgroMet Variables - Season: " + this.season.toUpperCase() + " - Years: "+ this.fromYear + "-"+ this.toYear,
		this.tools= [{
			id: 'info',
			handler: function () {
				var iframe = this.commodity ? 
                        "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
						"<ol>" +
                            "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
							"<li><p><em> Commodity: </em>" + this.commodity.toUpperCase() + "</p></li>" +
							"<li><p><em> Season: </em>" + this.season.toUpperCase() + "</p></li>" +
							"<li><p><em> AOI: </em>" + this.province.concat() + "</p></li>" +
							"<li><p><em> Years: </em>" + this.fromYear + "-" + this.toYear + "</p></li>" +
						"</ol>" +                                        
						"</div>" : 

                        "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                        "<ol>" +
                            "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                            "<li><p><em> Date: </em>"+this.today+"</p></li>" +
                            "<li><p><em> AOI: </em>"+this.chartTitle+"</p></li>" +
                            "<li><p><em> Season: </em>" + this.season + "</p></li>" +
                            "<li><p><em> Years: </em>" + this.fromYear + "-" + this.toYear + "</p></li>" +
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
					width: 400,
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
                    
                
        this.items =  [panels],

        this.listeners={
            removed: function(p){
                if (this.ownerCt.items.length == 0){
                    var tabPanel = Ext.getCmp('id_mapTab');
                    tabPanel.remove(this.ownerCt.id);
                }
            },
            bodyResize: function(p, width, height){
                if (Ext.isIE && this.collapsed == false){
                    
                    for (var i = 0; i<this.items.items.length; i++){
                        this.items.items[i].setSize(width,this.chartHeight);
                    }                
                    /*if (this.chart[0].chart){
                        for (var i = 0; i<this.chart.length; i++){
                            this.chart[i].chart.setSize(width,600);
                        }
                    }*/
                }
            }
        },
		gxp.ControlPanel.superclass.initComponent.call(this);
	}
});
/** api: xtype = gxp_controlpanel */
Ext.reg('gxp_controlpanel', gxp.ControlPanel);