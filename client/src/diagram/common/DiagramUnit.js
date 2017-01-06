/**
 *  图表图列单元基类
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');
    var Dragable = require('./Dragable.js');
    var DiagramModel = require('./DiagramModel.js');
    var Utils = require('../../common/Utils.js');

    /**
     *  图形单元基类, 图形单元是可被用户在编辑器中直接操作的图形基本单元,
     *  其与 Element 不同之处在于它加入了更多响应用户操作以及与编辑器框架交互
     *  的
     */
    var DiagramUnit = module.exports = Element.extend({

        Model: DiagramModel,

        /**
         *  初始化
         */
        initialize: function(paper, options) {
            var self = this;
            // 可促使图形可拖拽的元素
            this.dragHandles = paper.set();
            // 可促使图形被选择的元素
            this.selectHandles = paper.set();
            // 数据模型
            this.model = new this.Model();

            this.model.view = this;

            this.isSelected = false;

            // 开始绘制图形
            this.paint(paper, options);

            // 当模型中位置发生改变, 同步到界面上
            this.model.on('change:locate', function(m) {
                if (!m._lock) {
                    var l = m.get('locate');
                    self.move(l.x, l.y);
                }
            });
        },

        /**
         *  移动
         */
        move: function(x, y, options) {
            this.model._lock = true;
            this.model.set({ locate: { x: x, y: y } });
            delete this.model._lock;
            Element.prototype.move.call(this, x, y, options);
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
            this.isSelected = true;
            this.trigger('select', this);
        },

        /**
         *  取消选择
         */
        stopSelect: function() {
            this.cancelSelectedMode();
            this.isSelected = false;
            this.trigger('stopSelect', this);
        },

        /** 
         *  进入选中模式时图形应当发生的变化
         */
        enterSelectedMode: function() {
            this.enterFocusMode();
        },

        /**
         *  离开选中模式时图形应当发生的变化
         */
        cancelSelectedMode: function() {
            this.cancelFocusMode();
        },

        enterFocusMode: function() {
            this.selectHandles.forEach(function(el) {
                el._strokeColor = el.attr('stroke');
                el._strokeWidth = el.attr('stroke-width');
                el.attr({
                    'stroke': 'blue',
                    'stroke-width': 2
                });
            });
        },

        cancelFocusMode: function() {
            this.selectHandles.forEach(function(el) {
                if (el._strokeColor) {
                    el.attr({
                        'stroke': el._strokeColor,
                        'stroke-width': el._strokeWidth
                    });
                }
            });
        },

        /**
         *  启用拖拽功能
         */
        enableDrag: function() {
            var self = this;
            // 所有的可拖拽元素添加拖拽事件
            this.dragHandles.forEach(function(e) {
                Dragable.enable(self, e);
            });
        },

        /**
         *  禁用拖拽功能
         */
        disableDrag: function() {
            var self = this;
            this.dragHandles.forEach(function(e) {
                Dragable.disable(self, e);
            });
        },

        /**
         *  启用点击选择 
         */
        enableSelect: function() {

            var self = this;
            // 触发选择事件
            Utils.sclick(this.selectHandles, function(evt) {
                if (!self.isSelected) {
                    self.select();
                }
            });
        },

        /**
         *  禁用点击选择
         */
        disableSelect: function() {
            Utils.unsclick(this.selectHandles);
        },

        /**
         *  启用焦点显示
         */
        enableFocus: function() {
            if (!this._focus_over_handle) {
                var self = this;
                this._focus_over_handle = function() {
                    self.trigger('focus', self);
                };

                this._focus_out_handle = function() {
                    self.trigger('blur', self);
                };

                this.selectHandles.forEach(function(e) {
                    e.mouseover(self._focus_over_handle);
                    e.mouseout(self._focus_out_handle);
                });
            }
        },

        /**
         *  禁用焦点显示 
         */
        disableFocus: function() {
            if (this._focus_over_handle) {
                var self = this;
                this.selectHandles.forEach(function(e) {
                    e.unmouseover(this._focus_over_handle);
                    e.unmouseout(this._focus_out_handle);
                });
                delete this._focus_over_handle;
                delete this._focus_out_handle;
            }
        }
    });
});