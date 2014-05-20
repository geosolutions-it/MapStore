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
 *  module = mxp.plugins
 *  class = Tool
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: CategoriesInitializer(config)
 *
 *    Plugin to initialize the categories
 */
mxp.plugins.CategoriesInitializer = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_categoryinitializer */
    ptype: "mxp_categoryinitializer",

    /** i18n **/
    geostoreInitializationTitleText: "Initializing Fail",
    geostoreInitializationText: "Geostore response is not the expected",
    notInitializedCategories: "Missing categories: '{0}'. Do you want to create it?",
    /** EoF i18n **/

    /** api: config[silentErrors] 
     *  ``Boolean`` Flag to hide error window.
     */
    silentErrors: false,

    /** api: config[adminAuthorization] 
     *  ``String`` Authorization header to use. You can put the header or use the ``adminCredentials``
     */
    adminAuthorization: null,

    /** api: config[adminCredentials] 
     *  ``Object`` GeoStore administrator user name and password
     */
    adminCredentials: {
        user: "admin",
        pass: "admin"
    },

    /** api: config[neededCategories] 
     *  ``Array`` Name of categories to be initialized in an array
     */
    neededCategories: ["TEMPLATE", "MAP"],

    /** api: config[confirmCategoryCreation] 
     *  ``Boolean`` Ask the user to create `this.neededCategories` if not present
     */
    confirmCategoryCreation: true,

    /** private: method[init]
     */
    init: function(target){
        mxp.plugins.CategoriesInitializer.superclass.init.apply(this, arguments); 

        // prepare credentials and categories
        if(!this.adminAuthorization && this.adminCredentials){
            this.adminAuthorization = 'Basic ' + Base64.encode(this.adminCredentials.user+':'+this.adminCredentials.pass);
        }
        var auth = this.adminAuthorization ? this.adminAuthorization : this.target.auth;
        var me = this;
        this.categories = new GeoStore.Categories({
            authorization: auth,
            url: this.target.initialConfig.geoStoreBase + "categories"
            }).failure( function(response){
                if(!me.silentErrors){  
                    // not found!!
                    Ext.Msg.show({
                       title: me.geostoreInitializationTitleText,
                       msg: me.geostoreInitializationText + ": " + response.statusText + "(status " + response.status + "):  " + response.responseText,
                       buttons: Ext.Msg.OK,
                       icon: Ext.MessageBox.ERROR
                    });
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
        this.categories.find(function(categories){
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
            this.categories.create({
                name: categoryNames[i]
            }, function(responseText){
                // creation succeeded
            });
        }
    }
});

Ext.preg(mxp.plugins.CategoriesInitializer.prototype.ptype, mxp.plugins.CategoriesInitializer);