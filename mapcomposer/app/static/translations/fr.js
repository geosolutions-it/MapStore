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
		resetButtonTooltip: "Réinitialiser la Page",
		helpButtonTooltip: "Aide",
        searchTabTitle : "Chercher",
        viewTabTitle : "Vue",
        portalTabTitle : "Portail",
		markerPopupTitle: "Détails",
		mainLoadingMask: "S'il vous plaît attendre ..."
    },  

    "GeoExplorer.Composer.prototype": {
        exportMapText: "Publier une carte",
		uploadText: "Télécharger",
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
		cswFailureAddLayer: ' La couche ne peuvent pas être ajoutés à la carte',
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
        overlayNodeText: "Surimpressions",
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
	
	"gxp.plugins.WMSGetFeatureInfoMenu.prototype": {
        infoActionTip: "Obtenir des infos sur l`entité",
        popupTitle: "Info sur l`entité",
		noDataMsg: "Aucune donnée n'a été renvoyée par le serveur",
		maskMessage: "Obtenir des infos sur l`entité...",
		activeActionTip:"Obtenir des infos sur l`entité sélectionnée"
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
        stylesText: "Styles"
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
	    contextMsg: "Chargement...",
		userLabel: "Utilisateur",	
		passwordLabel: "Mot de passe", 	
		loginLabel: "Connexion",	
		mapMetadataTitle: "Insérer les métadonnées de la carte",	
		mapMedatataSetTitle: "Métadonnées de la carte",	
		mapNameLabel: "Nom",	
		mapDescriptionLabel: "Description",
		addResourceButtonText: "Ajouter Carte"
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
        creatingPdfText: "Création PDF..."
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
        lastPageTip: "Dernière page",
        title: "Entités",
        totalMsg: "Total: {0} entités",
        displayExportCSVText: "Exporter au format CSV",
        exportCSVSingleText: "Une seule page",
        exportCSVMultipleText: "Toutes les pages",
        failedExportCSV: "Impossible de trouver la réponse pour le format de sortie CSV",
        invalidParameterValueErrorText: "Valeur de paramètre non valide",
		zoomToFeature: "Zoom sur Feature"
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
        attributeEnablement: "Requête par attributs",
        attributeEnablementMsg: "Invalid search Type! To use this you have to select 'Feature' type and to select a vector layer before.",
        searchType: "Réglages de base",
        typeLabel: "Type",
        featureLabel: "Max Features" 
    },
    
    "gxp.plugins.BBOXQueryForm.prototype": {
        selectionMethodFieldSetComboTitle: "Méthode de sélection",
        comboEmptyText: "Sélectionner une méthode..",
        comboSelectionMethodLabel: "Sélection",
        comboPolygonSelection: 'Polygon',
        comboCircleSelection: 'Arrondissez',
        comboBBOXSelection: 'BBox',
		errorBBOXText: "Le BBox choisi n'est pas valide!",
        errorDrawPolygonText: "Vous devez dessiner le polygone",
        errorDrawCircleText: "Vous devez dessiner le cercle",     
        errorDrawTitle: "Demande erreur",
		errorBufferTitle: "Le tampon est incorrecte",
		errorBufferText: "Le tampon sélectionné n'est pas valide!",
		areaLabel: "Région",	
		perimeterLabel: "Perimetro",	
		radiusLabel: "Perimeter",	
		centroidLabel: "Centroid",	
		selectionSummary: "Résumé de Sélection"
    },
	
    "gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Gamme de tampon",
		bufferFieldSetTitle: "Tampon",
		coordinatePickerLabel: "Coordonnées",
		draweBufferTooltip: "Dessinez le tampon"
	},
    
    "gxp.form.BBOXFieldset.prototype":{
        northLabel:"Nord",
        westLabel:"Ouest",
        eastLabel:"Est",
        southLabel:"Sud",
        waitEPSGMsg: "S'il vous plaît attendre...",
        setAoiText: "FixéROI",
        setAoiTooltip: "Activer le contrôle TextBox pour dessiner un ROI (BBox) sur la carte",
        title: "Région d'Intérêt"
    },
    
    "gxp.FilterBuilder.prototype":{
        preComboText: "égaler",
        postComboText: "de ce qui suit:",
        addConditionText: "ajouter la condition",
        addGroupText: "ajouter un groupe",
        removeConditionText: "suppression de la condition"
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
	"gxp.plugins.MarkerEditor.prototype":{
		markerName:'Markers',
		copyText:'Copiez le texte ci-dessous et le coller dans le "Importer Marqueurs" fenêtre dans un second temps ...',
		pasteText:'Collez le texte dans la zone de texte et cliquez sur imoport.',
		addToTheMapText:'Ajouter à la carte',
		updateText: 'Mettre à jour',
		resetText:'Remettre',
		removeText:'Enlever',
		compositeFieldTitle:  'Titre',
		compositeFieldLabel: 'étiquette',
		coordinatesText: 'Coordonnées',
		contentText: 'Teneur',
		gridColTitle: 'Titre',
		gridColLabel: 'étiquette',
		gridColLat: 'Lat',
		gridColLon: 'Lon',
		gridColContent: 'Teneur',	
		exportBtn:  "Marqueurs d'exportation",
		importBtn: "Marqueurs d'importation",
		removeAllBnt: 'Supprimer tout',
		markerChooserTitle:'Choisissez un marqueur',
		useThisMarkerText:'Utilisez cette Marker',
		selectMarkerText:'Marker Select',
		insertImageText:'«Insérer une image',
		imageUrlText:'URL de l\'image',
		importGeoJsonText:'Importer GeoJSON',
		errorText:"Error",
		notWellFormedText:"Le texte que vous avez ajouté n'est pas bien formé Veuillez le vérifier"
	},
	
	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordonnées',
		pointSelectionButtionTip: 'Cliquez pour activer la sélection du collimateur',
		latitudeEmptyText: 'Latitude',
		longitudeEmptyText: 'Longitude'
	},

	"gxp.plugins.AddLayer.prototype":{
		waitMsg: "S'il vous plaît attendre...",
		capabilitiesFailureMsg: " La couche peut pas être ajouté à la carte"
    },
        
    "gxp.plugins.Geolocate.prototype":{
        geolocateMenuText: "Géolocaliser",
        geolocateTooltip: "Localiser mon poste",
        trackMenuText: "Suivre position",
        trackTooltip: "Suivre ma position",
        waitMsg: "Recherche...",
        errorMsg: "Ce navigateur ne supporte pas Géolocalisation"
    },
    
	"gxp.plugins.GeoLocationMenu.prototype":{
        initialText: "Sélectionner une zone",
        menuText: "Codification Géographique",
        tooltip: "Codification Géographique",
        addMarkerTooltip: "Réinitialiser Marker",
        emptyText: "Géocoder...",
        buttonText: "Adresse",
        emptyText: "Adresse...",
		errorMsg: "Aucune adresse trouvée",
		waitMsg: "S'il vous plaît attendre...",
		addressTitle: "Adresse trouvée",
		geolocate: {
			geolocateMenuText: "Géolocaliser",
			geolocateTooltip: "Localiser mon poste",
			trackMenuText: "Suivre position",
			trackTooltip: "Suivre ma position",
			waitMsg: "Recherche...",
			errorMsg: "Ce navigateur ne supporte pas Géolocalisation"
		},
		actionText: "Géolocalisations"
    },
	
    "gxp.plugins.ImportExport.prototype":{
        importexportLabel: "Import / Export",
	    labels:{
                "map": {
                    "saveText" : "Exportez la Carte",
                    "loadText" : "Importer la Carte",
                    "uploadWindowTitle" : "Importez le fichier de contexte de carte",
                    "downloadWindowTitle" : "Exporter le fichier de contexte de carte"
                },
                "kml/kmz": {
                    "saveText" : "Export KML",
                    "loadText" : "Importer KML/KMZ",
                    "uploadWindowTitle" : "Importez KML/KMZ fichier",
                    "downloadWindowTitle" : "Export KML fichier",
                    "kmlExportTitleText": "KML/KMZ Export",
                    "layerEmptyText": "La couche sélectionnée est vide",
                    "notVectorlayerText": "S'il vous plaît sélectionner seulement couche vectoriel",
                    "notLayerSelectedText": "S'il vous plaît sélectionner un couche vectoriel"
                } 
        }
    },
   
    "gxp.MapFileUploadPanel" :{
		fileLabel: "Fichier de la carte",
		fieldEmptyText: "Recherchez les fichiers de carte contexte ...",
		uploadText: "Envoyez",
		waitMsgText: "Téléchargement de vos données ...",
		resetText: "Rréinitialiser",
		failedUploadingTitle: "Téléchargement de fichier erreur"
    },
   
    "gxp.MapFileDownloadPanel" :{
		buttonText: "Exportez la Carte",
		filenameLabel: "Carte nom de fichier",
		waitMsgText: "Générer fichier de mappage de contexte ...",
		resetText: "Rréinitialiser",
		failedUploadingTitle: "Impossible de générer un fichier de la carte",
		saveErrorText: "Économie d'Trouble:"
    },
   
    "gxp.KMLFileDownloadPanel" :{
		buttonText: "Exporter",
		filenameLabel: "Nom du fichier KML",
		waitMsgText: "Génération KML ...",
		invalidFileExtensionText: "L'extension du fichier doit être:",
		resetText: "Rréinitialiser",
		failedUploadingTitle: "Impossible de générer le fichier KML"
    },
   
    "gxp.KMLFileUploadPanel" :{
		fileLabel: "Le fichier KML",
		fieldEmptyText: "Rechercher des fichiers KML ou KMZ ...",
		uploadText: "Envoyez",
		waitMsgText: "Téléchargement de vos données ...",
		invalidFileExtensionText: "File extension must be one of: ",
		resetText: "Rréinitialiser",
		failedUploadingTitle: "Téléchargement de fichier erreur",
		layerNameLabel: "Nom de la couche"
    }
});
