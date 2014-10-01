/**
* Copyright (c) 2012
*
* Published under the GPL license.
* 
*/

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ReverseGeocoder
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ReverseGeocoder(config)
 *
 *    Plugin for adding a ReverseGeocoder to a viewer.   
 *    The underlying TextField can be configured by setting this tool's 
 *    ``outputConfig`` property. 
 *    The underlying Button can be configured by setting this tool's 
 *    ``buttonConfig`` property. 
 */
gxp.plugins.ReverseGeocoder = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_reversegeocoder */
    ptype: "gxp_reversegeocoder",
    /** api: config[geocoderType]
     *  ``String``
     *  type of geocoder to use (google, nominatim, dynamic); defaults to dynamic
     */
	geocoderType: "dynamic",
	/** api: config[buttonText]
     *  ``String``
     *  text for the reverse geocoding button
     */
	buttonText: "Address",
	/** api: config[buttonText]
     *  ``String``
     *  text for the reverse geocoding button
     */
	emptyText: "Address...",
	/** api: config[errorMsg]
     *  ``String``
     *  error message shown if reverse geocoding fails
     */
	errorMsg: "Geocoder failed",
	/** api: config[waitMsg]
     *  ``String``
     *  message shown on map during reverse geocoding
     */
	waitMsg: "Wait please...",
	/** api: config[addressTitle]
     *  ``String``
     *  title of the popup box displayed on address found
     */
	addressTitle: "Address found",
	
    init: function(target) {		
		var me = this;
		
		// handles clicks on map when the geocoder is active
		this.handler = new OpenLayers.Handler.Click( this,
			{
				"click": function(evt) {
					target.mapPanel.getEl().mask(me.waitMsg);
					me.reverseGeocode.call(me,evt,function() {
						target.mapPanel.getEl().unmask();
					});
									
				}
			},{
				map:target.mapPanel.map
			}
		);
		
		// reverse geocoding toggle button
		var cfg = this.buttonConfig || {};
		this.button=new Ext.Button(Ext.apply({
			enableToggle:true,						
			text:this.buttonText,
			iconCls:"gxp-icon-reversegeocoder",
			toggleHandler: function(btn,state) {
				if(state) {
					this.handler.activate();
				} else {
					this.handler.deactivate();
				}
				
			},
			scope:this
		},cfg));
		
		// address found viewer
		cfg = this.outputConfig || {};		
		
		this.target = target; 
		
		// initialize geocoder on ready
		target.on({
			ready: function() {
				this.updateGeocoderType();	
				target.mapPanel.map.events.register('changelayer',this,this.updateGeocoderType);								
			},
			scope:this
		});
	
        return gxp.plugins.ReverseGeocoder.superclass.init.apply(this, arguments);
    },

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return gxp.plugins.ReverseGeocoder.superclass.addOutput.call(this, ['-',this.button]);
    },
	
	/**private: method[updateGeocoderType]
     *  Updates the current geocoder type.	 
	 */
	updateGeocoderType: function() {						
		var geocoders=gxp.plugins.ReverseGeocoder.Geocoders;
		if(this.geocoderType === 'dynamic') {
			var priority=-1;
			// gets the best geocoder type given the current map configuration
			for(var type in geocoders) {
				if(geocoders.hasOwnProperty(type)) {
					var geocoder=gxp.plugins.ReverseGeocoder.Geocoders[type];
					var geocoderPriority=geocoder.getRanking(this.target.mapPanel.map);
					if(geocoderPriority>priority) {
						priority=geocoderPriority;
						this.currentGeocoderType=type;
					}
				}
			}
		} else {
			this.currentGeocoderType = this.geocoderType;
		}
	},
	
	/** private: method[displayAddress]
	 * Show an address when it's found.
     */
	displayAddress: function(address) {
		Ext.Msg.show({
		   title: this.addressTitle,
		   msg: address,
		   buttons: Ext.Msg.OK,		   
		   icon: Ext.MessageBox.INFO
		});
	},
	
    /** private: method[reverseGeocode]
	 * Gets the point coordinates and calls the reverse geocoding service.
     */
    reverseGeocode: function(evt,callback) {
		var map=this.target.mapPanel.map;
		var latlon = map.getLonLatFromViewPortPx(evt.xy).transform(
			map.getProjectionObject(),
			new OpenLayers.Projection("EPSG:4326")
		);	
		gxp.plugins.ReverseGeocoder.Geocoders[this.currentGeocoderType].reverseGeocode({
			latlon:latlon,
			onSuccess: function(address) {
				this.displayAddress(address);				
				if(callback) {
					callback.call();
				}
			},
			onError: function() {
				Ext.Msg.alert(this.errorMsg);
				if(callback) {
					callback.call();
				}
			},
			scope:this
		});			
	}
});

/**
 * Geocoder available implementations.
 * Each implementation should have the following methods:
 *  - reverseGeocode: gets and returns address for a given latlon point (the 
 *                    result is returned via the callbacks onSuccess and onError)
 *  - getRanking : gets the geocoder ranking in the "to be used" list 
 *                 given the current map configuration
 */
gxp.plugins.ReverseGeocoder.Geocoders = {

};

gxp.plugins.ReverseGeocoder.Geocoders['google'] = {
	reverseGeocode: function(params) {
		var googleCoords = new google.maps.LatLng(params.latlon.lat, params.latlon.lon);
		var geocoder=new google.maps.Geocoder();		
		geocoder.geocode({'latLng': googleCoords}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
				if(results && results.length && results.length>0 && params.onSuccess) {
					params.onSuccess.call(params.scope,results[0].formatted_address);				
				}
			} else if(params.onError) {
				params.onError.call(params.scope);
			}
		});	
	},
	getRanking: function(map) {
		var found=false;
		var googleLayers=map.getLayersBy('CLASS_NAME','OpenLayers.Layer.Google');
		for(var count=0,l=googleLayers.length;count<l && !found;count++) {
			var layer=googleLayers[count];
			if(layer.visibility) {
				found=true;
			}
		}
		return found ? 10 : -1;
	}
};

gxp.plugins.ReverseGeocoder.Geocoders['nominatim'] = {
	reverseGeocode: function(params) {
		var proxy= new Ext.data.ScriptTagProxy({
			api: {
				read : 'http://nominatim.openstreetmap.org/reverse'
			},
			url:'http://nominatim.openstreetmap.org',
			callbackParam:'json_callback'
		});
		var reader={
			readRecords: function(record) {
				if(record && record.display_name && params.onSuccess) {
					params.onSuccess.call(params.scope,record["display_name"]);	
					return {success:true};
				}
				return {success:false};
			}
		};
		proxy.on('loadexception',function() {
			if(params.onError) {
				params.onError.call(params.scope);
			}
		});
		proxy.request('read',null,{
			format:'json',
			lon:params.latlon.lon,
			lat:params.latlon.lat
		},reader,function() {},this);				
	},
	getRanking: function(map) {
		return 0;
	}
};

Ext.preg(gxp.plugins.ReverseGeocoder.prototype.ptype, gxp.plugins.ReverseGeocoder);
