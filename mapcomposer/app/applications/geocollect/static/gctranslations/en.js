/**
 * Copyright (c) 2009-2010 The Open Planning Project
 */
/*
	NOTE: configuration customization could override
	these strings
*/
GeoExt.Lang.add("en", {
    //GeoCollect Manager Classes
    "mxp.plugins.GeostoreMissionResourceEditor.prototype": {
        buttonText: "Mission Configuration"
    },
    "mxp.widgets.GcResourceEditor.prototype": {
        jsonPanel: "Advanced Configuration",
        jsonToGuiBtnText: "Push To GUI",
        jsonToGuiBtnTooltip: "Push Configuration into GUI",
        guiToJSONBtnText: "Pull from GUI",
        guiToJSONBtnTooltip: "Pull Configuration from GUI",
        checkMissionBtn: "Validate",
        checkMissionBtnTooltip: "Validate Configuration",
        validateMsgValid: "Valid Mission Template",
        validateMsgInvalid: "Invalid Mission Template",
        validateMsgTitle: "Validate?"
    },
    "mxp.widgets.GcMobileResourceEditor.prototype": {
        title: "Mobile",
        previewTabTitle: "List Items",
        infoTabTitle: "Item Details",
        surveyTabTitle: "Survey Tab",
        noticeTabTitle: "Items Tab",
        previewMsgTitle: "Warning",
        previewMsg: "Items List must be valid to proceed"
    },
    "mxp.widgets.GcMListResourceEditor.prototype": {

        nameFieldLabel: "Name",
        descriptionFieldLabel: "Description",
        orderingFieldLabel: "Ordering",
        iconFieldLabel: "Icon Field",
        addCondBtnTooltib: "Create Condizione",
        removeCondBtnTooltib: "Delete Conditione",
        condMsgTitle: "Error",
        condMsg: "Invalid Configuration, Type, Value and Color are mandatori",
        bntValidateText: "Validate",
        btnValidateTooltip: "Validate Items List Configuration",
        validateMsgValid: "Valid Items List Configuration",
        validateMsgInvalid: "Invalid Items List Configuration",
        validateMsgTitle: "Validate?"
    },
    "mxp.widgets.GcMobileWidgetPanel.prototype": {

        sourceLabel: "Item Fields",
        destLabel: "Survey Fields",
        wdgTypeLabel: "Widget Type",
        widgetsGridTitle: "Widgets",
        inputTypeLabel: "Input",
        wdgGridXTypeHd: "Xtype",
        wdgGridFiledHd: "Field Id",
        wdgGridValueHd: "Value",
        btnValidateTitle: "Validate",
        btnValidateTooltip: "Validate Widgets Page",
        validateMsgValid: "Valid Page",
        validateMsgInvalid: "Invalid Page",
        validateMsgTitle: "Validate?",
        btnAddTooltip: "Create Widget",
        addMsgTitle: "Save Widget",
        addMsg: "Save Changes?",
        btnDelTooltip: "Delete Widget",
        delMsgTitle: "Delete Widget",
        delMsg: "Delete Widget?",
        btnSaveTooltip: "Save Widget",
        btnSaveText: "Save",
        pageTitleLabel: "Page Title",
        pageMsgLabel: "Page Messagge",
        saveMsg: "Save Widget Changes?",
        saveMsgTitle: "Save Widget",
        saveAlertMsg: "Widget Properties Invalid",
        saveAlertTitle: "Error"
    },
    "mxp.widgets.GcFormResourceEditor.prototype": {
        surveyFormTitle: "Form Title",
        surveyFormDataUrlLabel: "Data Url",
        surveyFormMediaUrlLabel: "Media Url",
        btnAddPageText: "Create Page",
        btnAddPageTooltip: "Create New Page",
        savePageMsgTitle: "Save Page",
        savePageMsg: "Save This Page?",
        saveErroMsgTitle: "Error",
        saveErrorMsg: "Invalid Page Properties",
        btnDelPageText: "Delete Page",
        btnDelPageTooltip: "Delete Selected Page",
        delPageMsgTitle: "Page Delete",
        delPageMsg: "Delete This Page?",
        btnSavePageText: "Save",
        btnSavePageTooltip: "Save Selected Page",
        pagesGridTitle: "Pages",
        btnValidateText: "Validate",
        btnValidateTooltip: "Validate Pages",
        validateMsgValid: "Survey Template Valid",
        validateMsgInvalid: "Survey Template Not Valid",
        validateMsgTitle: "Validate now?",
        destLabel: "Survey Fields"

    },
    "mxp.widgets.GcFormSegResourceEditor.prototype": {
        destLabel: "Item Fields"
    },
    "mxp.widgets.GcConfigPanel.prototype": {
        title: "Additional Configurations",
        checkMissionBtn: "Validate",
        checkMissionBtnTooltip: "Validate Configuration",
        validateMsgValid: "Configuration Is Valid",
        validateMsgInvalid: "Configuration Is Not Valid",
        validateMsgTitle: "Validate now?"
    },
    "mxp.widgets.GcDbResourceEditor.prototype": {
        title: "Data Source",
        selectDbLabel: "Schema ",
        noticeTitle: "Items",
        surveyTitle: "Surveys",
        sColName: "Name",
        sColType: "Type",
        serverError: "Invalid Server Response",
        errorLayer: "Cannot Create Sources"
    },
    "mxp.widgets.XtypeTextField.prototype": {
        idFieldLabel: "Field",
        labFieldLabel: "Label",
        valueFieldLabel: "Value",
        mandatoryFieldLabel: "Mandatory",
        optFieldLabel: "Predefined Values"
    },
    "mxp.widgets.OptionsCreator.prototype": {
        erroMsg: "Spaces cannot be used",
        insertLabel: "Values",
        btnAddTooltip: "Add Value",
        btnRemoveTooltip: "Delete Value",
        fieldLabel: "Predefined Values",
        deleteMsgTitle: 'Delete Values?',
        deleteMsg: 'Are you sure you want to delete all the predefined values?'
    },
    "mxp.widgets.XtypeSpinner.prototype": {
        idFieldLabel: "Field",
        labFieldLabel: "Label",
        optFieldLabel: "Predefined Values"
    },
    "mxp.widgets.XtypeSepIc.prototype": {
        labFieldLabel: "Label",
        valueFieldLabel: "Icon Field"
    },
    "mxp.widgets.XtypePhoto.prototype": {
        labFieldLabel: "Action Message"
    },
    "mxp.widgets.XtypeMap.prototype": {
        descrFieldLabel: "Description",
        editableFieldLabel: "Editable",
        panFieldLabel: "Enable Pan",
        zoomFieldLabel: "Enable Zoom",
        displayFieldLabel: "Show Value",
        centerFieldLabel: "Center",
        centerMsgLabel: "Message",
        localizeFieldLabel: "Localize",
        localizeMsgLabel: "Message",
        zoomLevelLabel: "Zoom Level",
        mapHeightLabel: "Map Height"
    },
    "mxp.widgets.XtypeLabel.prototype": {
        idFieldLabel: "Field",
        labFieldLabel: "Label",
        valueFieldLabel: "Value"
    },
    "mxp.widgets.XtypeDateField.prototype": {
        idFieldLabel: "Field",
        labFieldLabel: "Label",
    },
    "mxp.widgets.XtypeCheckBox.prototype": {
        idFieldLabel: "Field",
        labFieldLabel: "Label"
    },
    "mxp.widgets.XActionSend.prototype": {
        valueFieldLabel: "Text",
        labFieldLabel: "Message"
    },
    "mxp.widgets.XActionSave.prototype": {
        valueFieldLabel: "Text",
        labFieldLabel: "Message"
    },
    //GeoCollect Composer Classes
    "gxp.plugins.GcSegGrid.prototype": {
        displayFeatureText: "Show On Map",
        firstPageTip: "First Page",
        previousPageTip: "Previous Page",
        zoomPageExtentTip: "Zoom to Page Extension",
        nextPageTip: "Next Page",
        lastPageTip: "Last Page",
        title: "Items",
        totalMsg: "Total: {0} Items",
        displayExportCSVText: "Export To CSV",
        exportCSVSingleText: "Single Page",
        exportCSVMultipleText: "All Pages",
        failedExportCSV: "Cannot Export To CSV Format",
        invalidParameterValueErrorText: "Invalid Parameter Value",
        zoomToFeature: "Zoom To Feature",
        exportTitleText: "Export",
        pageLabel: "Page",
        pageOfLabel: "of",
        totalRecordsLabel: "Total Elements",
        btnDetailsText: "Details",
        btnDetailsTooltip: "Open Item Details",
        btnMapText: "Map",
        btnMapTooltip: "Show Map",
        noticeDetailsPanelTitle: "Item Details",
        photoBrowserPanelTitle: "Survey Photos",
        noticePhotoBrowserPanelTitle: "Item Photos",
        surveysPanelTitle: "Survey",
        noticePanelTitle: "Item"
    },
    "gxp.plugins.GcFeatureEditor.prototype": {
        createFeatureActionTip: "Create New Item",
        saveOrCancelEdit: "Save or Cancel Edits",
        editFeatureActionTip: "Select Item"

    },
    "gxp.grid.GcHistoryGrid.prototype": {
        title: "History",
        loadingText: "Please wait, loading history",
        emptyText: "No History Data"
    },
    "Ext.PagingToolbar.prototype": {
        displayMsg: "Showing {0} - {1} of {2}",
        emptyMsg: "No Data",
        beforePageText: "Page",
        afterPageText: "of {0}",
        firstText: "Prima Page",
        prevText: "Previous Page",
        nextText: "Next Page",
        lastText: "Last Page",
        refreshText: "Refresh"
    },
    "gxp.plugins.GcSegForm.prototype": {
        closeMsgTitle: "Save Item?",
        closeMsg: "Do you want to stop editing?",
        deleteMsgTitle: "Delete Item?",
        deleteMsg: "Do you want to delete this Item?",
        editButtonText: "Edit",
        editButtonTooltip: "Enable Editing",
        deleteButtonText: "Delete",
        deleteButtonTooltip: "Delete this Item",
        cancelButtonText: "Cancel",
        cancelButtonTooltip: "Cancel Editing, Undo Edits",
        saveButtonText: "Save",
        saveButtonTooltip: "Save Edits"
    },
    "gxp.grid.GcSopGrid.prototype": {
        title: "Details",
        deleteMsgTitle: "Delete",
        deleteMsg: "Do you want to delete the selected Survey?",
        deleteButtonText: "Delete",
        deleteButtonTooltip: "Delete Selected Survey",
        editButtonText: "Edit",
        editButtonTooltip: "Edit Selected Survey",
        saveButtonText: "Save",
        saveButtonTooltip: "Save Changes",
        cancelButtonText: "Cancel",
        cancelButtonTooltip: "Cancel Edit",
        saveOrCancelEdit: "Save Or Cancel Edits",
        commitErrorTitle: "Error Saving Survey",
        commitErrorMsg: "Changes not saved!",
        refreshButtonTooltip:"Reload Surveys"
    },
    "mxp.plugins.MapManager.prototype":{
        buttonText: "Mission Manager",
        tooltipText: "Open Mission Manager"
    },
    "MSMGridPanel.prototype": {
        msg: "Loading...",
        textSearch: "Search",
        tooltipSearch: "Reset All Filters",
        textReset: "Reset",
        tooltipReset: "Reset All Filters",
        gridResourceId: "Resource Id",
        gridName: "Name",
        gridOwner: "Owner",
        gridDescription: "Description",
        gridDateCreation: "Date Creation",
        gridLastUpdate: "Last Update",
        textUserManager: 'User Manager',
        textViewMap: '', //"View Map",
        tooltipViewMap: "View Mission",
        textEmbedMap: '', //"Embed Map",
        tooltipEmbedMap: "Embed Map",
        textCopyMap: '', //"Clone Map",
        tooltipCopyMap: "Clone Map",
        textEditMap: '', //"Edit Map",
        tooltipEditMap: "Edit Map",
        textDeleteMap: '', //"Delete Map",
        tooltipDeleteMap: "Delete Mission",
        textEditMetadata: '', //"Edit Metadata",
        tooltipEditMetadata: "Edit Info",
        textSubmitEditMetadata: "Update",
        tooltipSubmitEditMetadata: "Update Info",
        titleConfirmCloseEditMetadata: 'Confirm',
        textConfirmCloseEditMetadata: 'Close window without saving?',
        metadataSaveSuccessTitle: "Success",
        metadataSaveSuccessMsg: "Metadata saved succesfully",
        metadataSaveFailTitle: "Metadata not saved succesfully",
        textClose: "Close",
        msgSaveAlertTitle: "Attention, your mission is not saved!",
        msgSaveAlertBody: "Do you really want to quit without saving it?",
        tooltipClose: "Close Map",
        msgDeleteMapTitle: "Attention",
        msgDeleteMapBody: "Do You want to delete this mission?",
        msgSuccessDeleteMapTitle: "Success",
        msgSuccessDeleteMapBody: "Mission has been deleted",
        msgFailureDeleteMapTitle: "Failed",
        msgFailureDeleteMapBody: "Something wrong has appened",
        IframeViewerTitle: "Mission Viewer - ",
        IframeComposerTitle: "Map Composer - ",
        IframeWaitMsg :"Loading Mission",
        mobileText:"Mobile",
        installApplicationText:"Install Android Application",
        scanThisApplicationText:"Scan this QR code to Install GeoCollect for Android",
        mapPermissionText: "Permissions",
        tooltipMapPermissionText: "Edit mission permissions by group",
        mapPermissionTitleText: "Mission Permissions",
        googleTooltip:"Download Android Mobile App From Google Play™"

    },
     "mxp.widgets.GcExportLayers.prototype":{
        exportFormatsLabel:"Export Formats",
        exportBtnTooltip:"Export Layers",
        invalidParameterValueErrorText:"Export Error!"
    },
    "MSMPagingToolbar.prototype":{
        resizerText: "Missions per page"

    }

    
});