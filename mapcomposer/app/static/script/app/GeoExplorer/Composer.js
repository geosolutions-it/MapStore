/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = GeoExplorer.Composer(config)
 *  extends = GeoExplorer
 */

/** api: constructor
 *  .. class:: GeoExplorer.Composer(config)
 *
 *      Create a GeoExplorer application intended for full-screen display.
 */
GeoExplorer.Composer = Ext.extend(GeoExplorer, {

    // Begin i18n.
    saveMapText: "Export Map",
    loadMapText: "Import Map",
    exportMapText: "Publish Map",
    toolsTitle: "Choose tools to include in the toolbar:",
    previewText: "Preview",
    backText: "Back",
    nextText: "Next",
    fullScreenText: "Full Screen",
	
	uploadButtonText: 'Upload',
	uploadWaitMsg: 'Uploading your context file...',
    uploadErrorTitle: 'File Upload Error',
    uploadEmptyText: 'Select a Map context file',
    uploadWinTitle: 'File Upload Form',
    cswFailureAddLayer: ' The layer cannot be added to the map',
    alertEmbedTitle: "Attention",
    alertEmbedText: "Save the map before using the 'Publish Map' tool",
	
    /**
    * Property: cswMsg
    * {string} string to add in loading message
    * 
    */
    cswMsg: 'Loading...',
    // End i18n.

    constructor: function(config) {        
        config.tools = [
            {
                ptype: "gxp_layertree",
                outputConfig: {
                    id: "layertree"
                },
                outputTarget: "tree"
            }, {
                ptype: "gxp_legend",
                outputTarget: 'legend',
                outputConfig: {
                    autoScroll: true
                },
                legendConfig : {
                    legendPanelId : 'legendPanel',
                    defaults: {
                        style: 'padding:5px',                  
                        baseParams: {
                            LEGEND_OPTIONS: 'forceLabels:on;fontSize:10',
                            WIDTH: 12, HEIGHT: 12
                        }
                    }
                }
            }, {
                ptype: "gxp_addlayers",
                actionTarget: "tree.tbar",
                upload: true
            }, {
                ptype: "gxp_removelayer",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_removeoverlays",
                actionTarget: "tree.tbar"
            }, {
                ptype: "gxp_addgroup",
                actionTarget: "tree.tbar"
            }, {
                ptype: "gxp_removegroup",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_groupproperties",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_layerproperties",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_zoomtolayerextent",
                actionTarget: {target: "layertree.contextMenu", index: 0}
            },{
                ptype:"gxp_geonetworksearch",
                actionTarget:[
                   "layertree.contextMenu"
                ]
            }, {
                ptype: "gxp_zoomtoextent",
                actionTarget: {target: "paneltbar", index: 15}
            }, {
                ptype: "gxp_navigation", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 16}
            }, {
                ptype: "gxp_zoombox", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 17}
            }, {
                ptype: "gxp_zoom",
                actionTarget: {target: "paneltbar", index: 18}
            }, {
                ptype: "gxp_navigationhistory",
                actionTarget: {target: "paneltbar", index: 19}
            }, {
                ptype: "gxp_wmsgetfeatureinfo", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 20}
            }, {
                ptype: "gxp_measure", toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 21}
            }, {
                ptype: "gxp_georeferences",
                actionTarget: {target: "paneltbar", index: 22}
            }, {
                ptype: "gxp_saveDefaultContext",
                actionTarget: {target: "paneltbar", index: 23},
				needsAuthorization: true
            },/*{
                ptype: "gxp_googleearth",
                actionTarget: {target: "paneltbar", index: 24}
            },*/{
                ptype: "gxp_googlegeocoder",
                //actionTarget: {target: "paneltbar", index: 28},
                outputConfig:{
                    emptyText:"Google GeoCoder"
                },
                outputTarget:"paneltbar",
                index: 25
            }/*,{
                ptype: "gxp_print",
                customParams: {outputFilename: 'mapstore-print'},
                printService: config.printService,
                legendPanelId: 'legendPanel',
                actionTarget: {target: "paneltbar", index: 4}
            }*/
        ];

        GeoExplorer.Composer.superclass.constructor.apply(this, arguments);
    },

    /** api: method[destroy]
     */
    destroy: function() {
        this.loginButton = null;
        GeoExplorer.Composer.superclass.destroy.apply(this, arguments);
    },
    
    /**
     * api: method[createTools]
     * Create the toolbar configuration for the main view.
     */
    createTools: function() {
        var tools = GeoExplorer.Composer.superclass.createTools.apply(this, arguments);

        if(!this.fScreen){
            var fullScreen = new Ext.Button({
                text: this.fullScreenText,
                id: "full-screen-button",
                iconCls: "icon-fullscreen",
                enableToggle: true,
                handler: function(button, evt){
                    if(button.pressed){
                        Ext.getCmp('tree').findParentByType('panel').collapse();
                    } else {
                        Ext.getCmp('tree').findParentByType('panel').expand();
                    }
                }
            });            
                            
            tools.unshift(fullScreen);
        }else{
			var layerChooser = new Ext.Button({
				tooltip: 'Layer Switcher',
				iconCls: 'icon-layer-switcher',
				menu: new gxp.menu.LayerMenu({
					layers: this.mapPanel.layers
				})
			});

			tools.unshift(layerChooser);
		}
        
        if(this.cswconfig){
            var extent = this.mapPanel.map.getExtent();
            
            if(extent)
                this.cswconfig.initialBBox = {
                    minx: extent.left,
                    miny: extent.bottom,
                    maxx: extent.right,
                    maxy: extent.top  
                };
            
            tools.push(new Ext.Button({
                tooltip: "Metadata Explorer",
                handler: function() {
                      if(Ext.getCmp('csw-win'))
                          return;

                      var viewer = this;
                      
                      // Loads bundle for i18n messages
                      i18n = new Ext.i18n.Bundle({
                        bundle : "CSWViewer",
                        path : "externals/csw/CSWViewer/i18n",
                        lang : code == 'en' ? "en-EN" : (code == 'it' ? "it-IT" : "fr-FR")
                      });
                      
                      i18n.onReady( function() {
                          //
                          // Declares a panel for querying CSW catalogs
                          //
                          var cswPanel = new CSWPanel({
                              config: viewer.cswconfig,
                              listeners: {
                                  zoomToExtent: function(layerInfo){
                                      var map = viewer.mapPanel.map;
                                      var bbox = layerInfo.bbox;
                                      
                                      //
                                      // TODO: parse the urn crs code (like "urn:ogc:def:crs:::WGS 1984") inside the CSW BBOX tag. 
                                      //
                                      bbox.transform(
                                          new OpenLayers.Projection("EPSG:4326"),
                                          new OpenLayers.Projection(map.projection)
                                      );
                                      
                                      map.zoomToExtent(bbox);
                                  },
                                  viewMap: function(el){       
                                      var mask = new Ext.LoadMask(Ext.getBody(), {msg:this.cswMsg});
                                      mask.show();
                                                                  
                                      var mapInfo = el.layers;  
                                      var uuid = el.uuid;
                                      var gnURL = el.gnURL;                          
                                      var title = el.title;
                                      
                                      for(var i=0; i<mapInfo.length; i++){
                                          var wms = mapInfo[i].wms;    
                                          
                                          var source;
                                          for (var id in app.layerSources) {
                                              var src = app.layerSources[id];    
                                              var url  = src.initialConfig.url; 
                                              //
                                              // Checking if source url aldready exists
                                              //
                                              if(url && url.indexOf(wms) != -1)
                                                  source = src;
                                          }                                  
                                          
                                          var layer = mapInfo[i].layer;
                                          
                                          //
                                          // Adding a new record to existing store
                                          //
                                          var addLayer = function(s){
                                              var record = s.createLayerRecord({
                                                  name: layer,
                                                  title: title,
                                                  source : s.id, // TODO: to check this
                                                  gnURL: gnURL,
                                                  uuid: uuid
                                              });    
                                                          
                                              var layerStore = app.mapPanel.layers;  
                                                            
                                              if (record) {
                                                  layerStore.add([record]);
                                                  modified = true;
                                              }  
                                          }
                                          
                                          //
                                          // Adding the sources only if exists
                                          //
                                          if(!source){
                                              var sourceOpt = {
                                                  config: {
                                                      url: wms
                                                  }
                                              };
                                              
                                              source = viewer.addLayerSource(sourceOpt);
                                              
                                              //
                                              // Waiting GetCapabilities response from the server.
                                              //
                                              source.on('ready', function(){
                                                  addLayer(source);  
                                                  mask.hide();
                                              });
                                              
                                              //
                                              // To manage failure in GetCapabilities request (invalid request url in 
                                              // GeoNetwork configuration or server error).
                                              //
                                              source.on('failure', function(src, msg){
                                                  //
                                                  // Removing layer source from sources ?
                                                  //
                                                  /*for (var id in app.layerSources) {
                                                      if(id.indexOf(source.id) != -1)
                                                          app.layerSources[id] = null;    
                                                  }*/  
                                                  
                                                  mask.hide();
                                                  
                                                  Ext.Msg.show({
                                                      title: 'GetCapabilities',
                                                      msg: msg + viewer.cswFailureAddLayer,
                                                      width: 300,
                                                      icon: Ext.MessageBox.ERROR
                                                  });  
                                              });
                                          }else{
                                              addLayer(source); 
                                              mask.hide();
                                          }
                                      }
                                  }
                              }
                          });
                          
                          //
                          // Overridding addListenerMD method to show metadata inside a new Tab.
                          //
                          cswPanel.cswGrid.plugins.tpl.addListenerMD = function(id, values){
                              Ext.get(id).on('click', function(e){
                                  //
                                  // open GN inteface related to this resource
                                  //
                                  if(values.identifier){
                                      viewer.viewMetadata(
                                          values.absolutePath.substring(0,values.absolutePath.length-3), 
                                          values.identifier, 
                                          values.title
                                      );
                                  }else{
                                      //
                                      // Shows all DC values. TODO create dc visual
                                      //
                                      var text="<ul>";
                                      var dc = values.dc;
                                      
                                      //eg. URI
                                      for (var el in dc){
                                          if (dc[el] instanceof Array){
                                              //cicle URI array
                                              for(var index=0;index<dc[el].length;index++){
                                                  //cicle attributes of dc
                                                  if(dc[el][index].value){
                                                    text += "<li><strong>"+el+":</strong> ";
                                                    
                                                    for(name in dc[el][index]){
                                                      text += "<strong>"+name+"</strong>="+dc[el][index][name]+" ";
                                                      
                                                    }
                                                    
                                                    text += "</li>";
                                                  }else if(el=="abstract") {
                                                    text += "<li><strong>abstract:</strong> "+dc[el][index]+"</li> ";
                                                  }else{
                                                    //DO NOTHING
                                                  }
                                              }
                                          }
                                      }
                                      
                                      dc+="</ul>";
                                      
                                      var dcPan = new Ext.Panel({
                                        html:text,
                                        preventBodyReset:true,
                                        autoScroll:true,
                                        autoHeight: false,
                                        width: 600,
                                        height: 400
                                      
                                      });		
                                              
                                      var dcWin = new Ext.Window({
                                          title: "MetaData",
                                          closable: true,
                                          width:614,
                                          resizable: false,
                                          draggable: true,
                                          items: [
                                            dcPan
                                          ]
                                      });
                                      
                                      dcWin.show();
                                  }
                              });
                          };

                          var viewWin = new Ext.Window({
                              width : 800,
                              height: 565,
                              id: 'csw-win',
                              renderTo: viewer.mapPanel.body,
                              modal: true,
                              autoScroll: true,
                              constrainHeader: true,
                              closable: true,
                              resizable: false,
                              draggable: true,
                              items: [ 
                                  cswPanel 
                              ],
                              listeners: {
                                  close: function(){
                                      cswPanel.destroy();
                                  }
                              }
                          });

                          viewWin.show();
                      });
                },
                scope: this,
                iconCls: "csw-viewer"
            }));
            
            tools.push('-');
        }

        tools.push(new Ext.Button({
            tooltip: this.saveMapText,
            handler: function() {
                this.save(this.showUrl);
            },
            scope: this,
            iconCls: "icon-save"
        }));        

        tools.push(new Ext.Button({
            tooltip: this.loadMapText,
            handler: function() {    
                var composer = this; 
                var win;  
                  
                var fp = new Ext.FormPanel({
                    fileUpload: true,
                    autoWidth: true,
                    autoHeight: true,
                    frame: true,
                    bodyStyle: 'padding: 10px 10px 0 10px;',
                    labelWidth: 50,
                    defaults: {
                        anchor: '95%',
                        allowBlank: false,
                        msgTarget: 'side'
                    },
                    items: [{
                        xtype: 'fileuploadfield',
                        id: 'form-file',
                        emptyText: this.uploadEmptyText,
                        fieldLabel: 'File',
                        name: 'file-path',
                        buttonText: '',
                        buttonCfg: {
                            iconCls: 'upload-icon'
                        }
                    }],
                    buttons: [{
                        text: this.uploadButtonText,
                        handler: function(){
                            if(fp.getForm().isValid()){
                              fp.getForm().submit({
                                  //url: app.xmlJsonTranslateService + 'HTTPWebGISFileUpload',
                                  url: proxy + app.xmlJsonTranslateService + 'HTTPWebGISFileUpload',
                                  waitMsg: this.uploadWaitMsg,
                                  success: function(fp, o){
                                      win.hide();
                                      var json_str = unescape(o.result.result);
                                      json_str = json_str.replace(/\+/g, ' ');
                                      
                                      composer.loadUserConfig(json_str);  
                                      
                                      //app.modified = true;
                                      modified = true;                                    
                                  },                                    
                                  failure: function(fp, o){
                                      win.hide();
                                      win.destroy();
                                      
                                      Ext.Msg.show({
                                         title: this.uploadErrorTitle,
                                         msg: o.result.errorMessage,
                                         buttons: Ext.Msg.OK,
                                         icon: Ext.MessageBox.ERROR
                                      });
                                  }
                              });
                            }
                        }
                    }]
                });
                
                win = new Ext.Window({
                    title: this.uploadWinTitle,
                    id: 'upload-win',
                    layout: 'form',
                    labelAlign: 'top',
                    modal: true,
                    bodyStyle: "padding: 5px",
                    width: 380,
                    items: [fp]
                });
                
                win.show();
            },
            scope: this,
            iconCls: "icon-load"
        }));

        tools.push(new Ext.Button({
            tooltip: this.exportMapText,
            //disabled: true,
            handler: function() {
                //this.saveAndExport(this.showEmbedWindow);
                this.showEmbedWindow();
            },
            scope: this,
            iconCls: 'icon-export'
        }));

        tools.push('-');
        
        return tools;

    },
    
    /** private: method[viewMetadata]
     */
    viewMetadata: function(gnURL, uuid, title){
        var tabPanel = Ext.getCmp(app.renderToTab);
        
        var tabs = tabPanel.find('title', title);
        if(tabs && tabs.length > 0){
            tabPanel.setActiveTab(tabs[0]); 
        }else{
            var metaURL = gnURL + "metadata.show?uuid=" + uuid; 
            
            var meta = new Ext.Panel({
                title: title,
                layout:'fit', 
                tabTip: title,
                closable: true,
                items: [ 
                    new Ext.ux.IFrameComponent({ 
                        url: metaURL 
                    }) 
                ]
            });
            
            tabPanel.add(meta);
        }
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
	    if (app.mapId == -1 || (app.modified == true && authorization == true)){
            Ext.MessageBox.show({
                title: this.alertEmbedTitle,
                msg: this.alertEmbedText,
                buttons: Ext.MessageBox.OK,
                animEl: 'mb4',
                icon: Ext.MessageBox.WARNING,
                scope: this
            });
        }else{
           var toolsArea = new Ext.tree.TreePanel({title: this.toolsTitle, 
               autoScroll: true,
               root: {
                   nodeType: 'async', 
                   expanded: true, 
                   children: this.viewerTools
               }, 
               rootVisible: false,
               id: 'geobuilder-0'
           });

           var previousNext = function(incr){
               var l = Ext.getCmp('geobuilder-wizard-panel').getLayout();
               var i = l.activeItem.id.split('geobuilder-')[1];
               var next = parseInt(i, 10) + incr;
               l.setActiveItem(next);
               Ext.getCmp('wizard-prev').setDisabled(next==0);
               Ext.getCmp('wizard-next').setDisabled(next==1);
               if (incr == 1) {
                   this.saveAndExport();
               }
           };
           
            var curLang = OpenLayers.Util.getParameters()["locale"] || 'en';            
            
           var embedMap = new gxp.EmbedMapDialog({
               id: 'geobuilder-1',
               url: "viewer" + "?locale=" + curLang + "&bbox=" + app.mapPanel.map.getExtent() + "&mapId=" + app.mapId
           });

           var wizard = {
               id: 'geobuilder-wizard-panel',
               border: false,
               layout: 'card',
               activeItem: 0,
               defaults: {border: false, hideMode: 'offsets'},
               /*bbar: [{
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

               items: [embedMap]
               //items: [toolsArea, embedMap]
           };

           new Ext.Window({
                layout: 'fit',
                width: 500, height: 300,
                title: this.exportMapText,
                items: [wizard]
           }).show();
        }
    }
});
