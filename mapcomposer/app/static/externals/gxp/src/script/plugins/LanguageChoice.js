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
 *  class = LanguageChoice
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: LanguageChoice(config)
 *
 */
gxp.plugins.LanguageChoice = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_languagechoice */
    ptype: "gxp_languagechoice",

    /** api: config[initialText]
     *  ``String``
     *  Initial language for combo box).
     */
    initialLanguage: 'en',

	languages: [
		['en','English','','en','English language'],
		['fr','Français','','fr','Franch language'],
		['it','Italiano','','it','Italian language'], 
		['de','Deutsch','','de','Deutsch language'] 
	],
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.LanguageChoice.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addOutput]
     */
    addOutput: function() {
	    var locCode = GeoExt.Lang.locale;
        var code = locCode || this.initialLanguage;
		
		var languageSwitcher = new gxp.form.LanguageSwitcher({
			currentContext: code,
			data: this.languages
		});
        
        var actions = ["->", languageSwitcher];
        return gxp.plugins.LanguageChoice.superclass.addOutput.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.LanguageChoice.prototype.ptype, gxp.plugins.LanguageChoice);
