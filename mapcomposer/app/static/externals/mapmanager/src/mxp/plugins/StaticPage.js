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
 *  class = StaticPage
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: StaticPage(config)
 *
 * Open a Tab with a static page. In this implementation it uses an Iframe,
 * But in the future we can configure it to use XTemplates and data from GeoStore
 * or statically configured. Iframe is only an option.
 */
mxp.plugins.StaticPage = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_usermanager */
    ptype: "mxp_static_page",

    //config
    loginManager: null, 
    scrollable:true,
    setActiveOnOutput: true,
     /** api: config[src]
     *  ``String`` The url of the page to include as an iframe
     * the default default "/"
     */
    src: "/",
     /** api: config[title]
     *  ``String`` The title of the tab.
     */
    title: "Home",
   
    // default configuration for the output
    outputConfig: {                  
        width:900,
        height:650,
        collapsible:false,
        maximizable: true,
        maximized: true,
        //closable: true,
        modal: true,
        closeAction: 'close',
        constrainHeader: true,
        maskEmpty: true

    },

    /** api: method[addActions]
     */
    addActions: function() {
        
        
        var actions = [];
        var out = mxp.plugins.StaticPage.superclass.addActions.apply(this, [actions]);
        //this.addOutput(this.outputConfig);
        return out;
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        
        
        var iframeconfig = {
            waitMsg: this.loadingMessage,
            collapsible:false,
            viewConfig: {
                forceFit: true
            },
            bodyCls:'iframe',
            maskEmpty: true,
            src: this.src,
            onEsc: Ext.emptyFn,
            title:this.title,
            waitMsg: null,
            onRender: function(ct) {
        
                this.iframeId= Ext.id();
                this.bodyCfg = {
                    tag: 'iframe',
                    id:this.iframeId,
                    src: this.src,
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

		//hide selection layer on tab change
		return mxp.plugins.StaticPage.superclass.addOutput.call(this, Ext.apply(iframeconfig,config));
		
	}
   
});

Ext.preg(mxp.plugins.StaticPage.prototype.ptype, mxp.plugins.StaticPage);