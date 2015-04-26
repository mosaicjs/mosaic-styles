var BezierEasing = require('bezier-easing');
var ValueGenerator = require('./ValueGenerator');

module.exports = RangeGenerator;

RangeGenerator.value = function(from, to, options) {
    if (arguments.length === 1) {
        options = arguments[0];
    }
    options = options || {};
    if (typeof options === 'string') {
        options = {
            method : options
        };
    }
    options.method = options.method || 'linear';
    if (typeof options.method === 'string') {
        options.method = BezierEasing.css[options.method];
    }
    options.trim = options.trim || [ true, false ];

    var generator = new ValueGenerator();
    generator.trim.apply(generator, options.trim);

    if (typeof options.domain === 'function') {
        generator.setDomainTransformation(options.domain);
    } else if (Array.isArray(options.domain)) {
        generator.domain.apply(generator, options.domain);
    }

    if (typeof options.method === 'function') {
        generator.setCoreTransformation.call(generator, options.method);
    }
    if (typeof from === 'object' && typeof from.mix === 'function') {
        generator.range(0, 1, function(val) {
            var result = from.mix(to, val);
            return result;
        });
    } else if (typeof from === 'function') {
        generator.range(0, 1, function(val) {
            return from(to, val);
        });
    } else if (typeof options.range === 'function') {
        generator.setRangeTransformation(options.range);
    } else {
        generator.range(from, to);
    }
    return generator.build();
}

function RangeGenerator(obj) {
    this.init(obj);
}
RangeGenerator.prototype.init = function(obj) {
    this._template = this._preprocess(obj);
}
RangeGenerator.prototype.f = RangeGenerator.value;
RangeGenerator.prototype._preprocess = function preprocess(obj) {
    var result = {};
    for ( var key in obj) {
        (function(key) {
            var val = obj[key];
            var r;
            if (Array.isArray(val)) {
                r = this.f.apply(this, val);
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
