/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @requires plugins/LayerSource.js
 */

/**
 * The WMSCapabilities and WFSDescribeFeatureType formats parse the document and
 * pass the raw data to the WMSCapabilitiesReader/AttributeReader.  There,
 * records are created from layer data.  The rest of the data is lost.  It
 * makes sense to store this raw data somewhere - either on the OpenLayers
 * format or the GeoExt reader.  Until there is a better solution, we'll
 * override the reader's readRecords method  here so that we can have access to
 * the raw data later.
 * 
 * The purpose of all of this is to get the service title, feature type and
 * namespace later.
 * TODO: push this to OpenLayers or GeoExt
 */
(function() {
    function keepRaw(data) {
        var format = this.meta.format;
        if (typeof data === "string" || data.nodeType) {
            data = format.read(data);
            // cache the data for the single read that readRecord does
            var origRead = format.read;
            format.read = function() {
                format.read = origRead;
                return data;
            };
        }
        // here is the new part
        this.raw = data;
    };
    Ext.intercept(GeoExt.data.WMSCapabilitiesReader.prototype, "readRecords", keepRaw);
    GeoExt.data.AttributeReader &&
    Ext.intercept(GeoExt.data.AttributeReader.prototype, "readRecords", keepRaw);
})();

/** api: (define)
 *  module = gxp.plugins
 *  class = WMSSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSSource(config)
 *
 *    Plugin for using WMS layers with :class:`gxp.Viewer` instances. The
 *    plugin issues a GetCapabilities request to create a store of the WMS's
 *    layers.
 */   
/** api: example
 *  Configuration in the  :class:`gxp.Viewer`:
 *
 *  .. code-block:: javascript
 *
 *    defaultSourceType: "gxp_wmssource",
 *    sources: {
 *        "opengeo": {
 *            url: "http://suite.opengeo.org/geoserver/wms"
 *        }
 *    }
 *
 *  A typical configuration for a layer from this source (in the ``layers``
 *  array of the viewer's ``map`` config option would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        source: "opengeo",
 *        name: "world",
 *        group: "background"
 *    }
 *
 */
gxp.plugins.WMSSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gxp_wmssource */
    ptype: "gxp_wmssource",
    
    /** api: config[url]
     *  ``String`` WMS service URL for this source
     */

    /** api: config[baseParams]
     *  ``Object`` Base parameters to use on the WMS GetCapabilities
     *  request.
     */
    baseParams: null,

    layerBaseParams: null,
    
    /** private: property[format]
     *  ``OpenLayers.Format`` Optional custom format to use on the 
     *  WMSCapabilitiesStore store instead of the default.
     */
    format: null,
    
    /** private: property[describeLayerStore]
     *  ``GeoExt.data.WMSDescribeLayerStore`` additional store of layer
     *  descriptions. Will only be available when the source is configured
     *  with ``describeLayers`` set to true.
     */
    describeLayerStore: null,
    
    /** private: property[describedLayers]
     */
    describedLayers: null,
    
    /** private: property[schemaCache]
     */
    schemaCache: null,
    
    /** api: config[version]
     *  ``String``
     *  If specified, the version string will be included in WMS GetCapabilities
     *  requests.  By default, no version is set.
     */
	
	/** api: config[loadingProgress]
     *  ``Boolean`` if true, loadingProgress property is applied to all the WMSSource layers.
     */
    loadingProgress: false,
	
	/** api: config[useCapabilities]
     *  ``Boolean`` if false, no capabilities request is sent to the server to initialize the store.
     */
	useCapabilities: true,
	
    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
	createStore: function() {
		if(this.useCapabilities) {
			return this.createCapabilitiesStore();
		}
		this.fireEvent("ready", this);
		return null;
	},
	
   /**
	* Get the user's corrensponding authkey if present 
	* (see MSMLogin.getLoginInformation for more details)
	*/
	getAuthParam: function(){
		var userInfo = this.target.userDetails;
		var authkey;
		
		if(userInfo.user.attribute instanceof Array){
			for(var i = 0 ; i < userInfo.user.attribute.length ; i++ ){
				if( userInfo.user.attribute[i].name == "UUID" ){
					authkey = userInfo.user.attribute[i].value;
				}
			}
		}else{
			if(userInfo.user.attribute && userInfo.user.attribute.name == "UUID"){
			   authkey = userInfo.user.attribute.value;
			}
		}

		return authkey;
	},
	
    createCapabilitiesStore: function() {
        var baseParams = this.baseParams || {
            SERVICE: "WMS",
            REQUEST: "GetCapabilities"
        };
		
        if (this.version) {
            baseParams.VERSION = this.version;
        }
        
	    // /////////////////////////////////////////////////////
	    // Get the user's corrensponding authkey if present 
	    // (see MSMLogin.getLoginInformation for more details)
	    // /////////////////////////////////////////////////////
		if(this.authParam && this.target.userDetails){
			var authkey = this.getAuthParam();
			if(authkey){
				baseParams[this.authParam] = authkey;
			}
		}
        
		this.store = new GeoExt.data.WMSCapabilitiesStore({
            // Since we want our parameters (e.g. VERSION) to override any in the 
            // given URL, we need to remove corresponding paramters from the 
            // provided URL.  Simply setting baseParams on the store is also not
            // enough because Ext just tacks these parameters on to the URL - so
            // we get requests like ?Request=GetCapabilities&REQUEST=GetCapabilities
            // (assuming the user provides a URL with a Request parameter in it).
            url: this.trimUrl(this.url, baseParams),
            baseParams: baseParams,
            format: this.format,
            autoLoad: true,
            sortInfo : {
                field : 'title',
                direction : 'ASC'
            },
            listeners: {
                load: function() {
                    // The load event is fired even if a bogus capabilities doc 
                    // is read (http://trac.geoext.org/ticket/295).
                    // Until this changes, we duck type a bad capabilities 
                    // object and fire failure if found.
                    if (!this.store.reader.raw || !this.store.reader.raw.service) {
                        this.fireEvent("failure", this, "Invalid capabilities document.");
                    } else {
                        if (!this.title) {
                            this.title = this.store.reader.raw.service.title;                        
                        }
                        this.fireEvent("ready", this);
                    }
                },
                exception: function(proxy, type, action, options, response, arg) {
                    delete this.store;
                    var msg;
                    if (type === "response") {
                        msg = arg || "Invalid response from server.";
                    } else {
                        msg = "Trouble creating layer store from response.";
                    }
                    // TODO: decide on signature for failure listeners
                    this.fireEvent("failure", this, msg, Array.prototype.slice.call(arguments));
                },
                scope: this
            }
        });
    },
    
    /** private: method[trimUrl]
     *  :arg url: ``String``
     *  :arg params: ``Object``
     *
     *  Remove all parameters from the URL's query string that have matching
     *  keys in the provided object.  Keys are compared in a case-insensitive 
     *  way.
     */
    trimUrl: function(url, params, respectCase) {
        var urlParams = OpenLayers.Util.getParameters(url);
        params = OpenLayers.Util.upperCaseObject(params);
        var keys = 0;
        for (var key in urlParams) {
            ++keys;
            if (key.toUpperCase() in params) {
                --keys;
                delete urlParams[key];
            }
        }
        return url.split("?").shift() + (keys ? 
            "?" + OpenLayers.Util.getParameterString(urlParams) :
            ""
            );
    },
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
	createLayerRecord: function(config) {
		if(this.useCapabilities) {
			return this.createLayerRecordCapabilities(config);
		}
		var reader = new GeoExt.data.WMSCapabilitiesReader();
		
		var layerConfig = Ext.apply({
			formats: ['image/png', 'image/jpeg', 'image/gif']
		}, config);
		
		var records = reader.readRecords({
			capability: {
				request: {
					getmap: {
						href: this.url
					}
				},
				layers: [layerConfig]
			}
		});
		return this.createLayerRecordFromOriginal(records.records[0], config);
	},
	
	createLayerRecordFromOriginal: function(original, config) {
		var layer = original.getLayer();
		layer.url = layer.url.replace('SERVICE=WMS&', '');

		/**
		 * TODO: The WMSCapabilitiesReader should allow for creation
		 * of layers in different SRS.
		 */
		var projection = this.getMapProjection();
		
		var defProp = this.getDefaultProps(original, config);            
		
		config = Ext.applyIf(defProp, config);
		
		// If the layer is not available in the map projection, find a
		// compatible projection that equals the map projection. This helps
		// us in dealing with the different EPSG codes for web mercator.
		var layerProjection = this.getProjection(original);
		if (layerProjection) {
			layer.addOptions({projection: layerProjection});
		}
		
		var projCode = projection.getCode();
		var nativeExtent = original.get("bbox")[projCode];

		//var swapAxis = layer.params.VERSION >= "1.3" && !!layer.yx[projCode];
		var swapAxis = layer.params.VERSION >= "1.3" && layer.reverseAxisOrder();
		var maxExtent = 
		(nativeExtent && OpenLayers.Bounds.fromArray(nativeExtent.bbox, swapAxis)) || 
		(original.get("llbbox") && OpenLayers.Bounds.fromArray(original.get("llbbox")).transform(new OpenLayers.Projection("EPSG:4326"), projection)) || null;
		
		// ///////////////////////////////////////////////////////////////////////////////////////////
		// 'layersCachedExtent' property can be defined for source and/or a single 
		// layer configuration when we use GeoWebCache integration in GeoServer. 
		// GeoServer getCapabilities request return only bounds in 4326 and native CRS so, if the 
		// map CRS is 900913 the transformed bounds is not aligned with the google standard 
		// gridset defined in GeoServer.
		// //////////////////////////////////////////////////////////////////////////////////////////
		var maxCachedExtent = config.layersCachedExtent ? OpenLayers.Bounds.fromArray(config.layersCachedExtent) :
			this.layersCachedExtent ? OpenLayers.Bounds.fromArray(this.layersCachedExtent) : maxExtent;
		if(maxExtent) {
			// make sure maxExtent is valid (transfzorm does not succeed for all llbbox)
			if (!(1 / maxExtent.getHeight() > 0) || !(1 / maxExtent.getWidth() > 0)) {
				// maxExtent has infinite or non-numeric width or height
				// in this case, the map maxExtent must be specified in the config
				maxExtent = undefined;
			}
		}
		
		var styles = this.getLayerStyle(config);
	
		// use all params from sources layerBaseParams option
		var params = Ext.applyIf({
			STYLES: styles || "",
			FORMAT: config.format,
			TRANSPARENT: config.transparent,
			//CQL_FILTER: config.cql_filter,
			TIME: config.time,
			ELEVATION: config.elevation
		}, this.layerBaseParams);
		
		// ///////////////////////////////////////////////////////
		// Check for existing 'viewparams' in config and apply 
		// them into the WMS params of the layer
		// ///////////////////////////////////////////////////////
		if(config.vendorParams){
			params = Ext.applyIf(params, config.vendorParams);   
		}
		
		// use all params from original
		params = Ext.applyIf(params, layer.params);

		// /////////////////////////////////////////////////////////
		// Checking if the OpenLayers transition should be 
		// disabled (transitionEffect: null).
		//
		// (see also 
		// https://github.com/openlayers/openlayers/blob/master/notes/2.13.md#layergrid-resize-transitions-by-default).
		//
		// In this case also the zoomMethod must be setted to null 
		// in Map configuration (see widgets/Viewer.js).
		// /////////////////////////////////////////////////////////
		var transitionEffect = null;
		if(this.target.map.animatedZooming){
			if(this.target.map.animatedZooming.transitionEffect == null){
				transitionEffect = null;
			}else{
				transitionEffect = this.target.map.animatedZooming.transitionEffect;
			}
		}
		
		layer = new OpenLayers.Layer.WMS(
			config.title || config.name, 
			layer.url, 
			params, {
				attribution: layer.attribution,
				maxExtent: maxCachedExtent,
				restrictedExtent: maxExtent,
				displayInLayerSwitcher: ("displayInLayerSwitcher" in config) ? config.displayInLayerSwitcher :true,
				singleTile: ("tiled" in config) ? !config.tiled : false,
				ratio: config.ratio || 1,
				visibility: ("visibility" in config) ? config.visibility : true,
				opacity: ("opacity" in config) ? config.opacity : 1,
				buffer: ("buffer" in config) ? config.buffer : 0,
				loadingProgress: config.loadingProgress || this.loadingProgress || false,
				dimensions: original.data.dimensions,
				projection: layerProjection,
				vendorParams: config.vendorParams,
				transitionEffect: transitionEffect
			}
		);

		// data for the new record
		var data = Ext.applyIf({
			title: config.title, 
			name: config.name,
			group: config.group,
			uuid: config.uuid,
			gnURL: config.gnURL,
			source: config.source,
			properties: "gxp_wmslayerpanel",
			times: "times" in config ? config.times : null,
			elevations: "elevations" in config ? config.elevations : null,
			fixed: config.fixed,
			selected: "selected" in config ? config.selected : false,
			layer: layer
		}, original.data);
		
		// add additional fields
		var fields = [
			{name: "source", type: "string"}, 
			{name: "name", type: "string"}, 
			{name: "group", type: "string"},
			{name: "uuid", type: "string"},
			{name: "gnURL", type: "string"},
			{name: "title", type: "string"},
			{name: "properties", type: "string"},
			{name: "fixed", type: "boolean"},
			{name: "selected", type: "boolean"},
			{name: "times", type: "string"},
			{name: "elevations", type: "string"}
		];

		original.fields.each(function(field) {
			fields.push(field);
		});

		var Record = GeoExt.data.LayerRecord.create(fields);
		return new Record(data, layer.id);
	},
	
    createLayerRecordCapabilities: function(config) {
        var record;

        var index = this.store.findExact("name", config.name);
        if (index > -1) {
            var original = this.store.getAt(index);

            record = this.createLayerRecordFromOriginal(original, config);
        } else {
            if (window.console && this.store.getCount() > 0) {
                console.warn("Could not create layer record for layer '" + config.name + "'. Check if the layer is found in the WMS GetCapabilities response.");
            }
        }
        
        return record;
    },
    
    /** api: method[getProjection]
     *  :arg layerRecord: ``GeoExt.data.LayerRecord`` a record from this
     *      source's store
     *  :returns: ``OpenLayers.Projection`` A suitable projection for the
     *      ``layerRecord``. If the layer is available in the map projection,
     *      the map projection will be returned. Otherwise an equal projection,
     *      or null if none is available.
     *
     *  Get the projection that the source will use for the layer created in
     *  ``createLayerRecord``. If the layer is not available in a projection
     *  that fits the map projection, null will be returned.
     */
    getProjection: function(layerRecord) {
        var projection = this.getMapProjection();
        var compatibleProjection = projection;
        var availableSRS = layerRecord.get("srs");
        if (!availableSRS[projection.getCode()]) {
            compatibleProjection = null;
            var p, srs;
            for (srs in availableSRS) {
                if ((p=new OpenLayers.Projection(srs)).equals(projection)) {
                    compatibleProjection = p;
                    break;
                }
            }
        }
        return compatibleProjection;
    },
    
    /** private: method[initDescribeLayerStore]
     *  creates a WMSDescribeLayer store for layer descriptions of all layers
     *  created from this source.
     */
    initDescribeLayerStore: function() {
        var req = this.store.reader.raw.capability.request.describelayer;
        if (req) {
            this.describeLayerStore = new GeoExt.data.WMSDescribeLayerStore({
                url: req.href,
                baseParams: {
                    VERSION: this.store.reader.raw.version,
                    REQUEST: "DescribeLayer"
                }
            });
        }
    },
    
    /** api: method[describeLayer]
     *  :arg rec: ``GeoExt.data.LayerRecord`` the layer to issue a WMS
     *      DescribeLayer request for
     *  :arg callback: ``Function`` Callback function. Will be called with
     *      an ``Ext.data.Record`` from a ``GeoExt.data.DescribeLayerStore``
     *      as first argument, or false if the WMS does not support
     *      DescribeLayer.
     *  :arg scope: ``Object`` Optional scope for the callback.
     *
     *  Get a DescribeLayer response from this source's WMS.
     */
    describeLayer: function(rec, callback, scope) {
        if (!this.describeLayerStore) {
            this.initDescribeLayerStore();
        }
        function delayedCallback(arg) {
            window.setTimeout(function() {
                callback.call(scope, arg);
            }, 0);
        }
        if (!this.describeLayerStore) {
            delayedCallback(false);
            return;
        }
        if (!this.describedLayers) {
            this.describedLayers = {};
        }
        var layerName = rec.getLayer().params.LAYERS;
        var cb = function() {
            var recs = Ext.isArray(arguments[1]) ? arguments[1] : arguments[0];
            var rec, name;
            for (var i=recs.length-1; i>=0; i--) {
                rec = recs[i];
                name = rec.get("layerName");
                if (name == layerName) {
                    this.describeLayerStore.un("load", arguments.callee, this);
                    this.describedLayers[name] = true;
                    callback.call(scope, rec);
                    return;
                } else if (typeof this.describedLayers[name] == "function") {
                    var fn = this.describedLayers[name];
                    this.describeLayerStore.un("load", fn, this);
                    fn.apply(this, arguments);
                }
            }
            // something went wrong (e.g. GeoServer does not return a valid
            // DescribeFeatureType document for group layers)
            delete describedLayers[layerName];
            callback.call(scope, false);
        };
        var describedLayers = this.describedLayers;
        var index;
        if (!describedLayers[layerName]) {
            describedLayers[layerName] = cb;
            this.describeLayerStore.load({
                params: {
                    LAYERS: layerName
                },
                add: true,
                callback: cb,
                scope: this
            });
        } else if ((index = this.describeLayerStore.findExact("layerName", layerName)) == -1) {
            this.describeLayerStore.on("load", cb, this);
        } else {
            delayedCallback(this.describeLayerStore.getAt(index));
        }
    },
    
    /** api: method[getSchema]
     *  :arg rec: ``GeoExt.data.LayerRecord`` the WMS layer to issue a WFS
     *      DescribeFeatureType request for
     *  :arg callback: ``Function`` Callback function. Will be called with
     *      a ``GeoExt.data.AttributeStore`` containing the schema as first
     *      argument, or false if the WMS does not support DescribeLayer or the
     *      layer is not associated with a WFS feature type.
     *  :arg scope: ``Object`` Optional scope for the callback.
     *
     *  Gets the schema for a layer of this source, if the layer is a feature
     *  layer.
     */
    getSchema: function(rec, callback, scope) {
        if (!this.schemaCache) {
            this.schemaCache = {};
        }
        this.describeLayer(rec, function(r) {
            if (r && r.get("owsType") == "WFS") {
                var typeName = r.get("typeName");
                var schema = this.schemaCache[typeName];
                if (schema) {
                    if (schema.getCount() == 0) {
                        schema.on("load", function() {
                            callback.call(scope, schema);
                        }, this, {
                            single: true
                        });
                    } else {
                        callback.call(scope, schema);
                    }
                } else {
                    schema = new GeoExt.data.AttributeStore({
                        url: r.get("owsURL"),
                        baseParams: {
                            SERVICE: "WFS",
                            //TODO should get version from WFS GetCapabilities
                            VERSION: "1.1.0",
                            REQUEST: "DescribeFeatureType",
                            TYPENAME: typeName
                        },
                        autoLoad: true,
                        listeners: {
                            "load": function() {
                                callback.call(scope, schema);
                            },
                            scope: this
                        }
                    });
                    this.schemaCache[typeName] = schema;
                }
            } else {
                callback.call(scope, false);
            }
        }, this);
    },
    
    /** api: method[getConfigForRecord]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object that can be used to recreate the given record.
     */
    getConfigForRecord: function(record) {
        var config = gxp.plugins.WMSSource.superclass.getConfigForRecord.apply(this, arguments);
        var layer = record.getLayer();
        var params = layer.params;
        return Ext.apply(config, {
            format: params.FORMAT,
            styles: params.STYLES, 
            transparent: params.TRANSPARENT,
            //cql_filter: params.CQL_FILTER,
            elevation: params.ELEVATION
        });
    },    
    
    /** api: method[getLayerStyle]
     *  :config:  ``Object``  The application config for this layer.
     *  :returns: ``String``
     *
     *  Return the loacalized styles parmater if defined or the default styles parmater for the layer.
     */
    getLayerStyle: function (config){
        var styles = null;        
        
		var locCode = GeoExt.Lang.locale;	
		
		if(config.stylesAvail instanceof Array){
			if(config.stylesAvail.length > 0){				
				var defaultStyle = config.styles || config.stylesAvail[0].name;
				for(var k=0; k<config.stylesAvail.length; k++){
					var checkString = defaultStyle;
					var langs = ["it","de", "en", "fr"]; // TODO: Fix this using the LanguageSelector tool. 
					
					for(var y=0; y<langs.length; y++){
						if(checkString.indexOf("_" + langs[y]) != -1){
							checkString = checkString.substring(0, checkString.indexOf("_" + langs[y]));
						}
					}
					
					if(config.stylesAvail[k].name == checkString + "_" + locCode)
						styles = config.stylesAvail[k].name; 
				}
				
				if(!styles){
					styles = defaultStyle; 
				}
			} 
		}else{
			if(config.styles){
				styles = config.styles;
			}				
		}  

		return styles;
		
		/*if(config.styles && config.styles.indexOf("_") == -1){
			// /////////////////////////////////////////////////////
			// If I've defined a style, I have to use it if 
			// isnt localized (not contains the "_" character)
			// /////////////////////////////////////////////////////
			styles = config.styles;		
		}else{		
			// /////////////////////////////////////////////////////
			// If I've not defined a style:
            //    - I have to get the localized style from 
			//      capabilities.
			// If I've defined a localized style:
			//    - MapStore assume that the localization is 
			//		correctly defined and use this style.
			// /////////////////////////////////////////////////////
            var locCode = GeoExt.Lang.locale;	
			
			if(config.stylesAvail instanceof Array){
				if(config.stylesAvail.length > 0){				
					var defaultStyle = config.styles || config.stylesAvail[0].name;
					for(var k=0; k<config.stylesAvail.length; k++){
						if(config.stylesAvail[k].name == defaultStyle + "_" + locCode)
							styles = config.stylesAvail[k].name; 
					}
					if(!styles){
						styles = defaultStyle; 
					}
				} 
			}
		}        
		return styles;*/
		
		/*if(config.styles){
		    // //////////////////////////////////////////////////
            // If the config.styles contains the 
			// character "_" the style is already localized
			// //////////////////////////////////////////////////
            config.styles = config.styles.indexOf("_") == -1 ? config.styles : null;
		}
        
        var locCode = GeoExt.Lang.locale;
		
        if(config.stylesAvail instanceof Array){
            if(config.stylesAvail.length > 0){
                var defaultStyle = config.styles || config.stylesAvail[0].name;
                for(var k=0; k<config.stylesAvail.length; k++){
                    if(config.stylesAvail[k].name == defaultStyle + "_" + locCode)
                        styles = config.stylesAvail[k].name; 
                }
                if(! styles){
					styles = defaultStyle; 
				}
            } 
        }else{
			if(config.styles){
				styles = config.styles;
			}				
		}        
		return styles;*/   
    },    
    
    /** api: method[getDefaultProps]
     *  :arg record: :class:`GeoExt.data.LayerRecord`
     *  :returns: ``Object``
     *
     *  Create a config object with the capabilities information that can be used to recreate the given record.
     */
    getDefaultProps: function (record, config){
        var locCode = GeoExt.Lang.locale;
        var defaultProps = {
            name: config.name || record.get("name"),
            title: config.title || record.get("title")
        };
                
        var keywords = record.get("keywords");
        var dimensions = record.get("dimensions");
        var identifiers = record.get("identifiers") || undefined;        
        defaultProps.stylesAvail = record.get("styles");
        
        if(dimensions) {
        	// ////////
        	// looking for time dimension
        	// ////////
        	if (dimensions.time && dimensions.time.values) {
        		if (dimensions.time.values.length>0) {
        			var time=new Object();
        			
        			time.times=dimensions.time.values.join();
        			
        			defaultProps = Ext.applyIf(defaultProps, time);
        		}
        	}

        	if (dimensions.elevation && dimensions.elevation.values) {
        		if (dimensions.elevation.values.length>0) {
        			var elevation=new Object();
        			
        			elevation.elevations=dimensions.time.values.join();
        			
        			defaultProps = Ext.applyIf(defaultProps, elevation);
        		}
        	}
        }
                
        if(keywords.length>0 || !this.isEmptyObject(identifiers)){
            var props=new Object();
                    
            for(var k=0; k<keywords.length; k++){
                var keyword = keywords[k].value || keywords[k];
                        
                if(keyword.indexOf("uuid") != -1){
                    props.uuid = keyword.substring(keyword.indexOf("uuid="));
                    props.uuid = keyword.split("=")[1];
                }  
                
				// ///////////////////////////////////////////////////////////////
				// Use 'enableLang' set to 'true' in order to not enable i18n 
				// for a specific layer
				// ///////////////////////////////////////////////////////////////       
                if(keyword.indexOf(locCode+"=") == 0 && config.enableLang != false){
                    props.title = keyword.split("=")[1];
                }     
            }
                    
            for(var identifierKey in identifiers){
                if(identifierKey === locCode && identifiers.hasOwnProperty(identifierKey)) {
                    props.title = identifiers[identifierKey];
                }
            }
                    
            return Ext.applyIf(props, defaultProps);	
		    
        } else {
            return {};   
		}
    },
	
    isEmptyObject: function(obj) {
        for(var prop in obj){
            if(obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }    
});

Ext.preg(gxp.plugins.WMSSource.prototype.ptype, gxp.plugins.WMSSource);
