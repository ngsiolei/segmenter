var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter([]);
var str = '銀行分行';
var actual = seg.getSegments(str);
var expected = ['銀行分行'];
assert.deepStrictEqual(actual, expected);
