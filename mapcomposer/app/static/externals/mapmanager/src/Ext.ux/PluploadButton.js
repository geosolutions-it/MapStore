

Ext.ux.PluploadButton = Ext.extend(Ext.Button, {
    constructor: function(config) {

        this.uploadpanel = new Ext.ux.PluploadPanel(config.upload_config);

        this.window = new Ext.Window({ 
            title: config.window_title || config.text || 'Upload files',
            width: config.window_width || 640, 
            height: config.window_height || 380, 
            layout: 'fit', 
            items: this.uploadpanel, 
            closeAction: 'hide',
            listeners: {
                hide: function (window) {
                    if ( this.clearOnClose ) {
                        this.uploadpanel.onDeleteAll();
                    }
                },
                scope: this
            }
        });

        this.handler = function () { 
            this.window.show(); 
            this.uploadpanel.doLayout();
        };
        
        Ext.ux.PluploadButton.superclass.constructor.apply(this, arguments);
    }
});
Ext.reg('pluploadbutton', Ext.ux.PluploadButton);