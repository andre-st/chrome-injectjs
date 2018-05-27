// Content scripts and the website share the DOM but no javascript functions
// https://developer.chrome.com/extensions/content_scripts#isolated_world
// Nevertheless, beware of XSS.

chrome.storage.sync.get( ["mixinsScript", "mixinsState"], stored =>
{
	if( stored.mixinsState == "mixinsDisabledState" ) return;
	
	function mixin( theUrl, theCallback, isIsolated )
	{
		if( !location.href.startsWith( theUrl ) ) return;
		if( isIsolated || true )
		{
			theCallback();
		}
		else
		{
			// This breaks the Javascript isolation but allows to
			// call Javascript functions of the target Website
			const s = document.createElement( "script" );
			s.textContent = "(" + theCallback + ")();";
			( document.head || document.documentElement ).appendChild( s );
			s.remove();
		}
	}
	
	function mixinUnsafe( theUrl, theCallback )
	{
		mixin( theUrl, theCallback, false );
	};
	
	eval( stored.mixinsScript );  // Script calls mixinXXX() multiple times
});

