import { Canvas, Image } from "canvas";
import * as fs from "fs";
import { roundRect, twoDigits } from "./utils";
import data from "../data.json";

if (!fs.existsSync("out") || !fs.statSync("out").isDirectory()) fs.mkdirSync("out");

for (let ii = 0; ii < data.length; ii++) generator(ii, data[ii]);
const files = fs.readdirSync("data");
console.log(files);
for (let ii = 0; ii < files.length; ii++) genImage(ii, `data/${files[ii]}`);

function generator(index: number, texts: string) {
	const calcCanvas = new Canvas(1, 1);
	const calcCtx = calcCanvas.getContext("2d");
	
	calcCtx.font = "normal 48px Noto Sans CJK HK";
	const arr = getLines(calcCtx, texts);
	
	const canvas = new Canvas(890, 60 + 57 * arr.length);
	const ctx = canvas.getContext("2d");
	
	const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
	gradient.addColorStop(0, "Green");
	gradient.addColorStop(1, "LimeGreen");
	ctx.fillStyle = gradient;
	roundRect(ctx, 0, 0, canvas.width, canvas.height, 58);
	
	ctx.font = calcCtx.font;
	ctx.textBaseline = "top";
	ctx.textAlign = "left";
	ctx.fillStyle = "white";
	for (let ii = 0; ii < arr.length; ii++) ctx.fillText(arr[ii], 41, 37 + 57 * ii);
	fs.writeFileSync(`out/${twoDigits(index)}.png`, canvas.toBuffer());
}

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

function genImage(index: number, url: string) {
	const image = new Image();
	image.onload = () => {
		const canvas = new Canvas(image.width, image.height);
		const ctx = canvas.getContext("2d");

		roundRect(ctx, 0, 0, canvas.width, canvas.height, canvas.width * 0.1, false);
		ctx.clip();
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

		fs.writeFileSync(`out/image_${twoDigits(index)}.png`, canvas.toBuffer());
	};
	image.src = url;
}