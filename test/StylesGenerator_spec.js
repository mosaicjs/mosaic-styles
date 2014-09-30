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

        for (var i = from; i <= to; i++) {
            var test = generator(i);
            test.opacity = Math.round(100 * test.opacity) / 100;
            console.log(' * ' + i + ' )', test);
            // expect(test).to.eql({
            // width : Math.round(10 + (10 * i)),
            // height : Math.round(20 + (20 * i)),
            // opacity : Math.round(100 * 0.1 * i) / 100
            // });
        }
    });
});