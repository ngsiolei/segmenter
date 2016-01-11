var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter(['便利店', '有限公司']);
var str = '8-12便利店';
var actual = seg.getSegments(str);
var expected = ['8', '12', '便利店'];
assert.deepStrictEqual(actual, expected);
