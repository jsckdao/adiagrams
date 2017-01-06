define(function(require, exports, module) {

    // 侦听静态点击事件, 静态点击就是鼠标按下后在不移动的情况下弹起所触发的事件
    exports.sclick = function(el, callback) {  
            var _x, _y;
            // 鼠标弹起时, 触发选择事件
            var _mouseup = function(evt) {
                callback.call(this, evt);
                $(document).unbind('mousemove', _mousemove);
                $(document).unbind('mouseup', _mouseup);
            };

            // 如果鼠标在摁下后后移动了, 弹起时将不会再触发选择事件了
            var _mousemove = function(evt) {
                if (Math.abs(evt.clientX - _x) > 8 || Math.abs(evt.clientY - _y) > 8) {
                    $(document).unbind('mousemove', _mousemove);
                    $(document).unbind('mouseup', _mouseup);
                }
            };

            el._sclick_handle = function(evt) {
                if (evt.button == 0) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    _x = evt.clientX, _y = evt.clientY;
                    $(document).mousemove(_mousemove);
                    $(document).mouseup(_mouseup);
                }
            };

            // 鼠标摁下后, 等待弹起时触发选择事件, 但也有另外的可能
            el.mousedown(el._sclick_handle);
    };

    // 
    exports.unsclick = function(el) {
        if (el._sclick_handle) {
            if (el.unmousedown) {
                el.unmousedown(el._sclick_handle);
            }
            else {
                el.unbind('mousedown', el._sclick_handle);
            }
        }
    }
});