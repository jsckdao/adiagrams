define(function(require, exports, module) {
    var Element = require('./Element.js');
    var Point = require('./Point.js');
    var Line = require('./Line.js');
    var _ = require('_');

    var Arrow = module.exports = Line.extend({

        initialize: function(paper, options) {
            var o = options;
            o =  _.extend({
                points: [
                    [100, 100],
                    [200, 200]
                ],
                style: {
                    'stroke-width': 3
                }
            }, o);

            Line.prototype.initialize.call(this, paper, o);
            this.connect(o.startPoint, o.endPoint);
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
                self.movePoint(0, x, y);
            };

            this.__startPointMove(point, point.x, point.y);
            point.on('move', this.__startPointMove);
        },

        setEndPoint: function(point) {
            if (!point) return;
            if (this.endPoint) {
                this.removeEndPoint();
            }
            var self = this;
            this.endPoint = point;
            this.__endPointMove = function(p, x, y) {
                var last = self.points.length - 1;
                self.movePoint(last, x, y);
            };
            this.__endPointMove(point, point.x, point.y);
            point.on('move', this.__endPointMove);
        },

        removeStartPoint: function() {
            if (this.endPoint) {
                this.endPoint.off('move', this.__endPointMove);
                delete this.endPoint;
            }
        },

        removeEndPoint: function() {
            if (this.startPoint) {
                this.startPoint.off('move', this.__startPointMove);
                delete this.startPoint;
            }
        },

        paintArraw: function() {
            
        }
    });
});