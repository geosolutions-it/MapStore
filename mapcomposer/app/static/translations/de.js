/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */

GeoExt.Lang.add("de", {
    "gxp.plugins.HelpButton.prototype": {
        tooltip:"GIIS - Bedienungsanleitung"
    },
	"gxp.plugins.SyntheticView.prototype": {
        title: "Übersicht",
        elaborazioneLabel: "Art der Bearbeitung",
        formulaLabel: "Formel",
        extentLabel: "Bearbeitungsgebiet",
        targetLabel: "Berücksichtigte Elemente",
        adrClassLabel: "ADR Klasse",
        substanceLabel: "Gefahrenklassen",
        accidentLabel: "Unfall",
        seriousnessLabel: "Intensität",
        severenessLabel: "Schwere",
        buffersLabel: "Schadensbereich",
        resultsLabel: "Verarbeitungsergebnis",        
        fieldSetTitle: "Bearbeitung",
        cancelButton: "Abbrechen",
        processButton: "Neue",
        loadButton: "Hochladen",
        saveButton: "Speichern",
        editProcessButton: "Änderung",
        analyticViewButton: "Analyse",
        temporalLabel: "Zeitliche Bedingungen",
        elabStandardLabel: "Standardbearbeitung",
        totalRiskLabel: "Gesamtrisiko",
        humanTitle:'anthropologische Elemente', 
        notHumanTitle:'Umweltelemente', 
        defaultExtentLabel: "Das ganze Gebiet",
        
        wpsTitle: "Fehler",
        wpsError: "Fehler in der Anfrage des WPS-Dienstes",
        loadMsg: "Bitte warten ...",
        notVisibleOnArcsMessage: "Berechnungsoptionen sind in diesem Maßstabsbereich nicht sichtbar, bitte zoomen Sie stärker in die Karte hinein",
        notVisibleOnGridMessage: "Berechnungsoptionen sind in diesem Maßstabsbereich nicht sichtbar, bitte zoomen Sie stärker in die Karte hinein",
        
        simMsg: 'Diese Funktion ist in diesem Maßstab nicht verfügbar',
        
        saveProcessingTitle: "Verarbeitung speichern",
        saveProcessingMsg: "Verarbeitung bereits mit diesem Namen gespeichert wurde, ersetzen?",
        saveProcessingErrorTitle: "Verarbeitung speichern",
        saveProcessingErrorMsg: "Speichern der Verarbeitung nicht möglich",
        saveProcessingSuccessTitle: "Verarbeitung speichern",
        saveProcessingSuccessMsg: "Verarbeitung erfolgreich gespeichert",
        saveProcessingNameFieldsetTitle: "Verarbeitung",
        saveProcessingNameLabel: "Name",
        saveProcessingDescriptionLabel: "Beschreibung",
        saveProcessingButtonText: "Verarbeitung speichern",
        saveProcessingWinTitle: "Neue Verarbeitung",
        saveProcessingAggregationLabel: "Aggregierung",
        

        loadProcessingNameHeader: 'Name',
        loadProcessingDescriptionHeader: 'Beschreibung',
        removeProcessingTooltip: 'Verarbeitung Entfernen',
        removeProcessingMsgTitle: "Verarbeitung verwerfen",
        removeProcessingMsg: "Verarbeitung verwerfen? Die Aktion kann nicht rückgängig gemacht werden!",
        loadProcessingButtonText: "Verarbeitung hochladen",
        selectProcessingMsgTitle: "Verarbeitung auswählen",
        selectProcessingMsg: "Sie müssen eine Verarbeitung auswählen",
        loadProcessingWinTitle: "Verarbeitung hochladen",
        
		saveDownloadMenuButton: "Download",    
		saveDownloadTitle: "Export",
		saveDownloadNameFieldsetTitle: "Export",
		saveDownloadErrorTitle: "Export der Verarbeitung",
		saveDownloadWinTitle: "neue Export",
		saveDownloadErrorMsg: "Export fehlgeschlagen",
		saveDownloadSuccessTitle: "Export Processing",
		saveDownloadSuccessMsg: "Verarbeitung erfolgreich exportiert",
		
		saveDownloadLoadingMsg: "Exportieren ... Bitte warten",
		
        loadDownloadButton: "Download-Verlauf",
        loadDownloadProcessingWinTitle: "Verarbeitung herunterladen",
        loadDownloadProcessingButtonText: "Verarbeitung herunterladen",
        failureAchieveResourceTitle: "Fehler",
        failureAchieveResourceMsg: "Es ist keine Verarbeitung für diesen Benutzer gespeichert",
        loadProcessingValidHeader: 'Wiederherstellbar',
        loadProcessingCreationHeader: 'Erstellt',
        downloadFileLabel: 'Export',
        deleteDownloadError: 'Der Download kann nicht gelöscht werden. Trotzdem entfernen?',
        meter100Text: '100 Meter',
        meter500Text: '500 Meter',
        GrigliaText: 'Grid',
		exportDisclaimerTitle: 'Disclaimer',
		agreeDisclaimerText: 'akzeptieren',
		notAgreeDisclaimerText: 'ablehnen',
        
        resolutionLabel: "Auflösung"
    },
    "gxp.plugins.StandardProcessing.prototype": {
        title: "Bearbeitung",
        elaborazioneLabel: "Art der Bearbeitung",
        formulaLabel: "Formel",       
        resolutionLabel: "Auflösung",                        
        northLabel:"Norden",
        westLabel:"Westen",
        eastLabel:"Osten",
        southLabel:"Süden",
        aoiFieldSetTitle: "Bearbeitungsgebiet",
        setAoiText: "Bearbeitungsgebiet auswählen",        
        setAoiTooltip: "Hier können Sie die Region von Interesse auf der Karte wählen",
        notAvailableProcessing: "Art der Verarbeitung noch nicht verfügbar",
        targetLabel: "vulnerables Element",
        macroTargetLabel: "Kategorie",
        targetSetLabel: "Typ des vulnerablen Elements",
        accidentSetLabel : "Unfallart",
        adrLabel: "ADR Klasse",
        sostanzeLabel: "Gefahrenklassen",
        sostanzeSingoleLabel: "Einzelsubstanz",
        sostanzeSingoleWarningLabel: "Alert: die Substanz Auswahl wird verwendet, um die entsprechende Gefahrenklasse zur Berechnung auszuwählen.",
        accidentLabel: "Unfall",
        seriousnessLabel: "Intensität",
        resetButton: "Zurücksetzen",
        cancelButton: "Abbrechen",
        viewMapButton: "Karte anzeigen",
        formLabel: "Bearbeitungsoptionen",
        bboxValidationTitle: "Bearbeitungsbereich wählen",
        requiredMaterial: "Diese Formel erfordert die Angabe des Stoffes",
        requiredAccident: "Diese Formel erfordert die Angabe des Unfalls",    
        requiredSeriousness: "Diese Formel erfordert die Angabe der Intensität",  
        requiredDamageArea: "Wählen Sie den Schadensbereich",
        validationTitle: "Parameter-Fehler",
        invalidAOI: "Die Koordinaten des Gebiets von Interesse sind nicht gültig.",
        bboxTooBig: "Der gewählte Bereich ist zu groß. Eine Antwort des Servers könnte einige Zeit benötigen. Falls Sie trotzdem fortfahren möchten, klicken Sie OK.",
        temporalLabel: "Szenarien",
        conditionsFielSetLabel: "Zeitliche Bedingungen",   
        allClassOption: "Alle Klassen",
        allSostOption: "Alle Substanzen/Stoffe",
        allScenOption: "Alle Unfälle",
        allEntOption: "Alle Intensitäten",
        allTargetOption: "Alle Ziele",
        allHumanTargetOption: "Alle anthropologischen Ziele",
        allNotHumanTargetOption: "Alle Umweltziele",
        entLieve: "mäßig",
        entGrave: "schwer",
        humanRiskLabel: "Anthropologisches Risiko",
        notHumanRiskLabel: "Umweltrisiko",
        lowRiskLabel: "Geringes Risiko",
        mediumRiskLabel: "Durchschnittliches Risiko",
        highRiskLabel: "Hohes Risiko",
        notVisibleOnArcsMessage: "Berechnungsoptionen sind in diesem Maßstabsbereich nicht sichtbar, bitte zoomen Sie stärker in die Karte hinein",
        notVisibleOnGridMessage: "Berechnungsoptionen sind in diesem Maßstabsbereich nicht sichtbar, bitte zoomen Sie stärker in die Karte hinein",
        areaTooBigMessage: "Ausflug Region zu groß für diese Formel / Auflösung",
        resolutionNotAllowedMessage: "Die gewählte Auflösung ist mit den räumlichen Geltungsbereich kompatibel",
        resolutionLevel1: "Segment 100m",
        resolutionLevel2: "Segment 500m",
        resolutionLevel3: "Grid",
        resolutionLevel4: "Administrative Stadtvertretung",
        resolutionLevel5: "arstellung Provincial Administrative",
        selectionAreaLabel: "Gewählter Bearbeitungsbereich",
        alertSimGridReloadTitle: "Update vulnerable Elemente",
        alertSimGridReloadMsg: "Möchten Sie die Simulationsdaten aktualisieren? - Alle bisherigen Bearbeitungsschritte gehen dabei verloren!",
        formulaHelpTitle: "Beschreibung Formel"
    },
    "gxp.plugins.TabPanelWFSGrids.prototype": {
        displayMsgPaging: "Bestandteil {0} - {1} von {2}",
        emptyMsg: "Kein Bestandteil gefunden",
        noRecordFoundLabel: "Kein Bestandteil gefunden",
        loadMsg: "Daten werden geladen. Bitte warten...",
        refreshGridButton: "Aktualisieren alle Netze",
        targetsTextBotton: "Treffer",
        areaDamageTextBotton: "Schadensbereich",
        roadGraphTextBotton: "Straßennetz"
    },
    "gxp.plugins.WFSGrid.prototype": {
        displayMsgPaging: "Bestandteil {0} - {1} von {2}",
        emptyMsg: "Kein Bestandteil gefunden",
        loadMsg: "Daten werden geladen. Bitte warten...",
        addTooltip: "Neues Element hinzufügen",
        addLayerTooltip: "Layer zur Karte hinzufügen",
        detailsTooltip: "Details anzeigen",
        deleteTooltip: "Element löschen",
        deleteConfirmMsg: "Sind Sie sicher, dass Sie dieses Element löschen möchten?",
        detailsHeaderName: "Name Eigenschaften",
        detailsHeaderValue: "Wert Eigenschaften",
        detailsWinTitle: "Details",
        zoomToTooltip: "Zoom auf das vulnerable Element",
        startEditToTooltip: "Starten der Zeilenbearbeitung",
        startEditGeomToTooltip: "Starten der Elementbearbeitung",
        stopEditGeomToTooltip: "Stopp der Elementbearbeitung",
        resetEditGeomToTooltip: "Elementbearbeitung zurücksetzen",
        removeMessage: "Entfernen",
        removeTitle:"Sind Sie sicher, dass Sie dieses Element löschen möchten?",
        noEditElementSelectionTitle: "Wählen Sie ein Element",
        noEditElementSelectionMsg: "Sie müssen ein Element auswählen!!!",
        activeEditSessionMsgTitle: "Bearbeitungsmodus aktiv",
        activeEditSessionMsgText: "Sie sind im Bearbeitungsmodus. Sie können das Element nicht löschen!"
    },
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Zoomlevel: {zoom}</div><div>Maßstab: 1:{scale}</div>",
        loadConfigErrorText: "Die gespeicherte Konfiguration kann nicht gelesen werden : <br />",
        loadConfigErrorDefaultText: "Serverfehler.",
        xhrTroubleText: "Verbindungsfehler: Status ",
        layersText: "Layer",
		legendText: "Legende",
        titleText: "Überschrift",
        zoomLevelText: "Zoomlevel",
        saveErrorText: "Speicherungsprobleme: ",
        bookmarkText: "URL des Lesezeichens",
        permakinkText: "Permalink",
        appInfoText: "Impressum",
        aboutText: "Über den GeoExplorer",
        mapInfoText: "Informationen zur Karte",
        descriptionText: "Beschreibung",
        contactText: "Kontakt",
        aboutThisMapText: "Über diese Karte",
        searchTabTitle : "Portal",
        viewTabTitle : "Ansicht",
		markerPopupTitle: "Details",
		mainLoadingMask: "Bitte warten ..."
    },
    
    "GeoExplorer.Composer.prototype": {
        loadMapText: "Karten-Import",
        saveMapText: "Karten-Export",
        exportMapText: "Kartenveröffentlichung",
	    loadMapEmptyText: "Kontext-Datei auswählen",
		loadMapUploadText: "Wird geladen",
		uploadText: "Upload",
		loadMapWindowTitle: 'Formular Datei-Upload',
		loadMapErrorText:'Fehler beim Datei-Upload',
        toolsTitle: "Werkzeuge auswählen die der Leiste hinzuzufügen sind:",
        previewText: "Vorschau",
        backText: "Zurück",
        nextText: "Nächste",
        loginText: "Login",
        loginErrorText: "Username oder Passwort ungültig.",
        userFieldText: "User",
        passwordFieldText: "Password",
        fullScreenText: "Vollbild",
        cswMsg: 'Wird geladen...',
	    uploadWaitMsg: 'Kontext-Datei wird geladen...',
		uploadErrorTitle: 'Uploadfehler',
		uploadEmptyText: 'Kontext-Datei auswählen',
		uploadWinTitle: 'Upload-Formular',
		cswFailureAddLayer: 'Der Layer kann der Karte nicht hinzugefügt werden',
		uploadButtonText: 'Upload',
        alertEmbedTitle: 'Achtung',
        alertEmbedText: "Zuerst di Karte speichern und dann erst das Werkzeug 'Kartenveröffentlichung' benützen",
	    cswZoomToExtentMsg: "BBOX nicht verfügbar",
		cswZoomToExtent: "CSW Zoom erweitern"
    },
    
    "CSWPanel.prototype": {
        title: "Metadaten - Explorer"
    },

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Ebene"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Layer hinzufügen",
        addActionTip: "Layer hinzufügen",
        addServerText: "Neuen Server hinzufügen",
        addButtonText: "Layer hinzufügen",
        untitledText: "Ohne Überschrift",
        addLayerSourceErrorText: "Fehler beim finden der WMS capabilities ({msg}).\nBitte die Url kontrollieren und nochmals versuchen.",
        availableLayersText: "Vorhandene Layer",
        expanderTemplateText: "<p><b>Zusammenfassung:</b> {abstract}</p>",
        panelTitleText: "Überschrift",
        layerSelectionText: "Daten anzeigen die hier vorhanden sind:",
        doneText: "Erledigt",
       removeFilterText: "Filter entfernen", 
       filterEmptyText: "Filter",
        uploadText: "Datei-Upload"
    },

    "gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Oberhalb liegende Layer entfernen",
	    removeOverlaysActionTip: "Alle Layer aus der Kartenansicht entfernen",
	    removeOverlaysConfirmationText: "Sind Sie sicher alle in der Kartenansicht geladenen Layer entfernen zu wollen?"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Bing-Layer",
        roadTitle: "Bing Straßen",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial mit Labels"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Bitte die Google API-Schlüssel eingeben für ",
        menuText: "3D Viewer",
        tooltip: "zu 3D Viewer wechseln"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Google-Layer",
        roadmapAbstract: "Straßenkarte anzeigen",
        satelliteAbstract: "Satellitenbilder anzeigen",
        hybridAbstract: "Bilder mit Straßennamen anzeigen",
        terrainAbstract: "Straßenkarte mit DOM anzeigen"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Layereigenschaften",
        toolTip: "Layereigenschaften"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Layer",
        overlayNodeText: "GIIS",
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
        bearingMenuText: "Luftlinie",
        bearingTooltip: "Strecke messen"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Karte verschieben",
        tooltip: "Karte verschieben"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom zur vorherigen Stufe",
        nextMenuText: "Zoom zur nächsten Stufe",
        previousTooltip: "Zoom zur vorherigen Stufe",
        nextTooltip: "Zoom zur nächsten Stufe"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "OpenStreetMap-Layer",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Karte drucken",
        tooltip: "Karte drucken",
        previewText: "Druckvorschau",
        notAllNotPrintableText: "Nicht alle Layer können gedruckt werden",
        nonePrintableText: "Keiner der aktuell auf dieser Karte dargestellten Layer kann gedruckt werden",
		notPrintableLayersText: "Diese Layer und alle Marker vor dem Drucken entfernen. Danach folgende nicht druckbare Layer:"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "MapQuest Layer",
        osmAttribution: "Blattschnitte gewährt von <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Blattschnitte gewährt von <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest Bilder"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Layer entfernen",
        removeActionTip: "Layer entfernen"
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
        menuText: "Zoom höchste Stufe",
        tooltip: "Zoom höchste Stufe"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom zu Layer",
        tooltip: "Zoom zu Layer"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom zu Layer",
        tooltip: "Zoom zu Layer"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "Informationen",
        titleText: "Überschrift",
        nameText: "Name",
        descriptionText: "Beschreibung",
        displayText: "Ansicht",
        opacityText: "Opazität ",
        formatText: "Format",
        transparentText: "Transparenz",
        cacheText: "Cache",
        cacheFieldText: " Benutze die Cache-Version",
        stylesText: "Stil",
        sliderRischioText: "Risiko",
        sliderRischioSocialeText: "Anthropologisches Risiko",
        sliderRischioAmbientaleText: "Umweltrisiko",
        minRangeSliderText: "Geringes",
        medRangeSliderText: "Durchschnittliches",
        maxRangeSliderText: "Hohes",
        riskTabTitle: "Themenbereich",
        riskTabSubmitText: "Anwenden",
        riskTabResetText: "Voreingestellte Werte"
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
         duplicateStyleTip: "Duplikat des ausgewählten Stils",
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
         styleWindowTitle: "Benutzerstil: {0}",
         ruleWindowTitle: "Stil Regel: {0}",
         stylesFieldsetTitle: "Stile",
         rulesFieldsetTitle: "Regeln"
    },

    "gxp.NewSourceWindow.prototype": {
        title: "Neuen Server hinzufügen...",
        cancelText: "Löschen",
        addServerText: "Server hinzufügen",
        invalidURLText: "Gültige URL für WMS-Dienst eingeben (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Verbindungsversuch zum Server..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Zoomstufe"
    },

    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Gruppe hinzufügen",
	    addGroupActionTip: "Neue Gruppe zur Layerübersicht hinzufügen",   
	    addGroupDialogTitle: "Neue Gruppe", 
	    addGroupFieldSetText: "Gruppenname",
	    addGroupFieldLabel: "Neue Gruppe",
	    addGroupButtonText: "Gruppe hinzufügen",
	    addGroupMsg: "Bitte den Gruppennamen eingeben"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Gruppe entfernen",
	    removeGroupActionTip: "Entferne die Gruppe aus der Layerübersicht",
	    removeGroupActionTip: "Entferne von der Karte die ausgewählte Gruppe und die darin enthaltenen Layer",
	    removeGroupConfirmationText: "Sind Sie sicher die ausgewählte Gruppe entfernen zu wollen? Alle beinhalteten Layer werden von der Karte entfernt."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Kontext speichern",
	    saveDefaultContextActionTip: "Karten-Kontext speichern",
	    contextSaveSuccessString: "Kontext richtig gespeichert",
	    contextSaveFailString: "Kontext nicht richtig gespeichert",
	    contextMsg: "Wird geladen..."
    },
	
    "gxp.plugins.GeoReferences.prototype": {
        initialText: "Fläche auswählen",
        menuText: "Koordinaten",
        tooltip: "Koordinaten"
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
	    includeLegendText: "Legende in die Kartenansicht einbeziehen?",
	    legendOnSeparatePageText: "Legende auf eigener Seite?",
	    compactLegendText: "Kompakte Legende?",	
	    emptyCommentText: "Kommentare hier einfügen.",
	    creatingPdfText: "Erstellung der PDF-Datei...",
        printOsmText: "OpenStreetMap-Hintergrund?"
    },

    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Metadaten anzeigen",
        geonetworkSearchActionTip: "Metadaten anzeigen"
    },

    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText:  "Gruppeneigenschaften",
        groupPropertiesActionTip:  "Gruppeneigenschaften ",
        groupPropertiesDialogTitle: "Gruppeneigenschaften - ",
        groupPropertiesFieldSetText: "Gruppenname",
        groupPropertiesFieldLabel: "Neuer Gruppenname",
        groupPropertiesButtonText: "Fertig",
        groupPropertiesMsg: "Bitte den Gruppennamen eingeben."
    },

    "gxp.plugins.Login.prototype":{
        loginText: "Login",
        loginErrorText: "Username oder Passwort ungültig.",
        userFieldText: "User",
        passwordFieldText: "Passwort"
    },

    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Auf Karte anzeigen",
        firstPageTip: "Erste Seite",
        previousPageTip: "Vorherige Seite",
        zoomPageExtentTip: "Zoom zur Erweiterung der Seite",
        nextPageTip: "Nächste Seite",
        nextPageTip: "Letzte Seite",
        totalMsg: "Insgesamt: {0} Zeilen"
    },
	
    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Abfrage",
        queryMenuText: "Layerabfrage",
        queryActionTip: "Ausgewählte Layer abfragen",
        queryByLocationText: "Region von Interesse",
        currentTextText: "Aktuelle Ausdehnung",
        queryByAttributesText: "Attribut-Abfrage",
        queryMsg: "Abfrage läuft...",
        cancelButtonText: "Abbrechen",
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
        attributeEnablementMsg: "Abfrage ungültig! Zuerst Element und den Vektor-Layer auswählen.",
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
        addMarkerTooltip: "Marker zurücksetzen"
    },
	"gxp.plugins.DynamicGeocoder.prototype": {
        addMarkerTooltip: "Marker zurücksetzen",
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
		switchSaveAlert: "Die nicht gespeicherten Daten gehen verloren.",
		switchConfirmationText : "Sind Sie sicher die Änderungen machen zu wollen?"

	},
	"gxp.form.LanguageSwitcher.prototype":{
		switchActionTip :"Änderung der Sprache" ,
		switchConfirmationText : "Sind Sie sicher die Sprache ändern zu wollen?"//Sind Sie sicher die Sprache ändern zu wollen? Die nicht gespeicherten daten werden verloren gehen.

	},
    "gxp.form.AOIFieldset.prototype":{
        northLabel:"Norden",
        westLabel:"Westen",
        eastLabel:"Osten",
        southLabel:"Süden",
        title: "Bearbeitungsbereich",
        setAoiText: "Bereich wählen",        
        setAoiTooltip: "Ermöglicht die Auswahl des Bearbeitungsbereichs auf der Karte",
        waitEPSGMsg: "Wird geladen. Bitte warten...",
        aoiMethodLabel: "Mode",
        aoiByRectLabel: "Rechteck",
        aoiByFeatureLabel: "Administrative Limit",
        provinceLabel: "Provinz",
        comuniLabel: "Gemeinde"
    },
    "gxp.form.SelDamageArea.prototype":{
        selAreaDamageTitle: "Bereichsauswahl",
        selAreaDamageLabel: "Selektionsverfahren",
        selAreaDamageEmptyText: "--- Typ auswählen ---",
        comboPolygonSelection: 'Polygon',
        comboCircleSelection: 'Kreis',
        comboBufferSelection: "Buffer",
        comboScenarioSelection: "Wählen Stoff / Scenario"
    },

	"gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Reichweite des Buffers",
		bufferFieldSetTitle: "Buffer",
		coordinatePickerLabel: "Koordinaten",
		draweBufferTooltip: "Zeichnen Sie den Buffer",
        selectScenarioLabel: "Wählen Stoff / Scenario"
	},

	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Koordinaten',
		pointSelectionButtionTip: 'Klicken Sie auf den Punkt, um die Auswahl zu aktivieren',
		latitudeEmptyText: 'geogr. Breite',
		longitudeEmptyText: 'geogr. Länge'
	},

	"gxp.plugins.SelectVulnElem.prototype":{
        menuText: "vulnerable Elemente anzeigen",
        tooltip: "vulnerable Elemente anzeigen",
        allHumanTargetTitle: "Alle anthrophologischen Elemente",
        allNotHumanTargetTitle: "Alle Umweltelemente",
        selectAllTitle: "Alles auswählen",
        addToMapButtonText: "Zur Karte hinzufügen"
	},

	"gxp.plugins.GateTimeSliderTab.prototype":{
        gateLabel: 'Gate',
        gateSelection: 'Gate-Auswahl',
        gatePanelTitle: "Echtzeitdaten der Gates",
        gateStatGridStart: "Startdatum Statistik",
        gateStatGridEnd: "Enddatum Statistik",
        gateStatGridRoute: "Spur",
        gateStatGridDirection: "Richtung",
        gateStatGridKemler: "Kemler Code",
        gateStatGridOnu: "Onu Code",
        gateStatGridAmount: "Menge",
        gateElementText: "Element",
        gateElementsText: "Elemente",
        gateTotalRenderer: "Insgesamt",
        gateStatFieldsetTitle: "Vorberechnete statistische Daten",
        gateStartDateText: 'Startdatum',
        gateEndDateText: 'Enddatum',
        gateViewTimeGateButtonText: 'Gate-Daten darstellen',
        gateInfoTimeTitle: "Gate-Daten darstellen",
        gateInfoTimeMsg: "Wählen Sie ein Zeitintervall!",    
        gateTimeSelectorTitle: "Wählen Sie ein Zeitintervall",    
        gateSliderFieldsetTitle: "Freie Datumsauswahl",
        gateTimeGridDetectionDate: "Erhebungsdatum",
        gateAggregationAveragePerHour: 'Durchschnitt pro Stunde',
        gateAggregationTotal: "Insgesamt",        
        gateTimeGridHourTimeZone: "Zeit",
        gateTimeGridMinuteTimeZone: "Minute",
        gateTimeGridReceptionDate: "Tag des Eingangs",
        gateTimeGridRoute: "Spur",
        gateTimeGridDirection: "Richtung",
        gateTimeGridKemler: "Kemler Code",
        gateTimeGridOnu: "Onu Code",
        gateViewAllDataText: 'Alle Statistiken',
        aggregationSelectorLabel: "Statistiken",
        intervalSelectorLabel: "Intervall",
        gateLastMonthText: 'Letzter Monat',
        gateLastYearText: 'Letztes Jahr'   
	},

	"gxp.widgets.button.SelectFeatureButton.prototype":{
        tooltip: "Wählen Sie das abzufragende Gate durch einen Klick auf die Karte"
	},
    
    "Ext.grid.GroupingView.prototype":{
        columnsText : 'Spalte',
        emptyGroupText : '(keiner)',
        groupByText : 'Gruppiere gemäß diesem Feld',
        showGroupsText : 'In Gruppen anzeigen',       
        sortAscText : "Aufsteigend sortieren",
        sortDescText : "Sortieren"
    },

    "gxp.plugins.FeatureEditor.prototype":{
        createFeatureActionTip: "Neues Gate hinzufügen",
        createFeatureActionText: "Neues Gate hinzufügen",
        editFeatureActionTip: "Vorhandene Gates bearbeiten",
        editFeatureActionText: "Vorhandene Gates bearbeiten"
    },
    
    "gxp.FeatureEditPopup.prototype":{
        title: 'Gate',
        closeMsgTitle: 'Möchten Sie die Änderungen speichern?',
        closeMsg: 'Änderungen speichern?',
        deleteMsgTitle: 'Entfernen Sie das Gate?',
        deleteMsg: 'Sind Sie sicher, dass Sie das Gate löschen möchten?',
        editButtonText: 'Editieren',
        editButtonTooltip: 'Machen Sie das Gate editierbar',
        deleteButtonText: 'Löschen',
        deleteButtonTooltip: 'Gate löschen',
        cancelButtonText: 'Abbrechen',
        cancelButtonTooltip: 'Bearbeitung beenden, Änderungen nicht speichern',
        saveButtonText: 'Speichern',
        saveButtonTooltip: 'Änderungen speichern'
    },
    
    "gxp.plugins.ObuForm.prototype":{
        title: "Echtzeitdaten-OBU",
        filterTitle: "Filter",
        fieldIDLabel: "Sattelschlepper",
        fieldTypeLabel: "Ereignistyp",
        idEmptyText: "Suche nach Sattelschlepper",
        typeEmptyText: "Suche nach Ereignistyp",
        velocityRange: "Geschwindigkeit",
        velocityMin: "Min",
        velocityMax: "Max",
        descriptionRange: "Richtung",
        descriptionMin: "Min",
        descriptionMax: "Max",
        graphicStyle: "Tematisierung",
        showTrack: "Route anzeigen",
        styleData: "Richtung",
        applyText: "Anwenden",
        resetText: "Zurücksetzen",
        clearFieldTooltip: "Feld löschen"
    },
    "gxp.PlaybackToolbar.prototype": {
        playLabel: "Wiedergabe",
        playTooltip: "Wiedergabe",
        stopLabel: "Stopp",
        stopTooltip: "Stopp",
        fastforwardLabel: "FFWD",
        fastforwardTooltip: "Animation in doppelter Geschwindigkeit",
        backLabel:'Zurück',
        backTooltip:'Schritt zurück',            
        nextLabel: "Nächste",
        nextTooltip: "Schritt vor",
        loopLabel: "Schleife",
        loopTooltip: "Stufenlose Animationsschleife",
        normalTooltip: "Rückkehr zur normalen Wiedergabe",
        pauseLabel: "Pause",
        pauseTooltip: "Pause"
    },
    "gxp.PlaybackOptionsPanel.prototype": {
        optionTitleText: "Datums- und Zeitoptionen",
        rangeFieldsetText: "Zeitintervall",
        animationFieldsetText: "Animationsoptionen",
        startText: "Start",
        endText: "Ende",
        saveText: 'Speichern',
        cancelText: 'Abbrechen',         
        listOnlyText: "Verwenden Sie nur die Werte aus der Drop-down-Liste",
        stepText: "Animationsschritt",
        unitsText: "Animationseinheiten",
        frameRateText:'Animationsverzögerung (s)',        
        noUnitsText: "Wechsle zum Zeitintervall",
        loopText: "Animationsschleife",
        reverseText: "Rückwärtsanimation",
        rangeChoiceText: "Wählen Sie das Zeitintervall",
        rangedPlayChoiceText: "Wiedergabe",
        secondsText: 'Sekunden', 
        minutesText: 'Minuten', 
        hoursText: 'Stunden', 
        daysText: 'Tage', 
        monthsText: 'Monate', 
        yearsText: 'Jahre'        
    },
    "gxp.plugins.Routing.prototype": {
        menuText: "Route berechnen",
        tooltip: "Route berechnen",
        formulaText: "Formel",
        routeStartText: "Start",
        routeEndText: "Reiseziel",
        descriptionText: "Beschreibung",
        routePointsText: "Route Endpunkte",
        selectPointText: "Wählen Sie Punkt von der Karte",
        calculateText: "Berechnen",
        lonText: "geogr. Länge",
        latText: "geogr. Breite",
        routingText: "Routenplaner",
        errorTitle: "Fehler",
        missingParametersMsg: "Geben Formel, Start und Ziel",
        selectOneMsg: "Wählen Sie eine Option",
        fieldRequiredMsg: "Dieses Feld wird benötigt",
        lengthFormula: "Shortest Path",
        humanRiskFormula: "Weniger riskanten Weg für den Menschen",
        notHumanRiskFormula: "Weniger riskant Pfad für die Umwelt",
        humanVulnFormula: "Weniger anfällig Pfad für den Menschen",    
        notHumanVulnFormula: "Weniger anfällig Pfad für die Umwelt",    
        incFormula: "Pfad mit weniger Unfallwahrscheinlichkeit",
        blockRoadsText: "Block Straßen",
        zoomToRoadsText: "Zoom auf Auswahl",
        addRoadsText: "In Straßen zu blockieren",
        removeRoadsText: "Ausgewählte entfernen",
        resetRoadsText: "Alle entfernen"
    }
});
