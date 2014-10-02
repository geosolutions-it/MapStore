

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SynchLayerEnable
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SynchLayerEnable(config)
 *
 *
 *
 *
 *
 */
gxp.plugins.SynchLayerEnable = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_synchlayerenable */
    ptype: "gxp_synchlayerenable",

    /** api: config[synchEnableText]
     *  ``String``
     *  Text for Enable Layer item (i18n).
     */
    synchEnableText: "Enable Layer for Refresh",
    
    /** api: config[synchDisableText]
     *  ``String``
     *  Text for Enable Layer item (i18n).
     */
    synchDisableText: "Disable Layer for Refresh",
    
    /** private: property[iconCls]
     */
    iconCls: "gxp-icon-real-time-enable",
    
    /** api: method[addActions]
     */
    addActions: function() {

        var selectedLayer;        
        var apptarget = this.target;
        this._enableSynch = false;
        
        var actions = gxp.plugins.SynchLayerEnable.superclass.addActions.apply(this, [{
            text: this.buttonText,
            menuText: this.menuText,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function() {
                var map = this.target.mapPanel.map;
                var timeManagers = map.getControlsByClass('OpenLayers.Control.TimeManager');
                var layer = selectedLayer.getLayer();
                var queryable = selectedLayer.get('queryable');
                
                if(this._enableSynch === false){
                
                    if(this.target.tools.layertree_plugin){
                        var selmodel = this.target.tools.layertree_plugin.output[0].selModel;
                        var node =selmodel.getSelectedNode();
                        node.setIconCls('gx-tree-synchlayer-icon');
                    }
                    
                    this.actions[0].setText(this.synchDisableText);
                    this.actions[0].setIconClass('gxp-icon-real-time-disable');
                    this._enableSynch = true;
                    layer.synch = true;
                    
                }else{
                
                    if(this.target.tools.layertree_plugin){
                        var selmodel = this.target.tools.layertree_plugin.output[0].selModel;
                        var node =selmodel.getSelectedNode();
                        var layerIcon = queryable ? 'gx-tree-layer-icon' : 'gxp-tree-rasterlayer-icon';
                        node.setIconCls(layerIcon);
                    }
                    
                    this.actions[0].setText(this.synchEnableText);
                    this.actions[0].setIconClass('gxp-icon-real-time-enable');
                    this._enableSynch = false;
                    layer.synch = false;
                    
                }
                var ppp = this.target.tools.synchronizer_plugin;
                ppp.enableDisableSynch();
            },
            scope: this
        }]);
        
        var synchLayerEnableAction = actions[0];
        
        this.target.on("layerselectionchange", function(record) {
            selectedLayer = record.get('group') === 'background' ? null : record;           

            if(selectedLayer){
                if(selectedLayer.data.layer.synch){
                    if (selectedLayer.data.layer.synch === true){
                        synchLayerEnableAction.setText(this.synchDisableText);
                        synchLayerEnableAction.setIconClass('gxp-icon-real-time-disable');
                        this._enableSynch = true;
                    }else{
                        synchLayerEnableAction.setText(this.synchEnableText);
                        synchLayerEnableAction.setIconClass('gxp-icon-real-time-enable');
                        this._enableSynch = false;
                    }   
                }else{
                    synchLayerEnableAction.setText(this.synchEnableText);
                    synchLayerEnableAction.setIconClass('gxp-icon-real-time-enable');
                    this._enableSynch = false;
                }
            }
            
            synchLayerEnableAction.setDisabled(
                 !selectedLayer || this.target.mapPanel.layers.getCount() <= 1 || !record
            );
            if(record.get('group') === 'background')
                synchLayerEnableAction.hide();
                            
        }, this);
        
        var enforceOne = function(store) {
            synchLayerEnableAction.setDisabled(
                !selectedLayer || store.getCount() <= 1
            );
        }
        
        this.target.mapPanel.layers.on({
            "add": enforceOne,
            "remove": function(store){
                synchLayerEnableAction.setDisabled(true);
            }
        });
        
        return actions;
       
    }
        
});

Ext.preg(gxp.plugins.SynchLayerEnable.prototype.ptype, gxp.plugins.SynchLayerEnable);