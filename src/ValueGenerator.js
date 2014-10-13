// mosaic-styles
var BezierEasing = require('bezier-easing');

module.exports = ValueGenerator;

function ValueGenerator(obj) {
    obj = obj || {};
    this.trim(obj._trimFrom, obj._trimTo);
    this.domain(obj._from, obj._to);
    this.range(obj._fromVal, obj._toVal);
    this.transform(obj._transform || BezierEasing.css.linear);
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
    clone : function() {
        return new ValueGenerator(this);
    },
    build : function() {
        var from = this._from;
        var to = this._to;
        var fromVal = this._fromVal;
        var toVal = this._toVal;
        var transform = this._transform;
        var trimFrom = this._trimFrom;
        var trimTo = this._trimTo;
        return function(val) {
            if (to === from)
                return toVal;
            var p = (val - from) / (to - from);
            if (p < 0 && trimFrom) {
                return undefined;
            }
            if (p > 1 && trimTo) {
                return undefined;
            }
            p = Math.max(0, Math.min(p, 1));
            p = transform(p);
            var result = fromVal + (toVal - fromVal) * p;
            return result;
        };
    },
    trim : function(trimFrom, trimTo) {
        this._trimFrom = !!trimFrom;
        this._trimTo = !!trimTo;
        return this;
    },
    transform : function(transform) {
        if (transform === undefined)
            return this._transform;
        this._transform = transform;
        return this;
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
    domain : function(from, to) {
        if (from === undefined && to === undefined)
            return [ this._from, this._to ];
        this._from = isNaN(from) ? 0 : from;
        this._to = isNaN(to) ? 1 : to;
        return this;
    },
    range : function(from, to) {
        if (from === undefined && to === undefined)
            return [ this._fromVal, this._toVal ];
        this._fromVal = isNaN(from) ? 0 : from;
        this._toVal = isNaN(to) ? 1 : to;
        return this;
    },

    bezier : function(mX1, mY1, mX2, mY2) {
        this.transform(BezierEasing(mX1, mY1, mX2, mY2));
        return this;
    },

    ease : function() {
        this.transform(BezierEasing.css.ease);
        return this;
    },
    linear : function() {
        this.transform(BezierEasing.css.linear);
        return this;
    },
    easeIn : function() {
        this.transform(BezierEasing.css['ease-in']);
        return this;
    },
    easeOut : function() {
        this.transform(BezierEasing.css['ease-out']);
        return this;
    },
    easeInOut : function() {
        this.transform(BezierEasing.css['ease-in-out']);
        return this;
    },
};
