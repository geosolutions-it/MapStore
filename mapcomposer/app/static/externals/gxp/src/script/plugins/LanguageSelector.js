/**
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
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = LanguageSelector
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LanguageSelector(config)
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.LanguageSelector = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_languageselector */
    ptype: "gxp_languageselector", 
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.LanguageSelector.superclass.constructor.apply(this, arguments);
    },

	/** api: config[data]
	 * eg. [["id","Default Viewer", "viewer","","descript"],
	 * ["id","Custom Viewer", "viewer","config","descript"] ,
	 * ["id","Custom Composer", "","config","descript"] ]
	 */
	data:[
		['en','English','','en','English language'],
		['fr','Français','','fr','Franch language'],
		['it','Italiano','','it','Italian language'], 
		['de','Deutsch','','de','Deutsch language'], 
		['es','Español','','es','Spanish language']  
	],
		
	
    /** api: method[addActions]
     */
    addActions: function() {
		// //////////////////////////////////////////////////////            
		// Setting the locale based on query string parameter
		// //////////////////////////////////////////////////////
		var query = location.search;        
		if(query && query.substr(0,1) === "?"){
			query = query.substring(1);
		}
		
		var url = Ext.urlDecode(query);        
		var code = url.locale || this.target.defaultLanguage || "en";			
		
		// ////////////////////////////////////////////////////
		// Setting the language selector
		// ////////////////////////////////////////////////////
		var languageSelector = new gxp.form.LanguageSwitcher({
			currentContext: code,
			saveMessage: this.target.auth,
			data : this.data
		});
        
        var actions = ['->', languageSelector];
        return gxp.plugins.LanguageSelector.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.LanguageSelector.prototype.ptype, gxp.plugins.LanguageSelector);
