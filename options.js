"use strict";


const EDITOR_STATES = [ "editorDefaultState", "editorChangedState", "editorSavedState" ];


nsUI.init( () =>
{
	nsUI.tweakTextArea( "#scriptarea", 
	{
		canTabs:         true,
		canAutocomplete: true,
		onInput:         () => nsUI.setState( "editorChangedState", EDITOR_STATES )
	});
	
	nsUI.bind( "#btnSave", "click", event => 
	{
		const script = nsUI.elem( "#scriptarea" ).value;
		nsSettings.set({ "mixinsScript": script }, () => nsUI.setState( "editorSavedState", EDITOR_STATES ));
	});
	
	nsUI.onCtrlS( () => nsUI.elem( "#btnSave" ).click() );
	
	nsSettings.get([ "mixinsScript" ], stored =>
	{
		if( stored.mixinsScript )  // Don't overwrite initial synopsis text
			nsUI.elem( "#scriptarea" ).value = stored.mixinsScript;
	});
});

