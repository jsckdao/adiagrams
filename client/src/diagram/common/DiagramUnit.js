/**
 *  图表图列单元基类
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');
    var Dragable = require('./Dragable.js');


    /**
     *  图形单元基类, 图形单元是可被用户在编辑器中直接操作的图形基本单元,
     *  其与 Element 不同之处在于它加入了更多响应用户操作以及与编辑器框架交互
     *  的
     */
    var DiagramUnit = module.exports = Element.extend({


        initialize: function(paper, options) {
            var self = this;
            // 可促使图形可拖拽的元素
            this.dragHandle = paper.set();
            // 可促使图形被选择的元素
            this.selectHandle = paper.set();

            this.paint(paper, options);

            this.selectHandle.click(function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                
            });

            this.selectHandle.forEach(function(e) {
                Dragable.enable(self, e);
            });
        },

        /**
         *  图形绘制, 由子类实现
         */ 
        paint: function(paper, options) {

        },


        /**
         *  选择
         */
        select: function() {
            self.enterSelectedMode();
            self.trigger('selected', self);
        },

        /**
         *  取消选择
         */
        unselect: function() {
            self.cancelSelectedMode();
            self.trigger('unselect', self);
        },

        /** 
         *  进入选中模式时图形应当发生的变化, 由子类实现
         */
        enterSelectedMode: function() {

        },

        /**
         *  离开选中模式时图形应当发生的变化, 由子类实现
         */
        cancelSelectedMode: function() {

        }
    });
});