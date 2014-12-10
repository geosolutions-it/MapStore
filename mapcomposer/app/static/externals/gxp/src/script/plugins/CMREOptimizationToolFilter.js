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
    
    /**
     * 
     */
    updateFilter: function(){
        var filter= this.loadFilter();
        var optimizationToolLayers = this.target.customData.optimizationToolLayers;
        var layers = this.target.mapPanel.layers.queryBy(function(a){
            var name = a.get('name');
            var source = a.get('source') ;
            for(var i = 0 ; i <optimizationToolLayers.length; i++){
            	if(name == optimizationToolLayers[i]){
            		return true;
            	}
            }
            return false;
            
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
        var filter = this.generateFilter();
        
        return filter;
    },
    
    generateFilter:function(){
        //TODO manage disabled fieldset
        var globalFilter = [];
        //get the fieldsets array
        var fieldsets =this.form.filterFieldsets.items.getRange();
        var values = this.getCoefficients();
        if(values.length ==0){
        	return'INCLUDE';
        }
        var valid = this.validateCoefficients(values);
        this.markValid(valid);
        if(!valid){
        	Ext.Msg.show({
	            title: "ERROR",
	            msg: this.validationErrorMessage,
	            width: 300,
	            buttons : Ext.Msg.OK,
	            icon: Ext.MessageBox.ERROR
	        });
        	return;
        }
        //multiple solutions can be optimal
		var solutionIds = this.findOptimalSolutions(values);
        for(var i = 0; i < solutionIds.length; i++){
        	globalFilter.push('SolutionID =' + solutionIds[i]);
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
    			value: 1/ data.costs_descr.length,
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
        filterFieldsets.push({xtype:'label',html: '<span style="color:red;font-size:11px;float:right;" >Sum of the three values must be 1</span>'});
        
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
    getCoefficients: function (){
    	var fieldsets = [this.form.filterFieldsets.coefficients];
    	var coeff = [];
    	for(var fieldsetIndex =0;fieldsetIndex<fieldsets.length;fieldsetIndex++){
            //if checkbox collapsed, no coefficient means no filter
            if(fieldsets[fieldsetIndex].collapsed) return [];
            var range = fieldsets[fieldsetIndex].items.getRange();
        	for(var i = 0; i< range.length;i++){
               coeff.push(range[i].getValue());
               
            }
        }
        return coeff;
    },
    validateCoefficients: function(coeff){
    	var sum = 0;
    	for(var i=0 ; i < coeff.length; i++){
    		sum += coeff[i];
    	}
    	var tolerance = 1 / (Math.pow(10,this.decimalPrecision));
    	return sum < 1 + tolerance && sum > 1 - tolerance;
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