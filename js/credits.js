import { canvasData } from './globals.js';
import { Entity } from "./entity.js";


const CREDITS_SPEED = 1;

export class CreditLine extends Entity {
	constructor(text) {
		super("credit", {x: canvasData.canvas.width/2, y: canvasData.canvas.height}, 0, 0, {}, Infinity, 0, {}, '');
		this.reset(text);
	}

	reset(text) {
		const txtMetrics = canvasData.context.measureText(text);
		this.width = txtMetrics.width;
		this.height = txtMetrics.actualBoundingBoxAscent;
		this.text = text;
		super.reset(canvasData.canvas.width/2, canvasData.canvas.height + this.height);
	}

	update(dt) {
		this.pos.y -= Math.max(Math.round(CREDITS_SPEED*dt), 1);
		if (this.pos.y + this.height < 0) {
			this.die();
		}
	}

	draw() {
		const ctx = canvasData.context;
		ctx.save();
		ctx.textAlign = "center";
		// TODO: set font
		ctx.fillStyle = "cyan";
		ctx.fillText(this.text, this.pos.x, this.pos.y);
		ctx.restore();
	}
}

export const creditsData = [
	"Lorem ipsum dolor sit amet",
	"consectetur adipiscing elit.",
	"Duis malesuada ultrices quam nec vulputate.",
	"Lorem ipsum dolor sit amet",
	"consectetur adipiscing eLorem lit.",
	"Donec in ullamcorper nibh.",
	"Phasellus id eros id risus pellentesque venenatis.",
	"Donec aliquam vehicula lectus id blandit.",
	"Donec vel vulputate nisi.",
	"Integer in vehicula eros.",
	"Fusce dignissim luctus accumsan.",
	"Mauris consequat",
	"enim sed tempor fringilla",
	"lectus dolor luctus lacus",
	"in facilisis diam ante vel erat.",
	"Orci varius natoque penatibus et magnis dis parturient montes",
	"nascetur ridiculus mus.",
	"Donec gravida odio a turpis pellentesque",
	"quis porttitor nisi porttitor.",
	"Curabitur aliquet nibh eget finibus viverra.",
	"Praesent imperdiet bibendum eleifend."
];
