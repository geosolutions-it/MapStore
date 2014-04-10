/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.ns('Ext.ux');

/**
 * Class: ImagePicker
 * A panel for upload an image and/or pick an image url.
 * 
 * Inherits from:
 *  - <Ext.form.FormPanel>
 *
 */
Ext.ux.ImagePicker = Ext.extend(Ext.FormPanel, {
    
    /** i18n */
    invalidFileExtensionText: "File extension must be one of: ",
    insertText: "Insert",
    cancelText: "Cancel",
    imageUrlText: "Image URL",
    urlText: "URL",
    addText: "Add",
    imageCarouselText: "Image Carousel",
    imageUploadText: "Image Upload",
    externalURLText: "External URL",
    /** end i18n */

    /** layout config **/
    width: 500,
    frame: true,
    autoHeight: true,
    bodyStyle: 'padding: 10px 10px 0 10px;',
    labelWidth: 50,
    defaults: {
        anchor: '95%',
        allowBlank: false,
        msgTarget: 'side'
    },
    
    /** api: config[actionURL]
     *  ``String``
     *  URL to the file browser handler (tested with `OpenSDI-Manager2`)
     */
    actionURL: null,
    
    /** api: config[validFileExtensions]
     *  ``Array``
     *  List of valid file extensions.  These will be used in validating the 
     *  file input value.  Default is ``[".png", ".jpg", ".gif"]``.
     */
    validFileExtensions: [".png", ".jpg", ".gif"],

    /** api: config[imageCarouselHeight]
     *  ``Integer``
     *  Height for the image carousel
     */
    imageCarouselHeight: 150,
    
    /** private: property[fileUpload]
     *  ``Boolean``
     */
    fileUpload: true,
    
    /** api: config[url]
     *  ``String``
     *  URL for upload service.
     */
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        // Allow for a custom method to handle upload responses.
        /*config.errorReader = {
            read: config.handleUploadResponse || this.handleUploadResponse.createDelegate(this)
        };*/
        this.service = config.service;
        Ext.ux.ImagePicker.superclass.constructor.call(this, config);
    },
    
    /** private: method[initComponent]
     */
    initComponent: function() {
        var self = this;

        var uploadURL = this.getUploadUrl();

        // clean available images and index
        this.availableImages = [];
        this.activeIndex = -1;
        
        this.items = [{
            xtype: "fieldset",
            title: this.imageUrlText,
            items: [{
                xtype: "compositefield",
                items:[{
                    xtype: "textfield",
                    fieldLabel: this.urlText,
                    name: "imageUrl"
                },{
                    xtype: "button",
                    text: this.addText,
                    iconCls: "row_expand",
                    handler: this.onAddUrl, 
                    scope: this
                }]
            }]
        },{
            xtype: "fieldset",
            title: this.imageCarouselText,
            items: [{
                xtype: "panel",
                id: this.id + "_carousel"
            }]
        },{
            xtype: "fieldset",
            title: this.imageUploadText,
            items: [{
                xtype: "pluploadpanel",
                url: uploadURL,
                multipart: true,
                listeners:{
                    fileUploaded: this.onFileUpload,
                    scope: this
                }
            }]
        }];
        
        this.buttons = [{
            text: this.insertText,
            handler: function() {
                this.fireEvent("picked", this.availableImages[this.activeIndex]);
            },
            scope: this
        },{
            text: this.cancelText,
            scope: this,
            handler: function(){
                this.fireEvent("cancel");
            }
        }];
        
        this.addEvents(

            /**
             * Event: picked
             * Fires when insert button is clicked.
             *
             * Listener arguments:
             * image - {Object} An object with the `name` and the `url` of the image
             */
            "picked",

            /**
             * Event: cancel
             * Fires when cancel button is clicked.
             */
            "cancel"
        );

        // File store
        this.fileStore = new Ext.data.Store({
            baseParams: {
                action : "get_filelist"
            },
            proxy: new Ext.data.HttpProxy({
                url: this.actionURL,
                method : 'POST',
                disableCaching: true
            }),
            autoLoad: false,
            sortInfo: {field: 'name', direction: 'ASC'},
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'count'
            },[
                {name: 'name'},
                {name: 'size'},
                {name: 'mtime', type: 'date', dateFormat: 'timestamp'},
                {name: 'web_path'},
                {name: 'thumb_path'}
            ])
        });
        this.fileStore.on("load", this.onStoreLoad, this);
        this.fileStore.load();

        Ext.ux.ImagePicker.superclass.initComponent.call(this);

    },
    
    /** private: method[getUploadUrl]
     */
    getUploadUrl: function(){
        // Include proxy host for plupload (not ExtJS proxy supported)
        var uploadURL = this.actionURL.replace("extJSbrowser", "upload");
        var checkUrl = this.actionURL;
        var index0 = checkUrl.indexOf("://");
        if(index0 > -1){
            checkUrl = checkUrl.split("://")[1];
            checkUrl = checkUrl.substring(0, checkUrl.indexOf("/"));
            var this_host = document.URL.split("://")[1];
            this_host = this_host.substring(0, this_host.indexOf("/"));
            if(checkUrl != this_host){
                uploadURL =  OpenLayers.ProxyHost + uploadURL; 
            }
        }

        return uploadURL;

    },

    /** private: method[onFileUpload]
     *  Handler for the file uploaded
     *  Parameters:
     *  file - {Object} An object with the `name` and the `server_error` if an error occured 
     */
    onFileUpload: function(file){
        if(file.server_error == 0){
            var imageUrl = this.actionURL + "?action=get_image&folder=root&file=" + file.name;
            this.addImageToCarousel(imageUrl, file.name, true);
            this.availableImages.push({
                url: imageUrl, 
                name: file.name
            });
        }
    },

    /** private: method[onStoreLoad]
     *  Handler to be executed when the file store is loaded
     *  Parameters:
     *  store - {Object} File store
     *  records - {Object} Records
     */
    onStoreLoad: function(store, records){
        var imageUrl = this.actionURL + "?action=get_image&folder=root&file=";
        records.forEach(function(item){
            var name = item.get("name");
            if(this.fileNameValidator(name) == true){
                this.addImageToCarousel(imageUrl + name, name);
                this.availableImages.push({
                    url: imageUrl + name, 
                    name: name
                });
            }
        }, this);
    },

    /** private: method[onAddUrl]
     *  Handler to be executed an URL has been added as image
     */
    onAddUrl: function(){
        this.addImageToCarousel(this.getForm().getValues().imageUrl, this.externalURLText, true);
        this.availableImages.push({
            url: this.getForm().getValues().imageUrl, 
            name: this.externalURLText
        });
    },

    /** private: method[addImageToCarousel]
     *  Handler to be executed an URL has been added as image
     *  Parameters:
     *  imageUrl - {String} Url for the omage
     *  title - {String} Name of the image
     *  setActive - {Boolean} Flag to set active
     */
    addImageToCarousel: function(imageUrl, title, setActive){
        if(!this.carousel){
            this.addCarousel();
        }
        this.carousel.add(Ext.DomHelper.append(document.body, {
            tag: 'img', 
            src: imageUrl, 
            title: title,
            height: this.imageCarouselHeight
        }));
        this.carousel.refresh();
        if(setActive){
            this.carousel.setSlide(this.carousel.slides.length -1);
        }
    },

    /** private: method[addCarousel]
     *  Add an image carousel to `this.id + "_carousel"` panel
     */
    addCarousel: function(){
        this.carousel = new Ext.ux.Carousel(this.id + "_carousel", {
            height: this.imageCarouselHeight
        });
        this.carousel.on("change", function(slide, index){
            this.activeIndex = index;
        }, this);
    },
    
    /** private: method[fileNameValidator]
     *  :arg name: ``String`` The chosen filename.
     *  :returns: ``Boolean | String``  True if valid, message otherwise.
     */
    fileNameValidator: function(name) {
        var valid = false;
        var ext, len = name.length;
        for (var i=0, ii=this.validFileExtensions.length; i<ii; ++i) {
            ext = this.validFileExtensions[i];
            if (name.slice(-ext.length).toLowerCase() === ext) {
                valid = true;
                break;
            }
        }
        return valid || this.invalidFileExtensionText + '<br/>' + this.validFileExtensions.join(", ");
    }

});

/** api: xtype = imagepicker */
Ext.reg("imagepicker", Ext.ux.ImagePicker);
