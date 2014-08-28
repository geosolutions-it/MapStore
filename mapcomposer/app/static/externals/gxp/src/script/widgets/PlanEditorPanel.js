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
    
    adminUrl: null,
    userId: null,
    serviceId: null,
    grid: null,

    /** i18n **/
    aoiText: "AOI",
    nameText: "Name",
    descriptionText: "Description",
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
    /** private: method[initComponent]
     *  Initialize the form panel.
     */
    initComponent: function() {
        var me = this;
        
        var store = new Ext.data.JsonStore({
            url: this.adminUrl + "mvc/serviceManager/extJSbrowser?action=get_servicesensorslist&folder="+this.userId+"&name="+this.serviceId,
            autoLoad: true,
            autoSync: true,
            fields: ["sensor_type", "sensor_mode"]
        });
        var sensorStore = new Ext.data.JsonStore({
            url: this.adminUrl + "mvc/serviceManager/extJSbrowser?action=get_sensorslist",
            autoLoad: true,
            fields: [
                'text'
            ]
        });

        var sensorModeStore = new Ext.data.JsonStore({
            url: this.adminUrl + "mvc/serviceManager/extJSbrowser?action=get_sensorModeslist",
            autoLoad: true,
            fields: [
                'text'
            ]
        });
        
        this.grid = new Ext.grid.GridPanel({
            width: 450,
            height: 110,
            autoScroll: true,
            frame: true,
            layout: 'fit',
            //title: 'Sensors',
            store: store,
            iconCls: 'icon-user',
            columns: [{
                header: 'Sensor Type',
                width: 100,
                sortable: true,
                dataIndex: 'sensor_type',
                field: {
                    xtype: 'textfield'
                }
            }, {
                header: 'Sensor Mode',
                width: 290,
                sortable: true,
                dataIndex: 'sensor_mode',
                field: {
                    xtype: 'textfield'
                }
            }],
            listeners:{
                rowclick: function(grid, rowIndex, columnIndex, e) {
                    var rec      = grid.store.getAt(rowIndex);
                    me.selectedRecord = rec;
                    Ext.getCmp(me.id + "_delete").enable();
                },
                scope:this
            },
            tbar: [{
                xtype: 'toolbar',
                items: [{
                    text: 'Add',
                    iconCls: 'icon-add',
                    handler: function(){
                        // empty record
                        var sensor = {
                            sensor_type: Ext.getCmp(me.id + "_sensor_combo").lastSelectionText,
                            sensor_mode: Ext.getCmp(me.id + "_sensor_mode_combo").lastSelectionText
                        };
                        
                        if (sensor.sensor_type && sensor.sensor_mode)
                        {
                            var record = new store.recordType(sensor); // create new record
                            
                            var recordIndex1 = store.find("sensor_type", sensor.sensor_type);
                            var recordIndex2 = store.find("sensor_mode", sensor.sensor_mode);
                            
                            //
                            // The process record is added only if missing inside the Grid
                            //
                            if(recordIndex1 == -1 || recordIndex2 == -1){
                               store.addSorted(record);
                            }
                        }
                    }
                }, 
                '-', 
                {
                    id: me.id + "_delete",
                    itemId: 'delete',
                    text: 'Delete',
                    iconCls: 'icon-reset',
                    disabled: true,
                    handler: function(){
                        var selection = me.selectedRecord;
                        if (selection) {
                            store.remove(selection);
                        }
                        Ext.getCmp(me.id + "_delete").disable();
                    }
                },
                '-',
                {
                    xtype: "compositefield",
                    items:[{
                        id: me.id + "_sensor_combo",
                        xtype: "combo",
                        fieldLabel: me.sensorText,
                        triggerAction: 'all',
                        lazyRender:true,
                        mode: 'local',
                        valueField: 'text',
                        displayField: 'text',
                        store: sensorStore,
                        name: "sensor",
                        //allowBlank: false,
                        width: 60
                    },{
                        id: me.id + "_sensor_mode_combo",
                        xtype: "combo",
                        fieldLabel: me.sensorModeText,
                        triggerAction: 'all',
                        lazyRender:true,
                        mode: 'local',
                        valueField: 'text',
                        displayField: 'text',
                        store: sensorModeStore,
                        name: "sensorMode",
                        //allowBlank: false,
                        flex: 1
                    }]
                }]
            }]
        });
        
        this.items = [{
            xtype: "fieldset",
            title: this.aoiText,
            items:[
            {
                xtype: "textfield",
                name: "description",
                autoWidth: true,
                fieldLabel: this.descriptionText,
                allowBlank: false,
                width: 329
            },
            {
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
                
            },{
                xtype: "fieldset",
                title: this.sensorText,
                items: [
                    this.grid
                ]
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