 /**
 *  箭头的头部指针
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');
    var $ = require('jquery');

    var ArrowHead = module.exports = Element.extend({



        initialize: function(paper, options) {
            this.size = options.size || 10;
            this.path = paper.path(this.buildPathString(this.x, this.y));
            
            var style = $.extend({
                'fill': 'black'
            }, options.style);

            this.path.attr(style);
        },

        buildPathString: function(x, y) {
            var s = this.size / 2;
            var x1 = x + s * Math.sqrt(3) / 3;
            return 'M' + (x - 2 * s * Math.sqrt(3) / 3) + ',' + y + 'L' + x1 + ',' + (y + s) + 'L' + x1 + ',' + (y - s) + 'Z';
        },

        move: function(x, y, options) {
            this.path.attr('path', this.buildPathString(x, y));
            Element.prototype.move.call(this, x, y, options);
        },

        rotate: function(r) {
            this.path.transform('r' + r);
        }
    });
});