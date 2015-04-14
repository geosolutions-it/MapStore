Ext.namespace("GeoExt.data");


GeoExt.data.AddressReader = function(meta, recordType) {
    if(!(typeof recordType === "function")) {
        recordType = GeoExt.data.FeatureRecord.create(
            recordType || [
                {name: "name", type: "string"},
                {name: "type", type: "string"}
            ]
        );
    }
    GeoExt.data.AddressReader.superclass.constructor.call(
        this, meta, recordType
    );
};

Ext.extend(GeoExt.data.AddressReader, Ext.data.DataReader, {
    read : function(response){
        var json = response.responseText;
        var o = Ext.decode(json);
        if(!o) {
            throw {message: 'JsonReader.read: Json object not found'};
        }
        return this.readRecords(o);
    },

    readRecords: function(data) {
        var root = data.AddressCandidates,
            len = root.candidates.length, i, candidate,
            records = [],
            geometry, feature;

        for(i = 0; i < len; i++) {
            candidate = root.candidates[i];

            // /////////////////////////////////////
            // Extract address candidates and create OpenLayers features from them
            // /////////////////////////////////////
            
            geometry = new OpenLayers.Geometry.Point(candidate.location.x, candidate.location.y);
            records.push(new this.recordType({
                name: candidate.address,
                type: candidate.attributes.LocalisedCharacterString || candidate.attributes.AdminUnitName,
                feature: new OpenLayers.Feature.Vector(geometry)
            }));
        }

        return {
            totalRecords: records.length,
            success: true,
            records: records
        };
    }
});
