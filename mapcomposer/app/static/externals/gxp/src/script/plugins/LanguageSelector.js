/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
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
 *    Provides an action for zooming to an extent.  If not configured with a 
 *    specific extent, the action will zoom to the map's visible extent.
 */
gxp.plugins.LanguageSelector = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_zoomtoextent */
    ptype: "gxp_languageselector",
    
    /** api: config[buttonText]
     *  ``String`` Text to show next to the zoom button
     */

    /** api: config[initialText]
     *  ``String``
     *  Initial text for combo box).
     */
    initialLanguage: 'en',
     
    /** api: config[menuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    menuText: "Select language",

    /** api: config[tooltip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    tooltip: "Select language",    
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.LanguageSelector.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var store = new Ext.data.ArrayStore({
            fields: ['code', 'name'],
            data :  this.data
        });

        
        var query = location.search;        
        if(query && query.substr(0,1) === "?"){
            query = query.substring(1);
        }
        
        var url = Ext.urlDecode(query);        
        var code = url.locale;   

        if(!code){
            code = this.initialLanguage;
        }
        
        var initialLanguageString;
                
        //check if code is valid
        if(code){
            Ext.each(this.data, function(rec){
                if(rec[0] === code.toLowerCase()){
                    initialLanguageString = rec[1];
                    return;
                }
            });
        } 
        
        if(!initialLanguageString){
            initialLanguageString = "English";
        }
        
        var languageSelector = new Ext.form.ComboBox({
            store: store,
            displayField: 'name',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: initialLanguageString,
            selectOnFocus:false,
            editable: false,
            width: 100,
            listeners: {
                select: function(cb, record, index) {
                    var code = record.get('code');
                    if(code){
                        location.replace('../?locale='+code);
                    }                    
                }
            }
        });
        
        var actions = [languageSelector];
        return gxp.plugins.LanguageSelector.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.LanguageSelector.prototype.ptype, gxp.plugins.LanguageSelector);
