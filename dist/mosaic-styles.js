/*!
 * mosaic-styles v0.0.3 | License: MIT 
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

	var ValueGenerator = __webpack_require__(1);
	var StylesGenerator = __webpack_require__(2);
	module.exports = {
	    ValueGenerator : ValueGenerator,
	    StylesGenerator : StylesGenerator
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// mosaic-styles
	var BezierEasing = __webpack_require__(3);

	module.exports = ValueGenerator;

	function ValueGenerator(obj) {
	    obj = obj || {};
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
	        return function(val) {
	            if (to === from)
	                return toVal;
	            var p = (val - from) / (to - from);
	            p = Math.max(0, Math.min(p, 1));
	            p = transform(p);
	            var result = fromVal + (toVal - fromVal) * p;
	            return result;
	        };
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
	        }
	        return this;
	    },
	    get : function(name) {
	        if (name === undefined) {
	            return this._attributes;
	        }
	        return this._attributes[name];
	    },
	    mapping : function(mapping) {
	        if (mapping === undefined)
	            return this._mapping;
	        this._mapping = mapping;
	        return this;
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
