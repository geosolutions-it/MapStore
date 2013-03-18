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
	areaFilter: "province NOT IN ('GILGIT BALTISTAN','AJK','DISPUTED TERRITORY','DISPUTED AREA')",
    layerStyle: {
        strokeColor: "green",
        strokeWidth: 1,
        fillOpacity:0.6,
		cursor:'pointer'
    },
	/** i18n **/
	outputTypeText:'Output Type',
	
    factorsurl:"http://84.33.2.24/geoserver/nrl/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=nrl:AgroMet_factors&max&outputFormat=json",
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
			buttons:[{xtype:'gxp_nrlAgrometButton'}],
			frame:true,
			items:[
				{ 
					fieldLabel: this.outputTypeText,
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
					ref:'aoiFieldSet',
					anchor:'100%',
					target:this.target,
					areaFilter:this.areaFilter,
                    layerStyle: this.layerStyle,
					layers:{
						district:'nrl:district_boundary',
						province:'nrl:province_boundary'
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
					minValue: 2000, //TODO conf
					values:[2000,2012], //TODO conf
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
                    columns: [{id:'name',dataIndex:'factor',header:'Factor'}],
                    autoScroll:true,
                    store: new Ext.data.JsonStore({
                       
                        url:this.factorsurl,
						root:'features',
						idProperty:'factor',
						autoLoad:true,
						fields:[
							{name:'factor', mapping:'properties.factor'},
							{name:'max', mapping:'properties.max'},
							{name:'min', mapping:'properties.min'}
						]
						
                    })
                
                })
			
			]
		};
		config = Ext.apply(agroMet,config || {});
		
		this.output = gxp.plugins.nrl.AgroMet.superclass.addOutput.call(this, config);
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
	}
 });
 Ext.preg(gxp.plugins.nrl.AgroMet.prototype.ptype, gxp.plugins.nrl.AgroMet);