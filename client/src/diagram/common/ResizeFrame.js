define(function(require, exports, module) {
    var Element = require('./Element.js');
    var Dragable = require('./Dragable.js');

    var ResizeFrame = module.exports = Element.extend({


        initialize: function(paper, options) {
            var x = this.x, y = this.y, w = this.width, h = this.height;

            this._frame = paper.rect(x, y, w, h);
            this._lt = this.createDragBlock(paper, x, y);
            this._rt = this.createDragBlock(paper, x + w, y);
            this._lb = this.createDragBlock(paper, x, y + h);
            this._rb = this.createDragBlock(paper, x + w, y + h);

            this.$el.push(this._frame, this._lt, this._rb, this._lb, this._rt);
            this.initDrag();
        },

        createDragBlock: function(paper, x, y) {
            return paper.rect(x - 5, y - 5, 10, 10).attr({
                fill: 'black'
            });
        },


        initDrag: function() {
            this._rt.drag(function() {
                
            });
        }
    });
});