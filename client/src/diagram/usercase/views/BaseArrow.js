define(function(require, exports, module) {
    var Arrow = require('../../common/Arrow.js');
    var DiagramUnit = require('../../common/DiagramUnit.js');
    var Point = require('../../common/Point.js');
    var Dragable = require('../../common/Dragable.js');

    var names = ['startPoint', 'endPoint'];

    var BaseArrow = module.exports = DiagramUnit.extend({

        paint: function(paper, options) {
            var self = this, def = { x: 0, y: 0 };
            this.arrow = new Arrow(paper, options);
            this.points = [def, def];

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
                    var a = self.pointProcess(p1, p2);
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
            this.setPoint(0, point);
        },

        /**
         *  设置结束点位
         */
        setEndPoint: function(point) {
            this.setPoint(1, point);
        },

        setPoint: function(index, point) {
            var n = names[index];

            if (point instanceof DiagramUnit) {
                if (this[n]) {
                    this.removePoint(index);
                }
                var self = this;
                var method = '__' + n + 'Move';
                this[n] = point;
                this[method] = function(p, x, y) {
                    self.movePoint(index, x, y);
                };
                point.on('move', this[method]);

                this.points[index] = {
                    x: point.x, 
                    y: point.y,
                    width: point.width, 
                    height: point.height,
                    shape: point.shape || 'ellipse'
                };
            }
            else {
                this.points[index] = {
                    x: point[0], y: point[1],
                    shape: 'none'
                };
            }
            this.movePoint(index, point.x, point.y);
        },

        removePoint: function(index) {
            var n = names[index];
            var method = '__' + n + 'Move';
            if (this[n]) {
                this[n].off('move', this[method]);
                delete this[n];
            }
        },

        /**
         *  移除起始点位
         */
        removeStartPoint: function() {
            this.removePoint(0);
        },

        /**
         *  移除结束点位
         */
        removeEndPoint: function() {
            this.removePoint(1);
        }
    });


    /**
     *  处理椭圆环绕模式的点, 计算公式为:
     *  k = (y0 - y1) / (x0 - x1)  // 这是计算线段斜率
     *  x = -\+ w * h / Math.sqrt(h^2 + k^2 * w^2) + x0
     *  y = -\+ w * h * k / Math.sqrt(h^2 + k^2 * w^2) + y0
     *  x, y 计算出来都存在两个解, 需要根据线段的情况取其中合适的解
     */
    function ellipsePointProcess(p1, p2) {
        var dx = p1.x - p2.x, dy = p1.y - p2.y;
        var w = p1.width / 2, h = p1.height / 2;
        if (dx == 0) {
            return { 
                x: p1.x, 
                y: p2.y > p1.y ? p1.y + h : p1.y - h
            };
        }
        if (dy == 0) {
            return { 
                x: p2.x > p1.x ? p1.x + w : p1.x - w, 
                y: p1.y 
            };
        }
        var k = dy / dx;
        
        var r = h * h + k * k * w * w;
        var a = w * h / Math.sqrt(r), b = a * k;

        // 求出两个解,取离箭头线段另一端点最近的解
        var x1 = p1.x + a, x2 = p1.x - a,
            y1 = p1.y + b, y2 = p1.y - b;
        return {
            x: Math.abs(x1 - p2.x) < Math.abs(x2 - p2.x) ? x1 : x2,
            y: Math.abs(y1 - p2.y) < Math.abs(y2 - p2.y) ? y1 : y2,
        };
    }

    /**
     *  处理矩形环绕模式的点
     */
    function rectPointProcess(p1, p2) {
        var dx = p1.x - p2.x, dy = p1.y - p2.y;
        if (dx == 0) {
            var xty = function() { return p1.x };
            var ytx = function(y) { return p1.x };
        }
        else if (dy == 0) {
            //var 
        }
        else {
            // 先求箭头直线斜率
            var k = (p1.y - p2.y) / (p1.x - p2.x);
            // 计算偏移量
            var d = p1.y - k * p1.x;
            var xty = function(x) {
                return x * k + d;
            };
            var ytx = function(y) {
                return (y - d) / k;
            };
        }
    }
});