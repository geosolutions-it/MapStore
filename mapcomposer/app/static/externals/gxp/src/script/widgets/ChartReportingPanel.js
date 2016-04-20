/**
* Copyright (c) 2008-2011 The Open Planning Project
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/

/** api: (define)
*  module = gxp.grid
*  class = FeatureGrid
*  base_link = `Ext.grid.GridPanel <http://extjs.com/deploy/dev/docs/?class=Ext.grid.GridPanel>`_
*/
Ext.namespace("gxp.widgets.charts");

/** api: constructor
*  .. class:: FeatureGrid(config)
*
*      Create a new grid displaying the contents of a 
*      ``GeoExt.data.FeatureStore`` .
*/
gxp.widgets.charts.ChartReportingPanel = Ext.extend(Ext.DataView, {

	/** api: config[xtype]
	*/
	xtype: "gxp_chartreportingpanel",
    itemSelector: 'div.thumb-wrap',
    cls: "chart-report-panel",
    overClass: "hover",
    style:'overflow:auto',
    singleSelect: true,
    confirmRemoveText: "Do you really want to remove this chart",
    
    initComponent: function(){
        var me = this;
        this.tpl =  new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{company}">',
            '<div class="thumb"><div class="chart-item chart-item-{chartType}"></div></div>',
            '<div class="chart-icon chart-icon-{chartStatus}"></div>',
            '<div id={[this.getRemoveId(values)]} class="remove-chart icon-reset"></div>',
            '<span>{title}</span></div>',
            '</tpl>',{
                getRemoveId: function(values) {
                    var result = Ext.id();
                    var obj = me.store.getById(values.id);
                    this.addListener.defer(1, this, [result, values, obj]); 
                    return result;
                },
                addListener: function(id, values) {
                    var obj = me.store.getById(values.id);
                    Ext.get(id).on('click', function(e){ 
                        me.confirmRemove(obj);
                        e.stopEvent(); 
                    })
                }
            }
        );
		gxp.widgets.charts.ChartReportingPanel.superclass.initComponent.call(this);
    },
    confirmRemove: function(obj) {
        Ext.Msg.confirm(null, this.confirmRemoveText + ":<br/>" + obj.get("title"), function(btn, text){
          if (btn == 'yes'){
             this.store.remove(obj); 
          } else {
            this.close;
          }
        },this);
       
    }


});

/** api: xtype = gxp_featuregrid */
Ext.reg('gxp_chartreportingpanel', gxp.widgets.charts.ChartReportingPanel); 
