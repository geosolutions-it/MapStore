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
 * Class: CSWSearchTool
 * Pannello per l'inserimento dei criteri di ricerca.
 * 
 * Inherits from: 
 * - <Ext.form.FormPanel>
 * 
 */
CSWSearchTool = Ext.extend(Ext.form.FormPanel, {
	/**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
	/**
	 * Property: autoWidth
     * {boolean} se true, imposta la larghezza del componente automaticamente 
	 */ 
	autoWidth: true,

	/**
	 *Parameter: dateFormat 
	 * ISO-8601, necessario per i filtri OGC 
	 */
	dateFormat : "Y-m-d",
	/**
	 * Property: dcProperty
	 * {string} Proprieta' Dublin core da inserire come parametro all'interno della ricerca avanzata.
	 */
	dcProperty : null,
	/**
	 * Property: filterVersion
	 *  {string} Versione del Filtro OGC
	 */
	filterVersion:null,
	/**
	 * Property: buttonAlign
	 *  {string} allineamento dei pulsanti
	 */
	buttonAlign: 'center',
	
	
	//PRIVATE PROPERTIES

	advancedSearchSet : null,

	basicSearchSet : null,

	// Widget for choosing a different catalog
	catalogChooser : null,

	// Search button
	searchButton : null,

	// Widget for free-text search
	freeText : null,

	// Wiogets for choosing a last modified date
	lastModifiedBegin : null,

	lastModifiedEnd : null,

	// Widget for selecting/deselecting the use of BBOX in search
	useBox : null,

	// Widget for entering the value of a DC attribute
	dcValue : null,

	// Parent panel
	panel : null,
    
	// Loading mask showed when the application tests compatibility
    // with the remote catalog
    mask: null,

	autoHeight:true,
	/**
	 * Method: initParameters 
	 * Inizializza la comboBox che contiene i cataloghi tra cui scegliere
	 *
	 * Parameters:
	 * catalogs - {Array} cataloghi da cui scegliere. il formato degli elementi e' del tipo { *name:* "nome" , *url:* "url_catalogo_csw", *description:* "descrizione opzionale" } 
	 *
	 */
	initParameters : function(catalogs) {
		this.catalogChooser.initParameters(catalogs);
	},

	/**
	 * Method: search 
	 * effettua la ricerca  
	 *
	 * params - {Object} parametri di ricerca
	 */
	search : function(params) {

		// Builds individual filters
		var filters = new Array();

		// Free-text condition
		if (params.freeText != "") {
			var filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.LIKE,
				property : "apiso:AnyText",
				value : params.freeText
			});
			filters.push(filter);
		}

		// If advanced search is to be used, adds the conditions
		if (!this.advancedSearchSet.collapsed) {

			/*
			 * DC property condition. Since these properties are tokenized by
			 * GeoNetwork, the EQUAL_TO looks for individual words, not for portions
			 * of them. The use of LIKE may be less intuitive for the users, since it
			 * would imply the insertion of wildcard characters
			 */
			if (params.dcValue != "") {
				/*
				 * var filter= new OpenLayers.Filter.Comparison({ type:
				 * OpenLayers.Filter.Comparison.LIKE, property: this.panel.dcProperty,
				 * value: params.dcValue } );
				 */
				 
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.EQUAL_TO,
					property : this.dcProperty,
					matchCase : false,
					value : params.dcValue
				});
				filters.push(filter);
			}

			// BBOX condition
			if (params.useBbox == true) {
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Spatial.BBOX,
					property : "ows:BoundingBox",
					value : this.initialBBox
				});
				filters.push(filter);
			}
			
			// Last modified interval begin condition
			if (params.lastModifiedBegin != "") {
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
					property : "tempExtentBegin",
					// ISO-8601, needed for OGC filters
					value : params.lastModifiedBegin.format(this.dateFormat) + "T00:00:00Z"
				});
				filters.push(filter);
			}

			// Last modified interval end condition
			if (params.lastModifiedEnd != "") {
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
					property : "tempExtentEnd",
					// ISO-8601, needed for OGC filters
					value : params.lastModifiedEnd.format(this.dateFormat) + "T23:59:59Z"
				});
				filters.push(filter);
			}
		}

		// Builds the query options
		var options = {
			url : this.catalogChooser.getValue(),
			filterVersion : this.filterVersion,
			resultType : "full"
		};

		// If no filter has been set, builds the query as to select every record,
		// otherwise the conditions are applied as filters
		if (filters.length != 0) {
			options.filter = new OpenLayers.Filter.Logical({
				type : OpenLayers.Filter.Logical.AND,
				filters : filters
			});
			options.emptySearch = false;
		} else {
			options.emptySearch = true;
		}
		
		this.resetButton.disable();
		this.searchButton.disable();
		this.catalogChooser.disable();
			
		this.panel.cswGrid.store.on("load",function(){
			this.resetButton.enable();
			this.searchButton.enable();
			this.catalogChooser.enable();
		}, this);
		this.panel.cswGrid.store.on("loadexception",function(){
			this.resetButton.enable();
			this.searchButton.enable();
			this.catalogChooser.enable();
		}, this);
		
		this.panel.cswGrid.initParameters(options);
	},

	/**
	 * Method: initComponent 
	 * inizializza i componenti della GUI
	 */
	initComponent : function() {
        //
		//CATALOG PANEL ELEMENTS
        //
		this.catalogChooser = new CSWCatalogChooser({
			//width : 200,
			XDProxy: this.panel.config.XDProxy,
            cswVersion: this.panel.config.cswVersion,
			fieldLabel : i18n.getMsg("catalogField"),
			emptyText : i18n.getMsg("catalogEmptyText"),
            labelStyle : 'width: 150px',
			width: 200
            
		});
        
        this.catalogDescriptionPanel = new Ext.Panel({
            xtype: 'panel',
            id: 'suggestintropan',
            //height: 70,
            width:350,
            autoHeight: true,
            border: false,
            collapsible: true,
            collapsed: true,
            collapseMode: 'mini',
            hideCollapseTool: true
			
        });
        
        //
        //BUTTONS
        //        
		this.searchButton = new Ext.Button({
			text : i18n.getMsg("search"),
			scope : this,
			iconCls: 'icon-search',
			tooltip: i18n.getMsg("searchTooltip"),
			handler : function() {
				this.search({
					freeText : this.freeText.getValue(),
					lastModifiedBegin : this.lastModifiedBegin.getValue(),
					lastModifiedEnd : this.lastModifiedEnd.getValue(),
					useBbox : this.useBbox.getValue(),
					dcValue : this.dcValue.getValue()
				});
			}
		});

		this.resetButton = new Ext.Button({
			text : i18n.getMsg("reset"),
			iconCls: 'icon-reset',
			tooltip: i18n.getMsg("resetTooltip"),
			scope : this,
			handler : function() {
				this.getForm().reset();
				this.searchButton.disable();
				this.resetButton.disable();
				this.advancedSearchSet.collapse(true);
				this.lastModifiedEnd.setMinValue();
				this.lastModifiedBegin.setMaxValue();
				this.panel.cswGrid.getStore().removeAll(); 
                this.catalogDescriptionPanel.update("");
                this.catalogDescriptionPanel.collapse();
				
                
			}
		});
        //
        //CATALOG SELECTION FIELDSET
        //
        this.catalogSelectionPan= new Ext.form.FieldSet({
            title: i18n.getMsg("catalogSelection"),
            autoHeight : true,
			collapsed : false,
			collapsible : false,
			/*defaults:{
				labelStyle : 'width: 150px',
				width: 200
				
			},*/
            items: [this.catalogChooser, this.catalogDescriptionPanel]
        
        });
        /*
        //BASIC SEARCH FIELDSET
		this.basicSearchSet = new Ext.form.FieldSet({
			//title : i18n.getMsg("basicSearchSet"),
			border: false,
            autoHeight : true,
			collapsed : false,
			collapsible : false,
			defaults:{
				labelStyle : 'width: 150px',
				width: 200
				
			},
			listeners : {
				scope : this,
				expand : function(panel) {
					this.advancedSearchSet.collapse(true);
				}
			},
			items : [ this.freeText ]
		});
        */
        
        //
        //SEARCH ELEMENTS
        //
        this.freeText = new Ext.form.TextField({
			fieldLabel : i18n.getMsg("freeText"),
			labelStyle : 'width: 150px',
			width: 200,
			emptyText : i18n.getMsg("anyText"),
			enableKeyEvents : true,
			
			listeners : {
				scope : this,
				keydown : function(txt, evt) {
					if (evt.getKey() == 13 && this.catalogChooser.getValue()) {
						this.searchButton.handler.call(
								this.searchButton.scope,
								this.searchButton.searchButton
						);
					}
				}
			}
		});
		this.lastModifiedBegin = new Ext.form.DateField({
			fieldLabel : i18n.getMsg("modifiedbegin"),
			width : 170,
			format : this.dateFormat,
			editable: false,
			labelStyle : 'width: 140px',
			listeners:{
				scope: this,
				change: function(newValue,OldValue){
					this.lastModifiedEnd.setMinValue(OldValue);
				}
			}
		});
		

		this.lastModifiedEnd = new Ext.form.DateField({
			fieldLabel : i18n.getMsg("modifiedend"),
			width : 170,
			format : this.dateFormat,
			editable:false,
			labelStyle : 'width: 140px',
			listeners:{
				scope: this,
				change: function(newValue,OldValue){
					this.lastModifiedBegin.setMaxValue(OldValue);
				
				}
			}
		});

		this.useBbox = new Ext.form.Checkbox({
			fieldLabel : i18n.getMsg("mapExtent"),
			labelStyle : 'width: 140px'
		});

		this.dcValue = new Ext.form.TextField({
			labelStyle : 'width: 140px',
			width: 200,
			fieldLabel : i18n.getMsg("dcProperty" + this.dcProperty)
		});

		//ADVANCED SEARCH FIELDSET
		this.advancedSearchSet = new Ext.form.FieldSet({
			checkboxToggle : true,
			title : i18n.getMsg("advancedSearchSet"),
			autoHeight : true,
			collapsed : true,
			layout: 'table',
			layoutConfig:{columns: 2},
			
			items : [ 
				//first date row
				{
					layout: "form",
					border: false,
					colspan: 1,
					width:320,
					items: [this.lastModifiedBegin]
                },
				{
					layout: "form",
					border: false,
					colspan: 1,
					style:"position:relative;top:-2px;",
					items: [
						new Ext.Button ({
							iconCls: 'icon-reset',
							tooltip: i18n.getMsg("clearDateBegin"),
							scope:this,
							handler:function(){
								this.lastModifiedBegin.reset();
								this.lastModifiedEnd.setMinValue();
							}
						})
					]
                },
				//second date row
				{
					layout: "form",
					border: false,
					colspan: 1,
					width:320,
					items: [this.lastModifiedEnd]
                },
				{
					layout: "form",
					border: false,
					colspan: 1,
					style:"position:relative;top:-2px;",
					
					items: [
						new Ext.Button ({
							iconCls: 'icon-reset',
							tooltip: i18n.getMsg("clearDateEnd"),
							scope:this,
							handler:function(){
								this.lastModifiedEnd.reset();
								this.lastModifiedBegin.setMaxValue();
							}
						})
					]
                },
                //other fields
				{
					layout: "form",
					border: false,
					colspan: 2,
					width:345,
					items: [
						this.useBbox
					]
                },{
					layout: "form",
					border: false,
					colspan: 2,
					width:345,
					items: [this.dcValue]
                }
            ]
		});
		//
        //SEARCH FIELDSET
        //
        this.SearchSet = new Ext.form.FieldSet({
			title : i18n.getMsg("basicSearchSet"),
            autoHeight : true,
            //autoWidth: true,
			collapsed : false,
			collapsible : false,
			items : [ this.freeText, this.advancedSearchSet ]
		});
        
		this.items = [ this.catalogSelectionPan, this.SearchSet ];

		this.buttons = [ this.searchButton, this.resetButton ];

		this.searchButton.disable();
		this.resetButton.disable();
        
        //event associations
		this.catalogChooser.on('select', function() {
			this.searchButton.disable();
			this.resetButton.disable();
            this.mask =new Ext.LoadMask(this.el, {msg:i18n.getMsg("getCapabilitiesWait")});
            this.mask.show();   
            
		}, this);
        
		this.catalogChooser.on('selectsupported', function(msg) {
            //enable buttons
			this.searchButton.enable();
			this.resetButton.enable();
            this.mask.hide();
            this.mask=null;
            //show description
            msg = '<div class="catalog-desc-ok">'+ msg + '</div>';
            this.catalogDescriptionPanel.update(msg);
            this.catalogDescriptionPanel.expand();
			this.panel.setSize(this.panel.width -31,this.panel.getHeight);
			
		}, this);
        
		this.catalogChooser.on('selectunsupported', function(msg) {
			this.searchButton.disable();
			this.resetButton.disable();
            this.mask.hide();
            this.mask=null;
            //Show Description
            var msg = '<div class="catalog-desc-error" /><div>'+ msg + '</div>';
            this.catalogDescriptionPanel.update(msg);
            this.catalogDescriptionPanel.expand();
			this.panel.setSize(this.panel.width -31,this.panel.getHeight);
		}, this);
        
        this.catalogChooser.on('selectiunknownsupport', function(msg) {
            //enable buttons
			this.searchButton.enable();
			this.resetButton.enable();
            this.mask.hide();
            this.mask=null;
            //show description
            var msg = '<div class="catalog-desc-warning">'+ msg + '</div>';
            this.catalogDescriptionPanel.update(msg);
            this.catalogDescriptionPanel.expand();
			this.panel.setSize(this.panel.width -31,this.panel.getHeight);
            //show description
          
            
		}, this);
        
		CSWSearchTool.superclass.initComponent.call(this);
	}
});
