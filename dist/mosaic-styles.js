/*!
 * mosaic-styles v0.0.12 | License: MIT 
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["mosaic-styles"] = factory();
	else
		root["mosaic-styles"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	    ValueGenerator : __webpack_require__(1),
	    StylesGenerator : __webpack_require__(2),
	    Color : __webpack_require__(3),
	    Colors : __webpack_require__(4),
	    LessSerializer : __webpack_require__(5),
	    MapStyleMixin : __webpack_require__(6),
	    RangeGenerator : __webpack_require__(7),
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// mosaic-styles
	var BezierEasing = __webpack_require__(8);
	
	module.exports = ValueGenerator;
	
	function ValueGenerator(obj) {
	    obj = obj || {};
	    this.reset(obj);
	    this._domain = obj._domain || this._domain;
	    this._range = obj._range || this._range;
	    this._core = obj._core || this._core || BezierEasing.css.linear;
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
	        this.setCoreTransformation(BezierEasing.css.linear);
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
	        this.setCoreTransformation(BezierEasing(mX1, mY1, mX2, mY2));
	        return this;
	    },
	
	    ease : function() {
	        this.setCoreTransformation(BezierEasing.css.ease);
	        return this;
	    },
	    linear : function() {
	        this.setCoreTransformation(BezierEasing.css.linear);
	        return this;
	    },
	    easeIn : function() {
	        this.setCoreTransformation(BezierEasing.css['ease-in']);
	        return this;
	    },
	    easeOut : function() {
	        this.setCoreTransformation(BezierEasing.css['ease-out']);
	        return this;
	    },
	    easeInOut : function() {
	        this.setCoreTransformation(BezierEasing.css['ease-in-out']);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var ValueGenerator = __webpack_require__(1);
	var Color = __webpack_require__(3);
	
	module.exports = StylesGenerator;
	
	function StylesGenerator(obj) {
	    if (obj) {
	        ValueGenerator.copy(this, obj);
	    }
	    ValueGenerator.apply(this);
	    this._attr = this._attr || null;
	    this._attributes = this._attributes || {};
	}
	ValueGenerator.copy(StylesGenerator.prototype, ValueGenerator.prototype);
	ValueGenerator.copy(StylesGenerator.prototype, {
	    clone : function() {
	        return new StylesGenerator(this);
	    },
	    _buildAttr : function() {
	        if (this._attr) {
	            this._attributes[this._attr] = new ValueGenerator(this);
	            this.trim(false, false);
	        }
	        return this.reset(this);
	    },
	    get : function(name) {
	        if (name === undefined) {
	            return this._attributes;
	        }
	        return this._attributes[name];
	    },
	    attr : function(name) {
	        this._buildAttr();
	        this._attr = name;
	        return this;
	    },
	    mix : function(from, to) {
	        return this.range(0, 1, function(val) {
	            return from.mix(to, val);
	        });
	    },
	    color : function(from, to) {
	        return this.range(0, 1, function(val) {
	            return Color.mix(from, to, val).toHex();
	        });
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
	    build : function() {
	        this._buildAttr();
	        var generators = {};
	        for ( var key in this._attributes) {
	            var f = this._attributes[key];
	            generators[key] = f.build();
	        }
	        return function(val) {
	            var result = {};
	            for ( var key in generators) {
	                var f = generators[key];
	                result[key] = f(val);
	            }
	            return result;
	        };
	    },
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Color;
	
	/**
	 * Most of methods for this class are copied from the following classes of the
	 * less.js library (MIT license): tree.Color,
	 */
	function Color(color) {
	    this._reset();
	    if (typeof color === 'string') {
	        this.parse(color);
	    } else {
	        var array;
	        if (Array.isArray(color)) {
	            array = color;
	        } else if (typeof color === 'object' && Array.isArray(color.rgba)) {
	            array = color.rgba;
	        }
	        if (array) {
	            for (var i = 0; i < this.rgba.length; i++) {
	                this.rgba[i] = array[i];
	            }
	        }
	    }
	}
	
	Color.prototype = {
	
	    /** Creates a clone of this instance. */
	    clone : function() {
	        return Color.color(this.rgba);
	    },
	
	    // -----------------------------------------------------------------------
	    // Parsing / loading from other formats
	
	    /**
	     * Parses the specified hexadecimal color and sets internal fields in this
	     * object.
	     */
	    parse : function(color) {
	        this._reset();
	        if (!color)
	            return;
	        var r, g, b;
	        color = (color.charAt(0) == '#') ? color.substring(1, color.length)
	                : color;
	        if (color.length == 3) {
	            r = parseInt(color.substring(0, 1) + color.substring(0, 1), 16);
	            g = parseInt(color.substring(1, 2) + color.substring(1, 2), 16);
	            b = parseInt(color.substring(2, 3) + color.substring(2, 3), 16);
	        } else {
	            r = parseInt(color.substring(0, 2), 16);
	            g = parseInt(color.substring(2, 4), 16);
	            b = parseInt(color.substring(4, 6), 16);
	        }
	        this.rgba[0] = r;
	        this.rgba[1] = g;
	        this.rgba[2] = b;
	    },
	
	    /** Copies from HSLA format */
	    fromHSL : function(h, s, l, a) {
	        if (typeof h === 'object') {
	            s = h.s;
	            l = h.l;
	            a = h.a;
	            h = h.h;
	        }
	        function hue(h) {
	            h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
	            if (h * 6 < 1) {
	                return m1 + (m2 - m1) * h * 6;
	            } else if (h * 2 < 1) {
	                return m2;
	            } else if (h * 3 < 2) {
	                return m1 + (m2 - m1) * (2 / 3 - h) * 6;
	            } else {
	                return m1;
	            }
	        }
	        h = (number(h) % 360) / 360;
	        s = clamp(number(s * 1.0));
	        l = clamp(number(l * 1.0));
	        a = clamp(number(a * 1.0));
	        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
	        var m1 = l * 2 - m2;
	        this.rgba[0] = Math.round(hue(h + 1 / 3) * 255);
	        this.rgba[1] = Math.round(hue(h) * 255);
	        this.rgba[2] = Math.round(hue(h - 1 / 3) * 255);
	        this.rgba[3] = a;
	
	        return this;
	    },
	
	    // -----------------------------------------------------------------------
	    // Color transformations
	
	    /**
	     * Returns a saturated color
	     * 
	     * @param amount
	     *            value in the range [0..1]
	     */
	    saturate : function(amount) {
	        // filter: saturate(3.2);
	        // should be kept as is, so check for color
	        var hsl = this.toHSL();
	        hsl.s += amount;
	        hsl.s = clamp(hsl.s);
	        return Color.fromHSL(hsl);
	    },
	    /**
	     * Returns a desaturated color
	     * 
	     * @param amount
	     *            value in the range [0..1]
	     */
	    desaturate : function(amount) {
	        var hsl = this.toHSL();
	        hsl.s -= amount;
	        hsl.s = clamp(hsl.s);
	        return Color.fromHSL(hsl);
	    },
	    /**
	     * Returns a lighten version of this color
	     * 
	     * @param amount
	     *            value in the range [0..1]
	     */
	    lighten : function(amount) {
	        var hsl = this.toHSL();
	        hsl.l += amount;
	        hsl.l = clamp(hsl.l);
	        return Color.fromHSL(hsl);
	    },
	    /**
	     * Returns a darken version of this color
	     * 
	     * @param amount
	     *            value in the range [0..1]
	     */
	    darken : function(amount) {
	        var hsl = this.toHSL();
	        hsl.l -= amount;
	        hsl.l = clamp(hsl.l);
	        return Color.fromHSL(hsl);
	    },
	    /**
	     * @param amount
	     *            value in the range [0..1]
	     */
	    fadein : function(amount) {
	        var hsl = this.toHSL();
	        hsl.a += amount;
	        hsl.a = clamp(hsl.a);
	        return Color.fromHSL(hsl);
	    },
	    /**
	     * @param amount
	     *            value in the range [0..1]
	     */
	    fadeout : function(amount) {
	        var hsl = this.toHSL();
	        hsl.a -= amount;
	        hsl.a = clamp(hsl.a);
	        return Color.fromHSL(hsl);
	    },
	    /**
	     * @param amount
	     *            value in the range [0..1]
	     */
	    fade : function(amount) {
	        var hsl = this.toHSL();
	        hsl.a = amount;
	        hsl.a = clamp(hsl.a);
	        return Color.fromHSL(hsl);
	    },
	    /**
	     * @param amount
	     *            value in the range [0..360]
	     */
	    spin : function(amount) {
	        var hsl = this.toHSL();
	        var hue = (hsl.h + amount) % 360;
	        hsl.h = hue < 0 ? 360 + hue : hue;
	        return Color.fromHSL(hsl);
	    },
	
	    /**
	     * Mixes this color with the specified one and returns a resulting color
	     * 
	     * @param color
	     *            a color to mix
	     * @param weight
	     *            a relative participation of each color in the final result;
	     *            value in the range [0..1]
	     */
	    mix : function(color, weight) {
	        return Color.mix(this, color, weight);
	    },
	    greyscale : function() {
	        return this.desaturate(1);
	    },
	    contrast : function(dark, light, threshold) {
	        // filter: contrast(3.2);
	        // should be kept as is, so check for color
	        if (typeof light === 'undefined') {
	            light = Color.fromHSL([ 255, 255, 255, 1.0 ]);
	        }
	        if (typeof dark === 'undefined') {
	            dark = Color.fromHSL([ 0, 0, 0, 1.0 ]);
	        }
	        // Figure out which is actually light and dark!
	        if (dark.luma() > light.luma()) {
	            var t = light;
	            light = dark;
	            dark = t;
	        }
	        if (typeof threshold === 'undefined') {
	            threshold = 0.43;
	        } else {
	            threshold = number(threshold);
	        }
	        if (ths.luma() < threshold) {
	            return light;
	        } else {
	            return dark;
	        }
	    },
	
	    // -----------------------------------------------------------------------
	
	    /**
	     * Returns a "style" representation of this object. This method used for
	     * style generation.
	     */
	    toStyle : function() {
	        return this.toHex();
	    },
	
	    // -----------------------------------------------------------------------
	    // Formatting
	
	    /** Returns a string representation of this object */
	    toString : function() {
	        return this.toHex();
	    },
	
	    /** Formats this object as RGBA string - rgba(red,green,blue,alpha) */
	    toRGBA : function() {
	        return 'rgba(' + this.rgba[0] + ',' + this.rgba[1] + ',' + this.rgba[2]
	                + ',' + this.rgba[3] + ')';
	    },
	
	    /** Formats this object as a RGB string - rgb(red,green,blue) */
	    toRGB : function() {
	        return 'rgba(' + this.rgba[0] + ',' + this.rgba[1] + ',' + this.rgba[2]
	                + ')';
	    },
	
	    /** Formats this object as a hexadecimal RGB string #rrggbb */
	    toHex : function() {
	        return Color.toHex([ this.rgba[0], this.rgba[1], this.rgba[2] ]);
	    },
	
	    /** http://en.wikipedia.org/wiki/Luma_(video) */
	    luma : function() {
	        var r = this.rgba[0] / 255, g = this.rgba[1] / 255, b = this.rgba[2] / 255;
	        r = (r <= 0.03928) ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4);
	        g = (g <= 0.03928) ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4);
	        b = (b <= 0.03928) ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4);
	        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	    },
	
	    toHSL : function() {
	        var r = this.rgba[0] / 255, g = this.rgba[1] / 255, b = this.rgba[2] / 255, a = this.rgba[3];
	
	        var max = Math.max(r, g, b), min = Math.min(r, g, b);
	        var h, s, l = (max + min) / 2, d = max - min;
	
	        if (max === min) {
	            h = s = 0;
	        } else {
	            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	
	            switch (max) {
	            case r:
	                h = (g - b) / d + (g < b ? 6 : 0);
	                break;
	            case g:
	                h = (b - r) / d + 2;
	                break;
	            case b:
	                h = (r - g) / d + 4;
	                break;
	            }
	            h /= 6;
	        }
	        return {
	            h : h * 360,
	            s : s,
	            l : l,
	            a : a
	        };
	    },
	
	    // Adapted from
	    // http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	    toHSV : function() {
	        var r = this.rgba[0] / 255, g = this.rgba[1] / 255, b = this.rgba[2] / 255, a = this.rgba[3];
	
	        var max = Math.max(r, g, b), min = Math.min(r, g, b);
	        var h, s, v = max;
	
	        var d = max - min;
	        if (max === 0) {
	            s = 0;
	        } else {
	            s = d / max;
	        }
	
	        if (max === min) {
	            h = 0;
	        } else {
	            switch (max) {
	            case r:
	                h = (g - b) / d + (g < b ? 6 : 0);
	                break;
	            case g:
	                h = (b - r) / d + 2;
	                break;
	            case b:
	                h = (r - g) / d + 4;
	                break;
	            }
	            h /= 6;
	        }
	        return {
	            h : h * 360,
	            s : s,
	            v : v,
	            a : a
	        };
	    },
	
	    toARGB : function() {
	        return Color.toHex([ this.rgba[3], this.rgba[0], this.rgba[1],
	                this.rgba[2] ]);
	    },
	
	    // -----------------------------------------------------------------------
	    // Private methods
	
	    compare : function(x) {
	        if (!x.rgba) {
	            return -1;
	        }
	        return (x.rgba[0] === this.rgba[0] && x.rgba[1] === this.rgba[1]
	                && x.rgba[2] === this.rgba[2] && x.rgba[3] === this.rgba[3]) ? 0
	                : -1;
	    },
	
	    /** Resets fields of this object - all channels to 0 and alpha channel to 1. */
	    _reset : function() {
	        this.rgba = [ 0, 0, 0, 1 ];
	    },
	
	};
	
	Color.color = function(color) {
	    if (color instanceof Color) {
	        return color;
	    }
	    return new Color(color);
	}
	
	// Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris
	// Eppstein http://sass-lang.com
	Color.mix = function(first, second, weight) {
	    first = Color.color(first);
	    second = Color.color(second);
	    if (isNaN(weight)) {
	        weight = 0.5;
	    }
	    var p = weight;
	    var w = p * 2 - 1;
	    var a = first.toHSL().a - second.toHSL().a;
	    var w2 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
	    var w1 = 1 - w2;
	    var rgba = [ Math.round(first.rgba[0] * w1 + second.rgba[0] * w2),
	            Math.round(first.rgba[1] * w1 + second.rgba[1] * w2),
	            Math.round(first.rgba[2] * w1 + second.rgba[2] * w2),
	            first.rgba[3] * p + second.rgba[3] * (1 - p) ];
	    var result = Color.color(rgba);
	    return result;
	}
	// -----------------------------------------------------------------------
	// Color blending
	
	// Taken with modifications from less.js (MIT):
	// https://github.com/less/less.js/blob/master/lib/less/functions.js
	
	// Color Blending
	// ref: http://www.w3.org/TR/compositing-1
	function colorBlend(mode) {
	    return function(first, second) {
	        first = Color.color(first);
	        second = Color.color(second);
	        var ab = first.rgba[3];
	        var as = second.rgba[3];
	        var ar = as + ab * (1 - as);
	        var rgba = [ 0, 0, 0, ar ]; // result
	
	        var cb, cs, cr;
	        for (var i = 0; i < 3; i++) {
	            cb = first.rgba[i] / 255;
	            cs = second.rgba[i] / 255;
	            cr = mode(cb, cs);
	            if (ar) {
	                cr = (as * cs + ab * (cb - as * (cb + cs - cr))) / ar;
	            }
	            rgba[i] = Math.round(cr * 255);
	        }
	        return Color.color(rgba);
	    }
	}
	var colorBlendMode = {
	    multiply : function(cb, cs) {
	        return cb * cs;
	    },
	    screen : function(cb, cs) {
	        return cb + cs - cb * cs;
	    },
	    overlay : function(cb, cs) {
	        cb *= 2;
	        return (cb <= 1) ? colorBlendMode.multiply(cb, cs) : colorBlendMode
	                .screen(cb - 1, cs);
	    },
	    softlight : function(cb, cs) {
	        var d = 1, e = cb;
	        if (cs > 0.5) {
	            e = 1;
	            d = (cb > 0.25) ? Math.sqrt(cb) : ((16 * cb - 12) * cb + 4) * cb;
	        }
	        return cb - (1 - 2 * cs) * e * (d - cb);
	    },
	    hardlight : function(cb, cs) {
	        return colorBlendMode.overlay(cs, cb);
	    },
	    difference : function(cb, cs) {
	        return Math.abs(cb - cs);
	    },
	    exclusion : function(cb, cs) {
	        return cb + cs - 2 * cb * cs;
	    },
	
	    // non-w3c functions:
	
	    // gives the same results as mix(first, second, 0.5)
	    average : function(cb, cs) {
	        return (cb + cs) / 2;
	    },
	    negation : function(cb, cs) {
	        return 1 - Math.abs(cb + cs - 1);
	    }
	};
	
	Color.blend = {};
	function protoColorBlend(f) {
	    return function(color) {
	        return Color.blend[f](this, color);
	    };
	}
	for (f in colorBlendMode) {
	    if (colorBlendMode.hasOwnProperty(f)) {
	        Color.blend[f] = colorBlend(colorBlendMode[f]);
	        Color.prototype[f] = protoColorBlend(f);
	    }
	}
	
	Color.fromHSL = function(h, s, l, a) {
	    return Color.color('').fromHSL(h, s, l, a);
	}
	
	Color.toHex = function toHex(v) {
	    return '#' + v.map(function(c) {
	        c = Math.min(Math.max(c, 0), 255);
	        return (c < 16 ? '0' : '') + c.toString(16);
	    }).join('');
	}
	// -----------------------------------------------------------------------
	
	function number(n) {
	    if (typeof (n) === 'number') {
	        return n;
	    } else {
	        throw {
	            error : "RuntimeError",
	            message : "color functions take numbers as parameters"
	        };
	    }
	}
	
	function clamp(val) {
	    return Math.min(1, Math.max(0, val));
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Copy/paste from less.js (MIT license)
	var Color = __webpack_require__(3);
	function color(code) {
	    return new Color(code);
	}
	module.exports = {
	    'aliceblue' : color('#f0f8ff'),
	    'antiquewhite' : color('#faebd7'),
	    'aqua' : color('#00ffff'),
	    'aquamarine' : color('#7fffd4'),
	    'azure' : color('#f0ffff'),
	    'beige' : color('#f5f5dc'),
	    'bisque' : color('#ffe4c4'),
	    'black' : color('#000000'),
	    'blanchedalmond' : color('#ffebcd'),
	    'blue' : color('#0000ff'),
	    'blueviolet' : color('#8a2be2'),
	    'brown' : color('#a52a2a'),
	    'burlywood' : color('#deb887'),
	    'cadetblue' : color('#5f9ea0'),
	    'chartreuse' : color('#7fff00'),
	    'chocolate' : color('#d2691e'),
	    'coral' : color('#ff7f50'),
	    'cornflowerblue' : color('#6495ed'),
	    'cornsilk' : color('#fff8dc'),
	    'crimson' : color('#dc143c'),
	    'cyan' : color('#00ffff'),
	    'darkblue' : color('#00008b'),
	    'darkcyan' : color('#008b8b'),
	    'darkgoldenrod' : color('#b8860b'),
	    'darkgray' : color('#a9a9a9'),
	    'darkgrey' : color('#a9a9a9'),
	    'darkgreen' : color('#006400'),
	    'darkkhaki' : color('#bdb76b'),
	    'darkmagenta' : color('#8b008b'),
	    'darkolivegreen' : color('#556b2f'),
	    'darkorange' : color('#ff8c00'),
	    'darkorchid' : color('#9932cc'),
	    'darkred' : color('#8b0000'),
	    'darksalmon' : color('#e9967a'),
	    'darkseagreen' : color('#8fbc8f'),
	    'darkslateblue' : color('#483d8b'),
	    'darkslategray' : color('#2f4f4f'),
	    'darkslategrey' : color('#2f4f4f'),
	    'darkturquoise' : color('#00ced1'),
	    'darkviolet' : color('#9400d3'),
	    'deeppink' : color('#ff1493'),
	    'deepskyblue' : color('#00bfff'),
	    'dimgray' : color('#696969'),
	    'dimgrey' : color('#696969'),
	    'dodgerblue' : color('#1e90ff'),
	    'firebrick' : color('#b22222'),
	    'floralwhite' : color('#fffaf0'),
	    'forestgreen' : color('#228b22'),
	    'fuchsia' : color('#ff00ff'),
	    'gainsboro' : color('#dcdcdc'),
	    'ghostwhite' : color('#f8f8ff'),
	    'gold' : color('#ffd700'),
	    'goldenrod' : color('#daa520'),
	    'gray' : color('#808080'),
	    'grey' : color('#808080'),
	    'green' : color('#008000'),
	    'greenyellow' : color('#adff2f'),
	    'honeydew' : color('#f0fff0'),
	    'hotpink' : color('#ff69b4'),
	    'indianred' : color('#cd5c5c'),
	    'indigo' : color('#4b0082'),
	    'ivory' : color('#fffff0'),
	    'khaki' : color('#f0e68c'),
	    'lavender' : color('#e6e6fa'),
	    'lavenderblush' : color('#fff0f5'),
	    'lawngreen' : color('#7cfc00'),
	    'lemonchiffon' : color('#fffacd'),
	    'lightblue' : color('#add8e6'),
	    'lightcoral' : color('#f08080'),
	    'lightcyan' : color('#e0ffff'),
	    'lightgoldenrodyellow' : color('#fafad2'),
	    'lightgray' : color('#d3d3d3'),
	    'lightgrey' : color('#d3d3d3'),
	    'lightgreen' : color('#90ee90'),
	    'lightpink' : color('#ffb6c1'),
	    'lightsalmon' : color('#ffa07a'),
	    'lightseagreen' : color('#20b2aa'),
	    'lightskyblue' : color('#87cefa'),
	    'lightslategray' : color('#778899'),
	    'lightslategrey' : color('#778899'),
	    'lightsteelblue' : color('#b0c4de'),
	    'lightyellow' : color('#ffffe0'),
	    'lime' : color('#00ff00'),
	    'limegreen' : color('#32cd32'),
	    'linen' : color('#faf0e6'),
	    'magenta' : color('#ff00ff'),
	    'maroon' : color('#800000'),
	    'mediumaquamarine' : color('#66cdaa'),
	    'mediumblue' : color('#0000cd'),
	    'mediumorchid' : color('#ba55d3'),
	    'mediumpurple' : color('#9370d8'),
	    'mediumseagreen' : color('#3cb371'),
	    'mediumslateblue' : color('#7b68ee'),
	    'mediumspringgreen' : color('#00fa9a'),
	    'mediumturquoise' : color('#48d1cc'),
	    'mediumvioletred' : color('#c71585'),
	    'midnightblue' : color('#191970'),
	    'mintcream' : color('#f5fffa'),
	    'mistyrose' : color('#ffe4e1'),
	    'moccasin' : color('#ffe4b5'),
	    'navajowhite' : color('#ffdead'),
	    'navy' : color('#000080'),
	    'oldlace' : color('#fdf5e6'),
	    'olive' : color('#808000'),
	    'olivedrab' : color('#6b8e23'),
	    'orange' : color('#ffa500'),
	    'orangered' : color('#ff4500'),
	    'orchid' : color('#da70d6'),
	    'palegoldenrod' : color('#eee8aa'),
	    'palegreen' : color('#98fb98'),
	    'paleturquoise' : color('#afeeee'),
	    'palevioletred' : color('#d87093'),
	    'papayawhip' : color('#ffefd5'),
	    'peachpuff' : color('#ffdab9'),
	    'peru' : color('#cd853f'),
	    'pink' : color('#ffc0cb'),
	    'plum' : color('#dda0dd'),
	    'powderblue' : color('#b0e0e6'),
	    'purple' : color('#800080'),
	    'red' : color('#ff0000'),
	    'rosybrown' : color('#bc8f8f'),
	    'royalblue' : color('#4169e1'),
	    'saddlebrown' : color('#8b4513'),
	    'salmon' : color('#fa8072'),
	    'sandybrown' : color('#f4a460'),
	    'seagreen' : color('#2e8b57'),
	    'seashell' : color('#fff5ee'),
	    'sienna' : color('#a0522d'),
	    'silver' : color('#c0c0c0'),
	    'skyblue' : color('#87ceeb'),
	    'slateblue' : color('#6a5acd'),
	    'slategray' : color('#708090'),
	    'slategrey' : color('#708090'),
	    'snow' : color('#fffafa'),
	    'springgreen' : color('#00ff7f'),
	    'steelblue' : color('#4682b4'),
	    'tan' : color('#d2b48c'),
	    'teal' : color('#008080'),
	    'thistle' : color('#d8bfd8'),
	    'tomato' : color('#ff6347'),
	    'turquoise' : color('#40e0d0'),
	    'violet' : color('#ee82ee'),
	    'wheat' : color('#f5deb3'),
	    'white' : color('#ffffff'),
	    'whitesmoke' : color('#f5f5f5'),
	    'yellow' : color('#ffff00'),
	    'yellowgreen' : color('#9acd32')
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = LessSerializer;
	
	/** Serializes a hierarchy of style objects to a Less-like style string. */
	function LessSerializer() {
	}
	
	LessSerializer.prototype = {
	
	    serialize : function(css) {
	        var result = '';
	        for ( var key in css) {
	            var value = css[key];
	            result += this._serializeStyle(key, value);
	            result += '\n\n';
	        }
	        return result;
	    },
	
	    _serializeValues : function(shift, prefix, css) {
	        if (!prefix)
	            prefix = '';
	        var result = '';
	        var that = this;
	        for ( var key in css) {
	            var value = css[key];
	            if (typeof value === 'object') {
	                result += shift + prefix + key + ' {\n'
	                result += that._serializeValues(shift + '  ', '', value);
	                result += shift + '}\n';
	            } else {
	                result += shift + prefix + key + ': ' + value + ';\n';
	            }
	        }
	        return result;
	    },
	
	    _serializeStyle : function(name, css) {
	        var result = '';
	        if (typeof css === 'string') {
	            var obj = {};
	            obj[name] = css;
	            result += this._serializeValues('  ', '', obj)
	        } else {
	            result += name + ' {\n';
	            result += this._serializeValues('  ', '', css);
	            result += '}';
	        }
	        return result;
	    }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	function range(from, to, transform) {
	    return function(val, opt) {
	        var result;
	        if (val) {
	            var zoom = opt.zoom;
	            var domain = this.getDomain();
	            var minZoom = domain[0];
	            var maxZoom = domain[1];
	            result = (from + val * (to - from));
	            result *= Math.pow(2, Math.max(0, zoom - maxZoom));
	        }
	        if (transform) {
	            return transform(result, val, opt);
	        }
	        return result;
	    };
	}
	
	function width(from, to, method, transform) {
	    return [ {
	        method : method,
	        range : range(from, to, transform)
	    } ];
	}
	
	module.exports = {
	    range : range,
	    width : width
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var BezierEasing = __webpack_require__(8);
	var ValueGenerator = __webpack_require__(1);
	
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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * BezierEasing - use bezier curve for transition easing function
	 * by Gaëtan Renaudeau 2014 – MIT License
	 *
	 * Credits: is based on Firefox's nsSMILKeySpline.cpp
	 * Usage:
	 * var spline = BezierEasing(0.25, 0.1, 0.25, 1.0)
	 * spline(x) => returns the easing value | x must be in [0, 1] range
	 *
	 */
	(function (definition) {
	  if (true) {
	    module.exports = definition();
	  } else if (typeof define === 'function' && define.amd) {
	    define([], definition);
	  } else {
	    window.BezierEasing = definition();
	  }
	}(function () {
	  var global = this;
	
	  // These values are established by empiricism with tests (tradeoff: performance VS precision)
	  var NEWTON_ITERATIONS = 4;
	  var NEWTON_MIN_SLOPE = 0.001;
	  var SUBDIVISION_PRECISION = 0.0000001;
	  var SUBDIVISION_MAX_ITERATIONS = 10;
	
	  var kSplineTableSize = 11;
	  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
	
	  var float32ArraySupported = 'Float32Array' in global;
	
	  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
	  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
	  function C (aA1)      { return 3.0 * aA1; }
	
	  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	  function calcBezier (aT, aA1, aA2) {
	    return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
	  }
	
	  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	  function getSlope (aT, aA1, aA2) {
	    return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
	  }
	
	  function binarySubdivide (aX, aA, aB, mX1, mX2) {
	    var currentX, currentT, i = 0;
	    do {
	      currentT = aA + (aB - aA) / 2.0;
	      currentX = calcBezier(currentT, mX1, mX2) - aX;
	      if (currentX > 0.0) {
	        aB = currentT;
	      } else {
	        aA = currentT;
	      }
	    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	    return currentT;
	  }
	
	  function BezierEasing (mX1, mY1, mX2, mY2) {
	    // Validate arguments
	    if (arguments.length !== 4) {
	      throw new Error("BezierEasing requires 4 arguments.");
	    }
	    for (var i=0; i<4; ++i) {
	      if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
	        throw new Error("BezierEasing arguments should be integers.");
	      }
	    }
	    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) {
	      throw new Error("BezierEasing x values must be in [0, 1] range.");
	    }
	
	    var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
	
	    function newtonRaphsonIterate (aX, aGuessT) {
	      for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	        var currentSlope = getSlope(aGuessT, mX1, mX2);
	        if (currentSlope === 0.0) return aGuessT;
	        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	        aGuessT -= currentX / currentSlope;
	      }
	      return aGuessT;
	    }
	
	    function calcSampleValues () {
	      for (var i = 0; i < kSplineTableSize; ++i) {
	        mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	      }
	    }
	
	    function getTForX (aX) {
	      var intervalStart = 0.0;
	      var currentSample = 1;
	      var lastSample = kSplineTableSize - 1;
	
	      for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
	        intervalStart += kSampleStepSize;
	      }
	      --currentSample;
	
	      // Interpolate to provide an initial guess for t
	      var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]);
	      var guessForT = intervalStart + dist * kSampleStepSize;
	
	      var initialSlope = getSlope(guessForT, mX1, mX2);
	      if (initialSlope >= NEWTON_MIN_SLOPE) {
	        return newtonRaphsonIterate(aX, guessForT);
	      } else if (initialSlope === 0.0) {
	        return guessForT;
	      } else {
	        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	      }
	    }
	
	    var _precomputed = false;
	    function precompute() {
	      _precomputed = true;
	      if (mX1 != mY1 || mX2 != mY2)
	        calcSampleValues();
	    }
	
	    var f = function (aX) {
	      if (!_precomputed) precompute();
	      if (mX1 === mY1 && mX2 === mY2) return aX; // linear
	      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	      if (aX === 0) return 0;
	      if (aX === 1) return 1;
	      return calcBezier(getTForX(aX), mY1, mY2);
	    };
	
	    f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };
	
	    var args = [mX1, mY1, mX2, mY2];
	    var str = "BezierEasing("+args+")";
	    f.toString = function () { return str; };
	
	    var css = "cubic-bezier("+args+")";
	    f.toCSS = function () { return css; };
	
	    return f;
	  }
	
	  // CSS mapping
	  BezierEasing.css = {
	    "ease":        BezierEasing(0.25, 0.1, 0.25, 1.0),
	    "linear":      BezierEasing(0.00, 0.0, 1.00, 1.0),
	    "ease-in":     BezierEasing(0.42, 0.0, 1.00, 1.0),
	    "ease-out":    BezierEasing(0.00, 0.0, 0.58, 1.0),
	    "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0)
	  };
	
	  return BezierEasing;
	
	}));


/***/ }
/******/ ])
});
;
//# sourceMappingURL=mosaic-styles.js.map