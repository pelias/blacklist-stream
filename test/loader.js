const fs = require('fs');
const loader = require('../loader');

module.exports.tests = {};

module.exports.tests.loader = function(test, common) {

  // pelias config missing imports property
  test('pelias config missing imports property', function(t) {

    // write a temporary config for testing
    fs.writeFileSync('/tmp/tmp-pelias-config1.json', `{}`);
    process.env.PELIAS_CONFIG = '/tmp/tmp-pelias-config1.json';

    const blacklist = loader();
    t.equals( Object.keys( blacklist ).length, 0 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });

  // pelias config imports.blacklist.files property not an array
  test('pelias config imports.blacklist.files property not an array', function(t) {

    // write a temporary config for testing
    fs.writeFileSync('/tmp/tmp-pelias-config2.json', `{ "imports": { "blacklist": { "files": "foo" } } }`);
    process.env.PELIAS_CONFIG = '/tmp/tmp-pelias-config2.json';

    const blacklist = loader();
    t.equals( Object.keys( blacklist ).length, 0 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });

  // pelias config imports.blacklist.files property empty
  test('pelias config imports.blacklist.files property empty', function(t) {

    // write a temporary config for testing
    fs.writeFileSync('/tmp/tmp-pelias-config3.json', `{ "imports": { "blacklist": { "files": [] } } }`);
    process.env.PELIAS_CONFIG = '/tmp/tmp-pelias-config3.json';

    const blacklist = loader();
    t.equals( Object.keys( blacklist ).length, 0 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });

  // pelias config imports.blacklist.files contains valid files
  test('pelias config imports.blacklist.files property empty', function(t) {

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

    const blacklist = loader();
    t.equals( Object.keys( blacklist ).length, 2 );
    t.end();

    // clean up
    delete process.env.PELIAS_CONFIG;
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('loader: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};