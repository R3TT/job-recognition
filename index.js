var primary = require( './lib/primary' );
var single = require( './lib/single' );
var modifier = require( './lib/modifier' );
var stops = require( './lib/stops' );

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
		if ( jtr.debug ) console.log( '===', split );
		var wordStack = [];
		var title = [];

		var stripStopsOffEndAndStart = function ()
		{
			var titleLength = title.length;
			for ( var ii = 0; ii < titleLength; ii++ )
			{
				var t = title.pop();
				if ( ! stops.includes( t.toLowerCase() ) )
				{
					title.push( t );
					break;
				}
			}
			var titleLength = title.length;
			for ( var ii = 0; ii < titleLength; ii++ )
			{
				var t = title.shift();
				if ( ! stops.includes( t.toLowerCase() ) )
				{
					title.unshift( t );
					break;
				}
			}
		};

		var addWordsToStart = function ()
		{
			var stackSize = wordStack.length;
			for ( var ii = 0; ii < stackSize; ii++ )
			{
				var stackWord = wordStack.pop();
				var sw = stackWord.toLowerCase();
				if ( modifier.includes( sw ) )
				{
					title.unshift( stackWord );
				} else if ( stops.includes( sw ) ) {
					title.unshift( stackWord );
				} else {
					break;
				}
			}
		};

		var finalizeTitle = function ()
		{
			if ( jtr.debug ) console.log( '1 -', title );
			addWordsToStart();
			if ( jtr.debug ) console.log( '2 -', title );
			stripStopsOffEndAndStart();
			if ( jtr.debug ) console.log( '3 -', title );
			var titleString = title.join( ' ' );
			if ( ( title.length == 1 && ! single.includes( titleString.toLowerCase() ) ) || title.length == 0 )
			{
				wordStack = [];
				primaryFound = [];
				endFound = false;
				title = [];
				return;
			}
			if ( jtr.debug ) console.log( '***', titleString );
			var capitalized = jtr.isCapitalized( title, stops );
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

		var primaryFound = false;
		var endFound = false;
		split = split.replace( /&/g, 'and' );
		var words = jtr.words( split );
		_.each( words, ( word, wordIdx ) =>
		{
			var w = word.toLowerCase();
			if ( jtr.debug ) console.log( w );
			if ( ! primaryFound )
			{
				if ( primary.includes( w ) )
				{
					primaryFound = true;
					if ( jtr.debug ) console.log( '+', w );
					title.push( word );
				} else {
					wordStack.push( word );
				}
			} else {
				if ( ! endFound )
				{
					if ( modifier.includes( w ) )
					{
						if ( jtr.debug ) console.log( '~', w );
						title.push( word );
					} else if ( stops.includes( w ) ) {
						if ( jtr.debug ) console.log( '.', w );
						title.push( word );
					} else if ( primary.includes( w ) ) {
						if ( jtr.debug ) console.log( '+', w );
						title.push( word );
					} else {
						endFound = true;
						finalizeTitle();
					}
				}
			}
		});
		if ( ! endFound && title.length > 0 )
		{
			finalizeTitle();
		} else {
			if ( jtr.debug ) console.log( '???', title, endFound, wordStack );
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