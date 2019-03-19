/** api: (define)
 *  module = gxp.he.grid
 *  class = ScheduledCapacitiesGrid
 */
Ext.namespace("gxp.he.grid");

/** api: constructor
 *  .. class:: ScheduledCapacitiesGrid(config)
 *
 *      Create a new grid displaying the contents of a 
 *      ``GeoExt.data.FeatureStore`` for Scheduled Capacities .
 */
gxp.he.grid.ScheduledCapacitiesGrid = Ext.extend(gxp.grid.FeatureGrid, {

    /** api: config[map]
     *  ``OpenLayers.Map`` If provided, a layer with the features from this
     *  grid will be added to the map.
     */
    map: null,

    /** api: config[ignoreFields]
     *  ``Array`` of field names from the store's records that should not be
     *  displayed in the grid.
     */
    ignoreFields: ['count','FERC'],
    
    /** api: config[layer]
     *  ``OpenLayers.Layer.Vector``
     *  The vector layer that will be synchronized with the layer store.
     *  If the ``map`` config property is provided, this value will be ignored.
     */
    
    /** api: config[schema]
     *  ``GeoExt.data.AttributeStore``
     *  Optional schema for the grid. If provided, appropriate field
     *  renderers (e.g. for date or boolean fields) will be used.
     */

    /** api: config[dateFormat]
     *  ``String`` Date format. Default is the value of
     *  ``Ext.form.DateField.prototype.format``.
     */

    /** api: config[timeFormat]
     *  ``String`` Time format. Default is the value of
     *  ``Ext.form.TimeField.prototype.format``.
     */

    /** private: property[layer]
     *  ``OpenLayers.Layer.Vector`` layer displaying features from this grid's
     *  store
     */
    layer: null,
    
    /** api: config[fileName]
     *  ``String``
     *  The name of the file to download
     */
    fileName: "scheduled-capacities.png",
    
    /** api: method[getColumns]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Array``
     *  
     *  Gets the configuration for the column model.
     */
    getColumns: function(store) {
        function getRenderer(format) {
            return function(value) {
                //TODO When http://trac.osgeo.org/openlayers/ticket/3131
                // is resolved, change the 5 lines below to
                // return value.format(format);
                var date = value;
                if (typeof value == "string") {
                     date = Date.parseDate(value.replace(/Z$/, ""), "c");
                }
                return date ? date.format(format) : value;
            };
        }
		
        var columns = [{
			xtype: 'actioncolumn',
			header: "", 
			width: 30,
			hidden: false,
			scope: this,
			items: [{
				iconCls: 'zoomaction',
				tooltip: this.actionTooltip,
				scope: this,
				handler: function(grid, rowIndex, colIndex){
					var store = grid.getStore();
					var row = store.getAt(rowIndex);
					var feature = row.data.feature;
					if(feature){
                        if(feature){
                        var geom=feature.geometry;
                            this.map.setCenter(new OpenLayers.LonLat(geom.x,geom.y),15,false,true);
                        }
                        /*
						var bounds = feature.geometry.getBounds();
						if(bounds){
							this.map.zoomToExtent(bounds);
							
							var showButton = Ext.getCmp("showButton");
							if(!showButton.pressed){
								showButton.toggle(true);
							}
							
							grid.getSelectionModel().selectRow(rowIndex);
						}*/
					}
				}
			}]
		}];
        columns.push({
                xtype: 'actioncolumn',
                header: "",
                width: 30,
                position: 1,
                hidden: false,
                scope: this,
                items: [{
                    iconCls: 'ic_chart-spline',
                    tooltip: "Chart",
                    text: 'Chart',

                    handler: function (grid, rowIndex, colIndex) {
                        var store = grid.getStore();
                        var row = store.getAt(rowIndex);
                        var feature = row.data.feature;
                        
                        var chart = {
                            title: feature.data.Location,
                            xtype: 'gxp_chart_panel',
                            region: 'center',
                            ref: 'chartPanel', 
                            showLegend:false,
                            frame:false,
                            header:true,
                            border: false,
                            bodyStyle:'background-color: #FAFAFA;',
                            chartOptions: {
                                data:this.testData,
                                xField:'Effective_Date',
                                yField:'Scheduled_Capacity',
                                //y_label:'Scheduled Capacity',
                                store: new Ext.data.JsonStore({
                                    root: 'features',
                                    autoLoad: true,
                                    fields:[{name:"Effective_Date",mapping:'properties.cpcty_EffectiveDate'},
                                            {name:"Designed_Capacity",mapping:'properties.cpcty_Design'},
                                            {name:"Scheduled_Capacity",mapping:'properties.cpcty_Scheduled'},
                                            {name:"Operational_Capacity",mapping:'properties.cpcty_Operational'}
                                           ],
                                    url: 'http://geoweb-portal.com/geoserver/gascapacity/ows?&outputFormat=application%2Fjson',
                                    vendorParams: store.vendorParams ,
                                    baseParams: Ext.apply(this.vendorParams || {} , {
                                        service:'WFS',
                                        version:'1.1.0',
                                        request:'GetFeature',
                                        outputFormat: 'application/json',
                                        typeName:"gascapacity:gcd_v_scheduled_capacity_by_pipeline_detail",
                                        viewparams: store.viewparams + ";cpcty_RID:" + feature.data.cpcty_RID
                                    })
                                }),
                                //xtype: 'gxp_C3Chart'
                                xtype: 'gxp_MGChart',
                                dateFormat : '%Y-%m-%dZ'

                            }
                        };
                        
                        var canvasPanel = {
                            ref: 'canvasPanel',
                            xtype: 'component',
                            autoEl: {
                                tag: 'canvas'
                            },
                            hidden :true
                        };
                        
                        var headerClass = "x-window-header";
                        if(feature.data.Point_Type && feature.data.Point_Type != ""){
                            headerClass = headerClass + " headerptype"+feature.data.Point_Type;
                        }
                        
                        //regex is for IE11 so we have to use a servlet
                        if(Ext.isIE11 === undefined){
                            Ext.isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
                        }
                        
                        var windowTools = [];
                        if(app.userCanPrint()){
                            this.service = app.printServiceURL;
                            windowTools = [{
                                id:'print',
                                scope: this,
                                handler: function(event, toolEl, panel){
                                    
                                    var me = this;
                                    
                                    // Hide Window Buttons
                                    var visible_items = $(panel.header.dom)
                                        .children([".x-tool"])
                                        .filter(function (index) {
                                              return $(this).css("display") === "block";
                                          });
                                    $.each(visible_items, function(i, item){$(item).hide()});
                                    
                                    var target = panel.getEl().dom;
                                    //var tgtparent = target.parentElement;
                                    var data = target.className;
                                    target.className += " html2canvasreset";//set className - Jquery: $(target).addClass("html2canvasreset");
                                    //$(target).appendTo(document.body)
                                    this.inlineAllStyles();
                                    
                                    panel.canvasPanel.show();
                                    
                                    canvg(
                                        panel.canvasPanel.getId(),
                                        panel.chartPanel.getEl().child('svg').parent().dom.innerHTML);
                                    panel.chartPanel.hide();
                                    html2canvas( target , {
                                            proxy: proxy,
                                           // allowTaint:true,  
                                            //CORS errors not managed with ie11, so disable
                                            useCORS: !Ext.isIE11,
                                            //logging:true,
                                            onrendered: function(c) {
                                                target.className = data;
                                                var canvasData = c.toDataURL("image/png;base64");
                                                if(Ext.isIE || Ext.isIE11){
                                                    me.uploadCanvas(canvasData);
                                                }else{
                                                    me.localDownload(canvasData);
                                                }
                                                // Restore Window buttons
                                                $.each(visible_items, function(i, item){$(item).show()});
                                                panel.chartPanel.show();
                                                panel.canvasPanel.hide();
                                                // Reattach panel to original parent
                                                //$(target).appendTo(tgtparent);
                                            }
                                    });
                                    
                                }
                            }];

                        }
                        
                        var canvasWindow = new Ext.Window({
                            title: "Scheduled Capacities",
                            maximizable:true,
                            collapsible:true,
                            title: 'Capacities' + (feature.data.Prop_Name? ' - ' + feature.data.Prop_Name : "") +'<i  style="font-size:.8em;color:#C47A02; float:right; padding-right:5px; ">MDth/d</i>',
                            layout: 'border',
                            autoScroll: false,
                            height: 350,
                            width: 950,
                            items: [chart, canvasPanel],
                            headerCfg : {
                                cls : headerClass
                            },
                            tools: windowTools
                        }).show();

                    }
                }]
            });
		var name, type, xtype, format, renderer, width;
        (this.schema || store.fields).each(function(f) {
            if (this.schema) {
                name = f.get("name");
                type = f.get("type").split(":").pop();
                align = undefined;
                format = null;
                width = 200;
                xtype = "gridcolumn";
                switch (type) {
                    case "date":
                        format = this.dateFormat;
                    case "datetime":
                        format = format ? format : this.dateFormat + " " + this.timeFormat;
                        xtype = undefined;
                        renderer = getRenderer(format);
                        break;
                    case "boolean":
                        xtype = "booleancolumn";
                        width = 30;
                        break;
                    case "string":
                        xtype = "gridcolumn";
                        break;
                    default:
                        xtype = "numbercolumn";
                        align = "right";
                        width = 115;
                        format = "0,000";
                }
            } else {
                name = f.name;
            }
            if (this.ignoreFields.indexOf(name) === -1) {
                
                if(this.customColumnsWidth && this.customColumnsWidth[name]){
                    width = this.customColumnsWidth[name];
                }
                
                columns.push({
                    dataIndex: name,
                    header: name.replace("_"," "),
                    width: width,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    align: align ? align : undefined,
                    renderer: xtype ? undefined : renderer
                });
            }
        }, this);
        
        return columns;
    },
   
        /**
     * private method[localDownload]
     * Use a link and emulate click to download the data:image in the canvasData argument. 
     * Works for Chrome and Firefox
     */
    localDownload: function(canvasData){
        var img = new Image();
        img.src= canvasData;
        var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = this.fileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    
    },
    
    /** api: method[uploadCanvas]
     * upload base64 ecoded canvas data to servicebox and finalize with download response.
     * A service that forces download is needed for Internet Explorer (now IE11 download attribute in link is not supported)
     */
    uploadCanvas: function (canvasData){
        var mHost = this.service.split("/");

        var mUrl = this.service + "UploadCanvas";
            mUrl = mHost[2] == location.host ? mUrl : proxy + mUrl;

        Ext.Ajax.request({
            url: mUrl,
            method: "POST",
            headers:{
                  'Content-Type' : 'application/upload'
            },
            params: canvasData,
            scope: this,
            success: function(response, opts){
                if (response.readyState == 4 && response.status == 200){
                    if(response.responseText && response.responseText.indexOf("\"success\":false") < 0){
                        var fname = this.fileName;

                        var mUrl = this.service + "UploadCanvas";
                            mUrl = mHost[2] == location.host ? mUrl + "?ID=" + response.responseText + 
                                "&fn=" + fname : proxy + encodeURIComponent(mUrl + "?ID=" + response.responseText + "&fn=" + fname);

                        app.safeLeaving =true;
                        window.location.assign(mUrl);

                    }else{
                        // this error should go to failure
                        Ext.Msg.show({
                             title: this.printStapshotTitle,
                             msg: this.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
                             width: 300,
                             icon: Ext.MessageBox.ERROR
                        });
                    }
                }else if (response.status != 200){
                    Ext.Msg.show({
                         title: 'Print Snapshot',
                         msg: this.serverErrorMsg,
                         width: 300,
                         icon: Ext.MessageBox.ERROR
                    });
                }	
            },
            failure:  function(response, opts){
                Ext.Msg.show({
                     title: this.printStapshotTitle,
                     msg: this.generatingErrorMsg + " " + gxp.util.getResponseFailureServiceBoxMessage(response),
                     width: 300,
                     icon: Ext.MessageBox.ERROR
                });
            }
        });
    },
    
    
    inlineAllStyles: function () {
        var svg_style, selector, cssText;

        for (var i = 0; i <= document.styleSheets.length - 1; i++) {
            //loop through your stylesheets
            if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('metricsgraphics.css') != -1) {
                //pull out the styles from the one you want to use
                if (document.styleSheets[i].rules != undefined) {
                    svg_style = document.styleSheets[i].rules
                } else {
                    svg_style = document.styleSheets[i].cssRules
                }
            }
        }

        if (svg_style != null && svg_style != undefined) {
            for (var i = 0; i < svg_style.length; i++) {
                if (svg_style[i].type == 1) {

                    selector = svg_style[i].selectorText;

                    styles = this.makeStyleObject(svg_style[i]);

                    // Apply the style directly to the elements that match the selctor
                    // (this requires to not have to deal with selector parsing)
                    $(selector).css(styles);
                }
            };
        }
    },

    makeStyleObject: function(rule) {
        var styleDec = rule.style;
        var output = {};
        var s;

        for (s = 0; s < styleDec.length; s++) {
            output[styleDec[s]] = styleDec[styleDec[s]];
            if(styleDec[styleDec[s]] === undefined) {
                //firefox being firefoxy
                output[styleDec[s]] = styleDec.getPropertyValue(styleDec[s])
            }
        }

        return output;
    }
    

});

/** api: xtype = gxp_featuregrid */
Ext.reg('he_scheduled_capacities_grid', gxp.he.grid.ScheduledCapacitiesGrid); 
