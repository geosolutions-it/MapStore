/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */

GeoExt.Lang.add("it", {
	"gxp.plugins.SyntheticView.prototype": {
        title: "Vista Sintetica",
        elaborazioneLabel: "Tipo elaborazione",
        formulaLabel: "Formula",
        extentLabel: "Ambito territoriale",
        targetLabel: "Tipo bersaglio",
        adrClassLabel: "Classe ADR",
        substanceLabel: "Sostanze",
        accidentLabel: "Incidente",
        seriousnessLabel: "Entità",
        severenessLabel: "Gravità",
        buffersLabel: "Raggi Aree Danno",
        fieldSetTitle: "Elaborazione",
        cancelButton: "Annulla Elaborazione",
        processButton: "Esegui Elaborazione",
        analyticViewButton: "Visualizzazione Analitica",
        weatherLabel: "Condizioni Meteo",  
        temporalLabel: "Condizioni Temporali",
        elabStandardLabel: "Elaborazione Standard",
        totalRiskLabel: "Rischio totale",
        humanTitle:'Sociale',    
        resultsLabel: "Risultato Elaborazione", 
        notHumanTitle:'Ambientale', 
        defaultExtentLabel: "Regione Piemonte",
        targetsTextBotton: "Bersagli",
        areaDamageTextBotton: "Aree di danno",
        roadGraphTextBotton: "Grafo stradale" , 
        wpsTitle: "Errore",
        wpsError: "Errore nella richiesta al servizio WPS",
        loadMsg: "Caricamento in corso...",
        notVisibleOnArcsMessage: "Formula non visibile a questa scala",
        notVisibleOnGridMessage: "Formula non visibile a questa scala",
        refreshGridButton: "Aggiorna la griglia",
        simMsg: 'Modifica dei parametri di simulazione non possibile a questa scala. Zoomare fino a scala 1:17061',
        saveButton: "Salva Elaborazione",
        saveProcessingTitle: "Salvataggio Elaborazione",
        saveProcessingMsg: "Elaborazione già salvata con questo nome, vuoi sostituirla?",
        saveProcessingErrorTitle: "Salvataggio Elaborazione",
        saveProcessingErrorMsg: "Impossibile salvare l'elaborazione",
        saveProcessingSuccessTitle: "Salvataggio Elaborazione",
        saveProcessingSuccessMsg: "Elaborazione salvata con successo",
        saveProcessingNameFieldsetTitle: "Elaborazione",
        saveProcessingNameLabel: "Nome",
        saveProcessingDescriptionLabel: "Descrizione",
        saveProcessingButtonText: "Salva Elaborazione",
        saveProcessingWinTitle: "Nuova Elaborazione",
        loadButton: "Carica Elaborazione",
        loadProcessingNameHeader: 'Nome',
        loadProcessingDescriptionHeader: 'Descrizione',
        removeProcessingTooltip: 'Rimuovi Elaborazione',
        removeProcessingMsgTitle: "Eliminazione Elaborazione",
        removeProcessingMsg: "Vuoi eliminare l'elaborazione? L'azione è irreversibile!",
        loadProcessingButtonText: "Carica Elaborazione",
        selectProcessingMsgTitle: "Seleziona Elaborazione",
        selectProcessingMsg: "Devi selezionare una elaborazione",
        loadProcessingWinTitle: "Carica Elaborazione",
        
        saveDownloadMenuButton: "Scarica",            
        saveDownloadProcessingTitle: "Esportazione",
        loadDownloadButton: "Storico",
        loadDownloadProcessingWinTitle: "Download Elaborazione",
        loadDownloadProcessingButtonText: "Download Elaborazione",
        failureAchieveResourceTitle: "Errore",
        failureAchieveResourceMsg: "Non ci sono elaborazioni salvate per questo utente"
    },
    "gxp.plugins.StandardProcessing.prototype": {
        title: "Elaborazione",
        elaborazioneLabel: "Tipo elaborazione",
        formulaLabel: "Formula",                
        northLabel:"Nord",
        westLabel:"Ovest",
        eastLabel:"Est",
        southLabel:"Sud",
        aoiFieldSetTitle: "Ambito Territoriale",
        setAoiText: "Seleziona Area",        
        setAoiTooltip: "Abilita la selezione della regione di interesse sulla mappa",
        notAvailableProcessing: "Tipo di elaborazione non ancora disponibile",
        targetLabel: "Bersaglio",
        macroTargetLabel: "Categoria",
        targetSetLabel: "Tipo bersaglio",
        accidentSetLabel : "Tipo Incidente",
        adrLabel: "Classe ADR",
        sostanzeLabel: "Sostanza",
        accidentLabel: "Incidente",
        seriousnessLabel: "Entità",
        resetButton: "Reimposta",
        cancelButton: "Annulla",
        viewMapButton: "Elabora",
        formLabel: "Impostazioni di Elaborazione",
        bboxValidationTitle: "Selezione Area di Interesse",
        requiredMaterial: "Questa formula richiede di specificare la sostanza",
        requiredAccident: "Questa formula richiede di specificare l\'incidente",
        requiredSeriousness: "Questa formula richiede di specificare l\'entità",
        requiredDamageArea: "Selezionare l'area di danno",
        validationTitle: "Errore nei parametri",   
        invalidAOI: "Le coordinate dell'area di interesse non sono valide.",
        bboxTooBig: "L'area selezionata e' troppo grande e il server potrebbe impiegare molto tempo a rispondere. Se si desidera continuare ugualmente premere OK.",
        weatherLabel: "Meteo",  
        temporalLabel: "Temporali",
        conditionsFielSetLabel: "Condizioni",   
        allClassOption: "Tutte le classi",
        allSostOption: "Tutte le sostanze",
        allScenOption: "Tutti gli incidenti",
        allEntOption: "Tutte le entità",
        allTargetOption: "Tutti i bersagli",
        allHumanTargetOption: "Tutti i Bersagli Umani",
        allNotHumanTargetOption: "Tutti i Bersagli Ambientali",
        entLieve: "Lieve",
        entGrave: "Grave",
        humanRiskLabel: "Rischio Sociale",
        notHumanRiskLabel: "Rischio Ambientale",
        lowRiskLabel: "Basso Rischio",
        mediumRiskLabel: "Medio Rischio",
        highRiskLabel: "Alto Rischio",
        notVisibleOnArcsMessage: "Formula non visibile a questa scala",
        notVisibleOnGridMessage: "Formula non visibile a questa scala"
    },
    "gxp.plugins.TabPanelWFSGrids.prototype": {
        displayMsgPaging: "Elementi {0} - {1} di {2}",
        emptyMsg: "Nessun elemento trovato",
        noRecordFoundLabel: "Nessun elemento trovato",
        loadMsg: "Caricamento in corso..."
    },
    "gxp.plugins.WFSGrid.prototype": {
        displayMsgPaging: "Elementi {0} - {1} di {2}",
        emptyMsg: "Nessun elemento trovato",
        loadMsg: "Caricamento in corso...",
        addTooltip: "Aggiungi elemento",
        addLayerTooltip: "Aggiungi livello alla  mappa",
        detailsTooltip: "Visualizza dettagli",
        deleteTooltip: "Elimina feature",
        deleteConfirmMsg: "Sei sicuro di voler eliminare la feature?",
        detailsHeaderName: "Property Name",
        detailsHeaderValue: "Property Value",
        detailsWinTitle: "Dettagli",
        zoomToTooltip: "Zoom al bersaglio",
        startEditToTooltip: "Inizia modifica riga",
        startEditGeomToTooltip: "Inizia modifica Feature",
        stopEditGeomToTooltip: "Termina modifica Feature",
        resetEditGeomToTooltip: "Annulla modifica Feature",
        removeMessage: "Rimuovi",
        removeTitle:"Sei sicuro di voler eliminare la feature?"
    },
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Livello di Zoom: {zoom}</div><div>Scala: 1:{scale}</div>",
        loadConfigErrorText: "Impossibile leggerre la configurazione salvata : <br />",
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
        aboutThisMapText: "Crediti",		
        searchTabTitle : "Portale",
        viewTabTitle : "Vista",
		markerPopupTitle: "Dettagli",
		mainLoadingMask: "Attendere prego ..."
    },
    
    "GeoExplorer.Composer.prototype": {
        loadMapText: "Importazione Mappa",
        saveMapText: "Esportazione Mappa",
        exportMapText: "Pubblicazione Mappa",
	    loadMapEmptyText: "Selezionare un file di contesto",
		loadMapUploadText: "Caricamento in corso",
		uploadText: "Caricamento",
		loadMapWindowTitle: 'Form di Caricamento File',
		loadMapErrorText:'Errore nel caricamento del file',
        toolsTitle: "Scegliere gli strumenti da includere nella barra:",
        previewText: "Anteprima",
        backText: "Precedente",
        nextText: "Prossimo",
        loginText: "Login",
        loginErrorText: "Username o password invalidi.",
        userFieldText: "Utente",
        passwordFieldText: "Password",
        fullScreenText: "Schermo Intero",
        cswMsg: 'Caricamento...',
	    uploadWaitMsg: 'Caricamento del file di contesto...',
		uploadErrorTitle: 'Errore di Caricamento',
		uploadEmptyText: 'Seleziona un file di contesto',
		uploadWinTitle: 'From di Caricamento',
		cswFailureAddLayer: ' Il layer n on può essere aggiunto alla mappa',
		uploadButtonText: 'Carica',
        alertEmbedTitle: 'Attenzione',
        alertEmbedText: "Salvare la mappa prima di utilizzare il tool 'Pubblicazione Mappa'",
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
        overlayNodeText: "SIIG",
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
        previousMenuText: "Zoom alla precedente estenzione",
        nextMenuText: "Zoom alla prossima estenzione",
        previousTooltip: "Zoom alla precedente estenzione",
        nextTooltip: "Zoom alla prossima estenzione"
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

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom Avanti",
        zoomOutMenuText: "Zoom Indietro",
        zoomInTooltip: "Zoom Avanti",
        zoomOutTooltip: "Zoom Indietro"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom massima estenzione",
        tooltip: "Zoom massima estenzione"
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
        transparentText: "Transparenza",
        cacheText: "Cache",
        cacheFieldText: "Usa versione in cache",
        stylesText: "Stile",
        sliderRischioText: "Rischio",
        sliderRischioSocialeText: "Sociale",
        sliderRischioAmbientaleText: "Ambientale",
        minRangeSliderText: "Basso",
        medRangeSliderText: "Medio",
        maxRangeSliderText: "Alto",
        riskTabTitle: "Tematizzazione",
        riskTabSubmitText: "Applica",
        riskTabResetText: "Valori Predefiniti"
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
	    contextMsg: "Caricamento..."
    },
	
    "gxp.plugins.GeoReferences.prototype": {
        initialText: "Seleziona un'area",
        menuText: "Geo Referimenti",
        tooltip: "Geo Referimenti"
    },

    "gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box Avanti",
        zoomOutMenuText: "Zoom Box Indietro",
        zoomInTooltip: "Zoom Box Avanti",
        zoomOutTooltip: "Zoom Box Indietro"
    },

    "GeoExt.ux.PrintPreview.prototype":{
	    paperSizeText: "Dimesioni del foglio:",
	    resolutionText: "Risoluzione:",
	    printText: "Stampa",
	    emptyTitleText: "Inserisci qui il titolo della mappa.",
	    includeLegendText: "Includere la legenda?",
	    legendOnSeparatePageText: "Legenda in una pagina separata?",
	    compactLegendText: "Legenda compatta?",	
	    emptyCommentText: "Inserisci qui i commenti.",
	    creatingPdfText: "Creazione del file PDF...",
        printOsmText: "Sfondo OpenStreetMap?"
    },

    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Visualizza metadati",
        geonetworkSearchActionTip: "Visualizza metadati"
    },

    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText:  "Proprietà del gruppo",
        groupPropertiesActionTip:  "Proprietà del gruppo",
        groupPropertiesDialogTitle: "Proprietà del gruppo - ",
        groupPropertiesFieldSetText: "Nome del Gruppo",
        groupPropertiesFieldLabel: "Nuovo nome del Gruppo",
        groupPropertiesButtonText: "Fatto",
        groupPropertiesMsg: "Si prega di inserire il nome del gruppo."
    },

    "gxp.plugins.Login.prototype":{
        loginText: "Login",
        loginErrorText: "Username o password invalidi.",
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
        totalMsg: "Totale: {0} righe"
    },
	
    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Interrogazione",
        queryMenuText: "Interrogazione livello",
        queryActionTip: "Interrogazione il livello selezionato",
        queryByLocationText: "Regione di Interesse",
        currentTextText: "Estensione corrente",
        queryByAttributesText: "Interrogazione per attributo",
        queryMsg: "Interrogazione in corso...",
        cancelButtonText: "Reimposta",
        noFeaturesTitle: "Nessun Risultato",
        noFeaturesMessage: "La tua ricerca non ha prodotto risultati.",
        title: "Ricerca",
        northLabel:"Nord",
        westLabel:"Ovest",
        eastLabel:"Est",
        southLabel:"Sud",
        setAoiText: "ImpostaROI",
        setAoiTooltip: "Abilita il controllo SetBox per disegnare una ROI (BBOX) sulla mappa",
        attributeEnablement: "Interrogazione per Attributo",
        attributeEnablementMsg: "Tipo di ricerca invalido! Si deve prima selezionare il tipo 'Feature' e il layer vettoriale.",
        searchType: "Impostazioni di base",
        typeLabel: "Tipo",
        featureLabel: "Max Features"
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
		switchConfirmationText : "Si è sicuri di voler cambiare lingua?"//Si è sicuri di voler cambiare lingua? I dati non salvati saranno persi

	},
    "gxp.form.AOIFieldset.prototype":{
        northLabel:"Nord",
        westLabel:"Ovest",
        eastLabel:"Est",
        southLabel:"Sud",
        title: "Ambito Territoriale",
        setAoiText: "Seleziona Area",        
        setAoiTooltip: "Abilita la selezione della regione di interesse sulla mappa",
        waitEPSGMsg: "Attendere... Caricamento in corso"
    },
    "gxp.form.SelDamageArea.prototype":{
        selAreaDamageTitle: "Selezione area",
        selAreaDamageLabel: "Metodo selezione",
        selAreaDamageEmptyText: "--- Scegli tipologia ---",
        comboPolygonSelection: 'Poligono',
        comboCircleSelection: 'Cerchio',
        comboBufferSelection: "Buffer"
    },

	"gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Ampiezza del Buffer",
		bufferFieldSetTitle: "Buffer",
		coordinatePickerLabel: "Coordinate",
		draweBufferTooltip: "Disegna il Buffer"
	},

	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordinate',
		pointSelectionButtionTip: 'Clicca sulla mappa per abilitare la selezione del punto',
		latitudeEmptyText: 'Latitudine',
		longitudeEmptyText: 'Longitudine'
	},

	"gxp.plugins.SelectVulnElem.prototype":{
        menuText: "Visualizzazione Elementi Vulnerabili",
        tooltip: "Visualizzazione Elementi Vulnerabili",
        allHumanTargetTitle: "Tutti i Bersagli Umani",
        allNotHumanTargetTitle: "Tutti i Bersagli Ambientali",
        selectAllTitle: "SELEZIONA TUTTO",
        addToMapButtonText: "Aggiungi alla mappa"
	},

	"gxp.plugins.GateTimeSliderTab.prototype":{
        gateLabel: 'Gate',
        gateSelection: 'Selezione Gate',
        gatePanelTitle: "Dati in tempo reale - Gate",
        gateStatGridStart: "Data Inizio Statistiche",
        gateStatGridEnd: "Data Fine Statistiche",
        gateStatGridRoute: "Corsia",
        gateStatGridDirection: "Direzione",
        gateStatGridKemler: "Kemler Cod",
        gateStatGridOnu: "Onu Cod",
        gateStatGridAmount: "Quantita",
        gateElementText: "Elemento",
        gateElementsText: "Elementi",
        gateTotalRenderer: "Totale",
        gateStatFieldsetTitle: "Dati Statistici precalcolati",
        gateStartDateText: 'Data inizio',
        gateEndDateText: 'Data fine',
        gateViewTimeGateButtonText: 'Visualizza dati Gate',
        gateInfoTimeTitle: "Visualizzazione dati Gate",
        gateInfoTimeMsg: "Selezionare un intervallo temporale!",    
        gateTimeSelectorTitle: "Seleziona intervallo temporale",    
        gateSliderFieldsetTitle: "Dati a scelta libera",
        gateTimeGridDetectionDate: "Data rilevamento",
        gateAveragePerHourRenderer: 'Media Oraria',
        gateTimeGridHourTimeZone: "Ora fuso orario",
        gateTimeGridMinuteTimeZone: "Minuto fuso orario",
        gateTimeGridReceptionDate: "Data Ricezione",
        gateTimeGridRoute: "Corsia",
        gateTimeGridDirection: "Direzione",
        gateTimeGridKemler: "Kemler Cod",
        gateTimeGridOnu: "Onu Cod"
	},

	"gxp.widgets.button.SelectFeatureButton.prototype":{
        tooltip: "Seleziona il Gate cliccando sulla mappa"
	}      
});
