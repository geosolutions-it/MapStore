
// override 3.4.1.1 to be able to restore column state
Ext.override(Ext.grid.ColumnModel, {
   // add properties on columns that are stateful here
   statefulColProps: ['width', 'hidden'],
   setState: function(col, state) {
      // filter properties on those that should actually be stateful
      // (prevents overwriting properties like renderer accidentally)
      var newState = {};
      if (state) {
         Ext.each(this.statefulColProps, function(prop) {
            if (state[prop]) newState[prop] = state[prop];
         });         
      };
      // apply to column configuration 
      if (this.columns && this.columns[col]) {
         Ext.apply(this.columns[col], newState);
      } else if (this.config && this.config[col]) {
         Ext.apply(this.config[col], newState);
      }
   }
});

// override 3.4.1.1 to fix layout bug with composite fields (field width too narrow)
Ext.override(Ext.form.TriggerField, {
   onResize : function(w, h) {
      Ext.form.TriggerField.superclass.onResize.call(this, w, h);
      var tw = this.getTriggerWidth();
      if (Ext.isNumber(w)) {
         this.el.setWidth(w - tw);
      }
      if (this.rendered && !this.readOnly && this.editable && !this.el.getWidth()) this.wrap.setWidth(w);
      else this.wrap.setWidth(this.el.getWidth() + tw);
   }
});

// override 3.4.1.1 to fix issue with tooltip text wrapping in IE9 (tooltip 1 pixel too narrow)
// JS: I suspect this issue is caused by subpixel rendering in IE9 causing bad measurements
Ext.override(Ext.Tip, {
   doAutoWidth : function(adjust) {
      // next line added to allow beforeshow to cancel tooltip (see below)
      if (!this.body) return;
      adjust = adjust || 0;
      var bw = this.body.getTextWidth();
      if (this.title) {
          bw = Math.max(bw, this.header.child('span').getTextWidth(this.title));
      }
      bw += this.getFrameWidth() + (this.closable ? 20 : 0) + this.body.getPadding("lr") + adjust;
      // added this line:
      if (Ext.isIE9) bw += 1;
      this.setWidth(bw.constrain(this.minWidth, this.maxWidth));
      
      if (Ext.isIE7 && !this.repainted) {
          this.el.repaint();
          this.repainted = true;
      }
   }
});

// override 3.4.1.1 to allow beforeshow to cancel the tooltip
// EP: override 3.4.1.1 onMouseMove - to forbid tooltip to be positioned outside of the parent container(if this.constrainPosition == true)
Ext.override(Ext.ToolTip, {
   show: function() {
      if (this.anchor) {
          this.showAt([-1000,-1000]);
          this.origConstrainPosition = this.constrainPosition;
          this.constrainPosition = false;
          this.anchor = this.origAnchor;
      }
      this.showAt(this.getTargetXY());
      
      if (this.anchor) {
          this.anchorEl.show();
          this.syncAnchor();
          this.constrainPosition = this.origConstrainPosition;
      // added "if (this.anchorEl)"
      } else if (this.anchorEl) {
          this.anchorEl.hide();
      }
   },
   showAt : function(xy) {
      this.lastActive = new Date();
      this.clearTimers();
      Ext.ToolTip.superclass.showAt.call(this, xy);
      if (this.dismissDelay && this.autoHide !== false) {
          this.dismissTimer = this.hide.defer(this.dismissDelay, this);
      }
      if (this.anchor && !this.anchorEl.isVisible()) {
          this.syncAnchor();
          this.anchorEl.show();
      // added "if (this.anchorEl)"
      } else if (this.anchorEl) {
          this.anchorEl.hide();
      }
   },
   onMouseMove : function(e){
      var t = this.delegate ? e.getTarget(this.delegate) : this.triggerElement = true;
      if (t) {
         this.targetXY = e.getXY();
         if (t === this.triggerElement) {
            if(!this.hidden && this.trackMouse){
               var xy = this.getTargetXY();
               //added adjust positioning
               if(this.constrainPosition){
                  xy = this.el.adjustForConstraints(xy);
               }
               this.setPagePosition(xy);
            }
         } else {
            this.hide();
            this.lastActive = new Date(0);
            this.onTargetOver(e);
         }
      } else if (!this.closable && this.isVisible()) {
         this.hide();
      }
   }
});

// override 3.4.1.1 to fix false security warning in IE on component destroy
Ext.apply(Ext, {
   removeNode : (Ext.isIE && !Ext.isIE9 && !Ext.isIE10p) ? function() {
      return function(n) {
         if (n && n.tagName != 'BODY') {
            (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
            if (n.parentNode && n.tagName == 'TD') {
               if (Ext.isIE7) {
                  n.parentNode.removeChild(n);
               } else {
                  n.parentNode.deleteCell(n);
               }
            } else if (n.parentNode && n.tagName == 'TR') {
               n.parentNode.deleteRow(n);
            } else {
               n.outerHTML = ' ';
            }
            delete Ext.elCache[n.id];
         }
      };
   }() : function(n) {
      if (n && n.parentNode && n.tagName != 'BODY') {
         (Ext.enableNestedListenerRemoval) ? Ext.EventManager.purgeElement(n, true) : Ext.EventManager.removeAll(n);
         n.parentNode.removeChild(n);
         delete Ext.elCache[n.id];
      }
   }
});

// override 3.4.1.1 to ensure that the grid stops editing if the view is refreshed
// actual bug: removing grid lines with active lookup editor didn't hide editor
(function() {
   var originalProcessRows = Ext.grid.GridView.prototype.processRows;
   Ext.override(Ext.grid.GridView, {
      processRows: function() {
         if (this.grid) this.grid.stopEditing(true);
         originalProcessRows.apply(this, arguments);
      }
   });
}());

// override 3.4.1.1 to fix issue with chart labels losing their labelRenderer after hide/show
Ext.override(Ext.chart.CartesianChart, {
   createAxis : function(axis, value) {
      var o = Ext.apply({}, value),
         ref,
         old;

      if (this[axis]) {
         old = this[axis].labelFunction;
         this.removeFnProxy(old);
         this.labelFn.remove(old);
      }
      if (o.labelRenderer) {
         ref = this.getFunctionRef(o.labelRenderer);
         o.labelFunction = this.createFnProxy(function(v) {
            return ref.fn.call(ref.scope, v);
         });
         // delete o.labelRenderer; // <-- commented out this line
         this.labelFn.push(o.labelFunction);
      }
      if (axis.indexOf('xAxis') > -1 && o.position == 'left') {
         o.position = 'bottom';
      }
      return o;
   }
});

// override 3.4.1.1 to allow tabbing between editable grid cells to work correctly
Ext.override(Ext.grid.RowSelectionModel, {
   acceptsNav : function(row, col, cm) {
      if (!cm.isHidden(col) && cm.isCellEditable(col, row)) {
         // check that there is actually an editor
         if (cm.getCellEditor) return !!cm.getCellEditor(col, row);
         return true;
      }
      return false;
   }
});

// override ExtJS 3.4.1.1 to make sure that in IE the HTMLEditor
// persists the cursor position across blur/focus events
Ext.override(Ext.form.HtmlEditor, {
   onEditorEvent: function() {
      if (Ext.isIE) {
         this.currentRange = this.getDoc().selection.createRange();
      }
      this.updateToolbar();
   },
   insertAtCursor: function(text) {
      if (!this.activated) return;
      if (Ext.isIE) {
         this.win.focus();
         var r = this.currentRange || this.getDoc().selection.createRange();
         if (r) {
            r.collapse(true);
            r.pasteHTML(text);
            this.syncValue();
            this.deferFocus();
            r.moveEnd('character', 0);
            r.moveStart('character', 0);
            r.select();
         }
      } else if (Ext.isGecko || Ext.isOpera|| Ext.isChrome) {
         this.win.focus();
         this.execCmd('InsertHTML', text);
         this.deferFocus();
      } else if (Ext.isWebKit) {
         this.execCmd('InsertText', text);
         this.deferFocus();
      }
   }
});

// override ExtJS 3.4.1.1 to avoid "string is undefined" or "object is undefined" or
// "cannot execute code from a freed script" errors in IE9 when using <iframe> tags
// in the html property.
// The real cause is explained here:
// http://stackoverflow.com/questions/5514973/javascript-code-in-iframes-in-ie9-not-working
if (Ext.isIE9) {
   Ext.Component.prototype.originalRender = Ext.Component.prototype.render;
   Ext.override(Ext.Component, {
      render : function(container, position){
         var hasIframe =
            ( this.html && Ext.isString(this.html) &&
              (this.html.toLowerCase().indexOf('iframe') >= 0) );
         if (hasIframe) {
            var originalHtml = this.html;
            delete this.html;
         }
         var result = Ext.Component.prototype.originalRender.apply(this, arguments);
         if (hasIframe) {
            var contentTarget = this.getContentTarget();
            contentTarget.update.defer(100, contentTarget, [Ext.DomHelper.markup(originalHtml)]);
         }
         return result;
      }
   });
};

// override ExtJS 3.4.1.1 to encode HTML according to ESAPI security guidelines:
// https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
Ext.apply(Ext.util.Format, {
   htmlEncode : function(value) {
      return !value ? value :
         String(value).replace(
            /&/g, "&amp;").replace(
            />/g, "&gt;").replace(
            /</g, "&lt;").replace(
            /"/g, "&quot;").replace(
            /'/g, "&#x27;").replace(
            /\//g, "&#x2F;");
   }
});

//added styleSheet to fix the incorrectly rendered grid columns in Chrome 19+ and other recent webkit browsers
//if this behaviour was changed in future versions of Chrome - the below code could be deleted
//This bug was the cause of the incorrectly aligned time headers in Reservation Calendar (WO 16696)
//
//Box-sizing was changed beginning with Chrome v19.  For background information, see:
//   http://code.google.com/p/chromium/issues/detail?id=124816
//   https://bugs.webkit.org/show_bug.cgi?id=78412
//   https://bugs.webkit.org/show_bug.cgi?id=87536
//   http://www.sencha.com/forum/showthread.php?198124-Grids-are-rendered-differently-in-upcoming-versions-of-Google-Chrome&p=886395&viewfull=1#post886395
//   http://www.useragentstring.com/pages/Chrome/
if (!Ext.isDefined(Ext.webKitVersion)) {
   Ext.webKitVersion = Ext.isWebKit ? parseFloat(/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)[1]) : NaN;
};
// chrome 19+ or safari 6+ (or any other recent webkit browser)
if(Ext.isWebKit && Ext.webKitVersion >= 535.2 && Ext.webKitVersion <= 537.1) {
   Ext.onReady(function(){
      Ext.util.CSS.createStyleSheet('.ext-chrome .x-grid3-cell, .ext-chrome .x-grid3-gcell{box-sizing: border-box !important;}', 'chrome-fixes-box-sizing');
   });
};

// make sure Ext.Component does not keep references to external components around
// (this.plugins, this.initialConfig
(function() {
   var originalDestroy = Ext.Component.prototype.destroy;
   Ext.override(Ext.Component, {
      destroy: function() {
         if (!this.isDestroyed) {
            originalDestroy.apply(this, arguments);
            this.plugins = this.initialConfig = null;
         };
      }
   });
})();

// make sure Ext.grid.GridView does not keep references to drag-and-drop components
// this.columnDrag, this.columnDrop, this.ds, ...
(function() {
   var originalDestroy = Ext.grid.GridView.prototype.destroy;
   Ext.override(Ext.grid.GridView, {
      destroy: function() {
         originalDestroy.apply(this, arguments);
         this.columnDrag = this.columnDrop = this.splitZone = this.hmenu = this.ds = null;
      }
   });
})();

// make sure Ext.PagingToolbar does not keep references to objects around
// this.dsLoaded
(function() {
   var originalDestroy = Ext.PagingToolbar.prototype.destroy;
   Ext.override(Ext.PagingToolbar, {
      destroy: function() {
         originalDestroy.apply(this, arguments);
         this.dsLoaded = null;
      }
   });
})();

// override 3.4.1.1 to avoid leaking memory in container layouts
(function() {
   var originalDestroy = Ext.layout.ContainerLayout.prototype.destroy;
   Ext.override(Ext.layout.ContainerLayout, {
      destroy: function() {
         originalDestroy.apply(this, arguments);
         this.resizeTask = null;
      }
   });
})();

// override 3.4.1.1 to make the "readOnly" attribute work correctly on a CheckBox
// (property had no effect on ability to check / uncheck)
(function() {
   var originalOnClick = Ext.form.Checkbox.prototype.onClick;
   Ext.override(Ext.form.Checkbox, {
      onClick: function() {
         if (!this.readOnly) {
            return originalOnClick.apply(this, arguments);
         } else {
            this.el.dom.checked = this.checked;
         };
         return this;
      }
   });
})();

// override 3.4.1.1 to make AnchorLayout not render scrollbars for anchor: 100% when
// zooming in firefox (ctrl-+)
(function() {
   var originalParseAnchor = Ext.layout.AnchorLayout.prototype.parseAnchor;
   Ext.override(Ext.layout.AnchorLayout, {
      parseAnchor : function(a, start, cstart) {
         var anchorFn = originalParseAnchor.apply(this, arguments);
         if (anchorFn && Ext.isGecko && (a.indexOf('100%') != -1)) {
            var isZoomed = window['matchMedia'] && window.matchMedia('(max--moz-device-pixel-ratio:0.99), (min--moz-device-pixel-ratio:1.01)').matches;
            if (isZoomed) {
               return function(v) {
                  var result = anchorFn.call(this, v);
                  result -= 2;
                  return result;
               };
            };
         };
         return anchorFn;
      }
   });
})();

// override 3.4.1.1 so RadioGroup.getValue() works before the RadioGroup is rendered
Ext.override(Ext.form.RadioGroup, {
   eachItem: function(fn, scope) {
      if (this.items && this.items.each){
         this.items.each(fn, scope || this);
      } else if (Ext.isArray(this.items)) {
         Ext.each(this.items, fn, scope || this);
      }
   }
});

// override 3.4.1.1 Ext.ButtonGroup onAfterLayout. Fix: header width, when header is longer than the body
Ext.override(Ext.ButtonGroup, {
   onAfterLayout : function() {
      var bodyWidth = this.body.getFrameWidth('lr') + this.body.dom.firstChild.offsetWidth;

      // begin apply fix
      if (this.header) {
         if (bodyWidth < this.body.getFrameWidth('lr') + this.header.dom.firstChild.offsetWidth) {
            bodyWidth = this.body.getFrameWidth('lr') + this.header.dom.offsetWidth;
         } 
      } // end fix apply
      
      this.body.setWidth(bodyWidth);
      this.el.setWidth(bodyWidth + this.getFrameWidth());
   }
});


// override 3.4.1.1 Ext.dd.DragDropMgr getZIndex. Fix: NPE on null parents
Ext.apply(Ext.dd.DragDropMgr, {
    getZIndex: function(element) {
        var body = document.body,
            z,
            zIndex = -1;

        element = Ext.getDom(element);
        while (element != null && element !== body) {
            if (!isNaN(z = Number(Ext.fly(element).getStyle('zIndex')))) {
                zIndex = z;
            }
            element = element.parentNode;
        }
        return zIndex;
    }
});