define(function(require, exports, module) {

    var $ = require('jquery'),
        R = require('raphael'),
        BB = require('backbone');

    /**
     *  画布容器, 主要封装关于画布放大缩小拖拽等操作
     */
    var DiagramDesk = module.exports = BB.View.extend({

        initialize: function(options) {
            this.options = $.extend({
                paperWidth: 2700,
                paperHeight: 2500
            }, options);

            // 视图大小
            this.frameWidth = this.frameHeight = 0;
            // 画布大小
            this.paperWidth = this.paperHeight = 0;
            // 画布相对视图左上角的坐标
            this.paperX = this.paperY = 0;

            this.$el = $('<div class="de-desk" />');
            this.paperContext = $('<div class="de-paper"/>');
            this.paper = R(this.paperContext[0]);
        },

        // 设置画布可拖动
        initPaperDrag: function() {
            var dx, dy, self = this;

            // 开始拖动时的动作
            var dragHandle = function(evt) {
                dx = evt.clientX - self.paperX;
                dy = evt.clientY - self.paperY;
                self.paperContext.bind('mousemove', moveHandle);
                self.paperContext.bind('mouseup', dropHandle);
            };

            // 拖动时的动作
            var moveHandle = function(evt) {
                self.setPaperLocation(evt.clientX - dx, evt.clientY - dy);
            };

            // 拖动结束动作
            var dropHandle = function(evt) {
                self.paperContext.unbind('mouseup', dropHandle);
                self.paperContext.unbind('mousemove', moveHandle);
            };

            this.paperContext.bind('mousedown', dragHandle);
        },

        // 设置当视图大小重置时的操作
        initResizeFrame: function() {
            var el = this.$el[0];
            var self = this;

            this.$el.resize(function() {
                self.frameWidth = el.offsetWidth;
                self.frameHeight = el.offsetHeight;

                // 只要视图大小小于画布大小, 就尽量保证视图不超出
                if (self.frameWidth < self.paperWidth || self.frameHeight < self.paperHeight) {

                }
                // 否则尽量使画布保持居中显示
                else {
                    self.movePaperCenter();
                }
            }).resize();

        },

        // 重设画布位置
        setPaperLocation: function(x, y) {
            this.paperX = x;
            this.paperY = y;
            this.paperContext.css({
                left: this.paperX + 'px',
                top: this.paperY + 'px'
            });
        },

        // 重置画布大小
        resizePaper: function(width, height) {
            this.paperWidth = width;
            this.paperHeight = height;
            this.paperContext.css({
                width: width + 'px',
                height: height + 'px'
            });
            this.paper.setSize(width, height);
        },

        // 居中显示
        movePaperCenter: function() {
            this.setPaperLocation((this.frameWidth - this.paperWidth) / 2, (this.frameHeight - this.paperHeight) / 2);
        },

        render: function(context) {
            var op = this.options;
            this.$el.appendTo(context);
            this.paperContext.appendTo(this.$el);

            this.resizePaper(op.paperWidth, op.paperHeight);
            this.initResizeFrame();
            this.initPaperDrag();
            this.movePaperCenter();

            /*

            var c = this.paper;
            var el = c.circle(300, 200, 50);
            el.attr('fill', 'red');

            var sx = 300, sy = 200;
            var cx, cy;

            el.drag(function(dx, dy, x, y, evt) {
                el.attr({
                    cx: ( sx = x - cx ),
                    cy: ( sy = y - cy )
                });
            }, function(x, y) {
                cx = x - sx;
                cy = y - sy;
            }, function(x, y) {

            });
            */
            return this;
        }
    });
});