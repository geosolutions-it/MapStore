/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25
*/
/**
 * @class Ext.ux.TabCloseMenu
 * @extends Object 
 * Plugin (ptype = 'tabclosemenu') for adding a close context menu to tabs. Note that the menu respects
 * the closable configuration on the tab. As such, commands like remove others and remove all will not
 * remove items that are not closable.
 * 
 * @constructor
 * @param {Object} config The configuration options
 * @ptype tabclosemenu
 */
Ext.ux.TabCloseMenu = Ext.extend(Object, {
    /**
     * @cfg {String} closeTabText
     * The text for closing the current tab. Defaults to <tt>'Close Tab'</tt>.
     */
    closeTabText: 'Close Tab',

    /**
     * @cfg {String} closeOtherTabsText
     * The text for closing all tabs except the current one. Defaults to <tt>'Close Other Tabs'</tt>.
     */
    closeOtherTabsText: 'Close Other Tabs',
    
    /**
     * @cfg {Boolean} showCloseAll
     * Indicates whether to show the 'Close All' option. Defaults to <tt>true</tt>. 
     */
    showCloseAll: true,

    /**
     * @cfg {String} closeAllTabsText
     * <p>The text for closing all tabs. Defaults to <tt>'Close All Tabs'</tt>.
     */
    closeAllTabsText: 'Close All Tabs',
    
    constructor : function(config){
        Ext.apply(this, config || {});
    },

    //public
    init : function(tabs){
        this.tabs = tabs;
        tabs.on({
            scope: this,
            contextmenu: this.onContextMenu,
            destroy: this.destroy
        });
    },
    
    destroy : function(){
        Ext.destroy(this.menu);
        delete this.menu;
        delete this.tabs;
        delete this.active;    
    },

    // private
    onContextMenu : function(tabs, item, e){
        this.active = item;
        var m = this.createMenu(),
            disableAll = true,
            disableOthers = true,
            closeAll = m.getComponent('closeall');
        
        m.getComponent('close').setDisabled(!item.closable);
        tabs.items.each(function(){
            if(this.closable){
                disableAll = false;
                if(this != item){
                    disableOthers = false;
                    return false;
                }
            }
        });
        m.getComponent('closeothers').setDisabled(disableOthers);
        if(closeAll){
            closeAll.setDisabled(disableAll);
        }
        
        e.stopEvent();
        m.showAt(e.getPoint());
    },
    
    createMenu : function(){
        if(!this.menu){
            var items = [{
                itemId: 'close',
                text: this.closeTabText,
                scope: this,
                handler: this.onClose
            }];
            if(this.showCloseAll){
                items.push('-');
            }
            items.push({
                itemId: 'closeothers',
                text: this.closeOtherTabsText,
                scope: this,
                handler: this.onCloseOthers
            });
            if(this.showCloseAll){
                items.push({
                    itemId: 'closeall',
                    text: this.closeAllTabsText,
                    scope: this,
                    handler: this.onCloseAll
                });
            }
            this.menu = new Ext.menu.Menu({
                items: items
            });
        }
        return this.menu;
    },
    
    onClose : function(){
        this.tabs.remove(this.active);
    },
    
    onCloseOthers : function(){
        this.doClose(true);
    },
    
    onCloseAll : function(){
        this.doClose(false);
    },
    
    doClose : function(excludeActive){
        var items = [];
        this.tabs.items.each(function(item){
            if(item.closable){
                if(!excludeActive || item != this.active){
                    items.push(item);
                }    
            }
        }, this);
        Ext.each(items, function(item){
            this.tabs.remove(item);
        }, this);
    }
});

Ext.preg('tabclosemenu', Ext.ux.TabCloseMenu);