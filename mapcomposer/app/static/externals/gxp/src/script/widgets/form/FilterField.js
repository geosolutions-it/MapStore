/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @include widgets/form/ComparisonComboBox.js
 */

/** api: (define)
 *  module = gxp.form
 *  class = FilterField
 *  base_link = `Ext.form.CompositeField <http://extjs.com/deploy/dev/docs/?class=Ext.form.CompositeField>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: FilterField(config)
 *   
 *      A form field representing a comparison filter.
 */
gxp.form.FilterField = Ext.extend(Ext.form.CompositeField, {
    
	     
    /** api: config[caseInsensitiveMatch]
	* ``Boolean``
	* Should Comparison Filters for Strings do case insensitive matching? Default is ``"false"``.
	*/
    caseInsensitiveMatch: false,
	
    /**
     * Property: filter
     * {OpenLayers.Filter} Optional non-logical filter provided in the initial
     *     configuration.  To retreive the filter, use <getFilter> instead
     *     of accessing this property directly.
     */
    filter: null,
    
    /**
     * Property: attributes
     * {GeoExt.data.AttributeStore} A configured attributes store for use in
     *     the filter property combo.
     */
    attributes: null,
    
    /**
     * Property: attributesComboConfig
     * {Object}
     */
    attributesComboConfig: null,

    initComponent: function() {
                
        if(!this.filter) {
            this.filter = this.createDefaultFilter();
        }
        // Maintain compatibility with QueryPanel, which relies on "remote"
        // mode and the filterBy filter applied in it's attributeStore's load
        // listener *after* the initial combo filtering.
        //TODO Assume that the AttributeStore is already loaded and always
        // create a new one without geometry fields.
        var mode = "remote", attributes = new GeoExt.data.AttributeStore();
        if (this.attributes) {
            if (this.attributes.getCount() != 0) {
                mode = "local";
                this.attributes.each(function(r) {
                    var match = /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/.exec(r.get("type"));
                    match || attributes.add([r]);
                });
            } else {
                attributes = this.attributes;
            }
        }

        var defAttributesComboConfig = {
            xtype: "combo",
            store: attributes,
            editable: mode == "local",
            typeAhead: true,
            forceSelection: true,
            mode: mode,
            triggerAction: "all",
            allowBlank: this.allowBlank,
            displayField: "name",
            valueField: "name",
			resizable: true,
            value: this.filter.property,
            listeners: {
                select: function(combo, record) {
                    this.items.get(1).enable();
                    this.filter.property = record.get("name");
                    this.fireEvent("change", this.filter);
                },
                // workaround for select event not being fired when tab is hit
                // after field was autocompleted with forceSelection
                "blur": function(combo) {
                    var index = combo.store.findExact("name", combo.getValue());
                    if (index != -1) {
                        combo.fireEvent("select", combo, combo.store.getAt(index));
                    } else if (combo.startValue != null) {
                        combo.setValue(combo.startValue);
                    }
                },
                scope: this
            },
            width: 100,
			listWidth: 120
        };
        this.attributesComboConfig = this.attributesComboConfig || {};
        Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);

        this.items = this.createFilterItems();
        
        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * filter - {OpenLayers.Filter} This filter.
             */
            "change"
        ); 

        gxp.form.FilterField.superclass.initComponent.call(this);
    },
    
    /**
     * Method: createDefaultFilter
     * May be overridden to change the default filter.
     *
     * Returns:
     * {OpenLayers.Filter} By default, returns a comarison filter.
     */
    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison({matchCase: !this.caseInsensitiveMatch});
    },
    
    /**
     * Method: createFilterItems
     * Creates a panel config containing filter parts.
     */
    createFilterItems: function() {
        
		matchCaseData = [
			[true, "match case"],
			[false, "ignore case"]			
		];
		
		//this.filter.matchCase = matchCaseData[0][0];
		
        return [
            this.attributesComboConfig, {
                xtype: "gxp_comparisoncombo",
                disabled: true,
                allowBlank: this.allowBlank,
                value: this.filter.type,
                listeners: {
                    select: function(combo, record) {
						var typeValue = record.get("value");
						
						if(typeValue == OpenLayers.Filter.Comparison.LIKE || 
							typeValue == OpenLayers.Filter.Comparison.NOT_EQUAL_TO || 
							typeValue == OpenLayers.Filter.Comparison.EQUAL_TO){
							this.items.get(2).enable();
						}else{
							this.items.get(2).disable();
						}
                        
						this.items.get(3).enable();
						
                        this.filter.type = typeValue;
                        this.fireEvent("change", this.filter);
                    },
                    scope: this
                }
            }, {
				xtype: "combo",
				displayField: "name",
				valueField: "value",
				width: 60,
				listWidth: 100,
				allowBlank: false,
				disabled: true,
				mode: "local",
				forceSelection: true,
				resizable: true,
				triggerAction: "all",
				editable: false,
				store: new Ext.data.SimpleStore({
					data: matchCaseData,
					fields: ["value", "name"]
				}),
				value: matchCaseData[0][0],
				listeners: {
					scope: this,
					select: function(combo, record, index){
						var matchCase = record.get("value");
						this.filter.matchCase = matchCase;
					}
				}
			}, {
                xtype: "textfield",
                disabled: true,
                value: this.filter.value,
                width: 50,
                grow: true,
                growMin: 50,
                anchor: "100%",
                allowBlank: this.allowBlank,
                listeners: {
                    change: function(el, value) {
                        this.filter.value = value;
                        this.fireEvent("change", this.filter);
                    },
                    scope: this
                }
            }
        ];
    }

});

Ext.reg('gxp_filterfield', gxp.form.FilterField);
