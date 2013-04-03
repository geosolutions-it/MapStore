

/*
 * ---------------------------------------------------------
 *  MapStore Integration information:
 *      new Class
 *      not yet used in MapStore
 * --------------------------------------------------------- 
 *
 **/

/**
 * Class: OpenLayers.Format.GeoStore.Category
 * GeoStore Entity Category.
 */
OpenLayers.GeoStore.Category = OpenLayers.Class({ 
    
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
 * Class: OpenLayers.Format.GeoStore.User
 * GeoStore Entity User.
 */
OpenLayers.GeoStore.User = OpenLayers.Class({ 
    
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
OpenLayers.GeoStore.Resource = OpenLayers.Class({ 
    
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
    
    CLASS_NAME: "OpenLayers.Resource"
    
});