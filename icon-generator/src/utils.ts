import * as fs from "fs";

// I doubt anyone would use SVG for profile pic
const USABLE_EXTENSIONS = ["png", "jpg", "jpeg", "svg"];

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: { tl?: number, tr?: number, bl?: number, br?: number } | number, fill: boolean = true, stroke: boolean = false) {
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	var tl, tr, bl, br;
	if (typeof radius === 'number') tl = tr = bl = br = radius;
	else {
		tl = radius.tl || 0;
		tr = radius.tr || 0;
		br = radius.br || 0;
		bl = radius.bl || 0;
	}
	ctx.beginPath();
	ctx.moveTo(x + tl, y);
	ctx.lineTo(x + width - tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
	ctx.lineTo(x + width, y + height - br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
	ctx.lineTo(x + bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
	ctx.lineTo(x, y + tl);
	ctx.quadraticCurveTo(x, y, x + tl, y);
	ctx.closePath();
	if (fill) ctx.fill();
	if (stroke) ctx.stroke();
}

export function circle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: boolean = true, stroke: boolean = false) {
	ctx.beginPath();
	ctx.arc(x + radius, y + radius, radius, 0, 2*Math.PI, false);
	if (fill) ctx.fill();
	if (stroke) ctx.stroke();
}

export function twoDigits(d: number) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

export function getImage(path: string) {
	for (const ext of USABLE_EXTENSIONS) {
		if (fs.existsSync(`${path}.${ext.toLowerCase()}`)) return `${path}.${ext.toLowerCase()}`;
		else if (fs.existsSync(`${path}.${ext.toUpperCase()}`)) return `${path}.${ext.toUpperCase()}`;
	}
	return null;
}