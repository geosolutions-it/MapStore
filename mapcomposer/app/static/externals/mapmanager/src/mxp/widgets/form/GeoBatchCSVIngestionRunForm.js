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

Ext.ns("mxp.widgets");

/**
 * Generic Resource Editor for GeoStore
 * Allow to edit and commit changes for a GeoStore Resource
 *
 */
mxp.widgets.GeoBatchCSVIngestionRunForm = Ext.extend(Ext.Panel, {
    iconCls: 'update_manager_ic',
    /** api: xtype[geobatch_run_local_form]
     */
    xtype: 'geobatch_csv_ingestion_run_form',
    /** api: config[fileBrowserUrl]
     * ``string`` the url for the file browser
     */
    fileBrowserUrl: "mvc/fileManager/extJSbrowser",
    /** api: config[flowId]
     * ``string`` the id of the flow to run
     */
    flowId: null,
    /**
     * Regex to enable the Run Button
     * the regex work on the relative path of the file
     * as fileId is.
     */
    fileRegex: ".*",
    /** api: config[fileId]
     * ``string`` the id of the file to run.
     *
     * e.g. /csv/myFile.csv
     */
    fileId: null,
    /** api: config[baseDir]
     * ``string`` baseDir to concatenate to the dir from the file browser
     *
     * e.g.
     * baseDir: "/var/data"
     * fileId from Server "/csv/myFile.csv"
     * forwarded file path: "/var/data/csv/myFile.csv"
     */
    baseDir: '',

    events: [
        /** public event[success]
         * Fired when the flow starts successful
         *
         * arguments:
         * ``string`` the id of the consumer
         */
        'success',
        /** event[fail]
         * Fired when the flow failed to run
         *
         * arguments:
         * ``string`` the server response
         */
        'fail'
    ],

    propertiesLists: [],

    layout: 'fit',
    autoScroll: false,
    // i18n
    runButtonText: "Run",
    uploadButtonText: "Upload",
    successText: "Success",
    errorText: "Error",
    runSuccessText: "The workflow has been started successfully<br/>",
    //end of i18n

    initComponent: function() {
        var me = this;

        this.items = [{
            xtype: "panel",
            layout: "form",
            ref: "form",
            border: false,
            padding: 4,
            items: [{
                xtype: 'combo',
                anchor: '100%',
                ref: 'comboSource',
                autoSelect: true,
                autoLoad: true,
                editable: false,
                typeAhead: true,
                lazyRender: false,
                store: this.ingestionSources,
                fieldLabel: 'Source',
                triggerAction: 'all',
                mode: 'local'
            }, {
                xtype: 'fieldset',
                title: "Select CSV File",
                layout: 'fit',
                collapsible: false,
                items: [{
                    xtype: 'textfield',
                    allowBlank: false,
                    ref: '../pathFileText'
                }],
                buttons: [{
                    text: this.uploadButtonText,
                    ref: '../upload',
                    iconCls: 'update_manager_ic',
                    handler: function(btn) {
                        var pluploadPanel = new Ext.ux.PluploadPanel({
                            autoScroll: true,
                            layout: 'fit',
                            url: this.adminUrl + this.fileBrowserUrl.substring(0, this.fileBrowserUrl.lastIndexOf('/')) + '/upload',
                            multipart: true,
                            listeners: {
                                beforestart: function() {
                                    var multipart_params = pluploadPanel.multipart_params || {};
                                    Ext.apply(multipart_params, {
                                        folder: this.path
                                    });
                                    pluploadPanel.multipart_params = multipart_params;
                                },
                                fileUploaded: function(file) {
                                },
                                uploadcomplete: function() {
                                },
                                scope: this
                            }
                        });
                        var win = new Ext.Window({
                            title: this.uploadButtonText,
                            width: 400,
                            height: 300,
                            layout: 'fit',
                            resizable: true,
                            items: [pluploadPanel]
                        });
                        win.show();
                    },
                    scope: this
                }, {
                    scope: this,
                    xtype: 'button',
                    text: 'Explore',
                    iconCls: 'icon-folder-explore',
                    handler: function(b) {
                        var win = new Ext.Window({
                            parentWindow: this,
                            iconCls: 'update_manager_ic',
                            xtype: 'form',
                            title: 'Select CSV File...',
                            width: 300,
                            height: config.height || 400,
                            //path:'csv/New Folder',
                            minWidth: 250,
                            minHeight: 200,
                            layout: 'fit',
                            autoScroll: false,
                            //closeAction:'hide',
                            maximizable: true,
                            modal: true,
                            resizable: true,
                            draggable: true,
                            items: [{
                                xtype: "FileBrowser",
                                border: false,
                                layout: 'border',
                                ref: 'fileBrowser',
                                border: false,
                                closable: true,
                                closeAction: 'close',
                                autoWidth: true,
                                // iconCls: "template_manger_ic",  // TODO: icon
                                header: false,
                                viewConfig: {
                                    forceFit: true
                                },
                                title: this.buttonText,
                                rootText: "root",
                                // layout: "fit",
                                // path:"root",
                                readOnly: true,
                                enableBrowser: false,
                                path: this.path,
                                enableUpload: false,
                                //uploadUrl: uploadUrl,
                                mediaContent: this.mediaContent,
                                url: this.adminUrl + this.fileBrowserUrl,
                                listeners: {
                                    scope: this,
                                    afterrender: function(fb) {
                                        //auto select if fileId
                                        var sm = fb.fileTreePanel.getSelectionModel();
                                        if (fb.refOwner.fileId) {
                                            var node = fb.fileTreePanel.getNodeById(fb.refOwner.fileId);
                                            if (node && sm) {
                                                sm.select(node);
                                            }
                                        }
                                        var runBtn = fb.refOwner.run;
                                        //enable or disable button

                                        sm.on('selectionchange', function(smod, node) {

                                            var patt = new RegExp(me.fileRegex);
                                            var res = patt.test(node.id);
                                            if (res) {
                                                runBtn.setDisabled(false);
                                            } else {
                                                runBtn.setDisabled(true);
                                            }

                                        });
                                    }
                                }
                            }],
                            buttons: [{
                                text: 'Ok',
                                ref: '../run',
                                disabled: true,
                                handler: function(btn) {
                                    var filebrowser = btn.refOwner.fileBrowser;
                                    var node = filebrowser.fileTreePanel.selModel.getSelectedNode();
                                    var filePath = node.id.replace('//', '/');
                                    btn.refOwner.parentWindow.form.pathFileText.setValue(filePath);
                                    btn.refOwner.parentWindow.form.pathFileText.fireEvent('change', btn.refOwner.parentWindow.form.pathFileText);
                                    btn.refOwner.close();
                                }
                            }]
                        });
                        win.show();
                    }
                }]
            }]
        }];

        this.buttons = [{
            ref: '../run',
            text: this.runButtonText,
            disabled: true,
            iconCls: 'update_manager_ic',
            handler: function(btn) {
                var filePath = btn.refOwner.baseDir + btn.refOwner.form.pathFileText.getValue();
                btn.refOwner.callRun(btn.refOwner.flowId, filePath);
            }
        }];

        mxp.widgets.GeoBatchCSVIngestionRunForm.superclass.initComponent.call(this, arguments);

        this.form.pathFileText.on('change',function(t){
            t.refOwner.refOwner.allowRun();
        });

        // set a init value for combobox
        this.form.comboSource.setValue('Cropdata');
        this.form.comboSource.on('select',function(cb){
            var selectedItem = cb.getValue();
            this.loadCustomOptions(selectedItem);
            this.allowRun();
        }, this);
        this.form.comboSource.fireEvent('select', this.form.comboSource);
    },

    // adds the needed widgets to the form to get extra properties.
    loadCustomOptions: function(comboSourceVal){
        var removeCustomOptions = function(form){
            if (form.customOptions != undefined){
                form.remove(form.customOptions);
                form.doLayout();
            }
        };

        var customOptionsConfigs = {
            ref: 'customOptions',
            customOptionsType: undefined,
            title: 'Values Options',
            items: [],
            isValid: function(){
                var allOk = true;
                for(var i=0; i<this.items.getCount(); i++)
                    allOk = allOk && this.items.itemAt(i).isValid();
                return allOk;
            }
        };

        switch (comboSourceVal){
            case 'Cropdata': {
                removeCustomOptions(this.form);
                customOptionsConfigs.customOptionsType = 'cropData';
                customOptionsConfigs.items.push({
                    xtype: 'combo',
                    ref: 'source', // must be the same defined in managerConfig.js config file
                    fieldLabel: 'Source',
                    ref: 'src',
                    isValid: function(){
                        return this.getValue() != '';
                    },
                    anchor: '100%',
                    triggerAction: 'all',
                    mode: 'local',
                    typeAhead: true,
                    lazyRender: false,
                    forceSelected: true,
                    allowBlank: false,
                    displayField: 'src',
                    valueField: 'src',
                    editable: true,
                    store: new Ext.data.JsonStore({
                        fields: [{name: 'src', mapping: 'properties.src'}],
                        autoLoad: true,
                        url: this.sourcesUrl,
                        root: 'features',
                        idProperty:'src'
                    }),
                    listeners: {
                        'select': function(combo){
                            this.refOwner.refOwner.refOwner.allowRun();
                        }
                    }
                });

                var customOptions = new Ext.form.FieldSet(customOptionsConfigs);

                this.form.add(customOptions);
                this.form.doLayout();
            }break;
            case 'Market Prices': {
                removeCustomOptions(this.form);
                customOptionsConfigs.customOptionsType = 'marketPrices';
                customOptionsConfigs.items.push({
                    xtype: 'combo',
                    ref: 'denominator', // must be the same defined in managerConfig.js config file
                    fieldLabel: 'Denominator',
                    isValid: function(){
                        return this.getValue() != '';
                    },
                    anchor: '100%',
                    triggerAction: 'all',
                    mode: 'local',
                    typeAhead: true,
                    lazyRender: false,
                    forceSelected: true,
                    allowBlank: false,
                    displayField: 'name',
                    valueField: 'shortname',
                    editable: false,
                    store: new Ext.data.JsonStore({
                        baseParams: {
                            viewParams: 'class:denominator'
                        },
                        fields: [{
                            name: 'id',
                            mapping: 'properties.uid'
                        }, {
                            name: 'cid',
                            mapping: 'properties.cid'
                        }, {
                            name: 'cls',
                            mapping: 'properties.cls'
                        }, {
                            name: 'coefficient',
                            mapping: 'properties.coefficient'
                        }, {
                            name: 'description',
                            mapping: 'properties.description'
                        }, {
                            name: 'filter',
                            mapping: 'properties.filter'
                        }, {
                            name: 'name',
                            mapping: 'properties.name'
                        }, {
                            name: 'shortname',
                            mapping: 'properties.shortname'
                        }],
                        autoLoad: true,
                        url: this.factorUrl,
                        root: 'features',
                        idProperty: 'uid'
                    }),
                    listeners: {
                        'select': function(combo){
                            this.refOwner.refOwner.refOwner.allowRun();
                        }
                    }
                });
                customOptionsConfigs.items.push({
                    xtype: 'combo',
                    anchor: '100%',
                    ref: 'exchangeRate', // must be the same defined in managerConfig.js config file
                    fieldLabel: 'Exchange Rate [PKR/USD]',
                    isValid: function(){
                        return this.getRawValue() != '';
                    },
                    triggerAction: 'all',
                    mode: 'local',
                    typeAhead: true,
                    lazyRender: false,
                    forceSelected: true,
                    allowBlank: false,
                    displayField: 'coefficient',
                    valueField: 'coefficient',
                    store: new Ext.data.JsonStore({
                        baseParams: {
                            viewParams: 'class:exchangerate'
                        },
                        fields: [{
                            name: 'id',
                            mapping: 'properties.uid'
                        }, {
                            name: 'cid',
                            mapping: 'properties.cid'
                        }, {
                            name: 'cls',
                            mapping: 'properties.cls'
                        }, {
                            name: 'coefficient',
                            mapping: 'properties.coefficient'
                        }, {
                            name: 'description',
                            mapping: 'properties.description'
                        }, {
                            name: 'filter',
                            mapping: 'properties.filter'
                        }, {
                            name: 'name',
                            mapping: 'properties.name'
                        }, {
                            name: 'shortname',
                            mapping: 'properties.shortname'
                        }],
                        autoLoad: true,
                        url: this.factorUrl,
                        root: 'features',
                        idProperty: 'uid'
                    }),
                    listeners: {
                        'select': function(combo){
                            this.refOwner.refOwner.refOwner.allowRun();
                        },
                        'keyup': function(combo){
                            this.refOwner.refOwner.refOwner.allowRun();
                        }
                    },
                    enableKeyEvents: true
                });

                var customOptions = new Ext.form.FieldSet(customOptionsConfigs);

                this.form.add(customOptions);
                this.form.doLayout();
            }break;
            default: {
                removeCustomOptions(this.form);
            }
        }
    },

    // enables run button if all options are specified.
    allowRun: function(){
        var denyRun = this.form.pathFileText.getValue() == '' || (this.form.customOptions ? !this.form.customOptions.isValid() : false);
        this.run.setDisabled(denyRun);
    },

    isForm: function() {
        return true;
    },

    // return a string with all propertis to appentd on the body of the rest request.
    // this function search for property keys in config file (managerConfig.js).
    getCustomOptionsProperies: function(){
        var retval = "";
        if (this.form.customOptions){
            var customOptsTarget = this.form.customOptions.customOptionsType;
            var propertyKeyList = this.propertiesLists[customOptsTarget];
            var retval = "";
            for(var i=0; i<propertyKeyList.length; i++){
                var key = propertyKeyList[i];
                retval += key + '=' + this.form.customOptions[key].getValue() + '\n';
            }
        }
        return retval;
    },

    callRun: function(flowId, filePath) {
        var now = new Date();
        var propFileNameTime = now.dateFormat("YmdHis"); // return a date like YYYYMMDDhhmmss

        var propFileContent = 'CSVlocation=' + filePath + '\n';
        propFileContent += this.getCustomOptionsProperies();

        var requestConf = {
            url: this.geoBatchRestURL + 'flows/' + flowId + '/run',
            params: {
                fileName: propFileNameTime + '-' + filePath.substring(filePath.lastIndexOf('/')+1, filePath.length).replace(/[.]/g,'_') + '.properties'
            },
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            xmlData: propFileContent,
            scope: this,
            success: function(response, opts) {
                //var data = self.afterFind( Ext.util.JSON.decode(response.responseText) );
                this.fireEvent('success', response);
                this.onSuccess(response, opts);
            },
            failure: function(response, opts) {
                this.fireEvent('fail', response);
                this.onFailure(response);
            }
        };

        Ext.Ajax.request(requestConf);

    },
    /**
     * private method[onFailure]
     * manage the negative response of Run call
     */
    onFailure: function(response) {
        Ext.Msg.show({
            title: this.errorText,
            msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });
    },
    /**
     * private method[onSuccess]
     * manage positive response of Run call (ID of the consumer)
     */
    onSuccess: function(response) {
        Ext.Msg.show({
            title: this.successText,
            //msg: this.runSuccessPreText + response.responseText,
            msg: this.runSuccessText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO
        });
    }

});
Ext.reg(mxp.widgets.GeoBatchCSVIngestionRunForm.prototype.xtype, mxp.widgets.GeoBatchCSVIngestionRunForm);
