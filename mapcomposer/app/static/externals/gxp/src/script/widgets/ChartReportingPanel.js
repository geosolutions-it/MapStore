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
    deleteSessionChartText: "Delete Chart From Current Session",
    deleteChartConfirmationText: "Are you sure you want to delete this chart ? It will be removed from the server permanently.",
    
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
                    var element = Ext.get(id);
                    if (!element) {
                        return;
                    }
                    var obj = me.store.getById(values.id);
                    element.on('click', function(e){ 
                        me.confirmRemove(obj);
                        e.stopEvent(); 
                    })
                }
            }
        );
		gxp.widgets.charts.ChartReportingPanel.superclass.initComponent.call(this);
    },
    confirmRemove: function(obj) {
        var me = this;
        Ext.MessageBox.show({
            title: this.deleteSessionChartText,
            msg: this.deleteSessionChartConfirmationText,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function(button) {
                if(button == 'yes') {
                    me.store.remove(obj);
                }
            }
        });
    }
});

/** api: xtype = gxp_featuregrid */
Ext.reg('gxp_chartreportingpanel', gxp.widgets.charts.ChartReportingPanel); 
