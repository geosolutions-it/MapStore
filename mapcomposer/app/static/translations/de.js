/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("de", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Zoomlevel: {zoom}</div><div>Maßstab: 1:{scale}</div>",
        loadConfigErrorText: "Die gespeicherte Gestaltung kann nicht gelesen werden : <br />",
        loadConfigErrorDefaultText: "Serverfehler.",
        xhrTroubleText: "Verbindungsfehler: Status ",
        layersText: "Stufen",
		legendText: "Legende",
		searchText: "Suche",
        titleText: "Überschrift",
        zoomLevelText: "Zoomlevel",
        saveErrorText: "Speicherungsprobleme: ",
        bookmarkText: "URL des Lesezeichens",
        permakinkText: "Permalink",
        appInfoText: "Kredite",
        aboutText: "About GeoExplorer",
        mapInfoText: "Planinfo",
        descriptionText: "Beschreibung",
        contactText: "Kontakte",
        aboutThisMapText: "Apropos dieser Karte",
        searchTabTitle : "Portal",
        viewTabTitle : "Ansicht",
		markerPopupTitle: "Details",
		mainLoadingMask: "Bitte warten ..."
    },
    
    "GeoExplorer.Composer.prototype": {
		uploadText: "Upload",
        backText: "Zurück",
        nextText: "Nächste",
        loginText: "Login",
        loginErrorText: "Username oder password ungültig.",
        userFieldText: "User",
        passwordFieldText: "Password",
        fullScreenText: "Vollbild",
        cswMsg: 'Loading...',
		cswFailureAddLayer: 'Die Schicht kann der Karte nicht hinzugefügt werden',
	    cswZoomToExtentMsg: "BBOX nicht verfügbar",
		cswZoomToExtent: "CSW Zoom erweitern"
    },

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Ebene"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Schicht hinzufügen",
        addActionTip: "Schicht hinzufügen",
        addServerText: "Neuen Server hinzufügen",
        addButtonText: "Schichten hinzufügen",
        untitledText: "Ohne Überschrift",
        addLayerSourceErrorText: "Fehler beim finden der WMS capabilities ({msg}).\nBitte die Url kontrollieren und nochmals versuchen.",
        availableLayersText: "Vorhandene Schichten",
        expanderTemplateText: "<p><b>Zusammenfassung:</b> {abstract}</p>",
        panelTitleText: "Überschrift",
        layerSelectionText: "Daten anzeigen die hier vorhanden sind:",
        doneText: "Erledigt",
       removeFilterText: "Filter entfernen", 
       filterEmptyText: "Filter",
        uploadText: "Datei-Upload"
    },

    "gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Daraufgelegene Schichten entfernen",
	    removeOverlaysActionTip: "Alle auf der Karte gelegenen Schichten entfernen",
	    removeOverlaysConfirmationText: "Sind Sie sicher alle auf der Karte geladenen Schichten entfernen zu wollen?"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing Schichten",
        roadTitle: "Bing Straßen",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial mit Etikett"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Bitte die Google API-Schlüssel eingeben für ",
        menuText: "3D Viewer",
        tooltip: "zu 3D Viewer wechseln"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google Schichten",
        roadmapAbstract: "Straßenkarte anzeigen",
        satelliteAbstract: "Satellitenbilder anzeigen",
        hybridAbstract: "Bilder mit Straßennamen anzeigen",
        terrainAbstract: "Straßenkarte mit Boden anzeigen"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Schichteneigenschaften",
        toolTip: "Schichteneigenschaften"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Schichten",
        overlayNodeText: "Default",
        baseNodeText: "Hintergrund"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Legende",
        tooltip: "Legende"
    },    
    
    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Länge",
        areaMenuText: "Fläche",
        lengthTooltip: "Länge messen",
        areaTooltip: "Fläche messen",
        measureTooltip: "Messen",
        bearingMenuText: "Strecke",
        bearingTooltip: "Strecke messen"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Karte ziehen",
        tooltip: "Karte ziehen"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom zur vorherigen Erweiterung",
        nextMenuText: "Zoom zur nächsten Erweiterung",
        previousTooltip: "Zoom zur vorherigen Erweiterung",
        nextTooltip: "Zoom zur nächsten Erweiterung"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap-Schichten",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Karte drucken",
        tooltip: "Karte drucken",
        previewText: "Druckvorschau",
        notAllNotPrintableText: "Nicht alle Schickten können gedruckt werden",
        nonePrintableText: "Keine der aktuellen Schichten dieser Karte kann gedruckt werden",
		notPrintableLayersText: "Diese Schichten und alle Marker vor dem Drucken entfernen. Danach die nicht druckbaren Schichten:"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Schichten",
        osmAttribution: "Tiles gewährt von <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles gewährt von <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Bilder"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Schicht entfernen",
        removeActionTip: "Schicht entfernen"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Info erhalten",
        popupTitle: "Info",
		noDataMsg: "Keine Daten vom Server erhalten"
    },
	
	"gxp.plugins.WMSGetFeatureInfoMenu.prototype": {
        infoActionTip: "Informationen erhalten",
        popupTitle: "Info",
		noDataMsg: "Keine Daten vom Server erhalten",
		activeActionTip: "Informationen über ausgewählte Schicht"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom vorwärts",
        zoomOutMenuText: "Zoom zurück",
        zoomInTooltip: "Zoom vorwärts",
        zoomOutTooltip: "Zoom zurück"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom höchste Erweiterung",
        tooltip: "Zoom höchste Erweiterung"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom zur Schicht",
        tooltip: "Zoom zur Schicht"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom zur Schicht",
        tooltip: "Zoom zur Schicht"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "Infos",
        titleText: "Überschrift",
        nameText: "Name",
        descriptionText: "Beschreibung",
        displayText: "Display",
        opacityText: "Opazität ",
        formatText: "Format",
        transparentText: "Transparenz",
        cacheText: "Cache",
        cacheFieldText: " Benutze die Cache-Version",
        stylesText: "Stil",
		summaryText: "Statistik",
        summaryInfoText: "Aktuelles Ansichtsfenster Raster Statistik",
        loadMaskMsg: "Daten abrufen ...",
        noDataMsg: "Keine Daten vorhanden in aktuellen Ansicht",
        refreshText: "Erfrischen"
    },

    "gxp.WMSStylesDialog.prototype": {
         addStyleText: "Hinzufügen",
         addStyleTip: "Neuen Stil hinzufügen",
         chooseStyleText: "Stil auswählen",
         deleteStyleText: "Entfernen",
         deleteStyleTip: "Ausgewählten Stil löschen",
         editStyleText: "Bearbeiten",
         editStyleTip: "Ausgewählten Stil bearbeiten",
         duplicateStyleText: "Duplikat",
         duplicateStyleTip: "Duplikat des ausgeählten Stils",
         addRuleText: "Hinzufügen",
         addRuleTip: "Neue Regel hinzufügen",
         newRuleText: "Neue Regel",
         deleteRuleText: "Entfernen",
         deleteRuleTip: "Ausgewählte Regel löschen",
         editRuleText: "Bearbeiten",
         editRuleTip: "Ausgewählte Regel bearbeiten",
         duplicateRuleText: "Duplikat",
         duplicateRuleTip: "Duplikat der ausgwählten Regel",
         cancelText: "Löschen",
         saveText: "Speichern",
         styleWindowTitle: "User Style: {0}",
         ruleWindowTitle: "Style Rule: {0}",
         stylesFieldsetTitle: "Stile",
         rulesFieldsetTitle: "Regeln"
    },

    "gxp.NewSourceWindow.prototype": {
        title: "Neuen Server hinzufügen...",
        cancelText: "Löschen",
        addServerText: "Server hinzufügen",
        invalidURLText: "Als WMS endpoint gültige Url eingeben (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Verbindungsversuch zum Server..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Zoomstufe"
    },

    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Gruppe hinzufügen",
	    addGroupActionTip: "Neue Gruppe dem Baum der Schichten hinzufügen",   
	    addGroupDialogTitle: "Neue Gruppe", 
	    addGroupFieldSetText: "Gruppenname",
	    addGroupFieldLabel: "Neue Gruppe",
	    addGroupButtonText: "Gruppe hinzufügen",
	    addGroupMsg: "Bitte den Gruppennamen eingeben"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Gruppe entfernen",
	    removeGroupActionTip: "Entferne die Gruppe vom Baum der Schichten",
	    removeGroupActionTip: "Entferne von der Karte di ausgewählte Gruppe und deren Schichten",
	    removeGroupConfirmationText: "Sind Sie sicher die ausgewählte Gruppe entfernen zu wollen? Alle beinhalteten Schichten werden von der Karte entfernt."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Kontext speichern",
	    saveDefaultContextActionTip: "Karten-Kontext speichern",
	    contextSaveSuccessString: "Kontext richtig gespeichert",
	    contextSaveFailString: "Kontext nicht richtig gespeichert",
	    contextMsg: "Loading...",
		userLabel: "Benutzer",	
		passwordLabel: "Kennwort", 	
		loginLabel: "Anmelden",	
		mapMetadataTitle: "Legen Karte Metadaten",	
		mapMedatataSetTitle: "Karte Metadaten",	
		mapNameLabel: "Name",	
		mapDescriptionLabel: "Beschreibung",
		addResourceButtonText: "In Map"
    },
	
    "gxp.plugins.GeoReferences.prototype": {
        initialText: "Fläche auswählen",
        menuText: "Geo Referenzen",
        tooltip: "Geo Referenzen"
    },

    "gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box Vorwärts",
        zoomOutMenuText: "Zoom Box Zurück",
        zoomInTooltip: "Zoom Box Vorwärts",
        zoomOutTooltip: "Zoom Box Zurück"
    },

    "GeoExt.ux.PrintPreview.prototype":{
	    paperSizeText: "Papierformat:",
	    resolutionText: "Auflösung:",
	    printText: "Drucken",
	    emptyTitleText: "Überschrift der Karte hier eingeben.",
	    includeLegendText: "Legende einbeziehen?",
	    legendOnSeparatePageText: "Legende auf eigener Seite?",
	    compactLegendText: "Kompakte Legende?",	
	    emptyCommentText: "Kommentare hier einfügen.",
	    creatingPdfText: "Erstellung der PDF-Datei...",
		graticuleFieldLabelText: 'Aktive Raster',
		defaultTabText: "Default",
		legendTabText: "Legend"
    },
	
	"GeoExt.ux.LegendStylePanel.prototype":{
		iconsSizeText: "Icons Größe",
		fontSizeText: "Schriftgröße",
		fontFamilyText: "Schriftfamilie",
		forceLabelsText: "Force-Label",
		dpiText: "Dpi",
		fontStyleText: "Schriftschnitt",
		fontEditorText: "Label-Config",
		sizeText: "Größe"
    },
    
    "GeoExt.ux.GraticuleStylePanel.prototype":{
        graticuleFieldLabelText: 'Aktive Raster',
        sizeText: "Größe",
        colorText: "Farbe",
        fontFamilyText: "Schriftfamilie",
        fontStyleText: "Schriftschnitt",
        fontEditorText: "Label-Config"
    },

    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Metadaten Anzeigen",
        geonetworkSearchActionTip: "Metadaten Anzeigen"
    },

    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText:  "Gruppeneigenschaften ProprietÃ  del gruppo",
        groupPropertiesActionTip:  "Gruppeneigenschaften ",
        groupPropertiesDialogTitle: "Gruppeneigenschaften - ",
        groupPropertiesFieldSetText: "Gruppenname",
        groupPropertiesFieldLabel: "Neuer Gruppenname",
        groupPropertiesButtonText: "Erledigt",
        groupPropertiesMsg: "Bitte den Gruppennamen eingeben."
    },

    "gxp.plugins.Login.prototype":{
        loginText: "Login",
        loginErrorText: "Username oder password ungültig.",
        userFieldText: "User",
        passwordFieldText: "Password"
    },

    "gxp.plugins.Login.prototype":{
      loginText: "Se connecter",
          loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
          userFieldText: "Utilisateur",
          passwordFieldText: "Mot de passe"
    },
	
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Auf Karte anzeigen",
        firstPageTip: "Erste Seite",
        previousPageTip: "Vorherige Seite",
        zoomPageExtentTip: "Zoom zur Erweterung der Seite",
        nextPageTip: "Nächste Seite",
        lastPageTip: "Letzte Seite",
        title: "Zeilen",
        totalMsg: "Insgesamt: {0} Zeilen",
        displayExportCSVText: "Export to CSV",
        exportCSVSingleText: "einzelne Seite",
        exportCSVMultipleText: "Alle Seite",
        failedExportCSV: "Fehler beim Ansprechen für Ausgabeformat CSV finden",
        invalidParameterValueErrorText: "Ungültige Parameter Wert",
		zoomToFeature: "Zoom auf Funktionen"
    },
	
    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Abfrage",
        queryMenuText: "Schichtenabfrage",
        queryActionTip: "Ausgewählte Schichte abfragen",
        queryByLocationText: "Interessierte Lage",
        currentTextText: "Aktuelle Erweiterung",
        queryByAttributesText: "Abfrage nach Attribute",
        queryMsg: "Abfrage läuft...",
        cancelButtonText: "Cancel",
        noFeaturesTitle: "Kein Ergebnis",
        noFeaturesMessage: "Die Suche hat keine Ergebnisse ergeben.",
        title: "Suche",
        attributeEnablement: "Abfrage nach Attribute",
        attributeEnablementMsg: "Abfrage ungültig! Zuerst 'Feature' und die vektorielle Schicht auswählen.",
        searchType: "Grundeinstellungen",
        typeLabel: "Typ",
        featureLabel: "Max Features"
    },
    
	"gxp.plugins.BBOXQueryForm.prototype": {
        selectionMethodFieldSetComboTitle: "Verfahren zur Auswahl",
        comboEmptyText: "Wählen Sie eine Methode..",
        comboSelectionMethodLabel: "Auswahl",
        comboPolygonSelection: 'Polygon',
        comboCircleSelection: 'Rund',
        comboBBOXSelection: 'BBox',
		errorBBOXText: "Die BBox ausgewählt ist ungültig!",
        errorDrawPolygonText: "Sie müssen das Polygon zeichnen",
        errorDrawCircleText: "Sie müssen den Kreis ziehen",     
        errorDrawTitle: "Antrag Fehler",
		errorBufferTitle: "Der Buffer ist falsch",
		errorBufferText: "Der ausgewählte Buffer ist ungültig!",
		areaLabel: "Bereich",	
		perimeterLabel: "Perimeter",	
		radiusLabel: "Raggio",	
		centroidLabel: "Radius",	
		selectionSummary: "Zusammenfassung Selection"
    },
	
	"gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Reichweite von Buffer",
		bufferFieldSetTitle: "Buffer",
		coordinatePickerLabel: "Koordinaten",
		draweBufferTooltip: "Zeichnen Sie die Buffer"
	},
	
    "gxp.form.BBOXFieldset.prototype":{
        northLabel:"Norden",
        westLabel:"Westen",
        eastLabel:"Osten",
        southLabel:"Süden",
        waitEPSGMsg: "Bitte warten...",
        setAoiText: "ROI eingeben",
        setAoiTooltip: "SetBox-Kontrolle aktivieren um eine ROI (BBox) auf der Karte zu zeichnen",
        title: "Region of interest"
    },
    
    "gxp.FilterBuilder.prototype":{
        preComboText: "Entsprechen",
        postComboText: "der folgenden optionen:",
        addConditionText: "bedingung hinzufügen",
        addGroupText: "gruppe hinzufügen",
        removeConditionText: "entfernen zustand"
    },
	
    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Die Karte ist für die WEB-Veröffentlichung bereit! Den folgenden HTML-Code kopieren um die Karte auf der eigenen WEB-Seite anzuzeigen:",
        heightLabel: "Höhe",
        widthLabel: "Breite",
        mapSizeLabel: "Kartengröße",
        miniSizeLabel: "Mini",
        smallSizeLabel: "Klein",
        premiumSizeLabel: "Premium",
        largeSizeLabel: "Groß"
    },
	
    "gxp.plugins.GoogleGeocoder.prototype": {
        addMarkerTooltip: "Marker rücksetzen"
    },
	
	"gxp.plugins.DynamicGeocoder.prototype": {
        addMarkerTooltip: "Marker rücksetzen",
        emptyText: "Geocoder..."
    },
	
	"gxp.plugins.ReverseGeocoder.prototype": {
        buttonText: "Adresse",
        emptyText: "Adresse...",
		errorMsg: "Keine Adresse gefunden",
		waitMsg: "Bitte warten...",
		addressTitle: "Adresse gefunden"
    },
	
	"gxp.form.WFSSearchComboBox.prototype": {
		emptyText:"Suche",
		loadingText: "Suche läuft..."
	},
	
	"gxp.form.ContextSwitcher.prototype":{
		switchActionTip : "Änderung der Karte",
		switchSaveAlert: "Die nicht gespeicherten daten werden verloren gehen.",
		switchConfirmationText : "Sind Sie sicher die Änderungen machen zu wollen?"

	},
	
	"gxp.form.LanguageSwitcher.prototype":{
		switchActionTip :"Änderung der Sprache" ,
		switchConfirmationText : "Sind Sie sicher die Sprache ändern zu wollen?"//Sind Sie sicher die Sprache ändern zu wollen? Die nicht gespeicherten daten werden verloren gehen.

	},
	
	"gxp.plugins.MarkerEditor.prototype":{
		markerName:'Markers',
		copyText:'Kopieren Sie den Text und fügen Sie ihn in der "Import Marker"-Fenster danach ..',
		pasteText:'Fügen Sie den Text in den Textbereich und klicken Sie auf imoport.',
		addToTheMapText:'Um die Karte hinzuzufügen',
		updateText: 'Aktualisieren',
		resetText:'Rücksetzen',
		removeText:'Entfernen',
		compositeFieldTitle:  'Titel',
		compositeFieldLabel: 'Etikett',
		coordinatesText: 'Koordinaten',
		contentText: 'Inhalt',
		gridColTitle: 'Titel',
		gridColLabel: 'Etikett',
		gridColLat: 'Lat',
		gridColLon: 'Lon',
		gridColContent: 'Inhalt',	
		exportBtn:  'Export Markers',
		importBtn: 'Import Markers',
		removeAllBnt: 'Alle entfernen',
		markerChooserTitle:'Choose a marker',
		markerChooserTitle: "Wählen Sie einen Marker",
		useThisMarkerText: "Mit diesem Marker",
		selectMarkerText: "Select Marker",
		insertImageText: "Bild einfügen",
		imageUrlText: 'Bild-URL',
		importGeoJsonText: "Import GeoJSON",
		errorText: "Fehler",
		notWellFormedText: "Der Text, den Sie hinzugefügt ist nicht wohlgeformt Bitte überprüfen Sie es."
	},
	
	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Koordinaten',
		pointSelectionButtionTip: 'Klicken Sie auf den Punkt Auswahl zu aktivieren',
		latitudeEmptyText: 'Latitude',
		longitudeEmptyText: 'Longitude'
	},
	
	
	"gxp.plugins.AddLayer.prototype":{
		waitMsg: "Bitte warten...",
		capabilitiesFailureMsg: " Die Schicht kann auf der Karte hinzugefügt werden"
    },
        
    "gxp.plugins.Geolocate.prototype":{
        geolocateMenuText: "Geolokalisieren",
        geolocateTooltip: "Finde meine stelle",
        trackMenuText: "Folgst stelle",
        trackTooltip: "Folgst mein stelle",
        waitMsg: "Fahndung...",
        errorMsg: "Dieser Browser unterstützt keine Geolocation"
    },
        
    "gxp.plugins.GeoLocationMenu.prototype": {
        initialText: "Fläche auswählen",
        menuText: "Geo Referenzen",
        tooltip: "Geo Referenzen",
        addMarkerTooltip: "Marker rücksetzen",
        emptyText: "Geocoder...",
        buttonText: "Adresse",
        emptyText: "Adresse...",
		errorMsg: "Keine Adresse gefunden",
		waitMsg: "Bitte warten...",
		addressTitle: "Adresse gefunden",
		geolocate: {
			geolocateMenuText: "Geolokalisieren",
			geolocateTooltip: "Finde meine stelle",
			trackMenuText: "Folgst stelle",
			trackTooltip: "Folgst mein stelle",
			waitMsg: "Fahndung...",
			errorMsg: "Dieser Browser unterstützt keine Geolocation"
		},
		actionText: "Geo Locations"
    },
   
    "gxp.plugins.ImportExport.prototype":{
        importexportLabel: "Import / Export",   
	    labels:{
			"map": {
				"saveText" : "Kartenexportierung",
				"loadText" : "Kartenimportierung",
				"uploadWindowTitle" : "Import Map Context-Datei",
				"downloadWindowTitle" : "Exportieren Map Context-Datei"
			},
			"kml/kmz": {
				"saveText" : "Export KML",
				"loadText" : "Import KML/KMZ",
				"uploadWindowTitle" : "Import KML / KMZ-Datei",
				"downloadWindowTitle" : "Export KML-Datei",
				"kmlExportTitleText": "KML/KMZ Export",
				"layerEmptyText": "Die ausgewählte Ebene ist leer",
				"notVectorlayerText": "Bitte wählen Sie nur Vektorebene",
				"notLayerSelectedText": "Bitte wählen Sie einen Layer-Vektor"
			} 
        }
   },
  
	"gxp.MapFileUploadPanel" :{
		fileLabel: "Map-Datei",
		fieldEmptyText: "Suchen Sie nach Map Context-Dateien ...",
		uploadText: "Hochladen",
		waitMsgText: "Hochladen der Daten ...",
		resetText: "Zurücksetzen",
		failedUploadingTitle: "Datei-Upload Fehler"
	},
   
	"gxp.MapFileDownloadPanel" :{
		buttonText: "Karte exportieren",
		filenameLabel: "Karte Dateinamen",
		waitMsgText: "Generieren Map-Datei ...",
		resetText: "Zurücksetzen",
		failedUploadingTitle: "Kann nicht generiert Map-Datei",
		saveErrorText: "Ärger gespart: "
	},
   
	"gxp.KMLFileDownloadPanel" :{
		buttonText: "Exportieren",
		filenameLabel: "KML Dateinamen",
		waitMsgText: "Generieren KML ...",
		invalidFileExtensionText: "Dateiendung muss einer der folgenden sein:",
		resetText: "Zurücksetzen",
		failedUploadingTitle: "Kann nicht generiert werden KML-Datei"
	},
   
	"gxp.KMLFileUploadPanel" :{
		fileLabel: "KML-Datei",
		fieldEmptyText: "Suchen Sie KML-oder KMZ-Dateien ...",
		uploadText: "Hochladen",
		waitMsgText: "Hochladen der Daten ...",
		invalidFileExtensionText: "Dateiendung muss einer der folgenden sein:",
		resetText: "Zurücksetzen",
		failedUploadingTitle: "Kann Datei nicht hochladen",
		layerNameLabel: "Layername"
	},
	
	"gxp.plugins.SearchComune.prototype":{
		waitMsg: 'Bitte warten ...',	
		titleError: 'Fehler',	
		title: 'Suche',	
		viaText: 'Strasse',
		civicoText: 'Hausnumm.',
		vieLang: 'de',
		viaTitle: 'Strasse / Hausnumm',
		catastoTitle: 'Katastersuche',
		comCatTitle: 'K.G.',
		comCatEmpty: 'K.G. auswählen',
		comTipoTitle: 'Typ',
		comTipoEmpty: 'Typ auswählen',
		particellaTitle: 'Parzelle',
		particellaEmpty: 'Parzelle einfügen',
		cercaText: 'Suchen',
		civicoEmpty: 'Hausnumm. einfügen',
		viaEmpty: 'Strasse einfügen',
		bzText: 'Bozen',
		dvText: 'Zwölfmalgreien',
		griesText: 'Gries',		
		pEdText: 'Bauparzelle',
		pFondText: 'Grundparzelle'
	},
	
	"gxp.plugins.SearchVia.prototype":{
		waitMsg: 'Bitte warten ...',	
		titleError: 'Fehler',	
		viaText: 'Strasse',
		civicoText: 'Hausnumm.',
		vieLang: 'de',
		viaTitle: 'Strasse / Hausnumm',
		cercaText: 'Suchen',
		civicoEmpty: 'Hausnumm. einfügen',
		viaEmpty: 'Strasse einfügen',
		viaToolTip: 'z.B. für Romstrasse "Rom" eingeben'
	},
	
	"gxp.plugins.SearchCatasto.prototype":{
		waitMsg: 'Bitte warten ...',	
		titleError: 'Fehler',	
		catastoTitle: 'Katastersuche',
		comCatTitle: 'K.G.',
		comCatEmpty: 'K.G. auswählen',
		comTipoTitle: 'Typ',
		comTipoEmpty: 'Typ auswählen',
		particellaTitle: 'Parzelle',
		particellaEmpty: 'Parzelle einfügen',
		cercaText: 'Suchen',
		bzText: 'Bozen',
		dvText: 'Zwölfmalgreien',
		griesText: 'Gries',		
		pEdText: 'Bauparzelle',
		pFondText: 'Grundparzelle'
	},
	
	"gxp.plugins.SearchCosap.prototype":{
		layerCosapTitle: 'Besetzung Fläche',
		layerCosapLogoTitle: 'Besetzung Symbole',
		waitMsg: "Bitte warten ...",	
		titleError: "Fehler",	
		cercaText: 'Suche',		
		cosapTitle: 'Besetzungen Suche',				
		viaText: "Staße",
		civicoText: "Hausnummer",
		viaToolTip: 'z.B. für Romstrasse "Rom" eingeben',
		vieLang: "de",			
		civicoEmpty: 'Hausnumm. einfügen',
		viaEmpty: 'Strasse einfügen',		
		daDataText: 'Von',
		aDataText: 'Bis',		
		errorData1: 'Geben Sie ein gültiges Beginn- und Enddatum ein.',
		errorData2: 'Das Beginndatum ist größer als das Enddatum.',		
		errorLayer: 'Besetzungen Eben nicht gefunden: '
	},
	
	"gxp.plugins.SearchServizio.prototype":{
		waitMsg: "Bitte warten ...",	
		titleError: "Fehler",		
		serviziText: "Dienst",
		serviziLang: "de",		
		serviziTitle: "Dienst",
		cercaText: "Suche",
		serviziEmpty: "Dienstname einfügen",		
		serviziToolTip: "Dienstname eingeben"
	},

	"gxp.plugins.PrintSnapshot.prototype" :{
		noSupportedLayersErrorMsg: "Fehler beim Erzeugen der Karte Snapshot: Nein Unterstützte Ebenen gefunden!",
		generatingErrorMsg: "Fehler beim Erzeugen der Karte Snapshot",
		printStapshotTitle: "Drucken Snapshot",
		serverErrorMsg: "Fehler beim Erzeugen der Karte Snapshot: Server Error",
		menuText: "Snapshot",
		tooltip: "Snapshot"
	},
	
	"gxp.plugins.HelpButton.prototype" :{
		menuText: "Hilfe",
		text: "Hilfe",
		title: "Hilfe",
		tooltip: "Hilfe öffnen"
	},
	
	"gxp.plugins.ClrButton.prototype" :{
		tooltip:"Suchergebnisse löschen"
	},
	
	"gxp.plugins.EmbedMapDialog.prototype" :{
		exportMapText: "Link Map",		
		toolsTitle: "Werkzeuge auswählen die der Leiste hinzu zufügen sind:",		
		alertEmbedTitle: "Achtung",		
		alertEmbedText: "Zuerst di Karte speichern und dann erst das Werkzeug 'Kartenveröffentlichung' benützen",			
		previewText: "Vorschau",				
		embedCodeTitle: "Embed Code",
		embedURL: "Direct URL",		
		urlLabel: "URL",
		showMapTooltip: "In einem neuen Fenster anzeigen",
        loadMapText: "Load this Map (installieren Sie zuerst die Anwendung)", 
        downloadAppText: "Die Anwendung Installieren", 
        loadInMapStoreMobileText: "Mobile",
        openImageInANewTab: "Bild in einem neuen Tab"
	},

    "gxp.widgets.form.SpatialSelectorField.prototype" :{
        title : "Gebiet vom Interesse",
        selectionMethodLabel : "Methode der Auswahl",
        comboEmptyText : "Sie wählen eine Methode aus..",
        comboSelectionMethodLabel : "Auswahl",
        northLabel : "Nördlich",
        westLabel : "Westen",
        eastLabel : "Osten",
        southLabel : "Südwärts",
        setAoiTitle : "Bounding Box",
        setAoiText : "Es zieht(zeichnet)",
        setAoiTooltip : "Ermöglichen Sie der SetBox-Kontrolle, einen ROI (zu ziehen(zeichnen), Kasten) auf der Karte Springend",
        areaLabel : "Gebiet",
        perimeterLabel : "Umkreis",
        radiusLabel : "Strahl",
        centroidLabel : "Centroide",
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Einen Platz zu wählen",
        geocodingPanelBtnRefreshTxt : "Es zeigt Geometrie",
        geocodingPanelBtnDestroyTxt : "Sie verbergen Geometrie",
        geocodingPanelBtnDeleteTxt : "Sie entfernen Platz",
        geocodingPanelLocationHeader: "Platz",
        geocodingPanelCustomHeader: "Verwandter",
        geocodingPanelGeometryHeader: "WKT der Geometrie",
        geocodingPanelBtnSelectAllTxt : "Es wählt Alles auso", 
        geocodingPanelBtnDeSelectAllTxt : "Sie entfernen die ganze Auswahl", 
        geocodingPanelMsgRemRunningTitle : "Sie entfernen Platz",
        geocodingPanelMsgRemRunningMsg : "Wollen Sie die durch die Liste ausgewählten Plätze entfernen?",
        geocodingFieldLabel : "Es sucht nach einem Platz",
        geocodingFieldEmptyText : "Sie fügen Platz ein...",
        geocodingFieldBtnAddTooltip : "Sie fügen einen Platz zur Liste hinzu",
        geocodingFieldBtnDelTooltip : "Sie reinigen...",
        selectionSummary : "Zusammenfassung der Auswahlen",
        geocoderSelectorsLabels: ['Union der Geometrie', 'Liste der Administrativen Gebiete', 'Administratives Gebiet und sottoaree'],
        selectionReturnTypeLabel: "Typ der Auswahl"
    },
    
    "gxp.plugins.WFSGrid.prototype":{
        displayMsgPaging: "Bestandteil {0} - {1} of {2}",
        emptyMsg: "Kein Bestandteil gefunden",
        loadMsg: "Bitte warten...",
        zoomToTooltip: "Zoom auf das Ziel"  
    },
    
    "gxp.plugins.TabPanelWFSGrids.prototype":{
        displayMsgPaging: "Bestandteil {0} - {1} von {2}",
        emptyMsg: "No Bestandteil gefunden",
        noRecordFoundLabel: "Kein Bestandteil gefunden",
        loadMsg: "Bitte warten..."
    },

    "gxp.plugins.spatialselector.SpatialSelector.prototype" :{
        titleText : "Gebiet vom Interesse",
        selectionMethodLabel : "Methode der Auswahl",
        comboEmptyText : "Sie wählen eine Methode aus..",
        comboSelectionMethodLabel : "Auswahl"
    },
    
    "gxp.widgets.form.spatialselector.SpatialSelectorMethod.prototype" :{
        areaLabel : "Gebiet",
        perimeterLabel : "Umkreis",
        lengthLabel: "Länge",
        radiusLabel : "Strahl",
        centroidLabel : "Centroide",
        selectionSummary: "Zusammenfassung der Auswahlen",
        geometryOperationText: "Geometrie-Operation",
        geometryOperationEmptyText: "Wählen Sie eine Operation(Betrieb) aus",
        distanceTitleText: "Entfernung",
        distanceUnitsTitleText: "Entfernungseinheiten",
        noOperationTitleText: "Keine gültige Operation(Betrieb)",
        noOperationMsgText: "Wählen Sie bitte eine Operation(Betrieb) vor Frage aus",
        noCompleteMsgText: "Ergänzen Sie bitte Form(Formular) vor Frage"        
    },
    
    "gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.prototype" :{
        name  : 'BBOX',
        label : 'Bounding Box',
        northLabel : "Nördlich",
        westLabel : "Westen",
        eastLabel : "Osten",
        southLabel : "Südwärts",
        setAoiTitle : "Bounding Box",
        setAoiText : "Es zieht(zeichnet)",
        setAoiTooltip : "Ermöglichen Sie der SetBox-Kontrolle, einen ROI (zu ziehen(zeichnen), Kasten) auf der Karte Springend"
    },
    
    "gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.prototype" :{
        name  : 'Buffer',
        label : 'Buffer',
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X'
    },
    
    "gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod.prototype" :{
        name  : 'Kreis',
        label : 'Kreis'
    },
    
    "gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.prototype" :{
        name  : 'Geocoding',
        label : 'Geocoding',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Einen Platz zu wählen",
        geocodingPanelBtnRefreshTxt : "Es zeigt Geometrie",
        geocodingPanelBtnDestroyTxt : "Sie verbergen Geometrie",
        geocodingPanelBtnDeleteTxt : "Sie entfernen Platz",
        geocodingPanelLocationHeader: "Platz",
        geocodingPanelCustomHeader: "Verwandter",
        geocodingPanelGeometryHeader: "WKT der Geometrie",
        geocodingPanelBtnSelectAllTxt : "Es wählt Alles aus", 
        geocodingPanelBtnDeSelectAllTxt : "Sie entfernen alle Auswahlen", 
        geocodingPanelMsgRemRunningTitle : "Sie entfernen Platz",
        geocodingPanelMsgRemRunningMsg : "Wollen Sie die durch die Liste ausgewählten Plätze entfernen?",
        geocodingFieldLabel : "Es sucht nach einem Platz",
        geocodingFieldEmptyText : "Sie fügen Platz ein...",
        geocodingFieldBtnAddTooltip : "Sie fügen einen Platz zur Liste hinzu",
        geocodingFieldBtnDelTooltip : "Sie reinigen...",
        selectionSummary : "Zusammenfassung der Auswahlen"
    },
    
    "gxp.widgets.form.spatialselector.PolygonSpatialSelectorMethod.prototype" :{
        name  : 'Polygon',
        label : 'Polygon'
    },

    "gxp.plugins.spatialselector.Geocoder.prototype" :{
        titleText: "Geocoder",
        searchText: "Suche",
        searchTpText: "Suche wählte Ort und Steilflug in auf Karte aus",
        resetText: "Neu fassen",
        resetTpText: "Neu gefasste Ort-Suche",
        translatedKeys: {
            "name": "Straße",
            "number": "Zahl(Nummer)"
        }
    },
	
	"gxp.plugins.ResourceStatus.prototype":{
		rootNodeText: "Ressourcen Import",
		serviceErrorTitle: "Dienstfehler",
		tabTitle: "Importiert",
		layerNodeName: "Levels",
		serviceNodeName: "Service"
    },
	
	"gxp.plugins.SpatialSelectorQueryForm.prototype":{
        noFilterSelectedMsgTitle: "Keinen Filter ausgewählt",    
        noFilterSelectedMsgText: "Sie müssen mindestens einen Filter auswählen",    
        invalidRegexFieldMsgTitle: "Ungültige Domänen",    
        invalidRegexFieldMsgText: "Eine oder mehrere Domänen sind falsch!"
    },
	
	"gxp.plugins.FeatureManager.prototype":{
        noValidWmsVersionMsgTitle: 'WMS Version ungültig',    
        noValidWmsVersionMsgText: "Die Queryform-Plugin nicht mit WMS Source Version arbeiten: "
    },

    "gxp.plugins.DownloadPanel.prototype":{    
        initialText: "Auswählen ...",	
        tabTitle: "Download",    
        dselTitle: "Daten Auswählen",
        dselLayer: "Layer",
        dselCRS: "Koordinatensystem",
        dselFormat: "Format",      
        infoBtnTooltip: "Zeigen Sie Informationen zu dieser CRS", 
        settingTitle: "Erweiterte Einstellungen",
        settingSel: "Auswahl-Modus",
        settingCut: "Zuschneidemodus",       
        optTitle: "Optionale Einstellungen",
        optEmail: "Filter",
        optEmail: "E-Mail",   
        resTitle: "Ergebnisse",
        resID: "ID",
        resExecID: "execID",
        resProcStatus: "Prozess-Status",
        resGet: "Get",
        resDelete: "Löschen",
        resPhase: "Phase",
        resProgress: "Progress",
        resResult: "Ergebnis",       
        btnRefreshTxt: "Neu laden",
        btnResetTxt: "Zurücksetzen",
        btnDownloadTxt: "Download",       
        errMissParamsTitle: "Fehlende Parameter",
        errMissParamsMsg: "Bitte füllen Sie alle Pflichtfelder aus",       
        errMissGeomTitle: "Fehlende Funktion",
        errMissGeomMsg: "Zeichnen Sie eine Geometrie vor dem Senden der Anfrage?",   
        msgRemRunningTitle: "Entferne laufende Instanz",
        msgRemRunningMsg: "Sie sind dabei eine laufende Instanz zu entfernen und können somit nicht mehr auf das Ergebniss zugreifen.<br/>Möchten Sie wirklich fortfahren?",
        msgRemTitle: "Instanz entfernen",
        msgRemMsg: "Wollen Sie diese Instanz entfernen?",
        msgRemDone: "Instanz entfernt.",       
        errWPSTitle: "DownloadProcess nicht unterstützt",
        errWPSMsg: "Dieser WPS-Server bietet keine Unterstützung für gs:Download",
		wpsErrorMsg: "Der WPS enthält folgende Fehlermeldung",
		emailNotificationTitle: "Email-Benachrichtigung",
        emailFieldLabel: "Email",
        vectorFilterTitle: "Filter",        
        placeSearchLabel: "Ort",        
        errBufferTitle: "Buffer Fehlgeschlagen",
        errBufferMsg: "Fehler beim Buffern der Geometrie",        
        errUnknownLayerTypeTitle: "Layer-Typ unbekannt",
        errUnknownLayerTypeMsg: "Es ist nicht möglich den Layer-Typ zu ermitteln. Wählen Sie einen anderen Layer aus.",        
        errLayerGroupTypeTitle: "Layergroup erkannt",
        errLayerGroupTypeMsg: "Layergroups können nicht heruntergeladen werden. Wählen Sie einen anderen Layer aus.",
        msgEmptyEmailTitle: "Das Feld E-Mail ist leer",
        msgEmptyEmailMsg: "Die E-Mail-Benachrichtigung ist aktiviert, aber das Feld E-Mail ist leer. Wollen Sie ohne Benachrichtigung fortfahren?",        
        msgEmptyFilterTitle: "Das Feld Filter ist leer",
        msgEmptyFilterMsg: "Der Filter ist aktiviert, aber es wurden keine Filterkriterien festgelegt. Wollen Sie ohne Filter fortfahren?",    
        msgWrongCRSTitle: "Projection Mismatch",
        msgWrongCRSMsg: "Die gewählte Projektion wird überschrieben durch das Ausgabeformat Spezifikationen (EPSG:4326). Trotzdem fortfahren?",
        msgTooltipPending: "Ausstehend",
        msgTooltipSuccess: "Abgeschlossen",
        msgTooltipExecuting: "in Bearbeitung",
        msgTooltipFailed: "Fehlgeschlagen",
        msgTooltipAccepted: "Akzeptiert",        
        msgGeostoreException: "Fehler GeoStore",      
		msgNone: "Keine",		
        msgBox: "Box",
        msgPolygon: "Polygon",
        msgCircle: "Kreis",
        msgPlace: "Ort",        
        msgIntersection: "Schnittpunkt",
        msgClip: "Ausschneiden",        
        msgInstance: "Instanz",        
        msgName: "Name",
        msgCreation: "Erstellt am",
        msgDescription: "Beschreibung",       
        msgCategory: "Kategorie",          
        msgMetadata: "Metadaten",
        msgAttributes: "Attribute",        
        errWrongResponseMsg: "Falsch respone vom server",
		executionIdField: "Execution ID",	
		executionIdFieldEmptyText: "Geben Sie eine execID ein",	
		executionIdFieldTooltip: "Geben Sie eine execID ein, um den Prozess-Status in der Ergebnisstabelle zu verfolgen",	
		executionIdFieldTooltipDelete: "execID Feld leeren",
		executionIdPresentErrorMsg: "Die angegebene execID ist bereits in der Ergebnisstabelle vorhanden",	
		executionIdEmptyErrorMsg: "Der Server hat eine leere execID zurückgeliefert",	
		executionIdInvalidErrorMsg: "execID ist nicht gültig!",	
		processExecutions: "Zusammenfassung Herunterladen",	
		processResponseErrorTitle: "Fehler bei der Antwort des Prozesses",	
		processResponseErrorMsg: "Der Prozess antwortet nicht korrekt",	
		processExecutionsLoadText: "Zurück Download",
		describeProcessErrorMsg: "Es ist nicht möglich die Antwort des Servers zu lesen",	
		bufferFieldLabel: "Puffer Ungefähre (m)",
		downloadFormFieldSetTitle: "Formulare zum Herunterladen",
		selectedProcessIdString: "ID Selektierte: ",
		selectedProcessIdStringUndef: "Unbekannt",
		loadMaskMsg: "Bitte warten...",
		requiredFieldsLabel: "* Diese Felder sind Pflichtfelder für den Download-Prozess.",
		btnDeleteTxt: "Löschen Sie die ausgewählten Prozesse",
		selectionSummary: "Selection Zusammenfassung",
	    areaLabel: "Bereich",
		perimeterLabel: "Perimeter",	
		radiusLabel: "Radius",
		centroidLabel: "Zentrum",		
		closeText: "Close",
		showExecutionIdText: "Zeige ID",
		processIdentifierText: "Kennzeichnung",
		downloadIdTitle: "Download ID"
    }
});
