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
 * Generic Resource Editor for GeoStore
 * Allow to edit and commit changes for a GeoStore Resource
 * 
 */
mxp.widgets.GeoBatchRunLocal = Ext.extend(Ext.Component, {
    /** api: xtype[geobatch_run_local_form]
     */
    xtype:'geobatch_run_local',
    
    successText: "Success",
    errorText:"Error",
    runSuccessText: "The workflow has been started successfully<br/>",
	fileName: "geobatch.run",
	
    initComponent: function() {
        mxp.widgets.GeoBatchRunLocal.superclass.initComponent.call(this, arguments);
    },
    
	isForm: function() {
		return false;
	},
	
	startFlow: function(flowId,flowName) {
		this.runLocal(flowId);
	},
	
    runLocal: function(flowId){
        Ext.Ajax.request({
	       url: this.geoBatchRestURL + 'flows/' + flowId +'/run?fileName=' + this.fileName, 
	       method: 'POST',
	       headers:{
	          'Content-Type' : 'application/xml',
	          'Accept' : this.acceptTypes_,
	          'Authorization' : this.authorization_ //TODO
	       },
           xmlData:'<runInfo><file>' + this.fileName + '</file></runInfo>',
	       scope: this,
	       success: function(response, opts){
				//var data = self.afterFind( Ext.util.JSON.decode(response.responseText) ); 
                this.fireEvent('success',response);
				this.onSuccess(response, opts);
	       },
	       failure: function(response, opts){
                this.fireEvent('fail',response);
				this.onFailure(response);
	       }
	    });

    },
    /**
     * private method[onFailure]
     * manage the negative response of Run call
     */
    onFailure : function(response){
        Ext.Msg.show({
            title: this.errorText,
            msg: response.statusText + "(status " + response.status + "):  " + response.responseText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR
        });	
    },
    /**
     * private method[onSuccess]
     * manage positive response of Run call (ID of the consumer)
     */
    onSuccess : function(response){
        Ext.Msg.show({
            title: this.successText,
            //msg: this.runSuccessPreText + response.responseText,
            msg: this.runSuccessText,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.INFO  
        });	
    }
    
});
Ext.reg(mxp.widgets.GeoBatchRunLocal.prototype.xtype, mxp.widgets.GeoBatchRunLocal);