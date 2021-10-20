nsSettings.get([ "mixinsScript", "mixinsState" ], stored =>
{
	if( stored.mixinsState == "mixinsDisabledState" ) return;
	
	
	// Use in mixins which run as content script in order to avoid XSS.
	// ECMAScript provides URI percent-encoding routines only, 
	// so we have to define our own HTML-entities encoder:
	function unxss( theStr )
	{
		return theStr.replace( /[\u00A0-\u99999<>\&]/gim, (i) => '&#' + i.charCodeAt( 0 ) + ';' );
	}
	
	
	// Use in mixins to load cross-origin web resources without read blocking (CORB).
	// Details see "getUrl"-handler in background.js
	// Expects the 'runAsContentScript' mixin-option set true.
	function getUrl( theUrl, theCallback )
	{
		chrome.runtime.sendMessage({ contentScriptQuery: "getUrl", url: theUrl }, theCallback );
	}
	
	
	// Use in mixins to trigger the download dialog for a web resource from any origin.
	// Details see "saveUrl"-handler in background.js
	// Expects the 'runAsContentScript' mixin-option set true.
	function saveUrl( theUrl, theCallback )
	{
		const absUrl = new URL( theUrl, document.baseURI ).href;  // Absolute URL required
		chrome.runtime.sendMessage({ contentScriptQuery: "saveUrl", url: absUrl }, theCallback );
	}
	
	
	function redir( theRegex, theReplace ) { /* implemented in background.js */ };
	
	
	function mixin( theUrls, theCode, theOpts )
	{	
		const urls = Array.isArray( theUrls ) ? theUrls : [ theUrls ];  // Single URL as String?
		
		if( !urls.some( u => location.href.startsWith( u ))) return;
		
		if( typeof theCode === "string" || theCode instanceof String )  // Inject CSS
		{
			const s = document.createElement( "STYLE" );
			s.textContent = theCode;
			( document.head || document.documentElement ).appendChild( s );
			return;
		}
		
		if( typeof theCode === "function" )  // Inject ECMAScript:
		{
			// Content scripts and the website share the DOM but no JS functions.
			// https://developer.chrome.com/extensions/content_scripts#isolated_world
			// But we can run user scripts in the world of the target website.
			// This allows us to call the website's Javascript functions and to strip
			// off some privileges: the remote page cannot access our extension.
			
			// Some code, however, needs more privileges, e.g., on CORS issues:
			if( theOpts && (theOpts.runAsContentScript || false) )
			{
				theCode();
				return;
			}
			
			const s = document.createElement( "SCRIPT" );
			s.textContent = "(" + theCode + ")();";
			( document.head || document.documentElement ).appendChild( s );
			s.remove();  // ??
			return;
		}
		
		throw "Given code neither string nor function";
	};
	
	
	eval( stored.mixinsScript );  // Script calls mixin(), redir() multiple times
	                              // and prints SyntaxError.message to console
});

