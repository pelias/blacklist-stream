const through = require('through2');
const stream = require('./stream');
const loader = require('./loader');

function blacklistStream( blacklist ){

  // blacklist was explicitely provided
  if( 'object' === typeof blacklist ){

    // blacklist is empty, return a no-op passthrough stream
    if( Object.keys( blacklist ).length === 0 ){
      return through.obj();
    }

    // return a blacklist stream based off user supplied blacklist
    return stream( blacklist );
  }

  // no blacklist was provided via function arguments

  // attempt to load the blacklist data from the pelias config file
  blacklist = loader();

  // blacklist is empty, return a no-op passthrough stream
  if( Object.keys( blacklist ).length === 0 ){
    return through.obj();
  }

  // return a blacklist stream based off files specified in pelias-config
  return stream( blacklist );
}

module.exports = blacklistStream;