/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = HelpButton
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: Disclaimer(config)
 *
 *    Plugin for adding a custom help button to MapStore. This will show an help window
 *    The HelpButton tool can be configured by setting this tool's 
 *    ``outputConfig`` property.
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */ 
gxp.plugins.Disclaimer = Ext.extend(gxp.plugins.Tool, {
    ptype:'gxp_disclaimer',
     
    /** i18n */
    menuText:'Disclaimer',
    text:'Disclaimer', 
    title:'Disclaimer',
    iconCls:'gx-help',
    tooltip:'Open the Disclaimer Page',
	fileDocURL: null,
    /** api: method[addActions]
     */
    /** api: method[addActions]
     */
    addActions: function() {
        var actions = [{
            id: this.id,
            xtype: 'gxp_nrlHelpModuleButton',
            text: this.text,
            portalRef: this.portalRef,
            helpPath: this.disclaimerPath,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function(){
                var staticPage = app.tools[this.portalRef];
                var portalUrl = staticPage.url;
                var re = /(^http[s]?:[\/]{2}[\w\.]+)(.*$)/g;
                var subst = this.helpPath;
                var match = re.exec(portalUrl);
                var helpUrl = match[1] + subst;
                var tabpanel = Ext.getCmp(staticPage.target.renderToTab);
                tabpanel.setActiveTab(0);
                staticPage.staticPanel.get(0).el.set({src: helpUrl},false);
            }
        }];
        return gxp.plugins.HelpButton.superclass.addActions.apply(this, actions);
    }
});

Ext.preg(gxp.plugins.Disclaimer.prototype.ptype, gxp.plugins.Disclaimer);