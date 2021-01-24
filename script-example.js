// ============================================ Extension Config Script ================================================
// Synposis:
//
//   mixin( url, code [, opts: Object] );
//
//       URL example:                              x  Code example:                   x  Opts example:
//       ----------------------------------------     ------------------------------     -------------------------------
//       "https://www.url1.de"                        ()=>{ ... }                        { runAsContentScript: false }
//       [ "http://url1.com", "http://url2.com" ]     ` #selector { attr: "val" }`
//
//
//
//   redir( url: RegExp, newUrl: String );
//
//       URL example:                                 newUrl example:
//       -------------------------------------------  ------------------------------------------------------------------
//       /https:\/\/www\.url1\.de/                    "https://example.com"
//       /(https:\/\/www\.url1\.de)/                  "$1?language=de"         ($1, $2, $n are capture group references)
//
//
//
//   chrome.runtime.sendMessage( request, response => { ... });
//
//       Request:                                        Response:          Comment:
//       ----------------------------------------------  -----------------  --------------------------------------------
//       { contentScriptQuery: "fetch", url: "..." }     string             HTML text of the given resource
//
//       NOTE: option runAsContentScript has be true
//
//
//
// Examples and Helpers:
//   - https://github.com/andre-st/chrome-injectjs/blob/master/script-example.js
//   - https://www.regextester.com/
//
// =====================================================================================================================



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
	
	chrome.runtime.sendMessage({ contentScriptQuery: "fetch", url: 'https://www.goodreads.com/book/isbn?isbn=' + asin }, text =>
	{
		const url  = (text.match( /link href='([^']+)' rel='canonical'/        ) ||  ['', '#'])[1];
		const nrat = (text.match( /itemprop="ratingCount" content="([0-9.]+)"/ ) ||  ['', '0'])[1];
		const nrev = (text.match( /itemprop="reviewCount" content="([0-9.]+)"/ ) ||  ['', '0'])[1];
		const rstr = (text.match( /itemprop="ratingValue">\s*([0-9.]+)/        ) ||  ['', '0'])[1];
		const rint = Math.round( parseFloat( rstr ) );  // unxss() would encode the decimal separator
		
		const rhtm = '<span style="color:red">'
		           + '<span style="font-size:20px;letter-spacing:-2px">'
		           + '&starf;'.repeat(   rint )
		           + '&star;' .repeat( 5-rint )
		           + '</span> ' + unxss( rstr )
		           + '</span>';
		
		const amzDiv     = document.getElementById( 'averageCustomerReviews' );
		const ourDiv     = document.createElement( 'div' );
		ourDiv.innerHTML = rhtm + ' &nbsp;&nbsp;&nbsp; <a href="' 
		                 + unxss( url  ) + '">' 
		                 + unxss( nrat + " ratings and " + nrev + " reviews" ) + '</a>';
		
		amzDiv.append( ourDiv, amzDiv.nextSibling );
	});
	
	
}, { runAsContentScript: true });




//////////////////////////////////////////////////////////////////////////////
//
//  Video sites etc should not notice invisible windows.
//  They use this to force (ad-)watching when I just want listen to videos.
//  
//  Replaces the "Disable Page Visibility API" extension
//  
mixin( "https://www.servustv.com", () =>
{
	document.addEventListener( "visibilitychange", function( e ) 
	{
		e.stopImmediatePropagation();
		
	}, true, true);
	
	Object.defineProperty( Document.prototype.wrappedJSObject, "hidden", 
	{
		get         : exportFunction( function hidden() { return false; }, window.wrappedJSObject ),
		enumerable  : true, 
		configurable: true
	});
	
	Object.defineProperty( Document.prototype.wrappedJSObject, "visibilityState", 
	{
		get         : exportFunction( function visibilityState() { return "visible"; }, window.wrappedJSObject ),
		enumerable  : true, 
		configurable: true
	});
});



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



