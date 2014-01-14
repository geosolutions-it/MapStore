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
 * object for configuring the component.
 *
 * {string} url MapComposer
 * mcUrl
 * 
 * {string} url /geostore/rest/extjs/search/
 * geoSearchUrl
 * 
 * {string} /geostore/rest/resources/resource/
 * geoDelUrl
 * 
 * {number} Indice del primo elemento da ritornare
 * start
 * 
 * {number} Numero di elementi da ritornare
 * limit
 * 
 */
/*var config = {
    mcUrl: 'http://localhost:8080/MapComposer/',
    geoSearchUrl: 'http://localhost:8080/geostore/rest/extjs/search/',
    geoDelUrl: 'http://localhost:8080/geostore/rest/resources/resource/',
    start: 0,
    limit: 100,
    msmTimeout: 30000,
    msmWait: 5
};*/
var config = {

	baseUrl: 'http://localhost:8080',
	proxyUrl: 'http://localhost:8080/http_proxy/proxy/',
    composerURL: '/',
	googleApi: 'AIzaSyB7xuRXSoI8V5c8wD6dI8kS5ipCjLN3HQE',
	//update key here: https://code.google.com/apis/console/#project:385384104319:access
    
    start: 0,
    limit: 10,
    msmTimeout: 30000
};


