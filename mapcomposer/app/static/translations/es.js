/**
 * Copyright (c) 2009-2014 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/

GeoExt.Lang.add("es", {
    "GeoExplorer.prototype": {
        zoomSliderText: "<div>Nivel de zoom: {zoom}</div><div>Escala: 1:{scale}</div>",
        loadConfigErrorText: "Problema al cargar la configuración salvada: <br />",
        loadConfigErrorDefaultText: "Error en el servidor.",
        xhrTroubleText: "Problema de comunicación: Estado",
        layersText: "Capas",
		legendText: "Leyenda",
        titleText: "Título",
        zoomLevelText: "Nivel de zoom",
        saveErrorText: "Problema al salvar: ",
        bookmarkText: "URL del Marcador",
        permakinkText: "Permalink",
        appInfoText: "Créditos",
        aboutText: "Sobre GeoExplorer",
        mapInfoText: "Información del mapa",
        DescripciónText: "Descripción",
        contactText: "Contacto",
        aboutThisMapText: "Sobre este mapa",
		resetButtonTooltip: "Resetear página",
		helpButtonTooltip: "Ayuda",
        searchTabTitle : "Búsqueda",
        viewTabTitle : "Vista",
        portalTabTitle : "Portal",
		markerPopupTitle: "Detalles",
		mainLoadingMask: "Por favor, espere..."
    },
    
    "GeoExplorer.Composer.prototype": {
		uploadText: "Subir",
        backText: "Atrás",
        nextText: "Siguiente",
        loginText: "Login",
        loginErrorText: "Usuario o contraseña inválidos.",
        userFieldText: "Usuario",
        ContraseñaFieldText: "Contraseña",
        fullScreenText: "Pantalla completa",
        cswMsg: 'Cargando...',
		cswFailureAddLayer: ' No se pudo añadir la capa al mapa',
	    cswZoomToExtentMsg: "La extensión no está disponible",
		cswZoomToExtent: "CSW Zoom a la extensión"
    },

    "gxp.menu.LayerMenu.prototype": {
        layerText: "Capa"
    },

    "gxp.plugins.AddLayers.prototype": {
        addActionMenuText: "Añadir capas",
        addActionTip: "Añadir capas",
        addServerText: "Añadir un nuevo servidor",
        addButtonText: "Añadir capas",
        untitledText: "Sin nombre",
        addLayerSourceErrorText: "Error obteniento capabilities del WMS ({msg}).\nPor favor, compruebe la url y vuelva a intentarlo.",
        availableLayersText: "Capas disponibles",
        expanderTemplateText: "<p><b>Sumario:</b> {abstract}</p>",
        panelTitleText: "Título",
        layerSelectionText: "Visualizar datos disponibles de:",
        doneText: "Hecho",
        removeFilterText: "Limpiar filtro", 
        filterEmptyText: "Filtro",
        uploadText: "Subir datos"
    },
    
	 "gxp.plugins.RemoveOverlays.prototype": {
	    removeOverlaysMenuText: "Borrar capas superpuestas",
	    removeOverlaysActionTip: "Borrar todas las capas superpuestas del mapa",
	    removeOverlaysConfirmationText: "¿Está seguro de que quiere borrar todas las capas superpuestas del mapa?"
    }, 

    "gxp.plugins.BingSource.prototype": {
        title: "Capas de Bing",
        roadTitle: "Carreteras Bing",
        aerialTitle: "Bing Aerial",
        labeledAerialTitle: "Bing Aerial con etiquetas"
    },

    "gxp.plugins.GoogleEarth.prototype": {
        apiKeyPrompt: "Por favor, introduzca la clave para Google API",
        menuText: "Vista 3D",
        tooltip: "Cambiar a la vista 3D"
    },
    
    "gxp.plugins.GoogleSource.prototype": {
        title: "Capas Google",
        roadmapAbstract: "Mostrar callejero",
        satelliteAbstract: "Mostrar satélite",
        hybridAbstract: "Mostrar callejero junto a satélite",
        terrainAbstract: "Mostrar callejero junto al terreno"
    },

    "gxp.plugins.LayerProperties.prototype": {
        menuText: "Propiedades de la capa",
        toolTip: "Mostrar las propiedades de la capa"
    },
    
    "gxp.plugins.LayerTree.prototype": {
        rootNodeText: "Capas",
        overlayNodeText: "Por defecto",
        baseNodeText: "Fondo"
    },

    "gxp.plugins.Legend.prototype": {
        menuText: "Mostrar leyenda",
        tooltip: "Mostrar leyenda"
    },    
    
    "gxp.plugins.Measure.prototype": {
        lengthMenuText: "Longitud",
        areaMenuText: "Área",
        lengthTooltip: "Medir la longitud",
        areaTooltip: "Medir el área",
        measureTooltip: "Medir",
        bearingMenuText: "Ruta ",
        bearingTooltip: "Medir ruta"
    },

    "gxp.plugins.Navigation.prototype": {
        menuText: "Arrastrar Mapa",
        tooltip: "Arrastrar Mapa"
    },

    "gxp.plugins.NavigationHistory.prototype": {
        previousMenuText: "Zoom a la extensión Anterior",
        nextMenuText: "Zoom a la siguiente extensión",
        previousTooltip: "Zoom a la extensión Anterior",
        nextTooltip: "Zoom a la siguiente extensión"
		
    },

    "gxp.plugins.OSMSource.prototype": {
        title: "Capas OpenStreetMap",
        mapnikAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>",
        osmarenderAttribution: "Data CC-By-SA by <a href='http://openstreetmap.org/'>OpenStreetMap</a>"
    },

    "gxp.plugins.Print.prototype": {
        menuText: "Imprimir Mapa",
        tooltip: "Imprimir Mapa",
        previewText: "Vista previa de impresión",
        notAllNotPrintableText: "No todas las capas pueden imprimirse",
        nonePrintableText: "Ninguna de las capas de tu mapa pueden imprimirse",
        notPrintableLayersText: "Por favor, borre estas capas y todos los marcadores antes de imprimir. Las siguientes capas no se pueden imprimir:"
    },

    "gxp.plugins.MapQuestSource.prototype": {
        title: "Capas MapQuest",
        osmAttribution: "Tiles Cortesía de <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        osmTitle: "MapQuest OpenStreetMap",
        naipAttribution: "Tiles Cortesía de <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
        naipTitle: "Imágenes MapQuest"
    },

    "gxp.plugins.RemoveLayer.prototype": {
        removeMenuText: "Borrar capa",
        removeActionTip: "Borrar capa"
    },

    "gxp.plugins.WMSGetFeatureInfo.prototype": {
        infoActionTip: "Obtener Feature Info",
        popupTitle: "Feature Info",
		noDataMsg: "El servidor no devolvió datos",
		maskMessage: "Recuperando el Feature Info..."
    },
	
	"gxp.plugins.WMSGetFeatureInfoMenu.prototype": {
        infoActionTip: "Get Feature Info",
        popupTitle: "Feature Info",
		noDataMsg: "El servidor no devolvió datos",
		maskMessage: "Recuperando Feature Info...",
		activeActionTip:"Activar información de la capa seleccionada"
    },

    "gxp.plugins.Zoom.prototype": {
        zoomInMenuText: "Incrementar Zoom",
        zoomOutMenuText: "Decrementar Zoom",
        zoomInTooltip: "Incrementar Zoom",
        zoomOutTooltip: "Decrementar Zoom"
    },
    
    "gxp.plugins.ZoomToExtent.prototype": {
        menuText: "Zoom a la máxima extensión",
        tooltip: "Zoom a la máxima extensión"
    },
    
    "gxp.plugins.ZoomToDataExtent.prototype": {
        menuText: "Zoom a la extensión de la capa",
        tooltip: "Zoom a la extensión de la capa"
    },

    "gxp.plugins.ZoomToLayerExtent.prototype": {
        menuText: "Zoom a la extensión de la capa",
        tooltip: "Zoom a la extensión de la capa"
    },
    
    "gxp.WMSLayerPanel.prototype": {
        aboutText: "Información",
        titleText: "Título",
        NombreText: "Nombre",
        DescripciónText: "Descripción",
        displayText: "Display",
        opacityText: "Opacidad",
        formatText: "Formato",
        transparentText: "Transparencia",
        cacheText: "Cache",
        cacheFieldText: "Usar versión cacheada",
        stylesText: "Estilos",
        summaryText: "Estadísticas",
        summaryInfoText: "Estadísticas raster de la vista actual",
        loadMaskMsg: "Obteiniendo datos ...",
        noDataMsg: "No hay datos disponibles de la vistas actual",
        refreshText: "Refrescar"
    },

    "gxp.NewSourceWindow.prototype": {
        title: "Añadir un nuevo servidor...",
        cancelText: "Cancelar",
        addServerText: "Añadir Server",
        invalidURLText: "Introducir una URL válida de un servicio WMS (por ejemplo: http://example.com/geoserver/wms)",
        contactingServerText: "Contactando con el servidor..."
    },

    "gxp.ScaleOverlay.prototype": { 
        zoomLevelText: "Nivel de Zoom"
    },
    
    "gxp.plugins.AddGroup.prototype": { 
	    addGroupMenuText: "Añadir Grupo",
	    addGroupActionTip: "Añadir un nuevo grupo en el árbol de capas",
	    addGroupDialogTitle: "Nuevo grupo", 
	    addGroupFieldSetText: "Nombre del grupo",
	    addGroupFieldLabel: "Nuevo grupo",
	    addGroupButtonText: "Añadir grupo",
	    addGroupMsg: "Por favor, introduzca el nombre del grupo"	
    },
    
    "gxp.plugins.RemoveGroup.prototype": { 
	    removeGroupMenuText: "Borrar Grupo",
	    removeGroupActionTip: "Borrar un grupo del árbol de capas",
	    removeGroupActionTip: "Borrar el grupo y sus capas del mapa",
	    removeGroupConfirmationText: "¿Está seguro de que quiere borrar el grupo seleccionado? Todas las capas contenidas en el mismo se borrarán del mapa."
    },
    
    "gxp.plugins.SaveDefaultContext.prototype": { 
	    saveDefaultContextMenuText: "Guardar contexto por defecto",
	    saveDefaultContextActionTip: "Guardar contexto del mapa",
	    contextSaveSuccessString: "Contexto salvado correctamente",
	    contextSaveFailString: "El contexto no se ha guardado satisfactoriamente",
	    contextMsg: "Cargando...",
		userLabel: "Usuario",	
		ContraseñaLabel: "Contraseña", 	
		loginLabel: "Login",	
		mapMetadataTitle: "Insertar Metadatos del Mapa",	
		mapMedatataSetTitle: "Metadatos del Mapa",	
		mapNombreLabel: "Nombre",	
		mapDescripciónLabel: "Descripción",
		addResourceButtonText: "Añadir Mapa"
    },
    "gxp.plugins.GeoReferences.prototype": {
        initialText: "Seleccionar un área",
        menuText: "GeoReferencias",
        tooltip: "GeoReferencias"
    },
    "gxp.plugins.ZoomBox.prototype":{
        zoomInMenuText: "Zoom Box Siguiente",
        zoomOutMenuText: "Zoom Box Anterior",
        zoomInTooltip: "Zoom Box Siguiente",
        zoomOutTooltip: "Zoom Box Anterior"
    },
    "GeoExt.ux.PrintPreview.prototype":{
        paperSizeText: "Tamaño del folio:",
        resolutionText: "Resolución:",
        printText: "Imprimir",
        emptyTitleText: "Introduzca el título del mapa aquí.",
        includeLegendText: "¿Incluir leyenda?",
        legendOnSeparatePageText: "¿Leyenda en una página separada?",
        compactLegendText: "¿Leyenda compacta?",	
        emptyCommentText: "Introduzca comentarios aquí.",
        creatingPdfText: "Creando PDF...",
		graticuleFieldLabelText: 'Activar gratícula',
		defaultTabText: "Por defecto",
		legendTabText: "Leyenda"
    },
	
    "GeoExt.ux.LegendStylePanel.prototype":{
		iconsSizeText: "Tamaño de los iconos",
		fontSizeText: "Tamaño de la fuente",
		fontFamilyText: "Fuente",
		forceLabelsText: "Forzar etiqueta",
		dpiText: "Dpi",
		fontStyleText: "Estilo de la fuente",
		fontEditorText: "Configuración de la etiqueta",
		sizeText: "Tamaño"
    },
    
    "GeoExt.ux.GraticuleStylePanel.prototype":{
        graticuleFieldLabelText: 'Activar gratícula',
        sizeText: "Tamaño de la fuente",
        colorText: "Color",
        fontFamilyText: "Fuente",
        fontStyleText: "Estilo de la fuente",
        fontEditorText: "Configuración de la etiqueta"
    },
	
    "gxp.plugins.GeonetworkSearch.prototype":{
        geonetworkSearchText: "Ver metadatos",
        geonetworkSearchActionTip: "Ver metadatos"
    },
    "gxp.plugins.GroupProperties.prototype":{
        groupPropertiesMenuText:  "Propiedades del Grupo",
        groupPropertiesActionTip:  "Propiedades del Grupo",
        groupPropertiesDialogTitle: "Propiedades del Grupo - ",
        groupPropertiesFieldSetText: "Nombre del Grupo",
        groupPropertiesFieldLabel: "Nuevo Nombre del Grupo",
        groupPropertiesButtonText: "Hecho",
        groupPropertiesMsg: "Por favor, introduzca un nombre de grupo"
    },
    "gxp.plugins.Login.prototype":{
        loginText: "Login",
        loginErrorText: "Nombre o Contraseña inválidos.",
        userFieldText: "Usuario",
        ContraseñaFieldText: "Contraseña"
    },
    "gxp.plugins.FeatureGrid.prototype": {
        displayFeatureText: "Ver en el mapa",
        firstPageTip: "Primera página",
        previousPageTip: "Siguiente página",
        zoomPageExtentTip: "Zoom a la extensión de la página",
        nextPageTip: "Siguiente página",
        lastPageTip: "Última página",
        title: "Entidades",
        totalMsg: "Total: {0} entidades",
        displayExportCSVText: "Exportar a CSV",
        exportCSVSingleText: "Página actual",
        exportCSVMultipleText: "Toda la página",
        failedExportCSV: "Error al encontrar una respuesta para la exportación a CSV",
        invalidParameterValueErrorText: "Valor de los parámetros inválido",
		zoomToFeature: "Zoom a Entidad",
        comboFormatMethodLabel: "Formato",
        comboFormatEmptyText: "Por favor, seleccione un formato",
        noFormatTitleText: "Formato inválido",
        noFormatBodyText: "Por favor, seleccione un formato válido",
        exportTitleText: "Exportar"
    },
    "gxp.plugins.QueryForm.prototype": {
        queryActionText: "Consultar",
        queryMenuText: "Capa de consulta",
        queryActionTip: "Consultar la capa seleccionada",
        queryByLocationText: "Región de interés",
        currentTextText: "Extensión actual",
        queryByAttributesText: "Consultar por atributos",
        queryMsg: "Consultando...",
        cancelButtonText: "Resetear",
        noFeaturesTitle: "No se encontró",
        noFeaturesMessage: "Su consulta no devolvió ningún resultado.",
        title: "Buscar",
        attributeEnablement: "Consultar por Atributo",
        attributeEnablementMsg: "¡Tipo de búsqueda inválido! Para usarlo, debe seleccionar un tipo de 'Feature' y una capa vectorial antes.",
        searchType: "Configuración básica",
        typeLabel: "Tipo",
        featureLabel: "Máximas Features"
    },   

    "gxp.plugins.BBOXQueryForm.prototype": {
        selectionMethodFieldSetComboTitle: "Establecer selección de método",
        comboEmptyText: "Seleccione un método..",
        comboSelectionMethodLabel: "Selección",
        comboPolygonSelection: 'Polígono',
        comboCircleSelection: 'Círculo',
        comboBBOXSelection: 'Bounding Box',
		errorBBOXText: "¡El BBox es inválido!",
        errorDrawPolygonText: "Debe dibujar un polígono",
        errorDrawCircleText: "Debe dibujar un círculo",     
        errorDrawTitle: "Error en la consulta",
	    errorBufferTitle: "Error en el Buffer",
		errorBufferText: "¡El buffer seleccionado es inválido!",
		areaLabel: "Área",	
		perimeterLabel: "Perímetro",	
		radiusLabel: "Radio",	
		centroidLabel: "Centroide",	
		selectionSummary: "Sumario de la Selección"
	},
	
    "gxp.widgets.form.BufferFieldset.prototype": {
		bufferFieldLabel: "Rango del Buffer",
		bufferFieldSetTitle: "Buffer",
		coordinatePickerLabel: "Coordenadas",
		draweBufferTooltip: "Dibuje el Buffer"
	},
    
    "gxp.form.BBOXFieldset.prototype":{
        northLabel:"Norte",
        westLabel:"Oeste",
        eastLabel:"Este",
        southLabel:"Sur",
        setAoiText: "SetROI",
        waitEPSGMsg: "Espere por favor...",
        setAoiTooltip: "Habilita el el control SetBox para dibujar una ROI (BBox) en el mapa",
        title: "Región de interés (ROI)"
    },
    
    "gxp.FilterBuilder.prototype":{
        preComboText: "Resultado",
        postComboText: "de lo siguiente:",
        addConditionText: "añadir condición",
        addGroupText: "añadir grupo",
        removeConditionText: "borrar condición"
    },
    
    "gxp.EmbedMapDialog.prototype": {
        publishMessage: "¡Su mapa está ya publicado en la web! Copie el siguiente código HTML para embeberlo en su página web:",
        heightLabel: "Altura",
        widthLabel: "Ancho",
        mapSizeLabel: "Tamaño del Mapa",
        miniSizeLabel: "Mini",
        smallSizeLabel: "Pequeño",
        premiumSizeLabel: "Premium",
        largeSizeLabel: "Grande"
    },
    "gxp.plugins.GoogleGeocoder.prototype": {
        addMarkerTooltip: "Resetear Marcador"
    },
	"gxp.plugins.DynamicGeocoder.prototype": {
        addMarkerTooltip: "Resetar Marcador",
        emptyText: "Geocoder..."
    },
	"gxp.plugins.ReverseGeocoder.prototype": {
        buttonText: "Dirección",
        emptyText: "Dirección...",
		errorMsg: "No se encontró la dirección",
		waitMsg: "Espere por favor...",
		addressTitle: "Dirección encontrada"
    },
	"gxp.form.WFSSearchComboBox.prototype": {
		emptyText:"Buscar",
		loadingText: "Buscando"
	},
	"gxp.form.ContextSwitcher.prototype":{
		switchActionTip : "Cambiar Mapa Mappa",
		switchSaveAlert: "Todos los datos sin salvar se perderán.",
		switchConfirmationText : "¿Está seguro de cambiar el mapa?"

	},
	"gxp.form.LanguageSwitcher.prototype":{
		switchActionTip : "Cambiar idioma",
		switchConfirmationText : "¿Está seguro de cambiar el idioma?"//Are you sure to change Language? All unsaved data will be lost
	},
	
	"gxp.plugins.MarkerEditor.prototype":{
		markerNombre:'Marcadores',
		copyText:'Copie el texto siguiente para pegarlo en la ventana "Importar Marcadores" posteriormente...',
		pasteText:'Oege el texto en la área de texto y presione sobre importar.',
		addToTheMapText:'Añadir al mapa',
		updateText: 'Actualizar',
		resetText:'Resetear',
		removeText:'Borrar',
		compositeFieldTitle:  'Título',
		compositeFieldLabel: 'Etiqueta',
		coordinatesText: 'Coordenadas',
		contentText: 'Contenido',
		gridColTitle: 'Título',
		gridColLabel: 'Etiqueta',
		gridColLat: 'Lat',
		gridColLon: 'Lon',
		gridColContent: 'Contenido',	
		exportBtn:  'Exportar Marcadores',
		importBtn: 'Importar Marcadores',
		removeAllBnt: 'Borrar todo',
		markerChooserTitle:'Seleccionar marcador',
		useThisMarkerText:'Usar este marcador',
		selectMarkerText:'Seleccione un marcador',
		insertImageText:'Insertar imagen',
		imageUrlText:'URL de la imagen',
		importGeoJsonText:'Importar GeoJson',
		errorText:"Error",
		notWellFormedText:"El texto que ha añadido no está bien formado. Por favor, compruébelo"
	},
	
	"gxp.widgets.form.CoordinatePicker.prototype":{
	    fieldLabel: 'Coordenadas',
		pointSelectionButtionTip: 'Pulse aquí para habilitar la selección por punto',
		latitudeEmptyText: 'Latitud',
		longitudeEmptyText: 'Longitud'
	},
	
	"gxp.plugins.AddLayer.prototype":{
		waitMsg: "Por favor, espere ...",
		capabilitiesFailureMsg: " La capa no se puede añadir al mapa"
    },
    
    "gxp.plugins.Geolocate.prototype":{
        geolocateMenuText: "Geolocaliza",
        geolocateTooltip: "Localiza mi posición",
        trackMenuText: "Trazar Position",
        trackTooltip: "Traza mi position",
        waitMsg: "Localización en curso...",
        errorMsg: "Geolocalización no está soportada por su navegador"
    },
	
	"gxp.plugins.GeoLocationMenu.prototype": {
	    initialText: "Seleccione un área",
        menuText: "GeoReferencias",
        tooltip: "GeoReferencias",
        addMarkerTooltip: "Reinicia Marcador",
        emptyText: "Geocoder...",
        buttonText: "Dirección",
        emptyText: "Dirección...",
		errorMsg: "No se encontró la dirección",
		waitMsg: "Por favor, espere...",
		addressTitle: "Direcciñon encontrada",
		geolocate: {
			"geolocateMenuText": "Geolocalizar",
			"geolocateTooltip": "Localiza mi posición",
			"trackMenuText": "Trazar Position",
			"trackTooltip": "Track my position",
			"waitMsg": "Localización en curso...",
			"errorMsg": "Geolocalización no está soportada por su navegador"
		},
		actionText: "Geolocalizaciones"
    },
    
    "gxp.plugins.ImportExport.prototype":{
        importexportLabel: "Importar / Exportar",
		labels: {
			"map": {
				"saveText" : "Exportar Mapa",
				"loadText" : "Importar Mapa",
				"uploadWindowTitle" : "Importar fichero de contexto del mapa",
				"downloadWindowTitle" : "Exportar fichero de contexto del mapa"
			},
			"kml/kmz": {
				"saveText" : "Exportar KML",
				"loadText" : "Importar KML/KMZ",
				"uploadWindowTitle" : "Importar un fichero KML/KMZ",
				"downloadWindowTitle" : "Exportar  un fichero KML",
				"kmlExportTitleText": "Exportación KML/KMZ",
				"layerEmptyText": "La capa seleccionada está vacía",
				"notVectorlayerText": "Por favor, seleccione únicamente una capa vectorial",
				"notLayerSelectedText": "Por favor, seleccione una capa vectorial"
			} 
        }
    },
   
    "gxp.MapFileUploadPanel" :{
		fileLabel: "Fichero del mapa",
		fieldEmptyText: "Seleccione un fichero de contexto del mapa...",
		uploadText: "Subir",
		waitMsgText: "Subiendo sus datos...",
		resetText: "Reiniciar",
		failedUploadingTitle: "Error al subir el fichero"
    },
   
    "gxp.MapFileDownloadPanel" :{
		buttonText: "Exportar Mapa",
		fileNombreLabel: "Nombre del fichero del mapa",
		fieldEmptyText: "context.map",
		waitMsgText: "Generandoe el fichero de contexto del mapa...",
		resetText: "Reiniciar",
		failedUploadingTitle: "Imposible generar el fichero de contexto del mapa",
		saveErrorText: "Errores encontrados: "
    },
   
    "gxp.KMLFileDownloadPanel" :{
		buttonText: "Exportar",
		fileNombreLabel: "Nombre del fichero KML",
		fieldEmptyText: "export.kml",
		waitMsgText: "Generando fichero KML...",
		invalidFileExtensionText: "La extensión del fichero debe ser una de estas: ",
		resetText: "Reiniciar",
		failedUploadingTitle: "Imposible generar el fichero KML"
    },
   
    "gxp.KMLFileUploadPanel" :{
		fileLabel: "Fichero KML",
		fieldEmptyText: "Seleccione un fichero KNL o KMZ...",
		uploadText: "Subir",
		waitMsgText: "Subiendo sus datos...",
		invalidFileExtensionText: "La extensión del fichero debe ser una de estas: ",
		resetText: "Reiniciar",
		failedUploadingTitle: "Error al subir el fichero",
		layerNombreLabel: "Nombre de la capa"
    },

	"gxp.plugins.PrintSnapshot.prototype" :{
        noSupportedLayersErrorMsg: "Ocurrió un error al generar la captura del mapa: ¡No se encontraron capas soportadas!",
        generatingErrorMsg: "Ocurrió un error al generar la captura del mapa",
		printStapshotTitle: "Imprimir Captura",
		serverErrorMsg: "Ocurrió un error al generar la captura del mapa: Error en el servidor",
		menuText: "Captura",
		tooltip: "Captura"
	},
	
	"gxp.plugins.EmbedMapDialog.prototype" :{
		exportMapText: "Enlazar el map",		
		toolsTitle: "Elija las herramientas a incluir en la barra de herramientas:",
		alertEmbedTitle: "Atención",		
		alertEmbedText: "Salve el mapa antes de usar la herramienta de publicación del mapa",
		previewText: "Vista previa",				
		embedCodeTitle: "Código embebido",
		embedURL: "URL directa",		
		urlLabel: "URL",
		showMapTooltip: "Mostar en una nueva ventana",
        loadMapText: "Cargar el mapa", 
        downloadAppText: "Cargar este mapa (instalar la aplicación primero)", 
        loadInMapStoreMobileText: "Mobile",
        openImageInANewTab: "Abrir imagen en una nueva pestaña"
	},

    "gxp.widgets.form.SpatialSelectorField.prototype" :{
        title : "Región de Interés",
        selectionMethodLabel : "Método de selección",
        comboEmptyText : "Seleccione un método..",
        comboSelectionMethodLabel : "Selección",
        northLabel : "Norte",
        westLabel : "Oeste",
        eastLabel : "Este",
        southLabel : "Sur",
        setAoiTitle : "Bounding Box",
        setAoiText : "Dibuja",
        setAoiTooltip : "Permita al control de SetBox dibujar un ROI (Saltando la Caja) sobre el mapa",
        areaLabel : "Área",
        perimeterLabel : "Perímetro",
        radiusLabel : "Rayo",
        centroidLabel : "Centroide",
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Elegir una Localidad",
        geocodingPanelBtnRefreshTxt : "Enseña Geometrías",
        geocodingPanelBtnDestroyTxt : "Escondes Geometrías",
        geocodingPanelBtnDeleteTxt : "Remueves Localidad",
        geocodingPanelLocationHeader: "Localidad",
        geocodingPanelCustomHeader: "Pariente",
        geocodingPanelGeometryHeader: "WKT de la Geometría",
        geocodingPanelBtnSelectAllTxt : "Selecciona Todo", 
        geocodingPanelBtnDeSelectAllTxt : "Deseleziona Todo", 
        geocodingPanelMsgRemRunningTitle : "Remueves Localidad",
        geocodingPanelMsgRemRunningMsg : "¿Quieres remover las Localidades seleccionadas por la lista?",
        geocodingFieldLabel : "Busca una Localidad",
        geocodingFieldEmptyText : "Insertas Localidad...",
        geocodingFieldBtnAddTooltip : "Añades una Localidad a la lista",
        geocodingFieldBtnDelTooltip : "Limpias...",
        selectionSummary : "Sumario de las Selecciones",
        geocoderSelectorsLabels: ['Unión de las geometrías', 'Lista de los Área Administrativa', 'Área Administrativa y sottoaree'],
        selectionReturnTypeLabel: "Tipo de selección"
    },
    
    "gxp.plugins.WFSGrid.prototype":{
        displayMsgPaging: "Elementos {0} - {1} of {2}",
        emptyMsg: "No se han encontrado elementos",
        loadMsg: "Loading ...",
        zoomToTooltip: "Zoom al bersaglio"       
    },
    
    "gxp.plugins.TabPanelWFSGrids.prototype":{
        displayMsgPaging: "Elementos {0} - {1} of {2}",
        emptyMsg: "No se han encontrado elementos",
        noRecordFoundLabel: "No se han encontrado elementos",
        loadMsg: "Loading ..."
    },
    
    "gxp.plugins.spatialselector.SpatialSelector.prototype" :{
        titleText : "Región de interés",
        selectionMethodLabel : "Método de selección",
        comboEmptyText : "Seleccione un Método..",
        comboSelectionMethodLabel : "Seleccione"
    },
    
    "gxp.widgets.form.spatialselector.SpatialSelectorMethod.prototype" :{
        areaLabel: "Área",  
        perimeterLabel: "Perímetro", 
        lengthLabel: "Longitud",   
        radiusLabel: "Radio",   
        centroidLabel: "Centroide", 
        selectionSummary: "Sumario de la Selección",
        geometryOperationText: "Operación espacial",
        geometryOperationEmptyText: "Seleccion una operación",
        distanceTitleText: "Distancia",
        distanceUnitsTitleText: "Unidad de distancia",
        noOperationTitleText: "Operación inválida",
        noOperationMsgText: "Por favor, seleccione una operación para realizar la consulta",
        noCompleteMsgText: "Por favor, complete el formulario para realizar la consulta"
    },
    
    "gxp.widgets.form.spatialselector.BBOXSpatialSelectorMethod.prototype" :{
        name  : 'BBOX',
        label : 'Extensión',
        northLabel : "Norte",
        westLabel : "Oeste",
        eastLabel : "Este",
        southLabel : "Sur",
        setAoiTitle : "Bounding Box",
        setAoiText : "Dibujar",
        setAoiTooltip : "Habilita el control que permite dibujar una ROI (Extensión) en el mapa"
    },
    
    "gxp.widgets.form.spatialselector.BufferSpatialSelectorMethod.prototype" :{
        name  : 'Buffer',
        label : 'Buffer',
        latitudeEmptyText : 'Y',
        longitudeEmptyText : 'X'
    },
    
    "gxp.widgets.form.spatialselector.CircleSpatialSelectorMethod.prototype" :{
        name  : 'Círculo',
        label : 'Círculo'
    },
    
    "gxp.widgets.form.spatialselector.GeocoderSpatialSelectorMethod.prototype" :{
        name  : 'Geocoding',
        label : 'Geocoding',
        geocodingFieldSetTitle : "GeoCoder",
        geocodingPanelTitle : "Seleccionar Geometrías",
        geocodingPanelBtnRefreshTxt : "Mostrar Geometrías",
        geocodingPanelBtnDestroyTxt : "Ocultar Geometrías",
        geocodingPanelBtnDeleteTxt : "Borrar Localización",
        geocodingPanelLocationHeader: "Localización",
        geocodingPanelCustomHeader: "Padre",
        geocodingPanelGeometryHeader: "Geometría WKT",
        geocodingPanelBtnSelectAllTxt : "Seleccionar todo", 
        geocodingPanelBtnDeSelectAllTxt : "Deseleccionar todo", 
        geocodingPanelMsgRemRunningTitle : "Borrar Localizaciones",
        geocodingPanelMsgRemRunningMsg : "¿Está seguro de borrar las localizaciones de la lista?",
        geocodingFieldLabel : "Buscar una Locaclización",
        geocodingFieldEmptyText : "Escriba una Localización aquí...",
        geocodingFieldBtnAddTooltip : "Añadir Localización a la lista",
        geocodingFieldBtnDelTooltip : "Limpiar campo",
        selectionSummary : "Sumario de la selección"
    },
    
    "gxp.widgets.form.spatialselector.PolygonSpatialSelectorMethod.prototype" :{
        name  : 'Polígono',
        label : 'Polígono'
    },
    
    "gxp.plugins.spatialselector.Geocoder.prototype" :{
        titleText: "Callejero",
        searchText: "Buscar",
        searchTpText: "Localiza la dirección en el mapa",
        resetText: "Reiniciar",
        resetTpText: "Reinicia la búsqueda por localización",
        translatedKeys: {
            "name": "Calle",
            "number": "Número"
        }
    },
	
	"gxp.plugins.ResourceStatus.prototype":{
		rootNodeText: "Recursos Import",
		serviceErrorTitle: "Error de Servicio",
		tabTitle: "Importado",
		layerNodeName: "Niveles",
		serviceNodeName: "Servicio"
    },
	
	"gxp.plugins.SpatialSelectorQueryForm.prototype":{
        noFilterSelectedMsgTitle: "No hay filtros seleccionados",    
        noFilterSelectedMsgText: "Debe seleccionar al menos un filtro",    
        invalidRegexFieldMsgTitle: "Dominios no válidoss",    
        invalidRegexFieldMsgText: "Uno o más dominios están rellenados correctamente!"
    },
	
	"gxp.plugins.FeatureManager.prototype":{
        noValidWmsVersionMsgTitle: 'WMS versión no válida',    
        noValidWmsVersionMsgText: "El plugin QueryForm no funciona con una versión origen WMS: "
    },

    "gxp.plugins.CategoriesInitializer.prototype":{
        geostoreInitializationTitleText: "Error en la inicialización",
        geostoreInitializationText: "La respuesta de GeoStore no es la esperada",
        notInitializedCategories: "Faltan gategorías: '{0}'. ¿Quiere crearlas?",
        userFieldText: "Usuario",
        passwordFieldText: "Contraseña",
        acceptText: "Crear",
        cancelText: "Cancelar",
        notInitializedCategoriesWithCredentials: "<div class='initCategoriesMessage'>Si es administrador introduzca sus credenciales para crear las categorías: '{0}'</div>"
    },
    "gxp.data.WMTSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "No layer in the current map projection is available on this server",
        warningTitle: "advertencia"
    },
    "gxp.data.TMSCapabilitiesReader.prototype" : {
        noLayerInProjectionError: "No layer in the current map projection is available on this server",
        warningTitle: "advertencia"
    }
});
