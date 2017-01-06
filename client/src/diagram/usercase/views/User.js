/**
 *  图形单元: 用户
 */
define(function(require, exports, module) {
    var Element = require('../../common/Element.js');

    var User = module.exports = Element.extend({

        
        initialize: function(paper, options) {
            // 头
            this.head = paper.circle(this.x, this.y - 40, 25);
            this.width = 80;
            this.height = 100;
            this.body = [
                paper.path('M' + )
            ];
        },




        remove: function() {
            this.head.remove();
        }
    });
});