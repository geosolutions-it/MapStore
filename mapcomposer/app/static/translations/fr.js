/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("fr", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div> Niveau de zoom: {zoom}</div><div Echelle: 1:{scale}</div>",
        loadConfigErrorText: "Difficulté pour lire la configuration enregistrée: <br>",
        loadConfigErrorDefaultText: "Erreur du serveur.",
        xhrTroubleText: "Problème de communication: état",
        layersText: "Couches",
		legendText: "Légende",
        titleText: "Titre",
        zoomLevelText: "Niveau de Zoom",
        saveErrorText: "Problème lors de la sauvegarde",
        bookmarkText: "Mettre l`URL dans les favoris",
        permakinkText: "Permalien",
        appInfoText: "Crédits",
        aboutText: "À propos de GeoExplorer",
        mapInfoText: "Info sur la carte",
        descriptionText: "Description",
        contactText: "Contact",
        aboutThisMapText: "À propos de cette carte",
		resetButtonTooltip: "Réinitialiser la Page",
		helpButtonTooltip: "Aide",
        searchTabTitle : "Rechercher",
        viewTabTitle : "Vue",
        portalTabTitle : "Portail",
		markerPopupTitle: "Détails",
		mainLoadingMask: "Veuillez attendre, chargement en cours ..."
    },  

    "GeoExplorer.Composer.prototype": {
		uploadText: "Téléverser",
        backText: "Précédent",
        nextText: "Suivant",
        loginText: "Se connecter",
        loginErrorText: "Nom d`utilisateur ou mot de passe incorrect",
        userFieldText: "Utilisateur",
        passwordFieldText: "Mot de passe",
        fullScreenText: "Plein écran",
        cswMsg: 'Chargement...',
		cswFailureAddLayer: ' La couche ne peut pas être ajoutée à la carte',
	    cswZoomToExtentMsg: "BBOX non disponible",
		cswZoomToExtent: "CSW zoom sur l’étendue"
    },  

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Couche"
    },  

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Ajouter des couches",
        addActionTip: "Ajouter des couches",
        addServerText: "Ajouter Serveur",
        addButtonText: "Ajouter des couches",
        untitledText: "Sans titre",
        addLayerSourceErrorText: "Erreur d’obtention des capacités WMS ({msg}).\nVeuillez vérifier l`URL et essayer à nouveau.",
        availableLayersText: "Couches disponibles",
        expanderTemplateText: "<p><b>Résumé:</b> {abstract}</p>",
        panelTitleText: "Titre",
        layerSelectionText: "Visualiser les données disponibles:",
        doneText: "Terminé",
        removeFilterText: "Effacer le filtre", 
        filterEmptyText: "Filtre",
        uploadText: "Téléverser les données"
    }, 
	
	"gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Retirer les superpositions",
	    removeOverlaysActionTip: "Supprime toutes les superpositions de la carte",
	    removeOverlaysConfirmationText: "Etes-vous sûr de vouloir supprimer toutes les superpositions présentes dans la carte?"
    },    
	
    "gxp.plugins.BingSource.prototype": {
        title: "Couches Bing",
        roadTitle: "Couche Bing des routes",
        aerialTitle: "Couche aérienne Bing",
        labeledAerialTitle: "Couche aérienne Bing avec étiquettes"
    },  

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Veuillez introduire la clef pour l’API Google",
        menuText: "Vue 3D",
        tooltip: "Basculer en vue 3D"
    },  

    "gxp.plugins.GoogleSource.prototype": {
        title: "Couches Google",
        roadmapAbstract: "Voir la carte des rues",
        satelliteAbstract: "Voir la carte satellite",
        hybridAbstract: "Afficher la carte satellite avec les noms de rue",
        terrainAbstract: "Voir la carte des rues avec le relief"
    },  

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Propriétés de la couche",
        toolTip: "Propriétés de la couche"
    },  

    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Couches",
        overlayNodeText: "Surimpressions",
        baseNodeText: "Couches de base"
    },  

    "gxp.plugins.Legend.prototype": { 
        menuText: "Afficher la légende",
        tooltip: "Afficher la légende"
    },  

    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Longueur",
        areaMenuText: "Superficie",
        lengthTooltip: "Mesure de longueur",
        areaTooltip: "Mesure de superficie",
        measureTooltip: "Mesure",
        bearingMenuText: "Angle",
        bearingTooltip: "Mesure d’angle"
    },  

    "gxp.plugins.Navigation.prototype": {
        menuText: "Navigation dans la carte",
        tooltip: "Navigation dans la carte"
    },  

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom précédent",
        nextMenuText: "Zoom suivant",
        previousTooltip: "Zoom précédent",
        nextTooltip: "Zoom suivant"
    },  

    "gxp.plugins.OSMSource.prototype": {
        title: "Calques OpenStreetMap",
        mapnikAttribution: "Les données CC-By-SA produites par <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Les données CC-By-SA produites par <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },  

    "gxp.plugins.Print.prototype": {
        menuText: "Imprimer la carte",
        tooltip: "Imprimer la carte",
        previewText: "Aperçu avant impression",
        notAllNotPrintableText: "Impossible d’imprimer toutes les couches",
        nonePrintableText: "Aucune couche ne peut être imprimée",
        notPrintableLayersText: "Veuillez supprimer ces couches et tous les marqueurs avant impression. Les couches suivantes ne peuvent être imprimées :"
    },  

    "gxp.plugins.MapQuestSource.prototype": {
        title: "Couvertures MapQuest",
        osmAttribution: "Avec l’autorisation ‘Tile’ de Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Avec l’autorisation ‘Tile’ de Avec la permission de tuiles <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "MapQuest images"
    },  

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Supprimer la couche ",
        removeActionTip: "Supprimer la couche"
    },  

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Obtenir des infos sur l’entité",
        popupTitle: "Info sur l’entité",
		noDataMsg: "Aucune donnée n'a été renvoyée par le serveur",
		maskMessage: "Obtenir des infos sur l’entité..."
    }, 
	
	"gxp.plugins.WMSGetFeatureInfoMenu.prototype": {
        infoActionTip: "Obtenir des infos sur l’entité",
        popupTitle: "Info sur l’entité",
		noDataMsg: "Aucune donnée n'a été renvoyée par le serveur",
		maskMessage: "Obtenir des infos sur l’entité...",
		activeActionTip:"Obtenir des infos sur l’entité sélectionnée"
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
        menuText: "Zoom sur l`étendue de la couche",
        tooltip: "Zoom sur l`étendue de la couche"
    },  

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom sur l`étendue de la couche",
        tooltip: "Zoom sur l`étendue de la couche"
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
        summaryText: "Statistiques",
        summaryInfoText: "StatisticsStatistiques des données raster sur l’étendue actuelle",
        loadMaskMsg: "Extraction des données en cours...",
        noDataMsg: "Pas de données disponibles dans la vue actuelle",
        refreshText: "Actualiser"
    },  

    "gxp.NewSourceWindow.prototype": {
        title: "Ajouter un serveur",
        cancelText: "Annuler",
        addServerText: "Ajouter un serveur",
        invalidURLText: "Saisir l’URL d’un serveur WMS(par ex. : http://example.com/geoserver/wms)",
        contactingServerText: "Contact du serveur en cours",
		sourceTypeLabel: "Type",
		advancedOptionsTitle: "Advanced Options",
		generalTabTitle: "General",
		titleLabel: "Title",
		versionLabel: "Version (*)",
		authParamLabel: "Auth Param",
		minXLabel: "MinX",
		minYLabel: "MinY",
		maxXLabel: "MaxX",
		maxYLabel: "MaxY",
		paramsTabTitle: "Params",
		cacheTabTitle: "Cache",
		addParamButtonText: "Add",
		propNameLabel: "Name",
		propValueLabel: "Value",
		paramsWinTitle: "Params Options",
		okButtonText: "Ok",
		addPropDialogTitle: "Add Property",
		addPropDialogMsg: "Property name or his value are not valid",
		cancelButtonText: "Cancel",
		removeButtonText: "Remove",
		removePropDialogTitle: "Remove Property",
		removePropDialogMsg: "This property cannot be removed: ",
		newSourceDialogTitle: "New Source",
		newSourceDialogMsg: "Some source selected properties are invalid.",
		mandatoryLabelText: "All fields marked with (*) are mandatory."
    },  

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Niveau de zoom"
    },
    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Ajouter un Groupe",
	    addGroupActionTip: "Ajouter un nouveau groupe à l’arborescence",   
	    addGroupDialogTitle: "Nouveau Groupe", 
	    addGroupFieldSetText: "Nom du Groupe",
	    addGroupFieldLabel: "Nouveau Groupe",
	    addGroupButtonText: "Ajouter un Groupe",
	    addGroupMsg: "Saisir le nom du groupe"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Supprimer le groupe",
	    removeGroupActionTip: "Supprimer le groupe de l’arborescence",
	    removeGroupActionTip: "Supprimer le groupe sélectionné et ses couches de la carte",
	    removeGroupConfirmationText: "Etes-vous certain de vouloir supprimer le groupe ? Tous les couches du groupe seront également supprimées de la carte."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Enregistrer le contexte par défaut",
	    saveDefaultContextActionTip: "Enregistrer le contexte de carte",
	    contextSaveSuccessString: "Enregistrement du contexte effectué avec succès",
	    contextSaveFailString: "Echec lors de l’enregistrement du contexte",
	    contextMsg: "Chargement en cours...",
		userLabel: "Utilisateur",	
		passwordLabel: "Mot de passe", 	
		loginLabel: "Connexion",	
		mapMetadataTitle: "Insérer les métadonnées de la carte",	
		mapMedatataSetTitle: "Métadonnées de la carte",	
		mapNameLabel: "Nom",	
		mapDescriptionLabel: "Description",
		addResourceButtonText: "Ajouter la carte"
    },
    "gxp.plugins.GeoReferences.prototype":{
        initialText: "Sélectionner une zone",
        menuText: "Codification Géographique",
        tooltip: "Codification Géographique"
	
    },
	"gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Outil de Zoom Avant",
        zoomOutMenuText: "Outil de Zoom Arrière",
        zoomInTooltip: "Outil de Zoom Avant",
        zoomOutTooltip: "Outil de Zoom Arrière"
    },
    "GeoExt.ux.PrintPreview.prototype":{
        paperSizeText: "Taille de papier:",
        resolutionText: "Résolution:",
        printText: "Imprimer",
        emptyTitleText: "Saisir le titre de la carte ici.",
        includeLegendText: "Inclure la légende ?",
        legendOnSeparatePageText: "Légende sur une page distincte ?",
        compactLegendText: "Légende compacte ?",	
        emptyCommentText: "Entrer des commentaires ici.",
        creatingPdfText: "Création du PDF en cours...",
		graticuleFieldLabelText: 'Réticule actif',
		defaultTabText: "Défaut",
		legendTabText: "Légende"
    },
	
	"GeoExt.ux.LegendStylePanel.prototype":{
		iconsSizeText: "Taille des icônes",
		fontSizeText: "Taille de police",
		fontFamilyText: "Famille de polices",
		forceLabelsText: "Forcer l’étiquetage",
		dpiText: "Dpi",
		fontStyleText: "Style de police",
		fontEditorText: "Configuration de l’étiquetage",
		sizeText: "Taille"
    },
    
    "GeoExt.ux.GraticuleStylePanel.prototype":{
        graticuleFieldLabelText: 'Réticule actif',
        sizeText: "Taille",
        colorText: "Couleur",
        fontFamilyText: "Famille de polices",
        fontStyleText: "Style de police",
        fontEditorText: "Configuration de l’étiquetage"
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
        groupPropertiesFieldLabel: "Nom du nouveau groupe",
        groupPropertiesButtonText: "Terminé",
        groupPropertiesMsg: "Veuillez saisir un nom pour le groupe"
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
        lastPageTip: "Dernière page",
        title: "Entités",
        totalMsg: "Total : {0} entités",
        displayExportCSVText: "Exporter au format CSV",
        exportCSVSingleText: "Une seule page",
        exportCSVMultipleText: "Toute la  page",
        failedExportCSV: "Impossible de trouver une réponse pour le format de sortie CSV",
        invalidParameterValueErrorText: "Valeur de paramètre non valide",
		zoomToFeature: "Zoom sur l’Entité",
		comboFormatMethodLabel: "Format",
        comboFormatEmptyText: "Veuillez sélectionner un format",
        noFormatTitleText: "Format incorrect",
        noFormatBodyText: "Veuillez sélectionner un format valide",
        exportTitleText: "Exporter",
		pageLabel: "Page",
		pageOfLabel: "sur",
		totalRecordsLabel: "Nombre de Dossiers"
    },
	
	"gxp.plugins.QueryForm.prototype": {
        queryActionText: "Requête",
        queryMenuText: "Interroger la couche",
        queryActionTip: "Interroger la couche sélectionnée",
        queryByLocationText: "Requête par emplacement",
        currentTextText: "Etendue actuelle",
        queryByAttributesText: "Requête par attributs",
		queryMsg: "Recherche en cours...",
        cancelButtonText: "Réinitialiser",
        noFeaturesTitle: "Aucune correspondance",
        noFeaturesMessage: "Votre recherche n'a renvoyé aucun résultat.",
        title: "Rechercher",        
        attributeEnablement: "Recherche par attributs",
        attributeEnablementMsg: "Type de recherche non valide ! Vous devez sélectionner le type 'Entité' après avoir choisi une couche vectorielle.",
        searchType: "Réglages de base",
        typeLabel: "Type",
        featureLabel: "Nombre maximum d’entités" 
    },
    
    "gxp.plugins.BBOXQueryForm.prototype": {
        selectionMethodFieldSetComboTitle: "Méthode de sélection",
        comboEmptyText: "Sélectionner une méthode…",
        comboSelectionMethodLabel: "Sélection",
        comboPolygonSelection: 'Polygone',
        comboCircleSelection: 'Cercle',
        comboBBOXSelection: 'Rectangle englobant',
		errorBBOXText: "Le rectangle englobant choisi n'est pas valide!",
        errorDrawPolygonText: "Vous devez dessiner un polygone",
        errorDrawCircleText: "Vous devez dessiner un cercle",     
        errorDrawTitle: "Erreur dans la requête",
		errorBufferTitle: "Erreur de buffer",
		errorBufferText: "Le tampon sélectionné n'est pas valide !",
		areaLabel: "Superficie",	
		perimeterLabel: "Périmètre",	
		radiusLabel: "Rayon",	
		centroidLabel: "Centroïde",	
		selectionSummary: "Récapitulatif sur la Sélection"
    },
	
    "gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Etendue de la zone tampon",
		bufferFieldSetTitle: "Zone tampon",
		coordinatePickerLabel: "Coordonnées",
		draweBufferTooltip: "Dessiner la zone tampon"
	},
    
    "gxp.form.BBOXFieldset.prototype":{
        northLabel:"Nord",
        westLabel:"Ouest",
        eastLabel:"Est",
        southLabel:"Sud",
        waitEPSGMsg: "Veuillez patienter s'il vous plaît...",
        setAoiText: "FixéROI",
        setAoiTooltip: "Activer le contrôle SetBox pour dessiner un rectangle englobant dans la carte",
        title: "Région d'Intérêt"
    },
    
    "gxp.FilterBuilder.prototype":{
        preComboText: "Correspondance",
        postComboText: "de ce qui suit:",
        addConditionText: "ajouter la condition",
        addGroupText: "ajouter un groupe",
        removeConditionText: "supprimer la condition"
    },
    
    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "Votre carte est prête à être publiée sur le web ! Il suffit de copier le code HTML ci-dessous pour intégrer la carte dans votre site web:",
        heightLabel: "Hauteur",
        widthLabel: "Largeur",
        mapSizeLabel: "Taille de la carte",
        miniSizeLabel: "Mini",
        smallSizeLabel: "Petit",
        premiumSizeLabel: "Premium",
        largeSizeLabel: "Grand"
        
    },
    "gxp.plugins.GoogleGeocoder.prototype": {
        addMarkerTooltip: "Réinitialiser le Marqueur"
    },
	"gxp.plugins.DynamicGeocoder.prototype": {
        addMarkerTooltip: "Réinitialiser le marqueur",
        emptyText: "Géocodage en cours..."
    },
	"gxp.plugins.ReverseGeocoder.prototype": {
        buttonText: "Adresse",
        emptyText: "Adresse...",
		errorMsg: "Aucune adresse trouvée",
		waitMsg: "Veuillez patienter s'il vous plaît...",
		addressTitle: "Adresse trouvée"
    },
	"gxp.form.WFSSearchComboBox.prototype": {
		emptyText:"Rechercher",
		loadingText: "Recherche en cours..."
	},
	"gxp.form.ContextSwitcher.prototype":{
		switchActionTip : "Changer de carte",
		switchSaveAlert: " Toutes les données non enregistrées seront perdues.",
		switchConfirmationText : "Etes-vous certain de vouloir changer de carte?"

	},
	"gxp.form.LanguageSwitcher.prototype":{
		switchActionTip : "Changer de langue",
		switchConfirmationText : "Etes-vous certain de vouloir changer de langue?"//Vous êtes certain que vous souhaitez modifier la langue? toutes les données non enregistrées seront perdues ?"

	},
	"gxp.plugins.MarkerEditor.prototype":{
		markerName:'Marqueurs',
		copyText:'Copiez le texte ci-dessous puis collez-le dans la fenêtre "Importer des Marqueurs"...',
		pasteText:'Collez le texte dans la zone de texte et cliquez sur Importer.',
		addToTheMapText:'Ajouter à la carte',
		updateText: 'Mettre à jour',
		resetText:'Réinitialiser',
		removeText:'Supprimer',
		compositeFieldTitle:  'Titre',
		compositeFieldLabel: 'Etiquette',
		coordinatesText: 'Coordonnées',
		contentText: 'Contenu',
		gridColTitle: 'Titre',
		gridColLabel: 'Etiquette',
		gridColLat: 'Lat',
		gridColLon: 'Lon',
		gridColContent: 'Contenu',	
		exportBtn:  "Exporter les Marqueurs",
		importBtn: "Importer les Marqueurs",
		removeAllBnt: 'Supprimer tout',
		markerChooserTitle:'Choisir un marqueur',
		useThisMarkerText:'Utiliser ce Marker',
		selectMarkerText:'Sélectionner un Marqueur',
		insertImageText:'Insérer une image',
		imageUrlText:'URL de l\'image',
		importGeoJsonText:'Importer GeoJSON',
		errorText:"Erreur",
		notWellFormedText:"Le texte que vous avez ajouté n'est pas bien formé. Veuillez vérifier"
	},
	
	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordonnées',
		pointSelectionButtionTip: 'Cliquer pour activer la sélection du collimateur',
		latitudeEmptyText: 'Latitude',
		longitudeEmptyText: 'Longitude'
	},

	"gxp.plugins.AddLayer.prototype":{
		waitMsg: "Veuillez patienter s'il vous plaît...",
		capabilitiesFailureMsg: " La couche WMS ne peut pas être ajoutée à la carte suite à des problèmes lié au service"
    },
        
    "gxp.plugins.Geolocate.prototype":{
        geolocateMenuText: "Géolocaliser",
        geolocateTooltip: "Localiser ma position",
        trackMenuText: "Suivre position",
        trackTooltip: "Suivre ma position",
        waitMsg: "Localisation en cours...",
        errorMsg: "Votre navigateur ne supporte pas la Géolocalisation"
    },
    
	"gxp.plugins.GeoLocationMenu.prototype":{
        initialText: "Sélectionner une zone",
        menuText: "Codification Géographique",
        tooltip: "Codification Géographique",
        addMarkerTooltip: "Réinitialiser le Marqueur",
        emptyText: "Géocodage en cours...",
        buttonText: "Adresse",
        emptyText: "Adresse...",
		errorMsg: "Aucune adresse trouvée",
		waitMsg: "S'il vous plaît attendre...",
		addressTitle: "Adresse trouvée",
		geolocate: {
			geolocateMenuText: "Géolocaliser",
			geolocateTooltip: "Localiser ma position",
			trackMenuText: "Suivre position",
			trackTooltip: "Suivre ma position",
			waitMsg: "Localisation en cours...",
			errorMsg: "Ce navigateur ne supporte pas la Géolocalisation"
		},
		actionText: "Géolocalisations"
    },
	
    "gxp.plugins.ImportExport.prototype":{
        importexportLabel: "Import / Export",
	    labels:{
                "map": {
                    "saveText" : "Exporter la Carte",
                    "loadText" : "Importer la Carte",
                    "uploadWindowTitle" : "Importer le fichier de contexte de carte",
                    "downloadWindowTitle" : "Exporter le fichier de contexte de carte"
                },
                "kml/kmz": {
                    "saveText" : "Export KML",
                    "loadText" : "Importer KML/KMZ",
                    "uploadWindowTitle" : "Import KML/KMZ",
                    "downloadWindowTitle" : "Export KML",
                    "kmlExportTitleText": "Export KML/KMZ",
                    "layerEmptyText": "La couche sélectionnée est vide",
                    "notVectorlayerText": "Veuillez  sélectionner uniquement des couches vectorielles",
                    "notLayerSelectedText": " Veuillez sélectionner uniquement des couches vectorielles"
                } 
        }
    },
   
    "gxp.MapFileUploadPanel" :{
		fileLabel: "Fichier de carte",
		fieldEmptyText: "Rechercher les fichiers de contexte de carte...",
		uploadText: "Envoyer",
		waitMsgText: "Téléversement de vos données en cours ...",
		resetText: "Réinitialiser",
		failedUploadingTitle: "Erreur lors du téléversement du fichier"
    },
   
    "gxp.MapFileDownloadPanel" :{
		buttonText: "Exporter la Carte",
		filenameLabel: "Nom du fichier de carte",
		waitMsgText: "Générer le fichier de contexte de carte...",
		resetText: "Réinitialiser",
		failedUploadingTitle: "Impossible de générer un fichier de carte",
		saveErrorText: "Problème lors de la sauvegarde :"
    },
   
    "gxp.KMLFileDownloadPanel" :{
		buttonText: "Exporter",
		filenameLabel: "Nom du fichier KML",
		waitMsgText: "Génération KML en cours...",
		invalidFileExtensionText: "L'extension du fichier doit être choisie parmi les options suivantes :",
		resetText: "Réinitialiser",
		failedUploadingTitle: "Impossible de générer le fichier KML"
    },
   
    "gxp.KMLFileUploadPanel" :{
		fileLabel: "Le fichier KML",
		fieldEmptyText: "Rechercher des fichiers KML ou KMZ ...",
		uploadText: "Envoyer",
		waitMsgText: "Données en cours de téléversement...",
		invalidFileExtensionText: " L'extension du fichier doit être choisie parmi les options suivantes : ",
		resetText: "Réinitialiser",
		failedUploadingTitle: "Erreur lors du téléversement du fichier",
		layerNameLabel: "Nom de la couche"
    },

	"gxp.plugins.PrintSnapshot.prototype" :{
		noSupportedLayersErrorMsg: "Une erreur s'est produite lors de la génération de l’aperçu de la carte : aucune couche supportée n’a été trouvée !",
		generatingErrorMsg: "Une erreur s'est produite lors de la génération de l’aperçu de la carte ",
		printStapshotTitle: "Imprimer l’aperçu de la carte",
		serverErrorMsg: "Une erreur s'est produite lors de la génération de l’aperçu de la carte : Erreur du serveur",
		menuText: "Aperçu",
		tooltip: "Aperçu"
	},
	
	"gxp.plugins.EmbedMapDialog.prototype" :{
		exportMapText: "Lier la Carte",		
		toolsTitle: "Sélectionner les outils à inclure dans la barre d`outils",		
		alertEmbedTitle: "Attention",		
		alertEmbedText: "Enregistrer la carte avant d'utiliser l'outil 'Publier la carte'",			
		previewText: "Prévisualiser",				
		embedCodeTitle: "Intégrer le code",
		embedURL: "URL directe",		
		embedUrlLabel: "EMBED",
		composerUrlLabel: "FULL",
		showMapTooltip: "Afficher dans une nouvelle fenêtre",
        loadMapText: "Charger cette carte (installer l’application d’abord)", 
        downloadAppText: "Installer l'application", 
        loadInMapStoreMobileText: "Mobile",
        openImageInANewTab: "Ouvrir l’image dans un nouvel onglet"
	},

    "gxp.widgets.form.SpatialSelectorField.prototype" :{
        title : "Région d'Intérêt",
        selectionMethodLabel : "Méthode de Sélection",
        comboEmptyText : "Sélectionner  une Méthode..",
        comboSelectionMethodLabel : "Sélection",
        northLabel : "Nord",
        westLabel : "Ouest",
        eastLabel : "Est",
        southLabel : "Sud",
        setAoiTitle : "Rectangle englobant",
        setAoiText : "Dessiner le rectangle englobant",
        setAoiTooltip : " Activer le contrôle SetBox pour dessiner un rectangle englobant dans la carte ",
        areaLabel : "Superficie",
        perimeterLabel : "Périmètre",
        radiusLabel : "Rayon",
        centroidLabel : "Centroïde",
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X',
        geocodingFieldSetTitle : "Géocodage",
        geocodingPanelTitle : "Localisations sélectionnées",
        geocodingPanelBtnRefreshTxt : "Afficher les Géométries",
        geocodingPanelBtnDestroyTxt : "Cacher les Géométries",
        geocodingPanelBtnDeleteTxt : "Supprimer la localisation",
        geocodingPanelLocationHeader: "Localisation",
        geocodingPanelCustomHeader: "Parent",
        geocodingPanelGeometryHeader: "Géométrie WKT",
        geocodingPanelBtnSelectAllTxt : "Tout sélectionner", 
        geocodingPanelBtnDeSelectAllTxt : "Tout déselectionner", 
        geocodingPanelMsgRemRunningTitle : "Supprimer les localisations",
        geocodingPanelMsgRemRunningMsg : "Souhaitez-vous supprimer les localisations sélectionnées de la liste ?",
        geocodingFieldLabel : "Rechercher une localisation",
        geocodingFieldEmptyText : "Saisir une localisation...",
        geocodingFieldBtnAddTooltip : "Ajouter une localisation à la liste",
        geocodingFieldBtnDelTooltip : "Effacer...",
        selectionSummary : "Récapitulatif sur la sélection",
        geocoderSelectorsLabels: ['Union des géométries', 'Liste des Zones Administratives', 'Sous-liste des Zones Administratives'],
        selectionReturnTypeLabel: "Type de sélection"
    },
    
    "gxp.plugins.WFSGrid.prototype":{
        displayMsgPaging: "Eléments {0} - {1} sur {2}",
        emptyMsg: "Aucun élément à afficher",
        loadMsg: "Veuillez patienter SVP ...",
        zoomToTooltip: "Zoom sur la cible"     
    },
    
    "gxp.plugins.TabPanelWFSGrids.prototype":{
        displayMsgPaging: "Eléments {0} - {1} sur {2}",
        emptyMsg: "Aucun élément trouvé",
        noRecordFoundLabel: " Aucun élément trouvé ",
        loadMsg: "Chargement en cours ..."
    },

    "gxp.plugins.spatialselector.SpatialSelector.prototype" :{
        titleText : "Région d'Intérêt",
        selectionMethodLabel : "Méthode de Sélection",
        comboEmptyText : "Choisir une Méthode..",
        comboSelectionMethodLabel : "Sélection"
    },
    
    "gxp.widgets.form.spatialselector.SpatialSelectorMethod.prototype" :{
        areaLabel : "Superficie",
        perimeterLabel : "Périmètre",
        lengthLabel: "Longueur",
        radiusLabel : "Rayon",
        centroidLabel : "Centroïde",
        selectionSummary: "Récapitulatif sur la sélection",
        geometryOperationText: "Opération sur la géométrie",
        geometryOperationEmptyText: "Choisissez une opération",
        distanceTitleText: "Distance",
        distanceUnitsTitleText: "Unités de distance",
        noOperationTitleText: "Aucune opération valable",
        noOperationMsgText: "Veuillez choisir une opération avant la recherche",
        noCompleteMsgText: "Veuillez compléter le formulaire avant la recherche"        
    },
    
    "gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.prototype" :{
        name  : 'BBOX',
        label : 'Rectangle englobant',
        northLabel : "Nord",
        westLabel : "Ouest",
        eastLabel : "Est",
        southLabel : "Sud",
        setAoiTitle : "Rectangle englobant",
        setAoiText : "Dessiner le rectangle englobant",
        setAoiTooltip : " Activer le contrôle SetBox pour dessiner un rectangle englobant dans la carte "
    },
    
    "gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.prototype" :{
        name  : 'Buffer',
        label : 'Buffer',
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X'
    },
    
    "gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod.prototype" :{
        name  : 'Cercle',
        label : 'Cercle'
    },
    
    "gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.prototype" :{
        name  : 'Géocodage',
        label : 'Géocodage',
        geocodingFieldSetTitle : "Géocodage",
        geocodingPanelTitle : "Localisations sélectionnées",
        geocodingPanelBtnRefreshTxt : "Afficher les Géométries",
        geocodingPanelBtnDestroyTxt : "Cacher les Géométries",
        geocodingPanelBtnDeleteTxt : "Supprimer la localisation",
        geocodingPanelLocationHeader: "Localisation",
        geocodingPanelCustomHeader: "Parent",
        geocodingPanelGeometryHeader: " Géométrie WKT",
        geocodingPanelBtnSelectAllTxt : " Tout sélectionner", 
        geocodingPanelBtnDeSelectAllTxt : "Tout désélectionner", 
        geocodingPanelMsgRemRunningTitle : "Supprimer les localisations",
        geocodingPanelMsgRemRunningMsg : "Souhaitez-vous supprimer les localisations sélectionnées de la liste ?",
        geocodingFieldLabel : "Rechercher une localisation",
        geocodingFieldEmptyText : "Saisir une localisation...",
        geocodingFieldBtnAddTooltip : "Ajouter une localisation à la liste",
        geocodingFieldBtnDelTooltip : "Effacer...",
        selectionSummary : "Récapitulatif sur la Sélection"
    },
    
    "gxp.widgets.form.spatialselector.PolygonSpatialSelectorMethod.prototype" :{
        name  : 'Polygone',
        label : 'Polygone'
    },

    "gxp.plugins.spatialselector.Geocoder.prototype" :{
        titleText: "Géocodage",
        searchText: "Rechercher",
        searchTpText: "Rechercher la localisation sélectionnée et zoomer dessus",
        resetText: "Réinitialiser",
        resetTpText: "Réinitialiser la recherche de localisation",
        translatedKeys: {
            "name": "Rue",
            "number": "Numéro"
        }
    },
	
	"gxp.plugins.ResourceStatus.prototype":{
		rootNodeText: "Ressources importées",
		serviceErrorTitle: "Erreur du Service",
		tabTitle: "Importé",
		layerNodeName: "Ressources",
		waitMsg: "Chargement Des Ressources ...",
		expandAllText: "Développer Tous Les Nœuds",
		collapseAllText: "Réduire Tous Les Nœuds"
    },
	
	"gxp.plugins.SpatialSelectorQueryForm.prototype":{
        noFilterSelectedMsgTitle: "Aucun filtre sélectionné",    
        noFilterSelectedMsgText: "Vous devez sélectionner au moins un filtre",    
        invalidRegexFieldMsgTitle: "Domaines invalides",    
        invalidRegexFieldMsgText: "Un ou plusieurs domaines sont incorrects!"
    },

	"gxp.plugins.FeatureManager.prototype":{
        noValidWmsVersionMsgTitle: 'Version de WMS invalide',    
        noValidWmsVersionMsgText: "L’extension queryForm ne fonctionne pas avec la version de cette source WMS: "
    },
	
    "gxp.data.WMTSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "Aucune couche de la projection cartographique actuelle est disponible sur ce serveur",
        warningTitle: "avertissement"
    },
	
    "gxp.data.TMSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "Aucune couche de la projection cartographique actuelle est disponible sur ce serveur",
        warningTitle: "avertissement"
    },
	
	"gxp.plugins.CategoriesInitializer.prototype":{
        geostoreInitializationTitleText: "L’initialisation a échoué",
        geostoreInitializationText: "La réponse Geostore n’est pas celle attendue",
        notInitializedCategories: "Catégories manquantes : '{0}'. Voulez-vous en créer une ?",
        userFieldText: "Utilisateur",
        passwordFieldText: "Mot de passe",
        acceptText: "Créer",
        cancelText: "Annuler",
        notInitializedCategoriesWithCredentials: "<div class='initCategoriesMessage'>Si vous êtes administrateur veuillez entrer vos crédits afin de créer ces catégories: '{0}'</div>"
    },
	
	"gxp.plugins.AdvancedSnappingAgent.prototype":{
        tooltipText: "Activer/Désactiver Engagement"
    },
	
    "gxp.PlaybackToolbar.prototype": {
        playLabel: "Jouer",
        playTooltip: "Jouer",
        stopLabel: "Stop",
        stopTooltip: "Stop",
        fastforwardLabel: "FFWD",
        fastforwardTooltip: "Lecture à double vitesse",
        backLabel:'Arrière',
        backTooltip:"Reculer d'une image",            
        nextLabel: "Suivant",
        nextTooltip: "Avancer d'une image",
        resetLabel: "Remettre",
        resetTooltip: "Réinitialiser",
        loopLabel: "Boucle",
        loopTooltip: "Continuellement en boucle l'animation",
        normalTooltip: "Retour à la normale playback",
        pauseLabel: "Pause",
        pauseTooltip: "Pause"
    },
	
    "gxp.PlaybackOptionsPanel.prototype": {
        optionTitleTextS: "Options de date et heure",
        rangeFieldsetText: "Intervalle de temps",
        animationFieldsetText: "Options d'Animation",
        startText: "Commencer",
        endText: "Fin",
        saveText: 'Sauver',
        cancelText: 'Annuler',         
        listOnlyText: "Utilisez Liste des valeurs exact uniquement",
        stepText: "Étape animation",
        unitsText: "Unités d'animation",
        frameRateText:'Retard Animation (s)',        
        noUnitsText: "Aligner sur la Liste Temps",
        loopText: "Animation en boucle",
        reverseText: "Inverser animation",
        rangeChoiceText: "Choisissez la gamme pour le contrôle du temps",
        rangedPlayChoiceText: "Playback Mode",
        secondsText: 'Secondes', 
        minutesText: 'Minutes', 
        hoursText: 'Heures', 
        daysText: 'Journées', 
        monthsText: 'Mois', 
        yearsText: 'Ans'        
    },
	
	"gxp.plugins.StaticPage.prototype": {
        tabTitle: "Page Statique"
    } 
});







