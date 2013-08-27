
/*
 * WMSGetFeatureInfoMenu.js Copyright (C) 2013 This file is part of MapStore project.
 * Published under the GPLv3. 
 * See https://raw.github.com/geosolutions-it/mapstore/master/license.txt for the full text license.
 * 
 * Authors: Alejandro Diaz Torres (mailto:aledt84@gmail.com)
 */

/**
 * @required  plugins/WMSGetFeatureInfoMenu.js
 */

/** api: (define)
 *  module = MapStore.plugins
 *  class = WMSGetFeatureInfoMenu
 */
Ext.namespace("MapStore.plugins");

/**
 * Class: MapStore.plugins.WMSGetFeatureInfoMenu
 * 
 * WMSGetFeatureInfoMenu custom tool for MapStore
 * 
 */
MapStore.plugins.WMSGetFeatureInfoMenu = Ext.extend(gxp.plugins.WMSGetFeatureInfoMenu, {

    /** api: ptype = ms_wmsgetfeatureinfo_menu */
    ptype: "ms_wmsgetfeatureinfo_menu",
     
    /** api: method[addActions]
     */
    addActions: function() {
        
        var actions = MapStore.plugins.WMSGetFeatureInfoMenu.superclass.addActions.call(this);

        // add click callback for each item
        this.button.on({
            click: this.closePopups,
            scope:this
        });
        Ext.each(this.button.menu.items.keys, function(key){
            var item = this.button.menu.items.get(key);
            item.on({
                click: this.closePopups,
                scope:this
            });
        }, this);

        return actions;
    },
    
    /** private: method[closePopups]
     *  Clear all popups openned. Fixes issue #178.
     */
    closePopups: function(){
        if(this.closePrevious){
            for(var key in this.popupCache) {
                if(this.popupCache.hasOwnProperty(key)) {
                    this.popupCache[key].close();
                    delete this.popupCache[key];
                }
            }
        }
    }

});

Ext.preg(MapStore.plugins.WMSGetFeatureInfoMenu.prototype.ptype, MapStore.plugins.WMSGetFeatureInfoMenu);