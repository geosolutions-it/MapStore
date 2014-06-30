//this script is a patch for this issue: http://osgeo-org.1560.x6.nabble.com/WFS-and-IE-11-td5090636.html
//remove it when fixed in openlayers 

var _class = OpenLayers.Format.XML;

var originalWriteFunction = _class.prototype.write;

var patchedWriteFunction = function()
{
	var child = originalWriteFunction.apply( this, arguments );
	
	// NOTE: Remove the rogue namespaces as one block of text.
	//       The second fragment "NS1:" is too small on its own and could cause valid text (in, say, ogc:Literal elements) to be erroneously removed.
	child = child.replace(new RegExp('xmlns:NS\\d+="" NS\\d+:', 'g'), '');
	
	return child;
}

_class.prototype.write = patchedWriteFunction;