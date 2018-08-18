// ======================= Extension Config Script ===========================
// Synposis:
//
// mixin( "https://www.yoururl.de", () => { Your code here... } );
// redir( /regex/, 'substitution with references $1, $2, ...' );
//
// Helpers:
// - https://www.regextester.com/
//
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
mixin( "https://www.amazon.de/", () =>
{
	const asin = (location.href.match( /\/dp\/([^\/]+)/ )  ||  ['', null])[1];
	if( !asin ) return;

	fetch( 'https://www.goodreads.com/book/isbn?isbn=' + asin )
	.then( resp => resp.text() )  // sic!
	.then( text =>
	{
		const url  = (text.match( /rel="canonical" href="([^"]+)/    )  ||  ['', '#'         ])[1];
		const sumy = (text.match( /(\d+ ratings* and \d+ reviews*)/  )  ||  ['', 'no ratings'])[1];
		const rstr = (text.match( /itemprop="ratingValue">([0-9.]+)/ )  ||  ['', '0'         ])[1];
		const rint = Math.round( parseFloat( rstr ) );

		const rhtm = '<span style="color:red">'
		           + '<span style="font-size:20px;letter-spacing:-2px">'
		           + '&#9733;'.repeat(   rint )
		           + '&#9734;'.repeat( 5-rint )
		           + '</span> ' + rstr
		           + '</span>';

		const amzDiv     = document.getElementById( 'cmrsSummary_feature_div' );
		const ourDiv     = document.createElement( 'div' );
		ourDiv.innerHTML = rhtm + ' &nbsp;&nbsp;&nbsp; <a href="' + url + '">' + sumy + '</a>';

		// Amazon loads stars async and replaces whole cmrsSummary div, thus:
		amzDiv.parentNode.insertBefore( ourDiv, amzDiv.nextSibling );
	});
}, { runAsContentScript: true });  // CORS policy



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


