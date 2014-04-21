/*
** Ext.ux.upload.Uploader.js for Ext.ux.uploader
**
** Made by Gary van Woerkens
** Contact <gary@chewam.com>
**
** Started on  Wed May 26 17:45:41 2010 Gary van Woerkens
** Last update Mon Jun 21 13:25:01 2010 Gary van Woerkens
*/

Ext.ns('Ext.ux.upload');

/**
 * @class Ext.ux.upload.Uploader
 * @extends Ext.util.Observable
 * Ext.ux.upload.Uploader is a class to upload files from the web interface to the server.<br/>
 * This class uses both swfupload and native browser upload system. Browser upload is triggered by native browser file drop event.<br/>
 * Any instance of this class can set to components plugins list to make this component an upload zone or a swfupload trigger as well.
 * <pre><code>
var uploader = new Ext.ux.upload.Uploader({
    url:"/var/www/my/upload/folder/"
});

var button = new Ext.Button({
   text:"swfupload trigger"
   ,plugins:[uploader]
});

button.render(Ext.getBody());

var panel = new Ext.Panel({
    title:"upload drop zone"
    ,width:300
    ,height:200
    ,plugins:[uploader]
});

panel.render(Ext.getBody());
 * </code></pre>
 * @author Gary van Woerkens
 * @version 1.0
 */

/**
 * Create a new Uploader
 * @constructor
 * @param {Object} config The config object
 */
Ext.ux.upload.Uploader = function(config) {

  Ext.apply(this, config);

  this.connections = [];
  this.queue = 0;

  this.swfParams = config.swfParams || {};
  Ext.apply(this.swfParams, {
    url:this.url
    ,swfUrl:this.swfUrl
    ,allowedFileTypes:this.allowedFileTypes
    ,maxFileSize:this.maxFileSize
    ,maxFiles:this.maxFiles
  });

  this.html5Params = config.html5Params || {};
  Ext.applyIf(this.html5Params, {
    url:this.url
    ,allowedFileTypes:this.allowedFileTypes
    ,maxFileSize:this.maxFileSize
    ,maxFiles:this.maxFiles
  });

//  if (this.enableLogPanel) this.createLogPanel();

  this.addEvents(
    /**
     * @event beforeupload Fires just before files upload. Return false to cancel upload.
     * @param {Ext.ux.upload.SwfConnector} this
     * @param {Number} selectedFilesCount
     */
    "beforeupload"
    /**
     * @event uploadstart
     * @param {Ext.ux.upload.Uploader} this
     * @param {Object} conn The upload connector
     * @param {Object} file The uploaded file
     */
    ,"uploadstart"
    /**
     * @event uploadcomplete Fires when a file has been uploaded.
     * @param {Ext.ux.upload.Uploader} this
     * @param {Object} conn The upload connector
     * @param {Object} file The uploaded file
     */
    ,"uploadcomplete"
    /**
     * @event queuecomplete
     * @param {Ext.ux.upload.Uploader} this
     * @param {Object} conn The upload connector
     * @param {Object} file The uploaded file
     */
    ,"queuecomplete"
  );

  Ext.ux.upload.Uploader.superclass.constructor.call(this);

};


Ext.extend(Ext.ux.upload.Uploader, Ext.util.Observable, {

//  dialogEl:null
  /**
   * @cfg String url
   * The URL where files will be uploaded. Starts from www document root.
   */
  url:""
  /**
   * @cfg Boolean debug
   * Enable debug (SWFupload)
   */
  ,debug:false
  /**
   * @cfg String swfUrl
   * The URL form which to request swfupload object.
   */
  ,swfUrl:""
  /**
   * @cfg Number maxFiles
   * Maximum number of files to upload in a row.
   */
  ,maxFiles:5
  /**
   * @cfg Number maxFileSize
   * Maximum size of a file to upload.
   */
  ,maxFileSize:1024 // KB
  /**
   * @cfg String allowedFileTypes
   * all types of file that can be uploaded
   * (e.g., "*.png;*.jpg;*.gif").<br/>
   * To allow all types of file to be uploaded use "*.*".
   */
  ,allowedFileTypes:"*.*"
  /**
   * @cfg Object swfParams
   * To specify a specific config for SWFUpload.
   */
  ,swfParams:null
  /**
   * @cfg Object html5Params
   * To specify a specific config Html5 upload.
   */
  ,html5Params:null
  /**
   * @cfg Boolean enableLogPanel
   * True to display upload logs panel.
   */
  ,enableLogPanel:true
  /**
   *
   * @cfg path
   */
   ,path:""

  /**
   * An array of opened connections.
   * @type {Array}
   * @property connections
   */
  /**
   * An array of files.
   * @type {Array}
   * @property queue
   */

  ,init:function(cmp) {
    var triggers = ["button", "menuitem"];
    var dropZones = [
      "dataview", "panel"
      ,"imagebrowser", "toolbartabpanel"
      ,"grid"
    ];
    var getUploader = function() {
      return this;
    };
    var isTrigger = function(xtype) {
      return triggers.indexOf(xtype) > -1;
    };
    var isDropZone = function(xtype) {
      return dropZones.indexOf(xtype) > -1;
    };
    cmp.getUploader = getUploader.createDelegate(this);
    cmp.relayEvents(this, ["queuecomplete", "beforeupload", "dragstart", "dragstop"]);
    var xtype = cmp.getXType();
    if (isTrigger(xtype) !== false) {
      cmp.on({
	scope:this
	,afterrender:this.setTrigger
      });
    } else if (isDropZone(xtype) !== false) {
      cmp.on({
	scope:this
	,render:this.setDropZone
      });
    }
  }

  /**
   * Initializes an upload drop zone for a component<br/>
   * The component has to be in the dropzone list (dataview).
   * @param {Ext.Component} cmp The component to bind the dropzone to.
   */
  ,setDropZone:function(cmp) {
    if (cmp.uploadLogPanelTarget === true)
      this.dialogEl = cmp.getEl();
    var el = cmp.getXType() == "grid" ? cmp.view.scroller : cmp.body;
    var config = {
      el:el
        ,path:this.path
      ,listeners:{
	scope:this
	,beforeupload:this.onBeforeUpload
	,start:this.onUploadStart
	,progress:this.onUploadProgress
	,complete:this.onUploadComplete
	,error:this.onUploadError
      }
    };
    Ext.apply(config, this.html5Params);
    cmp.conn = new Ext.ux.upload.Html5Connector(config);
    this.connections.push(cmp.conn);
  }

  /**
   * Initializes a swfupload button over a component.<br/>
   * The component has to be in the trigger list (button, menu item).
   * @param {Ext.Component} cmp The component to bind the trigger to.
   */
  ,setTrigger:function(cmp) {
    var pos = cmp.getEl().getXY();
    var config, body,
    btn = cmp.getEl().child("td.x-btn-mc") || cmp.getEl(),
    el = btn.insertHtml("beforeEnd",
      '<div id="'+Ext.id()+'">'
      + '<div id="'+Ext.id()+'" style="position:absolute;cursor:pointer;top:'+pos[1]+';left:'+pos[0]+'">'
      + '<div id="'+Ext.id()+'"></div>'
      + '</div>'
      + '</div>'
    , true);
    el = el.first();
    body = el.first();
    config = {
      el:el
      ,body:body
      ,debug:this.debug
      ,path:this.path
      ,listeners:{
        scope:this
        ,load:this.resizeTrigger.createDelegate(cmp)
        ,beforeupload:this.onBeforeUpload
        ,start:this.onUploadStart
        ,progress:this.onUploadProgress
        ,complete:this.onUploadComplete
        ,error:this.onUploadError
      }
    };
    Ext.apply(config, this.swfParams);
    cmp.conn = new Ext.ux.upload.SwfConnector(config);
    this.connections.push(cmp.conn);
    cmp.on({
        resize:this.resizeTrigger
    });
  }

  /**
   * Handles the trigger resize event to place the swfupload button over it.<br/>
   * Scope is on trigger component.
   */
  ,resizeTrigger:function() {
    if (this.rendered) {
        var box = this.el.getBox();
        this.conn.el.setBox(box);
        if (this.conn.loaded) {
	        this.conn.swf.setButtonDimensions(box.width, box.height);
        }
    }
  }

  /**
   *
   */
  ,setLogFrame:function(frame) {
    var panel = this.getLogPanel();
    frame.add(panel);
    frame.doLayout();
    this.logPanel = frame;
  }

  ,createLogPanel:function() {
    var frame = this.getLogFrame(),
    panel = this.getLogPanel();
    frame.add(panel);
    frame.doLayout();
    this.logPanel = frame;
  }

  /**
   * Returns the panel to log upload events.
   * @return {Object} panel {@link Ext.ux.Dialog} or {@link Ext.Window}
   */
  ,getLogPanel:function() {
    return new Ext.ux.upload.LogPanel({
      listeners:{scope:this, close:function() {
	  this.queue = 0;
      }}
    });
  }

  ,getLogFrame:function(panel) {
    if (this.dialogEl) {
      return new Ext.ux.Dialog({
	height:140
	,width:350
	,layout:"fit"
	,border:false
	,closeAction:"hide"
	,dialogEl:this.dialogEl
      }).render(Ext.getBody());
    } else {
      return new Ext.Window({
	height:200
	,width:350
	,layout:"fit"
	,border:false
	,closeAction:"hide"
      });
    }
  }

  /**
   * Set the url where files have to be uploaded
   * @param {String} url
   */
  ,setUploadUrl:function(url) {
    this.url = url;
    this.swfParams.url = url;
    this.html5Params.url = url;
    Ext.each(this.connections, function(conn) {
      conn.url = url;
      if (conn.swf) conn.swf.setUploadURL(url);
    });
  }

  /**
   * Set the url where files have to be uploaded
   * @param {String} url
   */
  ,setPath:function(path) {
    this.path = path;
    this.swfParams.path = path;
    this.html5Params.path = path;
    Ext.each(this.connections, function(conn) {
      conn.path = path;
    });
  }

  // HANDLERS

  ,onBeforeUpload:function(conn, fileCount) {
    if (this.fireEvent("beforeupload", this, conn, fileCount) !== false) {
       this.queue += fileCount;
      if (this.enableLogPanel && !this.logPanel)
	this.createLogPanel();
      return true;
    } else return false;
  }

  ,onUploadStart:function(conn, file) {
    if (this.enableLogPanel) {
      this.logPanel.show();
      this.logPanel.addProgress(file);
      this.logPanel.setStatus("loading", "en attente...");
    }
    this.fireEvent("uploadstart", this, conn, file);
  }

  ,onUploadProgress:function(conn, file, uploaded) {
    if (this.enableLogPanel) {
      this.logPanel.updateProgress({
	file:file
	,type:"loading"
	,progress:uploaded
      });
    }
  }

  ,onUploadComplete:function(conn, file) {
    if (this.enableLogPanel && file.filestatus !== -3) {
      this.logPanel.updateProgress({
	file:file
	,progress:1
	,type:"success"
      });
      this.queue--;
      this.fireEvent("uploadcomplete", this, conn, file);
      if (this.queue === 0) {
	if (this.logPanel.close) this.logPanel.close();
	this.fireEvent("queuecomplete", this, conn);
      }
    }
  }

  ,onUploadError:function(conn, file, msg) {
    this.queue--;
    if (this.enableLogPanel) {
      if (!this.logPanel) this.createLogPanel();
      this.logPanel.show();
      if (file) {
	this.logPanel.updateProgress({
	  file:file
	  ,progress:0
	  ,type:"error"
	  ,msg:msg
	});
      } else this.logPanel.setStatus("error", msg);
    }
  }

});
