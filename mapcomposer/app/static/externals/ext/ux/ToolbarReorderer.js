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
/**
 * @class Ext.ux.ToolbarReorderer
 * @extends Ext.ux.Reorderer
 * Plugin which can be attached to any Ext.Toolbar instance. Provides ability to reorder toolbar items
 * with drag and drop. Example:
 * <pre>
 * new Ext.Toolbar({
 *     plugins: [
 *         new Ext.ux.ToolbarReorderer({
 *             defaultReorderable: true
 *         })
 *     ],
 *     items: [
 *       {text: 'Button 1', reorderable: false},
 *       {text: 'Button 2'},
 *       {text: 'Button 3'}
 *     ]
 * });
 * </pre>
 * In the example above, buttons 2 and 3 will be reorderable via drag and drop. An event named 'reordered'
 * is added to the Toolbar, and is fired whenever a reorder has been completed.
 */
Ext.ux.ToolbarReorderer = Ext.extend(Ext.ux.Reorderer, {
    /**
     * Initializes the plugin, decorates the toolbar with additional functionality
     */
    init: function(toolbar) {
        /**
         * This is used to store the correct x value of each button in the array. We need to use this
         * instead of the button's reported x co-ordinate because the buttons are animated when they move -
         * if another onDrag is fired while the button is still moving, the comparison x value will be incorrect
         */
        this.buttonXCache = {};
        
        toolbar.on({
            scope: this,
            add  : function(toolbar, item) {
                this.createIfReorderable(item);
            }
        });
        
        this.movedTask = new Ext.util.DelayedTask(this.finishMove, this);
        
        //super sets a reference to the toolbar in this.target
        Ext.ux.ToolbarReorderer.superclass.init.apply(this, arguments);
    },
        
    /**
     * Sets up the given Toolbar item as a draggable
     * @param {Mixed} button The item to make draggable (usually an Ext.Button instance)
     */
    createItemDD: function(button) {
        if (button.dd != undefined) {
            return;
        }
        
        var el   = button.getEl(),
            id   = el.id,
            tbar = this.target,
            me   = this;
        
        button.dd = new Ext.dd.DD(el, undefined, {
            isTarget: false
        });
        
        //if a button has a menu, it is disabled while dragging with this function
        var menuDisabler = function() {
            return false;
        };
        
        Ext.apply(button.dd, {
            b4StartDrag: function() {       
                this.startPosition = el.getXY();
                
                //bump up the z index of the button being dragged but keep a reference to the original
                this.startZIndex = el.getStyle('zIndex');
                el.setStyle('zIndex', 10000);
                
                button.suspendEvents();
                if (button.menu) {
                    button.menu.on('beforeshow', menuDisabler, me);
                }
            },
            
            startDrag: function() {
                this.constrainTo(tbar.getEl());
                this.setYConstraint(0, 0, 0);
            },
            
            onDrag: function(e) {
                //calculate the button's index within the toolbar and its current midpoint
                var buttonX  = el.getXY()[0],
                    deltaX   = buttonX - this.startPosition[0],
                    items    = tbar.items.items,
                    oldIndex = items.indexOf(button),
                    newIndex;
                
                //find which item in the toolbar the midpoint is currently over
                for (var index = 0; index < items.length; index++) {
                    var item = items[index];
                    
                    if (item.reorderable && item.id != button.id) {
                        //find the midpoint of the button
                        var box        = item.getEl().getBox(),
                            midpoint   = (me.buttonXCache[item.id] || box.x) + (box.width / 2),
                            movedLeft  = oldIndex > index && deltaX < 0 && buttonX < midpoint,
                            movedRight = oldIndex < index && deltaX > 0 && (buttonX + el.getWidth()) > midpoint;
                        
                        if (movedLeft || movedRight) {
                            me[movedLeft ? 'onMovedLeft' : 'onMovedRight'](button, index, oldIndex);
                            break;
                        }
                    }
                }
            },

            /**
             * After the drag has been completed, make sure the button being dragged makes it back to
             * the correct location and resets its z index
             */
            endDrag: function() {
                //we need to update the cache here for cases where the button was dragged but its
                //position in the toolbar did not change
                me.updateButtonXCache();

                el.moveTo(me.buttonXCache[button.id], el.getY(), {
                    duration: me.animationDuration,
                    scope   : this,
                    callback: function() {
                        me.movedTask.delay(200);
                        button.resumeEvents();
                        if (button.menu) {
                            button.menu.un('beforeshow', menuDisabler, me);
                        }

                        tbar.fireEvent('reordered', button, tbar);
                    }
                });

                el.setStyle('zIndex', this.startZIndex);
            }
        });
    },

    onMovedLeft: function(item, newIndex, oldIndex) {
        var tbar  = this.target,
            items = tbar.items.items;

        this.movedTask.cancel();
        if (newIndex != undefined && newIndex != oldIndex) {
            //move the button currently under drag to its new location
            tbar.remove(item, false);
            tbar.insert(newIndex, item);

            //set the correct x location of each item in the toolbar
            this.updateButtonXCache();
            for (var index = 0; index < items.length; index++) {
                var obj  = items[index],
                    newX = this.buttonXCache[obj.id];

                if (item == obj) {
                    item.dd.startPosition[0] = newX;
                } else {
                    var el = obj.getEl();

                    el.moveTo(newX, el.getY(), {
                        duration: this.animationDuration
                    });
                }
            }
        }
    },

    onMovedRight: function(item, newIndex, oldIndex) {
        this.onMovedLeft.apply(this, arguments);
    },

    finishMove: function(){
        var tbar = this.target;
        tbar.items.each(function(btn){
            btn.el.dom.style.left = '';
        });
        tbar.doLayout();
    },

    /**
     * @private
     * Updates the internal cache of button X locations. 
     */
    updateButtonXCache: function() {
        var tbar   = this.target,
            items  = tbar.items,
            totalX = tbar.getEl().getBox(true).x;
            
        items.each(function(item) {
            this.buttonXCache[item.id] = totalX;

            totalX += item.getEl().getWidth();
        }, this);
    }
});