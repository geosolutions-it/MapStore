/**
 * requires OpenLayers/Control.js
 * requires OpenLayers/Handler/Box.js
 */

/**
 * Class: OpenLayers.Control.SetBox
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.SetBox = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: type
     * {OpenLayers.Control.TYPE}
     */    
    type: OpenLayers.Control.TYPE_TOOL,

    /**
     * Property: out
     * {Boolean} Should the control be used for zooming out?
     */
    out: false,
    
    aoi: null,
    
    boxes: null,
    
    currentAOI:"",
    
    onChangeAOI: null,
    
    layerName: "AOI",
    
    aoiStyle: null,
    
    map: null,
    
    displayInLayerSwitcher: false,

    /**
     * Method: draw
     */    
    draw: function() {
       
        this.handler = new OpenLayers.Handler.Box(this,
        {
            done: this.setAOI
        }, 
        {
            boxDivClassName: this.boxDivClassName   
        },
        {
            keyMask: this.keyMask
        });
    },

    /**
     * Method: zoomBox
     *
     * Parameters:
     * position - {<OpenLayers.Bounds>} or {<OpenLayers.Pixel>}
     */
    setAOI: function (position) {

        var control;
      
        if(this.map.enebaleMapEvent)
            control = this.map.enebaleMapEvent;
        else
            control = false;
           
        if(control){        
            if(this.aoi!=null){       
                this.boxes.removeFeatures(this.aoi);
            }
            
            var bounds;
            
            if (position instanceof OpenLayers.Bounds) {
                if (!this.out) {
                    var minXY = this.map.getLonLatFromPixel(
                        new OpenLayers.Pixel(position.left, position.bottom));
                    var maxXY = this.map.getLonLatFromPixel(
                        new OpenLayers.Pixel(position.right, position.top));
                    bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                        maxXY.lon, maxXY.lat);

                    this.currentAOI= minXY.lon+','+minXY.lat+','+
                    maxXY.lon+','+maxXY.lat;   
                } else {
                    var pixWidth = Math.abs(position.right-position.left);
                    var pixHeight = Math.abs(position.top-position.bottom);
                    var zoomFactor = Math.min((this.map.size.h / pixHeight),
                        (this.map.size.w / pixWidth));
                    var extent = this.map.getExtent();
                    var center = this.map.getLonLatFromPixel(
                        position.getCenterPixel());
                    var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                    var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                    var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                    var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                    bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);

                    this.currentAOI=xmin+','+ymin+','+xmax+','+ymax;
                }

                if(this.layerName){
                    var x=this.map.getLayersByName(this.layerName);
                    var index=null;
                    if(x.length>0){
                        index=this.map.getLayerIndex(x[0]);
                        this.map.removeLayer(x[0]);
                    }
                    var me=this;
                    this.boxes  = new OpenLayers.Layer.Vector( this.layerName,{
                        displayInLayerSwitcher: me.displayInLayerSwitcher,
                        styleMap: me.aoiStyle
                    });
                    this.aoi = new OpenLayers.Feature.Vector(bounds.toGeometry());
                    this.boxes.addFeatures(this.aoi);
                    this.map.addLayer(this.boxes);

                    if(index)
                        this.map.setLayerIndex(this.boxes,index); 
                }

                if(this.onChangeAOI)
                    this.onChangeAOI();
                   
            } else { 
                //
                // it's a pixel
                //
                if (!this.out) {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() + 1);
                } else {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() - 1);
                }
            }
        }      
    },

    CLASS_NAME: "OpenLayers.Control.SetBox"
});
