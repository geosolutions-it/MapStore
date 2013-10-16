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

/**
 * @requires plugins/printreport/Generator.js
 */

/** api: constructor
 *  .. class:: MapGenerator(config)
 *
 *    Component to generate maps for the PrintReportHelper
 *
 */
gxp.plugins.printreport.MapGenerator = Ext.extend(gxp.plugins.printreport.Generator, {

    /** config parameters **/
    layers: [],
    mapGenerationVariables: null,

    /** config:[addLayers]
     *  Add layers to the map or not
     **/
    addLayers: false,

    /** i18n **/
    mapsTitlesText: '{0} {1} map', // for example: 'Rice area map'

    //TODO: Improve doc

    generate: function(){
        this.layers = [];
        for(var i= 0; i < this.mapGenerationVariables.length; i++){
            this.generateMapForVariable(this.mapGenerationVariables[i], i);            
        }
    },

    generateMapForVariable:function(variable, index){

        var target = this.target;
        var form = this.form.output.getForm();
        var values =  this.form.output.getForm().getValues();
        var fieldValues = form.getFieldValues();

        // use parameter
        values.variable = variable;
        if(values.areatype.toLowerCase() == 'pakistan'){
            values.region_list = this.defaultRegionList;
        }
        
        var nextYr =parseInt(values.endYear)%100 +1;
        var crop =values.crop;
        
        var varparam ="";
        switch(values.variable) {
            case "Area" : varparam='area';break;
            case  "Production" : varparam ='prod';break;
            case "Yield" : varparam= 'yield';break;
        }
        var region_list=values.region_list.replace('\\,',',');
        var yieldFactor = fieldValues.production_unit == "000 bales" ? 170 : 1000;
        //set up cql_filter
        var cql_filter="1=1";
        if(values.areatype.toLowerCase()=='province' &&region_list.length>0 ){
            cql_filter="province IN ('" +region_list+ "')";
        
        }

        //set up the area type
        var areatype = values.areatype.toLowerCase();
        if(values.areatype.toLowerCase()=='pakistan'){
            areatype='province';
        }else{
            areatype='district';
        }
        
        
        var viewParams= "crop:" + values.crop.toLowerCase() + ";" +
                "gran_type:" + areatype + ";" +
                "start_year:" + values.endYear +";" + //same year for start and end.
                "end_year:" + values.endYear +";" + 
                "yield_factor:" + yieldFactor
        
        var style = areatype + "_" + values.crop.toLowerCase() + "_"+ varparam + "_style";

        
        var layerName = values.crop + " " + values.endYear + " - "+values.variable;
        if(values.areatype.toLowerCase() =='pakistan'){
            layerName += " - Pakistan";
        }else{

            layerName += " - " + this.cleanAndCapitalize(values.region_list);
        }

        var wms = new OpenLayers.Layer.WMS(layerName,
           this.url,
           {
            layers: "nrl:CropDataMap",
            styles: style,
            viewParams:viewParams,
            transparent: "true",
            cql_filter:cql_filter
            
        });
        
        var tooltip;
        var cleanup = function() {
            if (tooltip) {
                tooltip.destroy();
            }  
        };
        var button = this;

        // copy  to printPrams
        this.copyLayerParams(cql_filter, viewParams, style, wms, index + 1);
    },

    copyLayerParams: function(cql_filter, viewParams, style, layer, mapIndex){
        //Legend graphic url: '${map2Url}?VIEWPARAMS=${map2ViewParams}&TRANSPARENT=true&CQL_FILTER=${map2CqlFilter}&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=${map2Layer}&STYLE=${map2Style}&SCALE=${map2Scale}&LEGEND_OPTIONS=${map2LegendOptions}'
        // view config.yaml
        // to generate legend url dynamically
        this.printConfig["map" + mapIndex + "Url"] = encodeURI(layer.url);
        this.printConfig["map" + mapIndex + "Layer"] = encodeURI(layer.params.LAYERS);
        this.printConfig["map" + mapIndex + "Scale"] = encodeURI(this.printConfig.scale);
        this.printConfig["map" + mapIndex + "LegendOptions"] = this.printConfig.legendOptions; // maybe already encoded
        this.printConfig["map" + mapIndex + "CqlFilter"] = encodeURI(cql_filter);
        this.printConfig["map" + mapIndex + "ViewParams"] = encodeURI(viewParams);
        this.printConfig["map" + mapIndex + "Style"] = encodeURI(style);

        // map title
        // var commodity = this.printReportHelper.ownerCt.ownerCt.Commodity.getValue();
        // var commoditySelected = commodity ? commodity.slice(0, 1).toUpperCase() + commodity.slice(1) : 'Commodity';
        this.printConfig["map" + mapIndex + "Title"] = layer.name;
        //String.format(this.mapsTitlesText, commoditySelected, this.mapGenerationVariables[mapIndex -1].toLowerCase());

        this.layers.push(layer);

        if(this.mapGenerationVariables.length == this.layers.length){
            this.onDone();
        }
    },

    onDone: function(){
        if(this.addLayers){
            for (var i = 0; i <this.layers.length; i++){
                this.target.mapPanel.map.addLayer(this.layers[i]);
            }
        }
        this.fireEvent("done", this.printConfig, this.layers);
    }

});