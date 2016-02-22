var ValueGenerator = require('./ValueGenerator');
var Color = require('./Color');

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
            var generator = new ValueGenerator(this);
            var val = this._attributes[this._attr];
            if (val) {
                var list = this._attributes[this._attr];
                if (!Array.isArray(list)) {
                    list = this._attributes[this._attr] = [val];
                };
                list.push(generator);
            } else {
                this._attributes[this._attr] = generator;
            }
            this.trim(false, false);
        }
        return this.reset(this);
    },
    getAll : function(name){
        var g = this._attributes[name];
        return !g ? [] : Array.isArray(g) ? g : [g];
    },
    get : function(name) {
        if (name === undefined) {
            return this._attributes;
        }
        var list = this.getAll(name);
        return list[0];
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
        var that = this;
        for ( var key in this._attributes) {
            var generator = this._attributes[key];
            if (!Array.isArray(generator)) {
                generators[key] = generator.build();
            } else {
                generators[key] = (function(list){
                    list = list.map(function(gen){
                        var g = gen.build();
                        g.from = gen._from;
                        g.to = gen._to;
                        return g;
                    });
                    function compare(a, b){
                        return a > b ? 1 : a < b ? -1 : 0;
                    }
                    return function(val){
                        var f, min, max;
                        for ( var i = 0; !f && i < list.length; i++) {
                            var ok = true, r;
                            var g = list[i];
                            if (g.from !== undefined){
                                r = compare(val, g.from);
                                if (r < 1 && !min) {
                                    min = g;
                                }
                                ok = ok && (r >= 0);
                            }
                            if (g.to !== undefined){
                                r = compare(val, g.to);
                                if (r > 0){
                                    max = g;
                                }
                                ok = ok && (r <= 0)
                            }
                            if (ok) {
                                f = g;
                            }
                        }
                        f = f || min || max || list[list.length - 1];
                        var result = f.apply(this, arguments);
                        return result;
                    };
                })(generator);
            }
        }
        return function(val) {
            var result = {};
            for ( var key in generators) {
                var f = generators[key];
                result[key] = f.apply(this, arguments);
            }
            return result;
        };
    }

});
