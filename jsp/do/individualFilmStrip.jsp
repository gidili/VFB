<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<div class="content-fluid" id="imagesCaro">
	<c:if test="${!empty ontBeanList}">
		<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
		<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
		<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

		<div id="exampleImages${fn:replace(region, ":", "_")}" class="carousel slide" data-ride="carousel" style="width: 300px;">
			<c:if test="${fn:length(ontBeanList) > 1}">
				<ol class="carousel-indicators">
					<li data-target="#exampleImages${fn:replace(region, ":", "_")}" data-slide-to="0" class="active"></li>
					<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
						<c:if test="${status.index < showMax && status.index > 0}">
		    			<li data-target="#exampleImages${fn:replace(region, ":", "_")}" data-slide-to="${status.index}"></li>
						</c:if>
					</c:forEach>
		  	</ol>
			</c:if>
			<!-- Wrapper for slides -->
			<div class="carousel-inner">
				<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
					<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
					<c:if test="${status.index < showMax}">
						<div class="${status.index eq 0 ? 'item active':'item'}">
							<a href="/owl/${tpb.vfbId}" target="_top">
							<img class="lazy" src="${tpb.thumbUrl}" alt="">
							<div class="carousel-caption" style="bottom:-30px;opacity: 0.6;">
				        <b>${ontBean.name}</b>
								<span class="small">${tpb.vfbId}</span>
							</div>
						</div>
					</c:if>
				</c:forEach>
			</div>
			<c:if test="${fn:length(ontBeanList) > 1}">
				<!-- Left and right controls -->
				<a class="left carousel-control" href="#exampleImages${fn:replace(region, ":", "_")}" role="button" data-slide="prev">
			    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
		  	</a>
			  <a class="right carousel-control" href="#exampleImages${fn:replace(region, ":", "_")}" role="button" data-slide="next">
			    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			  </a>
			</c:if>
		</div>
		<c:if test="${fn:length(ontBeanList) > showMin || fn:length(ontBeanList) > (showMax - 1)}">
			<a id="queryLink"  class="btn btn-success btn-sm" href="/do/individual_list.html?action=exemplar_neuron&id=${region}" alt="Query all" style="padding-left:210px;">Found <span class="badge">${fn:length(ontBeanList)}</span></a>
		</c:if>
	</c:if>
	<c:if test="${empty ontBeanList}">
		<a id="queryLink" class="btn btn-danger btn-sm" href="/do/individual_list.html?action=exemplar_neuron&id=${region}" alt="Query all">Found <span class="badge">0</span></a>
	</c:if>
</div>
