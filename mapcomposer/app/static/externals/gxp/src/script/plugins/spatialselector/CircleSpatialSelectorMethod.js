/**
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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

/**
 * @requires plugins/spatialselector/SpatialSelectorMethod.js
 */
 
/**
 * @author Alejandro Diaz
 */

/** api: (define)
 *  module = gxp.plugins.spatialselector
 *  class = BufferSpatialSelectorMethod
 */

/** api: (extends)
 *  plugins/spatialselector/SpatialSelectorMethod.js
 */
Ext.namespace('gxp.plugins.spatialselector');

/** api: constructor
 *  .. class:: CircleSpatialSelectorMethod(config)
 *
 *    Plugin for spatial selection based on circle drawing
 */
gxp.plugins.spatialselector.CircleSpatialSelectorMethod = Ext.extend(gxp.plugins.spatialselector.PolygonSpatialSelectorMethod, {

	/* ptype = gxp_spatial_circle_selector */
	ptype : 'gxp_spatial_circle_selector',

	// Parameters for the combo
	name  : 'Circle',
	label : 'Circle',

	// obtain draw control
	getDrawControl: function(){
        var polyOptions = {sides: 100};
        
        return new OpenLayers.Control.DrawFeature(
            this.drawings,
            OpenLayers.Handler.RegularPolygon,
            {
                handlerOptions: polyOptions
            }
        );
	}
});

Ext.preg(gxp.plugins.spatialselector.CircleSpatialSelectorMethod.prototype.ptype, gxp.plugins.spatialselector.CircleSpatialSelectorMethod);