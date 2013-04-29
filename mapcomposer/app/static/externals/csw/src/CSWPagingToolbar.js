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
 * Class: CSWPagingToolbar 
 * Naviga le pagine dei risultati nella griglia
 * fornisce i parametri corretti per la paginazione rispetto al protocollo
 * CSW getRecords. Estende le funzionalita' della paging toolbar
 * aggiungendo i pulsanti *"Espandi Tutti"* e *"Chiudi Tutti"* per aprire o
 * chiudere tutti i Row Expander della griglia.
 * 
 * Inherits from: 
 * - <Ext.PagingToolbar>
 * 
 * See also:
 * - <CSWGrid>
 *
 */
CSWPagingToolbar = Ext.extend(Ext.PagingToolbar, {
	
    autoWidth:true,
    
	/**
	 * Method: initComponent
	 * inizializza il componente
	 */

	initComponent : function() {
		this.paramNames = {
			start : "start",
			limit : "limit"
		}
		
		
		CSWPagingToolbar.superclass.initComponent.call(this);
		//disable default refresh
		
		
		//add expandAll and collapseAll buttons	
		this.expandAll = this.addButton({
            text: i18n.getMsg("expandAll"),
            scope: this,
            iconCls: 'icon-expand-all',
            disabled:true,
			tooltip: i18n.getMsg("expandTooltip"),
            handler: function(){                
                this.grid.plugins.expandAll();
            }
        });
		this.collapseAll = this.addButton({
            text: i18n.getMsg("collapseAll"),
            scope: this,
            iconCls: 'icon-collapse-all',
            disabled:true,
			tooltip: i18n.getMsg("collapseTooltip"),
            handler: function(){                
                 this.grid.plugins.collapseAll();
            }
        });
        //store event association
		this.store.on('clear',this.onClear,this);
		
		
	},
	
  /**
	* Method: doLoad
	*	Chiamato al cambio della pagina.
	*   Sovrascrive il corrispondente metodo della superClasse passando allo store
	*   i valori corretti per il CSW GetRecords
	*   
	* Parameters:
	* start - {int} Posizione iniziale del primo record da visualizzare. parte da 0
	*               lasciando immutata la rappresentazione interna della paging toolbar
	*				da cui eredita il metodo. Al momento di passare il valore allo store
	*				lo passa incrementato di 1 in accordo con la rappresentazione CSW
	*                  
    */
	doLoad : function(start) {
		var o = {}, pn = this.getParams();
		o[pn.start] = start + 1; // incremented as the standard CSW StartPosition value require (start from 1, not from 0)									
		o[pn.limit] = this.pageSize;
		o.jsonData= {}; // NOTE: needed to force store to do not pass start and limit parameters in query string 
		if (this.fireEvent('beforechange', this, o) !== false) {
			this.store.reload({
				params : o
			});
		}
	},
	
	/**
	*
	* Method: onLoad
	*	
	*   A load avvenuto viene chiamato questo metodo, che aggiorna lo stato dei
	*	pulsanti della toolbar.
	*   
	* Parameters:
	* store -	{Ext.data.Store} lo store a cui si fa riferimento
	* r - 		{Array} array di records risultato della ricerca
	* o - 		{object} options passate allo store per la load appena avvenuta
	*                  
    */
	onLoad : function(store, r, o) {
		if (!this.rendered) {
			this.dsLoaded = [ store, r, o ];
			return;
		}
		var p = this.getParams();

		// changed: needed to give the right parameter to cursor(first start was
		// aug. of 1 because of the CSW param StartPosition Starts from 1
		// so now it have to be dim. 1
		this.cursor = (o.params && o.params[p.start]) ? o.params[p.start] - 1 : 0;
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;
		var count=this.store.getCount();
		this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
		this.inputItem.setValue(ap);
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled(ap == 1);
		this.next.setDisabled(ap == ps);
		this.last.setDisabled(ap == ps);
		this.expandAll.setDisabled(!count);
		this.collapseAll.setDisabled(!count);
		this.refresh.setDisabled(!count);
        this.inputItem.setDisabled(!count);
		this.updateInfo();
		this.fireEvent('change', this, d);
	},
    /**
	*
	* Method: onClear
	*	
	*   All'evento clear dello store viene associato questo metodo che resetta i
	*	pulsanti della toolbar.
	*   
	* Parameters:
	* store -	{Ext.data.Store} lo store a cui si fa riferimento
	* r - 		{Array} array di records risultato della ricerca
	*                  
    */
	onClear : function(store,r) {
		this.cursor = 0;
		var p = this.getParams();
		var ap = 0, ps = 1;
		this.afterTextItem.setText(String.format(this.afterPageText, ps));
		this.inputItem.setValue(ap);
		this.first.setDisabled(true);
		this.prev.setDisabled(true);
		this.next.setDisabled(true);
		this.last.setDisabled(true);
		this.expandAll.setDisabled(true);
		this.collapseAll.setDisabled(true);
		this.refresh.setDisabled(true);
        this.inputItem.setDisabled(true);
		this.updateInfo();
		
	   
    }  

});