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
// We are adding these custom layouts to a namespace that does not
// exist by default in Ext, so we have to add the namespace first:
Ext.ns('Ext.ux.layout');

/**
 * @class Ext.ux.layout.RowLayout
 * @extends Ext.layout.ContainerLayout
 * <p>This is the layout style of choice for creating structural layouts in a multi-row format where the height of
 * each row can be specified as a percentage or fixed height.  Row widths can also be fixed, percentage or auto.
 * This class is intended to be extended or created via the layout:'ux.row' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.</p>
 * <p>RowLayout does not have any direct config options (other than inherited ones), but it does support a
 * specific config property of <b><tt>rowHeight</tt></b> that can be included in the config of any panel added to it.  The
 * layout will use the rowHeight (if present) or height of each panel during layout to determine how to size each panel.
 * If height or rowHeight is not specified for a given panel, its height will default to the panel's height (or auto).</p>
 * <p>The height property is always evaluated as pixels, and must be a number greater than or equal to 1.
 * The rowHeight property is always evaluated as a percentage, and must be a decimal value greater than 0 and
 * less than 1 (e.g., .25).</p>
 * <p>The basic rules for specifying row heights are pretty simple.  The logic makes two passes through the
 * set of contained panels.  During the first layout pass, all panels that either have a fixed height or none
 * specified (auto) are skipped, but their heights are subtracted from the overall container height.  During the second
 * pass, all panels with rowHeights are assigned pixel heights in proportion to their percentages based on
 * the total <b>remaining</b> container height.  In other words, percentage height panels are designed to fill the space
 * left over by all the fixed-height and/or auto-height panels.  Because of this, while you can specify any number of rows
 * with different percentages, the rowHeights must always add up to 1 (or 100%) when added together, otherwise your
 * layout may not render as expected.  Example usage:</p>
 * <pre><code>
// All rows are percentages -- they must add up to 1
var p = new Ext.Panel({
    title: 'Row Layout - Percentage Only',
    layout:'ux.row',
    items: [{
        title: 'Row 1',
        rowHeight: .25
    },{
        title: 'Row 2',
        rowHeight: .6
    },{
        title: 'Row 3',
        rowHeight: .15
    }]
});

// Mix of height and rowHeight -- all rowHeight values must add
// up to 1. The first row will take up exactly 120px, and the last two
// rows will fill the remaining container height.
var p = new Ext.Panel({
    title: 'Row Layout - Mixed',
    layout:'ux.row',
    items: [{
        title: 'Row 1',
        height: 120,
        // standard panel widths are still supported too:
        width: '50%' // or 200
    },{
        title: 'Row 2',
        rowHeight: .8,
        width: 300
    },{
        title: 'Row 3',
        rowHeight: .2
    }]
});
</code></pre>
 */
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,

    type: 'row',

    // private
    allowContainerRemove: false,

    // private
    isValidParent : function(c, target){
        return this.innerCt && c.getPositionEl().dom.parentNode == this.innerCt.dom;
    },

    getLayoutTargetSize : function() {
        var target = this.container.getLayoutTarget(), ret;
        if (target) {
            ret = target.getViewSize();

            // IE in strict mode will return a height of 0 on the 1st pass of getViewSize.
            // Use getStyleSize to verify the 0 height, the adjustment pass will then work properly
            // with getViewSize
            if (Ext.isIE && Ext.isStrict && ret.height == 0){
                ret =  target.getStyleSize();
            }

            ret.width -= target.getPadding('lr');
            ret.height -= target.getPadding('tb');
        }
        return ret;
    },

    renderAll : function(ct, target) {
        if(!this.innerCt){
            // the innerCt prevents wrapping and shuffling while
            // the container is resizing
            this.innerCt = target.createChild({cls:'x-column-inner'});
            this.innerCt.createChild({cls:'x-clear'});
        }
        Ext.layout.ColumnLayout.superclass.renderAll.call(this, ct, this.innerCt);
    },

    // private
    onLayout : function(ct, target){
        var rs = ct.items.items,
            len = rs.length,
            r,
            m,
            i,
            margins = [];

        this.renderAll(ct, target);

        var size = this.getLayoutTargetSize();

        if(size.width < 1 && size.height < 1){ // display none?
            return;
        }

        var h = size.height,
            ph = h;

        this.innerCt.setSize({height:h});

        // some rows can be percentages while others are fixed
        // so we need to make 2 passes

        for(i = 0; i < len; i++){
            r = rs[i];
            m = r.getPositionEl().getMargins('tb');
            margins[i] = m;
            if(!r.rowHeight){
                ph -= (r.getHeight() + m);
            }
        }

        ph = ph < 0 ? 0 : ph;

        for(i = 0; i < len; i++){
            r = rs[i];
            m = margins[i];
            if(r.rowHeight){
                r.setSize({height: Math.floor(r.rowHeight*ph) - m});
            }
        }

        // Browsers differ as to when they account for scrollbars.  We need to re-measure to see if the scrollbar
        // spaces were accounted for properly.  If not, re-layout.
        if (Ext.isIE) {
            if (i = target.getStyle('overflow') && i != 'hidden' && !this.adjustmentPass) {
                var ts = this.getLayoutTargetSize();
                if (ts.width != size.width){
                    this.adjustmentPass = true;
                    this.onLayout(ct, target);
                }
            }
        }
        delete this.adjustmentPass;
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
