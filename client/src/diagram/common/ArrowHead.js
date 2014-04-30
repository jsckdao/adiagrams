/**
 *  箭头的头部指针
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');
    var ArrowHead = module.exports = Element.extend({

        initialize: function(paper, options) {
            this.path = paper.path(this.buildPathString(this.x, this.y));
        },

        buildPathString: function(x, y) {
            var x1 = x - 10;
            return 'M' + x1 + ',' + (y + 5) + 'L' + x + ',' + y + 'L' + x1 + ',' + (y - 5);
        },

        move: function(x, y, options) {
            this.path.attr('path', this.buildPathString(x, y));
            Element.prototype.move.call(this, x, y, options);
        }
    });
});