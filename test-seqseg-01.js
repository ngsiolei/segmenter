var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter();
var str = '8-12便利店';
var actual = seg.getSeqSegments(str);
var expected = {
  'alphaDigit': ['8', '12'],
  'cjk': ['便', '便利', '便利店', '利', '利店', '店']
};
assert.deepStrictEqual(actual, expected);
