/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

//TODO remove the WMSStylesDialog and GeoServerStyleWriter includes
/**
 * include widgets/WMSStylesDialog.js
 * include plugins/GeoServerStyleWriter.js
 */

/** api: (define)
 *  module = gxp
 *  class = WMSLayerPanel
 *  base_link = `Ext.TabPanel <http://extjs.com/deploy/dev/docs/?class=Ext.TabPanel>`_
 */
Ext.namespace("gxp.he");

/** api: constructor
 *  .. class:: WMSLayerPanel(config)
 *
 *      Create a dialog for setting WMS layer properties like title, abstract,
 *      opacity, transparency and image format.
 */
gxp.he.WMSLayerPanelHE = Ext.extend(gxp.WMSLayerPanel, {


    /** api: config[sameOriginStyling]
     *  ``Boolean``
     *  Only allow editing of styles for layers whose sources have a URL that
     *  matches the origin of this application.  It is strongly discouraged to
     *  do styling through the proxy as all authorization headers and cookies
     *  are shared with all remotesources.  Default is ``true``.
     */
    sameOriginStyling: true,

    /** api: config[rasterStyling]
     *  ``Boolean`` If set to true, single-band raster styling will be
     *  supported.  Default is ``false``.
     */
    rasterStyling: false,

    initComponent: function() {

        gxp.he.WMSLayerPanelHE.superclass.initComponent.call(this);
    },

    /** private: createStylesPanel
     *  :arg url: ``String`` url to save styles to
     *
     *  Creates the Styles panel.
     */
    createStylesPanel: function(url) {
        var config = gxp.he.WMSStylesDialogHE.createGeoServerStylerConfig(
            this.layerRecord, url
        );

        config.plugins.push({
            ptype: "gxp_wmsrasterstylesdialoghe"
        });

        var ownerCt = this.ownerCt;
        if (!(ownerCt.ownerCt instanceof Ext.Window)) {
            config.dialogCls = Ext.Panel;
            config.showDlg = function(dlg) {
                dlg.layout = "fit";
                dlg.autoHeight = false;
                ownerCt.add(dlg);
            };
        }
        return Ext.applyIf(config, {
            title: this.stylesText,
            style: "padding: 10px",
            editable: false,
            disableEditButtons: true
        });
    }

});

Ext.reg('gxp_wmslayerpanelhe', gxp.he.WMSLayerPanelHE);
