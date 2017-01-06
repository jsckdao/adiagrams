/**
 *  选择器, 负责管理编辑器中, 图形单元的选择
 */
define(function(require, exports, module) {
    var BB = require('backbone');
    var _ = require('_');

    var Selector = module.exports = function(options) {
        // 对象集合
        this.selection = new BB.Collection();
        // 是否可以多选
        this.isMultiple = false;

    };

    _.extend(Selector.prototype, BB.Events, {

        add: function(diagram) {
            if (!diagram.isSelected) {
                diagram.select();
            }
            if (!this.isMultiple) {
                this.clear();
            }
            this.selection.add(diagram.model);
            // 设置联合拖拽
            this.setGroupMove(diagram);
        },

        remove: function(diagram) {
            if (diagram.isSelected) {
                diagram.stopSelect();
            }
            this.selection.remove(diagram.model);
            this.clearGroupMove(diagram);
        },

        clear: function() {
            var self = this;
            for (var i = this.selection.length; i--;) {
                var model = this.selection.at(i);
                self.remove(model.view);
            };
        },

        // 设置当前焦点对象
        setFocus: function(diagram) {
            this._current_focus = diagram;
        },
        // 获取当前焦点对象
        getFocus: function() {
            return this._current_focus;
        },

        clearFocus: function() {
            delete this._current_focus;
        },

        // 设置联合拖拽, 拖动任一个被选择的图形都会使
        setGroupMove: function(diagram) {
            if (diagram._group_drag_handle) {
                return;
            }
            var self = this;
            var h = diagram._group_drag_handle = function(element, dx, dy) {
                self.selection.each(function(m) {
                    var v = m.view;
                    if (v != diagram) {
                        v.move(v.x + dx, v.y + dy);
                    }
                });
            };
            diagram.on('dragMove', h);
        },

        clearGroupMove: function(diagram) {
            if (diagram._group_drag_handle) {
                diagram.off('dragMove', diagram._group_drag_handle);
                delete diagram._group_drag_handle;
            }
        }
    });
});