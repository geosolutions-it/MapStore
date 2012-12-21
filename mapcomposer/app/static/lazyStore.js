/**
 * Ext.ux.LazyJSonStore: lazyStore to load without 
 * knowing the total size of result list. Useful for
 * paged queries when the total number of records is 
 * not available/required
 *
 */
Ext.ux.LazyJsonStore = Ext.extend(Ext.data.JsonStore,{
	resetTotal:function (){
		this.tot = null;
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
		this.crs = this.reader.jsonData.crs;
		this.bbox =  this.reader.jsonData.bbox;
		this.featurecollection = this.reader.jsonData;
		//custom total workaround
		var estimateTotal = function(o,options,store){
			var current = o.totalRecords + options.params[store.paramNames.start] ;
			var currentCeiling = options.params[store.paramNames.start] + options.params[store.paramNames.limit];
			if(current < currentCeiling){
				store.tot = current;
				return current;
			}else{
				
				return  store.tot || 100000000000000000; 
			}

		}
		o.totalRecords = estimateTotal(o,options,this);
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
			this.totalLength = Math.max(t, this.data.length+r.length);
			this.add(r);
		}
		this.fireEvent('load', this, r, options);
		if(options.callback){
			options.callback.call(options.scope || this, r, options, true);
		}
	}
});	
	
/**
 * Ext.ux.LazyPagingToolbar
 * Paging toolbar for lazy stores like Ext.ux.LazyJsonStore
 */
Ext.ux.LazyPagingToolbar = Ext.extend(Ext.PagingToolbar,{		
		displayInfo: true,
		displayMsg: "",
		emptyMsg: "",
		afterPageText:"",
		beforePageText:"",
		onLoad : function(store, r, o){
			if(!this.rendered){
				this.dsLoaded = [store, r, o]; 
				return;
			}
			var p = this.getParams();
			this.cursor = (o.params && o.params[p.start]) ? o.params[p.start] : 0;
			var d = this.getPageData(), ap = d.activePage, ps = d.pages;

			this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
			this.inputItem.setValue(ap);
			this.first.setDisabled(ap == 1);
			this.prev.setDisabled(ap == 1);
			this.next.setDisabled(ap >= ps);
			this.last.setDisabled(ap >= ps);
			this.refresh.enable();
			this.updateInfo();
			this.fireEvent('change', this, d);
		},
		listeners:{
			beforerender: function(){
				this.refresh.setVisible(false);
				this.last.setVisible(false);
			},
			change: function (total,pageData){
				if(pageData.activePage>pageData.pages){
					this.movePrevious();
					this.next.setDisabled(true);
				}
				
			}
		}
});

/**
 * Vme.data.extensions.WFS.WFSStore: WFS generic store 
 * you can replace fields to get the needed properties
 * (e.g. {name:'myprop',mapping: 'properties.myprop'
 * properties:
 * * typeName - the featureType  
 *
 */
WFSStore = Ext.extend(Ext.ux.LazyJsonStore,{	

	typeName: null,
	
	autoLoad: false,

	paramNames:{
		start: "startindex",
		limit: "maxfeatures",
		sort: "sortBy"
	},
	
	baseParams:{
		service:'WFS',
		version:'1.0.0',
		request:'GetFeature',
		outputFormat:'json',
		srs:'EPSG:32632'
	},
	
	listeners:{
		beforeload: function(store,options){
			if(!options.typeName){
				store.setBaseParam( 'typeName', store.typeName);
			}
		}
	}
})
