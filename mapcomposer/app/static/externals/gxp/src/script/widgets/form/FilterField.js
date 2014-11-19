/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @include widgets/form/ComparisonComboBox.js
 * @include data/WPSUniqueValuesReader.js
 * @include data/WPSUniqueValuesProxy.js
 * @include data/WPSUniqueValuesStore.js
 * @include widgets/form/WPSUniqueValuesCombo.js
 * requires GeoExt/data/AttributeStore.js
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
    
    /** api:config[lowerBoundaryTip]
     *  ``String`` tooltip for the lower boundary textfield (i18n)
     */
    lowerBoundaryTip: "lower boundary",
     
    /** api:config[upperBoundaryTip]
     *  ``String`` tooltip for the lower boundary textfield (i18n)
     */
    upperBoundaryTip: "upper boundary",
     
    /** api: config[caseInsensitiveMatch]
     *  ``Boolean``
     *  Should Comparison Filters for Strings do case insensitive matching?  Default is ``"false"``.
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

    /** api:config[comparisonComboConfig]
     *  ``Object`` Config object for comparison combobox.
     */

    /** api:config[attributesComboConfig]
     *  ``Object`` Config object for attributes combobox.
     */
    
    /**
     * Property: attributesComboConfig
     * {Object}
     */
    attributesComboConfig: null,
    
    /** api:config[autoComplete]
     *  ``Boolean`` autocomplete enabled on text fields.
     */
    autoComplete: false,
    
    /** api:config[autoCompleteCfg]
     *  ``Object`` autocomplete configuration object.
     */
    autoCompleteCfg: {},
    
    /**
     * 
     */ 
    uniqueValuesStore : null,
    
    valid: null,
    
    pageSize: 5,
    
    addValidation: function(config) {
        //Add VTYPE validation according to validators config
        var feature = (this.attributes.baseParams && this.attributes.baseParams.TYPENAME) ? this.attributes.baseParams.TYPENAME.split(":")[1] : 'feature';
        var fieldName = this.filter.property;
        if(this.validators && this.validators[feature] && this.validators[feature][fieldName]) {
            var validator = this.validators[feature][fieldName];
            // currently we support only regex based validation
            if(validator.type === 'regex') {
                var valueTest = new RegExp(validator.value);
                
                Ext.apply(config,{
                    validator: function(value) {
                        return valueTest.test(value) ? true : validator.invalidText;
                    }
                });
            }
        }
        return config;
    },
    
    addAutocompleteStore: function(config) {
        var uniqueValuesStore = new gxp.data.WPSUniqueValuesStore({
            pageSize: this.autoCompleteCfg.pageSize || this.pageSize
        });
        
        this.initUniqueValuesStore(uniqueValuesStore, this.autoCompleteCfg.url || this.attributes.url, this.attributes.baseParams.TYPENAME, this.attributes.format.namespaces, this.filter.property);
        
        return Ext.apply(Ext.apply({}, config), {store: uniqueValuesStore});
    },
    
    createValueWidget: function(type, value) {
        if(this.autoComplete && this.fieldType === 'string') {
            return Ext.apply({value:value}, this.addAutocompleteStore(this.autoCompleteDefault[type]));
        } else {
            return Ext.apply({value:value}, this.fieldDefault[type][this.fieldType]);
        }
    },
    
    createValueWidgets: function(type, value, force) {
        if(type !== this.filter.type || force) {
            this.setFilterType(type);
            
            if(!this.valueWidgets) {
                this.valueWidgets = this.items.get(2);
            }
            this.valueWidgets.removeAll();
            if (type === OpenLayers.Filter.Comparison.BETWEEN) {
                this.valueWidgets.add(this.addValidation(this.createValueWidget('lower', value[0])));
                this.valueWidgets.add(this.addValidation(this.createValueWidget('upper', value[1])));
            } else {
                this.valueWidgets.add(this.addValidation(this.createValueWidget('single', value[0])));
            }
            
            this.doLayout();
            
            this.fireEvent("change", this.filter, this);
        }
    },
    
    createDefaultConfigs: function() {
        this.defaultItemsProp = {
            'single': {
                validateOnBlur: false,
                ref: "value",
                //value: this.filter.value,
                width: 50,
                grow: true,
                growMin: 50,
                anchor: "100%",
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.value = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    "blur": function(field){
                    
                    },
                    scope: this
                }   
            },
            
           'lower': {
                //value: this.filter.lowerBoundary,
                //tooltip: this.lowerBoundaryTip,
                grow: true,
                growMin: 30,
                width: 30,
                ref: "lowerBoundary",
                anchor: "100%",
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.lowerBoundary = value;
                        this.fireEvent("change", this.filter, this);
                    },
                    "autosize": function(field, width) {
                        field.setWidth(width);
                        field.ownerCt.doLayout();
                    },
                    scope: this
                }
            },
            
            'upper': {
                grow: true,
                growMin: 30,
                width: 30,
                ref: "upperBoundary",
                allowBlank: this.allowBlank,
                listeners: {
                    "change": function(field, value) {
                        this.filter.upperBoundary = value;
                        this.fireEvent("change", this.filter, this);
                    },

                    scope: this
                }
            }
        };
        
        this.fieldDefault = {};
        
        for(key in this.defaultItemsProp) {
            this.fieldDefault[key] = {
                'string': Ext.applyIf({
                    xtype: "textfield"
                }, this.defaultItemsProp[key]),
                'double': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:true,
                    decimalPrecision: 10
                },this.defaultItemsProp[key]),
                'float': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:true,
                    decimalPrecision: 10
                },this.defaultItemsProp[key]),
                'decimal': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:true,
                    decimalPrecision: 10
                },this.defaultItemsProp[key]),
                'int': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false
                },this.defaultItemsProp[key]),
                'integer': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false
                },this.defaultItemsProp[key]),
                'long': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false
                },this.defaultItemsProp[key]),
                'short': Ext.applyIf({
                    xtype: "numberfield",
                    allowDecimals:false
                },this.defaultItemsProp[key]),
                'date': Ext.applyIf({
                    xtype: "datefield",
                    width: 70,
                    allowBlank: false,
                    format: this.dateFormat
                },this.defaultItemsProp[key]),
                'dateTime': Ext.applyIf({
                    xtype: "datefield",
                    width: 70,
                    allowBlank: false,
                    format: this.dateFormat
                },this.defaultItemsProp[key])
            };
        }
        
        this.autoCompleteDefault = {
        
            'single': Ext.applyIf({
                xtype: "gxp_wpsuniquevaluescb",
                mode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                //store: this.uniqueValuesStore,
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
                resizable: true,
                listeners: {
                    select: function(combo, record) {
                        this.filter.value = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    blur: function(combo) {
                        this.filter.value = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    beforequery: function(evt) {
                        evt.combo.store.baseParams.start = 0;
                    },
                    scope: this
                },
                width: 80,
                listWidth: 250,
                grow: true,
                growMin: 50,
                anchor: "100%"
            },this.defaultItemsProp['single']),
            'lower': Ext.applyIf({
                xtype: "gxp_wpsuniquevaluescb",
                mode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                //store: this.uniqueValuesStore,
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
                resizable: true,
                listeners: {
                    select: function(combo, record) {
                        this.filter.lowerBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    blur: function(combo) {
                        this.filter.lowerBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    beforequery: function(evt) {
                        evt.combo.store.baseParams.start = 0;
                    },
                    scope: this
                },
                width: 50,
                listWidth: 250,
                grow: true,
                growMin: 50,
                anchor: "100%"
            },this.defaultItemsProp['lower']),
            'upper': Ext.applyIf({
                xtype: "gxp_wpsuniquevaluescb",
                mode: "remote", // required as the combo store shouldn't be loaded before a field name is selected
                //store: this.uniqueValuesStore,
                pageSize: this.autoCompleteCfg.pageSize || this.pageSize,
                typeAhead: false,
                forceSelection: false,
                remoteSort: true,
                triggerAction: "all",
                allowBlank: this.allowBlank,
                displayField: "value",
                valueField: "value",
                minChars: 1,
                resizable: true,
                listeners: {
                    select: function(combo, record) {
                        this.filter.upperBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    beforequery: function(evt) {
                        evt.combo.store.baseParams.start = 0;
                    },
                    blur: function(combo) {
                        this.filter.upperBoundary = combo.getValue();
                        this.fireEvent("change", this.filter);
                    },
                    scope: this
                },
                width: 50,
                listWidth: 250,
                grow: true,
                growMin: 50,
                anchor: "100%"
            },this.defaultItemsProp['upper'])
        
         
        };
        
        
    },
    
	createInitialValueWidgets: function() {
		var record = this.attributes.getAt(this.attributes.find('name',this.filter.property));
		if(record) {
			this.fieldType = record.get("type").split(":")[1];
			this.createValueWidgets(this.filter.type, [this.filter.lowerBoundary || this.filter.value, this.filter.upperBoundary || this.filter.value], true);
		}
	},
	
    initComponent: function() {
        
        var me = this;
        
        this.combineErrors = false;
        
        if (!this.dateFormat) {
            this.dateFormat = Ext.form.DateField.prototype.format;
        }
        if (!this.timeFormat) {
            this.timeFormat = Ext.form.TimeField.prototype.format;
        }        
		var hasFilter = !!this.filter;
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

        this.createDefaultConfigs();
        
        var defAttributesComboConfig = {
            xtype: "combo",
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
            value: this.filter.property,
            listeners: {
                select: function(combo, record) {
                    this.filter.property = record.get("name");
                    this.fieldType = record.get("type").split(":")[1];
                    if(!this.comparisonCombo) {
                        this.comparisonCombo = this.items.get(1);
                    }
                    
                    this.comparisonCombo.enable();
                    this.comparisonCombo.reset();
                    
                    if(!this.valueWidgets) {
                        this.valueWidgets = this.items.get(2);
                    }
                    this.valueWidgets.removeAll();
                    
                    this.setFilterType(null);
        
                    this.doLayout();
                    this.fireEvent("change", this.filter, this);
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
            width: 120
        };
        
        var defComparisonComboConfig = {
            xtype: "gxp_comparisoncombo",
            ref: "type",
            disabled: !hasFilter,
            allowBlank: this.allowBlank,
            value: this.filter.type,
            listeners: {
                select: function(combo, record) {                    
                    this.createValueWidgets(record.get("value"), ['','']);
                },
                expand: function(combo) {
                    var store = combo.getStore();
                    store.clearFilter();
                    if(this.fieldType === "date" || this.fieldType === "dateTime" || this.fieldType === "time" || this.fieldType === "int" || this.fieldType === "double" || this.fieldType === "decimal" || this.fieldType === "integer" || this.fieldType === "long" || this.fieldType === "float" || this.fieldType === "short"){
                        store.filter([
                          {
                            fn   : function(record) {
                                return (record.get('name') === "=") || (record.get('name') === "<>") || (record.get('name') === "<") || (record.get('name') === ">") || (record.get('name') === "<=") || (record.get('name') === ">=") || (record.get('name') === "between");
                            },
                            scope: this
                          }                      
                        ]);
                    }/*else if(this.fieldType === "boolean"){
                        store.filter([
                          {
                            fn   : function(record) {
                                return (record.get('name') === "=");
                            },
                            scope: this
                          }                      
                        ]);
                    }*/ 
                },
                scope: this
            }
        };
        
        this.attributesComboConfig = this.attributesComboConfig || {};
        Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);
        
        this.comparisonComboConfig = this.comparisonComboConfig || {};        
        Ext.applyIf(this.comparisonComboConfig, defComparisonComboConfig);

		
		
		if(hasFilter) {
			if(this.attributes.getCount() === 0) {
				attributes.on("load", function() {
					this.createInitialValueWidgets(attributes);
				}, this);
				attributes.load();
			} else {
				this.on('render', function() {
					this.createInitialValueWidgets(attributes);
				}, this, {single: true});
			}
		}
		
        this.items = [this.attributesComboConfig, this.comparisonComboConfig, {
            xtype: 'container',
            isFormField: true,
            isValid: function() { return true; },
            reset: function() {
                 this.eachItem(function(a) {
                    a.reset()
                });
            },
            eachItem: function(b, a) {
                if (this.items && this.items.each) {
                    this.items.each(b, a || this)
                }
            },
            layout  : 'hbox',            
            defaultMargins: '0 3 0 0',
            width: 100
        }];
        
        
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

        gxp.form.FilterField.superclass.initComponent.call(this);
    },

    /**
     * Method: validateValue
     * Performs validation checks on the filter field.
     *
     * Returns:
     * {Boolean} True if value is valid. 
     */
    validateValue: function(value, preventMark) {
        if (this.filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
            return (this.filter.property !== null && this.filter.upperBoundary !== null &&
                this.filter.lowerBoundary !== null);
        } else {
            return (this.filter.property !== null &&
                this.filter.value !== null && this.filter.type !== null);
        }
    },
    
    /**
     * Method: createDefaultFilter
     * May be overridden to change the default filter.
     *
     * Returns:
     * {OpenLayers.Filter} By default, returns a comparison filter.
     */
    createDefaultFilter: function() {
        return new OpenLayers.Filter.Comparison({matchCase: !this.caseInsensitiveMatch});
    },
    
    initUniqueValuesStore: function(store, url, layerName, namespaces, fieldName) {
        var wpsUrl = url;
        if (url.indexOf('wfs?', url.length - 'wfs?'.length) !== -1) {
            wpsUrl = url.substring(0, url.length-'wfs?'.length)+"wps";
        }
            
        var prefix = "";
        var featureTypeName = layerName;
        var featureNS;
        if(layerName.indexOf(':') !== -1) {
            prefix = layerName.split(':')[0];
            featureNS = namespaces[prefix] || '';
        }
            
        var params = {
            url: wpsUrl,
            outputs: [{
                identifier: "result",
                mimeType: "application/json"
            }],               
            inputs: {
                featureTypeName: featureTypeName,
                featureNS: featureNS,
                fieldName: fieldName
            },
            start: 0,
            limit: this.autoCompleteCfg.pageSize || this.pageSize
        };
        store.setWPSParams(params);
    },
    
    setFilterType: function(type) {
        this.filter.type = type;
        
        // Ilike (ignore case)
        if(this.filter.type == "ilike"){
            this.filter.type = OpenLayers.Filter.Comparison.LIKE;
            this.filter.matchCase = false;
        }else{
            // default matches case. See OpenLayers.Filter.Comparison#matchCase
            this.filter.matchCase = true;
        }
    },

    /** api: method[setFilter]
     *  :arg filter: ``OpenLayers.Filter``` Change the filter object to be
     *  used.
     */
    setFilter: function(filter) {
        var previousType = this.filter.type;
        this.filter = filter;
        if (previousType !== filter.type) {
            this.setFilterType(filter.type);
        }
        this['property'].setValue(filter.property);
        this['type'].setValue(filter.type);
        if (filter.type === OpenLayers.Filter.Comparison.BETWEEN) {
            this['lowerBoundary'].setValue(filter.lowerBoundary);
            this['upperBoundary'].setValue(filter.upperBoundary);
        } else {
            this['value'].setValue(filter.value);
        }
        this.fireEvent("change", this.filter, this);
    }

});

Ext.reg('gxp_filterfield', gxp.form.FilterField);
