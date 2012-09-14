/**
 * Copyright (c) 2008-2011 The Open Planning Project
 * 
 * Published under the BSD license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/** api: (define)
 *  module = gxp.menu
 *  class = LayerMenu
 *  base_link = `Ext.menu.Menu <http://extjs.com/deploy/dev/docs/?class=Ext.menu.Menu>`_
 */
Ext.namespace("gxp.menu");

/** api: constructor
 *  .. class:: LayerMenu(config)
 *
 *    A menu to control layer visibility.
 */   
gxp.menu.LayerMenu = Ext.extend(Ext.menu.Menu, {
    
    /** api: config[layerText]
     *  ``String``
     *  Text for added layer (i18n).
     */
    layerText: "Layer",
    
    /** api: config[layers]
     *  ``GeoExt.data.LayerStore``
     *  The store containing layer records to be viewed in this menu.
     */
    layers: null,
    
    /** private: method[initComponent]
     *  Private method called to initialize the component.
     */
    initComponent: function() {
        gxp.menu.LayerMenu.superclass.initComponent.apply(this, arguments);
        this.layers.on("add", this.onLayerAdd, this);
        this.onLayerAdd();
    },

    /** private: method[onRender]
     *  Private method called during the render sequence.
     */
    onRender : function(ct, position) {
        gxp.menu.LayerMenu.superclass.onRender.apply(this, arguments);
    },

    /** private: method[beforeDestroy]
     *  Private method called during the destroy sequence.
     */
    beforeDestroy: function() {
        if (this.layers && this.layers.on) {
            this.layers.un("add", this.onLayerAdd, this);
        }
        delete this.layers;
        gxp.menu.LayerMenu.superclass.beforeDestroy.apply(this, arguments);
    },
    
    /** private: method[onLayerAdd]
     *  Listener called when records are added to the layer store.
     */
    onLayerAdd: function() {
        this.removeAll();
        // this.getEl().addClass("gxp-layer-menu");
        // this.getEl().applyStyles({
        //     width: '',
        //     height: ''
        // });
        this.add(
            {
                iconCls: "gxp-layer-visibility",
                text: this.layerText,
                canActivate: false
            },
            "-"
        );
        
		var layerGroupsNode = {},	//layers menu group title
			layerGroups = {};	//for grouping layers menu
		
        this.layers.each(function(record) {

		    var group = record.get("group")==undefined ? 'Default' : record.get("group"),
		    	layer = record.getLayer();
            
            if(layer.displayInLayerSwitcher) {

                var item = new Ext.menu.CheckItem({
                	hideOnClick: false,
                    text: record.get("title"),
                    checked: record.getLayer().getVisibility(),
					group: record.get("group") != 'background' ? undefined : 'background',
					groupname: record.get("group"),
					layer: layer,
					style: record.get("group") != 'background' ? {marginLeft:'22px', border:'none'} : {border:'none'},
                    listeners: {
                        checkchange: function(item, checked) {
                            item.layer.setVisibility(checked);
							var gcheck=false;
                            for(var g in layerGroups[item.groupname])//check all items status
                            {
                            	if(layerGroups[item.groupname][g].checked) {
                            		gcheck = true;
                            		break;
                            	}
                            }
                            layerGroupsNode[item.groupname].setChecked(gcheck);
                        }
                    }
                });
                
				if(!layerGroups[group])
					layerGroups[group]= [];

				layerGroups[group].push( item );
            }
        }, this);	//end each

        for(var g in layerGroups)	//fill menu
        {
			if(g != 'background')
			{
				var gmenu = new Ext.menu.CheckItem({
					hideOnClick: false,
					text: g,
					checked: true,
					//group: g,
					layers: layerGroups[g],
					listeners: {
						checkchange: function(item, checked) {
							var glayers = item.layers;
	                        //console.log(item.text);
							for(var l in glayers)
							{
								try{
									glayers[l].layer.setVisibility(checked);
									glayers[l].setChecked(checked);
								}catch(e){
									console.log(glayers[l]);
								} 
							}
						}
					}
				});
				layerGroupsNode[g]= gmenu;
				this.add( gmenu );
			}
			this.add( layerGroups[g] );
			this.addSeparator();//or menu.TextItem
        }
    }
    
});

Ext.reg('gxp_layermenu', gxp.menu.LayerMenu);

