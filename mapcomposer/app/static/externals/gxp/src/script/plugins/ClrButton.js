/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ClrButton
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ClrButton(config)
 *
 *    Plugin for adding a custom help button to MapStore. This will show an help window
 *    The ClrButton tool can be configured by setting this tool's 
 *    ``outputConfig`` property.
 */
 
gxp.plugins.ClrButton = Ext.extend(gxp.plugins.Tool, {
    ptype:'gxp_clr',
     
    /** i18n */
    menuText:'help',
    text:'Canc', 
    title:'Help Window',
    iconCls:'icon-clr',
    tooltip:'Clear Search Results',	
	selectionLayerTitle:'Selection Layer',
	
	link: '',	
	fileName: 'help',

    /** end of i18n */
    /** api: config[description]
     *  ``String`` Html to show in the window
     */
    description: '<h2> Help window</h2><p>This is a sample help window</p>',
    /** api: config[showOnStartup]
     *  ``Boolean`` Show the window on startup if true
     */
    showOnStartup:false,
    /** api: config[windowOptions]
     *  ``Object`` Options for override the window configuration
     */
    windowOptions:{
        height:200,
        width:500
    },
    
    /** api: method[addActions]
     */
    addActions: function() {
        var actions = [{
            menuText: this.menuText,
            text:this.text,
            enableToggle: false,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function(button, state) {
                this.showHelp();
            },
            scope: this
        }];
        if(this.showOnStartup){
            this.target.on('ready', this.showHelp,this);
        
        }
        return gxp.plugins.ClrButton.superclass.addActions.apply(this, [actions]);
    },
	
    showHelp:function(){
		var apptarget = this.target;
		
		var layer = apptarget.mapPanel.map.getLayersByName(this.selectionLayerTitle)[0];
		if(layer){
			apptarget.mapPanel.map.removeLayer(layer);																																			
		}
    }    
});

Ext.preg(gxp.plugins.ClrButton.prototype.ptype, gxp.plugins.ClrButton);