
Ext.ux.PluploadSelectField = Ext.extend(Ext.ux.form.SuperBoxSelect, {
	
	emptyText : 'Seleccionar archivo',
	stackItems: true,
	
    onDestroy : function(){
    	this.success = null;
    	this.failed = null;
    	this.uploader = null;
    },
    
    initComponent: function() {

        this.store = new Ext.data.JsonStore({
            fields: [ 'id', 'loaded', 'name', 'size', 'percent', 'status', 'msg' ],
            root : 'data',
            listeners: {
                remove: this.onStoreRemove,
                scope: this
            }            
        });
    	
    	Ext.apply(this,{
    		mode : 'local',
    		triggerAction: 'all',
    		editable : false
    	});
        Ext.ux.PluploadSelectField.superclass.initComponent.apply(this, arguments);
        
        this.on('removeitem',this.onDeleteSelected,this);
     	this.on('beforequery',function(){return false},this);
        
		this.success = [];
        this.failed = [];
    },
    onRender: function() {
        Ext.ux.PluploadSelectField.superclass.onRender.apply(this, arguments);

        this.initialize_uploader();
    },
	onTriggerClick : function(){		
	},
    startUpload: function () {
        this.fireEvent('beforestart', this);
        if ( this.multipartParams ) {
            this.uploader.settings.multipart_params = this.multipartParams;
        }
        this.uploader.start();
    },
    initialize_uploader: function () {
        var runtimes = 'gears,browserplus,html5';
        if ( this.flash_swf_url ) {
            runtimes = "flash," + runtimes; 
        }
        if ( this.silverlight_xap_url ) {
            runtimes = "silverlight," + runtimes; 
        }
        
        this.uploader = new plupload.Uploader({
            url: this.url,
            runtimes: this.runtimes || runtimes,
            browse_button: this.buttonExpand.dom.id,
            //container: this.el.wrap.dom.id,
            max_file_size: this.max_file_size || '10mb',
            resize: this.resize || '',
            flash_swf_url: this.flash_swf_url || '',
            silverlight_xap_url: this.silverlight_xap_url || '',
            filters : this.filters || [],
            chunk_size: this.chunk_size,
            unique_names: this.unique_names,
            multipart: this.multipart,
            multipart_params: this.multipart_params,
            //drop_element: this.body.dom.id,
            required_features: this.required_features
        });
        
        Ext.each(['Init','FilesAdded', 'FilesRemoved', 'ChunkUploaded', 'FileUploaded', 'PostInit',
                  'QueueChanged', 'Refresh', 'StateChanged', 'UploadFile', 'UploadProgress', 'Error' ], 
                 function (v) { this.uploader.bind(v, eval("this." + v), this); }, this
                );
        this.uploader.init();
        
    },
    update_store: function (v) {
        if ( !v.msg ) { v.msg = ''; }
        var data = this.store.getById(v.id);
        if ( data ) {
            data.data = v;
            data.commit();
        }
        else {
        	var myStore = this.store;
        	var r = new myStore.recordType(v);
            this.store.add(r);
            r = null;
        }
    },    
    remove_file: function (id) {
        var fileObj = this.uploader.getFile( id );
        if ( fileObj ) {
            this.uploader.removeFile( fileObj );
        }
    },
    onDeleteSelected: function (sender,value,record) {
    	Ext.console.log('Eliminar item ',value);
    	this.remove_file( value );
    },    
    onStoreRemove: function (store, record, operation) {
    },    
    Init: function(uploader, data) {
    },
    ChunkUploaded: function() {
    },
    FilesAdded: function(uploader, files) {
    	var myStore = this.store;
    	var fileName = '';
    	this.fireEvent('filesadded',this,uploader, files);
        Ext.each(files, 
            function (v) {
            	if(v.status == 4){
            		fileName = String.format('{0} - {1}',v.msg,v.name);
            		this.addItemBox(v.id, fileName, fileName, this.classField, 'color: red;');
            	}
                else{
                	fileName = v.name;
                	this.addItemBox(v.id, fileName, fileName, this.classField, this.styleField);
                }
            }, this
        );                        
    },
    FilesRemoved: function(uploader, files) {
    },
    FileUploaded: function(uploader, file, o) {
    	Ext.console.log('response object: ',o);
    	
    	if(o.status==200)
    		this.success.push(file);
		else
			this.failed.push(file);
    		
    },
    PostInit: function() {

    },
    QueueChanged: function(uploader) {
    },
    Refresh: function(uploader) {
        Ext.each(uploader.files, 
            function (v) {
                this.update_store( v );
            }, this
        );
    },
    StateChanged: function(uploader) {
        if ( uploader.state == 2 ) {
            this.fireEvent('uploadstarted', this);
        }
        else {
            this.fireEvent('uploadcomplete', this, this.success, this.failed);
        }
    },
    UploadFile: function() {
    },
    UploadProgress: function(uploader, file) {
        if ( file.server_error ) {
            file.status = 4;
        }
        this.update_store( file );
    },
    Error: function (uploader, data) {
        data.file.status = 4;
        if ( data.code == -600 ) {
            data.file.msg = String.format( '<span style="color: red">{0}</span>', this.statusInvalidSizeText || 'Muy grande' );
        }
        else if ( data.code == -700 ) {
            data.file.msg = String.format( '<span style="color: red">{0}</span>', this.statusInvalidExtensionText || 'Tipo inválido' );
        }
        else {
            data.file.msg = String.format( '<span style="color: red">{2} ({0}: {1})</span>', data.code, data.details, data.message );
        }
        this.update_store( data.file );
    }
});

Ext.reg('pluploadfield', Ext.ux.PluploadSelectField);