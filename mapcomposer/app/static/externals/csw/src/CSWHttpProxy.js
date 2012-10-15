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
 * Class: CSWHttpProxy 
 * DataProxy che gestisce le richieste e le risposte al server CSW
 * 
 * Inherits from: 
 * - <Ext.data.HttpProxy>
 *  
 */
 
 CSWHttpProxy = Ext.extend(Ext.data.HttpProxy, {

	resultType: null,
	
	filterVersion: null,
	
	cswVersion: null,
	
	filter: null,
	
	XDProxy:null,
	
	sortProperty:null,
	
	sortOrder:null,
	
	/**
	  * Constructor: CSWHttpProxy
	  * 
	  * Parameters:
	  * options -				{object} oggetto contenenti i parametri della ricerca.
	  * options.url -			{string} Url verso il quale effettuare la ricerca.
	  * options.filterVersion - {string} Versione del Filtro OGC.
	  * options.resultType -	{string} 
	  * options.filter -		{OpenLayers.Filter} filtro OpenLayers per La ricerca.
	  * options.emptySearch -	{boolean} discrimina se la ricerca e' vuota.
	  * options.start -  		{number} Equivalente a StartPosition in CSW GetRecords.
	  * options.limit -  		{number} Equivalente a MaxResults in CSW GetRecords.
	  * options.XDProxy -	 	{object} Opzionale. Proxy cross domain. vedi <config>
	  * options.timeout -	 	{number} millisecondi di timeout prima che il server 
	  * options.sortProperty -	 	{string} campo da usare per l'ordinamento dei risultati (default "title") 
	  * options.sortOrder -	 	(ASC|DESC) tipo di ordinamento dei risultati (default "ASC") 
	  * options.cswVersion -	 {string} versione del CSW (se diversa da 2.0.2) 
	  *							sia considerato irraggiungibile
	  *
	  */
	constructor: function(options) {
		this.cswVersion = (options.cswVersion) ? options.cswVersion : "2.0.2";
		this.sortProperty = (options.sortProperty) ? options.sortProperty: "Title";
		this.sortOrder = (options.sortOrder) ? options.sortOrder: "ASC";
		this.limit = options.limit;
		var conn = {
				url: ( options.XDProxy ? options.XDProxy.url + "?" + options.XDProxy.callback + "=" + encodeURIComponent(options.url) : options.url),
				currentCatalog: options.url,
				method: "POST",
				extraParams: {Request: "GetRecords", Service: "CSW"},
				timeout: options.timeout,
				// NOTE: this should be called "xmlData" to force 
				// ExtJS to send "text/xml" ad content type
				xmlData: this.buildCSWRequestData(options)
		};            
  
		CSWHttpProxy.superclass.constructor.call(this, conn);
	},

	/**
	 * Method: updateRequest  
	 * Aggiorna la richiesta da inviare al Server CSW
	 * 
	 * Parameters:
	 * options - {Object} aggiorna i parametri.
	 */
	updateRequest : function(options) {
		this.conn.xmlData = this.buildCSWRequestData(options);
	},
	
	/**
	* Method: buildCSWRequestData 
	* Costruisce la richiesta da inviare al server CSW
	* 
	* Returns:
	* {Object} - 	Oggetto con tutti i parametri della richiesta da inviare al server CSW.
	*   			Quando filter, filterVesrion o resultType sono null, vengono utilizzati i parametri precedenti
	*/
	buildCSWRequestData : function(options) {
		
		this.resultType = (options.resultType) ? options.resultType : this.resultType;
		this.filterVersion = (options.filterVersion) ? options.filterVersion : this.filterVersion;
		this.filter = (options.filter) ? options.filter : this.filter;
		this.currentCatalog = (options.url) ? options.url : this.currentCatalog;
		this.sortProperty = (options.sortProperty) ? options.sortProperty : this.sortProperty;
		this.sortOrder = (options.sortOrder) ? options.sortOrder : this.sortOrder;
			
		var optionsCsw = {
				//if XDProxy is defined use it
				url : ( options.XDProxy ? options.XDProxy.url + "?" + options.XDProxy.callback + "=" + options.url : options.url), 
				resultType : "results",
				startPosition : (options.start ? options.start : 1),  
				maxRecords : (this.limit ? this.limit : 10),
				outputFormat : "application/xml",
				outputSchema : "http://www.opengis.net/cat/csw/" + this.cswVersion
		};

		// If a filter has been specified, and the search is not to be empty 
		if (this.filter != null && ! options.emptySearch) {
				optionsCsw.Query = {
					ElementSetName : {
						value : this.resultType  
					},
					Constraint : {
						version : this.filterVersion,
						Filter : this.filter
					}
				};
		} else {
			optionsCsw.Query = {
					ElementSetName : {
						value : this.resultType  
					}
			};
		}

		// Sort results by a given property 
		optionsCsw.Query.SortBy = {
			SortProperty: {
				PropertyName: {value: this.sortProperty},
				SortOrder: {value: this.sortOrder}
			}	
		}; 

		var format = new OpenLayers.Format.CSWGetRecords();
		return format.write(optionsCsw);
	}
});

