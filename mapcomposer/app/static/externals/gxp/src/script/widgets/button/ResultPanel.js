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

gxp.ControlPanel = Ext.extend(Ext.Panel, {
    xtype: 'portal',
    region: 'center',
    data: null,
    panels: null,
    media: null,
    
	initComponent: function(){
        this.items = [{
            columnWidth: .99,
            style:'padding:10px 0 10px 10px',
            items:[{
                title: "Commodity: " + this.data[0][0].crop + " - Season: Rabi",
                items: [this.panels],
                tools: [{
                        id: 'info',
                        handler: function () {
                
                            var iframe = "<div id='list2' style='border: none; height: 100%; width: 100%' border='0'>" + 
                                    "<ol>" +
                                        "<li><p><em> Commodity: </em>" + this.data[0][0].crop + "</p></li>" +
                                        "<li><p><em> Season: </em>" + "Rabi" + "</p></li>" +
                                        "<li><p><em> Province 1: </em>" + this.data[0][0].prov + "</p></li>" +
                                        "<li><p><em> Province 2: </em>" + this.data[1][0].prov + "</p></li>" +
                                        "<li><p><em> From year: </em>" + this.media[0][0].time + "</p></li>" +
                                        "<li><p><em> To year: </em>" + this.media[0][this.media[0].length-1].time + "</p></li>" +
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
                    collapsible: true
                }]
        }]		
		gxp.ControlPanel.superclass.initComponent.call(this);
	}
});
/** api: xtype = gxp_controlpanel */
Ext.reg('gxp_controlpanel', gxp.ControlPanel);