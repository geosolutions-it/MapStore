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
 *  .. class:: WMSLayerFilter(config)
 *
 *    Plugin for filtering a layer using cql filters
 *    TODO Replace this tool with something that is less like GeoEditor and
 *    more like filtering.
 */
gxp.plugins.WMSLayerFilter = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_queryform */
    ptype: "gxp_wms_layer_filter",
    
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
    source:'gsacque',
    
    updateEvents:['keyup','change','keydown'],
    globalSeparator: " AND ",
    /** api: config[checkboxes]
     *  ``Array`` 
     *  Fields with filters to generate the filter
     */
    filterFieldsets:[

    ],
    
    
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
                        + '-' + pad( this.getUTCDate() )
                        + 'T' + pad( this.getUTCHours() )
                        + ':' + pad( this.getUTCMinutes() )
                        + ':' + pad( this.getUTCSeconds() )
                        + '.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
                        + 'Z';
                };

            }() );
        }  
        var featureManager = this.target.tools[this.featureManager];
        var items = this.initCheckBoxes();
        config = Ext.apply({
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
                    this.form.removeAll(true);
                    this.form.add(this.initCheckBoxes());
                    this.form.doLayout();
                    this.updateFilter();
                }
            }]
            
        }, config || {});
        this.form =  gxp.plugins.WMSLayerFilter.superclass.addOutput.call(this, config);
        this.target.on('ready',function(){
            this.updateFilter();
        },this);
        
    },
    
    /**
     * Initialize the fieldset
     */
    initCheckBoxes:function(){
        var filterFieldsets =[];
        for(var i = 0;i<this.filterFieldsets.length ;i++){
            var configObj = this.filterFieldsets[i];
            
            //initialize listeners for the events to bubble
            var listeners = {scope:this}
            var updateFun = this.updateFilter;
            
            for(var x = 0;x < this.updateEvents.length ; x++){
                listeners[this.updateEvents[x]] = updateFun;
            }
            //set enter press
            listeners.specialkey = function(obj,e){
                if (e.getKey() == e.ENTER) {
                       this.updateFilter();
                    }
            }
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
                    me.updateFilter();
                }               
            };
            filterFieldsets.push(fieldset);
        
        }
       return {xtype:'container',ref:'filterFieldsets',items:filterFieldsets};
    },
    
    
    /**
     * 
     */
    updateFilter: function(){
        var filter= this.loadFilter();
        if(!filter){
        	return;
        }
        var layers = this.target.mapPanel.layers.queryBy(function(a){
            var name = a.get('name');
            var source = a.get('source') ;
            return name ==this.layer && source ==this.source;
        },this).getRange(); 
        for(var i=0;i<layers.length; i++){
            var layerRecord  = layers[i];
            if(!filter || filter == "" || filter =="()"){
                filter ="INCLUDE";
            }
            
            layerRecord.getLayer().mergeNewParams({
                cql_filter:filter
            
            });
        }
    },
    /**
     * process filter
     */
    loadFilter: function(){
        var filter = this.generateCheckboxFilter();
        return filter;
    },
    
    generateCheckboxFilter:function(){
        //TODO manage disabled fieldset
        var globalFilter = [];
        //get the fieldsets array
        var fieldsets =this.form.filterFieldsets.items.getRange();

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
    
    }
});

Ext.preg(gxp.plugins.WMSLayerFilter.prototype.ptype, gxp.plugins.WMSLayerFilter);