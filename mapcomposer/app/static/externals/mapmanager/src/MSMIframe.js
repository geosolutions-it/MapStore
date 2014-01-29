/*
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
 * Class: MSMIframe
 * 
 * Inherits from:
 *  - <Ext.Window>
 *
 */
Ext.IframeWindow = Ext.extend(Ext.Window, {

    waitMsg: null,
    onRender: function() {
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
        Ext.IframeWindow.superclass.onRender.apply(this, arguments);
        var myMask;
        if(this.waitMsg){
            myMask = new Ext.LoadMask(Ext.getBody(), {msg:this.waitMsg});
            myMask.show();
        }
        this.body.on('load',function(){
            if(myMask){
                myMask.hide();
            }
        });
    }
});

Ext.IframeTab = Ext.extend(Ext.Panel, {
    
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
});

