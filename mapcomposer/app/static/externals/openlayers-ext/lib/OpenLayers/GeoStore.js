

/*
 * ---------------------------------------------------------
 *  MapStore Integration information:
 *      new Class
 *      
 * --------------------------------------------------------- 
 *
 **/

OpenLayers.GeoStore = OpenLayers.Class({
    /**
     * Property: type
     * {String} Geostore entity type
     */ 
    type: null, 
    
    /**
     * Property: id
     * {Integer} Geostore entity id
     */ 
    id: null, 
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    }, 
    
    CLASS_NAME: "OpenLayers.GeoStore"
});

/**
 * Class: OpenLayers.GeoStore.Category
 * GeoStore Entity Category.
 */
OpenLayers.GeoStore.Category = OpenLayers.Class(OpenLayers.GeoStore,{ 
    
    /**
     * Property: type
     * {String} Geostore entity type
     */
    type: "category",
    
    /**
     * Property: name
     * {String} Category name
     */
    name: null,
    
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.GeoStore.Category"
    
});




/**
 * Class: OpenLayers.GeoStore.User
 * GeoStore Entity User.
 */
OpenLayers.GeoStore.User = OpenLayers.Class(OpenLayers.GeoStore,{ 
    
    /**
     * Property: type
     * {String} Geostore entity type
     */
    type: "user",
    
    /**
     * Property: name
     * {String} User name
     */
    name: null,
    
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.GeoStore.User"
    
});




/**
 * Class: OpenLayers.GeoStore.Resource
 * GeoStore Entity Resource.
 */
OpenLayers.GeoStore.Resource = OpenLayers.Class(OpenLayers.GeoStore,{ 
    
    /**
     * Property: type
     * {String} Geostore entity type
     */
    type: "resource",
    
    /**
     * Property: name
     * {String} Resource name
     */
    name: null,
    
    /**
     * Property: Category name
     * {String} Resource category
     */
    category: null,
    
    /**
     * Property: metadata
     * {String} Metadata String (Blob representation)
     */
    metadata: null,
    
    
    /**
     * Property: attributes
     * {String} Metadata String (Blob representation)
     */
    attributes: null,
    
    
    /**
     * Property: store
     * {String} Store String (Blob representation)
     */
    store: null,
    
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.GeoStore.Resource"
    
});



/**
 * Class: OpenLayers.GeoStore.Data
 * GeoStore Entity Data.
 */
OpenLayers.GeoStore.Data = OpenLayers.Class(OpenLayers.GeoStore,{ 
    
    /**
     * Property: type
     * {String} Geostore entity type
     */
    type: "data",

    /**
     * Property: store
     * {String} Store String (Blob representation)
     */
    store: null,
    
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.GeoStore.Data"
    
});