chrome.storage.sync.get( ["mixinsScript", "mixinsState"], stored =>
{
	if( stored.mixinsState == "mixinsDisabledState" ) return;
	
	function redir( theRegex, theReplace ) { /* implemented in background.js */ };
	
	function mixin( theUrl, theCallback, theOpts )
	{
		if( !location.href.startsWith( theUrl ) ) return;
		
		if( theOpts.runAsContentScript || false )  // More privileges, e.g., CORS doesn't matter
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

