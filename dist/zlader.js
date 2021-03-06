;(function($) {
  "use strict"

  function ZladerError(index) {
    var message = "Unknown plugin error."
    switch(index) {
      case  1: message = "The slider can not be without a frame."; break;
      case  2: message = "The slider can not be without a slides."; break;
    }
    Error.call(this, message);
    this.name = "ZladerError";
    this.message = message;
    this.index = index;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZladerError);
    } else {
      this.stack = (new Error()).stack;
    }
  }
  ZladerError.prototype = Object.create(Error.prototype);

  $.fn.zlader = function(o) {
    if (this.toArray().length != 1) {
      throw new Error('Плагин предназначен для инициализации единичого Dom.')
    }
    var data = this.data('zlader')
    if (!data) {
      var instance = $.fn.zlader._initialize.bind(this)(o)
      // instance = instance || this
      instance.activate()
      instance.data('zlader', {
        instance: instance
      })
    } else {
      instance = data.instance
    }
    return instance
  }

  // Приватные методы не доступные для jQ объекта
  var method = {
    activate_relays: function() {
      this.on('click', this.options.selectors.relay, {instance: this}, method.relay_click_handler)
    },
    activate_automatic_leafing_over: function() {
      this.activate_leafing_over()
      method.activate_leafing_over_pauses.call(this)
    },
    relay_click_handler: function(event) {
      var instance = event.data.instance
      var active_slide_index = instance.get_active_slide_index()
      var relay_index = instance.relays.index($(this))
      if (active_slide_index != relay_index) {
        instance.view(relay_index)
      }
    },
    activate_leafing_over_pauses: function() {
      this.on('mouseenter', this.deactivate_leafing_over.bind(this))
      this.on('mouseleave', this.activate_leafing_over.bind(this))
    }
  }

  $.fn.zlader._initialize = function(o) {
    this.options = $.extend($.fn.zlader.default_options, o || {});
    this.frame = this.find(this.options.selectors.frame).first()
    if (this.frame.length != 1) {
      throw new ZladerError(1)
    }
    this.slides = this.frame.find(this.options.selectors.slide)
    if (this.slides.length < 1) {
      throw new ZladerError(2)
    }
    this.panel = this.find(this.options.selectors.panel).first()
    this.relays = this.panel.find(this.options.selectors.relay)
    this.get_active_slide_index = function() {
      var active_slide_index = this.slides.index(this.slides.filter(".active").last())
      if (active_slide_index < 0 || active_slide_index > this.slides.length - 1) {
        this.slides.last().addClass('active')
        active_slide_index = this.slides.length - 1
      }
      return active_slide_index
    }
    if (this.relays.filter("active").length != 1) {
      this.relays.removeClass("active")
      this.relays.eq(this.get_active_slide_index()).addClass("active")
    }
    this.statuses = {
      is_animated: false,
      leafing_over_interval_id: null
    }

    this.activate = function() {
      method.activate_relays.call(this)
      method.activate_automatic_leafing_over.call(this)
    }
    this.view = function(index) {
      if (this.statuses.is_animated) {
        return null
      }
      var frame_width = parseInt(this.frame.css("width"))
      var slide = this.slides.eq(index)
      this.statuses.is_animated = true
      if (index > this.get_active_slide_index()) {
        slide.css({left: frame_width + "px"})
      } else {
        slide.css({left: "-" + frame_width + "px"})
      }
      slide.addClass("leafing")
      this.relays.removeClass("active")
      this.relays.eq(index).addClass("active")
      var instance = this
      slide.animate({left:"0px"}, {complete: function() {
        instance.slides.removeClass("active")
        slide.addClass("active")
        slide.removeClass("leafing")
        instance.statuses.is_animated = false
      }})
    }
    this.activate_leafing_over = function() {
      if (
        this.statuses.leafing_over_interval_id != null ||
        this.options.leafing_over_interval == null || this.options.leafing_over_interval == 0
      ) {
        return null
      }
      this.statuses.leafing_over_interval_id = setInterval(this.next.bind(this), this.options.leafing_over_interval)
    }
    this.deactivate_leafing_over = function() {
      clearInterval(this.statuses.leafing_over_interval_id)
      this.statuses.leafing_over_interval_id = null
    }
    this.next = function() {
      var active_slide_index = this.get_active_slide_index()
      var next_index = (active_slide_index == this.slides.length - 1) ? 0 : ++active_slide_index
      this.view(next_index)
    }
    return this
  }

  $.fn.zlader.default_options = {
    selectors: {
      panel: '.panel',
      relay: '.relay',
      frame: '.frame',
      slide: '.slide'
    },
    leafing_over_interval: 8000
  }

})(jQuery);
