define(function(require, exports, module) {

    var $ = require('jquery'),
        R = require('raphael'),
        Utils = require('../common/Utils.js'),
        BB = require('backbone');

    /**
     *  画布容器, 主要封装关于画布放大缩小拖拽等操作, 提供画布对象, 但不
     *  封装具体的绘制操作
     */
    var DiagramDesk = module.exports = BB.View.extend({

        /**
         *  初始化
         */
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
            this.diagramColl = options.editor.diagramColl;
        },

        /**
         *  切换模式, 目前支持  browse, select, paint 三种模式
         */
        changeMode: function(sign) {
            if (this.currentMode) {
                this.Modes[this.currentMode].stop.call(this);
            }
            var mode = this.Modes[sign];
            if (mode) {
                mode.start.call(this);
                this.currentMode = sign;
            }
        },
        

        // 设置画布可拖动
        enablePaperDrag: function() {
            if (this._dragHandle) {
                return;
            }
            var mx, my, self = this;
            var el = self.$el;

            // 开始拖动时的动作
            var dragHandle = this._dragHandle = function(evt) {
                // 记录坐标于鼠标坐标
                evt.preventDefault();
                mx = evt.clientX;
                my = evt.clientY;
                self.paperContext.bind('mousemove', moveHandle);
                self.paperContext.bind('mouseup', dropHandle);
            };

            // 拖动时的动作
            var moveHandle = this._dragMoveHandle = function(evt) {
                var dx = evt.clientX - mx,
                    dy = evt.clientY - my;
                my = evt.clientY;
                mx = evt.clientX;

                el.scrollLeft(el.scrollLeft() - dx);
                el.scrollTop(el.scrollTop() - dy);
            };

            // 拖动结束动作
            var dropHandle = this._dropHandle = function(evt) {
                self.paperContext.unbind('mouseup', dropHandle);
                self.paperContext.unbind('mousemove', moveHandle);
            };

            this.paperContext.bind('mousedown', dragHandle);
        },

        // 取消画布拖动
        disablePaperDrag: function() {
            if (this._dragHandle) {
                this.paperContext.unbind('mousedown', this._dragHandle);
                this.paperContext.unbind('mousemove', this._dragMoveHandle);
                this.paperContext.unbind('mouseup', this._dropHandle);
                delete this._dragHandle;
            }
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

        // 初始化一些鼠标事件, 并将其作为Desk的事件
        initEvents: function() {
            var self = this;
            ['click', 'mousedown', 'mousemove', 'mouseup'].forEach(function(evtname) {
                self.paperContext.bind(evtname, function(evt) {
                    if (evt.button == 0) {
                        evt.preventDefault();
                        self.trigger(evtname, self, evt.offsetX, evt.offsetY, evt);
                    }
                });
            });

            Utils.sclick(self.paperContext, function(evt) {
                evt.preventDefault();
                self.trigger('sclick', self, evt.offsetX, evt.offsetY, evt);
            });
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
            this.movePaperCenter();
            this.initEvents();

            // 默认情况下切换为浏览模式
            this.changeMode('browse');
            return this;
        },

        /**
         *  绘图桌面的模式切换
         */
        Modes: {
            /**
             *  选择模式, 在该模式下, 画布不可以拖拽移动, 但是用户可以选择和编辑
             *  图形, 还可以用鼠标拖拽框选图形
             */
            select: {
                start: function() {
                    
                },

                stop: function() {

                }
            },

            /**
             *  浏览模式, 在该模式下, 画布可以通过拖拽移动, 图元对象可以选择和拖拽
             *  以及编辑, 这是画布的默认模式
             */
            browse: {
                start: function() {
                    this.enablePaperDrag();
                    this._diagram_add_handle = function(model) {
                        model.view.enableDrag();
                        model.view.enableSelect();
                    };
                    this.diagramColl.forEach(this._diagram_add_handle);
                    this.diagramColl.on('add', this._diagram_add_handle);
                },

                stop: function() { 
                    this.disablePaperDrag();
                    this.diagramColl.forEach(function(model) {
                        model.view.disableDrag();
                        model.view.disableSelect();
                    });
                    this.diagramColl.off('add', this._diagram_add_handle);
                    delete this._diagram_add_handle;
                }
            },

            /**
             *  绘制模式, 在该模式下, 画布将不能拖拽移动, 图元对象也不可拖拽, 以方便
             *  用户用鼠标在画布上任意绘制图形
             */
            paint: {
                start: function() {
                    this._diagram_add_handle = function(model) {
                        model.view.enableFocus();
                    };

                    this.diagramColl.forEach(this._diagram_add_handle);
                    this.diagramColl.on('add', this._diagram_add_handle);
                },

                stop: function() {
                    this.diagramColl.forEach(function(model) {
                        model.view.disableFocus();
                    });
                    this.diagramColl.off('add', this._diagram_add_handle);
                    delete this._diagram_add_handle;
                }
            }
        }
    });
});