/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
/** api: (define)
 *  module = mxp.plugins
 *  class = Tool
 *  base_link = `Ext.util.Observable <http://extjs.com/deploy/dev/docs/?class=Ext.util.Observable>`_
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: TemplateManager(config)
 *
 *    Open a template manager
 */
mxp.plugins.TemplateManager = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_templatemanager */
    ptype: "mxp_templatemanager",

    buttonText: "Templates",
    tooltipText: "Open Templates Manager",

    loginManager: null,    

    setActiveOnOutput: true,

    /** api: method[addActions]
     */
    addActions: function() {
        
        var thisButton = new Ext.Button({
            iconCls:'template_manger_ic',
            text: this.buttonText,
            tooltip: this.tooltipText,
            handler: function() { 
            	this.addOutput();                        
            },
            scope: this
        });

        var actions = [thisButton];

        return mxp.plugins.TemplateManager.superclass.addActions.apply(this, [actions]);
    },
    
    /** api: method[addOutput]
     *  :arg config: ``Object`` configuration for the ``Ext.Component`` to be
     *      added to the ``outputTarget``. Properties of this configuration
     *      will be overridden by the applications ``outputConfig`` for the
     *      tool instance.
     *  :return: ``Ext.Component`` The component added to the ``outputTarget``. 
     *
     *  Adds output to the tool's ``outputTarget``. This method is meant to be
     *  called and/or overridden by subclasses.
     */
    addOutput: function(config) {

        var login = this.target.login ? this.target.login: 
                this.loginManager && this.target.currentTools[this.loginManager] 
                ? this.target.currentTools[this.loginManager] : null;

        this.outputConfig = this.outputConfig || {};

        // create a template manager panel
        Ext.apply(this.outputConfig, {
             iconCls:'template_manger_ic',
            xtype: "msm_templatemanager",
            id: this.target.templateManagerId,
			target:this.target,
            auth: this.target.authHeader,
            login: login.login,
            searchUrl: this.target.geoSearchCategoriesUrl,
            url: this.target.geoBaseMapsUrl,
            geoStoreBase: this.target.config.geoStoreBase,
            closable: true,
            closeAction: 'close',
            mediaContent: this.target.initialConfig.mediaContent
        });
        if(this.target.config.adminUrl){
            Ext.apply(this.outputConfig, {
                adminUrl: this.target.config.adminUrl
            }); 
        }

        return mxp.plugins.TemplateManager.superclass.addOutput.apply(this, arguments);
    }
});

Ext.preg(mxp.plugins.TemplateManager.prototype.ptype, mxp.plugins.TemplateManager);