(function ($) {

AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  afterRequest: function () {
    var self = this;
    var links = [];

    var q = this.manager.store.get('q').val();
    if (q != '*:*') {
      q = q.toLowerCase().replace('fbbt:','fbbt_').replace('vfb:','vfb_');
      if (q.indexOf(':') < 0){ // force wildcard search by default
        if (q.indexOf('vfb_') > -1 || q.indexOf('fbbt_') > -1){
          q = 'short_form:' + q.replace('vfb','VFB').replace('fbbt','FBbt') + '*';
        }else{
          q = 'label_suggest:' + q;
        }
        self.manager.store.get('q').val(q);
        self.doRequest();
      }
      links.push($('<a href="#"></a>').html('<span class="glyphicon glyphicon-remove-circle"></span> ' + q).click(function () {
        self.manager.store.get('q').val('*:*');
        self.doRequest();
        return false;
      }));
    }

    var fq = this.manager.store.values('fq');
    for (var i = 0, l = fq.length; i < l; i++) {
      if (fq[i].match(/[\[\{]\S+ TO \S+[\]\}]/) && (fq[i].indexOf('FBbt_') < 0)) {
        var field = fq[i].match(/^\w+:/)[0];
        var value = fq[i].substr(field.length + 1, 10);
        links.push($('<a href="#"></a>').html('<span class="glyphicon glyphicon-remove-circle"></span> ' + field + value).click(self.removeFacet(fq[i])));
      }
      else {
        links.push($('<a href="#"></a>').html('<span class="glyphicon glyphicon-remove-circle"></span> ' + fq[i]).click(self.removeFacet(fq[i])));
      }
    }

    if (links.length > 1) {
      links.unshift($('<a href="#"></a>').text('clear all').click(function () {
        self.manager.store.get('q').val('*:*');
        self.manager.store.remove('fq');
        self.doRequest();
        return false;
      }));
    }

    if (links.length) {
      var $target = $(this.target);
      $target.empty();
      for (var i = 0, l = links.length; i < l; i++) {
        $target.append($('<li></li>').append(links[i]));
      }
      $('#search-tab').show();
    } else {
      $(this.target).html('<kbd>ESC</kbd> to close suggestions');
      $('#search-tab').show();
    }
  },

  removeFacet: function (facet) {
    var self = this;
    return function () {
      if (self.manager.store.removeByValue('fq', facet)) {
        self.doRequest();
      }
      return false;
    };
  }
});

})(jQuery);
