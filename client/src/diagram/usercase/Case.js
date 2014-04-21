define(function(require, exports, module) {
    var Element = require('../common/Element.js');
    var Dragable = require('../common/Dragable.js');
    var ResizeFrame = require('../common/ResizeFrame.js');

    var Case = module.exports = Element.extend({
        
        initialize: function(paper, options) {

            this._ellipse = paper.ellipse(this.x, this.y, this.width / 2, this.height / 2).attr({
                'fill': 'white'
            });

            Dragable.enable(this, this._ellipse);

            this.$el.push(this._ellipse);

            this.include(new ResizeFrame(paper, {
                x: this.x - this.width / 2, 
                y: this.y - this.height / 2, 
                width: this.width, 
                height: this.height
            }));
        }


    });
});