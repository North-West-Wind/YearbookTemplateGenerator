import { Canvas, Image } from "canvas";
import * as fs from "fs";
import { circle, getImage, roundRect, twoDigits } from "./utils";

if (!fs.existsSync("out") || !fs.statSync("out").isDirectory()) fs.mkdirSync("out");

var index = 0;
if (!fs.existsSync("data.txt") || !fs.statSync("data.txt").isFile()) throw new Error("Cannot find data.txt");
for (const chunk of fs.readFileSync("data.txt", { encoding: "utf8" }).split("\n\n")) {
	const lines = chunk.split("\n");
	generator(++index, lines[0], lines[1], lines[2] === "null" ? null : lines[2], lines[3], lines[4], lines[5], lines[6], lines[7], lines[8]);
}

async function generator(index: number, ig0: string, chin: string, desc: string | null, ig1: string = "", msg1: string = "", ig2: string = "", msg2: string = "", ig3: string = "", msg3: string = "") {
	const calcCanvas = new Canvas(1, 1);
	const calcCtx = calcCanvas.getContext("2d");
	calcCtx.font = "bold 58px Noto Sans CJK HK";
	const width0 = calcCtx.measureText(ig0 + "  ").width;
	const width1 = calcCtx.measureText(ig1 + "  ").width;
	const width2 = calcCtx.measureText(ig2 + "  ").width;
	const width3 = calcCtx.measureText(ig3 + "  ").width;

	calcCtx.font = "normal 50px Noto Sans CJK HK";
	const arr0 = getLines(calcCtx, width0, desc || "");
	const arr1 = getLines(calcCtx, width1, msg1);
	const arr2 = getLines(calcCtx, width2, msg2);
	const arr3 = getLines(calcCtx, width3, msg3);

	//const fullStr = ig0 + desc + ig1 + msg1 + ig2 + msg2 + ig3 + msg3;
	//const summedStrLen = fullStr.length + 6 + (fullStr.match(/\{n\}/g)?.length || 0) * 25;
	//const height = 2200 + summedStrLen * 2;
	const height = 2040 + (arr0.length + arr1.length + arr2.length + arr3.length) * 75;
	const canvas = new Canvas(1716, height);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	//roundRect(ctx, 642, 273, 1715, 2454, 100);
	roundRect(ctx, 0, 0, 1716, height, 100);
	// x - 642
	// y - 273

	const icon = new Image();
	await new Promise(resolve => {
		const url = getImage(`data/icons/icon_${twoDigits(index)}`);
		icon.onload = async () => {
			const shorterSide = Math.min(icon.naturalWidth, icon.naturalHeight);
			const width = icon.naturalWidth / shorterSide * 151;
			const height = icon.naturalHeight / shorterSide * 151;
			const centerX = 96 + (151 - width) / 2, centerY = 75 + (151 - height) / 2;

			ctx.save();
			circle(ctx, 96, 75, 151 / 2, false);
			ctx.clip();
			
			ctx.drawImage(icon, centerX, centerY, width, height);
			ctx.restore();

			resolve(undefined);
		}
		if (url) icon.src = url;
		else resolve(undefined);
	});

	ctx.fillStyle = "black";
	ctx.font = "bold 58px Noto Sans CJK HK";
	ctx.textBaseline = "middle";
	ctx.textAlign = "left";
	ctx.fillText(ig0, 296, 112);
	ctx.font = "normal 46px Noto Sans CJK HK";
	ctx.fillText(chin, 296, 177);

	ctx.fillStyle = "#4d4d4f";
	circle(ctx, 1613, 116, 17 / 2);
	circle(ctx, 1613, 142, 17 / 2);
	circle(ctx, 1613, 168, 17 / 2);

	const photo = new Image();
	photo.onload = () => {
		const side = Math.min(photo.width, photo.height);
		ctx.drawImage(photo, (photo.width - side) / 2, (photo.height - side) / 2, side, side, 93, 259, 1530, 1530);
	}
	const src = getImage(`data/images/${twoDigits(index)}`);
	if (src) photo.src = src;
	else {
		ctx.fillStyle = "#cccccc";
		ctx.fillRect(93, 259, 1530, 1530);
	}

	const heart = new Image();
	heart.onload = () => {
		heart.width = heart.naturalWidth * 10;
		heart.height = heart.naturalHeight * 10;
		ctx.drawImage(heart, 96, 1820, 90, 90);
	}
	heart.src = "assets/heart.svg";

	const comment = new Image();
	comment.onload = () => {
		comment.width = comment.naturalWidth * 10;
		comment.height = comment.naturalHeight * 10;
		ctx.drawImage(comment, 254, 1820, 90, 90);
	}
	comment.src = "assets/comment.svg";

	const send = new Image();
	send.onload = () => {
		send.width = send.naturalWidth * 10;
		send.height = send.naturalHeight * 10;
		ctx.drawImage(send, 431, 1820, 90, 90);
	}
	send.src = "assets/send.svg";

	const save = new Image();
	save.onload = () => {
		save.width = save.naturalWidth * 10;
		save.height = save.naturalHeight * 10;
		ctx.drawImage(save, 1531, 1820, 90, 90);
	}
	save.src = "assets/save.svg";

	ctx.textBaseline = "top";
	ctx.fillStyle = "black";

	var offset = 0;
	drawTexts(width0, ig0, arr0);
	drawTexts(width1, ig1, arr1);
	drawTexts(width2, ig2, arr2);
	drawTexts(width3, ig3, arr3);
	function drawTexts(nameWidth: number, name: string, lines: string[]) {
		ctx.font = "bold 58px Noto Sans CJK HK";
		ctx.fillText(name, 90, 1935 + offset);
		ctx.font = "normal 50px Noto Sans CJK HK";
		for (let ii = 0; ii < lines.length; ii++) {
			ctx.fillText(lines[ii], 90 + (ii === 0 ? nameWidth : 0), 1940 + offset);
			offset += 75;
		}
	}

	function getLines(ctx: CanvasRenderingContext2D, nameWidth: number, msg: string) {
		if (/\{n\}/.test(msg)) {
			const split = msg.split("{n}");
			const arr: string[] = [];
			for (let jj = 0; jj < split.length; jj++) {
				arr.push(...innerGetLines(nameWidth, split[jj]));
			}
			return arr;
		} else return innerGetLines(nameWidth, msg);
		function innerGetLines(nameWidth: number, msg: string) {
			const lineArr = [];
			var tempLine = "";
			for (let ii = 0; ii < msg.length; ii++) {
				var char = msg[ii];
				if (ctx.measureText(tempLine).width + (lineArr.length < 1 ? nameWidth : 0) > 1535) {
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
				tempLine += char;
			}
			return lineArr.concat(tempLine);
		}
	}
	fs.writeFileSync(`out/${twoDigits(index)}.png`, canvas.toBuffer());
}