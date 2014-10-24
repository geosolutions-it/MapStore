/** This file contains the common configuration options 
 *  that can be overridden by the serverConfig objects in templates */
var localConfig = {
   geoStoreBase: "http://localhost:9191/geostore/rest/",
   proxy:"/http_proxy/proxy/?url=",
   loginDataStorage : sessionStorage,
   defaultLanguage: "en"
};