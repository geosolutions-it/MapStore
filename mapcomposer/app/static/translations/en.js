/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("en", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Zoom Level: {zoom}</div><div>Scale: 1:{scale}</div>",
        loadConfigErrorText: "Trouble reading saved configuration: <br />",
        loadConfigErrorDefaultText: "Server Error.",
        xhrTroubleText: "Communication Trouble: Status ",
        layersText: "Layers",
		legendText: "Legend",
        titleText: "Title",
        zoomLevelText: "Zoom level",
        saveErrorText: "Trouble saving: ",
        bookmarkText: "Bookmark URL",
        permakinkText: "Permalink",
        appInfoText: "Credits",
        aboutText: "About GeoExplorer",
        mapInfoText: "Map Info",
        descriptionText: "Description",
        contactText: "Contact",
        aboutThisMapText: "About this Map",
		resetButtonTooltip: "Reset Page",
		helpButtonTooltip: "Help",
        searchTabTitle : "Search",
        viewTabTitle : "View",
        portalTabTitle : "Portal",
		markerPopupTitle: "Details",
		mainLoadingMask: "Please wait, loading..."
    },
    
    "GeoExplorer.Composer.prototype": {
		uploadText: "Upload",
        backText: "Back",
        nextText: "Next",
        loginText: "Login",
        loginErrorText: "Invalid username or password.",
        userFieldText: "User",
        passwordFieldText: "Password",
        fullScreenText: "Full Screen",
        cswMsg: 'Loading...',
		cswFailureAddLayer: ' The layer cannot be added to the map',
	    cswZoomToExtentMsg: "BBOX not available",
		cswZoomToExtent: "CSW Zoom To Extent"
    },

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Layer"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Add layers",
        addActionTip: "Add layers",
        addServerText: "Add a New Server",
        addButtonText: "Add layers",
        untitledText: "Untitled",
        addLayerSourceErrorText: "Error getting WMS capabilities ({msg}).\nPlease check the url and try again.",
        availableLayersText: "Available Layers",
        expanderTemplateText: "<p><b>Abstract:</b> {abstract}</p>",
        panelTitleText: "Title",
        layerSelectionText: "View available data from:",
        doneText: "Done",
        removeFilterText: "Clear filter", 
        filterEmptyText: "Filter",
        uploadText: "Upload Data"
    },
    
	 "gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Remove overlays",
	    removeOverlaysActionTip: "Removes all overlays from the map",
	    removeOverlaysConfirmationText: "Are you sure you want to remove all loaded overlays from the map?"
    }, 

    "gxp.plugins.BingSource.prototype": {
        title: "Bing Layers",
        roadTitle: "Bing Roads",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial With Labels"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Please enter the Google API key for ",
        menuText: "3D Viewer",
        tooltip: "Switch to 3D Viewer"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Layers",
        roadmapAbstract: "Show street map",
        satelliteAbstract: "Show satellite imagery",
        hybridAbstract: "Show imagery with street names",
        terrainAbstract: "Show street map with terrain"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Layer Properties",
        toolTip: "Layer Properties"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Layers",
        overlayNodeText: "Default",
        baseNodeText: "Background"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Show Legend",
        tooltip: "Show Legend"
    },    
    
    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Length",
        areaMenuText: "Area",
        lengthTooltip: "Measure length",
        areaTooltip: "Measure area",
        measureTooltip: "Measure",
        bearingMenuText: "Bearing ",
        bearingTooltip: "Measure Bearing"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Pan Map",
        tooltip: "Pan Map"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom To Previous Extent",
        nextMenuText: "Zoom To Next Extent",
        previousTooltip: "Zoom To Previous Extent",
        nextTooltip: "Zoom To Next Extent"
		
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap Layers",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Print Map",
        tooltip: "Print Map",
        previewText: "Print Preview",
        notAllNotPrintableText: "Not All Layers Can Be Printed",
        nonePrintableText: "None of your current map layers can be printed",
        notPrintableLayersText: "Please remove these layers and all the markers before print. Following layers can not be printed:"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Layers",
        osmAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Imagery"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Remove layer",
        removeActionTip: "Remove layer"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Get Feature Info",
        popupTitle: "Feature Info",
		noDataMsg: "No data returned from the server",
		maskMessage: "Getting Feature Info..."
    },
	
	"gxp.plugins.WMSGetFeatureInfoMenu.prototype": {
        infoActionTip: "Get Feature Info",
        popupTitle: "Feature Info",
		noDataMsg: "No data returned from the server",
		maskMessage: "Getting Feature Info...",
		activeActionTip:"Active info on selected layer"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom In",
        zoomOutMenuText: "Zoom Out",
        zoomInTooltip: "Zoom In",
        zoomOutTooltip: "Zoom Out"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom To Max Extent",
        tooltip: "Zoom To Max Extent"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom to layer extent",
        tooltip: "Zoom to layer extent"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom to layer extent",
        tooltip: "Zoom to layer extent"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "About",
        titleText: "Title",
        nameText: "Name",
        descriptionText: "Description",
        displayText: "Display",
        opacityText: "Opacity",
        formatText: "Format",
        transparentText: "Transparent",
        cacheText: "Cache",
        cacheFieldText: "Use cached version",
        stylesText: "Styles",
        summaryText: "Statistics",
        summaryInfoText: "Current Viewport Raster Statistics",
        loadMaskMsg: "Fetching data ...",
        noDataMsg: "No data available in current view",
        refreshText: "Refresh"
    },

    "gxp.NewSourceWindow.prototype": {
        title: "Add New Server...",
        cancelText: "Cancel",
        addServerText: "Add Server",
        invalidURLText: "Enter a valid URL to a WMS endpoint (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Contacting Server..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Zoom level"
    },
    
    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Add Group",
	    addGroupActionTip: "Add a new group in the layer tree",   
	    addGroupDialogTitle: "New Group", 
	    addGroupFieldSetText: "Group Name",
	    addGroupFieldLabel: "New Group",
	    addGroupButtonText: "Add Group",
	    addGroupMsg: "Please enter a group name"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Remove Group",
	    removeGroupActionTip: "Remove a group from the layer tree",
	    removeGroupActionTip: "Removes the selected group and own layers from the map",
	    removeGroupConfirmationText: "Are you sure you want to remove the selected group ? The all layers inside this group will be removed from the map."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Save default context",
	    saveDefaultContextActionTip: "Save Map context",
	    contextSaveSuccessString: "Context saved succesfully",
	    contextSaveFailString: "Context not saved succesfully",
	    contextMsg: "Loading...",
		userLabel: "User",	
		passwordLabel: "Password", 	
		loginLabel: "Login",	
		mapMetadataTitle: "Insert Map Metadata",	
		mapMedatataSetTitle: "Map Metadata",	
		mapNameLabel: "Name",	
		mapDescriptionLabel: "Description",
		addResourceButtonText: "Add Map"
    },
    "gxp.plugins.GeoReferences.prototype": {
        initialText: "Select an area",
        menuText: "GeoReferences",
        tooltip: "GeoReferences"
    },
    "gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box In",
        zoomOutMenuText: "Zoom Box Out",
        zoomInTooltip: "Zoom Box In",
        zoomOutTooltip: "Zoom Box Out"
    },
    "GeoExt.ux.PrintPreview.prototype":{
        paperSizeText: "Paper size:",
        resolutionText: "Resolution:",
        printText: "Print",
        emptyTitleText: "Enter map title here.",
        includeLegendText: "Include legend?",
        legendOnSeparatePageText: "Legend on separate page?",
        compactLegendText: "Compact legend?",	
        emptyCommentText: "Enter comments here.",
        creatingPdfText: "Creating PDF...",
		graticuleFieldLabelText: 'Active graticule',
		defaultTabText: "Default",
		legendTabText: "Legend"
    },
	
    "GeoExt.ux.LegendStylePanel.prototype":{
		iconsSizeText: "Icons size",
		fontSizeText: "Font size",
		fontFamilyText: "Font Family",
		forceLabelsText: "Force label",
		dpiText: "Dpi",
		fontStyleText: "Font style",
		fontEditorText: "Label config",
		sizeText: "Size"
    },
    
    "GeoExt.ux.GraticuleStylePanel.prototype":{
        graticuleFieldLabelText: 'Active graticule',
        sizeText: "Font size",
        colorText: "Color",
        fontFamilyText: "Font Family",
        fontStyleText: "Font style",
        fontEditorText: "Label config"
    },
	
    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "View metadata",
        geonetworkSearchActionTip: "View metadata"
    },
    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText:  "Group Properties",
        groupPropertiesActionTip:  "Group Properties",
        groupPropertiesDialogTitle: "Group Properties - ",
        groupPropertiesFieldSetText: "Group Name",
        groupPropertiesFieldLabel: "New Group Name",
        groupPropertiesButtonText: "Done",
        groupPropertiesMsg: "Please enter a group name"
    },
    "gxp.plugins.Login.prototype":{
        loginText: "Login",
        loginErrorText: "Invalid username or password.",
        userFieldText: "User",
        passwordFieldText: "Password"
    },
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Display on map",
        firstPageTip: "First page",
        previousPageTip: "Previous page",
        zoomPageExtentTip: "Zoom to page extent",
        nextPageTip: "Next page",
        lastPageTip: "Last page",
        title: "Features",
        totalMsg: "Total: {0} records",
        displayExportCSVText: "Export to CSV",
        exportCSVSingleText: "Single Page",
        exportCSVMultipleText: "Whole Page",
        failedExportCSV: "Failed to find response for output format CSV",
        invalidParameterValueErrorText: "Invalid Parameter Value",
		zoomToFeature: "Zoom To Feature",
        comboFormatMethodLabel: "Format",
        comboFormatEmptyText: "Please, select format",
        noFormatTitleText: "Incorrect format",
        noFormatBodyText: "Please, select a valid format",
        exportTitleText: "Export"
    },
    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Query",
        queryMenuText: "Query layer",
        queryActionTip: "Query the selected layer",
        queryByLocationText: "Region Of Interest",
        currentTextText: "Current extent",
        queryByAttributesText: "Query by attributes",
        queryMsg: "Querying...",
        cancelButtonText: "Reset",
        noFeaturesTitle: "No Match",
        noFeaturesMessage: "Your query did not return any results.",
        title: "Search",
        attributeEnablement: "Query by Attribute",
        attributeEnablementMsg: "Invalid search Type! To use this you have to select 'Feature' type and to select a vector layer before.",
        searchType: "Base Settings",
        typeLabel: "Type",
        featureLabel: "Max Features"     
    },   

    "gxp.plugins.BBOXQueryForm.prototype": {
        selectionMethodFieldSetComboTitle: "Set Selection Method",
        comboEmptyText: "Select a method..",
        comboSelectionMethodLabel: "Selection",
        comboPolygonSelection: 'Polygon',
        comboCircleSelection: 'Circle',
        comboBBOXSelection: 'Bounding Box',
		errorBBOXText: "The selected BBox is invalid!",
        errorDrawPolygonText: "You have to draw a Polygon",
        errorDrawCircleText: "You have to draw a Circle",     
        errorDrawTitle: "Query error",
	    errorBufferTitle: "Buffer Error",
		errorBufferText: "The selected buffer is invalid!",
		areaLabel: "Area",	
		perimeterLabel: "Perimeter",	
		radiusLabel: "Radius",	
		centroidLabel: "Cenroid",	
		selectionSummary: "Selection Summary"
	},
	
    "gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Buffer Range",
		bufferFieldSetTitle: "Buffer",
		coordinatePickerLabel: "Coordinates",
		draweBufferTooltip: "Draw the Buffer"
	},
    
    "gxp.form.BBOXFieldset.prototype":{
        northLabel:"North",
        westLabel:"West",
        eastLabel:"East",
        southLabel:"South",
        setAoiText: "SetROI",
        waitEPSGMsg: "Please Wait...",
        setAoiTooltip: "Enable the SetBox control to draw a ROI (BBox) on the map",
        title: "Region of Interest"
    },
    
    "gxp.FilterBuilder.prototype":{
        preComboText: "Match",
        postComboText: "of the following:",
        addConditionText: "add condition",
        addGroupText: "add group",
        removeConditionText: "remove condition"
    },
    
    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Your map is ready to be published to the web! Simply copy the following HTML to embed the map in your website:",
        heightLabel: "Height",
        widthLabel: "Width",
        mapSizeLabel: "Map Size",
        miniSizeLabel: "Mini",
        smallSizeLabel: "Small",
        premiumSizeLabel: "Premium",
        largeSizeLabel: "Large"
    },
    "gxp.plugins.GoogleGeocoder.prototype": {
        addMarkerTooltip: "Reset Marker"
    },
	"gxp.plugins.DynamicGeocoder.prototype": {
        addMarkerTooltip: "Reset Marker",
        emptyText: "Geocoder..."
    },
	"gxp.plugins.ReverseGeocoder.prototype": {
        buttonText: "Address",
        emptyText: "Address...",
		errorMsg: "No address found",
		waitMsg: "Wait please...",
		addressTitle: "Address found"
    },
	"gxp.form.WFSSearchComboBox.prototype": {
		emptyText:"Search",
		loadingText: "Searching"
	},
	"gxp.form.ContextSwitcher.prototype":{
		switchActionTip : "Switch Mappa",
		switchSaveAlert: "All unsaved data will be lost.",
		switchConfirmationText : "Are You sure to change map?"

	},
	"gxp.form.LanguageSwitcher.prototype":{
		switchActionTip : "Switch Language",
		switchConfirmationText : "Are you sure to change Language?"//Are you sure to change Language? All unsaved data will be lost
	},
	
	"gxp.plugins.MarkerEditor.prototype":{
		markerName:'Markers',
		copyText:'Copy the text below and paste it in  the "Import Markers" window in a second time ...',
		pasteText:'Paste the text in the text area and click on imoport.',
		addToTheMapText:'Add To the Map',
		updateText: 'Update',
		resetText:'Reset',
		removeText:'Remove',
		compositeFieldTitle:  'Title',
		compositeFieldLabel: 'Label',
		coordinatesText: 'Coordinates',
		contentText: 'Content',
		gridColTitle: 'Title',
		gridColLabel: 'Label',
		gridColLat: 'Lat',
		gridColLon: 'Lon',
		gridColContent: 'Content',	
		exportBtn:  'Export Markers',
		importBtn: 'Import Markers',
		removeAllBnt: 'Remove All',
		markerChooserTitle:'Choose a marker',
		useThisMarkerText:'Use this Marker',
		selectMarkerText:'Select Marker',
		insertImageText:'Insert Image',
		imageUrlText:'Image URL',
		importGeoJsonText:'Import GeoJson',
		errorText:"Error",
		notWellFormedText:"The Text you added is not well formed. Please check it"
	},
	
	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordinates',
		pointSelectionButtionTip: 'Click to enable point selection',
		latitudeEmptyText: 'Latitude',
		longitudeEmptyText: 'Longitude'
	},
	
	"gxp.plugins.AddLayer.prototype":{
		waitMsg: "Please Wait ...",
		capabilitiesFailureMsg: " The WMS Capabilities cannot be added due to problems service side"
    },
    
    "gxp.plugins.Geolocate.prototype":{
        geolocateMenuText: "Geolocate",
        geolocateTooltip: "Locate my position",
        trackMenuText: "Track Position",
        trackTooltip: "Track my position",
        waitMsg: "Locating...",
        errorMsg: "Geolocation is not supported by your browser"
    },
	
	"gxp.plugins.GeoLocationMenu.prototype": {
	    initialText: "Select an area",
        menuText: "GeoReferences",
        tooltip: "GeoReferences",
        addMarkerTooltip: "Reset Marker",
        emptyText: "Geocoder...",
        buttonText: "Address",
        emptyText: "Address...",
		errorMsg: "No address found",
		waitMsg: "Wait please...",
		addressTitle: "Address found",
		geolocate: {
			"geolocateMenuText": "Geolocate",
			"geolocateTooltip": "Locate my position",
			"trackMenuText": "Track Position",
			"trackTooltip": "Track my position",
			"waitMsg": "Locating...",
			"errorMsg": "Geolocation is not supported by your browser"
		},
		actionText: "GeoLocations"
    },
    
    "gxp.plugins.ImportExport.prototype":{
        importexportLabel: "Import / Export",
		labels: {
			"map": {
				"saveText" : "Export Map",
				"loadText" : "Import Map",
				"uploadWindowTitle" : "Import Map Context file",
				"downloadWindowTitle" : "Export Map Context file"
			},
			"kml/kmz": {
				"saveText" : "Export KML",
				"loadText" : "Import KML/KMZ",
				"uploadWindowTitle" : "Import KML/KMZ file",
				"downloadWindowTitle" : "Export KML file",
				"kmlExportTitleText": "KML/KMZ Export",
				"layerEmptyText": "The selected Layer is empty",
				"notVectorlayerText": "Please select only Vector Layer",
				"notLayerSelectedText": "Please select a Vector Layer"
			} 
        }
    },
   
    "gxp.MapFileUploadPanel" :{
		fileLabel: "Map file",
		fieldEmptyText: "Browse for Map context files...",
		uploadText: "Upload",
		waitMsgText: "Uploading your data...",
		resetText: "Reset",
		failedUploadingTitle: "File Upload Error"
    },
   
    "gxp.MapFileDownloadPanel" :{
		buttonText: "Export Map",
		filenameLabel: "Map file name",
		fieldEmptyText: "context.map",
		waitMsgText: "Generating Map Context File...",
		resetText: "Reset",
		failedUploadingTitle: "Cannot generate Map file",
		saveErrorText: "Trouble saving: "
    },
   
    "gxp.KMLFileDownloadPanel" :{
		buttonText: "Export",
		filenameLabel: "KML file name",
		fieldEmptyText: "export.kml",
		waitMsgText: "Generating KML...",
		invalidFileExtensionText: "File extension must be one of: ",
		resetText: "Reset",
		failedUploadingTitle: "Cannot generate KML file"
    },
   
    "gxp.KMLFileUploadPanel" :{
		fileLabel: "KML file",
		fieldEmptyText: "Browse for KML or KMZ files...",
		uploadText: "Upload",
		waitMsgText: "Uploading your data...",
		invalidFileExtensionText: "File extension must be one of: ",
		resetText: "Reset",
		failedUploadingTitle: "Cannot upload file",
		layerNameLabel: "Layer Name"
    },

	"gxp.plugins.PrintSnapshot.prototype" :{
		noSupportedLayersErrorMsg: "Error occurred while generating the Map Snapshot: No Supported Layers have been found!",
		generatingErrorMsg: "Error occurred while generating the Map Snapshot",
		printStapshotTitle: "Print Snapshot",
		serverErrorMsg: "Error occurred while generating the Map Snapshot: Server Error",
		menuText: "Snapshot",
		tooltip: "Snapshot"
	},
	
	"gxp.plugins.EmbedMapDialog.prototype" :{
		exportMapText: "Link Map",		
		toolsTitle: "Choose tools to include in the toolbar:",		
		alertEmbedTitle: "Attention",		
		alertEmbedText: "Save the map before using the 'Publish Map' tool",			
		previewText: "Preview",				
		embedCodeTitle: "Embed Code",
		embedURL: "Direct URL",		
		urlLabel: "URL",
		showMapTooltip: "Show in a new Window",
        loadMapText: "Load this Map (install application first)",
        downloadAppText: "Install Application",
        loadInMapStoreMobileText: "Mobile",
        openImageInANewTab: "Open Image in a New Tab"
	},
    
    "gxp.widgets.form.SpatialSelectorField.prototype" :{
        title : "Region Of Interest",
        selectionMethodLabel : "Selection Method",
        comboEmptyText : "Select a method..",
        comboSelectionMethodLabel : "Selection",
        northLabel : "North",
        westLabel : "West",
        eastLabel : "East",
        southLabel : "South",
        setAoiTitle : "Bounding Box",
        setAoiText : "Draw Box",
        setAoiTooltip : "Enable the SetBox control to draw a ROI (Bounding Box) on the map",
        areaLabel : "Area",
        perimeterLabel : "Perimeter",
        radiusLabel : "Radius",
        centroidLabel : "Centroid",
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Selected Locations",
        geocodingPanelBtnRefreshTxt : "Show Geometries",
        geocodingPanelBtnDestroyTxt : "Hide Geometries",
        geocodingPanelBtnDeleteTxt : "Delete Location",
        geocodingPanelLocationHeader: "Location",
        geocodingPanelCustomHeader: "Parent",
        geocodingPanelGeometryHeader: "Geometry WKT",
        geocodingPanelBtnSelectAllTxt : "Check All", 
        geocodingPanelBtnDeSelectAllTxt : "Uncheck All", 
        geocodingPanelMsgRemRunningTitle : "Remove a Locations",
        geocodingPanelMsgRemRunningMsg : "Would you like to remove the selected locations from the list?",
        geocodingFieldLabel : "Search a Location",
        geocodingFieldEmptyText : "Type Location here...",
        geocodingFieldBtnAddTooltip : "Add Location to the List",
        geocodingFieldBtnDelTooltip : "Clear Field",
        selectionSummary : "Selection Summary",
        geocoderSelectorsLabels: ['Geometry Union', 'Administrative Area List', 'Administrative Area Subs'],
        selectionReturnTypeLabel: "Return Type"
    },
    
    "gxp.plugins.WFSGrid.prototype":{
        displayMsgPaging: "Displaying topics {0} - {1} of {2}",
        emptyMsg: "No topics to display",
        loadMsg: "Please Wait...",
        zoomToTooltip: 'Zoom to topic'        
    },
    
    "gxp.plugins.TabPanelWFSGrids.prototype":{
        displayMsgPaging: "Elements {0} - {1} of {2}",
        emptyMsg: "No elements found",
        noRecordFoundLabel: "No elements found",
        loadMsg: "Loading ..."
    },
    
    "gxp.plugins.spatialselector.SpatialSelector.prototype" :{
        titleText : "Region Of Interest",
        selectionMethodLabel : "Selection Method",
        comboEmptyText : "Select a method..",
        comboSelectionMethodLabel : "Selection"
    },
    
    "gxp.widgets.form.spatialselector.SpatialSelectorMethod.prototype" :{
        areaLabel : "Area",
        perimeterLabel : "Perimeter",
        lengthLabel: "Length",
        radiusLabel : "Radius",
        centroidLabel : "Centroid",
        selectionSummary: "Selection Summary",
        geometryOperationText: "Geometry operation",
        geometryOperationEmptyText: "Select a operation",
        distanceTitleText: "Distance",
        distanceUnitsTitleText: "Distance units",
        noOperationTitleText: "No valid operation",
        noOperationMsgText: "Please, select an operation before query",
        noCompleteMsgText: "Please, complete form before query"
    },
    
    "gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.prototype" :{
        name  : 'BBOX',
        label : 'Bounding Box',
        northLabel : "North",
        westLabel : "West",
        eastLabel : "East",
        southLabel : "South",
        setAoiTitle : "Bounding Box",
        setAoiText : "Draw Box",
        setAoiTooltip : "Enable the SetBox control to draw a ROI (Bounding Box) on the map"
    },
    
    "gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.prototype" :{
        name  : 'Buffer',
        label : 'Buffer',
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X'
    },
    
    "gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod.prototype" :{
        name  : 'Circle',
        label : 'Circle'
    },
    
    "gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.prototype" :{
        name  : 'Geocoding',
        label : 'Geocoding',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Selected Locations",
        geocodingPanelBtnRefreshTxt : "Show Geometries",
        geocodingPanelBtnDestroyTxt : "Hide Geometries",
        geocodingPanelBtnDeleteTxt : "Delete Location",
        geocodingPanelLocationHeader: "Location",
        geocodingPanelCustomHeader: "Parent",
        geocodingPanelGeometryHeader: "Geometry WKT",
        geocodingPanelBtnSelectAllTxt : "Check All", 
        geocodingPanelBtnDeSelectAllTxt : "Uncheck All", 
        geocodingPanelMsgRemRunningTitle : "Remove a Locations",
        geocodingPanelMsgRemRunningMsg : "Would you like to remove the selected locations from the list?",
        geocodingFieldLabel : "Search a Location",
        geocodingFieldEmptyText : "Type Location here...",
        geocodingFieldBtnAddTooltip : "Add Location to the List",
        geocodingFieldBtnDelTooltip : "Clear Field",
        selectionSummary : "Selection Summary"
    },
    
    "gxp.widgets.form.spatialselector.PolygonSpatialSelectorMethod.prototype" :{
        name  : 'Polygon',
        label : 'Polygon'
    },
    
    "gxp.plugins.spatialselector.Geocoder.prototype" :{
        titleText: "Geocoder",
        searchText: "Search",
        searchTpText: "Search selected location and zoom in on map",
        resetText: "Reset",
        resetTpText: "Reset location search",
        translatedKeys: {
            "name": "Street",
            "number": "Number"
        }
    },
	
	"gxp.plugins.ResourceStatus.prototype":{
		rootNodeText: "Imported Resources",
		serviceErrorTitle: "Service Error",
		tabTitle: "Imported",
		layerNodeName: "Layers",
		serviceNodeName: "Services"
    },
	
	"gxp.plugins.SpatialSelectorQueryForm.prototype":{
        noFilterSelectedMsgTitle: "No filter selected",    
        noFilterSelectedMsgText: "You must select at least one filter",    
        invalidRegexFieldMsgTitle: "Invalid Fields",    
        invalidRegexFieldMsgText: "One or more fields are incorrect!"
    },
	
	"gxp.plugins.FeatureManager.prototype":{
        noValidWmsVersionMsgTitle: 'No valid WMS version',    
        noValidWmsVersionMsgText: "The queryForm plugin doesn't work with WMS Source version: "
    },
    
    "gxp.plugins.CategoriesInitializer.prototype":{
        geostoreInitializationTitleText: "Initializing Fail",
        geostoreInitializationText: "Geostore response is not the expected",
        notInitializedCategories: "Missing categories: '{0}'. Do you want to create it?",
        userFieldText: "User",
        passwordFieldText: "Password",
        acceptText: "Create",
        cancelText: "Cancel",
        notInitializedCategoriesWithCredentials: "<div class='initCategoriesMessage'>If you are an administrator please insert your credentials to create these categories: '{0}'</div>"
    },
    "gxp.data.WMTSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "No layer in the current map projection is available on this server",
        warningTitle: "Warning"
    },
    "gxp.data.TMSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "No layer in the current map projection is available on this server",
        warningTitle: "Warning"
    }
});
