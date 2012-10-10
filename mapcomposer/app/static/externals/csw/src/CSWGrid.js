/*
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
 * Class: CSWGrid
 * Widget che contiene i record CSW ricercati.
 * Utilizza il Plugin RowExpander. 
 *
 * Inherits from:
 * - <Ext.grid.GridPanel>
 */
CSWGrid = Ext.extend(Ext.grid.GridPanel, {
	
	/**
	 * Property: config
	 * {object} Oggetto per la configurazione  componente. Vedere <config.js>
	 */
	config:null, 
	
	/**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
	/**
	 * Property: enableHDMenu
     * {boolean} se true viene aggiunto a ogni colonna un menu che permette l'ordinamento delle colonne.
	 */ 
	enableHdMenu : false,
	/**
	 * Property: height
     * {int} altezza del componente
	 */ 
	height:290, 
	/**
	 * Property: autoScroll
     * {boolean} se true permette la comparsa della barra di scorrimento se il contenuto eccede le dimensioni del componente
	 */ 
	autoScroll:true,
	
	/**
	 * Property: title
     * {string} titolo da associare al pannello griglia
	 */
	title : null,
	/**
	 * Property: iconCls
     * {string} classe CSS associata all'icona del componente 
	 */
	iconCls : 'icon-grid',
    /**
	 * Property: autoExpandColumn
     * {string} designa la colonna che si espande automaticamente al resize
	 */
    autoExpandColumn: "title",    

	/**
	 * Constructor: initComponent 
	 * Inizializza i componenti della GUI
	 */
	initComponent : function() {

		this.title = i18n.getMsg("titleCatalogRecords");
		var grid = this;
		var xg = Ext.grid;
		var expander = new Ext.grid.RowExpander({
			lazyRender : true,
			enableCaching: false,	//needed to catch events of buttons
		
			expandAll : function() {
				for (var i = 0; i < this.grid.getStore().getCount(); i++) {
					this.expandRow(i);
				}
			},
			/**
			 * Collapse all rows
			 */
			collapseAll : function() {
				for (var i = 0; i < this.grid.getStore().getCount(); i++) {
					this.collapseRow(i);
				}
			},
			tpl : new Ext.XTemplate(
				/*--thumbnail--*/
				'<tpl if="thumbnail">'+
				'<tpl for="thumbnail">'+
				'<img src="{value}" class="csw-viewer-thumb" '+
						'style="" '+
						'alt="{description}" '+	
						'type="{protocol}" '+
				'>'+
				'</tpl>'+
				'</tpl>'+
				
				/*--showed fields--*/
				'<p><b>' + i18n.getMsg("abstract") + ': </b>{abstract}</p><br>'+
				'<p><b>' + i18n.getMsg("subject") + ': </b>{subject}</p><br>'+
				/*--downloads --*/
				'<tpl if="downloads">'+
				'{[this.getDownloadsLinks(values)]}'+
				'</tpl>'+
					
				
				
				
				/*--buttons--*/
				'<table class="expander-button-table" align="right" cellspacing="0" cellpadding="0" border="0" style="table-layout:auto"><tr>'+
				/*Show Metadata*/

				'<td align="right">'+
				
						'<table class="x-btn x-btn-text-icon" cellspacing="0" style="width:130px">' +
						'<tbody class="x-btn-small x-btn-icon-small-left">' +
						'<tr>' +
						'<td class="x-btn-tl">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'<td class="x-btn-tc"></td>' +
						'<td class="x-btn-tr">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'</tr>' +
						'<tr>' +
						'<td class="x-btn-ml">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'<td class="x-btn-mc">' +
						'<em class="" unselectable="on">' +
						'<button type="button" id=\'{[this.getButtonMDId(values)]}\' class="x-btn-text icon-info"> ' + i18n.getMsg("viewMetadata") + '</button>' +
						'</em>' +
						'</td>' +
						'<td class="x-btn-mr">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'</tr>' +
						'<tr>' +
						'<td class="x-btn-bl">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'<td class="x-btn-bc"></td>' +
						'<td class="x-btn-br">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>' +
				'</td>'+
				/*View Map*/
				'<td align="right">'+
					'<tpl if="map.length ">'+
						'<table class="x-btn x-btn-text-icon" cellspacing="0" style="width:130px" >' +
						'<tbody class="x-btn-small x-btn-icon-small-left">' +
						'<tr>' +
						'<td class="x-btn-tl">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'<td class="x-btn-tc"></td>' +
						'<td class="x-btn-tr">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'</tr>' +
						'<tr>' +
						'<td class="x-btn-ml">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'<td class="x-btn-mc">' +
						'<em class="" unselectable="on">' +
                            '<button type="button" ' +
                                ' id=\'{[this.getButtonMapId(values)]}\'  class=\'x-btn-text icon-layers\' >'+
                                i18n.getMsg("viewMap") + '</button>'+
						'</em>' +
						'</td>' +
						'<td class="x-btn-mr">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'</tr>' +
						'<tr>' +
						'<td class="x-btn-bl">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'<td class="x-btn-bc"></td>' +
						'<td class="x-btn-br">' +
						'<i>&nbsp;</i>' +
						'</td>' +
						'</tr>' +
						'</tbody>' +
						'</table>' +
					'</tpl>'+
					'<tpl if="!map.length">'+
						//'<button type="button" '+
							//	'disabled="disabled" >'+
					'</tpl>'+
				'</td>'+
				/*View BBox*/
				'<td align="right" >'+
					'<table class="x-btn x-btn-text-icon" cellspacing="0"  style="width:130px" >' +
					'<tbody class="x-btn-small x-btn-icon-small-left">' +
					'<tr>' +
					'<td class="x-btn-tl">' +
					'<i>&nbsp;</i>' +
					'</td>' +
					'<td class="x-btn-tc"></td>' +
					'<td class="x-btn-tr">' +
					'<i>&nbsp;</i>' +
					'</td>' +
					'</tr>' +
					'<tr>' +
					'<td class="x-btn-ml">' +
					'<i>&nbsp;</i>' +
					'</td>' +
					'<td class="x-btn-mc">' +
					'<em class="" unselectable="on">' +
					'<button type="button" class="x-btn-text icon-mapgo"'+
											' id=\'{[this.getButtonBBId(values)]}\'  >' + i18n.getMsg("viewBbox") + ' </button>'+
					'</em>' +
					'</td>' +
					'<td class="x-btn-mr">' +
					'<i>&nbsp;</i>' +
					'</td>' +
					'</tr>' +
					'<tr>' +
					'<td class="x-btn-bl">' +
					'<i>&nbsp;</i>' +
					'</td>' +
					'<td class="x-btn-bc"></td>' +
					'<td class="x-btn-br">' +
					'<i>&nbsp;</i>' +
					'</td>' +
					'</tr>' +
					'</tbody>' +
					'</table>' +
				'</tr></table>'
			,{
					
			/* --These 3 associate functions to buttons dinamically --*/
					getButtonMDId: function(values) {
						var result = Ext.id()+"_ButtonMD";
						//ADDS LISTENER FOR ALL META DATA
						this.addListenerMD.defer(1,this, [result,values]);
						return result;
					},
					
					getButtonMapId: function(values) {
						var result = Ext.id()+"_ButtonMap";						
						this.addListenerMap.defer(1,this, [result,values]);
						return result;
					},
					
					getButtonBBId: function(values) {
						var result = Ext.id()+"_ButtonBB";
						this.addListenerBB.defer(1,this, [result,values]);
						return result;
					},
					addListenerMD: function(id,values) {
						Ext.get(id).on('click', function(e){
							//open GN inteface related to this resource
							if(values.identifier){
							window.open(values.metadataWebPageUrl);
							//Shows all DC values
							}else{
								//TODO create dc visual
								var text="<ul>";
								var dc=values.dc;
								//eg. URI
								for (var el in dc){
										if (dc[el] instanceof Array){
											//cicle URI array
											for(var index=0;index<dc[el].length;index++){
												
												
												//cicle attributes of dc
												if(dc[el][index].value){
													text+="<li><strong>"+el+":</strong> ";
													for(name in dc[el][index]){
														text+="<strong>"+name+"</strong>="+dc[el][index][name]+" ";
														
													}
													text+="</li>";
												}else if(el=="abstract") {
													text+="<li><strong>abstract:</strong> "+dc[el][index]+"</li> ";
												}else{
													//DO NOTHING
												}
											}
										
											
										}
								}
								dc+="</ul>";
								var dcPan=new Ext.Panel({
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
						})
					},
					//View map
					addListenerMap: function(id,values) {
						Ext.get(id).on('click', function(e){
						
							e.stopEvent();
							var xx='';
							var map=values.map;//array
							var bb=values.bounds;
							var mapInfo=new Array();
							for(var index =0;index< map.length;index++){
								mapInfo.push({wms: map[index].value, layer: map[index].name, description: map[index].description})
							}
                            var LayerInfo={
                                title: values.title,
                                crs: values.projection,
                                layers:mapInfo,
                                bbox: values.bounds,
                                uuid: values.identifier,
                                gnURL: values.absolutePath.substring(0,values.absolutePath.length-3)
                            };
							
							
							//TODO do elements
							grid.findParentByType("csw").fireEvent('ViewMap', LayerInfo ) ;
						
						});
					},
					addListenerBB: function(id,values) {
						Ext.get(id).on('click', function(e){
							var ret={
								bbox:values.bounds,
								crs:values.projection
							};
							grid.findParentByType("csw").fireEvent('zoomToExtent', ret );
						
						});
					},
					//create download anchors
					getDownloadsLinks: function(values){
                        var downloads=values.downloads;
                        var links='';
                        /* uncomment to show downloads */
                        /*
                        links='<b>downloads:</b>';
                        if( !(downloads instanceof Array) ) return '';
                        for(var i =0;i<downloads.length;i++){
                            //TODO icons
                            links+='<a href="'+downloads[i].value+'">'+downloads[i].name+'</a> ';
                        }
                        */
                        return links;
					}
			})
			
		});
		
		this.cm = new xg.ColumnModel({
			defaults : {
				width : 20,
				sortable : false
			},
			columns : [ expander, {
				id : 'title',
				header : i18n.getMsg("title"),
				dataIndex : "title",
				sortable : false
			}, {
				id : 'subject',
				header : i18n.getMsg("subject"),
				dataIndex : "subject",
				sortable : false
			},{
				id : 'creator',
				header : i18n.getMsg("creator"),
				dataIndex : 'creator',
				sortable : false
			},{
				id : 'modified',
				header : i18n.getMsg("modified"),
				dataIndex : 'date',
				sortable : false
			
			}]
		});

		this.viewConfig = {
			forceFit : true
		};

		this.plugins = expander;
		this.store = new Ext.data.Store({
			reader : new CSWRecordsReader({}),
			autoLoad : false
		});
		
		
		this.bbar = new CSWPagingToolbar({
			pageSize : this.config.limit, 
			store : this.store,
			grid:this,
			displayInfo : true,
			displayMsg : i18n.getMsg("bbar.display"),
			emptyMsg : i18n.getMsg("bbar.empty"),
			beforePageText : i18n.getMsg("bbar.page"),
			firstText : i18n.getMsg("bbar.firstPage"),
			lastText : i18n.getMsg("bbar.lastPage"),
			prevText : i18n.getMsg("bbar.prevPage"),
			nextText : i18n.getMsg("bbar.nextPage"),
			refreshText: i18n.getMsg("bbar.refresh"),
			afterPageText : i18n.getMsg("bbar.afterPageText")
		});

		CSWGrid.superclass.initComponent.call(this);
	},
	
	/**
	 * Method: initParameters 
	 * Inizializza i parametri della griglia. 
	 *
	 * options - {Object} opzioni di inizializzazione per il <CSWHttpProxy>
	 */
	initParameters : function (options) {
		options.XDProxy = this.config.XDProxy;
		options.cswVersion = this.config.cswVersion;
		options.limit = this.config.limit;
		options.timeout = this.config.timeout;
		this.store.proxy = new CSWHttpProxy(options);
		//setting 
		this.store.proxy.on("exception", function( DataProxy, type,  action,  options, response,args){
				this.loadMask.hide();
        
				if(type=="remote"){
                        Ext.Msg.show({
                            title: i18n.getMsg("serverError.title"),
                            msg: i18n.getMsg("serverError.serverError.invalid"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    
                
                }else if(type=="response"){//timeout
                    if(!args && response.isTimeout && response.isTimeout==true){//TimeOut
                        Ext.Msg.show({
                            title: i18n.getMsg("timeout.title"),
                            msg: i18n.getMsg("timeout.description"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }else if (!args){//server Error
                       Ext.Msg.show({
                         title: i18n.getMsg("serverError.title"),
                         msg: i18n.getMsg("serverError.invalid")+ ":"+response.status+ " "+response.statusText,
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                       });
                    }else{//parsing error
                        Ext.Msg.show({
                         title: i18n.getMsg("serverError.title"),
                         msg: i18n.getMsg("serverError.catalogException"),
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                       });
                    
                    
                    }
                }
				this.store.fireEvent("loadexception"); 
                
		}, this);
		
		
		//event Handling
		this.store.on("beforeload", function (store , options) {
			store.proxy.updateRequest(options.params);
		},this);
		
		//used for get the base url for thumnails and geonetwork resource, NEEDED if using x-domain proxy
		this.store.on("load",function (store,records,options){
			var catalogChooser = this.findParentByType("csw").searchTool.catalogChooser;
			var configOptions = catalogChooser.getStore().getAt(catalogChooser.getSelectedIndex());
			
			var url=store.proxy.currentCatalog.split('?')[0];
			var catalogOpt = store.proxy.catalogOptions;
			var metaDataOptions = configOptions.get("metaDataOptions") || {};
			for(var i=0;i<records.length;i++){
				var thumb;
				records[i].set('absolutePath',url);
				var identifier = records[i].get("identifier");
				//default geonetwork url is the url of csw without 
				var metadataBase = metaDataOptions.base ? metaDataOptions.base : url.substring(0,url.length-3) +"metadata.show";
				var metadataIdParam = metaDataOptions.idParam ? metaDataOptions.idParam : "uuid";
				var uuid = identifier;
				//for some catalogs the identifier must be splitted
				if("idIndex" in metaDataOptions){
					var uuid = identifier[metaDataOptions.idIndex];
				}
				var queryString = metadataIdParam + "=" + uuid;
				if (metaDataOptions.additionalParams){
					for(var parName in metaDataOptions.additionalParams){
						queryString += "&"+parName+"="+metaDataOptions.additionalParams[parName];
					}
				}
				var metadataWebPageUrl = metadataBase + "?"+queryString;
				records[i].set("metadataWebPageUrl",metadataWebPageUrl);
				//metadataUrl = values.absolutePath.substring(0,values.absolutePath.length-3+"metadata.show?uuid="+values.identifier);
				//set thumbnail to absolute path
				if( thumb = records[i].get('thumbnail') ){
					var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
					if(!regexp.test(thumb.value)){
						thumb.value = url +"/"+ thumb.value ;
					}
					records[i].set(	'thumbnail',thumb);
					
				}
			}
			
		},this);
		
		this.enable();
		this.store.load(options.params);
	}

});
