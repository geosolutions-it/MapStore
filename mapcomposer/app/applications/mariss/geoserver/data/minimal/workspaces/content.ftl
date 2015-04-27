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
  <th >${attribute.name}</th><td>${attribute.value}</td></tr>
    </#if>
  </#list>
  </table>
</#list>

<br/>