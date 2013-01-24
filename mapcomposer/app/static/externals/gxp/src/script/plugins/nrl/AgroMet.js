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
 /** api: ptype = nrl_crop_data */
    ptype: "nrl_agromet",

    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function(config) {
	    
		
		var agroMet  = {
			xtype:'form',
			title: 'AgroMet',
			layout: "form",
			minWidth:180,
			autoScroll:true,
			buttons:[{text:'Compute',handler:function(){
						Ext.Msg.alert("Add Area","Not Yet Implemented");
				}}],
			frame:true,
			items:[
				{ 
					fieldLabel: 'Output Type',
					xtype: 'checkboxgroup',
					anchor:'100%',
					autoHeight:true,
					checkboxToggle:true,
					title: this.outputTypeText,
					autoHeight: true,

					defaultType: 'radio', // each item will be a radio button
					items:[
						{boxLabel: 'Data' , name: 'outputtype', inputValue: 'data'},
						{boxLabel: 'Chart', name: 'outputtype', inputValue: 'chart', checked: true}
					]
				},{ 
					fieldLabel: 'Season',
					xtype: 'nrl_seasonradiogroup',
					anchor:'100%'
				},{
					xtype: 'nrl_aoifieldset',
					anchor:'100%',
					target:this.target,
					layers:{
						DISTRICT:'nrl:District_Boundary',
						PROVINCE:'nrl:Province_Boundary'
					}
					
				},{
					xtype: 'label',
					anchor:'100%',
					fieldLabel:'Reference Year',
					text:2012, //TODO conf
					ref: 'referenceYear'
				},{
					ref: 'yearRangeSelector',
					xtype: 'yearrangeselector',
					anchor:'100%',
					maxValue: 2012, //TODO conf
					minValue: 1992, //TODO conf
					values:[2008,2012], //TODO conf
					listeners:{
					    scope: this,
						change:function(start,end){
							this.output.referenceYear.setText(end);
							
						}
					}
					
				},new Ext.ux.grid.CheckboxSelectionGrid({
                    title: 'Factors',
                    enableHdMenu:false,
                    hideHeaders:true,
                    autoHeight:true,
                    viewConfig: {forceFit: true},
                    columns: [{id:'name',mapping:'label',header:'Factor'}],
                    autoScroll:true,
                    store: new Ext.data.ArrayStore({
                        fields:Ext.data.Record.create([{name:'name',mapping:'name'},{name:'label',mapping:'boxLabel'}]),
                        data: [
                            {boxLabel: 'Max Temperature' , name: 'MaxTemperature', inputValue: 'MaxTemperature'},
                            {boxLabel: 'Min Temperature' , name: 'MinTemperature', inputValue: 'MinTemperature'},
                            {boxLabel: 'Precipitation' , name: 'Precipitation', inputValue: 'Precipitation'},
                            {boxLabel: 'Sunshine Duration' , name: 'sunshine', inputValue: 'sunshine'},
                            {boxLabel: 'Potential Evapo-Transpiration' , name: 'potentialevapotranspiration', inputValue: 'potentialevapotranspiration'},
                            {boxLabel: 'Real Evapo-Transpiration' , name: 'realevapotranspiration', inputValue: 'realevapotranspiration'}
                        ]
                    })
                
                })
			
			]
		};
		config = Ext.apply(agroMet,config || {});
		
		this.output = gxp.plugins.nrl.AgroMet.superclass.addOutput.call(this, config);
		return this.output;
	}
 });
 Ext.preg(gxp.plugins.nrl.AgroMet.prototype.ptype, gxp.plugins.nrl.AgroMet);