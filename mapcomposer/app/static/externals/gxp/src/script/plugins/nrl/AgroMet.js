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
	areaFilter: "province NOT IN ('DISPUTED TERRITORY','DISPUTED AREA')",
	seasonText:'Season',
    titleText:'AgroMet',
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

    factorsurl:"http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:agrometdescriptor&outputFormat=json",

    dataUrl: null, //'http://84.33.2.24/geoserver/ows',
	startYear: 2000,
	comboConfigs:{
        base:{
            anchor:'100%',
            fieldLabel: 'District',
            //url: "http://84.33.2.24/geoserver/ows?",
            predicate:"ILIKE",
            width:250,
            sortBy:"province",
			ref:'singleSelector',
            displayField:"name",
            pageSize:10

        },
        district:{
            typeName:"nrl:district_select",
            queriableAttributes:[
                "district",
                "province"

             ],
             recordModel:[
                {
                  name:"id",
                   mapping:"id"
                },
                {
                   name:"geometry",
                   mapping:"geometry"
                },
                {
                   name:"name",
                   mapping:"properties.district"
                },{
                   name:"province",
                   mapping:"properties.province"
                },{
                   name:"properties",
                   mapping:"properties"
                }
            ],
            displayField:"district",
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>({province})</div></tpl>"
        },
        province:{

            typeName:"nrl:province_view",
            recordModel:[
                {
                   name:"id",
                   mapping:"id"
                },
                {
                   name:"geometry",
                   mapping:"geometry"
                },
                {
                   name:"name",
                   mapping:"properties.province"
                },{
                   name:"properties",
                   mapping:"properties"
                }
            ],
            sortBy:"province",
            queriableAttributes:[
                "province"
            ],
            displayField:"fname",
            tpl:"<tpl for=\".\"><div class=\"search-item\"><h3>{name}</span></h3>(Province)</div></tpl>"

        }

    },
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
	    var now = new Date();
		var currentYear= now.getFullYear();
		//Override the comboconfig url;
		this.comboConfigs.base.url = this.dataUrl;

		var agroMet  = {
			xtype:'form',
			title: this.titleText,
			layout: "form",
			minWidth:180,
			autoScroll:true,
			frame:true,
            buttonAlign: 'left',
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
							var aoiFieldSet = this.output.aoiFieldSet;
                            var areaSelector = aoiFieldSet.AreaSelector;
							var gran_type = aoiFieldSet.gran_type.getValue().inputValue;

                            if(outputValue == 'data'){
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({
									url: this.dataUrl,
                                    xtype: 'gxp_nrlAgrometTabButton',
                                    ref: '../submitButton',
                                    highChartExportUrl: this.highChartExportUrl,
                                    target:this.target,
                                    form: this
                                });

								// Avoid 'pakistan' checked when 'outputValue' = 'data'
								if(gran_type == "pakistan"){
									aoiFieldSet.gran_type.reset();
								}

                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('show');

                                c.ownerCt.referenceYear.show();
                                c.ownerCt.yearRangeSelector.show();
                                c.ownerCt.refYearSelector.hide();
                                c.ownerCt.compositevalues.hide();
                                c.ownerCt.anomaliesoutput.hide();
                                c.ownerCt.mode.hide();

                                this.output.doLayout();
                                this.output.syncSize();

                            }else{
                                submitButton.destroy();
                                delete submitButton;
                                this.output.addButton({
                                    url: this.dataUrl,
                                    xtype: 'gxp_nrlAgrometChartButton',
                                    ref: '../submitButton',
                                    highChartExportUrl: this.highChartExportUrl,
                                    target:this.target,
                                    form: this
                                });
                                var store = areaSelector.store;
                                this.output.fireEvent('update',store);
                                this.output.fireEvent('show');

                                c.ownerCt.mode.show();

                                this.output.doLayout();
                                this.output.syncSize();
                            }

							var pakenabled = outputValue != 'data';
                            aoiFieldSet.gran_type.eachItem(function(item){
								if(item.inputValue=="pakistan"){
									item.setDisabled(!pakenabled);
								}
                            },this);

                            if (this.output.submitButton.xtype == 'gxp_nrlAgrometChartButton'){
                                this.output.optBtn.setDisabled(this.output.submitButton.disabled);
                            }else{
                                this.output.optBtn.disable();
                            }
                        },
                        scope: this
                    }
				},{
					fieldLabel: 'Season',
					xtype: 'nrl_seasonradiogroup',
					anchor:'100%',
					name:'season',
					ref:'season',
                    listeners: {
                        change: function(rgroup,checked){
                            if(checked.inputValue == 'RABI'){
                                //Nov-Apr
                                this.refOwner.monthRangeSelector.setValue(0,10,true);
                                this.refOwner.monthRangeSelector.setValue(1,15  ,true);
                            }else{
                                //May-Oct
                                this.refOwner.monthRangeSelector.setValue(1,21,true);
                                this.refOwner.monthRangeSelector.setValue(0,16,true);
                            }
                        }
                    }
				},{
					ref: 'monthRangeSelector',
					xtype: 'monthyearrangeselector',
					anchor:'100%'
				},{
					xtype: 'nrl_aoifieldset',
					name:'region_list',
					ref:'aoiFieldSet',
                    layerStyle:this.layerStyle,
					anchor:'100%',
					target:this.target,
					comboConfigs:this.comboConfigs,
					areaFilter:this.areaFilter,
					hilightLayerName:this.hilightLayerName,
					layers: this.layers,
                    selectableLayer: this.layers.province

				},{
					xtype: 'label',
					anchor:'100%',
					fieldLabel:'Reference Year',
					text:currentYear, //TODO conf
					ref: 'referenceYear'
				},{
                    name:'year',
                    fieldLabel: 'Reference Year',
                    disabled: true,
                    hidden: true,
                    xtype: 'singleyearcombobox',
                    anchor:'100%',
                    ref:'refYearSelector',
                    editable: false
                },{
					ref: 'yearRangeSelector',
					xtype: 'yearrangeselector',
					anchor:'100%',
                    disabled:true,
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
                {
                    fieldLabel: 'Mode',
                    xtype: 'radiogroup',
                    anchor:'100%',
                    autoHeight:true,
                    ref: 'mode',
                    title: this.outputTypeText,
                    defaultType: 'radio',
                    columns: 2,
                    disabled:false,
                    items:[
                        {boxLabel: 'Single factor' , name: 'mode', inputValue: 'compareTime',checked:true},
                        {boxLabel: 'Composite' , name: 'mode', inputValue: 'composite'}
                    ],
                    listeners: {
                        change: function(c,checked){
                            if (checked.inputValue == 'composite'){
                                c.ownerCt.compositevalues.show();
                            }else{
                                c.ownerCt.referenceYear.show();
                                c.ownerCt.yearRangeSelector.show();
                                c.ownerCt.refYearSelector.hide();
                                c.ownerCt.compositevalues.hide();
                                c.ownerCt.anomaliesoutput.hide();
                            }
                            c.ownerCt.doLayout();
                        },
                        show: function(c){
                            var checked = c.getValue();
                            if (checked.inputValue == 'composite'){
                                c.ownerCt.compositevalues.show();
                            }else{
                                c.ownerCt.referenceYear.show();
                                c.ownerCt.yearRangeSelector.show();
                                c.ownerCt.refYearSelector.hide();
                                c.ownerCt.compositevalues.hide();
                                c.ownerCt.anomaliesoutput.hide();
                            }
                            c.ownerCt.doLayout();
                        }
                    }
                },
                {
                    hideLabel: false,
                    xtype: 'radiogroup',
                    anchor:'100%',
                    autoHeight:true,
                    ref: 'compositevalues',
                    title: this.outputTypeText,
                    defaultType: 'radio',
                    columns: 1,
                    //disabled: true,
                    hidden: true,
                    items:[
                        {boxLabel: 'Reference Year' , name: 'compositevalues', inputValue: 'abs',checked:true},
                        {boxLabel: 'Average' , name: 'compositevalues', inputValue: 'avg'},
                        {boxLabel: 'Anomalies', name: 'compositevalues', inputValue: 'anomalies'}
                    ],
                    listeners: {
                        change: function(c,checked){
                            var checkedVal = checked.inputValue;
                            if(checkedVal == 'avg'){
                                c.ownerCt.referenceYear.show();
                                c.ownerCt.refYearSelector.hide();
                                c.ownerCt.yearRangeSelector.show();
                                c.ownerCt.anomaliesoutput.hide();
                            } else if(checkedVal == 'abs'){
                                c.ownerCt.referenceYear.hide();
                                c.ownerCt.refYearSelector.show();
                                c.ownerCt.yearRangeSelector.hide();
                                c.ownerCt.anomaliesoutput.hide();
                            } else {
                                c.ownerCt.referenceYear.hide();
                                c.ownerCt.refYearSelector.show();
                                c.ownerCt.yearRangeSelector.show();
                                c.ownerCt.anomaliesoutput.show();
                            }
                            c.ownerCt.doLayout()
                        },
                        show: function(c){
                            var selectedRadio = c.getValue();
                            var checkedVal = selectedRadio.inputValue;
                            if (checkedVal == 'avg'){
                                c.ownerCt.referenceYear.show();
                                c.ownerCt.refYearSelector.hide();
                                c.ownerCt.yearRangeSelector.show();
                                c.ownerCt.anomaliesoutput.hide();
                            } else if(checkedVal == 'abs'){
                                c.ownerCt.referenceYear.hide();
                                c.ownerCt.refYearSelector.show();
                                c.ownerCt.yearRangeSelector.hide();
                                c.ownerCt.anomaliesoutput.hide();
                            } else {
                                c.ownerCt.referenceYear.hide();
                                c.ownerCt.refYearSelector.show();
                                c.ownerCt.yearRangeSelector.show();
                                c.ownerCt.anomaliesoutput.show();
                            }
                            c.ownerCt.doLayout();
                        }
                    }
                },{
                    fieldLabel: '',
                    hideLabel: false,
                    xtype: 'radiogroup',
                    anchor:'100%',
                    autoHeight:true,
                    ref: 'anomaliesoutput',
                    title: this.outputTypeText,
                    defaultType: 'radio',
                    columns: 1,
                    disabled:false,
                    hidden: true,
                    items:[
                        {boxLabel: 'Absolute' , name: 'anomaliesoutput', inputValue: 'abs',checked:true},
                        {boxLabel: 'Relative (%)' , name: 'anomaliesoutput', inputValue: 'rel'}
                    ],
                    style: {
                        paddingLeft: '15px'
                    }
                },
                new Ext.ux.grid.CheckboxSelectionGrid({
                    title: 'Factors',
                    enableHdMenu:false,
                    hideHeaders:false,
                    autoHeight:true,
                    ref: 'factors',
                    viewConfig: {forceFit: true},
                    columns: [{
                        id:'name',
                        dataIndex:'label',
                        header:'Factor'
                    },{
                        id:'unit',
                        dataIndex:'unit',
                        header:'Unit'
                    },{
                        id:'aggregation',
                        dataIndex:'aggregation',
                        header:'Aggregation'
                    }],
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
                            var yearRangeSelector =this.refOwner.yearRangeSelector;
                            var refYearSelector = this.refOwner.refYearSelector;
                            if(records.length<=0){
                               yearRangeSelector.setDisabled(true);
                               refYearSelector.setDisabled(true);
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
                                     yearRangeSelector.setDisabled(true);
                                     refYearSelector.setDisabled(true);
                                }else{
                                    yearRangeSelector.setDisabled(false);
                                    yearRangeSelector.setMaxValue(max);
                                    yearRangeSelector.setMinValue(min);
                                    refYearSelector.setDisabled(false);
                                    // adds new year value in combobox if not already present.
                                    var comboStore = refYearSelector.getStore();
                                    if (comboStore.query('year', max).length == 0){
                                        comboStore.add(new Ext.data.Record({
                                            year: max
                                        }));
                                        comboStore.sort('year', 'ASC');
                                    }
                                    // set combobox value.
                                    if (!refYearSelector.getValue())
                                        refYearSelector.setValue(max);
                                }
                            }
                            //Create options for charts
                            var cseries = {};
                            var button = this.refOwner.submitButton;
                            var optionsCompare = nrl.chartbuilder.util.generateDefaultChartOpt(records,'label','factor');
                            button.optionsCompareComposite = optionsCompare;
                        }
                    }


                })
			],
			buttons:['->', {
                iconCls:'ic_wrench',
                ref: '../optBtn',
                disabled: true,
                listeners: {
                    click: function () {
                        this.refOwner.submitButton.chartoptions.fireEvent('click');
                    }
                }
            }, {
                url: this.dataUrl,
                xtype:'gxp_nrlAgrometChartButton',
				ref: '../submitButton',
                highChartExportUrl: this.highChartExportUrl,
                target:this.target,
				form: this,
                disabled:true
            }]
		};

        if (this.helpPath && this.helpPath != ''){
            agroMet.buttons.unshift({
                xtype: 'gxp_nrlHelpModuleButton',
                portalRef: this.portalRef,
                helpPath: this.helpPath
            });
        }

		config = Ext.apply(agroMet,config || {});

		this.output = gxp.plugins.nrl.AgroMet.superclass.addOutput.call(this, config);

		this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();

			var values = this.output.getForm().getValues();
			var gran_type = values.areatype;

            if (button == "gxp_nrlAgrometChartButton" || button == "gxp_nrlAgrometTabButton"){
                this.output.submitButton.setDisabled(store.getCount()<=0 && gran_type != "pakistan")
            }

            if(button == 'gxp_nrlAgrometChartButton'){
                this.output.optBtn.setDisabled(this.output.submitButton.disabled);
            }else{
                this.output.optBtn.disable();
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
