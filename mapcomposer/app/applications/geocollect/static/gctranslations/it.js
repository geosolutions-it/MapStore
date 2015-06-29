/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("it", {
    //GeoCollect Manager Classes
	"mxp.plugins.GeostoreMissionResourceEditor.prototype": {
        buttonText: "Configurazione Missione"
    },
    "mxp.widgets.GcResourceEditor.prototype":{
        jsonPanel:'Configurazione Avanzata',
        jsonToGuiBtnText:'Aggiungi',
        jsonToGuiBtnTooltip:'Carica Configurzione',
        guiToJSONBtnText:'Recupera',
        guiToJSONBtnTooltip:'Recupera Configurazione',
        checkMissionBtn:"Valida",
        checkMissionBtnTooltip:"Valida La Configurazione",
        validateMsgValid:"Template Missione Valido",
        validateMsgInvalid:"Template Missione Non Valido",
        validateMsgTitle:"Valido?"
    },
    "mxp.widgets.GcMobileResourceEditor.prototype":{
        title:'Mobile',
        previewTabTitle:"Lista Segnalazioni",
        infoTabTitle:"Dettagli Segnalazione",
        surveyTabTitle:"Scheda Sopralluoghi",
        noticeTabTitle:"Scheda Segnalazioni",
        previewMsgTitle:"Attenzione",
        previewMsg:"Lista Segnalazioni Deve Essere Valida Per Procedere"
    },
    "mxp.widgets.GcMListResourceEditor.prototype":{

        nameFieldLabel:'Nome',
        descriptionFieldLabel:"Descrizione",
        orderingFieldLabel:"Ordinamento",
        iconFieldLabel:"Campo Icona",
        addCondBtnTooltib:'Crea Condizione',
        removeCondBtnTooltib:'Elimina Conditione',
        condMsgTitle:"Errore",
        condMsg:"Condizione Non Valida, Obbligatori Tipo Condizione, Valore E Colore",
        bntValidateText:"Valida",
        btnValidateTooltip:"Valida Lista Segnalazioni",
        validateMsgValid:"Lista Segnalazioni Valida",
        validateMsgInvalid:"Lista Segnalazioni Non Valida",
        validateMsgTitle:"Valida?"
    },
    "mxp.widgets.GcMobileWidgetPanel.prototype":{

        sourceLabel : 'Campi Segnalazione',
        destLabel : 'Campi Sopralluogo',
        wdgTypeLabel: 'Tipo Widget',
        widgetsGridTitle:"Widgets",
        inputTypeLabel:"Input",
        wdgGridXTypeHd:"Xtype",
        wdgGridFiledHd:"Id Campo",
        wdgGridValueHd:"Valore",
        btnValidateTitle:"Valida",
        btnValidateTooltip:'Valida Widgets Pagina',
        validateMsgValid:"Pagina Valida",
        validateMsgInvalid:"Pagina Non Valida",
        validateMsgTitle:"Valida?",
        btnAddTooltip:"Crea Widget",
        addMsgTitle: "Salva Widget?",
        addMsg:"Vuoi Salvare Modifiche?",
        btnDelTooltip:"Elimina Widget",
        delMsgTitle:"Elimina Widget",
        delMsg:"Eliminare Widget?",
        btnSaveTooltip:"Salva Widget",
        btnSaveText:"Salva",
        pageTitleLabel:"Titolo Pagina",
        pageMsgLabel:"Messaggio Pagina",
        saveMsg:"Vuoi Salvare Modifiche?",   
        saveMsgTitle:"Salva Widget?",
        saveAlertMsg:"Proprieta Widget Non Valide",
        saveAlertTitle:"Errore"
    },
    "mxp.widgets.GcFormResourceEditor.prototype":{
        surveyFormTitle:"Titolo Form",
        surveyFormDataUrlLabel:"Url Dati",
        surveyFormMediaUrlLabel:"Url Media",
        btnAddPageText:"Crea Pagina",
        btnAddPageTooltip:"Crea Nuova Pagina",
        savePageMsgTitle:"Salva Pagina?",
        savePageMsg:"Vuoi Salvare La Pagina?",
        saveErroMsgTitle:"Errore",
        saveErrorMsg:"Proprietà Pagina Non Valide",
        btnDelPageText:"Elimina Pagina",
        btnDelPageTooltip:"Elimina Pagina Selezionata",
        delPageMsgTitle:"Elimina Pagina?",
        delPageMsg:"Vuoi Eliminare La Pagina",
        btnSavePageText:"Salva",
        btnSavePageTooltip:"Salva Pagina Selezionata",
        pagesGridTitle:"Pagine",
        btnValidateText:"Valida",
        btnValidateTooltip:"Valida Pagine",
        validateMsgValid:"Template Sopralluoghi Valide",
        validateMsgInvalid:"Template Sopralluoghi Non Valido",
        validateMsgTitle:"Valido?",
        destLabel : 'Campi Sopralluogo'

     },
     "mxp.widgets.GcFormSegResourceEditor.prototype":{
        destLabel:'Campi Segnalazione'
     },
      "mxp.widgets.GcConfigPanel.prototype":{
        title : "Configurazioni Aggiuntive",
        checkMissionBtn:"Valida",
        checkMissionBtnTooltip:"Valida Configurazioni",
        validateMsgValid:"Configurazioni Valide",
        validateMsgInvalid:"Configurazioni Non Valide",
        validateMsgTitle:"Valida?"
     },
     "mxp.widgets.GcDbResourceEditor.prototype":{
        title:'Sorgente Dati',
        selectDbLabel:'Schema ',
        noticeTitle:"Segnalazioni",
        surveyTitle:'Sopralluoghi',
        sColName:"Nome",
        sColType:"Tipo",
        serverError:"Risposta Server Non Valida.",
        errorLayer:"Impossibile Creare Sorgenti"
     },
     "mxp.widgets.XtypeTextField.prototype":{
        idFieldLabel:"Campo",
        labFieldLabel:"Label",
        valueFieldLabel:"Valore",
        mandatoryFieldLabel:"Obbligatorio",
        optFieldLabel:"Valori Predefiniti"
    },
    "mxp.widgets.OptionsCreator.prototype":{
        erroMsg:"Spazi Non Permessi",
        insertLabel:"Valori",
        btnAddTooltip:"Aggiungi Valori",
        btnRemoveTooltip:"Elimina Valori",
        fieldLabel:'Valori Predefiniti',
        deleteMsgTitle: 'Eliminare Valori?',
        deleteMsg: 'Eliminare tutti i valori aggiunti?'
    },
    "mxp.widgets.XtypeSpinner.prototype":{
        idFieldLabel:"Campo",
        labFieldLabel:"Label",
        optFieldLabel:"Valori Predefiniti"  
    },
    "mxp.widgets.XtypeSepIc.prototype":{
      labFieldLabel:"Label",
      valueFieldLabel:"Campo Icona"
    },
    "mxp.widgets.XtypePhoto.prototype":{
        labFieldLabel:"Messaggio Action"
    },
   "mxp.widgets.XtypeMap.prototype":{
        descrFieldLabel:"Descrizione",
        editableFieldLabel:"Editabile",
        panFieldLabel:"Abilita Pan",
        zoomFieldLabel:"Abilita Zoom",
        displayFieldLabel:"Mostra Valore",
        centerFieldLabel:"Centra",
        centerMsgLabel:"Messaggio",
        localizeFieldLabel:"Localizza",
        localizeMsgLabel:"Messaggio",
        zoomLevelLabel:"Livello Zoom",
        mapHeightLabel:"Altezza Mappa"
    },
    "mxp.widgets.XtypeLabel.prototype":{
        idFieldLabel:"Campo",
        labFieldLabel:"Label",
        valueFieldLabel:"Valore"
    },
    "mxp.widgets.XtypeDateField.prototype":{
        idFieldLabel:"Campo",
        labFieldLabel:"Label",
    }, "mxp.widgets.XtypeCheckBox.prototype":{
        idFieldLabel:"Campo",
        labFieldLabel:"Label"
    },
    "mxp.widgets.XActionSend.prototype":{
        valueFieldLabel:"Testo",
        labFieldLabel:"Messaggio"
    },
    "mxp.widgets.XActionSave.prototype":{
        valueFieldLabel:"Testo",
        labFieldLabel:"Messaggio"
    },
    //GeoCollect Composer Classes
    "gxp.plugins.GcSegGrid.prototype": {
        displayFeatureText: "Mostra In  Mappa",
        firstPageTip: "Prima Pagina",
        previousPageTip: "Pagina Precedente",
        zoomPageExtentTip: "Zoom All'Estensione Della Pagina",
        nextPageTip: "Prossima Pagina",
        lastPageTip: "Ultima Pagina",
        title: "Entità",
        totalMsg: "Totale: {0} Entità",
        displayExportCSVText: "Esporta Nel Formato CSV",
        exportCSVSingleText: "Singola Pagina",
        exportCSVMultipleText: "Tutte Le Pagine",
        failedExportCSV: "Impossibile Esportare Nel Formato CSV",
        invalidParameterValueErrorText: "Valore Parametro Non Valido",
        zoomToFeature: "Zoom Alla Feature",
        exportTitleText: "Esporta",
        pageLabel: "Pagina",
        pageOfLabel: "di",
        totalRecordsLabel: "Elementi Totali",
        btnDetailsText:  "Dettagli",
        btnDetailsTooltip: "Apri Dettagli Segnalazione",
        btnMapText:  "Mappa",
        btnMapTooltip: "Mostra Mappa",
        noticeDetailsPanelTitle:"Dettagli Segnalazione",
        photoBrowserPanelTitle:"Foto Sopralluogo",
        noticePhotoBrowserPanelTitle:"Foto Segnalazione",
        surveysPanelTitle:"Sopralluoghi",
        noticePanelTitle:"Segnalazione"    
    },
    "gxp.plugins.GcFeatureEditor.prototype":{
        createFeatureActionTip: "Crea Nuova Segnalazione",
        saveOrCancelEdit:'Salva O Elimina Modifiche',
        editFeatureActionTip: "Seleziona Segnalazione"

    },
    "gxp.grid.GcHistoryGrid.prototype":{
        title:'Storico',
        loadingText: 'Aspetta...Carico Storico',
        emptyText: "Ricerca"
    },
    "Ext.PagingToolbar.prototype":{
        displayMsg : 'Mostrando {0} - {1} di {2}',
        emptyMsg : 'Nessun Dato',
        beforePageText : 'Pagina',
        afterPageText : 'di {0}',
        firstText : 'Prima Pagina',
        prevText : 'Page Precedente',
        nextText : 'Prossima Pagina',
        lastText : 'Ultima Pagina',
        refreshText : 'Aggiorna'
    },
    "gxp.plugins.GcSegForm.prototype":{
        closeMsgTitle: 'Salvare Segnalazione?',
        closeMsg: 'Vuoi Salvare La Sgnalazione?',
        deleteMsgTitle: 'Eliminare Segnalazionie?',
        deleteMsg: 'Vuoi Eliminare La Segnalazione?',
        editButtonText: 'Modifica',
        editButtonTooltip: 'Attiva Editing',
        deleteButtonText: 'Elimina',
        deleteButtonTooltip: 'Elimina Questa Segnalazione',
        cancelButtonText: 'Annulla',
        cancelButtonTooltip: 'Arresta Editing, Annullla Modifiche',
        saveButtonText: 'Salva',
        saveButtonTooltip: 'Salva Modifiche'
    },
    "gxp.grid.GcSopGrid.prototype":{
        title:'Dettagli',
        deleteMsgTitle:'Elimina',
        deleteMsg:'Vuoi Eliminare Il Sopralluogo Selezionato?',
        deleteButtonText:'Elimina',
        deleteButtonTooltip:'Elimina Sopralluogo Selezionato',
        editButtonText:'Modifica',
        editButtonTooltip:'Modifica Soparlluogo Selezionato',
        saveButtonText:'Salva',
        saveButtonTooltip:'Salva Modifiche',
        cancelButtonText:'Annulla',
        cancelButtonTooltip:'Annulla Modifiche',
        saveOrCancelEdit:'Salva O Annulla Modifiche',
        commitErrorTitle:'Errore Durantre Il Salvataggio',
        commitErrorMsg:'Modifiche Non Salvate!',
        refreshButtonTooltip:"Ricarica Sopralluoghi"
    },
    "mxp.plugins.MapManager.prototype":{
        buttonText: "Gestione Missioni",
        tooltipText: "Apri Gestore Missioni"
    },
     "mxp.widgets.GcExportLayers.prototype":{
        exportFormatsLabel:"Formato Export",
        exportBtnTooltip:"Scarica Layers",
        invalidParameterValueErrorText:"Errore Export!"
    },
     "MSMPagingToolbar.prototype":{
        resizerText: "Missioni per pagina"
    },
      "MSMGridPanel.prototype": {
        googleTooltip:"Scarica L'App Per Android Da Google Play™"
      }
});
