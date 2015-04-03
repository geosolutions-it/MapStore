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
Ext.namespace("Ext.ux.grid");
Ext.ux.grid.CheckboxSelectionGrid = Ext.extend(Ext.grid.GridPanel,{
    xtype: 'nrl_checkboxcelectiongrid',
    viewConfig: {forceFit: true},
    initComponent: function() {
        this.addEvents('selectionchange');
        this.sm = new Ext.grid.CheckboxSelectionModel({checkOnly:true});
        var colums = [this.sm];
        this.columns = colums.concat(this.columns);
        this.cm = new Ext.grid.ColumnModel({
                defaults: {
                    width: 120,
                    sortable: true
                },
                columns: this.columns
        });
        this.sm.on('selectionchange',function(sm){
            
            this.fireEvent('selectionchange',sm.getSelections());
        },this);
        this.getSelections = function(){
            return this.selModel.getSelections();
        }
        return Ext.ux.grid.CheckboxSelectionGrid.superclass.initComponent.apply(this, arguments);
    
    }

});

Ext.reg('nrl_checkboxcelectiongrid', Ext.ux.grid.CheckboxSelectionGrid);