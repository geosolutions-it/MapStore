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
 * @requires plugins/QueryForm.js
 * @requires plugins/spatialselector/SpatialSelector.js
 * @include widgets/FilterBuilder.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = SpatialSelectorQueryForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: SpatialSelectorQueryForm(config)
 *
 *    Plugin for performing queries on feature layers with a pluggable spatial selector
 */
gxp.plugins.SpatialSelectorQueryForm = Ext.extend(gxp.plugins.QueryForm, {

    /** api: ptype = gxp_querybboxform */
    ptype: "gxp_spatialqueryform",

    filterMapText: 'Filter Map',

    noFilterSelectedMsgTitle: "No filter selected",

    noFilterSelectedMsgText: "You must select at least one filter",

    invalidRegexFieldMsgTitle: "Invalid Fields",

    invalidRegexFieldMsgText: "One or more fields are incorrect!",

    generateChartText: "Charts",

    invalidStateText: "Invalid state",

    /** api: config[spatialSelectorsConfig]
     * ``Object``
     * Spatial selector pluggins configurations.
     * @see gxp.plugins.spatialselector.SpatialSelectorMethod.js
     */
    spatialSelectorsConfig:{
        bbox:{
            ptype : 'gxp_spatial_bbox_selector'
        },
        buffer:{
            ptype : 'gxp_spatial_buffer_selector'
        },
        circle:{
            ptype : 'gxp_spatial_circle_selector',
            zoomToCurrentExtent : true
        },
        polygon:{
            ptype : 'gxp_spatial_polygon_selector'
        }
    },

    /** api: config[filterLayer]
     * ``Object``
     * Add controls to filter WMS layer using the filter
     */
    filterLayer: false,

    /** api: config[validators]
     * ``Object``
     * Add regex validator
     */
    validators: {},

    /** api: config[autoComplete]
     * ``Object``
     * Adds autocomplete support for text fields, allows specifying the sources that support autocomplete.
     */
    autoComplete: null,

    /** api: config[collapsedFirst]
     * ``Boolean``
     * Config to set default collapsed spatial query form on startup
     */
    collapsedFirst: false,

    /** api: config[enableChartOptionsFieldset]
     * ``Boolean``
     * Config to enable default Chart fieldSet
     */
    enableChartOptionsFieldset: false,

    wpsUrl: null,

    queryForm: null,

    state: null,

    init: function(target) {

        var me = this;

        if(!this.style){
            this.style = new OpenLayers.Style();
            if(this.outputConfig){
                Ext.apply(this.style.defaultStyle, this.outputConfig.selectStyle);
            }
        }

        var formId = this.getFormId();

        var spatialSelectorsConfig = this.spatialSelectorsConfig;

        for (var key in spatialSelectorsConfig){
            spatialSelectorsConfig[key].loadingMaskId = formId;
        }

        this.spatialSelector = new gxp.plugins.spatialselector.SpatialSelector({
            target: target,
            layoutConfig: {
                xtype: 'container',
                defaults:{
                    layout: "form"
                }
            },
            spatialSelectorsConfig: spatialSelectorsConfig
        });

        return gxp.plugins.SpatialSelectorQueryForm.superclass.init.apply(this, arguments);
    },

    getFormId: function(){
        return this.id + "_spatialQueryForm";
    },

    getFinalFilter: function(scope, queryForm) {
            // Collect all selected filters
            var filters = [];
            var filterFieldItems = queryForm.filterBuilder.childFilterContainer;
            var filterFieldItem = filterFieldItems.findByType("gxp_filterfield");

            var f = 0;
            var invalidItems = 0;
            while(filterFieldItem[f]){

                var formItems = filterFieldItem[f].innerCt.findBy(function(c) {
                    return c.isFormField;
                });

                for(var x = 0;x<formItems.length;x++){
                    var validateItem = formItems[x];
                    //if(!validateItem.isValid(true) && ( validateItem.vtype == "customValidationTextValue" || validateItem.vtype == "customValidationTextLowerBoundary" || validateItem.vtype == "customValidationTextUpperBundary")){
                    if(!validateItem.isValid(true)){
                        invalidItems++;
                    }
                }
                f++;
            }
            //END

            if(queryForm.spatialSelectorFieldset && !queryForm.spatialSelectorFieldset.collapsed){
                var currentFilter = scope.spatialSelector.getQueryFilter();
                if (currentFilter) {
                    filters.push(currentFilter);
                }
            }

            if(queryForm.filterBuilder && !queryForm.filterBuilder.collapsed){
                var attributeFilter = queryForm.filterBuilder.getFilter();
                attributeFilter && filters.push(attributeFilter);
            }

            // //////////////////////////////////////////////
            // Finally check for any other existing filters
            // (i.e. 'cql_filter') defined by other plugins.
            // //////////////////////////////////////////////
            var layerRecord = scope.featureManagerTool.layerRecord;
            var layer = layerRecord.getLayer();

            var pluginFilter;
            if(layer && layer.vendorParams){
                var pFilters = [];

                // Check for cql_filter
                var pluginCqlFilter = layer.vendorParams.cql_filter;
                if(pluginCqlFilter){
                    var cqlFormat = new OpenLayers.Format.CQL();
                    try{
                        var cqlFilter = cqlFormat.read(pluginCqlFilter);
                        pFilters.push(cqlFilter);
                    }catch(e){
                        invalidItems++;
                    }
                }

                // Check for OGC XML filter
                var pluginXMLOGCFilter = layer.vendorParams.filter;
                if(pluginXMLOGCFilter){
                    var ogcFormat = new OpenLayers.Format.Filter();
                    try{
                        var ogcFilter = ogcFormat.read(pluginXMLOGCFilter);
                        pFilters.push(ogcFilter);
                    }catch(e){
                        invalidItems++;
                    }
                }

                if(pFilters.length > 0){
                    pluginFilter = new OpenLayers.Filter.Logical({
                        type: OpenLayers.Filter.Logical.AND,
                        filters: pFilters
                    });
                }

                // /////////////////////////////////////////////////
                // Set or refresh viewparams in featureManager
                // /////////////////////////////////////////////////
                if(layer.vendorParams.viewparams){
                    scope.featureManagerTool.featureStore.setViewParams(layer.vendorParams.viewparams);
                    scope.featureManagerTool.hitCountProtocol.viewparams = layer.vendorParams.viewparams;
                    scope.featureManagerTool.hitCountProtocol.options.viewparams = layer.vendorParams.viewparams;
                }
            }

            if(invalidItems == 0){
                return {
                    filters: filters,
                    pluginFilter: pluginFilter,
                };
            }else{
                Ext.Msg.show({
                    title: scope.invalidRegexFieldMsgTitle,
                    msg: scope.invalidRegexFieldMsgText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
    },
    openView: function(containerId,componentIndex){
        //expand featuregridContainer
        var container = containerId ? Ext.getCmp(containerId) : null;
        if(container){
            container.expand();
            if(container.getXType() === 'tabpanel'){
                 container.setActiveTab(componentIndex);
            } else {
                var tabPanels = container.findByType('tabpanel');
                if(componentIndex !== undefined && tabPanels.length == 1){
                    tabPanels[0].setActiveTab(componentIndex);
                }
            }
            
        }
    },
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        this.featureManagerTool = this.target.tools[this.featureManager];

		var me = this;

        var spatialSelector = this.spatialSelector;

		//create bbar buttons
        var bbarButtons = [];

        var spatialSelectorOutput = this.spatialSelector.addOutput();

        if(this.filterLayer) {
            bbarButtons.push({
                text: this.filterMapText,
                iconCls: "gxp-icon-map-filter",
                handler: function() {
                    // Collect all selected filters
                    var filters = new Array();

                    if(queryForm.spatialSelectorFieldset && !queryForm.spatialSelectorFieldset.collapsed){
                        var currentFilter = this.spatialSelector.getQueryFilter();
                        if (currentFilter) {
                            //convert filter into native srs
                            //get native srs
                            var rec  = this.featureManagerTool.layerRecord;
                            var bbox = rec.get('bbox');

                            var nativeSRS;
                            for(var c in bbox) {
                                if(c && c.indexOf('EPSG')==0) nativeSRS = c;
                            }

                            currentFilter = currentFilter.clone();
                            currentFilter.value.transform(this.target.mapPanel.map.getProjectionObject(),new OpenLayers.Projection(nativeSRS));

                            filters.push(currentFilter);
                        }
                    }

                    if(queryForm.filterBuilder && !queryForm.filterBuilder.collapsed){
                        var attributeFilter = queryForm.filterBuilder.getFilter();

                        //TODO replace * with % in strings
                        if(attributeFilter){
                            var attributeFilter = attributeFilter.clone();

                            //inspect tree of filters
                            var replaceLikeStrings = function(node,oldc,newc){
                                var oldc = oldc || '*';
                                var newc = newc || '%';
                                if(node.filters){
                                    for(var i = 0;i< node.filters.length; i++){
                                        replaceLikeStrings(node.filters[i],oldc,newc);
                                    }
                                }else if (node.type== "~"){
                                    //replace all
                                    node.value = node.value.split(oldc).join(newc);

                                }
                            }

                            replaceLikeStrings(attributeFilter);

                        }

                        attributeFilter && filters.push(attributeFilter);
                    }

                    if(filters.length > 0){
                         var filter =  filters.length > 1 ? new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.AND,
                                filters: filters
                            }) : filters[0];

                            if(this.target.tools.layertree_plugin){
                                var selmodel = this.target.tools.layertree_plugin.output[0].selModel;
                                var node =selmodel.getSelectedNode();
                                node.setIconCls('gx-tree-filterlayer-icon');
                            }
                            if(!this.featureManagerTool.layerRecord.getLayer().vendorParams){
                                this.featureManagerTool.layerRecord.getLayer().vendorParams = {};
                            }
                            this.featureManagerTool.layerRecord.getLayer().mergeNewParams({cql_filter:filter.toString()});
                            this.featureManagerTool.layerRecord.getLayer().vendorParams.cql_filter = filter.toString();
                    }else{
                        var layer = this.featureManagerTool.layerRecord.getLayer();
                        delete layer.params.CQL_FILTER;
                        layer.redraw();
                    }

                },
                scope: this
            });
        }

        bbarButtons.push("->");
        bbarButtons.push({
            scope: this,
            text: this.cancelButtonText,
            iconCls: "cancel",
            handler: this.reset
        });
        bbarButtons.push({
            text: this.queryActionText,
            iconCls: "gxp-icon-find",
            handler: function() {

                var result = this.getFinalFilter(this, queryForm);
                var filters = result.filters;
                var pluginFilter = result.pluginFilter;

                if(filters.length > 0){
                        
                        this.openView(this.featureGridContainer, this.featureGridTabIndex);
                        if(pluginFilter){
                            filters.push(pluginFilter);
                        }
                        
                        this.featureManagerTool.loadFeatures(filters.length > 1 ?
                            new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.AND,
                                filters: filters
                            }) :
                            filters[0]
                        );
                }else{
                        Ext.Msg.show({
                            title: this.noFilterSelectedMsgTitle,
                            msg: this.noFilterSelectedMsgText,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                }
            },
            scope: this
        });

        config = Ext.apply({
            border: false,
            bodyStyle: "padding: 10px",
            layout: "form",
            autoScroll: true,
            id: this.getFormId(),
            items: [
            {
                xtype: "fieldset",
                ref: "spatialSelectorFieldset",
                title: spatialSelectorOutput.title,
                checkboxToggle: true,
                collapsed : me.collapsedFirst,
                forceLayout : true,
                items: [spatialSelectorOutput],
                listeners: {
                    scope: this,
                    expand: function(panel){
                        panel.doLayout();
                    },
                    collapse: function(panel) {
                        this.spatialSelector.reset();
                    }
                }
            },
            {
                xtype: "fieldset",
                ref: "attributeFieldset",
                title: this.queryByAttributesText,
                checkboxToggle: true,
                collapsed : true,
				listeners: {
					scope: this,
					expand: function(panel){
						panel.doLayout();
					},
                    collapse: function(panel) {
                        if(this.filterBuilder) {
                            this.filterBuilder.reset();
                        }
                    }
				}
            },
            {
                xtype: "fieldset",
                ref: "chartOptionsFieldset",
                title: this.generateChartText,
                checkboxToggle: true,
                collapsed : true,
                hidden: !this.enableChartOptionsFieldset,
				listeners: {
					scope: this,
					expand: function(panel){
						panel.doLayout();
					},
                    collapse: function(panel) {
                        if(this.chartBuilder) {
                            this.chartBuilder.reset();
                        }
                    }
				}
            }],
            bbar: bbarButtons
        }, config || {});

        var queryForm = gxp.plugins.QueryForm.superclass.addOutput.call(this, config);
        this.queryForm = queryForm;
        var methodSelection = this.output[0].outputType;

        // Chart Builder Panel
        this.addChartBuilder = function(mgr, rec, schema) {
            queryForm.chartOptionsFieldset.removeAll();
            queryForm.setDisabled(!schema);

            if (schema) {
                queryForm.chartOptionsFieldset.add({
                    xtype: "gxp_chartbuilder",
                    chartReportingTool : this.target.tools[me.chartReportingTool],
                    ref: "../chartBuilder",
                    attributes: schema,
                    allowBlank: true,
                    wpsUrl: me.wpsUrl,
                    spatialSelectorForm: me,
                    getFeaturesFilter: function() {
                        var result = me.getFinalFilter(me, queryForm);
                        var filters = result.filters;
                        var pluginFilter = result.pluginFilter;

                        if(filters.length > 0){

                                if(pluginFilter){
                                    filters.push(pluginFilter);
                                }

                                var finalFilter = filters.length > 1 ?
                                            new OpenLayers.Filter.Logical({
                                                type: OpenLayers.Filter.Logical.AND,
                                                filters: filters
                                            }) : filters[0];
                                return new OpenLayers.Format.XML().write(
                                    new OpenLayers.Format.Filter({
                                    version: '1.1.0',
                                    srsName: me.target.mapPanel.map.getProjectionObject()
                                }).write(finalFilter));
                        }

                        return "";
                    },
                    openReportingTool: function(){
                        me.openView(me.featureGridContainer,me.chartReportTabIndex);
                    }
                });
                me.chartBuilder = queryForm.chartBuilder;

                queryForm.chartBuilder.reset = function() {
                    this.chartTypeCombo.reset();
                    this.chartToolbar.items.items[0].disable();
                    var items = this.findByType("gxp_chartfield");
                    for(var i = 0; i < items.length; i++) {
                        var item = items[i];
                        item.reset();
                        for(var c = 1;c<item.items.items.length;c++){
                            item.items.get(c).reset();
                        }
                        this.manageChartsFieldsOptions(false,false);
                    }

					this.fireEvent("change", this);
				};
            }

            queryForm.chartOptionsFieldset.doLayout();

            me.handleChartOptions();
        }

        this.addFilterBuilder = function(mgr, rec, schema) {
            // is current source enabled for autoComplete ?
            var autoComplete = rec && me.autoComplete && me.autoComplete.sources && me.autoComplete.sources.indexOf(rec.get('source')) !== -1;
            queryForm.attributeFieldset.removeAll();
            queryForm.setDisabled(!schema);

            if (schema) {
                queryForm.attributeFieldset.add({
                    xtype: "gxp_filterbuilder",
                    ref: "../filterBuilder",
                    attributes: schema,
                    validators: me.validators,
                    autoComplete: autoComplete,
                    autoCompleteCfg: me.autoComplete || {},
                    allowBlank: true,
                    allowGroups: false
                });
				me.filterBuilder = queryForm.filterBuilder;
			   /**
				* Overriding the removeCondition method in order to manage the
				* single filterfield reset.
				*/
				queryForm.filterBuilder.removeCondition = function(item, filter) {
					var parent = this.filter.filters[0].filters;
					if(parent.length > 1) {
						parent.remove(filter);
						this.childFilterContainer.remove(item, true);
					}else{
						var items = item.findByType("gxp_filterfield");

						var i = 0;
						while(items[i]){
							items[i].reset();

                            for(var c = 1;c<items[i].items.items.length;c++){
                                items[i].items.get(c).disable();
                            }

							filter.value = null;
                            filter.lowerBoundary = null;
                            filter.upperBoundary = null;
							i++;
						}
					}

					this.fireEvent("change", this);
				};

                queryForm.filterBuilder.reset = function() {
					var parent = this.filter.filters[0].filters;
                    var items = this.findByType("gxp_filterfield");
                    for(var i = 0; i < items.length; i++) {
                        var item = items[i];
                        if(i > 0) {
                            parent.remove(item.filter);
                            this.childFilterContainer.remove(item.ownerCt, true);
                        } else {
                            item.reset();

                            for(var c = 1;c<item.items.items.length;c++){
                                if(item.items.get(c) instanceof Ext.Container) {
                                    item.items.get(c).removeAll();
                                } else {
                                    item.items.get(c).disable();
                                }
                            }
                            var filter = item.filter;
							filter.value = null;
                            filter.lowerBoundary = null;
                            filter.upperBoundary = null;
                        }
                    }

					this.fireEvent("change", this);
				};

				if (me.draw) {me.draw.deactivate();};
				if (me.drawings) {me.drawings.destroyFeatures();};
				if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
				if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};
            } else {
                me.spatialSelector.reset();

				if (me.draw) {me.draw.deactivate();};
				if (me.drawings) {me.drawings.destroyFeatures();};
				if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
				if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};
            }

            queryForm.attributeFieldset.doLayout();

            spatialSelector.filterGeometryName = this.featureStore
                && this.featureStore.geometryName
                ? this.featureStore.geometryName : null;

            me.handleFilterConditions();
        };

        this.featureManagerTool.on("layerchange", this.addFilterBuilder);
        this.featureManagerTool.on("layerchange", this.addChartBuilder);

        this.addFilterBuilder(this.featureManagerTool,
            this.featureManagerTool.layerRecord, this.featureManagerTool.schema
        );

        this.addChartBuilder(this.featureManagerTool,
            this.featureManagerTool.layerRecord, this.featureManagerTool.schema
        );

        this.featureManagerTool.on({
            "beforequery": function() {
                new Ext.LoadMask(Ext.getBody(), {
                    store: this.featureManagerTool.featureStore,
                    msg: this.queryMsg
                }).show();
            },
            "query": function(tool, store) {
                if (store) {
                    store.getCount() || Ext.Msg.show({
                        title: this.noFeaturesTitle,
                        msg: this.noFeaturesMessage,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                    if (this.autoHide) {
                        var ownerCt = this.outputTarget ? queryForm.ownerCt :
                            queryForm.ownerCt.ownerCt;
                        ownerCt instanceof Ext.Window && ownerCt.hide();
                    }
                }
            },
            scope: this
        });

        var container = this.outputTarget ? this.queryForm.ownerCt : this.queryForm.ownerCt.ownerCt;
        container.on("afterlayout", this.updateState, me);

        return queryForm;
    },
    reset: function() {
        
        this.state = null;

        var me = this;
        this.resetFeatureManager();
        this.spatialSelector.reset();

        var selectionMethodCombo = this.spatialSelector.selectionMethodCombo;
        selectionMethodCombo.reset();

        var spatialSelectorFieldset = me.output[0].spatialSelectorFieldset;
        spatialSelectorFieldset.collapse();

        var attributeFieldset = me.output[0].attributeFieldset;
        attributeFieldset.collapse();

        var chartOptionsFieldset = me.output[0].chartOptionsFieldset;
        chartOptionsFieldset.collapse();

        var methodSelection = this.output[0].outputType;

        if (me.draw) {me.draw.deactivate();};
        if (me.drawings) {me.drawings.destroyFeatures();};
        if (me.filterCircle) {me.filterCircle = new OpenLayers.Filter.Spatial({});};
        if (me.filterPolygon) {me.filterPolygon = new OpenLayers.Filter.Spatial({});};

        var ownerCt = this.outputTarget ? this.queryForm.ownerCt :
            this.queryForm.ownerCt.ownerCt;
        if (ownerCt && ownerCt instanceof Ext.Window) {
            ownerCt.hide();
        } else {
            this.addFilterBuilder(
                this.featureManagerTool, this.featureManagerTool.layerRecord,
                this.featureManagerTool.schema
            );
        }

        if(me.filterLayer){
            var layer = this.featureManagerTool.layerRecord.getLayer();
             delete layer.params.CQL_FILTER;
             delete layer.vendorParams.cql_filter;

             if(this.target.tools.layertree_plugin){
                 var selmodel = this.target.tools.layertree_plugin.output[0].selModel;
                 var node =selmodel.getSelectedNode();
                 node.setIconCls('gx-tree-layer-icon');
             }

             layer.redraw();
         }

         this.spatialSelector.filterGeometryName = this.featureStore
             && this.featureStore.geometryName
             ? this.featureManagerTool.featureStore.geometryName : this.featureManagerTool.featureStore.geometryName;
    },
    stateReset: function() {
        if (this.featureManagerTool.featureStore) {
            this.reset();
        }
    },
    getState: function() {

        var state = {};

        state.sourceName = this.featureManagerTool.layerRecord.data.source;
        state.layerName = this.featureManagerTool.layerRecord.data.name;

        if (!this.queryForm.spatialSelectorFieldset.collapsed) {
            state.spatialSelectorFilter = this.getSpatialSelectorState();
        }

        if (!this.queryForm.attributeFieldset.collapsed) {
            state.attributesFilter = this.getAttributeFilterState();
        }

        state.chartOptions = this.getChartBuilderState();

        return state;
    },
    getSpatialSelectorState: function() {

        var spatialSelectorState = {};

        spatialSelectorState.key = this.spatialSelector.selectionMethodCombo.getValue();
        var spatialSelector = this.spatialSelector.spatialSelectors[spatialSelectorState.key];

        if (spatialSelectorState.key === 'bbox') {

            spatialSelectorState.top = spatialSelector.spatialFieldset.northField.getValue();
            spatialSelectorState.bottom = spatialSelector.spatialFieldset.southField.getValue();
            spatialSelectorState.left = spatialSelector.spatialFieldset.westField.getValue();
            spatialSelectorState.right = spatialSelector.spatialFieldset.eastField.getValue();

        } else if (spatialSelectorState.key === 'buffer') {

            spatialSelectorState.longitude = spatialSelector.bufferFieldset.coordinatePicker.longitudeField.getValue();
            spatialSelectorState.latitude = spatialSelector.bufferFieldset.coordinatePicker.latitudeField.getValue();  
            spatialSelectorState.distance = spatialSelector.bufferFieldset.bufferField.getValue();

        } else if (spatialSelectorState.key === 'circle' || spatialSelectorState.key === 'polygon') {

            spatialSelectorState.wkt = spatialSelector.currentValidGeometry.toString();

        } else if (spatialSelectorState.key === 'municipi' || spatialSelectorState.key === 'unita') {

            spatialSelectorState.name = spatialSelector.geocodingField.getValue();
        }

        if (spatialSelector.geometryOperationFieldset && !spatialSelector.geometryOperationFieldset.collapsed) {

            spatialSelectorState.operation = spatialSelector.geometryOperation.getValue();
           
            if (!spatialSelector.distanceFieldset.collapsed) {

                spatialSelectorState.distance = spatialSelector.distance.getValue();
                spatialSelectorState.unit = spatialSelector.dunits.getValue();                    
            }
        }

        return spatialSelectorState;
    },
    getAttributeFilterState: function() {

        var attributeFilterState = {};

        var getConditionState = function(condition) {

            var conditionState = {};

            conditionState.attribute = condition.items.items[0].getValue();
            conditionState.operator = condition.items.items[1].lastSelectionText;
            conditionState.values = [];

            for (var i = 0; i < condition.items.items[2].items.items.length; i++) {
                conditionState.values.push(condition.items.items[2].items.items[i].getValue());
            }

            return conditionState;
        };

        attributeFilterState.filterConditions = [];

        for(var i = 0; i < this.filterBuilder.childFilterContainer.items.items.length; i++) {
            var condition = this.filterBuilder.childFilterContainer.items.items[i].items.items[1];
            if (i === 0) {
                condition = this.filterBuilder.childFilterContainer.items.items[0].items.items[1].items.items[0];
            }
            attributeFilterState.filterConditions.push(getConditionState(condition));
        }

        attributeFilterState.filterType = this.filterBuilder.builderTypeCombo.getValue();

        return attributeFilterState;
    },
    getChartBuilderState: function() {
        var chartBuilderState = {};
        chartBuilderState.xaxis = this.chartBuilder.form.xaxisAttributeField.property.getValue();
        chartBuilderState.yaxis = this.chartBuilder.form.yaxisAttributeField.property.getValue();
        return chartBuilderState;
    },
    setState: function(state) {

        // we reset the current form
        this.stateReset();

        // we set the state
        this.state = JSON.parse(JSON.stringify(state));

        // we expand the main container
        var container = this.outputTarget ? this.queryForm.ownerCt : this.queryForm.ownerCt.ownerCt;
        container.expand();
        container.doLayout();
    },
    updateState: function() {

        // we add the chart layers to the active layers if need or we select it 
        if (!this.state || !this.state.sourceName || !this.state.layerName) {
            return;
        }
        this.addLayerByName(this.state.sourceName, this.state.layerName);
    
        // if there is a spatial selector we add is state to the current form
        if (this.state.spatialSelectorFilter) {
            this.addSpatialSelector(this.state.spatialSelectorFilter);
            delete this.state['spatialSelectorFilter'];
        }
    },
    addSpatialSelector: function(spatialSelectorInfo) {

        // we get the spacial select field and we expand it
        var spatialSelectorFieldset = this.output[0].spatialSelectorFieldset;
        spatialSelectorFieldset.expand();

        // we initiate the filter combo with the appropriate filter (bbox, circle, buffer, etc ...)
        var combo = this.spatialSelector.selectionMethodCombo;
        var comboRecord = combo.getStore().findExact('name', spatialSelectorInfo.key);
        combo.setValue(spatialSelectorInfo.key);
        combo.fireEvent('select', combo, [comboRecord]);

        // handling spatial selectors based on the key
        if (spatialSelectorInfo.key === 'bbox') {
            this.handleBboxFilter(spatialSelectorInfo); 
        } else if (spatialSelectorInfo.key === 'buffer') {
            this.handlerBufferFilter(spatialSelectorInfo); 
        } else if (spatialSelectorInfo.key === 'circle') {
            this.handlerCircleFilter(spatialSelectorInfo);
        } else if (spatialSelectorInfo.key === 'polygon') {
            this.handlerPolygonFilter(spatialSelectorInfo);
        } else if (spatialSelectorInfo.key === 'municipi' || spatialSelectorInfo.key === 'unita') {
            var spatialSelector = this.spatialSelector.spatialSelectors[spatialSelectorInfo.key];
            spatialSelector.geocodingField.setValue(spatialSelectorInfo.name);
            spatialSelector.geocodingField.fireEvent("change");
        }

        // setting the geometry operation if available
        if (spatialSelectorInfo.operation) {
            this.handleGeometryOperation(spatialSelectorInfo);  
        }
    },
    handleGeometryOperation: function(spatialSelectorInfo) {
        
        // we get the containers
        var spatialSelector = this.spatialSelector.spatialSelectors[spatialSelectorInfo.key];
        var geometryOperationContainer = spatialSelector.items.items[0];
        var distanceContainer = spatialSelector.items.items[1];

        // we expand the geometry operation container
        spatialSelector.geometryOperationFieldset.expand();

        // we set the geometry operation
        var geometryOperationCombo = spatialSelector.geometryOperation;
        var geometryOperationRecordIndex = geometryOperationCombo.getStore().findExact('name', spatialSelectorInfo.operation);
        geometryOperationCombo.setValue(spatialSelectorInfo.operation);
        geometryOperationCombo.fireEvent('select', geometryOperationCombo, 
            geometryOperationCombo.getStore().getAt(geometryOperationRecordIndex));

        // we set the distance if available
        if(spatialSelectorInfo.distance && spatialSelectorInfo.unit) {
            this.handleGeometryDistance(spatialSelector, spatialSelectorInfo.distance, spatialSelectorInfo.unit);
        }
    },
    handleGeometryDistance: function(spatialSelector, distance, unit) {

        // we expand the container (it should already be expanded)
        spatialSelector.distanceFieldset.expand();

        // we get the fields from the container
        var distanceField = spatialSelector.distance;
        var unitField = spatialSelector.dunits;

        // we set the values
        distanceField.setValue(distance);
        distanceField.fireEvent('change', distanceField, distance);
        unitField.setValue(unit);
        unitField.fireEvent('change', unitField, unit);
    },
    handleBboxFilter: function(spatialSelectorInfo) {
        var bbox = new OpenLayers.Bounds(spatialSelectorInfo.left, spatialSelectorInfo.bottom, 
            spatialSelectorInfo.right, spatialSelectorInfo.top);
        this.spatialSelector.spatialSelectors.bbox.output.selectBBOX.setBbox(bbox);
        this.spatialSelector.spatialSelectors.bbox.output.setBBOX(bbox);
        this.spatialSelector.spatialSelectors.bbox.output.fireEvent('onChangeAOI', bbox);
    },
    handlerBufferFilter: function(spatialSelectorInfo) {

        // we get all the fields from the main components
        var buffer = this.spatialSelector.spatialSelectors.buffer;
        var longitudeField = buffer.bufferFieldset.coordinatePicker.longitudeField;
        var latitudeField = buffer.bufferFieldset.coordinatePicker.latitudeField;  
        var bufferField = buffer.bufferFieldset.bufferField;

        // we set the buffer values
        longitudeField.setValue(spatialSelectorInfo.longitude);
        longitudeField.fireEvent("change");
        latitudeField.setValue(spatialSelectorInfo.latitude);
        latitudeField.fireEvent("change");
        bufferField.setValue(spatialSelectorInfo.distance);
        bufferField.fireEvent("change");
        bufferField.fireEvent("keyup");
    },
    handlerCircleFilter: function(spatialSelectorInfo) {

        // we get the circle component
        var circle = this.spatialSelector.spatialSelectors.circle;

        // we create the circle geometry
        var geometry = OpenLayers.Geometry.fromWKT(spatialSelectorInfo.wkt); 

        // we set the circle geometry
        circle.draw.drawFeature(geometry);
    },
    handlerPolygonFilter: function(spatialSelectorInfo) {

        // we get the polygon component
        var polygon = this.spatialSelector.spatialSelectors.polygon;

        // we create the polygon geometry
        var geometry = OpenLayers.Geometry.fromWKT(spatialSelectorInfo.wkt); 

        // we set the polygon geometry
        polygon.draw.drawFeature(geometry);
    },
    handleFilterConditions: function() {

        // if we have filters conditions we add them to the current form
        if (!this.state || !this.state.attributesFilter) {
            return;
        }

        var filterConditions = this.state.attributesFilter.filterConditions;

        // helper function for creating a new condition
        var createCondition = function(filterBuilder, attribute, operator, values, index) {

            // we create a new condition of type gxp_filterfield, one already exists so we skip it
            var condition = filterBuilder.childFilterContainer.items.items[0].items.items[1].items.items[0];
            if (index !== 0) {
                condition = filterBuilder.addCondition();
            }

            // we get the condition components
            var attributeField = condition.items.items[0];
            var operatorField = condition.items.items[1];
            var valuesField = condition.items.items[2];

            // setting attribute value
            var attributeRecordIndex = attributeField.getStore().findExact('name', attribute);
            attributeField.setValue(attribute);
            attributeField.fireEvent('select', attributeField, attributeField.getStore().getAt(attributeRecordIndex));

            // setting operator value
            var operatorRecordIndex = operatorField.getStore().findExact('name', operator);
            operatorField.setValue(operator);
            operatorField.fireEvent('select', operatorField, operatorField.getStore().getAt(operatorRecordIndex));

            // setting values, we expect a number of container items equal to the number of values 
            for (var i = 0; i < values.length; i++) {
                var valueField = valuesField.items.items[i];
                valueField.setValue(values[i]);
                if (valueField.xtype == 'gxp_wpsuniquevaluescb') {
                    var valueRecordIndex = valueField.getStore().findExact('name', attribute);
                    valueField.fireEvent('select', valueField, valueField.getStore().getAt(valueRecordIndex));
                } else {
                    valueField.fireEvent('change', valueField, values[i]);
                }
            }
        };

        // we expand the filter conditions container
        var attributeFieldset = this.output[0].attributeFieldset;
        attributeFieldset.expand();

        // we create a new condition for every existing condition
        for(var i = 0; i < filterConditions.length; i++) {
            var condition = filterConditions[i];
            createCondition(this.filterBuilder, condition.attribute, condition.operator, condition.values, i);
        }

        // we set the filter type
        var filterTypeCombo = this.filterBuilder.builderTypeCombo;
        var filterTypeRecordIndex = filterTypeCombo.getStore().findExact('value', this.state.attributesFilter.filterType);
        filterTypeCombo.setValue(this.state.attributesFilter.filterType);
        filterTypeCombo.fireEvent('select', filterTypeCombo, filterTypeCombo.getStore().getAt(filterTypeRecordIndex));

        delete this.state['attributesFilter'];
    },
    handleChartOptions: function() {

        // if we have chart options conditions we add them to the current form
        if (!this.state || !this.state.chartOptions) {
            return;
        }
        var chartOptions = this.state.chartOptions;

        // we expand the chart builder container
        var chartOptionsFieldset = this.output[0].chartOptionsFieldset;
        chartOptionsFieldset.expand();

        // we get the charts fields
        var charTypeField = this.chartBuilder.chartTypeCombo;
        var xaxisField = this.chartBuilder.form.xaxisAttributeField.property;
        var yaxisField = this.chartBuilder.form.yaxisAttributeField.property;
        var functionField = this.chartBuilder.form.yaxisAttributeField.chartAggCombo;

        // we search by the chart type in the store
        var charTypeFieldStore = charTypeField.getStore();
        var chartTypeRecord;
        charTypeFieldStore.each(function(record) {   
            if (record.data.value === chartOptions.type) {
                chartTypeRecord = record;
            }
        }, this);

        // we set the chart type value
        charTypeField.setValue(chartTypeRecord.data.value);
        charTypeField.fireEvent('select', charTypeField, chartTypeRecord);

        // we set the xaxis value
        var xaxisFieldIndex = xaxisField.getStore().findExact('name', chartOptions.xaxis);
        xaxisField.setValue(chartOptions.xaxis);
        xaxisField.fireEvent('select', xaxisField, xaxisField.getStore().getAt(xaxisFieldIndex));

         // we set the yaxis value
        var yaxisFieldIndex = yaxisField.getStore().findExact('name', chartOptions.yaxis);
        yaxisField.setValue(chartOptions.yaxis);
        yaxisField.fireEvent('select', yaxisField, yaxisField.getStore().getAt(yaxisFieldIndex));

        // we set the aggregate function value
        var functionFieldIndex = functionField.getStore().findExact('name', chartOptions.function);
        functionField.setValue(chartOptions.function);
        functionField.fireEvent('select', functionField, functionField.getStore().getAt(functionFieldIndex));

        // we set the gauge max value if available
        if(chartOptions.max) {
            var gaugeMaxField = this.chartBuilder.form.gaugemax.gaugemaxfield;
            gaugeMaxField.setValue(chartOptions.max);
            gaugeMaxField.fireEvent('change', gaugeMaxField, chartOptions.max);
        }

        delete this.state['chartOptions'];
    },
    addLayerByName: function(sourceName, layerName) {

        // we search the layers in the current maps layers
        var layer;
        for (var i = 0; i < this.target.mapPanel.layers.data.items.length; i++) {
            if (this.target.mapPanel.layers.data.items[i].data.name === layerName) {
                layer = this.target.mapPanel.layers.data.items[i];
            }
        }

        // if the layer is not yet present we need to add it
        if (!layer) {

            // we get the layers from the source where we should search for the layer
            var source = this.target.layerSources[sourceName];
            if (this.invalidState(source)) {
                return;
            }
            var storeLayers = source.store.data.items;

            // we search for our layer in the source layers
            for (var i = 0; i < storeLayers.length; ++i) {
                var storeLayer = storeLayers[i];
                if (storeLayer.data.name === layerName) {
                    layer = storeLayer;
                    break;
                }
            }
            if (this.invalidState(layer)) {
                return;
            }

            // we create a layer record using the found layer
            var layerInfo = {
                name: layer.get("name"),
                title: layer.get("title"),
                source: sourceName
            };
            layer = source.createLayerRecord(layerInfo); 
            if (this.invalidState(layer)) {
                return;
            }        

            // we add this layer to the map
            if (layer.get("group") === "background") {
                this.target.mapPanel.layers.insert(0, [layer]);
            } else {
                this.target.mapPanel.layers.add([layer]);
            }
            this.target.modified = true;
        }

        // we update the feature manager tool with our layer
        if (this.featureManagerTool.layerRecord && this.featureManagerTool.layerRecord.data.name === layer.data.name) {
            this.featureManagerTool.layerRecord = null;
        }
        this.featureManagerTool.setLayer(layer);

        delete this.state['sourceName'];
        delete this.state['layerName'];
    },
    invalidState: function(condition) {
        if (!condition) {
            Ext.Msg.show({
                msg: this.invalidStateText,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
        }
        return !condition;
    }
});

Ext.preg(gxp.plugins.SpatialSelectorQueryForm.prototype.ptype, gxp.plugins.SpatialSelectorQueryForm);
