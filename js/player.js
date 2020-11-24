import { Animation } from './animation.js';
import { Entity, entitiesManager } from './entity.js';
import { canvasData } from './globals.js';
import { assetLoader } from './assets.js';
import { inputManager } from './input.js';
import { generate } from './view.js';
import { Gun, GUNS} from './guns.js';

const SPEED = 110;
const SHOTTIME = 1 / 12;
const DASH_SPEED = 400;
const DASH_TIME = 10;
const DASH_COOLDOWN = 24;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 32;

/*
const PLAYER_ANIMATIONS = {
  down: new Animation("player", 150, [0, 1, 2, 3], 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  left: new Animation("player", 150, [0, 1, 2, 3], PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  up: new Animation("player", 150, [0, 1, 2, 3], 2*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  right: new Animation("player", 150, [0, 1, 2, 3], 3*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  downB: new Animation("player", 150, [3, 2, 1, 0], 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  leftB: new Animation("player", 150, [3, 2, 1, 0], PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  upB: new Animation("player", 150, [3, 2, 1, 0], 2*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  rightB: new Animation("player", 150, [3, 2, 1, 0], 3*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT)
};

const PLAYER_ANIMATIONS_ARRAY = [
	[
		PLAYER_ANIMATIONS.left,
		PLAYER_ANIMATIONS.right,
		PLAYER_ANIMATIONS.up,
		PLAYER_ANIMATIONS.down,
	],
	[
		PLAYER_ANIMATIONS.leftB,
		PLAYER_ANIMATIONS.rightB,
		PLAYER_ANIMATIONS.upB,
		PLAYER_ANIMATIONS.downB, 
	],
];
*/

export class Player extends Entity {
	constructor(controller, x, y, initialAnimation = "right") {
		// build animations
		const anims = [
			[
				generate(assetLoader.getImage("player.left")),
				generate(assetLoader.getImage("player.right")),
				generate(assetLoader.getImage("player.up")),
				generate(assetLoader.getImage("player.down")),
			],
			[
				generate(assetLoader.getImage("player.leftB")),
				generate(assetLoader.getImage("player.rightB")),
				generate(assetLoader.getImage("player.upB")),
				generate(assetLoader.getImage("player.downB")),
			],
		];
		super("player", { x: x, y: y }, PLAYER_WIDTH, PLAYER_HEIGHT, { width: 12, height: 24 }, 10, 1, anims, initialAnimation);
		//this.lives = 3;
		this.prevPos = Object.assign({}, this.pos);
		this.setBasicGun();
		this.reset(controller, x, y);
	}

	setBasicGun() {
		this.gun = entitiesManager.spawn(Gun, this, GUNS.basic);
	}

	reset(controller, x = 0, y = 0) {
		super.reset();
		this.currentAnimation = this.animations[0][0];
		this.controller = controller;
		this.hp = 10;
		this.shotTimer = 0;
		this.dashing = 0;
		this.resetPosition(x, y);
	}

	resetPosition(x, y) {
		this.pos = { x: x, y: y };
		this.vel = { x: 0, y: 0 };
		this.aim = { x: 0, y: 0 };
	}

	get alive() { return this.lives > 0; }
	set alive(val) { this.lives = val ? 3 : 0; }

	draw() {
		if (canvasData.context) {
			// TODO: make animation objects draw to their own canvas and return an image here
			this.currentAnimation.draw(canvasData.context, this.pos.x, this.pos.y);
		}
		super.draw();
	}

	move(dt) {
		if (this.controller) {
			const state = this.controller.currentState;
			let cv = getAxis(state.up, state.down, state.left, state.right);

			if (this.dashing > -DASH_COOLDOWN) {
				this.dashing--;
			} else if (this.dashing <= - DASH_COOLDOWN && state.dash) {
				this.dashing = DASH_TIME;
				this.vel.x = cv.x * DASH_SPEED
				this.vel.y = cv.y * DASH_SPEED
			}

			if (this.dashing <= 0) {
				this.vel.x = cv.x * SPEED;
				this.vel.y = cv.y * SPEED;
			}
		}
		Object.assign(this.prevPos, this.pos);
		this.pos.x += Math.round(this.vel.x * dt);
		this.pos.y += Math.round(this.vel.y * dt);
	}

	stopWalking() {
		Object.assign(this.pos, this.prevPos);
		this.vel.x = 0;
		this.vel.y = 0;
	}

	onTopWallCollision(dt) {
		super.onTopWallCollision(dt);
		this.vel.y = 0;
	}

	onLeftWallCollision(dt) {
		super.onLeftWallCollision(dt);
		this.vel.x = 0;
	}

	onBottomWallCollision(dt) {
		super.onBottomWallCollision(dt);
		this.vel.y = 0;
	}

	onRightWallCollision(dt) {
		super.onRightWallCollision(dt);
		this.vel.x = 0;
	}

	shoot(dt) {
		if (!this.controller) {
			return;
		}
		const state = this.controller.currentState;
		this.aim = getAxis(state.shootUp, state.shootDown, state.shootLeft, state.shootRight);
		if (state.shootUp || state.shootDown || state.shootLeft || state.shootRight) {
			this.gun.shoot(this.aim);
		}
	}

	animate(dt) {
		const oldAnimation = this.currentAnimation;

		let animSet = (this.aim.x != 0 && this.aim.y != 0) ? 1 : 0;
		let axis = animSet ? this.aim : this.vel;
		if (axis.x != 0) {
			let index = axis.x < 0 ? 0 : 1;
			this.currentAnimation = this.animations[animSet][index];
		} else if (axis.y != 0) {
			let index = axis.y < 0 ? 0 : 1;
			this.currentAnimation = this.animations[animSet][index + 2];
		}

		if (this.currentAnimation != oldAnimation) {
			this.currentAnimation.reset();
		}

		if (this.vel.x != 0 || this.vel.y != 0) {
			this.currentAnimation.play();
		} else {
			this.currentAnimation.stop();
		}

		this.currentAnimation.update(dt);
	}

	update(dt) {
		if (this.controller) {
			this.controller.update(dt);
		}
		this.move(dt);
		this.shoot(dt);
		this.animate(dt);
		super.update(dt);
	}

	die() {
		if (this.lives > 1) {
			this.lives--;
			this.reset(this.controller, canvasData.canvas.width / 2, canvasData.canvas.height / 2);
		} else {
			entitiesManager.kill(this);
		}
	}
}

function getAxis(up, down, left, right) {
	let axis = { x: 0, y: 0 };

	if (up) axis.y += -1;
	if (down) axis.y += 1;
	if (left) axis.x += -1;
	if (right) axis.x += 1;

	if (axis.x != 0 && axis.y != 0) {
		axis.x *= Math.sqrt(0.8);
		axis.y *= Math.sqrt(0.8);
	}

	return axis;
}
