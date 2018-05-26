"use strict";


const MIXINS_STATES        = [ "mixinsEnabledState", "mixinsDisabledState" ];
const MIXINS_DEFAULT_STATE =   "mixinsEnabledState";  // First run, nothing stored


function setIconState( theState )
{
	chrome.browserAction.setIcon({ 
			path: theState == "mixinsDisabledState"
			                ? "image/icon16-disabled.png"
			                : "image/icon16.png" });
}


if( typeof nsUI === "undefined" )  // Background script:
{
	chrome.storage.sync.get( ["mixinsState"], 
			r => setIconState( r.mixinsState || MIXINS_DEFAULT_STATE ) );
	
}
else  // Popup script:
{
	nsUI.init( () =>
	{
		nsUI.bind( "#btnOptions", "click", nsUI.openOptions );
		
		nsUI.bind( "#btnOnOff", "click", () =>
		{
			const newState = nsUI.hasState( "mixinsEnabledState" )
					? "mixinsDisabledState" 
					: "mixinsEnabledState";
			
			chrome.storage.sync.set({ "mixinsState": newState },
					() => nsUI.setState( newState, MIXINS_STATES ) );
		});
		
		nsUI.stateListeners.push( setIconState );
		
		chrome.storage.sync.get( ["mixinsState"], 
				r => nsUI.setState( r.mixinsState || MIXINS_DEFAULT_STATE, MIXINS_STATES ) );
	});
}

