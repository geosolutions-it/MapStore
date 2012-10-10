var config = {
		/*
		 * uncomment to use XDProxy configuration
		 * 
		 * 
		 * XDProxy: { url:"http://localhost:8080/http_proxy/proxy", callback: "url" },
		 */		 
		/*
		 * NOTE: leave the proxyed servers before the others, in order to make the
		 * test cases work
		 */
       catalogs: [        
          {"name": "Demo1GeoSolutions-no proxy", "url": "http://localhost/geonetwork/srv/en/csw", "description": "http://demo1.geo-solutions.it/geonetwork/srv/en/csw"},
          {"name": "Invalid server-no proxy", "url": "http://localhost/xxx", "description": "Invalid server"},
          {"name": "Treviso-no proxy", "url": "http://localhost/geonetworktn/srv/it/csw", "description": "http://ows.provinciatreviso.it/geonetwork/srv/it/csw"},
          {"name": "kscNet-no proxy" , "url": "http://localhost/geonetworkksc/srv/ru/csw", "description" : "http://geoportal.kscnet.ru/geonetwork/srv/ru/csw"},
          {"name": "CSI-CGIAR-no proxy", "url": "http://localhost/geonetworkcsi/srv/en/csw", "description" : "http://geonetwork.csi.cgiar.org/geonetwork/srv/en/csw"},
          {"name": "EauFrance-no proxy", "url": "http://localhost/geonetworkeaufr/srv/fr/csw", "description" : "http://sandre.eaufrance.fr/geonetwork/srv/fr/csw"},
          
          {"name": "SOPAC-no proxy", "url": "http://localhost/geonetworksopac/srv/en/csw", "description" : "http://geonetwork.sopac.org/geonetwork/srv/en/csw"},
          {"name": "SADC-no proxy", "url": "http://localhost/geonetworksadc/srv/en/csw", "description" : "http://www.sadc.int/geonetwork/srv/en/csw"},
          {"name": "MAPAS-no proxy", "url": "http://localhost/geonetworkmapas/srv/en/csw", "description" : "http://mapas.mma.gov.br/geonetwork/srv/en/csw"},

          {"name": "Demo1GeoSolutions" , "url": "http://demo1.geo-solutions.it/geonetwork/srv/en/csw", "description": "Iternal GeoNetwork demo"},
          {"name": "Treviso", "url": "http://ows.provinciatreviso.it/geonetwork/srv/it/csw", "description": "Treviso Geonetwork"},
					{"name": "kscNet", "url": "http://geoportal.kscnet.ru/geonetwork/srv/ru/csw", "description": "kscNet"},
          {"name": "CSI-CGIAR", "url": "http://geonetwork.csi.cgiar.org/geonetwork/srv/en/csw", "description" : "CSI-CGIAR"},
          {"name": "EauFrance", "url": "http://sandre.eaufrance.fr/geonetwork/srv/fr/csw", "description" : "EauFrance"},

          {"name": "SOPAC", "url": "http://geonetwork.sopac.org/geonetwork/srv/en/csw", "description" : "SOPAC"},
          {"name": "SADC", "url": "http://www.sadc.int/geonetwork/srv/en/csw", "description" : "SADC"},
          {"name": "MAPAS", "url": "http://mapas.mma.gov.br/geonetwork/srv/en/csw", "description" : "MAPAS"}
					],
		  	   initialBBox: {
		  			minx:-13,
		  			miny:10,
		  			maxx:-10,
		  			maxy:13
		  		}, 
		      dcProperty: "language",
		     	cswVersion: "2.0.2",
		  		filterVersion: "1.1.0",
		  		start: 1,
		  		limit: 20,
		  		i18nWait: 4,
		  		cswWait: 3,
		  		timeout: 60000
};
