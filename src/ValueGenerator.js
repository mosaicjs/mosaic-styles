// mosaic-styles
var BezierEasing = require('bezier-easing');

module.exports = ValueGenerator;

function ValueGenerator(obj) {
    obj = obj || {};
    this.from = obj.from || 0;
    this.to = obj.to || 1;
    this.fromVal = obj.fromVal || 0;
    this.toVal = obj.toVal || 1;
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
            var p = (val - from) / (to - from);
            p = Math.min(1, Math.max(0, p));
            p = easing(p);
            return fromVal + (toVal - fromVal) * p;
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
        this.from = from;
        this.to = to;
        return this;
    },
    range : function(from, to) {
        this.fromVal = from;
        this.toVal = to;
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
