/*
 * url = "/apps/filebrowser"
 *
 * cmd = get (&path)
 * cmd = move (&oldname, &newname)
 * cmd = rename (&oldname, &newname)
 * cmd = delete (&path)
 * cmd = view (&path)
 *
 * baseParams: root
 *
 */


Ext.ux.FileBrowser = Ext.extend(Ext.Panel, {

    layout:"border"
    ,readOnly:false
    ,data:[]
    ,url:""
    ,path:""
    ,historyCurrentId:false
    ,historyPreviousId:[]
    ,historyNextId:[]
    ,tmpRecords:[]
    ,enableBrowser:false
    ,statusBar:false
    ,fileTreePanel:false
    ,enableUpload:false
    ,uploadUrl:""
    ,swfUrl:"../js/Ext.ux.upload/examples/swf/swfupload.swf"
    ,browserDDGroup:null

    /**
     * @cfg {Boolean} Chech node attributes to enable or disable operations.
     */
    ,checkNodeParameters:false

    /**
     * @cfg {Number} Permission for the root folder in in linux mode (4 == 100 == r--; 7 == 111 == rwx)
     */
    ,rootPermission: 4

    /**
     * @cfg {Number} Permission for other folders in in linux mode (4 == 100 == r--; 7 == 111 == rwx)
     */
    ,defaultPermission: 7,

    /** i18n **/
    uploadText: "Upload",
    previousText: "Previous",
    nextText: "Next",
    parentFolderText: "Parent folder",
    refreshText: "Refresh",
    toolsText: "Tools",
    /** EoF i18n **/

    /**
     * api:[addRefreshButton]
     * @cfg {Boolean} Optional add refresh button for this operation. Default is true
     */
    addRefreshButton: true

    /**
     * api:[ovrNewdirText]
     * @cfg {String} Optional new Folder text for this operation
     */

    ,initComponent:function() {

        var treePanelConfig = {
            autoScroll:true
            ,readOnly:this.readOnly
            ,region:"center"
            //,border:false
            ,bodyStyle:"border-width:0 1px 0 0"
            ,method:'post'
            ,rootPath:this.path
            ,url:this.url
            ,ddGroup:this.browserDDGroup
            ,rootText:this.rootText
            ,checkNodeParameters:this.checkNodeParameters
            ,rootPermission: this.rootPermission
            ,defaultPermission: this.defaultPermission
            //,cmdParams:{root:this.root}
            ,listeners:{
                click:{scope:this, fn:this.treePanelClick}
                ,dblclick:{scope:this, fn:this.treePanelDbLClick}
                ,startdrag:{scope:this, fn:this.startDragNode || false}
                ,load:{scope:this, fn:this.treePanelLoad}
                ,"delete":{scope:this, fn:this.reload}
                ,download:{scope:this, fn:this.downloadItem}
                ,rename:{scope:this, fn:this.renameItem}
                ,nodemove:{scope:this, fn:this.renameItem}
                ,newdir:{scope:this, fn:this.newdir}
                ,"close-service":{scope:this, fn:this.closeService}
                ,render:{scope:this, fn:function(){
                    //this.fileTreePanel.loader.baseParams.root = this.root;
                    this.fileTreePanel.setReadOnly(this.readOnly);
                    //this.enableUploadSystem();
                }}
            }
            ,onDblClick:function(node, e) {
                return false;
            }
        };

        if(this.ovrNewdirText){
            treePanelConfig.newdirText = this.ovrNewdirText;
        }
        
        /*
        ** FileTreePanel
        */
        this.fileTreePanel = new Ext.ux.FileTreePanel(treePanelConfig);
/*
        this.fileTreePanel.loader.on("beforeload", function() {
            this.fileTreePanel.loader.baseParams.root = this.root;
            return true;
        },this);
*/
        /**************************************************
         * ************************************************
         * STATUS BAR SETTINGS
         * ************************************************
         **************************************************/

        if (this.statusBar) {
            this.StatusBarSize = new Ext.Toolbar.TextItem('Size:');
            this.StatusSpacer = new Ext.Toolbar.Spacer();
            this.StatusBarDetails = new Ext.Toolbar.TextItem('Details: ');

            if (typeof this.statusBar == "object") {
                this.bbar = this.statusBar;
                this.statusBar.insertCmpStatus(this.StatusBarSize, this, true);
                this.statusBar.insertCmpStatus(this.StatusSpacer, this);
                this.statusBar.insertCmpStatus(this.StatusBarDetails, this, true);
            } else {
                this.bbar = new Ext.ux.StatusBar({
                    items:[
                        this.StatusBarDetails
                        ," "
                        ,this.StatusBarSize
                    ]
                });
            }

        }

        /**************************************************
         * ************************************************
         * UPLOAD SETTINGS
         * ************************************************
         **************************************************/

        if (!this.readOnly && this.enableUpload) {

            this.queuePanel = new Ext.Panel({
                region:"south"
                ,layout:"fit"
                ,border:false
                ,height:100
                ,collapsed:true
                ,collapseMode:"mini"
                ,split:true
            });

            this.fileTreePanel.bodyStyle = "border-width:0 1px 1px 0";

            var panelConfig = [{
                layout:"border"
                ,border:false
                ,items:[
                  this.fileTreePanel
                  ,this.queuePanel
                ]
            }];

            // Plupload params --> TODO: put as config
            this.pluploadWindowWidth = 400;
            this.pluploadWindowHeigth = 300;
            this.pluploadWindowResizable = false;
            this.pluploadMultipart = true;
            this.isPluploadManager = true;

            if(this.isPluploadManager){
                this.fileTreePanel.on({
                    scope:this,
                    render:function() {
                        if (this.enableUpload) {
                            var item = new Ext.menu.Item({
                                text:this.uploadText,
                                iconCls:'icon-upload',
                                scope: this,
                                handler: function(){

                                    var pluploadPanel = new Ext.ux.PluploadPanel({
                                        autoScroll:true,
                                        layout:'fit',
                                        url: this.uploadUrl,
                                        multipart: this.pluploadMultipart,
                                        listeners:{
                                            beforestart:function() {  
                                                this.queuePanel.expand(false);
                                                var node = this.fileTreePanel.getNodeById(this.historyCurrentId);
                                                //TODO: this.uploadMgr.setPath(  this.getNodePath(node) );
                                                var multipart_params =  pluploadPanel.multipart_params || {};
                                                Ext.apply(multipart_params, {
                                                    folder: this.getNodePath(node)
                                                })
                                                pluploadPanel.multipart_params = multipart_params;
                                            },
                                            fileUploaded:function(file) {
                                                var node = this.fileTreePanel.getNodeById(this.historyCurrentId);
                                                if (node.isLeaf()) node = node.parentNode;
                                                node.reload(this.load.createDelegate(this));
                                            },
                                            uploadcomplete:function() {
                                                this.queuePanel.collapse.defer(2000, this.queuePanel);
                                            },
                                            scope: this
                                        }
                                    });
                                    var win = new Ext.Window({
                                        title: this.uploadText,
                                        width: this.pluploadWindowWidth,
                                        height: this.pluploadWindowHeigth,
                                        layout:'fit',
                                        resizable: this.pluploadWindowResizable,
                                        items: [pluploadPanel]
                                    });
                                    win.show();
                                }
                            });
                            var menu = this.fileTreePanel.getContextMenu();
                            menu.add("-");
                            menu.add(item);
                        }
                    }
                });
            }else{
                this.uploadMgr = new Ext.ux.upload.Uploader({
                    url:this.uploadUrl
                    ,path:this.path
                    ,swfUrl:this.swfUrl
                    ,maxFiles:10
                    ,maxFileSize:100000
                    ,allowedFileTypes:"*.*"
                });
                this.uploadMgr.setLogFrame(this.queuePanel);

                this.fileTreePanel.on({
                    scope:this
                    ,render:function() {
                        if (this.enableUpload) {
                            var item = new Ext.menu.Item({
                                text:"Upload"
                                ,plugins:[this.uploadMgr]
                            });
                            var menu = this.fileTreePanel.getContextMenu();
                            menu.add("-");
                            menu.add(item);
                        }
                    }
                });

                this.uploadMgr.on({
                    scope:this
                    ,beforeupload:function() {  
                        
                        this.queuePanel.expand(false);
                        var node = this.fileTreePanel.getNodeById(this.historyCurrentId);
                       // if (node.isLeaf()) node = node.parentNode;
                     //   console.log('beforeupload',  this.getNodePath(node));
                        //var path = (node.isRoot) ? "" : this.getNodePath(node);
                        this.uploadMgr.setPath(  this.getNodePath(node) );
                    }
                    ,uploadcomplete:function(uploadMgr, conn, file) {
                        var node = this.fileTreePanel.getNodeById(this.historyCurrentId);
                        if (node.isLeaf()) node = node.parentNode;
                        node.reload(this.load.createDelegate(this));
                    }
                    ,queuecomplete:function() {
                        this.queuePanel.collapse.defer(2000, this.queuePanel);
                    }
                });

            }

        } else var panelConfig = this.fileTreePanel;

        /**************************************************
         * ************************************************
         * FILE BROWSER SETTINGS
         * ************************************************
         **************************************************/

        if (this.enableBrowser) {

            /*
            ** data store used by all browser views
            */

            this.dataViewStore = new Ext.data.JsonStore({
                id:"id"
                ,fields:["id", "text", "leaf", "size", "iconCls", "loaded", "expanded", "mtime", "permission"]
            });

            /*
            ** dataViewBrowser
            */
            this.fileBrowserIcones = new Ext.ux.dataViewBrowser({
                store:this.dataViewStore
                ,autoScroll:true
                ,readOnly:this.readOnly
                ,browserDDGroup:this.browserDDGroup
                ,getNodePath:this.getNodePath.createDelegate(this)
                ,cls:"browser-view"
                //,hidden:true
            });

            this.fileBrowserIcones.on({
                scope:this
                ,render:function() {
                    this.relayEvents(this.fileBrowserIcones, [
                        "elementSelected", "elementExecuted"
                        ,"elementContextMenu", "fileRename"
                        ,"filedrop", "viewContextMenu"
                    ]);
                }
            });

            /*
            ** GridBrowser
            */
            this.fileBrowserList = new Ext.ux.GridBrowser({
                store:this.dataViewStore
                ,readOnly:this.readOnly
                ,ddGroup:this.browserDDGroup
                ,getNodePath:this.getNodePath.createDelegate(this)
            });

            this.fileBrowserList.on({
                render:{scope:this, fn:function() {
                    this.relayEvents(this.fileBrowserList, [
                        "filedrop", "elementSelected"
                        ,"elementExecuted", "elementContextMenu"
                    ]);
                }}
            });

            this.toolsMenuItems = [
                {text:"Icons", view:"icones", iconCls:"icon-view", handler:this.switchView, scope:this}
                ,{text:"List", view:"list", iconCls:"icon-list", handler:this.switchView, scope:this}
            ];

            var toolBarItems = [{
                    tooltip:this.previousText
                    ,iconCls:"icon-previous"
                    ,disabled:true
                    ,handler:this.historyPrevious
                    ,scope:this,
                    id: this.id + "_previous"
                }, {
                    tooltip:this.nextText
                    ,iconCls:"icon-next"
                    ,disabled:true
                    ,handler:this.historyNext
                    ,scope:this,
                    id: this.id + "_next"
                }, "-", {
                    tooltip:this.parentFolderText
                    ,iconCls:"icon-up"
                    ,handler:this.folderUp
                    ,scope:this
                }];

            if(this.addRefreshButton){
                toolBarItems.push("-");
                toolBarItems.push({
                    tooltip:this.refreshText,
                    iconCls:"icon-refresh",
                    handler: this.refreshTree,
                    scope: this
                });
            }

            toolBarItems.push("->");
            toolBarItems.push({
                text:this.toolsText,
                iconCls:"icon-wrench",
                menu:this.toolsMenuItems
            });

            this.tbar = new Ext.Toolbar({
                items: toolBarItems
            });

            this.browser = new Ext.Panel({
                region:"center"
                ,layout:"card"
                ,border:false
                ,activeItem:0
                ,layoutOnCardChange:true
                ,plugins:this.uploadMgr ? [this.uploadMgr] : []
                ,items:[{
                    layout:"fit"
                    //,border:false
                    ,bodyStyle:"border-width:0 0 0 1px"
                    ,items:this.fileBrowserIcones
                }, {
                    layout:"fit"
                    //,border:false
                    ,bodyStyle:"border-width:0 0 0 1px"
                    ,items:this.fileBrowserList
                }]
                ,listeners:{
                    resize:{scope:this, fn:function() {this.previewItem(this.previewNode, true);}}
                }
            });

            Ext.apply(this, {items:[{
                region:"west"
                ,layout:"fit"
                ,border:false
                ,width:200
                ,split:true
                ,collapseMode:"mini"
                ,items:panelConfig
            }, this.browser]});

        } else {

            Ext.apply(this, {items:[{
                region:"center"
                ,layout:"fit"
                ,border:false
                ,items:panelConfig
            }]});
        }

        Ext.ux.FileBrowser.superclass.initComponent.apply(this, arguments);
    }

    /**************************************************
     * ************************************************
     * FILE BROWSER LISTENERS
     * ************************************************
     **************************************************/

    ,listeners:{
      afterrender:function() {
        if (this.statusBar && typeof this.statusBar != "object") {
//          Ext.fly(this.StatusBarSize.getEl()).addClass('x-status-text-panel').createChild({cls:'spacer'});
//          Ext.fly(this.StatusBarDetails.getEl()).addClass('x-status-text-panel').createChild({cls:'spacer'});
        }
        this.customizeTree();
      }
      ,dialogComplete:function(){this.onDialogComplete();}
      ,queueComplete:function(){this.onQueueComplete();}
      ,fileRename:function(record, oldValue, newValue) {
        var node =  this.fileTreePanel.getNodeById(record.data.id);
        node.text = newValue;
        node.setText(newValue);
        this.fileTreePanel.onEditComplete({editNode: node}, newValue, oldValue);
      }
      ,elementSelected:function(id) {
        if (this.browser) this.browser.getEl().unmask();
	    var treeNode = this.fileTreePanel.getNodeById(id);
	    this.setDetails(treeNode);
      }
      ,elementExecuted:function(id) {
        var treeNode = this.fileTreePanel.getNodeById(id);
        if (!treeNode.isLeaf()) {
          treeNode.expand();
          this.fileTreePanel.fireEvent("click", treeNode, {history:false});
        } else this.previewItem(treeNode);
      }
      ,elementContextMenu:function(id, e) {
        var treeNode = this.fileTreePanel.getNodeById(id);
        var text = treeNode.attributes.text;
        var menu = this.fileTreePanel.getContextMenu();

        // permission delegated on fileTreePanel.applyPermissionOnMenu
        var p = this.fileTreePanel.applyPermissionOnMenu(treeNode, menu);

	    menu.node = treeNode;
        menu.showAt(e.xy);
      }
      ,viewContextMenu:function(e) {
        var treeNode = this.fileTreePanel.getNodeById(this.historyCurrentId);
        var text = treeNode.attributes.text;
        var menu = this.fileTreePanel.getContextMenu();

        // permission delegated on fileTreePanel.applyPermissionOnMenu
        var p = this.fileTreePanel.applyPermissionOnMenu(treeNode, menu);

	    menu.node = treeNode;
        menu.showAt(e.xy);
      }
      ,filedrop:function(cmp, targetRecord, dragRecord) {
            if (targetRecord)
                var parentNode = this.fileTreePanel.getNodeById(targetRecord.get("id"));
            else
                var parentNode = this.fileTreePanel.getNodeById(this.historyCurrentId);
            var childNode = this.fileTreePanel.getNodeById(dragRecord.get("id"));
            Ext.Ajax.request({
               url:this.url
               ,scope:this
               ,params:{
                   action:"file_rename"
                   ,oldName:this.getNodePath(childNode)
                   ,name:this.getNodePath(parentNode) + "/" + dragRecord.get("text")
               }
               ,callback:function() {
                    if (parentNode.isLeaf()) parentNode = parentNode.parentNode;
                    if (parentNode.isLoaded())
                        parentNode.appendChild(childNode);
                    else childNode.remove();
                    this.load(this.fileTreePanel.getNodeById(this.historyCurrentId));
               }
            });
      }
    }

    /**************************************************
     * ************************************************
     * END OF FILE BROWSER LISTENERS
     * ************************************************
     **************************************************/

    ,switchView:function(button) {
        if (button.view == "list")
            this.browser.getLayout().setActiveItem(1);
        else if (button.view == "icones")
            this.browser.getLayout().setActiveItem(0);
    }

    ,folderUp:function() {
        var treeNode = this.fileTreePanel.getNodeById(this.historyCurrentId);
        if (!treeNode.isRoot) {
            treeNode.parentNode.select();
            this.historyPreviousId.push(this.historyCurrentId);
            this.historyCurrentId = treeNode.parentNode.id;
            this.fileTreePanel.fireEvent("click", treeNode.parentNode, {history:true});
        }
    }

    ,iconUpload:function() {
        var treeNode = this.fileTreePanel.getNodeById(this.historyCurrentId);
        if (!treeNode.isRoot) {
            treeNode.parentNode.select();
            this.historyPreviousId.push(this.historyCurrentId);
            this.historyCurrentId = treeNode.parentNode.id;
            this.fileTreePanel.fireEvent("click", treeNode.parentNode, {history:true});
        }
    }


    ,historyPrevious:function() {

        var treeNode = this.fileTreePanel.getNodeById(this.historyPreviousId[this.historyPreviousId.length - 1]);
        if (!this.historyNextId.length){
            Ext.getCmp(this.id + "_next") && Ext.getCmp(this.id + "_next").enable && Ext.getCmp(this.id + "_next").enable();
        }
        this.historyNextId.push(this.historyCurrentId);
        this.historyPreviousId.pop();
        if (!this.historyPreviousId.length){
            Ext.getCmp(this.id + "_previous") && Ext.getCmp(this.id + "_previous").disable && Ext.getCmp(this.id + "_previous").disable();
        }
        if(treeNode){
            treeNode.select();
            this.fileTreePanel.fireEvent("click", treeNode, {history:true});
        }
    }

    ,historyNext:function() {
        var treeNode = this.fileTreePanel.getNodeById(this.historyNextId[this.historyNextId.length - 1]);
        if (!this.historyPreviousId.length){
            Ext.getCmp(this.id + "_previous") && Ext.getCmp(this.id + "_previous").disable && Ext.getCmp(this.id + "_previous").enable();
        }
        this.historyPreviousId.push(this.historyCurrentId);
        this.historyNextId.pop();
        if (!this.historyNextId.length){
            Ext.getCmp(this.id + "_next") && Ext.getCmp(this.id + "_next").enable && Ext.getCmp(this.id + "_next").disable();
        }
        if(treeNode){
            treeNode.select();
            this.fileTreePanel.fireEvent("click", treeNode, {history:true});
        }
    }

    ,setdataViewElement:function(node) {
        this.tmpRecords.push(new this.dataViewStore.recordType({
            id:node.attributes.id
            ,text:node.attributes.text
            ,leaf:node.attributes.leaf
            ,size:node.attributes.size
            ,iconCls: node.attributes.iconCls
        }));
    }

    ,clearTmpRecords:function() {
        while (this.tmpRecords.length) {
            this.tmpRecords.shift();
        }
    }

    ,load:function(node) {
      if (this.enableBrowser) {

        this.dataViewStore.removeAll();
        this.clearTmpRecords();
        node && node.eachChild(this.setdataViewElement, this);
        this.dataViewStore.add(this.tmpRecords);
      }
    }

    // on new dir callback, we reload the parent node
    ,newdir: function(tree, node){
        if(node && node.parentNode && node.parentNode.reload)
            node.parentNode.reload();
    }

    ,reload:function() {
        var parentNode = this.fileTreePanel.getNodeById(this.historyCurrentId);
        this.load(parentNode);
        /*
        this.dataViewStore.removeAll();
        this.dataViewStore.add(this.tmpRecords);
        */
    }

    ,setDetails:function(node) {
        if (this.statusBar) {
            var size = (node.attributes.size == undefined) ? "unknown" : node.attributes.size / 1000 + " Ko";
            var text = (this.enableBrowser) ? node.attributes.text : Ext.util.Format.ellipsis(node.attributes.text, 20);
            Ext.fly(this.StatusBarDetails.getEl()).update("Details: "+text);
            Ext.fly(this.StatusBarSize.getEl()).update("Size: "+size);
        }
    }

    ,renameItem:function(treepanel, node, newname, oldname) {
        if (this.dataViewStore) {

            var currentNode = this.fileTreePanel.getNodeById(this.historyCurrentId);
            this.load(currentNode);
/*
            var index = this.dataViewStore.find("id", node.id);
            var ntab = newname.split("/");
            var otab = oldname.split("/");
            if (index > -1) {
                var record = this.dataViewStore.getAt(index);
                if (ntab.length === otab.length) {
                    var text = ntab[ntab.length-1];
                    record.set("text", text);
                } else {
                    this.dataViewStore.remove(record);
                }

            } else {
                var currentNode = this.fileTreePanel.getNodeById(this.historyCurrentId),
                currentPath = this.getNodePath(currentNode),
                newPath = this.getNodePath(node);
            }
*/
        }
    }

    ,downloadItem:function(node) {
      var filepath = this.url
        + "?action=file_download"
        + "&file="+this.path+this.getNodePath(node)
      window.open(filepath);
    }

    ,previewItem:function(node, resize) {
        if (!node || !this.browser) {return false;}
        this.previewNode = node;
        this.browser.getEl().unmask();

        if (new RegExp(/\w+\.*(gif|png|jpg)$/).test(node.attributes.text.toLowerCase())) {
            var path = this.getNodePath(node);
            if (path.substring(0,1)=="/") path=path.substring(1);
            var filepath = this.url
                       + "?action=file_download"
                       + "&file="+this.path+"/"+path

            path = filepath;

            var box = this.browser.getBox();

            var html = '<div id="image-preview-ct" style="border:0px">';
            html += '<div id="image-preview-tbar" style="border:0px">';
            html += '</div>';
            html += '<img src="'+filepath+'" style="';
            html += 'width:'+(box.width - 30)+'px;';
            html += 'height:'+(box.height - 30)+'px;"';
            html += ' /></div>';

            this.browser.getEl().mask(html, "image-preview");

            var tb = new Ext.Toolbar({
                renderTo:"image-preview-tbar"
                ,width:(box.width - 28)
                ,hidden:true
                ,hideMode:"visibility"
                ,items:["->", {
                    iconCls:"icon-close"
                    ,handler:function() {
                        this.browser.getEl().unmask();
                        this.previewNode = false;
                    }
                    ,scope:this
                }]
                ,listeners:{
                    render:function(tb) {
                        var box = tb.getBox();
                        tb.getEl().setStyle({top:"2px", left:"2px", position:"absolute"});
                    }
                }
            });

            Ext.get("image-preview-ct").on({
                mouseover:{fn:function() {
                    tb.show();
                }}
                ,mouseout:{fn:function() {
                    tb.hide();
                }}
            });

	    } else if (!resize && new RegExp(/\w+\.*(eml)$/).test(node.attributes.text.toLowerCase())) {

	        var emailPreview = new Ext.ux.IFrameComponent({
                url:"/apps/filebrowser/preview?root="+this.root+"&path="+this.getNodePath(node)
            });

	        new Ext.Window({
                title:"Apercu email"
                ,layout:"fit"
                ,iconCls:"icon-email"
                ,width:800
                ,height:500
                ,items:emailPreview
	        }).show();

        } else if (!resize){
            var filepath = this.url
                + "?action=file_download"
                + "&file="+this.path+this.getNodePath(node)
	        window.open(filepath);
        }
    }

    ,treePanelClick:function(node, event) {
      this.previewNode = false;
      if (this.enableBrowser && !node.isLeaf()) {
        if (!event.history) {
	  if (!this.historyPreviousId.length) this.getTopToolbar().items.items[0].enable();
          this.historyPreviousId.push(this.historyCurrentId);
        }
	this.historyCurrentId = node.id;
	if (!node.isExpanded()) {
	  node.expand(false, true, this.load.createDelegate(this));
	} else this.load(node);
      }

      this.fireEvent("elementSelected", node.id);
    }

    ,treePanelDbLClick:function(node, event) {
      this.fireEvent("elementExecuted", node.id);
    }

    ,startDragNode:function(treePanel, node) {
	this.fireEvent("startDradElement");
	node.attributes.path = this.getNodePath(node);
    }

    ,treePanelLoad:function(node) {
        if (this.enableBrowser) {
            if (node.isRoot) {
              this.historyCurrentId = node.id;
              node.expand(false, true, this.load.createDelegate(this));
              node.select();
              this.fireEvent("elementSelected", node.id);
            }
        }
    }

    ,getNodePath:function(node) {
        // var path = "";
        // var tab = node.getPath().split("/");
        // for (var i = 1; i < tab.length; i++) {
        //     if(tab[i]){
        //         var tmpNode = this.fileTreePanel.getNodeById(tab[i]);
        //         if (tmpNode){
        //             if (this.fileTreePanel.root.id == tmpNode.id) continue;
        //             path += "/" + tmpNode.attributes.text;
        //         }else{
        //             path += "/" +tab[i];
        //         }
        //     }
        // }
        return node.getPath("text");
    },

    /** api: method[decorateNode]
     *  Decorate each node.
     */
    decorateNode: function(node){
        // only decorate on second level(Services) with child AOI.zip
        if(node.parentNode 
            && node.parentNode.parentNode
            && node.childNodes){
            for (var i = 0; i < node.childNodes.length; i++){
                if(node.childNodes[i].text == "AOI.zip"){
                    var el = node.getUI().getEl();
                    el.style.border = "red 1px solid";
                    el.title = "Service '" + node.text + "' have a confirmed AOI";
                    break;
                }
            }
        }

    },

    /** api: method[customizeTree]
     *  Costumize the tree expanding and customizing nodes as we need
     */
    customizeTree: function(){

        var me = this;
        var currentLoadingNodes = 1;

        // reload status node by node
        var reloadFunction = function(node){
            // remove listener
            node.removeListener("load", this);
            // expanded nodes until the service level;
            if(node.childNodes 
                && (!node.parentNode
                    || !node.parentNode.parentNode)){
                for (var i = 0; i < node.childNodes.length; i++){
                    if(!node.childNodes[i].isLeaf()){
                        node.childNodes[i].on("load", reloadFunction, node.childNodes[i]);
                        node.childNodes[i].expand();   
                    }
                }
            }

            // decorate the node
            me.decorateNode(node);
        }

        // reload root node
        me.fileTreePanel.root.on("load", reloadFunction, me.fileTreePanel.root);

    },

    /** api: method[refreshTree]
     *  Refresh tree panel and restore current status if posible
     */
    refreshTree: function(){
        var me = this;

        // save current status
        var expandedNodes = {};
        var selectedNode = nodePath;
        for(var nodePath in me.fileTreePanel.nodeHash){
            // only alert on second level(Services) with children
            var node = me.fileTreePanel.nodeHash[nodePath];
            var shouldBeExpanded = false;
            if((!node.parentNode 
                || !node.parentNode.parentNode
                || !node.parentNode.parentNode.parentNode)
                && !node.isLeaf()){
                shouldBeExpanded = true;
            }
            if(me.fileTreePanel.nodeHash[nodePath].isExpanded() || shouldBeExpanded){
                expandedNodes[nodePath] = true;
            }
            if(me.fileTreePanel.nodeHash[nodePath].isSelected()){
                selectedNode = nodePath;
            }
        }

        // reload status node by node
        var reloadFunction = function(node){
            // remove listener
            node.removeListener("load", this);
            // refresh nodes expanded;
            for(var nodePath in expandedNodes){
                if(me.fileTreePanel.nodeHash[nodePath] && !me.fileTreePanel.nodeHash[nodePath].expanded){
                    me.fileTreePanel.nodeHash[nodePath].on("load", reloadFunction, me.fileTreePanel.nodeHash[nodePath]);
                    me.fileTreePanel.nodeHash[nodePath].expand();
                }
            }
            // click on the last node if is present
            if(selectedNode && me.fileTreePanel.nodeHash[selectedNode]){
                // me.fileTreePanel.nodeHash[selectedNode].select();
                me.fileTreePanel.fireEvent("click", me.fileTreePanel.nodeHash[selectedNode], {history:false});
                selectedNode = null;
            }
        }

        // reload root node
        me.fileTreePanel.root.on("load", reloadFunction, me.fileTreePanel.root);
        me.fileTreePanel.root.reload();
    },

});

Ext.reg('FileBrowser', Ext.ux.FileBrowser);
