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
 * @requires widgets/tree/LayerNodeUI.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = AddGroup
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AddGroup(config)
 *
 *    Plugin for adding a new group on layer tree.
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.AddGroup = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_addgroup",
    
    /** api: config[addGroupMenuText]
     *  ``String``
     *  Text for add menu item (i18n).
     */
    addGroupMenuText: "Add Group",

    /** api: config[addGroupActionTip]
     *  ``String``
     *  Text for add action tooltip (i18n).
     */
    addGroupActionTip: "Add a new group in the layer tree",
    
    addGroupDialogTitle: "New Group",
    
    addGroupFieldSetText: "Group Name",
    
    addGroupFieldLabel: "New Group",
    
    addGroupButtonText: "Add Group",
    
    addGroupMsg: "Please enter a group name",

    /** 
     * api: method[addActions]
     */
    addActions: function() {
        var apptarget = this.target;
        
        var actions = gxp.plugins.AddGroup.superclass.addActions.apply(this, [{
            menuText: this.addGroupMenuText,
            iconCls: "gxp-icon-addgroup",
            disabled: false,
            tooltip: this.addGroupActionTip,
            handler: function() {
                
                var enableBtnFunction = function(){
                    if(this.getValue() != "")
                        Ext.getCmp("group-addbutton").enable();
                    else
                        Ext.getCmp("group-addbutton").disable();
                };
                
                if(this.win)
                    this.win.destroy();

                this.win = new Ext.Window({
                    width: 315,
                    height: 200,
                    title: this.addGroupDialogTitle,
                    constrainHeader: true,
                    renderTo: apptarget.mapPanel.body,
                    items: [
                        new Ext.form.FormPanel({
                            width: 300,
                            height: 150,
                            items: [
                                {
                                  xtype: 'fieldset',
                                  id: 'group-field-set',
                                  title: this.addGroupFieldSetText,
                                  items: [
                                      {
                                        xtype: 'textfield',
                                        width: 120,
                                        id: 'diag-text-field',
                                        fieldLabel: this.addGroupFieldLabel,
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
                                text: this.addGroupButtonText,
                                iconCls: "gxp-icon-addgroup-button",
                                id: "group-addbutton",
                                scope: this,
                                disabled: true,
                                handler: function(){      
                                    this.win.hide();                             
                                    var tree = Ext.getCmp("layertree");      
                                    var textField = Ext.getCmp("diag-text-field");
                                    var groupNames;
                                    var groupConfig;
                                    if(textField.isDirty() && textField.isValid()){
                                        var group = textField.getValue();
                                        
                                        var LayerNodeUI = Ext.extend(gxp.tree.LayerNodeUI,
                                            new GeoExt.tree.TreeNodeUIEventMixin());
                                    
                                        var locIndex= tree.localIndexs[GeoExt.Lang.locale];
                                        
                                         if(typeof group == "string"){
                                            groupNames=group.split(tree.localLabelSep);
                                            groupConfig= new Object();
                                        }else{
                                            groupNames=group.title.split(tree.localLabelSep);
                                            groupConfig= group;
                                        }
                                        if(groupNames.length > 0){
                                            groupConfig.title= groupNames[locIndex] ? groupNames[locIndex] : groupNames[0];
                                        }

                                        /*var groupConfig = typeof group == "string" ?
                                            {title: group} : group;*/
                                            
                                        var node = new GeoExt.tree.LayerContainer({
                                            text: groupConfig.title,
                                            iconCls: "gxp-folder",
                                            expanded: true,
                                            checked: false,
                                            group: group == "default" ? undefined : group,
                                            loader: new GeoExt.tree.LayerLoader({
                                                baseAttrs: groupConfig.exclusive ? {checkedGroup: group} : undefined,
                                                store: this.target.mapPanel.layers,
                                                filter: (function(group) {
                                                    return function(record) {
                                                        return (record.get("group") || "default") == group &&
                                                            record.getLayer().displayInLayerSwitcher == true;
                                                    };
                                                })(group)
                                            }),
                                            singleClickExpand: true,
                                            allowDrag: true,
                                            listeners: {
                                                append: function(tree, node) {
                                                    node.expand();
                                                }
                                            }
                                        });
                                        
                                        tree.root.insertBefore(node, tree.root.firstChild.nextSibling);
                                    }else{
                                        Ext.Msg.show({
                                             title: "New Group",
                                             msg: this.addGroupMsg,
                                             buttons: Ext.Msg.OK,
                                             icon: Ext.MessageBox.OK
                                        });
                                    }
                                    
                                    this.win.destroy();
                                    
                                    apptarget.modified = true;
                                }
                            }
                        ]
                    })
                });
                
                this.win.show();
            },
            scope: this
        }]);
        
        return actions;
    }
        
});

Ext.preg(gxp.plugins.AddGroup.prototype.ptype, gxp.plugins.AddGroup);
