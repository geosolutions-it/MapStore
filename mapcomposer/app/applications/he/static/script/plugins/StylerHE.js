/**
* Copyright (c) 2015 - 2016 Geo-Solutions S.A.S.
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/**
 * requires plugins/Tool.js
 * requires widgets/WMSStylesDialog.js
 * requires plugins/GeoServerStyleWriter.js
 * requires plugins/WMSRasterStylesDialog.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = StylerHE
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: Styler(config)
 *
 *    Plugin providing a styles editing dialog for geoserver layers.
 *    Based on styler.js
 */
gxp.plugins.he.StylerHE = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = gxp_styler */
    ptype: "gxp_stylerhe",

    /** api: config[id] */
    id: "styler",
    /** api: config[menuText]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    menuText: "Edit Styles",

    /** api: config[tooltip]
     *  ``String``
     *  Text for layer properties action tooltip (i18n).
     */
    tooltip: "Manage layer styles",

    /** api: config[sameOriginStyling]
     *  ``Boolean``
     *  Only allow editing of styles for layers whose sources have a URL that
     *  matches the origin of this applicaiton.  It is strongly discouraged to
     *  do styling through commonly used proxies as all authorization headers
     *  and cookies are shared with all remote sources.  Default is ``true``.
     */
    sameOriginStyling: true,

    /** api: config[rasterStyling]
     *  ``Boolean`` If set to true, single-band raster styling will be
     *  supported. Default is ``false``.
     */
    rasterStyling: false,

    /** api: config[requireDescribeLayer]
     *  ``Boolean`` If set to false, styling will be enabled for all WMS layers
     *  that have "/ows" or "/wms" at the end of their base url in case the WMS
     *  does not support DescribeLayer. Only set to false when rasterStyling is
     *  set to true. Default is true.
     */
    requireDescribeLayer: true,

    /** api: config[geostoreStyleCategoryCreatedSuccessTitle]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    geostoreStyleCategoryCreatedSuccessTitle: "Category created correctly",

    /** api: config[geostoreStyleCategoryCreatedSuccessMsg]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    geostoreStyleCategoryCreatedSuccessMsg: "Creating category LAYERS STYLES successful",

    /** api: config[geostoreStyleCategoryCreatedErrorTitle]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    geostoreStyleCategoryCreatedErrorTitle: "Error creating category",

    /** api: config[geostoreStyleCategoryCreatedErrorMsg]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    geostoreStyleCategoryCreatedErrorMsg: "GeoStore resources disabled, only Admin can create missing LAYERS_STYLES CATEGORY",

    /** api: config[geostoreStyleCategorySearchErrorTitle]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    geostoreStyleCategorySearchErrorTitle: "Error search categories",

    /** api: config[geostoreStyleCategorySearchErrorMsg]
     *  ``String``
     *  Text for layer properties menu item (i18n).
     */
    geostoreStyleCategorySearchErrorMsg: "Something went wrong in the search categories",

    /** private: property[geostoreSource]
     *  boolena if true geostore source enabled
     */
    geostoreSource:false,

    /** private: property[roleAdmin]
     *  boolena if true user is Admin
     */
    roleAdmin:false,

    /** private: property[advancedUser]
     *  boolena if true user is Advanced User
     */
    advancedUser:false,

    constructor: function(config) {
        gxp.plugins.he.StylerHE.superclass.constructor.apply(this, arguments);

        if (!this.outputConfig) {
            this.outputConfig = {
                autoHeight: true,
                width: 340
            };
        }

        Ext.applyIf(this.outputConfig, {
            closeAction: "close"
        });
    },

    /** api: method[addActions]
     */
    addActions: function() {
        var layerProperties;
        var actions = gxp.plugins.he.StylerHE.superclass.addActions.apply(this, [{
            menuText: this.menuText,
            iconCls: "gxp-icon-palette",
            disabled: true,
            tooltip: this.tooltip,
            handler: function() {
                this.addOutput();
            },
            scope: this
        }]);

        this.launchAction = actions[0];
        this.target.on({
            layerselectionchange: this.handleLayerChange,
            ready: this.checkGeostoreStyleCategory,
            scope: this
        });

        return actions;
    },

    /** private: method[handleLayerChange]
     *  :arg record: ``GeoExt.data.LayerRecord``
     *
     *  Handle changes to the target viewer's selected layer.
     */
    handleLayerChange: function(record) {
        this.launchAction.disable();
        if (record) {
            var source = this.target.getSource(record);
            if (source instanceof gxp.plugins.WMSSource) {
                source.describeLayer(record, function(describeRec) {
                    this.checkIfStyleable(record, describeRec);
                }, this);
            }
        }
    },

    /** private: method[checkIfStyleable]
     *  :arg layerRec: ``GeoExt.data.LayerRecord``
     *  :arg describeRec: ``Ext.data.Record`` Record from a
     *      `GeoExt.data.DescribeLayerStore``.
     *
     *  Given a layer record and the corresponding describe layer record,
     *  determine if the target layer can be styled.  If so, enable the launch
     *  action.
     */
    checkIfStyleable: function(layerRec, describeRec) {
        if (describeRec) {
            var owsTypes = ["WFS"];
            if (this.rasterStyling === true) {
                owsTypes.push("WCS");
            }
        }
        if (describeRec ? owsTypes.indexOf(describeRec.get("owsType")) !== -1 : !this.requireDescribeLayer) {
            var editableStyles = false;
            var source = this.target.layerSources[layerRec.get("source")];
            var url;
            var restUrl = layerRec.get("restUrl");
            if (restUrl) {
                url = restUrl + "/styles";
            } else {
                url = source.url.split("?")
                    .shift().replace(/\/(wms|ows)\/?$/, "/rest/styles");
            }
            if (this.sameOriginStyling) {
                // this could be made more robust
                // for now, only style for sources with relative url
                editableStyles = url.charAt(0) === "/";
                // and assume that local sources are GeoServer instances with
                // styling capabilities
                if (this.target.authenticate && editableStyles) {
                    // we'll do on-demand authentication when the button is
                    // pressed.
                    this.launchAction.enable();
                    return;
                }
            } else {
                editableStyles = true;
            }
            if (editableStyles) {

                var pattern=/(.+:\/\/)?([^\/]+)(\/.*)*/i;
                var mHost=pattern.exec(url);
                var sameSource = mapStoreDebug ? mapStoreDebug : (mHost[2] == location.host ? true : false);

                this.roleAdmin=(this.target &&
                                this.target.userDetails &&
                                this.target.userDetails.user.role &&
                                ["ROLE_ADMIN","ADMIN"].indexOf(this.target.userDetails.user.role) > -1);

                this.advancedUser=this.hasGroup(this.target.userDetails.user,this.restrictToGroups);

                if(this.roleAdmin && sameSource){
                    this.enableActionIfAvailable(url,this.getAuth());
                }else if(this.advancedUser && sameSource){
                    this.launchAction.setDisabled(!this.geostoreSource);
                    this.launchAction.setHidden(!this.geostoreSource);
                }

                /*if (this.target.isAuthorized()) {
                    // check if service is available
                    this.enableActionIfAvailable(url);
                }*/
            }
        }
    },

    /** private: method[enableActionIfAvailable]
     *  :arg url: ``String`` URL of style service
     *
     *  Enable the launch action if the service is available.
     */
    enableActionIfAvailable: function(url,auth) {
        Ext.Ajax.request({
            method: "PUT",
            url: url,
            headers: {"Authorization":  auth},
            callback: function(options, success, response) {
                // we expect a 405 error code here if we are dealing
                // with GeoServer and have write access.
                if (this.roleAdmin){
                    this.launchAction.setDisabled(response.status !== 405);
                    this.launchAction.setHidden(response.status !== 405);
                }
            },
            scope: this
        });
    },

    addOutput: function(config) {
        config = config || {};
        var record = this.target.selectedLayer;

        var origCfg = this.initialConfig.outputConfig || {};
        this.outputConfig.title = origCfg.title ||
            this.menuText + ": " + record.get("title");
        this.outputConfig.shortTitle = record.get("title");

        Ext.apply(config, gxp.he.WMSStylesDialogHE.createGeoServerStylerConfig(record));
        if (this.rasterStyling === true) {
            config.plugins.push({
                ptype: "gxp_wmsrasterstylesdialoghe"
            });
        }
        Ext.applyIf(config, {style: "padding: 10px"});

        var output = gxp.plugins.Styler.superclass.addOutput.call(this, config);
        if (!(output.ownerCt.ownerCt instanceof Ext.Window)) {
            output.dialogCls = Ext.Panel;
            output.showDlg = function(dlg) {
                dlg.layout = "fit";
                dlg.autoHeight = false;
                output.ownerCt.add(dlg);
            };
        }
        output.stylesStore.on("load", function() {
            if (!this.outputTarget && output.ownerCt.ownerCt instanceof Ext.Window) {
                output.ownerCt.ownerCt.center();
            }
        });

    },

    /** private: method[hasGroup]
     *  ``Function`` Check if users has passed group
     *
     */
    hasGroup: function(user, targetGroups){
        if(user && user.groups && targetGroups){
            var groupfound = false;
            for (var key in user.groups.group) {
                if (user.groups.group.hasOwnProperty(key)) {
                    var g = user.groups.group[key];
                    if(g.groupName && targetGroups.indexOf(g.groupName) > -1 ){
                        groupfound = true;
                    }
                }
            }
            return groupfound;
        }

        return false;
    },

    /** private: method[checkGeostoreStyleCategory]
     *  :arg url:
     *
     */
    checkGeostoreStyleCategory: function(){
        var user, password;
        if(this.target.authToken) {
            var parts = Base64.decode(this.target.authToken.substring(6)).split(':');
            user = parts[0];
            password = parts[1];
        }
        this.geoStore = new gxp.plugins.GeoStoreClient({
            url: this.target.geoStoreBaseURL,
            user: user || undefined,
            password: password || undefined,
            authToken: this.target.authToken || undefined,
            proxy: this.target.proxy,
            listeners: {
                "geostorefailure": function(tool, msg){
                    Ext.Msg.show({
                        title: "Geostore Exception",
                        msg: msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            }
        });

        var geostoreEntityResource = new OpenLayers.GeoStore.Category({
            name: "LAYERS_STYLES"
        });

        this.geoStore.existsEntity(geostoreEntityResource,
            function(data){
                if(!data){
                    this.geoStore.createEntity(geostoreEntityResource,function(){
                        this.geostoreSource = true;
                        Ext.Msg.show({
                            title: this.geostoreStyleCategoryCreatedSuccessTitle,
                            buttons: Ext.Msg.OK,
                            msg: this.geostoreStyleCategoryCreatedSuccessMsg,
                            icon: Ext.MessageBox.INFO,
                            scope: this
                        });
                    },function(response){
                        Ext.Msg.show({
                            title: this.geostoreStyleCategoryCreatedErrorTitle,
                            buttons: Ext.Msg.OK,
                            msg: this.geostoreStyleCategoryCreatedErrorMsg,
                            icon: Ext.MessageBox.ERROR,
                            scope: this
                        });
                    },this)
                }else{
                    this.geostoreSource = true;
                }
            },
            function(response){
                Ext.Msg.show({
                    title: this.geostoreStyleCategorySearchErrorTitle,
                    buttons: Ext.Msg.OK,
                    msg: this.geostoreStyleCategorySearchErrorMsg+this.getErrorMsg(response),
                    icon: Ext.MessageBox.ERROR,
                    scope: this
                });
            },
            this
        );
    },

    /** private: method[getErrorMsg]
     *  ``Function``Format geostore response errror
     *
     */
    getErrorMsg:function(response){
        return defaultErrMsg = " "+response.statusText + "(status " + response.status + "):  " + response.responseText;
    }

});

Ext.preg(gxp.plugins.he.StylerHE.prototype.ptype, gxp.plugins.he.StylerHE);
