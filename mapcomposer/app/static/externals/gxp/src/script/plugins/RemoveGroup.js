/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = RemoveGroup
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: RemoveGroup(config)
 *
 *    Plugin for removing a new group on layer tree.
 */
gxp.plugins.RemoveGroup = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_removegroup */
    ptype: "gxp_removegroup",
    
    /** api: config[removeGroupMenuText]
     *  ``String``
     *  Text for remove menu item (i18n).
     */
    removeGroupMenuText: "Remove Group",

    /** api: config[removeGroupActionTip]
     *  ``String``
     *  Text for remove action tooltip (i18n).
     */
    removeGroupActionTip: "Remove a group from the layer tree",
    
    /** api: config[removeGroupActionTip]
     *  ``String``
     *  Text for remove action tooltip (i18n).
     */
    removeGroupActionTip: "Removes the selected group and own layers from the map",
    
    /** api: config[removeGroupConfirmationText]
     *  ``String``
     *  Text that is diplayed inside inside delete confirmation window (i18n).
     */
    removeGroupConfirmationText: "Are you sure you want to remove the selected group ? The all layers inside this group will be removed from the map.",
    
    /** api: method[addActions]
     */
    addActions: function() {
        var selectedGroup;
        var removeGroupAction;
        
        var apptarget = this.target;
        
        var actions = gxp.plugins.RemoveGroup.superclass.addActions.apply(this, [{
            menuText: this.removeGroupMenuText,
            iconCls: "gxp-icon-removegroup",
            disabled: true,
            tooltip: this.removeGroupActionTip,
            handler: function() {
            
                var removeGroup = function(buttonId, text,opt){
                    if(buttonId === 'ok'){
                        var groupRecord = selectedGroup;
                        if(groupRecord) {
                            var layers = this.target.mapPanel.layers;

                            layers.data.each(function(record, index, totalItems ) {
                                if(record.get('group') == groupRecord.attributes.group){
                                    layers.remove(record);
                                }
                            }); 
                            
                            groupRecord.destroy();                            
                        }
                        removeGroupAction.setDisabled(true);
                        
                        for(var tool in this.target.tools){
                            if(this.target.tools[tool].ptype == "gxp_groupproperties"){            
                                this.target.tools[tool].actions[0].disable();
                            }
                        }
                        
                        apptarget.modified = true;
                        //modified = true;                        
                    }
                };
                
                Ext.Msg.show({
                   title: this.removeGroupActionTip,
                   msg: this.removeGroupConfirmationText,
                   buttons: Ext.Msg.OKCANCEL,
                   fn: removeGroup,
                   icon: Ext.MessageBox.QUESTION,
                   scope: this
                });
            },
            scope: this
        }]);
        
        removeGroupAction = actions[0];
        
        this.target.on("groupselectionChange", function(node) {
            if(node)
                selectedGroup = (node.attributes.group != undefined && node.attributes.group != "background") ? node : null;
            else
                selectedGroup = null;
            
            removeGroupAction.setDisabled( 
                 !selectedGroup 
            );
        }, this);
        
        return actions;
    }
        
});

Ext.preg(gxp.plugins.RemoveGroup.prototype.ptype, gxp.plugins.RemoveGroup);