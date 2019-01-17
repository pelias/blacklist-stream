const config = require('pelias-config');
const parser = require('./parser');

// load the pelias config file and return a merged
// object containing the blacklist data.
function loader(){
  
  // check pelias-config for a list of blacklist files to load
  const settings = config.generate();

  // config does not contain the relevant properties
  // return a no-op passthrough stream
  if( !settings.imports || !settings.imports.blacklist ){
    return {};
  }

  // config does not contain a valid list of files
  // return a no-op passthrough stream
  const bl = settings.imports.blacklist;
  if( !Array.isArray( bl.files ) || bl.files.length === 0 ){
    return {};
  }

  // load the blacklist files
  // note: this throws an exception if a file is not found
  const blacklists = bl.files.map( filename => parser( filename ) );

  // merge all the blacklists togther
  var merged = {};
  blacklists.forEach( b => { for( var k in b ){ merged[k] = b[k]; } } );

  // blacklist is empty, return a no-op passthrough stream
  if( Object.keys( merged ).length === 0 ){
    return {};
  }

  return merged;
}

module.exports = loader;