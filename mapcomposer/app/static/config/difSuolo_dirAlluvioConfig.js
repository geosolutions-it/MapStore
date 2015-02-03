{
   "scaleOverlayMode": "advanced",
   "actionToolScale": "medium",      
   "tab": false,
   "gsSources":{
   		"geoserver_ret": {
			"ptype": "gxp_wmssource",
			"url": "http://geoportale.lamma.rete.toscana.it/geoserver_ret/ows?",
			"title": "Geoscopio Reticolo",
			"SRS": "EPSG:3003",
			"version":"1.1.1",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			            
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":true
			}
		},    
   		"geoscopio": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmssfondo&map_resolution=91&language=ita",
			"title": "Geoscopio basi",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
		"geoscopio_topogr": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmstopogr&version=1.3.0&map_resolution=91&map_mnt=cartoteca&",
			"title": "Geoscopio BASI TOPOGRAFICHE",
			"SRS": "EPSG:3003",
			"version": "1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [1547065,
			4677785,
			1803065,
			4933785],
			"layerBaseParams": {
				"FORMAT": "image/png",
				"TILED": false
			}
		},
		"geoscopio_ambcens": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambcens&version=1.3.0&map_resolution=91&map_mnt=cartoteca&",
			"title": "Geoscopio AMBITI_CENSUARI",
			"SRS": "EPSG:3003",
			"version": "1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [1547065,
			4677785,
			1803065,
			4933785],
			"layerBaseParams": {
				"FORMAT": "image/png",
				"TILED": false
			}
		},         
   		"geoscopio_ortofoto": {
			"ptype": "gxp_wmssource",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsofc",
			"title": "Geoscopio ortofoto",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_ctr": {
			"ptype": "gxp_wmssource",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsctr",
			"title": "Geoscopio CTR",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_idrografia": {
			"ptype": "gxp_wmssource",
			"url": "http://web.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsidrogr&map_resolution=91&language=ita&",
			"title": "Geoscopio idrografia",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
   		"geoscopio_amb_ammin": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&",
			"title": "Geoscopio ambiti amministrativi",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		},
        "geoscopio_rischio_idrogeo": {
			"ptype": "gxp_wmssource",
			"url": "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsperidr&",
			"title": "Geoscopio rischio idrogeologico",
			"SRS": "EPSG:3003",
			"version":"1.3.0",
            "loadingProgress": true,
			"layersCachedExtent": [
				1547065, 4677785,
				1803065, 4933785
			],			
			"layerBaseParams":{
				"FORMAT":"image/png",
				"TILED":false
			}
		}
	},
	"map": {
		"projection": "EPSG:3003",
		"displayProjection": "EPSG:3003",
		"units": "m",
		"center": [1665000,4807000],
		"maxResolution": 1000,
		"zoom": 1,
		"numZoomLevels": 14,
		"maxExtent": [
				708923.00, 4290035.00,
				2631134.00, 5369149.00
		],
		"restrictedExtent": [
				708923.00, 4290035.00,
				2631134.00, 5369149.00
		],        
		"layers": [{
                "source": "geoscopio",
                "group": "background",
                "title": "Basi di sfondo",
                "name": "rt_sfondo.batimetriche",
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio",
                "group": "background",
                "title": "Basi di sfondo",
                "name": "rt_sfondo.intorno_toscana",
                "displayInLayerSwitcher": false,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 2013 col - AGEA",
                "name": "rt_ofc.10k13",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 2010 col - AGEA",
                "name": "rt_ofc.10k10",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 2007 col - CGR",
                "name": "rt_ofc.10k07",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1996 bn - AIMA",
                "name": "rt_ofc.10k96",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1988 bn - RT",
                "name": "rt_ofc.10k88",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1978 bn - RT",
                "name": "rt_ofc.10k78",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_ortofoto",
                "group": "Ortofotocarte 1:10.000",
                "title": "Anno 1954 bn - RT-IGM",
                "name": "rt_ofc.10k54",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "expanded": false,
                "checked": false,            
                "attribution": false
            },
            {
                "source": "geoscopio_topogr",
                "group": "Basi cartografiche",
                "title": "Carta Topografica 50k",
                "maxscale": 15000, 
                "name": "rt_topogr.topografica50k.grey.rt",
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ctr",
                "group": "Basi cartografiche",
                "title": "CTR 1:10.000 Raster BW",
                "name": "rt_ctr.10k",
                "minscale": 15000,             
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ctr",
                "group": "Basi cartografiche",
                "title": "CTR 1:10.000 Raster GL",
                "minscale": 15000,            
                "name": "rt_ctr.ctr10kgreylight",
                "displayInLayerSwitcher": true,
                "visibility": false,
                "tiled": false,
                "attribution": false
            },
            {
                "source": "geoscopio_ambcens",
                "group": "Toponimi",
                "title": "Toponimi - Centri e nuclei 2011",
                "name": "rt_amb_cens.centri_nuclei_2011",
                "displayInLayerSwitcher": true,
                "visibility": true,
                "tiled": false,
                "attribution": false
            },{
				"source": "geoserver_ret",
				"group": "Allerta Meteo",
				"title": "Zone di allerta",
				"name": "lamma:ZoneAllertaMeteoIdro",
                "opacity": 0.4,
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Rischio",
				"title": "Autorità di Bacino del Fiume Serchio",
				"name": "rt_peridr.idrischio.serchio.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Rischio",
				"title": "Autorità di Bacino del Fiume Tevere",
				"name": "rt_peridr.idrischio.tevere.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Rischio",
				"title": "Autorità di Bacino del Fiume Arno",
				"name": "rt_peridr.idrischio.arno.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Rischio",
				"title": "Bacini regionali e interregionali",
				"name": "rt_peridr.idrischio.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Pericolosità",
				"title": "Autorità di Bacino del Fiume Serchio",
				"name": "rt_peridr.idpericolosita.serchio.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Pericolosità",
				"title": "Autorità di Bacino del Fiume Tevere",
				"name": "rt_peridr.idpericolosita.tevere.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Pericolosità",
				"title": "Autorità di Bacino del Fiume Arno",
				"name": "rt_peridr.idpericolosita.arno.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_rischio_idrogeo",
				"group": "Direttiva alluvioni - Pericolosità",
				"title": "Bacini regionali e interregionali",
				"name": "rt_peridr.idpericolosita.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false,
				"attribution": false
			},{
				"source": "geoscopio_idrografia",
				"group": "Idrografia",
				"title": "Corsi d'acqua",
				"name": "rt_idrogr.corsi.rt.line",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false
			},{
				"source": "geoserver_ret",
				"group": "Reticolo Gestione RT",
				"title": "Comprensori ai sensi della L.R.79/2012",
				"name": "RETICOLO_GESTIONE:proposta_comprensori_lr79_2012",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Reticolo Gestione RT",
				"title": "Reticolo di Gestione (SETT. 2014)",
				"name": "RETICOLO_GESTIONE:reticolo_lr79_2012",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Reticolo Gestione RT",
				"title": "Categorie RD 523/1904-bozza (SETT. 2014)",
				"name": "RETICOLO_GESTIONE:reticolo_lr79_2012_gc",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (AREALI)",
                "expanded": false,
                "checked": false,
				"title": "Intervento di versante",
				"name": "CENS_OP_IDRO:a_versante",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (AREALI)",
                "expanded": false,
                "checked": false,
				"title": "Invaso",
				"name": "CENS_OP_IDRO:a_invaso",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (AREALI)",
                "expanded": false,
                "checked": false,
				"title": "Casse espansione",
				"name": "CENS_OP_IDRO:a_cas_esp",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Intervento versante",
				"name": "CENS_OP_IDRO:l_versante",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Sponda",
				"name": "CENS_OP_IDRO:l_sponda",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Sifone",
				"name": "CENS_OP_IDRO:l_sifone",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Cunettone",
				"name": "CENS_OP_IDRO:l_cunet",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Corso acqua classificato",
				"name": "CENS_OP_IDRO:l_cors_acq",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Canale artificiale",
				"name": "CENS_OP_IDRO:l_can_art",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Attraversamento",
				"name": "CENS_OP_IDRO:l_attraver",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (LINEARI)",
                "expanded": false,
                "checked": false,
				"title": "Argine",
				"name": "CENS_OP_IDRO:l_argine",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Intervento versante",
				"name": "CENS_OP_IDRO:p_versante",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Traversa",
				"name": "CENS_OP_IDRO:p_traversa",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Sponda",
				"name": "CENS_OP_IDRO:p_sponda",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Soglia",
				"name": "CENS_OP_IDRO:p_soglia",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Soglia ponte",
				"name": "CENS_OP_IDRO:p_sog_pon",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Sifone",
				"name": "CENS_OP_IDRO:p_sifone",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Sfioratore",
				"name": "CENS_OP_IDRO:p_sfiorat",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Scarico",
				"name": "CENS_OP_IDRO:p_scarico",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Rampa",
				"name": "CENS_OP_IDRO:p_rampa",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Presa",
				"name": "CENS_OP_IDRO:p_presa",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Pennello",
				"name": "CENS_OP_IDRO:p_pennello",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Invaso",
				"name": "CENS_OP_IDRO:p_invaso",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Idrovoro",
				"name": "CENS_OP_IDRO:p_idrovoro",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Cunettone",
				"name": "CENS_OP_IDRO:p_cunet",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Corso acqua classificato",
				"name": "CENS_OP_IDRO:p_cors_acq",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Cateratta",
				"name": "CENS_OP_IDRO:p_caterat",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Casello",
				"name": "CENS_OP_IDRO:p_casello",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Casse espansione",
				"name": "CENS_OP_IDRO:p_cas_esp",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Canale artificiale",
				"name": "CENS_OP_IDRO:p_can_art",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Briglia",
				"name": "CENS_OP_IDRO:p_briglia",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Briglia sel",
				"name": "CENS_OP_IDRO:p_brig_sel",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Attraversamento",
				"name": "CENS_OP_IDRO:p_attraver",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Censimento Opere Idrauliche (PUNTUALI)",
                "expanded": false,
                "checked": false,
				"title": "Argine",
				"name": "CENS_OP_IDRO:p_argine",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			},{
				"source": "geoserver_ret",
				"group": "Rete di monitoraggio CFR",
				"title": "Idrometri",
				"name": "lamma:cfr_monitoraggio072014",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Province",
				"name": "rt_ambamm.idprovince.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": true,
				"tiled": false
			},{
				"source": "geoscopio_amb_ammin",
				"group": "Ambiti amministrativi",
				"title": "Comuni",
				"name": "rt_ambamm.idcomuni.rt.poly",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			},{
				"source": "geoserver_ret",
				"group": "Ambiti amministrativi",
				"title": "Distretti Idrografici (forniti AdB Arno)",
				"name": "pericolosita:distretti_gb",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": false
			},{
				"source": "geoserver_ret",
				"group": "Ambiti amministrativi",
				"title": "Bacini idrografici ai sensi della 183/89",
				"name": "pericolosita:bacini",
				"displayInLayerSwitcher": true,
				"visibility": false,
				"tiled": true
			}
		]
	},
	"scaleOverlayUnits":{
        "bottomOutUnits":"nmi",    
        "bottomInUnits":"nmi",    
        "topInUnits":"m",    
        "topOutUnits":"km"
    },	
    "removeTools": [
        "wmsgetfeatureinfo_menu_plugin"
    ], 	    
	"proj4jsDefs": {
		"EPSG:3003": "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs +towgs84 = -104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68"
	},	
	"customTools": [
		{
			"ptype": "gxp_embedmapdialog",
			"actionTarget": {"target": "paneltbar", "index": 2},
			"embeddedTemplateName": "viewer",
			"showDirectURL": true
		},{
            "ptype":"gxp_wmsgetfeatureinfo",
            "id": "wmsgetfeatureinfo_plugin",
            "toggleGroup":"toolGroup",
            "closePrevious": true,
            "useTabPanel": true,
            "infoPanelId": "",
            "disableAfterClick": false,
            "loadingMask": true,
			"maxFeatures": 100,
            "actionTarget":{
                "target":"paneltbar",
                "index":14
            }
        }, {
		   "ptype": "gxp_mouseposition",
		   "displayProjectionCode":"EPSG:3003",
		   "customCss": "font-weight: bold; text-shadow: 1px 0px 0px #FAFAFA, 1px 1px 0px #FAFAFA, 0px 1px 0px #FAFAFA,-1px 1px 0px #FAFAFA, -1px 0px 0px #FAFAFA, -1px -1px 0px #FAFAFA, 0px -1px 0px #FAFAFA, 1px -1px 0px #FAFAFA, 1px 4px 5px #aeaeae;color:#050505"
		}, {
			"ptype": "gxp_addlayer",
			"showCapabilitiesGrid": true,
			"useEvents": false,
			"showReport": false,
			"directAddLayer": false,
			"id": "addlayer"
		}, {
			"actions": ["-"], 
			"actionTarget": "paneltbar"
		}, {
			"ptype": "gxp_geolocationmenu",
			"actionTarget": {"target": "paneltbar", "index": 23},
			"toggleGroup": "toolGroup"
		}, {
            "ptype": "gxp_about",
            "poweredbyURL": "http://www.geo-solutions.it/about/contacts/",
            "actionTarget": {
                "target": "panelbbar",
                "index": 1
            }
        }
	]
}
