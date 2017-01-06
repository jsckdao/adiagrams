define(function(require, exports, module) {
    var BaseArrow = require('../../common/BaseArrow.js');
    var _ = require('_');

    var IncludeArrow = module.exports = BaseArrow.extend({

        paint: function(paper, options) {
            options = _.extend({
                text: '<<include>>'
            }, options);
            BaseArrow.prototype.paint.call(this, paper, options);
        }

        
    });
});