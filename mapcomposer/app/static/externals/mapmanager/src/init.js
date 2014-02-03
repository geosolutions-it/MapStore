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
 * Property: config
 * {object} object for configuring the component. See <config.js>
 *
 */
// config : null,
/**
 * Function: init.js
 * Initializes the component MSMPanel
 * 
 */

Ext.onReady(function(){

    
    Ext.QuickTips.init();
    
    var langData = config.locales;

    var query = location.search;        
    if(query && query.substr(0,1) === "?"){
        query = query.substring(1);
    }
    
    var url = Ext.urlDecode(query);     
    var code = url.locale;   

    if(!code){
        code = config.locales[0][0];
    }
    
    var initialLanguageString;
            
    //check if code is valid
    if(code){
        Ext.each(langData, function(rec){
            if(rec[0] === code.toLowerCase()){
                initialLanguageString = rec[1];
                return;
            }
        });
    }            
    
    if (GeoExt.Lang) {
            GeoExt.Lang.set(code);
    }
    
	var languageSelector = new Ext.form.ComboBox({
		store: new Ext.data.ArrayStore({
			fields: ['code', 'name'],
			data :  langData
		}),
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
			beforeselect: function(cb, record, index){
			   if(code == record.get('code')){
					return false;
			   }
			},                    
			select: function(cb, record, index) {         
			   var code = record.get('code');
			
			   var query = location.search;        
			   if(query && query.substr(0,1) === "?"){
			    	query = query.substring(1);
			   }  
			   
			   var url = Ext.urlDecode(query);

			   if(code){
				   location.replace(
					   location.pathname + '?locale=' + code);                                   
			   }
			}
		}
	});

    var msmPanel = new MSMPanel ({
        xtype: 'panel',
        id: 'mapManagerPanel',
        config: config,
		renderTo: "topic-grid",
        lang: code,
        langSelector: languageSelector,
        width: 900,
        height: 500
    });
    
});
