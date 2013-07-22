// XMLHttpRequestExt.js Copyright (C) 2010 Sergey Ilinsky (http://www.ilinsky.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.




/**
 * requires OpenLayers/RequestExt.js
 *
 *
 *
 * ---------------------------------------------------------
 *  MapStore Integration information:
 *      Development version after thwe version 2.12 stable
 * --------------------------------------------------------- 
 *
 */

(function () {

    // Save reference to earlier defined object implementation (if any)
    var oXMLHttpRequestExt    = window.XMLHttpRequest;

    // Define on browser type
    var bGecko    = !!window.controllers,
        bIE        = window.document.all && !window.opera,
        bIE7    = bIE && window.navigator.userAgent.match(/MSIE 7.0/);

    // Enables "XMLHttpRequest()" call next to "new XMLHttpReques()"
    function fXMLHttpRequestExt() {
        this._object    = oXMLHttpRequestExt && !bIE7 ? new oXMLHttpRequestExt : new window.ActiveXObject("Microsoft.XMLHTTP");
        this._listeners    = [];
    };

    // Constructor
    function cXMLHttpRequestExt() {
        return new fXMLHttpRequestExt;
    };
    cXMLHttpRequestExt.prototype    = fXMLHttpRequestExt.prototype;

    // BUGFIX: Firefox with Firebug installed would break pages if not executed
    if (bGecko && oXMLHttpRequestExt.wrapped)
        cXMLHttpRequestExt.wrapped    = oXMLHttpRequestExt.wrapped;

    // Constants
    cXMLHttpRequestExt.UNSENT                = 0;
    cXMLHttpRequestExt.OPENED                = 1;
    cXMLHttpRequestExt.HEADERS_RECEIVED    = 2;
    cXMLHttpRequestExt.LOADING                = 3;
    cXMLHttpRequestExt.DONE                = 4;

    // Public Properties
    cXMLHttpRequestExt.prototype.readyState    = cXMLHttpRequestExt.UNSENT;
    cXMLHttpRequestExt.prototype.responseText    = '';
    cXMLHttpRequestExt.prototype.responseXML    = null;
    cXMLHttpRequestExt.prototype.status        = 0;
    cXMLHttpRequestExt.prototype.statusText    = '';

    // Priority proposal
    cXMLHttpRequestExt.prototype.priority        = "NORMAL";

    // Instance-level Events Handlers
    cXMLHttpRequestExt.prototype.onreadystatechange    = null;

    // Class-level Events Handlers
    cXMLHttpRequestExt.onreadystatechange    = null;
    cXMLHttpRequestExt.onopen                = null;
    cXMLHttpRequestExt.onsend                = null;
    cXMLHttpRequestExt.onabort                = null;

    // Public Methods
    cXMLHttpRequestExt.prototype.open    = function(sMethod, sUrl, bAsync, sUser, sPassword) {
        // Delete headers, required when object is reused
        delete this._headers;

        // When bAsync parameter value is omitted, use true as default
        if (arguments.length < 3)
            bAsync    = true;

        // Save async parameter for fixing Gecko bug with missing readystatechange in synchronous requests
        this._async        = bAsync;

        // Set the onreadystatechange handler
        var oRequest    = this,
            nState        = this.readyState,
            fOnUnload;

        // BUGFIX: IE - memory leak on page unload (inter-page leak)
        if (bIE && bAsync) {
            fOnUnload = function() {
                if (nState != cXMLHttpRequestExt.DONE) {
                    fCleanTransport(oRequest);
                    // Safe to abort here since onreadystatechange handler removed
                    oRequest.abort();
                }
            };
            window.attachEvent("onunload", fOnUnload);
        }

        // Add method sniffer
        if (cXMLHttpRequestExt.onopen)
            cXMLHttpRequestExt.onopen.apply(this, arguments);

        if (arguments.length > 4)
            this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
        else
        if (arguments.length > 3)
            this._object.open(sMethod, sUrl, bAsync, sUser);
        else
            this._object.open(sMethod, sUrl, bAsync);

        this.readyState    = cXMLHttpRequestExt.OPENED;
        fReadyStateChange(this);

        this._object.onreadystatechange    = function() {
            if (bGecko && !bAsync)
                return;

            // Synchronize state
            oRequest.readyState        = oRequest._object.readyState;

            //
            fSynchronizeValues(oRequest);

            // BUGFIX: Firefox fires unnecessary DONE when aborting
            if (oRequest._aborted) {
                // Reset readyState to UNSENT
                oRequest.readyState    = cXMLHttpRequestExt.UNSENT;

                // Return now
                return;
            }

            if (oRequest.readyState == cXMLHttpRequestExt.DONE) {
                // Free up queue
                delete oRequest._data;
/*                if (bAsync)
                    fQueue_remove(oRequest);*/
                //
                fCleanTransport(oRequest);
// Uncomment this block if you need a fix for IE cache
/*
                // BUGFIX: IE - cache issue
                if (!oRequest._object.getResponseHeader("Date")) {
                    // Save object to cache
                    oRequest._cached    = oRequest._object;

                    // Instantiate a new transport object
                    cXMLHttpRequestExt.call(oRequest);

                    // Re-send request
                    if (sUser) {
                         if (sPassword)
                            oRequest._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
                        else
                            oRequest._object.open(sMethod, sUrl, bAsync, sUser);
                    }
                    else
                        oRequest._object.open(sMethod, sUrl, bAsync);
                    oRequest._object.setRequestHeader("If-Modified-Since", oRequest._cached.getResponseHeader("Last-Modified") || new window.Date(0));
                    // Copy headers set
                    if (oRequest._headers)
                        for (var sHeader in oRequest._headers)
                            if (typeof oRequest._headers[sHeader] == "string")    // Some frameworks prototype objects with functions
                                oRequest._object.setRequestHeader(sHeader, oRequest._headers[sHeader]);

                    oRequest._object.onreadystatechange    = function() {
                        // Synchronize state
                        oRequest.readyState        = oRequest._object.readyState;

                        if (oRequest._aborted) {
                            //
                            oRequest.readyState    = cXMLHttpRequestExt.UNSENT;

                            // Return
                            return;
                        }

                        if (oRequest.readyState == cXMLHttpRequestExt.DONE) {
                            // Clean Object
                            fCleanTransport(oRequest);

                            // get cached request
                            if (oRequest.status == 304)
                                oRequest._object    = oRequest._cached;

                            //
                            delete oRequest._cached;

                            //
                            fSynchronizeValues(oRequest);

                            //
                            fReadyStateChange(oRequest);

                            // BUGFIX: IE - memory leak in interrupted
                            if (bIE && bAsync)
                                window.detachEvent("onunload", fOnUnload);
                        }
                    };
                    oRequest._object.send(null);

                    // Return now - wait until re-sent request is finished
                    return;
                };
*/
                // BUGFIX: IE - memory leak in interrupted
                if (bIE && bAsync)
                    window.detachEvent("onunload", fOnUnload);
            }

            // BUGFIX: Some browsers (Internet Explorer, Gecko) fire OPEN readystate twice
            if (nState != oRequest.readyState)
                fReadyStateChange(oRequest);

            nState    = oRequest.readyState;
        }
    };
    function fXMLHttpRequestExt_send(oRequest) {
        oRequest._object.send(oRequest._data);

        // BUGFIX: Gecko - missing readystatechange calls in synchronous requests
        if (bGecko && !oRequest._async) {
            oRequest.readyState    = cXMLHttpRequestExt.OPENED;

            // Synchronize state
            fSynchronizeValues(oRequest);

            // Simulate missing states
            while (oRequest.readyState < cXMLHttpRequestExt.DONE) {
                oRequest.readyState++;
                fReadyStateChange(oRequest);
                // Check if we are aborted
                if (oRequest._aborted)
                    return;
            }
        }
    };
    cXMLHttpRequestExt.prototype.send    = function(vData) {
        // Add method sniffer
        if (cXMLHttpRequestExt.onsend)
            cXMLHttpRequestExt.onsend.apply(this, arguments);

        if (!arguments.length)
            vData    = null;

        // BUGFIX: Safari - fails sending documents created/modified dynamically, so an explicit serialization required
        // BUGFIX: IE - rewrites any custom mime-type to "text/xml" in case an XMLNode is sent
        // BUGFIX: Gecko - fails sending Element (this is up to the implementation either to standard)
        if (vData && vData.nodeType) {
            vData    = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
            if (!this._headers["Content-Type"])
                this._object.setRequestHeader("Content-Type", "application/xml");
        }

        this._data    = vData;
/*
        // Add to queue
        if (this._async)
            fQueue_add(this);
        else*/
            fXMLHttpRequestExt_send(this);
    };
    cXMLHttpRequestExt.prototype.abort    = function() {
        // Add method sniffer
        if (cXMLHttpRequestExt.onabort)
            cXMLHttpRequestExt.onabort.apply(this, arguments);

        // BUGFIX: Gecko - unnecessary DONE when aborting
        if (this.readyState > cXMLHttpRequestExt.UNSENT)
            this._aborted    = true;

        this._object.abort();

        // BUGFIX: IE - memory leak
        fCleanTransport(this);

        this.readyState    = cXMLHttpRequestExt.UNSENT;

        delete this._data;
/*        if (this._async)
            fQueue_remove(this);*/
    };
    cXMLHttpRequestExt.prototype.getAllResponseHeaders    = function() {
        return this._object.getAllResponseHeaders();
    };
    cXMLHttpRequestExt.prototype.getResponseHeader    = function(sName) {
        return this._object.getResponseHeader(sName);
    };
    cXMLHttpRequestExt.prototype.setRequestHeader    = function(sName, sValue) {
        // BUGFIX: IE - cache issue
        if (!this._headers)
            this._headers    = {};
        this._headers[sName]    = sValue;

        return this._object.setRequestHeader(sName, sValue);
    };

    // EventTarget interface implementation
    cXMLHttpRequestExt.prototype.addEventListener    = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                return;
        // Add listener
        this._listeners.push([sName, fHandler, bUseCapture]);
    };

    cXMLHttpRequestExt.prototype.removeEventListener    = function(sName, fHandler, bUseCapture) {
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture)
                break;
        // Remove listener
        if (oListener)
            this._listeners.splice(nIndex, 1);
    };

    cXMLHttpRequestExt.prototype.dispatchEvent    = function(oEvent) {
        var oEventPseudo    = {
            'type':            oEvent.type,
            'target':        this,
            'currentTarget':this,
            'eventPhase':    2,
            'bubbles':        oEvent.bubbles,
            'cancelable':    oEvent.cancelable,
            'timeStamp':    oEvent.timeStamp,
            'stopPropagation':    function() {},    // There is no flow
            'preventDefault':    function() {},    // There is no default action
            'initEvent':        function() {}    // Original event object should be initialized
        };

        // Execute onreadystatechange
        if (oEventPseudo.type == "readystatechange" && this.onreadystatechange)
            (this.onreadystatechange.handleEvent || this.onreadystatechange).apply(this, [oEventPseudo]);

        // Execute listeners
        for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++)
            if (oListener[0] == oEventPseudo.type && !oListener[2])
                (oListener[1].handleEvent || oListener[1]).apply(this, [oEventPseudo]);
    };

    //
    cXMLHttpRequestExt.prototype.toString    = function() {
        return '[' + "object" + ' ' + "XMLHttpRequestExt" + ']';
    };

    cXMLHttpRequestExt.toString    = function() {
        return '[' + "XMLHttpRequestExt" + ']';
    };

    // Helper function
    function fReadyStateChange(oRequest) {
        // Sniffing code
        if (cXMLHttpRequestExt.onreadystatechange)
            cXMLHttpRequestExt.onreadystatechange.apply(oRequest);

        // Fake event
        oRequest.dispatchEvent({
            'type':            "readystatechange",
            'bubbles':        false,
            'cancelable':    false,
            'timeStamp':    new Date + 0
        });
    };

    function fGetDocument(oRequest) {
        var oDocument    = oRequest.responseXML,
            sResponse    = oRequest.responseText;
        // Try parsing responseText
        if (bIE && sResponse && oDocument && !oDocument.documentElement && oRequest.getResponseHeader("Content-Type").match(/[^\/]+\/[^\+]+\+xml/)) {
            oDocument    = new window.ActiveXObject("Microsoft.XMLDOM");
            oDocument.async                = false;
            oDocument.validateOnParse    = false;
            oDocument.loadXML(sResponse);
        }
        // Check if there is no error in document
        if (oDocument)
            if ((bIE && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))
                return null;
        return oDocument;
    };

    function fSynchronizeValues(oRequest) {
        try {    oRequest.responseText    = oRequest._object.responseText;    } catch (e) {}
        try {    oRequest.responseXML    = fGetDocument(oRequest._object);    } catch (e) {}
        try {    oRequest.status            = oRequest._object.status;            } catch (e) {}
        try {    oRequest.statusText        = oRequest._object.statusText;        } catch (e) {}
    };

    function fCleanTransport(oRequest) {
        // BUGFIX: IE - memory leak (on-page leak)
        oRequest._object.onreadystatechange    = new window.Function;
    };
/*
    // Queue manager
    var oQueuePending    = {"CRITICAL":[],"HIGH":[],"NORMAL":[],"LOW":[],"LOWEST":[]},
        aQueueRunning    = [];
    function fQueue_add(oRequest) {
        oQueuePending[oRequest.priority in oQueuePending ? oRequest.priority : "NORMAL"].push(oRequest);
        //
        setTimeout(fQueue_process);
    };

    function fQueue_remove(oRequest) {
        for (var nIndex = 0, bFound    = false; nIndex < aQueueRunning.length; nIndex++)
            if (bFound)
                aQueueRunning[nIndex - 1]    = aQueueRunning[nIndex];
            else
            if (aQueueRunning[nIndex] == oRequest)
                bFound    = true;
        if (bFound)
            aQueueRunning.length--;
        //
        setTimeout(fQueue_process);
    };

    function fQueue_process() {
        if (aQueueRunning.length < 6) {
            for (var sPriority in oQueuePending) {
                if (oQueuePending[sPriority].length) {
                    var oRequest    = oQueuePending[sPriority][0];
                    oQueuePending[sPriority]    = oQueuePending[sPriority].slice(1);
                    //
                    aQueueRunning.push(oRequest);
                    // Send request
                    fXMLHttpRequestExt_send(oRequest);
                    break;
                }
            }
        }
    };
*/
    // Internet Explorer 5.0 (missing apply)
    if (!window.Function.prototype.apply) {
        window.Function.prototype.apply    = function(oRequest, oArguments) {
            if (!oArguments)
                oArguments    = [];
            oRequest.__func    = this;
            oRequest.__func(oArguments[0], oArguments[1], oArguments[2], oArguments[3], oArguments[4]);
            delete oRequest.__func;
        };
    };

    // Register new object with window
    /**
     * Class: OpenLayers.Request.XMLHttpRequestExt
     * Standard-compliant (W3C) cross-browser implementation of the
     *     XMLHttpRequestExt object.  From
     *     http://code.google.com/p/xmlhttprequest/.
     */
    if (!OpenLayers.RequestExt) {
        /**
         * This allows for OpenLayers/Request.js to be included
         * before or after this script.
         */
        OpenLayers.RequestExt = {};
    }
    OpenLayers.RequestExt.XMLHttpRequestExt = cXMLHttpRequestExt;
})();
