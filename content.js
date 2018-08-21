chrome.storage.sync.get( ["mixinsScript", "mixinsState"], stored =>
{
	if( stored.mixinsState == "mixinsDisabledState" ) return;
	
	// Use in mixins which run as content script in order to avoid XSS.
	// ECMAScript provides URI percent-encoding routines only, 
	// so we have to define our own:
	function unxss( theStr )
	{
		return theStr.replace( /[\u00A0-\u99999<>\&]/gim, (i) => '&#' + i.charCodeAt( 0 ) + ';' );
	}
	
	function redir( theRegex, theReplace ) { /* implemented in background.js */ };
	
	function mixin( theUrl, theCallback, theOpts )
	{
		if( !location.href.startsWith( theUrl ) ) return;
		
		// Needs more privileges, e.g., if CORS issues:
		if( theOpts && (theOpts.runAsContentScript || false) )  
		{
			theCallback();
			return;
		}
		
		// Content scripts and the website share the DOM but no JS functions.
		// https://developer.chrome.com/extensions/content_scripts#isolated_world
		// We run user scripts in the world of the target website.
		// This allows us to call the website's Javascript functions
		// and to strip off some privileges: the remote page cannot access
		// our extension.
		
		const s = document.createElement( "script" );
		s.textContent = "(" + theCallback + ")();";
		( document.head || document.documentElement ).appendChild( s );
		s.remove();
	};
	
	
	eval( stored.mixinsScript );  // Script calls mixin(), redir() multiple times
});

