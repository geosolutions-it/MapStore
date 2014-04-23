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
                        this.enabelDisableLabel(true,this.strWithLabels);
                        this.updateTooltip(this.actions[0],this.actionTipDisable);
                    } else {
                        this.enabelDisableLabel(false,"");
                        this.updateTooltip(this.actions[0],this.actionTipEnable);
                    }
             }
        }]);
        
        return actions;
    },
    enabelDisableLabel: function(check,labels){
    
        var map = this.target.mapPanel.map;
        var mapPanel = this.target.mapPanel;
        var layer;
        var style;
        
        for (var i=0, len=map.layers.length; i<len; ++i) {
            if(map.layers[i].params && map.layers[i].params.STYLES){
                layer = map.layers[i];
                style = layer.params.STYLES;
                layer.mergeNewParams({
                    STYLES: check ? style + labels : style.replace(this.strWithLabels,labels)
                });  
            }
        }    
    
    },
    updateTooltip: function(action,text){
        action.items[0].setTooltip(text);
    }    
});

Ext.preg(gxp.plugins.EnableLabel.prototype.ptype, gxp.plugins.EnableLabel);
