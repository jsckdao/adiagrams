define(function(require, exports, module) {

    /**
     *  启用拖拽操作
     */
    exports.enable = function(dragContext, element) {
        if (dragContext._dragHandle) {
            return;
        }

        var el = element ? element.$el : [dragContext];
        var x, y;

        // 移动侦听器
        var moveHandle = function(evt) {
            var dx = evt.clientX - x,
                dy = evt.clientY - y;
            x = evt.clientX;
            y = evt.clientY;

            el.forEach(function(e) {
                var cx = e.attr('cx') || e.attr('x') || 0,
                    cy = e.attr('cy') || e.attr('y') || 0;

                e.attr({
                    cx: cx + dx,
                    cy: cy + dy,
                    x: cx + dx,
                    y: cy + dy
                });
            });
            element && element.trigger('dragMove', dx, dy, x, y, evt);
        };

        // 鼠标松开侦听器
        var dropHandle = function(evt) {
            $(document).unbind('mousemove', moveHandle);
            $(document).unbind('mouseup', dropHandle);
            element && element.trigger('dragEnd', evt.clientX, evt.clientY, evt);
        };

        // 鼠标按下的侦听器
        dragContext._dragHandle = function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            x = evt.clientX, y = evt.clientY;
            $(document).mousemove(moveHandle);
            $(document).mouseup(dropHandle);
            element && element.trigger('dragStart', x, y);
        };

        dragContext.mousedown(dragContext._dragHandle);
    };

    /**
     *  禁用拖拽操作
     */
    exports.disable = function(dragContext) {
        if (dragContext._dragHandle) {
            dragContext.off('mousedown', dragContext._dragHandle);
        }
    };
});