/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25
*/
Ext.ns('Ext.ux.tree');

/**
 * @class Ext.ux.tree.XmlTreeLoader
 * @extends Ext.tree.TreeLoader
 * <p>A TreeLoader that can convert an XML document into a hierarchy of {@link Ext.tree.TreeNode}s.
 * Any text value included as a text node in the XML will be added to the parent node as an attribute
 * called <tt>innerText</tt>.  Also, the tag name of each XML node will be added to the tree node as
 * an attribute called <tt>tagName</tt>.</p>
 * <p>By default, this class expects that your source XML will provide the necessary attributes on each
 * node as expected by the {@link Ext.tree.TreePanel} to display and load properly.  However, you can
 * provide your own custom processing of node attributes by overriding the {@link #processNode} method
 * and modifying the attributes as needed before they are used to create the associated TreeNode.</p>
 * @constructor
 * Creates a new XmlTreeloader.
 * @param {Object} config A config object containing config properties.
 */
Ext.ux.tree.XmlTreeLoader = Ext.extend(Ext.tree.TreeLoader, {
    /**
     * @property  XML_NODE_ELEMENT
     * XML element node (value 1, read-only)
     * @type Number
     */
    XML_NODE_ELEMENT : 1,
    /**
     * @property  XML_NODE_TEXT
     * XML text node (value 3, read-only)
     * @type Number
     */
    XML_NODE_TEXT : 3,

    // private override
    processResponse : function(response, node, callback){
        var xmlData = response.responseXML,
            root = xmlData.documentElement || xmlData;

        try{
            node.beginUpdate();
            node.appendChild(this.parseXml(root));
            node.endUpdate();

            this.runCallback(callback, scope || node, [node]);
        }catch(e){
            this.handleFailure(response);
        }
    },

    // private
    parseXml : function(node) {
        var nodes = [];
        Ext.each(node.childNodes, function(n){
            if(n.nodeType == this.XML_NODE_ELEMENT){
                var treeNode = this.createNode(n);
                if(n.childNodes.length > 0){
                    var child = this.parseXml(n);
                    if(typeof child == 'string'){
                        treeNode.attributes.innerText = child;
                    }else{
                        treeNode.appendChild(child);
                    }
                }
                nodes.push(treeNode);
            }
            else if(n.nodeType == this.XML_NODE_TEXT){
                var text = n.nodeValue.trim();
                if(text.length > 0){
                    return nodes = text;
                }
            }
        }, this);

        return nodes;
    },

    // private override
    createNode : function(node){
        var attr = {
            tagName: node.tagName
        };

        Ext.each(node.attributes, function(a){
            attr[a.nodeName] = a.nodeValue;
        });

        this.processAttributes(attr);

        return Ext.ux.tree.XmlTreeLoader.superclass.createNode.call(this, attr);
    },

    /*
     * Template method intended to be overridden by subclasses that need to provide
     * custom attribute processing prior to the creation of each TreeNode.  This method
     * will be passed a config object containing existing TreeNode attribute name/value
     * pairs which can be modified as needed directly (no need to return the object).
     */
    processAttributes: Ext.emptyFn
});

//backwards compat
Ext.ux.XmlTreeLoader = Ext.ux.tree.XmlTreeLoader;
