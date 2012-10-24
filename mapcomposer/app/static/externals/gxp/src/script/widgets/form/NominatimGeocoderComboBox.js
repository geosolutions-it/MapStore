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

/** api: (define)
 *  module = gxp.form
 *  class = NominatimGeocoderComboBox
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("gxp.form");

/** api: constructor
 *  .. class:: NominatimGeocoderComboBox(config)
 *
 *  Creates a combo box that issues queries to the Nominatim Maps geocoding service.
 *  If the user enters a valid address in the search box, the combo's store
 *  will be populated with records that match the address.  Records have the 
 *  following fields:
 *
 *	* display_name 		- ``String`` The name to show 
 *	* lat 				- ``double`` 	Latitude 
 * 	* lon'				- 	``double``  Longitude
 * 	* boundingbox		-  ``double | Array ``	The Bounding box <left>,<top>,<right>,<bottom> 
 * 	* polygonpoints 	-  poligonpoints (if required)
 * 	* place_id			- 	id
 * 	* licence			- license 
 * 	* osm_type			-	object type openStreetMap
 * 	* osm_id			-	id in openStreetMap
 *  * class				-	class of the object
 *  * type				-	type of the object
 *  * address			-	address
 *
 */   
gxp.form.NominatimGeocoderComboBox = Ext.extend(Ext.form.ComboBox, {
    
    /** api: xtype = gxp_Nominatimgeocodercombo */
    xtype: "gxp_nominatimgeocodercombo",
	url: 'http://nominatim.openstreetmap.org/search?',
    /** api: config[queryDelay]
     *  ``Number`` Delay before the search occurs.  Default is 100ms.
     */
    queryDelay: 100,
    
    /** api: config[boundOption]
     *  ``String`` Optional option for restricting search.
	 *  "max" : search in map max extent
	 *  "current": search in current extent
	 *  "config": gets the passed bounds option in geographic coordinates 
     */
    boundOption :"max",
	 /** api: config[bounds]
     *  ``OpenLayers.Bounds | Array`` Optional bounds (in geographic coordinates)
     *  for restricting search.
     */
    
	 /** api: config[vendorOptions]
     *  ``int`` Optional Nominatim options option (in geographic coordinates)
     *  for restricting search and add information to the results. 
     */
	 vendorOptions:{
		bounded: 0,		//limit search to the viewbox
		countrycodes: '',	//limit search to the comma separated list of  countrycodes (e.g. it,es) 
		addressdetails:0,
		polygon:0
	},
    /** api: config[valueField]
     *  ``String``
     *  Field from selected record to use when the combo's ``getValue`` method
     *  is called.  Default is "location".  Possible value's are "location",
     *  "viewport", or "address".  The location value will be an 
     */
    valueField: "display_name",

    /** private: config[displayField]
     */
    displayField: "display_name",

    /** private: method[queryParam]
     *  Override
     */
	queryParam : "q",
	/** private: method[initComponent]
     *  Override
     */
    initComponent: function() {

		//nominatim supports jsonp and requires a parameter called 'json_callback'
		this.proxy = new Ext.data.ScriptTagProxy({
				url:this.url,
				callbackParam:'json_callback'
		});
       this.store = new Ext.data.JsonStore({
			combo:this,
			proxy:this.proxy,
			root: this.root,
			messageProperty: 'crs',
			autoLoad: false,
            proxy: this.proxy,
			//model of nominatim response 
			fields: [
				'display_name',   	//name to show
				'lat',				//latitude
				'lon',				//longitude
				'boundingbox',		//bounds
				'polygonpoints',	//poligonpoints (if required)
				'place_id',			//id
				'licence',			//license 
				'osm_type',			//object type openStreetMap
				'osm_id',			//id in openStreetMap
				'class',			//class of the object
				'type',				//type of the object
				'address'			//address
				],
			paramNames:{
				start: "startindex",	//not needed
				limit: "limit"			//max number of results
			},
			baseParams:{
				format:'json',
				addressdetails:this.vendorOptions.addressdetails,
				bounded:this.vendorOptions.bounded,
				countrycodes: this.vendorOptions.countrycodes,
				polygon:this.vendorOptions.polygon			
			
			},
			listeners:{
				beforeload: function(store){

					var bounds;
					if(this.bounded == "max"){
						bounds = app.mapPanel.map.getMaxExtent();
					}else if(!this.bounded =="current"){
						bounds = app.mapPanel.map.getExtent();
					}else{
						bounds= this.bounds;
					}
					if(bounds){
						//bounds.transform( app.mapPanel.map.getProjectionObject() ,new OpenLayers.Projection("EPSG:4326"));
						//required format for viewbox=<left>,<top>,<right>,<bottom>
						var viewbox= bounds.left+ ',' + bounds.top + ',' +bounds.right+ ',' +bounds.bottom;
						store.setBaseParam( 'viewbox ',viewbox );
					}
					
				},
				scope:this
			}
	
        });
        
        this.on({
            focus: function() {
                this.clearValue();
            },
            scope: this
        });
        
        return gxp.form.NominatimGeocoderComboBox.superclass.initComponent.apply(this, arguments);

    }


});

Ext.reg(gxp.form.NominatimGeocoderComboBox.prototype.xtype, gxp.form.NominatimGeocoderComboBox);
