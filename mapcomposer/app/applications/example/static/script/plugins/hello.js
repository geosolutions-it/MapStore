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

/** api: (define)
 *  module = gxp.plugins
 *  class = HelloWorld
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: HelloWorld(config)
 *
 *    Sample Plugin
 *
 */ 
gxp.plugins.HelloWorld = Ext.extend(gxp.plugins.Tool, {
    ptype:'gxp_hello',
     
    /** i18n */
    menuText:'hello',
    text:'Hello', 
    title:'Hello Window',
    iconCls:'gx-hello',
    tooltip:'Open the Hello Window',
	
	
    /** end of i18n */
    /** api: config[description]
     *  ``String`` Html to show in the window
     */
    description: '<h2> Hello window</h2><p>I just wanted to say hello</p>',
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
                this.showHello();
            },
            scope: this
        }];
        if(this.showOnStartup){
            this.target.on('ready', this.showHello,this);
        
        }
        return gxp.plugins.HelloWorld.superclass.addActions.apply(this, [actions]);
    },
	
    showHello:function(){
		
		new Ext.Window(Ext.apply({
		   layout:'fit',
		   title: this.title,
		   border:false,
		   autoScroll:false,
		   items:{html: this.description, autoScroll:true, bodyStyle:'padding:10px'},
		   modal:true,
		   height:200
		},this.windowOptions)).show();
    }    
});

Ext.preg(gxp.plugins.HelloWorld.prototype.ptype, gxp.plugins.HelloWorld);