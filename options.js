"use strict";


const EDITOR_STATES = [ "editorDefaultState", "editorChangedState", "editorSavedState" ];


nsUI.init( () =>
{
	nsUI.tweakTextArea( "#scriptarea", 
	{
		canTabs: true,
		onInput: () => nsUI.setState( "editorChangedState", EDITOR_STATES )
	});
	
	nsUI.bind( "#btnSave", "click", event => 
	{
		const script = nsUI.elem( "#scriptarea" ).value;
		chrome.storage.sync.set({ "mixinsScript": script },
				() => nsUI.setState( "editorSavedState", EDITOR_STATES ) );
	});
	
	nsUI.onCtrlS( () => nsUI.elem( "#btnSave" ).click() );
	
	chrome.storage.sync.get( ["mixinsScript"], stored => 
	{
		if( stored.mixinsScript )
			nsUI.elem( "#scriptarea" ).value = stored.mixinsScript;
	});
});

