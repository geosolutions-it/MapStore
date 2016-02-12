/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * requires GeoExt/data/AttributeStore.js
 */

/** api: (define)
 *  module = gxp.form
 *  class = ChartField
 *  base_link = `Ext.form.CompositeField <http://extjs.com/deploy/dev/docs/?class=Ext.form.CompositeField>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: ChartField(config)
 *
 *      A form field.
 */
gxp.form.ChartField = Ext.extend(Ext.form.CompositeField, {

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

        var me = this;

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
                    this.checkAttributesDataType(r.get("type"),true) || attributes.add([r]);
                },this);
            } else {
                attributes = this.attributes;
            }
        }

        var defAttributesComboConfig = {
            xtype: "combo",
            id: this.id,
            name: this.name,
            store: attributes,
            editable: mode == "local",
            typeAhead: true,
            forceSelection: true,
            mode: mode,
            triggerAction: "all",
            ref: "property",
            allowBlank: this.allowBlank,
            displayField: "name",
            valueField: "name",
            value: undefined,
            listeners: {
                select: function(combo, record) {

                },
                // workaround for select event not being fired when tab is hit
                // after field was autocompleted with forceSelection
                "blur": function(combo) {

                },
                expand: function(combo){
                    if(combo.name === "yaxis"){
                        if(this.items.items[1].value !== 0){
                            combo.getStore().filterBy(function(record,id){
                                if(!this.checkAttributesDataType(record.get("type"))){
                                    return true;
                                };
                            },this);
                        }else{
                            combo.reset();
                        }
                    }
                },
                scope: this
            },
            width: this.name === "xaxis" ? 223 : 158
        };

        this.attributesComboConfig = this.attributesComboConfig || {};
        Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);

		if(this.attributes.getCount() === 0) {
			attributes.on("load", function() {

			}, this);
			attributes.load();
		} else {
			this.on('render', function() {

			}, this, {single: true});
		}

        this.items = [this.attributesComboConfig];

        this.addAggregationsCombo();

        this.addEvents(
            /**
             * Event: change
             * Fires when the filter changes.
             *
             * Listener arguments:
             * filter - {OpenLayers.Filter} This filter.
             * this - {gxp.form.FilterField} (TODO change sequence of event parameters)
             */
            "change"
        );

        gxp.form.ChartField.superclass.initComponent.call(this);
    },

    createAggregationsCombo: function() {

        var data = [
            [0,"Count"],
            [1,"Sum"],
            [2,"Max"],
            [3,"Min"],
            [4,"Avg"]
        ];

        return {
            xtype: "combo",
            store: new Ext.data.SimpleStore({
                data: data,
                fields: ["value", "name"]
            }),
            value: 0,
            originalValue: 0,
            ref: "chartAggCombo",
            displayField: "name",
            valueField: "value",
            triggerAction: "all",
            mode: "local",
            listeners: {
                select: function(combo, record) {
                    var yaxisAttributesCombo = this.items.items[0];
                    if(yaxisAttributesCombo.name === "yaxis"){
                        var yaxisValueCombo = yaxisAttributesCombo.getValue();
                        var yaxisSelectedRecord = yaxisAttributesCombo.findRecord("name",yaxisValueCombo);
                        if(yaxisSelectedRecord){
                            if(record.get("value") > 0){
                                if(this.checkAttributesDataType(yaxisSelectedRecord.get("type")))
                                    yaxisAttributesCombo.reset();
                            }
                        }
                    }
                },
                scope: this
            },
            width: 60
        };
    },

    addAggregationsCombo: function() {

        var aggregations = {
            xtype: 'container',
            items: this.createAggregationsCombo(),
            layout  : 'hbox',
            defaultMargins: '0 3 0 0',
            width: 100
        };

        if (this.name === "yaxis"){
            this.items.push(aggregations);
        }
    },
    
    checkAttributesDataType: function(attributeType,all){
        if(all){
            return /gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/.exec(attributeType);
        }else{
            return /xsd:(string|date|dateTime)|gml:((Multi)?(Point|Line|Polygon|Curve|Surface|Geometry)).*/.exec(attributeType);
        }
    }

});

Ext.reg('gxp_chartfield', gxp.form.ChartField);
