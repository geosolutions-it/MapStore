/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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
 * @include widgets/geoCollect/GcMobileWidgetPanel.js
 * */

Ext.ns("mxp.widgets");


/**
 * GoeCollect Pre view Resource editor
 * Allow to select geocollect source resource
 */
mxp.widgets.GcPViewResourceEditor = Ext.extend(mxp.widgets.GcMobileWidgetPanel, {

    /** api: xtype = mxp_gc_pview_resource_editor */
	xtype:'mxp_gc_pview_resource_editor',
    
initComponent: function() {                    

//Nella preview ho solo questi widget!!
	 this.allowedTypes= [
['label', "Label"],
['mapViewPoint', "Map"],
['separatorWithIcon',"Separator With Icon"]
];
//Nascondo parti interfaccia non necessarie per preview
  this.pViwHide=true;
  this.sopHidden=true;
		mxp.widgets.GcPViewResourceEditor.superclass.initComponent.call(this, arguments);
	},
	
//                
getResourceData: function(){
                  return {preview:this.getPage()};
                
                },//Attenzione lo puoi caricare solo dopo che sono arrivati gli store!!
loadResourceData: function(resource){
    				page= resource;
        	 		this.loadPage(page);
        	  },
        	  
        	  //Condizioni di validità : La pagina deve avere almno un titolo e campo valido altrimenti è invalida
canCommit :function(){//Condizioni per sapere se è committabile 
                
                 return this.isValid();
                 }  
                       

});
Ext.reg(mxp.widgets.GcPViewResourceEditor.prototype.xtype, mxp.widgets.GcPViewResourceEditor);


