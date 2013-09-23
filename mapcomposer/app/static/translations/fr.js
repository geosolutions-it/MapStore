/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("fr", {
	"gxp.plugins.SyntheticView.prototype": {
        title: "Vue synthétique",
        elaborazioneLabel: "Traitement standard",
        formulaLabel: "Formule",
        extentLabel: "Domaine territorial",
        targetLabel: "type de cible",
        adrClassLabel: "Classe ADR  (transport marchandises dangeuereuses)",
        substanceLabel: "Substances",
        accidentLabel: "accident",
        seriousnessLabel: "Entité",
        severenessLabel: "Gravità",
        buffersLabel: "Distances des Zones de dommages",
        fieldSetTitle: "Traitement",
        cancelButton: "Annulez le traitement",
        processButton: "Exécuter le traitement",
        analyticViewButton: "Visualisation analytique ",
        weatherLabel: "Conditions météorologiques",  
        temporalLabel: "Conditions temporelles",
        elabStandardLabel: "Processing Standard",
        totalRiskLabel: "Le risque total",
        humanTitle:'social',    
        resultsLabel: "Risultato Elaborazione", 
        notHumanTitle:'l\'environnement', 
        defaultExtentLabel: "Regione Piemonte",
        targetsTextBotton: "Cibles",
        areaDamageTextBotton: "Zones de dommages",
        roadGraphTextBotton: "Graphique routière",  
        wpsTitle: "Errore",
        wpsError: "Errore nella richiesta al servizio WPS",
        loadMsg: "S'il vous plaît attendre ...",
        notVisibleOnArcsMessage: "Formula pas visible à cette échelle",
        notVisibleOnGridMessage: "Formula pas visible à cette échelle"

    },
    "gxp.plugins.StandardProcessing.prototype": {
        title: "Traitement",
        elaborazioneLabel: "traitement de type",
        formulaLabel: "Formule",                
        northLabel:"Nord",
        westLabel:"Ouest",
        eastLabel:"Est",
        southLabel:"Sud",
        aoiFieldSetTitle: "Domaine territorial",
        setAoiText: "sélectionnez une zone",        
        setAoiTooltip: "Permet de sélectionner la région d'intérêt sur ​​la carte",
        notAvailableProcessing: "Type de traitement n'est pas encore disponible",
        targetLabel: "Cible",
        macroTargetLabel: "Catégorie",
        targetSetLabel: "type de cible",
        accidentSetLabel : "Type d'accident",
        adrLabel: "Classe ADR  (transport marchandises dangeuereuses)",
        sostanzeLabel: "Substance",
        accidentLabel: "accident",
        seriousnessLabel: "Entité",
        resetButton: "Réinitialisez",
        cancelButton: "Annulez",
        viewMapButton: "Lancer le traitement",
        formLabel: "Réglage de traitement",
        bboxValidationTitle: "Sélectionnez Zone d'intérêt",
        requiredMaterial: "Cette formule nécessite la spécification de la substance",
        requiredAccident: "Cette formule nécessite la spécification de l\'accident",
        requiredSeriousness: "Cette formule nécessite la spécification de l\'Entité",  
        requiredDamageArea: "Sélectionnez la zone de dommages",        
        validationTitle: "Erreur de paramètre",
        invalidAOI: "Les coordonnées de la zone d'intérêt ne sont pas valides.",
        bboxTooBig: "La zone sélectionnée est trop grand et le serveur peut prendre un certain temps à réagir Si vous voulez quand même continuer, appuyez sur OK.",
        weatherLabel: "Météo",  
        temporalLabel: "orages",
        conditionsFielSetLabel: "termes",   
        allClassOption: "Toutes les classes",
        allSostOption: "Toutes les substances",
        allScenOption: "tous les accidents",
        allEntOption: "Toutes les entités",
        allTargetOption: "Toutes les cibles",
        allHumanTargetOption: "Toutes les cibles humaines",
        allNotHumanTargetOption: "Toutes les cibles environnementales",
        entLieve: "léger",
        entGrave: "grave",
        humanRiskLabel: "risques sociaux",
        notHumanRiskLabel: "risque environnemental",
        lowRiskLabel: "risque faible",
        mediumRiskLabel: "risque moyen",
        highRiskLabel: "risque élevé",
        notVisibleOnArcsMessage: "Formula pas visible à cette échelle",
        notVisibleOnGridMessage: "Formula pas visible à cette échellee"
    },
    "gxp.plugins.TabPanelWFSGrids.prototype": {
        displayMsgPaging: "Elements {0} - {1} of {2}",
        emptyMsg: "No elements found",
        noRecordFoundLabel: "No elements found",
        loadMsg: "S'il vous plaît attendre ..."
    },
    "GeoExplorer.prototype": {
        zoomSliderText: "<div> Niveau de zoom: {zoom}</div><div Echelle: 1:{scale}</div>",
        loadConfigErrorText: "Difficulté à lire la configuration enregistrée: <br>",
        loadConfigErrorDefaultText: "Erreur de serveur.",
        xhrTroubleText: "Problème de communication: état",
        layersText: "Couvertures",
		legendText: "Légende",
        titleText: "Titre",
        zoomLevelText: "Niveau de Zoom  ",
        saveErrorText: "Problème de sauvegarde",
        bookmarkText: "Mettre l`URL en favori",
        permakinkText: "Permalien",
        appInfoText: "Crédits",
        aboutText: "À propos de GeoExplorer",
        mapInfoText: "Info cartographique",
        descriptionText: "Description",
        contactText: "Contact",
        aboutThisMapText: "À propos de cette carte",		
        searchTabTitle : "Chercher",
        viewTabTitle : "Vue",
        portalTabTitle : "Portail",
		markerPopupTitle: "Détails",
		mainLoadingMask: "S'il vous plaît attendre ..."
    },  

    "GeoExplorer.Composer.prototype": {
        loadMapText: "Importer une carte ou un fichier KML",
        saveMapText: "Exporter une carte",
        exportMapText: "Publier une carte",
		loadMapEmptyText: "Sélectionnez un fichier KML ou de contexte",
		loadMapUploadText: "Chargement...",
		uploadText: "Télécharger",
		loadMapWindowTitle: 'formulaire de téléchargement de  fichier',
		loadMapErrorText:'Erreur de chargement de fichier',
        toolsTitle: "Sélectionner l`application à inclure dans la barre d`outils",
        previewText: "Previsualiser",
        backText: "Retour en arrière",
        nextText: "Suivant",
        loginText: "Se connecter",
        loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
        userFieldText: "Utilisateur",
        passwordFieldText: "Mot de passe",
        fullScreenText: "Plein écran",
        cswMsg: 'Chargement...',
	    uploadWaitMsg: 'Chargement de le fichier de contexte...',
		uploadErrorTitle: 'Erreur de téléchargement de fichiers',
		uploadEmptyText: 'Sélectionnez un fichier de contexte',
		uploadWinTitle: 'Formulaire de téléchargement',
		cswFailureAddLayer: ' La couche ne peuvent pas être ajoutés à la carte',
		uploadButtonText: 'Charger',
        alertEmbedTitle: 'Attention',
        alertEmbedText: "Enregistrer la carte avant d'utiliser l'outil 'Publier la carte'",
	    cswZoomToExtentMsg: "BBOX pas disponible",
		cswZoomToExtent: "CSW zoom dans la mesure"
    },  

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Couverture"
    },  

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Ajouter des couvertures",
        addActionTip: "Ajouter des couvertures",
        addServerText: "Ajouter un nouveau serveur",
        addButtonText: "Ajouter des couvertures",
        untitledText: "Sans titre",
        addLayerSourceErrorText: "Erreur d`obtention des capacités WMS ({msg}).\nVeuillez vérifier l`URL et essayez à nouveau.",
        availableLayersText: "Couvertures disponibles",
        expanderTemplateText: "<p><b>Résumé:</b> {abstract}</p>",
        panelTitleText: "Titre",
        layerSelectionText: "Visualiser les données disponibles depuis:",
        doneText: "Terminé",
        removeFilterText: "effacer le filtre", 
        filterEmptyText: "Filtre",
        uploadText: "Télécharger les données"
    }, 
	
	"gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Retirer des superpositions",
	    removeOverlaysActionTip: "Supprime toutes les superpositions de la carte",
	    removeOverlaysConfirmationText: "Etes-vous sûr de vouloir supprimer tous les calques chargés de la carte?"
    },
    
	
    "gxp.plugins.BingSource.prototype": {
        title: "Bing couvertures",
        roadTitle: "Bing routes",
        aerialTitle: "Bing aérienne",
        labeledAerialTitle: "Bing aérienne avec des étiquettes"
    },  

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Introduire SVP la clef Google API ",
        menuText: "Vue 3D",
        tooltip: "Passer à la vue 3D"
    },  

    "gxp.plugins.GoogleSource.prototype": {
        title: "Couvertures Google",
        roadmapAbstract: "Voir la carte des rues",
        satelliteAbstract: "Voir les images satellites",
        hybridAbstract: "Afficher des images avec les noms de rue",
        terrainAbstract: "Voir la cartes des rues avec le relief"
    },  

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Propriétés de la couverture",
        toolTip: "Propriétés de la couverture"
    },  

    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Couvertures",
        overlayNodeText: "SIIG",
        baseNodeText: "Couvertures de base"
    },  

    "gxp.plugins.Legend.prototype": { 
        menuText: "Légende",
        tooltip: "Montrer la légende"
    },  

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Longueur",
        areaMenuText: "Surface",
        lengthTooltip: "Mesure de longueur",
        areaTooltip: "Mesure de surface",
        measureTooltip: "Mesure",
        bearingMenuText: "Roulement",
        bearingTooltip: "Mesurer le roulement"
    },  

    "gxp.plugins.Navigation.prototype": {
        menuText: "Carte Panoramique",
        tooltip: "Carte Panoramique"
    },  

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom précédent",
        nextMenuText: "Zoom suivant",
        previousTooltip: "Zoom précédent",
        nextTooltip: "Zoom suivant"
    },  

    "gxp.plugins.OSMSource.prototype": {
        title: "Calques OpenStreetMap",
        mapnikAttribution: "Les données CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Les données CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },  

    "gxp.plugins.Print.prototype": {
        menuText: "Imprimer la carte",
        tooltip: "Imprimer la carte",
        previewText: "Aperçu avant impression",
        notAllNotPrintableText: "Toutes les couvertures ne sont pas imprimables",
        nonePrintableText: "Aucune couverture n`est imprimable",
        notPrintableLayersText: "Veuillez enlever ces couches et tous les marqueurs avant impression. Les couvertures suivantes ne sont pas imprimables:"
    },  

    "gxp.plugins.MapQuestSource.prototype": {
        title: "Couvertures MapQuest",
        osmAttribution: "Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest images"
    },  

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Enlever la couverture",
        removeActionTip: "Enlever la couverture"
    },  

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Obtenir des infos sur l`entité",
        popupTitle: "Info sur l`entité",
		noDataMsg: "Aucune donnée n'a été renvoyée par le serveur",
		maskMessage: "Obtenir des infos sur l`entité..."
    },  

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Zoom Avant",
        zoomOutMenuText: "Zoom Arrière",
        zoomInTooltip: "Zoom Avant",
        zoomOutTooltip: "Zoom Arrière"
    },  

    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom sur l`étendue de la carte",
        tooltip: "Zoom sur l`étendue de la carte"
    },  

    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom sur l`étendue de la couverture",
        tooltip: "Zoom sur l`étendue de la couverture"
    },  

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom sur l`étendue de la couverture",
        tooltip: "Zoom sur l`étendue de la couverture"
    },  

    "gxp.WMSLayerPanel.prototype": {
        aboutText: "A propos",
        titleText: "Titre",
        nameText: "Nom",
        descriptionText: "Description",
        displayText: "Affichage",
        opacityText: "Opacité",
        formatText: "Format",
        transparentText: "Transparent",
        cacheText: "Cache",
        cacheFieldText: "Utiliser la version mise en cache",
        stylesText: "Styles",
        sliderRischioText: "Risques",
        sliderRischioSocialeText: "Sociaux",
        sliderRischioAmbientaleText: "Environnemental",
        minRangeSliderText: "faible ",
        medRangeSliderText: "moyen",
        maxRangeSliderText: "élevé",
        riskTabTitle: "Thématisation",
        riskTabSubmitText: "Appliquer",
        riskTabResetText: "Par défaut"
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
        title: "Ajouter un nouveau serveur...",
        cancelText: "Annuler",
        addServerText: "Ajouter un serveur",
        invalidURLText: "Enter un URL valide jusqu`au WMS final (e.g. http://example.com/geoserver/wms)",
        contactingServerText: "Contacter un serveur"
    },  

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Niveau de zoom"
    },
    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Ajouter un Groupe",
	    addGroupActionTip: "Ajoutez un nouveau groupe à l'arbre des couvertures.",   
	    addGroupDialogTitle: "Nouveau Groupe", 
	    addGroupFieldSetText: "Groupe Nom",
	    addGroupFieldLabel: "Nouveau Groupe",
	    addGroupButtonText: "Ajouter un Groupe",
	    addGroupMsg: "Entrez le nom du groupe"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Supprimer le groupe",
	    removeGroupActionTip: "Supprimer le groupe de l'arbre des couvertures",
	    removeGroupActionTip: "Supprimer le groupe sélectionné et ses couvertures de la carte",
	    removeGroupConfirmationText: "Vous êtes certain que vous souhaitez supprimer le groupe ? Tous les couvertures au sein du groupe seront supprimés de la carte."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Enregistrez le contexte par défaut.",
	    saveDefaultContextActionTip: "Enregistrer contexte Carte.",
	    contextSaveSuccessString: "Sauver le contexte est géré.",
	    contextSaveFailString: "Sauver le contexte a échoué.",
	    contextMsg: "Chargement..."
    },
    "gxp.plugins.GeoReferences.prototype":{
        initialText: "Sélectionner une zone",
        menuText: "Codification Géographique",
        tooltip: "Codification Géographique"
	
    },
	"gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box Avant",
        zoomOutMenuText: "Zoom Box Arrière",
        zoomInTooltip: "Zoom Box Avant",
        zoomOutTooltip: "Zoom Box Arrière"
    },
    "GeoExt.ux.PrintPreview.prototype":{
        paperSizeText: "Taille de papier:",
        resolutionText: "Résolution:",
        printText: "Imprimer",
        emptyTitleText: "Entrez le titre de la carte ici.",
        includeLegendText: "Inclure la légende?",
        legendOnSeparatePageText: "Légende sur une page distincte?",
        compactLegendText: "Légende compact?",	
        emptyCommentText: "Entrer des commentaires d'ici.",
        creatingPdfText: "Création PDF...",
        printOsmText: "OpenStreetMap Background?"
    },
    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Afficher les métadonnées",
        geonetworkSearchActionTip: "Afficher les métadonnées"
    },
    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText: "Propriétés du groupe",
        groupPropertiesActionTip: "Propriétés du groupe",
        groupPropertiesDialogTitle: "Propriétés du groupe - ",
        groupPropertiesFieldSetText: "Nom du groupe",
        groupPropertiesFieldLabel: "nom du nouveau groupe",
        groupPropertiesButtonText: "Fait",
        groupPropertiesMsg: "Veuillez entrer un nom de groupe"
    },
    
    "gxp.plugins.Login.prototype":{
      loginText: "Se connecter",
          loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
          userFieldText: "Utilisateur",
          passwordFieldText: "Mot de passe"
    },
	
	"gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Afficher sur la carte",
        firstPageTip: "Première page",
        previousPageTip: "Page précédente",
        zoomPageExtentTip: "Zoom sur la page",
        nextPageTip: "Page suivante",
        nextPageTip: "Dernière page",
        totalMsg: "Total: {0} records"
    },
	
	"gxp.plugins.QueryForm.prototype": {
        queryActionText: "Query",
        queryMenuText: "Couche de requêtes",
        queryActionTip: "Interroger la couche sélectionnée",
        queryByLocationText: "Query selon le lieu",
        currentTextText: "Mesure actuelle",
        queryByAttributesText: "Requête par attributs",
		queryMsg: "Recherche...",
        cancelButtonText: "Remettre",
        noFeaturesTitle: "Pas de correspondance",
        noFeaturesMessage: "Votre requête n'a retourné aucun résultat.",
        title: "Rechercher",
        northLabel:"Nord",
        westLabel:"Ouest",
        eastLabel:"Est",
        southLabel:"Sud",
        setAoiText: "FixéROI",
        setAoiTooltip: "Activer le contrôle TextBox pour dessiner un ROI (BOX) sur la carte",
        attributeEnablement: "Requête par attributs",
        attributeEnablementMsg: "Invalid search Type! To use this you have to select 'Feature' type and to select a vector layer before.",
        searchType: "Réglages de base",
        typeLabel: "Type",
        featureLabel: "Max Features"
    },
    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Votre carte est prête à être publiée sur le web! Il suffit de copier le code HTML ci-dessous pour intégrer la carte dans votre site web:",
        heightLabel: "Hauteur",
        widthLabel: "Largeur",
        mapSizeLabel: "Taille de la carte",
        miniSizeLabel: "Mini",
        smallSizeLabel: "Petit",
        premiumSizeLabel: "Premium",
        largeSizeLabel: "Grand"
    },
    "gxp.plugins.GoogleGeocoder.prototype": {
        addMarkerTooltip: "Réinitialiser Marker"
    },
	"gxp.plugins.DynamicGeocoder.prototype": {
        addMarkerTooltip: "Réinitialiser Marker",
        emptyText: "Géocoder..."
    },
	"gxp.plugins.ReverseGeocoder.prototype": {
        buttonText: "Adresse",
        emptyText: "Adresse...",
		errorMsg: "Aucune adresse trouvée",
		waitMsg: "S'il vous plaît attendre...",
		addressTitle: "Adresse trouvée"
    },
	"gxp.form.WFSSearchComboBox.prototype": {
		emptyText:"Rechercher",
		loadingText: "recherche..."
	},
	"gxp.form.ContextSwitcher.prototype":{
		switchActionTip : "Changement de carte",
		switchSaveAlert: " Toutes les données non enregistrées seront a perdu.",
		switchConfirmationText : "Vous êtes certain que vous souhaitez le carte?"

	},
	"gxp.form.LanguageSwitcher.prototype":{
		switchActionTip : "Changement de langue",
		switchConfirmationText : "Vous êtes certain que vous souhaitez modifier la langue?"//Vous êtes certain que vous souhaitez modifier la langue? toutes les données non enregistrées seront a perdu?"

	},
    "gxp.form.AOIFieldset.prototype":{
        northLabel:"Nord",
        westLabel:"Ouest",
        eastLabel:"Est",
        southLabel:"Sud",
        title: "Territorial",
        setAoiText: "Sélectionner une zone",        
        setAoiTooltip: "Permettre la sélection de la région d'intérêt sur ​​la carte",
        waitEPSGMsg: "Attendez ... Chargement"
    },
    "gxp.form.SelDamageArea.prototype":{
        selAreaDamageTitle: "Sélection de la région",
        selAreaDamageLabel: "Méthode de sélection",
        selAreaDamageEmptyText: "--- Choisissez le type ---",
        comboPolygonSelection: 'Polygon',
        comboCircleSelection: 'Arrondissez',
        comboBufferSelection: "Buffer"
    },

    "gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Gamme de tampon",
		bufferFieldSetTitle: "Tampon",
		coordinatePickerLabel: "Coordonnées",
		draweBufferTooltip: "Dessinez le tampon"
	},

	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordonnées',
		pointSelectionButtionTip: 'Cliquez pour activer la sélection du collimateur',
		latitudeEmptyText: 'Latitude',
		longitudeEmptyText: 'Longitude'
	},

	"gxp.plugins.SelectVulnElem.prototype":{
        menuText: "Afficher les éléments vulnérables",
        tooltip: "Afficher les éléments vulnérables",
        allHumanTargetTitle: "Toutes les cibles humaines",
        allNotHumanTargetTitle: "Toutes les cibles environnementales",
        selectAllTitle: "SELECT ALL",
        addToMapButtonText: "Ajouter à la carte"
	}
});
