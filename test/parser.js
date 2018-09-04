const parser = require('../parser');

module.exports.tests = {};

module.exports.tests.load = function(test, common) {
  test('load: invalid file', function(t) {
    t.throws(() => parser('/invalid/path'), /file not found/, 'invalid file');
    t.throws(() => parser('/tmp'), /file not found/, 'directory');
    t.end();
  });
};

module.exports.tests.parse = function(test, common) {
  test('empty file', function(t) {
    t.deepEqual( parser.parse(``), {} );
    t.end();
  });
  test('comments and newlines', function(t) {
    t.deepEqual( parser.parse(`

# foo bar

# baz

`), {} );
    t.end();
  });
  test('without comments', function(t) {
    t.deepEqual( parser.parse(`

source1:layer1:id1

 source2:layer2:id2
source3:layer3:id3
`), {
      'source1:layer1:id1': undefined,
      'source2:layer2:id2': undefined,
      'source3:layer3:id3': undefined
    } );
    t.end();
  });
  test('with comments', function(t) {
    t.deepEqual( parser.parse(`

source1:layer1:id1 # example1

 source2:layer2:id2
source3:layer3:id3 # example3
`), {
      'source1:layer1:id1': 'example1',
      'source2:layer2:id2': undefined,
      'source3:layer3:id3': 'example3'
    } );
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('parser: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
