{
   "geoStoreBase":"/geostore/rest/",
   "proxy":"../http_proxy/proxy/?url=",
   "defaultLanguage": "it",
   "gsSources":{ 
		"gsacque": {
			"ptype": "gxp_wmssource",
			"title": "Acque GeoServer",
			"url": "/geoserver/ows",
			"projection":"EPSG:3003",
			"layerBaseParams": {
					"TILED": true,
                   			 "FORMAT":"image/png8"
			}
		},
        "gsrt_ctr": {
			"ptype": "gxp_wmssource",
			"title": "Rete Toscana",
			"projection":"EPSG:3003",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsctr"
            
		},
		"gsrt_catasto": {
			"ptype": "gxp_wmssource",
			"title": "Rete Toscana Catasto",
			"projection":"EPSG:3003",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmscatasto&"
			       
            
		}
	},
    "proj4jsDefs":{
            "EPSG:3003":"+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +no_defs"

	},
	"map":{
		"projection": "EPSG:3003",
		"units": "m",
		"maxExtent": [
			1394190.6211433,4663756.8332024,1938603.8789558,4944849.9328118
		],
        "restrictedExtent":[
			1394190.6211433,4663756.8332024,1938603.8789558,4944849.9328118
		],
       
        "resolutions": [
			596.717002,
			397.8113347,
			265.2075565,
			176.8050376,
			117.8700251,
			78.58001673,
			52.38667782,
			34.92445188,
			23.28296792,
			15.52197861,
			10.34798574,
			6.898657161,
			4.599104774,
			3.066069849,
			2.044046566,
			1.362697711,
			0.908465141,
			0.605643427,
			0.403762285,
			0.269174856,
			0.179449904,
			0.11963327,
			0.079755513,
			0.053170342,
			0.035446895,
			0.023631263,
			0.015754175,
			0.007877088],
       
       
		"layers": [
			{
				"source": "gsacque",
				"title": "Comuni",
				"name": "postgis_sw:comuni2",
				"group": "background"
			},{
                "source": "gsrt_ctr",
				"title": "CTR 10K",
				"name": "rt_ctr.10k",
				"format":"image/jpeg",
				"group": "Geoscopio",				
                "tiled": false,
				"visibility": false
            },{
				"source": "gsrt_catasto",
				"title": "Fogli catastali",
				"name": "rt_cat.idcatbdfog.rt",
				"group": "Geoscopio",
				"tiled": false,
				"visibility": false
			},{
				"source": "gsrt_catasto",
				"title": "Particelle catastali",
				"name": "rt_cat.idcatpart.rt",
				"group": "Geoscopio",
				"visibility": false,
				"tiled": false
			},{
				"source": "gsacque",
				"title": "Ctr2k - Acque",
				"name": "SW:ctr2k",
				"group": "Ctr 2k",
				"styles":"raster2k_kmz"
			},{
				"source": "gsacque",
				"title": "QU_2k",
				"name": "SW:foglio_2k",
				"group": "Altro",
				"tiled": false,
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Lidar DTM",
				"name": "SW:lidar_acque",
				"group": "Lidar DTM",
				"tiled": false,
				"visibility": false
			},{
				"source": "gsacque",
				"title": "QU_10k",
				"name": "SW:foglio_10k",
				"group": "Altro",
				"tiled": false,
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Civici",
				"name": "postgis_sw:civici",
				"group": "Altro",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Prelievo analisi",
				"name": "postgis_sw:prelievo",
				"group": "Acquedotto",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Aree qualita",
				"name": "qualita:risorsa",
				"group": "Acquedotto",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Prese Enel",
				"name": "SW:enel",
				"group": "Altro",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Zone",
				"name": "postgis_sw:comuni",				
				"group": "Altro",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Localit&agrave; Istat 2001",
				"name": "postgis_sw:localita_2001_regtoscana",
				"group": "Altro",
				"tiled": false,
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Localit&agrave; Istat 2011",
				"name": "postgis_sw:loc_istat2011",
				"group": "Altro",
				"tiled": false,
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Comuni",
				"name": "postgis_sw:comuni_nomi",
				"group": "Altro",
				"tiled": false,
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Bacino Arno",
				"name": "postgis_sw:bacino_arno",
				"group": "Reticoli idrografici",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Bacino Serchio",
				"name": "postgis_sw:bacino_serchio",
				"group": "Reticoli idrografici",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Ret.reg.(fossi)",
				"name": "postgis_sw:reg_tos_canaletta",
				"group": "Reticoli idrografici",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Ret.reg.(2k)",
				"name": "postgis_sw:reg_tos2k",
				"group": "Reticoli idrografici",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Ret.reg.(10k)",
				"name": "postgis_sw:reg_tos_10k",
				"group": "Reticoli idrografici",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Interventi: riparazioni",
				"name": "SW:riparazioni",
				"group": "Acquedotto",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Condotte Eternit",
				"name": "postgis_sw:acq_con",
				"styles": "eternit_acque",
				"group": "Acquedotto",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Contatori",
				"name": "SW:contator",
				"group": "Contatori",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Manovre Acq",
				"name": "SW:manovra",
				"group": "Acquedotto",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Produttivi",
				"name": "SW:produtt",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Rete Sensibile",
				"name": "SW:fgn_rete_sensibile",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Rete a Dispersione",
				"name": "SW:Rete_ID",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "FG area rete",
				"name": "SW:fg",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Valvole Acq",
				"name": "SW:valvol",
				"group": "Acquedotto",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Da Depuratore (IT)",
				"name": "postgis_sw:pia",
				"group": "Punti Immissione in Ambiente",
				"styles": "pia_da_depuratore",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Da Bypass Depuratore(IB)",
				"name": "postgis_sw:pia",
				"group": "Punti Immissione in Ambiente",
				"styles": "pia_da_bypass_depuratore",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Da Sfioratore(IS)",
				"name": "postgis_sw:pia",
				"group": "Punti Immissione in Ambiente",
				"styles": "pia_da_scaricatore",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Da Sollevamento(IL)",
				"name": "postgis_sw:pia",
				"group": "Punti Immissione in Ambiente",
				"styles": "pia_da_sollevamento",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Diretto(ID) fino a 200AE",
				"name": "postgis_sw:pia",
				"group": "Punti Immissione in Ambiente",
				"styles": "id_ae_fino_a_200",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Diretto(ID) maggiore di 200AE",
				"name": "postgis_sw:pia",
				"group": "Punti Immissione in Ambiente",
				"styles": "id_ae_magg200",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Siti - Catene Sfioratori",
				"name": "postgis_sw:v_sito_cateneSF_con_infra",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Sfioratori",
				"name": "SW:sf",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Siti - Catene sollevamenti",
				"name": "postgis_sw:v_sito_cateneSL_con_infra",
				"group": "Impianti Fgn",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Sollevamenti",
				"name": "SW:sl",
				"group": "Impianti Fgn",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Depuratori - Sezioni",
				"name": "postgis_sw:v_de_sezioni",
				"group": "Impianti Fgn",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Depuratori",
				"name": "SW:de",
				"group": "Impianti Fgn",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Versi",
				"name": "SW:versi",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Rete fgn",
				"name": "postgis_sw:fgn_con",
				"group": "Fognatura",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Area di rispetto 200m",
				"name": "postgis_sw:v_captazioni_buffer",
				"group": "Captazioni",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Sorgenti",
				"name": "SW:so",
				"group": "Captazioni",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Pozzi",
				"name": "SW:po",
				"group": "Captazioni",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Prese Fiume",
				"name": "SW:fi",
				"group": "Captazioni",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Prese Lago",
				"name": "SW:la",
				"group": "Captazioni",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Siti Acq",
				"name": "postgis_sw:v_sito_acq_con_infra",
				"group": "Impianti Acq",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Potabilizzatori - Cloratori",
				"name": "SW:pt",
				"group": "Impianti Acq",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Pompaggi",
				"name": "SW:pg",
				"group": "Impianti Acq",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Depositi",
				"name": "SW:ac",
				"group": "Impianti Acq",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Rete Acq - Non Trattata",
				"name": "postgis_sw:v_acq_con_grezza",
				"group": "Acquedotto",
				"visibility": false
			},{
				"source": "gsacque",
				"title": "Rete Acq - Trattata",
				"name": "postgis_sw:v_acq_con_trattata",
				"group": "Acquedotto",
				"visibility": false
			}

		]
	},"customTools":[
	   	 {
        "geoCoderEmptyText":"Ricerca strate e Indirizzi...",

        "ptype": "gxp_geolocationmenu",
        "outputTarget": "paneltbar",
        "menuTooltip":"Strumenti di Localizzazione",
        "geolocate": {
            "geolocateMenuText": "Localizzami",
            "trackMenuText": "Localizzami",
            "geolocateTooltip": "Trova la mia posizione",
            "enableTracking" : true,
            "layerName":"GeoLocation",
            "bind": true,
            "zoom": true,
            "displayInLayerSwitcher": false,
            "geolocationStyles": {
                "pointStyle": {
                        "graphicName": "circle",
                        "strokeColor": "#aaa",
                        "fillColor": "#11f",
                        "strokeWidth": 2,
                        "fillOpacity": 0.7,
                        "strokeOpacity": 0.6,
                        "pointRadius": 5                          
                },
                "auraStyle": { 
                        "fillOpacity": 0.3,
                        "fillColor": "#55b",
                        "strokeColor": "#00f",
                        "strokeOpacity": 0.6
                },
                "geolocationOptions": {
                    "enableHighAccuracy": true,
                    "maximumAge": 0,
                    "timeout": 7000
                }
            }
        },
        "index": 23
    },{
		  "ptype":"gxp_wfssearchbox",
          "markerFadeoutEnable":false,
          "forceMultiple":true,
          "separator":"start",
		  "outputConfig":{
			 "predicate":"ILIKE",	
			 "url":"/geoserver/postgis_sw/ows?",
			 "emptyText":"Ricerca impianti",
			 "typeName":"postgis_sw:wfs_search_impianti",
			 "recordModel":[
				{
				   "name":"id",
				   "mapping":"id"
				},
				{
				   "name":"geometry",
				   "mapping":"geometry"
				},
				{
				   "name":"codice_ato",
				   "mapping":"properties.codice_ato"
				},
				{
				   "name":"gestore",
				   "mapping":"properties.gestore"
				},
				{
				   "name":"denominazi",
				   "mapping":"properties.denominazi"
				}
			 ],
			 "sortBy":"codice_ato",
			 "queriableAttributes":[
				"codice_ato",
				"denominazi"
			 ],
			 "displayField":"codice_ato",
			 "pageSize":10,
			 "width":150,
			 "tpl":"<tpl for=\".\"><div class=\"search-item\"><h3>{codice_ato}-{gestore}</span></h3>{denominazi}</div></tpl>"
		  },
		  "updateField":"geometry",
		  "zoom":18,
		  "outputTarget":"paneltbar",
		  "index":30
	   },{
		  "ptype":"gxp_wfssearchbox",
          "markerFadeoutEnable":false,
          "separator":"start",
          "forceMultiple":true,
          "noButton":true,
		  "outputConfig":{
		     "predicate":"ILIKE",
			 "url":"/geoserver/postgis_sw/ows?",			 
			 "emptyText":"Ricerca contatori",
			 "typeName":"postgis_sw:wfs_search_contatori",
			 "recordModel":[
				{
				   "name":"id",
				   "mapping":"id"
				},
				{
				   "name":"geometry",
				   "mapping":"geometry"
				},
				{
				   "name":"impianto",
				   "mapping":"properties.impianto"
				},
				{
				   "name":"impianto2",
				   "mapping":"properties.impianto2"
				},
				{
				   "name":"nominativo",
				   "mapping":"properties.nominativo"
				},
				{
				   "name":"gestore",
				   "mapping":"properties.gestore"
				},
				{
				   "name":"servizio",
				   "mapping":"properties.servizio"
				}
			 ],
			 "sortBy":"impianto",
			 "queriableAttributes":[
				"impianto2",
				"nominativo"
			 ],
			 "displayField":"impianto2",
			 "pageSize":10,
			 "width":150,
			 "tpl":"<tpl for=\".\"><div class=\"search-item\"><h3>{impianto2}</span></h3>{nominativo}</div></tpl>"
		  },
		  "updateField":"geometry",
		  "zoom":18,
		  "outputTarget":"paneltbar",
		  "index":31
	   },{
                  "ptype":"gxp_print",
                  "customParams":{
                         "outputFilename":"stampa",
                         "forwardHeaders":[]
                  },
                  "appendLegendOptions": true,
                  "printService":"/geoserver/pdf/",
                  "legendPanelId":"legendPanel",
	           "legendOnSeparatePage":true,
          "defaultResolutionIndex":1,
          "defaultLayoutIndex":1,
                  "ignoreLayers":["WFSSearch","Marker","WFSsearchMarker","GeoRefMarker","GeoLocation"],
                  "actionTarget":{
                         "target":"paneltbar",
                         "index":4
                  }
           },{
            "ptype": "gxp_wmsgetfeatureinfo_menu", 
            "toggleGroup": "toolGroup",
            "regex":"<table[^>]*>([\\s\\S]*)<\\/table>",
            "useTabPanel": true,
            "actionTarget": {"target": "paneltbar", "index": 20},
	     "vendorParams":{"buffer":10}

        },{
			"ptype": "gxp_mouseposition",
            "displayProjectionCode":"EPSG:4326",
            "customCss": "text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505 "
		}
	],
    "georeferences_data":[["VECCHIANO","10.2576770782471,43.7438621520996,10.4186296463013,43.8296279907227"],["SAN GIULIANO TERME","10.2669868469238,43.6980323791504,10.5060262680054,43.8343963623047"],["PISA","10.2695198059082,43.5809707641602,10.4567756652832,43.7509384155273"],["POGGIBONSI","11.0878086090088,43.4014434814453,11.2235774993896,43.5226783752441"],["BARBERINO DI MUGELLO","11.1693925857544,43.9479827880859,11.3129224777222,44.1045417785645"],["BORGO SAN LORENZO","11.3062553405762,43.8700103759766,11.5344266891479,44.0635032653809"],["CALENZANO","11.1344184875488,43.838565826416,11.261908531189,43.9577980041504"],["CANTAGALLO","11.0116357803345,43.9708671569824,11.1800374984741,44.0944595336914"],["DICOMANO","11.4775018692017,43.8627433776855,11.6263484954834,44.0074462890625"],["FIRENZE","11.1505794525146,43.7258605957031,11.3391284942627,43.8352279663086"],["PISTOIA","10.8064565658569,43.8724365234375,11.01540184021,44.1006050109863"],["SAN GODENZO","11.5520000457764,43.8727073669434,11.7189121246338,43.9988594055176"],["SAN PIERO A SIEVE","11.2413339614868,43.9199447631836,11.3482255935669,44.0024528503418"],["SCANDICCI","11.0840768814087,43.6853942871094,11.2141990661621,43.7862396240234"],["SCARPERIA","11.2691698074341,43.9566497802734,11.3906145095825,44.0837669372559"],["SESTO FIORENTINO","11.1447076797485,43.7997894287109,11.2914333343506,43.8803558349609"],["TAVARNELLE VAL DI PESA","11.1434173583984,43.526782989502,11.2732458114624,43.6060943603516"],["VICCHIO","11.4164667129517,43.8752746582031,11.5978088378906,44.031551361084"],["MONTALE","10.9947319030762,43.8968467712402,11.0706520080566,43.9991683959961"],["BARBERINO VAL D'ELSA","11.0801296234131,43.4751319885254,11.2719917297363,43.5848731994629"],["SAN CASCIANO VAL DI PESA","6.62726545333862,35.2889595031738,18.7844753265381,47.0921478271484"],["MARLIANA","10.7348594665527,43.9174499511719,10.8440799713135,44.0023231506348"],["PESCIA","10.6476402282715,43.8519477844238,10.7547416687012,44.0264053344727"],["SAMBUCA PISTOIESE","10.9177160263062,44.0052452087402,11.0544719696045,44.1388359069824"],["VERNIO","11.0932207107544,44.0098609924316,11.2128200531006,44.1124229431152"],["CASTELFRANCO DI SOPRA","11.5000762939453,43.589672088623,11.6241130828857,43.6863059997559"],["GREVE IN CHIANTI","11.2555923461914,43.5182189941406,11.4080419540405,43.6956825256348"],["IMPRUNETA","11.1872396469116,43.6572036743164,11.3086576461792,43.7350196838379"],["LONDA","11.5246858596802,43.808177947998,11.6704053878784,43.8968620300293"],["LORO CIUFFENNA","11.5711803436279,43.5367202758789,11.7372770309448,43.6671104431152"],["MONTEVARCHI","11.480094909668,43.4568901062012,11.6370182037354,43.5484504699707"],["PIAN DI SCO","11.4839172363281,43.6140785217285,11.595251083374,43.6773719787598"],["REGGELLO","11.4489459991455,43.6259803771973,11.6117267608643,43.7681083679199"],["TERRANUOVA BRACCIOLINI","11.5338659286499,43.5068855285645,11.7231044769287,43.6111831665039"],["INCISA IN VAL D'ARNO","11.3848209381104,43.6407165527344,11.4561128616333,43.6981658935547"],["BAGNO A RIPOLI","11.2571573257446,43.6702842712402,11.4164514541626,43.7925071716309"],["PONTASSIEVE","11.3397283554077,43.7682914733887,11.5303592681885,43.8847503662109"],["RIGNANO SULL'ARNO","11.3608779907227,43.6861686706543,11.4684648513794,43.7724456787109"],["RUFINA","11.4607076644897,43.7800331115723,11.6050109863281,43.8658027648926"],["VAGLIA","11.2297925949097,43.8373069763184,11.354100227356,43.9345741271973"],["PELAGO","11.4407815933228,43.7383422851562,11.6037454605103,43.8134460449219"],["CAVRIGLIA","11.3975086212158,43.4793090820312,11.5214624404907,43.587100982666"],["FIGLINE VALDARNO","11.3682699203491,43.5600891113281,11.5215253829956,43.6524200439453"],["SAN GIOVANNI VALDARNO","11.4931716918945,43.5227432250977,11.5559492111206,43.5942268371582"],["SAN MINIATO","10.762713432312,43.6139144897461,10.9339094161987,43.7192268371582"],["PALAIA","10.6850662231445,43.5609130859375,10.8409576416016,43.6471138000488"],["LAJATICO","10.6559238433838,43.412036895752,10.7941131591797,43.5207061767578"],["PECCIOLI","10.6891794204712,43.478443145752,10.8484783172607,43.5854339599609"],["SANTA MARIA A MONTE","10.6462030410767,43.6605567932129,10.7253522872925,43.7546577453613"],["VICOPISANO","10.4975452423096,43.6747436523438,10.6179695129395,43.7227096557617"],["CASCINA","10.4091510772705,43.6175308227539,10.579309463501,43.7221908569336"],["MONTESPERTOLI","10.9706716537476,43.5848693847656,11.1631736755371,43.7084808349609"],["PONTE BUGGIANESE","10.7260255813599,43.7985458374023,10.8156490325928,43.8607444763184"],["MONTECATINI TERME","10.7572116851807,43.8515892028809,10.820200920105,43.9284782409668"],["CALCINAIA","10.5667409896851,43.6564712524414,10.6517963409424,43.7071647644043"],["EMPOLI","10.8772192001343,43.6506881713867,11.0044736862183,43.7413749694824"],["SANTA CROCE SULL'ARNO","10.6824426651001,43.6996192932129,10.7970819473267,43.7768630981445"],["FUCECCHIO","10.711088180542,43.7033081054688,10.8380756378174,43.8141708374023"],["MONTOPOLI IN VAL D'ARNO","10.6936101913452,43.6376152038574,10.7767333984375,43.6951065063477"],["PORCARI","10.5962724685669,43.7943687438965,10.6427536010742,43.860652923584"],["BUTI","10.5536708831787,43.718334197998,10.6302661895752,43.7626457214355"],["CHIESINA UZZANESE","10.6949129104614,43.8121376037598,10.7368516921997,43.8638496398926"],["ALTOPASCIO","10.6306734085083,43.7863502502441,10.7278804779053,43.8491249084473"],["MONTECARLO","10.6375188827515,43.821590423584,10.7052145004272,43.8756790161133"],["CAPANNORI","10.4876546859741,43.7501106262207,10.658748626709,43.942512512207"],["BUGGIANO","10.7134246826172,43.8541259765625,10.767783164978,43.9374961853027"],["UZZANO","10.6936168670654,43.8607215881348,10.7260265350342,43.9164161682129"],["MASSA E COZZILE","10.7292156219482,43.8561592102051,10.7701511383057,43.943244934082"],["VILLA BASILICA","10.5916967391968,43.9111442565918,10.6750202178955,43.9872055053711"],["SANTA CROCE SULL'ARNO","10.6824426651001,43.6996192932129,10.7970819473267,43.7768630981445"],["BIENTINA","10.607928276062,43.6884956359863,10.6710596084595,43.7968330383301"],["CASTELFRANCO DI SOTTO","10.6458539962769,43.692081451416,10.7700262069702,43.8072509765625"],["CASTELFRANCO DI SOTTO","10.6458539962769,43.692081451416,10.7700262069702,43.8072509765625"],["CALCI","10.4866151809692,43.7009315490723,10.5581731796265,43.7625274658203"],["CAPRAIA E LIMITE","10.9587821960449,43.732421875,11.0348749160767,43.7853813171387"],["MONSUMMANO TERME","10.7909860610962,43.8178558349609,10.87193775177,43.8894195556641"],["CAMPI BISENZIO","11.0613451004028,43.7851219177246,11.1680393218994,43.8590621948242"],["CARMIGNANO","10.9641141891479,43.7583999633789,11.079442024231,43.8409614562988"],["PRATO","11.0131568908691,43.8157997131348,11.1696176528931,43.9495735168457"],["QUARRATA","10.9148921966553,43.8124809265137,11.0313282012939,43.8917350769043"],["LARCIANO","10.8092203140259,43.7888298034668,10.9061594009399,43.8675765991211"],["LAMPORECCHIO","10.8250141143799,43.7939796447754,10.9419898986816,43.8471488952637"],["SERRAVALLE PISTOIESE","10.8078927993774,43.8461456298828,10.9377689361572,43.9312858581543"],["PIEVE A NIEVOLE","10.7722930908203,43.8305969238281,10.8160181045532,43.9067344665527"],["MONTEMURLO","11.018177986145,43.8964042663574,11.0954399108887,43.9832496643066"],["VAIANO","11.0816354751587,43.9140968322754,11.1747217178345,43.9826393127441"],["AGLIANA","10.9790554046631,43.8694725036621,11.0248432159424,43.9219703674316"],["LASTRA A SIGNA","11.0284700393677,43.7032051086426,11.1344032287598,43.7824859619141"],["SIGNA","11.0559387207031,43.7728042602539,11.1430721282959,43.8143463134766"],["MONTELUPO FIORENTINO","10.9764747619629,43.693302154541,11.068247795105,43.7675514221191"],["POGGIO A CAIANO","11.0248928070068,43.8003196716309,11.0632257461548,43.830738067627"],["CERRETO GUIDI","10.8088083267212,43.7128295898438,10.9065713882446,43.8030052185059"],["VINCI","10.8538608551025,43.722225189209,10.9797897338867,43.823413848877"],["MONTAIONE","10.900717964172,43.54253982544,10.920718917847,43.562543640137"],["SAN GIMIGNANO","10.9515523910522,43.4009552001953,11.1126842498779,43.5466766357422"],["GAMBASSI TERME","10.942318191528,43.526937713623,10.962319145203,43.54694152832"],["CERTALDO","10.9991855621338,43.5155982971191,11.1514711380005,43.6030502319336"],["CASTELFIORENTINO","10.8744325637817,43.5737113952637,11.027681350708,43.6712799072266"],["CRESPINA","10.5024518966675,43.5571022033691,10.5791931152344,43.6319732666016"],["LORENZANA","10.5027980804443,43.4991836547852,10.5652141571045,43.5648078918457"],["TERRICCIOLA","10.670113792419,43.51473449707,10.690114746094,43.534738311768"],["FAUGLIA","10.4653301239014,43.5091896057129,10.5392684936523,43.6257400512695"],["CASCIANA TERME","10.5455760955811,43.4838371276855,10.6570205688477,43.5605506896973"],["CAPANNOLI","10.6319103240967,43.5528678894043,10.7224321365356,43.6164474487305"],["PONTEDERA","10.5707416534424,43.6108856201172,10.7072916030884,43.6806259155273"],["PONSACCO","10.6017780303955,43.5913314819336,10.6680994033813,43.6465950012207"],["LARI","10.5543165206909,43.5360641479492,10.6350479125977,43.6413879394531"],["CHIANNI","10.5860586166382,43.4058380126953,10.7153940200806,43.518741607666"]]
}
