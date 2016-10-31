/** This file contains the common configuration options 
 *  that can be overridden by the serverConfig objects in templates */
var localConfig = {
   geoStoreBase: "",
   loginDataStorage: sessionStorage,
   proxy:"/http_proxy/proxy/?url=",
   defaultLanguage: "it",
   proj4jsDefs: {
	"EPSG:3003":"+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs",
	"EPSG:23032":"+proj=utm +zone=32 +ellps=intl +units=m +no_defs",
	"EPSG:25832":"+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs",
	"EPSG:26591":"+proj=tmerc +lat_0=0 +lon_0=-3.45233333333333 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +pm=rome +units=m +no_defs",
	"EPSG:32632":"+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
	}
};