// mosaic-styles
var BezierEasing = require('bezier-easing');
module.exports = ValueGenerator;

function ValueGenerator(obj) {
    obj = obj || {};
    this.reset(obj);
    this._domain = obj._domain || this._domain;
    this._range = obj._range || this._range;
    this._core = obj._core || this._core
            || toTransformation(BezierEasing.linear);
    return this;
}

ValueGenerator.copy = function(to, from) {
    from = from || this;
    to = to || {};
    for ( var key in from) {
        if (key === 'prototype') {
            continue;
        }
        var val = from[key];
        to[key] = val;
    }
}

ValueGenerator.prototype = {
    reset : function(obj) {
        obj = obj || {};
        this.trim(obj._trimFrom, obj._trimTo);
        this.domain(obj._from, obj._to, obj._domainTransform);
        this.range(obj._fromVal, obj._toVal, obj._rangeTransform);
        this.setCoreTransformation(toTransformation(BezierEasing.linear));
        return this;
    },
    clone : function() {
        return new ValueGenerator(this);
    },
    build : function() {
        var that = this;
        return function(val, args) {
            // Domain transformation // domain value => [0..1] value
            var before = val;
            val = that._domain(val, args);
            // Core transformation [0..1] => [0..1]
            if (val !== undefined) {
                val = Math.max(0, Math.min(val, 1));
                val = that._core(val, args);
            }
            // Range transformation // [0..1] value => range value
            val = that._range(val, args);
            return val;
        };
    },

    bind : function(f, context) {
        var m = this.build();
        return function(val) {
            var r = m(val);
            var args = [ r ];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return f.apply(context, args);
        };
    },

    // ----------------------------------------------------------------------
    // Domain transformations

    setDomainTransformation : function(f) {
        return this._setTransformation('_domain', f);
    },

    trim : function(trimFrom, trimTo) {
        this._trimFrom = !!trimFrom;
        this._trimTo = !!trimTo;
        return this;
    },

    domain : function(from, to, transform) {
        this._from = isNaN(from) ? 0 : from;
        this._to = isNaN(to) ? 1 : to;
        this._domainTransform = transform;
        return this.setDomainTransformation(function(val, args) {
            if (this._domainTransform) {
                val = this._domainTransform(val);
            }
            if (this._to === this._from)
                return 1;
            var p = (val - this._from) / (this._to - this._from);
            if (p < 0 && this._trimFrom) {
                return undefined;
            }
            if (p > 1 && this._trimTo) {
                return undefined;
            }
            return p;
        });
    },

    // ----------------------------------------------------------------------
    // Range transformations

    setRangeTransformation : function(f) {
        return this._setTransformation('_range', f);
    },

    range : function(from, to, transform) {
        this._fromVal = isNaN(from) ? 0 : from;
        this._toVal = isNaN(to) ? 1 : to;
        this._rangeTransform = transform;
        return this.setRangeTransformation(function(val, args) {
            if (val === undefined)
                return;
            var result = this._fromVal + (this._toVal - this._fromVal) * val;
            if (this._rangeTransform) {
                result = this._rangeTransform(result, val);
            }
            return result;
        });
    },

    // ----------------------------------------------------------------------
    // Core transformations

    setCoreTransformation : function(f) {
        return this._setTransformation('_core', f);
    },

    wrap : function(f) {
        return this._wrapTransformation('_core', f);
    },

    bezier : function(mX1, mY1, mX2, mY2) {
        this.setCoreTransformation(toTransformation(//
        BezierEasing(mX1, mY1, mX2, mY2)));
        return this;
    },

    ease : function() {
        this.setCoreTransformation(toTransformation(BezierEasing.ease));
        return this;
    },
    linear : function() {
        this.setCoreTransformation(toTransformation(BezierEasing.linear));
        return this;
    },
    easeIn : function() {
        this.setCoreTransformation(toTransformation(BezierEasing.easeIn));
        return this;
    },
    easeOut : function() {
        this.setCoreTransformation(toTransformation(BezierEasing.easeOut));
        return this;
    },
    easeInOut : function() {
        this.setCoreTransformation(toTransformation(BezierEasing.easeInOut));
        return this;
    },

    // ----------------------------------------------------------------------
    // 
    _setTransformation : function(key, f) {
        this[key] = f;
        return this;
    },

    _wrapTransformation : function(key, f) {
        var transform = this[key];
        if (transform) {
            return this._setTransformation(key, function(val) {
                val = transform.call(this, val);
                return f.call(this, val);
            });
        } else {
            return this._setTransformation(f);
        }
    }

};

function toTransformation(bezier){
    return bezier.get.bind(bezier);
}