
var _redirRules = new Array();  // { regex: //, repl: '' }


function runMixinsScript( theScript )
{
	function redir( theRegex, theReplace )
	{
		_redirRules.push({ regex: theRegex, repl: theReplace });
	};
	
	
	function mixin( theUrl, theCallback ) { /* implemented in content.js */ };
	

	_redirRules.length = 0;
	
	eval( theScript );  // Script call redir(), mixin() multiple times
}



chrome.storage.onChanged.addListener( (changes,areaName) => 
{
	if( !( 'mixinsScript' in changes ) ) return;

	runMixinsScript( changes.mixinsScript.newValue );
});



chrome.webRequest.onBeforeRequest.addListener( (details) =>
{
	const rule = _redirRules.find( r => details.url.match( r.regex ) );

	if( !rule ) return {};

	const newUrl = details.url.replace( rule.regex, rule.repl );

	if( newUrl == details.url ) return {};
	
	return { redirectUrl: newUrl };
	
}, { urls: [ "<all_urls>" ] }, [ "blocking" ] );



chrome.storage.sync.get( ["mixinsScript", "mixinsState"], stored =>
{
	runMixinsScript( stored.mixinsScript );
});


