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
 * Class: CSWPanel
 * Form che contiene il widget di ricerca.
 * 
 * Inherits from:
 *  - <Ext.Panel>
 *
 */
CSWPanel = Ext.extend(Ext.Panel, {
    /**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,   
    
    layout: 'border',
    
    defaults: {
        collapsible: true,
        split: true,
        bodyStyle: 'padding:5px'
    },    
    
    monitorResize: true,
    /*defaults: {
        // implicitly create Container by specifying xtype
        xtype: 'container',
        layout: 'form',
        columnWidth: 0.5,
        style: {
            padding: '3px'
        }
    },*/    

	/**
	 * Property: title
     * {string}aggiunge un titolo al pannello.
	 */ 
	title : "Metadata Explorer",
    /**
	 * Property: defaults
     * {object} opzioni di default dei componenti contenuti nel pannello
	 */ 
	/*defaults: {
		collapsible: false,
		//split: true,
		bodyStyle: "padding: 2px",
		
	},*/
    /**
	 * Property: iconCls
     * {string} classe associata all'icona
	 */ 
    iconCls: "icon-table",
	
	
	/**
	 * Property: map
     * {object} opzionale. Mappa da associare al pannello.
	 */ 
	map : null,
	/**
	 * Property: config
	 * Oggetto per la configurazione  componente. Vedere <config.js>
	 *
	 */
	config : null,
	/**
	 * Property: panelMode
	 * {boulean}. Se true indica che il CSWPanel � impostato come addAction altrimenti come addOutput
	 *
	 */    
    cswPanelMode: null,
	
	events : [
	
		"zoomToExtent",
    /**
	 * Event: zoomToExtent 
	 * Evento scatenato dalla pressione del tasto "Vis. Estensione" all'interno dei singoli record della griglia.
	 * 
	 * Parameters:
	 * el {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
	 * el.bbox - {Object} bounding Box del record
	 * el.crs  -  {Object}crs della boundingbox
	 */
	 "viewMap"
	 /**
	 * Event: viewMap
	 * Evento scatenato dalla pressione del tasto "Visualizza Mappa" all'interno dei singoli record della griglia.
	 *
	 * Parameters:
	 * layerInfo {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
	 * layerInfo.bbox - {object} bounding Box del record
	 * layerInfo.crs -  {string}crs del record
	 * layerInfo.Layers - {Array}. Array contenenti tutti i layer associati al record
	 * 
	 */
	],
    
	/*autoWidth:true,
	autoHeight:true,
	border: false,*/
    
    
	//PRIVATE
	searchTool : null,

	cswGrid : null,
	
	initComponent : function() {
		//init GUI Components
		this.cswGrid = new CSWGrid({
			 loadMask: {msg: i18n.getMsg("loadWait")},
			 config: this.config,
			 map: new Ext.KeyMap(document, [{
				key: Ext.EventObject.ESC,
				fn: function(){
				
						if(this.cswGrid.store.proxy){
							this.cswGrid.store.proxy.getConnection().abort();
							this.cswGrid.loadMask.hide();
							//extenalize if possible
							this.searchTool.resetButton.enable();
							this.searchTool.searchButton.enable();
							this.searchTool.catalogChooser.enable();
						}
					
					},
					scope: this
				}])
		});
		
		this.searchTool = new CSWSearchTool({
		    grid: this.cswGrid,
			dcProperty : this.config.dcProperty,
			panel: this,
            cswPanelMode: this.cswPanelMode,
            autoHeight:true,
            style:"margin-left:5px;margin-right:5px;"  ,         
			initialBBox: new OpenLayers.Bounds(
					this.config.initialBBox.minx, 
					this.config.initialBBox.miny, 
					this.config.initialBBox.maxx, 
					this.config.initialBBox.maxy
			),
			filterVersion: this.config.filterVersion	
		});
        
        if(this.cswPanelMode === 'addActions'){
            //items for actionTarget		
            this.items = [ 
                {
                    layout: 'anchor',
                    defaults: {anchor: '-19'},
                    height: 270,
                    width: 350,
                    autoScroll: true,
                    region:'north',
                    items:[this.searchTool]
                 },
                {
                    layout:'fit',
                    //height: 250,
                    collapsible: false,
                    region:'center',
                    items:[this.cswGrid]  
                }
            ];
        }else{
            //items for outputTarget
            this.title = null;
            this.iconCls = null;
            this.items = [ 
                {
                    layout: 'anchor',                  
                    defaults: {anchor: '-19'},
                    autoScroll: true,
                    region:'west',
                    minWidth: 410,
                    //maxWidth: 410,
                    width: 410,
                    items:[this.searchTool]
                 },
                {
                    layout:'fit',
                    collapsible: false,
                    region:'center',
                    items:[this.cswGrid]  
                }
            ];        
        }
		//event Handler associaton
		this.addEvents(this.events);
		

		this.initParameters(this.config.catalogs);
		
		CSWPanel.superclass.initComponent.call(this);
	},

	/**
	 * Method: initParameter	
	 * Inizializza Il Pannello. Deve essere chiamato dopo
	 * che gli widget sono stati inizializzati con initComponent.
	 */
	initParameters : function (catalogs) {
		
		// Setup catalog chooser widget with catalogs stored in this instance
		this.searchTool.initParameters(catalogs);
		
		// Adds an event to clear up the resuls grid when a new
		// catalog is called and check the new catalog server is working
		var storeClosure = this.cswGrid.store; 

		
		this.searchTool.catalogChooser.addListener("select", 
			  function() {
					storeClosure.removeAll(); 
					storeClosure.catalogUrl = this.getValue();
                    
			  }
		);	
		
		this.searchTool.panel = this;
	}
});

/** api: xtype = csw */
Ext.reg('csw', CSWPanel);