module.exports = Segmenter = function (db) {
  this.db = db || [];
};

Segmenter.prototype.getSegments = function (text) {
  if (!text || (typeof text !== 'string')) {
    return [];
  }
  text = cleanUp(text);
  var seqSegments = this.getSeqSegments(text);
  var pendingSegments = seqSegments.alphaDigit;
  var self = this;
  var intersect = seqSegments.cjk.filter(function (val) {
      return self.db.indexOf(val) !== -1;
  });
  pendingSegments = pendingSegments.concat(intersect);
  var matchedSegments = [];
  for (var i = 0, l = pendingSegments.length; i < l; i++) {
    var ps = pendingSegments[i];
    var pos = text.indexOf(ps);
    if (pos >= 0) {
      matchedSegments.push({'s': ps, 'pos': pos});
    }
  }
  matchedSegments.sort(function (a, b) {
    if (a.pos === b.pos) {
      return b.s.length - a.s.length;
    } else {
      return a.pos - b.pos;
    }
  });
  var reducedSegments = [];
  for (var i = 0, l = matchedSegments.length; i < l; i++) {
    var ms = matchedSegments[i];
    if (text.indexOf(ms.s) >= 0) {
      text = text.replace(new RegExp(ms.s, 'g'), ' ');
      text = text.replace(/(^\s+)|(\s+$)/g, '');
      text = text.replace(/\s+/g, ' ');
      reducedSegments.push(ms.s);
    }
  }
  if (text) {
    var remaining = text.split(' ');
    for (var i = 0, l = remaining.length; i < l; i++) {
      var r = remaining[i].replace(/(^\s+)|(\s+$)/g, '');
      if (r) {
        if (reducedSegments.indexOf(r) === -1) {
          reducedSegments.push(r);
        }
      }
    }
  }
  return reducedSegments;
};

Segmenter.prototype.getSeqSegments = function (text) {
  if (typeof text !== 'string') {
    return text;
  }
  var seqSegments = {'alphaDigit': [], 'cjk': []};
  
  text = cleanUp(text);
  var alphaDigitPattern = /^[a-z0-9]+/g;
  var pieces = [];
  var matches;

  while (text.length > 0) {
    if (text.match(alphaDigitPattern) !== null) {
      matches = text.match(alphaDigitPattern);
      pieces.push({'content': matches[0], 'type': 'alphaDigit'});
      text = text.replace(matches[0], '');
    } else {
      pieces.push({'content': text[0], 'type': 'cjk'});
      text = text.replace(text[0], '');
    }
    text = text.replace(/(^\s+)|(\s+$)/g, '');
  }
  for (var i = 0, l = pieces.length; i < l; i++) {
    for (var j = i + 1; j <= l; j++) {
      var slices = pieces.slice(i, j);
      var seg = '';
      if (slices[0].type === 'alphaDigit') {
        seg = slices[0].content;
        if (seg) {
          seqSegments.alphaDigit.push(seg);
        }
        j = l + 1;
      } else {
        for (var k = 0, slicesLen = slices.length; k < slicesLen; k++) {
          seg += slices[k].content;
        }
        if (seg) {
          seqSegments.cjk.push(seg);
        }
      }
    }
  }
  return seqSegments;
};

function cleanUp(text) {
  if (typeof text !== 'string') {
    return text;
  }
  text = text.toLowerCase();
  text = text.replace(/[　《》？！（）／－，、。＋＃：；＝％“‘’]/g, ' ');
  text = text.replace(/[\<\>\?\!\^\(\)\[\]\{\}\\\/\|\-\,\.\+\$#:;=%'"]/g, ' ');
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/(^\s+)|(\s+$)/g, '');
  text = text.replace(/[ãáâàä]/g, 'a');
  text = text.replace(/ç/g, 'c');
  text = text.replace(/[êé]/g, 'e');
  text = text.replace(/í/g, 'i');
  text = text.replace(/[õóô]/g, 'o');
  text = text.replace(/ú/g, 'u');
  return text;
}