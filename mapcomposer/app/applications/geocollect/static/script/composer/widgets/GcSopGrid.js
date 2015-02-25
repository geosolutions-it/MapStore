/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp.grid
 *  class = FeatureGrid
 *  base_link = `Ext.grid.GridPanel <http://extjs.com/deploy/dev/docs/?class=Ext.grid.GridPanel>`_
 */
Ext.namespace("gxp.grid");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      ``GeoExt.data.FeatureStore`` .
 */
gxp.grid.GcSopGrid = Ext.extend(Ext.grid.EditorGridPanel, {

    title:'Details',
    deleteMsgTitle:'Delete',
    deleteMsg:'Are you sure you want do delete this row',
    deleteButtonText:'Delete',
    deleteButtonTooltip:'Delete selected row',
    editButtonText:'Edit',
    editButtonTooltip:'Edit slected row',
    saveButtonText:'Save',
    saveButtonTooltip:'Salva changes',
    cancelButtonText:'Cancel',
    cancelButtonTooltip:'Cancel changes',
    saveOrCancelEdit:'Save or cancel changes',
    commitErrorTitle:'Error saving',
    commitErrorMsg:'Changes not saved!',
   
    
    allowDelete:true,
   
    autoScroll: true,
   
    /** api: config[ignoreFields]
     *  ``Array`` of field names from the store's records that should not be
     *  displayed in the grid.
     */
    ignoreFields: null,
    
    /** api: config[colConfig]
     *  ``Object``
     *  An object with as keys the field names, which will provide the ability
     *  to override the col configuration for that fileds
     */
    colConfig:null,
    
    edit:true,
    format:'JSON',
    filter:null,
     queriableAttribute : null ,
    /** api: config[schema]
     *  ``GeoExt.data.AttributeStore``
     *  Optional schema for the grid. If provided, appropriate field
     *  renderers (e.g. for date or boolean fields) will be used.
     */

    /** api: config[dateFormat]
     *  ``String`` Date format. Default is the value of
     *  ``Ext.form.DateField.prototype.format``.
     */

    /** api: config[timeFormat]
     *  ``String`` Time format. Default is the value of
     *  ``Ext.form.TimeField.prototype.format``.
     */

    /** private: property[layer]
     *  ``OpenLayers.Layer.Vector`` layer displaying features from this grid's
     *  store
     */
    layer: null,
	autoLoad:false,
	actionTooltip: "Zoom To Feature",
	baseParams:null,
    
    /** api: method[initComponent]
     *  Initializes the FeatureGrid.
     */
    initComponent: function(){
        
         this.addEvents(
          
            /** api: events[startsopediting]
             *  Fires when the user press edit button
             *  
             *  Listener arguments:
             *  * panel - :class:`gxp.FeatureEditPopup` This popup.
             */
            "startsopediting",
            
             /** api: events[stopsopediting]
             *  Fires when the user save or cancel editing
             *  
             *  Listener arguments:
             *  * panel - :class:`gxp.FeatureEditPopup` This popup.
             */


            "stopsopediting",
            
            "sopselected"            
        );
      
        
        
      
         this.ignoreFields = ["feature", "state", "fid"].concat(this.ignoreFields);
        if (!this.dateFormat) {
            this.dateFormat = Ext.form.DateField.prototype.format;
        }
        if (!this.timeFormat) {
            this.timeFormat = Ext.form.TimeField.prototype.format;
        }
        this.sm= new Ext.grid.RowSelectionModel({
                
           singleSelect:true,
           listeners:{ 
               'beforerowselect':function( sm, rowIndex, keepExisting, record ){
                            if(this.colModel.editing){//Devi controllare che la feature non sia stata modificata e poi puoi permettere il cambio
                                   if(sm.getSelected().dirty) {
                                        Ext.MessageBox.show({
                                         msg: this.saveOrCancelEdit,
                                         buttons: Ext.Msg.OK,
                                         animEl: 'elId',
                                        icon: Ext.MessageBox.INFO
                                     });
                                       
                                       return false;                                                                     
                                }
                            }
                   
                   
               },
                'rowselect' : function(sm, rowIndex, r ){ //Attiva i tasti per editing
                            if(this.deleteButton.disabled){//Abiliti i bottoni se non sono stati abilitati
                             
                                this.deleteButton.enable();
                                this.editButton.enable();
                            } 
                            
                                this.feature=r.data.feature;//Questa è la feature su cui lavirianmo
                                this.selectedRecord=r;
                             

                            this.fireEvent('sopselected',r);
                                
                },
                'rowdeselect': function(sm ){
                    if(!this.deleteButton.disabled){//Abiliti i bottoni se non sono stati abilitati
                                 this.editButton.disable();
                                this.deleteButton.disable();
                            }                },
                scope:this
            }
                });    
            this.store= new Ext.data.Store();
            this.cm= new Ext.grid.ColumnModel({columns: []});
            this.bbar=[
             {
            text: this.editButtonText,
            tooltip: this.editButtonTooltip,
            iconCls: "edit",
            disabled:true,
            handler: this.enableEditing,
            scope: this,
            ref:'/editButton'}
            ,
            {
            text: this.deleteButtonText,
            tooltip: this.deleteButtonTooltip,
            iconCls: "delete",
            hidden: !this.allowDelete,
            disabled:true,
            handler: this.deleteFeature,
            scope: this,
            ref:'/deleteButton'
            },
        
            {
            text: this.cancelButtonText,
            tooltip: this.cancelButtonTooltip,
            iconCls: "cancel",
            hidden: true,
            handler: function() {
                this.finishEditing(false);
            },
            scope: this,
            ref:'/cancelButton'
        },
        
         {
            text: this.saveButtonText,
            tooltip: this.saveButtonTooltip,
            iconCls: "save",
            hidden: true,
            handler: function() {
                this.finishEditing(true);
            },
            scope: this,
            ref:'/saveButton'
        }
      
            
            
            
            
            
            ];
        this.on('render',function(){
            if(!this.mask) this.mask=  new Ext.LoadMask(this.id, {msg:"Please wait...",store:this.store});
        },this);
        gxp.grid.GcSopGrid.superclass.initComponent.call(this);       
      
      var me=this;
      //Lo ritardo perchè altrimenti mi elimina il layer del feature manager ma va fixato!!
     /* window.setTimeout(function(){
           me.target.createLayerRecord({"source":me.source,
         "name":me.typeName},me.setSopLayer,me);   
        
      },3000);*/
     this.getSchema(this.createStore,this);
      
    },
    getSchema: function(callback,scope){
        var schema = new GeoExt.data.AttributeStore({
            url: this.wfsURL, 
            baseParams: Ext.apply({
                SERVICE: "WFS",
                VERSION: "1.1.0",
                REQUEST: "DescribeFeatureType",
                TYPENAME: this.typeName,
            },this.baseParams || {}),
            autoLoad: true,
            listeners: {
                "load": function() {
                    callback.call(scope, schema);
                },
                scope: this
            }
        });
    },
     loadSop: function(param){

     if(this.getSelectionModel().getSelected() && this.getSelectionModel().getSelected().dirty) {
                                        Ext.MessageBox.show({
                                        msg: this.saveOrCancelEdit,
                                         buttons: Ext.Msg.OK,
                                         animEl: 'elId',
                                        icon: Ext.MessageBox.INFO
                                     });
                                       
                                       return false;   
                                       }                                                                  

        this.disableEditing();
        this.deleteButton.disable();
         this.editButton.disable();
          
        var params={};
        if(this.oldParam===param)return;//If oalready loaded skip!
        this.filter=new OpenLayers.Filter.Comparison({
            type:OpenLayers.Filter.Comparison.EQUAL_TO,
            property: this.queriableAttribute,
            value:param
            });
        
        this.store.setOgcFilter(this.filter);
         this.store.load();
       this.oldParam=param;
   },
    
     setSopLayer:function(layerRecord){
        this.layerRecord=layerRecord;           
        this.createStore();
    },
    
    /** private: method[onDestroy]
     *  Clean up anything created here before calling super onDestroy.
     */
    onDestroy: function() {
        gxp.grid.GcSopGrid.superclass.onDestroy.apply(this, arguments);
    },
  

createStore: function(schema) {
        
                    this.schema = schema;
                    var fields = [], geometryName;
                    var geomRegex = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/;
                    var types = {
                        "xsd:boolean": "boolean",
                        "xsd:int": "int",
                        "xsd:integer": "int",
                        "xsd:short": "int",
                        "xsd:long": "int",
                        "xsd:date": "date",
                        "xsd:string": "string",
                        "xsd:float": "float",
                        "xsd:decimal": "float"
                    };
                    schema.each(function(r) {
                        var match = geomRegex.exec(r.get("type"));
                        if (match) {
                            geometryName = r.get("name");
                            this.geometryType = match[1];
                        } else {
                            // TODO: use (and improve if needed) GeoExt.form.recordToField    
                            var type = types[r.get("type")];
                                var field = {
                                name: r.get("name"),
                                type: type
                            };
                            //TODO consider date type handling in OpenLayers.Format
                            if (type == "date") {
                                field.dateFormat = "Y-m-d\\Z";
                            }
                            fields.push(field);
                        }
                    }, this);
                   
                    var protocolOptions = Ext.apply({    
                        srsName: this.target.mapPanel.map.getProjection(),
                        url: schema.url,
                        featureType: schema.reader.raw.featureTypes[0].typeName,
                        featureNS: schema.reader.raw.targetNamespace,
                        geometryName: geometryName
                    },this.baseParams||{});
                    
                   
                    this.hitCountProtocol = new OpenLayers.Protocol.WFS(Ext.apply({
                        version: "1.1.0",
                        readOptions: {output: "object"},
                        resultType: "hits",
                        filter: this.filter
                    }, protocolOptions));
                    
                   featureStore = new gxp.data.WFSFeatureStore(Ext.apply({
                        fields: fields,
                        proxy: {
                            protocol: {
                                outputFormat: this.format 
                            }
                        },
                        baseParams:this.baseParams,
                        maxFeatures: this.maxFeatures,
                        layer: this.featureLayer,
                        ogcFilter: this.filter,
                        autoLoad: this.autoLoad,
                        autoSave: false,
                        listeners: {
                            "write": function() {
                               // this.redrawMatchingLayers(record);
                            },
                            "load": function() {
                                //this.fireEvent("query", this, this.featureStore, this.filter);
                            },
                            scope: this
                        }
                    }, protocolOptions));
          
                this.reconfigure(featureStore, this.createColumnModel(featureStore));

           
            
                   
        
   
            
            
            
            
    },

    /** api: method[getColumns]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Array``
     *  
     *  Gets the configuration for the column model.
     */
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
		var name, type, xtype, format, renderer;
        (this.schema || store.fields).each(function(f) {
            if (this.schema) {
                
                name = f.get("name");
                type = f.get("type").split(":").pop();
                 if (type.match(/^[^:]*:?((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry))/)) {
                    // exclude gml geometries
                    return;
                }
                format = null;
                switch (type) {
                    case "date":
                        format = this.dateFormat;
                    case "datetime":
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
             var fieldCfg = GeoExt.form.recordToField(f);
            if (this.ignoreFields.indexOf(name) === -1) {
               var col={
                    dataIndex: name,
                    header: fieldCfg.fieldLabel,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    renderer: xtype ? undefined : renderer,
                    editor: fieldCfg,
                    editable:this.edit 
                    
                };
                 if (this.colConfig && this.colConfig[name]) {
                     
                    Ext.apply(col, this.colConfig[name]);
                }
                columns.push(col);
            }
        }, this);
        return columns;
    },
    
    /** private: method[createColumnModel]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Ext.grid.ColumnModel``
     */
    createColumnModel: function(store) {
        var cols = this.getColumns(store);
        return new Ext.grid.ColumnModel(
            {
               editing:false, 
               columns: cols,
                   isCellEditable: function(col, row) {
                if(this.editing) return Ext.grid.ColumnModel.prototype.isCellEditable.call(this, col, row);
                else return false;
                }
               });
    },
     /** private: method[startEditing]
     */
    enableEditing: function() {
       
            this.colModel.editing = true;     
            this.editButton.hide();
            this.deleteButton.hide();
            this.saveButton.show();
            this.cancelButton.show();     
            this.fireEvent( "startsopediting",this);
    },
     disableEditing: function() {
            
                  
            this.colModel.editing = false; 
            this.editButton.show();
            this.deleteButton.show();
            this.saveButton.hide();
            this.cancelButton.hide();
              this.fireEvent( "stopsopediting",this);                   
       
    },
     /** private: method[stopEditing]
     *  :arg save: ``Boolean`` If set to true, changes will be saved and the
     *      ``featuremodified`` event will be fired.
     */
    finishEditing: function(save) {
      
           
            var feature = this.feature;
            
            if ( this.selectedRecord.dirty) {
                
                if (save === true) {
                     if (this.schema) {
                        var attribute, rec;
                       // Ext.apply(feature.attributes,this.selectedRecord.data);
                        for (var i in this.selectedRecord.modified) {
                            feature.attributes[i]=this.selectedRecord.data[i];
                        }
                       
                        for (var i in feature.attributes) {
                           
                                                      
                            rec = this.schema.getAt(this.schema.findExact("name", i));
                            attribute = feature.attributes[i];
                            if (attribute instanceof Date) {
                                var type = rec.get("type").split(":").pop();
                                feature.attributes[i] = attribute.format(
                                    type == "date" ? "Y-m-d" : "c"
                                );
                            }
                        }
                    }
                    this.setFeatureState(OpenLayers.State.UPDATE);
                    this.commit();                 
                 
                }else this.selectedRecord.reject();
           }
 
             this.disableEditing();
            
        
    },
    
    deleteFeature: function() {
        Ext.Msg.show({
            title: this.deleteMsgTitle,
            msg: this.deleteMsg,
            buttons: Ext.Msg.YESNO,
            fn: function(button) {
                if(button === "yes") {
                    this.setFeatureState(OpenLayers.State.DELETE);
                    this.commit();
                }
            },
            scope: this,
            icon: Ext.MessageBox.QUESTION,
            animEl: this.getEl()
        });
    },
    
    /** private: method[setFeatureState]
     *  Set the state of this popup's feature and trigger a featuremodified
     *  event on the feature's layer.
     */
    setFeatureState: function(state) {
        this.feature.state = state;
       
        /*layer && layer.events.triggerEvent("featuremodified", {
            feature: this.feature
        });*/
    },
    getFeatureState: function(state) {
        return this.feature.state;
       
        /*layer && layer.events.triggerEvent("featuremodified", {
            feature: this.feature
        });*/
    },
     /** private: method[getDirtyState]
     *  Get the appropriate OpenLayers.State value to indicate a dirty feature.
     *  We don't cache this value because the popup may remain open through
     *  several state changes.
     */
    getDirtyState: function() {
        return this.feature.state === OpenLayers.State.INSERT ?
            this.feature.state : OpenLayers.State.UPDATE;
    },


  //Committa i cambiamenti  
    commit: function(){
        this.store.proxy.protocol.commit(
            [this.feature], {
                callback: function(res) {
                   if(res.code==1){
                   
                  if(this.getFeatureState()===OpenLayers.State.UPDATE)
                    this.selectedRecord.commit();
                   else  if(this.getFeatureState()===OpenLayers.State.DELETE)
                   this.getStore().remove(this.selectedRecord);
                    this.getSelectionModel().clearSelections();                 
                    this.deleteButton.disable();  
                    this.editButton.disable();
                                    
                   }else if (res.code==0){
                     Ext.MessageBox.show({
                        title: this.commitErrorTitle,
                        msg: this.commitErrorMsg,
                        buttons: Ext.Msg.OK,
                        animEl: 'elId',
                        icon: Ext.MessageBox.INFO
                    });
                       
                   }
                },scope:this
        });

        
        
    }
});

/** api: xtype = gxp_featuregrid */
Ext.reg('gxp_gcsopgrid', gxp.grid.GcSopGrid); 
