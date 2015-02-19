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
 *  class = HelpButton
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: HelpButton(config)
 *
 *    Plugin for adding a custom help button to MapStore. This will show an help window
 *    The HelpButton tool can be configured by setting this tool's 
 *    ``outputConfig`` property.
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */ 
gxp.plugins.HelpButton = Ext.extend(gxp.plugins.Tool, {
    ptype:'gxp_help',
     
    /** i18n */
    menuText:'help',
    text:'Help', 
    title:'Help Window',
    iconCls:'gx-help',
    tooltip:'Open the Help Window',
	
	fileDocURL: null,
	
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
        return gxp.plugins.HelpButton.superclass.addActions.apply(this, [actions]);
    },
	
    showHelp:function(){
		if (!this.fileDocURL) {
			new Ext.Window(Ext.apply({
			   layout:'fit',
			   title: this.title,
			   border:false,
			   autoScroll:false,
			   items:{html: this.description, autoScroll:true, bodyStyle:'padding:10px'},
			   modal:true,
			   height:200
			},this.windowOptions)).show();
		} else{
			//var url = 'http://' + window.location.host + '/' + this.fileDocURL;
			window.open(this.fileDocURL);
		}
    }    
});

Ext.preg(gxp.plugins.HelpButton.prototype.ptype, gxp.plugins.HelpButton);