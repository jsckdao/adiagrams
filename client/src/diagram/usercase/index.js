define(function(require, exports, module) {
    module.exports = {

        diagrams: {

            // 用例
            'usercase': {
                name: '用例',
                type: 'diagram',
                thumb: '<ellipse cx="50" cy="25" rx="50" ry="25" fill="#ffffff" stroke="#000"></ellipse>',
                create: function(page, x, y, options) {

                }
            },

            // 用户
            'user': {
                name: '用户',
                type: 'diagram',
                thumb: '',
                create: function(page, x, y, options) {

                }
            },

            // extend 箭头
            'extendArrow': {
                name: '扩展',
                type: 'arrow',
                thumb: '',
                create: function(page, start, end, options) {

                }

            },

            // include 箭头z
            'includeArrow': {
                name: '包含',
                type: 'arrow',
                thumb: '',
                factory: function(page, start, end, options) {

                }
            }
        }
    };
});