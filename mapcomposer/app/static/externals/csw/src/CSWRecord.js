
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
 * Function: isDCValidName
 *	Verifica che il parametro passato sia uno dei nomi Dublin Core ammessi dallo standard
 *	secondo la speicifica: OpenGis Catalog Services Specifications Version 2.0.2.
 *  Necessario per catturare solo i campi dc compresi nello standard e non tutti quanti.
 *	
 *	Parameters:
 *		
 *		name - {string} il parametro da controllare
 *	
 *	Returns:
 *		{boolean} _true_ se il parametro è uno dei nomi DC nello standard, _false_ altrimenti.
 */
var isDCValidName= function (name){
	
	if(name=='abstract') return true;
	if(name=='creator') return true;
	if(name=='contributor') return true;
	if(name=='subject') return true;
	if(name=='description') return true;
	if(name=='publisher') return true;
	if(name=='date') return true;
	if(name=='type') return true;
	if(name=='format') return true;
	if(name=='identifier') return true;
	if(name=='source') return true;
	if(name=='language') return true;
	if(name=='relation') return true;
	if(name=='coverage') return true;
	if(name=='rights') return true;
	//if(name=='URI') return true; //not in standard
	return false;

}
/**
 *	Function: CSW2ExtConvert
 *	
 *	Converte i record CSW ritornati dal formatter di OpenLayers in un formato Extjs comprensibile da Extjs
 *	 utile alle funzionalità dell'applicazione.
 *	
 *	Parameters:
 *	      v - Il valore del dato così come viene ritornato dal Reader, se non definito verrà utilizzato il valore di default..
 *	   record - L'oggetto contenente i dati della riga come ritornati dal reader. a seconda del tipo di reader,
 *			   questo può essere un Array (ArrayReader), un oggetto (JsonReader), o un documento XML (XMLReader).
 *	
 *	Returns:
 *	
 *	   {object} - L'oggetto JavaScript da assegnare allo specifico campo
 *	
*/
var  CSW2ExtConvert = function (v,record){
		//thumbnail
		if( this.name=='thumbnail'){
			var founded;
			var rec=record['URI'];
			if(!rec) return;
			for(var i=0;i<rec.length;i++){
				if( rec[i].name == 'thumbnail' ){
					founded=rec[i];
				}
			}
			return founded;
		//map resource
		}else if(this.name=='map'){
			var founded=new Array();
			var rec=record['URI'];
			if(!rec) return founded;
			for(var i=0;i<rec.length;i++){
				if( rec[i].protocol == 'OGC:WMS-1.1.1-http-get-map' || 
				    rec[i].protocol == 'OGC:WMS-1.3.0-http-get-map' || 
				    rec[i].protocol == 'OGC:WMS'){
					founded.push(rec[i]);
				}
			}
			return founded;
		//Download
		}else if(this.name=='downloads'){
			var founded=new Array();
			var rec=record['URI'];
			if(!rec) return founded;
			for(var i=0;i<rec.length;i++){
				if( rec[i].protocol == 'WWW:DOWNLOAD-1.0-http--download' ){
					founded.push(rec[i]);
				}
			}
			return founded;
		
		//DC
		}else if(this.name=="dc"){
			var dc = new Array()
			for( el in record ){
				if ( isDCValidName(el) ){ //TODO Select only DC
					dc[el]=record[el]; 
				}
			}
			return dc;
		//Other fields, give the right array or single value
		}else if(this.name=="bounds"){
			if(record["bounds"]) return record["bounds"];
			if(record["BoundingBox"]){
				var arr = record["BoundingBox"];
				for(x in arr){
					if(arr[x].bounds) return arr[x].bounds;
				}
				
				return ;
			}
			return undefined;
		
		}else if(record[this.name]){
				if(record[this.name] instanceof Array){
					
					if(record[this.name].length ==1){
						return record[this.name][0].value ? record[this.name][0].value : record[this.name][0] ;
					}else{
						var ret=new Array()
						for(var i=0; i<record[this.name].length;i++){
							ret.push( record[this.name][i].value );
						}
						return ret;
					}
				//if record is not an instance of Array
				}else{
					return record[this.name];
				}
			}else{
				return undefined;
			}
		
	
}
	

/** Class: CSWRecord
 * 
 * Tutti i campi CSW disponibili all' applicazione. Comprende
 * i campi nel namespace dc, dct, ows previsti dallo standard
 * delle risposte CSW getRecords.
 * Crea una sottoClasse di Ext.data.Record.
 * 
 *
 * Inherits from: 
 * - <Ext.data.Record>
 *
 */
var CSWRecord = Ext.data.Record.create([ 
    {name: 'title', 		convert:  CSW2ExtConvert },
    {name: 'creator', 		convert:  CSW2ExtConvert },
	{name: 'subject', 		convert:  CSW2ExtConvert },
	{name: 'description', 	convert:  CSW2ExtConvert },
	{name: 'abstract', 		convert:  CSW2ExtConvert },
	{name: 'publisher', 	convert:  CSW2ExtConvert },
	{name: 'contributor',	convert:  CSW2ExtConvert },
    {name: 'date', 			convert:  CSW2ExtConvert },
    {name: 'type',			convert:  CSW2ExtConvert },
    {name: 'format', 		convert:  CSW2ExtConvert },
    {name: 'identifier', 	convert:  CSW2ExtConvert },
	{name: 'source', 		convert:  CSW2ExtConvert },
	{name: 'language', 		convert:  CSW2ExtConvert },
	{name: 'relation', 		convert:  CSW2ExtConvert },
	{name: 'coverage', 		convert:  CSW2ExtConvert },
	{name: 'bounds',			convert:  CSW2ExtConvert },	
	{name: 'rights', 		convert:  CSW2ExtConvert },
	{name: 'projection'								 },
	{name: 'thumbnail'	,	convert:  CSW2ExtConvert },
	{name: 'map',			convert:  CSW2ExtConvert },
	{name: 'dc',			convert:  CSW2ExtConvert },
	{name: 'absolutePath'							 },
	{name: 'downloads'	,	convert:  CSW2ExtConvert },
	{name: 'metadataWebPageUrl'}
	

]);