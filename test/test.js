var jtr = require( '../index' );
// jtr.debug = true;
var _ = require( 'lodash' );
var strings = require( './test-strings' );

console.log( '-- 13 job titles ---------------------------------' );
var titles = jtr.find( strings.txt, { capitalized : true } );
console.log( titles.length + ' titles found out of 13 (there are lot of false positives)' );
console.log( _.map( titles, 'title' ) );
console.log( '--------------------------------------------------' );
console.log( '\n' );