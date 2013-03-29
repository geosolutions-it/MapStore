/**
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
 * @author Lorenzo Natali
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = AgroMet
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: AgroMet(config)
 *
 *    Plugin for adding NRL CropData Module to a :class:`gxp.Viewer`.
 */   
gxp.plugins.nrl.AgroMet = Ext.extend(gxp.plugins.Tool, {
 /** api: ptype = nrl_agromet */
    ptype: "nrl_agromet",
	/** i18n **/
	outputTypeText:'Output Type',
	areaFilter: "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",
	seasonText:'Season',
	/** layer Name **/
    hilightLayerName:"CropData_Selection_Layer",//TODO doesn't seems to run
    layerStyle: {
        strokeColor: "green",
        strokeWidth: 1,
        fillOpacity:0.6,
		cursor:'pointer'
    },
	/** i18n **/
	outputTypeText:'Output Type',
    radioQtipTooltip: "You have to be logged in to use this method",
	
    factorsurl:"http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:agrometdescriptor&max&outputFormat=json",
    
	rangesUrl: "http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_ranges&outputFormat=json",
	startYear: 2000,
	
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
	    var now = new Date();
		currentYear= now.getFullYear();
		
		var agroMet  = {
			xtype:'form',
			title: 'AgroMet',
			layout: "form",
			minWidth:180,
			autoScroll:true,
			frame:true,
			items:[
				{ 
					fieldLabel: this.outputTypeText,
					xtype: 'radiogroup',
					anchor:'100%',
					autoHeight:true,
					name:'outputType',
					ref:'outputType',                    
					checkboxToggle:true,
					title: this.outputTypeText,
					autoHeight: true,

					defaultType: 'radio', // each item will be a radio button
					items:[
						{boxLabel: 'Data' , name: 'outputtype', listeners: this.setRadioQtip(this.radioQtipTooltip), inputValue: 'data', disabled: true},
						{boxLabel: 'Chart', name: 'outputtype', inputValue: 'chart', checked: true}
					],                 
                    listeners: {           
                        change: function(c,checked){
                            var outputValue = c.getValue().inputValue;
                            var submitButton = this.output.submitButton;
                            var areaSelector = this.output.aoiFieldSet.AreaSelector;                            
                            if(outputValue == 'data'){
                                areaSelector.enable();
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({              
									url: 'http://84.33.2.24/geoserver/ows',//TODO externalize this
                                    xtype: 'gxp_nrlAgrometTabButton',
                                    ref: '../submitButton',
                                    target:this.target,
                                    form: this
                                })
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('show');                                
                                this.output.doLayout();
                                this.output.syncSize();

                            }else{
                                areaSelector.enable();
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({               
                                    xtype: 'gxp_nrlAgrometChartButton',
                                    ref: '../submitButton',
                                    target:this.target,
                                    form: this
                                })
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('show');
                                this.output.doLayout();
                                this.output.syncSize();
                            }                               
                        },                        
                        scope: this                        
                    }
				},{ 
					fieldLabel: 'Season',
					xtype: 'nrl_seasonradiogroup',
					anchor:'100%',
					name:'season',
					ref:'season'
				},{
					xtype: 'nrl_aoifieldset',
					name:'region_list',
					ref:'aoiFieldSet',
                    layerStyle:this.layerStyle,
					anchor:'100%',
					target:this.target,
					areaFilter:this.areaFilter, 
					hilightLayerName:this.hilightLayerName,
					layers:{
						district:'nrl:district_boundary',
						province:'nrl:province_boundary'
					}
					
				},{
					xtype: 'label',
					anchor:'100%',
					fieldLabel:'Reference Year',
					text:currentYear, //TODO conf
					ref: 'referenceYear'
				},{
					ref: 'yearRangeSelector',
					xtype: 'yearrangeselector',
					anchor:'100%',
					maxValue: currentYear, //TODO conf
					minValue: this.startYear, //TODO conf
					values:[this.startYear,currentYear], //TODO conf
					listeners:{
					    scope: this,
						change:function(start,end){
							this.output.referenceYear.setText(end);
							
						}
					}
					
				},
                new Ext.ux.grid.CheckboxSelectionGrid({
                    title: 'Factors',
                    enableHdMenu:false,
                    hideHeaders:true,
                    autoHeight:true,
                    ref: 'factors',
                    viewConfig: {forceFit: true},
                    columns: [{id:'name',dataIndex:'label',header:'Factor'}],
                    autoScroll:true,
                    store: new Ext.data.JsonStore({
                       
                        url:this.factorsurl,
						root:'features',
						idProperty:'factor',
						autoLoad:true,
						fields:[
							{name:'factor', mapping:'properties.factor'},
							{name:'label', mapping:'properties.label'},
							{name:'aggregation', mapping:'properties.aggregation'},
							{name:'unit', mapping:'properties.unit'}
						]
						
                    })
                
                })
			],
			buttons:[{
                xtype:'gxp_nrlAgrometChartButton',
				ref: '../submitButton',
                target:this.target,
				form: this,
                disabled:true                
            }]            
		};
		config = Ext.apply(agroMet,config || {});
		
		this.output = gxp.plugins.nrl.AgroMet.superclass.addOutput.call(this, config);
		this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();
            if (button == "gxp_nrlAgrometChartButton" || button == "gxp_nrlAgrometTabButton"){
                this.output.submitButton.setDisabled(store.getCount()<=0)
            }
		},this);        
		this.output.on('beforehide',function(){
			var button = this.output.aoiFieldSet.AreaSelector.selectButton;
			button.toggle(false);
			var lyr = button.hilightLayer;
			if(!lyr) return;
			lyr.setVisibility(false);
			
		},this);
		this.output.on('show',function(){
			var button = this.output.aoiFieldSet.AreaSelector.selectButton;
			
			var lyr = button.hilightLayer;
			if(!lyr) return;
			lyr.setVisibility(true);
			
		},this);
		return this.output;
	},
    setRadioQtip: function (t){ 
        var o = { 
            afterrender: function() {
                //Ext.QuickTips.init();
                var id  = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.register({ target:  id.elements[id.elements.length-1].id, text: t});
            },
            destroy:function(){
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.unregister(id.elements[id.elements.length-1].id);
            },                                
            enable: function() {
                var id = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.unregister(id.elements[id.elements.length-1].id);
            },
            disable: function() {
                //Ext.QuickTips.init();
                var id  = Ext.get(Ext.DomQuery.select('#x-form-el-'+this.id+' div'));
                Ext.QuickTips.register({ target:  id.elements[id.elements.length-1].id, text: t});
            }
        }        
        return o;
    } 
 });
 Ext.preg(gxp.plugins.nrl.AgroMet.prototype.ptype, gxp.plugins.nrl.AgroMet);