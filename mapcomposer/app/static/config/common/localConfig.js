/** This file contains the common configuration options 
 *  that can be overridden by the serverConfig objects in templates */
var localConfig = {
 geoStoreBase:"http://cip-pakistan.geo-solutions.it/geostore/rest/",
 adminUrl: "http://cip-pakistan.geo-solutions.it/opensdi2-manager/",
   proxy:"/http_proxy/proxy/?url=",
   loginDataStorage : sessionStorage,
   defaultLanguage: "en",
    header: {
    container: {
        border: false,
        header: false,
        collapsible: true,
        collapsed: false,
        collapseMode:  'mini',
        hideCollapseTool: true,
        split: true,
        animCollapse : false,
        minHeight: 90,
        maxHeight: 90,
        height: 109,
        id : 'header'
    }, 
   
    html: ['<div align="center" style="background-image:url(theme/app/img/banner/bgimg.jpg);background-repeat: repeat;width:100%;height:100%">',
                        '<img  src="theme/app/img/banner/left-banner_en.jpg" style="float:left" usemap="#IM_left-banner"/>',
                        '<img  src="theme/app/img/banner/right-banner_en.jpg" style="float:right;position:absolute;top:0px;right:0px;" usemap="#IM_right-banner"/>',
                    '</div>',
                    '<map name="IM_left-banner">',
                        '<area shape="rect" coords="19,19,393,44" href="http://dwms.fao.org/~test/home_en.asp"  target="_blank" alt="Pakistan Agriculture Information System" title="Pakistan Agriculture Information System"    />',
                    '</map>',
                    '<map name="IM_right-banner">',
                        '<area shape="rect" coords="330,23,382,83" href="http://www.fao.org"  target="_blank" alt="Food and Agriculture Organization of the United Nations" title="Food and Agriculture Organization of the United Nations"    />',
                        '<area shape="rect" coords="274,23,325,83" href="http://www.usda.gov/wps/portal/usda/usdahome"  target="_blank" alt="U.S. Department of Agriculture" title="U.S. Department of Agriculture"    />',
                        '<area shape="rect" coords="205,23,268,83" href="http://www.umd.edu/"  target="_blank" alt="University of Maryland" title="University of Maryland"    />',
                        '<area shape="rect" coords="142,23,204,83" href="http://www.suparco.gov.pk/"  target="_blank" alt="SUPARCO - Pakistan Space and Upper Atmosphere Research Commission" title="SUPARCO - Pakistan Space and Upper Atmosphere Research Commission"    />',
                        '<area shape="rect" coords="85,23,141,83" href="http://www.sindhagri.gov.pk/"  target="_blank" alt="SINDH Province" title="SINDH Province"    />',
                        '<area shape="rect" coords="17,23,80,83" href="http://www.agripunjab.gov.pk/"  target="_blank" alt="PUNJAB Province" title="PUNJAB Province"    />',
                    '</map>']
  }

};

