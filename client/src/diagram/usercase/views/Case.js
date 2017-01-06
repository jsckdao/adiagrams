define(function(require, exports, module) {
    var DiagramUnit = require('../../common/DiagramUnit.js');
    var Point = require('../../common/Point.js');
    var Dragable = require('../../common/Dragable.js');

    var Case = module.exports = DiagramUnit.extend({
        
        paint: function(paper, options) {
            this.width = options.width || 100;
            this.height = options.height || 50;

            this.ellipse = paper.ellipse(this.x, this.y, this.width / 2, this.height / 2).attr({
                'fill': 'white'
            });

            this.selectHandles.push(this.ellipse);
            this.dragHandles.push(this.ellipse);

            this.cancelSelectedMode();
        },

        move: function(x, y, options) {
            var dx = x - this.x, dy = y - this.y;
            this.ellipse.attr({ cx: x, cy: y});
            DiagramUnit.prototype.move.call(this, x, y, options);
        },

        remove: function() {
            this.ellipse.remove();
        }

    });
});