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
 *  module = gxp.plugins
 *  class = Tool
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: CategoriesInitializer(config)
 *
 *    Plugin to initialize the categories. It uses a geostore client internal
 */
gxp.plugins.CategoriesInitializer = Ext.extend(gxp.plugins.Tool,{
    
    /** api: ptype = gxp_categoryinitializer */
    ptype: "gxp_categoryinitializer",

    /** i18n **/
    geostoreInitializationTitleText: "Initializing Fail",
    geostoreInitializationText: "Geostore response is not the expected",
    notInitializedCategories: "Missing categories: '{0}'. Do you want to create it?",
    /** EoF i18n **/

    /** api: config[silentErrors] 
     *  ``Boolean`` Flag to hide error window.
     */
    silentErrors: false,

    /** api: config[geostoreUser] 
     *  ``String`` GeoStore administrator user name
     */
    geostoreUser: "admin",

    /** api: config[geostorePassword] 
     *  ``String`` GeoStore administrator user password
     */
    geostorePassword: "admin",

    /** api: config[neededCategories] 
     *  ``Array`` Name of categories to be initialized in an array
     */
    neededCategories: ["TEMPLATE", "MAP", "MAPSTORECONFIG"],

    /** api: config[confirmCategoryCreation] 
     *  ``Boolean`` Ask the user to create `this.neededCategories` if not present
     */
    confirmCategoryCreation: true,

    /** private: method[init]
     */
    init: function(target){
        gxp.plugins.CategoriesInitializer.superclass.init.apply(this, arguments); 

        // // initialize geostore client
        var me = this;
        this.geoStoreClient = new gxp.plugins.GeoStoreClient({
            url: (this.geostoreUrl) ? this.geostoreUrl : this.target.geoStoreBaseURL,
            user: (this.geostoreUser) ? this.geostoreUser : this.target.geostoreUser,
            password: (this.geostorePassword) ? this.geostorePassword : this.target.geostorePassword,
            proxy: (this.geostoreProxy) ? this.geostoreProxy:this.target.proxy,
            listeners: {
                "geostorefailure": function(tool, msg){
                    if(!me.silentErrors){  
                        // not found!!
                        Ext.Msg.show({
                           title: me.geostoreInitializationTitleText,
                           msg: me.geostoreInitializationText + ": " + msg,
                           buttons: Ext.Msg.OK,
                           icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            }
        }); 

        // check categories
        this.checkAndCreateCategories(this.neededCategories);
    },

    /** api: method[checkAndCreateCategories]
     *  Check if the category names are present and create it if not found
     */
    checkAndCreateCategories: function(categoryNames){

        var me = this;
        this.geoStoreClient.getEntities({type: "category"}, function(categories){
            for(var i = 0; i < categories.length; i++){
                var found = false;
                for(var j = 0; j < categoryNames.length; j++){
                    if(categories[i].name == categoryNames[j]){
                        found = true;
                        break;
                    }
                }
                if(found){
                    categoryNames.remove(categories[i].name);
                }
            }
            me.createCategories(categoryNames);
        });

    },

    /** api: method[createCategories]
     *  Create categories with the names in this.categoryNames if the confirm is not enabled or if the user confirm the creation
     */
    createCategories: function(categoryNames){
        if(categoryNames.length > 0){

            if(!this.confirmCategoryCreation){
                this.createCategoriesConfirmed(categoryNames);
            }else{
                var me = this;
                var notInitializedCategories = String.format(this.notInitializedCategories, categoryNames);
                Ext.MessageBox.confirm(
                   this.geostoreInitializationTitleText,
                   notInitializedCategories,
                   function(response){
                        if(response == "yes"){
                            me.createCategoriesConfirmed(categoryNames);
                        }
                   }
                );    
            }   
        }
    },

    /** api: method[createCategoriesConfirmed]
     *  Create categories with the names in this.categoryNames without checks
     */
    createCategoriesConfirmed: function(categoryNames){
        for(var i = 0; i < categoryNames.length; i++){
            var category = new OpenLayers.GeoStore.Category({
                name: categoryNames[i]
            });
            this.geoStoreClient.createEntity(category, function(responseText){
                // creation succeeded
            });
        }
    }
});

Ext.preg(gxp.plugins.CategoriesInitializer.prototype.ptype, gxp.plugins.CategoriesInitializer);