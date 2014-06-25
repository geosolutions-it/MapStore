/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("it", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Livello di Zoom: {zoom}</div><div>Scala: 1:{scale}</div>",
        loadConfigErrorText: "Impossibile leggere la configurazione salvata : <br />",
        loadConfigErrorDefaultText: "Errore del Server.",
        xhrTroubleText: "Problemi di comunicazione: Stato ",
        layersText: "Livelli",
		legendText: "Legenda",
        titleText: "Titolo",
        zoomLevelText: "Livello di Zoom",
        saveErrorText: "Problemi di salvataggio: ",
        bookmarkText: "URL del Segnalibro",
        permakinkText: "Permalink",
        appInfoText: "Crediti",
        aboutText: "Riguardo GeoExplorer",
        mapInfoText: "Informazioni Mappa",
        descriptionText: "Descrizione",
        contactText: "Contatto",
        aboutThisMapText: "Informazioni",
        searchTabTitle : "Portale",
        viewTabTitle : "Vista",
		markerPopupTitle: "Dettagli",
		mainLoadingMask: "Attendere prego ..."
    },
    
    "GeoExplorer.Composer.prototype": {
		uploadText: "Caricamento",
        backText: "Precedente",
        nextText: "Prossimo",
        loginText: "Login",
        loginErrorText: "Username o password non validi.",
        userFieldText: "Utente",
        passwordFieldText: "Password",
        fullScreenText: "Schermo Intero",
        cswMsg: 'Caricamento...',
		cswFailureAddLayer: ' Il layer non può essere aggiunto alla mappa',
	    cswZoomToExtentMsg: "BBOX non disponibile",
		cswZoomToExtent: "CSW Zoom all'estensione"
    },

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Livello"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Aggiungi livello",
        addActionTip: "Aggiungi livello",
        addServerText: "Aggiungi un nuovo Server",
        addButtonText: "Aggiungi livelli",
        untitledText: "Senza Titolo",
        addLayerSourceErrorText: "Errore nel recuperare le WMS capabilities ({msg}).\nSi prega di controllare l'URL e di riprovare ancora.",
        availableLayersText: "Livelli disponibili",
        expanderTemplateText: "<p><b>Sommario:</b> {abstract}</p>",
        panelTitleText: "Titolo",
        layerSelectionText: "Visualizzare i dati disponibili presso:",
        doneText: "Fatto",
       removeFilterText: "Ripulisci Filtro", 
       filterEmptyText: "Filtro",
        uploadText: "Upload dei dati"
    },

    "gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Rimuovere i livelli sovrastanti",
	    removeOverlaysActionTip: "Rimuovere tutti i livelli sovrastanti dalla mappa",
	    removeOverlaysConfirmationText: "Sei sicuro di voler rimuovere dalla mappa tutti i sovralivelli caricati?"
    },
    
    "gxp.plugins.BingSource.prototype": {
        title: "Livelli Bing",
        roadTitle: "Strade Bing",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial con etichette"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Please enter the Google API key for ",
        menuText: "3D Viewer",
        tooltip: "Switch to 3D Viewer"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Livelli Google",
        roadmapAbstract: "Mostra mappa vie",
        satelliteAbstract: "Mostra le immagini satellitari",
        hybridAbstract: "Mostra le immagini con nomi strade",
        terrainAbstract: "Mostra mappa stradale con terreno"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Proprietà livello",
        toolTip: "Proprietà livello"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Livelli",
        overlayNodeText: "Predefinito",
        baseNodeText: "Sfondo"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Legenda",
        tooltip: "Legenda"
    },    
    
    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Lunghezza",
        areaMenuText: "Area",
        lengthTooltip: "Misura lunghezza",
        areaTooltip: "Misura area",
        measureTooltip: "Misura",
        bearingMenuText: "Rotta",
        bearingTooltip: "Misura la rotta"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Trascina Mappa",
        tooltip: "Trascina Mappa"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom alla precedente estensione",
        nextMenuText: "Zoom alla prossima estensione",
        previousTooltip: "Zoom alla precedente estensione",
        nextTooltip: "Zoom alla prossima estensione"
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "Livelli OpenStreetMap",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Stampa Mappa",
        tooltip: "Stampa Mappa",
        previewText: "Anteprima di stampa",
        notAllNotPrintableText: "Non tutti i livelli possono essere stampati",
        nonePrintableText: "Nessuno dei tuoi attuali livelli della mappa può essere stampato",
		notPrintableLayersText: "Rimuovere questi livelli e tutti i marker prima di stampare. Di seguito i layers non stampabili:"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "Livelli MapQuest",
        osmAttribution: "Tiles per concessione di <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles per concessione di <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "Immagini MapQuest"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Rimuovi livello",
        removeActionTip: "Rimuovi livello"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Recupera Feature Info",
        popupTitle: "Feature Info",
		noDataMsg: "Nessun dato è stato ritornato dal server",
		maskMessage: "Recupero Feature Info..."
    },
	
	"gxp.plugins.WMSGetFeatureInfoMenu.prototype": {
        infoActionTip: "Recupera Feature Info",
        popupTitle: "Feature Info",
		noDataMsg: "Nessun dato è stato ritornato dal server",
		maskMessage: "Recupero Feature Info...",
		activeActionTip:"Feature Info sul layer selezionato"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom Avanti",
        zoomOutMenuText: "Zoom Indietro",
        zoomInTooltip: "Zoom Avanti",
        zoomOutTooltip: "Zoom Indietro"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom massima estensione",
        tooltip: "Zoom massima estensione"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom al livello",
        tooltip: "Zoom al livello"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom al livello",
        tooltip: "Zoom al livello"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "Informazioni",
        titleText: "Titolo",
        nameText: "Nome",
        descriptionText: "Descrizione",
        displayText: "Display",
        opacityText: "Opacità",
        formatText: "Formato",
        transparentText: "Trasparenza",
        cacheText: "Cache",
        cacheFieldText: "Usa versione in cache",
        stylesText: "Stile",
        summaryText: "Statistiche",
        summaryInfoText: "Statistiche Raster nella Viewport corrente",
        loadMaskMsg: "Caricamento ...",
        noDataMsg: "Nessun dato disponibile per la vista corrente",
        refreshText: "Aggiorna"
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
        title: "Aggiungi nuovo Server...",
        cancelText: "Cancella",
        addServerText: "Aggiungi Server",
        invalidURLText: "Inserisci un URL valido come WMS endpoint (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Si cerca di contattare il Server..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Livello di Zoom"
    },

    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Aggiungi Gruppo",
	    addGroupActionTip: "Aggiungi nuovo Gruppo all'albero dei livelli",   
	    addGroupDialogTitle: "Nuovo Gruppo", 
	    addGroupFieldSetText: "Nome Gruppo",
	    addGroupFieldLabel: "Nuovo Gruppo",
	    addGroupButtonText: "Aggiungi Gruppo",
	    addGroupMsg: "Si prega di inserire il nome del gruppo"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Rimuovi Gruppo",
	    removeGroupActionTip: "Rimuovi gruppo dall'albero dei livelli",
	    removeGroupActionTip: "Rimuovi il gruppo selezionato e i suoi livelli dalla mappa",
	    removeGroupConfirmationText: "Sei sicuro di voler rimuovere il gruppo selezionato ? Tutti i livelli in esso presenti saranno rimossi dalla mappa."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Salva il contesto",
	    saveDefaultContextActionTip: "Salva il contesto della Mappa",
	    contextSaveSuccessString: "Contesto salvato con successo",
	    contextSaveFailString: "Contesto non salvato con successo",
	    contextMsg: "Caricamento...",
		userLabel: "Utente",	
		passwordLabel: "Password", 	
		loginLabel: "Accesso",	
		mapMetadataTitle: "Inserimento dei metadati",	
		mapMedatataSetTitle: "Metadati della Mappa",	
		mapNameLabel: "Nome",	
		mapDescriptionLabel: "Descrizione",
		addResourceButtonText: "Salva Mappa"
    },
	
    "gxp.plugins.GeoReferences.prototype": {
        initialText: "Seleziona un'area",
        menuText: "Geo Riferimenti",
        tooltip: "Geo Riferimenti"
    },

    "gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box Avanti",
        zoomOutMenuText: "Zoom Box Indietro",
        zoomInTooltip: "Zoom Box Avanti",
        zoomOutTooltip: "Zoom Box Indietro"
    },

    "GeoExt.ux.PrintPreview.prototype":{
	    paperSizeText: "Dimensioni del foglio:",
	    resolutionText: "Risoluzione:",
	    printText: "Stampa",
	    emptyTitleText: "Inserisci qui il titolo della mappa.",
	    includeLegendText: "Includere la legenda?",
	    legendOnSeparatePageText: "Legenda in una pagina separata?",
	    compactLegendText: "Legenda compatta?",	
	    emptyCommentText: "Inserisci qui i commenti.",
	    creatingPdfText: "Creazione del file PDF...",
		graticuleFieldLabelText: 'Attiva griglia',
		defaultTabText: "Predefinito",
		legendTabText: "Legenda"
    },
	
	"GeoExt.ux.LegendStylePanel.prototype":{
		iconsSizeText: "Dimensione Icone",
		fontSizeText: "Dimensione Font",
		fontFamilyText: "Famiglia Font",
		forceLabelsText: "Forza etichette",
		dpiText: "Dpi",
		fontStyleText: "Stile Font",
		fontEditorText: "Config. Etichette",
		sizeText: "Dimensione"
    },
    
    "GeoExt.ux.GraticuleStylePanel.prototype":{
        graticuleFieldLabelText: 'Attiva griglia',
        sizeText: "Dimensione",
        colorText: "Colore",
        fontFamilyText: "Famiglia Font",
        fontStyleText: "Stile Font",
        fontEditorText: "Config. Etichette"
    },

    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Visualizza metadati",
        geonetworkSearchActionTip: "Visualizza metadati"
    },

    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText:  "Proprietà del gruppo",
        groupPropertiesActionTip:  "Proprietà del gruppo",
        groupPropertiesDialogTitle: "Proprietà del gruppo - ",
        groupPropertiesFieldSetText: "Nome del gruppo",
        groupPropertiesFieldLabel: "Nuovo nome del gruppo",
        groupPropertiesButtonText: "Fatto",
        groupPropertiesMsg: "Si prega di inserire il nome del gruppo."
    },

    "gxp.plugins.Login.prototype":{
        loginText: "Login",
        loginErrorText: "Username o password non validi.",
        userFieldText: "Utente",
        passwordFieldText: "Password"
    },

    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Visualizza in mappa",
        firstPageTip: "Prima pagina",
        previousPageTip: "Pagina precedente",
        zoomPageExtentTip: "Zoom all'estensione della pagina",
        nextPageTip: "Prossima pagina",
        lastPageTip: "Ultima pagina",
        title: "Entità",
        totalMsg: "Totale: {0} entità",
        displayExportCSVText: "Esporta nel formato CSV",
        exportCSVSingleText: "Singola pagina",
        exportCSVMultipleText: "Tutte le pagine",
        failedExportCSV: "Impossibile esportare nel formato CSV",
        invalidParameterValueErrorText: "Valore parametro non valido",
		zoomToFeature: "Zoom alla Feature"            
    },
	
    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Interrogazione",
        queryMenuText: "Interrogazione livello",
        queryActionTip: "Interrogazione del livello selezionato",
        queryByLocationText: "Regione di Interesse",
        currentTextText: "Estensione corrente",
        queryByAttributesText: "Interrogazione per attributo",
        queryMsg: "Interrogazione in corso...",
        cancelButtonText: "Reimposta",
        noFeaturesTitle: "Nessun risultato",
        noFeaturesMessage: "La tua ricerca non ha prodotto risultati.",
        title: "Ricerca",
        attributeEnablement: "Interrogazione per Attributo",
        attributeEnablementMsg: "Tipo di ricerca invalido! Si deve prima selezionare il tipo 'Feature' e il layer vettoriale.",
        searchType: "Impostazioni di base",
        typeLabel: "Tipo",
        featureLabel: "Max Features"
    },
    
    "gxp.plugins.BBOXQueryForm.prototype": {
        selectionMethodFieldSetComboTitle: "Metodo di Selezione",
        comboEmptyText: "Seleziona un metodo..",
        comboSelectionMethodLabel: "Selezione",
        comboPolygonSelection: 'Poligono',
        comboCircleSelection: 'Cerchio',
        comboBBOXSelection: 'Bounding Box',
		errorBBOXText: "Il BBox selezionato è invalido!",
        errorDrawPolygonText: "Si deve disegnare il Poligono",
        errorDrawCircleText: "Si deve disegnare il Cerchio",     
        errorDrawTitle: "Errore nella richiesta",
		errorBufferTitle: "Il Buffer è errato",
		errorBufferText: "Il buffer selezionato è invalido!",
		areaLabel: "Area",	
		perimeterLabel: "Perimetro",	
		radiusLabel: "Raggio",	
		centroidLabel: "Centroide",	
		selectionSummary: "Sommario Selezione"
    },
	
	"gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Raggio",
		bufferFieldSetTitle: "Buffer",
		coordinatePickerLabel: "Coordinate",
		draweBufferTooltip: "Disegna il Buffer"
	},
	
    "gxp.form.BBOXFieldset.prototype":{
        northLabel:"Nord",
        westLabel:"Ovest",
        eastLabel:"Est",
        southLabel:"Sud",
        setAoiText: "ImpostaROI",
        waitEPSGMsg: "Caricamento in corso... Attendere",
        setAoiTooltip: "Abilita il controllo SetBox per disegnare una ROI (BBox) sulla mappa",
        title: "Bounding Box"
    },
    
    "gxp.FilterBuilder.prototype":{
        preComboText: "Risultato",
        postComboText: "dei seguenti:",
        addConditionText: "aggiungi condizione",
        addGroupText: "aggiungi gruppo",
        removeConditionText: "rimuovi condizione"
    },
    
    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "La mappa è pronta per essere pubblicata sul web! Basta copiare il seguente codice HTML per visualizzare la mappa nel proprio sito web:",
        heightLabel: "Altezza",
        widthLabel: "Larghezza",
        mapSizeLabel: "Dimensione della Mappa",
        miniSizeLabel: "Mini",
        smallSizeLabel: "Piccola",
        premiumSizeLabel: "Premium",
        largeSizeLabel: "Grande"
    },
    "gxp.plugins.GoogleGeocoder.prototype": {
        addMarkerTooltip: "Resetta Marker"
    },
	"gxp.plugins.DynamicGeocoder.prototype": {
        addMarkerTooltip: "Resetta Marker",
        emptyText: "Geocoder..."
    },
	"gxp.plugins.ReverseGeocoder.prototype": {
        buttonText: "Indirizzo",
        emptyText: "Indirizzo...",
		errorMsg: "Nessun indirizzo trovato",
		waitMsg: "Attendere prego...",
		addressTitle: "Indirizzo trovato"
    },
	"gxp.form.WFSSearchComboBox.prototype": {
		emptyText:"Ricerca",
		loadingText: "Sto cercando"
	},
	"gxp.form.ContextSwitcher.prototype":{
		switchActionTip : "Cambiamento Mappa",
		switchSaveAlert: " I dati non salvati saranno persi.",
		switchConfirmationText : "Si è sicuri di voler cambiare?"

	},
	"gxp.form.LanguageSwitcher.prototype":{
		switchActionTip :"Cambiamento Lingua" ,
		switchConfirmationText : "Si è sicuri di voler cambiare lingua?"
	},

	"gxp.plugins.MarkerEditor.prototype":{
		markerName: 'Markers',
		copyText: 'Copia il testo sottostante e incollalo nella finestra "Import Markers" in un secondo momento ...',
		pasteText: "Incolla il testo nell'area sottostante e clicca su Importa.",
		addToTheMapText:'Aggiungi alla mappa',
		updateText: 'Aggiorna',
		resetText:'Reimposta',
		removeText:'Rimuovi',
		compositeFieldTitle:  'Titolo',
		compositeFieldLabel: 'Etichetta',
		coordinatesText: 'Coordinate',
		contentText: 'Contenuto',
		gridColTitle: 'Titolo',
		gridColLabel: 'Etichetta',
		gridColLat: 'Lat',
		gridColLon: 'Lon',
		gridColContent: 'Contenuto',	
		exportBtn:  'Esporta Markers',
		importBtn: 'Importa Markers',
		removeAllBnt: 'Rimuovi Tutti',
		markerChooserTitle:'Scegli il marker',
		useThisMarkerText:'Usa questo marker',
		selectMarkerText:'Seleziona il Marker',
		insertImageText:'Inserisci un\' immagine',
		imageUrlText:'URL immagine',
		importGeoJsonText:'Importa GeoJson',
		errorText:"Errore",
		notWellFormedText:"Il testo che hai inserito non è ben formato."
	},
	
	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordinate',
		pointSelectionButtionTip: 'Clicca sulla mappa per abilitare la selezione del punto',
		latitudeEmptyText: 'Latitudine',
		longitudeEmptyText: 'Longitudine'
	},
    
	"gxp.plugins.AddLayer.prototype":{
		waitMsg: "Attendere prego ...",
		capabilitiesFailureMsg: " Il layer non può essere aggiunto alla mappa"
    },
    
    "gxp.plugins.Geolocate.prototype":{
        geolocateMenuText: "Geolocalizza",
        geolocateTooltip: "Localizza posizione attuale",
        trackMenuText: "Segui",
        trackTooltip: "Segui spostamenti",
        waitMsg: "Localizzazione in corso...",
        errorMsg: "Questo browser non supporta la geolocalizzazione"
    },
	
	"gxp.plugins.GeoLocationMenu.prototype": {
        initialText: "Seleziona un'area",
        menuText: "Geo Riferimenti",
        tooltip: "Geo Riferimenti",
        addMarkerTooltip: "Resetta Marker",
        emptyText: "Geocoder...",
        buttonText: "Indirizzo",
        emptyText: "Indirizzo...",
		errorMsg: "Nessun indirizzo trovato",
		waitMsg: "Attendere prego...",
		addressTitle: "Indirizzo trovato",
		geolocate: {
			geolocateMenuText: "Geolocalizza",
			geolocateTooltip: "Localizza posizione attuale",
			trackMenuText: "Segui",
			trackTooltip: "Segui spostamenti",
			waitMsg: "Localizzazione in corso...",
			errorMsg: "Questo browser non supporta la geolocalizzazione"
		},
		actionText: "GeoLocalizzazioni"
    },
    
    "gxp.plugins.ImportExport.prototype":{
		importexportLabel: "Importa / Esporta",
		labels:{
			"map": {
				"saveText" : "Esportazione Mappa",
				"loadText" : "Importazione Mappa",
				"uploadWindowTitle" : "Importa file di contesto di mappa",
				"downloadWindowTitle" : "Esporta file di contesto di mappa"
			},
			"kml/kmz": {
				"saveText" : "Esportazione KML",
				"loadText" : "Importazione KML/KMZ",
				"uploadWindowTitle" : "Importa file KML/KMZ",
				"downloadWindowTitle" : "Esporta file KML",
				"kmlExportTitleText": "Esportazione KML",
				"layerEmptyText": "Il layer selezionato è vuoto",
				"notVectorlayerText": "Selezionare un layer",
				"notLayerSelectedText": "Selezionare un layer vettoriale"
			} 
		}      
	},
	
	"gxp.MapFileUploadPanel" :{
		fileLabel: "File di mappa",
		fieldEmptyText: "Seleziona il file di contesto di mappa...",
		uploadText: "Upload",
		waitMsgText: "In corso l'upload del file...",
		resetText: "Reset",
		failedUploadingTitle: "Errore nell'upload del file"
	},
   
	"gxp.MapFileDownloadPanel" :{
		buttonText: "Esportazione Mappa",
		filenameLabel: "Nome del file di mappa",
		waitMsgText: "In corso la generazione del file di mappa ...",
		resetText: "Reset",
		failedUploadingTitle: "Impossibile generare il file di mappa",
		saveErrorText: "Errori riscontrati: "
	},
   
	"gxp.KMLFileDownloadPanel" :{
		buttonText: "Export",
		filenameLabel: "Nome del file KML",
		waitMsgText: "In corso la generazione del KML...",
		invalidFileExtensionText: "L'estensione del file deve essere una delle seguenti: ",
		resetText: "Reset",
		failedUploadingTitle: "Imppossibile generare il file KML"
	},
   
	"gxp.KMLFileUploadPanel" :{
		fileLabel: "File KML",
		fieldEmptyText: "Selezione un file KML o KMZ",
		uploadText: "Upload",
		waitMsgText: "In corso l'upload del file ...",
		invalidFileExtensionText: "L'estensione del file deve essere una delle seguenti: ",
		resetText: "Reset",
		failedUploadingTitle: "Impossibile completare l'upload del file",
		layerNameLabel: "Nome del Layer"
	},

	"gxp.plugins.PrintSnapshot.prototype" :{
		noSupportedLayersErrorMsg: "Si è verificato un errore durante la generazione della mappa Snapshot: Nessun layer è supportato !",
		generatingErrorMsg: "Si è verificato un errore durante la generazione della mappa Snapshot",
		printStapshotTitle: "Stampa Snapshot",
		serverErrorMsg: "Verificato un errore durante la generazione della mappa Snapshot: Errore del server",
		menuText: "Snapshot",
		tooltip: "Snapshot"
	},
	
	"gxp.plugins.EmbedMapDialog.prototype" :{
		exportMapText: "Collega Mappa",		
		toolsTitle: "Scegliere gli strumenti da includere nella barra:",		
		alertEmbedTitle: "Attenzione",		
		alertEmbedText: "Salvare la mappa prima di utilizzare il tool 'Pubblicazione Mappa'",			
		previewText: "Anteprima",				
		embedCodeTitle: "Codice da Incorporare",
		embedURL: "URL diretto",		
		urlLabel: "URL",
		showMapTooltip: "Mostra in una nuova finestra",
        loadMapText: "Carica Mappa",
        downloadAppText: "Installa Applicazione Android",
        loadInMapStoreMobileText:'Mobile',
        openImageInANewTab: "Apri immagine in una nuova tab"
	},

    "gxp.widgets.form.SpatialSelectorField.prototype" :{
        title : "Regione di Interesse",
        selectionMethodLabel : "Metodo di Selezione",
        comboEmptyText : "Selezionate un Metodo..",
        comboSelectionMethodLabel : "Selezione",
        northLabel : "Nord",
        westLabel : "Ovest",
        eastLabel : "Est",
        southLabel : "Sud",
        setAoiTitle : "Bounding Box",
        setAoiText : "Disegna",
        setAoiTooltip : "Abilita il controllo SetBox per disegnare l'area d'interesse (Bounding Box) sulla mappa",
        areaLabel : "Area",
        perimeterLabel : "Perimetro",
        radiusLabel : "Raggio",
        centroidLabel : "Centroide",
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Scegliere una Località",
        geocodingPanelBtnRefreshTxt : "Mostra Geometrie",
        geocodingPanelBtnDestroyTxt : "Nascondi Geometrie",
        geocodingPanelBtnDeleteTxt : "Rimuovi Località",
        geocodingPanelLocationHeader: "Località",
        geocodingPanelCustomHeader: "Parente",
        geocodingPanelGeometryHeader: "WKT della Geometria",
        geocodingPanelBtnSelectAllTxt : "Seleziona Tutto", 
        geocodingPanelBtnDeSelectAllTxt : "Deseleziona Tutto", 
        geocodingPanelMsgRemRunningTitle : "Rimuovi Località",
        geocodingPanelMsgRemRunningMsg : "Vuoi rimuovere le Località selezionate dalla lista?",
        geocodingFieldLabel : "Cerca una Località",
        geocodingFieldEmptyText : "Inserisci Località...",
        geocodingFieldBtnAddTooltip : "Aggiungi una Località alla lista",
        geocodingFieldBtnDelTooltip : "Pulisci...",
        selectionSummary : "Sommario delle Selezioni",
        geocoderSelectorsLabels: ['Unione delle geometrie', 'Lista delle Area Amministrative', 'Area Amministrativa e sottoaree'],
        selectionReturnTypeLabel: "Tipo di selezione"
    },
    
    "gxp.plugins.WFSGrid.prototype":{
        displayMsgPaging: "Visualizzazione elementi {0} - {1} of {2}",
        emptyMsg: "Nessun elemento da visualizzare",
        loadMsg: "Attendere prego...",
        zoomToTooltip: 'Zoom all\'elemento'        
    },
    
    "gxp.plugins.TabPanelWFSGrids.prototype":{
        zoomToTooltip: 'Zoom all\'elemento',
        displayMsgPaging: "Visualizzazione elementi {0} - {1} of {2}",
        emptyMsg: "Nessun elemento da visualizzare",
        loadMsg: "Attendere prego...",
        noRecordFoundLabel: "Nessun elemento trovato"
    },
    
    "gxp.plugins.spatialselector.SpatialSelector.prototype" :{
        titleText : "Regione di Interesse",
        selectionMethodLabel : "Metodo di Selezione",
        comboEmptyText : "Selezionate un Metodo..",
        comboSelectionMethodLabel : "Selezione"
    },
    
    "gxp.widgets.form.spatialselector.SpatialSelectorMethod.prototype" :{
        areaLabel : "Area",
        perimeterLabel : "Perimetro",
        lengthLabel: "Lunghezza",
        radiusLabel : "Raggio",
        centroidLabel : "Centroide",
        selectionSummary: "Sommario delle Selezioni",
        geometryOperationText: "Operazione geometrica",
        geometryOperationEmptyText: "Seleziona una operazione",
        distanceTitleText: "Distanza",
        distanceUnitsTitleText: "Unità di misura",
        noOperationTitleText: "Operazione non valida",
        noOperationMsgText: "Prego, selezionare una operazione prima di eseguire la query",
        noCompleteMsgText: "Prego, completare il riempimento della form prima di eseguire la query"
    },
    
    "gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.prototype" :{
        name  : 'BBOX',
        label : 'Bounding Box',
        northLabel : "Nord",
        westLabel : "Ovest",
        eastLabel : "Est",
        southLabel : "Sud",
        setAoiTitle : "Bounding Box",
        setAoiText : "Disegna",
        setAoiTooltip : "Abilita il controllo SetBox per disegnare l'area d'interesse (Bounding Box) sulla mappa"
    },
    
    "gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.prototype" :{
        name  : 'Buffer',
        label : 'Buffer',
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X'
    },
    
    "gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod.prototype" :{
        name  : 'Cerchio',
        label : 'Cerchio'
    },
    
    "gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.prototype" :{
        name  : 'Geocoding',
        label : 'Geocoding',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Scegliere una Località",
        geocodingPanelBtnRefreshTxt : "Mostra Geometrie",
        geocodingPanelBtnDestroyTxt : "Nascondi Geometrie",
        geocodingPanelBtnDeleteTxt : "Rimuovi Località",
        geocodingPanelLocationHeader: "Località",
        geocodingPanelCustomHeader: "Parente",
        geocodingPanelGeometryHeader: "WKT della Geometria",
        geocodingPanelBtnSelectAllTxt : "Seleziona Tutto", 
        geocodingPanelBtnDeSelectAllTxt : "Deseleziona Tutto", 
        geocodingPanelMsgRemRunningTitle : "Rimuovi Località",
        geocodingPanelMsgRemRunningMsg : "Vuoi rimuovere le Località selezionate dalla lista?",
        geocodingFieldLabel : "Cerca una Località",
        geocodingFieldEmptyText : "Inserisci Località...",
        geocodingFieldBtnAddTooltip : "Aggiungi una Località alla lista",
        geocodingFieldBtnDelTooltip : "Pulisci...",
        selectionSummary : "Sommario delle Selezioni"
    },
    
    "gxp.widgets.form.spatialselector.PolygonSpatialSelectorMethod.prototype" :{
        name  : 'Poligono',
        label : 'Poligono'
    },

    "gxp.plugins.spatialselector.Geocoder.prototype" :{
        titleText: "Geocoder",
        searchText: "Ricerca",
        searchTpText: "Ricerca la zona selezionata ed esegui lo zoom sulla mappa",
        resetText: "Azzeramento",
        resetTpText: "Azzeramento ricerca zona",
        translatedKeys: {
            "name": "Strada",
            "number": "Numero"
        }
    },
	
	"gxp.plugins.ResourceStatus.prototype":{
		rootNodeText: "Risorse Importate",
		serviceErrorTitle: "Errore Servizio",
		tabTitle: "Importati",
		layerNodeName: "Livelli",
		serviceNodeName: "Servizi"
    },
	
	"gxp.plugins.SpatialSelectorQueryForm.prototype":{
        noFilterSelectedMsgTitle: "Nessun filtro selezionato",    
        noFilterSelectedMsgText: "Devi selezionare almeno un filtro",    
        invalidRegexFieldMsgTitle: "Campo non valido",    
        invalidRegexFieldMsgText: "Uno o più campi non sono stati riempiti correttamente!"
    },
	
	"gxp.plugins.FeatureManager.prototype":{
        noValidWmsVersionMsgTitle: 'Versione WMS non valida',    
        noValidWmsVersionMsgText: "Il plugin queryForm non funziona con una sorgente WMS versione: "
    },
    "gxp.data.WMTSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "Nessun layer disponibile su questo server nel sistema di coordinate della mappa",
        warningTitle: "Attenzione"
    },
    "gxp.data.TMSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "Nessun layer disponibile su questo server nel sistema di coordinate della mappa",
        warningTitle: "Attenzione"
    }
});
