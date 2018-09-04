var through = require('through2');

/**
  Create a stream which omits any records which are enumerated in the blacklist.

  This stream is intended for use with objects created with: https://github.com/pelias/model
**/
function stream( blacklist ){
  return through.obj( function( model, _, next ){
    if( 'object' === typeof model && 'function' === typeof model.getGid ){
      if( blacklist.hasOwnProperty( model.getGid() ) ){
        return next();
      }
    }
    this.push( model );
    next();
  });
}

module.exports = stream;