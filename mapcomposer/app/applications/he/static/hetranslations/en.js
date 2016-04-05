GeoExt.Lang.add("en", {
	"gxp.plugins.he.AddLayersGeoStore.prototype": {
        gsErrorTitle:"GeoStore Error",
        gsInfoTitle:"GeoStore Info",
        editServerText:"Edit",
        editServerTooltip:"Edit Selected Server",
        deleteServerText:"Delete",
        deleteServerTooltip:"Delete Selected Server",
        gsGetSourcesError:"Unable to retrieve user's layer sources.",
        gsCreateSourceError:"Unable to create and save GeoStore resource.",
        gsUpdateSourceError:"Unable to update GeoStore resource.",
        gsSavePermissionsError:"Unable to save resource permissions.",
        gsDeleteSourceError: "Unable to delete GeoStore resource.",
        gsCreateCategoryInfo: "GeoStore resources disabled, only Admin can create missing LAYERS_SOURCE CATEGORY.",
        gsCreateCategoryAlert:"Application is creating  GeoStore's resource LAYERS_SOURCE.",
        gsCreateCategoryError:"Unable to create GeoStore category. GeoStore resources disabled.",
        gsCategoryCheckError:"Unable to check category LAYERS_SOURCE. GeoStore resources disabled."
    },
    "gxp.he.NewSourceWindowGeoStore":{
        groupsLabel:"Groups",
        gsErrorTitle:"Geostore Error",
        gsGetPermissionError:"Unable to retrieve resource permissions."
    },
    "gxp.plugins.PrintSnapshotHE.prototype" :{
        noSupportedLayersErrorMsg: " is not available for printing.<br/>Please select one of the following as your background layer and try again:<br/>",
        suggestionLayersMsg: "-> OpenStreetMap <br/> -> MapQuest OpenStreetMap <br/> -> MapQuest Imagery"
    },
    "gxp.plugins.Print.prototype": {
        notPrintableLayersText: "is not available for printing.<br/>Please select one of the following as your background layer and try again:<br/>-> OpenStreetMap <br/> -> MapQuest OpenStreetMap <br/> -> MapQuest Imagery"
    },
    "gxp.plugins.he.GeoStoreStyleWriter.prototype": {
        mainLoadingMask: "Please wait...",
        geostoreStyleErrorTitle: "Error.",
        geostoreStyleCreationErrorMsg: "Error creating the geostore style.",
        geostoreStyleUpdateErrorMsg: "Error updating geostore style.",
        geostoreStyleSearchErrorMsg: "Failed to retrieve the geostore style.",
        geostoreStyleDeleteSuccessMsg: "Geostore style successfully deleted.",
        geostoreStyleDeleteErrorMsg: "Geostore Style not deleted."
    },

    "gxp.he.WMSStylesDialogHE.prototype": {
         addStyleText: "Add",
         addStyleTip: "Add a new style",
         chooseStyleText: "Choose style",
         deleteStyleText: "Remove",
         deleteStyleTip: "Delete the selected style",
         editStyleText: "Edit",
         editStyleTip: "Edit the selected style",
         duplicateStyleText: "Duplicate",
         duplicateStyleTip: "Duplicate the selected style",
         addRuleText: "Add",
         addRuleTip: "Add a new rule",
         newRuleText: "New Rule",
         deleteRuleText: "Remove",
         deleteRuleTip: "Delete the selected rule",
         editRuleText: "Edit",
         editRuleTip: "Edit the selected rule",
         duplicateRuleText: "Duplicate",
         duplicateRuleTip: "Duplicate the selected rule",
         cancelText: "Cancel",
         saveText: "Save",
         styleWindowTitle: "User Style: {0}",
         ruleWindowTitle: "Style Rule: {0}",
         stylesFieldsetTitle: "Styles",
         rulesFieldsetTitle: "Rules",
         errorTitle: "Error saving style",
         errorMsg: "There was an error saving the style back to the server.",
         searchStyleResourcesErrorTitle: "Error",
         searchStyleResourcesErrorMsg: "Something went wrong when loading styles"
    },

    "gxp.plugins.he.StylerHE.prototype": {
        menuText: "Layer Styles",
        tooltip: "Layer Styles",
        geostoreStyleCategoryCreatedSuccessTitle: "Geostore Category creation.",
        geostoreStyleCategoryCreatedSuccessMsg: "Geostore LAYERS_STYLES Category successfully created.",
        geostoreStyleCategoryCreatedErrorTitle: "Error creating category.",
        geostoreStyleCategoryCreatedErrorMsg: "GeoStore resources disabled, only Admin can create missing LAYERS_STYLES CATEGORY.",
        geostoreStyleCategorySearchErrorTitle: "Error search categories.",
        geostoreStyleCategorySearchErrorMsg: "Something went wrong in the search categories."
    },

    "gxp.form.MapsComboBox.prototype": {
        fieldLabel: "User maps",
        emptyText:"Maps",
        valueNotFoundText: "Maps"
    },

    "gxp.plugins.he.MapSelector.prototype": {
        mapActionText: "Map Actions",
        mapActionTip: "Map actions",
        saveText: "Save",
        createText: "Create",
        deleteText: "Delete",
        contextSaveSuccessString: "Map context saved succesfully",
        contextSaveFailString: "Map context not saved succesfully",
        contextCreateSuccessString: "Map created succesfully",
        contextCreateFailString: "Map not created succesfully",
        contextDeleteSuccessString: "Map deleted succesfully",
        contextDeleteFailString: "Map not deleted succesfully",
        saveTitle: "Save Map Context?",
        saveMsg: "Would you like to save your changes?",
        createTitle: "Create New Map?",
        createMsg: "Would you like to save map context as new map?",
        deleteTitle: "Delete Map?",
        deleteMsg: "Would you like delete your map?",
        addResourceButtonText: "Add Map",
        contextMsg: 'Loading...',
        mapMetadataTitle: "Insert Map Metadata",
        mapMedatataSetTitle: "Map Metadata",
        mapNameLabel: "Name",
        mapDescriptionLabel: "Description",
        conflictErrMsg: "A map with the same name already exists"
    }

});