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
/**
 * @author Lorenzo Natali
 */
Ext.ns('Ext.ux.grid');

Ext.ux.grid.ItemDeleter = Ext.extend(Ext.grid.RowSelectionModel, {

    width: 30,
    iconCls:"icon-delete",
    sortable: false,
	dataIndex: 0, // this is needed, otherwise there will be an error
    
    menuDisabled: true,
    fixed: true,
    id: 'deleter',
    
    initEvents: function(){
        Ext.ux.grid.ItemDeleter.superclass.initEvents.call(this);
        this.grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
			if(columnIndex==grid.getColumnModel().getIndexById('deleter')) {
				var record = grid.getStore().getAt(rowIndex);
				grid.getStore().remove(record);
				grid.getView().refresh();
			}
        });
    },
    
    renderer: function(v, p, record, rowIndex){
        return '<div class="'+this.iconCls+'" style="width: 15px; height: 16px;"></div>';
    }
});