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
mxp.widgets.GcFormSegResourceEditor = Ext.extend(mxp.widgets.GcFormResourceEditor, {

    /** api: xtype = mxp_gc_formseg_resourcce_editor */
	xtype:'mxp_gc_formseg_resourcce_editor',
    seg_store:null,
    sop_store:null, 
    pages_store:null,	
  	layout: 'border',
  	frame:true,
  	destLabel:'Origin Fields',
  	segHidden:true,
  	
initComponent: function() {                    
 	
 	
		mxp.widgets.GcFormSegResourceEditor.superclass.initComponent.call(this, arguments);
	},
	

        	  
        	

//Condizioni di validità per la form, 1) Deve avere tutti i campi del sopralluogo implementati altrimenti non è valida!!
//Condizione pesante da valitare devi ciclare fra tutte le pagine e  tutti i campi e controllare che siano presenti
isValid:function() {

	//Se non ho nessuna pagina è valida vuol dire che non la vogliono mettere
	if(this.pages_store.getCount()==0) return true;

    if(!this.formTitle.isValid())return false;
	//ho creato store con i nomi dei campi impostati nella form

	fId_str=this.getFieldsList();
	

	//recupero store dal pannello sotto rimuovo tutti i filtri se ce ne fossero
	sop=this.pageWidget.sop_store;
	sop.clearFilter();
	
	//primo controllo se numero differente non posso accettare
	
	if(fId_str.getCount()<sop.getCount()&& false)return false;
		else {   //cicli per controllare validita
			
			for(i=0, ilen=sop.getCount();i<ilen;i++){
				
			 if(fId_str.find('fId',sop.getAt(i).get('name'))==-1){
			 	fId_str.destroy();
			 	return false;
			 }
			
				
			}
			
		}    	
			fId_str.destroy();
		return true;
	 
}


});
Ext.reg(mxp.widgets.GcFormSegResourceEditor.prototype.xtype, mxp.widgets.GcFormSegResourceEditor);


