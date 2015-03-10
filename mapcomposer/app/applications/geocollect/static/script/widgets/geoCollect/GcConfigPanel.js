/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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

Ext.ns("mxp.widgets");

/**
 * GoeMobileWidgetPanel
 * Allow to create mobile widget
 * */
mxp.widgets.GcConfigPanel = Ext.extend(Ext.FormPanel, {

    /** api: xtype = mxp_gc_mobile_widget_panel */
    xtype : 'mxp_gc_config_panel',

    title : "Additional Configuration",
    checkMissionBtn:"Validate",
    checkMissionBtnTooltip:"Validate Configuration",
    validateMsgValid:"Mission Template Valid",
    validateMsgInvalid:"Mission Template Invalid",
    validateMsgTitle:"Is Valid?",
    frame:true,
    layout:'fit',
    border : false,
    frame : true,

    initComponent : function() { 
        this.tbar=
        [ {
        xtype:'toolbar',
        items:[
        {
        text:this.checkMissionBtn,
        tooltip: this.checkMissionBtnTooltip,
        iconCls: "accept",
        handler: function(btn){

        Ext.Msg.show({
        title:this.validateMsgTitle,
        msg:this.canCommit()? this.validateMsgValid:this.validateMsgInvalid,
        animEl: 'elId',
        icon: Ext.MessageBox.INFO
        });

        },scope:this}, ]
        }];

        this.items=        [{
            xtype : 'textarea',
            name : 'blob',
            fieldLabel : null,
            anchor : '100% 0',
            allowBlank : true
        }]; 
        mxp.widgets.GcConfigPanel.superclass.initComponent.call(this, arguments);
    },
    getResourceData : function() {
      if(this.rendered){
          this.configVal=this.getForm().getValues().blob;          
      }
       return  Ext.util.JSON.decode( this.configVal);
    },
    loadResourceData : function(resource) {
        if(typeof resource != 'string'){
             resource = new  OpenLayers.Format.JSON().write(resource,true);
             } 
       this.configVal=resource;
        var f = this.getForm();
        f.setValues({
            blob : this.configVal
        });
    },
    canCommit : function() {
        var f = this.getForm().getValues().blob;
        if (f.length < 1)
            return false;
        try {
            var res = Ext.util.JSON.decode(f);
        } catch (e) {
            return false;
        }
        return true;
    }
});
Ext.reg(mxp.widgets.GcConfigPanel.prototype.xtype, mxp.widgets.GcConfigPanel);
