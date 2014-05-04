define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone'),
        ToolsBar = require('./ToolsBar.js'),
        DiagramDesk = require('./DiagramDesk.js');

    var DiagramEditor = module.exports = BB.View.extend({

        initialize: function(options) {
            this.$el = $('<div class="diagram-editor" />');

            // 所有已绘制的图形单元集合
            this.diagramColl = new BB.Model();
            // 被用户选择的图形单元集合
            this.selectedColl = new BB.Model();

            // 工具条
            this.toolsBar = new ToolsBar(options.toolsbar);

            // 绘图桌面
            this.desk = new DiagramDesk(options.desk);

            this.diagramFactory = options.factory;

            

            
        },

        render: function(context) {
            this.$el.appendTo(context);
            this.toolsBar.render(this.$el);
            this.desk.render(this.$el);
            return this;
        }
    });
});