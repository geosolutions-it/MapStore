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
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GroupProperties
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GroupProperties(config)
 *
 *    Plugin for Modify group properties on layer tree.
 
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.GroupProperties = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_groupproperties */
    ptype: "gxp_groupproperties",
    
    /** api: config[groupPropertiesMenuText]
     *  ``String``
     *  Text for add menu item (i18n).
     */
    groupPropertiesMenuText: "Group Properties",

    /** api: config[groupPropertiesActionTip]
     *  ``String``
     *  Text for add action tooltip (i18n).
     */
    groupPropertiesActionTip: "Group properties",
    
    groupPropertiesDialogTitle: "Group Properties - ",
    
    groupPropertiesFieldSetText: "Group Name",
    
    groupPropertiesFieldLabel: "New Group Name",
    
    groupPropertiesButtonText: "Done",
    
    groupPropertiesMsg: "Please enter a group name",

    /** 
     * api: method[addActions]
     */
    addActions: function() {
        var selectedGroup;
        var groupPropertiesAction;
        
        var actions = gxp.plugins.GroupProperties.superclass.addActions.apply(this, [{
            menuText: this.groupPropertiesMenuText,
            iconCls: "gxp-icon-groupproperties",
            disabled: true,
            hidden: true,
            tooltip: this.groupPropertiesActionTip,
            handler: function() {
                
                var enableBtnFunction = function(){
                    if(this.getValue() != "" || Ext.getCmp("group-field-set").visible())
                        Ext.getCmp("group-addbutton").enable();
                    else
                        Ext.getCmp("group-addbutton").disable();
                };
                var x="";
                if(this.win) {this.win.destroy();}
                this.win = new Ext.Window({
                    width: 315,
                    height: 200,
                    title: this.groupPropertiesDialogTitle + selectedGroup.text,
                    renderTo: this.target.mapPanelContainer.body,
                    constrainHeader:true,
                    items: [
                        new Ext.form.FormPanel({
                            width: 300,
                            height: 150,
                            items: [
                                {
                                  xtype: 'fieldset',
                                  id: 'group-field-set',
                                  title: this.groupPropertiesFieldSetText,
                                  items: [
                                      {
                                        xtype: 'textfield',
                                        width: 120,
                                        id: 'diag-text-field',
                                        fieldLabel: this.groupPropertiesFieldLabel,
                                        value: selectedGroup.text,
                                        listeners: {
                                            render: function(f){
                                                f.el.on('keydown', enableBtnFunction, f, {buffer: 350});
                                            }
                                        }
                                      }
                                  ]
                                }
                            ]
                        })
                    ],
                    bbar: new Ext.Toolbar({
                        items:[
                            '->',
                            {
                                text: this.groupPropertiesButtonText,
                                iconCls: "gxp-icon-groupproperties-button",
                                id: "group-addbutton",
                                scope: this,
                                disabled: false,
                                handler: function(){      
                                    this.win.hide();     
                                    
                                    var textField = Ext.getCmp("diag-text-field");
                                    
                                    if(textField.isDirty() && textField.isValid()){
                                        var group = textField.getValue();

                                        selectedGroup.setText(group);
                                        
                                        var childs = selectedGroup.childNodes;
                                        var size = childs.length;
                                        for(var i=0; i<size; i++){
                                            var store = selectedGroup.loader.store;
                                            var index = store.findBy(function(r) {
                                                return r.getLayer() === childs[i].layer;
                                            });
                                            var record = store.getAt(index);
                                            record.set("group", group);
                                            
                                            childs[i].parentNode.attributes.group = group;
                                        }
                                    }
                                    
                                    this.win.destroy();
                                }
                            }
                        ]
                    })
                });
                
                this.win.show();
            },
            scope: this
        }]);
        
        groupPropertiesAction = actions[0];
        
        this.target.on("groupselectionChange", function(node) {
            if(node)
                selectedGroup = (node.attributes.group != undefined && node.attributes.group != "background") ? node : null;
            else
                selectedGroup = null;
            
            groupPropertiesAction.setDisabled( 
                 !selectedGroup 
            );
        }, this);

        
        return actions;
    }
        
});

Ext.preg(gxp.plugins.GroupProperties.prototype.ptype, gxp.plugins.GroupProperties);