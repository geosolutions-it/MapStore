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


/*WPS Manager Example

In order to instance the WPSManger plugins you must provide the following information:

    - WPS URL
    - Proxy URL used for the WPS requests
    - Geostore URL used to save the WPS execute instances
    - Proxy URL used for the Geostore requests

The WPS requests are sent to the process JTS:isValid that comes with the GeoServer WPS plugin.
*/

var requestObject,wpsManager;
onReady=(function() {
    var el;
    
    var wpsURL= prompt("WPS URL: ", "http://localhost:8080/geoserver/ows");
    el=document.getElementById("wpsurl");
    el.appendChild(document.createTextNode(wpsURL));
    
    var wpsProxy= prompt("WPS Proxy URL: ", "/proxy?url=");
    el=document.getElementById("wpsproxy");
    el.appendChild(document.createTextNode(wpsProxy));
    
    var geostoreURL= prompt("GeoStore URL: ", "http://localhost:8080/geostore/rest");
    el=document.getElementById("geostoreurl");
    el.appendChild(document.createTextNode(geostoreURL));
    
    var geostoreProxy= prompt("GeoStore Proxy URL: ", "/proxy?url=");
    el=document.getElementById("geostoreproxy");
    el.appendChild(document.createTextNode(geostoreProxy));
    
    wpsManager = new gxp.plugins.WPSManager({
        //id: "wpsTest",
        id: "DownloadPanelWPSManager",
        url: wpsURL,
        proxy: wpsProxy,
        geoStoreClient: new gxp.plugins.GeoStoreClient({
            url: geostoreURL,
            user: "admin",
            password: "admin",
            proxy: geostoreProxy,
            listeners: {
                "geostorefailure": function(tool, msg){
                    Ext.Msg.show({
                        title: "Geostore Exception" ,
                        msg: msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        })
    });
    
   
    getInstances(false);

});

function executeCallback(instanceOrRawData){
    Ext.Msg.show({
 		title: "Execute Response" ,
 		msg: JSON.stringify(instanceOrRawData),
 		buttons: Ext.Msg.OK,
 		icon: Ext.Msg.INFO
    });
    setTimeout("getInstances(false)", 1000);
}

function getSyncRequest(){

    var type= null, crop= "false";
    
    if(document.getElementById("rawMod").value == "true")
        type="raw";
    
    if(document.getElementById("cropMod").value == "true")
        crop="true";
        
    return {
        
        type: type,
        inputs:{
            layerName : new OpenLayers.WPSProcess.LiteralData({value:"roads"}),
            outputFormat:new OpenLayers.WPSProcess.LiteralData({value:"application/gml-3.1.1"}),
            targetCRS:new OpenLayers.WPSProcess.LiteralData({value:"EPSG:26713"}),
            ROI: new OpenLayers.WPSProcess.ComplexData({
                value: document.getElementById("geometry").value,
                mimeType: "application/wkt"
            }),
            cropToROI: new OpenLayers.WPSProcess.LiteralData({value:crop})
        },
        outputs: [{
            identifier: "result",
            mimeType: "application/zip"
       
        }]
    };

}



function getAsyncRequest(){

    var crop= "false";
        
    if(document.getElementById("cropMod").value == "true")
        crop="true";
        
    return {
        
        storeExecuteResponse: true,
        lineage:  true,
        status: true,
        inputs:{
            layerName : new OpenLayers.WPSProcess.LiteralData({value:"roads"}),
            outputFormat:new OpenLayers.WPSProcess.LiteralData({value:"application/gml-3.1.1"}),
            targetCRS:new OpenLayers.WPSProcess.LiteralData({value:"EPSG:26713"}),
            ROI: new OpenLayers.WPSProcess.ComplexData({
                value: document.getElementById("geometry").value,
                mimeType: "application/wkt"
            }),
            cropToROI: new OpenLayers.WPSProcess.LiteralData({value:crop})
        },
        outputs: [{
            identifier: "result",
            mimeType: "application/zip"
        }]
    };
}


function getInstances(update){
    
    wpsManager.getExecuteInstances("gs:Download", update, function(instances){
        var tpl = new Ext.XTemplate(
            '<table class="gridtable">',
            '<tr><th>Name</th>',
            '<th>Description</th>',
            '<th></th><th></th>',
            '<tpl for=".">',
            '<tr><td>{name}</td>',		  
            '<td>{description}</td>',
            '<td><button onclick=\"getInstance(\'{id}\')\"> Get Instance </button></td>',
            '<td><button onclick=\"removeInstance(\'{id}\')\"> Delete </button></td></tr>',
            '</tpl>',
            '</table>'
            );
               
        tpl.overwrite(Ext.get("instances"), instances);
    });
    
     
}


function removeInstance(instanceID){
    wpsManager.deleteExecuteInstance(instanceID, function(instances){
        Ext.Msg.show({
 		title: "Remove Instance",
 		msg: "Instance " + instanceID+ " removed.",
 		buttons: Ext.Msg.OK,
 		icon: Ext.Msg.INFO
 	 });
        setTimeout("getInstances(false)", 1000);
    });
}


function getInstance(instanceID){
    
    wpsManager.getExecuteInstance(instanceID, false, function(instance){
       
        var tpl = new Ext.XTemplate(
            '<table class="gridtable">',
            '<tr><th>ID</th>',
            '<td>{id}</td></tr>',
            '<tr><th>Name</th>',
            '<td>{name}</td></tr>',
            '<tr><th>Creation</th>',
            '<td>{creation}</td></tr>',
            '<tr><th>Description</th>',		  
            '<td>{description}</td></tr>',
            '<tr><th>Category</th>',		  
            '<td>{category}</td></tr>',
            '<tr><th>Metadata</th>',		  
            '<td>{metadata}</td></tr>',
            '<tr><th>Attributes</th>',		  
            '<td>{attributes}</td></tr>',
            '<tr><th>Data</th>',		  
            '<td>{store}</td></tr>',
            '</table>'
            );
      
         instance.Resource.store= JSON.stringify(instance.Resource.data);
         instance.Resource.category= JSON.stringify(instance.Resource.category);
     
      
         Ext.Msg.show({
 		title: "Instance " + instance.Resource.id ,
 		msg: tpl.applyTemplate(instance.Resource),
 		buttons: Ext.Msg.OK,
 		icon: Ext.Msg.INFO
 	 });
    
        
   });
}


