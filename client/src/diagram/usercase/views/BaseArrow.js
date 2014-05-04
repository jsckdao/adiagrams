define(function(require, exports, module) {
    var Arrow = require('../../common/Arrow.js');
    var DiagramUnit = require('../../common/DiagramUnit.js');
    var Point = require('../../common/Point.js');
    var Dragable = require('../../common/Dragable.js');

    var BaseArrow = module.exports = DiagramUnit.extend({

        paint: function(paper, options) {
            var self = this;
            this.arrow = new Arrow(paper, options);
            if (!options.start || !options.end) {
                throw new Error('arrow must set start point and end point!!');
            }
            this.connect(options.start, options.end);
        },


        /**
         *  移动起始点位
         */
        moveStartPoint: function(x, y, options) {
            this.movePoint(0, x, y, options);
        },

        /**
         *  移动结束点位
         */
        moveEndPoint: function(x, y, options) {
            this.movePoint(1, x, y, options);
        },


        movePoint: function(index, x, y, options) {
            var p = this.points[index];
            var self = this;
            if (p) {
                p.x = x, p.y = y;
                this.points.forEach(function(e, i) {
                    var p1 = e, p2 = i == 0 ? self.points[i + 1] : self.points[i - 1];
                    var a = this.pointProcess(p1, p2);
                    self.arrow.movePoint(i, a.x, a.y, options);
                });
            }
        },

        /**
         *  根据线的方向以及指定点的环绕模式最终确定线在指定端点上该如何绘制
         */
        pointProcess: function(p1, p2) {
            // 椭圆环绕模式
            if (p1.shape == 'ellipse') {
                return ellipsePointProcess(p1, p2);
            } 
            // 矩形环绕模式
            else if (p1.shape == 'rect') {
                return rectPointProcess(p1, p2);
            }
            return { x: p1.x, y: p1.y };
        },


        /**
         *  将箭头连接两个点
         */
        connect: function(p1, p2) {
            this.setStartPoint(p1);
            this.setEndPoint(p2);
        },

        /**
         *  连接起始点位
         */
        setStartPoint: function(point) {
            if (!point) return;
            if (this.startPoint) {
                this.removeStartPoint();
            }
            var self = this;
            this.startPoint = point;
            this.__startPointMove = function(p, x, y) {
                self.arrow.movePoint(0, x, y);
            };

            this.__startPointMove(point, point.x, point.y);
            point.on('move', this.__startPointMove);
        },

        /**
         *  设置结束点位
         */
        setEndPoint: function(point) {
            if (!point) return;
            if (this.endPoint) {
                this.removeEndPoint();
            }
            var self = this;
            this.endPoint = point;
            this.__endPointMove = function(p, x, y) {
                var last = self.arrow.points.length - 1;
                self.arrow.movePoint(last, x, y);
            };
            this.__endPointMove(point, point.x, point.y);
            point.on('move', this.__endPointMove);
        },

        /**
         *  移除起始点位
         */
        removeStartPoint: function() {
            if (this.endPoint) {
                this.endPoint.off('move', this.__endPointMove);
                delete this.endPoint;
            }
        },

        /**
         *  移除结束点位
         */
        removeEndPoint: function() {
            if (this.startPoint) {
                this.startPoint.off('move', this.__startPointMove);
                delete this.startPoint;
            }
        }

        
    });


    /**
     *  处理椭圆环绕模式的点
     */
    function ellipsePointProcess(p1, p2) {

    }

    /**
     *  处理矩形环绕模式的点
     */
    function rectPointProcess(p1, p2) {

    }
});