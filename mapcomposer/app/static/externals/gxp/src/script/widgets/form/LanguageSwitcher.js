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

/** api: (define)
 *  module = gxp.form
 *  class = LanguageSwitcher
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: LanguageSwitcher(config)
 *
 *  Creates a combo box that issues switch mapstore locale parameter
 *  It can switch trow various urls, templates, and change one GET parameter.
 *  eg. /mapcomposer/?locale=it
 *      /mapcomposer/?locale=en
 *		/mapcomposer/viewer?locale=fr
 *      ....
 *
 */   
gxp.form.LanguageSwitcher = Ext.extend(gxp.form.ContextSwitcher, {
    
    /** api: xtype = gxp_languageswitcher */
    xtype: "gxp_languageswitcher",

	fields: ['id','name','base','newpar','description'],
	
	/** api: config[emptyText]
     *  ``String`` empty text for i18n 
     */
	emptyText: "Select Language",
	switchActionTip : "Switch Language",
	switchConfirmationText : "You are sure to change Language? All unsaved data will be lost",
	/** api: config[width]
     *  ``int`` width of the text box. default is 200
     */
	width: 130,
	paramName:'locale',
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
	]
	
	
	
	
});

Ext.reg(gxp.form.LanguageSwitcher.prototype.xtype, gxp.form.LanguageSwitcher);
