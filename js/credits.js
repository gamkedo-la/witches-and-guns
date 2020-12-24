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
	"Gonzalo Delgado": [
		"Project lead, core gameplay, enemy AI & pathfinding, sound",
		"code, sounds, waves, broom attack animation integration,",
		"lawnmower boss (art and code), pickups, washing machine art",
		"and animation, book enemy sprites, lawnmower flame animation,",
		"gardening shovel enemy, different gun support, gun spread,",
		"ammo limit, gun items, level skip cheat, game reset, rolling",
		"credits support, game over scene, death poof, laser gun,",
		"level progression implementation, player death animation,",
		"player sprites, game end logic"
	],
	"Tylor Allison": [
		"Room design and tile art (yard, kitchen, living room, laundry",
		"room), level grid implementation, tile layering, subtile",
		"support, animated tile support, fridge boss animations and",
		"taunts, ice cube animation integration, teapot animation,",
		"title screen and related transitions",
	],
	"Andrew Mushel": [
		"Player and shot velocity fixes, lifebar, lives display, dash",
		"ability gamepad support, player animation refactor, broom walk",
		"and attack animations",
	],
	"Bilal A. Cheema": [
		"Fridge boss ice cube attacks, fridge attack animation, level 3,",
		"TV boss animation and integration",
	],
	"Rutger McKenna": [
		"Menu icons (potion, pentagram, crystal ball, cauldron,",
		"necronomicon), projectile sprites",
	],
	"Grygoriy Kulesko": [
		"Book enemy animation integration, pause feature including",
		"overlay and recovery time",
	],
	"Ashleigh M.": [
		"Witch llama concept draft",
	],
	"Antonio Malafronte": [
		"Mute functionality",
	],
	"H Trayford": [
		"Placeholder description of keyboard controls",
	],
	"Chris DeLeon": [
		"Compiled credits",
	],
	"Wesley Stagg": [
		"Practice commit (welcome to HomeTeam!)",
	]
};
