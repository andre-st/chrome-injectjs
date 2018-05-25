"use strict";


const MIXINS_STATES = [ "mixinsEnabledState", "mixinsDisabledState" ];


nsUI.init( () =>
{
	nsUI.bind( "#btnOptions", "click", nsUI.openOptions );
	
	nsUI.bind( "#btnOnOff", "click", () =>
	{
		const newState = nsUI.hasState( "mixinsEnabledState" )
				? "mixinsDisabledState" 
				: "mixinsEnabledState ";
		
		chrome.storage.sync.set({ "mixinsState": newState },
				() => nsUI.setState( newState, MIXINS_STATES ) );
	});
	
	chrome.storage.sync.get( ["mixinsState"], stored =>
	{
		if( stored.mixinsState )
			nsUI.setState( stored.mixinsState, MIXINS_STATES );
	});
});


