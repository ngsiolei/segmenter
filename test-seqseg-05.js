'use strict';

const assert = require('assert');
const Segmenter = require('./Segmenter');

const seg = new Segmenter();
const str = '1加2';
const actual = seg.getSeqSegments(str);
const expected = {
  'alphaDigit': ['1', '2'],
  'cjk': ['加'],
};
assert.deepStrictEqual(actual, expected);
