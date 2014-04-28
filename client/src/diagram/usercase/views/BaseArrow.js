define(function(require, exports, module) {
    var Arrow = require('../../common/Arrow.js');
    var DiagramUnit = require('../../common/DiagramUnit.js');
    var Point = require('../../common/Point.js');

    var BaseArrow = module.exports = DiagramUnit.extend({

        paint: function(paper, options) {
            var self = this;
            this.arrow = new Arrow(paper, options);
            this.startHandle = new Point(paper).hide();
            this.endHandle = new Point(paper).hide();

            this.selectHandle.push(this.arrow.line);
            this.dragHandle.push(this.arrow.line);

            this.startHandle.on('dragMove', function() {
                self.arrow.
            });
        },

        /**
         *  进入选中模式
         */
        enterSelectMode: function() {
            this.startHandle.show();
            this.endHandle.show();
        },

        /**
         *  离开选中模式
         */
        cancelSelectMode: function() {
            this.startHandle.hide();
            this.endHandle.hide();
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