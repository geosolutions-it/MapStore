/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = ScaleOverlay
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class:: ScaleOverlay(config)
 *   
 *      Create a panel for showing a ScaleLine control and a combobox for 
 *      selecting the map scale.
 */
gxp.ScaleOverlay = Ext.extend(Ext.Panel, {
    
    /** api: config[map]
     *  ``OpenLayers.Map`` or :class:`GeoExt.MapPanel`
     *  The map for which to show the scale info.
     */
    map: null,

    /** api: config[topOutUnits]
     *  {String} Units for zoomed out on top bar. Default is km.
     */    
    topOutUnits: null,
    
    /** api: config[topInUnits]
     *  {String} Units for zoomed in on top bar. Default is m.
     */    
    topInUnits: null,
    
    /** api: config[displaySystem]
     *  {String} Units for zoomed in on scale bar. Default is nautical.
     */
    displaySystem: null,
    
    /** api: config[bottomInUnits]
     *  {String} Units for zoomed in on bottom bar. Default is ft.
     */    
    bottomInUnits: null,
    
    /** api: config[bottomOutUnits]
     *  {String} Units for zoomed out on bottom bar. Default is mi.
     */    
    bottomOutUnits: null,

    /** api: config[enableSetScaleUnits]
     *  {boolean} Enable or disable ComboUnits.
     */        
    enableSetScaleUnits: true,

    /** api: config[divisions]
     *  {integer} Number of Divisions.
     */ 
    divisions: 2,
    
    /** api: config[subdivisions]
     *  {integer} Number of SubDivisions.
     */ 
	subdivisions: 2,
	
	/** api: config[showMinorMeasures]
     *  {boolean} Enable or disable MinorMeasures.
     */ 
    showMinorMeasures: false,
    
    /** api: config[singleLine]
     *  {boolean} Enable or disable Single Line display.
     */ 
    singleLine: false,
    
    /** api: config[abbreviateLabel]
     *  {boolean} Enable or disable Abbreviate Labels.
     */ 
    abbreviateLabel: false,

    /** i18n */
    zoomLevelText: "Zoom level",

    /** private: method[initComponent]
     *  Initialize the component.
     */
    initComponent: function() {
        gxp.ScaleOverlay.superclass.initComponent.call(this);
        
        if(!this.topOutUnits){
            this.topOutUnits = "km";
        }
        if(!this.topInUnits){
            this.topInUnits = "m";
        }
        if(!this.bottomInUnits){
            this.bottomInUnits = "ft";
        }
        if(!this.bottomOutUnits){
            this.bottomOutUnits = "mi";
        }
        if(!this.displaySystem){
        	this.displaySystem = "nautical";
        }
        
        this.cls = 'map-overlay';
        if(this.map) {
            if(this.map instanceof GeoExt.MapPanel) {
                this.map = this.map.map;
            }
            this.bind(this.map);
        }
        this.on("beforedestroy", this.unbind, this);        
    },
    
    /** private: method[addToMapPanel]
     *  :param panel: :class:`GeoExt.MapPanel`
     *  
     *  Called by a MapPanel if this component is one of the items in the panel.
     */
    addToMapPanel: function(panel) {
        this.on({
            afterrender: function() {
                this.bind(panel.map);
            },
            scope: this
        });
    },
    
    /** private: method[stopMouseEvents]
     *  :param e: ``Object``
     */
    stopMouseEvents: function(e) {
        e.stopEvent();
    },
    
    /** private: method[removeFromMapPanel]
     *  :param panel: :class:`GeoExt.MapPanel`
     *  
     *  Called by a MapPanel if this component is one of the items in the panel.
     */
    removeFromMapPanel: function(panel) {
        var el = this.getEl();
        el.un("mousedown", this.stopMouseEvents, this);
        el.un("click", this.stopMouseEvents, this);
        this.unbind();
    },

    /** private: method[addScaleLine]
     *  
     *  Create the scale line control and add it to the panel.
     */
    addScaleLine: function(topOutUnits,topInUnits,bottomInUnits,bottomOutUnits,divisions,subdivisions,showMinorMeasures,singleLine,abbreviateLabel) {
        if(topOutUnits && topInUnits && bottomInUnits && bottomOutUnits){
            Ext.getCmp("id_box").destroy();
        }
        
        this.scaleLinePanel = new Ext.BoxComponent({
            id: "id_box",
            autoEl: {
                tag: "div",
                cls: "olControlScaleLine overlay-element overlay-scaleline"
            }
        });
        
        this.on("afterlayout", function(){
            if(!topOutUnits){
                this.scaleLinePanel.getEl().dom.style.position = 'relative';
                this.scaleLinePanel.getEl().dom.style.display = 'inline';
            }else{ 
                Ext.get("id_box").insertBefore(Ext.get("zoom_selector"));               
            }
            this.getEl().on("click", this.stopMouseEvents, this);
            this.getEl().on("mousedown", this.stopMouseEvents, this);
        }, this);
        
        this.scaleLinePanel.on('render', function(){
        	var mousePositionControl = this.map.getControlsByClass('OpenLayers.Control.MousePosition');
            //var scaleLineControl = this.map.getControlsByClass('OpenLayers.Control.ScaleLine');
            var scaleBarControl  = this.map.getControlsByClass('OpenLayers.Control.ScaleBar');
            if(topOutUnits && topInUnits && bottomInUnits && bottomOutUnits){
            	this.map.removeControl(mousePositionControl[0]);
                //this.map.removeControl(scaleLineControl[0]);
                this.map.removeControl(scaleBarControl[0]);
            }
            var mousePosition = new OpenLayers.Control.MousePosition({
                prefix: '<a target="_blank" ' +
                        'href="http://spatialreference.org/ref/epsg/4326/">' +
                        'EPSG:4326</a> lon/lat: ',
                separator: '; ',
                numDigits: 3,
                //emptyString: ' - ',
                div: this.scaleLinePanel.getEl().dom
            });
            /*var scaleLine = new OpenLayers.Control.ScaleLine({
                geodesic: true,
				topOutUnits:       topOutUnits ? topOutUnits : this.topOutUnits,
				topInUnits:        topInUnits ? topInUnits : this.topInUnits,
				bottomInUnits:     bottomInUnits ? bottomInUnits : this.bottomInUnits,
				bottomOutUnits:    bottomOutUnits ? bottomOutUnits : this.bottomOutUnits,
                div: this.scaleLinePanel.getEl().dom
            });*/

			if (topOutUnits != "hide") {
	            var scalebar = new OpenLayers.Control.ScaleBar({
	                geodesic: true,
	                displaySystem:     topOutUnits ? (topOutUnits == "mi" || topOutUnits == "nmi" ? "nautical" : "metric") : this.displaySystem,
					divisions:         divisions ? divisions : this.divisions,
					subdivisions:      subdivisions ? subdivisions : this.subdivisions,
	                showMinorMeasures: showMinorMeasures ? showMinorMeasures : this.showMinorMeasures,
	                singleLine:        singleLine ? singleLine : this.singleLine,
	                abbreviateLabel:   abbreviateLabel ? abbreviateLabel : this.abbreviateLabel
	                //div: this.scaleLinePanel.getEl().dom
	            });

            	this.map.addControl(scalebar);
            	scalebar.activate();
            }
            this.map.addControl(mousePosition);
            //this.map.addControl(scaleLine);
            mousePosition.activate();
            //scaleLine.activate();
        }, this);

        this.add(this.scaleLinePanel);
    },

    /** private: method[handleZoomEnd]
     *
     * Set the correct value in the scale combo box.
     */
    handleZoomEnd: function() {
        var scale = this.zoomStore.queryBy(function(record) { 
            return this.map.getZoom() == record.data.level;
        }, this);
        if (scale.length > 0) {
            scale = scale.items[0];
            this.zoomSelector.setValue("1 : " + parseInt(scale.data.scale, 10));
        } else {
            if (!this.zoomSelector.rendered) {
                return;
            }
            this.zoomSelector.clearValue();
        }
    },

    /** private: method[addScaleCombo]
     *  
     *  Create the scale combo and add it to the panel.
     */
    addScaleCombo: function() {
        this.zoomStore = new GeoExt.data.ScaleStore({
            map: this.map
        });       
        this.zoomSelector = new Ext.form.ComboBox({
            emptyText: this.zoomLevelText,
            tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            store: this.zoomStore,
            width: 110
        });
        this.zoomSelector.on({
            click: this.stopMouseEvents,
            mousedown: this.stopMouseEvents,
            select: function(combo, record, index) {
                this.map.zoomTo(record.data.level);
            },
            scope: this
        });
        this.map.events.register('zoomend', this, this.handleZoomEnd);
        var zoomSelectorWrapper = new Ext.Panel({
            id: "zoom_selector",
            items: [this.zoomSelector],
            cls: 'overlay-element overlay-scalechooser',
            border: false
        });
        this.add(zoomSelectorWrapper);
    },
    /** private: method[addComboUnits]
     *  
     *  Create the scale combo units and add it to the panel.
     *  deve comparire solo se lo definisco in configurazione
     */
    addComboUnits: function() {
        var comboUnits = this;
        this.unitsSelector = new Ext.form.ComboBox({
            editable: false,
            typeAhead: true,
            forceSelection: true,
            selectOnFocus:false,                
            triggerAction: 'all',
            mode: 'local',
            emptyText:this.topOutUnits,
            displayField: 'unitsName',
            valueField: 'unitsValue',           
            store: new Ext.data.SimpleStore({
                fields: ['unitsValue', 'unitsName'],
                data: [['km;m;ft;mi','Km'],['nmi;nmi;m;km','Nmi'],['hide;hide;hide;hide','Hide']]
            }),
            width: 90
        });
        this.unitsSelector.on({
            click: this.stopMouseEvents,
            mousedown: this.stopMouseEvents,
            select: function(combo, record, index) {
                    var valueUnits = this.unitsSelector.getValue().split(";");                 
                    comboUnits.updateScaleUnits(valueUnits[0],valueUnits[1],valueUnits[2],valueUnits[3]);
            },            
            scope: this
        });
        var unitsSelectorWrapper = new Ext.Panel({
            id: "id_units",            
            items: [this.unitsSelector],
            cls: 'overlay-element overlay-unitschooser',
            border: false
        });
        this.add(unitsSelectorWrapper);
    },    
    /** private: method[updateScaleUnits]
     *  :params topOutUnits,topInUnits,bottomInUnits,bottomOutUnits
     */
    updateScaleUnits: function(topOutUnits,topInUnits,bottomInUnits,bottomOutUnits,divisions,subdivisions,showMinorMeasures,singleLine,abbreviateLabel) {
        this.addScaleLine(topOutUnits,topInUnits,bottomInUnits,bottomOutUnits,divisions,subdivisions,showMinorMeasures,singleLine,abbreviateLabel);
        this.doLayout();
    },
    /** private: method[bind]
     *  :param map: ``OpenLayers.Map``
     */
    bind: function(map) {
        this.map = map;
        this.addScaleLine();
        this.addScaleCombo();
        if(this.enableSetScaleUnits){
            this.addComboUnits();
        }
        this.doLayout();
    },
    
    /** private: method[unbind]
     */
    unbind: function() {
        if(this.map && this.map.events) {
            this.map.events.unregister('zoomend', this, this.handleZoomEnd);
        }
        this.zoomStore = null;
        this.zoomSelector = null;
        this.unitsSelector = null;
    }

});

/** api: xtype = gxp_scaleoverlay */
Ext.reg('gxp_scaleoverlay', gxp.ScaleOverlay);
