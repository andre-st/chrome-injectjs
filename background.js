"use strict";


const REDIRABLE_URLS  = [ "http://*/*", "https://*/*" ];  // vs "<all_urls>"

const _redirRules  = new Array();           // { regex: //, repl: '' }
const _mixinUrls   = new Array();           // String
var   _mixinsState = "mixinsEnabledState";  // First state if nothing saved



function updateIconState()
{
	chrome.tabs.query({ currentWindow: true, active: true }, tabs =>
	{
		var path;
		if( _mixinsState == "mixinsDisabledState" )
			path = "image/icon16-disabled.png"
		else if( tabs && tabs.length > 0 && _mixinUrls.some( u => tabs[0].url.startsWith( u )))
			path = "image/icon16-injected.png"
		else
			path = "image/icon16.png";
		
		chrome.browserAction.setIcon({ path: path });
	});
}


function runMixinsScript( theScript )
{
	function redir( theRegex, theReplace )
	{
		_redirRules.push({ regex: theRegex, repl: theReplace });
	};
	
	function mixin( theUrl, theCallback )
	{ 
		_mixinUrls.push( theUrl );
	};
	
	_redirRules.length = 0;
	_mixinUrls.length  = 0;
	
	eval( theScript );  // Script call redir(), mixin() multiple times
	updateIconState();
}


nsSettings.addChangeListener( changes =>
{
	if( "mixinsState" in changes )
	{
		_mixinsState = changes.mixinsState.newValue;
		updateIconState();
	}
	
	if( "mixinsScript" in changes )
		runMixinsScript( changes.mixinsScript.newValue );
});


chrome.tabs   .onActivated   .addListener( updateIconState );
chrome.tabs   .onUpdated     .addListener( updateIconState );
chrome.windows.onFocusChanged.addListener( updateIconState );


chrome.webRequest.onBeforeRequest.addListener( details =>
{
	if( _mixinsState == "mixinsDisabledState" ) return {};
	
	const rule = _redirRules.find( r => details.url.match( r.regex ));
	
	if( !rule ) return {};
	
	const newUrl = details.url.replace( rule.regex, rule.repl );
	
	if( newUrl == details.url ) return {};
	
	return { redirectUrl: newUrl };
	
}, { urls: REDIRABLE_URLS }, [ "blocking" ]);


nsSettings.get([ "mixinsScript", "mixinsState" ], stored =>
{
	_mixinsState = stored.mixinsState || _mixinsState;
	runMixinsScript( stored.mixinsScript );
});


chrome.runtime.onMessage.addListener( (request, sender, sendResponse) =>
{
	// To improve security, cross-origin fetches are disallowed from content scripts.
	// Such requests can be made from extension background pages instead, 
	// and relayed to content scripts when needed.
	if( request.contentScriptQuery == "getUrl" )
	{
		fetch ( request.url )
		.then ( response => response.text()     )
		.then ( text     => sendResponse( text ))
		.catch( error    => console.log( error ))
		return true;  // Will respond asynchronously
	}
	
	// sendResponse callback with { downloadId=undefined } on error
	if( request.contentScriptQuery == "saveUrl" )
	{
		chrome.downloads.download({ url: request.url }, sendResponse );
		return true;
	}
});


