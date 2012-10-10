
var i18n;
/**
 * Function: init.js
 * Crea e popola il mockup dell'applicazione
 * 
 */
Ext.onReady(function() {
	// Ext.QuickTips.init(); //not compatible with IE9 for version 3.3.1 of Extjs
	/*
	 * //IE9 compatibility workaround : delete if update Extjs to 4 ------ if
	 * ((typeof Range !== "undefined") &&
	 * !Range.prototype.createContextualFragment) {
	 * Range.prototype.createContextualFragment = function(html) { var frag =
	 * document.createDocumentFragment(), div = document.createElement("div");
	 * frag.appendChild(div); div.outerHTML = html; return frag; }; } //IE 9
	 * compatibility Workaround end ------------------------------
	 */

	// Loads bundle for i18n messages
	i18n = new Ext.i18n.Bundle({
		bundle : "CSWViewer",
		path : "../../i18n",
		lang : "it-IT"
	});
	
	i18n.onReady( function() {
	// Declares a panel for querying CSW catalogs
		var cswPanel = new CSWPanel({
				config: config,
				listeners: {
					zoomToExtent: function () {alert("zoomToExtent")},
					viewMap: function () {alert("viewMap")}	
				}
		});

		var viewWin = new Ext.Window({
			width : 800,
			closable:false,
			resizable:false,
			draggable:false,
			items : [ cswPanel ]
		});

		viewWin.show();
	});
});

