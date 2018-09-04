const stream = require('../stream');

module.exports.tests = {};

module.exports.tests.stream = function(test, common) {

  // empty blacklist is a no-op
  test('stream: empty blacklist', function(t) {

    const s = stream({});
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 3 );
    t.end();
  });

  // filter out records which match GIDs in the blacklist
  test('stream: valid blacklist', function(t) {

    const s = stream({
      'source2:layer2:2': undefined,
      'source1:layer1:1': undefined
    });
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 1 );
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('stream: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};