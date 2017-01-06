/**
 *  键盘管理器, 一个页面中在同一时刻只会有一个键盘管理器的实例会被激活
 */
define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone');

    var MetaKey = {
        '91': 'command',    // mac 系统的 command 键代码
        '17': 'ctrl',       // ctrl 键代码
        '18': 'alt',        // alt
        '16': 'shift'       // shift
    };

    var single = null;

    /**
     *  侦听全局键盘事件
     */
    $(document).keydown(function(evt) {
        single && single.onKeydown(evt);
    });

    $(document).keyup(function(evt) {
        single && single.onKeyup(evt);
    });

    $(document).keypress(function(evt) {
        single && single.onKeypress(evt);
    });

    /**
     *  键盘管理器类
     */

    var Keyboard = module.exports = function(options) {
        this.editor = options.editor;
    };

    $.extend(Keyboard.prototype, BB.Events, {

        onKeydown: function(evt) {
            var s = MetaKey[evt.keyCode];
            if (s) {
                evt.preventDefault();
                this.trigger('+' + s);
            }
        },

        onKeyup: function(evt) {
            var s = MetaKey[evt.keyCode];
            s && this.trigger('-' + s);
        },

        onKeypress: function(evt) {
            
        },

        /**
         *  激活
         */
        active: function() {
            single = this;
        },

        /**
         *  反激活
         */
        unactive: function() {
            if (single == this) {
                single = null;
            }
        }
    });
});