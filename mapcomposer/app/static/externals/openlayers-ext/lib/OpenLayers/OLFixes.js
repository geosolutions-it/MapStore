// this scripts is a container for fixes to OpenLayers
// remove it when fixed in openlayers 

/**
 * Patch for this issue: http://osgeo-org.1560.x6.nabble.com/WFS-and-IE-11-td5090636.html
 */
var originalWriteFunction = OpenLayers.Format.XML.prototype.write;

var patchedWriteFunction = function()
{
	var child = originalWriteFunction.apply( this, arguments );
	
	// NOTE: Remove the rogue namespaces as one block of text.
	//       The second fragment "NS1:" is too small on its own and could cause valid text (in, say, ogc:Literal elements) to be erroneously removed.
	child = child.replace(new RegExp('xmlns:NS\\d+="" NS\\d+:', 'g'), '');
	
	return child;
};

OpenLayers.Format.XML.prototype.write = patchedWriteFunction;


/**
 * Patch for this issue: https://github.com/geosolutions-it/MapStore/issues/467
 */
var originalServerResolutionFunction = OpenLayers.Layer.Grid.prototype.getServerResolution; 

var patchedServerResolutionFunction = function(resolution) {
	var originalResolution = resolution || this.map.getResolution();
	resolution = originalServerResolutionFunction.apply(this, arguments);

	if(Math.abs(1- originalResolution/resolution) < 0.01) {
		resolution = originalResolution;
	}
	return resolution;
};
 
OpenLayers.Layer.Grid.prototype.getServerResolution = patchedServerResolutionFunction;

/**
 * Patch for this issue: https://github.com/geosolutions-it/MapStore/issues/509
 */

var original = OpenLayers.Format.WFST.v1.prototype.writers; 

var patchedWFTSwriters = {
	"wfs": {
		"GetFeature": function(options) {
			var node = this.createElementNSPlus("wfs:GetFeature", {
				attributes: {
					service: "WFS",
					version: this.version,
					handle: options && options.handle,
					outputFormat: options && options.outputFormat,
					maxFeatures: options && options.maxFeatures,
					viewParams: options && options.viewparams,
					"xsi:schemaLocation": this.schemaLocationAttr(options)
				}
			});
			if (typeof this.featureType == "string") {
				this.writeNode("Query", options, node);
			} else {
				for (var i=0,len = this.featureType.length; i<len; i++) { 
					options.featureType = this.featureType[i]; 
					this.writeNode("Query", options, node); 
				} 
			}
			return node;
		},
		"Transaction": function(obj) {
			obj = obj || {};
			var options = obj.options || {};
			var node = this.createElementNSPlus("wfs:Transaction", {
				attributes: {
					service: "WFS",
					version: this.version,
					handle: options.handle
				}
			});
			var i, len;
			var features = obj.features;
			if(features) {
				// temporarily re-assigning geometry types
				if (options.multi === true) {
					OpenLayers.Util.extend(this.geometryTypes, {
						"OpenLayers.Geometry.Point": "MultiPoint",
						"OpenLayers.Geometry.LineString": (this.multiCurve === true) ? "MultiCurve": "MultiLineString",
						"OpenLayers.Geometry.Polygon": (this.multiSurface === true) ? "MultiSurface" : "MultiPolygon"
					});
				}
				var name, feature;
				for(i=0, len=features.length; i<len; ++i) {
					feature = features[i];
					name = this.stateName[feature.state];
					if(name) {
						this.writeNode(name, {
							feature: feature, 
							options: options
						}, node);
					}
				}
				// switch back to original geometry types assignment
				if (options.multi === true) {
					this.setGeometryTypes();
				}
			}
			if (options.nativeElements) {
				for (i=0, len=options.nativeElements.length; i<len; ++i) {
					this.writeNode("wfs:Native", 
						options.nativeElements[i], node);
				}
			}
			return node;
		},
		"Native": function(nativeElement) {
			var node = this.createElementNSPlus("wfs:Native", {
				attributes: {
					vendorId: nativeElement.vendorId,
					safeToIgnore: nativeElement.safeToIgnore
				},
				value: nativeElement.value
			});
			return node;
		},
		"Insert": function(obj) {
			var feature = obj.feature;
			var options = obj.options;
			var node = this.createElementNSPlus("wfs:Insert", {
				attributes: {
					handle: options && options.handle
				}
			});
			this.srsName = this.getSrsName(feature);
			this.writeNode("feature:_typeName", feature, node);
			return node;
		},
		"Update": function(obj) {
			var feature = obj.feature;
			var options = obj.options;
			var node = this.createElementNSPlus("wfs:Update", {
				attributes: {
					handle: options && options.handle,
					typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
						this.featureType
				}
			});
			if(this.featureNS) {
				node.setAttribute("xmlns:" + this.featurePrefix, this.featureNS);
			}
			
			// add in geometry
			var modified = feature.modified;
			if (this.geometryName !== null && (!modified || modified.geometry !== undefined)) {
				this.srsName = this.getSrsName(feature);
				this.writeNode(
					"Property", {name: this.geometryName, value: feature.geometry}, node
				);
			}
	
			// add in attributes
			for(var key in feature.attributes) {
				if(feature.attributes[key] !== undefined &&
							(!modified || !modified.attributes ||
							(modified.attributes && modified.attributes[key] !== undefined))) {
					this.writeNode(
						"Property", {name: key, value: feature.attributes[key]}, node
					);
				}
			}
			
			// add feature id filter
			this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
				fids: [feature.fid]
			}), node);
	
			return node;
		},
		"Property": function(obj) {
			var node = this.createElementNSPlus("wfs:Property");
			this.writeNode("Name", obj.name, node);
			if(obj.value !== null) {
				this.writeNode("Value", obj.value, node);
			}
			return node;
		},
		"Name": function(name) {
			return this.createElementNSPlus("wfs:Name", {value: name});
		},
		"Value": function(obj) {
			var node;
			if(obj instanceof OpenLayers.Geometry) {
				node = this.createElementNSPlus("wfs:Value");
				var geom = this.writeNode("feature:_geometry", obj).firstChild;
				node.appendChild(geom);
			} else {
				node = this.createElementNSPlus("wfs:Value", {value: obj});                
			}
			return node;
		},
		"Delete": function(obj) {
			var feature = obj.feature;
			var options = obj.options;
			var node = this.createElementNSPlus("wfs:Delete", {
				attributes: {
					handle: options && options.handle,
					typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
						this.featureType
				}
			});
			if(this.featureNS) {
				node.setAttribute("xmlns:" + this.featurePrefix, this.featureNS);
			}
			this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
				fids: [feature.fid]
			}), node);
			return node;
		}
	}
};

OpenLayers.Format.WFST.v1.prototype.writers = patchedWFTSwriters;

// OpenLayers support for multiple remote sorting
OpenLayers.Format.WFST.v1_1_0.prototype.writers.wfs.Query = function(options) {
                options = OpenLayers.Util.extend({
                    featureNS: this.featureNS,
                    featurePrefix: this.featurePrefix,
                    featureType: this.featureType,
                    srsName: this.srsName
                }, options);
                var prefix = options.featurePrefix;
                var node = this.createElementNSPlus("wfs:Query", {
                    attributes: {
                        typeName: (prefix ? prefix + ":" : "") +
                            options.featureType,
                        srsName: options.srsName
                    }
                });
                if(options.featureNS) {
                    node.setAttribute("xmlns:" + prefix, options.featureNS);
                }
                if(options.propertyNames) {
                    for(var i=0,len = options.propertyNames.length; i<len; i++) {
                        this.writeNode(
                            "wfs:PropertyName", 
                            {property: options.propertyNames[i]},
                            node
                        );
                    }
                }
                if(options.filter) {
                    OpenLayers.Format.WFST.v1_1_0.prototype.setFilterProperty.call(this, options.filter);
                    this.writeNode("ogc:Filter", options.filter, node);
                }
                if(options.sortBy) {                    
                    var me = this;
                    var createSortOption = function(sortProperty,sortBy){
                        if(typeof sortBy === "string") {
                            sortProperty.appendChild(me.createElementNSPlus("ogc:PropertyName", {value: sortBy}));
                            return
                        }else{
                            sortProperty.appendChild(me.createElementNSPlus("ogc:PropertyName", {value: sortBy.property}));
                            sortProperty.appendChild(me.createElementNSPlus("ogc:SortOrder", {value: sortBy.order}));
                        }
                    }
                    var sortByNode = this.createElementNSPlus("ogc:SortBy", {});
                    
                    if(Object.prototype.toString.call(options.sortBy) == '[object Array]'){
                        for(var i = 0; i < options.sortBy.length ; i++){
                            var sortProperty = this.createElementNSPlus("ogc:SortProperty", {});
                            createSortOption(sortProperty,options.sortBy[i]);
                            sortByNode.appendChild(sortProperty);
                        }
                    }else{
                        var sortProperty = this.createElementNSPlus("ogc:SortProperty", {});
                        createSortOption(sortProperty,options.sortBy);
                        sortByNode.appendChild(sortProperty);
                    }
                    
                    node.appendChild(sortByNode);
                }
                return node;
            },
OpenLayers.Format.WFST.v1_1_0.prototype.writers.wfs.PropertyName = function(obj) {
                return this.createElementNSPlus("wfs:PropertyName", {
                    value: obj.property
                });
            },
OpenLayers.Format.WFST.v1_1_0.prototype.writers.wfs.SortOrder = function(obj){
                return this.createElementNSPlus("wfs:SortOrder", {
                    value: obj.property
                });
            }
