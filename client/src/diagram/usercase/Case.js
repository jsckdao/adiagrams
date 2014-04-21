define(function(require, exports, module) {
    var Element = require('../common/Element.js');

    var Case = module.exports = Element.extend({
        
        initialize: function(page, options) {

            this._ellipse = page.ellipse(this.x, this.y, 40, 20).attr({
                'fill': 'white'
            });

            this.enableDrag(this._ellipse);

            this.$el.push(this._ellipse);
        }


    });
});