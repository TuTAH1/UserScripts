// ==UserScript==
// @name         Search by resolution
// @name:ru      Искать по разрешению
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description
// @description:ru
// @author       Титан
// @match        https://yandex.ru/images/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.ru
// @grant		 GM_registerMenuCommand
// @license      CC BY-NC-SA
// ==/UserScript==

GM_registerMenuCommand("Delete all images with res below", DeleteImagesWithResBelow)

function DeleteImagesWithResBelow() {

	let images = document.querySelectorAll(".serp-item__preview")
	let minRes = prompt("Enter min resolution with space (example: 1920 1080)")
	let minWidth = Slice(minRes, 0, " ")
	let minHeight = Slice(minRes, " ")

	for (let image of images) {
		let size = image.querySelector(".serp-item__meta").textContent.replace(/[^\d.×]/g, '')
		if (size == null || size == "")
			continue;
		let width, height
		try {
			width = parseInt(Slice(size, 0, "×"))
			height = parseInt(Slice(size, "×"))
		} catch (e) {
			console.log("Error: " + e)
			console.log(image)
		}

		if (width < minWidth || height < minHeight) image.parentNode.remove()
	}

	for (let ad of document.querySelectorAll(".incut_inserted_yes")) {
		ad.remove()
	}
}

function Slice(Source, Start, End = undefined) {
	let start, end, result = Source
	switch (typeof (Start)) {
		case "number":
			start = Start;
			break;

		case "string":
			start = Source.indexOf(Start);
			start = start === -1 ? undefined : start + Start.length;
			break;

		case "undefined":
			start = 0;
			break;
	}
	if (start === undefined) throw `can't find start "${Start}" of "${Source}"`
	result = result.slice(start)

	switch (typeof (End)) {
		case "number":
			end = End;
			break;

		case "string":
			end = Source.indexOf(End);
			if (end === -1) end = undefined;
			break;

		case "undefined":
			end = Source.length;
	}

	if (end === undefined) throw `can't find end "${End}" of "${Source}"`
	result = result.slice(0, end)
	return result;


}