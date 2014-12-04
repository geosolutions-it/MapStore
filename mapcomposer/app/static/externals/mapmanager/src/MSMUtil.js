/*
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
	
	// ///////////////////////////////////////////////////////
	// Save a reference for this function scope/context
	// ///////////////////////////////////////////////////////
	var root = this;
	
	// ///////////////////////////////////////////////////////
	// Expose GeoStore to the external world
	// ///////////////////////////////////////////////////////	
	var GeoStore = root.GeoStore = {};
	
	// ///////////////////////////////////////////////////////
	// Expose Google Services
	// ///////////////////////////////////////////////////////
	var Google = root.Google = {};
	
	// ///////////////////////////////////////////////////////
	// Version for the API client
	// ///////////////////////////////////////////////////////
	GeoStore.VERSION = '0.1';
	
	/**
	 * Class: Uri
	 * this class represents an uri http://host:port/path/id
	 *
	 */
	var Uri = root.Uri = function(options){
		this.SEPARATOR = '/';
		this.params_ = new Object();
		this.uri_ = options.url;
	};

	/** 
	 * Function: appendPath
	 * append a path to the current URI
	 *
	 * Parameters:
	 * path - {String}
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.appendPath = function(path){
		this.uri_ = this.uri_ + this.SEPARATOR + path;
		return this;
	};
	
	/** 
	 * Function: setBaseUrl
	 * set the base url for this uri
	 * a base url is something of the form http://host:port
	 *
	 * Parameters:
	 * baseUrl - {String}
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.setBaseUrl = function(baseUrl){
		this.uri_ = baseUrl + this.SEPARATOR + this.uri_;
		return this;
	};
	
	/** 
	 * Function: appendId
	 * add an id to the current uri
	 *
	 * Parameters:
	 * id - {String or Number}
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.appendId = function(id){
		return this.appendPath(id);
	};
	
	/** 
	 * Function: addParam
	 * add params to the uri
	 *
	 * Parameters:
	 * name - {String} the name of the param
	 * value - {String or Boolean or Number} the value of the param
	 * Return:
	 * {Uri}
	 */
	Uri.prototype.addParam = function(name, value){
		this.params_[name] = value;
	};
	
	/** 
	 * Function: toString
	 * get a string representation for the uri
	 *
	 * Parameters:
	 * Return:
	 * {String}
	 */
	Uri.prototype.toString = function(){
        //check parameters
        var uri = this.uri_;
            uri += '?';
            for (var key in this.params_){
                uri += key + '=' + this.params_[key] + '&';
            }
		return uri;
	};

	/**
	 * Class: GeoStore.ContentProvider
	 * this class abstract away GeoStore APIs
	 *
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
	
	// ////////////////////////////////////
	//       Prototype definitions       //
	// ////////////////////////////////////
	/** 
	 * Function: initialize
	 * initialize this class
	 *
	 * Parameters:
	 * Return:
	 */
	ContentProvider.prototype.initialize = function(){
//		console.log( 'created GeoStore.ContentProvider');
//		console.log( 'authorization: ' + this.authorization_ );
//		console.log( 'base url: ' + this.baseUrl_);
	};
	
	/** 
	 * Function: beforeFind
	 * this method is called before find methods
	 *
	 * Parameters:
	 * data - {Any}
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.beforeFind = function(data){
		return data;
	};
	
	/** 
	 * Function: afterFind
	 * this method is called after find methods
	 *
	 * Parameters:
	 * data - {Any} the response read
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.afterFind = function(data){
		// do nothing
		return data;
	};
	
	/** 
	 * Function: beforeSave
	 * this method is called before save or update methods
	 *
	 * Parameters:
	 * data - {Any} the item to be saved or updated
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.beforeSave = function(data){
		// do nothing
		return data;
	};
	
	/** 
	 * Function: afterSave
	 * this method is called after save or update methods
	 *
	 * Parameters:
	 * data - {Any} the response obtained after saving
	 * Return:
	 * {Any}
	 */
	ContentProvider.prototype.afterSave = function(data){
		// do nothing
		return data;
	};
	
	/** 
	 * Function: success
	 * set a callback method for success
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * {ContentProvider}
	 */
	ContentProvider.prototype.success = function( callback ){
		this.onSuccess_ = callback;
		return this;
	};
	
	/** 
	 * Function: failure
	 * set a callback method for failure
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * {ContentProvider}
	 */
	ContentProvider.prototype.failure = function( callback ){
		this.onFailure_ = callback;
		return this;
	};
	
	/** 
	 * Function: findByPk
	 * find an element by its primary key in async mode
	 *
	 * Parameters:
	 * pk - {String} primary key
	 * callback - {Function} callback
	 * params_opt - {Array} optional array of the item of type {name:..., value:,...}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.findByPk = function(pk, callback, params_opt){
		this.beforeFind();
		
		// ///////////////////////////////////////////////////////
		// Build the uri to invoke
		// ///////////////////////////////////////////////////////
		var uri = new Uri({'url': this.baseUrl_ });
        
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );
        //add param options
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
	          'Authorization' : this.authorization_
	       },
	       scope: this,
	       success: function(response, opts){
				var data = self.afterFind( Ext.util.JSON.decode(response.responseText) ); 
				callback(data);
	       },
	       failure: function(response, opts){
				this.onFailure_(response);
	       }
	    });
	};	

	/** 
	 * Function: find
	 * find all elements in async mode
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.find = function(callback){
		var uri = new Uri({'url':this.baseUrl_});
		
		// ////////////////////
		// Build a request
		// ////////////////////
		var self = this;
		var Request = Ext.Ajax.request({
	       url: uri.toString(),
	       method: 'GET',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
	       success: function(response, opts){
				var data = self.afterFind( Ext.util.JSON.decode(response.responseText) );
				callback(data);
	       },
	       failure:  function(response, opts){
	       		var json = Ext.util.JSON.decode(response.responseText);
	       }
	    });		
	};
	
	/** 
	 * Function: update
	 * update an element identified by its pk
	 *
	 * Parameters:
	 * pk - {String or Number} primaty key
	 * item - {Object} object to be created
	 * callback - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.update = function(pk, item, callback, failureCallback){
		var data = this.beforeSave(item);
		var uri = new Uri({'url':this.baseUrl_});
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );

		// remove appended "?" without parameters
		var url = uri.toString();
		if(url.indexOf("?") == url.length - 1){
			url = url.replace("?", "");
		}

		var Request = Ext.Ajax.request({
	       url: url,
	       method: 'PUT',
	       headers: {
	          'Content-Type' : 'text/xml',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
		   params: data,
	       success: function(response, opts){
				callback( response );
	       },
	       failure:  function(response, opts){
                if(failureCallback){
                    failureCallback(response);
                }else{
                    this.onFailure_(response);
                }
	       }
	    });
	};	
	
	/** 
	 * Function: delete
	 * delete an element by its primary key in async mode
	 *
	 * Parameters:
	 * pk - {String or Number} primary key
	 * callback - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.deleteByPk = function(pk, callback){
		var uri = new Uri({'url':this.baseUrl_});
		uri.appendPath( this.resourceNamePrefix_ ).appendId( pk );

		// remove appended "?" without parameters
		var url = uri.toString();
		if(url.indexOf("?") == url.length - 1){
			url = url.replace("?", "");
		}

		var Request = Ext.Ajax.request({
	       url: url,
	       method: 'DELETE',
	       headers:{
	          'Content-Type' : 'application/json',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       scope: this,
	       success: function(response, opts){
				var json = Ext.util.JSON.decode(response.responseText);
				callback( response );
	       },
	       failure:  function(response, opts) {
	       		var json = Ext.util.JSON.decode(response.responseText);
				console.log(Ext.util.JSON.decode(json));
	       }
	    });		
	};
	
	/** 
	 * Function: create
	 * create a new element in async mode
	 *
	 * Parameters:
	 * item - {Object} values to be updated
	 * callbacl - {Function}
	 * Return:
	 * 
	 */
	ContentProvider.prototype.create = function(item, callback, failureCallback, scope){
		var uri = new Uri({'url':this.baseUrl_});
		var data = this.beforeSave( item );

		// remove appended "?" without parameters
		var url = uri.toString();
		if(url.indexOf("?") == url.length - 1){
			url = url.replace("?", "");
		}
		
		// ///////////////////////////////
		// Build the Ajax request
		// ///////////////////////////////
		var Request = Ext.Ajax.request({
	       url: url,
	       method: 'POST',
	       headers:{
	          'Content-Type' : 'text/xml',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_
	       },
	       params: data,
	       scope: this,
	       success: function(response, opts){
				callback.call(scope, response.responseText);
	       },
	       failure:  function(response, opts){
				if(typeof(failureCallback) === 'function') {
                    failureCallback.call(scope, response);
                } else {
				// ////////////////////////////////////////////////// //
				// TODO: Refactor this code externalize the           // 
			    //	     Msg definition for the i18n                  //
			    // ////////////////////////////////////////////////// //
				Ext.Msg.show({
					msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR
				});	
	       }
	       }
	    });
	};
	
	// ////////////////////////////////
	// Implements inheritance
	// ////////////////////////////////
	var extend = function (proto) {
	    var child = inherits(this, proto);
	    child.extend = this.extend;
	    return child;
	};

	// ////////////////////////////////////////////
	// Allow a ContentProvider to extend itself
	// ////////////////////////////////////////////
	ContentProvider.extend = extend;	
	
	// //////////////////////////////////////////////
	// Utility functions it implements inheritance 
	// following prototype chaining
	// //////////////////////////////////////////////
	var inherits = function(parent, proto) {
	    var child = function(){ 
			parent.apply(this, arguments); 		
		};
		
		// ////////////////////////////////////////////////////
	    // Assign to child all the properties of the parent
		// ////////////////////////////////////////////////////
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
	
	// /////////////////////////////////////////////////// //
	// Init some content providers used in the application //
	// /////////////////////////////////////////////////// //

	/**
	 * Class: GeoStore.Resource
	 *
	 * CRUD methods for Resources in GeoStore
	 * Inherits from:
	 *  - <GeoStore.ContentProvider>
	 *
	 */
	GeoStore.Resource = ContentProvider.extend({
		initialize: function(){
			this.resourceNamePrefix_ = 'resource';
		},
		beforeDeleteByFilter: function(data){
			var xmlFilter = "<AND>" +
								"<ATTRIBUTE>" + 
									"<name>" + 
										data.name + 
									"</name>" +
									"<operator>" + data.operator + "</operator>" + 
									"<type>" + data.type + "</type>" +
									"<value>" + 
										data.value + 
									"</value>" + 
								"</ATTRIBUTE>" + 
							"</AND>";
			return xmlFilter;
		},
		deleteByFilter: function(filterData, callback){
			var data = this.beforeDeleteByFilter(filterData);
			var uri = this.baseUrl_;
			
			Ext.Ajax.request({
			   url: uri,
			   method: 'DELETE',
			   headers:{
				  'Content-Type' : 'text/xml',
				  'Authorization' : this.authorization_
			   },
			   params: data,
			   scope: this,
			   success: function(response, opts){
					callback(response);
			   },
			   failure:  function(response, opts) {
			   }
			});		
		},
		beforeSave: function(data){
			// ///////////////////////////////////////
			// Wrap new map within an xml envelop
			// ///////////////////////////////////////
			var addedAttributes = false;
			var xml = '<Resource>';
			xml += '<name>' + data.name + '</name>';
			xml += '<description>' + data.description + '</description>';
			if(data.metadata){
				xml += '<metadata>'+data.metadata+'</metadata>';
			}
				
			/** This can remove all the attributes if present !!! do it in a better way as soon as possible **/
			if (data.attributes){
				xml += '<Attributes>';
					
				for(var att in data.attributes){
					xml +=
					'<attribute>' +
						'<name>'+ att +'</name>' +
						'<type>'+ (att["@type"] || 'STRING') + '</type>' +
						'<value>' + data.attributes[att].value + '</value>' +
					'</attribute>';
				}
				addedAttributes = true;
					// close attributes
				if(addedAttributes){
					xml += '</Attributes>';
				}
			}

			if(data.category){
				 xml+= '<category>' +
					'<name>' + data.category + '</name>' +
				'</category>';
			}
			if (data.blob){
				xml+='<store>' +
					'<data><![CDATA[ ' + data.blob + ' ]]></data>' +
				'</store>';
			}
			xml += '</Resource>';
			return xml;
		},
		afterFind: function(json){
			
			if ( json.Resource ){
                var resource = json.Resource;
				var data = new Object;
				data.description = resource.description;
                data.id = resource.id;
				data.name = resource.name;
				data.creation = resource.creation;	
                if(resource.category){
                    data.category = resource.category.name
                }
                
                
                if(resource.data){
                    data.blob = resource.data.data;
                }
				if(resource.Attributes && resource.Attributes.attribute && (resource.Attributes.attribute instanceof Array)){
                    var attrarray = resource.Attributes.attribute;
					for(var i = 0; i < attrarray.length;i++){
                        if(!data.attributes){
                            data.attributes ={};
                        }
						data.attributes[attrarray[i].name] = attrarray[i];
					}
				}else if(resource.Attributes && resource.Attributes.attribute){
                    if(!data.attributes){
                        data.attributes ={};
                    }
					data.attributes[resource.Attributes.attribute.name] = resource.Attributes.attribute;
				}
				return data;			
			} else {
				this.onFailure_('cannot parse response');
			}
		}
    });
	// /////////////////////////////////////////////////// //
	// Init some content providers used in the application //
	// /////////////////////////////////////////////////// //

	/**
	 * Class: GeoStore.Maps
	 *
	 * CRUD methods for maps in GeoStore
	 * Inherits from:
	 *  - <GeoStore.ContentProvider>
	 *
	 */
	var Maps = GeoStore.Maps = ContentProvider.extend({
		initialize: function(){
			this.resourceNamePrefix_ = 'resource';
		},
		beforeDeleteByFilter: function(data){
			var xmlFilter = "<AND>" +
								"<ATTRIBUTE>" + 
									"<name>" + 
										data.name + 
									"</name>" +
									"<operator>" + data.operator + "</operator>" + 
									"<type>" + data.type + "</type>" +
									"<value>" + 
										data.value + 
									"</value>" + 
								"</ATTRIBUTE>" + 
							"</AND>";
			return xmlFilter;
		},
		deleteByFilter: function(filterData, callback){
			var data = this.beforeDeleteByFilter(filterData);
			var uri = this.baseUrl_;
			
			Ext.Ajax.request({
			   url: uri,
			   method: 'DELETE',
			   headers:{
				  'Content-Type' : 'text/xml',
				  'Authorization' : this.authorization_
			   },
			   params: data,
			   scope: this,
			   success: function(response, opts){
					callback(response);
			   },
			   failure:  function(response, opts) {
			   }
			});		
		},
		beforeSave: function(data){
			// ///////////////////////////////////////
			// Wrap new map within an xml envelop
			// ///////////////////////////////////////
			var addedAttributes = false;
			var xml = '<Resource>';
			
			/** This can remove all the attributes if present !!! do it in a better way as soon as possible **/
			if (data.owner){
				xml += 
				'<Attributes>' +
					'<attribute>' +
						'<name>owner</name>' +
						'<type>STRING</type>' +
						'<value>' + data.owner + '</value>' +
					'</attribute>';
				addedAttributes = true;
			}
			

			// close attributes
			if(addedAttributes){
				xml += '</Attributes>';
			}
				
			xml +=
				'<description>' + data.description + '</description>' +
				'<metadata></metadata>' +
				'<name>' + data.name + '</name>';
			if (data.blob)
			  xml+=
				'<category>' +
					'<name>MAP</name>' +
				'</category>' +
				'<store>' +
					'<data><![CDATA[ ' + data.blob + ' ]]></data>' +
				'</store>';
				
			xml += '</Resource>';
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
		}
    });

	/**
	 * Class: GeoStore.Users
	 *
	 * CRUD methods for users in GeoStore
	 * Inherits from:
	 *  - <GeoStore.ContentProvider>
	 *
	 */
	var Users = GeoStore.Users = ContentProvider.extend({
		initialize: function(){
			this.resourceNamePrefix_ = 'user';
		},
        
		beforeSave: function(data){
            var newPassword = data.password ? '<newPassword>'+ data.password + '</newPassword>' :'';
            var attribute = '';
            //generate attributes from the key:'value' object data.attribute
            if(data.attribute){
                for (var i in data.attribute ){
                    attribute += '<attribute><name>'+i+'</name><value>'+data.attribute[i]+'</value></attribute>'
                }
            }
            var groups = '';
            groups = '<groups>';
            if(data.groups){
                groups = '<groups>';
                for(var i = 0;i< data.groups.length;i++){
                    groups += '<group><groupName>' + data.groups[i].groupName + '</groupName></group>';
                }
                
            }else{
               
            }
            groups +=  '</groups>';
            var enabled = '';
            if(data.enabled!=undefined){
                enabled = '<enabled>' + (data.enabled ? 'true' : 'false')  + '</enabled>'
            }
			// wrap new user within an xml envelop
			var xml = '<User><name>' + data.name +'</name>'
                      + enabled 
					  + newPassword 
                      + attribute 
                      +groups
					  +'<role>' + data.role + '</role></User>';
			return xml;
		},
        
		//TODO beforeUpdate
	
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
                    obj.attribute = user.attribute;
                    obj.enabled = user.enabled;
					data.push( obj ); 
				}
				return data;
			} else if(json.User){
                var user = json.User;
					var obj = new Object;
					obj.id = user.id;
					obj.name = user.name;
					obj.password = '';
					obj.role = user.role;
                    obj.enabled = user.enabled;
                    if(user.attribute){
                        obj.attribute = {};
                        if( user.attribute instanceof Array){
                            for(var i = 0; i < user.attribute.length;i++){
                                obj.attribute[user.attribute[i].name] = user.attribute[i].value;
                            }
                        }else{
                            obj.attribute[user.attribute.name=user.attribute.value];
                        }
                    } 
                    if (user.groups && user.groups.group){
                        if(user.groups.group instanceof Array){
                            obj.groups = user.groups.group;
                        }else{
                            obj.groups = [user.groups.group];
                        }
                    } 
                    return obj;
                
            }else{
				this.onFailure_('cannot parse response');
			}
		}
	});
    /**
	 * Class: GeoStore.UserGroups
	 *
	 * CRUD methods for UserGroups in GeoStore
	 * Inherits from:
	 *  - <GeoStore.ContentProvider>
	 *
	 */
	var UserGroups = GeoStore.UserGroups = ContentProvider.extend({
		initialize: function(){
			this.resourceNamePrefix_ = 'group';
		},
        
		beforeSave: function(data){
            var description
           if(data.description){
            description='<description>' + data.description + '</description>'
           }
			// wrap new user within an xml envelop
			var xml = '<UserGroup><groupName>' + data.groupName +'</groupName>'
					  + description 
					  + '</UserGroup>';
			return xml;
		},
        
		//TODO beforeUpdate
	
		afterFind: function(json){
			 if ( json.UserGroupList ){
				var data = [];
				if ( json.UserGroupList.UserGroup.length === undefined){
					data.push(json.UserGroupList.UserGroup);
					return data;
				}
				for (var i=0; i< json.UserGroupList.UserGroup.length; i++){
					var group = json.UserGroupList.UserGroup[i];
					var obj = {};
					obj.id = obj.id;
					obj.groupName = group.groupName;
                    obj.description = group.description;
                    if(group.restUsers){
                        if(group.restUsers.User instanceof Array){
                            obj.restUsers = group.restUsers.User;
                        }else if (group.restUsers.User){
                            obj.restUsers = [group.restUsers.User];
                        }
                    }
					data.push( obj ); 
				}
				return data;
			} else if(json.UserGroup){
                var group = json.UserGroup;
					var obj = {};
					obj.id = group.id;
					obj.groupName = group.groupName;
					obj.description = group.description;
                    obj.restUsers = group.restUsers;
                    if(group.restUsers){
                        if(group.restUsers.User instanceof Array){
                            obj.restUsers = group.restUsers.User;
                        }else if (group.restUsers.User){
                            obj.restUsers = [group.restUsers.User];
                        }
                    }
                    return obj;
                
            }else{
				this.onFailure_('cannot parse response');
			}
		}
	});

    /**
	 * Class: GeoStore.ResourcePermission
	 *
	 * CRUD methods for Security rules for a resource in GeoStore
	 * Inherits from:
	 *  - <GeoStore.ContentProvider>
	 *
	 */
	var ResourcePermission = GeoStore.ResourcePermission = ContentProvider.extend({
		initialize: function(){
			this.resourceNamePrefix_ = 'securityrule';
		},
        
		beforeSave: function(data){
			// wrap security rule list
			var xml = '<SecurityRuleList>';
			if(data && data.length > 0){
				for(var i = 0; i < data.length; i++){
					var rule = data[i];
					// valid rule
					if(rule && (rule.user || rule.group)){
						xml += 
						'<SecurityRule>' +
							'<canRead>' + rule.canRead + '</canRead>' +
							'<canWrite>' + rule.canWrite + '</canWrite>';
						if(rule.user){
							xml += 
								'<user>' + 
									'<id>' + rule.user.id + '</id>' +
									'<name>' + rule.user.name + '</name>' +
								'</user>';
						} else if(rule.group){
							xml += 
								'<group>' + 
									'<id>' + rule.group.id + '</id>' +
									'<groupName>' + rule.group.groupName + '</groupName>' +
								'</group>';
						}

						xml += 
							'</SecurityRule>';
					}
				}
			}

			xml += '</SecurityRuleList>';


			return xml;
		},
	
		afterFind: function(json){
			 if ( json.SecurityRuleList ){
				var data = [];
				for (var i=0; i< json.SecurityRuleList.length; i++){
					data.push(this.afterFind(json.SecurityRuleList[i])); 
				}
				return data;
			} else if(json.SecurityRule){
                var rule = json.SecurityRule;
					var obj = {};
					obj.canRead = rule.canRead;
					obj.canWrite = rule.canWrite;
					if(rule.user && rule.user.id){
						obj.user = {
							id: rule.user.id,
							name: rule.user.name
						};
					}else if(rule.group && rule.group.id){
						obj.group = {
							id: rule.group.id,
							groupName: rule.group.groupName
						};
					}
                    return obj;
                
            }else{
				this.onFailure_('cannot parse response');
			}
		}
	});
	
	/**
	 * Class: Google.Shortener
	 *
	 * Access Google service to shorten urls
	 *
	 */	
	var Shortener = Google.Shortener = function(options) {
		this.config = options.config;
		this.onFailure_ = Ext.emptyFn;
	};

	/**
	 * Class: GeoStore.Templates
	 *
	 * CRUD methods for templates in GeoStore
	 * Inherits from:
	 *  - <GeoStore.ContentProvider>
	 *
	 */
	var Templates = GeoStore.Templates = ContentProvider.extend({
		initialize: function(){
			this.resourceNamePrefix_ = 'resource';
		},
		beforeDeleteByFilter: function(data){
			var xmlFilter = "<AND>" +
								"<ATTRIBUTE>" + 
									"<name>" + 
										data.name + 
									"</name>" +
									"<operator>" + data.operator + "</operator>" + 
									"<type>" + data.type + "</type>" +
									"<value>" + 
										data.value + 
									"</value>" + 
								"</ATTRIBUTE>" + 
							"</AND>";
			return xmlFilter;
		},
		deleteByFilter: function(filterData, callback){
			var data = this.beforeDeleteByFilter(filterData);
			var uri = this.baseUrl_;
			
			Ext.Ajax.request({
			   url: uri,
			   method: 'DELETE',
			   headers:{
				  'Content-Type' : 'text/xml',
				  'Authorization' : this.authorization_
			   },
			   params: data,
			   scope: this,
			   success: function(response, opts){
					callback(response);
			   },
			   failure:  function(response, opts) {
			   }
			});		
		},
		beforeSave: function(data){
			// ///////////////////////////////////////
			// Wrap new map within an xml envelop
			// ///////////////////////////////////////
			var xml = '<Resource>';
			if (data.owner) 
				xml += 
				'<Attributes>' +
					'<attribute>' +
						'<name>owner</name>' +
						'<type>STRING</type>' +
						'<value>' + data.owner + '</value>' +
					'</attribute>' +
				'</Attributes>';
			xml +=
				'<description>' + data.description + '</description>' +
				'<metadata></metadata>' +
				'<name>' + data.name + '</name>';
			if (data.blob)
			  xml+=
				'<category>' +
					'<name>TEMPLATE</name>' +
				'</category>' +
				'<store>' +
					'<data><![CDATA[ ' + data.blob + ' ]]></data>' +
				'</store>';
				
			xml += '</Resource>';
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
				data.lastUpdate = json.Resource.lastUpdate;	
				return data;			
			} else {
				this.onFailure_('cannot parse response');
			}
		}
    });

	/**
	 * Class: GeoStore.Categories
	 *
	 * CRUD methods for categories in GeoStore
	 * Inherits from:
	 *  - <GeoStore.ContentProvider>
	 *
	 */
	var Categories = GeoStore.Categories = ContentProvider.extend({
		initialize: function(){
			this.resourceNamePrefix_ = 'category';
		},
		deleteByFilter: function(filterData, callback){
			var uri = this.baseUrl_;
			
			Ext.Ajax.request({
			   url: uri,
			   method: 'DELETE',
			   headers:{
				  'Content-Type' : 'text/xml',
				  'Authorization' : this.authorization_
			   },
			   scope: this,
			   success: function(response, opts){
					callback(response);
			   },
			   failure:  function(response, opts) {
			   }
			});		
		},
		beforeSave: function(data){
			// ///////////////////////////////////////
			// Wrap new map within an xml envelop
			// ///////////////////////////////////////
			var xml = "<Category><name>" + data.name + "</name></Category>";
			return xml;
		},
		afterFind: function(json){
			
			if ( json.Category ){
				var data = new Object;
				data.name = json.Resource.name;
				return data;			
			} else if (json.CategoryList && json.CategoryList.Category){
				return json.CategoryList.Category;			
			} else {
				this.onFailure_('cannot parse response');
			}
		},
		/** 
		 * Function: find
		 * find all elements in async mode
		 *
		 * Parameters:
		 * callback - {Function}
		 * Return:
		 * 
		 */
		findByName: function(name, callback){
			var uri = new Uri({'url':this.baseUrl_ + "/" + name});
			
			// ////////////////////
			// Build a request
			// ////////////////////
			var self = this;
			var Request = Ext.Ajax.request({
		       url: uri.toString(),
		       method: 'GET',
		       headers:{
		          'Content-Type' : 'application/json',
		          'Accept' : this.acceptTypes_,
		          'Authorization' : this.authorization_
		       },
		       scope: this,
		       success: function(response, opts){
					var data = self.afterFind( Ext.util.JSON.decode(response.responseText) );
					callback(data);
		       },
		       failure:  function(response, opts){
		       		var json = Ext.util.JSON.decode(response.responseText);
		       }
		    });		
		}
    });

	/** 
	 * Function: shorten
	 * shortens a long url in async mode
	 *
	 * Parameters:
	 * url - {String} a long url
	 *
	 * Return:
	 * 
	 * See Also:
	 *   https://developers.google.com/url-shortener/v1/getting_started
	 *
	 */
	Shortener.prototype.shorten = function( longUrl, callback ) {
		// /////////////////////////////////
		// Disabled Google shortener URL!
		// /////////////////////////////////

		setTimeout(function() {		//simulate ajax delay
			callback( longUrl );
		}, 800);
		
		/*
		var apikey = this.config.googleApi,
			gapi_proxyUrl = this.config.proxyUrl + '?url=' + escape('https://www.googleapis.com/urlshortener/v1/url?key='+apikey);

		var jsonparams = Ext.util.JSON.encode({ longUrl: longUrl });
		var myAjax = new Ext.data.Connection();
		myAjax.request({
			url: gapi_proxyUrl,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			params: jsonparams,
			scope: this,
			success: function(response, opts) {
				var json = Ext.util.JSON.decode( response.responseText ),
					shortUrl = json.id;
				//https://developers.google.com/url-shortener/v1/getting_started#shorten
				//for returned properties
				callback(shortUrl);
			},
			failure:  function(response, opts) {
				this.onFailure_(response.statusText);
			}
		});
		*/
	};

	/** 
	 * Function: failure
	 * set a callback method for failure
	 *
	 * Parameters:
	 * callback - {Function}
	 * Return:
	 * {Shortener}
	 */
	Shortener.prototype.failure = function( callback ){
		this.onFailure_ = callback;
		return this;
	};
	
}).call(this);