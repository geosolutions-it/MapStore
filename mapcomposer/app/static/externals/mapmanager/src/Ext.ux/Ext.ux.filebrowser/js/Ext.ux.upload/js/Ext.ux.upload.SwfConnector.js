/*
** Ext.ux.upload.SwfConnector.js for Ext.ux.upload.SwfConnector
**
** Made by Gary van Woerkens
** Contact <gary@chewam.com>
**
** Started on  Fri Jun  4 19:03:44 2010 Gary van Woerkens
** Last update Mon Jun 28 22:24:46 2010 Gary van Woerkens
*/

Ext.ns('Ext.ux.upload');

/**
 * @class Ext.ux.upload.SwfConnector
 * @extends Ext.util.Observable
 * A simple class which creates a SWFUpload button and handles SWFUpload events
 * @author Gary van Woerkens
 * @version 1.0
 */

/**
 * Create a new SWFUpload connector
 * @constructor
 * @param {Object} config The config object
 */
Ext.ux.upload.SwfConnector = function(config) {

  Ext.apply(this, config);

  this.lang = this.langs[this.lang] || this.langs["en"];
  this.lang.maxFilesError = new Ext.Template(this.lang.maxFilesError);
  this.lang.maxFileSizeError = new Ext.Template(this.lang.maxFileSizeError);

  this.addEvents(
    /**
     * @event load Fires when SWFUpload is loaded
     * @param {Ext.ux.upload.SwfConnector} this
     */
    "load"
    /**
     * @event dialogstart Fires on upload dialog window open
     * @param {Ext.ux.upload.SwfConnector} this
     */
    ,"dialogstart"
    /**
     * @event beforeupload Fires on upload dialog window close
     * @param {Ext.ux.upload.SwfConnector} this
     * @param {Number} selectedFilesCount
     */
    ,"beforeupload"
    /**
     * @event start Fires when a file upload start
     * @param {Ext.ux.upload.SwfConnector} this
     * @param {Object} file
     */
    ,"start"
    /**
     * @event progress Fires when file upload progress
     * @param {Ext.ux.upload.SwfConnector} this
     * @param {Object} file
     * @param {Number} loaded The file loading percentage<br/>
     * It must a decimal value greater than 0 and less than 1
     */
    ,"progress"
    /**
     * @event error Fires on upload error
     * @param {Ext.ux.upload.SwfConnector} this
     * @param {Object} file
     * @param {String} msg The error message
     */
    ,"error"
    /**
     * @event complete Fires when file upload is over
     * @param {Ext.ux.upload.SwfConnector} this
     * @param {Object} file
     */
    ,"complete"
  );

  Ext.ux.upload.SwfConnector.superclass.constructor.call(this);

  this.loaded = false;
  this.swf = this.getSwfUpload();

};

Ext.extend(Ext.ux.upload.SwfConnector, Ext.util.Observable, {

  /**
   * @cfg String url
   * The URL where files will be uploaded.
   */
  url:""
  /**
   * @cfg path
   */
   ,path:""
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
   * @cfg {String} lang
   * The language to display log panel messages (default to "en").
   */
  ,lang:"en"
  /**
   * @cfg {Object} langs
   * Available languages to load on init with {@link Ext.ux.upload.LogPanel#lang lang}.
   */
  ,langs:{
    en:{
      maxFilesError:"Max number of files reached (max:{maxFiles})"
      ,maxFileSizeError:"Max file size reached (max:{maxFileSize} KB)"
      ,allowedFileTypeError:"File type not allowed"
      ,serverError:"Cannot reach server"
    }
    ,fr:{
      maxFilesError:"Trop de fichiers envoyés simultanément (max:{maxFiles})"
      ,maxFileSizeError:"Taille limite atteinte (max:{maxFileSize} KB)"
      ,allowedFileTypeError:"Type de fichier incorrect"
      ,serverError:"Serveur injoignable"
    }
  }

  /**
   * True if SWFUpload has been loaded.
   * @type {Boolean}
   * @property loaded
   */
  /**
   * The instance of SWFUpload.
   * @type {Object}
   * @property swf
   */
  /**
   * The {@link Ext.Element} which encapsulates
   * the swfupload button's {@link Ext.ux.upload.SwfConnector#body body}.<br/>
   * This element gives the width and height of the swfupload button.
   * See also {@link Ext.ux.upload.Uploader#resizeTrigger resizeTrigger}.
   * @type {Ext.Element}
   * @property el
   */
  /**
   * The {@link Ext.Element} which encapsulates the swfupload button.<br/>
   * His id is used by SWFUpload to inserr the swf button.
   * @type {Ext.Element}
   * @property body
   */

  /**
   * Returns a new instance of swpupload.
   * @return {Object} SWFUpload
   */
  ,getSwfUpload:function() {
    return new SWFUpload({
      debug:this.debug
      ,post_params:{}
      ,upload_url:this.url
      ,flash_url:this.swfUrl
      ,file_post_name:"Filedata"
      ,movieName:"x-uploader-swf"
      ,file_queue_limit:this.maxFiles
      ,button_window_mode:"transparent"
      ,file_size_limit:this.maxFileSize
      ,file_types:this.allowedFileTypes
      ,button_placeholder_id:this.body.id
      // handlers
      ,upload_start_handler:this.onUploadStart.createDelegate(this)
      ,upload_error_handler:this.onUploadError.createDelegate(this)
      ,upload_complete_handler:this.onUploadComplete.createDelegate(this)
      ,upload_progress_handler:this.onUploadProgress.createDelegate(this)
      ,file_queue_error_handler:this.onFileQueueError.createDelegate(this)
      ,swfupload_loaded_handler:this.onSwfuploadLoaded.createDelegate(this)
      ,file_dialog_start_handler:this.onFileDialogStart.createDelegate(this)
      ,file_dialog_complete_handler:this.onFileDialogComplete.createDelegate(this)
    });
  }

  // HANDLERS

  ,onSwfuploadLoaded:function() {
    this.loaded = true;
    this.fireEvent("load", this);
  }

  ,onFileDialogStart:function() {
    this.fireEvent("dialogstart", this);
  }

  ,onFileDialogComplete:function(selectedFilesCount, queueFilesCount) {
    if (
      queueFilesCount &&
      this.fireEvent("beforeupload", this, selectedFilesCount) !== false
    ) {
      this.swf.setPostParams({path:this.path});
      this.swf.refreshCookies(true);
      this.swf.startUpload();
    }
  }

  ,onFileQueueError:function(file, errorCode, errorMsg) {
    var msg = "";
    if (errorCode == -100)
      msg = this.lang.maxFileSizeError.apply({maxFiles:this.maxFiles});
//      msg = "trop de fichiers envoyés simultanément (max:"+this.maxFiles+")";
    else if (errorCode == -110)
      msg = this.lang.maxFilesError.apply({maxFileSize:this.maxFileSize});
//      msg = "taille limite atteinte (max:"+this.maxFileSize+" KB)";
    else if (errorCode == -130)
      msg = this.lang.allowedFileTypeError;
    this.fireEvent("error", this, file, msg);
  }

  ,onUploadStart:function(file) {
    this.fireEvent("start", this, file);
  }

  ,onUploadProgress:function(file, uploadedSize, totalSize) {
    this.fireEvent("progress", this, file, uploadedSize/totalSize);
  }

  ,onUploadError:function(file) {
    var msg = this.lang.serverError;
    this.fireEvent("error", this, file, msg);
  }

  ,onUploadComplete:function(file) {
    this.fireEvent("complete", this, file);
  }

});
