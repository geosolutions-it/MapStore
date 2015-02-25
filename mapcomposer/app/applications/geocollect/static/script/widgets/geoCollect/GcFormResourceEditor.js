/*
*  Copyright (C) 2014 GeoSolutions S.A.S.
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
 * @include widgets/geoCollect/GcMobileWidgetPanel.js
 * */

Ext.ns("mxp.widgets");

/**
 * GoeCollect Pre view Resource editor
 * Allow to select geocollect source resource
 */
mxp.widgets.GcFormResourceEditor = Ext.extend(Ext.Panel, {

	/** api: xtype = mxp_gc_form_resource_editor */
	xtype : 'mxp_gc_form_resource_editor',
    surveyFormTitle:"Form Title",
    btnAddPageText:"New Page",
    btnAddPageTooltip:"Create A New Page",
    savePageMsgTitle:"Save Page?",
    savePageMsg:"Would You Like To Save Your Page?",
    saveErroMsgTitle:"Error",
    saveErrorMsg:"Invalid Page Properties",
    btnDelPageText:"Delete Page",
    btnDelPageTooltip:"Delete Active Page",
    delPageMsgTitle:"Delete Page?",
    delPageMsg:"Would you like to delete your Page?",
    btnSavePageText:"Save",
    btnSavePageTooltip:"Save active Page",
    pagesGridTitle:"Pages",
    btnValidateText:"Validate",
    btnValidateTooltip:"Check Preview Validity",
    validateMsgValid:"Mission Template Valid",
    validateMsgInvalid:"Mission Template Invalid",
    validateMsgTitle:"Is Valid?",
	seg_store : null,
	sop_store : null,
	pages_store : null,
	layout : 'border',
	frame : true,
	destLabel : 'Mission Fields',
	segHidden : false,

	initComponent : function() {
		//Nella preview ho solo questi widget!!
		this.allowedTypes = [
		['textfield', "Text Field"], 
		['textarea', "Text Area"],
	    ['label', "Label"], 
		['separator', "Separator"], 
		['datefield', "Date Field"], 
		['checkbox', "Checkbox"], 
		['mapViewPoint', "Map"],
		['photo', "Photo"], 
		['actionsend', "Action Send"],
		['spinner', "Spinner"]];

        this.dirty=false;
        
		//Configuri store per le pagine mantine il titolo e oggetto json con tutta la pagina
		this.pages_store = new Ext.data.JsonStore({
			fields : ['title', {
				name : '_created',
				type : 'boolean'
			}],
			proxy : new Ext.data.MemoryProxy()
		});

		this.tbar = [{
			xtype : 'toolbar',

			items : ['-', {
				xtype : 'label',
				text : this.surveyFormTitle

			}, ' ', {
				ref : '//formTitle',
				xtype : 'textfield',
				allowBlank : false

			}, '-', {
				ref : '//addP',
				text : this.btnAddPageText,
				iconCls : "addgc",
				tooltip : this.btnAddPageTooltip,
				handler : function(btn) {

					if (this.pageList.getSelectionModel().getSelected() && this.pageWidget.isDirty()) {
						Ext.Msg.show({
							title : this.savePageMsgTitle,
							msg : this.savePageMsg,
							buttons : Ext.Msg.YESNOCANCEL,
							fn : function(res) {
								if (res == 'yes') {

									if (this.pageWidget.isValid()) {
										this.sevePage();
										this.pages_store.loadData([{
											title : "New Page",
											_created : true
										}], true);
										this.pageList.getSelectionModel().selectLastRow();
									} else
										Ext.Msg.alert(this.saveErroMsgTitle, this.saveErrorMsg);
								} else if (res == 'no') {
									//se è nuovo devo eliminarlo
									rec = this.pageList.getSelectionModel().getSelected();
									if (rec.get('_created') === true)
										this.pages_store.remove(rec);
									this.pageList.getSelectionModel().clearSelections();
									this.disableForm();
									this.pages_store.loadData([{
										title : "New Page",
										_created : true
									}], true);
									this.pageList.getSelectionModel().selectLastRow();
								}
							},
							scope : this,
							animEl : 'elId',
							icon : Ext.MessageBox.QUESTION
						});
					} else {
						this.pages_store.loadData([{
							title : "New Page",
							_created : true
						}], true);
						this.pageList.getSelectionModel().selectLastRow();
					}
				},
				scope : this
			}, {
				ref : '//delP',
				text : this.btnDelPageText,
				iconCls : "deletegc",
				tooltip : this.btnDelPageTooltip,
				handler : function(btn) {

					if ( rec = this.pageList.getSelectionModel().getSelected()) {
						Ext.Msg.show({
							title : this.delPageMsgTitle,
							msg : this.delPageMsg,
							buttons : Ext.Msg.YESNOCANCEL,

							fn : function(res) {

								if (res == 'yes') {
								    this.dirty=true;
									rec = this.pageList.getSelectionModel().getSelected();
									if (rec)
										this.pages_store.remove(rec);
									//eliminate record nel pannello e resettare

									this.disableForm();
									this.pageList.getSelectionModel().unlock();
								}
							},
							scope : this,
							animEl : 'elId',
							icon : Ext.MessageBox.QUESTION
						});
					}

				},
				scope : this
			}, '-', {
				ref : '//saveP',
				text : this.btnSavePageText,
				iconCls : "accept",
				tooltip : this.btnSavePageTooltip,
				handler : function(btn) {

					this.saveMe();
				},
				scope : this
			}]

		}];
		this.items = [{

			region : 'west',
			ref : 'pageList',
			xtype : 'grid',
			width : 150,
			collapsible : true,
			title : this.pagesGridTitle,
			store : this.pages_store,
			autoScroll : true,
			autoExpandColumn : "tit",
			hideHeaders : true,
			//	style:{padding:'2px'},
			frame : true,

			cm : new Ext.grid.ColumnModel([{
				id : "tit",
				title : 'puppa',
				dataIndex : "title",
				sortable : false
			}]),

			sm : new Ext.grid.RowSelectionModel({
				singleSelect : true,
				listeners : {
					rowselect : function(slm, idx, r) {

						if (r.get('_created') === true)
							this.pageWidget.dirty = true;
						else
							this.pageWidget.dirty = false;
						//abilito pannello per editing e blocco selezione!
						r.beginEdit();
						this.enableForm();
						this.pageWidget.loadPage(r.json);
					},

					beforerowselect : function(sm, rowIndex, keepExisting, record) {

						if ( this.pageList.getSelectionModel().getSelected() && this.pageWidget.isDirty() ) {
							this.saveMe(rowIndex);
						} else
							return true;
						return false;
					},
					scope : this
				}
			}),
			bbar : {

				xtype : 'toolbar',
				items : [{
					text : this.btnValidateText,
					ref : '/../ckForm',
					iconCls : "accept",
					tooltip : this.btnValidateTooltip,
					handler : function(btn) {
						this.getResourceData();
						
						
						   Ext.Msg.show({
                                        title:this.validateMsgTitle,
                                        msg:this.isValid()? this.validateMsgValid:this.validateMsgInvalid,
                                        animEl: 'elId',
                                        icon: Ext.MessageBox.INFO
                                        });
						

					},
					scope : this
				}, '-', {
					xtype : 'button',
					iconCls : "m_up",
					ref : '/../moveUp',
					disabled : true,
					handler : function(btn) {
						var sm = this.pageList.getSelectionModel();
						var st = this.pageList.getStore();
						r = sm.getSelected();

						if (r) {
							idx = st.indexOf(r);
							st.remove(r);
							st.insert(idx - 1, r);
							sm.suspendEvents(false);
							sm.selectRow(idx - 1);
							sm.resumeEvents();
							this.enableUpDown();
						}

					},
					scope : this
				}, ' ', {
					xtype : 'button',
					iconCls : "m_down",
					ref : '/../moveDown',
					disabled : true,
					handler : function(btn) {
						var sm = this.pageList.getSelectionModel();
						var st = this.pageList.getStore();
						r = sm.getSelected();

						if (r) {
							idx = st.indexOf(r);
							st.remove(r);
							st.insert(idx + 1, r);
							sm.suspendEvents(false);
							sm.selectRow(idx + 1);
							sm.resumeEvents();
							this.enableUpDown();
						}
					},
					scope : this
				}],

			}

		}, {
			region : 'center',
			xtype : 'mxp_gc_mobile_widget_panel',
			seg_store : this.seg_store,
			sop_store : this.sop_store,
			ref : 'pageWidget',
			disabled : true,
			border : false,
			destLabel : this.destLabel,
			segHidden : this.segHidden,
			allowedTypes : this.allowedTypes,
		}];

		//this.on('render',this.disableForm,this);

		mxp.widgets.GcFormResourceEditor.superclass.initComponent.call(this, arguments);
	},

	//Return a Form
	getResourceData : function() {
		var pages = [];
		this.pages_store.each(function(r) {
			pages.push(r.json);
		});

		return {
			id : 1,
			name : this.formTitle.getValue(),
			pages : pages
		};
	}, //Attenzione lo puoi caricare solo dopo che sono arrivati gli store!!
	loadResourceData : function(res) {
		//Setto il titolo e la lista delle pagine
		this.formTitle.setValue(res.name);
		this.pages_store.loadData(res.pages);
	},

	//Condizioni di validità : La pagina deve avere almno un titolo e campo valido altrimenti è invalida
	canCommit : function() {//Condizioni per sapere se è committabile

		return this.isValid();
	},

	//Condizioni di validità per la form, 1) Deve avere tutti i campi del sopralluogo implementati altrimenti non è valida!!
	//Condizione pesante da valitare devi ciclare fra tutte le pagine e  tutti i campi e controllare che siano presenti
	//forse conviene fare un array dei campi e confrontarli uno ad uno bo :D
	isValid : function() {

		fId_str = this.getFieldsList();
		//recupero store dal pannello sotto rimuovo tutti i filtri se ce ne fossero
		sop = this.pageWidget.sop_store;
		sop.clearFilter();
		if (!this.formTitle.isValid())
			return false;
		//primo controllo se numero differente non posso accettare

		if (fId_str.getCount() < sop.getCount() && false)
			return false;
		else {//cicli per controllare validita

			for ( i = 0, ilen = sop.getCount(); i < ilen; i++) {

				if (fId_str.find('fId', sop.getAt(i).get('name')) == -1) {
					fId_str.destroy();
					return false;
				}

			}

		}
		fId_str.destroy();
		return true;

	},

	getFieldsList : function() {
		var send, photo;
		fId_str = st = new Ext.data.ArrayStore({
			fields : [{
				name : 'fId',
				mapping : 0
			}]
		});

		this.pages_store.each(function(r) {
			fs = r.json.fields;
			for ( i = 0, ilen = fs.length; i < ilen; i++) {

				if (fs[i].fieldId)
					fId_str.loadData([[fs[i].fieldId]], true);
			}

		});
		return fId_str;

	},

	//gestiece configurazione interfaccia qunado vado in editing
	enableForm : function() {
		this.cleanWidegtPanl();
		this.pageWidget.enable();
		this.delP.enable(true);
		this.saveP.enable(true);
		this.enableUpDown();
		this.ckForm.disable(true);

	},
	//gestiece configurazione interfaccia qunado termino editing
	disableForm : function() {
		this.cleanWidegtPanl();
		this.pageWidget.disable();
		this.delP.disable(true);
		this.saveP.disable(true);
		this.moveUp.disable(true);
		this.moveDown.disable(true);
		this.ckForm.enable(true);

	},

	cleanWidegtPanl : function() {
		this.pageWidget.cleanAll();
	},
	//Aggiorna il widget corrente nella lista
	sevePage : function() {
		rec = this.pageList.getSelectionModel().getSelected();
		obj = this.pageWidget.getPage();
		rec.json = obj;
		rec.set('title', obj.title);
		rec.set('_created', false);
		rec.endEdit();
		rec.commit();
		//	this.pages_store.fireEvent('datachanged',this.pages_store);
		this.pageList.getSelectionModel().clearSelections();

		this.disableForm();
	},
	//Updatea fli store
	updateStore : function(seg, sop) {
		this.pageWidget.updateStore(seg, sop);
		this.resetMe();
	}, //ripulisce tutti i campi e gli store
	resetMe : function() {
		this.pages_store.removeAll();
		this.formTitle.setValue('');
		this.disableForm();

	}, //If row is selected, check row positions and enble the arrow
	enableUpDown : function() {
		var sm = this.pageList.getSelectionModel();

		if(this.pageList.getStore().getCount()>1){
            if (sm) {
    			if (sm.isSelected(0)) {// è selezionato il primo
    				this.moveDown.enable();
    				this.moveUp.disable();
    
    			} else if (sm.isSelected(this.pageList.getStore().getCount() - 1)) {//selezionato ultimo
    				this.moveDown.disable();
    				this.moveUp.enable();
    
    			} else {
    
    				this.moveDown.enable();
    				this.moveUp.enable();
    			}
    
    		}
		}else{
		    this.moveDown.disable();
                    this.moveUp.disable();
		}

	},

	saveMe : function(rowIndex) {
		Ext.Msg.show({
			title : this.savePageMsgTitle,
			msg : this.savePageMsg,
			buttons : Ext.Msg.YESNOCANCEL,
			fn : function(res) {
				var sm = this.pageList.getSelectionModel();
				if (res == 'yes') {
				    this.dirty=true;
					if (this.pageWidget.isValid()) {
						this.sevePage();
						if (rowIndex)
							sm.selectRow(rowIndex);
					} else
						Ext.Msg.alert(this.saveErroMsgTitle, this.saveErroMsg);
				} else if (res == 'no') {
					//se è nuovo devo eliminarlo
					rec = sm.getSelected();
					if (rec.get('_created') === true)
						this.pages_store.remove(rec);
					sm.clearSelections();
					this.disableForm();
					if (rowIndex)
						sm.selectRow(rowIndex);
				}
			},
			scope : this,
			animEl : 'elId',
			icon : Ext.MessageBox.QUESTION
		});
	},
	/**
	 * api method[isDirty]
	 * Return the status of the form, true if modified false of not
	 */
	isDirty:function()
    {
        return (this.pageWidget.disabled)? false:this.pageWidget.isDirty();
        
        
    }
});
Ext.reg(mxp.widgets.GcFormResourceEditor.prototype.xtype, mxp.widgets.GcFormResourceEditor);

