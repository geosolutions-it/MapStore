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
	
	urlLabel: "URL",
	
	showMapTooltip: "Show in a new Window",
	
	showDirectURL: true,
	
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
           var url = this.embeddedTemplateName + "?locale=" + curLang + "&bbox=" + target.mapPanel.map.getExtent() + "&mapId=" + target.mapId;
		   
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
		   
		   var urlField = new Ext.form.TextField({
				fieldLabel: this.urlLabel,
				labelStyle: 'font-weight:bold;',
				width: 350,
				value: gxp.util.getAbsoluteUrl(url),
				selectOnFocus: true,
				readOnly: true
		   }); 
		   
		   var urlCompositeField = new Ext.form.CompositeField({
				items:[
					urlField,
					{
						xtype: 'button',
						tooltip: this.showMapTooltip,
						iconCls: "gx-map-go",
						width: 20,
						handler: function(){
							var u = urlField.getValue();
							window.open(u);
						}
					}
				]
		   });
		   
		   var directURL = new Ext.form.FieldSet({
				title: this.embedURL,
				labelWidth: 50,
				items:[
					urlCompositeField
				],
				bodyStyle: 'padding: 15px'
		   });
		   
		   wizardItems = [snippetFieldSet];
		   
		   if(this.showDirectURL === true){
				wizardItems.push(directURL);
		   }
		   
           var wizard = {
               id: 'geobuilder-wizard-panel',
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
				height: this.showDirectURL === true ? 345 : 245,
                title: this.exportMapText,
                items: [wizard]
           }).show();
        }
    }        
});

Ext.preg(gxp.plugins.EmbedMapDialog.prototype.ptype, gxp.plugins.EmbedMapDialog);