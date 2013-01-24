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
 
Ext.namespace('gxp.widgets.button');

gxp.widgets.button.SelectFeatureButton = Ext.extend(Ext.Button,{
	xtype: 'gxp_selectFeatureButton',
	selectableLayer: ['nrl:Province_Boundary'],
	nativeSrs : "EPSG:32642",
	
	hilightLayerName: 'hilight_layer_selectAction',
	
   // tooltip: this.infoActionTip,
	iconCls: "gxp-icon-getfeatureinfo",
	toggleGroup: this.toggleGroup,
	enableToggle: true,
	allowDepress: true,
	itemId: 'SelectAction',
	initComponent: function(){
		this.store.on('add',function(store,records,index){
			for(var i = 0 ; i< records.length ; i++){
				var feature = records[i];
				if(!this.hilightLayer){
					this.createHilightLayer();  
        }
				//TODO externalize Note: no way to get native projection from gml using openlayers (parse directly xml can be a solution)	
				var geometry = feature.get('geometry').transform(
					new OpenLayers.Projection(this.nativeSrs), 
					new OpenLayers.Projection(this.target.mapPanel.map.getProjection())
				);
				this.hilightLayer.addFeatures(feature.data);
			}
        },this);
		this.store.on('remove',function(store,records){
			if(!this.hilightLayer){
				return
			}
			if(records.length){
				var feature = records[i];
				for(var i = 0 ; i< records.length ; i++){
					var feature = records[i];
					this.hilightLayer.removeFeatures(feature.data);
				}
			} else {
				this.hilightLayer.removeFeatures(records.data);
			}
        },this);
		this.store.on('clear',function(store,records){
			if(!this.hilightLayer){
				return
			}
			this.hilightLayer.removeAllFeatures();
        },this);
		
		return gxp.widgets.button.SelectFeatureButton.superclass.initComponent.apply(this, arguments);
	},
	initEvents: function(){
        gxp.widgets.button.SelectFeatureButton.superclass.initEvents.call(this);
        //TODO
		
    },
	
	/**
	 * Updates control
	 */
	updateControl:  function (){
			// check if control is present
			var layername =this.selectableLayer;
			var queryableLayer = this.target.mapPanel.layers.queryBy(function(x){
				var name = x.get("name");
				var found = x.get("name")==layername
                return found;	
			});
			if(queryableLayer.length <=0){return}
			var active = false;
			if( this.control){
				active = this.control.active;
				this.control.deactivate();  // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
                this.control.destroy();
			}
			queryableLayer.each(this.addControl,this);
			if(active){this.control.activate()};
			
				
		
	},
	
	addControl:function(x){
		var vp = Ext.apply(this.vendorParams,{
			//srs: this.target.mapPanel.map.getProjection()
		
		});
		var control = new OpenLayers.Control.WMSGetFeatureInfo({
			url: x.getLayer().url,
			//queryVisible: true,
			
			infoFormat:  "application/vnd.ogc.gml" ,
			layers: [ x.getLayer()],
			vendorParams: vp,
			eventListeners: {
				getfeatureinfo: function(evt) {
					 
					for(var i = 0; i< evt.features.length ; i++){
						
						var record = new this.store.recordType(evt.features[i],evt.features[i].fid);
						//add if not in the store 
						var presentRecord = this.store.getById(record.id);
						if(!presentRecord){
							this.store.add(record);
						//remove if it is in the store
						}else{
							this.store.remove(presentRecord);
						}
					}
				},
				scope: this
			}
		});
		this.control = control;
		this.target.mapPanel.map.addControl(control);
		
	},
	
	setSelectableLayer: function(layername){
		if(this.selectableLayer == layername) return;
		this.selectableLayer = layername;
		if(!this.control) return;
		//remove old control
		
		
		//update the control
		this.updateControl();
		
		
	},
	createHilightLayer: function(){
		
		this.hilightLayer = new OpenLayers.Layer.Vector(
			this.hilightLayerName,
			{
				displayInLayerSwitcher:false
			}
		
		);
		
		this.target.mapPanel.map.addLayer(this.hilightLayer);
	
	},
	toggleHandler: function(button, pressed) {
			if(!this.control){
				this.updateControl();	
			}
			if (pressed) {
				button.control.activate();
			} else {
				button.control.deactivate();
			}
		
	}
});
Ext.reg(gxp.widgets.button.SelectFeatureButton.prototype.xtype,gxp.widgets.button.SelectFeatureButton);