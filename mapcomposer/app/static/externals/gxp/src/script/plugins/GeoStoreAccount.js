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
    //i18n
    usernameLabel:'User Name',
    changePassword:'Change Password',
    textPassword: 'Password',
    textPasswordConf: 'Confirm Password',
    textSubmit: 'Submit',
    textCancel: 'Cancel',
    textPasswordChangeSuccess: 'Password Changed',
    textErrorPasswordChange: 'Error Changing Password',
    //config
    geoStoreBase: null,
    auth: null,
    scrollable:true,
    /** api: config[displayPanels]
     *  ``boolean`` use panels to see attributes instead of template
     */
    displayPanels:true,
    
    /** api: config[additionalControls]
     *  ``Array``buttons to place in the right panel
     */
     additionalControls:null,
     
     /** api: config[controlsWidth]
     *  ``integer``width of the `dditionalControls`
     */
     controlsWidth:200,
     
    /** api: config[hideAttributes]
     *  ``Array`` user attributes to hide in the my account tab
     */
    hideAttributes:['UUID'],
    
    /** api: config[userTemplate]
     *  ``Array`` XTemplate to display user page.
     *  user is the root element. groups.group and attribute are arrays to iterate
     */
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
             '<tpl for="groups.group">', 
                '<tr class="{[xindex % 2 == 0 ? \"even\" : \"odd\"]}">',
                '<td colspan=2 >{groupName}</td>',
                '</tr>',
            '</tpl>',
            '</tbody></table>',
        '</tpl>',
    '</div>'],
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        target =this.target;
        //create a copy of the user
        var user = {};
       user = Ext.apply( user , this.user);
       
        // make the userattribute always an array
        if(!user.attribute){
            user.attribute = [];
        }
        if(!(user.attribute instanceof Array)){
            user.attribute = [user.attribute];
        }
         // make the userattribute always an array
         if(!user.groups){
            user.groups = {};
        }
        if(!user.groups.group){
            user.groups.group = [];
        }
        if(!(user.groups.group instanceof Array)){
            user.groups.group = [user.groups.group];
        }
        
        //remove attributes not allowed to display
        if(this.hideAttributes){
            var attributes = [];
            for( var i = 0 ; i < user.attribute.length ; i++){
                remove = false;
                for( var j = 0 ; j < this.hideAttributes.length ; j++){ 
                    if( user.attribute[i].name == this.hideAttributes[j] ){
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
            layout: 'border',
            title: "My Account",
            iconCls: "user-icon",  
            tbar: ["->",this.getChangePasswordTool()],
            header: false,
            items:[{
                region:'center',
                forceFit: true,
                border:false,
                ref:'general',
                autoscroll:true,
                html: new Ext.XTemplate(this.userTemplate).apply(user)
                }
            ]
        };
        //use panels instead of template
        if (this.displayPanels){
            
            controlPanel.items.push({
                ref:'attributes',
                layout:'fit',
                forcefit:true,
                title:'Attributes',
                region:'center',
                xtype:'grid',
                autoExpandColumn: "value",
                columns: [
                    {header: "name", width: 120, dataIndex: 'name', sortable: true},
                    {id:'value',header: "value", width: 180, dataIndex: 'value', sortable: true}
                ],
                store : new Ext.data.JsonStore({
                    data: user,
                    root:'attribute',
                    fields: [{
                        name: 'name',
                        type: 'string'
                    }, {
                        name: 'value',
                        type: 'string'
                    }]
                })
            });
            controlPanel.items.push({
                ref:'groups',
                layout:'fit',
                forcefit:true,
                width: 400,
                title:'Groups',
                region:'west',
                xtype:'grid',
                autoExpandColumn: "groupName",
                columns: [
                    {header: "id", width: 100, dataIndex: 'id', sortable: true, hidden:true},
                    {id: "groupName", header: "name", width: 180, dataIndex: 'groupName', sortable: true}
                    
                ],
                store : new Ext.data.JsonStore({
                    data: user,
                    root:'groups.group',
                    fields: [{
                        name: 'groupName',
                        type: 'string'
                    }, {
                        name: 'id',
                        type: 'integer'
                    }]
                })
            });
        
        }
        // additional buttons support in the right panel
        if(this.additionalControls){
          controlPanel.items.push({region:'east',xtype:'panel',frame:true,width:this.controlsWidth,layout:'vbox',items:this.additionalControls});
        }
        
        this.output = gxp.plugins.GeoStoreAccount.superclass.addOutput.call(this, Ext.apply(controlPanel,config));
		
		//hide selection layer on tab change
		
		return this.output;
		
	},
    /**
     * Parse the User attribute and returns an Extjs Compatible object for records
     */ 
    parseAttributes: function(){
    
    },
    getChangePasswordTool: function(){
        var tool =this;
        return {
            width: 100,
            xtype: 'box',
            autoEl: {
                children: [{
                  tag: 'a',
                  href: '#',
                  cn: this.changePassword
                }]
            },
            listeners: {
                render: function(c){
                    c.el.select('a').on('click', function(){
                        tool.showChangePwWindow();
                    });
                }
            }
        }
    },
    showChangePwWindow: function(){
        var name = this.user.name;

        var formEdit = new Ext.form.FormPanel({
            xtype:'form',
            layout:'form',
            ref:'form',
            frame:true,  border:false,
            items: [{
                xtype: 'hidden',
                name: 'name',
                value: this.user.name
            },{
                    xtype: 'textfield',
                    anchor:'90%',
                    id: 'password-textfield',
                    allowBlank: false,
                    ref:'../password',
                    name:'password',
                    blankText: this.textBlankPw,
                    fieldLabel: this.textPassword,
                    inputType:'password',
                    value: ''                
            },{
                    xtype: 'textfield',
                    anchor:'90%',
                    id: 'password-confirm-textfield',
                    ref:'../passwordconfirm',
                    allowBlank: false,
                    blankText: this.textBlankPw,
                    invalidText: this.textPasswordConfError,
                    fieldLabel: this.textPasswordConf,
                    validator: function(value){
                        if(this.refOwner.password.getValue() == value){
                            return value && value !="" ;
                        }else{
                            return false;
                        } 
                    },
                    inputType:'password',
                    value: ''                
              }]
        });
            
        var userObj = this.user;
        var me = this;
        var win = new Ext.Window({
            iconCls:'user_edit',
            width: 320, height: 140, resizable: true, modal: true, border:false, plain:true,
            closeAction: 'destroy', layout: 'fit', 
            title: this.textChangePassword,
            items: [ formEdit ],
            buttons:[{
                text: this.textSubmit,
                
                handler:function(){
                    var form = win.form.getForm();
                    if(form.isValid()){
                        var user = form.getValues().name;
                        var pass = form.getValues().password;
                        Ext.Ajax.request({
                          headers : {
                                'Authorization' : me.auth,
                                'Content-Type' : 'text/xml'
                          },
                          url: me.geoStoreBase + 'users/user/' + userObj.id,
                          method: 'PUT',
                          params: '<User><newPassword>'+pass+'</newPassword></User>',
                          success: function(response, opts){
                            me.auth  = 'Basic ' + Base64.encode(user + ':' + pass);
                            //TODO notify tools
                            win.close();
                            Ext.MessageBox.show({
                                msg: me.textPasswordChangeSuccess,
                                buttons: Ext.MessageBox.OK,
                                animEl: 'mb4',
                                icon: Ext.MessageBox.SUCCESS
                            });
                          },
                          failure:function(response,opts){
                            Ext.MessageBox.show({
                                title: me.textErrorTitle,
                                msg: me.textErrorPasswordChange,
                                buttons: Ext.MessageBox.OK,
                                animEl: 'mb4',
                                icon: Ext.MessageBox.WARNING
                            });
                          }
                        });
                    }
                }
            },{
                text:this.textCancel,
                handler:function(){
                    win.close();
                }
            }]
        })
        win.show();
    }
 });
 Ext.preg(gxp.plugins.GeoStoreAccount.prototype.ptype, gxp.plugins.GeoStoreAccount);