/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 *  module = sn.plugins
 *  class = LanguageSelector
 */
Ext.ns("sn.plugins");

/** api: constructor
 *  .. class:: LanguageSelector(config)
 *
 *    Simple languague selector for SN Manager
 */
sn.plugins.LanguageSelector = Ext.extend(sn.plugins.Tool, {
    
    /** api: ptype = sn_languageselector */
    ptype: "sn_languageselector",

    /** api: method[addActions]
     */
    addActions: function() {

        code = this.target.config.code;

        return sn.plugins.LanguageSelector.superclass.addActions.apply(this, [new Ext.form.ComboBox({
            store: new Ext.data.ArrayStore({
                fields: ['code', 'name'],
                data :  this.target.config.langData
            }),
            emptyText: this.target.config.initialLanguageString,
            displayField: 'name',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
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
        })]);
    }
});

Ext.preg(sn.plugins.LanguageSelector.prototype.ptype, sn.plugins.LanguageSelector);