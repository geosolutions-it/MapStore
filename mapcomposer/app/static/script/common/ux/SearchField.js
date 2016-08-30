/*
 *  Copyright (C) 2015 GeoSolutions S.A.S.
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
Ext.ns("MapStore.ux");

/**
* SearchField to be used on a Store.
*/
MapStore.ux.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        MapStore.ux.SearchField.superclass.initComponent.call(this);
        
        this.paramNames = Ext.applyIf(this.paramNames || {}, this.defaultParamNames);
        
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query', // kept for backward compatibility, this widget can be used
    // Replica of the default Store defaultParamNames and paramNames parameters
    // Extended with 'query' parameter
    defaultParamNames: {start: 'start', limit: 'limit', sort: 'sort', dir: 'dir', query: 'query'},
    /**
     *   {
     *       start : 'start',  // The parameter name which specifies the start row
     *       limit : 'limit',  // The parameter name which specifies number of rows to return
     *       sort : 'sort',    // The parameter name which specifies the column to sort on *not yet implemented*
     *       dir : 'dir'       // The parameter name which specifies the sort direction *not yet implemented*
     *       query : 'query'   // The parameter name which specifies the keywork to search for
     *   }
     */
    paramNames : {start: 'start', limit: 'limit', sort: 'sort', dir: 'dir', query: 'query'},

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            var o = {};
            if(this.paramNames && this.paramNames.start){
                o[this.paramNames.start] = 0;
            }else{
                // Backward compatibility
                o = {start: 0};
            }
            this.store.baseParams = this.store.baseParams || {};
            if(this.paramNames && this.paramNames.query){
                this.store.baseParams[this.paramNames.query] = '';
            }else{
                // Backward compatibility
                this.store.baseParams[this.paramName] = '';
            }
            this.store.reload({params:o});
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
        var o = {};
        if(this.paramNames && this.paramNames.start){
            o[this.paramNames.start] = 0;
        }else{
            // Backward compatibility
            o = {start: 0};
        }
        this.store.baseParams = this.store.baseParams || {};
        if(this.paramNames && this.paramNames.query){
            this.store.baseParams[this.paramNames.query] = v;
        }else{
            // Backward compatibility
            this.store.baseParams[this.paramName] = v;
        }
        this.store.reload({params:o});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});