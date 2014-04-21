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
            var mx, my, self = this;
            var el = self.$el;

            // 开始拖动时的动作
            var dragHandle = function(evt) {
                // 记录坐标于鼠标坐标
                evt.preventDefault();
                mx = evt.clientX;
                my = evt.clientY;
                self.paperContext.bind('mousemove', moveHandle);
                self.paperContext.bind('mouseup', dropHandle);
            };

            // 拖动时的动作
            var moveHandle = function(evt) {
                var dx = evt.clientX - mx,
                    dy = evt.clientY - my;
                my = evt.clientY;
                mx = evt.clientX;

                el.scrollLeft(el.scrollLeft() - dx);
                el.scrollTop(el.scrollTop() - dy);
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
            }).resize();
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
            this.$el.scrollLeft((this.paperWidth - this.frameWidth) / 2);
            this.$el.scrollTop((this.paperHeight - this.frameHeight) / 2);
        },

        // 加入页面中
        render: function(context) {
            var op = this.options;
            this.$el.appendTo(context);
            this.paperContext.appendTo(this.$el);

            this.resizePaper(op.paperWidth, op.paperHeight);
            this.initResizeFrame();
            this.initPaperDrag();
            this.movePaperCenter();
            return this;
        }
    });
});