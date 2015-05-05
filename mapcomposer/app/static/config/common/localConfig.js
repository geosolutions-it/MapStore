/** This file contains the common configuration options 
 *  that can be overridden by the serverConfig objects in templates */
var localConfig = {
   geoStoreBase: "",
   proxy: "/http_proxy/proxy/?url=",
   defaultLanguage: "it",
   "header": {
		"html": ["<div align='center' style='background-color:#02004B;background-position:right center;background-image:url(theme/app/img/banner/Header_geoportale_solo_img.jpg);background-repeat: no-repeat;width:100%;height:100%'><a href='http://www.lamma.rete.toscana.it' target='_blank'><img src='theme/app/img/banner/logolamma_trasp.png' style='float:left;'/></a><img src='theme/app/img/banner/Geoportale_titolo.png' style='float:right;position:absolute;top:20px;right:10px;'/></div>"],
		"container": {
			"border": false,
			"header": false,
			"collapsible": true,
			"collapseMode": "mini",
			"hideCollapseTool": true,
			"split": true,
			"id": "north",
			"animCollapse": false,
			"collapsed": false,
			"minHeight": 90,
			"maxHeight": 90,
			"height": 90
		}
	},
   "footer": {},
   skipCustomConfigs: true
};