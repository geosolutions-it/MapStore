/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */

GeoExt.Lang.add("de", {
	"gxp.plugins.SyntheticView.prototype": {
        title: "Synthetische Übersicht",
        elaborazioneLabel: "Art der Bearbeitung",
        formulaLabel: "Formel",
        extentLabel: "Räumlicher Bereich",
        targetLabel: "Typ Ziel",
        adrClassLabel: "ADR Klasse",
        substanceLabel: "Substanz/Stoff",
        accidentLabel: "Unfall",
        seriousnessLabel: "Entität",
        severenessLabel: "Gravità",
        buffersLabel: "Rays Schadensbereich",
        fieldSetTitle: "in Bearbeitung",
        cancelButton: "Bearbeitung abbrechen",
        processButton: "Bearbeitung durchführen",
        analyticViewButton: "analytische Ansicht",
        weatherLabel: "Wetter",  
        temporalLabel: "Zeitliche",
        elabStandardLabel: "Processing Standard",
        totalRiskLabel: "Total Risiko",
        humanTitle:'Sozial',    
        notHumanTitle:'Umweltschutz', 
        defaultExtentLabel: "Regione Piemonte",
        targetsTextBotton: "Treffer",
        areaDamageTextBotton: "Schadensbereich",
        roadGraphTextBotton: "Straße graph",  
        wpsTitle: "Errore",
        wpsError: "Errore nella richiesta al servizio WPS",
        loadMsg: "Bitte warten ..."
    },
    "gxp.plugins.StandardProcessing.prototype": {
        title: "in Bearbeitung",
        elaborazioneLabel: "Art der Bearbeitung",
        formulaLabel: "Formel",                
        northLabel:"Nord",
        westLabel:"West",
        eastLabel:"Ost",
        southLabel:"Süd",
        aoiFieldSetTitle: "Räumlicher Bereich",
        setAoiText: "Auswahl Bereich",        
        setAoiTooltip: "Hier können Sie die Region von Interesse auf der Karte wählen",
        notAvailableProcessing: "Art der Verarbeitung noch nicht verfügbar",
        targetLabel: "Ziel",
        macroTargetLabel: "Kategorie",
        targetSetLabel: "Typ Ziel",
        accidentSetLabel : "Unfallart",
        adrLabel: "ADR Klasse",
        sostanzeLabel: "Stoffe",
        accidentLabel: "Unfall",
        seriousnessLabel: "Entität",
        resetButton: "Zurücksetzen",
        cancelButton: "Abbrechen",
        viewMapButton: "Karte anzeigen",
        formLabel: "Verarbeitungsoptionen",
        bboxValidationTitle: "Wählen Area of ​​Interest",
        requiredMaterial: "Diese Formel erfordert die Angabe des Stoffes",
        requiredAccident: "Diese Formel erfordert die Angabe des Umfall",    
        requiredSeriousness: "Diese Formel erfordert die Angabe des Entities",            
        validationTitle: "Parameter-Fehler",
        invalidAOI: "Die Koordinaten des Gebiets von Interesse sind nicht gültig.",
        bboxTooBig: "L'area selezionata e' troppo grande e il server potrebbe impiegare molto tempo a rispondere. Se si desidera continuare ugualmente premere OK.",
        weatherLabel: "Wetter",  
        temporalLabel: "Gewitter",
        conditionsFielSetLabel: "Bedingungen",   
        allClassOption: "Alle Klassen",
        allSostOption: "Alle Substanzen/Stoffe",
        allScenOption: "alle Unfälle",
        allEntOption: "Alle Entitäten",
        allTargetOption: "Alle Ziele",
        allHumanTargetOption: "Alle menschlichen Ziele",
        allNotHumanTargetOption: "Alle Umweltziele",
        entLieve: "mäßig",
        entGrave: "schwer",
        humanRiskLabel: "Social Risk",
        notHumanRiskLabel: "Umweltrisk",
        lowRiskLabel: "Geringes Risiko",
        mediumRiskLabel: "Durchschnittliche Risiko",
        highRiskLabel: "hohes Risiko"
    },
    "gxp.plugins.TabPanelWFSGrids.prototype": {
        displayMsgPaging: "Bestandteil {0} - {1} of {2}",
        emptyMsg: "No Bestandteil gefunden",
        loadMsg: "Bitte warten..."
    },
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Zoomlevel: {zoom}</div><div>Maßstab: 1:{scale}</div>",
        loadConfigErrorText: "Die gespeicherte Gestaltung kann nicht gelesen werden : <br />",
        loadConfigErrorDefaultText: "Serverfehler.",
        xhrTroubleText: "Verbindungsfehler: Status ",
        layersText: "Stufen",
		legendText: "Legende",
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
        loadMapText: "Kartenimportierung",
        saveMapText: "Kartenexportierung",
        exportMapText: "Kartenveröffentlichung",
	    loadMapEmptyText: "Kontext-Datei auswählen",
		loadMapUploadText: "Wird geladen",
		uploadText: "Upload",
		loadMapWindowTitle: 'Form für das Upload der Datei',
		loadMapErrorText:'Fehler beim Upload der Datei',
        toolsTitle: "Werkzeuge auswählen die der Leiste hinzu zufügen sind:",
        previewText: "Vorschau",
        backText: "Zurück",
        nextText: "Nächste",
        loginText: "Login",
        loginErrorText: "Username oder password ungültig.",
        userFieldText: "User",
        passwordFieldText: "Password",
        fullScreenText: "Vollbild",
        cswMsg: 'Loading...',
	    uploadWaitMsg: 'Kontext-Datei wird geladen...',
		uploadErrorTitle: 'Uploadfehler',
		uploadEmptyText: 'Kontext-Datei asuwählen',
		uploadWinTitle: 'Upload-Formular',
		cswFailureAddLayer: 'Die Schicht kann der Karte nicht hinzugefügt werden',
		uploadButtonText: 'Upload',
        alertEmbedTitle: 'Achtung',
        alertEmbedText: "Zuerst di Karte speichern und dann erst das Werkzeug 'Kartenveröffentlichung' benützen",
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
        overlayNodeText: "SIIG",
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
        infoActionTip: "Feature Info erhalten",
        popupTitle: "Feature Info",
		noDataMsg: "Keine Daten vom Server erhalten"
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
        sliderRischioText: "Risk",
        sliderRischioSocialeText: "Social",
        sliderRischioAmbientaleText: "Umweltrisk",
        minRangeSliderText: "Geringes",
        medRangeSliderText: "Durchschnittliche",
        maxRangeSliderText: "Hohes",
        riskTabTitle: "Themenbereich",
        riskTabSubmitText: "Anwenden",
        riskTabResetText: "Defaults"
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
	    contextMsg: "Loading..."
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
        printOsmText: "OpenStreetMap Background?"
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

    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Auf Karte anzeigen",
        firstPageTip: "Erste Seite",
        previousPageTip: "Vorherige Seite",
        zoomPageExtentTip: "Zoom zur Erweterung der Seite",
        nextPageTip: "Nächste Seite",
        nextPageTip: "Letzte Seite",
        totalMsg: "Insgesamt: {0} Zeilen"
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
        northLabel:"Norden",
        westLabel:"Westen",
        eastLabel:"Osten",
        southLabel:"Süden",
        setAoiText: "ROI eingeben",
        setAoiTooltip: "SetBox-Kontrolle aktivieren um eine ROI (BBOX) auf der Karte zu zeichnen",
        attributeEnablement: "Abfrage nach Attribute",
        attributeEnablementMsg: "Abfrage ungültig! Zuerst 'Feature' und die vektorielle Schicht auswählen.",
        searchType: "Grundeinstellungen",
        typeLabel: "Typ",
        featureLabel: "Max Features"
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
        "gxp.form.AOIFieldset.prototype":{
            northLabel:"Norden",
            westLabel:"West",
            eastLabel:"Osten",
            southLabel:"Süden",
            title: "Territorial",
            setAoiText: "Wählen Bereich",        
            setAoiTooltip: "Ermöglichen die Auswahl des Bereichs von Interesse auf der Karte",
            waitEPSGMsg: "Warten ... Laden"
        }
	
});
