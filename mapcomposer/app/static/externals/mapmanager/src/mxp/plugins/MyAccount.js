/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
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
 
/** api: (define)
 *  module = mxp.plugins
 *  class = MyAccount
 */
Ext.ns("mxp.plugins");

/** api: constructor
 *  .. class:: MyAccount(config)
 *
 *    Open a My Account panel
 */
mxp.plugins.MyAccount = Ext.extend(mxp.plugins.Tool, {
    
    /** api: ptype = mxp_usermanager */
    ptype: "mxp_myaccount",
    // i18n
    buttonText: "My Account",
    tooltipText: "My Account details",
    groupsText: "Groups",
    usersText: "Users",
    changePassword:'Change Password',
    textPassword: 'Password',
    textPasswordConf: 'Confirm Password',
    textSubmit: 'Submit',
    textCancel: 'Cancel',
    textPasswordChangeSuccess: 'Password Changed',
    textErrorPasswordChange: 'ErrorChangingPassowd',
    textConfirmChangePassword: 'Are you sure to change the Password? You will have to log in again after this operation',
    usernameLabel:'User Name',
    
    //config
    loginManager: null, 
    scrollable:true,
    setActiveOnOutput: true,
    /** api: config[displayPanels]
     *  ``boolean`` use panels to see attributes instead of template
     */
    displayPanels: true,
    
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
    hideAttributes :['UUID'],
    
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
    // default configuration for the output
    outputConfig: {
        closable: true,
        closeAction: 'close',
        autoWidth: true,
        viewConfig: {
            forceFit: true
        }       
    },

    /** api: method[addActions]
     */
    addActions: function() {
        
        var thisButton = new Ext.Button({
            text: this.buttonText,
            iconCls:'vcard_ic',
            tooltip: this.tooltipText,
            handler: function() { 
                // add output if not present
                this.addOutput();
            },
            scope: this
        });

        var actions = [thisButton];

        return mxp.plugins.MyAccount.superclass.addActions.apply(this, [actions]);
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        this.login = this.target.login ? this.target.login: 
                this.loginManager && this.target.currentTools[this.loginManager] 
                ? this.target.currentTools[this.loginManager] : null;
        target =this.target;
        //create a copy of the user
        var user = this.target.user || {};
       user = Ext.apply( user , this.user);
       this.user = user;
       
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
        //add the strings to the template object
        user.strings = {
            groups:this.groupsText,
            accountDetailsText: this.accountDetailsText
        }
        var controlPanel = {
        itemId:'my_account',
            xtype: "panel",
            layout: 'border',
            title: "My Account",
            tbar: ["->",this.getChangePasswordTool()],
            iconCls: "vcard_ic",  
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
        // In user information the output is generated in the component and we can't check the item.initialConfig.
        if(this.output.length > 0
            && this.outputTarget){
            for(var i = 0; i < this.output.length; i++){
                if(this.output[i].ownerCt
                    && this.output[i].ownerCt.xtype 
                    && this.output[i].ownerCt.xtype == "tabpanel"
                    && !this.output[i].isDestroyed){
                    var outputConfig = config || this.outputConfig;
                    // Not duplicate tabs
                    for(var index = 0; index < this.output[i].ownerCt.items.items.length; index++){
                        var item = this.output[i].ownerCt.items.items[index];
                        // only check iconCls
                        var isCurrentItem = "my_account" == item.initialConfig["itemId"];
                        if(isCurrentItem){
                            this.output[i].ownerCt.setActiveTab(index);
                            return;
                        }
                    } 
                }
            }
        }
		
		//hide selection layer on tab change
		
		return mxp.plugins.MyAccount.superclass.addOutput.call(this, Ext.apply(controlPanel,config));
		
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
                    Ext.Msg.confirm(me.textConfirmChangePasswordTitle,
                    me.textConfirmChangePassword,
                    function(btn){
                        if (btn === 'yes') {
                            var user = form.getValues().name;
                            var pass = form.getValues().password;
                            Ext.Ajax.request({
                              headers : {
                                    'Authorization' : me.login.login.getAuthHeader(),
                                    'Content-Type' : 'text/xml'
                              },
                              url: me.target.geoBaseUsersUrl + '/user/' + userObj.id,
                              method: 'PUT',
                              params: '<User><newPassword>'+pass+'</newPassword></User>',
                              success: function(response, opts){
                                me.login.login.auth  = 'Basic ' + Base64.encode(user + ':' + pass);
                                me.login.login.logout();
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

Ext.preg(mxp.plugins.MyAccount.prototype.ptype, mxp.plugins.MyAccount);