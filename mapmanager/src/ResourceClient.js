/**
 *  requires ExtJs 3.4
 *
 *  This module encapsulates the interaction logic with the GeoStore
 *  The idea is to abstract away from how the interaction is implemented (i.e. REST/json or xml messages)
 *  It is not intended to duplicate Ext.JSonStore, but to separate concerns
 *
 *  'extend' mechanism use the pseudoclassial pattern 
 */

(function(){
	
	var root = this;
	var GeoStore = root.GeoStore = {};
	GeoStore.VERSION = '0.1';
	
	

	/*
	 * utility class to manage uri
	 */
	var Uri = root.Uri = function(options){
		this.SEPARATOR = '/';
		this.params_ = new Object();
		this.uri_ = options.url;
	};
	Uri.prototype.appendPath = function(path){
		this.uri_ = this.uri_ + this.SEPARATOR + path;
		return this;
	};
	Uri.prototype.setBaseUrl = function(baseUrl){
		this.uri_ = baseUrl + this.SEPARATOR + this.uri_;
		return this;
	};
	Uri.prototype.appendId = function(id){
		return this.appendPath(id);
	};
	Uri.prototype.addParam = function(name, value){
		this.params_[name] = value;
	};
	Uri.prototype.toString = function(){
		this.uri_ += '?';
		for (key in this.params_){
			this.uri_ += key + '=' + this.params_[key] + '&';
		}
		return this.uri_;
	};

	/**
	 *  abstract away GeoStore rest api
	 */
	var ContentProvider = GeoStore.ContentProvider = function(options){
		this.authorization_ = options.authorization ;
		this.baseUrl_ = options.url;
		this.resourceNamePrefix_ = '/';
		this.acceptTypes_ = 'application/json, text/plain, text/xml';
		this.onSuccess_ = Ext.emptyFn;
		this.onFailure_ = Ext.emptyFn;
		this.initialize.apply(this, arguments);
	};
	
	// prototype definitions
	
	ContentProvider.prototype.initialize = function(){
		console.log( 'created GeoStore.ContentProvider');
		console.log( 'authorization: ' + this.authorization_ );
		console.log( 'base url: ' + this.baseUrl_);
	};
	
	ContentProvider.prototype.beforeFind = function(data){
		// do nothing
		return data;
	};
	ContentProvider.prototype.afterFind = function(data){
		// do nothing
		return data;
	};
	ContentProvider.prototype.beforeSave = function(data){
		// do nothing
		return data;
	};
	ContentProvider.prototype.afterSave = function(data){
		// do nothing
		return data;
	};
	
	ContentProvider.prototype.success = function( callback ){
		this.onSuccess_ = callback;
		return this;
	};
	ContentProvider.prototype.failure = function( callback ){
		this.onFailure_ = callback;
		return this;
	};
	
	/*
	 *  find an element given its uri
	 */
	ContentProvider.prototype.findByPk = function(pk, callback, params_opt){
		this.beforeFind();
		
		// build the uri to invoke
		var uri = new Uri({'url':this.baseUrl_});
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );
		if (params_opt){
			for( name in params_opt ){
				uri.addParam( name, params_opt[name] );
			}
		}
	
		var self = this;
		var Request = Ext.Ajax.request({
	       url: uri.toString(), 
	       method: 'GET',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_,
	       },
	       scope: this,
	       success: function(response, opts){
				var data = self.afterFind( Ext.util.JSON.decode(response.responseText) ); 
				callback(data);
	       },
	       failure: function(response, opts){
				this.onFailure_(response);
	       },
	    });
	};
	
	/*
	 * find all elements
	 */
	ContentProvider.prototype.find = function(callback){
		var uri = new Uri({'url':this.baseUrl_});
		// build a request
		var self = this;
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'GET',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_,
	       },
	       scope: this,
	       success: function(response, opts){
				var data = self.afterFind( Ext.util.JSON.decode(response.responseText) );
				callback(data);
	       },
	       failure:  function(response, opts){
	       		var json = Ext.util.JSON.decode(response.responseText);
				console.log(Ext.util.JSON.decode(json));
	       },
	    });		
	};
	
	/*
	 * delete an element
	 */
	ContentProvider.prototype.delete = function(pk, callback){
		var uri = new Uri({'url':this.baseUrl_});
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'DELETE',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_,
	       },
	       scope: this,
	       success: function(response, opts){
				var json = Ext.util.JSON.decode(response.responseText);
				callback( response );
	       },
	       failure:  function(response, opts){
	       		var json = Ext.util.JSON.decode(response.responseText);
				console.log(Ext.util.JSON.decode(json));
	       },
	    });		
	};
	
	/*
	 *  create a new element
	 */
	ContentProvider.prototype.create = function(item, callback){
		 var uri = new Uri({'url':this.baseUrl_});
		 var data = this.beforeSave( item );
		// build the Ajax request
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'POST',
	       headers:{
	          'Content-Type' : 'text/xml',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_,
	       },
	       params: data,
	       scope: this,
	       success: function(response, opts){
				callback(response.responseText);
	       },
	       failure:  function(response, opts){
	       		console.log(response);
	       },
	    });		
	};
	
	// implements inheritance
	 var extend = function (proto) {
	    var child = inherits(this, proto);
	    child.extend = this.extend;
	    return child;
	  };

	 ContentProvider.extend = extend;	
	
	// utility functions
	var inherits = function(parent, proto) {
	    var child = function(){ parent.apply(this, arguments); };
	    // assign to child all the properties of the parent
	    for (var prop in parent){
			child[prop] = parent[prop];
		}
		var F = function(){};
		F.prototype = parent.prototype;
		child.prototype = new F;
		if (proto){
			for (var prop in proto){
				child.prototype[prop] = proto[prop];
			}	
		}
		return child;
	};
	
   // init some content providers used in the application

   /* 
    *  allows user to access maps on GeoStores
    */
   var Maps = GeoStore.Maps = ContentProvider.extend({
	initialize: function(){
		this.resourceNamePrefix_ = 'resource';
	},
	beforeSave: function(data){
		// wrap new map within an xml envelop
		var xml = '<Resource>' +
			'<Attributes>' +
				'<attribute>' +
					'<name>owner</name>' +
					'<type>STRING</type>' +
					'<value>' + data.owner + '</value>' +
				'</attribute>' +
			'</Attributes>' +
			'<description>' + data.description + '</description>' +
			'<metadata></metadata>' +
			'<name>' + data.name + '</name>' +
			'<category>' +
				'<name>MAP</name>' +
			'</category>' +
			'<store>' +
				'<data><![CDATA[ ' + data.blob + ' ]]></data>' +
			'</store>' +
		'</Resource>';
		return xml;
	},
	afterFind: function(json){
		
		if ( json.Resource ){
			var data = new Object;
			data.owner = json.Resource.Attributes.attribute.value;
			data.description = json.Resource.description;
			data.name = json.Resource.name;
			data.blob = json.Resource.data.data;
			data.id = json.Resource.id;
			data.creation = json.Resource.creation;		
			return data;			
		} else {
			this.onFailure_('cannot parse response');
		}

	},
   } );

  /*
   *  allows admin users to access user information
   */
  var Users = GeoStore.Users = ContentProvider.extend({
	initialize: function(){
		this.resourceNamePrefix_ = 'user';
	},
	beforeSave: function(data){
		// wrap new user within an xml envelop
		var xml = '<User><name>' + data.name +'</name>'
		          +'<newPassword>'+ data.password + '</newPassword>'
		          +'<role>' + data.role + '</role></User>';
		return xml;
	},
	afterFind: function(json){
		 if ( json.UserList ){
			var data = new Array;
			if ( json.UserList.User.length === undefined){
				data.push(json.UserList.User);
				return data;
			}
			for (var i=0; i< json.UserList.User.length; i++){
				var user = json.UserList.User[i];
				var obj = new Object;
				obj.id = user.id;
				obj.name = user.name;
				obj.password = '';
				obj.role = user.role;
				data.push( obj ); 
			}
			return data;
		} else {
			this.onFailure_('cannot parse response');
		}
	}
  } );
	
	
}).call(this);


