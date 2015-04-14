Ext.namespace("GeoExt.data");



GeoExt.data.AddressProxy = function(conn){
    GeoExt.data.AddressProxy.superclass.constructor.call(this, conn);
};

Ext.extend(GeoExt.data.AddressProxy, Ext.data.HttpProxy, {
    doRequest : function(action, rs, params, reader, cb, scope, arg) {
        var  o = {
            request: {
                callback : cb,
                scope : scope,
                arg : arg
            },
            reader: reader,
            callback : this.createCallback(action, rs),
            scope: this
        };

        o.params = {};
        this.conn.url = this.url + '?Address=' + encodeURIComponent(params.query);

        Ext.applyIf(o, this.conn);

        // If a currently running read request is found, abort it
        if (action == Ext.data.Api.actions.read && this.activeRequest[action]) {
            Ext.Ajax.abort(this.activeRequest[action]);
        }
		// /////////////////////////////////////
		// Perform a GET Ajax request to the Address Service
		// /////////////////////////////////////
        this.activeRequest[action] = Ext.Ajax.request(o);

    }
});