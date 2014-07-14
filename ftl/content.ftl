

<#assign odd = false>
<#list features as feature>
  
<table class="featureInfo">
  <caption class="featureInfo">${type.name}</caption>

  <#list feature.attributes as attribute>
    <#if !attribute.isGeometry>
      <#if odd>
		<tr class="odd">
	  <#else>
		<tr>
	  </#if>
      <#assign odd = !odd>
      <th >${attribute.name}</th><td>${attribute.value}</td>
      <#if attribute.name=="sede_tecnica">
        <td><a href="#" onclick="if( window.clipboardData && clipboardData.setData ){clipboardData.setData('Text','${attribute.value}' );}else{window.prompt('Copia: Ctrl+C,Enter','${attribute.value}')}">Copy</a></td>
       </#if>
      </tr>
    </#if>
  </#list>
  </table>
</#list>
