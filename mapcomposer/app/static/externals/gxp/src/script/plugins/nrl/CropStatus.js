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
 *  class = CropStatus
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.nrl");

/** api: constructor
 *  .. class:: NRL_Modules(config)
 *
 *    Plugin for adding NRL CropStatus Module to a :class:`gxp.Viewer`.
 */
gxp.plugins.nrl.CropStatus = Ext.extend(gxp.plugins.Tool, {
 /** api: ptype = nrl_crop_status */
    ptype: "nrl_crop_status",

	areaFilter: "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",
    radioQtipTooltip: "You have to be logged in to use this method",
    factorsurl:"http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:agrometdescriptor&outputFormat=json",
	rangesUrl: "http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:cropdata_ranges&outputFormat=json",
    startYear:2000,
	featureSelectorConfigs:{
        base:{
		toggleGroup:'toolGroup',
        xtype: 'gxp_searchboxcombo',
            anchor:'100%',
            fieldLabel: 'District',
            url: "http://84.33.2.24/geoserver/ows?",
            predicate:"ILIKE",
            sortBy:"province",
			ref:'singleSelector',
            displayField:"name",
            pageSize:10

        },
        DISTRICT:{
            typeName:"nrl:district_crop",
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
                   name:"district",
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
        PROVINCE:{
            fieldLabel: 'Province',
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
                    name: 'fname',
                    mapping: 'properties.fname'
                },
                {
                   name:"province",
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
		this.featureSelectorConfigs.base.url = this.dataUrl;
        var startYear = this.startYear;
        var now = new Date();
		var currentYear= now.getFullYear();
		var cropStatus  = {
					xtype:'form',
					title: 'Crop Status',
					layout: "form",
					minWidth:180,
					autoScroll:true,
					frame:true,
                    buttonAlign: 'left',
					items:[
						{
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
                                change: function(c,checked){
                                    var outputValue = c.getValue().inputValue;
                                    var submitButton = this.output.submitButton;
                                    var areaSelector = this.output.singleFeatureSelector;

                                    if(outputValue == 'data'){
                                        areaSelector.enable();
                                        submitButton.destroy();
                                        delete submitButton;
                                        this.output.addButton({
                                            url: this.dataUrl,
                                            xtype: 'gxp_nrlCropStatusTabButton',
                                            ref: '../submitButton',
                                            highChartExportUrl: this.highChartExportUrl,
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
                                            xtype: 'gxp_nrlCropStatusChartButton',
                                            url: this.dataUrl,
                                            ref: '../submitButton',
                                            highChartExportUrl: this.highChartExportUrl,
                                            target:this.target,
                                            form: this
                                        })
                                        var store = areaSelector.currentCombo.selectButton.store;
                                        this.output.fireEvent('update',store);
                                        this.output.fireEvent('show');
                                        this.output.doLayout();
                                        this.output.syncSize();
                                    }

                                    if(this.output.submitButton.xtype == 'gxp_nrlCropStatusChartButton'){
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
							ref:'season',
							name:'season',
							anchor:'100%',
							listeners:{
								change: function(c,checked){
									var commodity = this.ownerCt.Commodity;
									commodity.seasonFilter(checked.inputValue);
									var selectedCommodity = commodity.getStore().getAt(0).get(commodity.valueField);
									commodity.setValue(selectedCommodity);
								}
							}
						},{
							xtype:'nrl_single_aoi_selector',
							target:this.target,
                            layerStyle:this.layerStyle,
                            name:'region_list',
							ref:'singleFeatureSelector',
							featureSelectorConfigs:this.featureSelectorConfigs,
							hilightLayerName: 'hilight_layer_selectAction',
							vendorParams: {cql_filter:this.areaFilter}
						},{
                            name:'year',
                            disabled:true,
							xtype: 'singleyearcombobox',
							anchor:'100%',
                            ref:'yearSelector',
                            listeners:{
                                afterrender:function(sel){
                                    sel.setRange(startYear,currentYear);
                                }
                            }
						},{
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

                        }
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
                            var yearSelector =this.refOwner.yearSelector;
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
                                    yearSelector.setRange(min,max);
                                }
                            }
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
                xtype: 'gxp_nrlCropStatusChartButton',
				ref: '../submitButton',
                highChartExportUrl: this.highChartExportUrl,
				url:this.dataUrl,
                target:this.target,
				form: this,
                disabled:true

            }]
		};

        if (this.helpPath && this.helpPath != ''){
            cropStatus.buttons.unshift({
                xtype: 'gxp_nrlHelpModuleButton',
                portalRef: this.portalRef,
                helpPath: this.helpPath
            });
        }

		config = Ext.apply(cropStatus,config || {});

		this.output = gxp.plugins.nrl.CropStatus.superclass.addOutput.call(this, config);
		this.output.on('update',function(store){
            var button = this.output.submitButton.getXType();
            if (button == "gxp_nrlCropStatusChartButton" || button == 'gxp_nrlCropStatusTabButton'){
                this.output.submitButton.setDisabled(store.getCount()<=0)
            }

            if(this.output.submitButton.xtype == 'gxp_nrlCropStatusChartButton'){
                this.output.optBtn.setDisabled(this.output.submitButton.disabled);
            }else{
                this.output.optBtn.disable();
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
 Ext.preg(gxp.plugins.nrl.CropStatus.prototype.ptype, gxp.plugins.nrl.CropStatus);
