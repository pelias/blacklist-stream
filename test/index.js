const fs = require('fs');
const index = require('../index');

module.exports.tests = {};

module.exports.tests.stream = function(test, common) {

  // empty blacklist is a no-op
  test('stream: empty blacklist', function(t) {

    const s = index({});
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 3 );
    t.end();
  });

  // filter out records which match GIDs in the blacklist
  test('stream: blacklist via arguments', function(t) {

    const s = index({
      'source2:layer2:2': undefined,
      'source1:layer1:1': undefined
    });
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 1 );
    t.end();
  });

  // pelias config missing imports property
  test('stream: pelias config missing imports property', function(t) {

    // write a temporary config for testing
    fs.writeFileSync('/tmp/tmp-pelias-config1.json', `{}`);
    process.env.PELIAS_CONFIG = '/tmp/tmp-pelias-config1.json';

    const s = index();
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 3 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });

  // pelias config imports.blacklist.files property not an array
  test('stream: pelias config imports.blacklist.files property not an array', function(t) {

    // write a temporary config for testing
    fs.writeFileSync('/tmp/tmp-pelias-config2.json', `{ "imports": { "blacklist": { "files": "foo" } } }`);
    process.env.PELIAS_CONFIG = '/tmp/tmp-pelias-config2.json';

    const s = index();
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 3 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });

  // pelias config imports.blacklist.files property empty
  test('stream: pelias config imports.blacklist.files property empty', function(t) {

    // write a temporary config for testing
    fs.writeFileSync('/tmp/tmp-pelias-config3.json', `{ "imports": { "blacklist": { "files": [] } } }`);
    process.env.PELIAS_CONFIG = '/tmp/tmp-pelias-config3.json';

    const s = index();
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 3 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });

  // pelias config imports.blacklist.files contains valid files
  test('stream: pelias config imports.blacklist.files property empty', function(t) {

    // write a temporary files for testing
    fs.writeFileSync('/tmp/tmp-pelias-blacklist1', `source1:layer1:1`);
    fs.writeFileSync('/tmp/tmp-pelias-blacklist2', `source2:layer2:2`);
    fs.writeFileSync('/tmp/tmp-pelias-config4.json', `{
      "imports": { "blacklist": { "files": [
        "/tmp/tmp-pelias-blacklist1",
        "/tmp/tmp-pelias-blacklist2"
      ] }}
    }`);
    process.env.PELIAS_CONFIG = '/tmp/tmp-pelias-config4.json';

    const s = index();
    const c = common.countStream();
    s.pipe(c);

    common.fixtures().forEach( f => s.write( f ) );
    t.equals( c.total(), 1 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('index: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};