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
  var matchedSegmentsObj = {};
  for (var i = 0, l = pendingSegments.length; i < l; i++) {
    var ps = pendingSegments[i];
    var re = new RegExp(ps, 'g');
    while ((theMatch = re.exec(text)) !== null) {
      var pos = theMatch.index;
      if (matchedSegmentsObj[pos]) {
        if (matchedSegmentsObj[pos].length < ps.length) {
          matchedSegmentsObj[pos] = ps;
        }
      } else {
        matchedSegmentsObj[pos] = ps;
      }
    }
  }
  var matchedSegments = [];
  for (var i in matchedSegmentsObj) {
    matchedSegments.push({'s': matchedSegmentsObj[i], 'pos': parseInt(i, 10)});
  }
  matchedSegments.sort(function (a, b) {
    if (a.pos === b.pos) {
      return b.s.length - a.s.length;
    } else {
      return a.pos - b.pos;
    }
  });
  var cleanedSegments = [];
  var end = 0;
  if (matchedSegments[0]) {
    end = matchedSegments[0].s.length;
    cleanedSegments.push(matchedSegments[0]);
  }
  for (var i = 1, l = matchedSegments.length; i < l; i++) {
    var m = matchedSegments[i];
    if (m.pos >= end) {
      cleanedSegments.push(m);
      end = m.pos + m.s.length;
    }
  }
  var reducedSegments = [];
  for (var i = 0, l = cleanedSegments.length; i < l; i++) {
    var cs = cleanedSegments[i];
    var re = new RegExp(cs.s);
    if (text.match(re) !== null) {
      text = text.replace(re, '');
      text = text.replace(/(^\s+)|(\s+$)/g, '');
      text = text.replace(/\s+/g, ' ');
      reducedSegments.push(cs.s);
    }
  }
  reducedSegments = reducedSegments.filter(function (val, idx, self) {
    return self.indexOf(val) === idx;
  });
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
