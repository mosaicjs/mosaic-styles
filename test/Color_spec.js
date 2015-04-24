var expect = require('expect.js');
var styles = require('..');

describe('Color', function() {
    function testColor(str, r, g, b, a, controlStr) {
        controlStr = controlStr || str;
        var color = new styles.Color(str);
        expect(color).to.eql({
            rgba : [ r, g, b, a ]
        });
        var control = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        expect(color.toRGBA()).to.eql(control);
        expect(color.toHex()).to.eql(controlStr);
    }
    it('should properly parse hexadecimal colors', function() {
        testColor('#eee', 238, 238, 238, 1, '#eeeeee');
        testColor('#eeeeee', 238, 238, 238, 1);
        testColor('#EeE', 238, 238, 238, 1, '#eeeeee');
        testColor('#EeEeeE', 238, 238, 238, 1, '#eeeeee');
        testColor(styles.Colors.red + '', 255, 0, 0, 1);
        testColor(styles.Colors.lime + '', 0, 255, 0, 1);
        testColor(styles.Colors.green + '', 0, 128, 0, 1);
        testColor(styles.Colors.blue + '', 0, 0, 255, 1);
        testColor(styles.Colors.yellow + '', 255, 255, 0, 1);
    });
    it('should parse and re-format all pre-defined colors', function() {
        for ( var key in styles.Colors) {
            var str = styles.Colors[key] + '';
            var color = new styles.Color(str);
            expect(color.toHex()).to.eql(str);
        }
    });
    it('should serialize / load data to / from HSLA format', function() {
        for ( var key in styles.Colors) {
            var str = styles.Colors[key] + '';
            var color = new styles.Color(str);
            var hsla = color.toHSL();
            var test = new styles.Color();
            test.fromHSL(hsla);
            expect(color.toHex()).to.eql(test.toHex());
        }
    });
    it('should be able to mix two colors in the specified proportion',
            function() {
                function testMix(first, second, weight, control) {
                    var a = new styles.Color(first);
                    var b = new styles.Color(second);
                    var test = a.mix(b, weight);
                    expect(test.rgba).to.eql(control.rgba);
                    expect(test.toHex()).to.eql(control.toHex());
                }
                testMix(styles.Colors.red, styles.Colors.lime, 0.5,
                        styles.Colors.olive);
                testMix(styles.Colors.red, styles.Colors.lime, 0,
                        styles.Colors.red);
                testMix(styles.Colors.red, styles.Colors.lime, 1,
                        styles.Colors.lime);
            });
    it('should be able to blend colors', function() {
        function testBlend(first, second, mode, control) {
            var test = styles.Color.blend[mode](first, second);
            expect(test.toHex()).to.eql(control);
        }

        testBlend('#22262B', '#1b9bd7', 'average', '#1f6181');
        testBlend('#22262B', '#4dffba', 'average', '#379373');
        testBlend('#22262B', '#ffcc00', 'average', '#917916');

        testBlend('#22262B', '#ffcc00', 'average', styles.Color.mix('#22262B',
                '#ffcc00').toHex());
        testBlend(styles.Colors.yellow, styles.Colors.blue, 'average',
                styles.Color.mix(styles.Colors.yellow, styles.Colors.blue)
                        .toHex());

        // see http://lesscss.org/functions/#color-blending
        testBlend('#ff6600', '#cccccc', 'multiply', '#cc5200');
        testBlend('#ff6600', '#00ff00', 'multiply', '#006600');
        testBlend('#ff6600', '#0000ff', 'multiply', '#000000');

        testBlend('#ff6600', '#333333', 'screen', '#ff8533');
        testBlend('#ff6600', '#cccccc', 'screen', '#ffe0cc');
        testBlend('#ff6600', '#0000ff', 'screen', '#ff66ff');

        testBlend('#ff6600', '#333333', 'overlay', '#ff2900');
        testBlend('#ff6600', '#cccccc', 'overlay', '#ffa300');
        testBlend('#ff6600', '#ffffff', 'overlay', '#ffcc00');

        testBlend('#ff6600', '#333333', 'softlight', '#ff4100');
        testBlend('#ff6600', '#cccccc', 'softlight', '#ff8a00');
        testBlend('#ff6600', '#00ff00', 'softlight', '#ffa100');
        testBlend('#ff6600', '#0000ff', 'softlight', '#ff2900');

        testBlend('#ff6600', '#333333', 'hardlight', '#662900');
        // testBlend('#ff6600', '#cccccc', 'hardlight', '#ff2900');

    });
});
