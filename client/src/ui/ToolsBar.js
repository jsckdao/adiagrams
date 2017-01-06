define(['backbone', 'jquery'], function(require, exports, module) {

    var $ = require('jquery'),
        R = require('raphael'),
        BB = require('backbone');

    /**
     * 左边工具栏
     */
    var ToolsBar = module.exports = BB.View.extend({
        
        /**
         *  初始化
         */
        initialize: function(options) {
            this.diagrams = options.diagramsConfig.diagrams;
            this.$el = $('<div class="de-toolsbar"/>');
            this.buildDiagramList();
        },

        /**
         *  构建图形选择列表
         */
        buildDiagramList: function() {
            var self = this;
            for (var k in this.diagrams) {
                var d = this.diagrams[k];
                var item = $('<div class="de-toolsbar-item"/>').appendTo(this.$el);
                var thumbContext = $('<div class="de-toolsbar-thumb" />').appendTo(item);

                d.key = k;
                item.diagram = d;

                // 绘制svg类型的缩略图
                if (typeof d.thumb == 'object') {
                    var t = thumbContext[0];
                    var p = new R(t, 100, 50);
                    p.add(d.thumb);
                }
                // 绘制自定义类型的缩略图
                else if (typeof d.thumb == 'function') {
                    thumbContext.appendTo(d.thumb());
                }
                // 绘制背景图片类型的缩略图
                else if (typeof d.thumb == 'string') {
                    thumbContext.addClass(d.thumb);
                }

                $('<div class="de-toolsbar-text">' + d.name + '</div>').appendTo(item);

                // 添加点击事件, 可切换被选择的图形单元
                (function(item, d) {
                    item.click(function(evt) {
                        var c = self.currentSelectedDiagram;
                        self.clearSelect();
                        if (c != item) {
                            self.setMousePoint(item, evt);
                            self.setSelect(item);
                        }
                    });
                })(item, d);
            }
        },

        // 如果选择变化, 触发相应的事件
        setSelect: function(item) {
            var self = this;
            if (!self.currentSelectedDiagram) {
                self.currentSelectedDiagram = item.addClass('selected');
                self.trigger('selectDiagram', self, item.diagram);
            }
        },

        /**
         *  清除选择
         */
        clearSelect: function() {
            var self = this;
            if (self.currentSelectedDiagram) {
                self.currentSelectedDiagram.removeClass('selected');
                self.trigger('unselectDiagram', self, self.currentSelectedDiagram.diagram);
                self.currentSelectedDiagram = null;
                self.clearMousePoint();
            }
        },

        /**
         *  设置缩略图鼠标跟随 
         */
        setMousePoint: function(item, evt) {
            if (!this._mouse_thumb) {
                var thumb = this._mouse_thumb = item.find('.de-toolsbar-thumb').clone();

                thumb.css({
                    'zIndex' : 10,
                    'position' : 'fixed',
                    'left': (evt.clientX + 5) + 'px',
                    'top': (evt.clientY + 5) + 'px'
                }).appendTo(document.body);

                thumb._mouse_move = function(evt) {
                    thumb.css({
                        'left': (evt.clientX + 5) + 'px',
                        'top': (evt.clientY + 5) + 'px'
                    });
                };

                $(document).mousemove(thumb._mouse_move);
            }
        },

        /**
         *  清除缩略图的鼠标跟随
         */
        clearMousePoint: function() {
            if (this._mouse_thumb) {
                var thumb = this._mouse_thumb;
                $(document).unbind('mousemove', thumb._mouse_move);
                thumb.remove();
                delete this._mouse_thumb;
            }
        },

        render: function(context) {
            this.$el.appendTo(context);
            return this;
        }
    });
});