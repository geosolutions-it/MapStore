/*
** Ext.ux.Dialog.js for Ext.ux.Dialog
**
** Made by Gary van Woerkens
** Contact <gary@chewam.com>
**
** Started on  Wed Jun  9 01:47:49 2010 Gary van Woerkens
** Last update Tue Jun 15 17:17:25 2010 Gary van Woerkens
*/

Ext.ns('Ext.ux');

/**
 * @class Ext.ux.Dialog
 * @extends Ext.Panel
 *
 * @author Gary van Woerkens
 * @version 1.0
 */

Ext.ux.Dialog = Ext.extend(Ext.Panel, {

  height:140
  ,width:350
  ,frame:true
  ,layout:"fit"
  ,floating:true
  ,hidden:true
  /**
   * @cfg {Ext.Element} dialogEl
   * The {@link Ext.Element} where to anchor the dialog panel.
   */
  ,dialogEl:null

  ,initComponent:function() {

    this.tools = [{
      id:"close"
      ,scope:this
      ,handler:function(event, el, win){
	this.close();
      }
    }];

    Ext.ux.Dialog.superclass.initComponent.call(this);

    this.on({
      scope:this
      ,show:this.open
    });

  }

  /**
   * Masks {@link Ext.ux.Dialog#dialogEl dialogEl} and
   * anchors dialog panel to {@link Ext.ux.Dialog#dialogEl dialogEl}.
   */
  ,open:function() {
    this.dialogEl.mask();
    this.getEl().anchorTo(this.dialogEl, "c-c");
    this.doLayout();
  }

  /**
   * Hides the dialog panel and unmask {@link Ext.ux.Dialog#dialogEl dialogEl}.
   */
  ,close:function() {
    this.hide();
    this.dialogEl.unmask();
  }

});

Ext.reg('dialogpanel', Ext.ux.Dialog);
