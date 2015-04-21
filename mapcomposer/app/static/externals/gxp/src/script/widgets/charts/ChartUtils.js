Ext.namespace('nrl.chartbuilder.util');

nrl.chartbuilder.util = {
    generateDefaultChartOpt : function(records,labelName,IdName,height){
        //update selected crops
        var cseries = {};
        if(records.length > 0){
            var colorRGB = this.randomColorsRGB(records.length);
            var colorHEX = this.randomColorsHEX(records.length);

            for( var i = 0; i < records.length ; i++){
                var rec = records[i];

                cseries[rec.get(IdName)] = {
                    name: rec.get(labelName),
                    color: colorHEX[i],
                    lcolor: 'rgb(' + colorRGB[i] + ')',
                    type: 'column',
                    dataIndex: rec.get(IdName),
                    unit: rec.get('unit') //TODO use mappings parameter instead
                }
            }
        }
        var optionsCompare = {
            series:cseries,
            height:height != null ? height : 500
        }

        //TODO refactor this better
       return optionsCompare;

    },
    randomColorsRGB: function(total){
        var i = 360 / (total); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return rgb;
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.5, 0.71)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },
    randomColorsHEX: function(total){
        var i = 360 / (total); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.5, 0.71)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },
    createOptionsFildset: function(title,opts,prefix){
        
        var fieldSet = {
                xtype:'fieldset',
                title:title,
                items:[{
                    //type
                    fieldLabel:"Type",
                    xtype:"radiogroup", 
                    columns:2,
                     items:[
                        {  boxLabel:"<span class=\"icon_span ic_chart-line\">Line</span>",name:prefix+"_chart_type",inputValue:"line", checked : opts.type == "line"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-spline\">Curve</span>",name:prefix+"_chart_type",inputValue:"spline", checked : opts.type == "spline"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-bar\">Bar</span>",name:prefix+"_chart_type", inputValue:"column",checked : opts.type == "column"},
                        {  boxLabel:"<span class=\"icon_span ic_chart-area\">Area</span>",name:prefix+"_chart_type", inputValue:"area",checked : opts.type == "area"}
                        
                    ],
                    listeners: {
                        change: function(group,checked){
                            if(checked){
                                opts.type = checked.inputValue;
                            }
                        }
                    },
                    scope:this
                },{ //color
                    fieldLabel: 'Color', 
                    xtype:'colorpickerfield',
                    anchor:'100%',
                    value : opts.color.slice(1),
                     listeners: {
                        select: function(comp,hex,a,b,c,d,e){
                            if(hex){
                                opts.color = '#' + hex;
                                var rgb = comp.menu.picker.hexToRgb(hex);
                                opts.lcolor = "rgb(" +rgb[0]+ "," +rgb[1]+ ","+rgb[2]+ ")";
                            }
                        }
                    }
                }]
        }
        return fieldSet;
    },
    /**
     * private method[hexColorToRgba]
     * converts an hex color notation (#RRGGBB) in an object that
     * rapresents color in rgba notation.
     *
     * ``String`` hex color string
     * return: ``Object`` an object with properies:
     *                     - red   (decimal value for red);
     *                     - green (decimal value for green);
     *                     - blu   (decimal value for blu);
     *                     - alpha (decimal value for alpha channel);
     */
    hexColorToRgba: function(hexColor){
        var rgba = {
            red: 0,
            green: 0,
            blu: 0,
            alpha: 1,
            toString: function(){
                return 'rgba(' + this.red + ', ' + this.green + ', ' + this.blu + ', ' + this.alpha + ')'
            },
            setAlpha: function(n){
                if (n > 1) this.alpha = 1;
                else if (n < 0) this.alpha = 0;
                else this.alpha = n;
            }
        };

        /**
         * private method [byteToDec]
         * converts a string that rapresents a hexadecimal value
         * in a decimal number.
         *
         * ``String`` hexadecimal number
         * return: ``Number`` decimal value
         */
        function byteToDec(strByte){

            function hexDigitToDecValue(hexDigit){
                var value;
                switch(hexDigit){
                    case 'A': case 'a' : value = 10; break;
                    case 'B': case 'b' : value = 11; break;
                    case 'C': case 'c' : value = 12; break;
                    case 'D': case 'd' : value = 13; break;
                    case 'E': case 'e' : value = 14; break;
                    case 'F': case 'f' : value = 15; break;
                    default: value = parseInt(hexDigit);
                }
                return value;
            }

            var dec = 0;
            var e = strByte.length-1;

            for (var i=0; i<strByte.length; i++){
                dec *= 16;
                dec += hexDigitToDecValue(strByte[i]);
            }
            return dec;
        }

        hexColor   = hexColor.substr(1);
        rgba.red   = byteToDec(hexColor.substr(0,2));
        rgba.green = byteToDec(hexColor.substr(2,2));
        rgba.blu   = byteToDec(hexColor.substr(4,2));

        return rgba;
    },
    /**
     * Make a string in title case.
     * A string in title case format have the first char of each word in upper case;
     * the remain part of word is lower case. "The Title Case Format" is an
     * example of string in title case format.
     *
     * ``String`` str a string.
     * return: ``String`` str in title case.
     */
    toTitleCase: function(str){
        function toUpperCamelCase(word){
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        }
        return str.replace(/\w\S*/g, toUpperCamelCase);
    },
    /**
     * Convert month number into month name.
     *
     * ``Number``  n        month number (1-12)
     * ``Boolean`` longForm if true then the function returns the complete name of the month
     *                      if false then the funcion returns the 3-chars name of the month
     * return: ``String`` the name of the month
     */
    numberToMonthName: function(n, longForm){
        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var longMonths = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        return (!longForm ? shortMonths[n-1] : longMonths[n-1]);
    }
};