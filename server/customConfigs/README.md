# Custom configs for geostore

We need some custom configurations for different user groups. Here I documented the custom configurations for each user role.

## Categories

First, you need the `MAPSTORECONFIG`. To initialize the category:

curl -u admin:admin -XPOST -H 'Content-type: text/xml' -d  <Category><name>MAPSTORECONFIG</name></Category> http://localhost:9191/geostore/rest/categories


## VA-CSP

Related to VA-CSP role users. Add it with:

curl -u admin:admin -XPOST -H 'Content-type: text/xml' -d '<Resource><Attributes><attribute><name>owner</name><type>STRING</type><value>admin</value></attribute></Attributes><description>VA-CSP custom configuration</description><metadata></metadata><name>VA-SPConfigMapStore</name><category><name>MAPSTORECONFIG</name></category><store><data><![CDATA[{"customTools":[{"ptype":"gxp_planeditor","outputTarget":"west","source":"MARISS-Layers","downloadUploadedSHP":false,"auxiliaryLayerName":"Draft Layer","displayAuxiliaryLayerInLayerSwitcher":false,"layoutConfig":{"xtype":"form","buttonAlign":"right","autoScroll":true,"frame":true} },{"ptype":"gxp_importexport","id":"gxp_importexport","service":"http://mariss.geo-solutions.it/opensdi2-manager/","types":["kml/kmz"],"exportConf":{"kml/kmz":{"layerName":"Draft Layer","alternativeStyle":false,"dontAskForLayerName":true},"geojson":{"panelConfig":{"fieldEmptyText":"Browse for GeoJSON files...","validFileExtensions": [".json", ".geojson"],"deafultLayerName": "Draft Layer","dontAskForLayerName": true}},"shp":{"panelConfig":{"fieldEmptyText":"Browse for SHP files...","validFileExtensions": [".shp"],"deafultLayerName":"Draft Layer","dontAskForLayerName": true}}}}]}]]></data></store></Resource>' http://localhost:9191/geostore/rest/resources

It includes  this custom configuration for this role: 

```
{
    "customTools": [{
            "ptype": "gxp_planeditor",
            "outputTarget": "west",
            "source": "MARISS-Layers",
            "downloadUploadedSHP": false,
            "auxiliaryLayerName": "Draft Layer",
            "displayAuxiliaryLayerInLayerSwitcher": false,
            "layoutConfig":{
                "xtype": "form",
                "buttonAlign": "right",
                "autoScroll":true,
                "frame":true
            }
       }, {
	     "ptype": "gxp_importexport",
	     "id": "gxp_importexport",
	     "service": "http://mariss.geo-solutions.it/opensdi2-manager/",
	     "types": ["kml/kmz"],
	     "exportConf":{
	        "kml/kmz": {
	            "layerName": "Draft Layer",
	            "alternativeStyle": false,
	            "dontAskForLayerName": true
	        }, 
            "shp": {
                "panelConfig":{
                    "fieldEmptyText": "Browse for SHP files...",
                    "validFileExtensions": [".shp"],
                    "deafultLayerName": "Draft Layer",
                    "dontAskForLayerName": true
                }
            }       
	     }
	 }
    ]
}
```

And the security rule (you must replace the it with the saved one):

curl -u admin:admin -XPOST -H 'Content-type: text/xml' -d '<SecurityRuleList><SecurityRule><canRead>true</canRead><canWrite>false</canWrite><group><name>VA-CSP</name></group></SecurityRule>' http://localhost:9191/geostore/rest/resources/{id}

Then check the resources available for one user in the group:

curl -u CSP:CSP -XGET -H 'Content-type: text/xml' http://localhost:9191/geostore/rest/resources

Or insert in db: `insert into gs_security values({idResourceSec}, true, true, {va-sp-id}, {idResource}, null);`