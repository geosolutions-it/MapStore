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

    alert("create WPS Manager");
    

    var wpsManager = new gxp.plugins.WPSManager({
        id: "wpsTestLocal",
        url: "http://localhost:8089/geoserver/ows",
        proxy: proxy,
        geoStore: new gxp.plugins.GeoStoreClient({
            url: "http://localhost:8080/geostore/rest",
            user: "admin",
            password: "admin",
            proxy: proxy,
            listeners: {
            "geostorefailure": function(tool, msg){
                alert(msg);
            }
        }
        })
    });
    
    
    var requestObject={
       /* storeExecuteResponse: false,
        lineage:  false,
        status: false,*/
        type: "raw",
        inputs:{
           /* geom: new OpenLayers.WPSProcess.ReferenceData({
                href: "http://localhost:8089/geoserver/wfs?request=GetFeature&version=1.1.0&typeName=topp:states&propertyName=STATE_NAME,PERSONS&BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326",
                mimeType: "text/xml; subtype=gml/3.1.1",
                method: "GET"
            }),*/
            geom: new OpenLayers.WPSProcess.ComplexData({
                value: "POINT(6 40)",
                mimeType: "text/xml; subtype=gml/3.1.1"
            }),
            distance: new OpenLayers.WPSProcess.LiteralData({
                value:1
            })
        },
        outputs: [{
            identifier: "result",
            mimeType: "text/xml"
            //asReference: true,
            //type: "raw"
        }]
    };
       
    var requestXMLString="<wps:Execute xmlns:wps=\"http://www.opengis.net/wps/1.0.0\" version=\"1.0.0\" service=\"WPS\" xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">JTS:buffer</ows:Identifier><wps:DataInputs><wps:Input><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">geom</ows:Identifier><ows:Title xmlns:ows=\"http://www.opengis.net/ows/1.1\">geom</ows:Title><wps:Data/><wps:Reference mimeType=\"text/xml; subtype=gml/3.1.1\" xlink:href=\"http://localhost:8089/geoserver/wfs?request=GetFeature&amp;version=1.1.0&amp;typeName=topp:states&amp;propertyName=STATE_NAME,PERSONS&amp;BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" method=\"GET\"/></wps:Input><wps:Input><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">distance</ows:Identifier><ows:Title xmlns:ows=\"http://www.opengis.net/ows/1.1\">distance</ows:Title><wps:Data><wps:LiteralData>1</wps:LiteralData></wps:Data></wps:Input></wps:DataInputs><wps:ResponseForm><wps:ResponseDocument storeExecuteResponse=\"false\" lineage=\"false\" status=\"false\"><wps:Output asReference=\"true\"><ows:Identifier xmlns:ows=\"http://www.opengis.net/ows/1.1\">result</ows:Identifier><ows:Title xmlns:ows=\"http://www.opengis.net/ows/1.1\"/><ows:Abstract xmlns:ows=\"http://www.opengis.net/ows/1.1\"/></wps:Output></wps:ResponseDocument></wps:ResponseForm></wps:Execute>";
     
       
       
       
    wpsManager.execute("JTS:buffer",requestObject);
    
    
    
    
    
    


    
/* wpsManager.getExecuteInstances("JTS:buffer", function (instancesArray) {
        alert("prima");
        for(var i=0; i<instancesArray.length; i++)
            alert(JSON.stringify(instancesArray[i]));
        
       
    });*/
    
    
    
    
    
    
/*   wpsManager.getExecuteInstances("JTS:buffer", function (instancesArray) {
           alert("seconda");
            for(var i=0; i<instancesArray.length; i++)
                alert(JSON.stringify(instancesArray[i]));
        });*/
 
    
    
  
    
    
    
});
