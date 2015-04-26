var expect = require('expect.js');
var styles = require('..');
var BezierEasing = require('bezier-easing');

var LessSerializer = styles.LessSerializer;
var RangeGenerator = styles.RangeGenerator;
var Colors = styles.Colors;

describe('RangeGenerator', function() {
    it('should build range-dependent styles', function() {
        var range = new RangeGenerator({
            trim : [ true, false ],
            domain : [ 5, 25 ]
        }, {
            '[type="polygon"]' : {
                'line-color' : [ Colors.red, Colors.blue, 'linear' ],
                'line-width' : [ {
                    method : 'ease-in-out',
                    range : function(val, options) {
                        var minZoom = this._domain[0];
                        var maxZoom = this._domain[1];
                        var zoom = options.zoom;
                        if (zoom < minZoom)
                            return;
                        zoom = Math.max(zoom, minZoom);
                        var minWidth = 0;
                        var maxWidth = 100;
                        var progress = (Math.min(maxZoom, zoom) - minZoom) / //
                        (maxZoom - minZoom);

                        var result = minWidth + progress * //
                        (maxWidth - minWidth);
                        var pow = Math.max(0, zoom - maxZoom);
                        result *= Math.pow(2, pow);
                        return isNaN(result) ? undefined : result;
                    },
                } ],
                'line-opacity' : [ 0.1, 0.9, 'ease-in-out' ],
                'text' : '"Hello, world!"',
                'header' : {
                    'line-color' : [ Colors.yellow, Colors.green, 'linear' ],
                    'test' : function(progress, options) {
                        return {
                            zoom : options.zoom
                        };
                    }
                }
            }
        });
        var serializer = new LessSerializer();
        var from = 5;
        var to = 25;
        function test(val, control) {
            var res = range.generate(val, {
                zoom : val,
                from : from,
                to : to
            });
            expect(res).to.eql(control);
            return res;
        }
        test(from - 2, {
            '[type="polygon"]' : {
                'header' : {
                    'test' : {
                        'zoom' : 3
                    }
                },
                'text' : '"Hello, world!"'
            }
        });
        test(from, {
            "[type=\"polygon\"]" : {
                "line-color" : "#ff0000",
                "line-width" : 0,
                "line-opacity" : 0.1,
                "text" : "\"Hello, world!\"",
                "header" : {
                    "line-color" : "#ffff00",
                    "test" : {
                        "zoom" : from
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
                        "zoom" : (from + to) / 2
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
                        "zoom" : to
                    }
                }
            }
        });
        test(to + 1, {
            "[type=\"polygon\"]" : {
                "line-color" : "#0000ff",
                "line-width" : 100 * 2,
                "line-opacity" : 0.9,
                "text" : "\"Hello, world!\"",
                "header" : {
                    "line-color" : "#008000",
                    "test" : {
                        "zoom" : to + 1
                    }
                }
            }
        });
        test(to + 2, {
            "[type=\"polygon\"]" : {
                "line-color" : "#0000ff",
                "line-width" : 100 * 4,
                "line-opacity" : 0.9,
                "text" : "\"Hello, world!\"",
                "header" : {
                    "line-color" : "#008000",
                    "test" : {
                        "zoom" : to + 2
                    }
                }
            }
        });
    });
});
