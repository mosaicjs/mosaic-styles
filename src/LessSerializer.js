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
