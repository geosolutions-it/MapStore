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
 * file: config.js
 * 
 * var: config
 * Oggetto che contiene i parametri di configurazione dei componenti. Contiene a sua volta i seguenti oggetti.
 *
 * XDProxy: 
 *	se definito <CSWHttpProxy> utilizza un proxy per le richieste JavaScript Cross-Domain.
 * 	questo oggetto contiene:
 *
 * url -		{string} url del proxy
 * callback -	{string} parametro della richiesta HTTP contenente l'url a cui redirigere la richiesta.
 *          	la richiesta risultante HTTP sara' del tipo: <url>?<callback>=urlReale. 
 * 				L'url reale e' quello effettivamente contenuto nel CSWHttpProxy.
 *				es.
 *				http://mydomain.it/proxy?url=remoteCSWcatalog
 *
 * catalogs:
 * Array di cataloghi. Questo oggetto viene passato Al <CSWPanel> e a sua volta al <CSWCatalogChooser>. 
 * Ogni elemento di questo array contiene i campi: 
 *
 * name -		 {string}	nomi da visualizzare 
 * url -		 {string} 	url del catalogo
 * description - {string}	descrizione
 *
 * dcProperty: 
 * {string} Proprieta' Dublin core da inserire come parametro all'interno della ricerca avanzata.
 *
 * initialBBox:
 * Valori della Bounding Box da inserire come parametro all'interno della la ricerca avanzata. l'oggetto contiene seguenti valori.
 *
 *			minx - {number} 
 *			miny - {number}
 *			maxx - {number}
 *			maxy - {number}
 *
 *
 *
 *  cswVersion:
 *  {string} Versione Protocollo CSW   
 *
 *	filterVersion: 
 *  {string} Versione del Filtro OGC
 *
 *	start: 
 *  {number} Punto di inizio della ricerca corrispondente alla StartPosition del Protocollo CSW GetRecords
 *
 *	limit:
 *  {number} Corrispondente alla StartPosition del Protocollo CSW GetRecords
 *
 *	timeout
 *  {number} Tempo massimo di attesa prima che la ricerca sia annullata
 */
var config = {
		/*
		 * uncomment to use XDProxy configuration
		 * 
		 */
		XDProxy: { url:"../http_proxy/proxy", callback: "url" },
		
		 
		/* NOTE: leave the proxyed servers before the others, in order to make the test cases work */
       catalogs: [
                  /*
                  {"name": "Demo1GeoSolutions-no proxy", "url": "http://localhost/geonetwork/srv/en/csw", "description": "http://demo1.geo-solutions.it/geonetwork/srv/en/csw"},
                  {"name": "Invalid server-no proxy", "url": "http://localhost/xxx", "description": "Invalid server"},
                  {"name": "Treviso-no proxy", "url": "http://localhost/geonetworktn/srv/it/csw", "description": "http://ows.provinciatreviso.it/geonetwork/srv/it/csw"},
                  {"name": "kscNet-no proxy" , "url": "http://localhost/geonetworkksc/srv/ru/csw", "description" : "http://geoportal.kscnet.ru/geonetwork/srv/ru/csw"},
                  {"name": "CSI-CGIAR-no proxy", "url": "http://localhost/geonetworkcsi/srv/en/csw", "description" : "http://geonetwork.csi.cgiar.org/geonetwork/srv/en/csw"},
                  {"name": "EauFrance-no proxy", "url": "http://localhost/geonetworkeaufr/srv/fr/csw", "description" : "http://sandre.eaufrance.fr/geonetwork/srv/fr/csw"},
                  
                  {"name": "SOPAC-no proxy", "url": "http://localhost/geonetworksopac/srv/en/csw", "description" : "http://geonetwork.sopac.org/geonetwork/srv/en/csw"},
                  {"name": "SADC-no proxy", "url": "http://localhost/geonetworksadc/srv/en/csw", "description" : "http://www.sadc.int/geonetwork/srv/en/csw"},
                  {"name": "MAPAS-no proxy", "url": "http://localhost/geonetworkmapas/srv/en/csw", "description" : "http://mapas.mma.gov.br/geonetwork/srv/en/csw"},
*/
                  {"name": "Demo1GeoSolutions" , "url": "http://demo1.geo-solutions.it/geonetwork/srv/en/csw", "description": "Iternal GeoNetwork demo"},
                  {"name": "Treviso", "url": "http://ows.provinciatreviso.it/geonetwork/srv/it/csw", "description": "Treviso Geonetwork"},
        		  {"name": "kscNet", "url": "http://geoportal.kscnet.ru/geonetwork/srv/ru/csw", "description": "kscNet"},
                  {"name": "CSI-CGIAR", "url": "http://geonetwork.csi.cgiar.org/geonetwork/srv/en/csw", "description" : "CSI-CGIAR"},
                  {"name": "EauFrance", "url": "http://sandre.eaufrance.fr/geonetwork/srv/fr/csw", "description" : "EauFrance"},

                  {"name": "SOPAC", "url": "http://geonetwork.sopac.org/geonetwork/srv/en/csw", "description" : "SOPAC"},
                  {"name": "SADC", "url": "http://www.sadc.int/geonetwork/srv/en/csw", "description" : "SADC"},
                  {"name": "MAPAS", "url": "http://mapas.mma.gov.br/geonetwork/srv/en/csw", "description" : "MAPAS"}
	   ],
	   
       dcProperty: "title",
	   
	   initialBBox: {
			minx:-13,
			miny:10,
			maxx:-10,
			maxy:13
		}, 

   		cswVersion: "2.0.2",
  		  		
		filterVersion: "1.1.0",
  		
		start: 1,
  		
		limit: 10,
		
		timeout: 60000
};
