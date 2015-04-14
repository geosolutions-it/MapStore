Ext.namespace("GeoExt.data");

GeoExt.data.GazetteerStore = Ext.extend(Ext.data.Store, {
    services: [],
    
    constructor: function(config) {
		// /////////////////////////////////////
		// Stores the custom config params and delete them
		// /////////////////////////////////////
        this.services = config.services;
        delete config.services;
        this.filterProperty = config.filterProperty;
        delete config.filterProperty;
        
        GeoExt.data.GazetteerStore.superclass.constructor.call(this, arguments);
    },
    load : function(options) {
		// /////////////////////////////////////
		// Override load to switch between services
		// /////////////////////////////////////
        var searchKey = this.baseParams.query,
            serviceFound, service, i;

        for(i = 0; i < this.services.length; i++) {
            service = this.services[i];
            // /////////////////////////////////////
            // If the service has a regExp config and the regExp match the key, use this service
            // /////////////////////////////////////
            if(!service.regExp || service.regExp.test(searchKey)) {
                serviceFound = service;
                this.reader = service.reader;
                this.proxy = service.proxy;
                break;
            }
        }
        if(!serviceFound) return alert('no service found');
        
		// /////////////////////////////////////
		// If the service proxy is a GeoExt ProtocolProxy, we need an OGC Filter
		// /////////////////////////////////////
        if(serviceFound.proxy instanceof GeoExt.data.ProtocolProxy) {
            options.filter = new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LIKE,
                matchCase: false,
                property: this.filterProperty,
                value: '*'+this.baseParams.query+'*'
            });
        }
        
        GeoExt.data.GazetteerStore.superclass.load.call(this, options);
    }
});