/*
 * settings.js
 * 
 * Settings of the test environment  
 */

var panel;
var request;
var successFlag= null;
var i18n;

/*
i18n = new Ext.i18n.Bundle({
	bundle : "CSWViewer",
	path : "../../i18n",
	language : "it"
});

i18n.onReady(function() {
	// Declares a panel for querying CSW catalogs
	var cswPanel = new CSWPanel({
		id : "cswpanel",
		map : "map", // NOTE: an OpenLayers map should be passed instead
		catalogs : config.catalogs,
		initialBbox : new OpenLayers.Bounds(-13, 10, -10, 13),
		dcProperty : config.dcProperty
	});
});
*/


i18n = new Ext.i18n.Bundle({
	bundle : "CSWViewer",
	path : "../../i18n",
	lang : "it-IT"
});

i18n.onReady( function() {
	panel = new CSWPanel({
			config: config,
			listeners: {
				zoomToExtent: function () {alert("zoomToExtent");},
				viewMap: function () {alert("viewMap");}	
			}
	});

	var viewWin = new Ext.Window({
		width : 800,
		closable:false,
		resizable:false,
		draggable:false,
		items : [panel ]
	});

	viewWin.show();
});

/*
 * Setups some test objects
 */
function setupTest() {
  comboBoxSelect(panel.searchTool.catalogChooser, config.catalogs[0].url, 0);
  panel.searchTool.freeText.setValue("");
  useAdvancedSearch(false);
  panel.searchTool.dcValue.setValue("");
  panel.searchTool.lastModifiedBegin.setValue("");
  panel.searchTool.lastModifiedEnd.setValue("");
}

/*
 * Simulates the click of the searchbutton
 */
function searchExecute() {
	panel.searchTool.searchButton.handler.call(
			panel.searchTool.searchButton.scope, panel.searchTool.searchButton
	);
}

/*
 * Simulates an user selection of a combobox
 */
function comboBoxSelect(cbox, value, index) {
	cbox.setValue(value);
	cbox.fireEvent("select", cbox, value, index);
}

/*
 * Returns the options of CSW request based on the criteria contained in filter
 */
function buildCSWRequestData(filter) {

	if (filter) {
		var options = {
			url : config.catalogs[0].url,
			resultType : "results",
			startPosition : 1,
			maxRecords : 20,
			outputFormat : "application/xml",
			outputSchema : "http://www.isotc211.org/2005/gmd",
			Query : {
				ElementSetName : {
					value : "full"
				},
				Constraint : {
					version : config.filterVersion,
					Filter : filter
				}
			}
		}
	} else {
		var options = {
			url : config.catalogs[0].url,
			resultType : "results",
			startPosition : 1,
			maxRecords : 20,
			outputFormat : "application/xml",
			outputSchema : "http://www.isotc211.org/2005/gmd",
			Query : {
				ElementSetName : {
					value : "brief"
				}
			}
		}
	}

	var format = new OpenLayers.Format.CSWGetRecords();
	return format.write(options);
}

/*
 * Enable/disable the use of the advanced search criteria
 */
function useAdvancedSearch(flag) {
	panel.searchTool.advancedSearchSet.collapsed = (flag == true) ? false : true;
}

/*
 * Setup a store with CSWRecorsdReader retrieving limit records starting from
 * the start-th
 */
function setupStore(start, limit) {
	var options = {
		filter : new OpenLayers.Filter.Comparison({
			type : OpenLayers.Filter.Comparison.EQUAL_TO,
			matchCase : false,
			property : "dc:Language",
			value : "eng"
		}),
		start : start,
		limit : limit,
		url : config.catalogs[0].url,
		filterVersion : config.filterVersion,
		cswVersion : config.cswVersion,
//		sortProperty : "Title",
//		sortOrder : "ASC",
		resultType : "full",
		emptySearch: false,
		timeout: config.cswWait * 10000
	};

	var reader = new CSWRecordsReader({
		fields : [ "title", "subject" ]
	});
	var store = new Ext.data.Store({
		reader : reader,
		proxy : new CSWHttpProxy(options),
		autoLoad : false,
		remoteSort : false
	});
	reader.store = store;

	return (store);
}

/*
 * Create filter based on dates
 */
function testDate(t, msg, nExpected, beginDate, endDate) {
  t.plan(1);

	var filters = new Array();
	if (beginDate) {
		filters.push(new OpenLayers.Filter.Comparison({
			type : OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
			property : "tempExtentBegin",
			value : beginDate
		}));
	}
	if (endDate) {
		filters.push(new OpenLayers.Filter.Comparison({
			type : OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
			property : "tempExtentEnd",
			value : endDate
		}));
	}

	var cswRequestData = buildCSWRequestData(new OpenLayers.Filter.Logical({
		type : OpenLayers.Filter.Logical.AND,
		filters : filters
	}));

	var request = OpenLayers.Request.POST(OpenLayers.Util.applyDefaults({
		url : config.catalogs[0].url,
		params : {
			Service : "CSW"
		},
		data : cswRequestData,
		success : function(response) {
			var data = (new OpenLayers.Format.CSWGetRecords())
					.read(response.responseXML);
			t.eq(data.SearchResults.numberOfRecordsMatched, nExpected, msg);
		},
		failure : function(response) {
			t.ok(false, "CSW Server did not answer");
		}
	}));
}

/*
 * Executes a GetCapabilites request witout resorting to OpenaLayers classes
 * (successFlag is a global variable variable)
 */
function executeGetCapabilities(url) {
  Ext.Ajax.request({
    url: url,
    method: "GET",
    params: {Service: "CSW", Request: "GetCapabilities"},
    success: function(response, opts) {
      successFlag= (response.responseText.indexOf("ExceptionReport") >= 0 || response.responseText.indexOf('version="2.0.2"') < 0) ? false : true;
      if ( ! successFlag ) {
        console.log(response.responseText);
      }
    },
    failure: function(response, opts) {
      successFlag= false;
      console.log(response.responseText);
    }
  });
}

/*
 * Executes a check on a server
 * (successFlag is a global variable variable)
 */
function executeTestServer(t, i, expResult) {
  t.plan(1);
  successFlag= null;
  executeGetCapabilities(config.catalogs[i].url, successFlag);
          
  t.delay_call(config.cswWait * 2, function () {
  	if ( expResult) {
      t.eq(successFlag, true, "Server '" + config.catalogs[i].name + "' works");
  	} else {
      t.eq(false, false, "Invalid server '" + config.catalogs[i].name + "' doesn't, as expected, work");
  	}
  });
}

/*
 * Executes a GetRecords request witout resorting to OpenaLayers classes
 */
function executeGetRecords(filter) {
  var url= config.catalogs[0].url;
  var xml= '<?xml version="1.0" encoding="UTF-8"?> ' +
       '<csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" ' +
       'version="2.0.2" resultType="results" outputFormat="application/xml" ' +
       'outputSchema="http://www.opengis.net/cat/csw/2.0.2" startPosition="1" ' + 
       'maxRecords="10"><csw:Query typeNames="csw:Record"> ' +
       '<csw:ElementSetName>summary</csw:ElementSetName> ' +
       filter + ' ' +
       '</csw:Query></csw:GetRecords>';
  
  Ext.Ajax.request({
    url: config.catalogs[0].url,
    method: "POST",
    xmlData: xml,
    success: function(response, opts) {
      nRecords= returnsMatched(response);
    },
    failure: function(response, opts) {
      console.log("server-side failure with status code " + response.status);
    }
  });
}

function returnsMatched(response) {
  return Number(response.responseXML.firstChild.childNodes[3].attributes[0].nodeValue);
  // NOTE: This does not work in FireFox
  // return Number(response.responseXML.getElementsByTagName("SearchResults")[0].attributes["numberOfRecordsMatched"].nodeValue);
}
