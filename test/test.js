var nr = require( '../index' );
var _ = require( 'lodash' );
var strings = require( './test-strings' );

console.log( '-- 24 job titles ---------------------------------' );
var titles = nr.find( strings.txt, { capitalized : true } );
console.log( titles.length + ' titles found out of 24 (there are several false positives)' );
console.log( _.map( titles, 'title' ) );
console.log( '--------------------------------------------------' );
console.log( '\n' );