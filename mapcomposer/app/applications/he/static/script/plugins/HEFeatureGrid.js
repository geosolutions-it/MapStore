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

/** api: (define)
 *  module = gxp.plugins.he
 *  class = HEFeatureGrid
 */

/** api: (extends)
 *  plugins/gxp.plugins.FeatureGrid.js
 */
Ext.namespace("gxp.plugins.he");

/** api: constructor
 *  .. class:: FeatureGrid(config)
 *
 *    Plugin for displaying vector features in a grid. Requires a
 *    :class:`gxp.plugins.FeatureManager`. Also provides a context menu for
 *    the grid.
 */   
gxp.plugins.he.HEFeatureGrid = Ext.extend(gxp.plugins.FeatureGrid, {
    
    /** api: ptype = he_results_grid */
    ptype: "he_feature_grid",


    /** api: config[AdvancedUser]
     *  string Advanced User group name
     *  Default Advanced_Users
     */
    advancedUser:'Advanced_Users',
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {

        var isAdmin=(this.target && this.target.userDetails && this.target.userDetails.user.role == "ADMIN");
        var isAdvancedUser=(this.target.userDetails)? this.hasGroup(this.target.userDetails.user,this.advancedUser):false;
        if(!isAdmin && !isAdvancedUser){
            this.showExportCSV=false;
            this.exportFormats=undefined;
        }
        var featureGrid = gxp.plugins.he.HEFeatureGrid.superclass.addOutput.call(this, config);
        return featureGrid;
    },

    /** private: method[hasGroup]
     *  ``Function`` Check if users has passed group
     *
     */
    hasGroup: function(user, targetGroups){
                if(user && user.groups && targetGroups){
                    var groupfound = false;
                    for (var key in user.groups.group) {
                        if (user.groups.group.hasOwnProperty(key)) {
                            var g = user.groups.group[key];
                            if(g.groupName && targetGroups.indexOf(g.groupName) > -1 ){
                                groupfound = true;
                            }
                        }
                    }
                    return groupfound;
                }
                
                return false;
            }

    
});

Ext.preg(gxp.plugins.he.HEFeatureGrid .prototype.ptype, gxp.plugins.he.HEFeatureGrid);
