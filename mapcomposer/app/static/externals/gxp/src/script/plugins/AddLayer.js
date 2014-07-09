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
	capabilitiesFailureMsg: " The WMS Capabilities cannot be added due to problems service side", 
	
    /** api: property[useEvents]
     *  ``Boolean``
     *  
     */
	useEvents: false,
	
	/** api: property[directAddLayer]
     *  ``Boolean``
     *  
     */
	directAddLayer: false,
	
    /** api: property[showReport]
     *  ``Boolean``
     *  
     */
	showReport: false,
	
	/** api: property[showCapabilitiesGrid]
     *  ``Boolean``
     *  
     */
	showCapabilitiesGrid: false,
	
	/** api: property[showCapabilitiesGrid]
     *  ``Boolean``
     *  
     */
	disableAllNotifications: false,
	
    /** api: property[directAddLayerProps]
     *  ``Boolean``
     *  
     */
	directAddLayerProps:{
		params:{
			styles: "",
			format: "image/png8",
			transparent: true
		},
		options:{
			displayInLayerSwitcher: true,
			singleTile: false,
			ratio: 1,
			opacity: 1,
			buffer: 1
		}
	},
    
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
		
		//
		// Manage the report of the added resources (layers on WMS services)
		//
		var exceptionReport = [];
		var reportWin;
		
		this.on({
			scope: this,
			'ready' : function(records){
				if((this.showReport == "always" || this.showReport == "errors") && 
					this.directAddLayer === false && this.disableAllNotifications === false){
					
					for(var h=0; h<records.length; h++){
						var record = records[h];
						
						if(record.report){
							if(this.showReport == "errors"){
								if(record.report.msg){
									exceptionReport.push(record.report);
								}								
							}else{
								exceptionReport.push(record.report);
							}
						}
						
						if(reportWin){
							reportWin.hide();
							reportWin.destroy();
						}

						var html = "<html>" +
							"<body>" +
								"<table style=\"border-collapse: collapse;\">" + 
									"<thead>" +
										"<tr>" +
											"<th style=\"padding: 3px 7px 2px; background-color: #555555; color: #FFFFFF;\">Resource Name</th>" + 
											"<th style=\"padding: 3px 7px 2px; background-color: #555555; color: #FFFFFF;\">Resource Type</th>" + 
											"<th style=\"padding: 3px 7px 2px; background-color: #555555; color: #FFFFFF;\">Note</th>" + 
											//"<th>URL</th>" +
										"</tr>" +
									"</thead>" +
									"<tbody>";
															
						var urls = [];
						for(var i=0; i<exceptionReport.length; i++){
							var exists = false;
							for(var j=0; j<urls.length; j++){
								if(exceptionReport[i].url == urls[j].url && 
									exceptionReport[i].name == urls[j].name && 
										!exceptionReport[i].msg){
									exists = true;
									break;
								}
							}
					
							if(!exists){
								urls.push({url: exceptionReport[i].url, name: exceptionReport[i].name});
								var row = "<tr>" +
										"<th style=\"padding: 3px 7px 2px; background-color: #D0D6D9; color: #000000; border: 1px solid #555555;\">" + exceptionReport[i].name + "</th>" +
										"<th style=\"padding: 3px 7px 2px; background-color: #D0D6D9; color: #000000; border: 1px solid #555555;\">" + (exceptionReport[i].type == "layer" ? "WMS Layer" : "WMS Service" + (exceptionReport[i].title ? " :" + exceptionReport[i].title : "")) + "</th>" +
										"<th style=\"padding: 3px 7px 2px; background-color: #D0D6D9; color: #000000; border: 1px solid #555555;\">" + (!exceptionReport[i].msg ? "" : "Error in remote service. <a style=\"cursor: pointer; font-weight: bold; color: #1030E3;\" onClick=\"javascript:app.tools['addlayer'].showMessages('GetCapabilities', '" + escape(exceptionReport[i].msg) + "', Ext.MessageBox.ERROR)\">Show more</a>") + "</th>" +
										//"<th>" + exceptionReport[i].url + "</th>" +
									"</tr>"
										  
								html += row;
							}
						}	

						html +=               "</tbody>" +
										"</table>" +
									"</body>" + 
								"</html>";
						
						if(exceptionReport.length > 0){
							reportWin = new Ext.Window({
								title: "List of requested resources",
								html: html,
								frame: true,
								modal: true,
								autoHeigth: true,
								autoWidth: true,
								maxHeigth: 500,
								maxWidth: 600																						
							});	
						
							reportWin.show();
						}						
					}
				}
			}
		});	
    },
	
	showMessages: function(title, report, type){
		if(this.disableAllNotifications === false){
			Ext.Msg.show({
				 title: title,
				 msg: unescape(report),
				 width: 300,
				 icon: type
			});  
		}
	},
	
	/**  
	 * api: method[addLayerRecord]
     */
	addLayerRecord: function(options, source){		
		var msLayerTitle = options.msLayerTitle;
		var msLayerName = options.msLayerName;
		var gnUrl = options.gnUrl;
		var enableViewTab = options.enableViewTab;
		var msLayerUUID = options.msLayerUUID;
		var gnLangStr = options.gnLangStr;
		var customParams = options.customParams;
		var msGroupName = options.msGroupName;
		
		var props = {
			name: msLayerName,
			title: msLayerTitle,
			source: source.id
			// Currently the group setting is not supported for dynamic layer additions
			/*,group: msGroupName*/
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
			
		//var report;
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
			
			var report = {
				name: msLayerName,
				title: msLayerTitle,
				group: options.msGroupName,
				type: "layer",
				url: source.url,
				id: source.id
			};
			
			this.records.push({record: record, report: report});			
		}else{
			var report = {
				name: msLayerName,
				title: source.title,
				group: options.msGroupName,
				type: "service",
				url: source.url,
				id: source.id
			};
				
			this.records.push({record: undefined, report: report});
			
			//
			// Show the capabilities grid if any layers was not found
			//
			this.showCapGrid(source.id);
		}
		
		if(this.useEvents && this.records.length == this.resourcesSize){
			this.fireEvent('ready', this.records);
		}
	},
	
	showCapGrid: function(sourceId){
		// 
		// Show the capabilities grid
		//
		if(this.showCapabilitiesGrid === true && this.disableAllNotifications === false){
			var addLayerAction = this.target.tools["addlayers"];
			
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
	addLayer: function(resources){
		//
		// We check the type of the argument for retrocompatibility
		//
		if(resources instanceof Array){
			this.resourcesSize = resources.length;
			this.records = [];
			
			for(var i=0; i<resources.length; i++){
				var resource = resources[i];
				
				if(resource){
					this._addLayer(resource);
				}			
			}
		}else{
			this._addLayer(resources);
		}
	},
	
	_addLayer: function(resource){
		var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
		
		if(this.directAddLayer === true){
			//
			// Direct add layer to the map without WMS GetCapabilities
			// 
			this.addToMap(resource);
		}else{
			//
			// Adding layer to the map with WMS GetCapabilities (the standard moded)
			// 			
			/*var msLayerTitle = options.msLayerTitle;
			var msLayerName = options.msLayerName;
			var msGroupName = options.msGroupName;
			var wmsURL = options.wmsURL;
			var gnUrl = options.gnUrl;
			var enableViewTab = options.enableViewTab;
			var msLayerUUID = options.msLayerUUID;
			var gnLangStr = options.gnLangStr;
			var customParams = options.customParams;*/
					
			var source = this.checkLayerSource(resource.wmsURL);

			if(source){
			
				if(!source.loaded){
					source.on('ready', function(s){
						mask.hide();
						this.target.layerSources[s.id].loaded = true; 
						this.addLayerRecord(resource, s);
					}, this);
					// add listener if layer source fail to append the layer source error information
					if(this.useEvents){
						source.on('failure', function(s){
							mask.hide();
							var report = {
								name: resource.msLayerName,
								group: resource.msGroupName,
								url: s.url,
								type: "service",
								msg: this.capabilitiesFailureMsg,
								id: s.id
							};
							
							this.records.push({record: undefined, report: report});
							
							if(this.records.length == this.resourcesSize){
								this.fireEvent('ready', this.records);
							}
						}, this);
					}
				}
				
				var index = source.store.findExact("name", resource.msLayerName);
				
				if (index < 0) {
					// ///////////////////////////////////////////////////////////////
					// In this case is necessary reload the local store to refresh 
					// the getCapabilities records 
					// ///////////////////////////////////////////////////////////////
					source.store.reload();
				}else{
					this.addLayerRecord(resource, source);
				}
			}else{
				mask.show();
				this.addSource(resource.wmsURL, true, resource);
			}
		}
	},
	
	addToMap: function(options){
		var msLayerTitle = options.msLayerTitle;
		var msLayerName = options.msLayerName;
		var msGroupName = options.msGroupName;
		var wmsURL = options.wmsURL;
		
		//
		// Clean the WMS URL
		//
	    if (wmsURL.indexOf("?") !== -1){
			var parts = wmsURL.split("?");
			wmsURL = parts[0];
		}
		
		var params = {
			STYLES: this.directAddLayerProps.params.styles,
			FORMAT: this.directAddLayerProps.params.format,
			TRANSPARENT: this.directAddLayerProps.params.transparent,
			LAYERS: msLayerName
		};
			
		var layer = new OpenLayers.Layer.WMS(
			msLayerTitle, 
			wmsURL, 
			params, {
				displayInLayerSwitcher: this.directAddLayerProps.options.displayInLayerSwitcher,
				singleTile: this.directAddLayerProps.options.singleTile,
				ratio: this.directAddLayerProps.options.ratio,
				opacity: this.directAddLayerProps.options.opacity,
				buffer: this.directAddLayerProps.options.buffer
			}
		);
		
		this.target.mapPanel.map.addLayer(layer); 
		
		var report = {
			name: msLayerName,
			group: msGroupName,
			url: wmsURL,
			type: "layer",
			msg: "",
			id: layer.id
		};
									
		this.records.push({record: layer, report: report});
		
		if(this.useEvents && this.records.length == this.resourcesSize){
			this.fireEvent('ready', this.records);
		}
	},
	
	/**  
	 * api: method[addSource]
     */
	addSource: function(wmsURL, showLayer, options){			
		var source = this.checkLayerSource(wmsURL);

		if(!source){
			var mask = new Ext.LoadMask(Ext.getBody(), {msg: this.waitMsg});
			mask.show();
			
			var sourceOptions = {
				url: wmsURL,
				ptype: options.format == "wmts" ? "gxp_wmtssource" : "gxp_wmssource"
			};
			
			source = this.target.addLayerSource({
				config: sourceOptions, // assumes default of gx_wmssource
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
					// - the new layerSource is loaded but we have to put manually
					//   the new record inside the combo store.
					// /////////////////////////////////////////////////////////////
					if(combo){
						var store = combo.getStore();
						
						//
						// Add to combo and select
						//
						var index = store.find('id', id);
						
						var record;
						if(index > -1){
							record = store.getAt(index);						
							record.set("title", this.target.layerSources[id].title || this.untitledText);
						}else{
							record = new store.recordType({
								id: id,
								title: this.target.layerSources[id].title || this.untitledText
							});
							
							store.insert(0, [record]);
						}
						
						combo.onSelect(record, 0);
					}
					
					// 
					// Show the capabilities grid
					//
					if(this.showCapabilitiesGrid === true && !showLayer 
						&& this.disableAllNotifications === false){
						
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
					}else{
						//
						// Here only if we add only the WMS source.
						//
						var report = {
							name: options.msLayerName,
							group: options.msGroupName,
							url: source.url,
							type: "service",
							id: source.id
						};
						
						this.records.push({record: source, report: report});
						
						if(this.useEvents && this.records.length == this.resourcesSize){
							this.fireEvent('ready', this.records);
						}
					}					
				},
				// /////////////////////////////////////////////////////////////////////////
				// To manage failure in GetCapabilities request (invalid request url in 
				// GeoNetwork configuration or server error).
				// /////////////////////////////////////////////////////////////////////////
				fallback: function(source, msg) {
					mask.hide();
					
					if(!this.showReport){ 						
						this.showMessages("GetCapabilities", this.capabilitiesFailureMsg + " - " + msg, Ext.MessageBox.ERROR);
					}
					
					var report = {
						name: options.msLayerName,
						group: options.msGroupName,
						url: source.url,
						type: "service",
						msg: this.capabilitiesFailureMsg + " - " + msg,
						id: source.id
					};
					
					this.records.push({record: source, report: report});
					
					if(this.useEvents && this.records.length == this.resourcesSize){
						this.fireEvent('ready', this.records);
					}
				},
				scope: this
			});
		}else{
			// 
			// Show the capabilities grid
			//
			if(this.showCapabilitiesGrid === true && this.disableAllNotifications === false){
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
