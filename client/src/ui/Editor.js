define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone'),
        ToolsBar = require('./ToolsBar.js'),
        Painter = require('./Painter.js'),
        Selector = require('./Selector.js'),
        Keyboard = require('./Keyboard.js'),
        InfoPanel = require('./InfoPanel.js'),
        Desk = require('./Desk.js');

    var Editor = module.exports = BB.View.extend({

        /**
         *  编辑器初始化
         */
        initialize: function(options) {
            if (!options.diagrams) {
                throw new Error('must set diagrams config!!!');
            }

            var self = this;
            this.$el = $('<div class="diagram-editor" />');

            // 右键屏蔽, 这样可以使用自定的右键菜单了
            this.$el.bind('contextmenu', function(evt) {
                evt.preventDefault();
            });

            // 图形绘制内容的配置
            this.diagramsConfig = options.diagrams;

            // 所有已绘制的图形单元集合
            this.diagramColl = new BB.Collection();
            // 所有的箭头的集合
            this.arrowColl = new BB.Collection();

            // 图形选择器
            this.selector = new Selector({ editor: this });

            this.infoPanel = new InfoPanel({ editor: this });

            // 侧边栏工具条
            this.toolsBar = new ToolsBar({ 
                editor: this, 
                diagramsConfig: this.diagramsConfig 
            });

            // 绘图桌面
            this.desk = new Desk({ editor: this });

            // 图形绘制器, 负责图形的初次绘制
            this.painter = new Painter({ editor: this });

            // 键盘控制器, 负责管理键盘快捷键设置
            this.keyboard = new Keyboard({ editor: this });

            // 初始化各个部件
            this.initComponents();

            // 初始化快捷键设置
            this.initKeyboad();
        },

        /**
         *  初始化各个部件
         */
        initComponents: function() {
            var self = this;

            // 侦听工具栏用户选择创建的图形事件, 为绘制器设置当前绘制图形
            this.toolsBar.on('selectDiagram', function(toolsBar, diagram) {
                self.painter.setSelectDiagram(diagram);
            });

            // 侦听工具栏用户取消选择创建的图形
            this.toolsBar.on('unselectDiagram', function(toolsBar, diagram) {
                self.painter.clearSelectDiagram();
            });

            // 当painter 单方面取消选择的图形时, 工具拦的显示同步
            this.painter.on('clearSelectDiagram', function() {
                self.toolsBar.clearSelect();
            });

            // 如果用户点击了右键, 取消选择的图形
            this.$el.bind('contextmenu', function(evt) {
                // 清空当前绘制的图形设置
                self.painter.clearSelectDiagram();
                // 清空被选择的图形单元
                self.selector.clear();
            });

            // 当一个新的图形绘制在画布上时, 对其做部分处理
            this.painter.on('paint', function(diagram, cfg) {
                if (cfg.type == 'diagram') { 
                    // 模型加入集合
                    self.diagramColl.add(diagram.model);
                    // 当图形被选择时, 其加入选择器
                    diagram.on('select', function() {
                        self.selector.add(diagram);
                    });
                    // 当图形取消选择的时候, 从选择器中移除
                    diagram.on('stopSelect', function() {
                        self.selector.remove(diagram);
                    });
                    // 当图形获得焦点时, 
                    diagram.on('focus', function() {
                        self.selector.setFocus(diagram);
                    });
                    // 当失去焦点的时候
                    diagram.on('blur', function() {
                        self.selector.clearFocus();
                    });
                }
            });


        },

        /**
         *  初始化快捷键设置
         */
        initKeyboad: function() {
            var key = this.keyboard, self = this;

            key.on('+command', function() {
                self.selector.isMultiple = true;
            });

            key.on('-command', function() {
                self.selector.isMultiple = false;
            });

            // 保存
            key.on('<ctrl>-s', function() {

            });
            // 复制
            key.on('<ctrl>-c', function() {

            });
            // 粘贴
            key.on('<ctrl>-v', function() {

            });
            // 撤销
            key.on('<ctrl>-z', function() {

            });
            // 取消撤销
            key.on('<ctrl>-y', function() {

            });
        },

        // 编辑器显示
        show: function() {
            this.$el.show();
            // 激活键盘事件侦听
            this.keyboard.active();
            this.trigger('show', this);
        },

        // 编辑器隐藏
        hide: function() {
            this.$el.hide();
            this.keyboard.unactive();
            this.trigger('hide', this);
        },

        /**
         *  渲染至页面上
         */
        render: function(context) {
            this.$el.appendTo(context);
            this.toolsBar.render(this.$el);
            this.infoPanel.render(this.$el);
            this.desk.render(this.$el);
            return this;
        }
    });
});