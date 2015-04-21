/*
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

/** api: (define)
 *  module = mxp.form
 *  class = UserGroupComboBox
 *  
 */
Ext.ns('mxp.form');

/**
 * Class: UserGroupComboBox
 * User group simple combobox
 * 
 * Inherits from:
 *  - <Ext.form.ComboBox>
 *
 */
mxp.form.UserGroupComboBox = Ext.extend(Ext.form.ComboBox, {

 	/** xtype = msm_usergroupcombobox **/
    xtype: "msm_usergroupcombobox",

    // i18n
    fieldLabel: "User group",

    // base config
    typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    valueField: 'id',
    displayField: 'name',

    // specifig config
    url: null,
    auth: null,

    // select  by default by name
    defaultSelection: null,

    // by default the combo include all groups in the system (include everyone group)
    showAll: true,

    initComponent: function(){

        // headers
        var defaultHeaders = {'Accept': 'application/json'};
    	if(this.auth){
    		defaultHeaders['Authorization'] = this.auth;
    	}

    	// add all
    	var url = this.url;
    	if(url && this.showAll){
    		if(url.indexOf("?")<0){
    			url += "?all=true";
    		}else{
    			url += "&all=true";
    		}
    	}

    	// If user is admin, load the groups from geostore url, otherwise load from user context
        var role,groups;
        if(sessionStorage && sessionStorage["userDetails"]){
            var userDetails = sessionStorage["userDetails"];
            userDetails = Ext.decode(userDetails);
            role = userDetails.user.role;
            groups = userDetails.user.groups.group;
        }else{
            role = this.target && this.target.user && this.target.user.role == "ADMIN";
        }
        var userIsAdmin = (role =="ADMIN");
    	// store 
    	this.store = {
			xtype: "jsonstore",
	        fields: [
	            {name:'id', mapping:'id'},
	            {name:'name', mapping:'groupName'}
	        ],
	        listeners:{
	        	load: function(store){
	        		this.fireEvent("storeload", store, this);
	        		this.loadDefault(store);
	        	},
	        	scope: this
	        }
    	};

    	if(userIsAdmin){
    		// load from geostore
    		Ext.apply(this.store,{
				xtype: "jsonstore",
		        idProperty: 'id',
	        	root: 'UserGroupList.UserGroup',
	        	autoLoad: true,
    			proxy: new Ext.data.HttpProxy({
		            url: url,
		            restful: true,
		            method : 'GET',
		            disableCaching: true,
		            failure: function (response) {
		                Ext.Msg.show({
		                   title: "Error",
		                   msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
		                   buttons: Ext.Msg.OK,
		                   icon: Ext.MessageBox.ERROR
		                });
		            },
		            headers: defaultHeaders
		        })
    		});
    	}else{
    		// load user groups from user logged details
    		this.autoLoad = true;
    		this.mode = 'local';
    		var data = [];
            //if not alredy loaded from the session storage
            if (!groups  && this.target){
                    if(this.target.user.groups.group && this.target.user.groups.group.length){
                    // it have more than one group
                    data = this.target.user.groups.group;
                }else if(this.target.user.groups.group){
                    // only one group
                    data.push(this.target.user.groups.group);
                }
            }else if(groups){
                if(groups instanceof Array){
                    data = groups;
                }else{
                    data = [groups] ;
                }
                
            }
    		
    		Ext.apply(this.store,{
    			mode: "local",
    			data: data
    		});
    	}
		
        mxp.form.UserGroupComboBox.superclass.initComponent.call(this, arguments);
	},

	/**
	 * private:[loadDefault]
	 * 
	 * Select `this.defaultSelection` if it's configurated
	 **/
	loadDefault: function(store){
		if(this.defaultSelection){
			store.each(function(record){
				if(this.defaultSelection == record.get("name") || this.defaultSelection == record.get("groupName")){
					this.setValue(record.get("id"));
				}
			}, this);	
		}
	}
});

/** api: xtype = msm_usergroupcombobox */
Ext.reg(mxp.form.UserGroupComboBox.prototype.xtype, mxp.form.UserGroupComboBox);