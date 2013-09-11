Ext.namespace("GeoExt.data");

GeoExt.data.GazetteerReader = function(meta, recordType) {
    meta = meta || {};
    if(!meta.format) {
        var formatConfig = {
            extractAttributes: true,
            version: '1.1.0',
            gmlns: 'http://www.opengis.net/gml/3.2',
			readers: {
				"feature": OpenLayers.Util.applyDefaults({
					"localType": function(node, obj) {
						this.readChildNodes(node, obj);
					}
				}, OpenLayers.Format.GML.v3.prototype.readers["feature"]),
				"wfs": OpenLayers.Util.applyDefaults({
                    "member": function(node, obj) {
                        this.readChildNodes(node, obj);
                    }
                }, OpenLayers.Format.GML.v3.prototype.readers["wfs"]),
				"gml": OpenLayers.Util.applyDefaults({
                    "FeatureCollection": function(node, obj) {
                        this.readChildNodes(node, obj);
                    }
                }, OpenLayers.Format.GML.v3.prototype.readers["gml"]),
				"gmd": {
					"LocalisedCharacterString": function(node, obj) {
						if(typeof(obj.attributes['LocalisedCharacterString']) == 'undefined') obj.attributes['LocalisedCharacterString'] = [];
						obj.attributes['LocalisedCharacterString'].push(this.getChildValue(node));
					}
				}
			}
        };
        if(meta.formatConfig) Ext.apply(formatConfig, meta.formatConfig);
        
        meta.format = new OpenLayers.Format.GML.v3(formatConfig);
        meta.format.setNamespace('gml', 'http://www.opengis.net/gml/3.2');
        meta.format.setNamespace('gmd', 'http://www.isotc211.org/2005/gmd');
    }
    if(!(typeof recordType === "function")) {
        recordType = GeoExt.data.FeatureRecord.create(
            recordType || meta.fields || [
                {name: "name", type: "string"},
                {name: "type", type: "string"}
            ]
        );
    }
    GeoExt.data.GazetteerReader.superclass.constructor.call(
        this, meta, recordType
    );
};

Ext.extend(GeoExt.data.GazetteerReader, Ext.data.DataReader, {


    read: function(request) {
        var data = request.priv.responseXML;
        if(!data || !data.documentElement) {
            data = request.priv.responseText;
        }
        return this.readRecords(data);
    },


    readRecords: function(data) {
        if(typeof data === "string" || data.nodeType) {
            data = this.meta.format.read(data);
        }
        var values, feature;
        var records = [];
        
		// /////////////////////////////////////
		// Extract attributes from feature
		// /////////////////////////////////////
        for(var i=0, lenI=data.length; i<lenI; i++) {
            feature = data[i];
            values = {
                name: feature.attributes.text,
                type: feature.attributes.LocalisedCharacterString.join(', '),
                feature: feature
            };
            records.push(new this.recordType(values, feature.fid));
        }
 
        return {
            totalRecords: records.length,
            success: true,
            records: records
        };
    }
});
