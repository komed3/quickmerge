const { Path } = require( '../dist/index.cjs' );

const path = new Path();

const compiledPath = path.compile( 'user.name' );
console.log( compiledPath );

const compiledPath2 = path.compile( 'a[0].b[1][2].c' );
console.log( compiledPath2 );
