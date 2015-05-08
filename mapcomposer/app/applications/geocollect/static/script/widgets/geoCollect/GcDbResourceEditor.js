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
 * The WMSCapabilities and WFSDescribeFeatureType formats parse the document and
 * pass the raw data to the WMSCapabilitiesReader/AttributeReader.  There,
 * records are created from layer data.  The rest of the data is lost.  It
 * makes sense to store this raw data somewhere - either on the OpenLayers
 * format or the GeoExt reader.  Until there is a better solution, we'll
 * override the reader's readRecords method  here so that we can have access to
 * the raw data later.
 *
 * The purpose of all of this is to get the service title, feature type and
 * namespace later.
 * TODO: push this to OpenLayers or GeoExt
 */
(function() {
    function keepRaw(data) {
        var format = this.meta.format;
        if ( typeof data === "string" || data.nodeType) {
            data = format.read(data);
            // cache the data for the single read that readRecord does
            var origRead = format.read;
            format.read = function() {
                format.read = origRead;
                return data;
            };
        }
        // here is the new part
        this.raw = data;
    };
    Ext.intercept(GeoExt.data.WMSCapabilitiesReader.prototype, "readRecords", keepRaw);
    GeoExt.data.AttributeReader && Ext.intercept(GeoExt.data.AttributeReader.prototype, "readRecords", keepRaw);
})();

Ext.ns("mxp.widgets");

/**
 * GoeCollectDBResourceEditor
 * Allow to select geocollect source resource
 */
mxp.widgets.GcDbResourceEditor = Ext.extend(Ext.Panel, {

    /** api: xtype = mxp_gc_db_resourcce_editor */
    xtype : 'mxp_gc_db_resource_editor',

    /** api: config[forceUpdateStoredData]
     * ``boolean`` if true, force a second call to the /data service of GeoStore to commit the Stored Data.
     * this is needed because GeoStore service at the current time, doesn't update stored data in the resource
     * udate service
     */

    id : 'GCDeResourceEditor',
    title : 'Data Sources', //i18n
    selectDbLabel : 'Select db source',
    noticeTitle : "Notice",
    surveyTitle : 'Survey',
    sColName : "Name",
    sColType : "Type",
    sColAlias : "Alias",
    sColMainFields : "Show In Main Grid",
    sColHisFields : "Show In History Grid",
    sColSopFields : "Show In Survey Grid",
    serverError : "Invalid response from server.",
    errorLayer : "Trouble creating layer store from response.",
    //Contorllo per inizializzazione!
    authkey : null,
    authParam : null,
    template : null,
    gcFeatureEditor : null,
    templateDirty : false,
    gcSegGrid : null,
    gcHistoryGrid : null,
    gcSopGrid : null,

    //Campi utilizzati in attribute reader segnalazioni
    parseFieldsSeg : ["name", "type", "restriction", "localType", "nillable", "_alias", "_mainfields", "_histfields"],
    //Campi utilizzati in attribute reader sopralluoghi
    parseFieldsSop : ["name", "type", "restriction", "localType", "nillable", "_alias", "_sopfields"],

    initComponent : function() {
        this.addEvents({
            /**
             * @event ready
             * Fires when schea ara ready
             * return {this}
             *
             */
            "ready" : true,
            /**
             * @event schema change
             * Fires when schema change
             * return {this}
             */
            "change" : true,
            /**
             * @event schema change
             * Fires when schema change
             * return {this}
             */
            "resLoaded" : true

        });
        this.firstCall = true,

        //Controlla se è nuova missione o è stata caricata se vero quando aggiorna in caso di cambio source chiede perchè modifica tutta la missione
        this.isLoaded = false;
        //Setto parametri per interrogazione wms per recuperare i layer sorgenti (segnalazione/sopralluogo disponibili)
        //Non so se vuoi farli configurabili?
        var baseParams = this.baseParams || {
            SERVICE : "WMS",
            REQUEST : "GetCapabilities",
            VERSION : "1.1.1"
        };

        if (this.version) {
            baseParams.VERSION = this.version;
        }

        // /////////////////////////////////////////////////////
        // Get the user's corrensponding authkey if present
        // (see MSMLogin.getLoginInformation for more details) TODO::DA sistemare deve accedere solo alle fonti di cui ha il permesso!!
        // /////////////////////////////////////////////////////

        //Modificata per usare sessionStorage
        if (this.authParam && sessionStorage.userDetails) {
            var userInfo = Ext.decode(sessionStorage.userDetails);
            var authkey;
            if (userInfo.user.attribute instanceof Array) {
                for (var i = 0; i < userInfo.user.attribute.length; i++) {
                    if (userInfo.user.attribute[i].name == "UUID") {
                        authkey = userInfo.user.attribute[i].value;
                    }
                }
            } else {
                if (userInfo.user.attribute && userInfo.user.attribute.name == "UUID") {
                    authkey = userInfo.user.attribute.value;
                }
            }
            if (authkey) {
                baseParams[this.authParam] = authkey;
            }
        }
        //Creo lo store per recuperare le sorgenti dati
        this.dbstore = new GeoExt.data.WMSCapabilitiesStore({
            url : this.gcSource, //recupero url configurata in localconfig TODO:in fututo dovrà essere configurabile
            baseParams : baseParams,
            autoLoad : true,

            sortInfo : {
                field : 'title',
                direction : 'ASC'
            },
            listeners : {
                load : function() {
                    // The load event is fired even if a bogus capabilities doc
                    // is read (http://trac.geoext.org/ticket/295).
                    // Until this changes, we duck type a bad capabilities
                    // object and fire failure if found.
                    if (!this.dbstore.reader.raw || !this.dbstore.reader.raw.service) {
                        this.fireEvent("failure", this, "Invalid capabilities document.");
                    } else {
                        if (!this.title) {
                            this.title = this.dbstore.reader.raw.service.title;
                        }
                        this.waitIdx = 0;
                        var recs = Ext.isArray(arguments[1]) ? arguments[1] : arguments[0];
                        //Se ho lista layer la cilco e eseguo DescribeLayer per sapere se è un WFS
                        if (recs) {

                            for (var i = 0,
                                ilen = recs.length; i < ilen; i++) {
                                rec = recs[i];
                                //se trova il layer corrispettivo _sop è una sorgente valida carico il describe layer
                                if (this.dbstore.query('name', rec.data.name + '_sop').items.length == 1) {
                                    this.updateDescibe(rec);
                                    //TODO gestire eccezioni per server che non risponde
                                } else
                                    this.dbstore.remove(rec);
                                //rimuovo i layer presenti sul server che non sono missioni
                            }
                        };
                    }
                },
                dbready : function() {
                    if (this.typeName)//Se mi hanno passato una fonte la setto
                        this.setComboValue(this.typeName);
                },
                exception : function(proxy, type, action, options, response, arg) {
                    //  delete this.store;
                    var msg;
                    if (type === "response") {
                        msg = arg || this.serverError;
                    } else {
                        msg = this.errorLayer;
                    }
                    // TODO: decide on signature for failure listeners
                    this.fireEvent("failure", this, msg, Array.prototype.slice.call(arguments));
                },
                scope : this
            }
        });
        //Aggiungo evento store ready
        this.dbstore.addEvents(
        /**
         * @event dbready
         * Fires source and all schema are loaded.
         *
         *
         */"dbready");

        //il combobox che contiene la lista daelle sorgenti disponibili  //se mi passono il layer devo settarelo come visisbile e scaricare gli attributi
        this.comboSource = new Ext.form.ComboBox({
            xtype : 'combo',

            typeAhead : false,
            store : this.dbstore,
            displayField : 'name',
            mode : 'local',
            editable : false,
            triggerAction : 'all',
            lazyRender : true,
            valueNotFoundText : 'Non torvato',
            listeners : {
                select : function(a, rec, c) {
                    //è la source attiva!!
                    this.typeName = rec.get('typeName');

                    //rimuovo gli elementi già caricati!!
                    if (this.seg_fieldStore)
                        this.seg_fieldStore.removeAll();
                    if (this.sop_fieldStore)
                        this.sop_fieldStore.removeAll();
                    this.comboTemplate.enable();
                    //TODO gestire eccezioni per server che non risponde
                    this.seg_fieldStore.proxy.setUrl(rec.data.owsURL, true);
                    this.seg_fieldStore.load({
                        params : {
                            TYPENAME : rec.data.typeName,
                            SERVICE : rec.data.owsType,
                        },
                        callback : function() {
                            if (this.template)
                                this.addTemplateValuesSeg(this.seg_fieldStore);
                            this.fireReady(this);
                        },
                        scope : this

                    });
                    //TODO gestire eccezioni per server che non risponde
                    this.sop_fieldStore.proxy.setUrl(rec.data.owsURL, true);
                    this.sop_fieldStore.load({
                        params : {
                            TYPENAME : rec.data.typeName + "_sop",
                            SERVICE : rec.data.owsType,
                        },
                        callback : function() {
                            //this.cleanType(this.sop_fieldStore);
                            if (this.template)
                                this.addTemplateValuesSop(this.sop_fieldStore);
                            this.fireReady(this);
                        },
                        scope : this
                    });
                },
                expand : function(cmb) {

                    if (this.isLoaded) {

                    }

                },
                scope : this
            }
        });
        //Set base params for wfs descibefeaturetype request
        wfsBaseParams = {
            VERSION : '1.0.0',
            REQUEST : 'DescribeFeatureType'
        };
        if (authkey && this.authParam) {
            wfsBaseParams[this.authParam] = authkey;
        }    ;

        //CREAO GLI SOTRE PER RECUPERO ATTRIBUTI DELLA FONTE SEGNALAZIONE E SOPRALLUOGO
        //TODO::Aggiungere gestione errore se non carica non necessario in realtà a questo punto!!
        this.seg_fieldStore = new GeoExt.data.AttributeStore({
            url : ' ',
            baseParams : wfsBaseParams,
            fields : this.parseFields,
            listeners : {
                exception : function(proxy, type, action, options, response, arg) {
                    //delete this.store;
                    var msg;
                    if (type === "response") {
                        msg = arg || this.serverError;
                    } else {
                        msg = this.errorLayer;
                    }
                    // TODO: decide on signature for failure listeners
                    this.fireEvent("failure", this, msg, Array.prototype.slice.call(arguments));
                },
                scope : this
            }
        });
        this.sop_fieldStore = new GeoExt.data.AttributeStore({
            url : ' ',
            baseParams : wfsBaseParams,
            fields : this.parseFields,
            listeners : {
                exception : function(proxy, type, action, options, response, arg) {
                    //delete this.store;
                    var msg;
                    if (type === "response") {
                        msg = arg || this.serverError;
                    } else {
                        msg = this.errorLayer;
                    }
                    // TODO: decide on signature for failure listeners
                    this.fireEvent("failure", this, msg, Array.prototype.slice.call(arguments));
                },
                scope : this
            }
        });
        //Grid che mostra la lista dei campi disponibili dello schema segnalazioni
        var seg_schema_grid = {
            xtype : 'editorgrid',
            title : this.noticeTitle,
            store : this.seg_fieldStore,
            flex : 1,
            ref : '../seg_schema_grid',
            autoScroll : true,

            cm : new Ext.grid.ColumnModel([{
                id : "name",
                header : this.sColName,
                dataIndex : "name",
                sortable : true
            }, {
                id : "type",
                header : this.sColType,
                dataIndex : "type",
                sortable : true,
                renderer : {
                    fn : function(v) {
                        return v.substr(v.indexOf(':') + 1);
                    }
                }
            }, {
                id : "alias",
                header : this.sColAlias,
                dataIndex : "_alias",
                sortable : true,
                editor : new Ext.form.TextField({
                    allowBlank : false
                }),
                hidden : true
            }, segFields = new Ext.grid.CheckColumn({
                width : 120,
                header : this.sColMainFields,
                dataIndex : '_mainfields',
                id : 'mainFields',
                hidden : true,
                editor : new Ext.form.Checkbox()
            }), hisFields = new Ext.grid.CheckColumn({
                width : 120,
                header : this.sColHisFields,
                dataIndex : '_histfields',
                id : 'histFields',
                hidden : true,
                editor : new Ext.form.Checkbox()
            })]),
            sm : new Ext.grid.RowSelectionModel({
                singleSelect : true
            }),
            autoExpandColumn : "name",

        };

        //Grid che mostra la lista dei campi disponibili dello schema sopralluoghi
        var sop_schema_grid = {

            xtype : 'editorgrid',
            ref : '../sop_schema_grid',
            title : this.surveyTitle,
            store : this.sop_fieldStore,
            flex : 1,
            autoScroll : true,
            cm : new Ext.grid.ColumnModel([{
                id : "name",
                header : this.sColName,
                dataIndex : "name",
                sortable : true
            }, {
                id : "type",
                header : this.sColType,
                dataIndex : "type",
                sortable : true,
                renderer : {
                    fn : function(v) {
                        return v.substr(v.indexOf(':') + 1);
                    }
                }
            }, {
                id : "alias",
                header : this.sColAlias,
                dataIndex : "_alias",
                sortable : true,
                editor : new Ext.form.TextField({
                    allowBlank : false
                }),
                hidden : true
            }, sopFields = new Ext.grid.CheckColumn({
                width : 120,
                header : this.sColSopFields,
                dataIndex : '_sopfields',
                id : 'sopFields',
                hidden : true,
                editor : new Ext.form.Checkbox()
            })]),
            sm : new Ext.grid.RowSelectionModel({
                singleSelect : true
            }),
            autoExpandColumn : "name"

        };

        var comboTemplate = {
            xtype : 'compositefield',
            items : [{
                xtype : "label",
                text : this.selectDbLabel,
                width : 80,
                style : {
                    marginTop : '3px',

                }
            }, this.comboSource, {
                xtype : "label",
                text : "Template",
                width : 130,
                ref : "../../comboTemplateLabel",
                style : {
                    marginTop : '3px',

                    marginLeft : '30px'
                },
            }, {
                xtype : "msm_templatecombobox",
                width : 175,
                allowBlank : true,
                disabled : true,
                ref : "../../comboTemplate",
                mode:'local',
                templatesCategoriesUrl : '',
                auth : userInfo.token,
                listeners : {
                    storeload : function(store, combo) {
                        if (this.templateId) {
                            combo.setValue(this.templateId);
                        var rec =store.getById(this.templateId);
                        var idx = store.indexOf(rec);
                            combo.fireEvent("select",combo, rec, idx);
                        }
                    },
                select : function(combo, record, index) {
                    var field = this.rForm.general.getForm().findField('attribute.templateId');
                    field.setValue(record.get('id'));
                    this.rForm.setLoading(true, this.loadingMessage);
                    var me = this;
                    this.rForm.resourceManager.findByPk(record.get('id'),
                    //Full Resource Load Success
                    function(data) {
                        if (data) {
                            me.templateResource = data;
                            me.template = data.blob;
                            me.comboTemplate.disable();
                            //me.comboTemplateLabel.hide();
                            var pr = new OpenLayers.Format.JSON();
                            me.template = pr.read(me.template);
                            me.getTemplateConfigPlugin();
                            me.addTemplateValuesSop(me.sop_fieldStore);
                            me.addTemplateValuesSeg(me.seg_fieldStore);

                        }
                        me.rForm.setLoading(false);
                        //TODO load visibility
                    }, {
                        full : true
                    });
                },
                scope : this
                }
            }]
        };

        //Creo il pannello principale che contiene la mission db
        //TODO::sistmare layout delle grid con i parametri per ora sono una sopra l'altra

        //Setto le impostazioni di base del panel!!
        this.frame = true;
        this.layout = 'anchor';
        this.iconCls = 'gc_db_resource_edit';

        this.border = false;
        this.autoScroll = true;
        this.items = [{
            xtype : 'panel',
            frame : true,
            layout : 'fit',
            anchor : '100%, 10%',

            border : false,
            items : [comboTemplate]
        }, {
            xtype : 'panel',
            frame : true,
            anchor : '100%, 90%',
            layout : {
                type : 'hbox',
                align : 'stretch'
            },
            autoScroll : true,
            border : false,
            items : [seg_schema_grid, sop_schema_grid]
        }];
        this.on('render', function() {
            this.comboTemplate.getStore().proxy.setUrl(this.rForm.geoStoreBase + '/extjs/search/category' + "/TEMPLATE", true);
            this.comboTemplate.getStore().load();
        }, this);
        mxp.widgets.GcDbResourceEditor.superclass.initComponent.call(this, arguments);
    },

    //Inizilizza il describelayer store per vedere se un layer wms  è  anche wfs!!
    initDescribeLayerStore : function() {
        this.waitIdx++;

        var req = this.dbstore.reader.raw.capability.request.describelayer;

        var bParams = rec.store.baseParams;
        bParams.REQUEST = "DescribeLayer";
        if (req) {
            return new GeoExt.data.WMSDescribeLayerStore({
                url : req.href,
                autoload : true,
                baseParams : bParams,
                sortInfo : {
                    field : 'layerName',
                    direction : 'ASC'
                },

            });
        }
    },

    //DA aggiungere distruzione degli store e gestioni eccezioni lato srver

    updateDescibe : function(rec) {
        var describeLayerStore = this.initDescribeLayerStore();
        describeLayerStore.load({
            params : {
                LAYERS : rec.data.name,
            },
            add : true,
            callback : this.getValidSegLayer,
            scope : this,
            id : rec.id //passo id che se non esiste il describe leayer lo elimino
        });

    },

    //Riceve le risposte del DescribeLayerStor e se valide aggiunge i nuovi valori (wmsDescribeLayer) ai record del WMScapabilities
    getValidSegLayer : function() {

        this.waitIdx--;
        var recs = Ext.isArray(arguments[1]) ? arguments[1] : arguments[0];
        var obj = Ext.isObject(arguments[1]) ? arguments[1] : arguments[0];
        if (arguments[2]) {
            //recupera il layer e fondi informazioni
            Ext.applyIf(this.dbstore.getById(obj.id).data, recs[0].data);

        } else {
            //non ha describ layer rimuovo dalla lista
            this.dbstore.remove(this.dbstore.getById(obj.id));
        }
        this.fireDbReady(this);

    },
    /**
     *
     * Set the value in combo source if the rec exist and fire event
     * if fail return false
     */

    setComboValue : function(val) {

        idx = this.dbstore.find('typeName', val);

        if (idx > -1) {//SE TROVO PER TYPENAME ALLORA SETTO
            rec = this.dbstore.getAt(idx);
            this.comboSource.setValue(rec.get("name"));
            this.comboSource.fireEvent("select", this.comboSource, rec, idx);
            return true;

        } else {
            this.comboSource.reset();
            return false;
        }
    },
    //Se ho controllato tutti i layea fire dbready altrimenti aspetto
    fireDbReady : function(scope) {

        //Se è a 0 è pronto altrimenti qualcosa è andato storto
        if (scope.waitIdx == 0)
            scope.dbstore.fireEvent("dbready", scope.dbstore);

    },
    //Se ho caricato entrambi gli schemi fire ready altrimenti aspetto

    fireReady : function(scope) {

        if (scope.seg_fieldStore.getCount() > 0 && scope.sop_fieldStore.getCount() > 0) {
               this.comboTemplate.getStore().load();
            if (scope.firstCall) {
                scope.fireEvent("ready", scope);
                scope.firstCall = false;
                if (this.isLoaded) {
                    this.comboSource.disable();
                    scope.fireEvent("resLoaded", scope);
                }
            } else
                scope.fireEvent("change", scope);
        }

    },
    //Api method for Resource Editor  TODO:: implementare
    getResourceData : function() {
        if (this.template && this.template.customTools) {
            this.setGcFeatureGrid();
            this.setGcSegGrid();
            this.setHistoryGrid();
            this.setSopGrid();
        }
        if (this.typeName) {
            idx = this.dbstore.find('typeName', this.typeName);
            rec = this.dbstore.getAt(idx);
            schema_seg = {
                "type" : rec.get('owsType'), // Type of the service (currently only JSON format is supported)
                "URL" : this.gcSource, // WFS url
                "typeName" : this.typeName, // typeName to ask for
                "localSourceStore" : rec.get('name'), // local device table name
                "fields" : this.getFieldsObj(this.seg_fieldStore)
                //TODO::manca ordering field ma si prende ad altro panel
            };
            schema_sop = {
                "localFormStore" : rec.get('name') + "_sop", // local device table name
                "fields" : this.getFieldsObj(this.sop_fieldStore)
            };

            return {
                "schema_seg" : schema_seg,
                "schema_sop" : schema_sop
            };
        }
    },
    //Preoara oggetto con fields  {nome:type,nome:type}
    getFieldsObj : function(store) {
        //TODO customiza here type conversion
        var transformType = {
            'int' : 'integer'
        };
        var recObj = {};
        store.each(function(rec) {
            var type = rec.get('type').split(':')[1];
            type = (transformType[type]) ? transformType[type] : type;
            recObj[rec.get('name')] = type;
        });
        return recObj;
    },

    loadResourceData : function(resource, templateId) {
        s_seg = resource;
        if (templateId) {
            this.templateId=templateId;
        }

        //Se esiste schema recupero ed inizializzo
        //Non ho altro da fare perchè tutte le info le recupero dallo stor
        if (s_seg && s_seg.typeName && this.typeName != s_seg.typeName) {
            this.typeName = s_seg.typeName;
            this.setComboValue(this.typeName);
        } else if (this.typeName == s_seg.typeName)
            this.fireEvent("resLoaded", this);
        this.isLoaded = true;
        //per ora disabilito

    },
    canCommit : function() {
        //se ho la source settata posso esportare
        if (this.typeName)
            return true;
        else
            return false;
    },

    //qui mostro tutti i campi
    //ripulisce i type dai prefissi xsd e elimina campi geometry
    cleanType : function(store) {
        for ( i = 0,
        ilen = store.getCount(); i < ilen; i++) {
            var type = store.getAt(i).get("type");
            ctype = type.substr(type.indexOf(':') + 1);
            store.getAt(i).set("ctype", ctype);
        }

    },
    //Update map template with new propertyNames
    setGcFeatureGrid : function() {
        if (!this.gcFeatureEditor)
            return;
        var np = this.getPropertyNames(this.seg_fieldStore);
        var p = this.gcFeatureEditor.propertyNames;
        if (!p || this._objPropCount(np) != this._objPropCount(p)) {
            this.templateDirty = true;
            this.gcFeatureEditor.propertyNames = np;
        } else {
            Ext.iterate(np, function(key) {
                if (np[key] != p[key]) {
                    this.templateDirty = true;
                    this.gcFeatureEditor.propertyNames = np;
                    return true;
                }
            }, this);
        }

    },
    _objPropCount : function(obj) {
        var n = 0;
        Ext.iterate(obj, function(k) {
            n++;
        });
        return n;

    },
    setGcSegGrid : function() {
        if (!this.gcSegGrid)
            return;
        var newMF = this.getMainFields(this.seg_fieldStore);
        var mF = this.gcSegGrid.mainFields;
        if (!mF || newMF.length != mF.length) {
            this.templateDirty = true;
            this.gcSegGrid.mainFields = newMF;
        } else {
            var me = this;
            Ext.each(newMF, function(key) {
                if (mF.indexOf(key) == -1) {
                    me.templateDirty = true;
                    me.gcSegGrid.mainFields = newMF;
                    return false;
                }
            });
        }
        var cConf = this.gcSegGrid.colConfig;

        var newConf = this.getColConfig(this.gcSegGrid.mainFields, this.gcFeatureEditor.propertyNames);
        if (!cConf || this._objPropCount(newConf) != this._objPropCount(cConf)) {
            this.templateDirty = true;
            this.gcSegGrid.colConfig = newConf;
        } else {
            for (var key in newConf) {
                if (!cConf[key] || newConf[key].header != cConf[key].header) {
                    this.templateDirty = true;
                    this.gcSegGrid.colConfig = newConf;
                    break;
                }

            }
        }

    },
    setHistoryGrid : function() {
        if (!this.gcHistoryGrid)
            return;
        var newHistIgnore = this.getHistoryIgnoreFields(this.seg_fieldStore);
        var hIgnore = this.gcHistoryGrid.ignoreFields;
        if (!hIgnore || hIgnore.length != newHistIgnore.length) {
            this.templateDirty = true;
            this.gcHistoryGrid.ignoreFields = newHistIgnore;
        } else {
            var me = this;
            Ext.each(newHistIgnore, function(key) {
                if (hIgnore.indexOf(key) == -1) {
                    me.templateDirty = true;
                    me.gcHistoryGrid.ignoreFields = newHistIgnore;
                    return false;
                }
            });
        }
        var cConf = this.gcHistoryGrid.colConfig;

        var newConf = this.getHistoryColConfig(this.gcFeatureEditor.propertyNames);
        if (!cConf || this._objPropCount(newConf) != this._objPropCount(cConf)) {
            this.templateDirty = true;
            this.gcHistoryGrid.colConfig = newConf;
        } else {
            for (var key in newConf) {
                if (!cConf[key] || newConf[key].header != cConf[key].header) {
                    this.templateDirty = true;
                    this.gcHistoryGrid.colConfig = newConf;
                    break;
                }

            }
        }

    },
    setSopGrid : function() {
        if (!this.gcSopGrid)
            return;
        var newSopIgnore = this.getSopIgnoreFields(this.sop_fieldStore);
        var sIgnore = this.gcSopGrid.ignoreFields;
        if (!sIgnore || sIgnore.length != newSopIgnore.length) {
            this.templateDirty = true;
            this.gcSopGrid.ignoreFields = newSopIgnore;
        } else {
            var me = this;
            Ext.each(newSopIgnore, function(key) {
                if (sIgnore.indexOf(key) == -1) {
                    me.templateDirty = true;
                    me.gcSopGrid.ignoreFields = newSopIgnore;
                    return false;
                }
            });
        }
        var np = this.getSopPropertyNames(this.sop_fieldStore);
        var p = this.gcSopGrid.propertyNames;
        if (!p || this._objPropCount(np) != this._objPropCount(p)) {
            this.templateDirty = true;
            this.gcSopGrid.propertyNames = np;
        } else {
            for (var key in np) {
                if (!p[key] || np[key].header != p[key].header) {
                    this.templateDirty = true;
                    this.gcSopGrid.propertyNames = np;
                    break;
                }
            }
        }

    },
    getSopIgnoreFields : function(store) {
        var ignoreFileds = [];
        if (this.gcSopGrid) {
            store.each(function(r) {
                var n = r.get('name');
                if (! r.get('_sopfields'))
                    ignoreFileds.push(n);
            });
        }
        return ignoreFileds;

    },

    getHistoryColConfig : function(propertyNames) {
        var colConfig = {};
        for (var key in propertyNames) {
            colConfig[key] = {
                header : propertyNames[key]
            };
        }

        return colConfig;

    },
    getSopPropertyNames : function(store) {
        var propertyNames = {};
        if (this.gcSopGrid) {
            store.each(function(r) {
                var n = r.get('name');
                var a = r.get('_alias');
                if (n != a || (r.modified._alias && a != r.modified._alias))
                    propertyNames[n] = a;
            });
        }
        return propertyNames;

    },

    getHistoryIgnoreFields : function(store) {
        var ignoreFileds = [];
        if (this.gcHistoryGrid) {
            store.each(function(r) {
                var n = r.get('name');
                if (! r.get('_histfields'))
                    ignoreFileds.push(n);
            });
        }
        return ignoreFileds;

    },
    getColConfig : function(mainFields, propertyNames) {
        var colConfig = {};
        Ext.each(mainFields, function(f) {
            if (propertyNames[f])
                colConfig[f] = {
                    header : propertyNames[f]
                };
        });
        return colConfig;
    },

    getPropertyNames : function(store) {
        var propertyNames = {};
        if (this.gcFeatureEditor) {
            store.each(function(r) {
                var n = r.get('name');
                var a = r.get('_alias');
                if (n != a || (r.modified._alias && a != r.modified._alias))
                    propertyNames[n] = a;
            });
        }
        return propertyNames;

    },
    getMainFields : function(store) {
        var mainFields = [];
        if (this.gcSegGrid) {
            store.each(function(r) {
                var n = r.get('name');

                if (r.get('_mainfields'))
                    mainFields.push(n);
            });
        }
        return mainFields;

    },
    getTemplateConfigPlugin : function() {
        var me = this;
        if (this.template.customTools)
            Ext.each(this.template.customTools, function(t) {
                if (t.ptype === "gxp_gcfeatureeditor") {
                    me.gcFeatureEditor = t;
                } else if (t.ptype === "gxp_gcseggrid") {
                    me.gcSegGrid = t;
                    me.gcHistoryGrid = me.gcSegGrid.configHistory;
                    me.gcSopGrid = me.gcSegGrid.configSurvey;
                    ;
                }

            });

    },
    addTemplateValuesSeg : function(store) {
        var me = this;

        if (me.gcFeatureEditor) {
            //attivare colonna!
            this.seg_schema_grid.getColumnModel().setHidden(2, false);
            var pnames = me.gcFeatureEditor.propertyNames;
            store.each(function(r) {
                var n = r.get('name');
                r.set('_alias', (pnames && pnames[n]) ? pnames[n] : n);
                 r.commit();
            });
        }
        if (me.gcSegGrid) {
            //attivare colonna!
            this.seg_schema_grid.getColumnModel().setHidden(3, false);
            var mainFields = me.gcSegGrid.mainFields;
            if (!mainFields) {
                mainFields = [];
            }
            store.each(function(r) {
                var n = r.get('name');
                r.set('_mainfields', (mainFields.indexOf(n) > -1));
                 r.commit();
            });
        }
        if (me.gcHistoryGrid) {
            //attivare colonna!
            this.seg_schema_grid.getColumnModel().setHidden(4, false);
            var histFields = me.gcHistoryGrid.ignoreFields;
            if (!histFields) {
                histFields = [];
            }
            store.each(function(r) {
                var n = r.get('name');
                r.set('_histfields', (histFields.indexOf(n) == -1));
                r.commit();
            });
        }

    },
    addTemplateValuesSop : function(store) {
        var me = this;

        if (me.gcSopGrid) {
            //attivare colonna!
            this.sop_schema_grid.getColumnModel().setHidden(2, false);
            var pnames = me.gcSopGrid.propertyNames;
            store.each(function(r) {
                var n = r.get('name');
                r.set('_alias', (pnames && pnames[n]) ? pnames[n] : n);
                r.commit();
            });
            this.sop_schema_grid.getColumnModel().setHidden(3, false);
            var sopFields = me.gcSopGrid.ignoreFields;
            store.each(function(r) {
                var n = r.get('name');
                r.set('_sopfields', (sopFields && sopFields.indexOf(n) == -1));
                 r.commit();
            });

        }

    },

    //Ritorna store segnalazione clonato
    getSeg_Store : function() {

        new_seg = new GeoExt.data.AttributeStore({
            fields : this.parseFieldsSeg,
            proxy : new Ext.data.MemoryProxy(this.seg_fieldStore.reader.raw.featureTypes[0].properties)
        });

        return new_seg;

    },

    getSop_Store : function() {
        new_sop = new GeoExt.data.AttributeStore({
            fields : this.parseFieldsSop,
            proxy : new Ext.data.MemoryProxy(this.sop_fieldStore.reader.raw.featureTypes[0].properties)
        });

        return new_sop;

    }
});
Ext.reg(mxp.widgets.GcDbResourceEditor.prototype.xtype, mxp.widgets.GcDbResourceEditor);
