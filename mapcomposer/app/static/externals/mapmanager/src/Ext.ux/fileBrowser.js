/**
 * Ext.ux.fileBrowser
 *
 * @author    Pavel Levkovich
 * @copyright (c) 2010, by Pavel Levkovich
 * @date      10. February 2010
 * @version   $Id: filebrowser.js 15 2010-02-26 14:31:38Z XLinur $
 *
 * @license Ext.ux.fileBrowser is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the 
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */


/* Temporary. Fix Ext.tree Bug */
Ext.override(Ext.tree.TreeEventModel, { 
    trackExit : function(e){
        if(this.lastOverNode){
            if(this.lastOverNode.ui && !e.within(this.lastOverNode.ui.getEl())){
                this.onNodeOut(e, this.lastOverNode);
            }
            delete this.lastOverNode;
            Ext.getBody().un('mouseover', this.trackExit, this);
            this.trackingDoc = false;
        }
    },
    beforeEvent : function(e){
        var node = this.getNode(e);
        if(this.disabled || !node || !node.ui){
            e.stopEvent();
            return false;
        }
        return true;
    }
});

//create namespace
Ext.namespace('Ext.ux');

/*
 *
 * @class Ext.ux.fileBrowser
 * @extends Ext.Panel
 */
Ext.ux.fileBrowser = function(config){
	var default_config = {
		actionURL:			'filebrowser.php',
		border:				true,
		closeAction:		'hide',
		cls:				'filebrowser',
		draggable:			true,
	    extImages: 			['jpg', 'jpeg', 'gif', 'png'],
	    folderAutoScroll:	true,
	    folderBorder: 		false,
	    folderSplit:		true,
	    folderWidth:		150,
	    fileInfo:			false,
	    filesBorder:		false,
	    handler:			false,
	    height:				400,
	    layout:				'border',
	    maximizable:		true,
	    modal:				false,
	    mode:				'details',
	    plain:				true,
	    resizable:			true,
	    rootTitle:			'',
	    statusBar:			false,
	    statusShowTime:		5000,
	    title:				'',
		width:				600
	};

	default_config.ldic = {
		refresh:						"Refresh",
		new_folder:						"Make a new folder",
		rename_folder:					"Rename",
		delete_folder:					"Delete",
		choice_file:					"Select this file",
		upload_file:					"Upload",
		download_file:					"Download",
		rename_file:					"Rename",
		delete_file:					"Delete",
		file_name:						"Name",
		file_size:						"Size",
		file_date_modified:				"Modified",
		file_web_path:					"Web path",
		attention:						"Attention!",
		message_confirm_folder_delete:	"Are you sure you want to delete the folder and delete all its contents?",
		message_confirm_files_delete:	"Are you sure you want to delete selected files?",
		mode:							"Mode",
		file_properties:				"Properties",
		error_file_properties:			"Error. No file properties",
		error_no_connection:			"Error. No connection",
		ok_folder_create:				"Folder created",
		error_folder_not_create:		"Error. Folder not created",
		ok_folder_rename:				"Folder '$1' is renamed into '$2'",
		error_folder_not_rename:		"Error. Folder '$1' not renamed",
		ok_folder_delete:				"Folder '$1' deleted",
		error_folder_not_delete:		"Error. Folder '$1' not deleted",
		ok_file_delete:					"File '$1' deleted",
		error_file_not_delete:			"Error. File '$1' not deleted",
		ok_file_rename:					"File '$1' is renamed into '$2'",
		error_file_not_rename:			"Error. File '$1' not renamed",
		ok_file_upload:					"File uploaded",
		error_file_not_upload:			"Error. File not uploaded",
		folder_empty:					"Empty"
	};
	
	config = Ext.applyIf(config || {}, default_config);
	Ext.ux.fileBrowser.superclass.constructor.call(this, config);
};

Ext.extend(Ext.ux.fileBrowser, Ext.Panel, {
	
	initComponent : function(){
		this.actions = {
			folderRefresh : new Ext.Action({
				text: this.ldic.refresh,
				iconCls: 'fbb_refresh',
				handler: function(){
					this.folderlist.getSelectionModel().getSelectedNode().reload();
				}.createDelegate(this)
			}),
			folderAdd : new Ext.Action({
				text: this.ldic.new_folder,
				iconCls: 'fbb_folder_add',
				handler: function(){
					this.folderAdd();
				}.createDelegate(this)
			}),
			folderRename : new Ext.Action({
				text: this.ldic.rename_folder,
				iconCls: 'fbb_folder_rename',
				handler: function(){
					this.folderRename();
				}.createDelegate(this)
			}),
			folderDelete : new Ext.Action({
				text: this.ldic.delete_folder,
				iconCls: 'fbb_folder_delete',
				handler: function(){
					this.folderDelete();
				}.createDelegate(this)
			}),
			fileRefresh: new Ext.Action({
				text: this.ldic.refresh,
				iconCls: 'fbb_refresh',
				handler: function(){
					this.fileStore.reload();
				}.createDelegate(this)
			}),
			fileDownload: new Ext.Action({
				text: this.ldic.download_file,
				iconCls: 'fbb_download',
				handler: function(){
					this.filesDownload();
				}.createDelegate(this)
			}),
			fileRename: new Ext.Action({
				text: this.ldic.rename_file,
				iconCls: 'fbb_file_rename',
				handler: function(){
					this.fileRename();
				}.createDelegate(this)
			}),
			fileDelete: new Ext.Action({
				text: this.ldic.delete_file,
				iconCls: 'fbb_file_delete',
				handler: function(){
					this.filesDelete();
				}.createDelegate(this)
			}),
			fileChoice: new Ext.Action({
				text: this.ldic.choice_file,
				iconCls: 'fbb_apply',
				handler: function(){
					this.filePanel.getSelectionModel().clearSelections();
					var record = this.fileStore.getAt(this.fileContextmenu.rowNumber);
					if (record && record.get('web_path') && record.get('name')){
						if (this.fileInfo) {
							this.actionFilePropertiesReturn(record.get('name'));
						} else {
							this.handler(record.get('web_path'));
						}
					}
				}.createDelegate(this)
			})
		};

		this.switchModeButton =new Ext.Button({
			iconCls: 'fbb_mode',
			enableToggle: true,
			pressed : this.mode=='thumbs',
			listeners: {
				'toggle' : function(button,state){
					if (state){
						this.switchMode('thumbs');
					} else {
						this.switchMode('details');
					}
				}.createDelegate(this)
			}
		});
		
		this.uploadButton = new Ext.Button({
			text: this.ldic.upload_file,
			iconCls: 'fbb_upload',
			listeners: {
				'afterrender' : function(button){
					button.wrap = button.el.wrap();
					button.wrap.setStyle({position:'relative',overflow:'hidden'});
				 	var width = button.wrap.getWidth();
				 	this.fileForm = button.wrap.createChild({
				 		tag: 'form',
				 		method: 'post',
				 	    action: this.actionURL
				 	});
				 	
				 	button.fileInput = this.fileForm.createChild({
						name: 'file',
						style: 'position: absolute; top: 0px; font-size: '+(width*0.5)+'px; left: -'+(width*1.5)+'px; border: none; cursor: pointer',
						tag: 'input',
						type: 'file',
						size: 1
				    });
					if (button.handleMouseEvents) {
						button.fileInput.on('mouseover', button.onMouseOver, button);
						button.fileInput.on('mousedown', button.onMouseDown, button);
					}
					button.fileInput.setOpacity(0.0);
					button.resizeEl = button.positionEl = button.wrap;
					button.fileInput.on('change',function(){
						this.fileUpload();
			        }.createDelegate(this));
				}.createDelegate(this)
			}
		});
		
		this.fileStore = new Ext.data.Store({
			url: this.actionURL,
			baseParams: {
				action : "get_filelist",
				mode : this.mode
			},
			method: 'POST',
			autoLoad: false,
			sortInfo: {field: 'name', direction: 'ASC'},
			reader: new Ext.data.JsonReader({
				root: 'data',
				totalProperty: 'count'
			},[
				{name: 'name'},
				{name: 'size'},
				{name: 'mtime', type: 'date', dateFormat: 'timestamp'},
				{name: 'web_path'},
				{name: 'thumb_path'}
			])
		});

		
		this.filePanel = this.getViewMode();
		
		this.items = [
       		new Ext.tree.TreePanel({
    			ref:			'folderlist',
    			autoScroll:		this.folderAutoScroll,
    			border:			this.folderBorder,
    			width:			this.folderWidth,
    			split:			this.folderSplit,
    			region:			'west',
    			enableDD:		false,
    			ddGroup:		'fileMove',
    			ddAppendOnly:	true,
    			loader: new Ext.tree.TreeLoader({
    				dataUrl: this.actionURL,
    				nodeParameter: 'folder',
    				baseParams: {
    					action : "get_folderlist"
    				}
    			}),
    			root: new Ext.tree.AsyncTreeNode({
    				text: this.rootTitle,
    				draggable: false,
    				expanded: true,
    				id: 'root'
    			}),
    			listeners: {
       				'load': function(){
       					if (!this.fileStore.lastOptions) {
       						this.folderlist.fireEvent('click',this.folderlist.getRootNode());
    						this.filelistButtonsChangeStates();
       					}
       				}.createDelegate(this),
    				'click': function(node, e) {
    					current_directory = node.attributes.id;
    					this.fileStore.setBaseParam('folder',node.attributes.id);
    					this.fileStore.load();
    				}.createDelegate(this),
    				'contextmenu': function(node, event) {
    					node.select();
    					if (node.id=='root') {
    						this.actions.folderDelete.disable();
    						this.actions.folderRename.disable();
    					} else {
    						this.actions.folderDelete.enable();
    						this.actions.folderRename.enable();
    					}
    					this.folderContextmenu.ownerCt=this;
    					this.folderContextmenu.node = node;
    					this.folderContextmenu.showAt(event.getXY());
    				}.createDelegate(this),
    				'beforenodedrop': function(){
    					this.filesMove();
    				}.createDelegate(this)
    				
    			}
    		}), 
    		new Ext.Panel({
    			ref: 'filelist',
    			border:	this.filesBorder,
    			region: 'center',
    			layout: 'fit',
    			tbar: new Ext.Toolbar([this.actions.fileRefresh,this.uploadButton,this.actions.fileDownload,this.actions.fileDelete,{xtype: 'tbfill'},this.switchModeButton]),
    			items: this.filePanel
    		})
       	];

		if (!Ext.isObject(this.statusBar)){
			this.statusBar = new Ext.Toolbar({
				timeId : false,
	    		items: new Ext.Toolbar.TextItem({ref: 'text',height: 15}),
	    		showMessage:  function(message){
	    			this.text.setText(message);
	    			if (this.timeId) {
	    				clearTimeout(this.timeId);
	    				
	    			}
	    			this.timeId = this.hideMessage.defer(this.ownerCt.statusShowTime,this);
	    		},
	    		hideMessage: function(){
	    			this.timeId = false;
	    			this.text.setText('');
	    		}
			});
		}
		
		this.bbar = this.statusBar;
				
    	Ext.ux.fileBrowser.superclass.initComponent.call(this);

		this.folderContextmenu = new Ext.menu.Menu({
			renderTo: Ext.getBody(),
			items: [this.actions.folderRefresh,'-',this.actions.folderAdd,this.actions.folderRename,this.actions.folderDelete]
		});
		
		this.fileContextmenu = new Ext.menu.Menu({
			renderTo: Ext.getBody(),
			items: [this.actions.fileRefresh,'-',this.actions.fileDownload,this.actions.fileRename,this.actions.fileDelete]
		});
		
		this.folderEditor = new Ext.tree.TreeEditor(this.folderlist, {});
		this.folderEditor.beforeNodeClick=Ext.emptyFn;
		this.folderEditor.ignoreNoChange=true;
		this.folderEditor.on('complete',function(editor,newValue,oldValue){
			this.actionFolderRename(newValue, oldValue);
		},this);
		
		if (this.handler && Ext.isFunction(this.handler)){
			this.fileContextmenu.insert(0,this.actions.fileChoice);
		};
	},

	getViewMode: function (mode){
		if(mode && mode == "thumbs"){

			var extDataView = Ext.extend(Ext.DataView,{
				selectionModel : {
					clearSelections : function(){
						this.view.clearSelections();
					},
					each : function(fn,scope){
						var s = this.view.getSelectedRecords();
				        for(var i = 0, len = s.length; i < len; i++){
				            if(fn.call(scope || this, s[i], i) === false){
				                return false;
				            }
				        }
				        return true;
					},
					getSelected : function(){
						return (this.view.getSelectionCount()>0)?this.view.getSelectedRecords()[0]:null;
					},
					getCount : function(){
						return this.view.getSelectionCount();
					},
					hasSelection : function(){
						return this.view.getSelectionCount()>0;
					}
				},
				getSelectionModel: function(){
					return this.selectionModel;
				},
				constructor: function(config) {
					this.selectionModel.view = this;
					extDataView.superclass.constructor.call(this, config);
			    },
			    editor : new Ext.Editor({
			    	field: {
			    		xtype: 'textfield'
			    	},
		    		alignment: "tl-tl",
		    	    hideEl : false,
		    	    cls: "x-small-editor",
		    	    shim: false,
		    	    completeOnEnter: true,
		    	    cancelOnEsc: true,
		    	    autoSize: true,
		    	    ignoreNoChange: true,
		    	    listeners : {
			    		'complete' : function(editor,value,originalValue){
		    				editor.record.set('name',value);
		    				editor.record.commit();
		    				this.actionFileRename(value,originalValue);
						}.createDelegate(this)
			    	}
			    }),
			    startEditing : function(number){
			    	this.editor.record = this.getStore().getAt(number);
			    	this.editor.startEdit(Ext.get(this.getNode(number)).dom.lastChild,this.editor.record.get('name'))
			    }
			});
			
			return new extDataView({
				region: 'center',
	            store: this.fileStore,
	            tpl: new Ext.XTemplate(
	            	'<tpl for=".">',
	                    '<div class="x-unselectable fb_thumb_wrap" id="{name}" title="{name}">',
	        		    '<div class="fb_thumb {loadingClass}">{content}</div>',
	        		    '<span class="x-editable">{shortName}</span></div>',
	                '</tpl>',
	                '<div class="x-clear"></div>'
	        	),
	            autoScroll: true,
	            multiSelect: true,
	            selectedClass: 'fb_thumb_selected',
	            overClass:'fb_thumb_over',
	            itemSelector:'div.fb_thumb_wrap',
	            emptyText: this.ldic.folder_empty,
	            prepareData: function(data){
					var gobj = this.ownerCt.ownerCt;
					data.loadingClass = '';
	                data.shortName = Ext.util.Format.ellipsis(data.name, 15);
	                var fileExt = data.name.substring(data.name.lastIndexOf('.')+1);
	                if (gobj.extImages.indexOf(fileExt)>-1) {
		                if (!data.thumb_path) {
		                	data.thumb_path = gobj.actionURL+"?"+Ext.urlEncode({
		                		action : 'get_thumb',
		                		folder : gobj.fileStore.baseParams.folder,
		                		file : data.name
		                	});
		                	data.loadingClass = 'fb_loading';
		                }
		                data.content = '<img src="'+data.thumb_path+'" onload="if (Ext.get(this.parentNode)) Ext.get(this.parentNode).removeClass(\'fb_loading\')">';
	                } else {
	                	data.content = '<img src="'+Ext.BLANK_IMAGE_URL+'" class="fb_thumb_file fb_thumb_' + fileExt + '" />';
	                }
	                return data;
	            },
	            listeners: {
					'contextmenu': function(view, number, node, event) {
						if(event) event.stopEvent();
						if (!view.isSelected(number)) {
							view.clearSelections();
							view.select(number);						
						}
						this.fileContextmenu.ownerCt=this;
						this.fileContextmenu.rowNumber = number;
						this.fileContextmenu.showAt(event.getXY());
					}.createDelegate(this),
					'selectionchange': function() {
						this.filelistButtonsChangeStates();
					}.createDelegate(this),
					'dblclick' : function(view,number,event){
						if (this.fileContextmenu.get(0).baseAction == this.actions.fileChoice) {
							this.fileContextmenu.rowNumber=number;
							this.actions.fileChoice.execute();
						}
					}.createDelegate(this)
				}
	        });
		}else{
			var extDetailsView = Ext.extend(Ext.grid.GridPanel,{
				editor : new Ext.Editor({
			    	field: {
			    		xtype: 'textfield'
			    	},
		    		alignment: "tl-tl",
		    	    hideEl : false,
		    	    cls: "x-small-editor",
		    	    shim: false,
		    	    completeOnEnter: true,
		    	    cancelOnEsc: true,
		    	    autoSize: true,
		    	    ignoreNoChange: true,
		    	    listeners : {
			    		'complete' : function(editor,value,originalValue){
		    				editor.record.set('name',value);
		    				editor.record.commit();
		    				this.actionFileRename(value,originalValue);
						}.createDelegate(this)
			    	}
			    }),
			    startEditing : function(number){
			    	this.editor.record = this.getStore().getAt(number);
			    	this.editor.startEdit(this.getView().getCell(number,0),this.editor.record.get('name'))
			    }
			});
			return new extDetailsView({
				border:	false,
				region: 'center',
				enableDrag: false,
				split: true,
				ddGroup : 'fileMove',
				view: new Ext.grid.GridView({
					emptyText: this.ldic.folder_empty,
					forceFit: true
				}),
				store: this.fileStore,
				colModel: new Ext.grid.ColumnModel([
					{header: this.ldic.file_name, dataIndex: 'name', sortable: true},
					{header: this.ldic.file_size, dataIndex: 'size', sortable: true, renderer: Ext.util.Format.fileSize, width: 30},
					{header: this.ldic.file_date_modified, dataIndex: 'mtime', sortable: true, renderer: Ext.util.Format.dateRenderer('d-m-Y H:i:s'), width: 50},
					{header: this.ldic.file_web_path, dataIndex: 'web_path', sortable: true, hidden: true}
				]),
				selModel: new Ext.grid.RowSelectionModel({
					singleSelect:false,
					listeners: {
						'selectionchange': function () {
							this.filelistButtonsChangeStates();
						}.createDelegate(this)	
					}
				}),
				listeners: {
					'rowcontextmenu': function(grid, number, event) {
						if(event) event.stopEvent();
						if (!grid.getSelectionModel().isSelected(number)) {
							grid.getSelectionModel().clearSelections();
							grid.getSelectionModel().selectRow(number);						
						}
						this.fileContextmenu.ownerCt=this;
						this.fileContextmenu.rowNumber = number;
						this.fileContextmenu.showAt(event.getXY());
					}.createDelegate(this),
					'celldblclick' : function() {
						return false;
					},
					'afteredit' : function(editor){
						editor.record.commit();
						this.actionFileRename(editor.value,editor.originalValue);
					}.createDelegate(this),
					'rowdblclick' : function(grid,rowIndex,event){
						if (this.fileContextmenu.get(0).baseAction == this.actions.fileChoice) {
							this.fileContextmenu.rowNumber=rowIndex;
							this.actions.fileChoice.execute();
						}
					}.createDelegate(this)
				}
			});
		}
	},
	
	getMessage :  function(message) {
		var text;
		if (Ext.isString(message)) {
			text = message;
		} else {
			text = message.text;
			for (var i=0; i<message.args.length; i++){
				text=text.replace('$'+(i+1),message.args[i]);
			}
		}
		return text;
	},
	
	showError : function(message){
		this.statusBar.showMessage(this.getMessage(message),'error');
	},
	
	showOk : function(message){
		this.statusBar.showMessage(this.getMessage(message),'message');
	},
	
	filelistButtonsChangeStates : function(){
		with (this.actions){
			if (this.filePanel.getSelectionModel().hasSelection()) {
				fileDownload.enable();
				fileRename.enable();
				fileDelete.enable();
			} else {
				fileDownload.disable();
				fileRename.disable();
				fileDelete.disable();
			}
		}
	},
	
	switchMode : function(mode){
		this.filelist.remove(this.filePanel, true);
		this.filelistButtonsChangeStates();
		this.mode=mode;
		this.fileStore.setBaseParam('mode',this.mode);
		this.fileStore.load();
		// this.filePanel = this[mode+'View'].cloneConfig();
		this.filePanel = this.getViewMode(mode);
		this.filelist.add(this.filePanel);
		if (this.mode=='details'){
			this.filePanel.getSelectionModel().on(
				'selectionchange',
				function(){
					this.filelistButtonsChangeStates();
				}.createDelegate(this));
			this.filePanel.reconfigure(this.fileStore,this.filePanel.getColumnModel());
		}
		this.filelist.doLayout(true,true);
	},
	
	folderAdd : function(){
		this.actionFolderAdd();
	},
	
	folderRename : function(){
		this.folderEditor.triggerEdit(this.folderlist.getSelectionModel().getSelectedNode());
	},	
	
	folderDelete : function(){
		Ext.MessageBox.confirm(this.ldic.attention, this.ldic.message_confirm_folder_delete, function(reponse) {
			if (reponse == "yes") {
				this.actionFolderDelete();
			}
		}.createDelegate(this));
	},
	

	fileRename : function(){
		this.filePanel.startEditing(this.fileContextmenu.rowNumber,0);
	},

	filesDelete : function(){
		Ext.MessageBox.confirm(this.ldic.attention, this.ldic.message_confirm_files_delete, function(reponse) {
			if (reponse == "yes") {
				this.actionFilesDelete(this.filePanel.getSelectionModel().getCount());
			}
		}.createDelegate(this));
	},
	
	filesDownload : function(){
		this.actionFilesDownload();
	},
	
	fileUpload : function(){
		this.actionFileUpload();
	},
	
	actionDo : function(config){
		var connection = new Ext.data.Connection().request({
			url: config.url ? config.url : this.actionURL,
            defaultHeaders: this.defaultHeaders,
			method: "POST",
			params: Ext.isDefined(config.params)?config.params:{},
			form : Ext.isDefined(config.form)?config.form:false,
			isUpload : Ext.isDefined(config.isUpload)?config.isUpload:false,
			successCallback: Ext.isFunction(config.successCallback)?config.successCallback.createDelegate(this):false,
			failureCallback: Ext.isFunction(config.failureCallback)?config.failureCallback.createDelegate(this):false,
			successMessage: Ext.isDefined(config.successMessage)?config.successMessage:false,
			failureMessage: Ext.isDefined(config.failureMessage)?config.failureMessage:false,
			success: function(o,con) {
				var response = false;
				if (o.responseText && o.responseText.indexOf('success')>-1){
					response = Ext.util.JSON.decode(o.responseText);
				}
				if (response && response.success == true) {
					if (Ext.isString(response.folder) && response.folder=='') response.folder='root';
					if (con.successMessage){
						this.showOk(con.successMessage);
					}
					if (con.successCallback) {
						con.successCallback(response,con);
					}
				} else {
					if (response && response.message) {
						this.showError(response.message);
					} else {
						if (con.failureMessage){
							this.showError(con.failureMessage);
						}
					}
					if (con.failureCallback) {
						con.failureCallback(con);
					}
				}
			}.createDelegate(this),
			failure: function(o,con) {
				if (con.failureCallback) {
					con.failureCallback.createDelegate(this,[con]);
				}
				this.showError(this.ldic.error_no_connection);
			}.createDelegate(this)
		});
	},
	
	actionFolderAdd : function(){
		this.actionDo({
			params: {
				action: "folder_new",
				folder: this.folderlist.getSelectionModel().getSelectedNode().id
			},
			successCallback: function(response){
				if (response.folder) {
					var parentNode = this.folderlist.getNodeById(response.folder);
					if (parentNode) {
						if (response.id) {
							parentNode.on('load',function (node){
								var newFolder = this.folderlist.getNodeById(response.id);
								if (newFolder) {
									(function(){
									    newFolder.select();
									    this.folderRename();
									}).defer(200,this,[newFolder]);
								}
								node.events['load'].clearListeners();
							},this,response.id);
						}
						parentNode.reload();
						if (!parentNode.isExpanded()) {
							parentNode.expand();
						}
					}
				}	
			},
			successMessage: this.ldic.ok_folder_create,
			failureMessage: this.ldic.error_folder_not_create
		});
	},
	
	actionFolderRename : function(newName,oldName){
		this.actionDo({
			params: {
				action: "folder_rename",
				folder: this.folderlist.getSelectionModel().getSelectedNode().id,
				name: newName,
				oldName: oldName
			},
			successCallback: function(response){
				var node = this.folderlist.getNodeById(response.folder);
				if (node) {
					node.setId(response.id);
				}	
			},
			failureCallback: function(con){
				var node = this.folderlist.getNodeById(con.params.folder);
				if (node) {
					node.setText(con.params.oldName);
				}	
			},
			successMessage: {text: this.ldic.ok_folder_rename, args: [oldName,newName]},
			failureMessage: {text: this.ldic.error_folder_not_rename, args: [oldName]}
		});
	},
	
	actionFolderDelete : function(name){
		var name = this.folderlist.getSelectionModel().getSelectedNode().text;
		this.actionDo({
			params: {
				action: "folder_delete",
				folder: this.folderlist.getSelectionModel().getSelectedNode().id
			},
			successCallback: function(response){
				if (response.folder) {
					var node = this.folderlist.getNodeById(response.folder);
					if (node) {
						node.parentNode.reload();
					}
				}	
			},
			successMessage: {text: this.ldic.ok_folder_delete, args: [name]},
			failureMessage: {text: this.ldic.error_folder_not_delete, args: [name]}
		});
	},
	
	actionFileRename : function(newName,oldName){
		this.actionDo({
			params: {
				action: "file_rename",
				folder: this.fileStore.baseParams.folder,
				name: newName,
				oldName: oldName
			},
			failureCallback: function(con){
				var node = this.fileStore.getAt(this.fileStore.find('name',con.params.name));
				if (node) {
					node.set('name',con.params.oldName);
					node.commit();
				}	
			},
			successMessage: {text: this.ldic.ok_file_rename, args: [oldName,newName]},
			failureMessage: {text: this.ldic.error_file_not_rename, args: [oldName]}
		});
	},
	
	actionFilesDelete : function(total){
		if (!this.filePanel.getSelectionModel().hasSelection()) return;
		var name = this.filePanel.getSelectionModel().getSelected().get('name');
		this.actionDo({
			params: {
				action: "file_delete",
				folder: this.fileStore.baseParams.folder,
				file: name,
				total: total
			},
			successCallback: function(response,con){
				if (response.folder) {
					var node = this.fileStore.getAt(this.fileStore.find('name',con.params.file));
					if (node) {
						this.fileStore.remove(node);
						this.actionFilesDelete(con.params.total);
					}
				}	
			},
			successMessage: {text: this.ldic.ok_file_delete, args: [name]},
			failureMessage: {text: this.ldic.error_file_not_delete, args: [name]}
		});
	},
	
	actionFilesDownload : function(){
		this.filePanel.getSelectionModel().each(function(record){
			window.open(this.actionURL+'/../download?folder=' + this.fileStore.baseParams.folder + '&file=' + record.get('name'));
		},this);
		this.filePanel.getSelectionModel().clearSelections();
	},
	
	actionFileUpload :  function(){
		this.actionDo({
			// url: this.actionURL + "?action=file_upload&folder="+this.fileStore.baseParams.folder,
			url: this.actionURL + "/../upload?",
			form: this.fileForm,
			isUpload: true,
			params: {
				action: "file_upload",
				folder: this.fileStore.baseParams.folder
			},
			successCallback: function(response,con){
				if (response.folder && response.folder==this.fileStore.baseParams.folder){
					this.fileStore.reload();
				}
			},
			successMessage: this.ldic.ok_file_upload,
			failureMessage: this.ldic.error_file_not_upload
		});
		this.fileForm.dom.reset();
	},
	
	actionFilePropertiesReturn : function(name){
		this.actionDo({
			params: {
				action: "file_properties",
				folder: this.fileStore.baseParams.folder,
				file: name
			},
			successCallback: function(response,con){
				if (response.info){
					this.handler(response.file,response.info);
				}
			},
			failureMessage: this.ldic.error_file_properties
		});
	}
});

/** api: xtype = filebrowserpanel */
Ext.reg("filebrowserpanel", Ext.ux.fileBrowser);