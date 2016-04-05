/**
 *  Copyright (C) 2007 - 2015 GeoSolutions S.A.S.
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
 * @author Andrea Cappugi (kappu72@gmail.com)
 */

/**
 * @requires widgets/form/MapsComboBox.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = MapSelector
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: MapSelector(config)
 *
 *    Plugin for select and load user's maps
 */
gxp.plugins.he.MapSelector = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_mapselector */
    ptype: "gxp_mapselector",

    /** api: config[mapActionText]
     *  ``String``
     */
    mapActionText: "Map Actions",

    /** api: config[saveDefaultContextActionTip]
     *  ``String``
     */
    mapActionTip: "Map actions",


    /** api: config[saveText]
     *  ``String``
     */
    saveText: "Save",

    /** api: config[createText]
     *  ``String``
     */
    createText: "Create",

    /** api: config[deleteText]
     *  ``String``
     */
    deleteText: "Delete",

    /** api: config[contextSaveSuccessString]
     *  ``String``
     */
    contextSaveSuccessString: "Map context saved succesfully",

    /** api: config[contextSaveFailString]
     *  ``String``
     */
    contextSaveFailString: "Map context not saved succesfully",

    /** api: config[contextCreateSuccessString]
     *  ``String``
     */
    contextCreateSuccessString: "Map created succesfully",

    /** api: config[contextCreateFailString]
     *  ``String``
     */
    contextCreateFailString: "Map not created succesfully",

    /** api: config[contextCreateSuccessString]
     *  ``String``
     */
    contextDeleteSuccessString: "Map deleted succesfully",

    /** api: config[contextDeleteSuccessString]
     *  ``String``
     */
    contextDeleteFailString: "Map not deleted succesfully",

    /** api: config[saveTitle]
     *  ``String``
     */
    saveTitle: "Save Map Context?",

    /** api: config[saveMsg]
     *  ``String``
     */
    saveMsg: "Would you like to save your changes?",

    /** api: config[createTitle]
     *  ``String``
     */
    createTitle: "Create New Map?",

    /** api: config[createMsg]
     *  ``String``
     */
    createMsg: "Would you like to save map context as new map?",

    /** api: config[deleteTitle]
     *  ``String``
     */
    deleteTitle: "Delete Map?",

    /** api: config[deleteMsg]
     *  ``String``
     */
    deleteMsg: "Would you like delete your map?",

    /** api: config[addResourceButtonText]
     *  ``String``
     */
    addResourceButtonText: "Add Map",

    /** api: config[auth]
     *  ``String``
     */
    auth: null,

    /**
    * Property: contextMsg
    * {string} string to add in loading message
    *
    */
    contextMsg: 'Loading...',

    /**
    * Property: mapMetadataTitle
    * {string}
    *
    */
    mapMetadataTitle: "Insert Map Metadata",

    /**
    * Property: mapMedatataSetTitle
    * {string}
    *
    */
    mapMedatataSetTitle: "Map Metadata",

    /**
    * Property: mapNameLabel
    * {string}
    *
    */
    mapNameLabel: "Name",

    /**
    * Property: mapDescriptionLabel
    * {string}
    *
    */
    mapDescriptionLabel: "Description",

    /**
     * Property: conflictErrMsg
     * {string}
     */
    conflictErrMsg: "A map with the same name already exists",

     /** api: method[addActions]
     */
    addActions: function() {
        this.target.on("ready", function() {
            this.roleAdmin=(this.target && this.target.userDetails && this.target.userDetails.user.role == "ADMIN");
            this.advancedUser=this.hasGroup(this.target.userDetails.user,'Advanced_Users');
            this.user = this.target.userDetails.user.name;
            this.defaultMap = this.getDefaultMap();
            this.addOutput();
        },this);

        return
    },

     /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function() {

        var user, password;
        if(this.target.authToken) {
            var parts = Base64.decode(this.target.authToken.substring(6)).split(':');
            user = parts[0];
            password = parts[1];
        }
        var mask =this.target.appMask;
        this.geoStore = new gxp.plugins.GeoStoreClient({
            url: this.target.geoStoreBaseURL,
            user: user || undefined,
            password: password || undefined,
            authToken: this.target.authToken || undefined,
            proxy: this.target.proxy
        });
        this.saveBtn = new Ext.menu.CheckItem({
            text: this.saveText,
            iconCls: "gxp-icon-savedefaultcontext",
            allowDepress:false,
            disabled:true,
            ref:"../saveBtn",
            handler: function() {
                    Ext.Msg.show({
                    title:this.saveTitle,
                    msg: this.saveMsg,
                    buttons: Ext.Msg.YESNO,
                    fn: function(btnId){
                        if(btnId==='yes'){
                            var configStr = Ext.util.JSON.encode(this.target.getState());
                            mask.show();
                            var restPath="/data/"+this.target.mapId;
                            this.geoStore.sendRequest(restPath, "PUT", configStr, 'application/json', this.updateSuccess, this.updateFail,this);
                        }
                    },
                    scope:this,
                    icon: Ext.MessageBox.QUESTION
                    });
            },
            scope: this
        });
        this.createBtn = new Ext.menu.CheckItem({
            text: this.createText,
            iconCls: "map_add",
            toggleGroup: this.toggleGroup,
            allowDepress:false,
            disabled:false,
            handler:function() {
                Ext.Msg.show({
                    title: this.createTitle,
                    msg: this.createMsg,
                    buttons: Ext.Msg.YESNO,
                    fn: function(btnId){
                        if(btnId==='yes'){
                            var configStr = Ext.util.JSON.encode(this.target.getState());
                            this.metadataDialog(configStr);
                        }
                    },
                    scope:this,
                    icon: Ext.MessageBox.QUESTION
                    });
                },
            scope: this
        });
        this.deleteBtn = new Ext.menu.CheckItem({
            text: this.deleteText,
            iconCls: "map_delete",
            allowDepress:false,
            disabled:true,
            handler: function(){
                Ext.Msg.show({
                    title: this.deleteTitle,
                    msg: this.deleteMsg,
                    buttons: Ext.Msg.YESNO,
                    fn: function(btnId){
                        if(btnId==='yes'){
                            this.geoStore.deleteEntity(new OpenLayers.GeoStore.Resource({id:this.target.mapId}), this.deleteSuccess, this.deleteFail, this);
                        }
                    },
                    scope:this,
                    icon: Ext.MessageBox.QUESTION
                    });

                 },
                scope: this
    });

        var menuBtn = new Ext.SplitButton({
            text: this.mapActionText,
            hidden: !(this.roleAdmin || this.advancedUser),
            tooltip: this.mapActionTip,
            allowDepress: true,
            scope: this,
            menu: new Ext.menu.Menu({
                items: [ this.createBtn,this.saveBtn,this.deleteBtn]
            })
        });
        var user = this.user;
        var config = {
            xtype:'buttongroup',
            items: [{
                xtype:"gxp_mapscombobox",
                geoStoreBase: this.target.geoStoreBaseURL,
                defaultSelection: this.target.mapId || null,
                fields: [
                    {name:'id', mapping:'id'},
                    {name:'name', mapping:'name'},
                    {name:'owner', mapping:'owner'},
                    {name:'group', mapping:function(data){ return data.owner != user ? 'Public':'Personal';}}
                ],
                sort: {
                    field: 'group',
                    direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
                },
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<tpl if="this.group != values.group">',
                    '<tpl exec="this.group = values.group; console.log(this,values)"></tpl>',
                    ' <h1><span style="color:gray">{group}</span></h1>',
                    '</tpl>',
                    '<div class="x-combo-list-item">{name}</div>',
                    '</tpl>'
                ),
                listeners: {
                    select: function(combo, record, index){
                        var nMapId=record.get('id');
                        if(this.target.mapId !== nMapId){
                              this.reloadMap(nMapId,this.target.mapId);
                        }
                    },
                    defaultLoaded: function(record){
                            if(record.get("id") === this.target.mapId){
                                (record.json.canEdit) ? this.saveBtn.enable():this.saveBtn.disable();
                                (record.json.canDelete) ? this.deleteBtn.enable():this.deleteBtn.disable();
                                (record.json.canCopy) ? this.createBtn.enable():this.createBtn.disable();
                            }

                    },
                scope:this
                }
            }, menuBtn]};

        //We have to insert the tool at passed index
        var idx = this.idx || null;
        var parts = this.outputTarget.split(".");
        var ref = parts[0];
        var item = parts.length > 1 && parts[1];
        var container = ref ? ref == "map" ?
                        this.target.mapPanel : (Ext.getCmp(ref) || this.target.portal[ref]) :
                            this.target.portal;
            if (item) {
                var meth = {
                        "tbar": "getTopToolbar",
                        "bbar": "getBottomToolbar",
                        "fbar": "getFooterToolbar"
                    }[item];
                    if (meth) {
                        container = container[meth]();
                    } else {
                        container = container[item];
                    }
                }
            Ext.apply(config, this.outputConfig);
            var component = (idx === null) ? container.add(config) : container.insert(idx, config);
            container.doLayout();
            this.output.push(component);
            return component;

    },
     /** private: method[hasGroup]
     *  ``Function`` Check if users has passed group
     *
     */
    hasGroup: function(user, targetGroups){
                if(user && user.groups && targetGroups){
                    var groupfound = false;
                    for (var key in user.groups.group) {
                        if (user.groups.group.hasOwnProperty(key)) {
                            var g = user.groups.group[key];
                            if(g.groupName && targetGroups.indexOf(g.groupName) > -1 ){
                                groupfound = true;
                            }
                        }
                    }
                    return groupfound;
                }

                return false;
            },
    /** private: method[reloadMap]
     *  ``Function`` Load map
     *     :arg mapId: ``Int``
     *     :arg oldId: ``Int``
     */
    reloadMap: function(mapId,oldId){
            this.target.appMask.show();

            if(window.location.search.search('mapId='+oldId)!=-1){
                    var url = window.location.href.replace('mapId='+oldId,(mapId)?'mapId='+mapId:'');
                    url = (url.indexOf('?') === url.length -1 ) ? url.substr(0,url.length -1) :url;
                    window.location.replace(url);
            }else{
                            var newUrl = window.location.href;
                            newUrl += (window.location.search.length>0)? "&mapId="+ mapId : "?mapId="+mapId;
                            window.location.replace(newUrl);
                        }
    },
    updateSuccess: function (response){
              this.target.appMask.hide();
              this.target.modified = false;
              this.target.mapId = parseInt(response.responseText);
              Ext.Msg.show({
                   title: this.contextSaveSuccessString,
                   msg: response.statusText + " " + this.contextSaveSuccessString,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.OK
              });
    },
    updateFail: function(response){
              Ext.Msg.show({
                   title: this.contextSaveFailString,
                   msg: this.getSaveFailedErrMsg(response) + " " + this.contextSaveFailString,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.OK
              });
    },
    createSuccess: function (response){
              this.target.appMask.hide();
              this.target.modified = false;

              var oldId = this.target.mapId;
              var newId = parseInt(response.responseText);
              this.target.mapId = newId;

              var reload = function(buttonId, text, opt){
                    this.reloadMap(newId,oldId);
              };

              Ext.Msg.show({
                   title: this.contextCreateSuccessString,
                   msg: response.statusText + " " + this.contextCreateSuccessString,
                   buttons: Ext.Msg.OK,
                   fn: reload,
                   icon: Ext.MessageBox.OK,
                   scope: this
              });
    },
    createFail: function(response){
              Ext.Msg.show({
                   title: this.contextCreateFailString,
                   msg: this.getSaveFailedErrMsg(response) + " " + this.contextCreateFailString,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.OK
              });
    },
    deleteSuccess: function(response){
            var oldId = this.target.mapId;
            var newId = (this.defaultMap);
            var reload = function(buttonId, text, opt){
                    this.reloadMap(newId,oldId);
              };
              this.target.mapId=-1;
              Ext.Msg.show({
                   title: this.contextDeleteSuccessString,
                   msg: response.statusText + " " + this.contextDeleteSuccessString,
                   buttons: Ext.Msg.OK,
                   fn: reload,
                   icon: Ext.MessageBox.OK,
                   scope: this
              });
    },
    deleteFail: function(response){
              Ext.Msg.show({
                   title: this.contextDeleteFailString,
                   msg: this.getSaveFailedErrMsg(response) + " " + this.contextDeleteFailString,
                   buttons: Ext.Msg.OK,
                   icon: Ext.MessageBox.OK
              });
    },

    getSaveFailedErrMsg: function(response) {
        var errMsg = null;
        var defaultErrMsg = response.statusText + "(status " + response.status + "):  " + response.responseText;

        switch (response.status) {
            case 409:
                errMsg = this.conflictErrMsg;
                break;
            default:
                errMsg = defaultErrMsg;
                break;
        }

        return errMsg;
    },

    metadataDialog: function(configStr){
        var enableBtnFunction = function(){
            if(this.getValue() != "")
                Ext.getCmp("resource-addbutton").enable();
            else
                Ext.getCmp("resource-addbutton").disable();
        };

        var templateId = this.target.templateId;
        var plugin = this;
        var win = new Ext.Window({
            title: this.mapMetadataTitle,
            width: 415,
            height: 200,
            resizable: false,
            //title: "Map Name",
            items: [
                new Ext.form.FormPanel({
                    width: 400,
                    height: 150,
                    items: [
                        {
                          xtype: 'fieldset',
                          id: 'name-field-set',
                          title: this.mapMedatataSetTitle,
                          items: [
                              {
                                    xtype: 'textfield',
                                    width: 120,
                                    id: 'diag-text-field',
                                    fieldLabel: this.mapNameLabel,
                                    listeners: {
                                        render: function(f){
                                            f.el.on('keydown', enableBtnFunction, f, {buffer: 350});
                                        }
                                    }
                              },
                              {
                                    xtype: 'textarea',
                                    width: 200,
                                    id: 'diag-text-description',
                                    fieldLabel: this.mapDescriptionLabel,
                                    readOnly: false,
                                    hideLabel : false
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
                        text: this.addResourceButtonText,
                        iconCls: "gxp-icon-addgroup-button",
                        id: "resource-addbutton",
                        scope: this,
                        disabled: true,
                        handler: function(){
                            win.hide();

                            var mapName = Ext.getCmp("diag-text-field").getValue();
                            var mapDescription = Ext.getCmp("diag-text-description").getValue();
                            var auth = plugin.getAuth();
                            var owner = Base64.decode(auth.split(' ')[1]);
                            owner = owner.split(':')[0];

                            var resourceXML =
                                '<Resource>' +
                                    '<Attributes>' +
                                        '<attribute>' +
                                            '<name>owner</name>' +
                                            '<type>STRING</type>' +
                                            '<value>' + owner + '</value>' +
                                        '</attribute>' +
                                        '<attribute>' +
                                            '<name>templateId</name>' +
                                            '<type>STRING</type>' +
                                            '<value>' + templateId + '</value>' +
                                        '</attribute>' +
                                    '</Attributes>' +
                                    '<description>' + mapDescription + '</description>' +
                                    '<metadata></metadata>' +
                                    '<name>' + mapName + '</name>' +
                                    '<category>' +
                                        '<name>MAP</name>' +
                                    '</category>' +
                                    '<store>' +
                                        '<data><![CDATA[ ' + configStr + ' ]]></data>' +
                                    '</store>' +
                                '</Resource>';
                            this.geoStore.sendRequest("/resources", "POST",resourceXML, "text/xml", this.createSuccess, this.createFail, this);
                            win.destroy();
                        }
                    }
                ]
            })
        });
        win.show();
    },
    getDefaultMap: function(){
        var userDetails = Ext.util.JSON.decode(sessionStorage["userDetails"]);
        var defaultMap=null;
        var attributes=[];
        // get auth info
        if (userDetails) {
            var user = userDetails.user;
            if(user){
                //Check if user as default_map attribute defined
                if(user.attribute) {
                    if(user.attribute instanceof Array)
                        attributes=user.attribute;
                    else
                        attributes.push(user.attribute);
                    for(var i = 0; i<attributes.length;i++) {
                            if(attributes[i].name=='default_map'){
                                defaultMap=attributes[i].value;
                                break;
                            }
                    }
                }
            }
        }
        return defaultMap;
    }
});

Ext.preg(gxp.plugins.he.MapSelector.prototype.ptype, gxp.plugins.he.MapSelector);

//# sourceURL=MapSelector.js