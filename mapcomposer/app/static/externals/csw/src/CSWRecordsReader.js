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
 * Class: CSWRecordsReader 
 * Classe utilizzata dallo store per leggere i record ritornati dal server CSW
 * e costruire un oggetto Javascript adatto.
 * 
 * Inherits from: 
 * - <Ext.data.JsonReader>
 *  
 */
CSWRecordsReader = Ext.extend(Ext.data.JsonReader, {
	
	/**
	 * APIProperty: store {Ext.data.Store} Store to which this reader is attached
	 */
	store: null,

	/**
	 * Constructor: CSWRecordsReader(meta, recordType)
	 * 
	 * Parameters:
	 *  meta - {Object} Configurazione del reader. 
	 *  recordType - {Array | * Ext.data.Record}  Un array di oggetti Ext.Data.Fields oppure
	 *  			 oggetti Record. di defauld e' la classe :Ext.data.Record
	 *
	 */
	constructor: function(meta, recordType) {
		meta = meta || {};
		if (!meta.format) {
			meta.format = new OpenLayers.Format.CSWGetRecords();
		}
		if (!meta.root) {
			meta.root = 'records';
		}
  
		meta.totalProperty= "SearchResults.numberOfRecordsMatched";
  	recordType = CSWRecord;
  	// There may be information of interest in the getRecords response
  	// namely SearchResults.numberOfRecordsReturned and
  	// SearchResults.numberOfRecordsMatched
  	CSWRecordsReader.superclass.constructor.call(this, meta, recordType);
	},


	/**
	 * Private: read 
	 * request - {Object} l'oggetto XHR che contiene il documento XML parsed. 
	 * 
	 * Returns:
	 * {Object} un blocco di dati utilizzato dal Ext.data.Store come cache degli oggetti Ext.data.Record. 
	 * 
	 */
	read : function(request) {
		var data = request.responseXML;
		
		if (!data || !data.documentElement) {
			data = request.responseText;
		}
		return this.readRecords(data);
	},

	/**
	 * Private: readRecords 
	 * data - {DOMElement | String | Object} A document element or XHR response string. 
	 * 
	 * Returns:
	 * {Object} A data block which is used by an Ext.data.Store as a cache of 
	 *  Ext.data.Record objects.
	 */
	readRecords : function(data) {
		if (typeof data === "string" || data.nodeType) {
			data = this.meta.format.read(data);
		}
		
		data.total= data.SearchResults.numberOfRecordsMatched;
		
		return CSWRecordsReader.superclass.readRecords.call(this, data);
	}
});