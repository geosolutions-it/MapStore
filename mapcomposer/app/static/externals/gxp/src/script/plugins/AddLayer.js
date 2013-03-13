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
     
    /** api: property[title]
     *  ``String``
     *  A descriptive title for this layer source.
     */
    title: "",
	
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
				portalContainer.setActiveTab(1);
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
	addLayer: function(msLayerTitle, msLayerName, wmsURL, gnUrl, enableViewTab, msLayerUUID, gnLangStr){		
		var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
		
		this.msLayerTitle = msLayerTitle;
		this.msLayerName = msLayerName;
		this.wmsURL = wmsURL;
		this.gnUrl = gnUrl;
		this.enableViewTab = enableViewTab;
		this.msLayerUUID = msLayerUUID;
		this.gnLangStr = gnLangStr;
				
		this.source = this.checkLayerSource(this.wmsURL);

		if(this.source){
		
			if(!this.source.loaded){
				this.source.on('ready', function(){
					mask.hide();
					this.target.layerSources[this.source.id].loaded = true; 
					this.addLayerRecord();
					
					if(this.useEvents)
						this.fireEvent('ready');
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
				this.addLayerRecord();
			}
		}else{
			mask.show();

			var sourceOpt = {
				config: {
				  url: this.wmsURL
				}
			};
		  
			this.source = this.target.addLayerSource(sourceOpt);
			
			//
			// Waiting GetCapabilities response from the server.
			//			
			this.source.on('ready', function(){ 
				mask.hide();
				
				this.target.layerSources[this.source.id].loaded = true;
				this.addLayerRecord();
				
				if(this.useEvents)
					this.fireEvent('ready');
			}, this);
		  
			//
			// To manage failure in GetCapabilities request (invalid request url in 
			// GeoNetwork configuration or server error).
			//
			this.source.on('failure', function(src, msg){		          
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
			}, this);
		}
	},

	/**  
	 * api: method[addSource]
     */
	addSource: function(wmsURL){			
		this.wmsURL = wmsURL;
		
		this.source = this.checkLayerSource(this.wmsURL);

		if(!this.source){
			  var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
			  mask.show();

			  var sourceOpt = {
				  config: {
					  url: this.wmsURL
				  }
			  };
			  
			  this.source = this.target.addLayerSource(
					sourceOpt
			  );
			  
			  //
			  // Waiting GetCapabilities response from the server.
			  //
			  this.source.on('ready', function(){ 
				mask.hide();
				
				// 
				// Show the capabilities grid
				//
				if(this.showCapabilitiesGrid === true){
					var addLayerAction = this.target.tools["addlayers"];
					addLayerAction.showCapabilitiesGrid();
					
					//
					// Select the newly created source
					//
					var combo = addLayerAction.getSourceComboBox();
					
					var store = combo.getStore();
					
					var index = store.find('id', this.source.id);
					var record = store.getAt(index);
					
					combo.onSelect(record, 0);
				}				
				
				if(this.useEvents)
					this.fireEvent('ready');
			  }, this);
			  
			  //
			  // To manage failure in GetCapabilities request (invalid request url in 
			  // GeoNetwork configuration or server error).
			  //
			  this.source.on('failure', function(src, msg){		          
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
			  }, this);
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
