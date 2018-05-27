chrome.storage.sync.get( ["mixinsScript", "mixinsState"], stored =>
{
	if( stored.mixinsState == "mixinsDisabledState" ) return;
	
	function mixin( theUrl, theCallback )
	{
		if( !location.href.startsWith( theUrl ) ) return;
		
		// Content scripts and the website share the DOM but no JS functions.
		// https://developer.chrome.com/extensions/content_scripts#isolated_world
		// We run user scripts in the world of the target website.
		// This allows us to call the website's Javascript functions, and
		// there's no good reason to have it access our extension API.
		
		const s = document.createElement( "script" );
		s.textContent = "(" + theCallback + ")();";
		( document.head || document.documentElement ).appendChild( s );
		s.remove();
	}
	
	eval( stored.mixinsScript );  // Script calls mixinXXX() multiple times
});

