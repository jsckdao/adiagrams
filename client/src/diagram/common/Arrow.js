/**
 *  图元: 箭头
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');
    var Point = require('./Point.js');
    var Line = require('./Line.js');
    var _ = require('_');
    var ArrowHead = require('./ArrowHead.js');

    var Arrow = module.exports = Line.extend({

        initialize: function(paper, options) {
            var o = options;
            this.options = o =  _.extend({
                points: [
                    [100, 100],
                    [200, 200]
                ],
                style: {
                    'stroke-width': 2
                }
            }, o);

            Line.prototype.initialize.call(this, paper, o);
            var p = this.points[this.points.length - 1];
            this.arrowHead = this.paintArrawHead(p[0], p[1]);
            this.changeArrowHeadAngle();

            // 当结束点位置发生变化时, 箭头指针的位置与方向也发生变化
            this.on('movePoint', function(self, index, x, y) {

                // 位置变化
                if (index == self.points.length - 1) {
                    self.arrowHead.move(x, y);
                }

                self.changeArrowHeadAngle();
            });
        },



        /**
         * 根据现在的线的角度, 变化箭头显示的角度
         */
        changeArrowHeadAngle: function() {
            var l = this.points.length - 1;
            var p1 = this.points[l], p2 = this.points[l - 1];
            var d1 = p1[1] - p2[1], d2 = p1[0] - p2[0];
            
            // 计算角度
            var a = Math.atan(d1 / d2) / Math.PI * 180;
            a = d2 >= 0 ? 180 + a : a;
            this.arrowHead.rotate(a);
        },

        /**
         * 绘制箭头头部
         */
        paintArrawHead: function(x, y) {
            return new ArrowHead(this.paper,{
                x: x, 
                y: y,
                style: this.options.style
            });
        }

    });
});