define(function(require, exports, module) {

    /**
     *  启用拖拽操作
     */
    exports.enable = function(element, dragContext) {
        if (dragContext._dragHandle) {
            return;
        }

        var x, y;

        // 移动侦听器
        var moveHandle = function(evt) {
            var dx = evt.clientX - x,
                dy = evt.clientY - y;
            x = evt.clientX;
            y = evt.clientY;

            element.move(element.x + dx, element.y + dy);
            element.trigger('dragMove', element, dx, dy, x, y, evt);
        };

        // 鼠标松开侦听器
        var dropHandle = function(evt) {
            $(document).unbind('mousemove', moveHandle);
            $(document).unbind('mouseup', dropHandle);
            element.trigger('dragEnd', element, evt.clientX, evt.clientY, evt);
        };

        // 鼠标按下的侦听器
        dragContext._dragHandle = function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            x = evt.clientX, y = evt.clientY;
            $(document).mousemove(moveHandle);
            $(document).mouseup(dropHandle);
            element.trigger('dragStart', element, x, y);
        };

        dragContext.mousedown(dragContext._dragHandle);
        dragContext.attr('cursor', 'move');
    };

    /**
     *  禁用拖拽操作
     */
    exports.disable = function(element, dragContext) {
        if (dragContext._dragHandle) {
            dragContext.off('mousedown', dragContext._dragHandle);
            dragContext.attr('cursor', 'default');
        }
    };
});