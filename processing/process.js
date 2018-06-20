var all = require( './allJobTitles' );

var _ = require( 'lodash' );

var first = [];
var last = [];
var stop = [];

var addToArray = function ( arr, itemUpper )
{
	item = itemUpper.toLowerCase();
	if ( item == itemUpper )
	{
		stop.push( item );
		stop = _.uniq( stop );
	}
	if ( item.length < 2 ) return;
	if ( ! arr.includes( item ) )
	{
		arr.push( item );
	}
};

var processTitle = function ( title )
{
	// var words = _.words( title, /[^, ]+/g );
	var words = _.words( title );
	var lastWord = words.pop();
	addToArray( last, lastWord );
	_.each( words, w =>
	{
		addToArray( first, w );
	});
};

_.each( all, title => 
{
	var split = title.split( '(' );
	if ( split.length > 1 )
	{
		var shortTitle = split[ 1 ].replace( ')', '' );
		var secondary = shortTitle.split( ',' );
		processTitle( secondary[ 0 ] );
		title = title.replace( ' (' + shortTitle + ')', '' );
	}
	var secondary2 = title.split( ',' );
	processTitle( secondary2[ 0 ] );
});
first.sort();
last.sort();

console.log( '-- first ----------------------------------------' );
console.log( JSON.stringify( first, null, '\t' ) );
console.log( '-- last ----------------------------------------' );
console.log( JSON.stringify( last, null, '\t' ) );
console.log( '-- stop ----------------------------------------' );
console.log( JSON.stringify( stop.sort(), null, '\t' ) );