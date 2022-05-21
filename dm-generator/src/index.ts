import { Canvas, Image } from "canvas";
import * as fs from "fs";
import { roundRect } from "./utils";

if (!fs.existsSync("out") || !fs.statSync("out").isDirectory()) fs.mkdirSync("out");

const calcCanvas = new Canvas(1, 1);
const calcCtx = calcCanvas.getContext("2d");

calcCtx.font = "normal 38px Noto Sans CJK HK";
const arr = getLines(calcCtx,
	`6B同學：

三年的高中生涯過去了，回望過去，當中有得有失，我們失去了一些面授的時間、送別了移居到遠方的老師、同學，失去了精神抖擻的陸運會，也不能參與四日三夜的令會，但感恩我們仍能在這變化萬千的世代攜手同行，締造屬於我們的回憶。記得中四那年，我們在冷雨下到黃石碼頭旅行，在風雨中玩樂取暖；中六畢業前夕，我們又在人山人海的海洋公園遊玩，拍下了不少照片。還有你們最投入的音樂節，一眾男女同學化身男/女工，為音樂節製作飾物，大家一起編排舞蹈，在一次又一次的練習中，我們培養了默契，為了同一目標而努力，在宣布一刻，大家手牽著手，又哭又笑的表情，是我們的共同回憶。還有疫情前的聖誕聯歡，我們一起品嚐甜筒，沒有食物的聯歡會，我們有同學「用心」準備的禮物，同樣過得充實。回看你們的照片，雖然每一張都隔著口罩，但在成長的過程，本來就充滿不同的挑戰，在困難中彼此支持，一同學習成長，便是人生的功課。面對未知的前路，希望你們能靠主努力，活出精彩的人生，與你們分享一節我很喜歡的經文：「你要專心仰賴耶和華，不可倚靠自己的聰明。在你一切所行的事上，都要認定他，他必指引你的路。」(箴言3：5-6)，願共勉之！

陳珮芹老師`);

const canvas = new Canvas(867, 60 + 57 * arr.length);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#303030";
roundRect(ctx, 0, 0, canvas.width, canvas.height, 58);

ctx.font = calcCtx.font;
ctx.textBaseline = "top";
ctx.textAlign = "left";
ctx.fillStyle = "white";
for (let ii = 0; ii < arr.length; ii++) {
	console.log(`Line ${ii}: ${arr[ii]}`)
	ctx.fillText(arr[ii], 41, 37 + 57 * ii);
}

fs.writeFileSync("out/test.png", canvas.toBuffer());

function getLines(ctx: CanvasRenderingContext2D, msg: string) {
	const lineArr = [];
	var tempLine = "";
	for (let ii = 0; ii < msg.length; ii++) {
		var char = msg[ii];
		if (char === "\n" || ctx.measureText(tempLine).width > 770) {
			if (/\w/.test(char) && /\w/.test(msg[ii + 1])) {
				while (/\w/.test(msg[ii - 1])) {
					ii--;
					tempLine = tempLine.slice(0, -1);
				}
				char = msg[ii];
			}
			lineArr.push(tempLine);
			tempLine = "";
		}
		if (char !== "\n") tempLine += char;
	}
	return lineArr.concat(tempLine);
}
