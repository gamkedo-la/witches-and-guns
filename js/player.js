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
const FLASH_TIMEOUT = 0.11;
const INVINCIBLE_TIMEOUT = 3;
const CRYING_TIMEOUT = 2;
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
	constructor(controller, x, y, spriteId, initialAnimation = "right") {
		super("player", { x: x, y: y }, PLAYER_WIDTH, PLAYER_HEIGHT, { width: 12, height: 24 }, 10, 1);
		this.cryingAnimation = generate(assetLoader.getImage(spriteId + ".crying"));
		//this.lives = 3;
		this.prevCollider = Object.assign({}, this.collider);
		this.setBasicGun();
		this.initialPos = {x: x, y: y};
		this.spriteId = spriteId;
		this.reset(controller, x, y, spriteId);
	}

	setBasicGun() {
		this.gun = entitiesManager.spawn(Gun, this, GUNS.basic);
	}

	reset(controller, x = 0, y = 0, spriteId) {
		super.reset();
		this.spriteId = spriteId;
		// build animations
		this.animations = [
			[
				generate(assetLoader.getImage(spriteId + ".left")),
				generate(assetLoader.getImage(spriteId + ".right")),
				generate(assetLoader.getImage(spriteId + ".up")),
				generate(assetLoader.getImage(spriteId + ".down")),
			],
			[
				generate(assetLoader.getImage(spriteId + ".leftB")),
				generate(assetLoader.getImage(spriteId + ".rightB")),
				generate(assetLoader.getImage(spriteId + ".upB")),
				generate(assetLoader.getImage(spriteId + ".downB")),
			],
		];
		this.initialPos.x = x;
		this.initialPos.y = y;
		this.currentAnimation = this.animations[0][0];
		this.controller = controller;
		this.hp = 10;
		this.shotTimer = 0;
		this.flash = false;
		this.flashTimer = 0;
		this.invincible = true;
		this.invincibleTimer = 0;
		this.dashing = 0;
		this.enteringStage = true;
		this.crying = false;
		this.cryingTimer = 0;
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
		if (this.invincible && this.flash) {
			return;
		}
		if (canvasData.context) {
			// TODO: make animation objects draw to their own canvas and return an image here
			this.currentAnimation.draw(canvasData.context, this.pos.x, this.pos.y);
		}
		super.draw();
	}

	move(dt) {
		if (this.crying) {
			return;
		}
		if (this.enteringStage) {
			if (this.pos.x < canvasData.canvas.width/2) {
				this.aim.x = 1;
				this.vel.x = SPEED;
				// this.pos.x += Math.round(100*dt);
				this.enteringStage = this.pos.x < canvasData.canvas.width/2 - this.width*1.5;
			} else {
				this.aim.x = -1;
				this.vel.x = -SPEED;
				this.enteringStage = this.pos.x > canvasData.canvas.width/2 + this.width*1.5;
			}
		} else if (this.controller) {
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
		Object.assign(this.prevCollider, this.collider);
		this.pos.x += Math.round(this.vel.x * dt);
		this.pos.y += Math.round(this.vel.y * dt);
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
		if (this.enteringStage || !this.controller || this.crying) {
			return;
		}
		const state = this.controller.currentState;
		this.aim = getAxis(state.shootUp, state.shootDown, state.shootLeft, state.shootRight);
		if (state.shootUp || state.shootDown || state.shootLeft || state.shootRight) {
			this.gun.shoot(this.aim);
		}
	}

	animate(dt) {
		if (this.crying) {
			if (this.currentAnimation != this.cryingAnimation) {
				this.changeAnimation(this.cryingAnimation);
			}
			return;
		}
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

	performActions(dt) {
		this.move(dt);
		this.shoot(dt);
		this.animate(dt);
		if (this.invincible) {
			if (this.flashTimer >= FLASH_TIMEOUT) {
				this.flash = !this.flash;
				this.flashTimer = 0;
			} else {
				this.flashTimer += dt;
			}
			this.invincibleTimer += dt;
			if (this.invincibleTimer >= INVINCIBLE_TIMEOUT) {
				this.invincible = false;
				this.invincibleTimer = 0;
			}
		}
		if (this.crying) {
			this.cryingTimer += dt;
			if (this.cryingTimer >= CRYING_TIMEOUT) {
				this.reset(this.controller, this.initialPos.x, this.initialPos.y, this.spriteId);
			}
		}
		super.performActions(dt);
	}

	update(dt) {
		if (this.controller) {
			this.controller.update(dt);
		}
		super.update(dt);
	}

	die() {
		if (this.lives > 1) {
			this.lives--;
			this.crying = true;
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
