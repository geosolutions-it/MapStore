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


// make the references to the map panel and the popup 
// global, this is useful for looking at their states
// from the console

onReady=(function() {

    alert("Proxy:" + proxy);
    var geoStore = new gxp.plugins.GeoStoreClient({
        url: "http://localhost:8080/geostore/rest",
        user: "admin",
        password: "admin",
        proxy: proxy 
    });
    
    
    
    
    var category= {
        type: "category",
        name: prompt("New Category Name: " )
    };
 
    
    var success= function(exists){
        var resource={
                    type: "resource",
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
        };
                
        if(exists){
            alert("category Already defined");
               
            geoStore.getEntity(resource, function(res){
                if(res != null){
                    resource.id=res.id;
                    resource.description= prompt("New Description: " );
                    geoStore.updateEntity(resource, function(response){
                      alert("UPDATE RESPONSE: " + response.responseText);
                      
                    geoStore.getCategoryResources(category.name, function(response){
                        
                    }, function(){
                        alert("Create resource failure");
                    });
                }, function(){
                    alert("Create resource failure");
                });
                }else{
                   geoStore.createResource(resource, function(resourceID){
                    alert("New Resource ID: " + resourceID);
                      
                    geoStore.getCategoryResources(category.name, function(response){
                        var jsonResponse= JSON.parse(response.responseText);
                        var resources= jsonResponse.ResourceList.Resource;
                       
                    }, function(){
                        alert("Create resource failure");
                    });
                }, function(){
                    alert("Create resource failure");
                }); 
                    
                }
                
                
                
            }, function(){
                    alert("Error");
                });   
        }else
        {
            geoStore.createCatagory(category, function(categoryID){
                alert("New Category ID: " + categoryID);
                
                  
                geoStore.createResource(resource, function(resourceID){
                    alert("New Resource ID: " + resourceID);
                      
                    geoStore.getCategoryResources(category.name, function(response){
                        alert(response.responseText);
                    }, function(){
                        alert("Create resource failure");
                    });
                }, function(){
                    alert("Create resource failure");
                });     
            }, function(){
                alert("Create Category failure");
            });  
        }
      
    };
    
    /*var success= function(categoryID){
      alert("New Category ID: " + categoryID);
    };*/
    
    var failure= function(){
        alert("failure");
    };


    geoStore.existsEntity(category, success, failure);
    
    
    
});
