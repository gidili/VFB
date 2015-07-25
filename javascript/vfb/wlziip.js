/*! VirtualFlyBrain.org Interface tools for interfacing with the WlzIIPsrv */

window.PosX = 0;
window.PosY = 0;
window.lastSel = [""];
window.textOffset = 0;
var SelectedIndex = 0;
var drawingText = false;
var image = [];
var imageDist = 1;
window.features = [];

function updateWlzDisplay(){
  updateStackData();
}

function updateMenuData() {
  //console.log('Updating menu data...');
  loadRightMenuDisplayed();
  updateAnatomyTree();
  updateLabels();
}

function animateWlzDisplay(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 637;
  canvas.height = 319;
  function step() {
    var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
    if (selected){
      var layers = Object.keys(selected).length;
      var updated = false;
      if (layers > 0){
        var count = 0;
        var i;
        var j;
        var current = parent.$("body").data("current");
        var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
        var orient = current.slice;
        for (i in selected) {
          if (selected[i].visible){
            if (!image[i]){
              image[i] = document.createElement('img');
              image[i].setAttribute('onerror', "this.onerror=null;this.src='/img/blank.png';");
              updated = true;
            }
            if (image[i].src.indexOf(generateWlzURL(i))<0){
              image[i].src = generateWlzURL(i);
              updated = true;
              $('#canvas').css('cursor', 'wait');
            }
            if (count===0){
              if (current.alpha==220 || current.alpha==100){
                if (JSON.stringify(selected).indexOf('VFBi_')>-1){
                  current.alpha = 100;
                }else{
                  current.alpha = 220;
                }
              }
              if (parent.$("body").data("disp") == "scale"){
                if (parent.$("body").data("meta")){
                  canvas.width = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].W])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].W]));
                  canvas.height = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].H])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].H]));
                }
                if ((canvas.width + 50) < $(window).width()){
                  $("#viewer-panel").css("min-width", (canvas.width + 50));
                }else{
                  $("#viewer-panel").css("min-width", $(window).width() - 10);
                  $("#viewer-panel").css("overflow-x", "scroll");
                }
                if ($(window).width() < 640 && $('#right-panel').width() > $(window).width()){
                  $('#right-panel').css("min-width", $(window).width());
                }
                if ($(window).width() > 640 && $('#right-panel').width() < 640 && $('#right-panel').width() !== 80){
                  $('#right-panel').css("min-width", 640);
                }
                if (($('#right-panel').width()+30) < 640) {
                  j = $('#right-panel').width()+30;
                }else{
                  j = 640;
                }
                if ((canvas.width + 50 + j) > $(window).width()) {
                  $('#DispMenuTab').show();
                  $('#AnatoMenuTab').show();
                  $('#SearchMenuTab').show();
                  $('#SelecMenuTab').show();
                  $('#QueryMenuTab').show();
                  $('#MinMenuTab').html('<a href="#min" data-toggle="tab" aria-expanded="false" onclick="minimizeMenuTabs();"><span class="glyphicon glyphicon-resize-small"></span> Minimize</a>');
                  $('#right-panel').removeClass('col-lg-6').removeClass('col-md-1').removeClass('col-md-5').addClass('col-xs-12');
                  $('#viewer-panel').removeClass('col-lg-6').removeClass('col-md-11').removeClass('col-md-7').addClass('col-xs-12');
                }else{
                  $('#DispMenuTab').show();
                  $('#AnatoMenuTab').show();
                  $('#SearchMenuTab').show();
                  $('#SelecMenuTab').show();
                  $('#QueryMenuTab').show();
                  $('#MinMenuTab').html('<a href="#min" data-toggle="tab" aria-expanded="false" onclick="minimizeMenuTabs();"><span class="glyphicon glyphicon-resize-small"></span> Minimize</a>');
                  $('#right-panel').removeClass('col-xs-12').removeClass('col-md-1').addClass('col-md-5').addClass('col-lg-6');
                  $('#viewer-panel').removeClass('col-xs-12').removeClass('col-md-11').addClass('col-md-7').addClass('col-lg-6');
                }
                parent.$("body").data("disp", "done");
              }
              if (selected[0].visible === false || parent.$("body").data("disp") == "clear"){
                ctx.clearRect (0,0,ctx.canvas.width,ctx.canvas.height);
                parent.$("body").data("disp", "done");
              }
              ctx.globalCompositeOperation = 'source-over';
            }
            if (image[i].complete){
              if (image[i].width === 0){
                alertMessage('Failed to load ' + generateWlzURL(i));
                selected[i].visible = false;
                $('#canvas').css('cursor', 'crosshair');
              }else{
                try{
                  ctx.drawImage(image[i], 0, 0);
                  $('#canvas').css('cursor', 'crosshair');
                }catch (e){
                  alertMessage("Problem loading image (" + image[i].src + "); error " + e);
                }
              }
            }else{
              $('#canvas').css('cursor', 'wait');
            }
            if (count===0){
              ctx.globalCompositeOperation = parent.$("body").data("current").blend;
            }
            count++;
          }else{
            if (count===0 && (selected[0].visible === false || parent.$("body").data("disp") == "clear")){
              if (parent.$("body").data("disp") == "scale"){
                if (parent.$("body").data("meta")){
                  canvas.width = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].W])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].W]));
                  canvas.height = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].H])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].H]));
                }
                if ((canvas.width + 50) < $(window).width()){
                  $("#viewer-panel").css("min-width", (canvas.width + 50));
                }else{
                  $("#viewer-panel").css("min-width", $(window).width() - 10);
                  $("#viewer-panel").css("overflow-x", "scroll");
                }
                if ($(window).width() < 640 && $('#right-panel').width() > $(window).width()){
                  $('#right-panel').css("min-width", $(window).width());
                }
                if ($(window).width() > 640 && $('#right-panel').width() < 640 && $('#right-panel').width() !== 80){
                  $('#right-panel').css("min-width", 640);
                }
                if (($('#right-panel').width()+30) < 640) {
                  j = $('#right-panel').width()+30;
                }else{
                  j = 640;
                }
                if ((canvas.width + 50 + j) > $(window).width()) {
                  $('#DispMenuTab').show();
                  $('#AnatoMenuTab').show();
                  $('#SearchMenuTab').show();
                  $('#SelecMenuTab').show();
                  $('#QueryMenuTab').show();
                  $('#MinMenuTab').html('<a href="#min" data-toggle="tab" aria-expanded="false" onclick="minimizeMenuTabs();"><span class="glyphicon glyphicon-resize-small"></span> Minimize</a>');
                  $('#right-panel').removeClass('col-lg-6').removeClass('col-md-1').removeClass('col-md-5').addClass('col-xs-12');
                  $('#viewer-panel').removeClass('col-lg-6').removeClass('col-md-11').removeClass('col-md-7').addClass('col-xs-12');
                }else{
                  $('#DispMenuTab').show();
                  $('#AnatoMenuTab').show();
                  $('#SearchMenuTab').show();
                  $('#SelecMenuTab').show();
                  $('#QueryMenuTab').show();
                  $('#MinMenuTab').html('<a href="#min" data-toggle="tab" aria-expanded="false" onclick="minimizeMenuTabs();"><span class="glyphicon glyphicon-resize-small"></span> Minimize</a>');
                  $('#right-panel').removeClass('col-xs-12').removeClass('col-md-1').addClass('col-md-5').addClass('col-lg-6');
                  $('#viewer-panel').removeClass('col-xs-12').removeClass('col-md-11').addClass('col-md-7').addClass('col-lg-6');
                }
                parent.$("body").data("disp", "done");
              }
              ctx.globalCompositeOperation = 'source-over';
              ctx.clearRect (0,0,ctx.canvas.width,ctx.canvas.height);
              parent.$("body").data("disp", "done");
              if (!current.inverted) {
                ctx.fillStyle="black";
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
              }
              ctx.globalCompositeOperation = parent.$("body").data("current").blend;
              current.alpha = 220;
              count++;
            }
          }
        }
        addScale(50);
        drawFeatures();
        if (window.reloadInterval > 999) {
          if (!updated && imageDist < 100 && (imageDist == 1 || image[i+1].complete)) {
            var dist = current.dst;
            current.dst = dist + imageDist;
            for (j in selected) {
              i++;
              if (!image[i] || image[i].complete) {
                if (!image[i]){
                  image[i] = document.createElement('img');
                }
                if (image[i].src.indexOf(generateWlzURL(j))<0){
                  image[i].src = generateWlzURL(j);
                }
              }
            }
            current.dst = dist - imageDist;
            for (j in selected) {
              i++;
              if (!image[i] || image[i].complete) {
                if (!image[i]){
                  image[i] = document.createElement('img');
                }
                if (image[i].src.indexOf(generateWlzURL(j))<0){
                  image[i].src = generateWlzURL(j);
                }
              }
            }
            current.dst = dist;
            imageDist++;
          }else{
            if (updated){
              imageDist = 1;
            }
          }
        }else{
          imageDist = 1;
        }
      }
    }
    window.setTimeout(function(){
      requestAnimationFrame(step);
      if (window.reloadInterval < 1000) {
        window.reloadInterval = window.reloadInterval + 10;
      }
    }, window.reloadInterval);
  }
  requestAnimationFrame(step);
}

function loadColours(){
  file = "/data/VFB/colours200.csv";
  $.get(file, function(data) {
    var lines = data.split("\n");
    parent.$("body").data("colours", lines);
    updateWlzDisplay();
  });
}

function addScale(scale) {
  if (!scale){
    scale = 50;
  }
  if ($('body').data('current')){
    scl = $('body').data('current').scl;
  }else{
    scl = 1;
  }
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.beginPath();
  ctx.moveTo(5,5);
  ctx.lineTo(Math.round(scale*scl)+5,5);
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  if ($('body').data('meta') && $('body').data('meta').units == 'microns'){
    message = String(scale) + '\u00B5m';
  }else{
    if ($('body').data('meta') && $('body').data('meta').units){
      message = String(scale) + $('body').data('meta').units;
    }else{
      message = String(scale);
    }
  }
  drawText(5,7,message);
}

function drawCircle(X, Y) {
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.beginPath();
  ctx.arc(X, Y, 3, 0, 2 * Math.PI, false);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  window.textOffset = 0;
}

function setCircle() {
  window.features[window.features.length]=[-5,window.PosX,window.PosY, 'CIRCLE'];
  $('#canvas').css('cursor', 'wait');
}

function setText(message) {
  if (window.features.length > 0 && window.features[window.features.length-1][3]==message){
    console.log('double click');
  }else{
    window.features[window.features.length]=[0,window.PosX + 5,window.PosY + window.textOffset - 12, message];
    window.textOffset+= 12;
    ga('send', 'event', 'viewer', 'selected', message);
    window.reloadInterval = 10;
  }
}

function drawText(X,Y,message) {
  var ctx = document.getElementById("canvas").getContext("2d");
  set_textRenderContext(ctx);
  if(check_textRenderContext(ctx)) {
    var point = 12;
    if (scl < 1){
      point = Math.ceil(point * scl);
    }
    ctx.font = String(point) + "px Sans-serif";
    ctx.strokeStyle = 'white';
    ctx.strokeText(message,X, Y,point,100,50);
  }
}

function drawFeatures() {
  var i;
  var time = 100;
  for (i in window.features) {
    window.features[i][0]++;
    if (window.features[i][0] > time){
      delete window.features[i];
    }else{
      if (window.features[i][3] == 'CIRCLE'){
        drawCircle(window.features[i][1],window.features[i][2]);
      }else{
        drawText(window.features[i][1],window.features[i][2],window.features[i][3]);
        $('#canvas').css('cursor', 'crosshair');
      }
    }
  }
}

function callForObjects(text, id) {
  //console.log('Calling:' + text);
  $.ajax({
      url: text,
      type: "GET",
      timeout: 99999999,
      dataType: "text", // "xml", "json"
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
          // format fcgi response for JSON
          data = data.trim();
          data = '{ ' + data.replace(/[\n\r]/g,'], ') + '] }';
          data = data.replace('], ], ','], ');
          data = data.replace('Wlz-foreground-objects:','"Wlz-foreground-objects": [');
          data = data.replace('Wlz-coordinate-3d:','"Wlz-coordinate-3d": [');
          data = data.replace('[ ','[');
          data = data.replace(/\s/g,', ');
          data = data.replace('{,','{');
          data = data.replace(':,',':');
          data = data.replace(':,',':');
          data = data.replace(',,',',');
          data = data.replace(', }',' }');

          var json = JSON.parse(data);

          var temp = json['Wlz-foreground-objects'];

          if (temp !== null && parseInt(temp) === 0) {
            console.log('Adding:' + cleanIdforExt(id));
            addAvailableItems(cleanIdforInt(id));
          }
          $('.tab-pane').removeClass('active');
          $('#selec').addClass('active');
          $('#SelecMenuTab').addClass('active');
          $('#DispMenuTab').removeClass('active');
          $('#AnatoMenuTab').removeClass('active');
          $('#SearchMenuTab').removeClass('active');
          $('#MinMenuTab').removeClass('active');

      },
      error: function(jqXHR, textStatus, ex) {
          alert(textStatus + "," + ex + "," + jqXHR.responseText);
      }
  });
  return true;
}

function minimizeMenuTabs() {
  $('#DispMenuTab').removeClass('active');
  $('#AnatoMenuTab').removeClass('active');
  $('#SearchMenuTab').removeClass('active');
  $('#SelecMenuTab').removeClass('active');
  $('#QueryMenuTab').removeClass('active');
  $('#DispMenuTab').hide();
  $('#AnatoMenuTab').hide();
  $('#SearchMenuTab').hide();
  $('#SelecMenuTab').hide();
  $('#QueryMenuTab').hide();
  $('#MinMenuTab').html('<a href="#min" data-toggle="tab" aria-expanded="false" onclick="maximizeMenuTabs();"><span class="glyphicon glyphicon-resize-full"></span> Menu</a>');
  $('#right-panel').removeClass('col-xs-12').removeClass('col-md-5').removeClass('col-lg-6').addClass('col-md-1');
  $('#viewer-panel').removeClass('col-xs-12').removeClass('col-md-7').removeClass('col-lg-6').addClass('col-md-11');
  $('#right-panel').css("min-width",80);
}

function maximizeMenuTabs(scale) {
  if (typeof(scale) === undefined){
    scale = true;
  }
  $('#DispMenuTab').removeClass('active');
  $('#AnatoMenuTab').removeClass('active');
  $('#SearchMenuTab').removeClass('active');
  $('#SelecMenuTab').removeClass('active');
  $('#QueryMenuTab').removeClass('active');
  $('#DispMenuTab').show();
  $('#AnatoMenuTab').show();
  $('#SearchMenuTab').show();
  $('#SelecMenuTab').show();
  $('#QueryMenuTab').show();
  $('#MinMenuTab').html('<a href="#min" data-toggle="tab" aria-expanded="false" onclick="minimizeMenuTabs();"><span class="glyphicon glyphicon-resize-small"></span> Minimize</a>');
  $('#right-panel').removeClass('col-xs-12').removeClass('col-md-1').addClass('col-md-5').addClass('col-lg-6');
  $('#viewer-panel').removeClass('col-xs-12').removeClass('col-md-11').addClass('col-md-7').addClass('col-lg-6');
  if ($(window).width() < 640){
    $('#right-panel').css("min-width", $(window).width());
  }else{
    $('#right-panel').css("min-width",640);
  }
  if (scale){
    parent.$("body").data("disp", "scale");
  }
}

function updatePosition() {
  maximizeMenuTabs(false);
  setCircle();
  SelectedIndex = 0;
  window.reloadInterval = 10;
  $('#selected').dataTable().fnClearTable();
  $('#selected').dataTable().fnAddData(['-','<img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." />','<img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." />','<img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." />']);
  SelectedIndex++;
  $('.tab-pane').removeClass('active');
  $('#selec').addClass('active');
  $('#SelecMenuTab').addClass('active');
  $('#DispMenuTab').removeClass('active');
  $('#AnatoMenuTab').removeClass('active');
  $('#SearchMenuTab').removeClass('active');
  $('#MinMenuTab').removeClass('active');
  $('#pointVal').text('*,*,*');

  var current = parent.$("body").data("current");
  var file = fileFromId(parent.$("body").data("current").template);
  var text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + String(parseInt(parseInt(current.dst)*parseFloat(current.scl))) + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&prl=-1," + String(window.PosX) + "," + String(window.PosY) + "&obj=Wlz-foreground-objects&obj=Wlz-coordinate-3D";
  var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
  var temp = [];

  $.ajax({
      url: text,
      type: "GET",
      timeout: 99999999,
      dataType: "text", // "xml", "json"
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
          // format fcgi response for JSON
          data = data.trim();
          data = '{ ' + data.replace(/[\n\r]/g,'], ') + '] }';
          data = data.replace('], ], ','], ');
          data = data.replace('Wlz-foreground-objects:','"Wlz-foreground-objects": [');
          data = data.replace('Wlz-coordinate-3d:','"Wlz-coordinate-3d": [');
          data = data.replace('[ ','[');
          data = data.replace(/\s/g,', ');
          data = data.replace('{,','{');
          data = data.replace(':,',':');
          data = data.replace(':,',':');
          data = data.replace(',,',',');
          data = data.replace(', }',' }');

          var json = JSON.parse(data);

          var oldPos = window.selPointX + ',' + window.selPointY + ',' + window.selPointZ;

          // update 3d coordinates
          window.selPointX = parseInt(json['Wlz-coordinate-3d'][0]);
          window.selPointY = parseInt(json['Wlz-coordinate-3d'][1]);
          window.selPointZ = parseInt(json['Wlz-coordinate-3d'][2]);

          var newPos = window.selPointX + ',' + window.selPointY + ',' + window.selPointZ;
          var i;
          if ( oldPos == newPos ){
            var displayed = JSON.stringify(selected);
            for (i = 0, l=lastSel.length; i < l; i++) {
              if (lastSel[i] > 0){
                fullItem = parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(lastSel[i]),5));
                // if already added then remove
                if (displayed.indexOf(fullItem) > -1) {
                  //console.log('Removing ' + fullItem + ' after double click');
                  removeFromStackData(fullItem);
                }else{ // else add it
                  //console.log('Adding ' + fullItem + ' after double click');
                  addToStackData(fullItem);
                  $('#canvas').css('cursor', 'wait');
                }
              }
            }
          }
          window.lastSel = json['Wlz-foreground-objects'];
          temp = [];
          for (i in window.lastSel) {
            if (window.lastSel[i] === 0) {
              temp[i]=$('body').data()[$('body').data().current.template].selected[0].id;
            }else{
              temp[i]=parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(window.lastSel[i]),5));
            }
          }
          $('#selected').dataTable().fnDeleteRow( 0, false );
          addAvailableItems(temp);

          $('.tab-pane').removeClass('active');
          $('#selec').addClass('active');
          $('#SelecMenuTab').addClass('active');
          $('#DispMenuTab').removeClass('active');
          $('#AnatoMenuTab').removeClass('active');
          $('#SearchMenuTab').removeClass('active');
          $('#MinMenuTab').removeClass('active');
          $('#pointVal').text(String(window.selPointX) + ',' + String(window.selPointY) + ',' + String(window.selPointZ));

      },
      error: function(jqXHR, textStatus, ex) {
          alert(textStatus + "," + ex + "," + jqXHR.responseText);
      }
  });

  var i;

  for (i in selected) {
    if (cleanIdforExt(selected[i].id).indexOf('VFB_')>-1 && selected[i].visible) {
      file = fileFromId(cleanIdforInt(selected[i].id));
      text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + String(parseInt(parseInt(current.dst)*parseFloat(current.scl))) + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&prl=-1," + String(window.PosX) + "," + String(window.PosY) + "&obj=Wlz-foreground-objects";
      callForObjects(text, cleanIdforInt(selected[i].id));
    }
  }
}

function FindPosition(oElement){
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ oElement.x, oElement.y ];
    }
}

function openQueryTab() {
  maximizeMenuTabs();
  $('.tab-pane').removeClass('active');
  $('#QueryMenuTab').addClass('active');
  $('#queryBuild').addClass('active');
}

function generateWlzURL(index){
   var current = parent.$("body").data("current");
   var selected = parent.$("body").data(current.template).selected;
   var layer = selected[index];
   var file = "";
   var colour = "255,255,255";
   var text = "";
   if (layer.colour !== "auto"){
     colour = layer.colour;
   }else{
     if (!parent.$("body").data("colours")){
       loadColours();
     }else{
       while (index>200){
         index = index-200;
       }
       colour = parent.$("body").data("colours")[index];
     }
   }
   switch (layer.id.substr(0,4)){
     case "VFB_":
       file = fileFromId(layer.id);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=0," + colour + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + String(parseInt(parseInt(current.dst)*parseFloat(current.scl))) + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     case "VFBi":
       file = fileFromId(layer.id);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=0," + colour + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + String(parseInt(parseInt(current.dst)*parseFloat(current.scl))) + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     case "VFBt":
       file = fileFromId(layer.id);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=0," + colour + "," + current.alpha + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + String(parseInt(parseInt(current.dst)*parseFloat(current.scl))) + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     case "VFBd":
       file = fileFromId(current.template);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=" + String(parseInt(layer.id.substr(8))) + "," + colour + "," + current.alpha + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + String(parseInt(parseInt(current.dst)*parseFloat(current.scl))) + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     default:
       alertMessage("unable to generate URL for id:" + layer.id);
   }
   return text;
}

function initWlzControls() {
  $('#slider-slice').data('live',false);
  if (parent.$("body").data("meta")){
   var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
   var orient = parent.$("body").data("current").slice;
   var slSlice = $("#slider-slice").bootstrapSlider({precision: 0, tooltip: 'always', handle: 'triangle', min: 1, max: parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1, step: 1, value: parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D])+1, focus: true});
   slSlice.on('slide', function(ev){
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = parseInt(ev.value)-1-parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D]);
     $("#slider-sliceSliderVal").text(ev.value);
     window.reloadInterval = 10;
   });
   slSlice.on('slideStop', function(ev){
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = parseInt(ev.value)-1-parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D]);
     $("#slider-sliceSliderVal").text(ev.value);
     updateWlzDisplay();
     ga('send', 'event', 'viewer', 'slice', String(ev.value));
   });
   var slScale = $("#slider-scale").bootstrapSlider({precision: 1, tooltip: 'always', handle: 'triangle', scale: 'logarithmic', min: 0.1, max: 5, value: parseFloat(parent.$("body").data("current").scl), step: 0.1, focus: true});
   slScale.on('slide', function(ev){
     parent.$("body").data("current").scl = ev.value.toFixed(1);
     $("#slider-scaleSliderVal").text(String(ev.value.toFixed(1))+'x');
     parent.$("body").data("disp", "scale");
     window.reloadInterval = 10;
   });
   slScale.on('slideStop', function(ev){
     parent.$("body").data("current").scl = ev.value.toFixed(1);
     $("#slider-scaleSliderVal").text(String(ev.value.toFixed(1))+'x');
     updateWlzDisplay();
     parent.$("body").data("disp", "scale");
     window.reloadInterval = 10;
     ga('send', 'event', 'viewer', 'scale', String(ev.value.toFixed(1))+'x');
   });
   var slAlpha = $("#slider-alpha").bootstrapSlider({precision: 0, tooltip: 'always', handle: 'triangle', min: 0, max: 100, step: 1, value: Math.round((parseInt(parent.$("body").data("current").alpha)/255.0)*100.0), focus: true});
   slAlpha.on('slide', function(ev){
     parent.$("body").data("current").alpha = Math.round(((parseInt(ev.value))/100.0)*255.0);
     $("#slider-alphaSliderVal").text(String(ev.value)+'%');
     window.reloadInterval = 10;
   });
   slAlpha.on('slideStop', function(ev){
     parent.$("body").data("current").alpha = Math.round(((parseInt(ev.value))/100.0)*255.0);
     $("#slider-alphaSliderVal").text(String(ev.value)+'%');
     parent.$("body").data("disp","clear");
     updateWlzDisplay();
     window.reloadInterval = 10;
     ga('send', 'event', 'viewer', 'alpha', String(Math.round(((parseInt(ev.value))/100.0)*255.0)));
   });
   $("body").on('click', "#slider-scaleCurrentSliderValLabel", function(){
     if ($("#slider-scaleCurrentSlider").is(":visible")){
       $("#slider-scaleCurrentSlider").hide();
       $("#slider-scaleCurrentSliderValLabel .glyphicon").show();
       $("#slider-scaleCurrentSliderValLabel").removeClass("active");
     }else{
       hideAllSliders();
       $("#slider-scaleCurrentSlider").show();
       $("#slider-scaleCurrentSliderValLabel .glyphicon").hide();
       $("#slider-scaleCurrentSliderValLabel").addClass("active");
       $("#slider-scaleCurrentSlider .slider-handle.min-slider-handle").focus();
     }
   });
   $("#slider-scaleCurrentSlider .slider-handle.min-slider-handle").focusout(function() {
     if ($("#slider-scaleCurrentSlider").is(":visible")){
       $("#slider-scaleCurrentSlider").hide();
       $("#slider-scaleCurrentSliderValLabel .glyphicon").show();
       $("#slider-scaleCurrentSliderValLabel").removeClass("active");
     }
   });
   $("body").on('click', "#slider-sliceCurrentSliderValLabel", function(){
     if ($("#slider-sliceCurrentSlider").is(":visible")){
       $("#slider-sliceCurrentSlider").hide();
       $("#slider-sliceCurrentSliderValLabel .glyphicon").show();
       $("#slider-sliceCurrentSliderValLabel").removeClass("active");
     }else{
       hideAllSliders();
       $("#slider-sliceCurrentSlider").show();
       $("#slider-sliceCurrentSliderValLabel .glyphicon").hide();
       $("#slider-sliceCurrentSliderValLabel").addClass("active");
       $("#slider-sliceCurrentSlider .slider-handle.min-slider-handle").focus();
     }
   });
   $("#slider-sliceCurrentSlider .slider-handle.min-slider-handle").focusout(function() {
     if ($("#slider-sliceCurrentSlider").is(":visible")){
       $("#slider-sliceCurrentSlider").hide();
       $("#slider-sliceCurrentSliderValLabel .glyphicon").show();
       $("#slider-sliceCurrentSliderValLabel").removeClass("active");
     }
   });
   $("body").on('click', "#slider-alphaCurrentSliderValLabel", function(){
     if ($("#slider-alphaCurrentSlider").is(":visible")){
       $("#slider-alphaCurrentSlider").hide();
       $("#slider-alphaCurrentSliderValLabel .glyphicon-edit").show();
       $("#slider-alphaCurrentSliderValLabel").removeClass("active");
     }else{
       hideAllSliders();
       $("#slider-alphaCurrentSlider").show();
       $("#slider-alphaCurrentSliderValLabel .glyphicon-edit").hide();
       $("#slider-alphaCurrentSliderValLabel").addClass("active");
       $("#slider-alphaCurrentSlider .slider-handle.min-slider-handle").focus();
     }
   });
   $("#slider-alphaCurrentSlider .slider-handle.min-slider-handle").focusout(function() {
     if ($("#slider-alphaCurrentSlider").is(":visible")){
       $("#slider-alphaCurrentSlider").hide();
       $("#slider-alphaCurrentSliderValLabel .glyphicon-edit").show();
       $("#slider-alphaCurrentSliderValLabel").removeClass("active");
     }
   });
   $("#canvas").click(function(e) {
     window.PosX = Math.round(e.pageX - $(this).offset().left - Math.round(($(this).outerWidth() - $(this).width())/2));
     window.PosY = Math.round(e.pageY - $(this).offset().top - Math.round(($(this).outerHeight() - $(this).height())/2));
     updatePosition();
   });
   $("body").on('click', "#resetPosition", function(){
     hideAllSliders();
     var text = '{ "scl":' + String(defaultScaleByScreen()) + ',"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
     parent.$("body").data("current").scl = defaultScaleByScreen();
     setOrientaion("Z");
     parent.$("body").data("current").fxp = parent.$("body").data("meta").center;
     parent.$("body").data("current").dst = 0;
     parent.$("body").data("current").alpha = 100;
     parent.$("body").data("current").inverted = false;
     parent.$("body").data("current").blend = "screen";
     updateWlzDisplay();
     updateLabels();
     window.reloadInterval = 10;
     parent.$("body").data("disp", "scale");
     ga('send', 'event', 'viewer', 'reset_pos');
   });
   $("body").on('click', "#toggle-view", function(){
     hideAllSliders();
     setOrientaion();
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = 0;
     parent.$("body").data("disp", "scale");
     updateLabels();
     window.reloadInterval = 10;
     ga('send', 'event', 'viewer', 'slice_in', parent.$("body").data("current").slice );
   });
   $('#slider-slice').data('live',true);
   updateLabels();
   hideAllSliders();
   parent.$("body").data("disp", "scale");
   loadTemplateAnatomyTree();
 }else{
   if (parent.$("body").data("current")) {
     loadTemplateMeta(parent.$("body").data("current").template);
     loadReferenceMeta(parent.$("body").data("current").template);
   }
   window.setTimeout(function(){
     initWlzControls();
   },5000);
 }
}

function clearAllDisplayed() {
  var current = parent.$("body").data("current");
  var selected = parent.$("body").data(current.template).selected;
  var i;
  for (i in selected) {
    if (i > 0){
      $('#displayed').dataTable().fnDeleteRow(1, false );
      delete selected[i];
    }
  }
  $('#displayed').dataTable().fnAdjustColumnSizing(false);
  $('#displayed').DataTable().draw(false);
  $(".dataTables_paginate li").css("margin", 0);
  $(".dataTables_paginate li").css("padding", 0);
  updateStackData();
  history.replaceState(null, document.title, location.href);
}

function createControlsBarHTML(id) {
  id = cleanIdforInt(id);
  var current = parent.$("body").data("current");
  var selected = parent.$("body").data(current.template).selected;
  var domains = parent.$("body").data("domains");
  var html = '<div class="btn-group btn-group-justified" role="group" aria-label="control buttons" style="width:150px" >';
  var i;
  var j;
  var start = '<div class="btn-group" role="group">';
  var end = '</div>';
  var temp;
  if (JSON.stringify(selected).indexOf(id)>-1){
    for (i in selected) {
      if (id == selected[i].id || id == selected[i].extid){
        html += start + createInfoButtonHTML(selected[i]) + end;
        html += start + createVisibleButtonHTML(selected[i],i) + end;
        html += start + createColourButtonHTML(selected[i],i) + end;
        if (selected[i].id.indexOf('VFBd_') > -1) {
          for (j in parent.$("body").data("domains")) {
            if (cleanIdforInt(parent.$("body").data("domains")[j].extId[0]) == cleanIdforInt(selected[i].extid)) {
              if (parent.$("body").data("domains")[j].domainData.domainCentre){
                html += start + createCentreButtonHTML(parent.$("body").data("domains")[j].domainData.domainCentre.join(',')) + end;
              }
              break;
            }
          }
        }
        if (selected[i].extid) {
          html += start + createAddToQueryButtonHTMLfinal(selected[i].extid) + end;
        }
        if (i > 0) {
          html += start + createCloseButtonHTML(selected[i]) + end;
        }
        break;
      }
    }
  }else if (id.indexOf('FBbt_')>-1){
    html += start + createInfoButtonHTMLbyId(id) + end;
    if (parent.$("body").data("available").indexOf(id)>-1) {
      html += start + createAddButtonHTMLfinal(id) + end;
    }
    for (j in parent.$("body").data("domains")) {
      if (cleanIdforInt(parent.$("body").data("domains")[j].extId[0]) == id) {
        if (parent.$("body").data("domains")[j].domainData.domainCentre){
          html += start + createCentreButtonHTML(parent.$("body").data("domains")[j].domainData.domainCentre.join(',')) + end;
        }
        break;
      }
    }
    html += start + createAddToQueryButtonHTMLfinal(id) + end;
  }else if (id.indexOf('VFBd_')>-1) {
    temp = parseInt(id.replace(current.template,'').replace(current.template.replace('VFBt_','VFBd_'),''));
    for (j in parent.$("body").data("domains")) {
      if (parent.$("body").data("domains")[j].domainData.domainId && parseInt(parent.$("body").data("domains")[j].domainData.domainId) == temp) {
        if (parent.$("body").data("domains")[j].extId) {
          html += start + createInfoButtonHTMLbyId(cleanIdforInt(parent.$("body").data("domains")[j].extId[0])) + end;
          html += start + createAddToQueryButtonHTMLfinal(cleanIdforInt(parent.$("body").data("domains")[j].extId[0])) + end;
        }
        break;
      }
    }
  }else if (id.indexOf('FBgn')>-1){
    html += start + createInfoButtonHTMLbyId(id) + end;
    if (parent.$("body").data("available").indexOf(id)>-1) {
      html += start + createAddButtonHTMLfinal(id) + end;
    }
    for (j in parent.$("body").data("domains")) {
      if (cleanIdforInt(parent.$("body").data("domains")[j].extId[0]) == id) {
        if (parent.$("body").data("domains")[j].domainData.domainCentre){
          html += start + createCentreButtonHTML(parent.$("body").data("domains")[j].domainData.domainCentre.join(',')) + end;
        }
        break;
      }
    }
    html += start + createAddToQueryButtonHTMLfinal(id) + end;
  }
  html += end;
  return html;
}

function updateLabels() {
  //console.log('Updating the controls...');
  try{
    if (parent.$("body").data("current") && $('#slider-slice').data('live')){
      var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
      var orient = parent.$("body").data("current").slice;
      $("#slider-sliceSliderVal").text(parseInt(parent.$("body").data("current").fxp.split(',')[orientation[orient].D])+parseInt(parent.$("body").data("current").dst)+1);
      $("#toggle-viewVal").text(parent.$("body").data("current").slice);
      $("#slider-scaleSliderVal").text(String(parseFloat(parent.$("body").data("current").scl).toFixed(1))+'x');
      $('#slider-scale').bootstrapSlider('setValue', parseFloat(parseFloat(parent.$("body").data("current").scl).toFixed(1)));
      $('#slider-slice').bootstrapSlider('setValue', parseInt(parent.$("body").data("current").fxp.split(',')[orientation[orient].D])+parseInt(parent.$("body").data("current").dst)+1);
      $("#slider-alphaSliderVal").text(String(Math.round((parseInt(parent.$("body").data("current").alpha)/255.0)*100.0))+'%');
      $('#slider-alpha').bootstrapSlider('setValue', Math.round((parseInt(parent.$("body").data("current").alpha)/255.0)*100.0));
      var pos = parent.$("body").data("current").fxp.split(',');
      for (var i=0; i<3; i++){
        pos[i] = String(parseInt(pos[i])+1);
      }
      $('#positionVal').text(pos.join(','));
    }

    if (parent.$("body").data("meta")){
      $('[id^=nameFor]').each(function() {
        content = $(this).data('id');
        content = cleanIdforExt(content);
        switch (content.substr(0,4)) {
          case "VFB_":
            $(this).load('/do/ont_bean.html?id=' + content + ' #partName', function(response, status, xhr) {
              if ( status == "error" ) {
                if ($(this).data('retrys')) {
                  $(this).data('retrys', $(this).data('retrys')+1);
                  if ($(this).data('retrys') > 10){
                    $(this).attr('id', "Failed" + $(this).attr('id'));
                  }
                }else{
                  $(this).data('retrys', 1);
                }
              }else{
                if ($(this).text().indexOf("VFB") < 0 && $(this).text().indexOf("?") < 0) {
                  if ($(this).data('layer')) {
                    parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].name = $(this).text();
                  }
                  $(this).attr('id', "Resolved" + $(this).attr('id'));
                }
              }
            });
            $(this).attr("onclick", $("#infoButtonFor" + content).attr("onclick"));
            break;
          case "VFBt":
            $(this).text(parent.$("body").data("meta").name);
            $(this).attr('id', "Resolved" + $(this).attr('id'));
            parent.$("body").data(parent.$("body").data("current").template).selected[0].name = parent.$("body").data("meta").name;
            break;
          case "FBbt":
            $(this).load('/do/ont_bean.html?id=' + content + ' #partName', function(response, status, xhr) {
              if ( status == "error" ) {
                if ($(this).data('retrys')) {
                  $(this).data('retrys', $(this).data('retrys')+1);
                  if ($(this).data('retrys') > 10){
                    $(this).attr('id', "Failed" + $(this).attr('id'));
                  }
                }else{
                  $(this).data('retrys', 1);
                }
              }else{
                if ($(this).text().indexOf("FBbt") < 0 && $(this).text().indexOf("VFB") < 0 && $(this).text().indexOf("?") < 0) {
                  if ($(this).data('layer')) {
                    parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].name = $(this).text();
                  }
                  $(this).attr('id', "Resolved" + $(this).attr('id'));
                }
              }
            });
            $(this).attr("onclick", $("#" + $(this).attr("id").replace("nameFor","infoButtonFor")).attr("onclick"));
            break;
          default:
            alertMessage("unable to resolve name for id:" + content);
        }
      });
      $('[id^=typeFor]').each(function() {
        content = $(this).data('id');
        content = cleanIdforExt(content);
        switch (content.substr(0,4)) {
          case "VFB_":
            $(this).load('/do/ont_bean.html?id=' + content + ' #partParent', function(response, status, xhr) {
              if ( status == "error" ) {
                if ($(this).data('retrys')) {
                  $(this).data('retrys', $(this).data('retrys')+1);
                  if ($(this).data('retrys') > 10){
                    $(this).attr('id', "Failed" + $(this).attr('id'));
                  }
                }else{
                  $(this).data('retrys', 1);
                }
              }else{
                if ($(this).text().indexOf("_") < 0){
                  if ($(this).data('layer')) {
                    parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].type = $(this).html();
                  }
                  $(this).attr('id', "Resolved" + $(this).attr('id'));
                }
              }
            });
            $("#parentIdFor"+$(this).data('id')).load('/do/ont_bean.html?id=' + content + ' #partParentId', function(response, status, xhr) {
              if ( status == "error" ) {
                if ($(this).data('retrys')) {
                  $(this).data('retrys', $(this).data('retrys')+1);
                  if ($(this).data('retrys') > 10){
                    $(this).attr('id', "Failed" + $(this).attr('id'));
                  }
                }else{
                  $(this).data('retrys', 1);
                }
              }else{
                if ($(this).text().length > 5){
                  if ($(this).data('layer')) {
                    parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].typeid = cleanIdforExt($(this).text());
                  }
                  $(this).attr('id', "Resolved" + $(this).attr('id'));
                }
              }
            });
            break;
          case "VFBt":
            $(this).html($('#backgroundStain').html());
            if ($(this).data('layer')) {
              parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].type = $(this).html();
            }
            $(this).attr('id', "Resolved" + $(this).attr('id'));
            break;
          case "FBbt":
            $(this).load('/do/ont_bean.html?id=' + content + ' #partParent', function(response, status, xhr) {
              if ( status == "error" ) {
                if ($(this).data('retrys')) {
                  $(this).data('retrys', $(this).data('retrys')+1);
                  if ($(this).data('retrys') > 10){
                    $(this).attr('id', "Failed" + $(this).attr('id'));
                  }
                }else{
                  $(this).data('retrys', 1);
                }
              }else{
                if ($(this).text().indexOf("_") < 0){
                  if ($(this).data('layer')) {
                    parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].type = $(this).html();
                  }
                  $(this).attr('id', "Resolved" + $(this).attr('id'));
                }
              }
            });
            $("#"+$(this).attr("id").replace("typeFor","parentIdFor")).load('/do/ont_bean.html?id=' + content + ' #partParentId', function(response, status, xhr) {
              if ( status == "error" ) {
                if ($(this).data('retrys')) {
                  $(this).data('retrys', $(this).data('retrys')+1);
                  if ($(this).data('retrys') > 10){
                    $(this).attr('id', "Failed" + $(this).attr('id'));
                  }
                }else{
                  $(this).data('retrys', 1);
                }
              }else{
                if ($(this).text().length > 5){
                  if ($(this).data('layer')) {
                    parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].typeid = cleanIdforExt($(this).text());
                  }
                  $(this).attr('id', "Resolved" + $(this).attr('id'));
                }
              }
            });
            break;
          case "FBgn":
            $(this).html('<a href="http://flybase.org/reports/' + $(this).data('id') + '" target="_new"><li>gene</li>');
            break;
          default:
            alertMessage("unable to resolve type for id:" + content);
        }
      });
    }
  }catch(e){
    alertMessage("Skipping update");
  }
}

function hideAllSliders() {
  $('[id$=CurrentSlider]').each(function() {
    $(this).hide();
  });
}

function setOrientaion(ori) {
   var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
   if (ori == "Z" || ori == "X" || ori == "Y"){
     parent.$("body").data("current").slice=ori;
   }else {
     switch (parent.$("body").data("current").slice){
       case "Z":
        parent.$("body").data("current").slice="Y";
        break;
       case "Y":
        parent.$("body").data("current").slice="X";
        break;
       default:
        parent.$("body").data("current").slice="Z";
     }
   }
   var orient = parent.$("body").data("current").slice;
   switch (orient){
    case "Y":
      parent.$("body").data("current").pit=90.0;
      parent.$("body").data("current").yaw=90.0;
      parent.$("body").data("current").rol=90.0;
      $('#slider-slice').data('bootstrapSlider').options.max = parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1;
      break;
    case "X":
      parent.$("body").data("current").pit=90.0;
      parent.$("body").data("current").yaw=0.0;
      parent.$("body").data("current").rol=90.0;
      $('#slider-slice').data('bootstrapSlider').options.max = parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1;
      break;
    default:
      parent.$("body").data("current").pit=0.0;
      parent.$("body").data("current").yaw=0.0;
      parent.$("body").data("current").rol=0.0;
      $('#slider-slice').data('bootstrapSlider').options.max = parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1;
   }
   updateWlzDisplay();
 }

function createInfoButtonHTML(layer) {
  var content = "";
  if (layer) {
    content += '<button type="button" id="infoButtonFor' + cleanIdforExt(layer.id) + '" class="btn btn-default btn-xs" aria-label="Open Details" title="Full Details" onclick="';
    switch (layer.id.substr(0,4)) {
      case "VFBt":
        content += "$('#anatomyDetails').html($('#imageAttributesText').html());";
        break;
      case "VFBd":
        content += "openFullDetails('" + layer.extid + "')";
        break;
      default:
        alertMessage('unresolved info button for ' + layer.id);
        content += "openFullDetails('" + cleanIdforExt(layer.id) + "')";
    }
    content += '"><span style="border:none;padding-left:0px;padding-right:0px;;" class="glyphicon glyphicon-info-sign"></span></button>';
  }
  return content;
}

function createInfoButtonHTMLbyId(id) {
  var content = "";
  if (id) {
    id = cleanIdforExt(id);
    content += '<button type="button" id="infoButtonFor' + id + '" class="btn btn-default btn-xs" aria-label="Open Details" title="Full Details" onclick="';
    switch (id.substr(0,4)) {
      case "VFBt":
        content += "$('#anatomyDetails').load('/site/stacks/index.htm #imageAttributesText')";
        break;
      default:
        content += "openFullDetails('" + id + "')";
    }
    content += '"><span style="border:none;padding-left:0px;padding-right:0px;" class="glyphicon glyphicon-info-sign"></span></button>';
  }
  return content;
}

function createVisibleButtonHTML(layer,i) {
  var content = "";
  if (layer) {
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    if (layer.visible) {
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Hide" title="Hide" onclick="';
      content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=false; updateWlzDisplay(); parent.$('body').data('disp', 'clear');updateMenuData();ga('send', 'event', 'viewer', 'hide', '" + layer.name + "');";
      content += '"><span style="border:none;padding-left:0px;padding-right:0px;" class="glyphicon glyphicon-eye-open"></span></button>';
    }else{
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Show" title="Show" onclick="';
      content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=true; updateWlzDisplay();updateMenuData();updateMenuData();ga('send', 'event', 'viewer', 'show', '" + layer.name + "');";
      content += '"><span style="border:none;padding-left:0px;padding-right:0px;" class="glyphicon glyphicon-eye-close"></span></button>';
    }
  }
  return content;
}

function createColourButtonHTML(layer,i) {
  var content = "";
  if (layer && parent.$("body").data("colours")) {
    var temp;
    if (layer.colour == "auto") {
      while (i>200){
        i = i-200;
      }
      temp = parent.$("body").data("colours")[i];
    }else{
      temp = layer.colour;
    }
    content += '<button type="button" class="btn btn-default btn-xs" aria-label="Adjust Colour" title="Adjust Colour" onclick="';
    content += "updateWlzDisplay();updateMenuData();";
    content += '" style="background:rgb(' + temp + ');"><span style="border:none;padding-left:0px;padding-right:0px;" class="glyphicon glyphicon-tint"></span></button>';
  }
  return content;
}

function createCloseButtonHTML(layer) {
  var content = "";
  if (layer) {
    content += '<button type="button" class="btn btn-default btn-xs" aria-label="Remove" title="Remove" onclick="';
    content += "removeFromStackData('" + layer.id + "');updateWlzDisplay();updateMenuData();";
    content += '"><span style="border:none;padding-left:0px;padding-right:0px;" class="glyphicon glyphicon-trash"></span></button>';
  }
  return content;
}

function createAddButtonHTML(id) {
  var content = '<span style="border:none;padding-left:0px;padding-right:0px;" id="attach" data-id="' + cleanIdforInt(id) + '"></span>';
  return content;
}

function createAddToQueryButtonHTMLfinal(id) {
  var text = '<a href="#" class="btn btn-xs btn-info" onclick="';
  text += "parent.$('#query_builder').attr('src', '/do/query_builder.html?action=add&amp;rel=include&amp;fbId=" + cleanIdforExt(id) + "');if (typeof openQueryTab !== 'undefined' && $.isFunction(openQueryTab)) {openQueryTab();};ga('send', 'event', 'query', 'add', '" + cleanIdforExt(id) + "');";
  text += '"><span style="border:none;padding-left:0px;padding-right:0px;" class="glyphicon glyphicon-tasks"></span></a>';
  return text;
}

function createCentreButtonHTML(fxp) {
  var html;
  html = '<button class="btn btn-xs" title="center" onclick="';
  html += "parent.$('body').data('current').fxp='" + fxp + "'; parent.$('body').data('current').dst=0; updateStackData();updateMenuData();ga('send', 'event', 'viewer', 'center', '" + fxp + "');";
  html += '"><span style="border:none;padding-left:0px;padding-right:0px;" class="glyphicon glyphicon-screenshot"></span></button>';
  return html;
}

function loadReferenceMeta(id){
  if (id){
    file = "/data/" + fileFromId(id).replace("composite.wlz","ref.json");
    $.getJSON( file, function( data ) {
      $.each( data, function( key, val ) {
        parent.$("body").data(key,val);
      });
      if (parent.$("body").data("ref_txt")){
        $("#imageAttributesText").html(decodeURIComponent(parent.$("body").data("ref_txt")));
        delete parent.$("body").data().ref_txt;
      }
      updateStackData();
    });
  }
}

function updateItemName( solrAPI, layer ) {
  $.getJSON( solrAPI, {
    q: "short_form:" + cleanIdforExt(layer.id),
    fl: "label",
    wt: "json",
    sort: "score desc"
  }).done(function(data){
    if (data.response.docs[0].label) {
      layer.name = data.response.docs[0].label;
    }else{
      alertMessage(JSON.stringify(data));
    }
  });
}

function loadRightMenuDisplayed() {
  //console.log('Updating the displayed layers...');
  if (parent.$("body").data("current") && parent.$("body").data("colours")){
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    if (selected && $.fn.dataTable.isDataTable('#displayed')) {
      $('table').each(function(){
        if ($(this).width() > $('#right-panel').width() || $(this).width() < $('#right-panel').width()){
          $(this).css('width', $('#right-panel').width());
        }
      });
      var layers = Object.keys(selected).length;
      var temp;
      var i;
      var j;
      var rowD;
      var index = "-";
      var controls = "-";
      var name = "*";
      var type = "*";
      var solrAPI = "/search/select?";
      for (i in selected) {
        layer = selected[i];
        if (!layer.name) {
          if (layer.id.indexOf("VFBd_") < 0 && layer.id.indexOf("VFBt_") < 0) {
            updateItemName(solrAPI, layer);
          }
        }
      }
      for (i in selected) {
        index = "-";
        controls = "-";
        name = "?";
        type = "?";
        layer = selected[i];
        if (layer) {
          rowD = $('#displayed').dataTable().fnGetData(i);
          // index:
          index = String(i);
          if (rowD === null || rowD[0] !== index || (rowD[2].indexOf('"nameFor') > -1 && layer.name) || (rowD[3].indexOf('"typeFor') > -1 && layer.type)){
            // Controls:
            controls = createControlsBarHTML(layer.id);
            // Name:
            if (layer.id.indexOf("VFBd_") > -1) {
              temp = layer.extid;
            }else{
              temp = layer.id;
            }
            if (layer.name) {
              name = '<a href="#details"><span id="ResolvedNameFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" onclick="';
              if (layer.id.indexOf("VFBt_") > -1) {
                name += "$('#anatomyDetails').html($('#imageAttributesText').html());";
              }else{
                name += "openFullDetails('" + cleanIdforExt(layer.id) + "');";
              }
              name += '">';
              name += layer.name;
            }else{
              if (layer.id.indexOf('VFBd_') > -1) {
                for (j in parent.$("body").data("domains")) {
                  if (cleanIdforInt(parent.$("body").data("domains")[j].extId[0]) == cleanIdforInt(layer.extid)) {
                    name = '<a href="#details"><span id="LoadedNameFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" onclick="';
                    name += "openFullDetails('" + cleanIdforExt(layer.id) + "');";
                    name += '">';
                    name += parent.$("body").data("domains")[j].name;
                    break;
                  }
                }
              }
            }
            if (name == "?") {
              name = '<a href="#details"><span id="nameFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" onclick="';
              name += "openFullDetails('" + cleanIdforExt(layer.id) + "');";
              name += '">';
              name += cleanIdforExt(layer.id);
            }
            name += '</span></a>';
            // Type:
            if (layer.typeid) {
              type = '<a href="#details"><span class="link" onclick="';
              type += "openFullDetails('" +layer.typeid + "')";
            }else{
              type = '<span class="hide" id="parentIdFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" ></span><a href="#details"><span class="link" onclick="';
              type += "openFullDetails($('#parentIdFor"+layer.id+"').text())";
            }
            if (layer.type) {
              type += '" id="resolvedTypeFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '">';
              type += layer.type;
            }else{
              type += '" id="typeFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '">';
              type += cleanIdforExt(temp);
            }
            type += '</span></a>';
            if (rowD !== null){
              $('#displayed').dataTable().fnUpdate(index,i,0, false );
              $('#displayed').dataTable().fnUpdate(controls,i,1, false );
              $('#displayed').dataTable().fnUpdate(name,i,2, false );
              $('#displayed').dataTable().fnUpdate(type,i,3, false );
              //console.log('Updating ' + index + ' in the displayed layers');
            }else{
              $('#displayed').dataTable().fnAddData([ index, controls, name, type], false);
              //console.log('Adding ' + index + ' to the displayed layers');
            }
          }else{
            // Controls:
            controls = createControlsBarHTML(layer.id);
            if (rowD[1] !== controls) {
              $('#displayed').dataTable().fnUpdate(controls,i,1, false );
              //console.log('Updating controls for ' + index + ' in the displayed layers');
            }
          }
        }
      }
      i++;
      while ($('#displayed').dataTable().fnGetData(i)){
        $('#displayed').dataTable().fnDeleteRow(i, false );
      }
      $('#displayed').dataTable().fnAdjustColumnSizing(false);
      $('#displayed').DataTable().draw(false);
      $(".dataTables_paginate li").css("margin", 0);
      $(".dataTables_paginate li").css("padding", 0);
      $('body').css('cursor', 'default');
    }else{
      $('#displayed').DataTable( { retrieve: true,
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        stateSave: true,
        order: [[ 0, 'desc' ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
          ]
      });
      $('#displayed').on( 'page.dt', function () {
        updateLabels();
      } );
      window.setTimeout(function(){
				$(".dataTables_paginate li").css("margin", 0);
				$(".dataTables_paginate li").css("padding", 0);
			}, 1000);
    }
  }
}

function loadTemplateAnatomyTree() {
   if (parent.$("body").data("current")){
     var current = parent.$("body").data("current");
     var selected = parent.$("body").data(current.template).selected;
     file = "/data/" + fileFromId(current.template).replace("composite.wlz","tree.json");
     $.getJSON( file, function( data ) {
       parent.$("body").data("tree",data);
       if (parent.$("body").data("tree")) {
         var content = "";
         content += '<div class="tree well" style="overflow:scroll;">';
         content += createTreeHTML(parent.$("body").data("tree"));
         content += "</div>";
         $("#anatoContent").html(content);
         updateWlzDisplay();
         $(function () {
            $('.tree li:has(ul)').addClass('parent_li').find(' > span').has('b').attr('title', 'Expand this branch');
            $('.tree li.parent_li > span').has('b').on('click', function (e) {
                var children = $(this).parent('li.parent_li').find(' > ul > li');
                if (children.is(":visible")) {
                    children.hide('fast');
                    $(this).attr('title', 'Expand this branch').find(' > b').html('<span class="glyphicon glyphicon-expand" style="border:none;"></span>');
                } else {
                    children.show('fast');
                    $(this).attr('title', 'Collapse this branch').find(' > b').html('<span class="glyphicon glyphicon-collapse-down" style="border:none;padding-left:0px;padding-right:0px;"></span>');
                }
                e.stopPropagation();
            });
            $('.tree ul').first().css("padding", 0);
         });
       }
       // collapse all at start:
       if (selected[1]) {
         collapseTree();
       }else{
         maximizeMenuTabs(false);
         $('.tab-pane').removeClass('active');
         $('#anato').addClass('active');
         $('#AnatoMenuTab').addClass('active');
       }
       updateMenuData();
     });
   }
}

function addAllDomains() {
  var available = parent.$("body").data("available").split(",");
  ga('send', 'event', 'viewer', 'Opening all anatomy', parent.$("body").data("current").template);
  if (cleanIdforInt(available[0]).indexOf('VFBt_')>-1){
    available.shift();
  }
  if (cleanIdforInt(available[0]).indexOf('FBbt_00003624')>-1){
    available.shift();
  }
  addToStackData(available);
  $('#canvas').css('cursor', 'wait');
  updateMenuData();
  updateWlzDisplay();
}

function removeAllDomains() {
  var available = parent.$("body").data("available").split(",");
  ga('send', 'event', 'viewer', 'Opening all anatomy', parent.$("body").data("current").template);
  removeFromStackData(available);
  updateMenuData();
  updateWlzDisplay();
}

function expandTree() {
  var children = $('.tree li.parent_li > span').parent('li.parent_li').find(' > ul > li');
  children.show('fast');
  $('.parent_li').find(' > span').find(' > b').html('<span class="glyphicon glyphicon-collapse-down" style="border:none;padding-left:0px;padding-right:0px;"></span>');
  $('.tree li:has(ul)').find(' > span').has('b').attr('title', 'Collapse this branch');
  ga('send', 'event', 'viewer', 'tree_expand', parent.$("body").data("current").template);
}

function collapseTree() {
  var children = $('.tree li.parent_li > span').parent('li.parent_li').find(' > ul > li');
  children.hide('fast');
  $('.parent_li').find(' > span').find(' > b').html('<span class="glyphicon glyphicon-expand" style="border:none;padding-left:0px;padding-right:0px;"></span>');
  $('.tree li:has(ul)').find(' > span').has('b').attr('title', 'Expand this branch');
  ga('send', 'event', 'viewer', 'tree_collapse', parent.$("body").data("current").template);
}

function createAddToQueryButtonHTML(id) {
  return '<span id="addToQuery" style="border:none;padding-left:0px;padding-right:0px;" title="Add to query" data-id="' + cleanIdforInt(id) + '"></span>';
}

function updateAnatomyTree() {
  if (parent.$("body").data("current")) {
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    var l;
    $('[id^=buttonsFor]').each(function() {
      $(this).html(createControlsBarHTML($(this).data("extid")));
    });
    generateAddButtons();
  }
}

function createTreeHTML(treeStruct) {
  var n;
  var l;
  var id;
  var layer = '0';
  var node;
  var temp;
  var current = parent.$("body").data("current");
  var selected = parent.$("body").data(current.template).selected;
  var html = '<ul>';
  for (n in treeStruct) {
    node = treeStruct[n];
    if (treeStruct[n].node) {
      node = treeStruct[n].node;
    }
    html += "<li>";
    id = node.nodeId;
    if (parent.$("body").data("domains")[id] === undefined || parseInt(parent.$("body").data("domains")[id].nodeId) !== parseInt(id)){ // if nodeId not in sync with array index
      for (l in parent.$("body").data("domains")) {
        if (parseInt(parent.$("body").data("domains")[l].nodeId) == parseInt(id)) {
          id = l;
          break;
        }
      }
    }
    if (parent.$('body').data('domains')[id]){
      html += '<span id="treeLabel"><b><span class="glyphicon glyphicon-unchecked" style="border:none;padding-left:0px;padding-right:0px;"></span></b> '+ parent.$("body").data("domains")[id].name;
      html += "</span>";
      if ($("body").data("domains")[id].domainData.domainId && $("body").data("domains")[id].domainData.domainId !== ""){
        temp = parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(parent.$("body").data("domains")[id].domainData.domainId),5));
      }else{
        temp = cleanIdforInt($("body").data("domains")[id].extId[0]);
      }
      html += '<span id="buttonsFor' + temp + '" data-id="' + temp + '" data-extid="' + cleanIdforInt($("body").data("domains")[id].extId[0]) + '" style="position:absolute;border:none;padding-left:0px;padding-right:0px;">';
      html += createControlsBarHTML(temp);
      html += "</span>";
      if (node.children) {
        html += createTreeHTML(node.children);
      }
    }else{
      alertMessage("Error finding nodeId:" + id);
    }
    html += "</li>";
  }
  html += "</ul>";
  return html;
}

function clearSelectedTable() {
  if ($.fn.dataTable.isDataTable('#selected')) {
    $('#selected').dataTable().distroy();
  }
  var text = '<table id="selected" class="display compact" cellspacing="0" width="100%"><thead><tr><th>ID</th><th>Display</th><th>Name</th><th>Type</th></tr></thead><tbody><tr><th>-</th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th></tr></tbody></table>';
  $('#selecContent').html(text);
  if (!$.fn.dataTable.isDataTable('#selected')) {
    $('#selected').DataTable( { retrieve: true,
      paging: true,
      searching: true,
      ordering: true,
      responsive: true,
      stateSave: true,
      order: [[ 0, 'desc' ]]
    });
  }
  ga('send', 'event', 'viewer', 'clear_all');
}

function addAvailableItems(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  var i;
  var id;
  var layers;
  var layer;
  var temp;
  var current = parent.$("body").data("current");
  var selected = parent.$("body").data(current.template).selected;
  for (i in ids) {
    id = cleanIdforInt(ids[i]);
    if (id.indexOf('VFBd_')>-1 || id.indexOf('VFBt_')>-1){
      temp = parseInt(id.replace(current.template,'').replace(current.template.replace('VFBt_','VFBd_'),''));
      for (layers in parent.$("body").data("domains")){
        if (parent.$("body").data("domains")[layers].domainData.domainId && parseInt(parent.$("body").data("domains")[layers].domainData.domainId) == temp) {
          temp = parent.$("body").data("domains")[layers];
          if (i > 0) {
            setText(temp.name);
          }
          break;
        }
      }
      // Controls:
      if (temp.extId) {
        controls = createControlsBarHTML(cleanIdforInt(temp.extId[0]));
      }else{
        controls = "";
        alertMessage('Unable to resolve for:' + JSON.stringify(temp));
      }
      // Name:
      if (temp.extId) {
        name = '<a href="#details"><span id="ResolvedNameFor' + id + '" data-id="' + cleanIdforInt(temp.extId[0]) + '" onclick="';
        name += "openFullDetails('" + cleanIdforExt(temp.extId[0]) + "');";
        name += '">';
        name += temp.name;
        name += '</span></a>';
      }else{
        name = temp.name;
      }

      // Type:
      if (temp.extId) {
        type = '<span class="hide" id="parentIdFor' + temp.extId[0] + '" data-id="' + temp.extId[0] + '" ></span><a href="#details"><span class="link" onclick="';
        type += "openFullDetails($('#parentIdFor"+temp.extId[0]+"').text())";
        type += '" id="typeFor' + id + '" data-id="' + temp.extId[0] + '">';
        type += cleanIdforExt(temp.extId[0]);
        type += '</span></a>';
      }else{
        type = "";
      }
    }else{
      for (layers in selected){
        if (cleanIdforInt(selected[layers].id) == id) {
          temp = selected[layers];
          if (temp.name){
            setText(temp.name);
          }else{
            setText(cleanIdforExt(temp.id));
          }
          layer = selected[layers];
          break;
        }
      }
      // Controls:
      controls = createControlsBarHTML(id);
      // Name:
      if (temp.name){
        name = '<a href="#details"><span id="ResolvedNameFor' + id + '" data-id="' + cleanIdforInt(id) + '" onclick="';
        name += "openFullDetails('" + cleanIdforExt(id) + "');";
        name += '">';
        name += temp.name;
      }else{
        name = '<a href="#details"><span id="nameFor' + id + '" data-id="' + cleanIdforInt(id) + '" onclick="';
        name += "openFullDetails('" + cleanIdforExt(id) + "');";
        name += '">';
        name += cleanIdforExt(temp.id);
      }
      name += '</span></a>';
      // Type:
      if (temp.typeid) {
        type = '<a href="#details"><span class="link" onclick="';
        type += "openFullDetails('" +temp.typeid + "')";
      }else{
        type = '<span class="hide" id="parentIdFor' + id + '" data-id="' + cleanIdforExt(id) + '" ></span><a href="#details"><span class="link" onclick="';
        type += "openFullDetails($('#parentIdFor"+id+"').text())";
      }
      if (temp.type) {
        type += '" id="resolvedTypeFor' + id + '" data-id="' + cleanIdforExt(id) + '" >';
        type += temp.type;
      }else{
        type += '" id="typeFor' + id + '" data-id="' + cleanIdforExt(id) + '" data-layer="' + i + '">';
        type += cleanIdforExt(id);
      }
      type += '</span></a>';

    }
    $('#selected').dataTable().fnAddData([ SelectedIndex, controls, name, type], false);
    SelectedIndex++;
  }
  $('#selected').dataTable().fnAdjustColumnSizing(false);
  $('#selected').DataTable().draw(false);
  $(".dataTables_paginate li").css("margin", 0);
  $(".dataTables_paginate li").css("padding", 0);
  updateLabels();
  if (temp.extid){
    id=temp.extid;
  }
  if (id.indexOf('FBbt') > -1 || id.indexOf('VFB_') > -1) {
    openFullDetails(id);
  }
}

function copyUrlToClipboard() {
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    var i;
    var displayed = selected[0].id;
    for (i in selected) {
      if (i>0){
        displayed += "," + selected[i].id;
      }
    }
    $("body").append("<input type='text' id='temp' style='position:absolute;opacity:0;'>");
    $("#temp").val("http://"+window.location.host+window.location.pathname+"?add="+displayed).select();
    document.execCommand("copy");
    ga('send', 'event', 'viewer', 'copy_url', $("#temp").val());
    $("#temp").remove();
}

loadColours();
$('body').ready( function () {
  $('body').css('cursor', 'wait');
  initWlzControls();
  window.setInterval(function(){
    updateMenuData();
  }, 10000);
});
