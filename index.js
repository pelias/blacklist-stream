const config = require('pelias-config');
const through = require('through2');
const stream = require('./stream');
const parser = require('./parser');

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

  // check pelias-config for a list of blacklist files to load
  const settings = config.generate();

  // config does not contain the relevant properties
  // return a no-op passthrough stream
  if( !settings.imports || !settings.imports.blacklist ){
    return through.obj();
  }

  // config does not contain a valid list of files
  // return a no-op passthrough stream
  const bl = settings.imports.blacklist;
  if( !Array.isArray( bl.files ) || bl.files.length === 0 ){
    return through.obj();
  }

  // load the blacklist files
  // note: this throws an exception if a file is not found
  const blacklists = bl.files.map( filename => parser( filename ) );

  // merge all the blacklists togther
  var merged = {};
  blacklists.forEach( b => { for( var k in b ){ merged[k] = b[k]; } } );

  // blacklist is empty, return a no-op passthrough stream
  if( Object.keys( merged ).length === 0 ){
    return through.obj();
  }

  // return a blacklist stream based off files specified in pelias-config
  return stream( merged );
}

module.exports = blacklistStream;