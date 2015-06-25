/*
 *  Copyright (C) 2014 GeoSolutions S.A.S.
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

Ext.ns("mxp.widgets");


/**
 * GcExportLayers
 * Allow to export GeoCollect basic layer
 */
mxp.widgets.GcExportLayers = Ext.extend(Ext.form.CompositeField, {

	xtype:"mxp_gc_export_layers",
	exportFormatsLabel:"Export Formats",
	exportBtnTooltip:"Export Layers",
	width:280,
	baseUrl:null,
	typeName:null,
	exFormat:null,
	invalidParameterValueErrorText:"Export Error!",
	/** api:config[exportFormats]
	 */	
	exportFormats:[["SHAPE-ZIP","Shape-Zip"],["EXCEL","Excel"],["GML2","GML 2"],["GML3","GML 3"]],

	initComponent : function() {

		var me = this;
      	
		this.exportFormat= new Ext.form.ComboBox({
            	value :this.exportFormatsLabel,
	            displayField : "name",
	            valueField : "value",
	            disabled:true,
	            allowBlank : true,
	            mode : "local",
	            queryMode : 'local',
	            forceSelection : true,
	            triggerAction : "all",
	            editable : false,
	            lastQuery : '',
	            store : new Ext.data.SimpleStore({
	                fields : ["value","name"],
	                data:this.exportFormats
	            }),
	            listeners : {
                select : function(a, rec, c) {
                	this.exFormat=	rec.get('value');
                	this.toggleExport();
                	},
               	scope : this
                	}

        });

        this.exportBtn= new Ext.Button({
            xtype : "button",
            width:80,
            disabled:true,
            tooltip : this.exportBtnTooltip,
            text:"Export",
            iconCls : "gc-icon-export",
            handler : function(btn) {
              	this.doDownloadPost(this.createUrl(),this.exFormat);  
            },
            scope : this

        });
        this.items=[this.exportFormat,this.exportBtn]
		mxp.widgets.GcExportLayers.superclass.initComponent.call(this,arguments);
	},
	setTypeNames : function (typeName){
		this.typeName=typeName;
		this.toggleExport();
		this.toggleFormatCombo();
	},
	toggleExport:function(){
		if(this.typeName && this.baseUrl && this.exFormat)
			this.exportBtn.enable();
		else this.exportBtn.disable();

	},
	toggleFormatCombo:function(){
		if(this.typeName && this.baseUrl)
			this.exportFormat.enable();
		else this.exportFormat.disable();

	},
	setUrl:function(url){
		this.baseUrl=url;
	},
	createUrl:function(){

			var url =this.baseUrl +
                "&version=" + "1.0.0" +
                "&request=GetFeature" +
                "&typeName=" + this.typeName +','+this.typeName + "_sop" +
                "&exceptions=application/json" +
                "&outputFormat="+ this.exFormat+"&content-disposition=attachment";
        		return url;


	},
	  doDownloadPost: function(url,outputFormat){
        var me=this;
        //        
        //delete other iframes appended
        //
        if(document.getElementById(this.downloadFormId)) {
            document.body.removeChild(document.getElementById(this.downloadFormId)); 
        }
        if(document.getElementById(this.downloadIframeId)) {
            document.body.removeChild(document.getElementById(this.downloadIframeId));
        }
        // create iframe
        var iframe = document.createElement("iframe");
        iframe.setAttribute("style","visiblity:hidden;width:0px;height:0px;");
        this.downloadIframeId = Ext.id();
        iframe.setAttribute("id",this.downloadIframeId);
        iframe.setAttribute("name",this.downloadIframeId);
        document.body.appendChild(iframe);
        iframe.onload = function(){
            if(!iframe.contentWindow) return;
             if(!iframe.contentWindow) return;
            
            var error ="";
            var body = iframe.contentWindow.document.getElementsByTagName('body')[0];
            var content ="";
            if (body.textContent){
              content = body.textContent;
            }else{
              content = body.innerText;
            }
            
            try{
                var serverError = Ext.util.JSON.decode(content);
                error = serverError.exceptions[0].text
            }catch(err){
                error = body.innerHTML || content;
            }
             Ext.Msg.show({
                title: me.invalidParameterValueErrorText,
                msg: "outputFormat: " + outputFormat + "</br></br>" +
                      "</br></br>" +
                     "Error: " + error,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });   
        }
        var me = this;
        
        // submit form with enctype = application/xml
        var form = document.createElement("form");
        this.downloadFormId = Ext.id();
        form.setAttribute("id", this.downloadFormId);
        form.setAttribute("method", "POST");
        //this is to skip cross domain exception notifying the response body
        var urlregex =/^https?:\/\//i;
        //if absoulte url and do not contain the local host
        var iframeURL = (!urlregex.test(url) || url.indexOf(location.host)>0) ? url :  proxy + encodeURIComponent(url);
        form.setAttribute("action", iframeURL );
        form.setAttribute("target",this.downloadIframeId);
        document.body.appendChild(form);
        form.submit(); 
    } 
	
});
Ext.reg(mxp.widgets.GcExportLayers.prototype.xtype, mxp.widgets.GcExportLayers);

