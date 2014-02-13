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

/** api: (define)
 *  module = gxp.widgets.form
 *  class = TextStyleField
 *  base_link = `Ext.FieldSet <http://extjs.com/deploy/dev/docs/?class=Ext.FieldSet>`_
 */
Ext.namespace('gxp.widgets.form');


/** api: constructor
 *  .. class:: TextStyleField(config)
 *
 *    Composite field for text styler
 */   
gxp.widgets.form.TextStyleField = Ext.extend(Ext.form.CompositeField, {

    /** api: xtype = gxp_text_style_field */
	xtype : 'gxp_text_style_field',

	// cls class: x-html-editor-tb
    cls: "x-html-editor-tb",

	/** Private **/
	textStyle : {},
	isSecondLevelSet: false,

	/** api: config[defaultStyle]
	 *  ``Object``
	 */
	defaultStyle : {
		fontStyle: "normal", 
		fontName: "Verdana", 
		fontSize: 8
	},

	/** api: config[elementSizes]
	 *  ``Array`` with the size for each component in the composite field. Default is [110, 30, 20, 20]
	 */
	elementSizes : [80, 30, 20, 20],
	
    /** api: config[sizeText] ``String`` i18n */
    sizeText: "Size",

	// End i18n.

	initComponent : function() {
		// Initialize data
		var me = this;

		// set default style
		Ext.apply(me.textStyle, me.defaultStyle);

		// Items
		me.items = [{
            xtype: "gxp_fontcombo",
            fonts: this.fonts || undefined,
            fieldLabel: "Font",
            width: this.elementSizes[0],
            value: this.defaultStyle.fontName,
            listeners: {
                select: function(combo, record) {
                    var value = record.get("field1");
                    this.setTextStyleValue("fontName", value);
                },
                scope: this
        	}
        }, {
            xtype: "numberfield",
            allowNegative: false,
            fieldLabel: "Font size",
            emptyText: OpenLayers.Renderer.defaultSymbolizer.fontSize,
            value: this.defaultStyle.fontSize,
            width: this.elementSizes[1],
            listeners: {
                change: function(field, value) {
                    value = parseFloat(value);
                    this.setTextStyleValue("fontSize", value);
                },
                scope:this
            }
        }, {
            xtype: "button",
            // now you only add italic *OR* bold, if this change, change listener!!
            enableToggle: true,
            iconCls: "x-edit-bold",
            pressed: this.defaultStyle.fontStyle && this.defaultStyle.fontStyle == "bold",
            group: "fontStyle",
            fieldLabel: "Bold",
            width: this.elementSizes[2],
            listeners: {
                toggle: function(button, pressed) {
                    var value = pressed ? "bold" : "normal";
                    if(pressed){
                        for(var i = 0; i < button.ownerCt.items.keys.length; i++){
                            var key = button.ownerCt.items.keys[i];
                            var formParam = button.ownerCt.items.get(key);
                            if(formParam.id != button.id
                                && formParam.group == button.group){
                            	this.isSecondLevelSet = true;
                                formParam.toggle(false);
                            	this.isSecondLevelSet = false;
                            }
                        };
                    }
                    if(!this.isSecondLevelSet){
	                    this.setTextStyleValue("fontStyle", value);
	                    this.isSecondLevelSet = false;
                    }
                },
                scope:this
            }
        }, {
            xtype: "button",
            // now you only add italic *OR* bold, if this change, change listener!!
            enableToggle: true,
            iconCls: "x-edit-italic",
            pressed: this.defaultStyle.fontStyle && this.defaultStyle.fontStyle == "italic",
            group: "fontStyle",
            fieldLabel: "Italic",
            width: this.elementSizes[3],
            listeners: {
                toggle: function(button, pressed) {
                    var value = pressed ? "italic" : "normal";
                    if(pressed){
                        for(var i = 0; i < button.ownerCt.items.keys.length; i++){
                            var key = button.ownerCt.items.keys[i];
                            var formParam = button.ownerCt.items.get(key);
                            if(formParam.id != button.id
                                && formParam.group == button.group){
                            	this.isSecondLevelSet = true;
                                formParam.toggle(false);
                            	this.isSecondLevelSet = false;
                            }
                        }
                    }
                    if(!this.isSecondLevelSet){
	                    this.setTextStyleValue("fontStyle", value);
	                    this.isSecondLevelSet = false;
                    }
                },
                scope:this
            }
        }];

		return gxp.widgets.form.TextStyleField.superclass.initComponent.call(this);
	},

	// call to change listener with the text style
	setTextStyleValue: function(parameter, value){
		this.textStyle[parameter] = value;
		this.fireEvent('change', this, this.textStyle);
	}
	
});

Ext.reg(gxp.widgets.form.TextStyleField.prototype.xtype, gxp.widgets.form.TextStyleField);
