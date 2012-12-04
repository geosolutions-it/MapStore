/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * requires OpenLayers/Format/XML.js
 */

/**
 * Class: OpenLayers.Format.GeoStore 
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


OpenLayers.Format.GeoStore = OpenLayers.Class(OpenLayers.Format.XML,{
    
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
     * Property: defaultPrefix
     */
                    defaultPrefix: "",

                    /**
     * Constructor: OpenLayers.Format.GeoStore
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */

                    /**
     * Method: write
     *
     * Parameters:
     * options - {Object} Optional object.
     *
     * Returns:
     * {String} An GeoStore Resource XML string that describes an WPS request instance.
     */
                    write: function(options) {
                        var doc;
                        if (window.ActiveXObject) {
                            doc = new ActiveXObject("Microsoft.XMLDOM");
                            this.xmldom = doc;
                        } else {
                            doc = document.implementation.createDocument("", "", null);
                        }
        
                        var node;
                        switch (options.type){
                            case "resource":
                                node = this.writeNode("store:Resource", options, doc);
                                break;
                            case "user":
                                node = this.writeNode("store:User", options, doc);
                                break;
                            case "category":
                                node = this.writeNode("store:Category", options, doc);
                                break;
                        }
    
                        /* this.setAttributeNS(
            node, this.namespaces.xsi,
            "xsi:schemaLocation", this.schemaLocation
        );*/
                        return OpenLayers.Format.XML.prototype.write.apply(this, [node]).replace(/\ xmlns="undefined"/g, '');
                    }, 

                    /**
     * APIMethod: read
     * Parse a WPS request instance and return an object with its information.
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
     * Property: writers
     * As a compliment to the readers property, this structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     */

                    writers: {
                        "store": {
                            "Category":function(options) {
                                var node = this.createElementNSPlus("Category", {
                                    uri:""
                                }); 
                                this.writeNode("store:name", options.name, node);
                                return node; 
                            },
	    
                            "User":function(options) {
                                var node = this.createElementNSPlus("User", {
                                    uri:""
                                }); 
                                this.writeNode("store:name", options.name, node);
                                this.writeNode("store:newPassword", options.newPassword, node);
                                this.writeNode("store:role", options.role, node);
                                return node; 
                            },
	    
                            "Resource": function(options) {
                                var node = this.createElementNSPlus("Resource", {
                                    uri:""
                                }); 
                                this.writeNode("store:Attributes", options.attributes, node);
                                this.writeNode("store:description", options.description, node);
                                this.writeNode("store:metadata", options.metadata, node);
                                this.writeNode("store:name", options.name, node);
                                this.writeNode("res:category", options.category, node);
                                this.writeNode("store:store", options.store, node);
                                return node; 
                            },
                            "Attributes": function(attributes) { 
                                var node = this.createElementNSPlus("Attributes", {});
                                if(attributes){
                                    for (var i=0; i<attributes.length; i++) {
                                        this.writeNode("store:attribute", attributes[i], node);
                                    } 
                                }
                                return node;
                            },
                            "description": function(description) {
                                var node = this.createElementNSPlus("description", {
                                    value: description
                                });
                
                                return node;
                            },
                            "metadata": function(metadata) {
                                var node = this.createElementNSPlus("metadata", {
                                    value: metadata
                                });
                                return node;
                            },
                            "name": function(name) {
                                var node = this.createElementNSPlus("name", {
                                    value: name
                                });
                                return node;
                            }, //var cdata = doc.createCDATASection("<foo></foo>");
                            "role": function(role) {
                                var node = this.createElementNSPlus("role", {
                                    value: role
                                });
                                return node;
                            },
                            "newPassword": function(newPassword) {
                                var node = this.createElementNSPlus("newPassword", {
                                    value: newPassword
                                });
                                return node;
                            },
                            "store": function(responseInfo) {
                                var node = this.createElementNSPlus("store", {});
                
                                this.writeNode("store:data", responseInfo, node);
                                return node;
                            },
                            "data": function(responseInfo) {
                                var node = this.createElementNSPlus("data", {
                                    value: JSON.stringify(responseInfo)
                                });
               
                                return node;
                            }
                        },
                        "res": {
                            "category": function(category) {
                                var node = this.createElementNSPlus("category", {}); 
                
                                this.writeNode("store:name", category, node);
		
                                return node;
                            }
                        }   
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
       
                    },
    
                    CLASS_NAME: "OpenLayers.Format.GeoStore" 

                });
   
   
   
   
   
                

