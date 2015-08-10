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
 * @author Mirco Bertelli
 */
Ext.namespace('gxp.widgets.button');

gxp.widgets.button.NrlHelpModuleButton = Ext.extend(Ext.Button, {

    xtype: 'gxp_nrlHelpModuleButton',
    portalRef: undefined,
    helpPath: undefined,
    text: 'Help',
    iconCls: 'gxp-icon-nrl-help',
    iconAlign: 'left',

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

});

Ext.reg(gxp.widgets.button.NrlHelpModuleButton.prototype.xtype, gxp.widgets.button.NrlHelpModuleButton);
