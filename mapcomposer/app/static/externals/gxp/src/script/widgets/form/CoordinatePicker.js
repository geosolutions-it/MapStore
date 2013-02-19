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
Ext.namespace('gxp.widgets.form');
gxp.widgets.form.CoordinatePicker = Ext.extend(Ext.form.CompositeField,{
    xtype: 'gxp_coordinate_picker',
    /** i18n */
    fieldLabel:'Coordinates',
    pointSelectionButtionTip:'Click to enable point selection',
     /**
     * Property: latitudeEmptyText
     * {string} emptyText of the latitude field
     */
     latitudeEmptyText:'Latitude',
    /**
     * Property: longitudeEmptyText
     * {string} emptyText of the longitude field
     */
     longitudeEmptyText:'Longitude',
    /** end of i18n */
    
    /**
     * Property: outputSRS
     * {String} EPSG code of the export SRS
     *     
     */
    outputSRS: 'EPSG:4326',
    /**
     * Property: buttonIconCls
     * {String} Icon of the selection Button
     *     
     */
    buttonIconCls:'gx-cursor',
    /**
     * Property: selectStyle
     * {Object} Configuration of OpenLayer.Style. 
     *    used to highlight the clicked point
     *     
     */
    selectStyle:{
        pointRadius: 4, // sized according to type attribute
        graphicName: "circle",
        fillColor: "#0000FF",
        strokeColor: "#0000FF",
        fillOpacity:0.5,
        strokeWidth:2
        
    },
    /**
     * Property: decimalPrecision
     * {int} precision of the textFields   
     */
    decimalPrecision:10,
    /**
     * Property: selectLayerName
     * {string} name of the layer to highlight the clicked point   
     */
    selectLayerName: "select_marker_position_layer",
    /**
     * Property: displayInLayerSwitcher
     * {boolean} display the selection layer in layer switcher   
     */
    displayInLayerSwitcher: false,
    
    initComponent:function(){
        
        map= this.map;
        var compositeField = this;
        //create the click control
        var ClickControl= OpenLayers.Class(OpenLayers.Control, {                
            defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },

            initialize: function(options) {
                this.handlerOptions = OpenLayers.Util.extend(
                    {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                    this, arguments
                ); 
                this.handler = new OpenLayers.Handler.Click(
                    compositeField, {
                        'click': this.trigger
                    }, this.handlerOptions
                );
            }, 
            trigger: this.updateLonLat,
            map:map,
        });
        
        
        
         this.selectLonLat = new ClickControl();
         map.addControl(this.selectLonLat);
         
         this.items= [
                {
                    xtype     : 'numberfield',
                    emptyText : this.latitudeEmptyText,
                    ref: 'latitudeField',
                    flex      : 1,
                    decimalPrecision:this.decimalPrecision,
                    allowBlank:false,
                    name: 'lat'
                },{
                    xtype: 'button',
                    tooltip: this.pointSelectionButtionTip,
                    iconCls:this.buttonIconCls,
                    enableToggle: true,
                    toggleGroup: this.toggleGroup,
                  
                   
                    width:20,
                    listeners: {
                      scope: this, 
                      toggle: function(button, pressed) {  
                         if(pressed){
                              this.selectLonLat.activate();
                              this.updatePoint();
                              this.latitudeField.on('change',this.updatePoint,this);
                              this.longitudeField.on('change',this.updatePoint,this);
                              
                          }else{
                              this.selectLonLat.deactivate();
                              this.latitudeField.un('change',this.updatePoint,this);
                              this.longitudeField.un('change',this.updatePoint,this);
                              var layer = map.getLayersByName(this.selectLayerName)[0];
                              if(layer){
                                  map.removeLayer(layer);
                              }
                          }
                      }
                    }
                },{
                    xtype     : 'numberfield',
                    emptyText : this.longitudeEmptyText,
                    ref:'longitudeField',
                    decimalPrecision:this.decimalPrecision,
                    flex      : 1,
                    allowBlank:false,
                    name: 'lon'
                }
            ]
        
         return  gxp.widgets.form.CoordinatePicker.superclass.initComponent.apply(this, arguments);
    },
    updateLonLat: function(e){
        //get lon lat
        var map = this.map;
        var lonlat = map.getLonLatFromPixel(e.xy);
        //update point on the map
        this.updateMapPoint(lonlat);
        //
        lonlat.transform(map.getProjectionObject(),new OpenLayers.Projection(this.outputSRS) );
        this.latitudeField.setValue(lonlat.lat);
        this.longitudeField.setValue(lonlat.lon);
        
       
    },
    updatePoint: function(){
        var lat = this.latitudeField.getValue();
      var lon = this.longitudeField.getValue();
      if( lon && lat ){
        //add point
        var lonlat = new OpenLayers.LonLat(lon,lat);
        lonlat.transform(new OpenLayers.Projection(this.outputSRS),map.getProjectionObject() );
        this.updateMapPoint(lonlat);
      }
    },
    updateMapPoint:function(lonlat){
        if(this.selectStyle){
            var layer = map.getLayersByName(this.selectLayerName)[0];
            if(layer){
                map.removeLayer(layer);
            }
            var style = new OpenLayers.Style(this.selectStyle);
            layer = new OpenLayers.Layer.Vector(this.selectLayerName,{
                styleMap: style
                
            });
            var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
            var pointFeature = new OpenLayers.Feature.Vector(point);
            layer.addFeatures([pointFeature]);
            layer.displayInLayerSwitcher = this.displayInLayerSwitcher;
            map.addLayer(layer);
        
        }
    
    }
});
Ext.reg(gxp.widgets.form.CoordinatePicker.prototype.xtype,gxp.widgets.form.CoordinatePicker);         