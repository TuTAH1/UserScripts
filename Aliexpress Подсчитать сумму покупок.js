// ==UserScript==
// @name         Total of all purchases
// @name:ru      Сумма покупок
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Calculates the sum of all completed orders that are visible on the page (scroll down to the end to count the orders for the entire time).
// @description:ru  Подсчитывает сумму всех завершенных заказов, которые видны на странице (прокрутите вниз до конца, чтобы подсчитать заказы за всё время).
// @author       Титан
// @match        https://www.aliexpress.com/p/order/index.html
// @match        https://trade.aliexpress.ru/orderList.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant		 GM_registerMenuCommand
// @license      CC BY-NC-SA
// ==/UserScript==

let autoRedirect = true //Автоматически редиректить на нормальную страницу заказов
let language = "auto" //Choose your language. Supported: ru, en


if (language == "auto") {
	language = Slice(navigator.language || navigator.userLanguage, 0, "-");
}

let dictionary = {
	"optionCalcPrices" : {
		"ru" : "Подсчитать цены на этой странице"
		,"en" : "Calculate prices on this page"
	},
	"optionGoToGlobalPage" : {
		"ru" : "Перейти на глобальную страницу заказов"
		,"en" : "Go to the global orders page"
	},
	"outputSumOfOrders" : {
		"ru" : "Сумма покупок"
		,"en" : "Total purchases prices"
	},
	"outputOrders" : {
		"ru" : "Покупки"
		,"en" : "Purchases"
	}
}

function GetDicString(String) {
	try {
		return dictionary[String][language]
	}
	catch (e) {
		return dictionary[String]["en"]
	}
}

if (document.URL.indexOf("www.aliexpress.com")>=0)
	GM_registerMenuCommand(GetDicString("optionCalcPrices"), CalculateTotalPrice);
else
if (autoRedirect) GoToNormalPage
else
	GM_registerMenuCommand(GetDicString("optionGoToGlobalPage"), GoToNormalPage)

function GoToNormalPage() {
	window.location.replace("https://www.aliexpress.com/p/order/index.html");
}

let finishedWords = ["Finished", "С отделкой"]; //: "Finished" word in all shitty AliExpress' translations

function CalculateTotalPrice() {
	let total = 0;
	let purchases = "";
	for(let item of document.querySelectorAll(".order-item")) {
		if (finishedWords.indexOf(item.querySelector(".order-item-header-status-text").textContent)<0) continue; //: checks is the order is finished
		let price = parseFloat(OnlyNumbers(item.querySelector(".order-item-content-opt-price-total").textContent));
		let itemName = item.querySelector(".order-item-content-info-name")?.textContent;
		total+= price
		purchases+= "\n\n" + itemName + "\n>>> " + price + " <<<"
	}
	alert(`${GetDicString("outputSumOfOrders")}: ${total}\n\n${GetDicString("outputOrders")}: ${purchases}`)
}

function OnlyNumbers(Str) {
	let num = ""
	let dot = false;
	for(char of Str) {
		if(IsNumber(char))
			num+=char;
		else
		if(!dot && (char == '.' || char == ","))
		{
			num+=".";
			dot = true;
		}
		else if (dot) {
			break;
		}
	}
	return num
}

function IsNumber(c) { return c >= '0' && c <= '9'}

function Slice(source, int, endsWith) {
	return source.slice(int,source.indexOf(endsWith))
}

