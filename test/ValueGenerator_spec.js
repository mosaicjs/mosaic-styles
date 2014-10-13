var expect = require('expect.js');
var styles = require('..');
var ValueGenerator = styles.ValueGenerator;

describe('ValueGenerator', function() {

    it('should correctly trim minimal and maximal range values', function() {
        var v = new ValueGenerator()//
        .linear()//
        .domain(10, 30)//
        .range(100, 300)//
        .trim(true, true);//
        var generator;

        generator = v.trim(true, true).build();
        expect(generator(10)).to.eql(100);
        expect(generator(30)).to.eql(300);
        expect(generator(15)).to.eql(150);
        expect(generator(5)).to.eql(undefined);
        expect(generator(35)).to.eql(undefined);

        generator = v.trim(false, true).build();
        expect(generator(10)).to.eql(100);
        expect(generator(30)).to.eql(300);
        expect(generator(15)).to.eql(150);
        expect(generator(5)).to.eql(100);
        expect(generator(35)).to.eql(undefined);

        generator = v.trim(true, false).build();
        expect(generator(10)).to.eql(100);
        expect(generator(30)).to.eql(300);
        expect(generator(15)).to.eql(150);
        expect(generator(5)).to.eql(undefined);
        expect(generator(35)).to.eql(300);
    });

    it('should contain pre-defined types of easing', function() {
        var zoomMin = 7;
        var zoomMax = 14;
        var widthMin = 1;
        var widthMax = 32;
        var controls = {
            7 : 1,
            8 : 6,
            9 : 16,
            10 : 23,
            11 : 28,
            12 : 30,
            13 : 32,
            14 : 32
        };

        var generator = new ValueGenerator()//
        .ease()//
        .domain(zoomMin, zoomMax)//
        .range(widthMin, widthMax).build();
        for (var zoom = zoomMin; zoom <= zoomMax; zoom++) {
            var width = Math.round(generator(zoom));
            expect(width).to.be(controls[zoom]);
        }
    });
    it('should correctly generate linear transformation', function() {
        var generator = new ValueGenerator()//
        .linear()//
        .domain(10, 30)//
        .range(100, 300)//
        .build();
        expect(generator(15)).to.eql(150);
    });
    it('should bind methods to transformed values', function() {
        var generator = new ValueGenerator()//
        .linear()//
        .domain(10, 30)//
        .range(110, 310)//
        .bind(function(y, x, prefix, suffix) {
            return prefix + 'x:' + x + ', y:' + y + suffix;
        });
        expect(generator(15, '[', ']')).to.eql('[x:15, y:160]');
    });
    it('should manage decreasing values', function() {
        var generator = new ValueGenerator()//
        .linear()//
        .domain(10, 20)//
        .range(0.1, 0)//
        .build();
        for (var i = 10; i <= 20; i++) {
            var test = generator(i);
            test = Math.round(100 * test) / 100;
            expect(test).to.eql((20 - i) / 100);
        }
    });
});