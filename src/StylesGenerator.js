var ValueGenerator = require('./ValueGenerator');

module.exports = StylesGenerator;

function StylesGenerator() {
    ValueGenerator.apply(this);
    this._attr = null;
    this._attributes = {};
}
ValueGenerator.copy(StylesGenerator.prototype, ValueGenerator.prototype);
ValueGenerator.copy(StylesGenerator.prototype, {
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
