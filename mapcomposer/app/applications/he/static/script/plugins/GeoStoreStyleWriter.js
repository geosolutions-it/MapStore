/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/


Ext.namespace("gxp.plugins.he");

/** api: (define)
 *  module = gxp.plugins
 *  class = GeoStoreStyleWriter
 */

/** api: (extends)
 *  plugins/StyleWriter.js
 */

/** api: constructor
 *  .. class:: GeoStoreStyleWriter(config)
 *   
 *      Save styles from :class:`gxp.WMSStylesDialog` or similar classes that
 *      have a ``layerRecord`` and a ``stylesStore`` with a ``userStyle``
 *      field. The plugin provides a save method, which will use the Geostore
 *      RESTConfig API to persist style changes from the ``stylesStore`` to the
 *      server and associate them with the layer referenced in the target's
 *      ``layerRecord``.
 */
gxp.plugins.he.GeoStoreStyleWriter = Ext.extend(gxp.plugins.he.StyleWriterHE, {
    
    /** api: config[mainLoadingMask] (i18n) */  
    mainLoadingMask: "Please wait...",
    /** api: config[geostoreStyleErrorTitle] (i18n) */  
    geostoreStyleErrorTitle: "Error",
    /** api: config[geostoreStyleCreationErrorMsg] (i18n) */      
    geostoreStyleCreationErrorMsg: "Error creating the geostore style",
    /** api: config[geostoreStyleUpdateErrorMsg] (i18n) */          
    geostoreStyleUpdateErrorMsg: "Error updating geostore style",    
    /** api: config[geostoreStyleSearchErrorMsg] (i18n) */          
    geostoreStyleSearchErrorMsg: "Failed to retrieve the geostore style",
    /** api: config[geostoreStyleDeleteSuccessMsg] (i18n) */              
    geostoreStyleDeleteSuccessMsg: "Geostore style successfully deleted",    
    /** api: config[geostoreStyleDeleteErrorMsg] (i18n) */                  
    geostoreStyleDeleteErrorMsg: "Geostore Style not deleted",    
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        Ext.apply(this, config);
        
        gxp.plugins.he.GeoStoreStyleWriter.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[write]
     *  :arg options: ``Object``
     *
     *  Saves the styles of the target's ``layerRecord`` using Geostore's
     *  RESTconfig API.
     *  
     *  Supported options:
     *
     *  * defaultStyle - ``String`` If set, the default style will be set.
     *  * success - ``Function`` A function to call when all styles were
     *    written successfully.
     *  * scope - ``Object`` A scope to call the ``success`` function with.
     */
    write: function(options) {
        delete this._failed;
        options = options || {};
        var dispatchQueue = [];
        var store = this.target.stylesStore;
        store.each(function(rec) {
            (rec.phantom || store.modified.indexOf(rec) !== -1) &&
                this.writeStyle(rec, dispatchQueue);
        }, this);
        var success = function(mask) {
            var target = this.target;
            if (mask)
                mask.hide();            
            if (this._failed !== true) {
                
                if(this.target.selectedStyle.data.userStyle){
                    if (!this.target.selectedStyle.data.userStyle.gs_name)
                        this.target.selectedStyle.data.userStyle.gs_name = this.geostoreEntityResource.name;
                    if(!this.target.selectedStyle.data.userStyle.gs_id)
                        this.target.selectedStyle.data.userStyle.gs_id = this.geostoreEntityResource.id;
                    if(!this.target.selectedStyle.data.userStyle.geostore)
                        this.target.selectedStyle.data.userStyle.geostore = true;

                    this.target.selectedStyle.data.geostore = "Geostore Styles";
                }                            
                
                // we don't need any callbacks for deleting styles.
                //this.deleteStyles(deletedStyle);
                var modified = this.target.stylesStore.getModifiedRecords();
                for (var i=modified.length-1; i>=0; --i) {
                    // mark saved
                    modified[i].phantom = false;
                }
                target.stylesStore.commitChanges();
                options.success && options.success.call(options.scope);
                
                if(target.selectedStyle.get("userStyle")["geostore"]){
                    var style = this.geoStore.url + "misc/category/name/LAYERS_STYLES/resource/name/" + target.selectedStyle.get("userStyle")["gs_name"] + "/data/";
                    target.fireEvent("savedgeostore", target, style);
                }else{
                    target.fireEvent("saved", target, target.selectedStyle.get("name"));
                }
            } else {
                target.fireEvent("savegeostorefailed", target, target.selectedStyle.get("name"));
            }
        };
        
        var successDelete = function(deletedStyle) {
            var target = this.target;
            if (this._failed !== true) {
                this.deleteStyles(deletedStyle);     
            } else {
                target.fireEvent("savefailed", target, target.selectedStyle.get("name"));
            }
        };        
        
        if(dispatchQueue.length > 0) {
            gxp.util.dispatch(dispatchQueue, function() {
                this.assignStyles(options.defaultStyle, success);
            }, this);
        } else {
            this.assignStyles(options.defaultStyle, successDelete);
        }
    },
    
    /** private: method[writeStyle] 
     *  :arg styleRec: ``Ext.data.Record`` the record from the target's
     *      ``stylesStore`` to write
     *  :arg dispatchQueue: ``Array(Function)`` the dispatch queue the write
     *      function is added to.
     * 
     *  This method does not actually write styles, it just adds a function to
     *  the provided ``dispatchQueue`` that will do so.
     */
    writeStyle: function(styleRec, dispatchQueue) {
        var styleName = styleRec.get("userStyle").name;
        dispatchQueue.push(function(callback, storage) {            
            var style = this.target.createSLD({userStyles: [styleName]});
            if (styleRec.phantom === true){
                this.geostoreEntityResource = new OpenLayers.GeoStore.Resource({
                    type: "resource",
                    name: UUID.uuid4(),
                    description: this.geoStore.user,
                    metadata: this.target.layerRecord.get("name"),
                    category: 'LAYERS_STYLES',
                    store: style
                });
                
                this.geoStore.createEntity(this.geostoreEntityResource,callback,function(response){
                    this._failed = true;                
                    Ext.Msg.show({
                        title: this.geostoreStyleErrorTitle,
                        buttons: Ext.Msg.OK,
                        msg: this.geostoreStyleCreationErrorMsg +this.target.styler.getErrorMsg(response),
                        fn: callback.call(this),
                        icon: Ext.MessageBox.ERROR,
                        scope: this
                    });
                }, this);
            }else{
                var geostoreEntityResource = new OpenLayers.GeoStore.Resource({
                    name: "resources",
                    regName: styleRec.get("userStyle")["gs_name"] || this.geostoreEntityResource.name
                });
                
                this.ruleDlg = Ext.getCmp('ruleDlg');

                this.appMask = new Ext.LoadMask(this.ruleDlg ? this.ruleDlg.el : this.target.el, {
                    msg: this.mainLoadingMask
                });
                this.appMask.show();
                
                this.geoStore.getLikeName(
                    geostoreEntityResource,function(data){
                        var entity = new OpenLayers.GeoStore.Resource({
                            type: "resource",
                            id: data[0].id,
                            name: data[0].name,
                            description: this.geoStore.user,
                            metadata: this.target.layerRecord.get("name"),
                            category: 'LAYERS_STYLES',
                            store: style
                        });               
                        this.geoStore.updateEntity(entity,callback,function(response){
                            Ext.Msg.show({
                                title: this.geostoreStyleErrorTitle,
                                buttons: Ext.Msg.OK,
                                msg: this.geostoreStyleUpdateErrorMsg + this.target.styler.getErrorMsg(response),
                                fn: callback.call(this),
                                icon: Ext.MessageBox.ERROR,
                                scope: this
                            });
                        },this);
                    },function(response){
                        Ext.Msg.show({
                            title: this.geostoreStyleErrorTitle,
                            buttons: Ext.Msg.OK,
                            msg: this.geostoreStyleSearchErrorMsg + this.target.styler.getErrorMsg(response),
                            fn: callback.call(this),
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        });                            
                    },this
                );
            }
        });
    },

    /** private: method[assignStyles]
     *  :arg defaultStyle: ``String`` The default style. Optional.
     *  :arg callback: ``Function`` The function to call when all operations
     *      succeeded. Will be called in the scope of this instance. Optional.
     */
    assignStyles: function(defaultStyle, callback) {
        this.target.stylesStore.each(function(rec) {
            if (!defaultStyle && rec.get("userStyle").isDefault === true) {
                defaultStyle = rec.get("name");
            }
        }, this);
        
        callback.call(this,this.appMask);
    },
    
    /** private: method[deleteStyles]
     *  Deletes styles that are no longer assigned to the layer.
     */
    deleteStyles: function() {        
        for (var i=0, len=this.deletedStyles.length; i<len; ++i) {
            if(this.deletedStyles[i].get("userStyle")["geostore"]){
                this.target.el
                this.appMask = new Ext.LoadMask(this.target.el, {
                    msg: this.mainLoadingMask
                });
                this.appMask.show();
                this.geoStyles = [];
                
                var geostoreDeleteEntityResource = new OpenLayers.GeoStore.Resource({
                    name: "resources",
                    regName: this.deletedStyles[i].get("userStyle")["gs_name"]
                });        
                this.geoStore.getLikeName(
                    geostoreDeleteEntityResource,function(data){
                    
                        var entity = new OpenLayers.GeoStore.Resource({
                            type: "resource",
                            id: data[0].id
                        });               
                        
                        this.geoStore.deleteEntity(entity,function(){                    
                            Ext.Msg.show({
                                title: "Delete Style",
                                buttons: Ext.Msg.OK,
                                msg: this.geostoreStyleDeleteSuccessMsg,
                                fn: this.updateStyleOnRemove(this.appMask),
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                        },function(response){
                            Ext.Msg.show({
                                title: this.geostoreStyleErrorTitle,
                                buttons: Ext.Msg.OK,
                                msg: this.geostoreStyleDeleteErrorMsg + this.target.styler.getErrorMsg(response),
                                fn: this.reload(this.appMask),
                                icon: Ext.MessageBox.INFO,
                                scope: this
                            });
                        },this);
                    },function(response){                    
                        Ext.Msg.show({
                            title: this.geostoreStyleErrorTitle,
                            buttons: Ext.Msg.OK,
                            msg: this.geostoreStyleSearchErrorMsg + this.target.styler.getErrorMsg(response),
                            fn: this.reload(this.appMask),
                            icon: Ext.MessageBox.INFO,
                            scope: this
                        });
                    },this
                );
            }
        }
        this.deletedStyles = [];
    },
    
    /** private: method[updateStyleOnRemove]
     *  Update Style On Remove
     */    
    updateStyleOnRemove: function(mask){
        var modified = this.target.stylesStore.getModifiedRecords();
        for (var i=modified.length-1; i>=0; --i) {
            // mark saved
            modified[i].phantom = false;
        }
        this.target.stylesStore.commitChanges();
        //options.success && options.success.call(options.scope);
        
        if(this.target.selectedStyle.get("userStyle")["geostore"]){
            mask.hide();
            var style = this.geoStore.url + "misc/category/name/LAYERS_STYLES/resource/name/" + this.target.selectedStyle.get("userStyle")["gs_name"] + "/data/";
            this.target.fireEvent("savedgeostore", this.target, style);
        }else{
            mask.hide();
            this.target.fireEvent("saved", this.target, this.target.selectedStyle.get("name"));
        }     
    
    },
    
    /** private: method[reload]
     *  Reload window on remove style error
     */        
    reload: function(mask){
        if(mask)
            mask.hide();
        this.target.ownerCt.ownerCt.close();        
        this.target.styler.addOutput();
    }
});

/** api: ptype = gxp_geostorestylewriter */
Ext.preg("gxp_geostorestylewriter", gxp.plugins.he.GeoStoreStyleWriter);
