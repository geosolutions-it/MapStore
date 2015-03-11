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
 * @author Lorenzo Natali
 */

/**
 * -@requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins.he
 *  class = GCD
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: GCD(config)
 *
 *    Plugin for adding GCD modules to a :class:`gxp.Viewer`.
 */
gxp.plugins.he.GCD = Ext.extend(gxp.plugins.Tool, {

    /** api: ptype = he_gcd */
    ptype: "he_gcd",
    
    /** a card layout panel than needs to be switched on tabchange event  */
    resultsCardPanel: "results_panel",
    
    /** private: method[addOutput]
     *  :arg config: ``Object``
     */
    addOutput: function (config) {

        var target = this.target,
            me = this;

        config = Ext.apply({
            xtype: 'tabpanel',
            id: 'modulewrapper',
            border: false,
            split: true,
            deferredRender: true,
            collapseMode: "mini",
            activeItem: 0,
            activeTab: 0,
            enableTabScroll: true,
            header: false,

            listeners: {
                afterrender: function (tabpanel) {
                    //set active tab after render
                    target.on('ready', function () {
                        if (tabpanel.startTab) {
                            tabpanel.setActiveTab(tabpanel.startTab);
                        } else {
                            tabpanel.setActiveTab(0);
                        }
                    });
                },
                /**
                NOTE: This listener requires the tabs to have a "cardId" property
                      that matches an existing panel ID in the "resultsCardPanel" layout
                      Example:
                      {
                        "id": "capacity_data",
                        "ptype":"he_capacity_data",
                        [...]
                        "outputConfig":{
                             "id":"CapacityDataForm",
                             "cardId": 0
                        }
                        [...]
                      }
                **/
                tabchange: function(tabPanel, tab){
                    var cardPanel = me.resultsCardPanel ? Ext.getCmp(me.resultsCardPanel) : null;
                    if(cardPanel){
                        cardPanel.getLayout().setActiveItem(tab.cardId);
                    }
                }
            }

        }, config || {});


        var he_Modules = gxp.plugins.he.GCD.superclass.addOutput.call(this, config);

        return he_Modules;
    },
    enableData: function () {
        var tabs = this.output[0].items;
        for (var i = 0; i < tabs.items.length; i++) {
            if (tabs.items[i].outputType && tabs.items[i].outputType.items.items) {
                tabs.items[i].outputType.items.items[0].enable();
            } else {
                if (tabs.items[i].outputType) {
                    tabs.items[i].outputType.items[0].disabled = false;
                }
            }
        }
    },
    disableData: function () {
        var tabs = this.output[0].items;
        for (var i = 0; i < tabs.items.length; i++) {
            if (tabs.items[i].outputType && tabs.items[i].outputType.items.items) {
                tabs.items[i].outputType.items.items[0].disable();
                tabs.items[i].outputType.items.items[1].setValue("chart");
            } else {
                if (tabs.items[i].outputType) {
                    tabs.items[i].outputType.items[0].disabled = true;
                    tabs.items[i].outputType.items[0].inputValue = "chart";
                }
            }
        }
    },
});

Ext.preg(gxp.plugins.he.GCD.prototype.ptype, gxp.plugins.he.GCD);