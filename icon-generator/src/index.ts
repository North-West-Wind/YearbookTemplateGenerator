import { Canvas, Image } from "canvas";
import * as fs from "fs";
import { circle, getImage, roundRect, twoDigits } from "./utils";

if (!fs.existsSync("out") || !fs.statSync("out").isDirectory()) fs.mkdirSync("out");

for (let ii = 1; ii <= 29; ii++) generator(ii);

function generator(index: number) {
	const icon = new Image();
	icon.onload = () => {
		const shorterSide = Math.min(icon.naturalWidth, icon.naturalHeight);

		const canvas = new Canvas(302, 302);
		const ctx = canvas.getContext("2d");

		circle(ctx, 0, 0, canvas.width / 2, false);
		ctx.clip();

		const width = icon.naturalWidth / shorterSide * canvas.width;
		const height = icon.naturalHeight / shorterSide * canvas.height;
		ctx.drawImage(icon, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);

		fs.writeFileSync(`out/${twoDigits(index)}.png`, canvas.toBuffer());
	}
	const src = getImage(`data/icons/icon_${twoDigits(index)}`);
	if (src) icon.src = src;
}