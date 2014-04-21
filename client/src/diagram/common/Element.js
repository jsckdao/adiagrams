define(function(require, exports, module) {
    var _ = require('_');
    var BB = require('backbone');
    var $ = require('jquery');

    /*** 
     * 图形元素基类
     */
    var Element = module.exports = function(paper, options) {
        options = options || {};
        this.$el = paper.set();
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.initialize.call(this, paper, options);
    };

    Element.extend = BB.Model.extend;

    _.extend(Element.prototype, BB.Events, {

        /**
         *  默认构造方法
         */
        initialize: function(paper, options) {

        },

        /**
         *  进入编辑模式
         */ 
        enterEditMode: function(options) {
            this.onEnterEditMode(options);
            this.trigger('enterEditMode', options);
        },

        /**
         *  退出编辑模式
         */
        closeEditMode: function(options) {
            this.onCloseEditMode(options);
            this.trigger('closeEditMode', options);
        },

        onEnterEditMode: function(options) {

        },

        onCloseEditMode: function(options) {
            
        },

        /**
         *  允许拖拽操作
         */
        enableDrag: function(dragContext) {
            var el = this.$el;
            var x, y;

            var moveHandle = function(evt) {
                var dx = evt.clientX - x,
                    dy = evt.clientY - y;
                x = evt.clientX;
                y = evt.clientY;

                el.forEach(function(e) {
                    var cx = e.attr('cx'),
                        cy = e.attr('cy');
                    e.attr({
                        cx: cx + dx,
                        cy: cy + dy
                    });
                });
            };

            var dropHandle = function(evt) {
                $(document).unbind('mousemove', moveHandle);
                $(document).unbind('mouseup', dropHandle);
            };

            this._dragHandle = function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                x = evt.clientX, y = evt.clientY;
                console.log('start drag', evt);
                $(document).mousemove(moveHandle);
                $(document).mouseup(dropHandle);
            };

            dragContext.mousedown(this._dragHandle);
        },

        /**
         *  禁用拖拽操作
         */
        disableDrag: function(dragContext) {

        },


    });
});