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




var requestObject,wpsManager;
onReady=(function() {
    
    wpsManager = new gxp.plugins.WPSManager({
        id: "wpsTest3",
        url: "http://hrt-11.pisa.intecs.it/geoserver/ows",
        proxy: "/http_proxy/proxy?url=",
        geoStoreClient: new gxp.plugins.GeoStoreClient({
            url: "http://localhost:8080/geostore/rest",
            user: "admin",
            password: "admin",
            proxy: "/http_proxy/proxy?url=",
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
// var requestXMLString="<wps:Execute xmlns:wps=\"http://www.opengis.net/wps/1.0.0\" version=\"1.0.0\" service=\"WPS\" xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">JTS:buffer</ows:Identifier><wps:DataInputs><wps:Input><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">geom</ows:Identifier><ows:Title xmlns:ows=\"http://www.opengis.net/ows/1.1\">geom</ows:Title><wps:Data/><wps:Reference mimeType=\"text/xml; subtype=gml/3.1.1\" xlink:href=\"http://localhost:8089/geoserver/wfs?request=GetFeature&amp;version=1.1.0&amp;typeName=topp:states&amp;propertyName=STATE_NAME,PERSONS&amp;BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" method=\"GET\"/></wps:Input><wps:Input><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">distance</ows:Identifier><ows:Title xmlns:ows=\"http://www.opengis.net/ows/1.1\">distance</ows:Title><wps:Data><wps:LiteralData>1</wps:LiteralData></wps:Data></wps:Input></wps:DataInputs><wps:ResponseForm><wps:ResponseDocument storeExecuteResponse=\"false\" lineage=\"false\" status=\"false\"><wps:Output asReference=\"true\"><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">result</ows:Identifier><ows:Title xmlns:ows=\"http://www.opengis.net/ows/1.1\"/><ows:Abstract xmlns:ows=\"http://www.opengis.net/ows/1.1\"/></wps:Output></wps:ResponseDocument></wps:ResponseForm></wps:Execute>";
     
       
       
       
//setTimeout("wpsManager.execute(\"JTS:isValid\", getAsyncRequest(), updateInstances)", 5000);
      
    
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

    return {
        /* storeExecuteResponse: false,
        lineage:  false,
        status: false,*/
        type: "raw",
        inputs:{
            geom: new OpenLayers.WPSProcess.ComplexData({
                value: "POINT(6 40)",
                mimeType: "application/wkt"
            })
        },
        outputs: [{
            identifier: "result",
            mimeType: "text/xml"
        //asReference: true,
        //type: "raw"
        }]
    };

}



function getAsyncRequest(){

    return {
        storeExecuteResponse: true,
        lineage:  true,
        status: true,
        //type: "raw",
        inputs:{
            geom: new OpenLayers.WPSProcess.ComplexData({
                value: "POINT(6 40)",
                mimeType: "application/wkt"
            })
        },
        outputs: [{
            identifier: "result",
            mimeType: "text/xml"
        //asReference: true,
        //type: "raw"
        }]
    };

}


function getInstances(update){
    
    wpsManager.getExecuteInstances("JTS:isValid", update, function(instances){
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


