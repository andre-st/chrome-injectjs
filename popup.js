"use strict";


const MIXINS_STATES = [ "mixinsEnabledState", "mixinsDisabledState" ];


function setIconState( isEnabled )
{
	chrome.browserAction.setIcon({ path: isEnabled 
			? "image/icon16.png" 
			: "image/icon16-disabled.png" });
}


if( typeof nsUI !== "undefined" )  // Popup script:
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
		
		nsUI.stateListeners.push( state => 
		{
			if( !MIXINS_STATES.includes( state ) ) return;
			setIconState( state == "mixinsEnabledState" );
		});
		
		chrome.storage.sync.get( ["mixinsState"], stored =>
		{
			if( stored.mixinsState )
				nsUI.setState( stored.mixinsState, MIXINS_STATES );
		});
	});
	
}
else  // Background script:
{
	chrome.storage.sync.get( ["mixinsState"], stored =>
	{
		if( stored.mixinsState )
			setIconState( stored.mixinsState == "mixinsEnabledState" );
	});
}

