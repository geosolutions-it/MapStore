/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SearchContainer
 */
 
 
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SearchContainer(config)
 *
 *    Plugin for adding a new group on layer tree.
 */
gxp.plugins.SearchContainer = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_addgroup */
    ptype: "gxp_searchcontainer",

		
	title: "Ricerca",	
	
		
	constructor: function(config) {
        gxp.plugins.SearchContainer.superclass.constructor.apply(this, arguments);
    },
	
	/** private: method[init]
	* :arg target: ``Object`` The object initializing this plugin.
	*/
	init: function(target) {
		gxp.plugins.SearchContainer.superclass.init.apply(this, arguments);
	},

    /** 
     * api: method[addActions]
     */
    addOutput: function() {
        var apptarget = this.target;
        
				
		var container = new Ext.Panel({
			title: this.title,
			borders: false,
			layout:'accordion',
			height: 300
		});
        
		var panel = gxp.plugins.SearchContainer.superclass.addOutput.call(this, container);
        return panel;
    }
        
});

Ext.preg(gxp.plugins.SearchContainer.prototype.ptype, gxp.plugins.SearchContainer);