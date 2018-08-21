;(function() {
  "use strict"

  window.Zlader = function(place, options=null) {
    if (!(place instanceof window.jQuery) || !place.length) {
      throw new window.Error('place is not jQuery object.')
    }
    this.options = Object.assign(window.Zlader.options, options || {})
    this.place = place
    this.slider_id = place.data('zlader_id')
    return this
  }

  window.Zlader.prototype.activate = function() {
    this.activate_ui()
    return this
  }

  window.Zlader.prototype.activate_ui = function() {
    this.activate_scroll()
    this.ui_buttons_apply_position()
  }

  window.Zlader.prototype.activate_scroll = function() {
    var listener = $(this.options.listener_selector)
    listener.on('click', this.next_selector, {instance: this}, this.next_handler)
    listener.on('click', this.prev_selector, {instance: this}, this.prev_handler)
  }

  window.Zlader.prototype.next_handler = function(event) {
    var instance = event.data.instance
    var new_position = instance.calc_position(1)
    if (new_position != instance.position) {
      instance.set_position(new_position)
      instance.ui_apply_position()
    }
  }

  window.Zlader.prototype.prev_handler = function(event) {
    var instance = event.data.instance
    var new_position = instance.calc_position(-1)
    if (new_position != instance.position) {
      instance.set_position(new_position)
      instance.ui_apply_position()
    }
  }

  window.Zlader.prototype.calc_left = function() {
    return this.position * -this.options.division_width
  }

  window.Zlader.prototype.calc_position = function(direction=1) {
    var new_position = this.position + direction * this.options.division_step
    new_position = this.correct_position(new_position)
    return new_position
  }
  window.Zlader.prototype.correct_position = function(position) {
    if (position + 1 > this.count - this.options.window_division) {
      position = this.count - this.options.window_division
    }
    if (position < 0) {
      position = 0
    }
    return position
  }

  window.Zlader.prototype.set_position = function(position) {
    position = this.correct_position(position)
    this.position = position
  }

  window.Zlader.prototype.ui_apply_position = function() {
    this.ui_line_apply_position()
    this.ui_buttons_apply_position()
  }

  window.Zlader.prototype.ui_line_apply_position = function() {
    var left = this.calc_left()
    this.line.css('left', left + 'px')
  }

  window.Zlader.prototype.ui_buttons_apply_position = function() {
    this.ui_prev_apply_position()
    this.ui_next_apply_position()
  }

  window.Zlader.prototype.ui_prev_apply_position = function() {
    if (this.position == 0) {
      this.prev.addClass('disable')
    } else {
      this.prev.removeClass('disable')
    }
  }

  window.Zlader.prototype.ui_next_apply_position = function() {
    if (this.position >= this.count - this.options.window_division) {
      this.next.addClass('disable')
    } else {
      this.next.removeClass('disable')
    }
  }

  window.Zlader.options = {
    listener_selector: 'body',
    next_selector: '.liner-next',
    prev_selector: '.liner-prev',
    line_selector: '.liner-line',
    division_selector: '.product',
    division_width: 218,
    window_division: 4,
    division_step: 1
  }

})();
