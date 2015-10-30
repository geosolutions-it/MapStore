{
    "actionToolScale": "large",
	"disableLayerChooser":true,
	"hideTopToolbar": true,
	"hideBottomToolbar": true,
    "portalConfig":{
		"header":false
	},
   "gsSources":{ 
		"bolzano": {
			"ptype": "gxp_wmssource",
			"url": "http://sit.comune.bolzano.it/geoserver/ows",
			"title": "Bolzano GeoServer",
			"SRS": "EPSG:900913",
			"version":"1.1.1",
			"layersCachedExtent": [
				-20037508.34,-20037508.34,
				20037508.34,20037508.34
			],
			"layerBaseParams":{
				"FORMAT": "image/png8",
				"TILED": true
			},
            "authParam":"authkey"
		}             
    },
	"map": {
		"projection": "EPSG:900913",
		"units": "m",
		"zoom": 5,
		"numZoomLevels": 22,
		"extent": [
				1259091.229051,5855016.830973,
				1268808.28627,5863434.458712
		],
		"layers": [                                                
			{
				"source": "bolzano",
				"title": "Ortofoto 2013 Bolzano/Bozen",
				"name": "Cartografia:ortofoto2013",
				"layersCachedExtent": [
					1252344.2712499984,5850795.892246094,1271912.1504882798,5870363.771484375
				],
				"group": "background",
				"transparent": false,
				"format": "image/jpeg"
			},{
                "source": "bolzano",
				"title": "mense_scuole",
				"name": "Ambiente:mense_scuole"
            }
		]
	},
	
    "customPanels":[
		
    ],
	
	"customTools":[
		{
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": false,
			"id": "addlayer"
		}, {
			"ptype": "gxp_languageselector",
			"actionTarget": {"target": "panelbbar", "index": 3}
		}, {
			"ptype": "gxp_wmsgetfeatureinfo_menu", 
			"regex": "[\\s\\S]*[\\w]+[\\s\\S]*",
			"useTabPanel": true,
			"toggleGroup": "toolGroup",
			"queryLayer": "Ambiente:mense_scuole",
			"defaultActive": "info-hover",
			"delay": 1000,
			"vendorParams": {
				"buffer": 20
			},
			"actionTarget": {"target": "paneltbar", "index": 20}
		}, {
			"ptype": "gxp_help",
			"mode": "window",
			"showOnStartup": true,
			"windowHeight": 400,
			"windowWidth": 500,
			"showAgainTool": true,
			"description": "<h2>Guida d'uso</h2><ul><li>Mantieni il cursore del mouse sul servizio per mostrare le relative informazioni</li><li>Usa i controlli di mappa per cambiare la scala di visualizzazione o la regione visualizzata</li><li>Utilizza il pannello di ricerca per conoscere i servizi disponibile</li></ul>",
			"actionTarget": {"target": "paneltbar", "index": 21}
		}
	]
	
}