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

Ext.namespace('gxp.plugins.printreport');

/**
 * @author Alejandro Diaz
 */

/** api: constructor
 *  .. class:: Generator(config)
 *
 *    Component to generate data for the PrintReportthis.printReportHelper
 *
 */
gxp.plugins.printreport.ExtraInformationGenerator = Ext.extend(gxp.plugins.printreport.Generator, {

    /** api: xtype = gxp_extrainforeportgenerator */
    xtype: 'gxp_extrainforeportgenerator',

    /** i18n **/    
    disclaimerText: "Disclaimer",
    /** EoF i18n **/

    /**
     **/
    targetLayerName:"hidden_hilight_layer",
    targetLayerStyle:{
        strokeColor: "red",
        strokeWidth: 1,
        fillOpacity:0
    },

    /** config parameters **/
    
    /** api: method[generate]
     *  Generate data for the report. Override it with the specific data of the report
     */
    generate: function(){
        // clean old data
        this.printConfig = {};
        // add selected regions
        var values = this.form.output.getForm().getValues();
        if(!this.form.aoiSimpleSelection){
            if(values.areatype == 'province' || values.areatype == 'district'){
                this.printConfig.region = this.cleanAndCapitalize(values.region_list);
                // apply print style and add layer
                var layer;
                var layers = [];
                if(this.form.hilightLayerName){
                    layer = this.target.mapPanel.map.getLayersByName(this.form.hilightLayerName)[0];
                    var vectorLayer = new OpenLayers.Layer.Vector(this.targetLayerName,{
                        style: this.targetLayerStyle
                    });
                    var features = [];
                    for(var i = 0; i < layer.features.length; i++){
                        var feature = new OpenLayers.Feature.Vector(layer.features[i].geometry);
                        features.push(feature);
                    }
                    vectorLayer.addFeatures(features);
                    layers.push(vectorLayer);
                }
                this.printConfig.layers = layers;
                // change bounds
                var bounds = new OpenLayers.Bounds();
                this.form.regionsStore.each(function(reg){
                    bounds.extend(reg.data.geometry.getBounds());
                });
                // TODO: Repair it and remove from button
                // this.printConfig.selectedVector = new OpenLayers.Feature.Vector(bounds.toGeometry());
                // this.printConfig.selectedVector.layer = this.target.mapPanel.map.layers[0];
            }else{
                this.printConfig.region = "Pakistan";
                this.printConfig.selectedVector = null;
                // clean layers
                this.printConfig.layers = [];
            }
            //TODO: this.printReportHelper.selectedVector = bbox;
        }else{        
            this.ownerCt.selectedRegions;
            // Common data of the form
            if(values.areatype.toLowerCase() != 'pakistan' 
                && this.form.selectedProvince && this.form.selectedProvince.data.geometry){
                // copy vector feature selected
                this.printConfig.selectedVector = this.form.selectedProvince.data;
                this.printConfig.region = this.cleanAndCapitalize(values.region_list); // region
            }else{
                this.printConfig.region = "Pakistan";
                this.printConfig.selectedVector = null;
            }
        }

        // disclaimer
        this.printConfig.disclaimer = this.disclaimerText;

        this.printConfig.season = values && values.season ? this.cleanAndCapitalize(values.season) : "Rabi";

        this.onDone();
    }
    
});

Ext.reg(gxp.plugins.printreport.ExtraInformationGenerator.xtype, gxp.plugins.printreport.ExtraInformationGenerator);