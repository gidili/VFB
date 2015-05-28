<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil"%>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="title" value="${cleanTitle}" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Query Results@ " />
	<jsp:param name="css" value="
		//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css;
		//cdn.datatables.net/responsive/1.0.6/css/dataTables.responsive.css;
		//cdn.datatables.net/tabletools/2.2.4/css/dataTables.tableTools.css;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.css;
	" />
	<jsp:param name="js" value="
		//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js;
		//cdn.datatables.net/responsive/1.0.6/js/dataTables.responsive.min.js;
		//cdn.datatables.net/tabletools/2.2.4/js/dataTables.tableTools.min.js;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.js;
	" />
</jsp:include>

<div class="row">
	<div class="col-xs-12">
		<div class="row">
			<div class="container-fluid" align="center">
				<h2>Query: ${query}</h2>
			</div>
		</div>
		<div class="container-fluid">
			<table id="resultsTable" class="display" width="100%">
	    	<thead>
	        <tr>
							<th>ID</th>
	            <th>Name</th>
	            <th>Definition</th>
							<th>Preview</th>
							<th>Source</th>
							<th>Type</th>
							<th>Driver</th>
	        </tr>
	    	</thead>
		    <tbody>
					<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
						<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
						<c:set var="types" value="${ontBean.types}" />
						<tr>
							<td>
								<a href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" class="text-muted">${ontBean.fbbtIdAsOWL}</a></td>
							<td>
									<c:choose>
										<c:when test="${!empty tpb}">
											<a href="/site/tools/view_stack/3rdPartyStack.htm?tpbid=${tpb.vfbId}" class="text-success">${ontBean.name}</a>
										</c:when>
										<c:otherwise>
											<a href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" class="text-info">${ontBean.name}</a>
										</c:otherwise>
									</c:choose>
							</td>
							<td class="text-muted">${ontBean.def}</td>
							<td>
								<c:if test="${!empty tpb}">
									<a href="/site/tools/view_stack/3rdPartyStack.htm?tpbid=${tpb.vfbId}" title="See in viewer">
										<img class="lazy" data-original="${tpb.thumbUrl}" alt="http://www.virtualflybrain.org/owl/${tpb.vfbId}" />
									</a>
								</c:if>
							</td>
							<td>
								<c:if test="${!empty tpb}">
									<a href="${tpb.baseUrl}${tpb.remoteId}" title="View original ${tpb.sourceName} entry" target="_new" class="btn-sm btn-warning">${tpb.sourceName}</a>
								</c:if>
							</td>
							<td>
								<c:if test="${!empty types}">
									<c:forEach items="${types}" var="item" varStatus="stat">
										<a href="/site/tools/anatomy_finder/index.htm?id=${item.key}" title="View ${item.value} entry" target="_top" class="btn-sm btn-success">${item.value}</a><c:if test="${!stat.last}">,</c:if>
										<br/>
									</c:forEach>
								</c:if>
							</td>
							<td>
									<c:set var="driverDetails" value='${drivers[ontBean.fbbtIdAsOWL]}'/>
									<a href="http://flybase.org/reports/${driverDetails[0]}.html" target="_new" class="btn-sm btn-info">${driverDetails[1]}</a>
							</td>
						</tr>
					</c:forEach>
		    </tbody>
			</table>
		</div>
		<script>
			$(document).ready( function () {
				var table = $('#resultsTable').DataTable( {
					paging: true,
					searching: true,
					ordering: true,
					responsive: true,
					stateSave: true,
					"order": [[ 0, "desc" ]]
				} );
				var tt = new $.fn.dataTable.TableTools( table );
				$( tt.fnContainer() ).insertBefore('div.dataTables_wrapper');
				window.setInterval(function(){
					$('div.DTTT.btn-group').addClass('table_tools_group').children('a.btn').each(function () {
							$(this).addClass('btn-sm btn-default btn-primary');
							$(this).children('div').each(function () {
								$(this).attr('style', 'position: absolute; left: 0px; top: 0px; width: 48px; height: 32px; z-index: 99;');
							});
					});
				}, 200);
			} );
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
