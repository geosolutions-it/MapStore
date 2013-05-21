/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */

GeoExt.Lang.add("it", {
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
        aboutThisMapText: "Approposito di questa Mappa",
        searchTabTitle : "Portale",
        viewTabTitle : "Vista",
		markerPopupTitle: "Dettagli",
		mainLoadingMask: "Attendere prego ..."
    },
    
    "GeoExplorer.Composer.prototype": {
        exportMapText: "Pubblicazione Mappa",
		uploadText: "Caricamento",
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
		cswFailureAddLayer: ' Il layer n on può essere aggiunto alla mappa',
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
        stylesText: "Stile"
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
	    creatingPdfText: "Creazione del file PDF..."
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

    "gxp.plugins.Login.prototype":{
      loginText: "Se connecter",
          loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
          userFieldText: "Utilisateur",
          passwordFieldText: "Mot de passe"
    },
	
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Visualizza in mappa",
        firstPageTip: "Prima pagina",
        previousPageTip: "Pagina precedente",
        zoomPageExtentTip: "Zoom all'estensione della pagina",
        nextPageTip: "Prossima pagina",
        nextPageTip: "Ultima pagina",
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
    
    "gxp.plugins.ImportExport.prototype":{
           importexportLabel: "Importa / Esporta",
	   labels:{
                "map": {
                    "saveText" : "Esportazione Mappa",
                    "loadText" : "Importazione Mappa",
                    "uploadWindowTitle" : "Importa file di contesta di mappa",
                    "downloadWindowTitle" : "Esporta file di contesta di mappa"
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
            failedUploadingTitle: "Impossibile generara il file di mappa",
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
       }
	
});
