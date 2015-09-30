/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = PrintSnapshotHE
 */

/** api: (extends)
 *  plugins/PrintSnapshot.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: PrintSnapshotHE(config)
 *
 *    Provides an action to print a snapshot of the map.
 */
gxp.plugins.PrintSnapshotHE = Ext.extend(gxp.plugins.PrintSnapshot, {
    
    /** api: ptype = gxp_printsnapshot */
    ptype: "gxp_printsnapshothe",

     /**
     * private method[notSupportedMessage]
     * Show the message about the not supported layers.
     */
    notSupportedMessage: function(layers){
        var messageTrail=""; 
        for(var i = 0; i< layers.notSupported.length ; i++){
            messageTrail+=layers.notSupported[i] +",";
         } 
         Ext.Msg.show({
             title: this.printStapshotTitle,
             msg: messageTrail + this.noSupportedLayersErrorMsg + this.suggestionLayersMsg,
             width: 300,
             icon: Ext.MessageBox.ERROR
        });
    }
});

Ext.preg(gxp.plugins.PrintSnapshotHE.prototype.ptype, gxp.plugins.PrintSnapshotHE);
