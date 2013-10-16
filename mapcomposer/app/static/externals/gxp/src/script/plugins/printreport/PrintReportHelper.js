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
 * @requires plugins/Tool.js
 */

/** api: constructor
 *  .. class:: PrintReportHelper(config)
 *
 *    Base class to create charts and maps and send to the print module
 *
 */
gxp.plugins.printreport.PrintReportHelper = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_printreporthelper */
    ptype: 'gxp_printreporthelper',
    text: 'Generate Report',
    ref:'printreporthelper',      

    /** api: config[printService]
     *  ``String``
     *  URL of the print service.
     */
    printService: null,

    /** api: config[dataUrl]
     *  ``String``
     *  URL of the wfs service.
     */
    dataUrl: null,

    /** api: config[hideAll]
     *  Don't show report window and hide layers
     **/
    hideAll: true,

    /** api: config[defaultExtent]
     *  Default extent to print the reports
     **/
    defaultExtent: null,

    /**
     * Default provinces to generate the map (when select pakistan)
     **/
    defaultRegionList: 'Balochistan,Sindh,Pubjab,Fata,Kpk', //TODO: generate a new one or use the filter
    mapGenerationVariables: ['Area','Production','Yield'],

    layers:[],
    chartsSVG: [],
    firstSVG: null,
    emptyContent: '',
    generators: [],

    generatorsDoneCount: 0,

    /** api: config[fieldsetConfig]
     *  Default configuration for the fieldset.
     **/
    fieldsetConfig:{
        // Form parameters
        anchor:'100%',
        title: 'Layout configuration',
        collapsible:true,
        collapsed:true
    },

    /** api: config[formParameters]
     *  Base configuration parameters to manage in the form panel
     **/
    formParameters:{
        // Form parameters
        mapTitle: {
            xtype: "textfield",
            fieldLabel: "Report title",
            value: "Crop report map"
        },
        mapSubTitle: {
            xtype: "textfield",
            fieldLabel: "Subtitle",
            value: ""
        },
        cropPagesTitle: {
            xtype: "textfield",
            fieldLabel: "Crop pages title",
            value: "Crop info title"
        },
        meteorologicalPagesTitle: {
            xtype: "textfield",
            fieldLabel: "Meteorological pages title",
            value: "Meteorological info title"
        }
    },

    /** api: config[printConfig]
     *  Base configuration for the printing
     **/
    printConfig:{
        //Common
        comment: "Crop Report",
        dpi: 300,
        layout: "A3_report_1_legend", //TODO
        // To overwrite
        commodity: "Rice",
        portalText: "Crop Informational Portal",
        interval: "1999-2010",
        region: "Pakistan",
        outputFilename: "mapstore-print",
        map1Title: "First map",
        secondMapTitle: "Second map",
        thirdMapTitle: "Third map",
        srs: "EPSG:900913", //TODO: load from map!!
        units: "m",
        rotation: 0,
        maps:{
            first: {
                layers:[],
                srs: null //common!!
            }, // here the first map
            second: {
                layers:[],
                srs: null //common!!
            }, // here the second map
            third: {
                layers:[],
                srs: null //common!!
            }, // here the third map
        },
        images:{
            chart1:{
                content: null // here the content
            }
        },
        //TODO: change it dynamically
        legendOptions: "forceLabels%3Aon%3BfontSize%3A10&WIDTH=12&HEIGHT=12&FORMAT=image%2Fpng",
        scale: 17471330.182978604
    },
    
    /** private: config[fieldSet]
     *  Save the fieldset returned in the getFormParamatersFieldset method
     */
    fieldSet: null,
     
    /** private: method[constructor]
     */
    constructor: function(config){
        gxp.plugins.printreport.PrintReportHelper.superclass.constructor.call(this, config);
        // print provider and page initialization
        this.printProvider = new GeoExt.data.PrintProvider({
            url: this.printService,
            customParams: this.customParams,
            autoLoad: false
        });
        this.printPage = new GeoExt.data.PrintPage({
            printProvider: this.printProvider
        });
        this.printProvider.loadCapabilities();
    },
    
    /** api: method[getFormParamatersFieldset]
     *  :arg extraParameters: ``Map`` Optional parameters to show in the form panel
     *  :arg overrideConfig: ``Map`` Optional config for the form panel
     *  :returns: ``FormPanel`` with text fields composed by this.formParameters 
     *  and extraParameters initialized with the values of the map
     */
    getFormParamatersFieldset: function(extraParameters, overrideConfig){

        var fieldsetConfig = {};
        
        for(var config in this.fieldsetConfig){
            fieldsetConfig[config] = this.fieldsetConfig[config];
        }

        if(overrideConfig){
            Ext.apply(fieldsetConfig, overrideConfig);
        }

        var items = [];
        for(var field in this.formParameters){
            var itemConfig = this.formParameters[field];
            itemConfig.name = field;
            items.push(itemConfig);
        }

        if(extraParameters){
            for(var field in extraParameters){
                var itemConfig = extraParameters[field];
                itemConfig.name = field;
                items.push(itemConfig);
            }
        }

        fieldsetConfig.items = items;

        this.fieldSet = new Ext.form.FieldSet(fieldsetConfig);

        return this.fieldSet;
    },

    print: function () {
        this.generatorsDoneCount = 0;
        this.layer= [];
        this.chartsSVG = [];
        this.firstSVG = null;
        for(var i = 0; i< this.generators.length; i++){
            this.generators[i].on({
                done: function(printConfig){
                    this.onGeneratorDone();
                },
                scope: this
            });
            this.generators[i].generate();
        }
    },

    onGeneratorDone: function(){
        if(++this.generatorsDoneCount == this.generators.length){
            this.printAll();
        }
    },

    printAll: function(){
        // actual config
        var spec = {};
        Ext.apply(spec, this.printConfig);

        // ovewrite form parameters
        spec = this.writeFormParameters(spec);

        // maps config
        spec.maps.first.layers = [];
        spec.maps.second.layers = [];
        spec.maps.third.layers = [];
        spec.maps.first.layers.push(this.printProvider.encodeLayer(this.layers[0]));
        spec.maps.second.layers.push(this.printProvider.encodeLayer(this.layers[1]));
        spec.maps.third.layers.push(this.printProvider.encodeLayer(this.layers[2]));
        spec.maps.first.srs = spec.srs;
        spec.maps.second.srs = spec.srs;
        spec.maps.third.srs = spec.srs;
        // chart config
        spec.images.chart1.content = this.firstSVG;

        // bbox depends on this.selectedVector and this.defaultExtent
        var bbox = null;
        if(this.selectedVector){
            bbox = this.selectedVector.geometry.getBounds().toArray();
        }else{
            bbox = this.defaultExtent;
        }
        spec.bbox = bbox;
        spec.maps.first.bbox = spec.bbox;
        spec.maps.second.bbox = spec.bbox;
        spec.maps.third.bbox = spec.bbox;

        // Dynamic images pages
        spec.imagePages = [];
        var numPages = (this.chartsSVG.length)/2;
        var i = 1;
        while(i <= numPages){
            spec.imagePages.push({
                images:{
                    chart1: {
                        content: this.chartsSVG[(i*2)-2]
                    },
                    chart2: {
                        content: this.chartsSVG[(i*2)-1]
                    }
                }
            });
            i++;
        }
        var needOtherPage = (i != numPages) && (i-numPages<1);
        if(needOtherPage){
            spec.imagePages.push({
                images:{
                    chart1: {
                        content: this.chartsSVG[(i*2)-2]
                    },
                    chart2: {
                        content: this.emptyContent
                    }
                }
            });   
        }

        // print
        this.printSpec(spec);
    },

    /** api: method[writeFormParameters]
     *  :arg spec: ``Map`` With the information of the print
     *  :returns: ``Map`` with the configuration overwrited by the fieldset form
     */
    writeFormParameters: function(spec){
        if(this.fieldSet){
            // copy the form fieldset
            this.fieldSet.items.keys.forEach(function(key){
                var formParam = this.fieldSet.items.get(key);
                spec[formParam.name] = formParam.getValue();
            }, this);
        }else{
            // copy the default value
            for(var field in this.formParameters){
                var itemConfig = this.formParameters[field];
                spec[field] = itemConfig.value;
            }
        }

        // Common data of the form
        // TODO: maybe injected not readed here
        var values = this.form.output.getForm().getValues();
        if(values.areatype.toLowerCase() != 'pakistan' 
            && this.form.selectedProvince && this.form.selectedProvince.data.geometry){
            // copy vector feature selected
            this.selectedVector = this.form.selectedProvince.data;
            spec.region = this.cleanAndCapitalize(values.region_list); // region
        }else{
            spec.region = "Pakistan";
            this.selectedVector = null;
        }
        // commodity and interval
        spec.commodity = values.crop;
        spec.interval = values.startYear + "-" + values.endYear;

        return spec;
    },

    selectedVector: null,

    printSpec: function(spec){
        this.printProvider.customParams = spec;

        // changing center and extent
        var bounds; 
        var vector; 
        if(this.selectedVector){
            bounds = this.selectedVector.geometry.getBounds();
            vector = this.selectedVector;
            // this.printPage.fit(this.form.selectedProvince.data);
            // this.printPage.setCenter(this.form.selectedProvince.data.geometry.getCenterLonLat());
        }else if(this.defaultExtent){
            var bounds = new OpenLayers.Bounds(this.defaultExtent[0],this.defaultExtent[1],this.defaultExtent[2],this.defaultExtent[3]);
            var vector = new OpenLayers.Feature.Vector(bounds.toGeometry());
            vector.layer = this.target.mapPanel.map.layers[0]; // TODO: should add it in a hidden layer!!
        }
        if(bounds && vector){
            this.printPage.fit(vector);
            this.printPage.setCenter(bounds.getCenterLonLat());
        }else{
            // Default is the actual zoom
            this.printPage.setCenter(this.target.mapPanel.map.getCenter());
        }

        this.printProvider.print(this.target.mapPanel.map,this.printPage);
    },

    /** api: method[cleanAndCapitalize]
     *  Utility to clean a string of "'" characters and capitalize it
     */
    cleanAndCapitalize: function(str){
        var cleanAndCap = str.replace("'", "").replace("'", ""); // clean "'" char of 'name'
        cleanAndCap = cleanAndCap.slice(0,1).toUpperCase() + cleanAndCap.slice(1).toLowerCase(); // Capitalize: Name
        return cleanAndCap;
    }
});

Ext.preg(gxp.plugins.printreport.PrintReportHelper.prototype.ptype, gxp.plugins.printreport.PrintReportHelper);