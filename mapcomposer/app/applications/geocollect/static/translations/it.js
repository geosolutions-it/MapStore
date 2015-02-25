/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("it", {
   
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
        validateMsgTitle:"Valido?",        
    },
    "mxp.widgets.GcMobileResourceEditor.prototype":{
        title:'Mobile',
        previewTabTitle:"Lista Segnalazioni",
        infoTabTitle:"Dettagli Segnalazione",
        surveyTabTitle:"Form Sopralluoghi",
        noticeTabTitle:"Form Segnalazioni",
        previewMsgTitle:"Attenzione",
        previewMsg:" Must Be Valid To Proceed",
    }


});
