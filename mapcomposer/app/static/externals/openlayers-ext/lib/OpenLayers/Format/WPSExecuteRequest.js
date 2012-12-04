/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * requires OpenLayers/Format/XML.js
 */

/**
 * Class: OpenLayers.Format.WPSExecuteRequest 
 *
 * Read WPS Execute Request.  Create a new instance with the OpenLayers.Format.WPSExecuteRequest constructor. 
 *
 * Inherits from:
 *  - <OpenLayers.Format.XML>
 *  
 *  
 * ---------------------------------------------------------
 *  MapStore Integration information:
 *      New Class (not Openlayers lib class)
 * --------------------------------------------------------- 
 */
OpenLayers.Format.WPSExecuteRequest = OpenLayers.Class(OpenLayers.Format.XML, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        ows: "http://www.opengis.net/ows/1.1",
        gml: "http://www.opengis.net/gml",
        wps: "http://www.opengis.net/wps/1.0.0",
        wfs: "http://www.opengis.net/wfs",
        ogc: "http://www.opengis.net/ogc",
        wcs: "http://www.opengis.net/wcs",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },

    /**
     * Property: regExes
     * Compiled regular expressions for manipulating strings.
     */
    regExes: {
        trimSpace: (/^\s*|\s*$/g),
            removeSpace: (/\s*/g),
                splitSpace: (/\s+/),
                    trimComma: (/\s*,\s*/g)
                    },

                    /**
     * Constant: VERSION
     * {String} 1.0.0
     */
                    VERSION: "1.0.0",

                    /**
     * Property: schemaLocation
     * {String} Schema location
     */
                    schemaLocation: "http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd",

                    schemaLocationAttr: function(options) {
                        return undefined;
                    },

                    /**
     * Constructor: OpenLayers.Format.WPSExecute
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    
    
                    /**
     * APIMethod: read
     * Parse a WPS DescribeProcess and return an object with its information.
     * 
     * Parameters: 
     * data - {String} or {DOMElement} data to read/parse.
     *
     * Returns:
     * {Object}
     */
                    read: function(data) {
                        if(typeof data == "string") {
                            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
                        }
                        if(data && data.nodeType == 9) {
                            data = data.documentElement;
                        }
                        var info = {};
                        this.readNode(data, info);
                        return info;
                    },
    
    
    
                    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
                    readers: {
                        "wps": {
                            "Execute": function(node, obj) {
                                obj.processInput = {
                                    version: node.getAttribute("version")
                                };
                                this.readChildNodes(node, obj.processInput);
                            },
                            "ResponseForm": function(node, processInput) {
                                this.readChildNodes(node, processInput); 
                            },
                            "ResponseDocument": function(node, processInput) {
                                processInput.storeExecuteResponse=node.getAttribute("storeExecuteResponse");
                                processInput.lineage=node.getAttribute("lineage");
                                processInput.status=node.getAttribute("status");

                                processInput.outputs= new Array();
                                this.readChildNodes(node,  processInput.outputs);  
                            },
                            "Output": function(node, outputs) {  
                                var output={
                                    asReference: node.getAttribute("asReference")
                                };
                                this.readChildNodes(node,  output); 
                                outputs.push(output);
                            },
                            "RawDataOutput": function(node, processInput) {
                                processInput.outputs= new Array();
                                processInput.type= "raw";
                                var output={
                                    mimeType: node.getAttribute("mimeType")
                                };
                                this.readChildNodes(node,  output);  
                                processInput.outputs.push(output);
                            },
                            "DataInputs": function(node, processInput) {
                                processInput.inputs = new Object();
                                this.readChildNodes(node, processInput.inputs);
                            },
                            "Input": function(node, dataInputs) {
                                var input={};
                                input.data={};
                                this.readChildNodes(node, input);
                                dataInputs[input.identifier]=input.data;
                            },
                            "Data": function(node, input) {
                                this.readChildNodes(node, input);
                            },
                            "LiteralData": function(node, input) {
                                input.data= new OpenLayers.WPSProcess.LiteralData({
                                    uom: node.getAttribute("uom"),
                                    value: this.getChildValue(node)
                                });
                               
                            },
                            "ComplexData": function(node, input) {
                                input.data= new OpenLayers.WPSProcess.ComplexData({
                                    mimeType: node.getAttribute("mimeType"),
                                    encoding: node.getAttribute("encoding"),
                                    schema: node.getAttribute("schema"),
                                    data: this.getChildEl(node)
                                });
                            },
                            "Reference": function(node, input) {
                                input.data= new OpenLayers.WPSProcess.ReferenceData({
                                    mimeType: node.getAttribute("mimeType"),
                                    href: this.getAttributeNS(node, this.namespaces.xlink, "href"),
                                    method: node.getAttribute("method"),	
                                    encoding: node.getAttribute("encoding"),	
                                    schema: node.getAttribute("schema")	
                                });

                                this.readChildNodes(node, input);
                            },
                            "Body": function(node, reference) {
                                reference.body=this.getChildValue(node);
                                  
                            }
                        },
                        "ows": {
                            "Identifier": function(node, input) {
                                
                                input.identifier= this.getChildValue(node);
                               
                            }
                        }
                       
                    },

                    CLASS_NAME: "OpenLayers.Format.WPSExecuteRequest" 

                });
