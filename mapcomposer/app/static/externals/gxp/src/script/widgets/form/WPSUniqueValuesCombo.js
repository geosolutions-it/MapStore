/**
* Copyright (c) 2014 Geosolutions
*
* Published under the GPL license.
* See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
* of the license.
*/


/** api: (define)
 *  module = gxp.widgets.form
 *  class = WPSUniqueValuesCombo
 *  base_link = `Ext.form.ComboBox <http://extjs.com/deploy/dev/docs/?class=Ext.form.ComboBox>`_
 */
Ext.namespace("gxp.widgets.form");

/** api: constructor
 *  .. class:: WPSUniqueValuesCombo(config)
 *   
 *      A combo box targeted to show unique values for a given field and layer.
 *      It accepts all the config values of ComboBox.
 */
gxp.widgets.form.WPSUniqueValuesCombo = Ext.extend(Ext.form.ComboBox, {
    // private
    getParams : function(q){
        var params = this.superclass().getParams.call(this, q);
        Ext.apply(params, this.store.baseParams);
        return params;
    },
    // private
    initList : function() { // warning: overriding ComboBox private method
        this.superclass().initList.call(this);
        if (this.pageTb && this.pageTb instanceof Ext.PagingToolbar) {
            this.pageTb.afterPageText = "";
            this.pageTb.beforePageText = "";
            this.pageTb.displayMsg = "";
        }
    }
});
Ext.reg('gxp_wpsuniquevaluescb', gxp.widgets.form.WPSUniqueValuesCombo);