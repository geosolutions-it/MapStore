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


/** api: (define)
 *  module = gxp.he
 *  class = NewSourceWindowGeoStore
 *  extends = gxp.NewSourceWindow
 */
Ext.namespace('gxp.he');

/** api: constructor
 * .. class:: gxp.he.NewSourceWindowGeoStore(config)
 *
 */
gxp.he.NewSourceWindowGeoStore = Ext.extend(gxp.NewSourceWindow, {

    /** api: config[groupsLabel]
     *  ``String``
     *  Group multiselect label (i18n).
     */
    groupsLabel:'Groups',

    /** api: config[gsErrorTitle]
     *  ``String``
     *  Error message title!
     */
    gsErrorTitle:"Geostore Error",

    /** api: config[gsGetPermissionError]
     *  ``String``
     *  Error message title!
     */
    gsGetPermissionError:"Unable to retrieve resource permissions.",

     /** api: event[server-added]
     * Fired with the URL that the user provided as a parameter when the form 
     * is submitted.
     */
    initComponent: function() {
        this.addEvents("server-added");
        this.urlTextField = new Ext.form.TextField({
            fieldLabel: "URL (*)",
            allowBlank: false,
            width: 220,
            labelStyle: "width: 50px;",
            msgTarget: "under",
            validator: this.urlValidator.createDelegate(this)
        });
        this.roleAdmin=(this.target && this.target.userDetails && this.target.userDetails.user.role == "ADMIN");
        var store = [];
        for(var count = 0, l = this.availableSources.length; count < l; count++) {
            var source = this.availableSources[count];
            store.push([source.name, source.description]);
        }
        this.form = new Ext.Panel({
            layout: "form",
            items: [{
                xtype: 'combo',
                width: 220,
                labelStyle: "width: 50px;",
                ref: "../sourceType",
                name: 'type',
                fieldLabel: this.sourceTypeLabel,
                ref: "sourceType",
                value: 'WMS',
                mode: 'local',
                triggerAction: 'all',
                store: store,
                listeners: {
                    scope: this,
                    select: function(combo, record, index) {
                        var sourceType = store[index][0];
                        if(sourceType == "WMS"){
                            this.advancedOptions.show();
                        }else{
                            this.advancedOptions.hide();
                        }
                    }
                }
            }, this.urlTextField,
            {
                                    xtype:'gxp_usergroupmultiselect',
                                    ref:"groupPermissions",
                                    disabled:!this.isNewSource,
                                    hidden:!this.roleAdmin,
                                    labelStyle: "width: 50px;",
                                    fieldLabel:this.groupsLabel,
                                    url: this.target.geoStoreBaseURL +'/usergroups',
                                    auth: this.auth,
                                    name:'groupId',
                                    editable:false,
                                    width:'auto',
                                    allowBlank:true,
                                    target: this.target
                                },
            {
                xtype: "fieldset",
                title: this.advancedOptionsTitle,
                ref: "../advancedOptions",
                collapsible: true,
                collapsed: true,
                hidden: false,
                items:[{
                    xtype: "tabpanel",
                    bodyStyle: "padding: 5px",
                    deferredRender: false,
                    activeTab: 0,
                    items: [
                        {
                            xtype: "form",
                            title: this.generalTabTitle,
                            ref: "../../../generalForm",    
                            labelWidth: 80,
                            height: 120,
                            items: [{
                                    xtype: "textfield",
                                    name: "title",
                                    width: 147,
                                    allowBlank: true,
                                    fieldLabel: this.titleLabel
                                },{
                                    xtype: 'combo',
                                    name: "version",
                                    ref: "versionCombo",    
                                    width: 147,
                                    allowBlank: false,
                                    fieldLabel: this.versionLabel,
                                    value: "1.1.1",
                                    mode: 'local',
                                    triggerAction: 'all',
                                    forceSelection: true,
                                    editable: false,
                                    valueField: "version",
                                    displayField: "version",
                                    store: new Ext.data.ArrayStore({
                                        fields: ["version"],
                                        data:  [["1.1.1"], ["1.3.0"]]
                                    })
                                },{
                                    xtype: "textfield",
                                    name: "authParam",
                                    width: 147,
                                    allowBlank: true,
                                    fieldLabel: this.authParamLabel
                            }]
                        }, {            
                            xtype: "form",
                            title: this.cacheTabTitle,
                            ref: "../../../cacheForm",  
                            labelWidth: 80,
                            height: 120,
                            items: [{
                                xtype: "numberfield",
                                allowBlank: true,
                                name: "minx",
                                fieldLabel: this.minXLabel
                            },{
                                xtype: "numberfield",
                                allowBlank: true,
                                name: "miny",
                                fieldLabel: this.minYLabel
                            },{
                                xtype: "numberfield",
                                allowBlank: true,
                                name: "maxx",
                                fieldLabel: this.maxXLabel
                            },{
                                xtype: "numberfield",
                                allowBlank: true,
                                name: "maxy",
                                fieldLabel: this.maxYLabel
                            }]
                        }, {
                            layout: "form",
                            title: this.paramsTabTitle,
                            height: 120,
                            items: [
                                new Ext.grid.PropertyGrid({
                                    header: false,
                                    height: 90,
                                    autoScroll: false,
                                    hideHeaders: true,
                                    selModel: new Ext.grid.RowSelectionModel(),
                                    ref: "../../../../paramGrid",                                   
                                    listeners: {
                                        scope: this,
                                        rowclick: function(el, rowIndex, evt){
                                            this.paramGrid.removeButton.enable();
                                        },
                                        afterrender: function(propertyGrid) {
                                            // register listeners on relevant grid editors
                                            // (workaround for issue #547: https://github.com/geosolutions-it/MapStore/issues/547)
                                            if (Ext.isChrome) {
                                                var cm = propertyGrid.getColumnModel();
                                                var fieldTypes = ['date', 'string', 'number']; // fix only editors using a TextField or a subclass of TextField
                                                Ext.each(fieldTypes, function(fieldType) {
                                                    var editor = cm.editors[fieldType];
                                                    if (editor) {
                                                        editor.addListener("beforestartedit", function() {
                                                            var currentScroll = propertyGrid.getGridEl().child(".x-grid3").getScroll();
                                                            // save currentScroll as a property of the grid
                                                            propertyGrid.savedScroll = currentScroll;
                                                            //console.log("saved grid scroll value: { left: " + currentScroll.left + ", top: " + currentScroll.top + "}");
                                                        });
                                                        
                                                        editor.addListener("startedit", function() {
                                                            var savedScroll = propertyGrid.savedScroll;
                                                            if (savedScroll) {
                                                                var el = propertyGrid.getGridEl().child(".x-grid3");
                                                                var delayedTask = new Ext.util.DelayedTask(function() {
                                                                    // restore grid's scroll value
                                                                    el.scrollTo("left", savedScroll.left);
                                                                    el.scrollTo("top", savedScroll.top);
                                                                    //console.log("restored grid scroll value: { left: " + savedScroll.left + ", top: " + savedScroll.top + "}");
                                                                });
                                                                delayedTask.delay(10);
                                                            }                                                   
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    },                                  
                                    bbar:["->",{
                                        text: this.addParamButtonText,
                                        iconCls: "add",
                                        scope: this,
                                        handler: function(){            
                                            var paramForm = new Ext.form.FormPanel({
                                                width: 300,
                                                items: [
                                                    {
                                                        xtype: "combo",
                                                        ref: "propertyName",
                                                        fieldLabel: this.propNameLabel,
                                                        width: 100,
                                                        store: new Ext.data.ArrayStore({
                                                            fields: ["params"],
                                                            data :  this.availableVendorOptions
                                                        }),
                                                        listeners:{
                                                            scope: this,
                                                            select: function(combo, record, index){
                                                                var param = record.get("params");
                                                                if(param == "FORMAT"){
                                                                    paramForm.propertyValue.hide();
                                                                    paramForm.tiledCombo.hide();
                                                                    paramForm.formatCombo.show();
                                                                }else if(param == "TILED"){
                                                                    paramForm.propertyValue.hide();
                                                                    paramForm.formatCombo.hide();
                                                                    paramForm.tiledCombo.show();                                                                
                                                                }else{
                                                                    paramForm.formatCombo.hide();
                                                                    paramForm.tiledCombo.hide();
                                                                    paramForm.propertyValue.show();
                                                                }
                                                            }
                                                        },
                                                        mode: "local",
                                                        forceSelection: true,
                                                        triggerAction: "all",
                                                        editable: false,
                                                        valueField: "params",
                                                        displayField: "params"
                                                    },
                                                    {
                                                        xtype: "combo",
                                                        ref: "formatCombo",
                                                        fieldLabel: this.propValueLabel,
                                                        width: 100,
                                                        hidden: true,
                                                        store: new Ext.data.ArrayStore({
                                                            fields: ["format"],
                                                            data :  this.availableFormats
                                                        }),
                                                        mode: "local",
                                                        forceSelection: true,
                                                        triggerAction: "all",
                                                        editable: false,
                                                        valueField: "format",
                                                        displayField: "format"
                                                    },
                                                    {
                                                        xtype: "combo",
                                                        ref: "tiledCombo",
                                                        fieldLabel: this.propValueLabel,
                                                        width: 100,
                                                        hidden: true,
                                                        store: new Ext.data.ArrayStore({
                                                            fields: ["tiled"],
                                                            data :  [["true"], ["false"]]
                                                        }),
                                                        mode: "local",
                                                        forceSelection: true,
                                                        triggerAction: "all",
                                                        editable: false,
                                                        valueField: "tiled",
                                                        displayField: "tiled"
                                                    },
                                                    {
                                                        hidden: false,
                                                        width: 100,
                                                        xtype: 'textfield',
                                                        ref: "propertyValue",
                                                        allowBlank: false,
                                                        fieldLabel: this.propValueLabel,
                                                        flex: 1
                                                    }
                                                ]
                                            });
                                            
                                            var paramWindow = new Ext.Window({
                                                title: this.paramsWinTitle,
                                                width: 315,
                                                modal: true,
                                                items: [
                                                    paramForm
                                                ],
                                                bbar: ["->", {
                                                    text: this.okButtonText,
                                                    iconCls: "save",
                                                    scope: this,
                                                    handler: function(){
                                                        var propertyName = paramForm.propertyName;
                                                        var propertyValue = paramForm.propertyValue;
                                                        var tiledCombo = paramForm.tiledCombo;
                                                        var formatCombo = paramForm.formatCombo;
                                                        
                                                        if(propertyName.isDirty() && propertyName.isValid()){
                                                            if(propertyValue.isDirty() && propertyValue.isValid()){                                                         
                                                                this.paramGrid.setProperty(propertyName.getValue(), propertyValue.getValue(), true);                                                        
                                                                paramWindow.close();
                                                            }else if(tiledCombo.isDirty() && tiledCombo.isValid()){
                                                                this.paramGrid.setProperty(propertyName.getValue(), tiledCombo.getValue(), true);                                                       
                                                                paramWindow.close();
                                                            }else if(formatCombo.isDirty() && formatCombo.isValid()){
                                                                this.paramGrid.setProperty(propertyName.getValue(), formatCombo.getValue(), true);                                                      
                                                                paramWindow.close();
                                                            }else{
                                                                Ext.Msg.show({
                                                                     title: this.addPropDialogTitle,
                                                                     msg: this.addPropDialogMsg,
                                                                     width: 300,
                                                                     icon: Ext.MessageBox.WARNING
                                                                });
                                                            }
                                                        }
                                                    }
                                                }, {    
                                                    text: this.cancelButtonText,
                                                    scope: this,
                                                    iconCls: "cancel",
                                                    handler: function(){
                                                        paramWindow.close();
                                                    }
                                                }]
                                            });
                                            
                                            paramWindow.show();
                                        }
                                    },{
                                        text: this.removeButtonText,
                                        scope: this,
                                        disabled: true,
                                        iconCls: "delete",
                                        ref: "../removeButton",
                                        handler: function(){
                                            var gridSelModel = this.paramGrid.getSelectionModel();
                                            var selected = gridSelModel.getSelected();
                                            
                                            if(selected){
                                                this.paramGrid.removeProperty(selected.id);
                                            }else{
                                                Ext.Msg.show({
                                                     title: this.removePropDialogTitle,
                                                     msg: this.removePropDialogMsg + selected.id,
                                                     width: 300,
                                                     icon: Ext.MessageBox.WARNING
                                                });
                                            }                                           
                                        }
                                    }],
                                    customEditors: {
                                        "FORMAT": new Ext.grid.GridEditor(new Ext.form.ComboBox({
                                                store: new Ext.data.ArrayStore({
                                                    fields: ["format"],
                                                    data :  this.availableFormats
                                                }),
                                                mode: "local",
                                                forceSelection: true,
                                                triggerAction: "all",
                                                editable: false,
                                                valueField: "format",
                                                displayField: "format"
                                        }))
                                    },
                                    source:{}
                                })
                            ]
                        }
                    ]
                }, {
                    xtype: "label",
                    text: this.mandatoryLabelText,
                    style: "color: red;"
                }]
            }],
            border: false,
            labelWidth: 30,
            bodyStyle: "padding: 5px",
            autoScroll: true,
            listeners: {
                afterrender: function() {
                    
                    this.urlTextField.focus(false, true);
                    // Set default value
                    this.generalForm.versionCombo.setValue('1.1.1');
                },
                scope: this
            }
        });

        this.bbar = [
            new Ext.Button({
                text: this.cancelText,
                iconCls: "gxp-icon-removefilter",
                handler: function() {
                    this.hide();
                },
                scope: this
            }),
            new Ext.Toolbar.Fill(),
            new Ext.Button({
                text: this.isNewSource === true ? this.addServerText : this.editServerText,
                iconCls: "add",
                ref: "../sourceButton",
                handler: function() {
                    // Clear validation before trying again.
                    this.error = null;
                    // Do not save if mandatory fields are not filled
                    var generalForm = this.generalForm.getForm();
                    if (this.urlTextField.validate() && generalForm.isValid()) {
                        var sourceUrl = this.urlTextField.getValue();
                        
                        var sourceCfg = {
                            url: sourceUrl
                        };

                        var generalCfgForm = generalForm.getValues();
                        if(generalCfgForm){
                            for(property in generalCfgForm){
                                if(generalCfgForm[property] == ""){
                                    delete generalCfgForm[property];
                                }
                            }
                            
                            Ext.applyIf(sourceCfg, generalCfgForm);
                        }

                        var cacheForm = this.cacheForm.getForm();
                        if(cacheForm.isValid()){
                            var cacheCfgForm = cacheForm.getValues();
                            if(cacheCfgForm){
                                var filled = true;
                                for(property in cacheCfgForm){
                                    if(cacheCfgForm[property] == ""){
                                        filled = false;
                                    }
                                }
                                
                                if(filled){
                                    Ext.applyIf(sourceCfg, {
                                        layersCachedExtent: [cacheCfgForm.minx, cacheCfgForm.miny, cacheCfgForm.maxx, cacheCfgForm.maxy]
                                    });
                                }
                            }
                        }
                        
                        var paramGridStore = this.paramGrid.getStore();
                        var paramGridRecords = paramGridStore.getRange(0, paramGridStore.getCount());   

                        if(paramGridRecords){
                            var layerBaseParams = {};
                            for(var i=0; i<paramGridRecords.length; i++){
                                var record = paramGridRecords[i];
                                if(record){
                                    layerBaseParams[record.data.name] = record.data.value;
                                }
                            }
                            
                            Ext.applyIf(sourceCfg, {
                                layerBaseParams: layerBaseParams
                            });
                        }
                    
                        if(!this.sourceId){
                            this.fireEvent("server-added", sourceUrl, this.form.sourceType.getValue(), sourceCfg,this.form.groupPermissions.getValue());
                        }else{
                            this.fireEvent("server-modified", sourceUrl, this.form.sourceType.getValue(), sourceCfg, this.sourceId,this.form.groupPermissions.getValue());
                            this.sourceId = undefined;
                            
                            // Re-enabled fields
                            this.urlTextField.enable();                     
                            this.form.sourceType.enable();  
                        }                           
                    }else{
                        Ext.Msg.show({
                             title: this.newSourceDialogTitle,
                             msg: this.newSourceDialogMsg,
                             width: 300,
                             icon: Ext.MessageBox.WARNING
                        });
                    }
                },
                scope: this
            })
        ];
    
        this.items = this.form;

        gxp.NewSourceWindow.superclass.initComponent.call(this);

        this.form.on("render", function() {
            this.loadMask = new Ext.LoadMask(this.form.getEl(), {msg:this.contactingServerText});
        }, this);

        this.on("hide", function() {
            // Reset values so it looks right the next time it pops up.
            this.error = null;
            this.showPermissions=false;
            this.urlTextField.validate(); // Remove error text.
            this.urlTextField.setValue("");
            this.loadMask.hide();
        }, this);

        this.on("server-added", function(url) {
            this.setLoading();
            var success = function(record) {
                this.hide();
            };

            var failure = function() {
                this.setError(this.sourceLoadFailureMessage);
            };

            // this.explorer.addSource(url, null, success, failure, this);
            this.addSource(url, success, failure, this);
        }, this);


           this.on("beforeshow",function (){
                    if((this.isNewSource && this.roleAdmin) || this.showPermissions){
                        this.form.groupPermissions.show();
                    }else 
                        this.form.groupPermissions.hide();
                },this);

    },
    
    /** public: method[showWindow]
     */
    showWindow: function(){
        this.sourceId=undefined;
        gxp.he.NewSourceWindowGeoStore.superclass.showWindow.call(this);
    },

    /** public: method[bindSource]
     */
    bindSource: function(source){
        if(source){
            if(source.gsId && this.roleAdmin){
                 this.showPermissions=true;
                if(this.form.rendered){
                    this.form.groupPermissions.disable();
                }
                else{
                    this.form.groupPermissions.disabled=true;
                }
                this.getResourcePermissions(source.gsId);
            }else this.showPermissions=false;               
        }
        gxp.he.NewSourceWindowGeoStore.superclass.bindSource.call(this,source);
    },

    /** private: method[getResourcePermissions] 
     * :param: resource ID
     *
     * Get resource permissions from geostore
     */
    getResourcePermissions:function(rId){
         Ext.Ajax.request({
           url: this.target.geoStoreBaseURL+'resources/resource/'+rId+'/permissions',
           method: 'GET',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.auth
           },        
           scope: this,
           success: function(response, opts){              
                this.form.groupPermissions.enable();
                var per=this.form.groupPermissions;
                var rulesList =Ext.util.JSON.decode(response.responseText).SecurityRuleList;
                var rules=[];
                if(rulesList && rulesList.SecurityRule instanceof Array)
                   rules=rulesList.SecurityRule;
                else if(rulesList.SecurityRule) 
                   rules.push(rulesList.SecurityRule);
                var groups=[];               
                for(var i=0;i<rules.length;i++){
                    var rule=rules[i];
                    if(rule.group)
                        groups.push(rule.group.id);
                }
                per.setValue(groups);            
           },
           failure:  function(response, opts){
              Ext.Msg.show({
                 title: this.gsErrorTitle,
                 msg: this.gsGetPermissionError+" "+response.statusText + "(status " + response.status + "):  " + response.responseText,
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.ERROR
              });
          }
        }); 

    }       


});