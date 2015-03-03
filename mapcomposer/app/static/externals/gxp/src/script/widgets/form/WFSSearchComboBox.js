/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
 *  module = gxp.form
 *  class = WFSSearchComboBox
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: WFSSearchComboBox(config)
 *
 *  Creates a combo box that issues queries a WFS service.
 *  If the user enters a valid parameters in the search box, the combo's store
 *  will be populated with records that match the features querible attributes.
 *  Records have fields configured in recordModel variable and Queriable attributes are
 *  configured in queriableAttributes variable.
 *  
 *
 */   
gxp.form.WFSSearchComboBox = Ext.extend(Ext.form.ComboBox, {
    
    /** api: xtype = gxp_googlegeocodercombo */
    xtype: "gxp_searchboxcombo",

    /** api: config[queryDelay]
     *  ``Number`` Delay before the search occurs.  Default is 100ms.
     */
    queryDelay: 100,
    
	/** private: config[typeAhead]
	 * the queryParameter for WFS
	 */
	queryParam : "cql_filter",
	typeAhead: false,
	displayInfo: false,
	hideTrigger:true,
	
    /** api: config[displayField]
	 * If a template is not defined, this is the field to show.
	 * for the exemple below it can be "codice_ato"
     */
    displayField: "",
	
	/** api: config[mapPanel]
     *  the mapPanel
     */
	mapPanel:  null,
	/** api: config[url]
     *  url to perform requests
     */
	url:  '',
	/** api: config[typeName]
     *  the tipe name to search
     */
	typeName: '',
	/**
	 * private config[root]
	 * the root node containing feature data.
	 */
	root:'features',
	/**
	 * private config[recordId]
	 * the id of the record.
	 */
	recordId: 'fid',
	
	custom  : null,
	
	geometry: null,
	
	/** api: config[recordModel]
     *  ``Ext.Record | Array`` record model to create the store
     *  for restricting search.
	 * exemple: 
	 * recordModel: [
	 *	{name: 'id', mapping: 'id'},
	 *	{name: 'geometry', mapping: 'geometry'},
	 *	{name: 'codice_ato', mapping: 'properties.codice_ato'},
	 *	{name: 'denominazi', mapping: 'properties.denominazi'}
	 *	
	 *	 ],
     */
	recordModel: null,
	
	/** api: config[queriableAttributes]
     *  ``String | Array`` feature attributes to query
     *  for restricting search.
	 * for the exemple is ['codice_ato','denominazi']
     */
	queriableAttributes : [] ,
	
	/** api: config[sortBy]
     *  ``String | Array`` sorting attribute
     *  needed for pagination.
     */
	sortBy : 'codice_ato',

	/** api: config[pageSize]
     *  ``Integer`` page size of result list.
     *  needed for pagination. default is 10
     */
	pageSize:10,
	/** api: config[loadingText]
     *  ``String`` loading text for i18n 
     */
	loadingText: 'Searching...',
	/** api: config[emptyText]
     *  ``String`` empty text for i18n 
     */
	emptyText: "Search",
	/** api: config[width]
     *  ``int`` width of the text box. default is 200
     */
	width: 200,
	
	/** defines style for the search result item
	 */
	itemSelector:  'div.search-item',
	
	/** api: config[tpl]
     *  ``Ext.XTemplate`` the template to show results.
     */
	tpl: null,
	
	/** api: config[predicate]
     *  ``String`` predicate to use for search (LIKE,ILIKE,=...).
     */
	predicate: 'ILIKE',
	/** api: config[vendorParams]
     *  ``String`` additional parameters object. cql_filters
	 *  is used in AND the search params. (see listeners->beforequery)
     */
	vendorParams: '',

	outputFormat: 'application/json',
	
    clearOnFocus:true,
    /** private: method[initComponent]
     *  Override
     */
    initComponent: function() {
		
        this.store = new Ext.data.JsonStore({
			combo: this,
			root: this.root,
			
			autoLoad: false,
			fields:this.recordModel,
			mapPanel: this.mapPanel,
            url: this.url,
			vendorParams: this.vendorParams,
			paramNames:{
				start: "startindex",
				limit: "maxfeatures",
				sort: "sortBy",
                totalProperty: 'totalFeatures'
			},
			baseParams:{
				service:'WFS',
				version:'1.1.0',
				request:'GetFeature',
				typeName:this.typeName ,
				outputFormat: this.outputFormat,
				sortBy: this.sortBy
				
			
			},
			listeners:{
				beforeload: function(store){
					var mapPanel = (this.mapPanel?this.mapPanel:this.combo.target.mapPanel);
					store.setBaseParam( 'srsName', mapPanel.map.getProjection() );
					for (var name in this.vendorParams ) {
					    if(this.vendorParams.hasOwnProperty(name)){
    						if(name!='cql_filter' && name != "startindex" && name != "maxfeatures" && name != 'outputFormat' ){
    							store.setBaseParam(store, this.vendorParams[name]);
    						}
						}
					}
				}
			},
			
			loadRecords : function(o, options, success){
				if (this.isDestroyed === true) {
					return;
				}
				if(!o || success === false){
					if(success !== false){
						this.fireEvent('load', this, [], options);
					}
					if(options.callback){
						options.callback.call(options.scope || this, [], options, false, o);
					}
					return;
				}
				this.combo.crs = this.reader.jsonData.crs;
				//custom total workaround
				var estimateTotal = function(o,options,store){
					var current = o.totalRecords +  options.params[store.paramNames.start] ;
					var currentCeiling = options.params[store.paramNames.start] + options.params[store.paramNames.limit];
					if(current < currentCeiling){
						return current;
					}else{
						return 100000000000000000; 
					}
	
				};
				o.totalRecords = this.reader.jsonData.totalFeatures || estimateTotal(o,options,this);
				//end of custom total workaround
				
				var r = o.records, t = o.totalRecords || r.length;
				if(!options || options.add !== true){
					if(this.pruneModifiedRecords){
						this.modified = [];
					}
					for(var i = 0, len = r.length; i < len; i++){
						r[i].join(this);
					}
					if(this.snapshot){
						this.data = this.snapshot;
						delete this.snapshot;
					}
					this.clearData();
					this.data.addAll(r);
					this.totalLength = t;
					this.applySort();
					this.fireEvent('datachanged', this);
				}else{
					this.totalLength = this.reader.jsonData.totalFeatures || Math.max(t, this.data.length+r.length);
					this.add(r);
				}
				this.fireEvent('load', this, r, options);
				if(options.callback){
					options.callback.call(options.scope || this, r, options, true);
				}
			}
			
        });
        this.on({
            focus: function() {
                if(this.clearOnFocus) this.clearValue();
            },
            beforequery:function(queryEvent){
                var queryString = queryEvent.query;
                queryEvent.query = "";
                if(queryString !=""){
                    for( var i = 0 ; i < this.queriableAttributes.length ; i++){
                        queryEvent.query +=  "(" + this.queriableAttributes[i] + " "+this.predicate+" '%" + queryString + "%')";
                        if ( i < this.queriableAttributes.length -1) {
                            queryEvent.query += " OR ";
                        }
                    }
                }
                
                //add cql filter in and with the other condictions
                if(this.vendorParams && this.vendorParams.cql_filter) {
                    queryEvent.query = queryEvent.query != "" ? "(" + queryEvent.query + ")AND(" +this.vendorParams.cql_filter +")" : this.vendorParams.cql_filter;
                }
                if(queryEvent.query==""){
                    queryEvent.query ="INCLUDE";
                }

            }
        });
        if(!this.avoidSelectEvent){
            this.on({select : function(combo, record) {
                if (record && record.data.custom) {
                    this.custom = record.data.custom;
                } else {
                    this.custom = null;
                }
                if (record && record.data.geometry) {
                    var wkt_options = {};
                    var geojson_format = new OpenLayers.Format.GeoJSON({
                        ignoreExtraDims: true
                    });
                    var testFeature = geojson_format.read(record.data.geometry);
                    var wkt = new OpenLayers.Format.WKT(wkt_options);
                    var out = wkt.write(testFeature);

                    var geomCollectionIndex = out.indexOf('GEOMETRYCOLLECTION(');
                    if (geomCollectionIndex == 0) {
                        out = out.substring(19,out.length-1);
                    }
                    this.geometry = out;
                } else {
                    this.geometry = null;
                }
            }});
        
        }

        return gxp.form.WFSSearchComboBox.superclass.initComponent.apply(this, arguments);
    },
		
	getCustom : function() {
		return this.custom;
	},
	
	getGeometry : function() {
		return this.geometry;
	},
	
	//custom initList to have custom toolbar.
	
	initList : function(){
        if(!this.list){
            var cls = 'x-combo-list',
                listParent = Ext.getDom(this.getListParent() || Ext.getBody()),
                zindex = parseInt(Ext.fly(listParent).getStyle('z-index') ,10);

            if (this.ownerCt && !zindex){
                this.findParentBy(function(ct){
                    zindex = parseInt(ct.getPositionEl().getStyle('z-index'), 10);
                    return !!zindex;
                });
            }

            this.list = new Ext.Layer({
                parentEl: listParent,
                shadow: this.shadow,
                cls: [cls, this.listClass].join(' '),
                constrain:false,
                zindex: (zindex || 12000) + 5
            });

            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
            this.list.setSize(lw, 0);
            this.list.swallowEvent('mousewheel');
            this.assetHeight = 0;
            if(this.syncFont !== false){
                this.list.setStyle('font-size', this.el.getStyle('font-size'));
            }
            if(this.title){
                this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
                this.assetHeight += this.header.getHeight();
            }

            this.innerList = this.list.createChild({cls:cls+'-inner'});
            this.mon(this.innerList, 'mouseover', this.onViewOver, this);
            this.mon(this.innerList, 'mousemove', this.onViewMove, this);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));

            if(this.pageSize){
                this.footer = this.list.createChild({cls:cls+'-ft'});
				
				//
				// custom pagin toolbar 
				//
                this.pageTb = new Ext.PagingToolbar({
                    store: this.store,
                    pageSize: this.pageSize,
                    renderTo:this.footer,
					afterPageText:"",
					beforePageText:"",
					listeners:{
						render: function(){
							this.last.setVisible(false);
							//this.inputItem.disable();
						}
					}
                });
				
                this.assetHeight += this.footer.getHeight();
            }

            if(!this.tpl){
                this.tpl = '{' + this.displayField + '}';
            }

            this.view = new Ext.DataView({
                applyTo: this.innerList,
                tpl: this.tpl,
                singleSelect: true,
                selectedClass: this.selectedClass,
                itemSelector: this.itemSelector || '.' + cls + '-item',
                emptyText: this.listEmptyText,
                deferEmptyText: false
            });

            this.mon(this.view, {
                containerclick : this.onViewClick,
                click : this.onViewClick,
                scope :this
            });

            this.bindStore(this.store, true);

            if(this.resizable){
                this.resizer = new Ext.Resizable(this.list,  {
                   pinned:true, handles:'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                    this.listWidth = w;
                    this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                    this.restrictHeight();
                }, this);

                this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
            }
        }
    }

});

Ext.reg(gxp.form.WFSSearchComboBox.prototype.xtype, gxp.form.WFSSearchComboBox);
