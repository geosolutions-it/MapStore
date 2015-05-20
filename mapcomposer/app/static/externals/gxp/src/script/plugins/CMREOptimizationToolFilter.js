/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = QueryForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: CMREOptimizationToolFilter(config)
 *
 *    Plugin for filtering a layer using cql filters
 *    TODO Replace this tool with something that is less like GeoEditor and
 *    more like filtering.
 */
gxp.plugins.CMREOptimizationToolFilter = Ext.extend(gxp.plugins.WMSLayerFilter, {
    
    /** api: ptype = gxp_queryform */
    ptype: "gxp_cmre_optimization_tool",
    
	/**
	 * Property: osdi2ManagerRestURL
	 * {string} the OpenSDI2-Manager REST Url
	 */
	osdi2ManagerRestURL : null,
	
	/**
	 * Property: osdi2ManagerRestURL
	 * {string} the OpenSDI2-Manager REST Url
	 */
	CWIXPortalPIMTracksManagerURL : null,

    /** api: config[checkBoxFieldsetTitle]
     *  ``String``
     *  Text for query menu item (i18n).
     */
    checkBoxFieldsetTitle: "Stato",
    /** api: config[checkBoxTitle]
     *  ``String``
     *  Text for query menu item (i18n).
     */
    cancelButtonText:"Reset",
    updateButtonText:"Update Filter",
    layer:'postgis_sw:avviso',//TODO setup real layer to identify
    validationErrorMessage:"The sum of the values must be 1",
    source:'gsacque',
    costsTitle: "Objective Weighting Coefficients",
    updateEvents:['keyup','change','keydown'],
    globalSeparator: " OR ",
 	decimalPrecision: 3,
 	
 	optToolCategory: "OPT_TOOL_CONFIGS",

    /**
     * 
     */
    getFeatures: function(layerName) {
    	var me = this;


		var optimizationToolLayers = me.target.customData.optimizationToolLayers;
        var layers = me.target.mapPanel.layers.queryBy(function(a) {
            var name = a.get('name');
            var source = a.get('source') ;
            for(var i = 0 ; i <optimizationToolLayers.length; i++) {
            	if(name == optimizationToolLayers[i]){
            		if (layerName) {
            			if(name.indexOf(layerName)>0) return true;
            			else return false;
            		} else {
            			return true;
            		}
            	}
            }
            return false;
        }, me).getRange(); 
        for(var i=0;i<layers.length; i++){
        	var layerRecord  = layers[i];
        	var rec = layerRecord.getLayer();
        	
        	return rec.params.LAYERS;
        }
	/*
    	var callBack = function(filter) {
	        if (!filter)
	        	return;

        	var optimizationToolLayers = me.target.customData.optimizationToolLayers;
	        var layers = me.target.mapPanel.layers.queryBy(function(a) {
	            var name = a.get('name');
	            var source = a.get('source') ;
	            for(var i = 0 ; i <optimizationToolLayers.length; i++) {
	            	if(name == optimizationToolLayers[i]){
	            		if (layerName) {
	            			if(name.indexOf(layerName)>0) return true;
	            			else return false;
	            		} else {
	            			return true;
	            		}
	            	}
	            }
	            return false;
	        }, me).getRange(); 
	        for(var i=0;i<layers.length; i++){
	            var layerRecord  = layers[i];
	            if(!filter || filter == "" || filter =="()"){
	                filter ="INCLUDE";
	            }
	            
	            layerRecord.getLayer().mergeNewParams({
	                cql_filter:filter
	            });

	            var rec = layerRecord.getLayer();
		        var url = rec.url;
		        url += "?service=WFS" +
		                "&version=1.0.0" +
		                "&request=GetFeature" +
		                "&typeName=" + rec.params.LAYERS +
		                "&exceptions=application/json" +
		                "&outputFormat=application/json" + 
		                "&CQL_FILTER=(" + encodeURIComponent(rec.params.CQL_FILTER) + ")";
	
	            //show mask
	            var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
	            myMask.show();
	            OpenLayers.Request.POST({
	                //add the maxFeatures attribute if present to the test request
	                url: url ,
	                callback: function(request) {
	                    myMask.hide();
	
	                    if(request.status == 200){
	                        try
	                          {
	                          	//TODO
	                                var featureCollection = Ext.util.JSON.decode(request.responseText);
	                                Ext.Msg.show({
	                                    title: "featureCollection",
	                                    msg: request.responseText,
	                                    buttons: Ext.Msg.OK,
	                                    icon: Ext.MessageBox.OK
	                                });                        
	                          }
	                        catch(err)
	                          {
	                            // submit filter in a standard form (before check)
	                            //this.doDownloadPost(this.url, this.xml,outputFormat);
	                          }
	                          
	                    }else{
	                        Ext.Msg.show({
	                            title: "failedExport",
	                            msg: request.statusText,
	                            buttons: Ext.Msg.OK,
	                            icon: Ext.MessageBox.ERROR
	                        });
	                    }
	                },
	                scope: this
	            });  
	        };
	  	};
    	
    	this.generateFilter(callBack);
    	*/
    },
    
    /**
     * 
     */
    sendOTHGoldEmailMEssage: function(tracks, email, assets) {
    	// /oth/pim/OAAroutesEmail?email=&asset=1%2C2%2C3%2C4&layer=natocmre%3Aoaa_tracks_indian_ocean&sol_id=1&guid=4b3ede0d-7583-4d83-aa1a-bfb0ac5371b0
    	var url = this.CWIXPortalPIMTracksManagerURL + 'OAAroutesEmail/ALP?email='+encodeURIComponent(email)+'&asset='+encodeURIComponent(assets)+'&layer='+encodeURIComponent(tracks)+'&sol_id='+this.solutionId+'&guid='+this.guid;
    	//console.log(url);
    	
    	var me = this;
    	Ext.Ajax.request({
		   url: url,
		   method: 'GET',
		   //success: successHandler,
		   //failure: failureHandler,
		   success: function (response){
		   	Ext.Msg.show({
			   title: "OTH-Gold PIM Track",
			   msg: response.responseText,
			   closable: false,
			   width: 650,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
		   },
           failure: function (response){
           	Ext.Msg.show({
	            title: "OTH-Gold PIM Track - Error!",
	            msg: response.responseText,
	            width: 300,
	            buttons : Ext.Msg.OK,
	            icon: Ext.MessageBox.ERROR
	        });
	       },
		   scope: me,
		   headers: {
		       'Authorization':me.target.authToken
		   }
		});

/*
		var successHandler = function(response,opts){
	    	Ext.Msg.show({
			   title: "OTH-Gold PIM Track",
			   msg: 'OTH-Gold PIM Track was correctly Sent via E-Mail!',
			   closable: false,
			   width: 650,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
			console.log('OTH-Gold PIM Track - SUCCESS!');
		};
		
		var failureHandler = function(){
			Ext.Msg.show({
	            title: "OTH-Gold PIM Track - Error!",
	            msg: 'Error occurred while trying to send OTH-Gold PIM Track via E-Mail!',
	            width: 300,
	            buttons : Ext.Msg.OK,
	            icon: Ext.MessageBox.ERROR
	        });
			console.log('OTH-Gold PIM Track - FAILED!');
		};
*/

    },
    
    /**
     * 
     */
    sendOTHGoldTCPMEssage: function(tracks, tcpip, tcpport, assets) {
    	var url = this.CWIXPortalPIMTracksManagerURL + 'OAAroutesTCP/ALP?tcpip='+encodeURIComponent(tcpip)+'&tcpport='+encodeURIComponent(tcpport)+'&asset='+encodeURIComponent(assets)+'&layer='+encodeURIComponent(tracks)+'&sol_id='+this.solutionId+'&guid='+this.guid;
    	
    	var me = this;
    	Ext.Ajax.request({
		   url: url,
		   method: 'GET',
		   //success: successHandler,
		   //failure: failureHandler,
		   success: function (response){
		   	Ext.Msg.show({
			   title: "OTH-Gold PIM Track",
			   msg: response.responseText,
			   closable: false,
			   width: 650,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
		   },
           failure: function (response){
           	Ext.Msg.show({
	            title: "OTH-Gold PIM Track - Error!",
	            msg: response.responseText,
	            width: 300,
	            buttons : Ext.Msg.OK,
	            icon: Ext.MessageBox.ERROR
	        });
	       },
		   scope: me,
		   headers: {
		       'Authorization':me.target.authToken
		   }
		});

    },
    
    /**
     * 
     */
    getOTHGoldMEssageText: function(tracks, assets) {
    	// /oth/pim/OAAroutes?asset=1%2C2%2C3%2C4&layer=natocmre%3Aoaa_tracks_indian_ocean&sol_id=1&guid=4b3ede0d-7583-4d83-aa1a-bfb0ac5371b0
    	var url = this.CWIXPortalPIMTracksManagerURL + 'OAAroutes/ALP?asset='+encodeURIComponent(assets)+'&layer='+encodeURIComponent(tracks)+'&sol_id='+this.solutionId+'&guid='+this.guid;
    	//console.log(url);
    	
    	var me = this;
    	Ext.Ajax.request({
		   url: url,
		   method: 'GET',
		   success: function (response){
		   	Ext.Msg.show({
			   title: "OTH-Gold PIM Track",
			   msg: response.responseText,
			   closable: false,
			   width: 650,
			   height: 800,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
		   },
           failure: function (response){
           	Ext.Msg.show({
	            title: "OTH-Gold PIM Track - Error!",
	            msg: response.responseText,
	            width: 300,
	            buttons : Ext.Msg.OK,
	            icon: Ext.MessageBox.ERROR
	        });
	       },
		   scope: me,
		   headers: {
		       'Authorization':me.target.authToken
		   }
		});

    },
    
    /**
     * 
     */
    updateFilter: function() {
    	var me = this;
    	
    	var callBack = function(filter) {
	        if (!filter)
	        	return;
	        	
	        var optimizationToolLayers = me.target.customData.optimizationToolLayers;
	        var layers = me.target.mapPanel.layers.queryBy(function(a) {
	            var name = a.get('name');
	            var source = a.get('source') ;
	            for(var i = 0 ; i <optimizationToolLayers.length; i++) {
	            	if(name == optimizationToolLayers[i]){
	            		return true;
	            	}
	            }
	            return false;
	            
	        }, me).getRange(); 
	        for(var i=0;i<layers.length; i++){
	            var layerRecord  = layers[i];
	            if(!filter || filter == "" || filter =="()"){
	                filter ="INCLUDE";
	            }
	            
	            layerRecord.getLayer().mergeNewParams({
	                cql_filter:filter
	            });
	        }
	        
	        me.storeFilterByUser();
    	};
    	
    	this.generateFilter(callBack);
    },
    /**
     * process filter
     */
    generateFilter:function(callBack) {
        //TODO manage disabled fieldset
        var globalFilter = [];
        //get the fieldsets array
        var fieldsets =this.form.filterFieldsets.items.getRange();
        
        var me = this;
        
        var valuesCallBack = function(values) {
	        if(values.length ==0){
	        	return'INCLUDE';
	        }
	        var valid = me.validateCoefficients(values);
	        me.markValid(valid);
	        if(!valid){
	        	Ext.Msg.show({
		            title: "ERROR",
		            msg: me.validationErrorMessage,
		            width: 300,
		            buttons : Ext.Msg.OK,
		            icon: Ext.MessageBox.ERROR
		        });
	        	return;
	        }
	        //multiple solutions can be optimal
			var solutionIds = me.findOptimalSolutions(values);
	        for(var i = 0; i < solutionIds.length; i++){
	        	globalFilter.push('SolutionID =' + solutionIds[i]);
	        }
	        
	        callBack(globalFilter.join(me.globalSeparator));        	
        };
        
        this.getCoefficients(valuesCallBack);
    },
    
    storeFilterByUser:function() {
    	//get the fieldsets array
        var fieldsets =this.form.filterFieldsets.items.getRange();
        
        var me = this;
        
        var callBack = function(values) {
	        if(values.length ==0){
	        	return;
	        }
	        var valid = me.validateCoefficients(values);
	        var mapId = me.target.mapId;
			var user = Ext.decode(sessionStorage['userDetails']).user.name;
	
	        var categoryName = me.optToolCategory;
	        var resourceName = user+"_"+mapId;
	        var storeData = '{"optimizationToolValues": ['+values+']}';
	    	var resource = '<Resource><name>'+resourceName+'</name><description/><Attributes><attribute><name>name</name><type>STRING</type><value></value></attribute></Attributes><category><name>'+categoryName+'</name></category><store><data><![CDATA['+storeData+']]></data></store></Resource>';
	
			var successHandler = function(response,opts){
				 try{
				 	if(response.responseXML) {
				 		var dq = Ext.DomQuery;
		      			var xml = response.responseXML;
		      			var resourceId = dq.selectValue('Resource/id', xml);
				 		
				 		me.insertOrUpdateOptimizationToolValues(categoryName, resourceName, resource, storeData, "PUT", resourceId);
				 	}
				 }catch(e){
					console.log('GeoStore update filter FAILED!');
				 }
			};
			
			var failureHandler = function(){
				// Insert the new Resource on GeoStore
				me.insertOrUpdateOptimizationToolValues(categoryName, resourceName, resource, storeData, "POST", null);
			};
			
			Ext.Ajax.request({
			   url: me.target.geoStoreBaseURL + 'misc/category/name/'+categoryName+'/resource/name/'+resourceName,
			   success: successHandler,
			   failure: failureHandler,
			   scope: me,
			   headers: {
			       'Authorization':me.target.authToken
			   }
			});
        };
        
        this.getCoefficients(callBack);
    },
    
// -----
	/**
	 * 
	 */
    insertOrUpdateOptimizationToolValues:function(categoryName, resourceName, resource, storeData, method, resourceId) {

	// ----

		// --------
		// Store the costs selected by the user into GeoStore
		// --------
    	var successHandler = function(response,opts){
			 try{
			 	if (resourceId) {
			 		Ext.Ajax.request({
					   url: this.target.geoStoreBaseURL + 'data/' + resourceId,
					   method: method,
					   headers: {"Content-Type": "application/json"},
			           jsonData: storeData,
					   success: function(response,opts){},
					   failure: function(){},
					   scope: this,
					   headers: {
					       'Authorization':this.target.authToken
					   }
					});
			 	}
			 	console.log('GeoStore filter update SUCCESS:' + response.responseText);
			 }catch(e){
				console.log('GeoStore filter update FAILED!');
			 }
		};
		
		var failureHandler = function(){
			console.log('GeoStore filter update FAILED!');
		};
		
		// --- Finally perform the Ajax Request
		Ext.Ajax.request({
		   url: this.target.geoStoreBaseURL + 'resources' + (resourceId ? '/resource/'+resourceId : ''),
		   method: method,
		   headers: {"Content-Type": "text/xml"},
           xmlData: resource,
		   success: successHandler,
		   failure: failureHandler,
		   scope: this,
		   headers: {
		       'Authorization':this.target.authToken
		   }
		});

	// ----
		
		// --------
		// Update GUID Filter on GeoServer through OpenSDI2-Interface and the GuidUpdateProcess of the WPS
		// --------
		// --- 1. Retrieve the Optimal SolutionID
		this.solutionId = this.findOptimalSolutions(JSON.parse(storeData).optimizationToolValues)[0];
				
		// --- 2. Send to [POST] osdi2ManagerRestURL + "services/" + serviceId 
		if (this.solutionId) {

			// --- 3. Build "blob" JSON
			/*var blob = JSON.stringify({
				"guid" : "fdklkjrhoh"+this.solutionId,
				"layers" : [
					{
						"guid" : this.solutionId,
						"layerName" : "topp:states",
						"filter" : "topp:STATE_NAME = 'Illinois'"
					},
					{
						"guid" : this.solutionId,
						"layerName" : "topp:tasmania_cities"
					}
				]
			}, undefined, 2);*/

			var guid = this.getLayersGUID();
			var blob = {
				"guid" : guid,
				"layers" : []
			};
			var me = this;
			var optimizationToolLayers = me.target.customData.optimizationToolLayers;
	        var layers = me.target.mapPanel.layers.queryBy(function(a) {
	            var name = a.get('name');
	            var source = a.get('source') ;
	            for(var i = 0 ; i <optimizationToolLayers.length; i++) {
	            	if(name == optimizationToolLayers[i]){
	            		return true;
	            	}
	            }
	            return false;
	            
	        }, me).getRange(); 
	        for(var i=0;i<layers.length; i++){
	        	var layerRecord  = layers[i];
	            if(!filter || filter == "" || filter =="()"){
	                filter ="INCLUDE";
	            }
	            
	            var layerInfo = layerRecord.getLayer();
	            var layerName = layerInfo.params.LAYERS;
	            
	            if (layerName) {
	            	if (!guid) {
		            	guid = layerName.substring(layerName.lastIndexOf("_")+1);
		            	blob.guid = guid;
	            	}
		            
		            blob.layers[i] = {
		            	"guid" : guid,
						"layerName" : layerName,
						"filter" : "SolutionID = " + this.solutionId
		            };
	            }
	        }
	        
	        blob = JSON.stringify(blob, undefined, 2);
	        
			// --- 4. Send Request to URL-like -> "http://localhost:8180/opensdi2-manager/mvc/process/wps/services/guid-wps-process?category=WPS_RUN_CONFIGS"
			var runUrl = this.osdi2ManagerRestURL + "services/guid-wps-process?category=WPS_RUN_CONFIGS";
			var contentType = 'application/json';
	
	    	// --- 5. Finally perform the Ajax Request
	    	var successCallback = function(response,opts){
				 console.log('OpenSDI2 GUID Process Update SUCCESS:' + response.responseText);
			};
			
			var failureCallback = function(){
				console.log('OpenSDI2 GUID Process Update FAILED!');
			};

			Ext.Ajax.request({
				url : runUrl,
				method : method,
				headers : {
					'Content-Type' : contentType,
					'Accept' : 'application/json, text/plain, text/xml',
					'Authorization' : this.target.authToken
				},
				params : blob,
				scope : this,
				success: successCallback,
		   		failure: failureCallback
			});
			
		}
	// ----
    },
// -----
	/**
	 * 
	 */
	getLayersGUID:function(){
		var guid;
		var me = this;
		var optimizationToolLayers = me.target.customData.optimizationToolLayers;
        var layerName = optimizationToolLayers[0];            
        if (layerName) {
        	if (!guid) {
            	guid = layerName.substring(layerName.lastIndexOf("_")+1);
            	
            	return guid;
        	}
        } 		
	},
// -----
	/**
	 * 
	 */
	getLayersBaseURL:function(){
		var baseUrl;
		var me = this;
		var optimizationToolLayers = me.target.customData.optimizationToolLayers;
        var layers = me.target.mapPanel.layers.queryBy(function(a) {
        	try {
	            var name = a.get('name');
	            var source = a.get('source') ;
	            for(var i = 0 ; i <optimizationToolLayers.length; i++) {
	            	if(name == optimizationToolLayers[i]){
	            		return true;
	            	}
	            }
	            return false;
	       	}
	        catch(err)
	        {
	        	return false;
	        }
        }, me).getRange(); 
        for(var i=0;i<layers.length; i++){
        	var layerRecord  = layers[i];
            var layerInfo = layerRecord.getLayer();
            var layerURL = layerInfo.url;
            
            if (layerURL) {
            	if (!baseUrl) {
	            	baseUrl = layerURL;
	            	
	            	return baseUrl;
            	}
            }
        } 		
	},
// -----
    /** 
     * return the filters patterns with genterated
     * or user provided data
     */ 
    replaceData:function(filterObject) {
        var filter = filterObject.cql_filter || "";
        var myDate = new Date();
        var dayOfMonth = myDate.getDate();
        var month = myDate.getMonth();
        if(filterObject.monthsBack){
            myDate.setMonth(month - filterObject.monthsBack);
        }
        if(filterObject.daysBack){
            myDate.setDate(dayOfMonth - filterObject.daysBack);
        }
        var today = new Date();
        //support more than one
        //Format for date ${today
        filter = filter.replace('${backtime}',myDate.toISOString() );
        filter = filter.replace('${today}', today.toISOString() );
        //if the field has the getValue() method replace also this
        if(filterObject && filterObject.getValue){
             var val =filterObject.getValue();
             if(val instanceof Date){
                var val = val.toISOString();
                
             }
             if(val && val !=""){
                 filter = filter.replace('${inputValue}', val);
             }else{
                filter ="";
             }
            
        }
        //add filters to the list 
        return filter ||"";   
    
    },
    
    initCheckBoxes: function(){
    	var group = [];
    	this.data = this.target.customData && this.target.customData.optimizationTool;
    	var data = this.data;
    	if(!this.data){
    		return {xtype:'container',ref:'filterFieldsets'};
    	}
    	for(var i = 0; i < data.costs_descr.length; i++){
    		group.push({
    			xtype:'numberfield',
    			maxValue:1,
    			fieldLabel : data.costs_descr[i],
    			minValue:0,
    			anchor: "100%",
    			//value: 1/data.costs_descr.length,
    			decimalPrecision:this.decimalPrecision
    		});
    	}
    	
    	
    	var me = this;
		var fieldset = {
            xtype: "fieldset",
            title: this.costsTitle,
            checkboxToggle: true,
            layout: "form",
            ref: 'coefficients',
            collapsed: false,
			labelWidth: 150,
    		
            lazyRender:false,
            items:group,
            onCheckClick : function(){
                this[this.checkbox.dom.checked ? 'expand' : 'collapse']();
                me.updateFilter();
            }               
        };
        var filterFieldsets =[];
        
        filterFieldsets.push(fieldset);
        filterFieldsets.push({xtype:'label',html: '<span style="color:red;font-size:11px;float:right;" >The sum of all the weights must be 1.0</span>'});
        
        this.guid = this.getLayersGUID();

        //TODO
        filterFieldsets.push({
            xtype: "fieldset",
            title: "Direct Optimal Asset Allocator Data Access",
            checkboxToggle: true,
            layout: "form",
            ref: 'oaaInfoPanel',
            collapsed: false,
			labelWidth: 150,
    		
            lazyRender:false,
            items:[
            	{xtype:'label',html: '<span style="font-size:11px;float:left;" >The direct data access links below will change according to the '+this.costsTitle+' values</span><br/>&nbsp;'},
				{
		            xtype: 'button',
		            text: "Get WMS GetCapabilities URL",
		            fieldLabel : "OGC WMS 1.1.1",
		            width: 150,
		            handler: function(){
		            	var url = me.getLayersBaseURL();
		            	Ext.Msg.show({
						   title: "OGC WMS 1.1.1",
						   msg: '<p>Link to Optimal Asset Allocator Assets Tracks via WMS GetCapabilities</p><br/><span style="color:blue;font-size:11px;" ><a href="'+url+'?service=wms&version=1.1.1&request=GetCapabilities&GUID='+this.guid+'" target="_target"/>'+url+'?service=wms&version=1.1.1&request=GetCapabilities&GUID='+this.guid+'</span>',
						   closable: false,
						   width: 500,
						   buttons: Ext.Msg.OK,		
						   icon: Ext.MessageBox.INFO
						});            	
		           	},
		            scope: this
		       },{
		            xtype: 'button',
		            text: "Get WMS GetCapabilities URL",
		            fieldLabel : "OGC WMS 1.3.0",
		            width: 150,
		            handler: function(){
		            	var url = me.getLayersBaseURL();
		            	Ext.Msg.show({
						   title: "OGC WMS 1.3.0",
						   msg: '<p>Link to Optimal Asset Allocator Assets Tracks via WMS GetCapabilities</p><br/><span style="color:blue;font-size:11px;" ><a href="'+url+'?service=wms&version=1.3.0&request=GetCapabilities&GUID='+this.guid+'" target="_target"/>'+url+'?service=wms&version=1.3.0&request=GetCapabilities&GUID='+this.guid+'</span>',
						   closable: false,
						   width: 500,
						   buttons: Ext.Msg.OK,		
						   icon: Ext.MessageBox.INFO
						});            	
		           	},
		            scope: this
		       },{
		            xtype: 'button',
		            text: "Get WFS GetCapabilities URL",
		            fieldLabel : "OGC WFS 1.0.0",
		            width: 150,
		            handler: function(){
		            	var url = me.getLayersBaseURL();
		            	Ext.Msg.show({
						   title: "OGC WFS 1.0.0",
						   msg: '<p>Link to Optimal Asset Allocator Assets Tracks via WFS GetCapabilities</p><br/><span style="color:blue;font-size:11px;" ><a href="'+url+'?service=wfs&version=1.0.0&request=GetCapabilities&GUID='+this.guid+'" target="_target"/>'+url+'?service=wfs&version=1.0.0&request=GetCapabilities&GUID='+this.guid+'</span>',
						   closable: false,
						   width: 500,
						   buttons: Ext.Msg.OK,		
						   icon: Ext.MessageBox.INFO
						});            	
		           	},
		            scope: this
		       },{
		            xtype: 'button',
		            text: "WFS as CSV Format",
		            fieldLabel : "OGC WFS 1.0.0 - CSV",
		            width: 150,
		            handler: function(){
		            	var url = me.getLayersBaseURL();
		            	Ext.Msg.show({
						   title: "OGC WFS 1.0.0 - CSV",
						   msg: '<p>Link to Optimal Asset Allocator Assets Tracks via WFS as CSV Format</p><br/><span style="color:blue;font-size:11px;" ><a href="'+url+'?service=WFS&version=1.0.0&request=GetFeature&typeName='+me.getFeatures("tracks")+'&outputFormat=csv&GUID='+this.guid+'" target="_target"/>'+url+'?service=WFS&version=1.0.0&request=GetFeature&typeName='+me.getFeatures("tracks")+'&outputFormat=csv&GUID='+this.guid+'</span>',
						   closable: false,
						   width: 650,
						   buttons: Ext.Msg.OK,		
						   icon: Ext.MessageBox.INFO
						});            	
		           	},
		            scope: this
		       },{
		            xtype: 'button',
		            text: "WFS as GeoJSON Format",
		            fieldLabel : "OGC WFS 1.0.0 - GeoJSON",
		            width: 150,
		            handler: function(){
		            	var url = me.getLayersBaseURL();
		            	Ext.Msg.show({
						   title: "OGC WFS 1.0.0 - GeoJSON",
						   msg: '<p>Link to Optimal Asset Allocator Assets Tracks via WFS as GeoJSON Format</p><br/><span style="color:blue;font-size:11px;" ><a href="'+url+'?service=WFS&version=1.0.0&request=GetFeature&typeName='+me.getFeatures("tracks")+'&outputFormat=JSON&GUID='+this.guid+'" target="_target"/>'+url+'?service=WFS&version=1.0.0&request=GetFeature&typeName='+me.getFeatures("tracks")+'&outputFormat=JSON&GUID='+this.guid+'</span>',
						   closable: false,
						   width: 650,
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO
						});
		           	},
		            scope: this
		       },{
		            xtype: "fieldset",
		            title: "OTH-Gold PIM Track",
		            checkboxToggle: false,
		            layout: "form",
		            ref: 'othGoldMailPanel',
		            collapsed: false,
					labelWidth: 150,
		    		
		            lazyRender:false,
		            items:[
		            	{
			    			xtype:'textfield',
			    			fieldLabel: "E-Mail Address",
			    			ref: 'targetEmail',
			    			allowBlank: false,
			    			anchor: "100%"
			    		},{
					        xtype		: 'container',
					        fieldLabel  : "TCP/IP Address",
					        ref         : 'targetTCP',
							layout		: 'hbox',
					        items: [
					        	{
					    			xtype:'textfield',
					    			ref: 'targetTCPIP',
					    			allowBlank: false,
					    			width:80,
					    			anchor: "100%"
					    		},{
							        xtype: 'label',
							        text: ':',
							        margins: '1 1 1 1'
							    },{
					    			xtype:'textfield',
					    			ref: 'targetTCPPort',
					    			allowBlank: false,
					    			width:40,
					    			anchor: "100%"
					    		}
					    	]
			    		},{
			    			xtype:'textfield',
			    			fieldLabel: "Comma-separated list of Assets (1,2,...)",
			    			ref: 'assets',
			    			allowBlank: false,
			    			anchor: "100%"
			    		},{
				            xtype: 'button',
				            text: "Get PIM Track",
				            width: 280,
				            handler: function() {
						    	var email = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetEmail;
				            	var tcpip = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetTCP.targetTCPIP;
				            	var tcpport = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetTCP.targetTCPPort;
						    	var assets = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.assets;

								email.reset();
						    	tcpip.reset();
						    	tcpport.reset();
						    	
						    	if(!assets.isValid()) {
						    		Ext.Msg.show({
			                            title: "OTH-Gold PIM Track - Error!",
			                            msg: "Assets are required!",
			                            width: 300,
			                            icon: Ext.MessageBox.ERROR
			                        });
			                        
			                        assets.markInvalid();
						    	} else {
									me.getOTHGoldMEssageText(me.getFeatures("tracks"), assets.getRawValue());
						    	}
				           	},
				            scope: this
				  		},{
					        xtype		: 'container',
							layout		: 'hbox',
					        items: [{
					            xtype: 'button',
					            text: "Send via e-Mail",
					            width: 130,
					            handler: function() {
					            	var email = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetEmail;
					            	var tcpip = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetTCP.targetTCPIP;
					            	var tcpport = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetTCP.targetTCPPort;
							    	var assets = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.assets;

							    	tcpip.reset();
							    	tcpport.reset();
							    	
							    	if(!email.isValid() || !assets.isValid()) {
							    		Ext.Msg.show({
				                            title: "OTH-Gold PIM Track - Error!",
				                            msg: "Both fields are required!",
				                            width: 300,
				                            icon: Ext.MessageBox.ERROR
				                        });
				                        
				                        email.markInvalid();
				                        assets.markInvalid();
							    	} else {
							    		var ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
							    		
							    		emailId = email.getRawValue();
										var testResult = ereg.test(emailId);
										
										if (!testResult) {
											Ext.Msg.show({
					                            title: "OTH-Gold PIM Track - Error!",
					                            msg: "The provided E-Mail Address is not formally correct!",
					                            width: 300,
					                            icon: Ext.MessageBox.ERROR
					                        });
					                        
					                        email.markInvalid();
										} else {
											me.sendOTHGoldEmailMEssage(me.getFeatures("tracks"), emailId, assets.getRawValue());
										}
							    	}
					           	},
					            scope: this
					  		},{
						        xtype: 'label',
						        text: ' - ',
						        margins: '2 2 2 2'
						    },{
					            xtype: 'button',
					            text: "Send via TCP/IP",
					            width: 130,
					            handler: function() {
					            	var email = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetEmail;
					            	var tcpip = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetTCP.targetTCPIP;
					            	var tcpport = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.targetTCP.targetTCPPort;
							    	var assets = this.form.filterFieldsets.oaaInfoPanel.othGoldMailPanel.assets;
							    	
							    	email.reset();
							    	
							    	if(!tcpip.isValid() || !tcpport.isValid() || !assets.isValid()) {
							    		Ext.Msg.show({
				                            title: "OTH-Gold PIM Track - Error!",
				                            msg: "Both fields are required!",
				                            width: 300,
				                            icon: Ext.MessageBox.ERROR
				                        });
				                        
				                        tcpip.markInvalid();
				                        tcpport.markInvalid();
				                        assets.markInvalid();
							    	} else {
										me.sendOTHGoldTCPMEssage(me.getFeatures("tracks"), tcpip.getRawValue(), tcpport.getRawValue(), assets.getRawValue());
							    	}
					           	},
					            scope: this
					  		}]
			        }]
		       }
            ]
        });

    	return {xtype:'container',ref:'filterFieldsets',items:filterFieldsets};
    	
    },
    
    findOptimalSolutions: function(coeff){
    	var costs = this.data.costs;
    	if(!costs){
    		return [];
    	}
    	var solutionId;
    	var minValue = Number.MAX_VALUE;
    	for(var i = 0; i < costs.length ; i++){
    		var totCost = this.calculateCost(costs[i],coeff);
    		if(minValue > totCost){
    			minValue = totCost;
    			solutionId = [costs[i].solutionId];
    		}
    		/*else if(minValue == totCost) {
    			solutionId.push(costs[i].solutionId);
    		}*/
    	}
    	return solutionId;
    },
    
    getCoefficients: function (callBack){
    	// search values on GeoStore - by User -
    	var mapId = this.target.mapId;
		var user = Ext.decode(sessionStorage['userDetails']).user.name;

        var categoryName = this.optToolCategory;
        var resourceName = user+"_"+mapId;

		var data = this.data;
		var fieldsets = [this.form.filterFieldsets.coefficients];
		var coeff = [];
		
		try {
	    	for(var fieldsetIndex =0;fieldsetIndex<fieldsets.length;fieldsetIndex++){
	            //if checkbox collapsed, no coefficient means no filter
	            if(fieldsets[fieldsetIndex].collapsed) return [];
	            var range = fieldsets[fieldsetIndex].items.getRange();
	        	for(var i = 0; i< range.length;i++){
	               coeff.push(range[i].getValue());
	            }
	        }			
		} catch (e) {
			coeff = [];
		}
		
    	var successHandler = function(response,opts){
			 try{
			 	if(response.responseXML) {
					// Get Coefficients from GeoStore and update the FieldSets accordingly
					coeff = [];
			 		var dq = Ext.DomQuery;
	      			var xml = response.responseXML;
	      			var optToolValues = Ext.decode(dq.selectValue('Resource/data/data', xml));
	      			for(var fieldsetIndex =0;fieldsetIndex<fieldsets.length;fieldsetIndex++) {
	      				//if checkbox collapsed, no coefficient means no filter
	            		if(fieldsets[fieldsetIndex].collapsed) return [];
						var range = fieldsets[0].items.getRange();			 		
				 		for (var v=0; v<optToolValues.optimizationToolValues.length; v++) {
				 			range[v].setValue(optToolValues.optimizationToolValues[v]);
				 			coeff.push(range[v].getValue());
				 		}
			 		}
			 		callBack(coeff);
			 	}
			 }catch(e){
				//console.log('GeoStore get coefficients FAILED!');
				callBack(coeff);
			 }
		};
		
		var failureHandler = function(){
			// Get Coefficients from the Fieldset
			coeff = [];
			for(var fieldsetIndex =0;fieldsetIndex<fieldsets.length;fieldsetIndex++){
	            //if checkbox collapsed, no coefficient means no filter
	            if(fieldsets[fieldsetIndex].collapsed) return [];
	            var range = fieldsets[fieldsetIndex].items.getRange();
	        	for(var i = 0; i< range.length;i++){
	        	 	range[i].setValue(1/data.costs_descr.length);
	               	coeff.push(range[i].getValue());
	            }
	        }			
	        callBack(coeff);
		};
		
		if (!this.validateCoefficients(coeff) && coeff[0] === "") {
			Ext.Ajax.request({
			   url: this.target.geoStoreBaseURL + 'misc/category/name/'+categoryName+'/resource/name/'+resourceName,
			   success: successHandler,
			   failure: failureHandler,
			   scope: this,
			   headers: {
			       'Authorization':this.target.authToken
			   }
			});
		} else {
			callBack(coeff);
		}
    },
    
    validateCoefficients: function(coeff){
    	try {
	    	var sum = 0;
	    	for(var i=0 ; i < coeff.length; i++){
	    		sum += coeff[i];
	    	}
	    	var tolerance = 1 / (Math.pow(10,this.decimalPrecision));
	    	return sum < 1 + tolerance && sum > 1 - tolerance;
	   	} catch(e) {
	   		return false;
	   	}
    },
    
    calculateCost: function (costObj, coeff){
    	var cost = 0;
    	for(var i = 0; i< coeff.length;i++){
    		cost += costObj.cost[i]*coeff[i];
    	}
    	return cost;
    },
    
    markValid: function(valid){
    	var fieldsets = [this.form.filterFieldsets.coefficients];
    	for(var fieldsetIndex =0;fieldsetIndex<fieldsets.length;fieldsetIndex++) {
            //if checkbox collapsed, no coefficient means no filter
            if(fieldsets[fieldsetIndex].collapsed) return [];
            var range = fieldsets[fieldsetIndex].items.getRange();
        	for(var i = 0; i< range.length;i++) {
               if(!valid) {
               		range[i].markInvalid(this.validationErrorMessage);
               }
               else {
               		range[i].clearInvalid();
               }
            }
        }
    }
});

Ext.preg(gxp.plugins.CMREOptimizationToolFilter.prototype.ptype, gxp.plugins.CMREOptimizationToolFilter);