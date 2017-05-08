var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter();
var str = '生活life的意義';
var actual = seg.getSeqSegments(str);
var expected = {
  'alphaDigit': ['life'],
  'cjk': ['生', '生活', '活', '的', '的意', '的意義', '意', '意義', '義'],
};
assert.deepStrictEqual(actual, expected);
