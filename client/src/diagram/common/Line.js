/**
 *  图元: 直线
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');

    var Line = module.exports = Element.extend({

        /**
         *  初始化
         */
        initialize: function(paper, options) {
            this.points = options.points;
            if (!this.points || this.points.length < 2) {
                throw new Error('line must has less two points!');
            }
            var p = this.points[0];
            this.x = p[0], this.y = p[1];
            this.path = paper.path(this.buildPathString()).attr(options.style);
        },

        /**
         *  整体移动, 重写自Element.move
         */
        move: function(x, y, options) {
            var dx = this.x - x, dy = this.y - y;
            for (var i = this.points.length; i--;) {
                var p = this.points[i];
                p[0] -= dx;
                p[1] -= dy;
                this.trigger('movePoint', this, i, p[0], p[1]);
            }
            this.path.attr('path', this.buildPathString());
            Element.prototype.move.call(this, x, y, options);
        },

        /**
         *  移动单个点
         */
        movePoint: function(index, x, y, options) {
            this.points[index] = [x, y];
            this.path.attr('path', this.buildPathString());
            this.trigger('movePoint', this, index, x, y);

            // 如果是第一个点移动的话, 修改x, y 属性
            if (index == 0) {
                this.x = x;
                this.y = y;
                this.trigger('move', this, x, y, options);
            }
        },

        /**
         *  根据线中的各点坐标构建 Path String
         */ 
        buildPathString: function() {
            var str = [];
            var len = this.points.length;
            for (var i = 0; i < len; i++) {
                var p = this.points[i];
                str.push(p[0] + ',' + p[1]);
            }
            return 'M' + str.join('L');
        },

        remove: function() {
            this.path.remove();
            this.trigger('remove', this);
        }
    });
});