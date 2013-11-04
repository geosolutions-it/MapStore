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

    /** config parameters **/
    
    /** api: method[generate]
     *  Generate data for the report. Override it with the specific data of the report
     */
    generate: function(){
        // add selected regions
        var values = this.form.output.getForm().getValues();
        // add selected regions
        var values = this.form.output.getForm().getValues();
        if(!this.form.aoiSimpleSelection){
            if(values.areatype == 'province' || values.areatype == 'district'){
                this.printConfig.region = this.cleanAndCapitalize(values.region_list);
                // add layer
                var layer;
                var layers = [];
                if(this.form.hilightLayerName){
                    layer = this.target.mapPanel.map.getLayersByName(this.form.hilightLayerName)[0];
                    layers.push(layer);
                }
                this.printConfig.layers = layers;
                // change bounds
                var bounds = new OpenLayers.Bounds();
                this.form.regionsStore.each(function(reg){
                    bounds.extend(reg.data.geometry.getBounds());
                });
                this.printConfig.selectedVector = new OpenLayers.Feature.Vector(bounds.toGeometry());
                this.printConfig.selectedVector.layer = layer;
            }else{
                this.printConfig.region = "Pakistan";
                this.printConfig.selectedVector = null;
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
        this.onDone();
    }
    
});

Ext.reg(gxp.plugins.printreport.ExtraInformationGenerator.xtype, gxp.plugins.printreport.ExtraInformationGenerator);