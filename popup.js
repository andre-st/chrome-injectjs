"use strict";


const MIXINS_STATES        = [ "mixinsEnabledState", "mixinsDisabledState" ];
const MIXINS_DEFAULT_STATE =   "mixinsEnabledState";  // First run, nothing stored


nsUI.init( () =>  // Popup script:
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
	
	chrome.storage.sync.get( ["mixinsState"], 
			r => nsUI.setState( r.mixinsState || MIXINS_DEFAULT_STATE, MIXINS_STATES ) );
});

