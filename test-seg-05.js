var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter(['銀行', '分行', '行']);
var str = '銀行分行';
var actual = seg.getSegments(str);
var expected = ['銀行', '分行'];
assert.deepStrictEqual(actual, expected);
