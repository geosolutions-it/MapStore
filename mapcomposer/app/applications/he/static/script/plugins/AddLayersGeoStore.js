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
 * @requires widgets/GeoStoreNewSourceWindow.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = CapacityData
 */

/** api: (extends)
 *  plugins/AddLayers.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: AddLayers(config)
 *
 *    Plugin for removing a selected layer from the map.
 *    TODO Make this plural - selected layers
 */
gxp.plugins.he.AddLayersGeoStore = Ext.extend(gxp.plugins.AddLayers, {
    
    /** api: ptype = gxp_addlayersgeostore */
    ptype: "gxp_addlayersgeostore",

    /** api: config[gsErrorTitle]
     *  ``String``
     *  Error message title!
     */
    gsErrorTitle:"Geostore Error",

    /** api: config[gsInfoTitle]
     *  ``String``
     *  Info message title!
     */
    gsInfoTitle:"Geostore Info",
     
    /** api: config[editServerText]
     *  ``String``
     *  Edit selected server button text
     */
    editServerText:"Edit",

    /** api: config[editServerTooltip]
     *  ``String``
     *  Edit selected server button tooltip
     */
    editServerTooltip:"Edit Selected Server",

    /** api: config[deleteServerText]
     *  ``String``
     *  Delete selected server button tooltip
     */
    deleteServerText:"Delete",
    
    /** api: config[deleteServerTooltip]
     *  ``String``
     *  Delete selected server button tooltip
     */
    deleteServerTooltip:"Delete Selected Server",

    /** api: config[gsGetSourcesError]
     *  ``String``
     *  Error message for error in geostore get resources
     */
    gsGetSourcesError:"Unable to retrieve user's layer sources!",

    /** api: config[gsCreateSourceError]
     *  ``String``
     *  Error message for error creating geostore resource
     */
    gsCreateSourceError:"Unable to create and save geostore resource",

    /** api: config[gsUpdateSourceError]
     *  ``String``
     *  Error message for error updating geostore resource
     */
    gsUpdateSourceError:"Unable to update geostore resource",

    /** api: config[gsSavePermissionsError]
     *  ``String``
     *  Error message for error saving geostore permissions
     */
    gsSavePermissionsError:"Unable to save resource permissions!",

    /** api: config[gsDeleteSourceError]
     *  ``String``
     *  Error message for error deleting geostore resource
     */
    gsDeleteSourceError: "Unable to delete geostore resource!",
    
    /** api: config[gsCreateCategoryInfo]
     *  ``String``
     *  Info message, only roleAdmin can create needed geostore resource category 
     */
    gsCreateCategoryInfo: "GeoStore resources disabled, only Admin can create missing LAYERS_SOURCE CATEGORY",
    
    /** api: config[gsCreateCategoryAlert]
     *  ``String``
     *  Alert message, advise admin about geostore category creation
     */
    gsCreateCategoryAlert:"Application is creating  GeoStore's resource LAYERS_SOURCE",
    
    /** api: config[gsCreateCategoryError]
     *  ``String``
     *  Error message for error creating geostore category
     */
    gsCreateCategoryError:"Unable to create geostore category. GeoStore resources disabled!",
    
    /** api: config[gsCategoryCheckError]
     *  ``String``
     *  Error message for error creating geostore category
     */
    gsCategoryCheckError:"Unable to check category LAYERS_SOURCE. GeoStore resources disabled",
    
    /** private: property[geostoreSource]
     *  boolena if true geostore source enabled
     */
    geostoreSource:false,

    /** private: property[roleAdmin]
     *  boolena if true user is Admin
     */
    roleAdmin:false,

    /** private: property[advancedUser]
     *  boolena if true user is Advanced User
     */
    advancedUser:false,

     
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
        
        this.target.on("ready", function() {
            this.roleAdmin=(this.target && this.target.userDetails && this.target.userDetails.user.role == "ADMIN");
            this.advancedUser=this.hasGroup(this.target.userDetails.user,'Advanced_Users');
            this.checkLayerSourceCategory();
        },this);
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
                
                var gsGroup=(source.gs_group)?source.gs_group:'Public';
                data.push([id, gsGroup,source.title || id]);                
            }
        }
        
        var sources = new Ext.data.ArrayStore({
            fields: ["id","gs_group","title"],
            data: data
        });
        sources.sort('gs_group');
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
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<tpl if="this.gs_group != values.gs_group">',
                '<tpl exec="this.gs_group = values.gs_group"></tpl>',
                '<h1><span style="color:gray">{gs_group}</span></h1>',
                '</tpl>',
                '<div class="x-combo-list-item">{title}</div>',
                '</tpl>'
            ),
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
                    
                    // Enable or disable the source edit button only owner could edit and delete resources
                    this.toolBarManager(source);            
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
                    newSourceWindow.showWindow();   
                }
            }));
            
            capGridToolbar.push(new Ext.Button({
                text: this.editServerText,
                tooltip: this.editServerTooltip,
                iconCls: "edit",
                name: "edit_button",
                disabled: true,
                scope: this,
                handler: function() {
                    newSourceWindow.bindSource(this.selectedSource);
                }
            }));
            
            capGridToolbar.push(new Ext.Button({
                text: this.deleteServerText,
                tooltip: this.deleteServerTooltip,
                iconCls: "delete",
                scope: this,
                handler: function() {               
                    var removeFunction = function(buttonId, text, opt){        
                        if(buttonId === 'ok'){          
                            // /////////////////////////////////////////////////////
                            // Remove the layers associated to the selected source
                            // /////////////////////////////////////////////////////
                            var layers = this.target.mapPanel.layers;

                            var selSources = this.selectedSource;
                            // /////////////////////////////////////////////////////
                            // Check if the layer is the current selected BG 
                            // in the map (if yes the source should not be removed).
                            // /////////////////////////////////////////////////////
                            var remove = true;
                            layers.data.each(function(record, index, totalItems ) {
                                var group = record.get('group');
                                var name = record.get('name');
                                var source = record.get('source');

                                if(name && source == selSources.id && group == 'background'){
                                    var visible = record.data.layer.visibility;
                                    if(visible === true){
                                        remove = false;
                                    }                               
                                }
                            });             
                        
                            // ///////////////////////////
                            // Remove the selected source
                            // ///////////////////////////
                            if(remove === true){
                                // ////////////////////////////////////////////////////////////
                                // Remove the source layers only if the source can be removed.
                                // ////////////////////////////////////////////////////////////
                                layers.data.each(function(record, index, totalItems ) {
                                    var group = record.get('group');
                                    var name = record.get('name');
                                    var source = record.get('source');

                                    if(name && source == selSources.id){
                                        layers.remove(record);                              
                                    }
                                });
                                if((selSources.owner==this.target.userDetails.user.name || this.roleAdmin ) && selSources.gsId) 
                                    this.deleteLayersSource(selSources.gsId);
                                
                                var sourceRecordIdx = sources.find("id", selSources.id);
                                var sourceRecord = sources.getAt(sourceRecordIdx);
                                delete this.target.layerSources[sourceRecord.get("id")];
                                sources.remove(sourceRecord);               
                                
                                var sourcesCount = sources.getCount();
                                if(sourcesCount > 0){
                                    this.sourceComboBox.onSelect(sources.getAt(0), 0);
                                }else{
                                    this.sourceComboBox.clearValue();
                                    var capGridStore = capGridPanel.getStore();
                                    capGridStore.removeAll();
                                }                           
                                
                                this.target.modified = true;

                            }else{
                                Ext.Msg.show({
                                   title: this.deleteSourceDialogTitle,
                                   msg: this.deleteSourceText,
                                   buttons: Ext.Msg.OK,
                                   icon: Ext.MessageBox.WARNING,
                                   scope: this
                                });
                            }
                        }
                    }
                    
                    Ext.Msg.show({
                       title: this.deleteSourceDialogTitle,
                       msg: this.deleteSourceDialogMsg,
                       buttons: Ext.Msg.OKCANCEL,
                       fn: removeFunction,
                       icon: Ext.MessageBox.QUESTION,
                       scope: this
                    });
                }
            }));
        }
        
        for(var count = 0, l = this.additionalSources.length; count < l; count++) {
            this.availableSources.push(this.additionalSources[count]);
        }
        var newSourceWindow = new gxp.he.NewSourceWindowGeoStore({
            modal: true,
            auth:this.getAuth(),
            target:this.target,
            defaultVendor: this.defaultVendor,
            availableSources: this.availableSources,
            availableVendorOptions: this.availableVendorOptions,
            availableFormats: this.availableFormats,
            listeners: {
                scope: this,
                "server-added": function(url, type, sourceCfg,groups) {
                    newSourceWindow.setLoading();
                    var sourceCfg;
                    for(var count = 0, l = this.availableSources.length; count < l; count++) {
                        var currentSource = this.availableSources[count];
                        if(currentSource.name === type) {
                            //That was a bug, overraiding default obj modified
                            sourceCfg = Ext.apply({}, sourceCfg,currentSource.config);
                        }
                    }

                    var permissionsCfg=(groups)? groups.split(','):null;
                    //Try to add source
                    this.target.addLayerSource({
                        config: sourceCfg,
                        callback: function(id) {
                            //Check if is edit case
                            var idx = sources.find("id",  id);
                            if(idx < 0){
                                this.createLayerSource(sourceCfg,permissionsCfg,id);
                            }
                        },
                        fallback: function(source, msg) {
                            newSourceWindow.setError(
                                new Ext.Template(this.addLayerSourceErrorText).apply({type: type, msg: msg})
                            );
                        },
                        scope: this
                    });
                },
                "server-modified": function(url, type, sourceCfg, sourceId,groups) {
                    newSourceWindow.setLoading();

                    var sourceRecordIdx = sources.find("id", sourceId);
                    if(sourceRecordIdx >= 0){
                        // The record of the combo box store
                        var sourceRecord = sources.getAt(sourceRecordIdx);  
                        var title = sourceRecord.get("title");
                        if(sourceCfg.title != title){
                            sourceRecord.set("title", sourceCfg.title);
                            this.getSourceComboBox().setValue( sourceCfg.title );
                        }                   
                        
                        // The record of the real used sources store
                        var source = this.target.layerSources[sourceId];
                        
                        Ext.apply(source.initialConfig, sourceCfg);
                        Ext.apply(source, sourceCfg);
                        
                        if(source.store.baseParams.VERSION != sourceCfg.version){
                            source.store.baseParams.VERSION = sourceCfg.version;
                            
                            // //////////////////////////////
                            // Check also the authparam
                            // TODO: More checks on this
                            // //////////////////////////////
                            if(source.authParam != sourceCfg.authParam){
                                if(source.authParam){
                                    delete source.store.baseParams[source.authParam];
                                }
                                
                                source.store.baseParams[sourceCfg.authParam] = source.getAuthParam();
                            }
                        }
                        var permissionsCfg=(groups)? groups.split(','):null;

                        source.on("ready", function(){
                            if(source.gsId)this.updateLayerSource(source.initialConfig,permissionsCfg,source.gsId,source.gsName);
                        },this);
                        source.on("failure", function(){
                            newSourceWindow.hide();
                        });                     
                        
                        source.store.reload();
                        this.target.modified = true;
                    }
                }
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
            width: 580,
            modal: true,
            items: items,
            tbar: capGridToolbar,
            bbar: bbarItems,
            listeners: {
                hide: function(win) {
                    capGridPanel.getSelectionModel().clearSelections();
                },
                show: function(win) {
                    if(!this.selectedSource){
                        this.setSelectedSource(this.target.layerSources[data[idx][0]]);
                        this.toolBarManager(this.selectedSource);
                    }
                },
                scope: this
            }
        }, this.initialConfig.outputConfig));
        this.newSourceWindow=newSourceWindow;
        
    },
    /** private: method[getUserLayersSources]
     *  ``Function``Get  ueser LAYERS_RESOURCE resources from geostore
     *
     */
    getUserLayersSources:function(){
        var filter="<AND><CATEGORY><operator>EQUAL_TO</operator><name>LAYERS_SOURCE</name></CATEGORY></AND>"
        Ext.Ajax.request({
           url: this.target.geoStoreBaseURL+'resources/search/list?includeData=true&includeAttributes=true',
           method: 'POST',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.getAuth()
           },
           params: filter,
           scope: this,
           success: function(response, opts){
               var layersSourceList= Ext.util.JSON.decode(response.responseText).ResourceList;
               var resources=[];

               if(layersSourceList && layersSourceList.Resource){
                   if(layersSourceList.Resource instanceof Array)resources=layersSourceList.Resource;
                    else resources.push(layersSourceList.Resource);
                    var sourceCount=resources.length;
                   for(var i=0;i< resources.length;i++ ){
                        var source=resources[i];
                        if(source.data){
                            var layersSource=Ext.util.JSON.decode(source.data.data);
                                layersSource.gsId=source.id;
                                layersSource.gsName=source.name;
                                if(source.Attributes) layersSource.owner=this.getOwner(source.Attributes);  
                                layersSource.gs_group=(layersSource.owner==this.target.userDetails.user.name)?'Personal':'Public';                     
                                this.target.addLayerSource({
                                    config: layersSource,
                                    callback: function(id) {
                                        sourceCount--;
                                        if(sourceCount==0)this.actions[0].enable();
                                },
                                    fallback: function(source, msg) {
                                        sourceCount--;
                                        if(sourceCount==0)this.actions[0].enable();
                                },
                                scope: this
                            });
                        }
                   }


               }else this.actions[0].enable();
           },
           failure:  function(response, opts){
                Ext.Msg.show({
                 title: this.gsErrorTitle,
                 msg: this.gsGetSourcesError+this.getErrorMsg(response),
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.ERROR
              });
             this.actions[0].enable();   
           }
        }); 

    },

    /** private: method[createLayerSource]
     *  ``Function``Create a new LAYERS_RESOURCE resource and save on geostore
     *
     */
    createLayerSource: function(sourceCfg,permissionsCfg,sourceId){
        var owner =this.target.userDetails.user.name;
        var resourceName=owner+this.generateUUID();
        var lSourceResource="<Resource><Attributes><attribute><name>owner</name><type>STRING</type><value>"+
        owner+"</value></attribute></Attributes><description></description><metadata></metadata>"+
        "<name>"+resourceName+"</name><category><name>LAYERS_SOURCE</name></category><store><data>"+
        "<![CDATA[ "+Ext.util.JSON.encode(sourceCfg)+" ]]></data></store></Resource>";

        Ext.Ajax.request({
           url: this.target.geoStoreBaseURL+'resources',
           method: 'POST',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.getAuth()
           },
           params: lSourceResource,
           scope: this,
           success: function(response, opts){              
            //CREATE GEOSTORE PERMISSIONS
            if(permissionsCfg)   
                this.createLayerSourcePermissions(response.responseText,permissionsCfg);
            //ADD TO COMBOBOX!
            var sources=this.getSourceComboBox().getStore();
            var source=this.target.layerSources[sourceId];
            source.owner=owner;
            source.gsId=Number(response.responseText);
            source.gsName=resourceName;
            source.gs_group='Personal';
            var record = new sources.recordType({
                id: sourceId,
                gs_group:'Personal',
                title: this.target.layerSources[sourceId].title || this.untitledText
                });
            sources.insert(this.getPersonalInsertIdx(),[record]);
            this.sourceComboBox.onSelect(record, sources.getTotalCount()-1);
            this.target.modified = true;
            this.newSourceWindow.hide();
           },
           failure:  function(response, opts){
             //REMOVE SOURCE FORM LAYERS SOURCES
            delete this.target.layerSources[sourceId];
            this.newSourceWindow.hide();              
            Ext.Msg.show({
                         title: this.gsErrorTitle,
                         msg: this.gsCreateSourceError+this.getErrorMsg(response),
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                      });
           }
        }); 

    },
    /** private: method[updateLayerSource]
     *  ``Function``Update LAYERS_RESOURCE resource on geostore
     *
     */
    updateLayerSource: function(sourceCfg,permissionsCfg,rId,name){
        var lSourceResource="<Resource><description></description><metadata></metadata>"+
        "<name>"+name+"</name><category><name>LAYERS_SOURCE</name></category><store><data>"+
        "<![CDATA[ "+Ext.util.JSON.encode(sourceCfg)+" ]]></data></store></Resource>";
        lSourceResource=Ext.util.JSON.encode(sourceCfg);
        Ext.Ajax.request({
           url: this.target.geoStoreBaseURL+'data/'+rId,
           method: 'PUT',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.getAuth()
           },
           params: lSourceResource,
           scope: this,
           success: function(response, opts){              
            //DEVI SETTARE I PERMESSI 
            if(permissionsCfg)   
                this.createLayerSourcePermissions(response.responseText,permissionsCfg);
            this.newSourceWindow.hide();
            //this.getSourceComboBox.doLayout();
           },
           failure:  function(response, opts){
            this.newSourceWindow.hide();
                Ext.Msg.show({
                         title:this.gsErrorTitle,
                         msg: this.gsUpdateSourceError+this.getErrorMsg(response),
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                      });


           }
        }); 

    },
    /** private: method[createLayerSourcePermissions]
     *  ``Function``SET Geostore resource's permissions
     *
     */
    createLayerSourcePermissions: function(response,permissionsCfg){
        var xml = '<SecurityRuleList>';
           for(var i = 0; i < permissionsCfg.length; i++){
                var gid=permissionsCfg[i];
                xml += '<SecurityRule>' +'<canRead>true</canRead><canWrite>false</canWrite>';
                xml += '<group><id>' + gid + '</id></group></SecurityRule>';
            }
             xml += '</SecurityRuleList>';
           
        Ext.Ajax.request({
           url: this.target.geoStoreBaseURL+'resources/resource/'+response+'/permissions',
           method: 'POST',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.getAuth()
           },
           params: xml,
           scope: this,
           success: function(response, opts){
               
           },
           failure:  function(response, opts){
              Ext.Msg.show({
                         title: this.gsErrorTitle,
                         msg: this.gsSavePermissionsError+this.getErrorMsg(response),
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                      });   
           }
        }); 
    },
    /** private: method[deleteLayersSource]
     *  ``Function``Delete Geostore LAYERS_SOURCE resource 
     *
     */
    deleteLayersSource:function(rId){

        Ext.Ajax.request({
           url: this.target.geoStoreBaseURL+'resources/resource/'+rId,
           method: 'DELETE',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.getAuth()
           },
           scope: this,
           success: function(response, opts){
              
           },
           failure:  function(response, opts){
                 Ext.Msg.show({
                         title: this.gsErrorTitle,
                         msg: this.gsDeleteSourceError+this.getErrorMsg(response),
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                      });
           }
        }); 

    },
    /** private: method[createLayerSourceCategory]
     *  ``Function``If dosnt' exist, create GeoStore LAYERS_SOURCE CATEGORY
     *
     */
    createLayerSourceCategory:function(){
        //Check user, only admin can create resorces
        if(this.target.userDetails.user.role != "ADMIN"){
            Ext.Msg.show({
                 title:this.gsErrorTitle,
                 msg: this.gsCreateCategoryInfo,
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.ERROR
              });
        }
        else{

            Ext.Msg.show({
                       title: this.gsInfoTitle,
                       msg: this.gsCreateCategoryAlert,
                       buttons: Ext.Msg.OK,
                       fn: function(){
                         var xml="<Category><name>LAYERS_SOURCE</name></Category>";
                         Ext.Ajax.request({
                            url: this.target.geoStoreBaseURL+'categories/',
                            method: 'POST',
                            headers:{
                                'Content-Type' : 'text/xml',
                                'Accept' : 'application/json, text/plain, text/xml',
                                'Authorization' : this.getAuth()
                            },
                            params:xml,
                            scope: this,
                            success: function(response, opts){
                                this.geostoreSource=true;
                                this.actions[0].enable();
                            },
                            failure:  function(response, opts){
                                Ext.Msg.show({
                                title: this.gsErrorTitle,
                                msg: this.gsCreateCategoryError+this.getErrorMsg(response),
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.ERROR
                                });
                             }
                        }); 
                    },
                       icon: Ext.MessageBox.QUESTION,
                       scope: this
                    });


           
            }
    },
    /** private: method[checkLayerSourceCategory]
     *  ``Function``Check if GeoStore LAYERS_SOURCE CATEGORY exist
     *
     */
    checkLayerSourceCategory:function(){
    //Check if GeoStore CATEGORY LAYERS_SOURCE exist
        Ext.Ajax.request({
           url: this.target.geoStoreBaseURL+'categories/count/LAYERS_SOURCE',
           method: 'GET',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : this.getAuth()
           },
           scope: this,
            success: function(response, opts){
            if(response.responseText==0){
                this.createLayerSourceCategory();
            }
            else{ 
                this.geostoreSource=true
                this.getUserLayersSources();            }
           },
           failure:  function(response, opts){
              Ext.Msg.show({
                 title: this.gsErrorTitle,
                 msg: this.gsCategoryCheckError+this.getErrorMsg(response),
                 buttons: Ext.Msg.OK,
                 icon: Ext.MessageBox.ERROR
              });
          }
        }); 
    },
    /** private: method[getOwner]
     *  ``Function``Get owner attribute form geostore resource attributes
     *
     */
    getOwner:function(attr){
        var owner=null;
        var attributes=[];

        if(attr.attribute instanceof Array)
            attributes=attr.attribute;
        else 
            attributes.push(attr.attribute);
        
        for(var i = 0; i<attributes.length;i++)
               if(attributes[i].name=='owner'){
                owner=attributes[i].value;
                break;
               }
        return owner;
    },
    /** private: method[generateUUID]
     *  ``Function``Create UUID
     *
     */
    generateUUID:function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
    },
    /** private: method[getErrorMsg]
     *  ``Function``Format geostore response errror
     *
     */
    getErrorMsg:function(response){
        return defaultErrMsg = " "+response.statusText + "(status " + response.status + "):  " + response.responseText;
    },
    /** private: method[toolBarManager]
     *  ``Function``Include the logic used to enable, disable toolbare button
     *              based on user permissions and source
     *
     */
    toolBarManager:function(source){
        var capGridToolbar = this.capGrid.getTopToolbar();
        if(source.ptype == "gxp_wmssource" && source.gs_group=='Personal'){
                        capGridToolbar.items.item(4).enable();
                        capGridToolbar.items.item(5).enable();
                        }else{
                        capGridToolbar.items.item(4).disable();
                        capGridToolbar.items.item(5).disable();
                    }
        if(this.advancedUser || this.roleAdmin){
            capGridToolbar.items.item(3).enable();
        }else
        capGridToolbar.items.item(3).disable();


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
    /** private: method[getPersonalInsertIdx]
     *  ``Function`` Find combosource store index for personal resource
     */     
     getPersonalInsertIdx:function(){
        var st =this.getSourceComboBox().getStore();
        var idx= st.find('gs_group','Personal');
        return (idx==-1)?st.getTotalCount():idx+1;    
    }


});

Ext.preg(gxp.plugins.he.AddLayersGeoStore.prototype.ptype, gxp.plugins.he.AddLayersGeoStore);