var expect = require('expect.js');
var styles = require('..');
var BezierEasing = require('bezier-easing');

var LessSerializer = styles.LessSerializer;
var RangeGenerator = styles.RangeGenerator;
var Colors = styles.Colors;

function Value(val) {
    this.val = val;
}
Value.prototype.mix = function(obj, weight) {
    var val = obj ? obj.val : 0;
    this.val += val * weight;
}

describe('RangeGenerator', function() {
    it('should build range-dependent styles', function() {
        var range = new RangeGenerator({
            '[type="polygon"]' : {
                'line-color' : [ Colors.red, Colors.blue, 'linear' ],
                'line-width' : [ 0, 100, 'ease-in-out' ],
                'line-opacity' : [ 0.1, 0.9 ],
                'text' : '"Hello, world!"',
                'header' : {
                    'line-color' : [ Colors.yellow, Colors.green, 'linear' ],
                    'test' : function(progress, zoom) {
                        return {
                            zoom : zoom
                        };
                    }
                }
            }
        });
        var serializer = new LessSerializer();
        var from = 1;
        var to = 19;
        function test(val, control) {
            var progress = (val - from) / (to - from);
            var res = range.generate(progress, val);
            expect(res).to.eql(control);
            return res;
        }
        test(from, {
            "[type=\"polygon\"]" : {
                "line-color" : "#ff0000",
                "line-width" : 0,
                "line-opacity" : 0.1,
                "text" : "\"Hello, world!\"",
                "header" : {
                    "line-color" : "#ffff00",
                    "test" : {
                        "zoom" : 1
                    }
                }
            }
        });
        test((from + to) / 2, {
            "[type=\"polygon\"]" : {
                "line-color" : "#800080",
                "line-width" : 50,
                "line-opacity" : 0.5,
                "text" : "\"Hello, world!\"",
                "header" : {
                    "line-color" : "#80c000",
                    "test" : {
                        "zoom" : 10
                    }
                }
            }
        });
        test(to, {
            "[type=\"polygon\"]" : {
                "line-color" : "#0000ff",
                "line-width" : 100,
                "line-opacity" : 0.9,
                "text" : "\"Hello, world!\"",
                "header" : {
                    "line-color" : "#008000",
                    "test" : {
                        "zoom" : 19
                    }
                }
            }
        });
    });
});
