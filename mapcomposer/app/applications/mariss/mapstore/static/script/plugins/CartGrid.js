/** api: (define)
 *  module = gxp.npa.grid
 *  class = FootprintsGrid
 */
Ext.namespace("gxp.plugins.npa");

/** api: constructor
 *  .. class:: FootprintsGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      ``GeoExt.data.FeatureStore`` for Scheduled Capacities .
 */
gxp.plugins.npa.CartGrid = Ext.extend(gxp.plugins.ClickableFeatures, {
    ptype: 'npa_cart_grid',


    btnRemoveElementTooltip: "Remove Element",
    removeMsgTitle: "Remove Elements",
    removeMsg: "Do You Really Want Remove Selected Elements?",
    activeGroup: null,
    addOutput: function(config) {
        //this.ignoreFields = (config) ? [].concat(config.ignoreFields) : [];
        this.map = this.target.mapPanel.map;
        this.ownerTitle = Ext.getCmp(this.outputTarget).title;
        this.layerTree = Ext.getCmp("layertree");
        var treeRoot = this.layerTree.getRootNode();


        // a minimal SelectFeature control - us

        this.cartGrid = gxp.plugins.npa.CartGrid.superclass.addOutput.call(this, this.createGrid());
        return this.cartGrid;
    },
    /**
     * :api method[loadElement]
     * :arg row:  ``Ext.data.Record``
     * :org type:  ``String``
     * Load Element to grid store
     * 
     * */
    loadElement: function(row, type) {
        var fManager = this.target.tools.cartProductFeatureManager;
        var srcStore = fManager.featureStore; // the store that is a source for the record to show in cart grid.

        var data = row.data;
        // a function to query all parts of a selected product.
        var queryFun = function(record, recordId) {
            return record.data.servicename == data.servicename &&
                record.data.identifier == data.identifier;
        };

        // get an array of formatted record from query results
        var getRecordArray = function(queryStoreResults) {
            var storeFieldList = this.cartGrid.getStore().fields.keys;
            var recordList = [];
            for (var i = 0; i < queryStoreResults.items.length; i++) {
                var item = queryStoreResults.items[i].data;
                var record = {};
                for (var j = 0; j < storeFieldList.length; j++) {
                    var fieldName = storeFieldList[j];
                    switch (fieldName) {
                        case 'bounds':
                            record[fieldName] = item.feature.geometry.getBounds();
                            break;
                        case 'id':
                            record[fieldName] = item.fid;
                            break;
                        default:
                            record[fieldName] = item[fieldName];
                    }
                }
                recordList.push(record);
            }
            return recordList;
        };

        // all the records of the clicked product to list in cart grid
        var recordsToAdd = getRecordArray.call(this, srcStore.queryBy(queryFun));

        // removes the records that are already listed in cart
        for (var rIndex = 0; rIndex < recordsToAdd.length; rIndex++) {
            var alreadyExistRecord = this.cartGrid.getStore().getById(recordsToAdd[rIndex].id);
            if (alreadyExistRecord != undefined)
                recordsToAdd.splice(rIndex, 1);
        }

        //sorts records by product-identifier and feature-id and lists they in cart grid.
        this.cartGrid.getStore().loadData(recordsToAdd, true);
        this.cartGrid.getStore().sort([{
            field: 'identifier',
            direction: 'ASC'
        }, {
            field: 'id',
            direction: 'ACS'
        }]);
        this.cartGrid.ownerCt.setTitle(this.ownerTitle + " (" + this.cartGrid.getStore().getCount() + " elements)");
        this.cartGrid.ownerCt.doLayout();
        /*
        if (this.cartTypes && this.cartTypes[type])
            var desc = data[this.cartTypes[type].description];

        var gId = new Ext.XTemplate(this.gIdTmp).apply(data);
        var nRec = {
            id: gId,
            fid: data.fid,
            identifier: data.identifier,
            layerlist: data.layerlist,
            originalfilepath: data.originalfilepath,
            sartypelist: data.sartypelist,
            servicename: data.servicename,
            state: data.state,
            time: data.time,
            variablelist: data.variablelist,
            bounds: data.feature.geometry.getBounds()
        };
        var rec = this.cartGrid.getStore().getById(gId);
        if (!rec) {
            this.cartGrid.getStore().loadData([nRec], true);
            this.cartGrid.ownerCt.setTitle(this.ownerTitle + " (" + this.cartGrid.getStore().getCount() + " elements)");
            this.cartGrid.ownerCt.doLayout();
        }
        */
    },
    createGrid: function() {
        var storeFields = [
            'id',
            'bounds',
            'servicename',
            'identifier',
            'time',
            'variable',
            'sartype',
            'outfilelocation',
            'originalfilepath',
            'layername',
            'partition'
        ];
        var store = new Ext.data.JsonStore({
            fields: storeFields,
            idIndex: 0,
            proxy: new Ext.data.MemoryProxy()
        });

        var sm = new Ext.grid.CheckboxSelectionModel();
        var cm = new Ext.grid.ColumnModel([sm].concat(this.getColumns(store)));

        var tbar = [{
                iconCls: 'icon-groupaction',
                tooltip: "Create New Layers Group",
                text: "",
                hidden: true,
                handler: function(btn) {
                    var recs = sm.getSelections();
                    var me = this;
                    recs.forEach(function(r) {
                        me.createGroup(r);
                    });

                },
                scope: this
            }, {
                iconCls: 'icon-groupdownload',
                tooltip: "Download Data",
                text: "",

                handler: function(btn) {
                    var recs = sm.getSelections();
                    if (recs.length > 0) {
                        // requestBody structure:
                        // {
                        //     serivename_0: {
                        //         identifier_0-0: [filepath_0-0-0, filepath_0-0-1, ..., filepath_0-0-n],
                        //         identifier_0-1: [filepath_0-1-0, filepath_0-1-1, ..., filepath_0-1-m],
                        //         ...
                        //         identifier_0-x: [filepath_0-x-0, filepath_0-x-1, ..., filepath_0-0-y]
                        //     },
                        //     ...
                        // }
                        //
                        // selected items are grouped by identifiers and
                        // identifiers are gouped by servicenames
                        var requestBody = {};
                        for (var r = 0; r < recs.length; r++) {
                            var recServiceId = recs[r].data.servicename;
                            if (!requestBody[recServiceId])
                                requestBody[recServiceId] = {};

                            var recProdId = recs[r].data.identifier;
                            if (!requestBody[recServiceId][recProdId])
                                requestBody[recServiceId][recProdId] = [];

                            var recDownloadFilePath = recs[r].data.outfilelocation;
                            requestBody[recServiceId][recProdId].push(recDownloadFilePath);
                        }
                        var win = new Ext.Window({
                            title: 'Download data - Request payload',
                            modal: true,
                            layout: 'fit',
                            height: 400,
                            width: 400,
                            items: [{
                                xtype: 'textarea',
                                readOnly: true,
                                value: Ext.util.JSON.encode(requestBody)
                            }],
                            buttons: [{
                                text: 'Ok',
                                handler: function(btn){
                                    btn.ownerCt.ownerCt.close();
                                }
                            }]
                        });
                        win.show();
                        Ext.Ajax.request({
                            method: 'POST',
                            url: 'ajax_demo/sample.json',
                            jsonData: requestBody,
                            success: function(response, opts) {
                                var obj = Ext.decode(response.responseText);
                                console.dir(obj);
                            },
                            failure: function(response, opts) {
                                console.log('server-side failure with status code ' + response.status);
                            }
                        });
                    }
                },
                scope: this
            }, '-', {
                tooltip: this.btnRemoveElementTooltip,
                iconCls: "delete",
                handler: function(btn) {
                    var recs = sm.getSelections();
                    if (recs.length > 0) {
                        Ext.Msg.show({
                            title: this.removeMsgTitle,
                            msg: this.removeMsg,
                            buttons: Ext.Msg.YESNOCANCEL,

                            fn: function(res) {
                                if (res == 'yes')
                                    var me = this;
                                recs.forEach(function(r) {
                                    store.remove(r);
                                    me.cartGrid.ownerCt.setTitle(me.ownerTitle + " (" + me.cartGrid.getStore().getCount() + " elements)");
                                });
                                this.filteredGroup = null;
                            },
                            scope: this,
                            animEl: 'elId',
                            icon: Ext.MessageBox.QUESTION
                        });
                    }

                },
                scope: this

            }

        ];
        var config = {
            xtype: "grid",
            store: store,
            cm: cm,
            sm: sm,
            tbar: tbar,
            layout: 'fit',
            autoScroll: true,
        };
        return config;

    },
    /** private: method[selectTreeNode]
     *  :arg record:  ``Ext.data.Record``
     *  Select layers group node in layers tree 
     **/
    selectTreeNode: function(r) {
        var tree = this.layerTree;
        var gId = r.id;
        var groupNode = tree.getNodeById(gId);
        if (groupNode && !groupNode.isSelected()) {
            groupNode.select();
            this.filterInfoManager(r);
        }
    },
    getColumns: function(store) {
        function getRenderer(format) {
            return function(value) {
                //TODO When http://trac.osgeo.org/openlayers/ticket/3131
                // is resolved, change the 5 lines below to
                // return value.format(format);
                var date = value;
                if (typeof value == "string") {
                    date = Date.parseDate(value.replace(/Z$/, ""), "c");
                }
                return date ? date.format(format) : value;
            };
        }

        var columns = [];
        columns.push({
            xtype: 'actioncolumn',
            header: "",
            width: 30,
            position: 1,
            hidden: false,
            scope: this,
            items: [{
                iconCls: 'zoomaction',
                tooltip: "ZoomTo",
                text: 'ZoomTo',

                handler: function(grid, rowIndex, colIndex) {
                    var store = grid.getStore();
                    var row = store.getAt(rowIndex);
                    var bounds = row.json.bounds;
                    if (bounds) {
                        this.map.zoomToExtent(bounds);
                    }
                }
            }]
        });
        /*  columns.push({
        xtype: 'checkcolumn',
        width: 30});
*/
        var name, type, xtype, format, renderer;
        (this.schema || store.fields).each(function(f) {
            if (this.schema) {
                name = f.get("name");
                type = f.get("type").split(":").pop();

                format = null;
                switch (type) {
                    case "date":
                        format = this.dateFormat;
                    case "dateTime":
                        format = format ? format : this.dateFormat + " " + this.timeFormat;
                        xtype = undefined;
                        renderer = getRenderer(format);
                        break;
                    case "boolean":
                        xtype = "booleancolumn";
                        break;
                    case "string":
                        xtype = "gridcolumn";
                        break;
                    default:
                        xtype = "numbercolumn";
                }
            } else {
                name = f.name;
            }
            if (this.ignoreFields.indexOf(name) === -1) {
                var colHeader = (this.outputConfig.propertyNames && this.outputConfig.propertyNames[name] ? this.outputConfig.propertyNames[name] : name.replace("_", " "));
                renderer = (name == 'time' ? getRenderer(this.outputConfig.timeFormat) : undefined);
                columns.push({
                    dataIndex: name,
                    header: colHeader,
                    width: 150,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    renderer: xtype ? undefined : renderer
                });
            }
        }, this);

        return columns;
    },
});
Ext.preg(gxp.plugins.npa.CartGrid.prototype.ptype, gxp.plugins.npa.CartGrid);