<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
G.setOnSelectionOptions({unselected_transparent:false});

GEPPETTO.ControlPanel.setColumnMeta([ { "columnName": "path", "order": 1, "locked": false, "visible": true, "displayName": "Path", "source": "$entity$.getPath()" }, { "columnName": "name", "order": 2, "locked": false, "visible": true, "displayName": "Name", "source": "$entity$.getName()" }, { "columnName": "type", "order": 3, "locked": false, "visible": true, "customComponent": GEPPETTO.ArrayComponent, "displayName": "Type(s)", "source": "$entity$.getTypes().map(function (t) {return t.getPath()})" }, { "columnName": "controls", "order": 4, "locked": false, "visible": true, "customComponent": GEPPETTO.ControlsComponent, "displayName": "Controls", "source": "" }, { "columnName": "image", "order": 5, "locked": false, "visible": true, "customComponent": GEPPETTO.ImageComponent, "displayName": "Image", "cssClassName": "img-column", "source": "GEPPETTO.ModelFactory.getAllVariablesOfMetaType($entity$.$entity$_meta.getType(), 'ImageType')[0].getInitialValues()[0].value.data" } ]);
GEPPETTO.ControlPanel.setColumns(['name', 'type', 'controls', 'image']);

colours = ["0x00ff00","0xff00ff","0x0000ff","0xffd300","0x0084f6","0x008d46","0xa7613e","0x4f006a","0x00fff6","0x3e7b8d","0xeda7ff","0xd3ff95","0xb94fff","0xe51a58","0x848400","0x00ff95","0x61002c","0xf68412","0xcaff00","0x2c3e00","0x0035c1","0xffca84","0x002c61","0x9e728d","0x4fb912","0x9ec1ff","0x959e7b","0xff7bb0","0x9e0900","0xffb9b9","0x8461ca","0x9e0072","0x84dca7","0xff00f6","0x00d3ff","0xff7258","0x583e35","0x003e35","0xdc61dc","0x6172b0","0xb9ca2c","0x12b0a7","0x611200","0x2c002c","0x5800ca","0x95c1ca","0xd39e23","0x84b058","0xe5edb9","0xf6d3ff","0xb94f61","0x8d09a7","0x6a4f00","0x003e9e","0x7b3e7b","0x3e7b61","0xa7ff61","0x0095d3","0x3e7200","0xb05800","0xdc007b","0x9e9eff","0x4f4661","0xa7fff6","0xe5002c","0x72dc72","0xffed7b","0xb08d46","0x6172ff","0xdc4600","0x000072","0x090046","0x35ed4f","0x2c0000","0xa700ff","0x00f6c1","0x9e002c","0x003eff","0xf69e7b","0x6a7235","0xffff46","0xc1b0b0","0x727272","0xc16aa7","0x005823","0xff848d","0xb08472","0x004661","0x8dff12","0xb08dca","0x724ff6","0x729e00","0xd309c1","0x9e004f","0xc17bff","0x8d95b9","0xf6a7d3","0x232309","0xff6aca","0x008d12","0xffa758","0xe5c19e","0x00122c","0xc1b958","0x00c17b","0x462c00","0x7b3e58","0x9e46a7","0x4f583e","0x6a35b9","0x72b095","0xffb000","0x4f3584","0xb94635","0x61a7ff","0xd38495","0x7b613e","0x6a004f","0xed58ff","0x95d300","0x35a7c1","0x00009e","0x7b3535","0xdcff6a","0x95d34f","0x84ffb0","0x843500","0x4fdce5","0x462335","0x002c09","0xb9dcc1","0x588d4f","0x9e7200","0xca4684","0x00c146","0xca09ed","0xcadcff","0x0058a7","0x2ca77b","0x8ddcff","0x232c35","0xc1ffb9","0x006a9e","0x0058ff","0xf65884","0xdc7b46","0xca35a7","0xa7ca8d","0x4fdcc1","0x6172d3","0x6a23ff","0x8d09ca","0xdcc12c","0xc1b97b","0x3e2358","0x7b6195","0xb97bdc","0xffdcd3","0xed5861","0xcab9ff","0x3e5858","0x729595","0x7bff7b","0x95356a","0xca9eb9","0x723e1a","0x95098d","0xf68ddc","0x61b03e","0xffca61","0xd37b72","0xffed9e","0xcaf6ff","0x58c1ff","0x8d61ed","0x61b972","0x8d6161","0x46467b","0x0058d3","0x58dc09","0x001a72","0xd33e2c","0x959546","0xca7b00","0x4f6a8d","0x9584ff","0x46238d","0x008484","0xf67235","0x9edc84","0xcadc6a","0xb04fdc","0x4f0912","0xff1a7b","0x7bb0d3","0x1a001a","0x8d35f6","0x5800a7","0xed8dff","0x969696"];
coli = 0;

var resolve3D = function(path){ try{ var i = Instances.getInstance(path+"."+path+"_obj"); i = Instances.getInstance(path+"."+path+"_swc"); }catch(ignore){} i.getType().resolve(); Instances.getInstance(path).setColor(colours[coli],true);coli++;if (coli>199) {coli=0;};}
var customHandler=function(node, path){ var n;try {n = eval(path);} catch (ex) {node = undefined;}var meta=path+"."+path+"_meta"; if(n!=undefined){var metanode= Instances.getInstance(meta);G.addWidget(1).setData(metanode).setName(n.getName()).addCustomNodeHandler(customHandler,'click');}else{Model.getDatasources()[0].fetchVariable(path,function(){Instances.getInstance(meta);G.addWidget(1).setData(eval(meta)).setName(eval(path).getName()).addCustomNodeHandler(customHandler,'click'); resolve3D(path);});}};

<c:if test="${fn:length(individuals)>0}">
  <c:forEach items="${individuals}" var="curr" varStatus="status">
    <c:if test="${not empty curr}">
      Model.getDatasources()[0].fetchVariable("${curr}");
    </c:if>
  </c:forEach>
  
  <c:forEach items="${individuals}" var="curr" varStatus="status">
    <c:if test="${not empty curr}">
      Instances.getInstance("${curr}.${curr}_meta");
    </c:if>
  </c:forEach>
  
  <c:forEach items="${individuals}" var="curr" varStatus="status">
    <c:if test="${not empty curr}">
      setTimeout(function() { ${curr}.setColor(colours[coli]);coli++;if (coli>199) {coli=0;}; if (${curr}.getType().getWrappedObj().defaultValue.eClass == "OBJ"){${curr}.setOpacity(0.8,true);};}, 6000);
    </c:if>
  </c:forEach>
  
  <c:forEach items="${individuals}" var="curr" varStatus="status">
    <c:if test="${not empty curr}">
      resolve3D("${curr}");
    </c:if>
  </c:forEach>
  
</c:if>

<c:forEach items="${domains}" var="curr" varStatus="status">
  <c:if test="${not empty curr}">
    //${domHead}<fmt:formatNumber minIntegerDigits="5" groupingUsed="false" value="${curr}" />.setColor('0xaaaaaa',true);
  </c:if>
</c:forEach>

<c:forEach items="${domains}" var="curr" varStatus="status">
  <c:if test="${not empty curr}">
    //${domHead}<fmt:formatNumber minIntegerDigits="5" groupingUsed="false" value="${curr}" />.setOpacity(0.3,true);
  </c:if>
</c:forEach>

<c:forEach items="${diffName}" var="curr" varStatus="status">
  <c:if test="${not empty curr}">
    setTimeout(function() { ${curr}.setColor('${diffColour[status.index]}',true);}, 7000);
  </c:if>
</c:forEach>

<c:out escapeXml="false" value="${campos}"/>
<c:out escapeXml="false" value="${camrot}"/>


G.setIdleTimeOut(-1);

nameWid = G.addWidget(1);
nameWid.setName('Currently Selected');
nameWid.setPosition(113,4)
nameWid.setSize(100,266.8)
oldSelection = "";
setInterval(function(){ selection = G.getSelection(); message = ""; if (selection.length > 0){ if (selection[0] != oldSelection){ oldSelection = selection[0]; for (i in selection){ message += "<b onclick=\"G.addWidget(1).setData("+selection[i].getId()+"."+selection[i].getId()+"_meta).setName("+selection[i].getId()+".getName()).setPosition(92,110).addCustomNodeHandler(customHandler,'click');\">" + selection[i].getName() + "</b><br />"; }; nameWid.setMessage(message); }; }; }, 3000);
