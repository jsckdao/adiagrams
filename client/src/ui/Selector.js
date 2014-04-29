/**
 *  选择器, 负责管理编辑器中, 图形单元的选择
 */
define(function(require, exports, module) {
    var BB = require('backbone');
    var _ = require('_');

    var Selector = module.exports = function(options) {
        this.initialize(options);
    };

    _.exend(Selector.prototype, BB.Events, {

        
        initialize: function(options) {

        }
    });
});