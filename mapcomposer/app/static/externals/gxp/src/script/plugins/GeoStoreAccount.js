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
 * @author Lorenzo Natali, Tobia Di Pisa
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = GeoStoreAccount
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: GeoStoreAccount(config)
 *
 *    Plugin for adding a GeoStoreAccount Module to a :class:`gxp.Viewer`.
 */   
gxp.plugins.GeoStoreAccount = Ext.extend(gxp.plugins.Tool, {
    ptype: "gxp_geostore_account",
    displayAttributes:['Name','Surname','email'],
    usernameLabel:'User Name',
    scrollable:true,
    notAllowedAttributes:['UUID'],
    userTemplate: [ '<style>',
                '#account_details td{padding:5px;width: 200px;padding-left: 7px;color: #fff;text-shadow: 2px 2px 2px #666;}',
                '#account_details .b{font-weight:bold;}#account_details tr.even{background: #6a7064;}#account_details tr.odd{background: #bab29f;}',
                '#account_details th{font-size: 15px;font-wight: bold;text-shadow: 1px 1px 1px #cacaca;}',

            '</style><div class="details" style="margin:20px auto;text-align:center;">',
            '<tpl for=".">',
            '<table id="account_details" style="margin:0 auto;" cellspacing="0" cellpadding="0" border=0>',
            '<tbody><tr>',
            '<th colspan="2" style="text-align:center;font-weight:bold">Account Details</th>',
            // commons
           '</tr>',
            '<tr class="even">',
            '<td class="b">User Name</td>',
            '<td>{name}</td>',
            '</tr>',
            // attributes 
            '<tpl for="attribute">', 
                '<tr class="{[xindex % 2 == 0 ? \"even\" : \"odd\"]}">',
                '<td class="b">{name}</td>',
                '<td>{value}</td>',
                '</tr>',
            '</tpl>',
            // groups
            '<tr>',
            '<th colspan="2" style="text-align:center;font-weight:bold">Groups</th>',
            '<tr>',
             '<tpl for="groups">', 
                '<tr class="{[xindex % 2 == 0 ? \"even\" : \"odd\"]}">',
                '<td colspan=2 >{groupName}</td>',
                '</tr>',
            '</tpl>',
            '</tbody></table>',
        '</tpl>',
    '</div>'],
    addOutput: function(config) {
        target =this.target;
        //create a copy of the user
        var user = {};
       user = Ext.apply( user , this.user);
       
        // make the userattribute always an array
        if(!(user.attribute instanceof Array)){
            user.attribute = [user.attribute];
        }
         // make the userattribute always an array
        if(!user.groups){
            user.groups = [];
        }
        if(!(user.groups instanceof Array)){
            user.attribute = [user.attribute];
        }
        //remove attributes not allowed to display
        if(this.notAllowedAttributes){
            var attributes = [];
            for( var i = 0 ; i < user.attribute.length ; i++){
                remove = false;
                for( var j = 0 ; j < this.notAllowedAttributes.length ; j++){ 
                    if( user.attribute[i].name == this.notAllowedAttributes[j] ){
                        remove = true; 
                        break;
                    }
                }
                if(!remove){
                    attributes.push(user.attribute[i]);
                }
            }
            user.attribute = attributes;
        }                      

        var controlPanel = {
            xtype: "panel",
            title: "My Account",
            iconCls: "user-icon",  
            header: false,
            items:[{

                forceFit: true,
                border:false,
                ref:'grid',
                region:'center',
                autoscroll:true,
                html: new Ext.XTemplate(this.userTemplate).apply(user)
            }]
        };
        this.output = gxp.plugins.GeoStoreAccount.superclass.addOutput.call(this, Ext.apply(controlPanel,config));
		
		//hide selection layer on tab change
		
		return this.output;
		
	},
    /**
     * Parse the User attribute and returns an Extjs Compatible object for records
     */ 
    parseAttributes: function(){
    
    }
 });
 Ext.preg(gxp.plugins.GeoStoreAccount.prototype.ptype, gxp.plugins.GeoStoreAccount);