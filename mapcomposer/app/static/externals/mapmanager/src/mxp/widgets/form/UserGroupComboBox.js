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

/**
 * Class: UserGroupComboBox
 * User group simple combobox
 * 
 * Inherits from:
 *  - <Ext.form.ComboBox>
 *
 */
 UserGroupComboBox = Ext.extend(Ext.form.ComboBox, {

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
    	if(this.showAll){
    		if(url.indexOf("?")<0){
    			url += "?all=true";
    		}else{
    			url += "&all=true";
    		}
    	}

    	this.store = {
	        xtype: "jsonstore",
	        root: 'UserGroupList.UserGroup',
	        autoLoad: true,
	        idProperty: 'id',
	        fields: [
	            {name:'id', mapping:'id'},
	            {name:'name', mapping:'groupName'}
	        ],
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
	            defaultHeaders: defaultHeaders
	        }),
	        listeners:{
	        	load: function(store){
	        		this.fireEvent("storeload", store, this);
	        		this.loadDefault(store);
	        	},
	        	scope: this
	        }
    	};
		
        UserGroupComboBox.superclass.initComponent.call(this, arguments);
	},

	/**
	 * private:[loadDefault]
	 * 
	 * Select `this.defaultSelection` if it's configurated
	 **/
	loadDefault: function(store){
		if(this.defaultSelection){
			store.each(function(record){
				if(this.defaultSelection == record.json.name){
					this.setValue(record.get("id"));
				}
			}, this);	
		}
	}
});

/** api: xtype = msm_usergroupcombobox */
Ext.reg(UserGroupComboBox.prototype.xtype, UserGroupComboBox);