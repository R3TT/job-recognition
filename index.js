var parts = require( './lib/parts' );
var ends = require( './lib/ends' );
var stops = require( './lib/stopWords' );

var _ = require( 'lodash' );

jtr = {};
jtr.debug = false;

jtr.find = function ( txt, config )
{
	var requireCapitalized = _.get( config, 'capitalized' );
	var jobTitles = [];
	var splits = jtr.splitOnCommonDivisions( txt );
	_.each( splits, ( split, splitIdx ) =>
	{
		// find last names then walk backwards
		var wordStack = [];
		var end = false;

		var walkWordStackBackwards = function ()
		{
			var title = [];
			var stackSize = wordStack.length;
			for ( var ii = 0; ii < stackSize; ii++ )
			{
				var part = wordStack.pop();
				var p = part.toLowerCase();
				if ( jtr.debug ) console.log( '-', p );
				if ( ends.includes( p ) || parts.includes( p ) )
				{
					title.unshift( part );
				} else {
					// walk forward again removing any stop words
					break;
				}
			}
			for ( var jj = 0; jj < title.length; jj++ )
			{
				part = title[ jj ];
				p = part.toLowerCase();
				if ( jtr.debug ) console.log( '==', part );
				if ( stops.includes( p ) )
				{
					if ( jtr.debug ) console.log( 'XX' );
					title.shift();
					jj--;
				} else {
					break;
				}
			}
			wordStack = [];
			var titleString = title.join( ' ' );
			if ( jtr.debug ) console.log( '***', titleString );
			var capitalized = jtr.isCapitalized( title , stops );
			if ( ! requireCapitalized || capitalized )
			{
				jobTitles.push(
				{
					title: titleString,
					titleLowerCase: titleString.toLowerCase(),
					capitalized: capitalized
				});
			}
		};

		if ( jtr.debug ) console.log( '||', split );
		split = split.replace( /&/g, 'and' );
		var words = jtr.words( split );
		_.each( words, ( word, wordIdx ) =>
		{
			var w = word.toLowerCase();
			if ( jtr.debug ) console.log( w );
			if ( ends.includes( w ) )
			{
				end = true;
				wordStack.push( word );
				if ( jtr.debug ) console.log( '!', w );
			} else {
				if ( end )
				{
					// walk back up the stack
					walkWordStackBackwards();
					wordStack.push( word );
				} else {
					wordStack.push( word );
				}
				end = false;
			}
		});
		if ( end && wordStack.length > 0 )
		{
			walkWordStackBackwards();
		}
	});
	return jobTitles;
};

jtr.splitOnCommonDivisions = function ( txt )
{
	return txt.match( /[^\n\r,.?!]+/g );
};

jtr.words = function ( txt )
{

	return _.words( txt, /[^\/, ]+/g );
};

jtr.isCapitalized = function ( w, ignore )
{
	if ( _.isArray( w ) )
	{
		var capitalized = true;
		_.each( w, p =>
		{
			if ( ! jtr.isCapitalized( p, ignore ) )
			{
				capitalized = false;
				return false;
			}
		});
		return capitalized;
	} else {
		if ( ignore && ignore.includes( w.toLowerCase() ) ) return true;
		return ( w.charAt( 0 ).toUpperCase() == w.charAt( 0 ) );
	}
};

module.exports = jtr;