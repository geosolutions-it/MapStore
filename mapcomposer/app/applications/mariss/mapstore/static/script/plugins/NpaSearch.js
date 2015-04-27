/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/


/** api: (define)
 *  module = gxp.plugins
 *  class = QueryForm
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.npa");

/** api: constructor
 *  .. class:: WMSLayerFilter(config)
 *
 *    Plugin for filtering a layer using cql filters
 *    TODO Replace this tool with something that is less like GeoEditor and
 *    more like filtering.
 */
gxp.plugins.npa.Search = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_npa_search */
    ptype: "gxp_npa_search",
    
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

    updateEvents:['keyup','change','keydown'],
    globalSeparator: " AND ",
    /** api: config[filterFieldsets]
     *  ``Array`` 
     *  Fields with filters to generate the filter
     */
    /*  
     "filterFieldsets":[
                   {
                      "ref":"satellite",
                      "label":"Satellite",
                      "xtype":"checkboxgroup",
                      "checked":true,
                      "columns":2,
                      "checkboxes":[
                         {
                            "boxLabel":"Envisat",
                            "checked":false,
                            "cql_filter":"satellite = 'Envisat' OR satellite = 'ENV' OR satellite = 'ENVISAT-1'"
                         },
                         {
                            "boxLabel":"Landsat",
                            "checked":false,
                            "cql_filter":"satellite = 'Landsat'"
                         },
                         {
                            "boxLabel":"ERS-2",
                            "checked":false,
                            "cql_filter":"satellite = 'ERS-2' OR satellite = 'ERS2'"
                         },{
                            "boxLabel":"Radarsat1",
                            "checked":false,
                            "cql_filter":"satellite = 'Radarsat1'"
                         },
                         {
                            "boxLabel":"ERS-1",
                            "checked":false,
                            "cql_filter":"satellite = 'ERS-1' OR satellite = 'ERS1'"
                         }

                         
                      ],
                      "customConfig":{
                         "hideLabel":false
                      }
                   },{
                      "ref":"acqDate",
                      "label":"Acquisition Date",
                      "checked":false,
                      "xtype":"container",
                      "columns":1,
                      "emptyFilter":"1=1",
                      "items":[
                         {
                            "xtype":"datefield",
                             "format": "Y/m/d", 
                             "fieldLabel":"Date",
                            "anchor":"100%",
                            "cql_filter":"acq_date='${inputValue}'"
                         }],
                         "customConfig":{
                         "separator":"AND",
                         "layout":"form",
                         "defaults":{
                            "hideLabel":false,
                            "enableKeyEvents":true,
                            "bubbleEvents":[
                               "keyup",
                               "change"
                            ]
                         }
                      }
                         },
                 ]*/
    initStateBtn:"Apply Filter",
    filteredStateBtn:"Change Filter",
     
    constructor: function(config) {
        this.addEvents(
            /** api: event[updatefilte]
             *  Fired when filter is updated
             *  Listener arguments:
             *  * filter - ``OpenLayers.Filter`` 
             
             */
            "filterupdated"
        );
                gxp.plugins.npa.Search.superclass.constructor.apply(this, arguments);        

        },
        
        
      addActions: function() {
          var actions ={};  
         if(!this.outputTarget){ 
        var toggleGroup = this.toggleGroup || Ext.id();
            this.filterBtn = new Ext.Button({
            text: this.initStateBtn,
            iconCls: "gxp-icon-find",
            disabled: false,
            enableToggle: false,
            handler : this.showFilterPanel,
            scope: this
        });
        actions= this.filterBtn;
        }else {
            this.addOutput();
            }
        return gxp.plugins.npa.Search.superclass.addActions.call(this, [actions]);
      
        },
        
     showFilterPanel:function(){
         if(!this.filterPanel){
             this.addOutput({
                 width:300,
                 
             });
         }else if(!this.filterPanel.isVisible()){
             this.filterPanel.ownerCt.ownerCt.show();
             }
     },
     
    /** 
     * api: method[addOutput]
     */
    addOutput: function(config) {
        
         if ( !Date.prototype.toISOString ) {
             
            ( function() {
             
                function pad(number) {
                    var r = String(number);
                    if ( r.length === 1 ) {
                        r = '0' + r;
                    }
                    return r;
                }
          
                Date.prototype.toISOString = function() {
                    return this.getUTCFullYear()
                        + '-' + pad( this.getUTCMonth() + 1 )
                        + '-' + pad( this.getUTCDate() );
                        + 'T' + pad( this.getUTCHours() )
                        + ':' + pad( this.getUTCMinutes() )
                        + ':' + pad( this.getUTCSeconds() )
                        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                        + 'Z';
                };

            }() );
        }  
        var featureManager = this.target.tools[this.featureManager];
        this.filterFormat = new OpenLayers.Format.CQL();
        var items = this.initCheckBoxes();
        config = Ext.apply({
            xtype:'form',
            border: false,
            bodyStyle: "padding: 10px",
            layout: "form",
            ref:'form',
            autoScroll: true,
            items: [items],
            bbar:[{
                text:this.updateButtonText,
                scope:this,
                iconCls:'gxp-icon-find',
                handler:this.updateFilter
                
            },"->",{
                    text:this.cancelButtonText,
                    scope:this,
                    iconCls:'cancel',
                    handler:function(){
                    this.filterPanel.getForm().reset();  
                    this.resetFieldSet();  
                    this.updateFilter();
                     if(this.filterBtn) this.filterBtn.setText(this.initStateBtn);
                }
            }]
            
        }, config || {});
        
        this.filterPanel =  gxp.plugins.npa.Search.superclass.addOutput.call(this, config);
        
           return this.filterPanel;
        
    },
    
    /**
     * Initialize the fieldset
     */
    initCheckBoxes:function(){
        var filterFieldsets =[];
        for(var i = 0;i<this.filterFieldsets.length ;i++){
            var configObj = this.filterFieldsets[i];
            
            //initialize listeners for the events to bubble
            var listeners = {scope:this};
            var updateFun = this.updateFilter;
            
            for(var x = 0;x < this.updateEvents.length ; x++){
              //  listeners[this.updateEvents[x]] = updateFun;
            }
            //set enter press
            listeners.specialkey = function(obj,e){
                if (e.getKey() == e.ENTER) {
                     //  this.updateFilter();
                    }
            };
            var group = Ext.apply({
                ref:configObj.ref,
                xtype: configObj.xtype,
                emptyFilter:configObj.emptyFilter,
                listeners:listeners,
                columns: configObj.columns,
                items: configObj.checkboxes || configObj.items
                
            },configObj.customConfig ||{});
            var me = this;
            var fieldset = {
                xtype: "fieldset",
                title:configObj.label || this.checkBoxFieldsetTitle,
                checkboxToggle: true,
                layout:configObj.layout || "anchor",
                collapsed:!configObj.checked || false,
                lazyRender:false,
                items:group,
                 onCheckClick : function(){
                    this[this.checkbox.dom.checked ? 'expand' : 'collapse']();
                  //  me.updateFilter();
                    me.filterPanel.doLayout();
                    
                }               
            };
            filterFieldsets.push(fieldset);
        
        }
       return {xtype:'container',ref:'filterFieldsets',items:filterFieldsets};
    },
    resetFieldSet:function(){
        
         var fieldsets =this.filterPanel.filterFieldsets.items.getRange();

        for(var fieldsetIndex =0;fieldsetIndex<fieldsets.length;fieldsetIndex++){
            //get the checkbox group as the first item of each fieldset
            
            if(fieldsets[fieldsetIndex].initialConfig.collapsed) fieldsets[fieldsetIndex].collapse();
            else fieldsets[fieldsetIndex].expand();
            }
        
        
    },
    
    /**
     * 
     */
   
    updateFilter: function(){
        if(this.filterBtn) this.filterBtn.setText(this.filteredStateBtn);
        this.fireEvent("filterupdated", this.loadFilter());

    },
    /**
     * process filter
     */
    loadFilter: function(){
        var filter = this.generateCheckboxFilter();
         return (filter)?this.filterFormat.read(filter):null;
        
    },
    
    generateCheckboxFilter:function(){
        //TODO manage disabled fieldset
        var globalFilter = [];
        //get the fieldsets array
        var fieldsets =this.filterPanel.filterFieldsets.items.getRange();

        for(var fieldsetIndex =0;fieldsetIndex<fieldsets.length;fieldsetIndex++){
            //get the checkbox group as the first item of each fieldset
            if(fieldsets[fieldsetIndex].collapsed) continue;
            var cboxgroup = fieldsets[fieldsetIndex].items.getRange()[0];
            if(!cboxgroup){
                var checked = fieldsets[fieldsetIndex];
            }
            // if checkboxes or radio get the checked ones 
            if([ "radiogroup","checkboxgroup"].indexOf(cboxgroup.xtype)>=0 ){
                var checked = cboxgroup.getValue();
            // is a normal field  (inputfield, datefield etc...)
            }else if(cboxgroup.items && cboxgroup.items.getRange){
                var checked = cboxgroup.items.getRange();
                
            }
            
            var len =0;
            //if nothing is checked
            if(!checked){
                continue;
            //case checkbox
            }else if(checked.length){
                 len = checked.length;
            //case radio
            }else{
                checked = [checked];
                len = checked.length;
            }
            var filter ="";
            var separator =  cboxgroup.separator ? (" " + cboxgroup.separator + " ") : " OR ";
            //produce filter1 OR filter2 OR.... filterN
            for(var i = 0; i< len;i++){
               var filterPiece =this.replaceData(checked[i]);
               if(filterPiece!="" && filterPiece!="()"){
                    if(filter !=""){
                        filter= filter+ separator + filterPiece;
                    }else{
                        filter= filterPiece;
                    }
               }
               
            }
            //if emptyFilter defined in config,
            //use it
            if(filter==""){
                if(cboxgroup.emptyFilter){
                    filter = cboxgroup.emptyFilter;
                }
            }
            if(filter!=""){
                globalFilter.push("("+ filter+ ")");
            }
            
        }
        
        return globalFilter.join(this.globalSeparator);
    },
    
    /** 
     * return the filters patterns with genterated
     * or user provided data
     */ 
    replaceData:function(filterObject){
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
        if(filterObject.getValue){
             var val =filterObject.getValue();
             if(filterObject.valTmpl){
                 val= new Ext.Template(filterObject.valTmpl).apply({value:val}); 
             }else if(val instanceof Date){
                 if(filterObject.format)
                 var val =  val.format(filterObject.format);
                 else
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
    updateInfoControls: function(layer,filter){
        var controls = app.mapPanel.map.getControlsByClass("OpenLayers.Control.WMSGetFeatureInfo");
        for(var i = 0; i < controls.length; i++){
            if( controls[i].layers.length ==1 && controls[i].layers[0]==layer){
                
                if (controls[i].vendorParams){
                    controls[i].vendorParams.cql_filter=filter;
                }else{
                    controls[i].vendorParams={cql_filter:filter};
                }
            
            }
        }
    }
});

Ext.preg(gxp.plugins.npa.Search.prototype.ptype, gxp.plugins.npa.Search);
