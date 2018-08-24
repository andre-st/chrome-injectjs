// ======================= Extension Config Script ===========================
// Synposis:
//
//   mixin( url, code [, opts] );
//
//     url      Type: String      "https://www.yoururl.de" (startsWith)
//     code     Type: Function    () => { Your Code... }
//     opts     Type: Object      Properties: 
//                                runAsContentScript    Type: Boolean    false
//
//   redir( expr, repl );
//
//     expr     Type: RegExp      URL to be matched: /https:\/\/www.../
//     repl     Type: String      with $1, $2 capture group references
//
//
// Helpers:
//
//   https://www.regextester.com/
// ===========================================================================



//
//  GOODREADS SHELVES VIEW-SETTINGS: 
//
redir( /(https:\/\/www\.goodreads\.com\/review\/list\/[^?]+)(?=(?:.*[?&](page=\d+))?)(?=(?:.*[?&](shelf=[^&]+))?)(.*)/,
		'$1?per_page=100&sort=rating&order=d&view=covers&$2&$3' );


//
//  GOODREADS 'ALL EDITIONS' VIEW-SETTINGS: 
//
redir( /(https:\/\/www\.goodreads\.com\/work\/editions\/[^\?]*)\?*(.*)/,
		'$1?expanded=true&$2&per_page=100' );


//
//  AMAZON.DE WITH GOODREADS.COM RATINGS:
//
//  - replaces Rubén Martínez's "Goodreads Ratings for Amazon" extension
//
mixin( "https://www.amazon.de/", () =>
{
	const asin = unxss( (location.href.match( /\/dp\/([^\/]+)/ )  ||  ['', ''])[1] );
	if( asin.length == 0 ) return;

	fetch( 'https://www.goodreads.com/book/isbn?isbn=' + asin )
	.then( resp => resp.text() )  // sic!
	.then( text =>
	{
		const url  = unxss( (text.match( /rel="canonical" href="([^"]+)/         )  ||  ['', '#'         ])[1] );
		const sumy = unxss( (text.match( /([\d,]+ ratings* and [\d,]+ reviews*)/ )  ||  ['', 'no ratings'])[1] );
		const rstr =        (text.match( /itemprop="ratingValue">([0-9.]+)/      )  ||  ['', '0'         ])[1]  ;
		const rint = Math.round( parseFloat( rstr ) );  // unxss() would encode decimal separator
		
		const rhtm = '<span style="color:red">'
		           + '<span style="font-size:20px;letter-spacing:-2px">'
		           + '&#9733;'.repeat(   rint )
		           + '&#9734;'.repeat( 5-rint )
		           + '</span> ' + unxss( rstr )
		           + '</span>';
		
		const amzDiv     = document.getElementById( 'cmrsSummary_feature_div' );
		const ourDiv     = document.createElement( 'div' );
		ourDiv.innerHTML = rhtm + ' &nbsp;&nbsp;&nbsp; <a href="' + url + '">' + sumy + '</a>';
		
		// Amazon loads stars async and replaces whole cmrsSummary div, thus:
		amzDiv.parentNode.insertBefore( ourDiv, amzDiv.nextSibling );
	});
}, { runAsContentScript: true });



//
//  MISC
//
mixin( "https://www.commafeed.com", () =>
{
	document.querySelector( "#toolbar-mark-read a.btn" ).style.width = "150px";
});


mixin( "https://yalebooks.yale.edu", () =>
{
	const div = document.querySelector( "#block-views-discipline-books-featured-areas" );
	if( div )
		div.remove();
});


