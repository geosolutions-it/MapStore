/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  module = gxp
 *  class = NewSourceWindow
 *  extends = Ext.Window
 */
Ext.namespace("gxp");

/** api: constructor
 * .. class:: gxp.NewSourceWindow(config)
 *
 *     An Ext.Window with some defaults that better lend themselves toward use 
 *     as a quick query to get a service URL from a user.
 */
gxp.NewSourceWindow = Ext.extend(Ext.Window, {

    /** api: config[title]
     *  ``String``
     *  Window title (i18n).
     */
    title: "Add New Server...",

    /** api: config[cancelText]
     *  ``String``
     *  Text for cancel button (i18n).
     */
    cancelText: "Cancel",
    
    /** api: config[addServerText]
     *  ``String``
     *  Text for add server button (i18n).
     */
    addServerText: "Add Server",
	
	/** api: config[editServerText]
     *  ``String``
     *  Text for edit server button (i18n).
     */
	editServerText: "Apply",
    
    /** api: config[invalidURLText]
     *  ``String``
     *  Message to display when an invalid URL is entered (i18n).
     */
    invalidURLText: "Enter a valid URL to a WMS/WMTS/TMS endpoint (e.g. http://example.com/geoserver/wms)",

    /** api: config[contactingServerText]
     *  ``String``
     *  Text for server contact (i18n).
     */
    contactingServerText: "Contacting Server...",
	
	/** api: config[sourceTypeLabel]
     *  ``String``
     */
	sourceTypeLabel: "Type (*)",
	
    /** api: config[advancedOptionsTitle]
     *  ``String``
     */
	advancedOptionsTitle: "Advanced Options",
	
    /** api: config[generalTabTitle]
     *  ``String``
     */	
	generalTabTitle: "General",
	
	/** api: config[titleLabel]
     *  ``String``
     */
	titleLabel: "Title",
	
	/** api: config[versionLabel]
     *  ``String``
     */
	versionLabel: "Version (*)",
	
	/** api: config[authParamLabel]
     *  ``String``
     */
	authParamLabel: "Auth Param",
	
	/** api: config[minXLabel]
     *  ``String``
     */
	minXLabel: "MinX",
	
	/** api: config[minYLabel]
     *  ``String``
     */
	minYLabel: "MinY",
	
	/** api: config[maxXLabel]
     *  ``String``
     */
	maxXLabel: "MaxX",
	
	/** api: config[maxYLabel]
     *  ``String``
     */
	maxYLabel: "MaxY",
	
	/** api: config[paramsTabTitle]
     *  ``String``
     */
	paramsTabTitle: "Params",
	
	/** api: config[cacheTabTitle]
     *  ``String``
     */
	cacheTabTitle: "Cache",
	
	/** api: config[addParamButtonText]
     *  ``String``
     */
	addParamButtonText: "Add",
	
	/** api: config[propNameLabel]
     *  ``String``
     */
	propNameLabel: "Name",
	
	/** api: config[propValueLabel]
     *  ``String``
     */
	propValueLabel: "Value",
	
	/** api: config[paramsWinTitle]
     *  ``String``
     */
	paramsWinTitle: "Params Options",
	
	/** api: config[okButtonText]
     *  ``String``
     */
	okButtonText: "OK",
	
	/** api: config[addPropDialogTitle]
     *  ``String``
     */
	addPropDialogTitle: "Add Property",
	
	/** api: config[addPropDialogMsg]
     *  ``String``
     */
	addPropDialogMsg: "Property name or his value are not valid",
	
	/** api: config[cancelButtonText]
     *  ``String``
     */
	cancelButtonText: "Cancel",
	
	/** api: config[removeButtonText]
     *  ``String``
     */
	removeButtonText: "Remove",
	
	/** api: config[removePropDialogTitle]
     *  ``String``
     */
	removePropDialogTitle: "Remove Property",
	
	/** api: config[removePropDialogMsg]
     *  ``String``
     */
	removePropDialogMsg: "This property cannot be removed: ",
	
	/** api: config[newSourceDialogTitle]
     *  ``String``
     */
	newSourceDialogTitle: "New Source",
	
	/** api: config[newSourceDialogMsg]
     *  ``String``
     */
	newSourceDialogMsg: "Some source properties are invalid.",
	
    /** api: config[mandatoryLabelText]
     *  ``String``
     */
	mandatoryLabelText: "All fields marked with (*) are mandatory.",
    
    /** api: config[bodyStyle]
     * The default bodyStyle sets the padding to 0px
     */
    bodyStyle: "padding: 0px",

    /** api: config[width]
     * The width defaults to 300
     */
    width: 300,

    /** api: config[closeAction]
     * The default closeAction is 'hide'
     */
    closeAction: 'hide',

    /** api: property[error]
     * ``String``
     * The error message set (for example, when adding the source failed)
     */
    error: null,
    
    /** api: config[availableSources]
     *  ``Array``
     *  List of available sources, with related configuration.
     */
    availableSources: [],
	
    /** api: config[availableFormats]
     *  ``Array``
     *  List of available formats for map requests.
     */
	availableFormats: [["image/png8"], ["image/png"], ["image/jpeg"]],
	
	/** api: config[availableVendorOptions]
     *  ``Array``
     *  List of available vendor options for source layers.
     */
	availableVendorOptions: [
		["ANGLE"], 
		["BUFFER"], 
		["CQL_FILTER"], 
		["ENV"], 
		["FILTER"], 
		["FORMAT_OPTIONS"], 
		["PALETTE"], 
		["TILESORIGIN"]
	],

	isNewSource: true,
	
    /** api: event[server-added]
     * Fired with the URL that the user provided as a parameter when the form 
     * is submitted.
     */
    initComponent: function() {

        this.addEvents("server-added");

        this.urlTextField = new Ext.form.TextField({
            fieldLabel: "URL (*)",
            allowBlank: false,
            width: 210,
			labelStyle: "width: 50px;",
            msgTarget: "under",
            validator: this.urlValidator.createDelegate(this)
        });
        
        var store = [];
        for(var count = 0, l = this.availableSources.length; count < l; count++) {
            var source = this.availableSources[count];
            store.push([source.name, source.description]);
        }
		
        this.form = new Ext.Panel({
			layout: "form",
            items: [{
                xtype: 'combo',
                width: 210,
				labelStyle: "width: 50px;",
				ref: "../sourceType",
                name: 'type',
                fieldLabel: this.sourceTypeLabel,
				ref: "sourceType",
                value: 'WMS',
                mode: 'local',
                triggerAction: 'all',
                store: store,
				listeners: {
					scope: this,
					select: function(combo, record, index) {
						var sourceType = store[index][0];
						if(sourceType == "WMS"){
							this.advancedOptions.show();
						}else{
							this.advancedOptions.hide();
						}
					}
				}
            }, this.urlTextField,
			{
				xtype: "fieldset",
				title: this.advancedOptionsTitle,
				ref: "../advancedOptions",
				collapsible: true,
				collapsed: true,
				hidden: false,
				items:[{
					xtype: "tabpanel",
					bodyStyle: "padding: 5px",
					deferredRender: false,
					activeTab: 0,
					items: [
						{
							xtype: "form",
							title: this.generalTabTitle,
							ref: "../../../generalForm",	
							labelWidth: 80,
							height: 120,
							items: [{
									xtype: "textfield",
									name: "title",
									width: 147,
									allowBlank: true,
									fieldLabel: this.titleLabel
								},{
									xtype: 'combo',
									name: "version",
									width: 147,
									allowBlank: false,
									fieldLabel: this.versionLabel,
									value: "1.1.1",
									mode: 'local',
									triggerAction: 'all',
									mode: "local",
									forceSelection: true,
									editable: false,
									valueField: "version",
									displayField: "version",
									store: new Ext.data.ArrayStore({
										fields: ["version"],
										data:  [["1.1.1"], ["1.3.0"]]
									})
								},{
									xtype: "textfield",
									name: "authParam",
									width: 147,
									allowBlank: true,
									fieldLabel: this.authParamLabel
							}]
						}, {			
							xtype: "form",
							title: this.cacheTabTitle,
							ref: "../../../cacheForm",	
							labelWidth: 80,
							height: 120,
							items: [{
								xtype: "numberfield",
								allowBlank: true,
								name: "minx",
								fieldLabel: this.minXLabel
							},{
								xtype: "numberfield",
								allowBlank: true,
								name: "miny",
								fieldLabel: this.minYLabel
							},{
								xtype: "numberfield",
								allowBlank: true,
								name: "maxx",
								fieldLabel: this.maxXLabel
							},{
								xtype: "numberfield",
								allowBlank: true,
								name: "maxy",
								fieldLabel: this.maxYLabel
							}]
						}, {
							layout: "form",
							title: this.paramsTabTitle,
							height: 120,
							items: [
								new Ext.grid.PropertyGrid({
									header: false,
									height: 90,
									autoScroll: false,
									hideHeaders: true,
									selModel: new Ext.grid.RowSelectionModel(),
									ref: "../../../../paramGrid",									
									listeners: {
										scope: this,
										rowclick: function(el, rowIndex, evt){
											this.paramGrid.removeButton.enable();
										}
									},									
									bbar:["->",{
										text: this.addParamButtonText,
										iconCls: "add",
										scope: this,
										handler: function(){			
											var paramForm = new Ext.form.FormPanel({
												width: 300,
												items: [
													{
														xtype: "combo",
														ref: "propertyName",
														fieldLabel: this.propNameLabel,
														width: 100,
														store: new Ext.data.ArrayStore({
															fields: ["params"],
															data :  this.availableVendorOptions
														}),
														listeners:{
															scope: this,
															select: function(combo, record, index){
																var param = record.get("params");
																if(param == "FORMAT"){
																	paramForm.propertyValue.hide();
																	paramForm.tiledCombo.hide();
																	paramForm.formatCombo.show();
																}else if(param == "TILED"){
																	paramForm.propertyValue.hide();
																	paramForm.formatCombo.hide();
																	paramForm.tiledCombo.show();																
																}else{
																	paramForm.formatCombo.hide();
																	paramForm.tiledCombo.hide();
																	paramForm.propertyValue.show();
																}
															}
														},
														mode: "local",
														forceSelection: true,
														triggerAction: "all",
														editable: false,
														valueField: "params",
														displayField: "params"
													},
													{
														xtype: "combo",
														ref: "formatCombo",
														fieldLabel: this.propValueLabel,
														width: 100,
														hidden: true,
														store: new Ext.data.ArrayStore({
															fields: ["format"],
															data :  this.availableFormats
														}),
														mode: "local",
														forceSelection: true,
														triggerAction: "all",
														editable: false,
														valueField: "format",
														displayField: "format"
													},
													{
														xtype: "combo",
														ref: "tiledCombo",
														fieldLabel: this.propValueLabel,
														width: 100,
														hidden: true,
														store: new Ext.data.ArrayStore({
															fields: ["tiled"],
															data :  [["true"], ["false"]]
														}),
														mode: "local",
														forceSelection: true,
														triggerAction: "all",
														editable: false,
														valueField: "tiled",
														displayField: "tiled"
													},
													{
														hidden: false,
														width: 100,
														xtype: 'textfield',
														ref: "propertyValue",
														allowBlank: false,
														fieldLabel: this.propValueLabel,
														flex: 1
													}
												]
											});
											
											var paramWindow = new Ext.Window({
												title: this.paramsWinTitle,
												width: 315,
												modal: true,
												items: [
													paramForm
												],
												bbar: ["->", {
													text: this.okButtonText,
													iconCls: "save",
													scope: this,
													handler: function(){
														var propertyName = paramForm.propertyName;
														var propertyValue = paramForm.propertyValue;
														var tiledCombo = paramForm.tiledCombo;
														var formatCombo = paramForm.formatCombo;
														
														if(propertyName.isDirty() && propertyName.isValid()){
															if(propertyValue.isDirty() && propertyValue.isValid()){															
																this.paramGrid.setProperty(propertyName.getValue(), propertyValue.getValue(), true);														
																paramWindow.close();
															}else if(tiledCombo.isDirty() && tiledCombo.isValid()){
																this.paramGrid.setProperty(propertyName.getValue(), tiledCombo.getValue(), true);														
																paramWindow.close();
															}else if(formatCombo.isDirty() && formatCombo.isValid()){
																this.paramGrid.setProperty(propertyName.getValue(), formatCombo.getValue(), true);														
																paramWindow.close();
															}else{
																Ext.Msg.show({
																	 title: this.addPropDialogTitle,
																	 msg: this.addPropDialogMsg,
																	 width: 300,
																	 icon: Ext.MessageBox.WARNING
																});
															}
														}
													}
												}, {	
													text: this.cancelButtonText,
													scope: this,
													iconCls: "cancel",
													handler: function(){
														paramWindow.close();
													}
												}]
											});
											
											paramWindow.show();
										}
									},{
										text: this.removeButtonText,
										scope: this,
										disabled: true,
										iconCls: "delete",
										ref: "../removeButton",
										handler: function(){
											var gridSelModel = this.paramGrid.getSelectionModel();
											var selected = gridSelModel.getSelected();
											
											if(selected){
												this.paramGrid.removeProperty(selected.id);
											}else{
											    Ext.Msg.show({
													 title: this.removePropDialogTitle,
													 msg: this.removePropDialogMsg + selected.id,
													 width: 300,
													 icon: Ext.MessageBox.WARNING
												});
											}											
										}
									}],
									customEditors: {
										"FORMAT": new Ext.grid.GridEditor(new Ext.form.ComboBox({
												store: new Ext.data.ArrayStore({
													fields: ["format"],
													data :  this.availableFormats
												}),
												mode: "local",
												forceSelection: true,
												triggerAction: "all",
												editable: false,
												valueField: "format",
												displayField: "format"
										}))
									},
									source:{}
								})
							]
						}
					]
				}, {
					xtype: "label",
					text: this.mandatoryLabelText,
					style: "color: red;"
				}]
			}],
            border: false,
            labelWidth: 30,
            bodyStyle: "padding: 5px",
			autoScroll: true,
            listeners: {
                afterrender: function() {
                    this.urlTextField.focus(false, true);
                },
                scope: this
            }
        });

        this.bbar = [
            new Ext.Button({
                text: this.cancelText,
				iconCls: "gxp-icon-removefilter",
                handler: function() {
                    this.hide();
                },
                scope: this
            }),
            new Ext.Toolbar.Fill(),
            new Ext.Button({
                text: this.isNewSource === true ? this.addServerText : this.editServerText,
                iconCls: "add",
				ref: "../sourceButton",
                handler: function() {
                    // Clear validation before trying again.
                    this.error = null;
					
                    if (this.urlTextField.validate()) {
						var sourceUrl = this.urlTextField.getValue();
						
						var sourceCfg = {
							url: sourceUrl
						};
												
						var generalForm = this.generalForm.getForm();
						if(generalForm.isValid()){
							var generalCfgForm = generalForm.getValues();
							if(generalCfgForm){
								for(property in generalCfgForm){
									if(generalCfgForm[property] == ""){
										delete generalCfgForm[property];
									}
								}
								
								Ext.applyIf(sourceCfg, generalCfgForm);
							}
						};
						
						var cacheForm = this.cacheForm.getForm();
						if(cacheForm.isValid()){
							var cacheCfgForm = cacheForm.getValues();
							if(cacheCfgForm){
								var filled = true;
							    for(property in cacheCfgForm){
									if(cacheCfgForm[property] == ""){
										filled = false;
									}
								}
								
								if(filled){
									Ext.applyIf(sourceCfg, {
										layersCachedExtent: [cacheCfgForm.minx, cacheCfgForm.miny, cacheCfgForm.maxx, cacheCfgForm.maxy]
									});
								}
							}
						}
						
						var paramGridStore = this.paramGrid.getStore();
						var paramGridRecords = paramGridStore.getRange(0, paramGridStore.getCount());	

						if(paramGridRecords){
							var layerBaseParams = {};
							for(var i=0; i<paramGridRecords.length; i++){
								var record = paramGridRecords[i];
								if(record){
									layerBaseParams[record.data.name] = record.data.value;
								}
							}
							
							Ext.applyIf(sourceCfg, {
								layerBaseParams: layerBaseParams
							});
						}
					
						if(!this.sourceId){
							this.fireEvent("server-added", sourceUrl, this.form.sourceType.getValue(), sourceCfg);
						}else{
							this.fireEvent("server-modified", sourceUrl, this.form.sourceType.getValue(), sourceCfg, this.sourceId);
							this.sourceId = undefined;
							
							// Re-enabled fields
							this.urlTextField.enable();						
							this.form.sourceType.enable();	
						}							
                    }else{
						Ext.Msg.show({
							 title: this.newSourceDialogTitle,
							 msg: this.newSourceDialogMsg,
							 width: 300,
							 icon: Ext.MessageBox.WARNING
						});
					}
                },
                scope: this
            })
        ];
	
        this.items = this.form;

        gxp.NewSourceWindow.superclass.initComponent.call(this);

        this.form.on("render", function() {
            this.loadMask = new Ext.LoadMask(this.form.getEl(), {msg:this.contactingServerText});
        }, this);

        this.on("hide", function() {
            // Reset values so it looks right the next time it pops up.
            this.error = null;
            this.urlTextField.validate(); // Remove error text.
            this.urlTextField.setValue("");
            this.loadMask.hide();
        }, this);

        this.on("server-added", function(url) {
            this.setLoading();
            var success = function(record) {
                this.hide();
            };

            var failure = function() {
                this.setError(this.sourceLoadFailureMessage);
            };

            // this.explorer.addSource(url, null, success, failure, this);
            this.addSource(url, success, failure, this);
        }, this);

    },
	
	/** public: method[showWindow]
     */
	showWindow: function(){
		this.isNewSource = true;
		this.sourceButton.setText(this.addServerText);
		this.sourceButton.setIconClass("add");
		
		this.urlTextField.enable();			
		this.form.sourceType.enable();
		
		// /////////////////////////////////////
		// Clean the form for each new source 
		// /////////////////////////////////////
		var generalForm = this.generalForm.getForm();
		generalForm.reset();
		
		var cacheForm = this.cacheForm.getForm();
		cacheForm.reset();
		
		this.show();
		
		this.cleanVendorParams();
		
		// /////////////////////////////////////////////////////////////
		// Set the default vendor optione for the new source to create
		// /////////////////////////////////////////////////////////////
		if(this.defaultVendor){
			for(property in this.defaultVendor){
				this.paramGrid.setProperty(property, this.defaultVendor[property], true);
			}
		}		
	},
	
	/** public: method[bindSource]
     */
	bindSource: function(source){
		if(source){
			this.isNewSource = false;
			this.sourceButton.setText(this.editServerText);
			this.sourceButton.setIconClass("save");
			
			this.show();
			
			this.urlTextField.setValue(source.url);
			this.urlTextField.disable();			
			this.form.sourceType.disable();
		
			var generalForm = this.generalForm.getForm();
			generalForm.setValues({
				title: source.title ? source.title : "",
				version: source.version ? source.version : "1.1.1",
				authParam: source.authParam ? source.authParam : "",
			});
		
			if(source.layersCachedExtent){
				var cacheForm = this.cacheForm.getForm();
				
				cacheForm.setValues({
					minx: source.layersCachedExtent[0] ? source.layersCachedExtent[0] : "",
					miny: source.layersCachedExtent[1] ? source.layersCachedExtent[1] : "",
					maxx: source.layersCachedExtent[2] ? source.layersCachedExtent[2] : "",
					maxy: source.layersCachedExtent[3] ? source.layersCachedExtent[3] : "",
				});
			}
			
			this.cleanVendorParams();
		    if(source.layerBaseParams){
				for(property in source.layerBaseParams){
					if(source.layerBaseParams[property]){
						var name = property;
						var value = source.layerBaseParams[property];
						this.paramGrid.setProperty(name, value, true);
					}
				}
			}	
			
			this.sourceId = source.id;
		}
	},
	
	cleanVendorParams: function(){
		var paramGridStore = this.paramGrid.getStore();
		var paramGridRecords = paramGridStore.getRange(0, paramGridStore.getCount());
		
		for(var i=0; i<paramGridRecords.length; i++){
			var record = paramGridRecords[i];
			//if(record && record.id != "FORMAT" && record.id != "TILED"){
				this.paramGrid.removeProperty(record.id);
			//}
		}
	},
    
    /** private: property[urlRegExp]
     *  `RegExp`
     *
     *  We want to allow protocol or scheme relative URL  
     *  (e.g. //example.com/).  We also want to allow username and 
     *  password in the URL (e.g. http://user:pass@example.com/).
     *  We also want to support virtual host names without a top
     *  level domain (e.g. http://localhost:9080/).  It also makes sense
     *  to limit scheme to http and https.
     *  The Ext "url" vtype does not support any of this.
     *  This doesn't have to be completely strict.  It is meant to help
     *  the user avoid typos.
     */
    urlRegExp: /^(http(s)?:)?\/\/([\w%]+:[\w%]+@)?([^@\/:]+)(:\d+)?\//i,
    
    /** private: method[urlValidator]
     *  :arg url: `String`
     *  :returns: `Boolean` The url looks valid.
     *  
     *  This method checks to see that a user entered URL looks valid.  It also
     *  does form validation based on the `error` property set when a response
     *  is parsed.
     */
    urlValidator: function(url) {
        var valid;
        if (!this.urlRegExp.test(url)) {
            valid = this.invalidURLText;
        } else {
            valid = !this.error || this.error;
        }
        // clear previous error message
        this.error = null;
        return valid;
    },

    /** private: method[setLoading]
     * Visually signify to the user that we're trying to load the service they 
     * requested, for example, by activating a loadmask.
     */
    setLoading: function() {
        this.loadMask.show();
    },

    /** private: method[setError] 
     * :param: error the message to display
     *
     * Display an error message to the user indicating a failure occurred while
     * trying to load the service.
     */
    setError: function(error) {
        this.loadMask.hide();
        this.error = error;
        this.urlTextField.validate();
    },

    /** api: config[addSource]
     * A callback function to be called when the user submits the form in the 
     * NewSourceWindow.
     *
     * TODO this can probably be extracted to an event handler
     */
    addSource: function(url, success, failure, scope) {
    }
});
