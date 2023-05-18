// ==UserScript==
// @name         YouTube REMOVE CAPS FROM VIDEOS TITLES
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.2
// @description  Removes THE SCREAMING TEXT from videos titles if ((the {MinCapsPercent}% of words are CAPSED) {or/and} (CAPSED word contains at least {MinCapsLetters}))
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=198809
// @license      MIT
// ==/UserScript==
 
(function() {
	'use strict';
 
	/*↓ SETTINGS ↓*/
	let MinCapsPercent = .50; // replace to 0 to make this check always pass and 1.00 to always fall
	let MinCapsLetters = 5; // replace to 0 to make this check always pass and -1 to always fall
	let OR = true; // set false for AND
	/*↑ SETTINGS ↑*/
 
	document.arrive("#video-title",
		titleElement => removeCapsFromElement(titleElement)	)
 
	document.arrive("#container > h1 > yt-formatted-string",
		currentVideoTitle => removeCapsFromElement(currentVideoTitle))
 
	// Not working
	//document.arrive( "title", {fireOnAttributesModification: true}, pageName => removeCapsFromElement(pageName))
	 removeCapsFromElement(document.querySelector("title"))
 
	function removeCapsFromElement(element) {
		element.textContent = removeCapsFromText(element.textContent)
	}
 
	function removeCapsFromText(text) {
		if(tooMuchCaps(text)) return turnOffCaps(text, !OR);
		else if (OR) return turnOffCaps(text,true);
		return text;
	}
 
	function tooMuchCaps(str) {
		let words = str.split(' ');
		let caps = 0;
		for(let word of words) {
			if(word == word.toUpperCase()) caps++;
		}
		return caps/words.length >= MinCapsPercent;
	}
 
	function turnOffCaps(str, isLimit) {
		let words = str.split(' ');
		let newWords = [];
		for(let word of words) {
			if(word == word.toUpperCase() && (!isLimit || word.length >= MinCapsLetters))
				newWords.push(word.toLowerCase());
			else newWords.push(word);
		}
		newWords = newWords.join(' ');
		return toUpperAfterDot(newWords);
	}
 
	function toUpperAfterDot(str, upFirstLetter = true) {
		let dotFound = upFirstLetter;
		let newStr = "";
		for(let letter of str) {
			if(dotFound) {
				let upLetter = letter.toUpperCase();
				if (upLetter!=letter.toLowerCase())  { // is letter check
					newStr += upLetter;
					dotFound = false
					continue;
				}
			}
			else if (letter == '.') dotFound = true;
			newStr+=letter;
		}
		return newStr;
	}
})();
