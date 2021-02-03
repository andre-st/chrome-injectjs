/**
 * @file
 * @since   2021-02-03
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
 * @description Chrome Extension Settings utils library
 *
 *
 * Note:
 *   chrome.storage.local   no limit
 *   versus
 *   chrome.storage.sync.QUOTA_BYTES_PER_ITEM = 8192
 *
 *
 */
const nsSettings =
{
	addChangeListener: function( theCallback )
	{
		chrome.storage.onChanged.addListener( theCallback );  // (changes,areaName)
	},
	
	
	get: function( theKeys, theCallback )
	{
		chrome.storage.local.get( theKeys, theCallback );
	},
	
	
	set: function( theStoreObj, theCallback )
	{
		chrome.storage.local.set( theStoreObj, theCallback );
	}
}



