// ======================= Extension Config Script ===========================
// Synposis:
//
//   mixin( url, code [, opts] );
//
//     Param:   Type:             Examples etc:
//     -------  ----------------  ----------------------------------------
//     url      string            "https://www.yoururl.de" (startsWith)
//              string[]          [ "http://ex1.com", "http://ex2.de" ]
//     code     function          ()=>{ Your Javascript Code... }
//              template literal  ` #yourCssSelector { Attr: "string" } `
//                                NOTE: Backticks for multiline strings!
//     opts     Object            Properties:
//                                runAsContentScript   Type: bool   false
//
//
//   redir( expr, repl );
//
//     Param:   Type:             Examples etc:
//     -------  ----------------  ----------------------------------------
//     expr     RegExp            URL to be matched: /https:\/\/www.../
//     repl     string            with $1, $2 capture group references
//
//
// Helpers:
//
//   https://www.regextester.com/
// ===========================================================================



//
//  GOODREADS.COM 
//
redir( /(https:\/\/www\.goodreads\.com\/review\/list\/[^?]+)(?=(?:.*[?&](page=\d+))?)(?=(?:.*[?&](shelf=[^&]+))?)(.*)/,
	'$1?per_page=100&sort=rating&order=d&view=covers&$2&$3' );  // Shelf view settings

redir( /(https:\/\/www\.goodreads\.com\/work\/editions\/[^\?]*)\?*(.*)/,
	'$1?expanded=true&$2&per_page=100' );  // "All editions" view settings



//
//  WORDPRESS.COM
//
redir( /https:\/\/wordpress.com\/post\/([^\/]+)\/([0-9]+)/,
	'https://$1/wp-admin/post.php?post=$2&action=edit' );  // Old editor




//////////////////////////////////////////////////////////////////////////////
//
//  AMAZON.DE WITH GOODREADS.COM RATINGS:
//
//  Replaces Rubén Martínez's "Goodreads Ratings for Amazon" extension.
//
mixin( "https://www.amazon.de/", () =>
{
	const asin = (location.href.match( /\/(dp|gp\/product)\/([^\/]+)/ )  ||  ['', '', ''])[2];
	if( asin.length == 0 ) return;

	fetch( 'https://www.goodreads.com/book/isbn?isbn=' + asin )
	.then( resp => resp.text() )  // sic!
	.then( text =>
	{
		const url  = (text.match( /link href='([^']+)' rel='canonical'/    ) ||  ['', '#'])[1];
		const nrat = (text.match( /itemprop="ratingCount" content="([0-9.]+)"/ ) ||  ['', '0'])[1];
		const nrev = (text.match( /itemprop="reviewCount" content="([0-9.]+)"/ ) ||  ['', '0'])[1];
		const rstr = (text.match( /itemprop="ratingValue">\s*([0-9.]+)/    ) ||  ['', '0'])[1];
		const rint = Math.round( parseFloat( rstr ) );  // unxss() would encode the decimal separator
		
		const rhtm = '<span style="color:red">'
		           + '<span style="font-size:20px;letter-spacing:-2px">'
		           + '&starf;'.repeat(   rint )
		           + '&star;' .repeat( 5-rint )
		           + '</span> ' + unxss( rstr )
		           + '</span>';
		
		const amzDiv     = document.getElementById( 'cmrsSummary_feature_div' );
		const ourDiv     = document.createElement( 'div' );
		ourDiv.innerHTML = rhtm + ' &nbsp;&nbsp;&nbsp; <a href="' 
		                 + unxss( url  ) + '">' 
		                 + unxss( nrat + " ratings and " + nrev + " reviews" ) + '</a>';
		
		// Amazon loads stars async and replaces whole cmrsSummary div, thus:
		amzDiv.parentNode.insertBefore( ourDiv, amzDiv.nextSibling );
	});
}, { runAsContentScript: true });



//
//  MISC
//
mixin( "https://www.commafeed.com", 
`
	#toolbar-mark-read a.btn
	{
		width: 150px;
	}
`);


mixin( "https://yalebooks.yale.edu", () =>
{
	const div = document.querySelector( "#block-views-discipline-books-featured-areas" );
	if( div )
		div.remove();
});



