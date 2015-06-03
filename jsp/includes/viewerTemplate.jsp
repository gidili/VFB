<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="meta_root">${(empty param.meta_root)?"/data/flybrain/":param.meta_root}</c:set>
<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="title" value="Virtual Fly Brain: ${param.title}" />
	<jsp:param name="css" value="
		" />
	<jsp:param name="js" value="
		/javascript/ajax-solr/vfb.js;
		/javascript/ajax-solr/core/Core.js;
		/javascript/ajax-solr/core/AbstractManager.js;
		/javascript/ajax-solr/managers/Manager.jquery.js;
		/javascript/ajax-solr/core/Parameter.js;
		/javascript/ajax-solr/core/ParameterStore.js;
		/javascript/ajax-solr/core/AbstractWidget.js;
		/javascript/ajax-solr/widgets/ResultWidget.js;
		/javascript/ajax-solr/widgets/jquery/PagerWidget.js;
		/javascript/ajax-solr/core/AbstractFacetWidget.js;
		/javascript/ajax-solr/widgets/TagcloudWidget.js;
		/javascript/ajax-solr/widgets/CurrentSearchWidget.js;
		/javascript/ajax-solr/core/AbstractTextWidget.js;
		/javascript/ajax-solr/widgets/AutocompleteWidget.js;
		/javascript/thirdParty/json2.js;
		/javascript/vfb/wlziip.js;
		" />
</jsp:include>

<script>
	$(document).ready(function() {
		var ids = "";
		initWlzDisplay(ids);
	});
</script>

<div class="row">

	<div class="span2" id="left-panel"></div>

	<div class="span8" id="contentwrapper">
		<div class="well" id="center_panel">
			<div id="emapIIPViewerDiv" style="overflow-y:auto; overflow-x:auto">
				<canvas id="canvas" style="width: 1024px; height: 681px; display: block;"></canvas>
				<script>
					$(document).ready(function() {
						animateWlzDisplay();
					});
				</script>
			</div>
		</div>
	</div>

	<div class="span2" id="right-panel">
		<div id="toolContainerDiv">
			<!-- We presume that for third party stacks with proper credits the param.json will be used-->
			<c:if test="${empty param.json}">
				<jsp:include page="/jsp/includes/bits/credits.jsp" />
			</c:if>
			<c:if test="${!empty param.json}">
				<jsp:include page="/jsp/includes/bits/credits3party.jsp">
					<jsp:param name="tpb" value="${param.tpb}" />
				</jsp:include>
			</c:if>
		</div>
	</div>



</div>

	<div id="footer">
		<div id="annotation">
			<!-- Need this to get the context menu on the term info box working, see span above -->
			<div id="annotation_content">
				<!-- <h2 class="panel_header">Annotation for Selected Node</h2> -->
				Click anywhere on the stack viewer or on any node of the
				tree to select a domain.<br/><br/>
				Annotations for the selected anatomical term will be displayed here, with further query options visible after selection.<br/><br/>
				<b>Tip: </b> To keep your current domain/tree selection, open links in a new tab. Right/control click and select "Open link in new tab".
			</div>
		</div>
	</div>

<jsp:include page="/jsp/includes/homeFoot.jsp" />
