var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter(['便利店', '有限公司']);
var str = 'Something New （澳門） 有限公司';
var actual = seg.getSegments(str);
var expected = ['something', 'new', '有限公司', '澳門'];
assert.deepStrictEqual(actual, expected);
