<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" itemtype="http://schema.org/Organization" >
<head>
	<meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
	<title>Virtual Fly Brain: ${param.title}</title>
	<link rel="icon" href="/favicon.ico">

	<meta name="keywords" content="virtual fly brain atlas, interactive fly brain, Drosophila, fruit fly,  brain atlas, neuron search, neuropil search, phenotype search, gene expression" />

		<!-- START Google Snippit code -->
			<meta itemprop="name" content="Virtual Fly Brain">
			<meta itemprop="description" content="Integrative queries of Drosophila neuroanatomical data.">
			<meta itemprop="image" content="http://www.virtualflybrain.org/images/vfb/project/cluster_eg.png">
		<!-- END Google Snippit code -->

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>

		<!-- https://github.com/CWSpear/bootstrap-hover-dropdown -->
		<script src="/javascript/thirdParty/bootstrap-hover-dropdown.min.js"></script>

  	<c:forEach items="${fn:split(param.css, ';')}" var="item">
  		<link rel="stylesheet" href="${item}" />
  	</c:forEach>

		<c:forEach items="${fn:split(param.js, ';')}" var="item">
			<script src="${item}"></script>
  	</c:forEach>


</head>
<body>
  <jsp:include page="/jsp/includes/js/tag.jsp" />
  <c:if test="${empty param.nonav}">
		<jsp:include page="/jsp/includes/bits/head.jsp"/>
	</c:if>


	<div class="container-fluid">
	<!--  Closing tag is in homeFoot.js -->
