var expect = require('expect.js');
var styles = require('..');
var LessSerializer = styles.LessSerializer;

describe('LessSerializer', function() {
    function test(obj, control) {
        var serializer = new LessSerializer();
        var result = serializer.serialize(obj);
        expect(result).to.eql(control);
    }
    it('should transform objects to a Less-like styles', function() {
        test({}, '');
        test({
            'a' : 'A'
        }, '  a: A;\n\n\n');
        test({
            '#xx' : {
                '[zoom=8]' : {
                    width : 3,
                    opacity : 0.5
                }
            }
        }, '' + //
        '#xx {\n' + //
        '  [zoom=8] {\n' + //
        '    width: 3;\n' + //
        '    opacity: 0.5;\n' + //
        '  }\n' + //
        '}\n' + //
        '\n');
    });
});