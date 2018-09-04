const tape = require('tape');
const through = require('through2');
const Document = require('pelias-model').Document;

const common = {
  // static test fixtures
  fixtures: function(){
    return [
      new Document( 'source1', 'layer1', 1 ),
      new Document( 'source2', 'layer2', 2 ),
      new Document( 'source3', 'layer3', 3 ),
    ];
  },
  // convenience stream to count how many records it has seen
  countStream: function(){
    var count = 0;
    var s = through.obj((chunk, _, next ) => { count++; next( null, chunk ); });
    s.total = function(){ return count; };
    return s;
  }
};

const tests = [
  require('./parser.js'),
  require('./stream.js'),
  require('./index.js'),
];

tests.map(function(t) {
  t.all(tape, common);
});
