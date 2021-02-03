"use strict";


const MIXINS_STATES        = [ "mixinsEnabledState", "mixinsDisabledState" ];
const MIXINS_DEFAULT_STATE =   "mixinsEnabledState";  // First run, nothing stored


nsUI.init( () =>
{
	nsUI.bind( "#btnOptions", "click", nsUI.openOptions );
	
	nsUI.bind( "#btnOnOff", "click", () =>
	{
		const newState = nsUI.hasState( "mixinsEnabledState" )
				? "mixinsDisabledState" 
				: "mixinsEnabledState";
		
		nsSettings.set({ "mixinsState": newState },
				() => nsUI.setState( newState, MIXINS_STATES ));
	});
	
	nsSettings.get([ "mixinsState" ], 
			r => nsUI.setState( r.mixinsState || MIXINS_DEFAULT_STATE, MIXINS_STATES ));
});

