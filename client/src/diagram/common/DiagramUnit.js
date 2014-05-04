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

        /**
         *  初始化
         */
        initialize: function(paper, options) {
            var self = this;
            // 可促使图形可拖拽的元素
            this.dragHandles = paper.set();
            // 可促使图形被选择的元素
            this.selectHandles = paper.set();
            // 可促使图形进入编辑模式的元素
            this.editHandles = paper.set();

            // 开始绘制图形
            this.paint(paper, options);

            // 所有可选择元素添加点击事件
            this.selectHandles.click(function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                self.select();
            });

            // 所有的可拖拽元素添加拖拽事件
            this.dragHandles.forEach(function(e) {
                Dragable.enable(self, e);
            });

            // 所有的可编辑元素添加双击事件
            this.editHandles.dblclick(function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                self.edit();
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
            this.enterSelectedMode();
            this.trigger('select', this);
        },

        /**
         *  取消选择
         */
        stopSelect: function() {
            this.cancelSelectedMode();
            this.trigger('stopSelect', this);
        },

        /**
         *  编辑
         */
        edit: function() {
            this.enterEditMode();
            this.trigger('edit', this);
        }, 

        /**
         *  取消编辑
         */
        stopEdit: function() {
            this.cancelEditMode();
            this.trigger('stopEdit', this);
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

        },

        /**
         *  进入编辑模式, 由子类实现
         */
        enterEditMode: function() {

        },

        /**
         *  取消编辑模式, 由子类实现
         */
        cancelEditMode: function() {

        }
    });
});