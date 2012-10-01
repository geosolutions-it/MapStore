/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
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
		['it','Italiano','','it','Italian language'] 
	]
	
	
	
	
});

Ext.reg(gxp.form.LanguageSwitcher.prototype.xtype, gxp.form.LanguageSwitcher);
