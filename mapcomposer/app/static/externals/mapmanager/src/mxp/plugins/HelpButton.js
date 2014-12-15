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
 *  class = HelpButton
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("mxp.plugins");

/** api: constructor
 *  .. class:: HelpButton(config)
 *
 *    Plugin for adding a custom help button to MapStore Manager. This will show an help window
 *    The HelpButton tool can be configured by setting this tool's 
 *    ``outputConfig`` property.
 *
 *  Author: Lorenzo Natali at lorenzo.natali@geo-solutions.it
 */ 
mxp.plugins.HelpButton = Ext.extend(mxp.plugins.Tool, {
    ptype:'mxp_help',
     
    /** i18n */
    menuText:'help',
    text:'Help', 
    title:'Help Window',
    iconCls:'gx-help',
    tooltip:'Open the Help Window',
    
    /** api: config[keyShowAgain]
     *  ``String`` key of the localStorage to store and retrieve the 
     *   "don't show again this message" flag
     */
	keyShowAgain:"showAgainManagerHelp",
    
     /** api: config[fileDocURL]
     *  ``String`` if present, the window will load the page at the URL in this confiugration parameter in an iframe
     */
	fileDocURL: null,
	
    /** end of i18n */
    /** api: config[description]
     *  ``String`` Html to show in the window
     */
    description: '<h2> Help window</h2><p>This is a sample help window</p>',
    dontShowThisMessageAgainText: "Don't show this message again",
    
    /** api: config[showOnStartup]
     *  ``Boolean`` Show the window on startup if true
     */
    showOnStartup:false,
    
   // width and height are not configurable at the moment
   // TODO investigate why this happens.
   windowHeight: 600,
   windowWidth: 600,
    
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
        if(this.showOnStartup && this.isShowAllowed()){
            this.showHelp();
        
        }
        return mxp.plugins.HelpButton.superclass.addActions.apply(this, [actions]);
    },
	
    showHelp:function(){

			//var url = 'http://' + window.location.host + '/' + this.fileDocURL;
			//use an Iframe
        var me = this;        
        var iframeconfig = {
            waitMsg: this.loadingMessage,
            collapsible:false,
            viewConfig: {
                forceFit: true
            },
            bodyCls:'iframe',
            maskEmpty: true,
            src: this.fileDocURL,
            onEsc: Ext.emptyFn,
            waitMsg: null,
            onRender: function(ct) {

                this.iframeId= Ext.id();
                this.bodyCfg = {
                    tag: 'iframe',
                    id:this.iframeId,
                    src: me.fileDocURL,
                    cls: this.bodyCls,
                    style: {
                        border: '0px none'
                    }
                };
                Ext.IframeTab.superclass.onRender.apply(this, arguments);
                var myMask;
                if(this.waitMsg){
                    myMask = new Ext.LoadMask(this.getEl(), {msg:this.waitMsg});
                    myMask.show();
                }
                this.body.on('load',function(){
                    if(myMask){
                        myMask.hide();
                    }
                });
            }

        };

        new Ext.Window(Ext.apply({
           layout:'fit',
           iconCls:this.iconCls,
           title: this.title,
           border:false,
           autoScroll:false,
           items: this.fileDocURL ? iframeconfig : {html: this.description, autoScroll:true, bodyStyle:'padding:10px'},
            bbar:[{
                xtype: 'checkbox',
                boxLabel: this.dontShowThisMessageAgainText,
                checked: ! this.isShowAllowed(),
                listeners:{
                    check: function(box,checked){
                        localStorage[me.keyShowAgain] = ! checked;

                    }
                }
            }],
           modal:true
        },{
            height:this.windowHeight,width:this.windowWidth
        })).show();
		
    },
    isShowAllowed: function(){
        var deny = localStorage[this.keyShowAgain];
        if(deny === "false"){
            return false;
        }
        return true;
    }
});

Ext.preg(mxp.plugins.HelpButton.prototype.ptype, mxp.plugins.HelpButton);