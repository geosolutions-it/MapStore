Ext.namespace("Ext.ux");

Ext.ux.MultiRowTabPanel = Ext.extend(Ext.TabPanel, {
  onResize : function(){
    Ext.ux.MultiRowTabPanel.superclass.onResize.apply(this, arguments);  
 
    if(this.multipleRows && this.rendered) {
      var ce = this.tabPosition != 'bottom' ? 'header' : 'footer';
      var aw = this[ce].dom.clientWidth;
      if (aw) {
        this.strip.setWidth(aw - 4);
      }
    }
  },
 
  delegateUpdates : function(){
    if (this.suspendUpdates) {
      return;
    }
    if (this.resizeTabs && this.rendered) {
      this.autoSizeTabs();
    }
    if (!this.multipleRows && this.enableTabScroll && this.rendered) {
      this.autoScrollTabs();
    }
    if (this.multipleRows && this.rendered) {
      this.fixHeight();
    }
  },
 
  fixHeight:function()
  {
    var ce = this.tabPosition != 'bottom' ? 'header' : 'footer';
    var ah = this[ce].dom.clientHeight;   // Get the real height of Tab rows (query DOM)
 
    if(!this.lastTabsHeight)
      this.lastTabsHeight = ah;
 
    // Check if the height of Tab rows has been changed since the last time 
    // (e.g. new row was added or the row was deleted)
    if(this.lastTabsHeight != ah)
    {
      var diff = ah - this.lastTabsHeight; // calculate a difference in height between current and previous values
      this.lastTabsHeight = ah;            // save the current height of Tab rows for the next reference
      this.lastSize = null; //forces recalc
      this.setHeight(this.getSize().height - diff);  // Adjust the height of the client area
    }
  }
});
Ext.reg('multirowtabpanel', Ext.ux.MultiRowTabPanel);