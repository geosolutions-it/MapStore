/**
 * Copyright (c) 2008-2011 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = GeoExt
 *  class = Lang
 *  base_link = `Ext.util.Observable <http://dev.sencha.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.namespace("GeoExt");

/** api: constructor
 *  .. class:: LangExt
 *
 *      The GeoExt.LangExt singleton is created when the library is loaded.
 *      Include all relevant language files after this file in your build.
 */
Ext.apply(GeoExt.Lang, {

    /** api: config[localeIndexes]
     *  ``Object`` Contains the index position for getLocaleIndex 
     *   for each language supported
     */
    localeIndexes: {
        "en": 0,
        "it": 1,
        "fr": 2,
        "de": 3
    },
    
    getLocaleIndex: function() {
        return this.localeIndexes[this.locale];
    }
});


