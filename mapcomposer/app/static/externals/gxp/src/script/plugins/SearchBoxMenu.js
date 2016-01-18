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
 * @requires plugins/WFSSearchBox.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchBoxMenu
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchBoxMenu(config)
 *
 */   
gxp.plugins.SearchBoxMenu = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_searchboxmenu */
    ptype: "gxp_searchboxmenu",
    /** api: config[menuTooltip]
     *  ``String``
     */  
    menuTooltip: "SearchMenu",

    /** api: config[resetMarkerTooltip]
     *  ``String``
     */  
    resetMarkerTooltip:"Reseta Ricerche",


     /** api: config[resetMarkerTooltip]
     *  ``String``
     */  
    resetMarkerText:" Resetta ricerche",

    /** api: method[init]
     *
     * Initialize essential components
     */
    init: function(target) {        
        // //////////////////////////////////////
        // Initializing the SearchBoxMenu
        // //////////////////////////////////////
        
        this.WFSSearchBoxes = {};
        var tmp = gxp.plugins.SearchBoxMenu.superclass.init.apply(this, arguments);
        me=this;
        Ext.each(this.initialConfig.items,function(item,n){
            var ctId="ct_"+n;
            item.outputTarget="searchboxmenu";
            item.itemsContainer=true;
            item.separator=false;
            item.hideOnClick=false;
            item.noButton=true;
            var p= new gxp.plugins.WFSSearchBox(item);
                p.init(target);
                me.WFSSearchBoxes[ctId]=p;
        });

        this.resetMarkerBtn = new Ext.Button({
                tooltip: this.resetMarkerTooltip,
                width:150,
                text:this.resetMarkerText,
                handler: function() {
                    this.resetCombo();
                },
                scope: this,
                iconCls: "icon-removewfsmarkers"
            });

        return tmp
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
                
        this.menu = new Ext.menu.Menu({
            id: 'searchboxmenu',
            style: {
                overflow: 'visible'     // For the Combo popup
            },
            listeners:{
                'afterrender':function(){
                    this.menu.insert(10,this.resetMarkerBtn); 
                },
                'beforehide': function(){
                    return this.canClose();
                },
                scope:this,

            },
            
            items: []
        });
        
        this.button = new Ext.Button({
            iconCls: "gxp-icon-find",
            tooltip: this.menuTooltip,
            toggleGroup: this.toggleGroup,
            menu: this.menu
        });

        var m = gxp.plugins.SearchBoxMenu.superclass.addOutput.call(this, [this.button]);

        for(sBox in this.WFSSearchBoxes){
            this.WFSSearchBoxes[sBox].addOutput();  
        }

        return m;
    },
    
    resetCombo:function(){

        for(sBox in this.WFSSearchBoxes){
            var wfsSearch = this.WFSSearchBoxes[sBox];
            var markerLyr = this.target.mapPanel.map.getLayersByName(wfsSearch.markerName);  
            if (markerLyr.length){
                this.target.mapPanel.map.removeLayer(markerLyr[0]);
            }
             wfsSearch.combo.reset();
        }
    },
    canClose: function(){
        for(var sBox in this.WFSSearchBoxes){
             var wfsSearch = this.WFSSearchBoxes[sBox];
             if(wfsSearch.combo && wfsSearch.combo.isExpanded() ){
                return false;
             }
        }
        return true;
    }

});

Ext.preg(gxp.plugins.SearchBoxMenu.prototype.ptype, gxp.plugins.SearchBoxMenu);
