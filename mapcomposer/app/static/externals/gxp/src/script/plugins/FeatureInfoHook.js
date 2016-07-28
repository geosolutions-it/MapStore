/**
 *  Copyright (C) 2007 - 2016 GeoSolutions S.A.S.
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
 * requires 
 * include 
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeatureInfoHook
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeatureInfoHook(config)
 *
 * 
 */   
gxp.plugins.FeatureInfoHook = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_wfsgrid */
    ptype: "gxp_featureinfohook",

    /** api: config[wfsURL]
     *  ``String``
     *  
     *  base URL of the WFS service
     */
    wfsURL: null,
    
    // start i18n
    infoHookWindowTitle: 'Detail',
    // end i18n
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.FeatureInfoHook.superclass.constructor.apply(this, arguments);  
    },

    /** api: method[getData]
     */    
    getData: function(wfsTable,jsonParams){

        var propnames = jsonParams.paramnames.split(',');
        
        var fields = [];
        var columns = [];
        
        for (var i = 0;i<=propnames.length-1;i++){
            fields.push({
                "name": propnames[i],
                "mapping": propnames[i]
            });
            columns.push({
                "header": propnames[i],
                "dataIndex": propnames[i],
                "sortable": true
            });
        }

        this.container = new Ext.Container({
            "id": "gridcontainer",
            "layout": "fit"
        });
                
        this.wfsGrid = new gxp.plugins.WFSGrid({
            "wfsURL": this.wfsURL,
            "featureType": wfsTable,
            "outputTarget": "gridcontainer",
            "fields": fields,
            "columns": columns,
            "paging": false,
            "sortAttribute": jsonParams.sortAttribute,
            "cql_filter": jsonParams.CQL_FILTER
        });
    
        this.wfsGrid.addOutput();
        
        if (this.win){
            this.win.close();
            this.showWin();            
        }else{
            this.showWin();
        }
    },
    showWin: function(){
        this.win = new Ext.Window({
            title: this.infoHookWindowTitle,
            id: 'infoHookWindowId',
            closable:true,
            width:600,
            height:350,
            modal: false,
            plain:true,
            layout: 'fit',
            items: [this.container]
        });
        this.win.show();
    }
});

Ext.preg(gxp.plugins.FeatureInfoHook.prototype.ptype, gxp.plugins.FeatureInfoHook);
