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
 * {string} base url
 * baseUrl
 * 
 * {string} http proxy url
 * proxy
 * 
 * {number} start param for the first page load
 * start
 * 
 * {number} limit param for the first page load
 * limit
 * 
 * {number} msmTimeout param for set ajax request timeout
 * msmTimeout
 *
 * {string} baseUrl:
 *   setiing this property you will have all the application configured as the following
 *   Examples of urls with localhost:8080 set as default url: 
 *
 *      map composer   http://localhost:8080/mapcomposer/
 *      user details (used in login)  http://localhost:8080/geostore/rest/users/user/details/
 *      resource (i.e. maps) search   http://localhost:8080/geostore/rest/extjs/search/
 *      resource rest endpoint  http://localhost:8080/geostore/rest/resources
 *      user rest endpoint  http://localhost:8080/geostore/rest/users
 *      
 *      You can override these URLs adding the following attributes to the config object:
 *          "geoStoreBase":"http://mapstore.geo-solutions.it/geostore/rest/"
 *              overrides the geostore base url: all the requests to geostore will use this base
 *          "socialUrl":"http://mapstore.geo-solutions.it/mapcomposer/",
 *              url to the public mapcomposer. used to create social links
 *          "composerUrl":"/",
 *              the local composer url to test.
 *              
 *  {string} 
 *  ASSETS :The icons to use for the user Manager, if they use a different path.
 *  example : {
 *      "delete_icon": "./externals/mapmanager/theme/img/user_delete.png",
 *      "edit_icon": "./externals/mapmanager/theme/img/user_edit.png"
 * }
 * 
 * {array} array of arrays containing parameter to pass to the url and related string to show in the switcher
 * locales
 * 
 */

/*var config = {

	baseUrl: '',
	proxy: '/http_proxy/proxy/?url=',

	//googleApi: 'AIzaSyBFz0tyDgG_SmT8Qmw1UFmOJuHgW4Z8nEw',
	//update key here: https://code.google.com/apis/console/#project:385384104319:access
    
    start: 0,

    limit: 20,
    
    msmTimeout: 30000,
    
    twitter: {
        via: 'geosolutions_it',
        hashtags: ''
    },
	
	locales: [['en', 'English'],['it','Italiano'],['fr','Français'],['de','Deutsch']],
	
	embedLink: {
		embeddedTemplateName: "viewer",
		showDirectURL: true
	}
	
};*/

var config = {
	
	geoStoreBase: "http://localhost:8080/geostore/rest/",
   
    proxy: "/http_proxy/proxy/?url=",
   
    defaultLanguage: "en",
   
    composerUrl: "/mapcomposer",
   
    socialUrl: "",
   
    start: 0,
   
    limit: 20,
   
    msmTimeout: 30000,
   
    twitter:{
      "via":"geosolutions_it",
      "hashtags":""
    },
   
    ASSET:{
        "delete_icon": "theme/img/user_delete.png",
        "edit_icon": "theme/img/user_edit.png"
    },
   
    locales:[
      [
         "en",
         "English"
      ],
      [
         "it",
         "Italiano"
      ],
      [
         "fr",
         "Français"
      ],
      [
         "de",
         "Deutsch"
      ],
      [
         "es",
         "Español"
      ]
    ],
   
    embedLink: {
		"embeddedTemplateName": "/mapcomposer/viewer",
		"showDirectURL": true
	}
};


