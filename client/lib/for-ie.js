/**
 *  为ie8以下浏览器准备的兼容js
 */

 (function() {

    var emptyFn = function() {};

    if (!window.console) {
        window.console = {
            log: emptyFn,
            info: emptyFn,
            debug: emptyFn,
            error: emptyFn
        };
    }

 
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(it) {
            var len = this.length;
            for (var i = 0; i < len; i++) {
                it(this[i]);
            }
        }
    }


})(0);