;(function($) {
  "use strict"

  $.fn.zlader = function(o = null) {
    if (this.toArray().length != 1) {
      throw new Error('Плашин предназначен для инициализации единичого Dom.')
    }
    var data = this.data('zlader')
    if (!data) {
      var instance = $.fn.zlader._initialize.bind(this)(o)
      instance.activate()
      instance.data('zlader', {
        instance: instance
      })
    } else {
      instance = data.instance
    }
    return instance
  }

  $.fn.zlader._initialize = function(o) {
    this.options = $.extend($.fn.zlader.default_options, o || {});
    this.place = this
    this.activate = function() {
      this.activate_controls()
      this.activate_interval()
    }
    this.activate_controls = function() {
    }
    this.activate_interval = function() {
    }
    return this
  }

  $.fn.zlader.default_options = {
  }

})(jQuery);
