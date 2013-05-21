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
 * Class: CSWAddCatalogs
 * This widget is used to add new CSW catalogs
 * 
 * Inherits from:
 *  - <Ext.Window>
 *
 */
CSWAddCatalogs = Ext.extend(Ext.Window, {

    /** 
     *  Property: title
     *  {string} Titolo della window
     */
    title: null,

    /** 
     * Property: bodyStyle
     * {string} Di default il bodyStyle è settato su padding = 0px
     */
    bodyStyle: "padding: 0px",

    /** 
     * Property: width
     * {number}  L'altezza di default della finestra
     */
    width: 300,

    /** 
     * Property: closeAction
     * {string} Per default closeAction è 'hide'
     */
    closeAction: 'hide',

    /** 
     * Property: error
     * {strin} Il messaggio di errore, pep esempio quando una richiesta fallisce
     */
    error: null,
    
    /** 
     * Property: resizable
     * {boolean} se false la finestra non è ridimensionabile
     */
    resizable : false,
    
    /** 
     * Property: urlRegExp
     *  `RegExp`
     *
     *  We want to allow protocol or scheme relative URL  
     *  (e.g. //example.com/).  We also want to allow username and 
     *  password in the URL (e.g. http://user:pass@example.com/).
     *  We also want to support virtual host names without a top
     *  level domain (e.g. http://localhost:9080/).  It also makes sense
     *  to limit scheme to http and https.
     *  The Ext "url" vtype does not support any of this.
     *  This doesn't have to be completely strict.  It is meant to help
     *  the user avoid typos.
     *
     */
    urlRegExp: /^(http(s)?:)?\/\/([\w%]+:[\w%]+@)?([^@\/:]+)(:\d+)?\//i,    

    /** 
     * Method: initComponent
     * Metodo che inizializza la finestra per l'inserimento del nuovo catalogo CSW
     *
     */
    initComponent: function() {
        
        this.title = i18n.getMsg("addCatalogs.title"),
        
        this.addEvents("catalog-added");

        this.urlTextField = new Ext.form.TextField({
            fieldLabel: "URL",
            allowBlank: false,
            width: 240,
            msgTarget: "under",
            validator: this.urlValidator.createDelegate(this)
        });

        this.form = new Ext.form.FormPanel({
            items: [
                this.urlTextField
            ],
            border: false,
            labelWidth: 30,
            bodyStyle: "padding: 5px",
            autoWidth: true,
            autoHeight: true
        });

        this.bbar = [
            new Ext.Button({
                text: i18n.getMsg("addCatalogs.cancelText"),
                handler: function() {
                    this.hide();
                },
                scope: this
            }),
            new Ext.Toolbar.Fill(),
            new Ext.Button({
                text: i18n.getMsg("addCatalogs.addServerText"),
                iconCls: "add",
                handler: function() {
                    // Clear validation before trying again.
                    this.error = null;
                    if (this.urlTextField.validate()) {
                        this.fireEvent("catalog-added", this.urlTextField.getValue());
                    }
                },
                scope: this
            })
        ];

        this.items = this.form;

        CSWAddCatalogs.superclass.initComponent.call(this);

        this.form.on("render", function() {
            this.loadMask = new Ext.LoadMask(this.form.getEl(), {msg:i18n.getMsg("addCatalogs.contactingServerText")});
        }, this);

        this.on("hide", function() {
            // Reset values so it looks right the next time it pops up.
            this.error = null;
            this.urlTextField.validate(); // Remove error text.
            this.urlTextField.reset();
            this.loadMask.hide();
        }, this);

    },
    
    /** 
        Method: urlValidator
     *  :arg url: `String`
     *  :returns: `Boolean` The url looks valid.
     *  
     *  This method checks to see that a user entered URL looks valid.  It also
     *  does form validation based on the `error` property set when a response
     *  is parsed.
     *
     */
    urlValidator: function(url) {
        var valid;
        if (!this.urlRegExp.test(url)) {
            valid = i18n.getMsg("addCatalogs.invalidURLText");
        } else {
            valid = !this.error || this.error;
        }
        // clear previous error message
        this.error = null;
        return valid;
    },

    /** 
     * Method: setLoading
     * Visually signify to the user that we're trying to load the service they 
     * requested, for example, by activating a loadmask.
     *
     */
    setLoading: function() {
        this.loadMask.show();
    },

    /** 
     * Method: setError 
     * :param: error the message to display
     *
     * Display an error message to the user indicating a failure occurred while
     * trying to load the service.
     *
     */
    setError: function(error) {
        this.loadMask.hide();
        this.error = error;
        this.urlTextField.validate();
    }
});