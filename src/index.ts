import { Canvas, Image } from "canvas";
import * as fs from "fs";
import { circle, roundRect, twoDigits } from "./utils";

if (!fs.existsSync("out") || !fs.statSync("out").isDirectory()) fs.mkdirSync("out");

var index = 0;
if (!fs.existsSync("data.txt") || !fs.statSync("data.txt").isFile()) throw new Error("Cannot find data.txt");
for (const chunk of fs.readFileSync("data.txt", { encoding: "utf8" }).split("\n\n")) {
	const lines = chunk.split("\n");
	generator(++index, lines[0], lines[1], lines[2] === "null" ? null : lines[2], lines[3], lines[4], lines[5], lines[6], lines[7], lines[8]);
}

async function generator(index: number, ig0: string, chin: string, desc: string | null, ig1: string, msg1: string, ig2: string, msg2: string, ig3: string, msg3: string) {
	const fullStr = ig0 + desc + ig1 + msg1 + ig2 + msg2 + ig3 + msg3;
	const summedStrLen = fullStr.length + 6 + (fullStr.match(/\{n\}/g)?.length || 0) * 25;
	const height = 2200 + summedStrLen * 2;
	const canvas = new Canvas(1716, height);
	const ctx = canvas.getContext("2d");
	ctx.fillStyle = "white";
	//roundRect(ctx, 642, 273, 1715, 2454, 100);
	roundRect(ctx, 0, 0, 1716, height, 100);
	// x - 642
	// y - 273

	ctx.fillStyle = "black";
	circle(ctx, 96, 75, 151 / 2);

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
	if (fs.existsSync(`data/${twoDigits(index)}.png`)) photo.src = `data/${twoDigits(index)}.png`;
	else if (fs.existsSync(`data/${twoDigits(index)}.jpg`)) photo.src = `data/${twoDigits(index)}.jpg`;
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

	const allLines = [
		{ name: ig0, msg: desc },
		{ name: ig1, msg: msg1 },
		{ name: ig2, msg: msg2 },
		{ name: ig3, msg: msg3 }
	];
	var offset = 0;
	for (const lines of allLines) {
		if (!lines.name) continue;
		ctx.fillStyle = "black";
		ctx.font = "bold 58px Noto Sans CJK HK";
		ctx.fillText(lines.name, 90, 1962 + offset);
		const nameWidth = ctx.measureText(lines.name + "  ").width;

		if (!lines.msg) {
			offset += 75;
			continue;
		}
		ctx.font = "normal 50px Noto Sans CJK HK";
		if (/\{n\}/.test(lines.msg)) {
			const split = lines.msg.split("{n}");
			for (let jj = 0; jj < split.length; jj++) {
				makeBreaks(split[jj], jj !== 0);
			}
		} else makeBreaks(lines.msg);
		function makeBreaks(msg: string, noHoriOffset: boolean = false) {
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
			lineArr.push(tempLine);
			ctx.fillText(<string>lineArr.shift(), 90 + (noHoriOffset ? 0 : nameWidth), 1962 + offset);
			offset += 75;
			for (let ii = 0; ii < lineArr.length; ii++) {
				const line = lineArr[ii];
				ctx.fillText(line, 90, 1962 + offset);
				offset += 75;
			}
		}
	}
	fs.writeFileSync(`out/${twoDigits(index)}.png`, canvas.toBuffer());
}