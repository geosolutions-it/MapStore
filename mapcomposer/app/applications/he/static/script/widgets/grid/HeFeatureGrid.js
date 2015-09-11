/**
 *  Copyright (C) 2007 - 2015 GeoSolutions S.A.S.
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
/**
 * @author Andrea Cappugi (kappu72@gmail.com)
 */

 Ext.namespace('gxp.grid');



 gxp.grid.HeFeatureGrid = Ext.extend( gxp.grid.FeatureGrid, {


   /** api: method[getColumns]
     *  :arg store: ``GeoExt.data.FeatureStore``
     *  :return: ``Array``
     *  
     *  Gets the configuration for the column model.
     */
    getColumns: function(store) {
        function getRenderer(format) {
            return function(value) {
                //TODO When http://trac.osgeo.org/openlayers/ticket/3131
                // is resolved, change the 5 lines below to
                // return value.format(format);
                var date = value;
                if (typeof value == "string") {
                     date = Date.parseDate(value.replace(/Z$/, ""), "c");
                }
                return date ? date.format(format) : value;
            };
        }
		
        var columns = [{
			xtype: 'actioncolumn',
			header: "", 
			width: 30,
			hidden: false,
			scope: this,
			items: [{
				iconCls: 'zoomaction',
				tooltip: this.actionTooltip,
				scope: this,
				handler: function(grid, rowIndex, colIndex){
					var store = grid.getStore();
					var row = store.getAt(rowIndex);
					var feature = row.data.feature;
					if(feature){
						var bounds = (feature.geometry)?feature.geometry.getBounds():feature.bounds;
						if(bounds){
							this.map.zoomToExtent(bounds);
							
							var showButton = Ext.getCmp("showButton");
							if(!showButton.pressed){
								showButton.toggle(true);								
							}
							
							grid.getSelectionModel().selectRow(rowIndex);					
						}
					}
				}
			}]
		}];
				
		var name, type, xtype, format, renderer;
        (this.schema || store.fields).each(function(f) {
            if (this.schema) {
                name = f.get("name");
                type = f.get("type").split(":").pop();
                format = null;
                switch (type) {
                    case "date":
                        format = this.dateFormat;
                    case "datetime":
                        format = format ? format : this.dateFormat + " " + this.timeFormat;
                        xtype = undefined;
                        renderer = getRenderer(format);
                        break;
                    case "boolean":
                        xtype = "booleancolumn";
                        break;
                    case "string":
                        xtype = "gridcolumn";
                        break;
                    default:
                        xtype = "numbercolumn";
                }
            } else {
                name = f.name;
            }
            if (this.ignoreFields.indexOf(name) === -1) {
                columns.push({
                    dataIndex: name,
                    header: name,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    renderer: xtype ? undefined : renderer
                });
            }
        }, this);
        return columns;
    }
 });

/** api: xtype = gxp_hefeaturegrid */
Ext.reg('gxp_hefeaturegrid', gxp.grid.HeFeatureGrid); 