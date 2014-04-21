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
        this.$el = paper.set();
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 0;
        this.height = options.height || 0;
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
         *  包含其他的图形元素
         */
        include: function(element) {
            if (element instanceof Element) {
                var set = this.$el;
                element.$el.forEach(function(el) {
                    set.push(el);
                });
            }
        },

        /**
         *  从画布中移除
         */
        remove: function() {
            this.$el.remove();
        }

    });
});