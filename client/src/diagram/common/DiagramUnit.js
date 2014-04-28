/**
 *  图表图列单元基类
 */
define(function(require, exports, module) {
    var Element = require('./Element.js');
    var Dragable = require('./Dragable.js');

    var DiagramUnit = module.exports = Element.extend({

        initialize: function(paper, options) {
            var self = this;
            this.dragHandle = paper.set();
            this.selectHandle = paper.set();

            this.paint(paper, options);

            this.selectHandle.on('click', function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                self.enterSelectedMode();
                self.trigger('enterSelectedMode', self);
            });

            this.selectHandle.forEach(function(e) {
                Dragable.enable(self, e);
            });
        },

        /**
         *  图形绘制
         */ 
        paint: function(paper, options) {

        },

        /**
         *  绘制缩略图
         */
        paintThumb: function(paper, whidth, height) {

        },

        /** 
         *  进入选中模式
         */
        enterSelectedMode: function() {

        },

        /**
         *  离开选中模式
         */
        cancelSelectMode: function() {

        }
    });
});