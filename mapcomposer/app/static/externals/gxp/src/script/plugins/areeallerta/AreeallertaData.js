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
 * @requires plugins/Tool.js
 */
/**
 * @author Riccardo Mari
 */
/** api: (define)
 *  module = gxp.plugins
 *  class = AreeallertaData
 */
/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.areeallerta");

/** api: constructor
 *  .. class:: AreeallertaData(config)
 *
 *    Plugin for adding MainGeobasi AreeallertaData Module to a :class:`gxp.Viewer`.
 */
gxp.plugins.areeallerta.AreeallertaData = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_areeallertadata */
    ptype: "gxp_areeallertadata",
    selTipo: 'Seleziona',
    selMonitoraggio: 'Monitoraggio',
    selMatrixMethod: 'Metodo selezione Matrice',
    selElabMethod: 'Seleziona tipologia valori',
    dataUrl: null,

	/** private: method[init]
     *  :arg target: ``Object``
	 * 
	 *  Provide the initialization code defining necessary listeners and controls.
     */
	init: function(target) {
		target.on({
		    scope: this,
			'ready' : function(){

			}
		});
		return gxp.plugins.areeallerta.AreeallertaData.superclass.init.apply(this, arguments);
	},
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
        var conf = {
            //TODO year ranges (from available data)            
        }
        this.areaDamage = new gxp.form.SelDamageArea(Ext.apply({
            map: app.mapPanel.map,
            mapPanel: app.mapPanel
        }, this.outputConfig));


        this.areeallertaData = {
            xtype: 'form',
            id: "areeallertaDataForm",
            layout: "anchor",
            minWidth: 180,
            autoScroll: true,
            frame: false,
            listeners: {
                //'afterlayout': this.populateForm,
                scope: this
            },
            items: [{
                    xtype: 'fieldset',
                    id: 'timeVisualizationID',
                    title: 'Time',
                    cls: 'selected-query-layer'
                }, {
                    xtype: 'fieldset',
                    title: 'Seleziona tipo cumulata',
                    anchor: '100%',
                    ref: 'comboView1',
                    collapsible: false,
                    forceLayout: true, //needed to force to read values from this fieldset
                    collapsed: false,
                    hidden: true,
                    items: [{
                        xtype: 'combo',
                        ref: '../cumulativeStep',
                        id: 'cumulativeStep',
                        anchor: '100%',
                        fieldLabel: 'Step Cumulata',
                        typeAhead: true,
                        triggerAction: 'all',
                        lazyRender: false,
                        mode: 'local',
                        name: 'tipocumulativeStep',
                        forceSelected: true,
                        allowBlank: false,
                        autoLoad: true,
                        displayField: 'label',
                        valueField: 'cum',
                        value: "180",
                        readOnly: false,
                        store: new Ext.data.JsonStore({
                            fields: [{
                                name: 'name',
                                dataIndex: 'name'
                            }, {
                                name: 'label',
                                dataIndex: 'label'
                            }, {
                                name: 'cum',
                                dataIndex: 'cum'
                            }, {
                                name: 'shortName',
                                dataindex: 'shortName'
                            }, {
                                name: 'cid',
                                dataindex: 'cid'
                            }],
                            data: [{
                                label: '1 ora',
                                cum: "60"
                            }, {
                                label: '3 ore',
                                cum: "180"
                            }, {
                                label: '6 ore',
                                cum: "360"
                            }, {
                                label: '12 ore',
                                cum: "720"
                            }, {
                                label: '24 ore',
                                cum: "1440"
                            }]
                        })
                    }]
                }
                /*,
                					this.areaDamage*/
            ]
            /*
            ,
            bbar: [{
                    url: this.dataUrl,
                    chartID: "notAdded_boxPlot",
                    pagePosition: [10000, 0],
                    iconCls: "gxp-icon-areeallerta-boxplot",
                    xtype: 'gxp_areeallertaAverageRainfallButton',
                    text: "Pioggia Media",
                    ref: '../submitButton',
                    target: this,
                    form: this,
                    disabled: false,
                    filter: this.areaDamage,
                    addedLayer: false
                }, {
                    url: this.dataUrl,
                    chartID: "notAdded_barChart",
                    pagePosition: [10000, 400],
                    iconCls: "gxp-icon-areeallerta-barchart",
                    xtype: 'gxp_areeallertaMaxRainfallButton',
                    text: "Pioggia Massima",
                    ref: '../submitButton',
                    target: this,
                    form: this,
                    disabled: false,
                    filter: this.areaDamage,
                    addedLayer: false
                },{
                    url: this.dataUrl,
                    chartID: "notAdded_curvaCum",
                    pagePosition: [10000,800],
                    iconCls: "gxp-icon-areeallerta-curvacum",
                    xtype: 'gxp_geobasiDataCurvaCumButton',
                    text: "Crea Curva Cum.",
                    ref: '../submitButton',
                    target:this,
                    form: this,
                    disabled:false,
                    filter: this.areaDamage,
                    addedLayer: false
                }
            ]*/
        };

	    var realTimePanel = new Ext.Panel({
            layout: 'anchor',
            id: "realTimePanelID",
            header: false,
			items:[
				this.areeallertaData,
                {
                    xtype: 'gxp_playbackoptions'
                } 
			]          
		});
        
        this.formPanel = realTimePanel;
        
        config = Ext.apply(realTimePanel, config || {});

        this.output = gxp.plugins.areeallerta.AreeallertaData.superclass.addOutput.call(this, config);

    },
    populateForm: function(cmp) {
        //if (this.timeManager) {
        var setDate = this.areeallertaData.items[0].items[1];
        var alertDate = new Date().getTime();
        
        setDate.setValue(alertDate);
        setDate.originalValue = alertDate;
        //this.rangeStartField.setValue(new Date().getTime());
        //this.rangeStartField.originalValue = new Date().getTime();
        //}
    }

});

Ext.preg(gxp.plugins.areeallerta.AreeallertaData.prototype.ptype, gxp.plugins.areeallerta.AreeallertaData);