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

Ext.namespace('gxp.he');

/**
 * @author Lorenzo Natali
 */

/** api: constructor
 *  .. class:: JSChartsPanel(config)
 *
 *    Table that renders pipeline statistic's customer capacity
 *
 */
Ext.namespace('gxp.he.grid');
gxp.he.grid.FinancialHighlightsGrid = Ext.extend(Ext.grid.GridPanel,{
    xtype: 'he_grid_financialhighlights',
    layout:'fit',
    autoExpandColumn:'year',
    columns: [
        {
            id       :'year',
            header   : 'Year', 
            width    : 50,
            sortable : true, 
            dataIndex: 'year'
        },
        {
            id       : 'transportrev',
            header   : 'Transport Rev.', 
            width    : 75, 
            sortable : true, 
            //renderer : 'usMoney', 
            dataIndex: 'transportrev'
        },
        {
            id       : 'storagerev',
            header   : 'Storage Rev.', 
            width    : 75, 
            sortable : true, 
            //renderer : 'usMoney', 
            dataIndex: 'storagerev'
        },
        {
            id       : 'totoprev',
            header   : 'Total Op. Rev.', 
            width    : 75, 
            sortable : true, 
            //renderer : 'usMoney', 
            dataIndex: 'totoprev'
        },
        {
            id       : 'netincome',
            header   : 'Net Income', 
            width    : 75, 
            sortable : true, 
            //renderer : 'usMoney', 
            dataIndex: 'netincome'
        }


    ]

});
Ext.reg(gxp.he.grid.FinancialHighlightsGrid.prototype.xtype, gxp.he.grid.FinancialHighlightsGrid);