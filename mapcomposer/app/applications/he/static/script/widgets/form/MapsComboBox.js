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
 * @author Andrea Cappugi (kappu72@gmail.com)
 */

/** api: (define)
 *  module = gxp.form
 *  class = MapsComboBox
 *
 */
Ext.ns('gxp.form');

/**
 * Class: MapsComboBox
 * User maps simple combobox
 *
 * Inherits from:
 *  - <Ext.form.ComboBox>
 *
 */
gxp.form.MapsComboBox = Ext.extend(Ext.form.ComboBox, {

 	/** xtype = gxp_mapscombobox **/
    xtype: "gxp_mapscombobox",

    // i18n
    fieldLabel: "User maps",
    emptyText:"Maps",
    valueNotFoundText: "Maps",

    // base config
    width: 120,
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
    editable: false,
    allowBlank: false,
    geoStoreBase:null,

    initComponent: function(){
        this.addEvents('defaultLoaded');
        var role,groups;
        if(sessionStorage && sessionStorage["userDetails"]){
            var userDetails = sessionStorage["userDetails"];
            userDetails = Ext.decode(userDetails);
            var role = userDetails.user.role;
            var groups = userDetails.user.groups.group;
            var auth = userDetails.token;
        }
         if(typeof(manager) !== 'undefined') {
            this.geoStoreBase = manager.geoStoreBase;
            this.manager = true;
         }

        	// storeload
        	this.store = {
			xtype: "jsonstore",
			idProperty: 'id',
	        root: 'results',
	        autoLoad: true,
	        fields: this.fields || [
	            {name:'id', mapping:'id'},
	            {name:'name', mapping:'name'},
                {name:'owner', mapping:'owner'}
	        ],
            sortInfo: this.sort || {
                field: 'owner',
                direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
            },
	        listeners:{
	        	load: function(store){
	        		this.fireEvent("storeload", store, this);
	        		this.loadDefault(store);
	        	},
	        	scope: this
	        },
	        proxy: new Ext.data.HttpProxy({
                    url: this.geoStoreBase + 'extjs/search/category/MAP/?includeAttributes=true',
                    restful: true,
                    method : 'GET',
                    disableCaching: false,
                    headers:{
                        'Accept': 'application/json',
                        'Authorization' : auth
                    },
                    failure: function (response) {
                        Ext.Msg.show({
                           title: "Error Loadin Users Maps",
                           msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
                           buttons: Ext.Msg.OK,
                           icon: Ext.MessageBox.ERROR
                        });
                    }
                })
		 };
        gxp.form.MapsComboBox.superclass.initComponent.call(this, arguments);
	},

	/**
	 * private:[loadDefault]
	 *
	 * Select `this.defaultSelection` if it's configurated
	 **/
	loadDefault: function(store){
		if(this.manager && !this.defaultSelection){
			this.defaultSelection=this.value;
		}
		if(this.defaultSelection){
			store.each(function(record){
				if(this.defaultSelection == record.get( "id")){
					this.setValue(record.get("id"));
                    this.fireEvent("defaultLoaded", record);
				}
			}, this);
		}
	}
});

/** api: xtype = gxp_mapscombobox */
Ext.reg(gxp.form.MapsComboBox.prototype.xtype, gxp.form.MapsComboBox);
//# sourceURL=MapsComboBox.js