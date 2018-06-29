var all = require( '../lib/allJobTitles' );

var _ = require( 'lodash' );
var pos = require( 'pos' );

var primary = [];
var modifier = [];
var single = [];
var stop = [];

var addToArray = function ( arr, itemUpper )
{
	item = itemUpper.toLowerCase();
	if ( item == itemUpper )
	{
		if ( ! stop.includes( item ) && item.search( /^[A-z]+$/ ) > -1 )
		{
			stop.push( item );
			// console.log( '.', item );
		}
		return;
	} else if ( itemUpper == itemUpper.toUpperCase() ) {
		// this is likely an abbreviation for a title
		if ( item.length > 1 && ! primary.includes( item ) )
		{
			primary.push( item );
			// console.log( '*', item );
		}
		return;
	}
	if ( item.length < 2 ) return;
	if ( ! arr.includes( item ) )
	{
		arr.push( item );
		if ( arr == primary )
		{
			// console.log( '*', item );
		} else {
			// console.log( '-', item );
		}
	}
};

var processTitle = function ( title )
{
	var titleWords = _.words( title );
	if ( titleWords.length == 1 && ! single.includes( title.toLowerCase() ) )
	{
		single.push( title.toLowerCase() );
	}
	var words = new pos.Lexer().lex( titleWords.join( ' ' ) );
	var tagger = new pos.Tagger();
	var taggedWords = tagger.tag( words );
	_.each( taggedWords, w =>
	{
		if ( w[ 1 ] == 'NNP' )
		{
			addToArray( primary, w[ 0 ] );
		} else {
			addToArray( modifier, w[ 0 ] );
		}
	});
};

_.each( all, title => 
{
	var split = title.split( '(' );
	if ( split.length > 1 )
	{
		var shortTitle = split[ 1 ].replace( ')', '' );
		var abbrevAndSecondary = shortTitle.split( ',' );
		processTitle( abbrevAndSecondary[ 0 ] );
		title = title.replace( ' (' + shortTitle + ')', '' );
	}
	var titleAndSecondary = title.split( ',' );
	processTitle( titleAndSecondary[ 0 ] );
});
primary.sort();
modifier.sort();
single.sort();
stop.sort();

console.log( '-- primary -------------------------------------' );
console.log( JSON.stringify( primary, null, '\t' ) );
console.log( '-- modifier ------------------------------------' );
console.log( JSON.stringify( modifier, null, '\t' ) );
console.log( '-- single --------------------------------------' );
console.log( JSON.stringify( single, null, '\t' ) );
console.log( '-- stop ----------------------------------------' );
console.log( JSON.stringify( stop, null, '\t' ) );