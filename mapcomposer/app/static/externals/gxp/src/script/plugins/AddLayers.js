/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @requires plugins/Tool.js
 * @requires widgets/NewSourceWindow.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = AddLayers
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AddLayers(config)
 *
 *    Plugin for removing a selected layer from the map.
 *    TODO Make this plural - selected layers
 */
gxp.plugins.AddLayers = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addlayers */
    ptype: "gxp_addlayers",
    
	id: "addlayers",
	
    /** api: config[addActionMenuText]
     *  ``String``
     *  Text for add menu item (i18n).
     */
    addActionMenuText: "Add layers",

    /** api: config[addActionTip]
     *  ``String``
     *  Text for add action tooltip (i18n).
     */
    addActionTip: "Add layers",
    
    /** api: config[addActionText]
     *  ``String``
     *  Text for the Add action. None by default.
     */
   
    /** api: config[addServerText]
     *  ``String``
     *  Text for add server button (i18n).
     */
    addServerText: "Add a New Server",

    /** api: config[addButtonText]
     *  ``String``
     *  Text for add layers button (i18n).
     */
    addButtonText: "Add layers",
    
    /** api: config[removeFilterText]
     *  ``String``
     *  Text for clearing layer filter (i18n).
     */
    removeFilterText: "Clear filter", 

    /** api: config[filterEmptyText]
     *  ``String``
     *  Text to show up when no filter is specified (i18n).
     */
    filterEmptyText: "Filter",     

    /** api: config[untitledText]
     *  ``String``
     *  Text for an untitled layer (i18n).
     */
    untitledText: "Untitled",

    /** api: config[addLayerSourceErrorText]
     *  ``String``
     *  Text for an error message when WMS GetCapabilities retrieval fails (i18n).
     */
    addLayerSourceErrorText: "Error getting WMS capabilities ({msg}).\nPlease check the url and try again.",

    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the available layers (i18n).
     */
    availableLayersText: "Available Layers",

    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the grid expander (i18n).
     */
    expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>",
    
    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the layer title (i18n).
     */
    panelTitleText: "Title",

    /** api: config[availableLayersText]
     *  ``String``
     *  Text for the layer selection (i18n).
     */
    layerSelectionText: "View available data from:",
    
    /** api: config[instructionsText]
     *  ``String``
     *  Text for additional instructions at the bottom of the grid (i18n).
     *  None by default.
     */
    
    /** api: config[doneText]
     *  ``String``
     *  Text for Done button (i18n).
     */
    doneText: "Done",

    /** api: config[upload]
     *  ``Object | Boolean``
     *  If provided, a :class:`gxp.LayerUploadPanel` will be made accessible
     *  from a button on the Available Layers dialog.  This panel will be 
     *  constructed using the provided config.  By default, no upload 
     *  functionality is provided.
     */
    
    /** api: config[uploadText]
     *  ``String``
     *  Text for upload button (only renders if ``upload`` is provided).
     */
    uploadText: "Upload Data",

    /** api: config[nonUploadSources]
     *  ``Array``
     *  If ``upload`` is enabled, the upload button will not be displayed for 
     *  sources whose identifiers or URLs are in the provided array.  By 
     *  default, the upload button will make an effort to be shown for all 
     *  sources with a url property.
     */

    /** api: config[relativeUploadOnly]
     *  ``Boolean``
     *  If ``upload`` is enabled, only show the button for sources with relative
     *  URLs (e.g. "/geoserver").  Default is ``true``.
     */
    relativeUploadOnly: true,

    /** api: config[startSourceId]
     * ``Integer``
     * The identifier of the source that we should start with.
     */
    startSourceId: null,
    
    /** private: property[selectedSource]
     *  :class:`gxp.plugins.LayerSource`
     *  The currently selected layer source.
     */
    selectedSource: null,
	
	iconCls: "gxp-icon-addlayers",
	
	hideByDefault: false,
    
    /** api: config[availableSources]
     *  ``Array``
     *  List of available sources for Add Server, with related configuration.
     */
    availableSources: [
        {
            name: 'WMS',
            description: 'Web Map Service (WMS)',
            config: {
                ptype : 'gxp_wmscsource'
            }
        },
        {
            name: 'WMTS-KVP',
            description: 'Web Map Tile Service KVP (WMTS)',
            config: {
                ptype : 'gxp_wmtssource',
                preferredEncoding : 'KVP'
            }
        },
        {
            name: 'WMTS-REST',
            description: 'Web Map Tile Service REST (WMTS)',
            config: {
                ptype : 'gxp_wmtssource',
                preferredEncoding : 'REST'
            }
        },
        {
            name: 'TMS',
            description: 'Tiled Map Service (TMS)',
            config: {
                ptype : 'gxp_tmssource'
            }
        }
    ],
    
    /** api: config[additionalSources]
     *  ``Array``
     *  List of sources to be added to default availableSources.
     */
    additionalSources: [],
    

    /** private: method[constructor]
     */
    constructor: function(config) {
        this.addEvents(
            /** api: event[sourceselected]
             *  Fired when a new source is selected.
             *
             *  Listener arguments:
             *
             *  * tool - :class:`gxp.plugins.AddLayers` This tool.
             *  * source - :class:`gxp.plugins.LayerSource` The selected source.
             */
            "sourceselected"
        );
        gxp.plugins.AddLayers.superclass.constructor.apply(this, arguments);        
    },
    
    /** api: method[addActions]
     */
    addActions: function() {
        var selectedLayer;        
        var actions = gxp.plugins.AddLayers.superclass.addActions.apply(this, [{
            tooltip : this.addActionTip,
            text: this.addActionText,
            menuText: this.addActionMenuText,
            disabled: true,
			hidden: this.hideByDefault,
            iconCls: "gxp-icon-addlayers",
            handler : this.showCapabilitiesGrid,
            scope: this
        }]);
        
        this.target.on("ready", function() {actions[0].enable();});
        return actions;
    },
        
    /** api: method[showCapabilitiesGrid]
     * Shows the window with a capabilities grid.
     */
    showCapabilitiesGrid: function() {
        if(!this.capGrid) {
            this.initCapGrid();
        }
        this.capGrid.show();
    },

    /**
     * private: method[initCapGrid]
     * Constructs a window with a capabilities grid.
     */
    initCapGrid: function() {
        var source, data = [];        
        for (var id in this.target.layerSources) {
            source = this.target.layerSources[id];
            if (source.store) {
                data.push([id, source.title || id]);                
            }
        }
        var sources = new Ext.data.ArrayStore({
            fields: ["id", "title"],
            data: data
        });

        var expander = this.createExpander();
        
        var addLayers = function() {
            
            var apptarget = this.target;
           // var locCode= GeoExt.Lang.locale;
            var key = this.sourceComboBox.getValue();
            var layerStore = this.target.mapPanel.layers;
            var source = this.target.layerSources[key];
            var records = capGridPanel.getSelectionModel().getSelections();
            var record;
            var defaultProps;
            
            for (var i=0, ii=records.length; i<ii; ++i) {
                
                defaultProps = {
				    name: records[i].get("name"),
					title: records[i].get("title"),
                    source: key
                };

                record = source.createLayerRecord(defaultProps); 
                  
                if (record) {
                    if (record.get("group") === "background") {
                        layerStore.insert(0, [record]);
                    } else {
                        layerStore.add([record]);

                        if(records.length == 1){
							var layer = record.get('layer');
							var extent = layer.restrictedExtent || layer.maxExtent || this.target.mapPanel.map.maxExtent;
							var map = this.target.mapPanel.map;

							// respect map properties
							var restricted = map.restrictedExtent || map.maxExtent;
							if (restricted) {
								extent = new OpenLayers.Bounds(
									Math.max(extent.left, restricted.left),
									Math.max(extent.bottom, restricted.bottom),
									Math.min(extent.right, restricted.right),
									Math.min(extent.top, restricted.top)
								);
							}

							map.zoomToExtent(extent, true);
						}
                    }
                }
            }
            
            apptarget.modified = true;
        };

        var idx = 0;
        if (this.startSourceId !== null) {
            sources.each(function(record) {
                if (record.get("id") === this.startSourceId) {
                    idx = sources.indexOf(record);
                }
            }, this);
        }

        var capGridPanel = new Ext.grid.GridPanel({
            store: this.target.layerSources[data[idx][0]].store,
            autoScroll: true,
            flex: 1,
            autoExpandColumn: "title",
            plugins: [expander],
            colModel: new Ext.grid.ColumnModel([
                expander,
                {id: "title", header: this.panelTitleText, dataIndex: "title", sortable: true},
                {header: "Id", dataIndex: "name", width: 150, sortable: true},
                {header: "uuid", dataIndex: "keywords", width: 150, sortable: true, hidden: true}
            ]),
            listeners: {
                rowdblclick: addLayers,
                scope: this
            }
        });
        
        this.sourceComboBox = new Ext.form.ComboBox({
            store: sources,
            valueField: "id",
            displayField: "title",
            triggerAction: "all",
            editable: false,
            allowBlank: false,
            forceSelection: true,
            mode: "local",
            value: data[idx][0],
            listeners: {
                select: function(combo, record, index) {
                    var source = this.target.layerSources[record.get("id")];
                    
                    capGridPanel.store.clearFilter();                    
                    capGridPanel.reconfigure(source.store, capGridPanel.getColumnModel());
                    // TODO: remove the following when this Ext issue is addressed
                    // http://www.extjs.com/forum/showthread.php?100345-GridPanel-reconfigure-should-refocus-view-to-correct-scroller-height&p=471843
                    capGridPanel.getView().focusRow(0);
                    this.setSelectedSource(source);
                    
                    filterText.reset();
                },
                scope: this
            }
        });
        
        var capGridToolbar = null;
        if (this.target.proxy || data.length > 1) {
            capGridToolbar = [
                new Ext.Toolbar.TextItem({
                    text: this.layerSelectionText
                }),
                this.sourceComboBox
            ];
        }
        
        if (this.target.proxy) {
            capGridToolbar.push("-", new Ext.Button({
                text: this.addServerText,
                iconCls: "gxp-icon-addserver",
                handler: function() {
                    newSourceWindow.show();
                }
            }));
        }
        
        for(var count = 0, l = this.additionalSources.length; count < l; count++) {
            this.availableSources.push(this.additionalSources[count]);
        }
        
        var newSourceWindow = new gxp.NewSourceWindow({
            modal: true,
            availableSources: this.availableSources,
            listeners: {
                "server-added": function(url, type) {
                    newSourceWindow.setLoading();
                    var sourceCfg;
                    for(var count = 0, l = this.availableSources.length; count < l; count++) {
                        var currentSource = this.availableSources[count];
                        if(currentSource.name === type) {
                            sourceCfg = Ext.apply({url: url}, currentSource.config);
                        }
                    }
                    
                    this.target.addLayerSource({
                        config: sourceCfg,
                        callback: function(id) {
                            // add to combo and select
                            var record = new sources.recordType({
                                id: id,
                                title: this.target.layerSources[id].title || this.untitledText
                            });
                            sources.insert(0, [record]);
                            this.sourceComboBox.onSelect(record, 0);
                            newSourceWindow.hide();
                        },
                        fallback: function(source, msg) {
                            newSourceWindow.setError(
                                new Ext.Template(this.addLayerSourceErrorText).apply({type: type, msg: msg})
                            );
                        },
                        scope: this
                    });
                },
                scope: this
            }
        });
        
        var items = {
            xtype: "container",
            region: "center",
            layout: "fit",
            items: [capGridPanel]
        };
        if (this.instructionsText) {
            items.items.push({
                xtype: "box",
                autoHeight: true,
                autoEl: {
                    tag: "p",
                    cls: "x-form-item",
                    style: "padding-left: 5px; padding-right: 5px"
                },
                html: this.instructionsText
            });
        }
        
        var filterText =  new Ext.form.TextField({
            emptyText : this.filterEmptyText,
            width : 60,
            enableKeyEvents : true,
            listeners : {
                keyup : function(form){
                    var val = form.getRawValue().trim().toLowerCase();
                    if(val){
                        this.store.filterBy(function(rec, recId){
                            var title = rec.get("title").trim().toLowerCase();
                            if(title.indexOf(val) > -1){
                                return true;
                            } else {
                                return false;
                            }
                        });                   
                    } else {
                        this.store.clearFilter();
                    }
                },
                scope : capGridPanel
            }
        });
        
        var bbarItems = [
            filterText,
            new Ext.Button({
                text: this.removeFilterText,
                handler : function(button){
                    this.store.clearFilter();
                    filterText.reset();
                },
                iconCls: "gxp-icon-removefilter",
                scope : capGridPanel
            }),            
            "->",
            new Ext.Button({
                text: this.addButtonText,
                iconCls: "gxp-icon-addlayers",
                handler: addLayers,
                scope : this
            }),
            new Ext.Button({
                text: this.doneText,
				iconCls: "save",
                handler: function() {
                    this.capGrid.hide();
                },
                scope: this
            })
        ];
        
        var uploadButton = this.createUploadButton();
        if (uploadButton) {
            bbarItems.unshift(uploadButton);
        }

        //TODO use addOutput here instead of just applying outputConfig
        this.capGrid = new Ext.Window(Ext.apply({
            title: this.availableLayersText,
            closeAction: "hide",
            layout: "fit",
            height: 300,
            width: 570,
            modal: true,
            items: items,
            tbar: capGridToolbar,
            bbar: bbarItems,
            listeners: {
                hide: function(win) {
                    capGridPanel.getSelectionModel().clearSelections();
                },
                show: function(win) {
                    this.setSelectedSource(this.target.layerSources[data[idx][0]]);
                },
                scope: this
            }
        }, this.initialConfig.outputConfig));
        
    },
    
    /** private: method[setSelectedSource]
     *  :arg: :class:`gxp.plugins.LayerSource`
     */
    setSelectedSource: function(source) {
        this.selectedSource = source;
        this.fireEvent("sourceselected", this, source);
    },
    
    /** private: method[createUploadButton]
     *  If this tool is provided an ``upload`` property, a button will be created
     *  that launches a window with a :class:`gxp.LayerUploadPanel`.
     */
    createUploadButton: function() {
        var button;
        var uploadConfig = this.initialConfig.upload;
        // the url will be set in the sourceselected sequence
        var url;
        if (uploadConfig) {
            if (typeof uploadConfig === "boolean") {
                uploadConfig = {};
            }
            button = new Ext.Button({
                xtype: "button",
                text: this.uploadText,
                iconCls: "gxp-icon-filebrowse",
                hidden: true,
                handler: function() {
                    var panel = new gxp.LayerUploadPanel(Ext.apply({
                        url: url,
                        width: 350,
                        border: false,
                        bodyStyle: "padding: 10px 10px 0 10px;",
                        frame: true,
                        labelWidth: 65,
                        defaults: {
                            anchor: "95%",
                            allowBlank: false,
                            msgTarget: "side"
                        },
                        listeners: {
                            uploadcomplete: function(panel, detail) {
                                var layers = detail.layers;
                                var names = {};
                                for (var i=0, len=layers.length; i<len; ++i) {
                                    names[layers[i].name] = true;
                                }
                                this.selectedSource.store.load({
                                    callback: function(records, options, success) {
                                        var gridPanel = this.capGrid.items.get(0);
                                        var sel = gridPanel.getSelectionModel();
                                        sel.clearSelections();
                                        // select newly added layers
                                        var newRecords = [];
                                        var last = 0;
                                        this.selectedSource.store.each(function(record, index) {
                                            if (record.get("name") in names) {
                                                last = index;
                                                newRecords.push(record);
                                            }
                                        });
                                        sel.selectRecords(newRecords);
                                        // this needs to be deferred because the 
                                        // grid view has not refreshed yet
                                        window.setTimeout(function() {
                                            gridPanel.getView().focusRow(last);
                                        }, 100);
                                    },
                                    scope: this
                                });
                                win.close();
                            },
                            scope: this
                        }
                    }, uploadConfig));
                    
                    var win = new Ext.Window({
                        title: this.uploadText,
                        modal: true,
                        resizable: false,
                        items: [panel]
                    });
                    win.show();
                },
                scope: this
            });
            
            var urlCache = {};
            function getStatus(url, callback, scope) {
                if (url in urlCache) {
                    // always call callback after returning
                    window.setTimeout(function() {
                        callback.call(scope, urlCache[url]);
                    }, 0);
                } else {
                    Ext.Ajax.request({
                        url: url,
                        disableCaching: false,
                        callback: function(options, success, response) {
                            var status = response.status;
                            urlCache[url] = status;
                            callback.call(scope, status);
                        }
                    });
                }
            }
            
            this.on({
                sourceselected: function(tool, source) {
                    button.hide();
                    var show = false;
                    if (this.isEligibleForUpload(source)) {
                        // only works with GeoServer
                        // if url is http://example.com/geoserver/ows, we
                        // want http://example.com/geoserver/rest.
                        var parts = source.url.split("/");
                        parts.pop();
                        parts.push("rest");
                        // this sets the url for the layer upload panel
                        url = parts.join("/");
                        if (this.target.isAuthorized()) {
                            // determine availability of upload functionality based
                            // on a 405 for GET
                            getStatus(url + "/upload", function(status) {
                                button.setVisible(status === 405);
                            }, this);
                        }
                    }
                },
                scope: this
            });
        }
        return button;
    },
    
	getSourceComboBox: function(){
		return this.sourceComboBox;
	},
	
    /** private: method[isEligibleForUpload]
     *  :arg source: :class:`gxp.plugins.LayerSource`
     *  :returns: ``Boolean``
     *
     *  Determine if the provided source is eligible for upload given the tool
     *  config.
     */
    isEligibleForUpload: function(source) {
        return (
            source.url &&
            (this.relativeUploadOnly ? (source.url.charAt(0) === "/") : true) &&
            (this.nonUploadSources || []).indexOf(source.id) === -1
        );
    },
    
    /** api: config[createExpander]
     *  ``Function`` Returns an ``Ext.grid.RowExpander``. Can be overridden
     *  by applications/subclasses to provide a custom expander.
     */
    createExpander: function() {
        return new Ext.grid.RowExpander({
            tpl: new Ext.Template(this.expanderTemplateText)
        });
    }

});

Ext.preg(gxp.plugins.AddLayers.prototype.ptype, gxp.plugins.AddLayers);
