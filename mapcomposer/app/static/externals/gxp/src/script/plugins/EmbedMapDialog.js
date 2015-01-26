/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = EmbedMapDialog
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: EmbedMapDialog(config)
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
gxp.plugins.EmbedMapDialog = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_embedmapdialog */
    ptype: "gxp_embedmapdialog",

	exportMapText: "Link Map",
	
	toolsTitle: "Choose tools to include in the toolbar:",
	
	alertEmbedTitle: "Attention",
	
    alertEmbedText: "Save the map before using the 'Publish Map' tool",	
	
	previewText: "Preview",
	
	embeddedTemplateName: "viewer", 
	
	embedCodeTitle: "Embed Code",

	embedURL: "Direct URL",
	
	embedUrlLabel: "EMBED",
	
	composerUrlLabel: "FULL",
	
	showMapTooltip: "Show in a new Window",
	
	showDirectURL: true,
	
    /**QR Code add-ons
    */
    loadMapText: 'Load this Map (install application first)',
    downloadAppText: 'Install Application',
    loadInMapStoreMobileText:'Mobile',
    openImageInANewTab: "Open Image in a New Tab",
    showQRCode: true,
    
    qrCodeSize:128,
    
    appDownloadUrl:"http://demo.geo-solutions.it/share/mapstoremobile/MapStoreMobile.apk",
    
    links: [{
       "label": "FULL",
        "base" : ""
        
    },{
        "label": "SMALL",
        "base":  "viewer"
    
    }],
    
    /** 
     * api: method[addActions]
     */
    addActions: function() {
		var target = this.target;
		
		var enable = (target.mapId && target.mapId != -1);
        var actions = gxp.plugins.GroupProperties.superclass.addActions.apply(this, [{
            menuText: "",
            iconCls: 'icon-export',
            disabled: !enable,
            hidden: !enable,
            tooltip: this.exportMapText,
			handler: function() {
				this.showEmbedWindow();
			},
            scope: this
        }]);
       
        return actions;
    },
	
	/** private: method[openPreview]
     */
    openPreview: function(embedMap) {
        var preview = new Ext.Window({
            title: this.previewText,
            layout: "fit",
            resizable: false,
            items: [{border: false, html: embedMap.getIframeHTML()}]
        });
		
        preview.show();
		
        var body = preview.items.get(0).body;
        var iframe = body.dom.firstChild;
        var loading = new Ext.LoadMask(body);
		
        loading.show();
        Ext.get(iframe).on('load', function() { loading.hide(); });
    },

    /** private: method[showEmbedWindow]
     */
    showEmbedWindow: function() {  
        var target = this.target;	
		
	    if (target.mapId == -1 || (target.modified == true && target.auth == true)){
            Ext.MessageBox.show({
                title: this.alertEmbedTitle,
                msg: this.alertEmbedText,
                buttons: Ext.MessageBox.OK,
                animEl: 'mb4',
                icon: Ext.MessageBox.WARNING,
                scope: this
            });
        }else{
           /*var toolsArea = new Ext.tree.TreePanel({title: this.toolsTitle, 
               autoScroll: true,
               root: {
                   nodeType: 'async', 
                   expanded: true, 
                   children: target.viewerTools
               }, 
               rootVisible: false,
               id: 'geobuilder-0'
           });*/

           /*var previousNext = function(incr){
               var l = Ext.getCmp('geobuilder-wizard-panel').getLayout();
               var i = l.activeItem.id.split('geobuilder-')[1];
               var next = parseInt(i, 10) + incr;
			   
               l.setActiveItem(next);
			   
               Ext.getCmp('wizard-prev').setDisabled(next==0);
               Ext.getCmp('wizard-next').setDisabled(next==1);

               if (incr == 1) {
                   target.saveAndExport();
               }
           };*/
           
           var curLang = OpenLayers.Util.getParameters()["locale"] || 'en';
           var qstring = "?locale=" + curLang + "&bbox=" + target.mapPanel.map.getExtent() + "&mapId=" + target.mapId;
           var url = this.embeddedTemplateName + qstring;
           var linkFiels = [];
		   for(var i = 0; i < this.links.length ; i++ ){
                 linkFiels.push(this.createLinkField(this.links[i],qstring));
           }
          
		   
		   var directURL = new Ext.form.FieldSet({
				title: this.embedURL,
				labelWidth: 50,
				items:linkFiels,
				bodyStyle: 'padding: 15px'
		   });
           var embedMap = new gxp.EmbedMapDialog({
               id: 'geobuilder-1',
               url: url
           });
		   
		   var snippetFieldSet = new Ext.form.FieldSet({
				title: this.embedCodeTitle,
				items:[
					embedMap
				]
		   });
		   var wizardItems = [snippetFieldSet];
		   
		   if(this.showDirectURL === true){
				wizardItems.push(directURL);
		   }
           var showQR = this.showQRCode ==true && !Ext.isIE7 && !Ext.isIE8 && !Ext.isIE6;
		   if(showQR){
            var qrCodePanel = this.createQrCodePanel(this.target.geoStoreBaseURL + "data/" + target.mapId );
            wizardItems.push(qrCodePanel);
           }
           
           var wizard = {
               id: 'geobuilder-wizard-panel',
               layout:'form',
               /*border: false,
               layout: 'card',
               activeItem: 0,
               defaults: {border: true, hideMode: 'offsets'},
               bbar: [{
                   id: 'preview',
                   text: this.previewText,
                   handler: function() {
                       //this.saveAndExport(this.openPreview.createDelegate(this, [embedMap]));
                       this.openPreview(embedMap);
                   },
                   scope: this
               }, '->', {
                   id: 'wizard-prev',
                   text: this.backText,
                   handler: previousNext.createDelegate(this, [-1]),
                   scope: this,
                   disabled: true
               },{
                   id: 'wizard-next',
                   text: this.nextText,
                   handler: previousNext.createDelegate(this, [1]),
                   scope: this
               }],*/

               items: [wizardItems]
               //items: [toolsArea, embedMap]
           };

           new Ext.Window({
                layout: 'fit',
                width: 500, 
                
				height: 245 +  (this.showDirectURL == true? 100 + ( (this.links.length-1) * 50) : 0) + (showQR  ? this.qrCodeSize + 60 :0),
                title: this.exportMapText,
                items: [wizard]
           }).show();
           
        }
        
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
                ref: '../open',
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
                layout: 'column',
                height: this.qrCodeSize + 60,
				title: this.loadInMapStoreMobileText,
				items:[
                    qrCodePanel,
					choose
				],
				bodyStyle: 'padding: 15px'
		   });
        return fieldset;
    
    },
    createLinkField: function(config, qstring){
           var url = config.base + qstring;
           for(var param in config.params){
            url+= "&" + param + "=" + encodeURIComponent(config.params[param]);
           }
		   var fields = [];
		   var urlField = new Ext.form.TextField({
				width: 350,
				value: gxp.util.getAbsoluteUrl(url),
				selectOnFocus: true,
				readOnly: true
		   }); 
		   
		   var urlCompositeField = new Ext.form.CompositeField({
                fieldLabel: config.label || this.composerUrlLabel,
				items:[
					urlField,
					{
						xtype: 'button',
						tooltip: config.showMapTooltip,
						iconCls: "gx-map-go",
						width: 20,
						handler: function(){
							var u = urlField.getValue();
							window.open(u);
						}
					}
				]
		   });
           return urlCompositeField;
    }
});

Ext.preg(gxp.plugins.EmbedMapDialog.prototype.ptype, gxp.plugins.EmbedMapDialog);