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
//   getUrl( url, text => { ... });
//
//       NOTE: mixin-option runAsContentScript has to be true if used within mixin-code
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
//  AMAZON.DE WITH GOODREADS.COM RATINGS
//
//  Replaces Ruben Martinez's "Goodreads Ratings for Amazon" extension.
//
mixin( "https://www.amazon.", () =>
{
	// There are often e-book editions on Goodreads when there are no paper editions.
	// The e-book ASIN isn't similar to ISBN, as opposed to the paper book ASIN.
	
	const detailDiv    = document.getElementById( 'detailBullets_feature_div' );
	const isbn10       = detailDiv && (detailDiv.innerText.match( /ISBN-10.*?([0-9X\-]+)/   ) || ['', ''])[1];
	const isbn13       = detailDiv && (detailDiv.innerText.match( /ISBN-13.*?([0-9X\-]+)/   ) || ['', ''])[1];
	const ebookUrl     = document.querySelector( 'div:not(.celwidget) a[href*="ebook/dp/"]' );
	const ebookAsin    = ebookUrl && (ebookUrl.getAttribute( 'href' ).match( /dp\/([^\/]+)/ ) || ['', ''])[1];
	const titleLongTag = document.getElementById( 'productTitle' );                      // "Title: Subtitle (Publisher)" no GR search results
	const title        = titleLongTag ? titleLong.innerText.match( /^[^(:]+/ )[0] : '';  // "Title "
	const altGoodUrl   = 'https://www.goodreads.com/search?q=' + encodeURIComponent( title ) + '&search[field]=title';
	
	
	// The Goodreads search engine doesn't support the logical operator 'or',
	// and it doesn't try to get the ISBN-10 from ISBN-13 or vice versa. 
	// So we have to query ISBN-10, ISBN-13 and e-book ASIN individually.
	
	const queryUrls = [];
	if( isbn10    ) queryUrls.push( 'https://www.goodreads.com/book/isbn?isbn=' + isbn10    );
	if( isbn13    ) queryUrls.push( 'https://www.goodreads.com/book/isbn?isbn=' + isbn13    );
	if( ebookAsin ) queryUrls.push( 'https://www.goodreads.com/book/isbn?isbn=' + ebookAsin );
	if( queryUrls.length == 0 ) return;  // Not a book or poorly catalogued
	
	
	// Our area to display ratings:
	// Our default text is the initial state and also the last state if our queries fail!
	
	const amzLangElm = document.querySelector( '[data-language]' );  // May differ from the browser settings (for me)
	const amzLang    = amzLangElm && amzLangElm.getAttribute( 'data-language' ) || undefined;  // "de-DE"
	const amzDiv     = document.getElementById( 'averageCustomerReviews_feature_div' );
	const ourDiv     = document.createElement( 'div' );
	ourDiv.innerHTML = '<a href="' + altGoodUrl + '" style="color: #ec8c14; text-decoration: underline; font-weight: bold">Goodreads-Search</a>';
	amzDiv.append( ourDiv, amzDiv.nextSibling );
	
	
	// Concurrent Goodreads queries result in better response time for user:
	
	var _bestNumRatings = -1;  // GR book might exist but 0 ratings
	queryUrls.forEach( u => getUrl( u, text => 
	{
		const url     = (text.match( /meta content='([^']+)' property='og:url'/   ) || ['', '' ])[1];
		const  ratstr = (text.match( /itemprop="ratingValue">\s*([0-9.]+)/        ) || ['', '0'])[1];
		const nratstr = (text.match( /itemprop="ratingCount" content="([0-9.]+)"/ ) || ['', '0'])[1];
		const nrevstr = (text.match( /itemprop="reviewCount" content="([0-9.]+)"/ ) || ['', '0'])[1];
		const r       = parseFloat(  ratstr ) || 0;
		const nrat    = parseInt  ( nratstr ) || 0;
		const nrev    = parseInt  ( nrevstr ) || 0;
		const rint    = r % 1 >  0.6                    ?  Math.ceil( r )  :  Math.floor( r );  // frac via modulo
		const rhalf   = r % 1 >= 0.2  &&  r % 1 <= 0.6  ?  '-5'            :  '';
		const rhtm    = '<i class="a-icon a-icon-star a-star-' + rint + rhalf + '"></i>';
		
		if( !url || _bestNumRatings >= nrat ) return;  // Only query-result with most ratings
		_bestNumRatings = nrat;
		
		// More or less language-neutral strings due to Locales, just Anglicisms:
		ourDiv.innerHTML = rhtm + '<a style="margin-left: 37px" href="' 
		                 + unxss( url )                   + '">'
		                 + nrat.toLocaleString( amzLang ) + ' Goodreads-Ratings, '
		                 + nrev.toLocaleString( amzLang ) + ' Reviews</a>';
	}));
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



