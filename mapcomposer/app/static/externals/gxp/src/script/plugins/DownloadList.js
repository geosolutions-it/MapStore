/**
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
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
 
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WFSGrid(config)
 *
 *    WFS interface to show data in a Ext.Grid
 */   
gxp.plugins.DownloadList = Ext.extend(gxp.plugins.Tool, {
	
	/** api: ptype = gxp_featuregrid */
    ptype: "gxp_downloadgrid",
	
	/** api: config[id]
     *  ``String``
     */
    id: "downloadgrid",
	
	delIconPath: "theme/app/img/silk/delete.png",
	
	downloadIconPath: "theme/app/img/ext/bottom2.gif",
	
	wpsClient: '',
	
	/** private: method[constructor]
    */
    constructor: function(config) {
        gxp.plugins.DownloadList.superclass.constructor.apply(this, arguments);         
    },
	
	/** api: method[addOutput]
     */
    addOutput: function() {

		this.grid = this.buildGrid();			
		Ext.apply(this.grid, this.outputConfig || {} );
    	return gxp.plugins.DownloadList.superclass.addOutput.call(this, this.grid);    
    },
	
	buildGrid: function() {
		
		var storeEx = new Ext.data.ArrayStore({
			fields: [
				{name: 'filename', type: 'string'}
			]
		});
		
		var gridPanel = new Ext.grid.GridPanel({
		
			id: this.id,
			store: storeEx,
			layout:'anchor',
			loadMask: {
				msg : 'Loading...'
			},
			colModel: new Ext.grid.ColumnModel({
				
				columns: [
					{id: 'filename', header: 'File Name', width: 85, sortable: true},
					{
						xtype:'actioncolumn',
						width: 15,
						items: [{
							iconCls: 'deleteIcon',
							tooltip: 'Delete',
							handler: function(grid, rowIndex, colIndex) {
								grid.getStore().removeAt(rowIndex);
							}
						}]
					}
					
				]
			}),
			viewConfig : {
				forceFit: true
			},
			tbar: new Ext.Toolbar({
				items: [
				{
					icon: this.downloadIconPath,
					text: 'Start Download',
					scope: this,
					handler: function() {
						if(gridPanel.store.getCount() <= 0){
							Ext.Msg.alert('Error', 'Download list is empty');
						}
						else{
							var filenames = new Array();
							gridPanel.store.each(function(r) {
							   filenames.push(r.data.filename);
							})
							this.fireEvent('startDownload', filenames);
						}
					}
				},
				{
					icon: this.delIconPath,
					text: 'Clear List',
					scope: this,
					handler: function() {
						gridPanel.getStore().removeAll();
					}
				}
				]
			}),
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			width: 450,
			height: 300,
			iconCls: 'icon-grid'
			
		});
		
		return gridPanel;
	}

});

	

Ext.preg(gxp.plugins.DownloadList.prototype.ptype, gxp.plugins.DownloadList);