import { Canvas, Image } from "canvas";
import * as fs from "fs";
import { circle, getImage, roundRect, twoDigits } from "./utils";

if (!fs.existsSync("out") || !fs.statSync("out").isDirectory()) fs.mkdirSync("out");

for (let ii = 1; ii <= 29; ii++) generator(ii);

async function generator(index: number) {
	const canvas = new Canvas(1080, 1080);
	const ctx = canvas.getContext("2d");

	ctx.save();
	circle(ctx, 0, 0, 540, false);
	ctx.clip();
	const icon = new Image();
	icon.onload = () => {
		const shorterSide = Math.min(icon.naturalWidth, icon.naturalHeight);
		const width = icon.naturalWidth / shorterSide * 1080;
		const height = icon.naturalHeight / shorterSide * 1080;
		ctx.drawImage(icon, (1080 - width) / 2, (1080 - height) / 2, width, height);

		fs.writeFileSync(`out/${twoDigits(index)}.png`, canvas.toBuffer());
	}
	const src = getImage(`data/icons/icon_${twoDigits(index)}`);
	if (src) icon.src = src;
}