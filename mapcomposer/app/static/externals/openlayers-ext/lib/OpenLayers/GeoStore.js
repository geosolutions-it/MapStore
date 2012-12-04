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