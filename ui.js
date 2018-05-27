/**
 * @file
 * @brief  Lightweight Chrome Extension UI utils library
 * @since  2018-05-25
 * 
 */

"use strict";

const nsUI =
{
	/**
	 * @param  string  CSS selector
	 * @return void
	 */
	elem: function( theSelector )
	{
		return document.querySelector( theSelector );
	},
	
	
	/**
	 * @param  string  CSS selector
	 * @param  string  "click", "keydown" etc
	 * @param  callback
	 * @return void
	 */
	bind: function( theSelector, theEventName, theCallback )
	{
		const a = document.querySelectorAll( theSelector );
		for( var i = 0; i < a.length; i++ )
			a[i].addEventListener( theEventName, theCallback );
	},
	
	
	/**
	 * @param  callback
	 * @return void 
	 */
	init: function( theCallback )
	{
		document.addEventListener( "DOMContentLoaded", theCallback );
	},
	
	
	stateListeners: [],  // [callback(state),...]
	
	
	/**
	 * @param  string
	 * @param  array of string
	 * @param  string [optional]  CSS selector
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
	
	
	/**
	 * @param  string
	 * @param  string  CSS selector
	 * @return bool
	 */
	hasState: function( theState, theSelector )
	{
		const  e = nsUI.elem( theSelector || "body" );
		return e ? e.className.includes( theState ) : false;
	},
	
	
	/**
	 * @param  callback
	 * @return void
	 */
	onCtrlS: function( theCallback )
	{
		nsUI.bind( "body", "keydown", event =>
		{
			// CTRL+S habit to save current document
			if( event.ctrlKey 
			&&  event.which === 83 )
			{
				event.preventDefault();
				theCallback();
				return false;
			}
		});
	},
	
	
	/**
	 * @param  string  CSS selector
	 * @param  object  { onInput: callback, canTabs: bool }
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
			if( theOptions.canTabs
			&&  event.keyCode === 9 )
			{
				const p1 = ta.selectionStart;
				const p2 = ta.selectionEnd;
				ta.value = ta.value.substring( 0, p1 ) 
				           + "\t" 
				           + ta.value.substring( p2 );
				
				ta.selectionStart = ta.selectionEnd = p1 + 1;
				event.preventDefault();
				return false;
			}
		});
	},
	
	
	/**
	 * @return void
	 */
	openOptions: function()
	{
		window.open( chrome.runtime.getURL( "options.html" ) );
	}
}

