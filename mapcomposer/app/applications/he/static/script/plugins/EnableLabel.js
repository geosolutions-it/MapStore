/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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
 * -@requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = EnableLabel
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: EnableLabel(config)
 *
 *    Enable Style with labels for all layers in the map
 */   
gxp.plugins.EnableLabel = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_enablelabel */
    ptype: "gxp_enablelabel",

    /** api: config[actionTip]
     *  ``String``
     *  Text for enable label action tooltip (i18n).
     */
    actionTipEnable: "Enable Label",
    
    /** api: config[actionTip]
     *  ``String``
     *  Text for disable label action tooltip (i18n).
     */
    actionTipDisable: "Disable Label",    
    
    /** api: config[strWithLabels]
     *  ``String``
     *  default string to identify styles with labels.
     */
    strWithLabels: "_with_labels",    

    /** api: method[addActions]
     */
    addActions: function() {
        this.popupCache = {};
        
        var actions = gxp.plugins.EnableLabel.superclass.addActions.call(this, [{
            tooltip: this.actionTipEnable,
            iconCls: "gxp-icon-enablelabel",
            //toggleGroup: this.toggleGroup,
            enableToggle: true,
            allowDepress: true,
            scope: this,
            toggleHandler: function(button, pressed) {
                    if (pressed) {
                        this.enabelDisableLabel(true);
                        this.updateTooltip(this.actions[0],this.actionTipDisable);
                    } else {
                        this.enabelDisableLabel(false);
                        this.updateTooltip(this.actions[0],this.actionTipEnable);
                    }
             }
        }]);
        
        return actions;
    },
    enabelDisableLabel: function(check,labels){
    
        var layers = this.target.mapPanel.layers;

        layers.each(function(record) {
        
            var styles = record.get("styles");
            
            if(styles){
                for (var key in styles){
                    if(styles.hasOwnProperty(key)){
                        var layer = record.get("layer");                    
                        var obj = styles[key];
                        var sld = obj.name.search(this.strWithLabels);
                        if(sld != -1){
                            if(check){                            
                                layer.mergeNewParams({
                                    STYLES: obj.name
                                });                                
                            }else{       
                                layer.mergeNewParams({
                                    STYLES: layer.params.STYLES.replace(this.strWithLabels,"")
                                });
                            }
                        }
                    }    
                }
            
            }        
        },this)
        
    },
    updateTooltip: function(action,text){
        action.items[0].setTooltip(text);
    }    
});

Ext.preg(gxp.plugins.EnableLabel.prototype.ptype, gxp.plugins.EnableLabel);
