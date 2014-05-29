/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp
 *  class = PlanEditorPanel
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */
Ext.namespace("gxp");

/** api: constructor
 *  .. class::PlanEditorPanel(config)
 *   
 *      create a panel to edit the plan
 */
gxp.PlanEditorPanel = Ext.extend(Ext.FormPanel, {

    /** api: xtype = gxp_planeditorpanel */
    xtype: "gxp_planeditorpanel",

    // default config
    layout: "form",

    /** i18n **/
    aoiText: "AOI",
    nameText: "Name",
    intervalText: "Interval",
    startText: "Start",
    endText: "End",
    sensorText: "Sensor",
    sensorModeText: "Mode",
    /** EoF i18n **/

    defaults: {
        anchor: "95%",
        style: {
            paddingLeft: "5px"
        }
    },

    // sensor and sensor modes
    sensorData: [['ESR1', 'ESR1'], ['ESR1', 'ESR2'], ['RS1', 'RS1'], ['RS2', 'RS2']],
    sensorModeData: [['PRI', 'PRI'], ['FI', 'FI']],

    /** private: method[initComponent]
     *  Initialize the form panel.
     */
    initComponent: function() {

        var sensorStore = new Ext.data.ArrayStore({
            fields: [
                'id',
                'text'
            ],
            data: this.sensorData
        });

        var sensorModeStore = new Ext.data.ArrayStore({
            fields: [
                'id',
                'text'
            ],
            data: this.sensorModeData
        });

        this.items = [{
            xtype: "fieldset",
            title: this.aoiText,
            items:[{
                xtype: "fieldset",
                title: this.intervalText,
                layout: "form",
                items: [{
                    xtype: "datetimefield",
                    name: "dateStart",
                    fieldLabel: this.startText,
                    allowBlank: false,
                    width: 329
                },{
                    xtype: "datetimefield",
                    name: "dateEnd",
                    fieldLabel: this.endText,
                    allowBlank: false,
                    width: 329
                }]
            },{
                xtype: "fieldset",
                title: this.sensorText,
                items: [{
                    xtype: "compositefield",
                    items:[{
                        xtype: "combo",
                        fieldLabel: this.sensorText,
                        triggerAction: 'all',
                        lazyRender:true,
                        mode: 'local',
                        valueField: 'id',
                        displayField: 'text',
                        store: sensorStore,
                        name: "sensor",
                        allowBlank: false,
                        width: 60
                    },{
                        xtype: "combo",
                        fieldLabel: this.sensorModeText,
                        triggerAction: 'all',
                        lazyRender:true,
                        mode: 'local',
                        valueField: 'id',
                        displayField: 'text',
                        store: sensorModeStore,
                        name: "sensorMode",
                        allowBlank: false,
                        flex: 1
                    }]
                }]
            }]
        }];

        gxp.PlanEditorPanel.superclass.initComponent.call(this);  
    },

    reset: function(){
        this.getForm().reset();
    }

});

/** api: xtype = gxp_planeditorpanel */
Ext.reg(gxp.PlanEditorPanel.prototype.xtype, gxp.PlanEditorPanel);