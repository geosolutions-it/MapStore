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
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return rgb;
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.57, 0.63)); // you can also alternate the saturation and value for even more contrast between the colors
        }
        return r;
    },
    randomColorsHEX: function(total){
        var i = 360 / (total - 1); // distribute the colors evenly on the hue range
        var r = []; // hold the generated colors
        var hsvToRgb = function(h,s,v){
            var rgb= Ext.ux.ColorPicker.prototype.hsvToRgb(h,s,v);
            return "#" +  Ext.ux.ColorPicker.prototype.rgbToHex( rgb );
        }
        for (var x=0; x<total; x++)
        {
            r.push(hsvToRgb(i * x, 0.57, 0.63)); // you can also alternate the saturation and value for even more contrast between the colors
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
}

