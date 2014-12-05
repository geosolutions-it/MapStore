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
Ext.ns("MapStore.data");

/**
 * Store that get data from GeoStore
 * 
 */
MapStore.data.GeoStoreStore = Ext.extend(Ext.data.JsonStore, {
	/** set CategoryName if you want to browse a particular category 
	*/
	categoryName: null,
	/**
	 * Attribute To ask in addition to the current
	 */
	additionalAttribute: null,
	/**
	 * Include attributes in search responses
	 */
	includeAttributes: false,
	/**
	 * Include attributes and data in search responses
	 */
	fullResource: false,
	/**
	 * filter
	 */
	currentFilter: '***',
	/**
	 * geostore rest url
	 */
	geoStoreBase: "/geostore/rest/",
	failTitle: "Error",
	fields: ['id', 'name', 'owner', 'creation', 'lastUpdate', 'description', 'canCopy','canCreate','canDelete','canEdit','store','attributes'],
    /**
	 * auth
	 */
	auth: null,
	/**
     * @cfg {Ext.data.DataReader} reader @hide
     */
    constructor: function(config){
	
		this.geoStoreBase = config.geoStoreBase ? config.geoStoreBase : this.geoStoreBase;
		var store = this;
        MapStore.data.GeoStoreStore.superclass.constructor.call(this, Ext.apply(config, {
			autoDestroy: true,
			autoLoad: (typeof config.autoLoad === 'undefined') ? true : config.autoLoad,
			autoSave: true,
			root: 'results',
			totalProperty: 'totalCount',
			successProperty: 'success',
			idProperty: 'id',
			remoteSort: false,
			//get the additional attribute as record
			fields: config.fields ? config.fields : (config.additionalAttribute ? this.fields.concat(config.additionalAttribute): this.fields),
			sortInfo: config.sortInfo ? config.sortInfo : { field: "name", direction: "ASC" },
			proxy : new Ext.data.HttpProxy({
				api:{
					read: this.getSearchUrl(config),
					create: this.getCreateUrl(config)
				},
				restful: true,
				method : 'GET',
				disableCaching: true,
				failure: this.onFailure,
				headers: {'Accept': 'application/json', 'Authorization' : config.auth}
				
			})
			
        }));
		
    },
	/**
	 * filter the store
	 */
	search: function(keyword){  

        if ( !keyword || keyword==='' ){
            this.currentFilter = '*';                    
        } else {
            this.currentFilter = '*'+keyword+'*';                                        
        }
        this;

        this.proxy.api.read.url = this.getSearchUrl();
		//TODO get last params for page size
        this.load({
			params:{
				start:0,
				limit:this.pageSize
			}
		});
    },
	/**
	 * Search url creation
	 */
	getSearchUrl: function(config) {
		if(!config){
			var config = this;
		}
        return config.geoStoreBase + 'extjs/search' 
			+ (config.categoryName ? '/category/'+ config.categoryName : '') 
			+ (config.currentFilter ?'/' + config.currentFilter:'')
			+ (config.additionalAttribute ?'/' + config.additionalAttribute:'')
			+ (config.includeAttributes ?'?includeAttributes=true': '')
			+ (config.fullResource ?'?includeAttributes=true&includeData=true': '')
			;
    },
	/**
	 * Search url creation
	 */
	getCreateUrl: function(config) {
		if(!config){
			var config = this;
		}
        return config.geoStoreBase + 'resources/' ;
    },
	/**
	 *  failure method that can be overridden
	 */
	onFailure : function (response) {
		  Ext.Msg.show({
		   title: this.failTitle,
		   msg: response.statusText + "(status " + response.status + "):  " /* + response.responseText */,
		   buttons: Ext.Msg.OK,
		   icon: Ext.MessageBox.ERROR
		});                                
	}
});
Ext.reg('geostorestore', MapStore.data.GeoStoreStore);