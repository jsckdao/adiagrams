define(function(require, exports, module) {
    var Arrow = require('../../common/Arrow.js');
    var DiagramUnit = require('../../common/DiagramUnit.js');
    var Point = require('../../common/Point.js');
    var Dragable = require('../../common/Dragable.js');

    var BaseArrow = module.exports = DiagramUnit.extend({

        paint: function(paper, options) {
            var self = this;
            var a = this.arrow = new Arrow(paper, options);

            this.x = this.arrow.x; 
            this.y = this.arrow.y;

            // 起始拖拽点位
            this.startHandle = new Point(paper, {
                x: a.points[0][0],
                y: a.points[0][1]
            });
            // 末尾拖拽点位
            this.endHandle = new Point(paper, {
                x: a.points[1][0],
                y: a.points[1][1]
            });

            this.startHandle.hide();
            this.endHandle.hide();

            this.selectHandle.push(this.arrow.path);
            this.dragHandle.push(this.arrow.path);

            var isDraging = false;

            // 当线的起始与结束点发生变化, 拖拽点位的位置也随之变化
            this.arrow.on('movePoint', function(arrow, index, x, y) {
                if (!isDraging) {
                    if (index == 0) {
                        self.startHandle.move(x, y);
                    }
                    else if (index == self.arrow.points.length - 1) {
                        self.endHandle.move(x, y);
                    }
                }
                self.trigger('movePoint', this, index, x, y);
            });

            // 拖拽点位可拖拽
            Dragable.enable(this.startHandle, this.startHandle.el);
            Dragable.enable(this.endHandle, this.endHandle.el);


            var _dragStart = function() {
                isDraging = true;
            };

            var _dragEnd = function() {
                isDraging = false;
            };

            // 当两个拖拽点被拖拽时, 实时变化线的位置
            this.startHandle.on('dragStart', _dragStart);
            this.startHandle.on('dragEnd', _dragEnd);
            this.startHandle.on('dragMove', function(handle, dx, dy, x, y) {
                var p = a.points[0];
                a.movePoint(0, p[0] + dx, p[1] + dy);
            });

            this.endHandle.on('dragStart', _dragStart);
            this.endHandle.on('dragEnd', _dragEnd);
            this.endHandle.on('dragMove', function(handle, dx, dy, x, y) {
                var p = a.points[a.points.length - 1];
                a.movePoint(a.points.length - 1, p[0] + dx, p[1] + dy);
            });

        },

        /**
         *  进入选中模式
         */
        enterSelectedMode: function() {
            this.startHandle.show();
            this.endHandle.show();
        },

        /**
         *  离开选中模式
         */
        cancelSelectedMode: function() {
            this.startHandle.hide();
            this.endHandle.hide();
        },

        move: function(x, y, options) {
            this.arrow.move(x, y, options);
            DiagramUnit.prototype.move.call(this, x, y, options);
        },


        /** 
         *  以下实现 Arrow 类中的几个方法
         */
        setStartPoint: function(point) {
            this.arrow.setStartPoint(point);
        },

        setEndPoint: function(point) {
            this.arrow.setEndPoint(point);
        },

        removeStartPoint: function(point) {
            this.arrow.removeStartPoint(point);
        },

        removeEndPoint: function(point) {
            this.arrow.removeEndPoint(point);
        },

        connect: function(start, end) {
            this.arrow.connect(start, end);
        }
    });
});