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
