// mosaic-styles
var BezierEasing = require('bezier-easing');

module.exports = ValueGenerator;

function ValueGenerator(obj) {
    obj = obj || {};
    this.domain(obj.from, obj.to);
    this.range(obj.fromVal, obj.toVal);
    this.easing = obj.easing || BezierEasing.css.linear;
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
        var from = this.from;
        var to = this.to;
        var fromVal = this.fromVal;
        var toVal = this.toVal;
        var easing = this.easing;
        return function(val) {
            if (to === from)
                return toVal;
            var p = (val - from) / (to - from);
            p = Math.max(0, Math.min(p, 1));
            p = easing(p);
            var result = fromVal + (toVal - fromVal) * p;
            return result;
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
    domain : function(from, to) {
        this.from = isNaN(from) ? 0 : from;
        this.to = isNaN(to) ? 1 : to;
        return this;
    },
    range : function(from, to) {
        this.fromVal = isNaN(from) ? 0 : from;
        this.toVal = isNaN(to) ? 1 : to;
        return this;
    },

    bezier : function(mX1, mY1, mX2, mY2) {
        this.easing = BezierEasing(mX1, mY1, mX2, mY2);
        return this;
    },

    ease : function() {
        this.easing = BezierEasing.css.ease;
        return this;
    },
    linear : function() {
        this.easing = BezierEasing.css.linear;
        return this;
    },
    easeIn : function() {
        this.easing = BezierEasing.css['ease-in'];
        return this;
    },
    easeOut : function() {
        this.easing = BezierEasing.css['ease-out'];
        return this;
    },
    easeInOut : function() {
        this.easing = BezierEasing.css['ease-in-out'];
        return this;
    },
};
