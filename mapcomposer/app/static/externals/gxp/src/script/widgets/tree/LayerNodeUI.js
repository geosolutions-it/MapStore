/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/


Ext.namespace("gxp.tree");

/** api: (define)
 *  module = gxp.tree
 *  class = LayerNodeUI
 *  
 */

/** api: constructor
 *  .. class:: LayerNodeUI(config)
 *   
 *  An extended LayerNodeUI for gxp LayerTree nodes.
 */
gxp.tree.LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, {
	/** private: method[constructor]
     */
	constructor: function(config) {
        gxp.tree.LayerNodeUI.superclass.constructor.apply(this, arguments);
    },
	/** private: method[loadStart]
     */
	loadStart: function() {
		this.removeClass("x-tree-node-error");
		this.addClass("x-tree-node-loading");
	},
	/** private: method[loadEnd]
     *  :param tile: ``Object``
     */
	loadEnd: function(tile) {
		this.removeClass("x-tree-node-loading");
	},
	/** private: method[loadError]
     *  :param tile: ``Object``
     */
	loadError: function(tile) {
		this.addClass("x-tree-node-error");
	},
	/** private: method[visibilityChanged]
     *  :param event: ``Object``
     */
	visibilityChanged: function(event) {
		if(event.object.visibility === false) {
			this.removeClass("x-tree-node-error");
			this.removeClass("x-tree-node-loading");
		}
	},
	/** private: method[render]
     *  :param bulkRender: ``Boolean``
     */
	render: function(bulkRender) {
		if(this.node.layer.options.loadingProgress) {
			this.node.layer.events.register('tileloadstart', this, this.loadStart);
			this.node.layer.events.register('tileloaded', this, this.loadEnd);
			this.node.layer.events.register('tileerror', this, this.loadError);
			this.node.layer.events.register('visibilitychanged', this, this.visibilityChanged);
		}
		gxp.tree.LayerNodeUI.superclass.render.apply(this, arguments);
    },
	/** private: method[enforceOneVisible]
     * 
     *  Makes sure that only one layer is visible if checkedGroup is set.
     */
    enforceOneVisible: function() {
        var attributes = this.node.attributes;
        var group = attributes.checkedGroup;
        // If we are in the baselayer group, the map will take care of
        // enforcing visibility.
        if(group && group !== "gx_baselayer") {
            var layer = this.node.layer;
            if(this.node.getOwnerTree()) {
                var checkedNodes = this.node.getOwnerTree().getChecked();
                var checkedCount = 0;
                // enforce "not more than one visible"
                Ext.each(checkedNodes, function(n){
                    var l = n.layer
                    if(!n.hidden && n.attributes.checkedGroup === group) {
                        checkedCount++;
                        if(l != layer && attributes.checked) {
                            l.setVisibility(false);
                        }
                    }
                });
                // enforce "at least one visible"
                if(this.node.layer.options.forceOneVisible !== false && checkedCount === 0 && attributes.checked == false) {
                    layer.setVisibility(true);
                }
            }
        }
    }
});