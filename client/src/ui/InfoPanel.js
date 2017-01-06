define(function(require, exports, module) {
    var BB = require('backbone');
    var _ = require('_');

    /**
     *  用户操作历史管理器
     */
    var InfoPanel = module.exports = BB.View.extend({

        // 初始化
        initialize: function(options) {
            this.$el = $('<div class="de-info-panel" />');
        },


        render: function(context) {
            this.$el.appendTo(context);
            return this;
        }


    });
});