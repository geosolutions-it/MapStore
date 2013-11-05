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
 *    Component to generate data for the PrintReportHelper
 *
 */
gxp.plugins.printreport.Generator = Ext.extend(gxp.plugins.Tool, {

    /** api: xtype = gxp_printreportgenerator */
    xtype: 'gxp_printreportgenerator',

    /** config parameters **/
    form: null,
    target: null,
    printReportHelper: null,
    defaultRegionList: null,
    printConfig: null,

    /** api: config[url]
     *  ``String``
     *  URL of the wfs service.
     */
    url: null,
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        
        Ext.apply(this, config);
        
        this.addEvents(
            /** api: event[done]
             *  Fires when the data is generated.
             */
            "done",
            /** api: event[error]
             *  Fires when we have an error in data generation.
             *
             *  Listener arguments:
             *  * name - :class:`String` with the name of the error
             *  * cause - :class:`String` with the cause of the error
             */
            "error"
        );
        
        gxp.plugins.printreport.Generator.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[generate]
     *  Generate data for the report. Override it with the specific data of the report
     */
    generate: function(){
        // here the generators may inject data in printConfig
        this.onDone();
    },

    /** api: method[onDone]
     *  Call to the done event. If you need change the print config you can change inside
     */
    onDone:function(){
        this.fireEvent("done", this.printConfig);
    },

    defaultFirstStrDecorator: "{0}, ",
    defaultStrDecorator: "{0}, ",
    defaultLastStrDecorator: "{0}",

    /** api: method[cleanAndCapitalize]
     *  Utility to clean a string of "'" characters and capitalize it
     */
    cleanAndCapitalize: function(str, strDecorator, lastStrDecorator, firstStrDecorator){
        // decorators
        var firstDecorator = firstStrDecorator ? firstStrDecorator : this.defaultFirstStrDecorator;
        var decorator = strDecorator ? strDecorator : this.defaultStrDecorator;
        var lastDecorator = lastStrDecorator ? lastStrDecorator : this.defaultLastStrDecorator;
        // clean unused chars
        var cleanAndCap = this.replaceAll(str, "'", ""); // clean "'" char
        cleanAndCap = this.replaceAll(cleanAndCap, "\\", ""); // clean "\" char8
        //
        while(cleanAndCap.indexOf("\\") > -1){
            cleanAndCap = cleanAndCap.replace("\\", "");
        }
        if(cleanAndCap.indexOf(",") > -1){
            var resultStr = "";
            var strings = cleanAndCap.split(",");
            for(var i = 0; i < strings.length; i++){
                var subStrCap = this.cleanAndCapitalize(strings[i]);
                if(i == 0){
                    // first
                    subStrCap = String.format(firstDecorator, subStrCap);
                }else if(i < strings.length-1){
                    subStrCap = String.format(decorator, subStrCap);
                }else{
                    // last one
                    subStrCap = String.format(lastDecorator, subStrCap);
                }
                resultStr += subStrCap;
            }
            cleanAndCap = resultStr;
        }else{
            cleanAndCap = cleanAndCap.slice(0,1).toUpperCase() + cleanAndCap.slice(1).toLowerCase(); // Capitalize: Name
        }
        return cleanAndCap;
    },

    /** api: method[replaceAll]
     *  Utility to clean all occurs in a string
     */
    replaceAll: function(str, search, replace){
        var clean = str; 
        while(clean.indexOf(search) > -1){
            clean = clean.replace(search, replace);
        }
        return clean;
    }

    
});

Ext.reg(gxp.plugins.printreport.Generator.prototype.xtype, gxp.plugins.printreport.Generator);