/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
 *  class = EmbedMapDialog
 *  base_link = `Ext.Container <http://extjs.com/deploy/dev/docs/?class=Ext.Container>`_
 */

/** api: example
 *  Show a :class:`EmbedMapDialog` in a window, using "viewer.html" in the
 *  current path as url:
 * 
 *  .. code-block:: javascript
 *
 *      new Ext.Window({
 *           title: "Export Map",
 *           layout: "fit",
 *           width: 380,
 *           autoHeight: true,
 *           items: [{
 *               xtype: "embedmapdialog",
 *               url: "viewer.html" 
 *           }]
 *       }).show();
 */
 
/** api: constructor
 *  .. class:: EmbedMapDialog(config)
 *   
 *  A dialog for configuring a map iframe to embed on external web pages.
 */
EmbedMapDialog = Ext.extend(Ext.Container, {
    
    /** api: config[url]
     *  ``String`` the url to use as the iframe's src of the embed snippet. Can
     *  be a url relative to the current href and will be converted to an
     *  absolute one.
     */
    url: null,

    /** api: property[url]
     *  ``String`` the url to use as the iframe's src of the embed snippet. Can
     *  be a url relative to the current href and will be converted to an
     *  absolute one.
     */
    url: null,

    /* begin i18n */
    /** api: config[publishMessage] ``String`` i18n */
    publishMessage: "Your map is ready to be published to the web! Simply copy the following HTML to embed the map in your website:",
    /** api: config[heightLabel] ``String`` i18n */
    heightLabel: 'Height',
    /** api: config[widthLabel] ``String`` i18n */
    widthLabel: 'Width',
    /** api: config[mapSizeLabel] ``String`` i18n */
    mapSizeLabel: 'Map Size',
    /** api: config[miniSizeLabel] ``String`` i18n */
    miniSizeLabel: 'Mini',
    /** api: config[smallSizeLabel] ``String`` i18n */
    smallSizeLabel: 'Small',
    /** api: config[premiumSizeLabel] ``String`` i18n */
    premiumSizeLabel: 'Premium',
    /** api: config[largeSizeLabel] ``String`` i18n */
    largeSizeLabel: 'Large',
    /* end i18n */
    
    /** private: property[snippetArea]
     */
    snippetArea: null,
    
    /** private: property[heightField]
     */
    heightField: null,
    
    /** private: property[widthField]
     */
    widthField: null,
    
    
    
    /**QR Code add-ons
    */
    loadMapText: 'Load Map',
    downloadAppText: 'install Android Application',
    loadInMapStoreMobileText:'load in MapStoreMobile',
    openImageInANewTab: "Open Image in a New Tab",
    showQRCode: true,
    qrCodeSize:128,
    appDownloadUrl:"http://demo.geo-solutions.it/share/mapstoremobile/MapStoreMobile.apk",
    
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        Ext.apply(this, this.getConfig());
        EmbedMapDialog.superclass.initComponent.call(this);
    },

    /** api: method[getIframeHTML]
     *  :returns: ``String`` the HTML needed to create the iframe
     *
     *  Get the HTML needed to create the iframe.
     */
    getIframeHTML: function() {
        return this.snippetArea.getValue();
    },
    
    /** private: method[updateSnippet]
     */
    updateSnippet: function() {
        this.snippetArea.setValue(
            '<iframe style="border: none;" height="' + this.heightField.getValue() +
            '" width="' + this.widthField.getValue() +'" src="' + 
            this.getAbsoluteUrl(this.url) + '"></iframe>');
        if (this.snippetArea.isVisible() === true) {
            this.snippetArea.focus(true, 100);
        }
    },
	/** private: method[getAbsoluteUrl]
     */
	getAbsoluteUrl: function(url) {
        var a;
        if(Ext.isIE6 || Ext.isIE7 || Ext.isIE8) {
            a = document.createElement("<a href='" + url + "'/>");
            a.style.display = "none";
            document.body.appendChild(a);
            a.href = a.href;
            document.body.removeChild(a);
        } else {
            a = document.createElement("a");
            a.href = url;
        }
        return a.href;
    },
    
    /** private: method[getConfig]
     */
    getConfig: function() {
        this.snippetArea = new Ext.form.TextArea({
            height: 70,
            selectOnFocus: true,
            readOnly: true
        });
        
        var numFieldListeners = {
            "change": this.updateSnippet,
            "specialkey": function(f, e) {
                e.getKey() == e.ENTER && this.updateSnippet();
            },
            scope: this
        };

        this.heightField = new Ext.form.NumberField({
            width: 50,
            value: 400,
            listeners: numFieldListeners
        });
        this.widthField = new Ext.form.NumberField({
            width: 50,
            value: 600,
            listeners: numFieldListeners
        });        

        var adjustments = new Ext.Container({
            layout: "column",
            defaults: {
                border: false,
                xtype: "box"
            },
            items: [
                {autoEl: {cls: "embed-field-label", html: this.mapSizeLabel}},
                new Ext.form.ComboBox({
                    editable: false,
                    width: 75,
                    store: new Ext.data.SimpleStore({
                        fields: ["name", "height", "width"],
                        data: [
                            [this.miniSizeLabel, 100, 100],
                            [this.smallSizeLabel, 200, 300],
                            [this.largeSizeLabel, 400, 600],
                            [this.premiumSizeLabel, 600, 800]
                        ]
                    }),
                    triggerAction: 'all',
                    displayField: 'name',
                    value: this.largeSizeLabel,
                    mode: 'local',
                    listeners: {
                        "select": function(combo, record, index) {
                            this.widthField.setValue(record.get("width"));
                            this.heightField.setValue(record.get("height"));
                            this.updateSnippet();
                        },
                        scope: this
                    }
                }),
                {autoEl: {cls: "embed-field-label", html: this.heightLabel}},
                this.heightField,
                {autoEl: {cls: "embed-field-label", html: this.widthLabel}},
                this.widthField
            ]
        });

        return {
            border: false,
            defaults: {
                border: false,
                cls: "embed-export-section",
                xtype: "container",
                layout: "fit"
            },
            items: [{
                items: [adjustments]
            }, {
                xtype: "box",
                autoEl: {
                    tag: "p",
                    html: this.publishMessage
                }
            }, {
                items: [this.snippetArea]
            }],
            listeners: {
                "afterrender": this.updateSnippet,
                scope: this
            }
        };
    },
    /**
     * create the QR Code panel.
     * This functionality is available only for IE9+,Google Chrome,Mozilla Firefox
     */
    createQrCodePanel: function(url){
         url = url.replace("http://","mapstore://");
         var size = this.qrCodeSize;
         var qrCodePanel = new Ext.Panel({
            ref:'qrcode',
            columnWidth: '.35',
            height:this.qrCodeSize,
            width:this.qrCodeSize,
            border:false,
            listeners:{
                afterrender:function(qrCodePanel){
                    var code = new QRCode(qrCodePanel.body, 
                        {text:url,
                        width: size,
                        height: size
                    });
                    qrCodePanel.code = code;
                }
            }
         });
            
         var choose = new Ext.form.RadioGroup({
            ref:'radio',
            autoHeight: true,
            columns: 1,
            columnWidth: '.65',
            defaultType: 'radio', // each item will be a radio button
            items:[
            {
                checked: true,
                boxLabel: this.loadMapText,
                name: 'qr_code',
                inputValue: url
            },{
                labelSeparator: '',
                boxLabel: this.downloadAppText,
                name: 'qr_code',
                inputValue: this.appDownloadUrl
            },{
                xtype:'button',
                text:this.openImageInANewTab,
                ref:'../open',
                handler: function(btn){
                            var data = qrCodePanel.body.dom.lastChild.getAttribute("src");
                            data.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
                            window.open(data,'_blank');
                        }
            }],
            listeners:{
                change: function(radio,checked){
                    var qr = qrCodePanel.code;
                    qr.clear();
                    qr.makeCode(checked.inputValue);
                }
            }
        });
        
         var fieldset = new Ext.form.FieldSet({
                layout:'column',
                iconCls: 'ic_mobile',
                height:this.qrCodeSize + 60,
				title: this.loadInMapStoreMobileText,
				items:[
                    qrCodePanel,
					choose
				],
				bodyStyle: 'padding: 15px'
		   });
        return fieldset;
    
    }
});

/** api: xtype = embedmapdialog */
Ext.reg('embedmapdialog', EmbedMapDialog);
