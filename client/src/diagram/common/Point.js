/**
 *  图元: 可操作的点
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');
    var $ = require('jquery');

    var Point = module.exports = Element.extend({

        /**
         *  初始化
         */
        initialize: function(paper, options) {
            var self = this;
            var s = this.size = this.width = this.height = options.size || 4;
            var style = $.extend({
                'fill': 'white',
                'stroke-color': 'black'
            }, options.style);

            this.el = this.$el = paper.circle(this.x , this.y, s).attr(style);

        },

        move: function(x, y, options) {
            this.el.attr({
                cx: x,
                cy: y
            });
            Element.prototype.move.call(this, x, y, options);
        },

        remove: function() {
            this.el.remove();
            this.trigger('remove', this);
        },

        hide: function() {
            this.el.hide();
            this.trigger('hide', this);
        },

        show: function() {
            this.el.show();
            this.trigger('show', this);
        }

    });
});