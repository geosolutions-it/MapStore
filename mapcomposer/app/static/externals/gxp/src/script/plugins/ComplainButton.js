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
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = ComplainButton
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: ComplainButton(config)
 *
 *    Plugin for adding a custom help button to MapStore. This will show an help window
 *    The ComplainButton tool can be configured by setting this tool's 
 *    ``outputConfig`` property.
 *
 *  Author: Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */ 
gxp.plugins.ComplainButton = Ext.extend(gxp.plugins.Tool, {
    ptype:'gxp_complain',
     
    /** i18n */
    menuText:'help',
    text:'Help', 
    title:'Help Window',
    iconCls:'gx-help',
    tooltip:'Open the Help Window',	
	
	link: '',	
	fileName: 'help',

    /** end of i18n */
    /** api: config[description]
     *  ``String`` Html to show in the window
     */
    description: '<h2> Help window</h2><p>This is a sample help window</p>',
    /** api: config[showOnStartup]
     *  ``Boolean`` Show the window on startup if true
     */
    showOnStartup:false,
    /** api: config[windowOptions]
     *  ``Object`` Options for override the window configuration
     */
    windowOptions:{
        height:370,
        width:500
    },
    
    /** api: method[addActions]
     */
    addActions: function() {
        var actions = [{
            menuText: this.menuText,
            text:this.text,
            enableToggle: false,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function(button, state) {
                this.showHelp();
            },
            scope: this
        }];
        if(this.showOnStartup){
            this.target.on('ready', this.showHelp,this);
        
        }
        return gxp.plugins.ComplainButton.superclass.addActions.apply(this, [actions]);
    },
	
    showHelp:function(){
		var win;
		var emailRegEx = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		
		var formPanel =  {
        xtype       : 'form',
        anchor: '100% 100%',
        autoScroll  : true,
        id          : 'formpanel',
        defaultType : 'field',
        frame       : true,
        title       : 'Dati Segnalazione',
		items:[
				   {
						xtype: 'textfield',
						fieldLabel: 'Nome',
						labelStyle:'font-weight:bold;',
						emptyText: 'Inserisci Nome',					
						anchor: '100%',
						minChars: 1,
						id: 'nomeText'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'Cognome',
						labelStyle:'font-weight:bold;',
						emptyText: 'Inserisci Cognome',					
						anchor: '100%',
						minChars: 1,
						id: 'cognomeText'
					},
					{
						xtype: 'textfield',
						fieldLabel: 'e-mail',
						labelStyle:'font-weight:bold;',
						emptyText: 'Inserisci indirizzo e-mail',					
						anchor: '100%',
						minChars: 1,
						id: 'emailText'
					},
					{
						xtype     : 'textarea',						
						fieldLabel: 'Messaggio',
						labelStyle:'font-weight:bold;',
						emptyText: 'Inserisci testo segnalazione',
						height: 200,
						id: 'noteText',
						anchor    : '100%'
					},
					{
						xtype: 'button',
						id: 'srcBtn',
						text: 'Invia',
						width: 50,				
						handler: function(){
							var formId = Ext.getCmp('formpanel').getForm().id;
							
							if (!emailRegEx.test(Ext.getCmp('emailText').getValue()))
							{
								Ext.Msg.show({
									  title: 'Errore',
									  msg: "L'indirizzo e-mail non semrba corretto",
									  width: 300,
									  icon: Ext.MessageBox.WARNING
								});
								return;
							}
							
							Ext.Ajax.request({
								url: 'http://localhost:8080/GeoInfo/InvioSegnalazioneServlet',
								form: formId,
								method:'POST',
								success: function(response, opts) {
									Ext.Msg.show({
										  title: 'Info',
										  msg: "Messaggio Inoltrato",
										  width: 300,
										  icon: Ext.MessageBox.INFO
									});
								},
								failure:function(res,opt) {
									//alert("request failed");
								}
							});
							
							win.close();
						}
					}
			   ]
		};
		
	
		win = new Ext.Window(Ext.apply({
			   
			   title: 'Invia Segnalazione',
			   border:false,
			   autoScroll:false,
			   items:[
				   formPanel
			   ],
			   modal:true,
			   height:500
			},this.windowOptions)).show();		
	}
});

Ext.preg(gxp.plugins.ComplainButton.prototype.ptype, gxp.plugins.ComplainButton);