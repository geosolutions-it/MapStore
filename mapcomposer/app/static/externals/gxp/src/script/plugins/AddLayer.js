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
 
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: AddLayer(config)
 *
 *    Base class to add a new layer on the map accordingly the gxp rules.
 *    This means WMS source check/creation and also creation fo layerrecord 
 *    (for the layer tree) to add the new layer to the map.
 *
 *    ``createLayerRecord`` method.
 *      
 *	  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */   
gxp.plugins.AddLayer = Ext.extend(gxp.plugins.Tool, {
   
    /** api: ptype = gxp_addlayer */
    ptype: "gxp_addlayer",
	
	id: "addlayer",
	
    /** private: property[target]
     *  ``Object``
     *  The object that this plugin is plugged into.
     */
     
    /** api: property[untitledText]
     *  ``String``
     *  A descriptive title for this layer source.
     */
    untitledText: "",
	
	/** api: property[waitMsg]
     *  ``String``
     *  A wait message for this layer source loading.
     */
	waitMsg: "Please Wait ...",
	
	/** api: property[capabilitiesFailureMsg]
     *  ``String``
     *  A status message for a failure in the WMSCapabilities loading.
     */
	capabilitiesFailureMsg: " The layer cannot be added to the map", 
	
    /** api: property[useEvents]
     *  ``Boolean``
     *  
     */
	useEvents: false,
	
	/** api: property[showCapabilitiesGrid]
     *  ``Boolean``
     *  
     */
	showCapabilitiesGrid: false,
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
		
        Ext.apply(this, config);
        
        this.addEvents(
            /** api: event[ready]
             *  Fires when the layer source is ready for action.
             */
            "ready",
            /** api: event[failure]
             *  Fires if the layer source fails to load.
             */
            "failure"
        );
		
        gxp.plugins.AddLayer.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
		gxp.plugins.AddLayer.superclass.init.apply(this, arguments);
        this.target = target;
    },
	
	/**  
	 * api: method[addLayerRecord]
     */
	addLayerRecord: function(){
		  
		var props = {
			name: this.msLayerName,
			title: this.msLayerTitle,
			source: this.source.id
		};
		
		if(this.customParams){
			props = Ext.applyIf(
				props,
				this.customParams
			);
		}
		  
		if(this.msLayerUUID)
			props.uuid = this.msLayerUUID;
		
		if(this.gnUrl && this.gnLangStr)
			props.gnURL = this.gnUrl + "srv/" + this.gnLangStr + "/";
		  
		var record = this.source.createLayerRecord(props);   
				  
		if (record) {
			var layerStore = this.target.mapPanel.layers;  
			layerStore.add([record]);

			modified = true; // TODO: refactor this
					
		    //
			// If tabs are used the View tab is Activated
			//
			if(this.target.renderToTab && this.enableViewTab){
				var portalContainer = Ext.getCmp(this.target.renderToTab);
				
				if(portalContainer instanceof Ext.TabPanel){
					portalContainer.setActiveTab(1);
				}				
			}					
						
			// //////////////////////////
			// Zoom To Layer extent
			// //////////////////////////
			var layer = record.get('layer');
			var extent = layer.restrictedExtent || layer.maxExtent || this.target.mapPanel.map.maxExtent;
			var map = this.target.mapPanel.map;

			// ///////////////////////////
			// Respect map properties
			// ///////////////////////////
			var restricted = map.restrictedExtent || map.maxExtent;
			if (restricted) {
				extent = new OpenLayers.Bounds(
					Math.max(extent.left, restricted.left),
					Math.max(extent.bottom, restricted.bottom),
					Math.min(extent.right, restricted.right),
					Math.min(extent.top, restricted.top)
				);
			}

			map.zoomToExtent(extent, true);
		}
		
		return record;
	},

    /**  
	 * api: method[checkLayerSource]
	 * 
	 * wmsURL - The WMS service URL of the source.
	 * source (optional) - The given source identifier.  
     */
	checkLayerSource: function(wmsURL, source){
	    var s;
		for (var id in this.target.layerSources) {
			var src = this.target.layerSources[id];    
			var url  = src.initialConfig.url; 
			  
			// ////////////////////////////////////////////////////
			// Checking if the provided source ID aldready exists
			// ////////////////////////////////////////////////////
			if(source && id == source){
				s = src;
				break;
			}
			  
			// //////////////////////////////////////////
			// Checking if source URL aldready exists
			// //////////////////////////////////////////
			if(url != undefined && url.indexOf(wmsURL) != -1){
				s = src;
				break;
			}
		} 

		return s;
	},
	
	/**  
	 * api: method[addLayer]
     */
	addLayer: function(options){		
		var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
		
		this.msLayerTitle = options.msLayerTitle;
		this.msLayerName = options.msLayerName;
		this.wmsURL = options.wmsURL;
		this.gnUrl = options.gnUrl;
		this.enableViewTab = options.enableViewTab;
		this.msLayerUUID = options.msLayerUUID;
		this.gnLangStr = options.gnLangStr;
		this.customParams = options.customParams;

		this.source = this.checkLayerSource(this.wmsURL, options.source);

		if(this.source){
		
			if(!this.source.loaded){
				this.source.on('ready', function(){
					mask.hide();
					this.target.layerSources[this.source.id].loaded = true; 
					var r = this.addLayerRecord();
					
					if(this.useEvents)
						this.fireEvent('ready', r);
				}, this);
			}
			
		    var index = this.source.store.findExact("name", this.msLayerName);
			
			if (index < 0) {
				// ///////////////////////////////////////////////////////////////
				// In this case is necessary reload the local store to refresh 
				// the getCapabilities records 
				// ///////////////////////////////////////////////////////////////
				this.source.store.reload();
			}else{
				var r = this.addLayerRecord();
				
				if(this.useEvents)
					this.fireEvent('ready', r);
			}
		}else{
			mask.show();
			this.addSource(this.wmsURL, true);
		}
	},

	/**  
	 * api: method[addSource]
     */
	addSource: function(wmsURL, showLayer){			
		this.wmsURL = wmsURL;
		
		this.source = this.checkLayerSource(this.wmsURL);

		if(!this.source){
			var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
			mask.show();
		  
			this.source = this.target.addLayerSource({
				config: {url: this.wmsURL}, // assumes default of gx_wmssource
				//
				// Waiting GetCapabilities response from the server.
				//	
				callback: function(id) {
					var addLayerAction = this.target.tools["addlayers"];
					var combo = addLayerAction.getSourceComboBox();	

					// ////////////////////////////////////////////////////////////
					// At the first time the CapGrid is not initialized so:
					// - the source is present but the combo store is 
					//   undefined.
					// - when the showCapabilitiesGrid is called by the user, 
					//   if the showCapabilitiesGrid == false, or automatically 
					//   if == true the CapGrid is initialized and the all the 
					//   layerSources loaded inside the combo array store.
					// 
					// For all the following steps the CapGrid is already 
					// initialized so:
					// - the new layerSource is loaded but we have to put manually.
					//   the new record inside the combo store.
					// /////////////////////////////////////////////////////////////
					if(combo){
						var store = combo.getStore();
						
						//
						// Add to combo and select
						//
						var record = new store.recordType({
							id: id,
							title: this.target.layerSources[id].title || this.untitledText
						});
						
						store.insert(0, [record]);
						combo.onSelect(record, 0);
					}
					
					// 
					// Show the capabilities grid
					//
					if(this.showCapabilitiesGrid === true && !showLayer){
						addLayerAction.showCapabilitiesGrid();
						
						//
						// Select the newly created source
						//
						combo = addLayerAction.getSourceComboBox();
						
						var store = combo.getStore();
						
						var index = store.find('id', this.source.id);
						var record = store.getAt(index);
						
						combo.onSelect(record, 0);
					}				
					
					mask.hide();
					
					this.target.layerSources[this.source.id].loaded = true;
					
					var r;
					if(showLayer){						
						r = this.addLayerRecord();
					}
					
					if(this.useEvents)
						this.fireEvent('ready', r);
					
				},
				//
				// To manage failure in GetCapabilities request (invalid request url in 
				// GeoNetwork configuration or server error).
				//
				fallback: function(source, msg) {
					mask.hide();
			  
					if(!this.useEvents){
						Ext.Msg.show({
							 title: 'GetCapabilities',
							 msg: msg + this.capabilitiesFailureMsg,
							 width: 300,
							 icon: Ext.MessageBox.ERROR
						});  
					}else{
						this.fireEvent('failure', msg);
					}
				},
				scope: this
			});
		}else{
			// 
			// Show the capabilities grid
			//
			if(this.showCapabilitiesGrid === true){
				var addLayerAction = this.target.tools["addlayers"];
				addLayerAction.showCapabilitiesGrid();
				
				//
				// Select requested source
				//
				var combo = addLayerAction.getSourceComboBox();
				
				var store = combo.getStore();
				
				var index = store.find('id', this.source.id);
				var record = store.getAt(index);
				
				combo.onSelect(record, 0);
			}	
		}
	}
});

Ext.preg(gxp.plugins.AddLayer.prototype.ptype, gxp.plugins.AddLayer);
