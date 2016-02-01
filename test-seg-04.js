var assert = require('assert');
var Segmenter = require('./Segmenter');

var seg = new Segmenter(['路氹', '連貫', '公路', '路']);
var str = '路氹連貫公路';
var actual = seg.getSegments(str);
var expected = ['路氹', '連貫', '公路'];
assert.deepStrictEqual(actual, expected);
