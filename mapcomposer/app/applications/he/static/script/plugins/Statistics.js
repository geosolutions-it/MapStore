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
 * -@requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = Statistics
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: Statistics(config)
 *
 *    Plugin for adding HE Capacity Data Module to a :class:`gxp.Viewer`.
 */   
gxp.plugins.he.Statistics = Ext.extend(gxp.plugins.Tool, {
 /** api: ptype = he_capacity_data */
    ptype: "he_gcd_statistics",
	/** i18n **/
    titleText:'Capacity',
    types:[
        ['','-All Types-'],
        ["B","Bidirectional"],
        ["D","Delivery"],
        ["I","Injection"],
        ["R","Receipt"],
        ["U","Unknown"],
        ["W","Withdrawal"]
    ],
    /*
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
	   
        var today = new Date();
		this.form  = {
			xtype:'form',
            labelAlign:'top',
			title: this.titleText,
			layout: "form",
			minWidth:180,
			autoScroll:true,
			frame:true,
            
			items:[{
                        
                    ref:'pipeline',
                    name:'pipeline',
                    filter:'pipeline',
                    xtype:'gxp_searchboxcombo',
                    avoidSelectEvent:true,
                    emptyText: 'Select a pipeline',
                    fieldLabel:' Select A Pipeline To Begin',
                    anchor:'100%',
                    xtype:'gxp_searchboxcombo',

                    //behiviour
                    avoidSelectEvent:true,
                    hideTrigger:false,
                    triggerAction: 'all',
                    forceSelected:true,
                    clearOnFocus: false,
                    allowBlank:false,
                    typeAhead: false,

                    //data
                    url: this.geoServerUrl,
                    typeName: this.pipelineNameLayer,
                    mapPanel: this.target.mapPanel,
                    displayField: 'pl_PipelineName',
                    valueField: 'pl_FERC',
                    sortBy: 'pl_PipelineName',
                    queriableAttributes:[
                        "pl_PipelineName"
                     ],
                    tpl:"<tpl for=\".\"><div class=\"search-item\">{pl_PipelineName}</div></tpl>",
                    recordModel:[
                        {name:'id',
                         mapping:'id'
                        },{
                           name:"pl_PipelineName",
                           mapping:"properties.pl_PipelineName"
                        },
                        {
                           name:"pl_FERC",
                           mapping:"properties.pl_FERC"
                        },
                        {
                           name:"pl_FERC",
                           mapping:"properties.pl_FERC"
                        }
                     ]
                },{
                    xtype:'button',
                    toggle:true,
                    text:"Selected Points/All Points",
                    handler:function(){
                        var canvasWindow = new Ext.Window({
                            title:'Ext JS Canvas Window',
                            layout:'border',
                            autoScroll:false,
                            height:300,
                            width:900,
                            items:[{
                                region: 'center',
                                xtype:'gxp_ChartJsChart'
                            }]
                        }).show();
                    }

                },{
                    xtype: 'box',
                    autoEl: {
                        tag: 'div',
                        html:'Show Average Schedule Capacity For:'

                    }
                },{
                    xtype:'button',
                    toggle:true,
                    text:"Last Calendar year/for Dates",
                    handler:function(){
                        var canvasWindow = new Ext.Window({
                            title:'Ext JS Canvas Window',
                            layout:'border',
                            autoScroll:false,
                            height:500,
                            width:900,
                            items:[{
                                region: 'center',
                                xtype:'panel',
                                layout:'absolute',
                                border:false,
                                items:[{
                                    region: 'center',
                                    x: 50,
                                    y: 50,
                                    border:true,
                                    width:300,
                                    height:300,
                                    xtype:'gxp_C3Chart'
                                },{}]
                            }]
                        }).show();
                    }

                },{
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            xtype:'datefield',
                            value:today,
                            fieldLabel: 'Between',
                            name: 'start',
                            anchor:'100%'
                        }]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [{
                            xtype:'datefield',
                            value:today,
                            fieldLabel: 'And',
                            name: 'end',
                            anchor:'100%'
                        }]
                    }]
                },{
                    xtype:'button',
                    ref:'show_general_statistics_btn',
                    text: 'Show General Statistics',
                    iconCls:'gxp-icon-find',
                    disabled:false,
                    handler: function(){
                        var pipelineId = this.refOwner.getForm().getValues().pipeline;
                        new Ext.Window({
                            title: pipelineId +' - Pipeline Statistics',
                            layout: 'border',
                            autoScroll: false,
                            border:false,
                            height: 700,
                            width: 900,
                            items:[{
                                xtype: 'he_pipeline_statistics',
                                region:'center',
                                ferc:pipelineId,
                                border:false
                            }]
                        }).show();

                    }
                }]
            
		};
		config = Ext.apply(this.form, config || {});
		
		this.output = gxp.plugins.he.Statistics.superclass.addOutput.call(this, config);
		
		
		
		return this.output;
	}
    
 });
 Ext.preg(gxp.plugins.he.Statistics.prototype.ptype, gxp.plugins.he.Statistics);