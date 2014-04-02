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
 * Class: MSMTemplateComboBox
 * Template simple combobox
 * 
 * Inherits from:
 *  - <Ext.form.ComboBox>
 *
 */
 MSMTemplateComboBox = Ext.extend(Ext.form.ComboBox, {

 	/** xtype = msm_templatecombobox **/
    xtype: "msm_templatecombobox",

    // i18n
    fieldLabel: "Template",

    // base config
    typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    valueField: 'id',
    displayField: 'name',

    // specifig config
    templatesCategoriesUrl: 'extjs/search/category/TEMPLATE',
    auth: null,

    initComponent: function(){
    	this.store = {
	        xtype: "jsonstore",
	        root: 'results',
	        autoLoad: true,
	        totalProperty: 'totalCount',
	        successProperty: 'success',
	        idProperty: 'id',
	        fields: [
	            'id',
	            'name'
	        ],
	        proxy: new Ext.data.HttpProxy({
	            url: this.templatesCategoriesUrl,
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
	            defaultHeaders: {'Accept': 'application/json', 'Authorization' : this.auth}
	        }),
	        listeners:{
	        	load: function(store){
	        		this.fireEvent("storeload", store, this);
	        	},
	        	scope: this
	        }
    	};
		
        MSMTemplateComboBox.superclass.initComponent.call(this, arguments);
	}
});

/** api: xtype = msm_templatecombobox */
Ext.reg(MSMTemplateComboBox.prototype.xtype, MSMTemplateComboBox);