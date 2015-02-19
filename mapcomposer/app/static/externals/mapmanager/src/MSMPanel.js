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
 * Class: MSMPanel
 * Panel that contains MapStoreManager grid.
 * 
 * Inherits from:
 *  - <Ext.Panel>
 *
 */

MSMPanel = Ext.extend(Ext.Panel, {
    /**
     * Property: id
     * {string} id of extPanel
     * 
     */
    id: 'id_mapManagerPanel',
    /**
     * Property: config
     * {object} object for configuring the component. See <config.js>
     *
     */
    config : null,
    /**
     * Property: border
     * {boolean} If set to true, a border is drawn.
     * 
     */ 
    border : true,
    /**
     * Property: title
     * {string} add a title to a panel.
     * 
     */ 
    title : "MapManager",
    /**
     * Property: iconCls
     * {string} class associated to icon
     * 
     */ 
    iconCls: "server_map",
    /**
     * Property: layout
     * {string} sets the type of layout
     * 
     */ 
    layout:'fit',
    /**
     * Property: lang
     * {string} sets application locale
     * 
     */ 
    lang: null,
    /**
     * Property: langSelector
     * {object} combo to select a locale parameter
     * 
     */ 
    langSelector: null,
    /**
     * Method: initComponent
     * Initializes the component
     * 
     */
     
     
     /**
     * Property: renderMapToTab
     * {string} the id of the Ext.TabPanel to use to render the map iframe
     * if not present, the Composer/Viewer will be rendered into a window.
     * 
     */ 
    renderMapToTab: null,
     
     
     /**
     * Property: adminPanelsTargetTab
     * {string} the id of the Ext.TabPanel to use to render the administration panels
     * 
     */ 
    adminPanelsTargetTab : null,
    
    initComponent : function() {

        this.items = new MSMGridPanel({
            start: this.config.start,
            limit: this.config.limit,
            msmTimeout:this.config.msmTimeout,
            lang: this.lang,
            config: this.config,
            renderMapToTab: this.renderMapToTab,
            langSelector: this.langSelector,
            adminPanelsTargetTab: this.adminPanelsTargetTab
        });
        
        MSMPanel.superclass.initComponent.call(this, arguments);
        
    }
});
