// Content scripts and the website share the DOM but no javascript functions
// https://developer.chrome.com/extensions/content_scripts#isolated_world
// Nevertheless, beware of XSS.

chrome.storage.sync.get( ["mixinsScript", "mixinsState"], stored =>
{
	if( stored.mixinsState == "mixinsDisabledState" ) return;
	
	function mixin( theUrl, theCallback )
	{
		if( location.href.startsWith( theUrl ) )
			theCallback();
	};
	
	eval( stored.mixinsScript );  // Script calls mixin() multiple times
});

