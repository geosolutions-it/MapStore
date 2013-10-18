/**
 *  Copyright (C) 2007 - 2013 GeoSolutions S.A.S.
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
 * @author Alejandro Diaz
 */

/**
 * @requires plugins/nrl/CropStatus.js
 */

/** api: (define)
 *  module = gxp.plugins.nrl
 *  class = ReportCropData
 */

/** api: (extends)
 *  plugins/nrl/CropStatus.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: ReportCropData(config)
 *
 *    Plugin for print NRL CropData report Module to a :class:`gxp.Viewer`.
 */   
gxp.plugins.nrl.ReportCropData = Ext.extend(gxp.plugins.nrl.CropStatus, {
	/** api: ptype = nrl_report_crop_data */
    ptype: "nrl_report_crop_data",

    /** i18n **/
    titleText: 'Crop Report',

    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        this.featureSelectorConfigs.base.url = this.dataUrl;

        var cropStatus = this.getTabPanel();
        
        config = Ext.apply(cropStatus,config || {});
        
        this.output = gxp.plugins.nrl.CropStatus.superclass.addOutput.call(this, config);
        this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();
            if (button == "gxp_nrlReportCropStatusChartButton" || button == 'gxp_nrlReportCropStatusChartButton'){
                this.output.submitButton.setDisabled(store.getCount()<=0)
            }
        },this);    
        
        //hide selection layer on tab change
        this.output.on('beforehide',function(){
            var button = this.output.singleFeatureSelector.singleSelector.selectButton;
            button.toggle(false);
            var lyr = button.hilightLayer;
            if(!lyr) return;
            lyr.setVisibility(false);
            
        },this);
        this.output.on('show',function(){
            var button = this.output.singleFeatureSelector.singleSelector.selectButton;
            
            var lyr = button.hilightLayer;
            if(!lyr) return;
            lyr.setVisibility(true);
            
        },this);
        return this.output;
        
    },

    /** private: method[getTabPanel]
     *  :arg config: ``Object``
     *  Obtain panel for the tab
     */
    getTabPanel: function(){
        return {
            xtype:'form',
            title: this.titleText,
            layout: "form",
            minWidth:180,
            autoScroll:true,
            frame:true,
            items:this.generateAllFieldItems(),  
            buttons:[this.getTabButtons()]
        };
    },

    getTabButtons: function(){
        return this.submitButton = {               
                xtype: 'gxp_nrlReportCropStatusChartButton',
                ref: '../submitButton',
                url:this.dataUrl,
                target:this.target,
                form: this,
                disabled:true
        };
    },

    generateAllFieldItems: function(){
        var items = [this.getOutputFieldItem(),this.getSeasonFieldItem(),this.getAoIFieldItem()];

        items.push(this.getCommodityFieldItem());

        // year filed need two fields
        var yeardFieldItems= this.getYearFieldItem();
        for(var i = 0; i< yeardFieldItems.length; i++)
            items.push(yeardFieldItems[i]);

        items.push(this.getFactorsFieldItem());

        // helper fieldset
        var helper = this.target.tools["printreporthelper"];
        items.push(helper.getFormParamatersFieldset());

        return items;
    },

    getOutputFieldItem: function(){
        return { 
            fieldLabel: 'Output Type',
            xtype: 'radiogroup',
            anchor:'100%',
            autoHeight:true,
            name:'outputType',
            ref:'outputType',                            
            checkboxToggle:true,
            //title: this.outputTypeText,
            autoHeight: true,

            defaultType: 'radio', // each item will be a radio button
            items:[
                {boxLabel: 'Data' , name: 'outputtype', listeners: this.setRadioQtip(this.radioQtipTooltip), inputValue: 'data', disabled: true},
                {boxLabel: 'Chart', name: 'outputtype', inputValue: 'chart', checked: true}
            ],                 
            listeners: {           
                change: this.outputRadioChange,                        
                scope: this                        
            }
        };
    },

    outputRadioChange: function(c,checked){
        var outputValue = c.getValue().inputValue;
        var submitButton = this.output.submitButton;
        var areaSelector = this.output.singleFeatureSelector;  

        this.selectedProvince = null;
        
        if(outputValue == 'data'){
            areaSelector.enable();
            submitButton.destroy();
            delete submitButton;
            this.output.addButton({              
                url: this.dataUrl,//TODO externalize this
                xtype: 'gxp_nrlReportCropStatusChartButton',
                ref: '../submitButton',
                target:this.target,
                form: this
            })
            var store = areaSelector.currentCombo.selectButton.store;
            this.output.fireEvent('update',store);
            this.output.fireEvent('show');                                
            this.output.doLayout();
            this.output.syncSize();

        }else{
            areaSelector.enable();
            submitButton.destroy();
            delete submitButton;
            this.output.addButton({               
                xtype: 'gxp_nrlReportCropStatusChartButton',
                ref: '../submitButton',
                target:this.target,
                form: this
            })
            var store = areaSelector.currentCombo.selectButton.store;
            this.output.fireEvent('update',store);
            this.output.fireEvent('show');
            this.output.doLayout();
            this.output.syncSize();
        }                               
    },

    getSeasonFieldItem: function(){
        return { 
            fieldLabel: 'Season',
            xtype: 'nrl_seasonradiogroup',
            ref:'season',
            name:'season',
            anchor:'100%',
            listeners:{
                change: this.seasonRadioChange
            }
        };
    },

    seasonRadioChange: function(c,checked){
        var commodity = this.ownerCt.Commodity;
        commodity.seasonFilter(checked.inputValue);
        var selectedCommodity = commodity.getStore().getAt(0);
        commodity.setValue(selectedCommodity.get(commodity.valueField));
        
        if(selectedCommodity){
            var yrs= commodity.ownerCt.yearRangeSelector;
            yrs.setMaxValue(selectedCommodity.get('max'));
            yrs.setMinValue(selectedCommodity.get('min'));
            
        }
    },

    getAoIFieldItem: function(){
        return this.aoiFieldSet = {
            xtype:'nrl_single_aoi_selector_alt',
            target:this.target,
            name:'region_list',
            ref:'singleFeatureSelector',
            featureSelectorConfigs:this.featureSelectorConfigs,
            hilightLayerName: 'hilight_layer_selectAction',
            vendorParams: {cql_filter:this.areaFilter},
            listeners: {
                select: function(store){
                    this.selectedProvince = store.getAt(0);
                },
                scope:this
            }
        };
    },

    getYearFieldItem: function(){
        return [{
                xtype: 'label',
                anchor:'100%',
                fieldLabel:'Reference Year',
                text:2009, //TODO conf
                ref: 'referenceYear'
            },{
            ref: 'yearRangeSelector',
            xtype: 'yearrangeselector',
            anchor:'100%',
            listeners:{
                scope:this,
                change:function(start,end){
                    this.output.referenceYear.setText(end);
                },
                afterrender: function(component) {
                    if(this.output.yearRangeSelector!=component)return;           
                }
            }         
        }];
    },

    getCommodityFieldItem: function (){
        return {
            xtype: 'nrl_commoditycombobox',
            forceSelection:true,
            allowBlank:false,
            name:'crop',
            anchor:'100%',
            ref: 'Commodity',
            store:new Ext.data.JsonStore({
                fields: [
                    {name:'label',  mapping:'properties.label'},
                    {name:'season', mapping:'properties.seasons'},
                    {name:'crop',   mapping:'properties.crop'},
                    {name:'max',    mapping:'properties.max' },
                    {name:'min',    mapping:'properties.min' }
                ],
                autoLoad: true,
                url: this.rangesUrl,
                root: 'features',
                idProperty:'crop'
                
            }),
            listeners: {
                expand: function( combo ){
                    var season = this.ownerCt.season;
                    var radio = season.getValue();
                    
                    if (radio && radio.getValue()){
                       this.seasonFilter(radio.inputValue);
                       
                    }
                    var selectedRecord= combo.getStore().getById(combo.getValue());
                    
                },
                select: function(cb,record,index){
                    //set year range for the selected crop
                    var selectedCommodity = record;
                    var yrs= cb.ownerCt.yearRangeSelector;
                    if(yrs){
                        yrs.setMaxValue(selectedCommodity.get('max'));
                        yrs.setMinValue(selectedCommodity.get('min'));
                        cb.ownerCt.referenceYear.setText(yrs.endValue.getValue());
                    }
                    
                    var comboProd = Ext.getCmp('comboProd');
                    
                    var comValue = cb.getValue();
                    if (comValue == 'cotton'){
                        comboProd.setValue('000 bales');               
                    }else{
                        comboProd.setValue('000 tons');                                  
                    }
                }
            }
        };
    },

    getFactorsFieldItem: function(){
        return new Ext.ux.grid.CheckboxSelectionGrid({
            title: 'Factors',
            enableHdMenu:false,
            hideHeaders:true,
            autoHeight:true,
            ref: 'factors',
            viewConfig: {forceFit: true},
            columns: [{id:'name',dataIndex:'label',header:'Factor'},{id:'unit',dataIndex:'unit',header:'Unit'}],
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
                    {name:'unit', mapping:'properties.unit'},
                    {name:'max', mapping: 'properties.max'},
                    {name:'min', mapping: 'properties.min'}
                ]
            }),
            listeners:{
                selectionchange:function(records){
                    var yearSelector = this.ownerCt.yearRangeSelector;
                    if(records.length<=0){
                       yearSelector.setDisabled(true); 
                    }else{
                        var max=-99999,min=99999;
                        for(var i=0;i<records.length ;i++){
                            var rec = records[i];
                            var curmax = rec.get('max');
                            var curmin = rec.get('min');
                            if(curmax > max){
                                max = curmax;
                            }
                            if(curmin < min){
                                min = curmin;
                            }  
                        }
                        if(max==99999|| min == -99999){
                             yearSelector.setDisabled(true);
                        }else{
                            yearSelector.setDisabled(false);
                            yearSelector.minValue = min;
                            yearSelector.maxValue = max;
                            yearSelector.doLayout();
                        }
                    }
                }
            }
        });
    }

 });
 
 Ext.preg(gxp.plugins.nrl.ReportCropData.prototype.ptype, gxp.plugins.nrl.ReportCropData);