/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/
GeoExt.Lang.add("en", {
    "gxp.plugins.SyntheticView.prototype": {
        title: "Synthetic View",
        elaborazioneLabel: "Processing choice",
        formulaLabel: "Formula",
        extentLabel: "Spatial scope",
        targetLabel: "Target choise",
        adrClassLabel: "ADR category",
        substanceLabel: "Substances",
        accidentLabel: "accident",
        seriousnessLabel: "Entity",
        severenessLabel: "Gravità",
        buffersLabel: "Damage areas distances",
        fieldSetTitle: "Processing",
        cancelButton: "Cancel Processing",
        processButton: "Run processing",
        analyticViewButton: "Analytic view",
        weatherLabel: "Weather conditions",  
        temporalLabel: "Time conditions",
        elabStandardLabel: "processing Standard",
        totalRiskLabel: "total risk",
        humanTitle:'Social',    
        notHumanTitle:'environmental', 
        defaultExtentLabel: "Regione Piemonte",
        targetsTextBotton: "Targets",
        areaDamageTextBotton: "Damage areas",
        roadGraphTextBotton: "Road graph",  
        wpsTitle: "Errore",
        wpsError: "Errore nella richiesta al servizio WPS",
        loadMsg: "Loading..."
    },
    "gxp.plugins.StandardProcessing.prototype": {
        title: "Processing",
        elaborazioneLabel: "Type processing",
        formulaLabel: "Formula",                
        northLabel:"north",
        westLabel:"west",
        eastLabel:"east",
        southLabel:"south",
        aoiFieldSetTitle: "Spatial scope",
        setAoiText: "Select Area",        
        setAoiTooltip: "Enables you to select the region of interest on the map",
        notAvailableProcessing: "Type of processing not yet available",
        targetLabel: "Target",
        macroTargetLabel: "Category",
        targetSetLabel: "Target choice",
        accidentSetLabel : "Accident Type",
        adrLabel: "ADR category",
        sostanzeLabel: "Substance",
        accidentLabel: "accident",
        seriousnessLabel: "Entity",
        resetButton: "Reset",
        cancelButton: "Cancel",
        viewMapButton: "Process",
        formLabel: "setting processing",
        bboxValidationTitle: "select area of interest",
        requiredMaterial: "This formula requires the specification of the substance",
        requiredAccident: "This formula requires the specification of the accident",
        requiredSeriousness: "This formula requires the specification of the entity",
        validationTitle: "Parameter error",
        invalidAOI: "The coordinates of the area of interest are not valid.",
        bboxTooBig: "The selected area is too big and the server may take a long time to respond. If you want to continue anyway, press OK.",
        weatherLabel: "Weather",  
        temporalLabel: "thunderstorms",
        conditionsFielSetLabel: "terms",   
        allClassOption: "All categories",
        allSostOption: "All substances",
        allScenOption: "all accidents",
        allEntOption: "All entities",
        allTargetOption: "All targets",
        allHumanTargetOption: "All human targets",
        allNotHumanTargetOption: "All environmental targets",
        entLieve: "slight",
        entGrave: "serious",
        humanRiskLabel: "Total Risk",
        notHumanRiskLabel: "environamental risk",
        lowRiskLabel: "low risk",
        mediumRiskLabel: "average Risk",
        highRiskLabel: "high Risk"
    },
    "gxp.plugins.TabPanelWFSGrids.prototype": {
        displayMsgPaging: "Elements {0} - {1} of {2}",
        emptyMsg: "No elements found",
        loadMsg: "Loading ..."
    },
    
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
		searchTabTitle : "Search",
        viewTabTitle : "View",
        portalTabTitle : "Portal",
		markerPopupTitle: "Details",
		mainLoadingMask: "Please wait, loading..."
    },
    
    "GeoExplorer.Composer.prototype": {
        loadMapText: "Import a Map file",
        saveMapText: "Export Map",
        exportMapText: "Publish Map",
		loadMapEmptyText: "Select a Map context file",
		loadMapUploadText: "Uploading your file...",
		uploadText: "Upload",
		loadMapWindowTitle: 'File Upload Form',
		loadMapErrorText:'File Upload Error',
        toolsTitle: "Choose tools to include in the toolbar:",
        previewText: "Preview",
        backText: "Back",
        nextText: "Next",
        loginText: "Login",
        loginErrorText: "Invalid username or password.",
        userFieldText: "User",
        passwordFieldText: "Password",
        fullScreenText: "Full Screen",
        cswMsg: 'Loading...',
		uploadWaitMsg: 'Uploading your context file...',
		uploadErrorTitle: 'File Upload Error',
		uploadEmptyText: 'Select a Map context file',
		uploadWinTitle: 'File Upload Form',
		cswFailureAddLayer: ' The layer cannot be added to the map',
		uploadButtonText: 'Upload',
        alertEmbedTitle: 'Attention',
        alertEmbedText: "Save the map before using the 'Publish Map' tool",
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
        overlayNodeText: "SIIG",
        baseNodeText: "Background"
    },
    
    "GeoExt.tree.OverlayLayerContainer" : {
        text: "SIIG"
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
        sliderRischioText: "Risk",
        sliderRischioSocialeText: "Social",
        sliderRischioAmbientaleText: "Environmental",
        minRangeSliderText: "Low",
        medRangeSliderText: "Medium",
        maxRangeSliderText: "High",
        riskTabTitle: "Theming",
        riskTabSubmitText: "Apply",
        riskTabResetText: "Defaults"
    },
    
    
	"gxp.WMSStylesDialog.prototype": {
         addStyleText: "Aggiungi",
         addStyleTip: "Aggiungi un nuovo stile",
         chooseStyleText: "Scegli stile",
         deleteStyleText: "Rimuovi",
         deleteStyleTip: "Cancella lo stile selezionato",
         editStyleText: "Modifica",
         editStyleTip: "Modifica lo stile selezionato",
         duplicateStyleText: "Duplica",
         duplicateStyleTip: "Duplica lo stile selezionato",
         addRuleText: "Aggiungi",
         addRuleTip: "Aggiungi una nuova regola",
         newRuleText: "Nuova Regola",
         deleteRuleText: "Rimuovi",
         deleteRuleTip: "Cancella la regola selezionata",
         editRuleText: "Modifica",
         editRuleTip: "Modifica le regola selezionata",
         duplicateRuleText: "Duplica",
         duplicateRuleTip: "Duplica la regola selezionata",
         cancelText: "Cancella",
         saveText: "Salva",
         styleWindowTitle: "User Style: {0}",
         ruleWindowTitle: "Style Rule: {0}",
         stylesFieldsetTitle: "Stili",
         rulesFieldsetTitle: "Regole"
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
	    contextMsg: "Loading..."
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
        printOsmText: "OpenStreetMap Background?"
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
        nextPageTip: "Last page",
        totalMsg: "Total: {0} records"
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
        northLabel:"North",
        westLabel:"West",
        eastLabel:"East",
        southLabel:"South",
        setAoiText: "SetROI",
        setAoiTooltip: "Enable the SetBox control to draw a ROI (BBOX) on the map",
        attributeEnablement: "Query by Attribute",
        attributeEnablementMsg: "Invalid search Type! To use this you have to select 'Feature' type and to select a vector layer before.",
        searchType: "Base Settings",
        typeLabel: "Type",
        featureLabel: "Max Features"
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
    "gxp.form.AOIFieldset.prototype":{
        northLabel:"North",
        westLabel:"West",
        eastLabel:"East",
        southLabel:"South",
        title: "Territorial",
        setAoiText: "Select area",        
        setAoiTooltip: "Enable the selection of the region of interest on the map",
        waitEPSGMsg: "Loading... please wait"
    },
    "gxp.form.SelDamageArea.prototype":{
        selAreaDamageTitle: "Area selection",
        selAreaDamageLabel: "Selection method",
        selAreaDamageEmptyText: "--- Choose type ---",
        comboPolygonSelection: 'Polygon',
        comboCircleSelection: 'Circle',
        comboBufferSelection: "Buffer"
    },

    "gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Buffer Range",
		bufferFieldSetTitle: "Buffer",
		coordinatePickerLabel: "Coordinates",
		draweBufferTooltip: "Draw the Buffer"
	},

	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordinates',
		pointSelectionButtionTip: 'Click to enable point selection',
		latitudeEmptyText: 'Latitude',
		longitudeEmptyText: 'Longitude'
	}
});
