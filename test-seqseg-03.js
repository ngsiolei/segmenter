var assert = require('assert');
var Segmenter = require('./segmenter');

var seg = new Segmenter();
var str = 'Farmácia Hoje';
var actual = seg.getSeqSegments(str);
var expected = {
  'alphaDigit': ['farmacia', 'hoje'],
  'cjk': []
};
assert.deepStrictEqual(actual, expected);
