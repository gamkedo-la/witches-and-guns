import { canvasData } from './globals.js';
import { Entity } from "./entity.js";


const CREDITS_SPEED = 1;

export class CreditLine extends Entity {
	constructor(text, timeTilNextLine) {
		super("credit", {x: canvasData.canvas.width/2, y: canvasData.canvas.height}, 0, 0, {}, Infinity, 0, {}, '');
		this.reset(text, timeTilNextLine);
	}

	setUpContext() {
		const ctx = canvasData.context;
		ctx.save();
		ctx.textAlign = "center";
		ctx.font = "12px serif";
		ctx.fillStyle = "cyan";
	}

	restoreContext() {
		const ctx = canvasData.context;
		ctx.restore();
	}

	setDimensions() {
		this.setUpContext();
		const txtMetrics = canvasData.context.measureText(this.text);
		this.width = txtMetrics.width;
		this.height = txtMetrics.actualBoundingBoxAscent;
		this.restoreContext();
	}

	reset(text, timeTilNextLine) {
		this.text = text;
		this.timeTilNextLine = timeTilNextLine;
		this.setDimensions();
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
		this.setUpContext();
		ctx.fillText(this.text, this.pos.x, this.pos.y);
		this.restoreContext();
	}
}

export class AuthorLine extends CreditLine {
	setUpContext() {
		super.setUpContext();
		canvasData.context.font = "bold 20px serif";
	}

	reset(text, timeTilNextLine) {
		super.reset(text, timeTilNextLine + 1/8);
	}
}

export const creditsData = {
	"John Doe": [
		"Lorem ipsum dolor sit amet",
		"consectetur adipiscing elit.",
		"Duis malesuada ultrices quam nec vulputate.",
		"Lorem ipsum dolor sit amet",
		"consectetur adipiscing eLorem lit.",
	],
	"Jane Doe": [
		"Donec in ullamcorper nibh.",
		"Phasellus id eros id risus pellentesque venenatis.",
		"Donec aliquam vehicula lectus id blandit.",
		"Donec vel vulputate nisi.",
	],
	"Guy Incognito": [
		"Integer in vehicula eros.",
		"Fusce dignissim luctus accumsan.",
		"Mauris consequat",
		"enim sed tempor fringilla",
		"lectus dolor luctus lacus",
		"in facilisis diam ante vel erat.",
	],
};
