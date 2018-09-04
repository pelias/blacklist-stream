var fs = require('fs');

function load( filename ){

  // path not specified / file does not exist
  try {
    if( !fs.lstatSync(filename).isFile() ){
      throw new Error( 'invalid file' );
    }
  } catch(e){
    throw new Error( 'file not found' );
  }

  // parse GID file
  return parse( fs.readFileSync( filename, 'utf8' ) );
}

function parse( contents ){
  var lines = contents.split('\n')
                 .map( line => line.split('#').map( e => e.trim() ) )       // split on comment
                 .filter( line => line.length && line[0].length > 0 );      // remove empty lines

  // create a map where the key is the GID and the value is the comment
  var map = {};
  lines.forEach( line => map[ line[0] ] = line[1] );
  return map;
}

module.exports = load;
module.exports.parse = parse;