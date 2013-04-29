/*
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
var i18n;
/**
 * Function: init.js
 * Crea e popola il mockup dell'applicazione
 * 
 */
Ext.onReady(function() {
	Ext.QuickTips.init(); 

	// Loads bundle for i18n messages
	i18n = new Ext.i18n.Bundle({
		bundle : "CSWViewer",
		path : "i18n",
		lang : "it-IT"
	});
	
	i18n.onReady( function() {
	    // Declares a panel for querying CSW catalogs
		var cswPanel = new CSWPanel({
				config: config,
				region:'center',
				listeners: {
					zoomToExtent: zoomToExtentTestHandler,
					viewMap: viewMapTestHandler	
				}
				
		});

		var viewWin = new Ext.Window({
			width : 620,
			//height: 562,
			border:false,
			boxMaxHeight:562,
			boxMinWidth: 600,
            autoScroll: true,
            //autoHeight:true,
			
			closable:false,
			resizable:true,
			draggable:true,
            title:'CSW Explorer Demo',
			
			
			
			items : [ cswPanel ]
		});
		viewWin.setPosition(30,100);
		viewWin.show();
	});
});

