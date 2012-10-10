/*
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
 * Class: CSWCatalogChooser
 * Widget di tipo combobox per scegliere un catalogo dalla lista dei cataloghi disponibili.
 * 
 * Inherits from:
 *  - <Ext.form.ComboBox>
 *  
 */
CSWCatalogChooser = Ext.extend(Ext.form.ComboBox, {


	/**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
    
	/**
	 * Property: labelWitdh
     * {number} dimensione della Label
	 */ 
	labelWitdh : 30,
	
	/**
	 * Property: name
     * {number} nome associato al componente Extjs
	 */ 
	name : "catalog",
	
	/**
	 * Property: allowBlank
     * {boolean} se true viene permesso che nella combobox ci sia
	 *			 un valore nullo
	 */
	allowBlank : true,
	/**
	 * Property: disabled
     * {boolean} se true il componente risulta disabilitato
	 *			 un valore nullo
	 */
	disabled : false,
	/**
	 * Property: fieldLabel
     * {string} Testo Label della combobox
	 */ 
	fieldLabel : null,
	/**
	 * Property: emptyText
     * {string} Testo da mostrare quando la combobox e' vuota
	 */ 
	emptyText : null,
	/**
	 * Property: mode
     * {string}  se *"local" i possibili valori vengono caricati dallo store all'avvio. Se *"remote"* vengono caricati al click.
	 *			 
	 */
	mode : "local",
	/**
	 * Property: triggerAction 
     * {string}  Azione da effettuare al trigger
	 *			 
	 */
	triggerAction : "all",
	
	/**
	 * Property: forceAction 
     * {boolean} se true il valore all'interno del componente deve essere uno di quelli predefiniti.
	 *			 se false il valore puo essere editato dall'utente		 
	 */
	forceSelection : true,
	/**
	 * Property: displayField
     * {string}  nome del campo dell'elemento all'interno dello store da mostrare 
	 */
	displayField : "name",
	/**
	 * Property: ValueField
     * {string}  nome del campo dell'elemento dello store da utilizzare come valore del componente 
	 */
	valueField : "url",

	/**
	 * Property: editable
     * {boolean}  editabilita' del campo
	 */
	editable : false,
	
	/**
	 * Property: resizable
     * {boolean}  ridimensionabilita' del menu
	 */
	resizable : true,
	
    events: [
        /**
         * Event: selectsupported 
         * Evento scatenato nel caso in cui la GetCapabilities abbia dato esito positivo 
         * In questo caso la ricerca viene permessa.
         */ 
        "selectsupported",
    
        /**
         * Event: selectunsupported 
         * Evento scatenato nel caso in cui la GetCapabilities abbia dato esito negativo, nel caso
         * quindi di incompatibilita' tra versioni o assenza del servizio CSW. In questo caso la 
         * ricerca viene impedita, in quanto il server non risponderebbe correttamente.
         */ 
        "selectunsupported",
        /**
         * Event: selectiunknownsupport 
         * Evento scatenato nel caso in cui la GetCapabilities sia stata possibile, e quindi non
         * e'possibile di verificare la compatibilita' con l'applicazione.
         * In questo caso la ricerca viene permessa ( e visualizzata una warning ).
         */ 
        "selectiunknownsupport"
    ],
    listeners:{
    
        /** 
         * Method: select
         * all'evento select viene effettuata una richiesta alla getCapabilities del server per 
         * per verificare la compatibilita' con la versione del protocollo csw. Questa 
         * funzione scatena gli eventi <selectsupported> e <selectunsupported> .
         *
         */
        select: function(combo,record,index) {
           
           var catalogUrl=record.data.url;
           var url="";
           //build URL in "XDProxy present" case
           if(this.XDProxy){
                url= this.XDProxy.url + "?" + this.XDProxy.callback + "=" 
                        + encodeURIComponent(
                                catalogUrl 
                                + "?"
                                + "Request=GetCapabilities"
                                + "&SERVICE=CSW"
                                + "&Section=ServiceIdentification"
                                + "&outputformat=application/xml"
                                + "&AcceptVersions=" + this.cswVersion
                        );
            //build url without XDProxy
            }else{
                url =   catalogUrl 
                        + "?Request=GetCapabilities"
                        +"&SERVICE=CSW"
                        +"&Section=ServiceIdentification"
                        +"&outputformat=application/xml"
                        +"&AcceptVersions=" +this.cswVersion;
            }
           
           Ext.Ajax.request({
                url: url ,
                scope: this,
                method: "GET",
                timeout: 10000,
                //CASE 200 OK
                success : function(response, request) {
				
                    //case of OWS exception
                    if( response.responseText.indexOf("ows:ExceptionReport") > 0 ){
                        //Version problem
                        if( response.responseText.indexOf("VersionNegotiationFailed") >0 ){
                            Ext.Msg.show({
                                title: i18n.getMsg("serverError.catalogCompatibilityProblem"),
                                msg: i18n.getMsg("serverError.unsupportedVersion")+ "("+ this.cswVersion + ")",
                                width: 300,
                                icon: Ext.MessageBox.ERROR
                            });
                            combo.fireEvent("selectunsupported",i18n.getMsg("serverError.unsupportedVersion")+ "("+ this.cswVersion + ")");
                        //Unsupported
                        }else if( response.responseText.indexOf("InvalidParameterValue") >0 && response.responseText.indexOf("locator=\"service\"")) {
                            Ext.Msg.show({
                                title: i18n.getMsg("serverError.catalogCompatibilityProblem"),
                                msg: i18n.getMsg("serverError.CSWNotAvaible"),
                                width: 300,
                                icon: Ext.MessageBox.ERROR
                            });
                            combo.fireEvent("selectunsupported",i18n.getMsg("serverError.CSWNotAvaible"));
                        //getCapabilities not avaible
                        }else if ( response.responseText.indexOf("exceptionCode=\"NoApplicableCode\"") ){
                           Ext.Msg.show({
                                title: i18n.getMsg("serverError.compatibilityInfo"),
                                msg: i18n.getMsg("serverError.unableToTestCapabilities"),
                                width: 300,
                                icon: Ext.MessageBox.WARNING
                            }); 
                            combo.fireEvent("selectiunknownsupport",i18n.getMsg("serverError.unableToTestCapabilities"));
                        }
                    //CASE Capabilities tag NOT founded    
                    }else if( !(response.responseText.indexOf("csw:Capabilities") > 0) ){
                         Ext.Msg.show({
                            title: i18n.getMsg("serverError.standardCompatibility"),
                            msg:  i18n.getMsg("serverError.unknownResponse"),
                            width: 300,
                            icon: Ext.MessageBox.ERROR
                         });
                         
                        combo.fireEvent("selectunsupported",i18n.getMsg("serverError.unknownResponse"));
                    //Case Capabilities tag founded
                    }else{
                        var msg=combo.store.getAt(index).data.description;
                        combo.fireEvent("selectsupported",msg);
                    }
                },
                //CASE 401 402 timeout etc..
                failure : function(response, request) {
                    //Timeout case
                    if(response.isTimeout && response.isTimeout==true){//TimeOut
                        Ext.Msg.show({
                            title: i18n.getMsg("timeout.title"),
                            msg: i18n.getMsg("timeout.description"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR 
                        });
                        combo.fireEvent("selectunsupported");
                    //other errors case
                    }else{
                        Ext.Msg.alert(i18n.getMsg("serverError.title"), i18n.getMsg("serverError.invalid")+ "<br/> Status:"+response.status);
                        combo.fireEvent("selectunsupported",i18n.getMsg("serverError.invalid")+ "<br/> Status:"+response.status);
                    }
                
                }         
           }); 
		}
    },

	/**
	 * Method: initParameters
	 * catalogs - {Array} cataloghi da cui scegliere. il formato degli elementi e' del tipo
	 * { *name:* "nome" , *url:* "url_catalogo_csw", *description:* "descrizione opzionale" } 
	 *  
	 */
	initParameters: function (catalogs) {
		
		this.store = new Ext.data.JsonStore({
			mode: "local",
			data: catalogs,
			autoLoad: true,
			remoteSort: false,
			fields: ["name", "url", "description","metaDataOptions"],
			sortInfo: {field: "name", direction: "ASC"}            	
		});
        this.addEvents(this.events);
	},
	getSelectedIndex: function() {
		var v = this.getValue();
		var r = this.findRecord(this.valueField || this.displayField, v);
		return(this.store.indexOf(r));
	}
});


