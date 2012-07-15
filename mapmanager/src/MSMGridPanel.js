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
 * Class: MSMGridPanel
 * This is the most important component.
 * Upload the store (RESTful request to GeoStore) in the grid.
 * The grid contains the plugin RowExpander that allows the display of buttons used to view, edit and delete resources saved within Geostore.
 * 
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 *
 */
MSMGridPanel = Ext.extend(Ext.grid.GridPanel, {    
    /**
     * Property: id
     * {string} id of gridPanel
     * 
     */
    id: 'id_geostore_grid',
    /**
     * Property: config
     * {object} object for configuring the component. See <config.js>
     * 
     */
    config: null, 
    /**
    * Property: border
    * {boolean} If set to true, a border is drawn.
    * 
    */ 
    border: false,
    /**
    * Property: enableHDMenu
    * {boolean} If set to true a menu is added to each column that allows the column sorting.
    * 
    */ 
    enableHdMenu: true,
    /**
    * Property: autoScroll
    * {boolean} if set to true allows the appearance of the scrollbar if the content exceeds the size of the component
    * 
    */  
    autoScroll: true,
    /**
    * Property: title
    * {string} title to associate with the panel that contains the grid
    * 
    */
    title: null,
    /**
    * Property: msg
    * {string} string to add in loading message
    * 
    */
    msg: 'Loading...',
    /**
    * Property: loadMask
    * {object} to mask the grid while loading
    * 
    */
    loadMask: true,
    /**
    * Property: murl
    * {url} MapComposer URL
    * 
    */
    murl: null,
    /**
    * Property: purl
    * {url} rest/extjs/search URL
    * 
    */
    purl: null,
    /**
    * Property: geoBaseUrl
    * {url} rest/resources URL
    * 
    */
    geoBaseUrl: null,
    /**
    * Property: purldel
    * {url} rest/resources/resource URL
    * 
    */
    purldel: null,
    /**
    * Property: start
    * {integer} start param for the first page load
    * 
    */    
    start: 0,
    /**
    * Property: limit
    * {integer} limit param for the first page load
    * 
    */
    limit: 5,
    /**
    * Property: limit
    * {integer} limit param for the first page load
    * 
    */
    msmTimeout: 30000,
    /**
    * Property: textSearch
    * {string} string to add SearchTool search button
    * 
    */   
    textSearch: 'Search',
    /**
    * Property: tooltipSearch
    * {string} string to add in SearchTool search tooltip
    * 
    */   
    tooltipSearch: 'Search Map By Name',
    /**
    * Property: textReset
    * {string} string to add in SearchTool reset button
    * 
    */   
    textReset: 'Reset',
    /**
    * Property: tooltipReset
    * {string} string to add in SearchTool reset tooltip
    * 
    */   
    tooltipReset: 'Reset All Filters',
    /**
    * Property: gridResourceId
    * {string} title grid Resource Id
    * 
    */  
    gridResourceId: "Resource Id",
    /**
    * Property: gridName
    * {string} title grid Name
    * 
    */  
    gridName: "Name",
    /**
    * Property: gridOwner
    * {string} title grid Owner
    * 
    */  
    gridOwner: "Owner",
    /**
    * Property: gridDescription
    * {string} title grid Description
    * 
    */  
    gridDescription: "Description",
    /**
    * Property: gridDateCreation
    * {string} title grid Date Creation
    * 
    */  
    gridDateCreation: "Date Creation",
    /**
    * Property: gridLastUpdate
    * {string} title grid Last Update
    * 
    */  
    gridLastUpdate: "Last Update",
    /**
    * Property: errorTitle
    * {string} title server error
    * 
    */  
    errorTitle: 'Request failure',
    /**
    * Property: errorMsg_500
    * {string} message server error for 500 status code
    * 
    */  
    errorMsg_500: 'The server returns HTTP status code 500! </br></br>Check the log!',
    /**
    * Property: errorMsg_501
    * {string} message server error for 501 status code
    * 
    */  
    errorMsg_501: 'The server returns HTTP status code 501! </br></br>The server does not support all that is needed for the request to be completed!',
    /**
    * Property: errorMsg_404
    * {string} message server error for 404 status code
    * 
    */  
    errorMsg_404: 'The server returns HTTP status code 404!. </br></br>The resource you are looking for cannot be found!',
    /**
    * Property: errorMsg_408
    * {string} message server error for 404 status code
    * 
    */  
    errorMsg_timeout: 'Request Timeout!',
    /**
    * Property: textViewMap
    * {string} string to add in ViewMap button
    * 
    */
    textViewMap: '', //'View Map',
    /**
    * Property: tooltipViewMap
    * {string} string to add in ViewMap tooltip
    * 
    */
    tooltipViewMap: 'Open Map to read only',
    /**
    * Property: textCopyMap
    * {string} string to add in CopyMap button
    * 
    */
    textCopyMap: '', //'Clone Map',
    /**
    * Property: tooltipCopyMap
    * {string} string to add in CloneMap tooltip
    * 
    */
    tooltipCopyMap: 'Make a copy of this map',
    /**
    * Property: textEditMap
    * {string} string to add in EditMap button
    * 
    */
    textEditMap: '', //'Edit Map',
    /**
    * Property: tooltipEditMap
    * {string} string to add in EditMap tooltip
    * 
    */
    tooltipEditMap: 'Open Map to edit',
    /**
    * Property: textDeleteMap
    * {string} string to add in DeleteMap button
    * 
    */
    textDeleteMap: '', //'Delete Map',
    /**
    * Property: tooltipDeleteMap
    * {string} string to add in DeleteMap tooltip
    * 
    */
    tooltipDeleteMap: 'Delete Map',

	textUserManager: 'User Manager',

    /**
    * Property: textEditMetadata
    * {string} string to add in EditMetadata button
    * 
    */
    textEditMetadata: '', //'Edit Metadata',
    /**
    * Property: tooltipEditMetadata
    * {string} string to add in EditMetadata tooltip
    * 
    */
    tooltipEditMetadata: 'Edit Metadata',
    /**
    * Property: textSubmitEditMetadata
    * {string} string to add in EditMetadata button
    * 
    */
    textSubmitEditMetadata: '', //'Update',
    /**
    * Property: tooltipSubmitEditMetadata
    * {string} string to add in EditMetadata tooltip
    * 
    */
    tooltipSubmitEditMetadata: 'Update Metadata',
    /**
    * Property: metadataSaveSuccessTitle
    * {string} string to add in metadataSaveSuccess
    * 
    */
    metadataSaveSuccessTitle: "Success",
    /**
    * Property: metadataSaveSuccessMsg
    * {string} string to add in metadataSaveSuccess
    * 
    */
    metadataSaveSuccessMsg: "Metadata saved succesfully",
    /**
    * Property: metadataSaveFailString
    * {string} string to add in metadataSaveFail
    * 
    */
    metadataSaveFailTitle: "Metadata not saved succesfully",
    /**
    * Property: msgSaveAlertTitle
    * {string} string to add in confirm Title message when user closes map without save
    * 
    */
    msgSaveAlertTitle: 'Attention, your map is not saved!',
    /**
    * Property: msgSaveAlertBody
    * {string} string to add in confirm Body message when user closes map without save
    * 
    */
    msgSaveAlertBody: 'Do you really want to quit without saving it?',
    /**
    * Property: msgDeleteMapTitle
    * {string} string to add in confirm Title message when user deletes map
    * 
    */
    msgDeleteMapTitle: 'Attention',
    /**
    * Property: msgDeleteMapBody
    * {string} string to add in confirm Body message when user deletes map
    * 
    */
    msgDeleteMapBody: 'Do You want to delete this map?',
    /**
    * Property: msgSuccessDeleteMapTitle
    * {string} string to add in Success Title message when user deletes map
    * 
    */
    msgSuccessDeleteMapTitle: 'Success',
    /**
    * Property: msgSuccessDeleteMapBody
    * {string} string to add in Success Body message when user deletes map
    * 
    */
    msgSuccessDeleteMapBody: 'Map has been deleted',
    /**
    * Property:  msgFailureDeleteMapTitle
    * {string} string to add in Failure Title message when user deletes map
    * 
    */
    msgFailureDeleteMapTitle: 'Failed',
    /**
    * Property: msgFailureDeleteMapBody
    * {string} string to add in Failure Body message when user deletes map
    * 
    */
    msgFailureDeleteMapBody: 'Something wrong has appened',
    /**
     * Property: lang
     * {string} sets application locale
     * 
     */ 
    lang: "en",
    /**
     * Property: ajaxHeader
     * {object} inizialization of header without Authorization
     * 
     */ 
    ajaxHeader: {'Accept': 'application/json'},
    /**
     * Property: langSelector
     * {object} combo to select a locale parameter
     * 
     */ 
    langSelector: null,

    /**
     *  cache when we put short urls when they arrive from the async service
     */
	shortUrls: new Object(),
	
    /**
    * Constructor: initComponent 
    * Initializes the component
    * 
    */
    initComponent : function() {

		
        var searchString = '*';

        if (config.mcUrl){
            var murl = config.mcUrl;
        }
        
        if (config.geoSearchUrl){
            var purl = config.geoSearchUrl;
        }
        
        if(config.geoDelUrl){
            var purldel = config.geoDelUrl;
        }

		if(config.geoBaseUrl){
			var geoBaseUrl = config.geoBaseUrl;
		}
        
        //inizialization of MSMLogin class
        this.login = new MSMLogin({
            grid: this
        });
		


        //An object that contains the string to search the resource
        this.inputSearch = new Ext.form.TextField({
            id: 'id-inputSearch',
            style: 'margin-right:8px; margin-left:8px;',
            listeners: {
                specialkey: function(f,e){
                    if (e.getKey() == e.ENTER) {
                        searchString = grid.inputSearch.getValue();
                        if(searchString==null || searchString == 'undefined' || searchString == ''){
                            searchString = '*';
                        }
                        grid.getBottomToolbar().bindStore(grid.store, true);
                        grid.getBottomToolbar().doRefresh();
                        expander.collapseAll();
                    }
                },
                render: function(c) {
                    c.getEl().on('keyup', function() {
                            Ext.getCmp('searchBtn').enable();
                            Ext.getCmp('clearBtn').enable();
                    }, c);
                }
            }
        });
        
        var grid = this;

        var expander = new Ext.ux.grid.RowExpander({
            /**
            * Property: scope
            * {object} set the scope
            * 
            */
            scope: this,
            /**
            * Property: enableCaching
            * {boolean} catch events of buttons
            * 
            */
            enableCaching: false,
            
            /**
             * Private: expandAll all rows of the grid
             * 
             */
            expandAll : function() {
                for (var i = 0; i < this.grid.store.getCount(); i++) {
                    this.expandRow(i);
                }
            },
            
            /**
             * Private: Collapse all rows of the grid
             * 
             */            
            collapseAll : function() {
                for (var i = 0; i < this.grid.store.getCount(); i++) {
                    this.collapseRow(i);
                }
            },
            listeners: {
                 scope: this,
                 expand: function(){

                    //I will assume that if we have one type of button we have them all
                    //If not we'll just exit
                    //if ($(".twitter-share-button").length == 0) return;

                    //Twitter
                    if (typeof (twttr) != 'undefined') {
                        twttr.widgets.load();
                    } else {
                        //$.getScript('http://platform.twitter.com/widgets.js');
                        Ext.Loader.load('http://platform.twitter.com/widgets.js');
                    }

                    //Facebook
                    if (typeof (FB) != 'undefined') {
                        FB.XFBML.parse();
                    } else {
                        var langFB = grid.lang == "en" ? "en_US" : "it_IT";;
                        
                        //var element = document.getElementById('facebook-jssdk');
                        //if(!element){
                            var fun = function(d, s, id) {
                                var js, fjs = d.getElementsByTagName(s)[0];
                                if (d.getElementById(id)) return;
                                js = d.createElement(s); js.id = id;
                                js.src = "//connect.facebook.net/" + langFB + "/all.js#xfbml=1";
                                fjs.parentNode.insertBefore(js, fjs);
                            }
                            fun(document, 'script', 'facebook-jssdk');
                        //}
                        //Ext.Loader.load("http://connect.facebook.net/it_IT/all.js#xfbml=1&cookie=1&status=1&channelUrl='http://localhost:8080/MapStoreManager'");
                    }

                }                
            },
            /**
             * Private: metadataEdit Change the name and description of the map
             * 
             * name - {string} name of the Map
             * mapId - {number} id of Map
             * desc - {string} description of the Map
             * 
             */
            metadataEdit: function(mapId,name,desc){
                var win = new Ext.Window({
                    width: 415,
                    height: 200,
                    resizable: false,
                    modal: true,
                    items: [
                        new Ext.form.FormPanel({
                            width: 400,
                            height: 150,
                            items: [
                                {
                                  xtype: 'fieldset',
                                  id: 'name-field-set',
                                  title: grid.textEditMetadata,
                                  items: [
                                      {
                                            xtype: 'textfield',
                                            width: 120,
                                            id: 'diag-text-field',
                                            fieldLabel: grid.gridName,
                                            value: name
                                      },
                                      {
                                            xtype: 'textarea',
                                            width: 200,
                                            id: 'diag-text-description',
                                            fieldLabel: grid.gridDescription,
                                            value: desc                
                                      }
                                  ]
                                }
                            ]
                        })
                    ],
                    bbar: new Ext.Toolbar({
                        items:[
                            '->',
                            {
                                text: grid.textSubmitEditMetadata,
                                tooltip: grid.tooltipSubmitEditMetadata,
                                iconCls: "accept",
                                id: "resource-addbutton",
                                scope: this,
                                handler: function(){      
                                    win.hide(); 
                                    
                                    var mapName = Ext.getCmp("diag-text-field").getValue();        
                                    var mapDescription = Ext.getCmp("diag-text-description").getValue();
                                    
									// get info about logged user if any
									var auth = grid.login.getToken();
									// fetch base url
									var url =  config.geoBaseMapsUrl; // 'http://localhost:8080/geostore/rest/resources';

									// get the api for GeoStore
									var geostore = new GeoStore.Maps(
														{ authorization: auth,
														  url: url
														 }).failure( function(data){ 
																	  Ext.Msg.show({
							                                             title: grid.metadataFailSuccessTitle,
							                                             msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
							                                             buttons: Ext.Msg.OK,
							                                             icon: Ext.MessageBox.ERROR
							                                          });	
														});
									// update metadata for the selected map
									geostore.update(
											mapId, 
											{name:mapName, description: mapDescription},
											function(data){ // callback
												 var reload = function(){
		                                                grid.getBottomToolbar().bindStore(grid.store, true);
		                                                grid.getBottomToolbar().doRefresh();
		                                                expander.collapseAll();
		                                          };

		                                          Ext.Msg.show({
		                                               title: grid.metadataSaveSuccessTitle,
		                                               msg: data.statusText + " - " + grid.metadataSaveSuccessMsg,
		                                               buttons: Ext.Msg.OK,
		                                               fn: reload,
		                                               icon: Ext.MessageBox.OK,
		                                               scope: this
		                                          });
										   });

                                    win.destroy(); 
                                }
                            }
                        ]
                    })
                });
                
                win.show();
            },

			/**
             * Private: cloneMap 
             *
             *   mapId - {string} id of the map to be cloned
             *  make a copy of the selected map
             */
			cloneMap: function(mapId){
				
				// TODO refactoring!
				// this code is repeated several times within this file
				 var reload = function(){
                        grid.getBottomToolbar().bindStore(grid.store, true);
                        grid.getBottomToolbar().doRefresh();
                        expander.collapseAll();
                  };
			
			
			  	// get info about logged user if any
			    var auth = grid.login.getToken();
				// fetch base url
				var url =  config.geoBaseMapsUrl; // 'http://localhost:8080/geostore/rest/resources';
	
				// get the api for GeoStore
				var geostore = new GeoStore.Maps(
										{ authorization: auth,
										  url: url
										 }).failure( function(response){ 
											console.error(response); 
											  Ext.Msg.show({
	                                             title: grid.metadataFailSuccessTitle,
	                                             msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
	                                             buttons: Ext.Msg.OK,
	                                             icon: Ext.MessageBox.ERROR
	                                          });	
										});
				geostore.findByPk(mapId, function(data){
					// make a copy of the current object
					var copy = new Object;
					copy.name = data.name;
					copy.description = data.description;
					copy.blob = data.blob;
					copy.owner = grid.login.getCurrentUser();
					geostore.create(copy, function(data){
						reload();
					});
				}, {full:true});
				
			},
			
			/**
             * Private: openUserManager open the user manager window
             * 
             * 
             */
			openUserManager: function(){
				
				var win = new Ext.Window({
					   title: grid.textUserManager,
					   iconCls: "open_usermanager",
				       width: 420, height: 210, resizable: true, modal: true, // autoScroll:true,
				       items: new UserManagerView( {
								auth: grid.login.getToken(),
								url: config.geoBaseUsersUrl
							})
				});				
				
				// show window
				win.show();
			},

            /**
             * Private: openMapComposer 
             * 
             * mapUrl - {url} MapComposer URL
             * userProfile - {string} define if users are in edit or in view mode
             * idMap - {number} id of Map to open
             * desc - {string} description of the Map
             * 
             */
            openMapComposer : function(mapUrl,userProfile,idMap,desc){
					var src = mapUrl + '?locale=' + grid.lang + userProfile;
					
					if(idMap != -1){
						src += '&mapId=' + idMap;
					}
					
                    var iframe = new Ext.IframeWindow({
                        id:'idMapManager',
                        width:900,
                        height:650,
                        collapsible:false,
                        maximizable: true,
                        maximized: true,
                        closable: true,
                        modal: true,
                        closeAction: 'close',
                        constrainHeader: true,
                        maskEmpty: true, 
                        title: (userProfile == "&auth=true" ? "Map Composer - " : "Map Viewer - ") + desc,
                        src: src,
                        onEsc: Ext.emptyFn,
                        listeners: {
						    close: function(p){
								//window.scrollTo(0,0);
								
								// //////////////////////////////////////////////
								// To maintaing evantually the body scrollbar.
								// //////////////////////////////////////////////
								
								this.removeClass('x-window-maximized');
								this.container.removeClass('x-window-maximized-ct');
							},
                            afterRender: function(){
                                function setAuth(){
                                    var userAuth = grid.store.proxy.getConnection().defaultHeaders;
                                    if(userAuth && userProfile == '&auth=true'){
                                        var mapIframe = document.getElementById('mapiframe');
                                        if (mapIframe.contentWindow.app){
                                            mapIframe.contentWindow.app.setAuthHeaders(userAuth.Authorization);
                                            clearTimeout(timer);
                                        }
                                    }
                                };
                                var timer = setInterval(setAuth, 3000);
                            },
                            beforeClose: function(){
                                var mapIframe = document.getElementById('mapiframe');
                                var modified = mapIframe.contentWindow.app.modified;
                                
                                if (modified == true && userProfile == '&auth=true'){
                                    if(!this.confirmClosed) {
                                        Ext.MessageBox.show({
                                            title: grid.msgSaveAlertTitle,
                                            msg: grid.msgSaveAlertBody,
                                            buttons: Ext.MessageBox.YESNO,
                                            fn: function(btnId) {
                                                if (btnId === 'yes') {
                                                    this.confirmClosed = true; 
                                                    this[this.closeAction]();
                                                    grid.getBottomToolbar().bindStore(grid.store, true);
                                                    grid.getBottomToolbar().doRefresh();
                                                    expander.collapseAll();
                                                }
                                            },
                                            animEl: 'mb4',
                                            icon: Ext.MessageBox.WARNING,
                                            scope: this
                                        });
                                        return false;
                                    }
                                }else {
                                    grid.getBottomToolbar().bindStore(grid.store, true);
                                    grid.getBottomToolbar().doRefresh();
                                    expander.collapseAll();
                                    return true;
                                }
                            }
                        }
                    });
                iframe.show();
            },

            tpl : new Ext.XTemplate( // expander-button-table
                grid.createTemplate(murl, grid.lang), 
				{
					
					/**
                    * Private: getShortLink
                    * 
                    * 
                    * return - {string} get map composer short link or null if not present
                    * 
                    */
					getShortLink: function(id, sendRequest){
						console.log('looking for ' + id + ', found: ' +grid.shortUrls[id]);
						
						// verify if we already have this uri in cache
						if ( grid.shortUrls[id] === undefined && sendRequest ){
							// shorten urls for Twitter
							var longUrl = config.mcUrl + '?locale=' + grid.lang + '&amp;auth=false&amp;fullScreen=true&amp;mapId='+id;
							var shortener = new Google.Shortener({
										appid: config.googleApi
							}).failure(function(response){
								console.error(response);
								/*Ext.Msg.show({
						           title: grid.metadataFailSuccessTitle,
						           msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
						           buttons: Ext.Msg.OK,
						           icon: Ext.MessageBox.ERROR
						        });*/
							});
							shortener.shorten(
									longUrl,
									function(response){
										grid.shortUrls[id] = response.id;
										console.log('created short url ' + grid.shortUrls[id] + ' for map ' + id);
								});
						}
						
						// return even if it is not ready
						return grid.shortUrls[id];
					},
					
					/**
                    * Private: isNotGuest
                    * 
                    * 
                    * return - {boolean} true if the current user is not a guest
                    * 
                    */
					isNotGuest: function(){
						return ! grid.login.isGuest();
					},
					
                    /**
                    * Private: getButtonERId
                    * 
                    * values - {array} fields of the column grid
                    * button - {string} name button
                    * 
                    */
                    getButtonERId: function(values,button) {
                        var result = Ext.id()+button;
                        //adds listener for edit resource (Name and Description)
                        this.MapComposerER.defer(1,this, [result,values]);
                        return result;
                    },
                    /**
                    * Private: getCloneButton
                    * 
                    * values - {array} fields of the column grid
                    * 
                    */
                    getCloneButton: function(values) {
						// create a unique id for the clone button
                        var uniqueId = Ext.id()+'_cloneBtn';
                        //adds listener for clone map
                        this.bindCloneMapButton.defer(1,this, [uniqueId,values]);
						// return the button id
                        return uniqueId;
                    },
                    /**
                    * Private: getButtonVMId
                    * 
                    * values - {array} fields of the column grid
                    * button - {string} name button
                    * 
                    */
                    getButtonVMId: function(values,button,userProfile) {
                        var result = Ext.id()+button;
                        //adds listener for view and edit map
                        this.MapComposerVM.defer(1,this, [result,values,userProfile]);
                        return result;
                    },
                    /**
                    * Private: getButtonDMId
                    * 
                    * values - {array} fields of the column grid
                    * button - {string} name button
                    * 
                    */
                    getButtonDMId: function(values,button) {
                        var result = Ext.id()+button;
                        //Adds listener for delete map
                        this.MapComposerDM.defer(1,this, [result,values]);
                        return result;
                    },

					/**
					 * Private: bindCloneMapButton
					 * id - {string} button id
					 * values - {array} fields of the column grid
					 */
					bindCloneMapButton: function(id, values){
						Ext.get(id).on('click', function(e){
								var mapId = values.id;
	                            expander.cloneMap(mapId);
	                    });
						// if (grid.login.isGuest()){
						//	Ext.get(id).setVisible(false);
						// }
						
					},
                    /**
                    * Private: MapComposerER 
                    * 
                    * id - {number} button id
                    * values - {array} fields of the column grid
                    * userProfile - {string} define if users are in edit or in view mode
                    * 
                    */
                    MapComposerER : function(id,values){
                        Ext.get(id).on('click', function(e){
                            var mapId = values.id;
                            var name = values.name;
                            var desc = values.description;
                            expander.metadataEdit(mapId,name,desc);
                        });
                    },
                    /**
                    * Private: MapComposerVM 
                    * 
                    * id - {number} button id
                    * values - {array} fields of the column grid
                    * userProfile - {string} define if users are in edit or in view mode
                    * 
                    */
                    MapComposerVM : function(id,values,userProfile){
                        Ext.get(id).on('click', function(e){
                            var idMap = values.id;
                            var desc = values.name;
                            expander.openMapComposer(murl,userProfile,idMap,desc);
                        });
                    },
                    /**
                    * Private: MapComposerDM 
                    * 
                    * id - {number} button id
                    * values - {array} fields of the column grid
                    * 
                    */
                    MapComposerDM : function(id,values){
                        Ext.get(id).on('click', function(e){
                            var id = values.id;
                            Ext.Msg.confirm(grid.msgDeleteMapTitle, grid.msgDeleteMapBody, function(btn,text){
                                if (btn == 'yes'){
	
									// get info about logged user if any
									var auth = grid.login.getToken();
									// fetch base url
									var url =  config.geoBaseMapsUrl; 

									// get the api for GeoStore
									var geostore = new GeoStore.Maps(
																{ authorization: auth,
																  url: url
																 });
									geostore.failure( function(response){ 
														console.error(response); 
														Ext.MessageBox
														   .alert(grid.msgFailureDeleteMapTitle, grid.msgFailureDeleteMapBody);	
													});
									geostore.deleteByPk(id, function(response){
										 grid.getBottomToolbar().bindStore(grid.store, true);
                                         grid.getBottomToolbar().doRefresh();
                                         expander.collapseAll();
									});
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        });
                    }
                }
            )
        });
        
        this.loadMask = {msg: this.msg};
        
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true/*,
            listeners: {
                 rowselect: function(smObj, rowIndex, record) {
                     selRecordStore = record;
                }
            }*/
        });
        
        this.cm = new Ext.grid.ColumnModel({
            id: 'id_geostore_gcm',
            defaults: {
                width : 20/*,
                sortable : true*/
            },
            columns: [ expander, {
                id: 'id_resource',
                header: this.gridResourceId,
                dataIndex: 'id',
                sortable: true,
                align: 'left',
                hidden: true
            },{
                id: 'id_name',
                header: this.gridName,
                dataIndex: 'name',
                sortable: true,
                align: 'left'
            },{
                id: 'id_owner',
                header: this.gridOwner,
                dataIndex: 'owner',
                sortable: true,
                align: 'left'
            },{
                id: 'id_description',
                header: this.gridDescription,
                dataIndex: 'description',
                sortable: true,
                align: 'left'
            },{
                id: 'creation',
                header: this.gridDateCreation,
                dataIndex: 'creation',
                sortable: true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
                align: 'left'
            },{
                id: 'lastUpdate',
                header: this.gridLastUpdate,
                dataIndex: 'lastUpdate',
                sortable: true,
                renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'),
                align: 'left'
            }]
        });

        this.viewConfig = {
            forceFit: true
        };
        
        this.plugins = expander;
    
        this.store = new Ext.data.JsonStore({
            storeId: 'id_geostore',
            autoDestroy: true,
            root: 'results',
            totalProperty: 'totalCount',
            successProperty: 'success',
            idProperty: 'id',
            remoteSort: false,
            fields: [{
                        name: "id",
                        type: "int"
                    },{
                        name: "name",
                        type: "string"
                    },{
                        name: "owner",
                        type: "string"
                    },{
                        name: "description",
                        type: "string"
                    },{
                        name: "creation",
                        type: "date",
                        dateFormat: 'c'
                    },{
                        name: "lastUpdate",
                        type: "date",
                        dateFormat: 'c'
                    },{
                        name: "canEdit",
                        type: "boolean"
                    },{
                        name: "canDelete",
                        type: "boolean"
                    }
            ],
            proxy: new Ext.data.HttpProxy({
                url: this.getUrl(searchString),
                restful: true,
                method : 'GET',
                disableCaching: true,
                timeout: (config.msmTimeout)?(config.msmTimeout):(this.msmTimeout),
                success: function (result){
					// hack to generate short urls
					// it is not a good solution!
					var maps = Ext.util.JSON.decode(result.responseText).results;
					for (var i=0; i<maps.length; i++){
						var map = maps[i];
						var mapid = map.id;
						// verify if we already have this uri in cache
						if ( grid.shortUrls[mapid] === undefined ){
							// send a request to shorten urls for Twitter
							var longUrl = config.mcUrl + '?locale=' + grid.lang + '&amp;auth=false&amp;fullScreen=true&amp;mapId='+mapid;
							// console.log('sent ' + longUrl);
							var shortener = new Google.Shortener({
									appid: config.googleApi
								}).failure(function(response){
									console.error(response);
								});
							var infamous = 	function(num){
									var result = function(response){
										grid.shortUrls[ num ] = response.id;
										console.log('created short url ' + grid.shortUrls[num] + ' for map ' + num);
									};
									return result;
								};
							shortener.shorten(
										longUrl,
										infamous(mapid)
									);
						}
					}
                },
                failure: function (result) {
                    switch(result.status) {
                        case 500:
                        searchString = '*';
                        grid.alertMsgServerError(grid.errorMsg_500);
                        break;
                        case 501:
                        searchString = '*';                        
                        grid.alertMsgServerError(grid.errorMsg_501);
                        break;
                        case 401: 
                        searchString = '*';
                        grid.alertMsgServerError(grid.errorMsg_404);
                        break;
                        case -1: 
                        searchString = '*';
                        grid.alertMsgServerError(grid.errorMsg_timeout);
                        break;  
                        default: 
                        searchString = '*';                        
                        grid.alertMsgServerError(grid.errorMsg_500);
                    }
                },
                defaultHeaders: this.ajaxHeader
            }),
            listeners:{
                beforeload:function(store, options){
                    store.proxy.setUrl(this.getUrl(searchString));
                },
                scope: this
            },
            sortInfo: { field: "creation", direction: "ASC" }
        });

        this.bbar = new MSMPagingToolbar({
            pageSize : (config.limit)?(config.limit):(this.limit),
            store : this.store,
            grid: this,
            displayInfo: true,
            listeners: {
                scope: this,
                change: function(){
                    expander.collapseAll();
                } 
            }
        });
       
		this.openUserManagerButton = new Ext.Button({
	            id: 'id_openUserManager_button',
	            text: this.textUserManager,
	            scope: this,
	            disabled: true,
	            iconCls: 'open_usermanager',
	            tooltip: this.tooltipUserManager,
	            handler: function(){
	                this.plugins.openUserManager();
	            }
	        });
        
        this.tbar = [grid.inputSearch,{
            id: 'searchBtn',
            text: this.textSearch,
            tooltip: this.tooltipSearch,
            iconCls: 'find',
            disabled: true,
            handler : function() {  
                    searchString = grid.inputSearch.getValue();
                    if(searchString==null || searchString == 'undefined'  || searchString == ''){
                        searchString = '*';
                    }
                    grid.getBottomToolbar().bindStore(grid.store, true);
                    grid.getBottomToolbar().doRefresh();
                    expander.collapseAll();
                }
            },'-',{
            id: 'clearBtn',
            text: this.textReset,
            tooltip: this.tooltipReset,
            iconCls: 'reset',
            disabled: true,
            handler : function() {  
                    grid.inputSearch.setValue('');
                    searchString = '*';
                    Ext.getCmp('searchBtn').disable();
                    Ext.getCmp('clearBtn').disable();
                    grid.getBottomToolbar().bindStore(grid.store, true);
                    grid.getBottomToolbar().doRefresh();
                    expander.collapseAll();
                } 
            },'->',
			

			this.login.userLabel,'-',this.openUserManagerButton,'-',this.login.loginButton,'-',this.langSelector,'-'
        ];
        
        // initializes the store with the parameters set in <config.js> otherwise uses the default
        this.store.load({
            params:{
                start: (config.start)?(config.start):(this.start),
                limit: (config.limit)?(config.limit):(this.limit)
            }
        });
        MSMGridPanel.superclass.initComponent.call(this, arguments);
    },
    
    /**
    * getUrl
    * 
    * searchString - {string} string to search through the resources of geostore
    * 
    */
    getUrl : function(srcStr) {
        var r = config.geoSearchUrl +  '*' + srcStr.replace(/\s+/g,"*") + '*';
        return r;
    },
    
    /**
    * alertMsgServerError
    * 
    * msgStatusCode - {string} message for WARNING request failure
    * 
    */
    alertMsgServerError : function(msgStatusCode){
        Ext.MessageBox.show({
            title: this.errorTitle,
            msg: msgStatusCode,
            buttons: Ext.MessageBox.OK,
            fn: this.resetSearchTool,
            animEl: 'mb4',
            icon: Ext.MessageBox.ERROR,
            scope: this
        });
    },

    /**
    * resetSearchTool
    * reset the Search Tool if server request failure
    */ 
    resetSearchTool : function(){
        Ext.getCmp('id-inputSearch').setValue('');
        Ext.getCmp('searchBtn').disable();
        Ext.getCmp('clearBtn').disable();
        this.getBottomToolbar().doRefresh();
    },

	createTemplate: function(murl, lang){
		var tpl = '<div style="background-color: #f9f9f9; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;<b>Description:</b> {description}<br/>'+
            '<table class="x-btn x-btn-text-icon" align="right" cellspacing="5" cellpadding="5" border="0" style="table-layout:auto">'+
                '<tr>';
		// in IE7 we need to set button property "padding" and table width otherwise buttons are stretched			
        tpl +=  '<td >'+
                        '<tpl if="canEdit==true">'+
                            '<table class="x-btn x-btn-text-icon" style="width:30px" cellspacing="0"  >' +
                            '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonERId(values,\'_editMetadataBtn\')]}\'>' +
                            '<tr>'+
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
                            '<em unselectable="on" class="">'+
                            '<button type="button" style="background-position:center;padding:10px;" class=" x-btn-text table_edit" title="' + this.tooltipEditMetadata + '" >' + this.textEditMetadata + '</button></em>'+
                            '</td>'+
                            '<td class="x-btn-mr">'+
                            '<i>&nbsp;</i>'+
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
                    '</td>'+
                    '<td >'+
                        '<tpl if="canDelete==true">'+
                            '<table class="x-btn x-btn-text-icon"  style="width:30px" cellspacing="0"  >' +
                            '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonDMId(values,\'_deleteBtn\')]}\'>' +
                            '<tr>'+
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
                            '<em unselectable="on" class="">'+
                            '<button type="button" style="background-position:center;padding:10px;"  class=" x-btn-text map_delete" title="' + this.tooltipDeleteMap + '" >' + this.textDeleteMap + '</button></em>'+
                            '</td>'+
                            '<td class="x-btn-mr">'+
                            '<i>&nbsp;</i>'+
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
                    '</td>'+
                    '<td >'+
                        '<tpl if="canEdit==true">'+
                            '<table class="x-btn x-btn-text-icon" style="width:30px" cellspacing="0"  >' +
                            '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonVMId(values,\'_editBtn\',\'&auth=true\')]}\'>' +
                            '<tr>'+
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
                            '<em unselectable="on" class="">'+
                            '<button type="button" style="background-position:center;padding:10px;" class=" x-btn-text map_edit" title="' + this.tooltipEditMap + '">' + this.textEditMap + '</button></em>'+
                            '</td>'+
                            '<td class="x-btn-mr">'+
                            '<i>&nbsp;</i>'+
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
                    '</td>'+
                    '<td >'+
                        '<table class="x-btn x-btn-text-icon" style="width:30px" cellspacing="0" >'+
                        '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getButtonVMId(values,\'_viewBtn\',\'&auth=false&fullScreen=true\')]}\'>'+
                        '<tr >'+
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
                        '<button type="button" style="background-position:center;padding:10px;" class="x-btn-text icon-layers" title="' + this.tooltipViewMap + '">' + this.textViewMap + '</button>'+
                        '</em>'+
                        '</td>'+
                        '<td class="x-btn-mr">'+
                        '<i>&nbsp;</i>'+
                        '</td>'+
                        '</tr>'+
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
                    '</td>';

						tpl += '<td >'+
						 '<tpl if="this.isNotGuest()">'+
	                        '<table class="x-btn x-btn-text-icon" style="width:30px" cellspacing="0" >'+
	                        '<tbody class="x-btn-small x-btn-icon-small-left" id=\'{[this.getCloneButton(values)]}\'>'+
	                        '<tr >'+
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
	                        '<button style="background-position:center;padding:10px;" type="button" id="'+ Ext.id() +'" class="x-btn-text clone_map" title="' + this.tooltipCopyMap + '"></button>'+
	                        '</em>'+
	                        '</td>'+
	                        '<td class="x-btn-mr">'+
	                        '<i>&nbsp;</i>'+
	                        '</td>'+
	                        '</tr>'+
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
	                    '</td>';
					
              tpl +=  '</tr>'+
            '</table>'+
        '</div>' +
		   '<tpl if="this.getShortLink(id, true)!=null">'+
            '<table align="left" cellspacing="0" cellpadding="0" border="0" style="table-layout:auto">'+
                '<tr>'+
                    '<td align="left">'+
                        '<span> <div class="fb-like" data-href=\'{[this.getShortLink(values.id, false)]}\' data-send="false" data-layout="button_count" data-width="80" data-show-faces="true"></div></span>'+
                    '</td>'+
                    '<td align="left">'+
                        '<a href="http://opensdi.geo-solutions.it/" class="twitter-share-button" data-url=\'{[this.getShortLink(values.id, false)]}\' data-text="MapComposer" data-count="horizontal" data-via="geosolutions_it" data-lang="' + this.lang + '"></a>'+
                    '</td>'+
                '</tr>'+
            '</table>'+
			'</tpl>';
		return tpl;
	}


});