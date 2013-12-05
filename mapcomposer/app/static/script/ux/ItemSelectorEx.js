Ext.ns("Ext.ux.form");

Ext.ux.form.ItemSelectorEx = Ext.extend(Ext.form.Field,  {
    titleFrom: 'Available:',
    titleTo: 'Selected:',
    imagesDir: '.',       
    useFilter: true,
    filterWordStart: false,
    filterIgnoreCase: true,
    filterAnyMatch: true,
    width: 300,
    height: 200,
    defaultAutoCreate: { tag: 'div' },
    htmlEncode: true,
    valueField: 'value',
    displayField: 'text',
    separator: ',',
    itemSelector: 'dl',
    
    initComponent: function()
    {
        this.initToolbars();
        this.initStores();
                    
        if (!this.rowTpl)
            this.rowTpl = '<div>{'+this.displayField+(this.htmlEncode ? ':htmlEncode' : '')+'}</div>';
            
        this.cmp = new Ext.Container({
            layout: "vbox",
            cls: 'x-itemselectorex',
            layoutConfig: { align: 'stretch' },
            items: [
                {
                    height: 16,
                    xtype: 'container',
                    layout: "hbox",
                    layoutConfig: { align: 'stretch' },
                    items: [
                        {
                            flex: 0.5,
                            xtype: 'box',
                            cls: 'x-itemselectorex-title',
                            html: this.titleFrom
                        },{
                            width: 20,
                            xtype: 'box'
                        },{
                            flex: 0.5,
                            xtype: 'box',
                            cls: 'x-itemselectorex-title',
                            html: this.titleTo
                        }
                    ]
                },{
                    flex: 1,
                    xtype: 'container',
                    layout: "hbox",
                    layoutConfig: { align: 'stretch' },
                    items: [
                        {
                            flex: 0.5,
                            cls: 'x-itemselectorex-from',
                            xtype: 'panel',
                            border: false,
                            layout: 'fit',
                            tbar: this.tbarFrom,
                            items: {   
                                xtype: 'listview',
                                flex: 1,
                                ref: '../../lvFrom',
                                singleSelect: true,
                                emptyText: '<div class="x-itemselectorex-message">No available items</div>',
                                reserveScrollOffset: true,
                                hideHeaders: true,
                                columns: [{ width: 1, dataIndex: this.displayField, tpl: this.rowTpl }],
                                store: this.storeFrom,
                                listeners: {
                                    scope: this,
                                    dblclick: this.lvFromDblClickHandler
                                }
                            }                                 
                        },{
                            width: 20,
                            ref: 'tools',
                            cls: 'x-itemselectorex-tools',
                            xtype: 'box',
                            html: '<img src="'+this.imagesDir+'/right2.gif" class="x-itemselectorex-tool-icon x-itemselectorex-tool-add" qtip="Add"><br>'+
                                  '<img src="'+this.imagesDir+'/left2.gif" class="x-itemselectorex-tool-icon x-itemselectorex-tool-remove" qtip="Remove"><br>'+
                                  '<br>'+
                                  '<img src="'+this.imagesDir+'/right3.gif" class="x-itemselectorex-tool-icon x-itemselectorex-tool-addall" qtip="Add all"><br>'+
                                  '<img src="'+this.imagesDir+'/left3.gif" class="x-itemselectorex-tool-icon x-itemselectorex-tool-removeall" qtip="Remove all"><br>'
                        },{
                            flex: 0.5,
                            cls: 'x-itemselectorex-to',
                            xtype: 'panel',
                            border: false,
                            html: 'center',
                            layout: 'fit',
                            tbar: this.tbarTo,                            
                            items: {
                                xtype: 'listview',
                                flex: 1,
                                ref: '../../lvTo',
                                singleSelect: true,
                                emptyText: '<div class="x-itemselectorex-message">No selected items</div>',
                                reserveScrollOffset: true,
                                hideHeaders: true,
                                columns: [{ width: 1, dataIndex: this.displayField, tpl: this.rowTpl }],
                                store: this.storeTo,
                                listeners: {
                                    scope: this,
                                    dblclick: this.lvToDblClickHandler
                                }
                            }
                        }
                    ]
                }
            ]
        });
        
        this.storeReady = false;
        
        this.addEvents("change");
        
        Ext.ux.form.ItemSelectorEx.superclass.initComponent.call(this);
        
        if (this.storeFrom.autoCreated) 
            this.onStoreLoad();
        else
            this.cmp.lvFrom.store.on('load', this.onStoreLoad, this); 
    },
    
    onStoreLoad: function()
    {
        this.storeReady = true;
        this.onValueSetReady();
    },
    
    initToolbars: function()
    {
        this.tbarFrom = null;
        this.tbarTo = null;        
        if (this.useFilter)
        {
            this.tbarFrom = new Ext.ux.form.ItemSelectorEx.Filter({
                listeners: {
                    scope: this,
                    filter: this.applyFilter,
                    navigate: this.filterNavigate,
                    clear: this.clearFilter
                }
            });
            
            this.tbarTo = new Ext.ux.form.ItemSelectorEx.Filter({
                listeners: {
                    scope: this,
                    filter: this.applyFilter,
                    navigate: this.filterNavigate,
                    clear: this.clearFilter
                }
            });
        }
    },
    
    initStores: function()
    {
        if (this.store)
        {
            this.storeFrom = Ext.StoreMgr.lookup(this.store);
            if (this.storeFrom.autoCreated)
            {
                this.displayField = this.valueField = 'field1';
                if(!this.store.expandData){
                    this.displayField = 'field2';
                }
            }
        } else {
            this.storeFrom = new Ext.data.ArrayStore({
                idIndex: 0,
                data: [],
                fields: [this.valueField, this.displayField],
                autoDestroy: true
            });
        }
        this.storeTo = new Ext.data.ArrayStore({
            idIndex: 0,
            data: [],
            fields: [this.valueField, this.displayField],
            autoDestroy: true
        });
        this.storeFrom.sort(this.displayField, 'ASC');
        this.storeTo.sort(this.displayField, 'ASC');
    },
    
    onValueSetReady: function()
    {        
        if (this.value && this.storeReady && this.cmp.rendered)
        {            
            //console.log('onValueSetReady: '+this.value);
            this.setValue(this.value);
        }
    },
    
    onRender: function()
    {
        Ext.ux.form.ItemSelectorEx.superclass.onRender.apply(this, arguments);			
        
        var hiddenTag = {tag: "input", type: "hidden", value: this.value || "", name: this.name || Ext.id()};
        this.hiddenField = this.el.createChild(hiddenTag);
        
        this.cmp.on('render', this.onValueSetReady, this);
        
        this.on('render', function(){
            this.cmp.setWidth(this.getWidth());
            this.cmp.setHeight(this.getHeight());
            this.cmp.render(this.el);
            
            this.el.on("click", this.toolsClickHandler, this);
            this.on("resize", function(){
                this.cmp.setWidth(this.getWidth());
                this.cmp.setHeight(this.getHeight());
            }, this);     
            
            this.initDD();
        }, this);
    },	
    
    initDD: function()
    {
        this.ddGroup = 'dd-group-'+Ext.id();            
        this.initDragZone(this.cmp);
        this.initDropZone(this.cmp);
    },
    
    initDragZone: function(v, ddGroup)
    {
        var self = this;
        v.dragZone = new Ext.dd.DragZone(v.getEl(), {
            ddGroup: this.ddGroup,
            getDragData: function(e) 
            {
                var sourceEl = e.getTarget(self.itemSelector);
                if (sourceEl) 
                {
                    var sourceCtrl = Ext.getCmp(e.getTarget(".x-list-wrap").id);                        
                    var index = sourceCtrl.indexOf(sourceCtrl.findItemFromChild(sourceEl))
                
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    
                    return v.dragData = {
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        ddel: d,
                        sourceCtrl: sourceCtrl, 
                        index: index
                    }
                }
            },
            getRepairXY: function() {
                return this.dragData.repairXY;
            }
        });
    },

    initDropZone: function(v, ddGroup) 
    {
        var self = this;
        v.dropZone = new Ext.dd.DropZone(v.getEl(), {
            ddGroup: this.ddGroup,
            getTargetFromEvent: function(e) {
                return e.getTarget('.x-list-wrap');
            },
            onNodeEnter : function(target, dd, e, data){ 
                Ext.fly(target).addClass('x-itemselectorex-target-hover');
            },
            onNodeOut : function(target, dd, e, data){ 
                Ext.fly(target).removeClass('x-itemselectorex-target-hover');
            },
            onNodeOver : function(target, dd, e, data){
                var targetCtrl = Ext.getCmp(target.id);
                if (targetCtrl == data.sourceCtrl) return false;
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            onNodeDrop : function(target, dd, e, data){
                var targetCtrl = Ext.getCmp(target.id);
                if (targetCtrl != data.sourceCtrl)
                {
                    var direction = data.sourceCtrl == v.lvFrom;
                    self.moveItem(direction, data.index);
                }
                return true;
            }
        });
    },

    doLayout: function()
    {
        this.fireEvent('resize');
    },
    
    lvScrollTo: function(lv, el)
    {
        var container = lv.getEl().select('.x-list-body').item(0);
        if (Ext.isObject(el)) el = lv.getNode(el);
        if (el) Ext.fly(el).scrollIntoView(container, false);
    },
    
    filterFunc: function(rec, filter)
    {
        var value = rec.get(this.displayField);
        
        if (this.filterIgnoreCase) value = value.toLocaleUpperCase();
        if (this.filterIgnoreCase) filter = filter.toLocaleUpperCase();
        
        if (Ext.isEmpty(filter)) return true;
        
        if (this.filterAnyMatch && this.filterWordStart)
        {
            var re_opts = this.filterIgnoreCase ? 'i' : '';
            var re = new RegExp('(^|[\\s\\.!?;"\'\\(\\)\\[\\]\\{\\}])'+Ext.escapeRe(filter), re_opts);
            return re.test(value);
        }
        else if (this.filterAnyMatch)
        {
            var re_opts = this.filterIgnoreCase ? 'i' : '';
            var re = new RegExp(Ext.escapeRe(filter), re_opts);
            return re.test(value);
        }
        else
        {
            var re_opts = this.filterIgnoreCase ? 'i' : '';
            var re = new RegExp('^\s*'+Ext.escapeRe(filter), re_opts);
            return re.test(value);
        }
    },
    
    applyFilter: function(tbar, filter)
    {
        var store = tbar == this.tbarFrom ? this.cmp.lvFrom.store : this.cmp.lvTo.store;
        store.clearFilter();
        if (String(filter).trim() != "")
        {
            store.filterBy(function(rec, id){
                return this.filterFunc(rec, filter);	
            }, this);
        }
    },
    
    clearFilter: function(tbar)
    {
        var store = tbar == this.tbarFrom ? this.cmp.lvFrom.store : this.cmp.lvTo.store;
        store.clearFilter();
        tbar.focus(100);
    },
    
    filterNavigate: function(tbar, key)
    {
        var lv = tbar == this.tbarFrom ? this.cmp.lvFrom : this.cmp.lvTo;
        var indexes = lv.getSelectedIndexes();		
        var navkeys = [Ext.EventObject.DOWN, Ext.EventObject.PAGE_DOWN, Ext.EventObject.UP, Ext.EventObject.PAGE_UP];
        if (key == Ext.EventObject.ENTER)
        {
            Ext.iterate(indexes, function(idx){
                this.moveItem(lv == this.cmp.lvFrom ? 1 : 0, idx);
            }, this);
        } 
        else if (navkeys.indexOf(key) != -1)
        {
            if (key == Ext.EventObject.DOWN)
            {
                var index = indexes.length == 0 ? null : indexes[0];
                var new_index = (lv.store.getCount() - 1 == index || index == null) ? 0 : index + 1;
            }
            else if (key == Ext.EventObject.PAGE_DOWN)
            {
                var new_index = lv.store.getCount() > 0 ? lv.store.getCount() - 1 : null;					
            }
            else if (key == Ext.EventObject.UP)
            {
                var index = indexes.length == 0 ? null : indexes[0];
                var new_index = (index == 0 || index == null) ? lv.store.getCount() - 1 : index - 1;
            }
            else if (key == Ext.EventObject.PAGE_UP)
            {
                var new_index = lv.store.getCount() > 0 ? 0 : null;
            }
            lv.select(new_index);
            this.lvScrollTo(lv, lv.store.getAt(new_index));            
        }
        tbar.focus();
    },
    
    toolsClickHandler: function(e)
    {
        if (this.disabled) return;
        var el = e.getTarget('.x-itemselectorex-tool-icon', 2, 1);
        if (!el) return;
        if (el.hasClass('x-itemselectorex-tool-add'))
        {
            var indexes = this.cmp.lvFrom.getSelectedIndexes();
            Ext.iterate(indexes, function(index){
                this.moveItem(1, index);
            }, this);
        }
        else if (el.hasClass('x-itemselectorex-tool-remove'))
        {
            var indexes = this.cmp.lvTo.getSelectedIndexes();
            Ext.iterate(indexes, function(index){
                this.moveItem(0, index);
            }, this);
        }
        else if (el.hasClass('x-itemselectorex-tool-addall'))
        {
            var recs = this.cmp.lvFrom.store.getRange();
            Ext.iterate(recs, function(rec){
                this.moveItem(1, this.cmp.lvFrom.store.indexOf(rec));
            }, this);
        }
        else if (el.hasClass('x-itemselectorex-tool-removeall'))
        {
            this.setValue('');
        }
    },
    
    lvFromDblClickHandler: function(lv, index, node, e)
    {
        this.moveItem(1, index);
    },
    
    lvToDblClickHandler: function(lv, index, node, e)
    {
        this.moveItem(0, index);
    },
    
    moveItem: function(direction, index)
    {
        var lvSrc = direction ? this.cmp.lvFrom : this.cmp.lvTo;
        var lvDest = direction ? this.cmp.lvTo : this.cmp.lvFrom;            
        var rec = lvSrc.store.getAt(index);
        if (!rec) return;   
        lvDest.store.addSorted(rec);
        lvSrc.store.removeAt(index);
        this.applyValue();         
    },
    
    applyValue: function()
    {
        var data = this.cmp.lvTo.store.collect(this.valueField, false, true);	// not null, without filter
        var value = data.join(this.separator);
        this.hiddenField.dom.value = value;
        this.fireEvent("change", this, value);
    },
            
    getValue: function()
    {
        if (!this.rendered) return this.value;
        return this.hiddenField.dom.value;
    },
    
    setValue: function(value) 
    {   
        //console.log('setValue: '+value);
        if (this.cmp.rendered)
        {
            var ids = [];
            if (!Ext.isEmpty(value)) ids = value.split(',');
            this.cmp.lvTo.store.each(function(rec){
                this.moveItem(0, this.cmp.lvTo.store.indexOf(rec));
            }, this);				
            Ext.iterate(ids, function(id) {                    
                var find_re = new RegExp("^"+Ext.escapeRe(id)+"$", "i");
                var idx = this.cmp.lvFrom.store.find(this.valueField, find_re);
                if (idx != -1) this.moveItem(1, idx);
            }, this);
            this.hiddenField.dom.value = value;
        }
        this.value = value;	
    },
	
	initValue: function()
	{
		// no needed, value initialize via store<=>grid listeners
		// keep method here to override parent's method
    },
    
    loadData: function(data)
    {
        this.store.loadData(data);
    }
});

Ext.ux.form.ItemSelectorEx.Filter = Ext.extend(Ext.Toolbar,  {
    initComponent: function()
    {
        this.items = [
            'Filter:',
            {
                xtype: 'textfield',				
                enableKeyEvents: true,
                listeners: {
                    scope: this,
                    keyup: function(obj, e)
                    {						
                        if (obj.getValue() != obj.prev_value)
                            this.fireEvent('filter', this, obj.getValue());
                        obj.prev_value = obj.getValue();
                    },
                    keydown: function(obj, e)
                    {
                        if (Ext.isWebKit || Ext.isIE) 
                            this.fireEvent('navigate', this, e.getKey(), e);
                    },
                    keypress: function(obj, e)
                    {
                        this.fireEvent('navigate', this, e.getKey(), e);
                    }
                }
            },{
                text: 'Clear',
                scope: this,
                handler: function()
                {
                    this.clearValue();
                    this.fireEvent('clear', this);
                }
            }
        ];
        this.addEvents('navigate', 'filter', 'clear');
        Ext.ux.form.ItemSelectorEx.Filter.superclass.initComponent.call(this);
        this.on('resize', this.onResize);
    },
    
    onResize: function()
    {
        var inputWidth = this.getWidth() - (this.get(0).getWidth() + this.get(2).getWidth() + 5);
        this.get(1).setWidth(inputWidth);
    },
    
    clearValue: function()
    {
        this.get(1).setValue('');
    },
    
    focus: function(delay)
    {
        this.get(1).focus(delay);
    }
});

Ext.reg("itemselectorex", Ext.ux.form.ItemSelectorEx);

//backwards compat
Ext.ux.ItemSelectorEx = Ext.ux.form.ItemSelectorEx;
