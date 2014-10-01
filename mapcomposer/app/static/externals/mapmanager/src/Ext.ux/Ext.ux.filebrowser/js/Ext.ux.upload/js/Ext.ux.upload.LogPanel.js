/*
** Ext.ux.upload.LogPanel.js for Ext.ux.upload
**
** Made by Gary van Woerkens
** Contact <gary@chewam.com>
**
** Started on  Fri Jun  4 19:01:47 2010 Gary van Woerkens
** Last update Mon Jun 21 13:48:39 2010 Gary van Woerkens
*/

Ext.ns('Ext.ux.upload');

/**
 * @class Ext.ux.upload.LogPanel
 * @extends Ext.Panel
 *
 * @author Gary van Woerkens
 * @version 1.0
 */
Ext.ux.upload.LogPanel = Ext.extend(Ext.Panel, {

  autoScroll:true
  ,cls:"x-upload-logpanel-toolbar"
  /**
   * @cfg {Ext.Template} progressTpl
   * The {@link Ext.Template template} used to display file {@link Ext.ProgressBar progress} messages.
   */
  ,progressTpl:new Ext.Template(
    '<div ext:qtip="{msg}" class="x-progress-text-{type}">{text}</div>'
  )
  /**
   * @cfg {String} lang
   * The language to display log panel messages (default to "en").
   */
  ,lang:"en"
  /**
   * @cfg {Object} langs
   * Available languages to load on init with {@link Ext.ux.upload.LogPanel#lang lang}.
   * <code><pre>
  ,langs:{
    en:{
      emptyListButtonTooltip:"Empty list"
      ,progressStatus:"Loading..."
      ,uploadComplete:"Upload complete"
      ,uploadingStatus:'Uploading {[count > 1 ? "files" : "file"]}'
    }
    ,fr:{
      emptyListButtonTooltip:"vider la liste des téléchargements"
      ,progressStatus:"Chargement..."
      ,uploadComplete:"Envoi terminé "
      ,uploadingStatus:'Envoi {[count > 1 ? "des fichiers" : "du fichier"]}'
    }
  }
   * </code></pre>
   */
  ,langs:{
    en:{
      emptyListButtonTooltip:"Empty list"
      ,progressStatus:"Loading..."
      ,uploadComplete:"Upload complete"
      ,uploadingStatus:'Uploading {[values.count > 1 ? "files" : "file"]}'
    }
    ,fr:{
      emptyListButtonTooltip:"Vider la liste des téléchargements"
      ,progressStatus:"Chargement..."
      ,uploadComplete:"Envoi terminé "
      ,uploadingStatus:'Envoi {[values.count > 1 ? "des fichiers" : "du fichier"]}'
    }
  }

  /**
   * Array of Files in queue.
   * @type {Array}
   * @property queue
   */

  ,initComponent:function() {

    this.queue = [];
    this.bodyStyle = "border:1px solid #99BBE8;background-color:#FFFFFF";

    this.lang = this.langs[this.lang] || this.langs["en"];

    this.uploadingStatus = new Ext.XTemplate(this.lang.uploadingStatus);

    this.bbar = new Ext.ux.StatusBar({
      height:27
//      ,style:"border:1px solid #99BBE8;"
      ,items:[{
	iconCls:"icon-eraser"
	,tooltip:this.lang.emptyListButtonTooltip
	,scope:this
	,handler:this.cleanLogPanel
      }]
    });

    Ext.ux.upload.LogPanel.superclass.initComponent.call(this);

    this.on({added:this.bindContainer});

  }

  /**
   *
   */
  ,bindContainer:function(logpanel, ctn, index) {
    Ext.apply(ctn, {
      addProgress:this.addProgress.createDelegate(this)
      ,updateProgress:this.updateProgress.createDelegate(this)
      ,setStatus:this.setStatus.createDelegate(this)
    });
  }

  /**
   * Removes all {@link Ext.ProgressBar progress} bars.
   */
  ,cleanLogPanel:function() {
    this.removeAll();
  }

  /**
   * Returns the {@link Ext.ux.StatusBar} where logs are displayed.
   * @return {Ext.ux.StatusBar}
   */
  ,getStatusBar:function() {
    return this.getBottomToolbar();
  }

  /**
   * Adds a {@link Ext.ProgressBar} to log panel.
   * @param {Object} file
   */
  ,addProgress:function(file) {
    if (this.getProgress(file.id) === false) {
      var p = new Ext.ProgressBar({
	text:this.progressTpl.apply({type:"loading", text:file.name})
	,isUploading:true
	,style:"border-width:0 0 1px 0"
//	,height:30
      });
      this.insert(0, p);
      this.doLayout();
      this.queue.push({
	id:file.id
	,p:p
      });
    }
  }

  /**
   * Updates a {@link Ext.ProgressBar progress} bar already added to log panel.
   * @param {Object} config The progress config
   */
  ,updateProgress:function(config) {
    var toolbar = this.getStatusBar(),
    p = this.getProgress(config.file.id);
    p.updateProgress(config.progress, this.progressTpl.apply({
      type:config.type
      ,text:config.file.name
      ,msg:config.msg
    }));
    if (config.type === "loading") {
      count = this.queue.length - this.getUploadingCount() + 1,
      msg = this.uploadingStatus.apply({count:this.queue.length});
    } else if (config.type === "success" || config.type === "error") {
      config.type = "info";
      p.isUploading = false;
      var count = this.queue.length - this.getUploadingCount(),
      msg = this.lang.uploadComplete;
    }
    this.setStatus(config.type, msg+" ("+count + "/" + this.queue.length+")");
  }

  /**
   * Set global upload status.
   * Logs are displayed in the {@link Ext.ux.StatusBar bottom toolbar}.
   * @param {String} type Type of log can be "loading", "success" or "error"
   * @param {String} msg Message to log.
   */
  ,setStatus:function(type, msg) {
    this.getStatusBar().setStatus({
      text:msg
      ,iconCls:"x-status-"+type
    });
  }

  /**
   * Returns the count of files in the {@link Ext.ux.upload.LogPanel#queue queue}
   * which are not uploaded yet.
   * @return {Number}
   */
  ,getUploadingCount:function() {
    var count = 0;
    Ext.each(this.queue, function(item) {
      if (item.p.isUploading) count++;
    });
    return count;
  }

  /**
   * Returns the {@link Ext.ProgressBar progress} bar from id.
   * @param {String} id The progress id
   */
  ,getProgress:function(id) {
    var index = Ext.each(this.queue, function(item, index) {
      return !(item.id === id);
    });
    return Ext.isDefined(index) ? this.queue[index].p : false;
  }

});

Ext.reg('uploadlogspanel', Ext.ux.upload.LogPanel);
