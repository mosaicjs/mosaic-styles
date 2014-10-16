/*!
 * mosaic-styles v0.0.5 | License: MIT 
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
	    Colors : __webpack_require__(4)
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// mosaic-styles
	var BezierEasing = __webpack_require__(5);

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
	    wrap : function(f, context) {
	        var transform = this.transform();
	        return this.transform(function(val) {
	            var r = transform.call(this, val);
	            var args = [ r ];
	            for (var i = 0; i < arguments.length; i++) {
	                args.push(arguments[i]);
	            }
	            return f.apply(context, args);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var ValueGenerator = __webpack_require__(1);

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
	        return this;
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
	        return new Color(this);
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
	        var hsl = from.toHSL();
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
	    // Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris
	    // Eppstein
	    // http://sass-lang.com
	    //
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
	    if (typeof color === 'string') {
	        color = new Color(color);
	    } else if (Array.isArray(color)) {
	        color = new Color(color);
	    }
	    return color;
	}
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
	    var result = new Color(rgba);
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
	        return new Color(rgba);
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
	    return new Color().fromHSL(h, s, l, a);
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
	module.exports = {
	    'aliceblue' : '#f0f8ff',
	    'antiquewhite' : '#faebd7',
	    'aqua' : '#00ffff',
	    'aquamarine' : '#7fffd4',
	    'azure' : '#f0ffff',
	    'beige' : '#f5f5dc',
	    'bisque' : '#ffe4c4',
	    'black' : '#000000',
	    'blanchedalmond' : '#ffebcd',
	    'blue' : '#0000ff',
	    'blueviolet' : '#8a2be2',
	    'brown' : '#a52a2a',
	    'burlywood' : '#deb887',
	    'cadetblue' : '#5f9ea0',
	    'chartreuse' : '#7fff00',
	    'chocolate' : '#d2691e',
	    'coral' : '#ff7f50',
	    'cornflowerblue' : '#6495ed',
	    'cornsilk' : '#fff8dc',
	    'crimson' : '#dc143c',
	    'cyan' : '#00ffff',
	    'darkblue' : '#00008b',
	    'darkcyan' : '#008b8b',
	    'darkgoldenrod' : '#b8860b',
	    'darkgray' : '#a9a9a9',
	    'darkgrey' : '#a9a9a9',
	    'darkgreen' : '#006400',
	    'darkkhaki' : '#bdb76b',
	    'darkmagenta' : '#8b008b',
	    'darkolivegreen' : '#556b2f',
	    'darkorange' : '#ff8c00',
	    'darkorchid' : '#9932cc',
	    'darkred' : '#8b0000',
	    'darksalmon' : '#e9967a',
	    'darkseagreen' : '#8fbc8f',
	    'darkslateblue' : '#483d8b',
	    'darkslategray' : '#2f4f4f',
	    'darkslategrey' : '#2f4f4f',
	    'darkturquoise' : '#00ced1',
	    'darkviolet' : '#9400d3',
	    'deeppink' : '#ff1493',
	    'deepskyblue' : '#00bfff',
	    'dimgray' : '#696969',
	    'dimgrey' : '#696969',
	    'dodgerblue' : '#1e90ff',
	    'firebrick' : '#b22222',
	    'floralwhite' : '#fffaf0',
	    'forestgreen' : '#228b22',
	    'fuchsia' : '#ff00ff',
	    'gainsboro' : '#dcdcdc',
	    'ghostwhite' : '#f8f8ff',
	    'gold' : '#ffd700',
	    'goldenrod' : '#daa520',
	    'gray' : '#808080',
	    'grey' : '#808080',
	    'green' : '#008000',
	    'greenyellow' : '#adff2f',
	    'honeydew' : '#f0fff0',
	    'hotpink' : '#ff69b4',
	    'indianred' : '#cd5c5c',
	    'indigo' : '#4b0082',
	    'ivory' : '#fffff0',
	    'khaki' : '#f0e68c',
	    'lavender' : '#e6e6fa',
	    'lavenderblush' : '#fff0f5',
	    'lawngreen' : '#7cfc00',
	    'lemonchiffon' : '#fffacd',
	    'lightblue' : '#add8e6',
	    'lightcoral' : '#f08080',
	    'lightcyan' : '#e0ffff',
	    'lightgoldenrodyellow' : '#fafad2',
	    'lightgray' : '#d3d3d3',
	    'lightgrey' : '#d3d3d3',
	    'lightgreen' : '#90ee90',
	    'lightpink' : '#ffb6c1',
	    'lightsalmon' : '#ffa07a',
	    'lightseagreen' : '#20b2aa',
	    'lightskyblue' : '#87cefa',
	    'lightslategray' : '#778899',
	    'lightslategrey' : '#778899',
	    'lightsteelblue' : '#b0c4de',
	    'lightyellow' : '#ffffe0',
	    'lime' : '#00ff00',
	    'limegreen' : '#32cd32',
	    'linen' : '#faf0e6',
	    'magenta' : '#ff00ff',
	    'maroon' : '#800000',
	    'mediumaquamarine' : '#66cdaa',
	    'mediumblue' : '#0000cd',
	    'mediumorchid' : '#ba55d3',
	    'mediumpurple' : '#9370d8',
	    'mediumseagreen' : '#3cb371',
	    'mediumslateblue' : '#7b68ee',
	    'mediumspringgreen' : '#00fa9a',
	    'mediumturquoise' : '#48d1cc',
	    'mediumvioletred' : '#c71585',
	    'midnightblue' : '#191970',
	    'mintcream' : '#f5fffa',
	    'mistyrose' : '#ffe4e1',
	    'moccasin' : '#ffe4b5',
	    'navajowhite' : '#ffdead',
	    'navy' : '#000080',
	    'oldlace' : '#fdf5e6',
	    'olive' : '#808000',
	    'olivedrab' : '#6b8e23',
	    'orange' : '#ffa500',
	    'orangered' : '#ff4500',
	    'orchid' : '#da70d6',
	    'palegoldenrod' : '#eee8aa',
	    'palegreen' : '#98fb98',
	    'paleturquoise' : '#afeeee',
	    'palevioletred' : '#d87093',
	    'papayawhip' : '#ffefd5',
	    'peachpuff' : '#ffdab9',
	    'peru' : '#cd853f',
	    'pink' : '#ffc0cb',
	    'plum' : '#dda0dd',
	    'powderblue' : '#b0e0e6',
	    'purple' : '#800080',
	    'red' : '#ff0000',
	    'rosybrown' : '#bc8f8f',
	    'royalblue' : '#4169e1',
	    'saddlebrown' : '#8b4513',
	    'salmon' : '#fa8072',
	    'sandybrown' : '#f4a460',
	    'seagreen' : '#2e8b57',
	    'seashell' : '#fff5ee',
	    'sienna' : '#a0522d',
	    'silver' : '#c0c0c0',
	    'skyblue' : '#87ceeb',
	    'slateblue' : '#6a5acd',
	    'slategray' : '#708090',
	    'slategrey' : '#708090',
	    'snow' : '#fffafa',
	    'springgreen' : '#00ff7f',
	    'steelblue' : '#4682b4',
	    'tan' : '#d2b48c',
	    'teal' : '#008080',
	    'thistle' : '#d8bfd8',
	    'tomato' : '#ff6347',
	    'turquoise' : '#40e0d0',
	    'violet' : '#ee82ee',
	    'wheat' : '#f5deb3',
	    'white' : '#ffffff',
	    'whitesmoke' : '#f5f5f5',
	    'yellow' : '#ffff00',
	    'yellowgreen' : '#9acd32'
	};

/***/ },
/* 5 */
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
	  }
	  else if (typeof window.define === 'function' && window.define.amd) {
	    window.define([], definition);
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

	    function binarySubdivide (aX, aA, aB) {
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
	      } else if (initialSlope == 0.0) {
	        return guessForT;
	      } else {
	        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
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
	    var str = "BezierEasing("+[mX1, mY1, mX2, mY2]+")";
	    f.toString = function () { return str; };

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
