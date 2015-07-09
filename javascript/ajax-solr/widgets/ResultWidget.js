(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    $(this.target).html($('<img>').attr('src', '/javascript/ajax-solr/images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(
            $('<a href="#"></a>')
            .text(facet_values[i])
            .click(this.facetHandler(facet_field, facet_values[i]))
          );
        }
        else {
          links.push('no items found in current selection');
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + htmlEscape(AjaxSolr.Parameter.escapeValue(facet_value)));
      self.doRequest(0);
      return false;
    };
  },

  afterRequest: function () {
    var self = this;
    $(self.target).empty();
    var doc;
    var url = window.location.href;
    for (var i = 0, l = self.manager.response.response.docs.length; i < l; i++) {
      doc = self.manager.response.response.docs[i];
      $(self.target).append(self.template(doc));
    }
    if (self.manager.response.response.numFound < 50){
      $('#anatomyDetails').load('/do/ont_bean.html?id=' + self.manager.response.response.docs[0].short_form[0].replace(':','_'));
    }
    if (self.manager.response.response.numFound == 1) { // only show results list if multiple results
      self.manager.store.get('q').val('*:*');
      self.manager.store.remove('fq');
      $('#result-section').hide();
      $('#details-section').addClass('col-lg-12').removeClass('col-lg-8');
      self.doRequest();
      if (url.indexOf('anatomy_finder') < 0 && url.indexOf('stacks') < 0){
        window.location = '/site/tools/anatomy_finder/?id=' + doc.short_form[0].replace(':','_');
      }
    }else if (self.manager.response.response.numFound === 0){
      $('#result-section').hide();
      $('#details-section').addClass('col-lg-12').removeClass('col-lg-8');
    }else if (self.manager.response.response.numFound < 3000){ // if a resonable number of results then reshow.
      $('#details-section').addClass('col-lg-8').removeClass('col-lg-12');
      $('#result-section').show();
      if (url.indexOf('anatomy_finder') < 0 && url.indexOf('stacks') < 0){
        window.location = '/site/tools/anatomy_finder/?id=' + self.manager.response.response.docs[0].short_form[0].replace(':','_');
      }
    }
  },

  template: function (doc) {
    var snippet = '';
    var maxNum = 50;
    if (typeof(doc.description) != "undefined" && doc.description.length > maxNum) {
      snippet += doc.description.substring(0, maxNum);
      snippet += '<span style="display:none;">' + doc.description.substring(maxNum);
      snippet += '</span><a href="#" class="more">more</a>';
    }else{
      snippet += doc.description;
    }

    var output = '<div><a href="#anatomyDetails" onclick="openFullDetails(' + "'" + doc.short_form[0].replace(':','_') + "'" + ');" >';
    // if (doc.short_form[0].indexOf('VFB') > -1) {
    //   output += '<img class="lazy" align="right" data-original="/owl/' + doc.short_form[0].replace(':','_').replace('VFB_', 'VFBi_') + '/thumbnail.png" class="img-thumbnail" style="height: 37px; padding: 0px" data-holder-rendered="false" onerror="this.style.display = \'none\';">';
    // }
    output += '<dt>' + doc.label;
    output += ' <span class="small">(' + doc.short_form[0].replace(':','_') + ')</span></dt>';
    output += '<dd class="small">';
    output += snippet + '</dd></a></div>';
    return output;
  },

  init: function () {
    $(document).on('click', 'a.more', function () {
      var $this = $(this),
          span = $this.parent().find('span');

      if (span.is(':visible')) {
        span.hide();
        $this.text('more');
      }
      else {
        span.show();
        $this.text('less');
      }

      return false;
    });
  }
});

})(jQuery);
