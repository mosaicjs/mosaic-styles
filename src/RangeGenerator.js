var BezierEasing = require('bezier-easing');
var ValueGenerator = require('./ValueGenerator');

module.exports = RangeGenerator;

function RangeGenerator(obj) {
    this._template = this._preprocess(obj);
}
RangeGenerator.prototype._preprocess = function preprocess(obj) {
    var result = {};
    for ( var key in obj) {
        (function(key) {
            var val = obj[key];
            var r;
            if (Array.isArray(val)) {
                var from = val[0];
                var to = val[1];
                var method = val[2] || 'linear';
                var generator = new ValueGenerator().trim(true, true);
                if (typeof method === 'string') {
                    method = BezierEasing.css[method];
                    if (method) {
                        generator.setCoreTransformation(method);
                    }
                }
                if (typeof from === 'object') {
                    generator.range(0, 1, function(val) {
                        return from.mix(to, val);
                    });
                } else if (typeof from === 'function') {
                    generator.range(0, 1, function(val) {
                        return from(to, val);
                    });
                } else {
                    generator.range(from, to);
                }
                r = generator.build();
            } else if (typeof val === 'object') {
                r = preprocess.call(this, val);
            } else {
                r = val;
            }
            if (r !== undefined) {
                result[key] = r;
            }
        }).call(this, key);
    }
    return result;
}

RangeGenerator.prototype.generate = function() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    function generate(obj) {
        var result = {};
        for ( var key in obj) {
            var value = obj[key];
            if (typeof value === 'object') {
                value = generate.call(this, value);
            } else if (typeof value === 'function') {
                var val = value.apply(this, args);
                if (typeof val === 'object'
                        && typeof val.toStyle === 'function') {
                    val = val.toStyle();
                }
                value = val;
            }
            if (value !== undefined) {
                result[key] = value;
            }
        }
        return result;
    }
    return generate.call(this, this._template);
}
