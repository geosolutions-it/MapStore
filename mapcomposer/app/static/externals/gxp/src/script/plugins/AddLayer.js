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
	addLayerRecord: function(options, source){
		
		var msLayerTitle = options.msLayerTitle;
		var msLayerName = options.msLayerName;
		//var wmsURL = options.wmsURL;
		var gnUrl = options.gnUrl;
		var enableViewTab = options.enableViewTab;
		var msLayerUUID = options.msLayerUUID;
		var gnLangStr = options.gnLangStr;
		var customParams = options.customParams;
		
		var props = {
			name: msLayerName,
			title: msLayerTitle,
			source: source.id
		};
		
		if(customParams){
			props = Ext.applyIf(
				props,
				customParams
			);
		}
		  
		if(msLayerUUID)
			props.uuid = msLayerUUID;
		
		if(gnUrl && gnLangStr)
			props.gnURL = gnUrl + "srv/" + gnLangStr + "/";
		  
		var record = source.createLayerRecord(props);   
				  
		if (record) {
			var layerStore = this.target.mapPanel.layers;  
			layerStore.add([record]);

			modified = true; // TODO: refactor this
					
		    //
			// If tabs are used the View tab is Activated
			//
			if(this.target.renderToTab && enableViewTab){
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
		}else{
			//
			// Show the capabilities grid if any layers was not found
			//
			this.showCapGrid(source.id);
		}
	},
	
	showCapGrid: function(sourceId){
		var addLayerAction = this.target.tools["addlayers"];
		
		// 
		// Show the capabilities grid
		//
		if(this.showCapabilitiesGrid === true){
			addLayerAction.showCapabilitiesGrid();
			
			//
			// Select the required source 'sourceId' 
			//
			var combo = addLayerAction.getSourceComboBox();
			
			var store = combo.getStore();
			
			var index = store.find('id', sourceId);
			var record = store.getAt(index);
			
			combo.onSelect(record, 0);
		}	
	},

    /**  
	 * api: method[checkLayerSource]
     */
	checkLayerSource: function(wmsURL){
	    var s;
		for (var id in this.target.layerSources) {
			  var src = this.target.layerSources[id];    
			  var url  = src.initialConfig.url; 
			  
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
		
		var msLayerTitle = options.msLayerTitle;
		var msLayerName = options.msLayerName;
		var wmsURL = options.wmsURL;
		var gnUrl = options.gnUrl;
		var enableViewTab = options.enableViewTab;
		var msLayerUUID = options.msLayerUUID;
		var gnLangStr = options.gnLangStr;
		var customParams = options.customParams;
				
		var source = this.checkLayerSource(wmsURL);

		if(source){
		
			if(!source.loaded){
				source.on('ready', function(){
					mask.hide();
					this.target.layerSources[source.id].loaded = true; 
					this.addLayerRecord(options, source);
					
					if(this.useEvents)
						this.fireEvent('ready');
				}, this);
			}
			
		    var index = source.store.findExact("name", msLayerName);
			
			if (index < 0) {
				// ///////////////////////////////////////////////////////////////
				// In this case is necessary reload the local store to refresh 
				// the getCapabilities records 
				// ///////////////////////////////////////////////////////////////
				source.store.reload();
			}else{
				this.addLayerRecord(options, source);
			}
		}else{
			mask.show();
			this.addSource(wmsURL, true, options);
		}
	},

	/**  
	 * api: method[addSource]
     */
	addSource: function(wmsURL, showLayer, options){			
		//this.wmsURL = wmsURL;
		
		var source = this.checkLayerSource(wmsURL);

		if(!source){
			var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
			mask.show();
		  
			source = this.target.addLayerSource({
				config: {url: wmsURL}, // assumes default of gx_wmssource
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
						
						var index = store.find('id', source.id);
						var record = store.getAt(index);
						
						combo.onSelect(record, 0);
					}				
					
					mask.hide();
					
					this.target.layerSources[source.id].loaded = true;
					if(showLayer && options){						
						this.addLayerRecord(options, source);
					}
					
					if(this.useEvents)
						this.fireEvent('ready');
					
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
