define(function(require, exports, module) {
    var BaseArrow = require('../../common/BaseArrow.js');
    var _ = require('_');

    var ExtendArrow = module.exports = BaseArrow.extend({

        paint: function(paper, options) {
            options = _.extend({
                text: '<<extend>>'
            }, options);
            BaseArrow.prototype.paint.call(this, paper, options);
        }

        
    });
});