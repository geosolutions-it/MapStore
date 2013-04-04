/**
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

/*GeoStore Client Example

In order to instance the GeoStore Client plugin you must provide the following information:

    - Geostore URL
    - Proxy URL used for the Geostore requests
*/
var geoStore;

onReady=(function() {

    var geoStoreURL= prompt("Geostore URL: ", "http://localhost:8080/geostore/rest");

    var el=document.getElementById("geourl");
    el.appendChild(document.createTextNode(geoStoreURL));
    
    var geostoreProxy= prompt("GeoStore Proxy URL: ", "/http_proxy/proxy?url=");
    el=document.getElementById("geoproxy");
    el.appendChild(document.createTextNode(geostoreProxy));
    
    geoStore = new gxp.plugins.GeoStoreClient({
            url: geoStoreURL,
            user: "admin",
            password: "admin",
            proxy: geostoreProxy,
            listeners: {
                "geostorefailure": function(tool, msg){
                    Ext.Msg.alert.show({
                        title: "Geostore Exception" ,
                        msg: msg,
                        buttons: Ext.Msg.alert.OK,
                        icon: Ext.Msg.alert.ERROR
                    });
                }
            }
    });
    getCategories();
    getUsers();
    getResources();
});



function testGeostore(){
    
    var category= new OpenLayers.GeoStore.Category({
        name: prompt("New Category Name: " )
    });
 
    
     var success= function(exists){
        var resource=new OpenLayers.GeoStore.Resource({
                    name: prompt("New Resource Name: " ),
                    metadata: "new resource description",
                    description: JSON.stringify({
                        status: "status", 
                        statusLocation: "statusLocation"
                    }),
                    category: category.name,
                    store: JSON.stringify({
                        jsonResource: "testJson", 
                        itmesResource: ["item1", "item2", "item3"]
                        })
     });
                
        if(exists){
            Ext.Msg.alert("info", "Category Already defined");
               
            geoStore.getLikeName(resource, function(res){
                if(res.length > 0 ){
                    resource.id=res[0].id;
                    resource.description= prompt("New Description: " );
                    geoStore.updateEntity(resource, function(response){
                      
                      
                    geoStore.getCategoryResources(category.name, function(response){
                      
                    });
                });
                }else{
                   geoStore.createEntity(resource, function(resourceID){
                    Ext.Msg.alert("info","New Resource ID: " + resourceID);
                    getResources();  
                    geoStore.getCategoryResources(category.name, function(response){
                      
                       
                    });
                }); 
                    
                }
                
                
                
            });   
        }else
        {
            geoStore.createEntity(category, function(categoryID){
                Ext.Msg.alert("info","New Category ID: " + categoryID);
                getCategories();
                  
                geoStore.createEntity(resource, function(resourceID){
                    Ext.Msg.alert("info","New Resource ID: " + resourceID);
                    getResources();  
                    geoStore.getCategoryResources(category.name, function(response){
                       
                    });
                });     
            });  
        }
      
    };
    
    var failure= function(){
        Ext.Msg.alert("info","failure");
    };


    geoStore.existsEntity(category, success, failure);
}    


function getCategories(){
    geoStore.getEntities({type:"category"}, function(categories){
   
        var tpl = new Ext.XTemplate(
            '<table class="gridtable">',
            '<tr><th>ID</th>',
            '<th>Name</th></tr>',
       
            '<tpl for=".">',
            '<tr><td>{id}</td>',		  
            '<td>{name}</td></tr>',
          
            '</tpl>',
            '</table>'
            );
               
            tpl.overwrite(Ext.get("categories"), categories);
        });
 
}


function getUsers(){
    geoStore.getEntities({type:"user"}, function(categories){
    
        var tpl = new Ext.XTemplate(
            '<table class="gridtable">',
            '<tr><th>ID</th>',
            '<th>Name</th>',
            '<th>Role</th></tr>',
            '<tpl for=".">',
            '<tr><td>{id}</td>',		  
            '<td>{name}</td>',
            '<td>{role}</td></tr>',
           
            '</tpl>',
            '</table>'
            );
               
            tpl.overwrite(Ext.get("users"), categories);
        });
 
}


function getResources(){
    geoStore.getEntities({type:"resource"}, function(categories){
    
        var tpl = new Ext.XTemplate(
            '<table class="gridtable">',
            '<tr><th>ID</th>',
            '<th>Name</th>',
            '<th>Creation</th>',
            '<th>Can Delete</th>',
            '<th>Can Edit</th>',
            '<th>Description</th></tr>',
            '<tpl for=".">',
            '<tr><td>{id}</td>',		  
            '<td>{name}</td>',
            '<td>{creation}</td>',
            '<td>{canDelete}</td>',
            '<td>{canEdit}</td>',
            '<td>{description}</td></tr>',
           
            '</tpl>',
            '</table>'
            );
               
            tpl.overwrite(Ext.get("resources"), categories);
        });
 
}



function resourcesMsg(category, resources){
    
    var tpl = new Ext.XTemplate(
            '<table class="gridtable">',
            '<tr><th>ID</th>',
            '<th>Name</th>',
            '<th>Creation</th>',
            '<th>Can Delete</th>',
            '<th>Can Edit</th>',
            '<th>Description</th></tr>',
            '<tpl for=".">',
            '<tr><td>{id}</td>',		  
            '<td>{name}</td>',
            '<td>{creation}</td>',
            '<td>{canDelete}</td>',
            '<td>{canEdit}</td>',
            '<td>{description}</td></tr>',
           
            '</tpl>',
            '</table>'
            );
                
    Ext.Msg.show({
 		title: "Category '" + category + "' resources",
 		msg: tpl.applyTemplate(resources),
 		buttons: Ext.Msg.OK,
 		icon: Ext.Msg.INFO
    });            
    
}


