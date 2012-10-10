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
/**
 * Function: viewMapTestHandler
 *	Funzione  di test da associare all'evento <CSWPanel::viewMap> del CSWPanel. Mostra una 
 *	finestra con i parametri passati all'handler dell'evento.
 *  
 *	
 * Parameters:
 * el {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
 * el.bbox - {Object} bounding Box del record
 * el.crs  -  {Object}crs della boundingbox
 *	
 *	
 */
viewMapTestHandler = function(layerInfo) {
	var xx = '<ul>';
	for (x in layerInfo) {
		//should be more than one layer, so for any layer results 
		if(layerInfo[x] instanceof Array) {
			//eg. layer:  
			xx+=" <li><strong>"+x+":</strong> <ul>"
			
			for(var index=0;index<layerInfo[x].length; index++){
				 
				xx+= "<li> ";
				//layer=... wms=...
				for (var field in layerInfo[x][index]){
					
					xx+= "<strong>"+field+"</strong>= "+layerInfo[x][index][field]+ " ";
				}
				xx+="</li>";
			}
			xx+="</ul></li>";
		}else{
		xx += "<li><strong>" + x + ": </strong>" + layerInfo[x] + "</li>";
		}
	}
	xx += "</ul>";
	
	var eventPan=new Ext.Panel({
		html:"<h3>Parameters</h3>"+xx,
		preventBodyReset:true,
		autoScroll:true,
		autoHeight: false,
		width: 600,
		height: 400
	
	});		
	
	var eventWin = new Ext.Window({
		
		title: "viewMap Event",
		closable: true,
		width:614,
		resizable: false,
		
		draggable: true,
		items: [
			eventPan
		]

		
	});
	
	eventWin.show();

}

/**
 * Function: zoomToExtentTestHandler
 *	Funzione  di test da associare all'evento <CSWPanel::zoomToExtent> del CSWPanel. Mostra una 
 *	finestra con i parametri passati all'handler dell'evento.
 *  
 *	
 * Parameters:
 * layerInfo {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
 * layerInfo.bbox - bounding Box del record
 * layerInfo.crs - crs del record
 * layerInfo.Layers - {Array}. Array contenenti tutti i layer associati al record
 *	
 *	
 */
zoomToExtentTestHandler =  function(el) {
		/* Old dialog message
		Ext.Msg.show({
			msg : "zoomToExtent Event!:object passed:<br/>" + bb,
			width : 500
		});
		*/
		var eventPan=new Ext.Panel({
			html:"<h3>Parameters</h3> <li><strong>Bounding Box: </strong>"+el.bbox+"</li><li><strong>crs:</strong> "+el.crs+"</li>",
			preventBodyReset:true,
			autoScroll:true,
			autoHeight: false,
			width: 600,
			height: 400
		
		});						
		var eventWin = new Ext.Window({
			
			title: "zoomToExtent Event",
			closable: true,
			width:614,
			resizable: false,
			
			draggable: true,
			items: [
				eventPan
			]
		});
		eventWin.show();
	
}