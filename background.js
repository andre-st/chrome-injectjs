"use strict";


const REDIRABLE_URLS  = [ "http://*/*", "https://*/*" ];  // vs "<all_urls>"

var _redirRules  = new Array();           // { regex: //, repl: '' }
var _mixinsState = "mixinsEnabledState";  // First state if nothing saved


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
	if( ( "mixinsState" in changes ) )
		_mixinsState = changes.mixinsState.newValue;
	
	if( ( "mixinsScript" in changes ) )
		runMixinsScript( changes.mixinsScript.newValue );
});


chrome.webRequest.onBeforeRequest.addListener( (details) =>
{
	if( _mixinsState == "mixinsDisabledState" ) return {};
	
	const rule = _redirRules.find( r => details.url.match( r.regex ) );

	if( !rule ) return {};

	const newUrl = details.url.replace( rule.regex, rule.repl );

	if( newUrl == details.url ) return {};
	
	return { redirectUrl: newUrl };
	
}, { urls: REDIRABLE_URLS }, [ "blocking" ] );


chrome.storage.sync.get( ["mixinsScript", "mixinsState"], stored =>
{
	_mixinsState = stored.mixinsState || _mixinsState;
	
	runMixinsScript( stored.mixinsScript );
});


