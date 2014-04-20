define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone'),
        ToolsBar = require('./ToolsBar.js'),
        DiagramDesk = require('./DiagramDesk.js');

    var DiagramEditor = module.exports = BB.View.extend({

        initialize: function(options) {
            this.$el = $('<div class="diagram-editor" />');
            this.toolsBar = new ToolsBar(options.toolsbar);
            this.desk = new DiagramDesk(options.desk);
        },

        render: function(context) {
            this.$el.appendTo(context);
            this.toolsBar.render(this.$el);
            this.desk.render(this.$el);
            return this;
        }
    });
});