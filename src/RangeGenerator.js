var BezierEasing = require('bezier-easing');
var ValueGenerator = require('./ValueGenerator');

module.exports = RangeGenerator;

function RangeGenerator(options, obj) {
    var len = arguments.length;
    var i = len - 1;
    obj = i >= 0 ? arguments[i--] : {};
    options = i >= 0 ? arguments[i--] : {};
    if (!options.trim) {
        options.trim = [ true, false ];
    }
    this._trim = options.trim;
    this._domain = options.domain || [ 0, 1 ];
    this.setStyles(obj);
}
RangeGenerator.prototype.getDomain = function() {
    return this._domain;
}
RangeGenerator.prototype.setStyles = function(obj) {
    this._template = this._preprocess(obj);
}
RangeGenerator.prototype._preprocess = function preprocess(obj) {
    var result = {};
    for ( var key in obj) {
        (function(key) {
            var val = obj[key];
            var r;
            var generator = new ValueGenerator();
            generator.trim.apply(generator, this._trim);
            generator.domain.apply(generator, this._domain);

            if (Array.isArray(val)) {
                var from = val[0];
                var to = val[1];
                var method;

                if (typeof from === 'object') {
                    var options = from;
                    if (typeof options.mix === 'function') {
                        generator.range(0, 1, function(val) {
                            return options.mix(to, val);
                        });
                    } else if (typeof options.range === 'function') {
                        var f = options.range.bind(this);
                        generator.setRangeTransformation(f);
                    } else {
                        generator.range(options.from, options.to);
                    }
                    if (!!options.trim) {
                        generator.trim.apply(generator, options.trim);
                    }
                    method = options.method;
                } else {
                    generator.range(from, to);
                    method = val[2];
                }
                method = method || 'linear';
                if (typeof method === 'string') {
                    method = BezierEasing.css[method];
                }
                if (typeof method === 'function') {
                    generator.setCoreTransformation(method);
                }
                r = generator.build();
            } else if (typeof val === 'object') {
                r = preprocess.call(this, val);
            } else {
                generator.range(val, val);
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
