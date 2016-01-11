var assert = require('assert');
var Segmenter = require('./segmenter');

var seg = new Segmenter();
var str = 'Something New （澳門） 有限公司';
var actual = seg.getSeqSegments(str);
var expected = {
  'alphaDigit': ['something', 'new'],
  'cjk': [
    '澳',
    '澳門',
    '澳門有',
    '澳門有限',
    '澳門有限公',
    '澳門有限公司',
    '門',
    '門有',
    '門有限',
    '門有限公',
    '門有限公司',
    '有',
    '有限',
    '有限公',
    '有限公司',
    '限',
    '限公',
    '限公司',
    '公',
    '公司',
    '司',
  ]
};
assert.deepStrictEqual(actual, expected);
