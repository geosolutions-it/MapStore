Ext.namespace('gxp.widgets.button');

/** api: constructor
 *  .. class:: NrlChart(config)
 *
 *    Base class to create chart
 
 *    ``createLayerRecord`` method.
 */   
gxp.widgets.button.NrlChartButton = Ext.extend(Ext.Button,{
   
    /** api: xtype = gxp_nrlchart */
    xtype: 'gxp_nrlChartButton',
    iconCls: "gxp-icon-nrl-chart",
    handler:function(){
            Ext.Msg.alert("Add Area","Not Yet Implemented");
    }    

});

Ext.reg(gxp.widgets.button.NrlChartButton.prototype.xtype,gxp.widgets.button.NrlChartButton);
