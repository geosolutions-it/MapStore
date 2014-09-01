// this scripts is a container for fixes to OpenLayers
// remove it when fixed in openlayers 

/**
 * Patch for this issue: http://osgeo-org.1560.x6.nabble.com/WFS-and-IE-11-td5090636.html
 */
var originalWriteFunction = OpenLayers.Format.XML.prototype.write;

var patchedWriteFunction = function()
{
	var child = originalWriteFunction.apply( this, arguments );
	
	// NOTE: Remove the rogue namespaces as one block of text.
	//       The second fragment "NS1:" is too small on its own and could cause valid text (in, say, ogc:Literal elements) to be erroneously removed.
	child = child.replace(new RegExp('xmlns:NS\\d+="" NS\\d+:', 'g'), '');
	
	return child;
};

OpenLayers.Format.XML.prototype.write = patchedWriteFunction;


/**
 * Patch for this issue: https://github.com/geosolutions-it/MapStore/issues/467
 */
var originalServerResolutionFunction = OpenLayers.Layer.Grid.prototype.getServerResolution; 

var patchedServerResolutionFunction = function(resolution) {
	var originalResolution = resolution || this.map.getResolution();
	resolution = originalServerResolutionFunction.apply(this, arguments);

	if(Math.abs(1- originalResolution/resolution) < 0.01) {
		resolution = originalResolution;
	}
	return resolution;
};
 
OpenLayers.Layer.Grid.prototype.getServerResolution = patchedServerResolutionFunction;