/**
* Highcharts ExtJS adapter
* @author Daniel Kloosterman
* @email buz.i286@gmail.com
* @version 0.4
* @examples {@link http://www.senchasugar.com/examples/}
* 
* @requires HighChart 2.0.5 {@link http://www.highcharts.com}
*
* HighchartsAdapter
* Updated for Highcharts release 2.0.5
*/

HighchartsAdapter = {

    each: Ext.each,

    map: function(arr, fn) {
        var results = [];
        if (arr)
            for (var i = 0, len = arr.length; i < len; i++)
            results[i] = fn.call(arr[i], arr[i], i, arr);
        return results;
    },

    grep: function(elems, callback, inv) {
        var ret = [];

        // Go through the array, only saving the items
        // that pass the validator function
        for (var i = 0, length = elems.length; i < length; i++)
            if (!inv != !callback(elems[i], i))
            ret.push(elems[i]);

        return ret;
    },

    merge: function() {
        var args = arguments;
        /**
        * jQuery extend function
        */
        var jqextend = function() {
            // copy reference to target object
            var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !Ext.isFunction(target))
                target = {};

            // extend jQuery itself if only one argument is passed
            if (length == i) {
                target = this;
                --i;
            }

            for (; i < length; i++)
            // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null)
            // Extend the base object
                for (var name in options) {
                var src = target[name], copy = options[name];

                // Prevent never-ending loop
                if (target === copy)
                    continue;

                // Recurse if we're merging object values
                if (deep && copy && typeof copy === "object" && !copy.nodeType)
                    target[name] = jqextend(deep,
                // Never move original objects, clone them
                                src || (copy.length != null ? [] : {})
                                , copy);

                // Don't bring in undefined values
                else if (copy !== undefined)
                    target[name] = copy;

            }

            // Return the modified object
            return target;
        };
        return jqextend(true, null, args[0], args[1], args[2], args[3]);
    },

    hyphenate: function(str) {
        return str.replace(/([A-Z])/g, function(a, b) {
            return '-' + b.toLowerCase()
        });
    },

    addEvent: function(el, event, fn) {
        var xel = Ext.get(el);
        if (xel) {
            xel.addListener(event, fn)
        } else {
            if (!el.addListener) {
                Ext.apply(el, new Ext.util.Observable());
            }
            el.addListener(event, fn)
        }

    },

    fireEvent: function(el, event, eventArguments, defaultFunction) {
        var o = {
            type: event,
            target: el
        }
        Ext.apply(o, eventArguments)

        // if fireEvent is not available on the object, there hasn't been added
        // any events to it above
        if (el.fireEvent) {
            el.fireEvent(event, o);
        }

        // fire the default if it is passed and it is not prevented above
        if (defaultFunction) defaultFunction(o);
    },

    removeEvent: function(el, event, fn) {
        if (el.removeListener && el.purgeListeners) {
            if (event && fn) {
                el.removeListener(event, fn)
            }
            else {
                el.purgeListeners();
            }
        }
        else {
            var xel = Ext.get(el);
            if (xel) {
                if (event && fn) {
                    xel.removeListener(event, fn)
                }
                else {
                    xel.purgeAllListeners();
                }
            }
        }
    },

    stop: function(el) {
        // no animation exists in the animate Ext adapter method, so we don't need to stop anything
    },

    animate: function(eli, params, options) {

        var el = eli;
        var isSVGElement = eli.attr;

        if (isSVGElement) {
            el = Ext.get(eli.element);
            //el.element = el.dom;
            //el.setStyle = el.getStyle = eli.attr;
        }
        if (options) {
            if (options.duration == undefined || options.duration == 0) {
                options.duration = 1;
            }
            else {
                options.duration = options.duration / 1000;
            }
        } else {
            options = {};
        }

        // Width
        if (params.width !== undefined) {
            if (isSVGElement) {
                if (Ext.isIE) {
                    eli.attr('width', params.width);
                } else {
                    eli.element.setAttributeNS(null, 'width', params.width)
                }
            } else {
                el.setWidth(params.width);
            }
        }

        // Height
        else if (params.height !== undefined) {
            if (isSVGElement) {
                if (Ext.isIE) {
                    eli.attr('height', params.height);
                    if (params.y) {
                        eli.attr('y', params.y);
                    }
                } else {
                    eli.element.setAttributeNS(null, 'height', params.height)
                    if (params.y) {
                        eli.element.setAttributeNS(null, 'y', params.y)
                    }
                }
            } else {
                el.setHeight(params.height);
            }
        }

        // Left
        else if (params.left !== undefined) {
            if (isSVGElement) {
                if (Ext.isIE) {
                    eli.attr('left', params.left);
                } else {
                    eli.element.setAttributeNS(null, 'left', params.left)
                }
            } else {
                el.setLeft(params.left);
            }
        }
        // Top
        else if (params.top) {
            if (isSVGElement) {
                if (Ext.isIE) {
                    eli.attr('top', params.top);
                } else {
                    eli.element.setAttributeNS(null, 'top', params.top)
                }
            } else {
                el.setTop(params.top);
            }

            // Transform
        } else if (params.translateX && params.translateY) {
            if (isSVGElement) {
                if (Ext.isIE) {
                    eli.attr('transform', 'translate(' + params.translateX + ',' + params.translateY + ' )');
                } else {
                    eli.element.setAttributeNS(null, 'transform', 'translate(' + params.translateX + ',' + params.translateY + ' )');
                }
            }
        }

        // Opacity
        if (params.opacity !== undefined) {
            if (!isSVGElement) {
                el.setOpacity(parseInt(params.opacity), {
                    duration: options.duration,
                    callback: options.complete
                });
            }
        }

        // Callback
        if (options.complete != undefined)
            options.complete();
    },

    getAjax: function(url, callback) {
        Ext.Ajax.request({
            url: url,
            success: function(response) {
                callback(response.responseText);
            }
        });
    }
}