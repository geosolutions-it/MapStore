/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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
 * @include widgets/geoCollect/xtype/XtypeTextField.js
 * */
Ext.ns("mxp.widgets");

/**
 * GoeMobileWidgetPanel
 * Allow to create mobile widget
 * */
mxp.widgets.XtypeTextArea = Ext.extend(mxp.widgets.XtypeTextField,{

    /** api: xtype = mxp_gc_xtype_textarea */
	xtype:'mxp_gc_xtype_textarea',
	
	 
initComponent: function() {

             mxp.widgets.XtypeTextArea.superclass.initComponent.call(this, arguments);
	},


});

Ext.reg(mxp.widgets.XtypeTextArea.prototype.xtype, mxp.widgets.XtypeTextArea);


