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
