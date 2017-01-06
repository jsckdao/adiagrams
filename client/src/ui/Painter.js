define(function(require, exports, module) {
    var BB = require('backbone');
    var _ = require('_');

    /**
     *  封装了将选定的图形单元绘制在画布上的具体的用户操作
     */
    var DiagramPainter = module.exports = function(options) {
        // 画布桌面
        this.desk = options.editor.desk;
        // 图形选择器
        this.selector = options.editor.selector;
        // 已选择的绘制图元对象
        this.selectDiagram = null;
    };

    _.extend(DiagramPainter.prototype, BB.Events, {

        /**
         *  设置当前所选择的需要绘制的图形对象类型
         */
        setSelectDiagram: function(diagram) {
            if (this.selectDiagram) {   
                if (this.selectDiagram == diagram) {
                    return;
                }
                else {
                    this.clearSelectDiagram();
                }
            }
            var self = this;
            var operate = this.CreateOperate[diagram.type];

            if (operate) {
                operate.start.call(this, diagram, function(diagram, cfg) {
                    self.trigger('paint', diagram, cfg);
                });
                this.selectDiagram = diagram;
                this.trigger('setSelectDiagram', this, diagram);
            }
        },

        /**
         *  清除当前所选择的需要绘制的图形对象类型
         */
        clearSelectDiagram: function() {
            if (this.selectDiagram) {
                var operate = this.CreateOperate[this.selectDiagram.type];
                var s = this.selectDiagram;
                operate.stop.call(this, this.selectDiagram);
                delete this.selectDiagram;
                this.trigger('clearSelectDiagram', this, s);   
            }
        },

        /**
         *  针对不同的图形绘制, 需要用户采用不同的操作方法
         */
        CreateOperate: {

            // 普通图元
            diagram: {

                start: function(cfg, callback) {
                    var self = this;
                    if (self._click) {
                        return;
                    }
                    // 用户点击画布便可直接绘制
                    self._click = function(desk, x, y) {
                        var d = cfg.create(self.desk.paper, {
                            x: x, y: y
                        });
                        callback && callback.call(self, d, cfg);
                    };
                    self.desk.on('sclick', self._click);
                },

                stop: function(cfg) {
                    if (this._click) {
                        this.desk.off('sclick', this._click);
                        delete this._click;
                    }
                }
            },

            // 绘制箭头
            arrow: {
                start: function(arrow, callback) {
                    var self = this;
                    var dx, dy, d, sd;

                    self.desk.changeMode('paint');

                    var _up = function(evt) {
                        // 获取当前焦点图形
                        var focusDiagram = self.selector.getFocus();
                        if (focusDiagram) {
                            d.setStartPoint(sd);
                            d.setEndPoint(focusDiagram);
                            callback && callback.call(self, d, arrow);
                        }
                        // 如果不存在焦点图形, 那么这是一次无效的箭头绘制
                        else {
                            d.remove();
                        }
                        
                        $(document).unbind('mousemove', _move);
                        $(document).unbind('mouseup', _up);
                    };

                    // 拖拽划线
                    var _move = function(evt) {
                        d.moveEndPoint(evt.clientX - dx, evt.clientY - dy);
                    };

                    // 开始拖拽划线的事件
                    self._drag = function(desk, x, y, evt) {
                        // 获取当前焦点图形
                        var focusDiagram = sd = self.selector.getFocus();
                        // 焦点图形对象不存在, 直接忽略
                        if (!focusDiagram) {
                            return;
                        }

                        dx = evt.clientX - x;
                        dy = evt.clientY - y;
                        d = arrow.create(self.desk.paper, {
                            start: {x: x, y: y, width: 10, height: 10, shape: 'ellipse'},
                            end: {x: x, y: y, width: 20, height: 20, shape: 'ellipse'}
                        });
                        $(document).mousemove(_move);
                        $(document).mouseup(_up);
                    };

                    self.desk.on('mousedown', self._drag);
                },

                stop: function(arrow) {
                    if (this._drag) {
                        this.desk.changeMode('browse');
                        this.desk.off('mousedown', this._drag);
                        delete this._drag;
                    }
                }
            }
        }
    });


});