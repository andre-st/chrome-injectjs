/**
 * @file
 * @since   2018-05-25
 * @author  https://github.com/andre-st
 *
 * Note:
 *   - doc-comments conventions: http://usejsdoc.org/
 *   - members prefixed with an underscore are private members (_function, _attribute)
 * 
 */

"use strict";

/**
 * @namespace
 * @description Lightweight Chrome Extension UI utils library
 */
const nsUI =
{
	/**
	 * @callback stateCallback
	 * @param    {string} theState - CSS classname, @see setState()
	 * @return   {void}
	 * @public
	 */
	
	/**
	 * @callback actionCallback
	 * @return   {void}
	 * @public
	 */	
	
	stateListeners: [],  /** Notified by setState(): @see stateCallback */
	
	/**
	 * @param  {actionCallback}  theCallback
	 * @return {void}
	 * @public
	 */	
	init: function( theCallback )
	{
		document.addEventListener( "DOMContentLoaded", theCallback );
	},
	
	
	/**
	 * @param  {DOMString}  theSelector
	 * @return {Element}
	 * @public
	 */	
	elem: function( theSelector )
	{
		return document.querySelector( theSelector );
		// return [].slice.call( document.querySelectorAll( theSelector ));   elem().forEach(...
	},
	
	
	/**
	 * @param  {DOMString}     theSelector     - CSS selector
	 * @param  {string}        theEventName    - DOM event type: "click", "keydown" etc
	 * @param  {EventListener} theEventHandler - function which handles EventTarget
	 * @return {void}
	 * @public
	 */
	bind: function( theSelector, theEventName, theEventHandler )
	{
		const a = document.querySelectorAll( theSelector );
		for( var i = 0; i < a.length; i++ )
			a[i].addEventListener( theEventName, theEventHandler );
	},
	
	
	/**
	 * @param  {string}    theState - Any string included in the possible states parameter
	 * @param  {string[]}  thePossibleStates
	 * @param  {DOMString} [theSelector] - CSS selector
	 * @return {void}
	 * @public
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
			a[i].classList.remove( ...thePossibleStates );   // Removes prev state
			a[i].classList.add( theState );
		}
		
		nsUI.stateListeners.forEach( l => l( theState ));
	},
	
	
	/**
	 * @param  {string}    theState    - @see setState()
	 * @param  {DOMString} theSelector - CSS selector
	 * @return {boolean}
	 * @public
	 */	
	hasState: function( theState, theSelector )
	{
		const  e = nsUI.elem( theSelector || "body" );
		return e ? e.classList.contains( theState ) : false;
	},
	
	
	/**
	 * @param  {actionCallback} theCallback
	 * @return {void}
	 * @public
	 */	
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
	 * @param  {HTMLTextAreaElement}  DOM element with the word at cursor position to complete
	 * @return {void}
	 * @public
	 */
	autocomplete: function( theTextArea )  // Good enough auto-completion (just the previous keyword-variant)
	{
		const isLetter   = x => x.toLowerCase() != x.toUpperCase();
		const isStopChar = x => !isLetter( x );
		const kwEnd      = theTextArea.selectionStart;
		var   kwStart    = kwEnd - 1;
		var   keyword    = "";
		var   completion = "";           // Just the remainder
		
		// Get the yet incomplete string in question by searching backwards from the cursor position
		for(; kwStart > 0; kwStart-- )
		{
			const c = theTextArea.value.charAt( kwStart );
			if( isStopChar( c )) break;
			keyword = c + keyword;
		}
		
		// Find another occurence of the incomplete string just before the incomplete string at the cursor position.
		// In 90% it's the variant the user is looking for.
		// Otherwise the user has to add one or two additional characters to the inoomplete string in question and retry.
		const matchStart = theTextArea.value.lastIndexOf( keyword, kwStart - 1 );
		
		// Follow that occurence until a stop-character to determine a variant of a complete string
		for( var matchEnd = matchStart + keyword.length; matchEnd < theTextArea.value.length; matchEnd++ )
		{
			const c = theTextArea.value.charAt( matchEnd );
			if( isStopChar( c )) break;
			completion += c;
		}
		
		if( completion.length > 30 ) return;  // Something went wrong?
		
		// Insert found variant of a complete string at the cursor position
		theTextArea.value        = theTextArea.value.substring( 0, kwEnd ) + completion + theTextArea.value.substring( kwEnd );
		theTextArea.selectionEnd = theTextArea.selectionStart = kwEnd + completion.length;  // Set cursor
	},
	
	
	/**
	 * @param  {HTMLTextAreaElement}  DOM element with the text to indent at the cursor position
	 * @return {void}
	 * @public
	 */
	indentText: function( theTextArea )  // Currently just adds tabs (more than native TA does)
	{
		const p1 = theTextArea.selectionStart;
		const p2 = theTextArea.selectionEnd;
		theTextArea.value = theTextArea.value.substring( 0, p1 ) + "\t" 
		                  + theTextArea.value.substring( p2    );
		
		theTextArea.selectionStart = theTextArea.selectionEnd = p1 + 1;
	},
	
	
	/**
	 * @param  {DOMString} theSelector - CSS selector
	 * @param  {Object}    theOptions  - { onInput: Function, canTabs: Boolean, canAutocomplete: Boolean }
	 * @return {void}
	 * @public
	 */
	tweakTextArea: function( theSelector, theOptions )
	{
		if( theOptions.onInput )
			nsUI.bind( theSelector, "input", theOptions.onInput );
		
		nsUI.bind( theSelector, "keydown", event =>
		{
			const ta = event.target;
			
			// Enable text autcompletion with [CTRL]+[SPACE] keys.
			// Unfortunately, vim-like [CTRL]+[N] is already taken by the browser.
			if( theOptions.canAutocomplete && event.ctrlKey && event.keyCode === 32 )
			{
				nsUI.autocomplete( ta );
				event.preventDefault();
				return false;
			}
			
			// Enable tabs for indentation (no native support)
			if( theOptions.canTabs && event.keyCode === 9 )
			{
				nsUI.indentText( ta );
				event.preventDefault();
				return false;
			}
		});
	},
	
	
	/**
	 * @return {void}
	 * @public
	 */
	openOptions: function()
	{
		window.open( chrome.runtime.getURL( "options.html" ));
	}
}

