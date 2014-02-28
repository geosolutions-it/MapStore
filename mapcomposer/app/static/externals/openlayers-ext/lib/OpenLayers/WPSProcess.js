/**
 * Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. 
 *
 * requires OpenLayers/SingleFile.js
 */

/**
 * requires OpenLayers/Geometry.js
 * requires OpenLayers/Feature/Vector.js
 * requires OpenLayers/Format/WKT.js
 * requires OpenLayers/Format/GeoJSON.js
 * requires OpenLayers/Format/WPSExecute.js
 * requires OpenLayers/Request.js
 */

/**
 * Class: OpenLayers.WPSProcess
 * Representation of a WPS process. Usually instances of
 * <OpenLayers.WPSProcess> are created by calling 'getProcess' on an
 * <OpenLayers.WPSClient> instance.
 *
 * Currently <OpenLayers.WPSProcess> supports processes that have geometries
 * or features as output, using WKT or GeoJSON as output format. It also
 * supports chaining of processes by using the <output> method to create a
 * handle that is used as process input instead of a static value.
 *
 *
 *
 * ---------------------------------------------------------
 *  MapStore Integration information:
 *      new Class
 *      MapStore version from Development version after the version 2.12 stable
 * --------------------------------------------------------- 
 *
 *
 */
OpenLayers.WPSProcess = OpenLayers.Class({
    
    /**
     * Property: client
     * {<OpenLayers.WPSClient>} The client that manages this process.
     */
    client: null,
    
    /**
     * Property: server
     * {String} Local client identifier for this process's server.
     */
    server: null,
    
    /**
     * Property: identifier
     * {String} Process identifier known to the server.
     */
    identifier: null,
    
    /**
     * Property: description
     * {Object} DescribeProcess response for this process.
     */
    description: null,
    
    /**
     * APIProperty: localWPS
     * {String} Service endpoint for locally chained WPS processes. Default is
     *     'http://geoserver/wps'.
     */
    localWPS: 'http://geoserver/wps',
    
    /**
     * Property: formats
     * {Object} OpenLayers.Format instances keyed by mimetype.
     */
    formats: null,
    
    /**
     * Property: chained
     * {Integer} Number of chained processes for pending execute requests that
     * don't have a full configuration yet.
     */
    chained: 0,
    
    /**
     * Property: executeCallbacks
     * {Array} Callbacks waiting to be executed until all chained processes
     * are configured;
     */
    executeCallbacks: null,
    
    /**
     * Constructor: OpenLayers.WPSProcess
     *
     * Parameters:
     * options - {Object} Object whose properties will be set on the instance.
     *
     * Avaliable options:
     * client - {<OpenLayers.WPSClient>} Mandatory. Client that manages this
     *     process.
     * server - {String} Mandatory. Local client identifier of this process's
     *     server.
     * identifier - {String} Mandatory. Process identifier known to the server.
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);        
        this.executeCallbacks = [];
        this.formats = {
          //  'application/wkt': new OpenLayers.Format.WKT(),
          //  'application/json': new OpenLayers.Format.GeoJSON()
        };
    },
    
    /**
     * Method: describe
     * Makes the client issue a DescribeProcess request asynchronously.
     *
     * Parameters:
     * options - {Object} Configuration for the method call
     *
     * Available options:
     * callback - {Function} Callback to execute when the description is
     *     available. Will be called with the parsed description as argument.
     *     Optional.
     * scope - {Object} The scope in which the callback will be executed.
     *     Default is the global object.
     */
    describe: function(options) {
        options = options || {};
        if (!this.description) {
            this.client.describeProcess(this.server, this.identifier, function(description) {
                if (!this.description) {
                   
                    this.parseDescription(description);
                }
                if (options.callback) {
                   
                    options.callback.call(options.scope, this.description);
                }
            }, this);
        } else if (options.callback) {
            var description = this.description;
            window.setTimeout(function() {
                options.callback.call(options.scope, description);
            }, 0);
        }
    },
    
    /**
     * APIMethod: configure
     * Configure the process, but do not execute it. Use this for processes
     * that are chained as input of a different process by means of the
     * <output> method.
     *
     * Parameters:
     * options - {Object}
     *
     * Returns:
     * {<OpenLayers.WPSProcess>} this process.
     *
     * Available options:
     * inputs - {Object} The inputs for the process, keyed by input identifier.
     *     For spatial data inputs, the value of an input is usually an
     *     <OpenLayers.Geometry>, an <OpenLayers.Feature.Vector> or an array of
     *     geometries or features.
     * callback - {Function} Callback to call when the configuration is
     *     complete. Optional.
     * scope - {Object} Optional scope for the callback.
     */
    configure: function(options) {
        
        this.describe({
            callback: function() {
                var description = this.description,
                inputs = options.inputs,
                input, i, ii,u, z=0;
                var executeDataInputs=new Array();
                for (i=0, ii=description.dataInputs.length; i<ii; ++i) {
                    input=description.dataInputs[i];
                    
                    if(inputs[input.identifier] instanceof Array){
                        // TODO maxoccurs Control
                        for (u=0; u<inputs[input.identifier].length; u++) {
                          executeDataInputs[z]= new Object();  
                          Ext.apply(executeDataInputs[z],input);
                          this.setInputData(executeDataInputs[z], inputs[input.identifier][u]); 
                          z++;
                        }
                    }else{
                        executeDataInputs[z]= new Object();  
                        Ext.apply(executeDataInputs[z],input);
                        this.setInputData(executeDataInputs[executeDataInputs.length-1], inputs[input.identifier]);
                        z++;
                    }
                        
                }
                this.description.dataInputs=executeDataInputs;
                if (options.callback) {
                    options.callback.call(options.scope);
                }
            },
            scope: this
        });
        return this;
    },
    
    /**
     * APIMethod: execute
     * Configures and executes the process
     *
     * Parameters:
     * options - {Object}
     *
     * Available options:
     * inputs - {Object} The inputs for the process, keyed by input identifier.
     *     For spatial data inputs, the value of an input is usually an
     *     <OpenLayers.Geometry>, an <OpenLayers.Feature.Vector> or an array of
     *     geometries or features.
     * output - {String} The identifier of the output to request and parse.
     *     Optional. If not provided, the first output will be requested.
     * success - {Function} Callback to call when the process is complete.
     *     This function is called with an outputs object as argument, which
     *     will have a property with the identifier of the requested output
     *     (or 'result' if output was not configured). For processes that
     *     generate spatial output, the value will be an array of
     *     <OpenLayers.Feature.Vector> instances.
     * scope - {Object} Optional scope for the success callback.
     */
    execute: function(options) {
        
        this.configure({
            inputs: options.inputs,
            callback: function() {
                var me = this;

                for(var i=0; i<options.outputs.length; i++){
                    options.outputs[i].outputIndex=this.getOutputIndex(
                        me.description.processOutputs, 
                        options.outputs[i].identifier);
                }
                    
                
                me.setResponseForm(options.outputs, options);
		
                (function callback() {
                    OpenLayers.Util.removeItem(me.executeCallbacks, callback);
                    if (me.chained !== 0) {
                        // need to wait until chained processes have a
                        // description and configuration - see chainProcess
                        me.executeCallbacks.push(callback);
                        return;
                    }
                    // all chained processes are added as references now, so
                    // let's proceed.
                    
                    OpenLayers.Request.POST({
                        url: me.client.servers[me.server].url,
                        headers: options.headers || undefined,
                        data: new OpenLayers.Format.WPSExecute().write(me.description),
                        success: function(response) {
                            
                            
                            if(options.type== "raw"){
                                /*  alert(outputIndex);
                                var output = me.description.processOutputs[outputIndex];
                                 ONLY SINGLE OUTPUT*/
                                /*var mimeType = me.findMimeType(
                                    output.complexOutput.supported.formats
                                    );*/
			      
                                //TODO For now we assume a spatial output
                                /* var features = me.formats[mimeType].read(response.responseText);
                                if (features instanceof OpenLayers.Feature.Vector) {
                                    features = [features];
                                }*/
                                if (options.success) {
                                    /*var outputs = {};
                                    outputs[options.output || 'result'] = features;
                                    options.success.call(options.scope, outputs);*/
                                    options.success.call(options.scope, 
                                        response.responseText,
                                        options.processInstance);
                                }
                            }else {
                                
                                if (options.success) {
                                    options.success.call(options.scope, 
                                        new OpenLayers.Format.WPSExecute().read(response.responseText),
                                        options.processInstance);
                                }	
                            }
                        },
                        scope: me
                    });
                })();
            },
            scope: this
        });
    },
    
    /**
     * APIMethod: output
     * Chain an output of a configured process (see <configure>) as input to
     * another process.
     *
     * (code)
     * intersect = client.getProcess('opengeo', 'JTS:intersection');    
     * intersect.configure({
     *     // ...
     * });
     * buffer = client.getProcess('opengeo', 'JTS:buffer');
     * buffer.execute({
     *     inputs: {
     *         geom: intersect.output('result'), // <-- here we're chaining
     *         distance: 1
     *     },
     *     // ...
     * });
     * (end)
     *
     * Parameters:
     * identifier - {String} Identifier of the output that we're chaining. If
     *     not provided, the first output will be used.
     */
    output: function(identifier) {
        return new OpenLayers.WPSProcess.ChainLink({
            process: this,
            output: identifier
        });
    },
    
    /**
     * Method: parseDescription
     * Parses the DescribeProcess response
     *
     * Parameters:
     * description - {Object}
     */
    parseDescription: function(description) {
        var server = this.client.servers[this.server];
        // Hide log: console.log(server);
        this.description = new OpenLayers.Format.WPSDescribeProcess().read(server.processDescription[this.identifier]).processDescriptions[this.identifier];
    },
    
    /**
     * Method: setInputData
     * Sets the data for a single input
     *
     * Parameters:
     * input - {Object}  An entry from the dataInputs array of the process
     *     description.
     * data - {Mixed} For spatial data inputs, this is usually an
     *     <OpenLayers.Geometry>, an <OpenLayers.Feature.Vector> or an array of
     *     geometries or features.
     */
    setInputData: function(input, data) {
        // clear any previous data
        delete input.data;
        delete input.reference;
        if(data){
            if (data instanceof OpenLayers.WPSProcess.ChainLink) {
                ++this.chained;
                input.reference = {
                    method: 'POST',
                    href: data.process.server === this.server ?
                    this.localWPS : this.client.servers[data.process.server].url
                };
                data.process.describe({
                    callback: function() {
                        --this.chained;
                        this.chainProcess(input, data);
                    },
                    scope: this
                });
            } else {
            
                input.data = {};
                var complexData = input.complexData;
                if (complexData) {
                    if (data instanceof OpenLayers.WPSProcess.ReferenceData) {
                        input.reference = data;
                    }else{
                        if (data instanceof OpenLayers.WPSProcess.ComplexData) {
                            input.data.complexData = data; 
                        }
                            
                    /*  var format = this.findMimeType(complexData.supported.formats);
                    try{
                        input.data.complexData = {
                            mimeType: format,
                            value: this.formats[format].write(this.toFeatures(data))
                        };   
                    } catch(e){
                        input.data.complexData = {
                            mimeType: format,
                            value: data
                        };  
                    }*/
                    
               
                    }
                } else {
                    if (data instanceof OpenLayers.WPSProcess.LiteralData){
                        input.data.literalData = data;    
                    } 
                    else
                    if (data instanceof OpenLayers.WPSProcess.BoundingBoxData) 
                        input.data.boundingBoxData = data;
                    else
                        throw "Input type not Supported";
               
                } 
            }
        }
    },
    
    /**
     * Method: setResponseForm
     * Sets the responseForm property of the <execute> payload.
     *
     * Parameters:
     * outputsOptions - {Object} See below.
     * outputs - {Array} See below
     * 
     *
     * Available outputs generic options for outputsOptions:
     * type - {String} output type ("raw" or "document"). Default "document".
     * storeExecuteResponse - {Boolean} . Required for "document" type, true in order to send a 
     * 		asynchronous request. Default false.
     * lineage - {Boolean} . Required for "document" type, true in order to require to 
     * 		copy the request in the response. Default false.
     * status - {Boolean} - Required for "document" type, true in order to require the processing status. Default false.
     * 
     * Available output options:
     * outputIndex - {Integer} The index of the output to use. Optional.
     * supportedFormats - {Object} Object with supported mime types as key,
     *     and true as value for supported types. Optional.
     * asReference - {Boolean} true in order to require the output by reference. Used for "document" type.
     */
    setResponseForm: function(outputs, outputsOptions) {
        var output;
        this.description.responseForm = {};
        var opt;
        if(outputsOptions.type== "raw"){
            opt = outputs[0] || {};
            output = this.description.processOutputs[opt.outputIndex || 0];
            this.description.responseForm.rawDataOutput= {
                identifier: output.identifier,
                mimeType: opt.mimeType/*this.findMimeType(output.complexOutput.supported.formats, opt.supportedFormats)*/
            }  
        }else{
            this.description.responseForm.responseDocument= {
                storeExecuteResponse: outputsOptions.storeExecuteResponse || false,
                lineage: outputsOptions.lineage || false,
                status: outputsOptions.status || false
            };
            this.description.responseForm.responseDocument.outputs= new Array();
            for (var i=0; i<outputs.length; i++){
                opt = outputs[i] || {};
                output = this.description.processOutputs[opt.outputIndex || 0];
                this.description.responseForm.responseDocument.outputs.push({
                    identifier: output.identifier,
                    asReference: opt.asReference
                });
	      
            }
	  
        }
       
    },
    
    /**
     * Method: getOutputIndex
     * Gets the index of a processOutput by its identifier
     *
     * Parameters:
     * outputs - {Array} The processOutputs array to look at
     * identifier - {String} The identifier of the output
     *
     * Returns
     * {Integer} The index of the processOutput with the provided identifier
     *     in the outputs array.
     */
    getOutputIndex: function(outputs, identifier) {
        var output;
        if (identifier) {
            for (var i=outputs.length-1; i>=0; --i) {
                if (outputs[i].identifier === identifier) {
                    output = i;
                    break;
                }
            }
        } else {
            output = 0;
        }
        return output;
    },
    
    /**
     * Method: chainProcess
     * Sets a fully configured chained process as input for this process.
     *
     * Parameters:
     * input - {Object} The dataInput that the chained process provides.
     * chainLink - {<OpenLayers.WPSProcess.ChainLink>} The process to chain.
     */
    chainProcess: function(input, chainLink) {
        var output = this.getOutputIndex(
            chainLink.process.description.processOutputs, chainLink.output
            );
        input.reference.mimeType = this.findMimeType(
            input.complexData.supported.formats,
            chainLink.process.description.processOutputs[output].complexOutput.supported.formats
            );
        var formats = {};
        formats[input.reference.mimeType] = true;
        chainLink.process.setResponseForm({
            outputIndex: output,
            supportedFormats: formats
        });
        input.reference.body = chainLink.process.description;
        while (this.executeCallbacks.length > 0) {
            this.executeCallbacks[0]();
        }
    },
    
    /**
     * Method: toFeatures
     * Converts spatial input into features so it can be processed by
     * <OpenLayers.Format> instances.
     *
     * Parameters:
     * source - {Mixed} An <OpenLayers.Geometry>, an
     *     <OpenLayers.Feature.Vector>, or an array of geometries or features
     *
     * Returns:
     * {Array(<OpenLayers.Feature.Vector>)}
     */
    toFeatures: function(source) {
        var isArray = OpenLayers.Util.isArray(source);
        if (!isArray) {
            source = [source];
        }
        var target = new Array(source.length),
        current;
        for (var i=0, ii=source.length; i<ii; ++i) {
            current = source[i];
            target[i] = current instanceof OpenLayers.Feature.Vector ?
            current : new OpenLayers.Feature.Vector(current);
        }
        return isArray ? target : target[0];
    },
    
    /**
     * Method: findMimeType
     * Finds a supported mime type.
     *
     * Parameters:
     * sourceFormats - {Object} An object literal with mime types as key and
     *     true as value for supported formats.
     * targetFormats - {Object} Like <sourceFormats>, but optional to check for
     *     supported mime types on a different target than this process.
     *     Default is to check against this process's supported formats.
     *
     * Returns:
     * {String} A supported mime type.
     */
    findMimeType: function(sourceFormats, targetFormats) {
        targetFormats = targetFormats || this.formats;
        for (var f in sourceFormats) {
            if (f in targetFormats) {
                return f;
            }
        }
    },
    CLASS_NAME: "OpenLayers.WPSProcess"
    
});

/**
 * Class: OpenLayers.WPSProcess.ChainLink
 * Type for chaining processes.
 */
OpenLayers.WPSProcess.ChainLink = OpenLayers.Class({
    
    /**
     * Property: dataType
     * {String} WPSProcess data type
     */
    dataType: "chainlink",
    
    /**
     * Property: process
     * {<OpenLayers.WPSProcess>} The process to chain
     */
    process: null,
    
    /**
     * Property: output
     * {String} The output identifier of the output we are going to use as
     *     input for another process.
     */
    output: null,
    
    /**
     * Constructor: OpenLayers.WPSProcess.ChainLink
     *
     * Parameters:
     * options - {Object} Properties to set on the instance.
     */
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.ChainLink"
    
});




/**
 * Class: OpenLayers.WPSProcess.ReferenceData
 * Type for WPS input Process.
 */
OpenLayers.WPSProcess.ReferenceData = OpenLayers.Class({
    
    /**
     * Property: dataType
     * {String} WPSProcess data type
     */
    dataType: "referencedata",
    
    /**
     * Property: method
     * {String} Reference HTTP Method
     */
    method: null,
    
    /**
     * Property: mimeType
     * {String} Referenced Complex Data mime Type
     */
    mimeType: null,
    
    
    /**
     * Property: href
     * {String} Complex Data Reference
     */
    href: null,
    
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.ReferenceData"
    
});



/**
 * Class: OpenLayers.WPSProcess.LiteralData
 * Type for WPS input Process.
 */
OpenLayers.WPSProcess.LiteralData = OpenLayers.Class({
    
    /**
     * Property: dataType
     * {String} WPSProcess data type
     */
    dataType: "literaldata",
    
    /**
     * Property: uom
     * {String} Unit Of Measure of the Literal Data
     */
    uom: null,
    
    /**
     * Property: value
     * {String} Literal Data value
     */
    value: null,
    

    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.LiteralData"
    
});


/**
 * Class: OpenLayers.WPSProcess.ComplexData
 * Type for WPS input Process.
 */
OpenLayers.WPSProcess.ComplexData = OpenLayers.Class({ 

    /**
     * Property: dataType
     * {String} WPSProcess data type
     */
    dataType: "complexdata",
    
    /**
     * Property: mimeType
     * {String} Complex Data mimeType
     */
    mimeType: null,
    
    /**
     * Property: value
     * {String} Complex Data mimeType
     */
    encoding: null,
    
    
    /**
     * Property: schema
     * {String} Complex Data mimeType
     */
    schema: null,
    
    /**
     * Property: value
     * {String} ComplexData
     */
    value: null,
    

    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.ComplexData"
    
});




/**
 * Class: OpenLayers.WPSProcess.BoundingBoxData
 * Type for WPS input Process.
 */
OpenLayers.WPSProcess.BoundingBoxData = OpenLayers.Class({ 
    
    
    /**
     * Property: dataType
     * {String} WPSProcess data type
     */
    dataType: "boundingboxdata",
    
    /**
     * Property: crs
     * {String} Bounding Box Data crs
     */
    crs: null,
    
    /**
     * Property: lowerCorner
     * {String} Bounding Box Data lowerCorner
     */
    lowerCorner: null,
    
    
    /**
     * Property: upperCorner
     * {String} Bounding Box Data upperCorner
     */
    upperCorner: null,
    
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.BoundingBoxData"
    
});





/**
 * Class: OpenLayers.WPSProcess.Output
 * Type for WPS output Process.
 */
OpenLayers.WPSProcess.Output = OpenLayers.Class({ 
    
    
    /**
     * Property: identifier
     * {String} Mandatory. Output identifier
     */
    identifier: null,
    
    /**
     * Property: mimeType
     * {String} Optional. Output mime type
     */
    mimeType: null,
    
    /**
     * Property: asReference
     * {Boolean}  Specifies if this output should be stored by the process as a web-accessible resource.
     */
    asReference: null,
    
    
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.Output"
    
});




