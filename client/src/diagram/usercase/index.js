define(function(require, exports, module) {
    var User = require('./views/User.js'),
        Case = require('./views/Case.js'),
        ExtendArrow = require('./views/ExtendArrow.js'),
        IncludeArrow = require('./views/IncludeArrow.js'),
        _ = require('_');

    module.exports = {

        diagrams: {

            // 用例
            'usercase': {
                name: '用例',
                type: 'diagram',
                thumb: [{
                    type: 'ellipse', 
                    cx: 50, cy: 25, 
                    rx: 40, ry: 22, 
                    fill: "#ffffff", 
                    stroke:"#000"
                }],
                create: function(paper, options) {
                    return new Case(paper, options);
                }
            },

            // 用户
            'user': {
                name: '用户',
                type: 'diagram',
                thumb: [
                    { type: 'circle', cx: 50, cy: 9, r: 8 }, 
                    { type: 'path', path: 'M30,25L70,25' },
                    { type: 'path', path: 'M50,17L50,35L30,50' },
                    { type: 'path', path: 'M50,35L70,50'}
                ],
                create: function(paper, options) {
                    return new User(paper, options);
                }
            },

            // extend 箭头
            'extendArrow': {
                name: '扩展',
                type: 'arrow',
                thumb: [{ 
                    type: 'path',
                    path: 'M25,12.5L75,47.5',
                    'arrow-end': 'block-wide-long'
                }],
                create: function(paper, options) {
                    return new ExtendArrow(paper, options);
                }

            },

            // include 箭头z
            'includeArrow': {
                name: '包含',
                type: 'arrow',
                thumb: [{ 
                    type: 'path',
                    path: 'M25,12.5L75,47.5',
                    'arrow-end': 'block-wide-long'
                }],
                create: function(paper, options) {
                    return new IncludeArrow(paper, options);
                }
            }
        }
    };
});