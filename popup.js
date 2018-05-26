"use strict";


const MIXINS_STATES = [ "mixinsEnabledState", "mixinsDisabledState" ];


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
	
	nsUI.stateListeners.push( state => 
	{
		if( !MIXINS_STATES.includes( state ) ) return;
		
		const path = state == "mixinsEnabledState" 
				? "image/icon16.png" 
				: "image/icon16-off.png";
		
		chrome.browserAction.setIcon({ path: path });
	});
	
	chrome.storage.sync.get( ["mixinsState"], stored =>
	{
		if( stored.mixinsState )
			nsUI.setState( stored.mixinsState, MIXINS_STATES );
	});
});


