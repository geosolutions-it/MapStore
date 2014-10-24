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
 *  Implements the loadingProgress behaviour, if configured on layer(s).
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
		if(event.object.visibility === true) {
			this.addClass("x-tree-node-error");
		}
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
			this.node.layer.events.register('loadstart', this, this.loadStart);
			this.node.layer.events.register('loadend', this, this.loadEnd);
			this.node.layer.events.register('tileerror', this, this.loadError);
			this.node.layer.events.register('visibilitychanged', this, this.visibilityChanged);
		}
		gxp.tree.LayerNodeUI.superclass.render.apply(this, arguments);
		if(this.node.layer.options.loadingProgress && this.node.layer.loading) {
			this.addClass("x-tree-node-loading");
		}
    }
});