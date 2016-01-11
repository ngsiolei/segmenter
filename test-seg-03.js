var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter(['便利店', '有限公司']);
var str = 'Farmácia Hoje';
var actual = seg.getSegments(str);
var expected = ['farmacia', 'hoje'];
assert.deepStrictEqual(actual, expected);
