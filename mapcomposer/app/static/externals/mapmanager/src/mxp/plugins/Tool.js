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
 *  module = mxp.plugins
 *  class = Tool
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: Tool(config)
 *
 *    Base class for plugins that add tool functionality to
 *    :class:`mxp.widgets.SNManagerViewport`. These plugins are used by adding configuration 
 *    objects for them to the ``tools`` array of the viewer's config object,
 *    using their ``ptype``. Based on `gxp.plugins.Tool`.
 */   
mxp.plugins.Tool = Ext.extend(Ext.util.Observable, {
    
    /** api: ptype = mxp_tool */
    ptype: "mxp_tool",
    
    /** api: config[autoActivate]
     *  ``Boolean`` Set to false if the tool should be initialized without
     *  activating it. Default is true.
     */
    autoActivate: true,
    
    /** api: property[active]
     *  ``Boolean`` Is the tool currently active?
     */

    /** api: config[actions]
     *  ``Array`` Custom actions for tools that do not provide their own. Array
     *  elements are expected to be valid Ext config objects. Actions provided
     *  here may have an additional ``menuText`` property, which will be used
     *  as text when the action is used in a menu. The ``text`` property will
     *  only be used in buttons. Optional, only needed to create custom
     *  actions.
     */
    
    /** api: config[setActiveOnOutput]
     *  ``Boolean`` This flag indicates that the output is activate on the tabpanel 
     *   when you add the output if the output config container is a tabpanel
     */
    
    /** api: config[outputAction]
     *  ``Number`` The ``actions`` array index of the action that should
     *  trigger this tool's output. Only valid if ``actions`` is configured.
     *  Leave this unconfigured if none of the ``actions`` should trigger this
     *  tool's output.
     */
    
    /** api: config[actionTarget]
     *  ``Object`` or ``String`` or ``Array`` Where to place the tool's actions 
     *  (e.g. buttons or menus)? 
     *
     *  In case of a string, this can be any string that references an 
     *  ``Ext.Container`` property on the portal, or a unique id configured on a 
     *  component.
     *
     *  In case of an object, the object has a "target" and an "index" property, 
     *  so that the tool can be inserted at a specified index in the target. 
     *               
     *  actionTarget can also be an array of strings or objects, if the action is 
     *  to be put in more than one place (e.g. a button and a context menu item).
     *
     *  To reference one of the toolbars of an ``Ext.Panel``, ".tbar", ".bbar" or 
     *  ".fbar" has to be appended. The default is "map.tbar". The viewer's main 
     *  MapPanel can always be accessed with "map" as actionTarget. Set to null if 
     *  no actions should be created.
     *
     *  Some tools provide a context menu. To reference this context menu as
     *  actionTarget for other tools, configure an id in the tool's
     *  outputConfig, and use the id with ".contextMenu" appended. In the
     *  snippet below, a layer tree is created, with a "Remove layer" action
     *  as button on the tree's top toolbar, and as menu item in its context
     *  menu:
     *
     *  .. code-block:: javascript
     *
     *     {
     *         xtype: "gxp_layertree",
     *         outputConfig: {
     *             id: "tree",
     *             tbar: []
     *         }
     *     }, {
     *         xtype: "gxp_removelayer",
     *         actionTarget: ["tree.tbar", "tree.contextMenu"]
     *     }
     *
     *  If a tool has both actions and output, and you want to force it to
     *  immediately output to a container, set actionTarget to null. If you
     *  want to hide the actions, set actionTarget to false. In this case, you
     *  should configure a defaultAction to make sure that an action is active.
     */
    actionTarget: "north.tbar",
        
    /** api: config[toggleGroup]
     *  ``String`` If this tool should be radio-button style toggled with other
     *  tools, this string is to identify the toggle group.
     */
    
    /** api: config[defaultAction]
     *  ``Number`` Optional index of an action that should be active by
     *  default. Only works for actions that are a ``GeoExt.Action`` instance.
     */
    
    /** api: config[outputTarget]
     *  ``String`` Where to add the tool's output container? This can be any
     *  string that references an ``Ext.Container`` property on the portal, or
     *  "map" to access the viewer's main map. If not provided, a window will
     *  be created.
     */
    outputTarget: "mainTabPanel",
     
    /** api: config[outputConfig]
     *  ``Object`` Optional configuration for the output container. This may
     *  be useful to override the xtype (e.g. "window" instead of "gx_popup"),
     *  or to provide layout configurations when rendering to an
     *  ``outputTarget``.
     */

    /** api: config[controlOptions]
     *  ``Object`` If this tool is associated with an ``OpenLayers.Control``
     *  then this is an optional object to pass to the constructor of the
     *  associated ``OpenLayers.Control``.
     */
    
    /** private: property[target]
     *  ``Object``
     *  The :class:`mxp.widgets.SNManagerViewport` that this plugin is plugged into.
     */
     
    /** private: property[actions]
     *  ``Array`` The actions this tool has added to viewer components.
     */
    
    /** private: property[output]
     *  ``Array`` output added by this container
     */
    output: null,


    /** api: config[notDuplicateOutputs]
     *  ``Boolean`` Flag to indicate that this tool couldn't duplicate in the tab panel.
     */
     notDuplicateOutputs: true,
     
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config || {};
        this.active = false;
        Ext.apply(this, config);
        if (!this.id) {
            this.id = Ext.id();
        }
        this.output = [];
        
        this.addEvents(
            /** api: event[activate]
             *  Fired when the tool is activated.
             *
             *  Listener arguments:
             *  * tool - :class:`mxp.plugins.Tool` the activated tool
             */
            "activate",

            /** api: event[deactivate]
             *  Fired when the tool is deactivated.
             *
             *  Listener arguments:
             *  * tool - :class:`mxp.plugins.Tool` the deactivated tool
             */
            "deactivate",

            /** api: event[actionsadded]
             *  Fired when the addActions method is completed.
             *
             *  Listener arguments:
             *  * tool - :class:`mxp.plugins.Tool` the tool
             */
            "actionsadded",

            /** api: event[outputadded]
             *  Fired when an output is added
             *
             *  Listener arguments:
             *  * output - the output added
             */
            "outputadded"
        );
        
        mxp.plugins.Tool.superclass.constructor.apply(this, arguments);
    },
    
    /** private: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        target.tools[this.id] = this;
        this.target = target;
        this.autoActivate && this.activate();
        this.target.on("portalready", this.addActions, this);
    },
    
    /** api: method[activate]
     *  :returns: ``Boolean`` true when this tool was activated
     *
     *  Activates this tool.
     */
    activate: function() {
        if (this.active === false) {
            this.active = true;
            this.fireEvent("activate", this);
            return true;
        }
    },
    
    /** api: method[deactivate]
     *  :returns: ``Boolean`` true when this tool was deactivated
     *
     *  Deactivates this tool.
     */
    deactivate: function() {
        if (this.active === true) {
            this.active = false;
            this.fireEvent("deactivate", this);
            return true;
        }
    },
    
    /** api: method[addActions]
     *  :arg actions: ``Array`` Optional actions to add. If not provided,
     *      this.actions will be added.
     *  :returns: ``Array`` The actions added.
     */
    addActions: function(actions) {
        actions = actions || this.actions;
        // auto open
	if(this.autoOpen) {
		this.addOutput();
	}	
        if (!actions || this.actionTarget === null) {
            // add output immediately if we have no actions to trigger it
            this.addOutput();
            return;
        }
        
        var actionTargets = this.actionTarget instanceof Array ?
            this.actionTarget : [this.actionTarget];
        var a = actions instanceof Array ? actions : [actions];
        var action, actionTarget, i, j, jj, parts, ref, item, ct, meth, index = null;
        for (i=actionTargets.length-1; i>=0; --i) {
            actionTarget = actionTargets[i];
            if (actionTarget) {
                if (actionTarget instanceof Object) {
                    index = actionTarget.index;
                    actionTarget = actionTarget.target;
                }
                parts = actionTarget.split(".");
                ref = parts[0];
                item = parts.length > 1 && parts[1];
                ct = Ext.getCmp(this.target.id + "_" + ref) || this.target.portal[ref];
                if (item) {
                    meth = {
                        "tbar": "getTopToolbar",
                        "bbar": "getBottomToolbar",
                        "fbar": "getFooterToolbar"
                    }[item];
                    if (meth) {
                        ct = ct[meth]();
                    } else {
                        ct = ct[item];
                    }
                }
            }
            for (j=0, jj=a.length; j<jj; ++j) {
                if (!(a[j] instanceof Ext.Action || a[j] instanceof Ext.Component)) {
                    if (typeof a[j] != "string") {
                        if (j == this.defaultAction) {
                            a[j].pressed = true;
                        }
                        a[j] = new Ext.Action(a[j]);
                    }
                }
                action = a[j];
                if (j == this.defaultAction && action instanceof GeoExt.Action) {
                    action.isDisabled() ?
                        action.activateOnEnable = true :
                        action.control.activate();
                }
                if (ct) {
                    if (ct instanceof Ext.menu.Menu) {
                        action = Ext.apply(new Ext.menu.Item(action),
                            {text: action.initialConfig.menuText}
                        );
                    } else if (!(ct instanceof Ext.Toolbar)) {
                        // only Ext.menu.Menu and Ext.Toolbar containers
                        // support the Action interface. So if our container is
                        // something else, we create a button with the action.
                        action = new Ext.Button(action);
                    }
                    var addedAction = (index === null) ? ct.add(action) : ct.insert(index, action);
                    action = action instanceof Ext.Button ? action : addedAction;
                    if (index !== null) {
                        index += 1;
                    }
                    if (this.outputAction != null && j == this.outputAction) {
                        var cmp;
                        action.on("click", function() {
                            if (cmp) {
                                this.outputTarget ?
                                    cmp.show() : cmp.ownerCt.ownerCt.show();
                            } else {
                                cmp = this.addOutput();
                            }
                        }, this);
                    }
                }
            }
            // call ct.show() in case the container was previously hidden (e.g.
            // the mapPanel's bbar or tbar which are initially hidden)
            if (ct) {
                ct.isVisible() ?
                    ct.doLayout() : ct instanceof Ext.menu.Menu || ct.show();
            }
        }
        this.actions = a;
        this.fireEvent("actionsadded", this);
        return this.actions;
    },
    
    /** api: method[addOutput]
     *  :arg config: ``Object`` configuration for the ``Ext.Component`` to be
     *      added to the ``outputTarget``. Properties of this configuration
     *      will be overridden by the applications ``outputConfig`` for the
     *      tool instance.
     *  :return: ``Ext.Component`` The component added to the ``outputTarget``. 
     *
     *  Adds output to the tool's ``outputTarget``. This method is meant to be
     *  called and/or overridden by subclasses.
     */
    addOutput: function(config) {

        if (!config && !this.outputConfig) {
            // nothing to do here for tools that don't have any output
            return;
        }

        if(this.notDuplicateOutputs
            && this.output.length > 0
            && this.outputTarget){
            for(var i = 0; i < this.output.length; i++){
                if(this.output[i].ownerCt
                    && this.output[i].ownerCt.xtype 
                    && this.output[i].ownerCt.xtype == "tabpanel"
                    && !this.output[i].isDestroyed){
                    var outputConfig = config || this.outputConfig;
                    // Not duplicate tabs
                    for(var index = 0; index < this.output[i].ownerCt.items.items.length; index++){
                        var item = this.output[i].ownerCt.items.items[index];
                        var isCurrentItem = true;
                        for (var key in outputConfig){
                            if(outputConfig[key]){
                                isCurrentItem = isCurrentItem && (outputConfig[key] == item.initialConfig[key]);
                            }
                        }
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    }
                }
            }
        }

        config = config || {};
        var ref = this.outputTarget;
        var container;
        if (ref) {
            container = Ext.getCmp(ref) || this.target.portal[ref];
            Ext.apply(config, this.outputConfig);
            if(container && container.xtype === 'tabpanel') {
                Ext.applyIf(config, {hideMode: 'offsets'});
            }
        } else {
            var outputConfig = this.outputConfig || {};
            container = new Ext.Window(Ext.apply({
                hideBorders: true,
                shadow: false,
                closeAction: "hide",
                autoHeight: !outputConfig.height,
                layout: outputConfig.height ? "fit" : undefined,
                defaults: {
                    autoHeight: !outputConfig.height
                },
                items: [outputConfig]
            })).show().items.get(0);
        }
        var component = container.add(config);            
        if (component instanceof Ext.Window) {
            component.show();
        } else {
            try{
                if(container.xtype && container.xtype == "tabpanel"){
                    var index = container.items.length - 1;
                    if(this.setActiveOnOutput){
                        container.setActiveTab(index);
                    }
                    // save ownerCt and index in the output
                    component.ownerCt = container;
                    component.tabIndex = index;
                }
                container.doLayout();
            }catch (e){
                // FIXME: for tab do layout it fails
            }
        }
        this.output.push(component);
        this.fireEvent("outputadded", component);
        return component;
    },
    
    /** api: method[removeOutput]
     *  Removes all output created by this tool
     */
    removeOutput: function() {
        var cmp;
        for (var i=this.output.length-1; i>=0; --i) {
            cmp = this.output[i];
            if (!this.outputTarget) {
                cmp.findParentBy(function(p) {
                    return p instanceof Ext.Window;
                }).close();
            } else {
                if (cmp.ownerCt) {
                    cmp.ownerCt.remove(cmp);
                    if (cmp.ownerCt instanceof Ext.Window) {
                        cmp.ownerCt[cmp.ownerCt.closeAction]();
                    }
                } else {
                    cmp.remove();
                }
            }
        }
        this.output = [];
    },
    
    /** api: method[removeActions]
     *  Removes all actions created by this tool
     */
    removeActions: function() {
        if(this.actions){
            var cmp;
            var parent;
            for (var i=this.actions.length-1; i>=0; --i) {
                cmp = this.actions[i];
                if (!this.actionTarget) {
                    cmp.findParentBy(function(p) {
                        return p instanceof Ext.Window;
                    }).close();
                } else {
                    if (cmp.ownerCt) {
                        parent = cmp.ownerCt;
                        cmp.ownerCt.remove(cmp);
                    }else if (parent){
                        parent.remove(cmp);
                    }else if(cmp.remove){
                        cmp.remove();
                    }
                }
            }
            this.actions = [];
        }
    },
    
    /** api: method[remove]
     *  Removes all actions and outputs created by this tool
     */
    remove: function() {
        this.removeOutput();
        this.removeActions();
        this.target.removeListener("portalready", this.addActions, this);
    }
    
});

Ext.preg(mxp.plugins.Tool.prototype.ptype, mxp.plugins.Tool);
