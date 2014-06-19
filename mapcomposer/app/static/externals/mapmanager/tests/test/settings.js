/*
 * settings.js
 * 
 * Settings of the test environment  
 */

var grid,
	msmPanel,
	successFlag,
	auth = 'Basic ' + Base64.encode('admin:admin');

var initTotalCount,  //Counts the resources of geostore before the tests
	finalTotalCount; //Counts the resources of geostore after the tests

Ext.onReady(function() {
    
    Ext.QuickTips.init();
    
    var langData = [['en', 'English']],
    	query = location.search;

    if(query && query.substr(0,1) === "?"){
        query = query.substring(1);
    }
    
    var url = Ext.urlDecode(query),
    	code = url.locale;

    if(!code){
        code = "en";
    }
    
    var initialLanguageString;
            
    //check if code is valid
    if(code){
        Ext.each(langData, function(rec){
            if(rec[0] === code.toLowerCase()){
                initialLanguageString = rec[1];
                return;
            }
        });
    }            
    
    if (GeoExt.Lang) {
		GeoExt.Lang.set(code);
    }
    
    msmPanel = new Ext.Panel({
        xtype: 'panel',
        id: 'mapManagerPanel',
        config: config,
        items: grid,
        lang: code,
        width: 1100,
        height: 500
    });
    
    grid = new MSMGridPanel({
        renderTo: "topic-grid",
        layout: 'fit',
        iconCls: "server_map",
        border : true,
        //lang: lang,
        config: config
    });
   
});

/*
 * Test grid init
 */
function initGrid(t) {
    t.plan(1);
    t.delay_call(config.msmTimeout, function () {
        if(grid.id = 'id_geostore_grid'){
            t.ok(true, "grid initialized");
        }else{
            t.fail("grid not initialized");
        }
    });
}

/*
 * Test Panel init
 */
function initPanel(t) {
    t.plan(1);
    t.delay_call(config.msmTimeout, function () {
        if(msmPanel.id = 'mapManagerPanel'){
            t.ok(true, "panel initialized");
        }else{
            t.fail("panel not initialized");
        }
    });
}

/*
 * Test Store init
 */
function initStore(t) {
    t.plan(1);
    t.delay_call(config.msmTimeout, function () {
        if(grid.store.storeId = 'id_geostore' && grid.store.getTotalCount()){
            t.ok(true, "store initialized");
        }else{
            t.fail("store not initialized");
        }
    });
}

/*
 * Setups some test objects
 */
function setupTest() {
  grid.inputSearch.setValue("");
}

/*
 * Simulates the click of the searchbutton
 */
function searchExecute() {
    Ext.getCmp('searchBtn').handler.call();
}

/*
 * Simulates the click of the resetbutton
 */
function resetExecute() {
    Ext.getCmp('clearBtn').handler.call();
}

/*
 * Simulates the click of the newMapButton
 */
function newMapButtonExecute() {
    var userProfile = '&auth=true';
    var idMap = -1;
    var desc = 'New Map';
    grid.plugins.openMapComposer(config.mcUrl,userProfile,idMap,desc);
}

/*
 * Simulates the click of the button to opne 
 */
function openMapViewButtonExecute() {
    var userProfile = '&auth=false&fullScreen=true';
    var idMap = -1;
    var desc = 'New Map';
    grid.plugins.openMapComposer(config.mcUrl,userProfile,idMap,desc);
}

/*
 * Simulates the click of the close newMapButton
 */
function newMapButtonCloseExecute() {
    Ext.getCmp('idMapManager').close();
}

/*
 * Simulates the click of the expandAll
 */
function expandAllExecute() {
    Ext.getCmp('id_expandAll_button').handler.call();
}

/*
 * Simulates the click of the collapseAll
 */
function collapseAllExecute() {
    Ext.getCmp('id_collapseAll_button').handler.call();
}

/*
 * Add resources to geostore for tests
 */
function addResources(auth){
    var resources = ["(Buffer Zone)","Fires","Climatology("]
    var i = 0;
    for (i=0; i<resources.length; i++) { 
        Ext.Ajax.request({
           url: "http://localhost:8080/geostore/rest/" + "resources",
           method: 'POST',
           headers:{
              'Content-Type' : 'text/xml',
              'Accept' : 'application/json, text/plain, text/xml',
              'Authorization' : auth
           },
           params: '<Resource><description>Test Map</description><metadata></metadata><name>' + resources[i] +'</name><category><name>MAP</name></category><store><data><![CDATA[{"modified":false,"proxy":"/http_proxy/proxy/?url=","xmlJsonTranslateService":"http://demo1.geo-solutions.it/xmlJsonTranslate/","defaultSourceType":"gxp_wmssource","renderToTab":"appTabs","printService":"http://demo1.geo-solutions.it/geoserver/pdf/","mapTitle":"View","about":{"title":"Custom Map","abstract":"Custom Map","contact":"<a href="#">#</a>."},"sources":{"mapquest":{"ptype":"gxp_mapquestsource","projection":"EPSG:900913"},"osm":{"ptype":"gxp_osmsource","projection":"EPSG:900913"},"google":{"ptype":"gxp_googlesource","projection":"EPSG:900913"},"bing":{"ptype":"gxp_bingsource","projection":"EPSG:900913"},"ol":{"ptype":"gxp_olsource","projection":"EPSG:900913"},"source0":{"url":"http://demo1.geo-solutions.it/geoserver/ows","title":"FDH GeoServer","layerBaseParams":{"TILED":true,"TILESORIGIN":"-20037508.34,-20037508.34"},"projection":"EPSG:900913"},"source1":{"url":"http://demo.geo-solutions.it/geoserverdemo/ows","title":"DEMO GeoServer","projection":"EPSG:900913"}},"cswconfig":{"catalogs":[{"name":"Demo1GeoSolutions","url":"http://demo1.geo-solutions.it/geonetwork/srv/en/csw","description":"Iternal GeoNetwork demo"},{"name":"Treviso","url":"http://ows.provinciatreviso.it/geonetwork/srv/it/csw","description":"Treviso Geonetwork"},{"name":"kscNet","url":"http://geoportal.kscnet.ru/geonetwork/srv/ru/csw","description":"kscNet"},{"name":"CSI-CGIAR","url":"http://geonetwork.csi.cgiar.org/geonetwork/srv/en/csw","description":"CSI-CGIAR"},{"name":"EauFrance","url":"http://sandre.eaufrance.fr/geonetwork/srv/fr/csw","description":"EauFrance"},{"name":"SOPAC","url":"http://geonetwork.sopac.org/geonetwork/srv/en/csw","description":"SOPAC"},{"name":"SADC","url":"http://www.sadc.int/geonetwork/srv/en/csw","description":"SADC"},{"name":"MAPAS","url":"http://mapas.mma.gov.br/geonetwork/srv/en/csw","description":"MAPAS"}],"dcProperty":"title","initialBBox":{"minx":-13,"miny":10,"maxx":-10,"maxy":13},"cswVersion":"2.0.2","filterVersion":"1.1.0","start":1,"limit":10,"timeout":60000},"map":{"projection":"EPSG:900913","units":"m","maxExtent":[-20037508.34,-20037508.34,20037508.34,20037508.34],"layers":[{"source":"bing","name":"Aerial","title":"Bing Aerial","visibility":false,"group":"background","fixed":true,"selected":false},{"source":"osm","name":"mapnik","title":"Open Street Map","visibility":false,"group":"background","fixed":true,"selected":false},{"source":"mapquest","name":"osm","title":"MapQuest OpenStreetMap","visibility":false,"group":"background","fixed":true,"selected":false},{"source":"google","name":"ROADMAP","title":"Google Roadmap","visibility":false,"opacity":1,"group":"background","fixed":true,"selected":false},{"source":"google","name":"HYBRID","title":"Google Hybrid","visibility":false,"opacity":1,"group":"background","fixed":true,"selected":false},{"source":"google","name":"TERRAIN","title":"Google Terrain","visibility":true,"opacity":1,"group":"background","fixed":true,"selected":false}],"center":[-1224514,1291331],"zoom":6},"tools":[{"ptype":"gxp_layertree","outputConfig":{"id":"layertree"},"outputTarget":"tree"},{"ptype":"gxp_legend","outputTarget":"legend","outputConfig":{"autoScroll":true,"title":"Show Legend"},"legendConfig":{"legendPanelId":"legendPanel","defaults":{"style":"padding:5px","baseParams":{"LEGEND_OPTIONS":"forceLabels:on;fontSize:10","WIDTH":12,"HEIGHT":12}}}},{"ptype":"gxp_addlayers","actionTarget":"tree.tbar","upload":true},{"ptype":"gxp_removelayer","actionTarget":["tree.tbar","layertree.contextMenu"]},{"ptype":"gxp_removeoverlays","actionTarget":"tree.tbar"},{"ptype":"gxp_addgroup","actionTarget":"tree.tbar"},{"ptype":"gxp_removegroup","actionTarget":["tree.tbar","layertree.contextMenu"]},{"ptype":"gxp_groupproperties","actionTarget":["tree.tbar","layertree.contextMenu"]},{"ptype":"gxp_layerproperties","actionTarget":["tree.tbar","layertree.contextMenu"]},{"ptype":"gxp_zoomtolayerextent","actionTarget":{"target":"layertree.contextMenu","index":0}},{"ptype":"gxp_geonetworksearch","actionTarget":["layertree.contextMenu"]},{"ptype":"gxp_navigation","toggleGroup":"toolGroup","actionTarget":{"target":"paneltbar","index":15}},{"ptype":"gxp_wmsgetfeatureinfo","toggleGroup":"toolGroup","actionTarget":{"target":"paneltbar","index":7}},{"ptype":"gxp_measure","toggleGroup":"toolGroup","actionTarget":{"target":"paneltbar","index":12}},{"ptype":"gxp_zoom","actionTarget":{"target":"paneltbar","index":20}},{"ptype":"gxp_zoombox","toggleGroup":"toolGroup","actionTarget":{"target":"paneltbar","index":24}},{"ptype":"gxp_navigationhistory","actionTarget":{"target":"paneltbar","index":22}},{"ptype":"gxp_zoomtoextent","actionTarget":{"target":"paneltbar","index":26}},{"ptype":"gxp_saveDefaultContext","actionTarget":{"target":"paneltbar","index":40},"needsAuthorization":true},{"ptype":"gxp_print","customParams":{"outputFilename":"mapstore-print"},"printService":"http://demo1.geo-solutions.it/geoserver/pdf/","legendPanelId":"legendPanel","actionTarget":{"target":"paneltbar","index":4}}],"viewerTools":[]}]]></data></store></Resource>',
           success: function(response, opts){
                successFlag = true;
           },
           failure:  function(response, opts){
                successFlag = false;
           }
        });
    }
    grid.getBottomToolbar().bindStore(grid.store, true);
    grid.getBottomToolbar().doRefresh();
}

/*
 * Delete resources to geostore for tests
 */
function deleteResources(auth, record){
    Ext.Ajax.request({
        url : 'http://localhost:8080/geostore/rest/resources/resource/' + record ,
        headers:{
            'Authorization' : auth
        },
        method: 'DELETE',
        success: function (result, request) {
            grid.getBottomToolbar().bindStore(grid.store, true);
            grid.getBottomToolbar().doRefresh();
            successFlag = true;
        },
        failure: function (result, request) { 
            successFlag = false;
        } 
    });
}

/*
 * Delete resources to geostore for tests
 */
function addResource(t) {
    setupTest();
    t.plan(1);
    addResources(auth, successFlag);
    t.delay_call(config.msmTimeout, function () {
        t.eq(successFlag, true, "Server works");
    });
}

function delResource(t) {
    t.plan(3);
    t.delay_call(5,
    function () {
        grid.getSelectionModel().selectLastRow();
        var record = grid.getSelectionModel().getSelected().get('id');
        deleteResources(auth, record, successFlag);
        
        t.eq(successFlag, true, "Server works: the resource has been deleted");
    },
    function () {
        grid.getSelectionModel().selectLastRow();
        var record = grid.getSelectionModel().getSelected().get('id');
        deleteResources(auth, record, successFlag);
        
        t.eq(successFlag, true, "Server works: the resource has been deleted");
    },
    function () {
        grid.getSelectionModel().selectLastRow();
        var record = grid.getSelectionModel().getSelected().get('id');
        deleteResources(auth, record, successFlag);
        
        t.eq(successFlag, true, "Server works: the resource has been deleted");
    });
}

/*
 * Delete resources to geostore for tests
 */
function delMapButtons(auth, record){
    //document.getElementById('ext-gen91_deleteBtn').click(
        //function(e){
            Ext.Ajax.request({
                url : 'http://localhost:8080/geostore/rest/resources/resource/' + record ,
                headers:{
                    'Authorization' : auth
                },
                method: 'DELETE',
                success: function (result, request) {
                    grid.getBottomToolbar().bindStore(grid.store, true);
                    grid.getBottomToolbar().doRefresh();
                    successFlag = true;
                },
                failure: function (result, request) { 
                    successFlag = false;
                } 
            });
        //}
    //); 
}

function delResources(auth, record){
    Ext.Ajax.request({
        url : 'http://localhost:8080/geostore/rest/resources/resource/' + record ,
        headers:{
            'Authorization' : auth
        },
        method: 'DELETE',
        success: function (result, request) {
            grid.getBottomToolbar().bindStore(grid.store, true);
            grid.getBottomToolbar().doRefresh();
            successFlag = true;
        },
        failure: function (result, request) { 
            successFlag = false;
        } 
    });
}

//Test Open MapComposer in edit mode
function deleteMapButton(t) {
    t.plan(1);        
    var row = grid.view.getRow(0);
    var record = grid.store.getAt(row.rowIndex);
    var rec = record.data.id;
    delResources(auth, rec, successFlag);
    t.delay_call(5, function () {
        t.eq(successFlag, true, "Server works, resource deleted");
    });
}
