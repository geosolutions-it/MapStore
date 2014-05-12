/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 
/** api: (define)
 *  module = mxp.plugins
 *  class = MapViewer
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: MapViewer(config)
 *
 *    Open the map viewer
 */
mxp.plugins.MapViewer = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_mapviewer */
    ptype: "mxp_mapviewer",

    buttonText: "Map",
    tooltipText: "Open the default map viewer",
    iframeWaitText: "Please wait...",
    iframeViewerTitleText: "Map",

    loginManager: null, 

    setActiveOnOutput: true,

    // url for mapstore
    mapStoreUrl: "http://localhost/MapStore",

    // default configuration for the output
    outputConfig: {
        renderMapToTab: 'mainTabPanel',
        adminPanelsTargetTab : 'mainTabPanel',
        viewConfig: {
            forceFit: true
        }       
    },

    /** api: method[addActions]
     */
    addActions: function() {
        
        var thisButton = new Ext.Button({
            text: this.buttonText,
            tooltip: this.tooltipText,
            handler: function() { 
            	this.addOutput();                        
            },
            scope: this
        });

        var actions = [thisButton];
        // var actions = [];

        return mxp.plugins.MapViewer.superclass.addActions.apply(this, [actions]);

        this.addOutput(this);
    },
    
    /** api: method[addOutput]
     *  :arg config: ``Object`` configuration for the ``Ext.Component`` to be
     *      added to the ``outputTarget``. Properties of this configuration
     *      will be overridden by the applications ``outputConfig`` for the
     *      tool instance.
     *  :return: ``Ext.Component`` The component added to the ``outputTarget``. 
     *
     *  Adds output to the tool's ``outputTarget``. This method is meant to be
     *  called and/or overridden by subclasses.
     */
    addOutput: function(config) {

        var login = this.target.login ? this.target.login: 
                this.loginManager && this.target.currentTools[this.loginManager] 
                ? this.target.currentTools[this.loginManager] : null;

        // create a map viewer panel
    	Ext.apply(this.outputConfig, this.getMapComposer(this.mapStoreUrl));

        return mxp.plugins.MapViewer.superclass.addOutput.apply(this, arguments);
    },

    /**
     * Private: getMapComposer 
     * 
     * mapUrl - {url} MapComposer URL
     * 
     */
    getMapComposer : function(mapUrl) {
            var scrollTop;
            var src = mapUrl;
            
            var iframeconfig = {
                // xtype: "panel",
                waitMsg: this.iframeWaitText,
                width:900,
                height:650,
                collapsible:false,
                maximizable: true,
                maximized: true,
                closable: false,
                modal: true,
                closeAction: 'close',
                constrainHeader: true,
                maskEmpty: true,
                title: this.iframeViewerTitleText,
                src: src,
                onEsc: Ext.emptyFn
            };

        return new Ext.IframeTab(iframeconfig);
    },
});

Ext.preg(mxp.plugins.MapViewer.prototype.ptype, mxp.plugins.MapViewer);