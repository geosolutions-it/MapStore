/**
 * @class Ext.ux.ExtendedHtmlEditor
 * @extends Ext.form.HtmlEditor
 * Add an image picker to the html editor based on opensdi-manager2
 * @constructor
 * Create a new ExtendedHtmlEditor
 * @param {Object} config
 * @xtype extendedhtmleditor
 */
Ext.ns('Ext.ux');

Ext.ux.ExtendedHtmlEditor = Ext.extend(Ext.form.HtmlEditor, {

    // i18n
    pickImageText: "Image picker",

    // URL to the extJSbrowser of OpenSDI-Manager2
    actionURL: "/opensdi2-manager/fileManager/extJSbrowser",

    /**
     * @cfg {Boolean} enableImagePicker Enable image picker button
     */
    enableImagePicker : true,

    /** api: config[mediaContent]
     *  ``String`` relative for the media content in the upload panel
     */
    mediaContent: null,

    /*
     * Protected method that will not generally be called directly. It
     * is called when the editor creates its toolbar. Override this method if you need to
     * add custom toolbar buttons.
     * @param {HtmlEditor} editor
     */
    createToolbar : function(editor){
        // Apply extended buttons
        Ext.apply(this.buttonTips, this.extendedButtonTips);

        var items = [];
        var tipsEnabled = Ext.QuickTips && Ext.QuickTips.isEnabled();


        function btn(id, toggle, handler){
            return {
                itemId : id,
                cls : 'x-btn-icon',
                iconCls: 'x-edit-'+id,
                enableToggle:toggle !== false,
                scope: editor,
                handler:handler||editor.relayBtnCmd,
                clickEvent:'mousedown',
                tooltip: tipsEnabled ? editor.buttonTips[id] || undefined : undefined,
                overflowText: editor.buttonTips[id].title || undefined,
                tabIndex:-1
            };
        }


        if(this.enableFont && !Ext.isSafari2){
            var fontSelectItem = new Ext.Toolbar.Item({
               autoEl: {
                    tag:'select',
                    cls:'x-font-select',
                    html: this.createFontOptions()
               }
            });

            items.push(
                fontSelectItem,
                '-'
            );
        }

        if(this.enableFormat){
            items.push(
                btn('bold'),
                btn('italic'),
                btn('underline')
            );
        }

        if(this.enableFontSize){
            items.push(
                '-',
                btn('increasefontsize', false, this.adjustFont),
                btn('decreasefontsize', false, this.adjustFont)
            );
        }

        if(this.enableColors){
            items.push(
                '-', {
                    itemId:'forecolor',
                    cls:'x-btn-icon',
                    iconCls: 'x-edit-forecolor',
                    clickEvent:'mousedown',
                    tooltip: tipsEnabled ? editor.buttonTips.forecolor || undefined : undefined,
                    tabIndex:-1,
                    menu : new Ext.menu.ColorMenu({
                        allowReselect: true,
                        focus: Ext.emptyFn,
                        value:'000000',
                        plain:true,
                        listeners: {
                            scope: this,
                            select: function(cp, color){
                                this.execCmd('forecolor', Ext.isWebKit || Ext.isIE ? '#'+color : color);
                                this.deferFocus();
                            }
                        },
                        clickEvent:'mousedown'
                    })
                }, {
                    itemId:'backcolor',
                    cls:'x-btn-icon',
                    iconCls: 'x-edit-backcolor',
                    clickEvent:'mousedown',
                    tooltip: tipsEnabled ? editor.buttonTips.backcolor || undefined : undefined,
                    tabIndex:-1,
                    menu : new Ext.menu.ColorMenu({
                        focus: Ext.emptyFn,
                        value:'FFFFFF',
                        plain:true,
                        allowReselect: true,
                        listeners: {
                            scope: this,
                            select: function(cp, color){
                                if(Ext.isGecko){
                                    this.execCmd('useCSS', false);
                                    this.execCmd('hilitecolor', color);
                                    this.execCmd('useCSS', true);
                                    this.deferFocus();
                                }else{
                                    this.execCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isWebKit || Ext.isIE ? '#'+color : color);
                                    this.deferFocus();
                                }
                            }
                        },
                        clickEvent:'mousedown'
                    })
                }
            );
        }

        if(this.enableAlignments){
            items.push(
                '-',
                btn('justifyleft'),
                btn('justifycenter'),
                btn('justifyright')
            );
        }

        if(!Ext.isSafari2){
            if(this.enableLinks){
                items.push(
                    '-',
                    btn('createlink', false, this.createLink)
                );
            }
            // image picker
            if(this.enableImagePicker){
                items.push(
                    btn('imagePicker', false, this.imagePicker)
                );
            }

            if(this.enableLists){
                items.push(
                    '-',
                    btn('insertorderedlist'),
                    btn('insertunorderedlist')
                );
            }
            if(this.enableSourceEdit){
                items.push(
                    '-',
                    btn('sourceedit', true, function(btn){
                        this.toggleSourceEdit(!this.sourceEditMode);
                    })
                );
            }
        }

        // build the toolbar
        var tb = new Ext.Toolbar({
            renderTo: this.wrap.dom.firstChild,
            items: items
        });

        if (fontSelectItem) {
            this.fontSelect = fontSelectItem.el;

            this.mon(this.fontSelect, 'change', function(){
                var font = this.fontSelect.dom.value;
                this.relayCmd('fontname', font);
                this.deferFocus();
            }, this);
        }

        // stop form submits
        this.mon(tb.el, 'click', function(e){
            e.preventDefault();
        });

        this.tb = tb;
        this.tb.doLayout();
    },

    /*
     * Create a image picker window
     */
    imagePicker: function(){
        var self = this;
        var section = this.section;
        
        // create an image picker form                
        var form = new Ext.ux.ImagePicker({
            actionURL: self.actionURL,
            mediaContent: this.mediaContent
        });
        
        // open a modal window
        var win = new Ext.Window({
            closable:true,
            title: self.pickImageText,
            border:false,
            modal: true, 
            bodyBorder: false,
            resizable: false,
            width: 500,
            items: [ form ]
        });     
        
        // Insert button has been clicked, append the image to the section
        form.on("picked", function addImageURL(image){
            // append image
            var img = "<img src=\"" + image.url + "\" title=\"" + image.name + "\" />";
            self.setValue(self.getValue() + img);

            // destroy the window
            win.destroy();
        }, this);

        // action canceled, only close window
        form.on("cancel", function closeWindow(){
            // destroy the window
            win.destroy();
        }, this);

        // show window
        win.show();
    },

    /**
     * Object collection of toolbar tooltips for the buttons in the editor. The key
     * is the command id associated with that button and the value is a valid QuickTips object.
     * For example:
<pre><code>
{
    bold : {
        title: 'Bold (Ctrl+B)',
        text: 'Make the selected text bold.',
        cls: 'x-html-editor-tip'
    },
    italic : {
        title: 'Italic (Ctrl+I)',
        text: 'Make the selected text italic.',
        cls: 'x-html-editor-tip'
    },
    ...
</code></pre>
    * @type Object
     */
    extendedButtonTips : {
        imagePicker : {
            title: 'Image Picker',
            text: 'Select a image from the image carousel',
            cls: 'x-html-editor-tip'
        }
    }
});
Ext.reg('extendedhtmleditor', Ext.ux.ExtendedHtmlEditor);