/**
 * @file
 * @since  2018-05-25
 * 
 */

"use strict";

/**
 * Lightweight Chrome Extension UI utils library
 * @namespace
 * @description
 */
const nsUI =
{
	stateListeners: [],  /** Notified by setState(): Function(state) */
	
	
	init: function( theCallback )
	{
		document.addEventListener( "DOMContentLoaded", theCallback );
	},
	
	
	elem: function( theSelector )
	{
		return document.querySelector( theSelector );
	},
	
	
	/**
	 * @param  String    CSS selector
	 * @param  String    "click", "keydown" etc
	 * @param  Function  Event handler
	 * @return void
	 */
	bind: function( theSelector, theEventName, theCallback )
	{
		const a = document.querySelectorAll( theSelector );
		for( var i = 0; i < a.length; i++ )
			a[i].addEventListener( theEventName, theCallback );
	},
	
	
	/**
	 * @param  String    Any string included in the possible states parameter
	 * @param  String[]  All possible states
	 * @param  String    [optional]  CSS selector
	 * @return void
	 *
	 * <pre> 
	 * .textChangedState #btnSave { background-color: yellow; }
	 * .textSavedState   #btnSave { background-color: green;  }
	 * </pre>
	 */
	setState: function( theState, thePossibleStates, theSelector )
	{
		console.assert( thePossibleStates.includes( theState ), 
				"Expect possible states to include '" + theState + "'" );
		
		const a = document.querySelectorAll( theSelector || "body" );
		for( var i = 0; i < a.length; i++ )
		{
			var cn = a[i].className;
			thePossibleStates.forEach( s => cn = cn.replace( s, '' ) );  // Removes prev state
			a[i].className = cn + ' ' + theState;
		}
		
		nsUI.stateListeners.forEach( l => l( theState ) );
	},
	
	
	hasState: function( theState, theSelector )
	{
		const  e = nsUI.elem( theSelector || "body" );
		return e ? e.className.includes( theState ) : false;
	},
	
	
	onCtrlS: function( theCallback )
	{
		nsUI.bind( "body", "keydown", event =>
		{
			// CTRL+S habit to save current document
			if( event.ctrlKey && event.which === 83 )
			{
				event.preventDefault();
				theCallback();
				return false;
			}
		});
	},
	
	
	/**
	 * @param  String  CSS selector
	 * @param  Object  { onInput: Function, canTabs: Boolean }
	 * @return void
	 */
	tweakTextArea: function( theSelector, theOptions )
	{
		if( theOptions.onInput )
			nsUI.bind( theSelector, "input", theOptions.onInput );
		
		nsUI.bind( theSelector, "keydown", event =>
		{
			const ta = event.target;
			
			// Enable tabs for indentation (no native support)
			if( theOptions.canTabs && event.keyCode === 9 )
			{
				const p1 = ta.selectionStart;
				const p2 = ta.selectionEnd;
				ta.value = ta.value.substring( 0, p1 ) + "\t" 
				         + ta.value.substring( p2    );
				
				ta.selectionStart = ta.selectionEnd = p1 + 1;
				event.preventDefault();
				return false;
			}
		});
	},
	
	
	openOptions: function()
	{
		window.open( chrome.runtime.getURL( "options.html" ) );
	}
}

