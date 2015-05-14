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
		/css/vfb/utils/help.css;//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.css;
		//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css;
		//cdn.datatables.net/responsive/1.0.6/css/dataTables.responsive.css;
		//cdn.datatables.net/tabletools/2.2.4/css/dataTables.tableTools.css;
		//cdn.datatables.net/fixedheader/2.1.2/css/dataTables.fixedHeader.css;
	" />
	<jsp:param name="js" value="
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.js;
		//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js;
		//cdn.datatables.net/responsive/1.0.6/js/dataTables.responsive.min.js;
		//cdn.datatables.net/tabletools/2.2.4/js/dataTables.tableTools.min.js;
		//cdn.datatables.net/fixedheader/2.1.2/js/dataTables.fixedHeader.min.js;
	" />
</jsp:include>

<script type="text/javascript">
	function formSubmit() {
		alert(document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value);
		var value = document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value;
		window.open("?<%=request.getQueryString()%>&perPage=" + value, "_self");
	}
</script>


<%-- <div id="example_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"> --%>
<div class="row">
	<div class="col-md-12">
		<div class="row">
			<div class="col-xs-6" align="center">
				<h2>Query: ${query}</h2>
			</div>
			<div class="col-xs-6">
				<a id="csv" style="float: right; margin-right: 10px"
					href="/do/csv_report.html?type=${type}&filename=${fileName}">
					<span class="glyphicon glyphicon-save-file"></span>Save as CSV
				</a>
			</div>
		</div>
		<div class="container">
			<table id="resultsTable" class="display" style="width:100%;">
	    	<thead>
	        <tr>
							<th>ID</th>
	            <th>Name</th>
	            <th>Definition</th>
							<th>Query VFB</th>
							<th>Query FlyBase</th>
	        </tr>
	    	</thead>
		    <tbody>
					<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
		        <tr>
		            <td>${ontBean.fbbtId}</td>
		            <td>${ontBean.name}</td>
								<td>${ontBean.def}</td>
								<td>http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtId}</td>
								<td>http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}</td>
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
					ordering:  true,
					responsive: true,
					aoColumns:[
						null,null,null,
						{ "fnRender": function (oObj) {
						    return '<a class="label label-success" href=' + oObj.aData[0] + '>' + 'More info' + '</a>';
						  }
						},
						{ "fnRender": function (oObj) {
								return '<a class="label label-info" href=' + oObj.aData[0] + ' target="_new">' + 'FlyBase Report' + '</a>';
							}
						},
	        ],
				} );
				var tableTools = new $.fn.dataTable.TableTools( table, {
		        "buttons": [
		            "copy",
		            "csv",
		            "xls",
		            "pdf",
		            { "type": "print", "buttonText": "Print me!" }
		        ]
		    } );

		    $( tableTools.fnContainer() ).insertAfter('div.info');
	    	new $.fn.dataTable.FixedHeader( table );
			} );
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
