/**
 *  所有图形元素的基类
 */
define(function(require, exports, module) {
    var _ = require('_');
    var BB = require('backbone');
    var $ = require('jquery');

    /*** 
     * 图形元素基类
     */
    var Element = module.exports = function(paper, options) {
        options = options || {};
        this.paper = paper;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 0;
        this.height = options.height || 0;
        this.initialize.call(this, paper, options);
    };

    Element.extend = BB.Model.extend;

    _.extend(Element.prototype, BB.Events, {

        /**
         *  默认构造方法, 交给子类实现
         */
        initialize: function(paper, options) {

        },

        /**
         *  位置调整, 交给子类扩展
         */
        move: function(x, y, options) {
            this.x = x;
            this.y = y;
            this.trigger('move', this, x, y, options);
        },

        /**
         *  大小重置方法, 交给子类扩展
         */ 
        resize: function(width, height, options) {
            this.width = width;
            this.height = height;
            this.trigger('resize', this, x, y, options);
        },

        /**
         *  从画布中移除, 交给子类扩展
         */
        remove: function() {
            this.trigger('remove', this);
        },

        /**
         *  中画布中隐藏, 交给子类扩展
         */
        hide: function() {
            this.trigger('hide', this);
        },

        /**
         *  解除隐藏状态, 交个子类去扩展
         */
        show: function() {
            this.trigger('show' , this);
        }

    });
});