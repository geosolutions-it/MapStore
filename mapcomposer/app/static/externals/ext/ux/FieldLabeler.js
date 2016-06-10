/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25
*/
Ext.ns("Ext.ux");

/**
 * @class Ext.ux.FieldLabeler
 * <p>A plugin for Field Components which renders standard Ext form wrapping and labels
 * round the Field at render time regardless of the layout of the Container.</p>
 * <p>Usage:</p>
 * <pre><code>
    {
        xtype: 'combo',
        plugins: [ Ext.ux.FieldLabeler ],
        triggerAction: 'all',
        fieldLabel: 'Select type',
        store: typeStore
    }
 * </code></pre>
 */
Ext.ux.FieldLabeler = (function(){

//  Pulls a named property down from the first ancestor Container it's found in
    function getParentProperty(propName) {
        for (var p = this.ownerCt; p; p = p.ownerCt) {
            if (p[propName]) {
                return p[propName];
            }
        }
    }

    return {

//      Add behaviour at important points in the Field's lifecycle.
        init: function(f) {
//          Replace the Field's onRender method with a sequence that calls the plugin's onRender after the Field's onRender
            f.onRender = f.onRender.createSequence(this.onRender);

//          We need to completely override the onResize method because of the complexity
            f.onResize = this.onResize;

//          Replace the Field's onDestroy method with a sequence that calls the plugin's onDestroy after the Field's onRender
            f.onDestroy = f.onDestroy.createSequence(this.onDestroy);
        },

        onRender: function() {
//          Do nothing if being rendered by a form layout
            if (this.ownerCt) {
                if (this.ownerCt.layout instanceof Ext.layout.FormLayout) {
                    return;
                }
            }

            this.resizeEl = (this.wrap || this.el).wrap({
                cls: 'x-form-element',
                style: (Ext.isIE || Ext.isOpera) ? 'position:absolute;top:0;left:0;overflow:visible' : ''
            });
            this.positionEl = this.itemCt = this.resizeEl.wrap({
                cls: 'x-form-item '
            });
            if (this.nextSibling()) {
                this.margins = {
                    top: 0,
                    right: 0,
                    bottom: this.positionEl.getMargins('b'),
                    left: 0
                };
            }
            this.actionMode = 'itemCt';

//          If our Container is hiding labels, then we're done!
            if (!Ext.isDefined(this.hideLabels)) {
                this.hideLabels = getParentProperty.call(this, "hideLabels");
            }
            if (this.hideLabels) {
                this.resizeEl.setStyle('padding-left', '0px');
                return;
            }

//          Collect the info we need to render the label from our Container.
            if (!Ext.isDefined(this.labelSeparator)) {
                this.labelSeparator = getParentProperty.call(this, "labelSeparator");
            }
            if (!Ext.isDefined(this.labelPad)) {
                this.labelPad = getParentProperty.call(this, "labelPad");
            }
            if (!Ext.isDefined(this.labelAlign)) {
                this.labelAlign = getParentProperty.call(this, "labelAlign") || 'left';
            }
            this.itemCt.addClass('x-form-label-' + this.labelAlign);

            if(this.labelAlign == 'top'){
                if (!this.labelWidth) {
                    this.labelWidth = 'auto';
                }
                this.resizeEl.setStyle('padding-left', '0px');
            } else {
                if (!Ext.isDefined(this.labelWidth)) {
                    this.labelWidth = getParentProperty.call(this, "labelWidth") || 100;
                }
                this.resizeEl.setStyle('padding-left', (this.labelWidth + (this.labelPad || 5)) + 'px');
                this.labelWidth += 'px';
            }

            this.label = this.itemCt.insertFirst({
                tag: 'label',
                cls: 'x-form-item-label',
                style: {
                    width: this.labelWidth
                },
                html: this.fieldLabel + (this.labelSeparator || ':')
            });
        },

//      private
//      Ensure the input field is sized to fit in the content area of the resizeEl (to the right of its padding-left)
//      We perform all necessary sizing here. We do NOT call the current class's onResize because we need this control
//      we skip that and go up the hierarchy to Ext.form.Field
        onResize: function(w, h) {
            Ext.form.Field.prototype.onResize.apply(this, arguments);
            w -= this.resizeEl.getPadding('l');
            if (this.getTriggerWidth) {
                this.wrap.setWidth(w);
                this.el.setWidth(w - this.getTriggerWidth());
            } else {
                this.el.setWidth(w);
            }
            if (this.el.dom.tagName.toLowerCase() == 'textarea') {
                var h = this.resizeEl.getHeight(true);
                if (!this.hideLabels && (this.labelAlign == 'top')) {
                    h -= this.label.getHeight();
                }
                this.el.setHeight(h);
            }
        },

//      private
//      Ensure that we clean up on destroy.
        onDestroy: function() {
            this.itemCt.remove();
        }
    };
})();