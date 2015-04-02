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
// A panel that can contain many charts
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
        var info =this.chart[i].info,
        panel = new Ext.Panel({
            title: this.chart[i].chartConfig.title.text,
            layout: 'fit',
            style:'padding:5px 5px',
            border: true,   
            items: [this.chart[i]],
            tools: [{
                id: 'help',
                handler: function () {
                    var iframe;
                    if(info == undefined){ //TODO use only info for all modules
                        iframe = this.commodity ? 
                                "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                                "<ol>" +
                                    "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                                    "<li><p><em> Date: </em>"+this.today+"</p></li>" +
                                    "<li><p><em> AOI: </em>"+this.chartTitle+"</p></li>" +                                
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
                    }else{
                        iframe=info;
                    }
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
    
        var maininfo = this.info;
        if(!this.title){
        		this.title=  this.commodity ? "Pakistan - Crop Data - Commodity: " + this.commodity.toUpperCase() +  " - Season: " + this.season.toUpperCase() + " - Years: "+ this.fromYear + "-"+ this.toYear : "Pakistan - AgroMet Variables - Season: " + this.season.toUpperCase() + " - Years: "+ this.fromYear + "-"+ this.toYear;
        }
		this.tools= [{
			id: 'help',
			handler: function () {
                 var iframe
                if(maininfo == undefined){ //TODO use only info for all modules
                    iframe =  this.commodity ? 
                            "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                            "<ol>" +
                                "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                                "<li><p><em> Date: </em>"+this.today+"</p></li>" +
                                "<li><p><em> AOI: </em>"+this.chartTitle+"</p></li>" +                            
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
                 }else{
                    iframe = maininfo;
                 }
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
/**
 * A panel that contain many windows.
 * provide utilities to create chart and grid windows and add them to it.
 */
gxp.WindowManagerPanel = Ext.extend(Ext.Panel, {
    initComponent: function(){
        this.windowGroup = new Ext.WindowGroup();
        // autoremove this component from the tabPanel when empty
        this.on("remove",function(tab){
            var tabPanel = tab.ownerCt;
            if(tab.items.length <=0) {
                tabPanel.remove(tab);
                if(tabPanel.setActiveTab){
                    tabPanel.setActiveTab(0);
                }
            }
        });
        gxp.WindowManagerPanel.superclass.initComponent.call(this);
	}
    
});
/** api: xtype = gxp_controlpanel */
Ext.reg('gxp_windowmanagerpanel', gxp.WindowManagerPanel);

gxp.WindowManagerPanel.Util = {
    /**
     */
    createChartWindows : function (charts,listVar){
            var panels = [];
        
        for (var i = 0; i<charts.length;i++){
            var info =charts[i].info,
            panel = new Ext.Window({
                iconCls: "gxp-icon-nrl-chart",
                title: charts[i].chartConfig.title.text.replace(/(<br>|<br\/>|<br \/>)/g,' - '),
                layout: 'fit',
                width:700,
                height:500,
                //x: oldPosition[0] + 20*(i+1), 
                //y: oldPosition[1] + 20*(i+1),
                autoScroll: false,
                collapsible: true,
			    constrainHeader: true,
			    maximizable: true,
                border: true,   
                items: [charts[i]],
                tools: [{
                    id: 'help',
                    handler: function () {
                        var iframe;
                        if(this.info == undefined){ //TODO use only info for all modules
                            iframe = 
                                    "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                                    "<ol>" +
                                        "<li><p><em> Source: </em>Pakistan Crop Portal</p></li>" +
                                        "<li><p><em> Date: </em>"+listVar.today+"</p></li>" +
                                        "<li><p><em> AOI: </em>"+listVar.chartTitle+"</p></li>" +                                
                                        (listVar.commodity ? "<li><p><em> Commodity: </em>" + listVar.commodity.toUpperCase() + "</p></li>" :"")+
                                        "<li><p><em> Season: </em>" + listVar.season.toUpperCase() + "</p></li>" +
                                        "<li><p><em> Years: </em>" + listVar.fromYear + "-" + listVar.toYear + "</p></li>" +
                                    "</ol>" +
                                    "</div>" ;                     
                        }else{
                            iframe=this.info;
                        }
                        var appInfo = new Ext.Panel({
                            header: false,
                            autoScroll: true,
                            html: iframe
                        });

                        var win = new Ext.Window({
                            title:  "Chart Info",
                            modal: true,
                            layout: "fit",
                            width: 400,
                            height: 180,
                            items: [appInfo]
                        });

                        win.show(); 

                    },
                    scope: charts[i]
                }],
                
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
        return panels;
    },
    /**
     * Add a panel to a tab panel, if missing, and add the wins to a fixed position
     * wins ``Array`` of windows
     * tabPanelId ``String``
     * tagetTab ``String`` the itemId of the window manager
     * options "options to apply to the manager
     */
    showInWindowManager: function (wins,tabPanelId,targetTab,opts){
        var config = opts || {title: "Window Manager"};
        var tabPanel = Ext.getCmp(tabPanelId);
        var tabs = tabPanel.getComponent(targetTab);
        var oldPosition = (tabs && tabs.items && tabs.items.getCount() ? [tabs.items.getCount()*20,tabs.items.getCount()*20]:[0,0]);
        for(var i = 0 ; i < wins.length ; i++){
            wins[i].setPosition(oldPosition[0] + 20*(i+1) ,oldPosition[1] + 20*(i+1));
        }
        
        if(!tabs){
			var tabs = new gxp.WindowManagerPanel(Ext.apply(config,{
				itemId:targetTab,
				border: true,
				layout: 'form',
				autoScroll: true,
				closable: true,
				items: wins
			}));
			
			tabPanel.add(tabs); 
		}else{
			tabs.add(wins);
		}
		tabPanel.doLayout();
		tabPanel.setActiveTab(targetTab);
        for(var i = 0; i < wins.length;i++){
            var win =wins[i];
            win.show();
        }
    }
};
