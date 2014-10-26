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
