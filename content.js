// Note: Beware of malicious code injection by the visited page (Scoping)


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
