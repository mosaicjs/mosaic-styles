var expect = require('expect.js');
var styles = require('..');
var StylesGenerator = styles.StylesGenerator;

describe('StylesGenerator', function() {
    it('wihtout initialization should return empty style objects', function() {
        var generator = new StylesGenerator().build();
        for (var i = 0; i < 100; i++) {
            expect(generator(i)).to.eql({});
        }
    });
    it('should allow to generate multiple attributes', function() {
        var from = 0;
        var to = 10;
        var generator = new StylesGenerator().domain(from, to) //
        .attr('width').linear().range(10, 110) //
        .attr('height').linear().range(20, 220) //
        .attr('opacity').linear().range(0, 1) // 
        .build();
        for (var i = from; i <= to; i++) {
            var test = generator(i);
            test.opacity = Math.round(100 * test.opacity) / 100;
            expect(test).to.eql({
                width : Math.round(10 + (10 * i)),
                height : Math.round(20 + (20 * i)),
                opacity : Math.round(100 * 0.1 * i) / 100
            });
        }
    });

    it('should allow to use bezier curves to define styles', function() {
        var from = 8;
        var to = 15;

        var generator = new StylesGenerator().domain(from, to) //
        .attr('width').ease().range(10, 110) //
        .attr('height').ease().range(20, 220) //
        .attr('opacity').bezier(0.820, 0.245, 0.220, 1).range(0, 1) // 
        .build();

        var controls = [ {
            width : 10,
            height : 20,
            opacity : 0
        }, {
            width : 27.10,
            height : 54.20,
            opacity : 0.05
        }, {
            width : 58.46,
            height : 116.93,
            opacity : 0.14
        }, {
            width : 82.13,
            height : 164.26,
            opacity : 0.32
        }, {
            width : 96.47,
            height : 192.94,
            opacity : 0.78
        }, {
            width : 104.69,
            height : 209.38,
            opacity : 0.94
        }, {
            width : 108.81,
            height : 217.61,
            opacity : 0.99
        }, {
            width : 110,
            height : 220,
            opacity : 1
        } ];

        for (var i = from; i <= to; i++) {
            var test = generator(i);
            for ( var key in test) {
                test[key] = Math.round(100 * test[key]) / 100;
            }
            expect(test).to.eql(controls[i - from]);
        }
    });

    it('should allow to bind a transformation function ' + //
    'to define styles', function() {
        var from = 8;
        var to = 15;

        var generator = new StylesGenerator().domain(from, to).linear() //
        .attr('width').range(10, 110) //
        .attr('height').range(20, 220) //
        .attr('opacity').range(0, 1) // 
        .bind(function(style, zoom, suffix) {
            for ( var key in style) {
                if (key !== 'opacity') {
                    style[key] = Math.round(style[key]) + suffix;
                } else {
                    style[key] = Math.round(100 * style[key]) / 100;
                }
            }
            return style;
        });
        var controls = [ {
            width : '10px',
            height : '20px',
            opacity : 0
        }, {
            width : '24px',
            height : '49px',
            opacity : 0.14
        }, {
            width : '39px',
            height : '77px',
            opacity : 0.29
        }, {
            width : '53px',
            height : '106px',
            opacity : 0.43
        }, {
            width : '67px',
            height : '134px',
            opacity : 0.57
        }, {
            width : '81px',
            height : '163px',
            opacity : 0.71
        }, {
            width : '96px',
            height : '191px',
            opacity : 0.86
        }, {
            width : '110px',
            height : '220px',
            opacity : 1
        } ];
        for (var i = from; i <= to; i++) {
            var test = generator(i, 'px');
            expect(test).to.eql(controls[i - from]);
        }
    });

    it('should be able to manage styles depending on two ' + //
    'or more variables', function() {
        function round(styles) {
            var result = {};
            for ( var key in styles) {
                var val = styles[key];
                result[key] = Math.round(val);
            }
            return result;
        }
        var minZoom = 0;
        var maxZoom = 10;
        // Generator depending on zoom and time; zoom is the direct parameter
        // Time could be changed using the setTime method on the generator.
        var generator = (function() {
            var time = 0;
            var generator = new StylesGenerator().domain(minZoom, maxZoom)//
            .linear().wrap(function(val) {
                return val * time;
            })//
            .attr('height').range(20, 220) //
            .attr('width').trim(false, true).range(10, 110)//
            .bind(function(style) {
                return round(style);
            });//
            generator.setTime = function(t) {
                time = t;
            };
            return generator;
        })();

        // Use time as a second dynamic variable (second dimension)
        for (var i = 0; i < 10; i++) {
            var t = i / 10;
            generator.setTime(t);

            // Zoom 0
            expect(generator(0)).to.eql(round({
                height : 20 + 200 * t * 0,
                width : 10 + 100 * t * 0
            }));
            // Zoom 3
            expect(generator(3)).to.eql(round({
                height : 20 + 200 * t * 0.3,
                width : 10 + 100 * t * 0.3
            }));
            // Zoom 5
            expect(generator(5)).to.eql(round({
                height : 20 + 200 * t * 0.5,
                width : 10 + 100 * t * 0.5
            }));
            // Zoom 8
            expect(generator(8)).to.eql(round({
                height : 20 + 200 * t * 0.8,
                width : 10 + 100 * t * 0.8
            }));
            // Zoom 10
            expect(generator(10)).to.eql(round({
                height : 20 + 200 * t,
                width : 10 + 100 * t
            }));
        }
    });

    it('should correctly trim minimal and maximal range values', function() {
        var from = 5;
        var to = 10;
        var generator = new StylesGenerator().domain(from, to).linear() //
        .attr('opacity').trim(true, false).range(0.1, 1) // 
        .attr('height').range(20, 220) //
        .attr('width').trim(false, true).range(10, 110) //
        .bind(function(style, zoom) {
            if (style.opacity !== undefined) {
                style.opacity = parseFloat(style.opacity.toFixed(2));
            }
            return style;
        });

        // Opacity is undefined before the valid zoom range
        expect(generator(4)).to.eql({
            width : 10,
            height : 20,
            opacity : undefined
        });
        expect(generator(5)).to.eql({
            width : 10,
            height : 20,
            opacity : 0.1
        });
        expect(generator(7)).to.eql({
            width : 50,
            height : 100,
            opacity : 0.46
        });
        expect(generator(10)).to.eql({
            width : 110,
            height : 220,
            opacity : 1
        });
        // Width is undefined after the valid zoom range
        expect(generator(15)).to.eql({
            width : undefined,
            height : 220,
            opacity : 1
        });
    });

});