/**
 *  Copyright (C) 2007 - 2016 GeoSolutions S.A.S.
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
 * @requires widgets/form/spatialselector/SpatialSelectorMethod.js
 */

/** api: (define)
 *  module = gxp.widgets.form.spatialselector
 *  class = CrossSpatialSelectorMethod
 */

/** api: (extends)
 *  widgets/form/spatialselector/SpatialSelectorMethod.js
 */
Ext.namespace('gxp.widgets.form.spatialselector');

/** api: constructor
 *  .. class:: CrossSpatialSelectorMethod(config)
 *
 *    Plugin for cross layer spatial selection
 */
gxp.widgets.form.spatialselector.CrossSpatialSelectorMethod = Ext.extend(gxp.widgets.form.spatialselector.SpatialSelectorMethod, {

	/* xtype = gxp_spatial_cross_selector */
	xtype : 'gxp_spatial_cross_selector',

    initComponent: function() {   
        this.output = this;
		gxp.widgets.form.spatialselector.CrossSpatialSelectorMethod.superclass.initComponent.call(this);
    }
});

Ext.reg(gxp.widgets.form.spatialselector.CrossSpatialSelectorMethod.prototype.xtype, gxp.widgets.form.spatialselector.CrossSpatialSelectorMethod);