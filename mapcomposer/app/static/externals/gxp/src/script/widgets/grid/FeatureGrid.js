/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
*  module = gxp.grid
*  class = FeatureGrid
*  base_link = `Ext.grid.GridPanel <http://extjs.com/deploy/dev/docs/?class=Ext.grid.GridPanel>`_
*/
Ext.namespace("gxp.grid");

/** api: constructor
*  .. class:: FeatureGrid(config)
*
*      Create a new grid displaying the contents of a 
*      ``GeoExt.data.FeatureStore`` .
*/
gxp.grid.FeatureGrid = Ext.extend(Ext.grid.GridPanel, {

	/** api: config[map]
	*  ``OpenLayers.Map`` If provided, a layer with the features from this
	*  grid will be added to the map.
	*/
	map: null,

	/** api: config[ignoreFields]
	*  ``Array`` of field names from the store's records that should not be
	*  displayed in the grid.
	*/
	ignoreFields: null,

	/** api: config[layer]
	*  ``OpenLayers.Layer.Vector``
	*  The vector layer that will be synchronized with the layer store.
	*  If the ``map`` config property is provided, this value will be ignored.
	*/

	/** api: config[schema]
	*  ``GeoExt.data.AttributeStore``
	*  Optional schema for the grid. If provided, appropriate field
	*  renderers (e.g. for date or boolean fields) will be used.
	*/

	/** api: config[dateFormat]
	*  ``String`` Date format. Default is the value of
	*  ``Ext.form.DateField.prototype.format``.
	*/

	/** api: config[timeFormat]
	*  ``String`` Time format. Default is the value of
	*  ``Ext.form.TimeField.prototype.format``.
	*/

	/** private: property[layer]
	*  ``OpenLayers.Layer.Vector`` layer displaying features from this grid's
	*  store
	*/
	layer: null,

	actionTooltip: "Zoom To Feature",

	/** api: config[emptyText]
	*  ``String`` 
	*  Default text (html tags are accepted) to display in the grid body when no rows are available 
	*/
	emptyText:'No data to display',
	/** api: method[initComponent]
	*  Initializes the FeatureGrid.
	*/
    initComponent: function(){
        this.viewConfig=Ext.apply({emptyText:this.emptyText },this.viewConfig||{});
        this.ignoreFields = ["feature", "state", "fid"].concat(this.ignoreFields);
        if(this.store) {
            this.cm = this.createColumnModel(this.store);
			// layer automatically added if map provided, otherwise check for
			// layer in config
			if(this.map) {
				this.layer = new OpenLayers.Layer.Vector(this.id + "_layer");
				this.map.addLayer(this.layer);
			}
		} else {
			this.store = new Ext.data.Store();
			this.cm = new Ext.grid.ColumnModel({
				columns: []
			});
		}
		if(this.layer) {
			this.sm = this.sm || new GeoExt.grid.FeatureSelectionModel({
				layerFromStore: false,
				layer: this.layer
			});
			if(this.store instanceof GeoExt.data.FeatureStore) {
				this.store.bind(this.layer);
			}
		}
		if (!this.dateFormat) {
			this.dateFormat = Ext.form.DateField.prototype.format;
		}
		if (!this.timeFormat) {
			this.timeFormat = Ext.form.TimeField.prototype.format;
		}

		gxp.grid.FeatureGrid.superclass.initComponent.call(this);       
    },

    /** private: method[onDestroy]
    *  Clean up anything created here before calling super onDestroy.
    */
    onDestroy: function() {
        if(this.initialConfig && this.initialConfig.map
            && !this.initialConfig.layer) {
			// we created the layer, let's destroy it
			this.layer.destroy();
			delete this.layer;
		}
		gxp.grid.FeatureGrid.superclass.onDestroy.apply(this, arguments);
    },

    /** api: method[setStore]
    *  :arg store: ``GeoExt.data.FeatureStore``
    *  :arg schema: ``GeoExt.data.AttributeStore`` Optional schema to
    *      determine appropriate field renderers for the grid.
    *  
    *  Sets the store for this grid, reconfiguring the column model
    */
    setStore: function(store, schema) {
        if (schema) {
            this.schema = schema;
        }
        if (store) {
            if(this.store instanceof GeoExt.data.FeatureStore) {
                this.store.unbind();
            }
            if(this.layer) {
                this.layer.destroyFeatures();
                store.bind(this.layer);
            }
            this.reconfigure(store, this.createColumnModel(store));
        } else {
            this.reconfigure(
                new Ext.data.Store(),
                new Ext.grid.ColumnModel({columns: []})
            );
        }
    },

    /** api: method[getColumns]
    *  :arg store: ``GeoExt.data.FeatureStore``
    *  :return: ``Array``
    *  
    *  Gets the configuration for the column model.
    */
    getColumns: function(store) {
        function getRenderer(format) {
            return function(value) {
				//TODO When http://trac.osgeo.org/openlayers/ticket/3131
				// is resolved, change the 5 lines below to
				// return value.format(format);
				var date = value;
				if (typeof value == "string") {
					date = Date.parseDate(value.replace(/Z$/, ""), "c");
				}
				return date ? date.format(format) : value;
			};
		}

		var columns = [{
			xtype: 'actioncolumn',
			header: "", 
			width: 30,
			hidden: false,
			scope: this,
			items: [{
				iconCls: 'zoomaction',
				tooltip: this.actionTooltip,
				scope: this,
				handler: function(grid, rowIndex, colIndex){
					var store = grid.getStore();
					var row = store.getAt(rowIndex);
					var feature = row.data.feature;
					if(feature){
						var bounds = feature.geometry.getBounds();
						if(bounds){
							if( this.featureMaxZoomLevel && this.map.getZoomForExtent(bounds,false)>this.featureMaxZoomLevel){
								if( feature.geometry instanceof OpenLayers.Geometry.Point)
									this.map.setCenter(new  OpenLayers.LonLat(feature.geometry.x,feature.geometry.y),this.featureMaxZoomLevel);
								else    
									this.map.setCenter(bounds.getCenterLonLat(),this.featureMaxZoomLevel);
							}
							else this.map.zoomToExtent(bounds);
							var showButton = Ext.getCmp("showButton");
							if(!showButton.pressed){
								showButton.toggle(true);			
							}
							grid.getSelectionModel().selectRow(rowIndex);	
						}
					}
				}
			}]
		}];

		var name, type, xtype, format, renderer;
		(this.schema || store.fields).each(function(f) {
			if (this.schema) {
				name = f.get("name");
				type = f.get("type").split(":").pop();
				format = null;
				switch (type) {
					case "date":
					format = this.dateFormat;
					case "datetime":
					format = format ? format : this.dateFormat + " " + this.timeFormat;
					xtype = undefined;
					renderer = getRenderer(format);
					break;
					case "boolean":
					xtype = "booleancolumn";
					break;
					case "string":
					xtype = "gridcolumn";
					break;
					default:
					xtype = "numbercolumn";
				}
			} else {
				name = f.name;
			}
			if (this.ignoreFields.indexOf(name) === -1) {
				columns.push({
					dataIndex: name,
					header: name,
					sortable: true,
					xtype: xtype,
					format: format,
					renderer: xtype ? undefined : renderer
				});
			}
		}, this);
		return columns;
    },

    /** private: method[createColumnModel]
    *  :arg store: ``GeoExt.data.FeatureStore``
    *  :return: ``Ext.grid.ColumnModel``
    */
    createColumnModel: function(store) {
        var columns = this.getColumns(store);
        return new Ext.grid.ColumnModel(columns);
    }
});

/** api: xtype = gxp_featuregrid */
Ext.reg('gxp_featuregrid', gxp.grid.FeatureGrid); 
