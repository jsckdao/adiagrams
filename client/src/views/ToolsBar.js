define(['backbone', 'jquery'], function(require, exports, module) {

    var $ = require('jquery'),
        BB = require('backbone');

    /**
     * 工具栏
     */
    var ToolsBar = module.exports = BB.View.extend({
        
        initialize: function(options) {
            this.$el = $('<div class="de-toolsbar"/>');
        },

        render: function(context) {
            this.$el.appendTo(context);
            return this;
        }
    });
});