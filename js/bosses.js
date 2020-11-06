import { assetLoader } from './assets.js';
import { Entity, entitiesManager } from './entity.js';
import { generate } from './view.js';
import { Animation } from './animation.js';
import { Enemy } from './enemies.js';
import { canvasData } from './globals.js';


export const MOWER_FRONT_WIDTH = 39;
export const MOWER_BACK_WIDTH = 37;
export const MOWER_SIDE_WIDTH = 59;
export const MOWER_HEIGHT = 62;
const MOWER_ATTACK_DELAY = 3 / 4;
const MOWER_ATTACK_DISTANCE = 16;
const FACE = {down: 0, left: 1, right: 2, up: 3};

export class LawnMowerBoss extends Enemy {
	constructor(x, y) {
		const animations = {
			down: generate(assetLoader.getImage("lawnmower.down")),
			left: generate(assetLoader.getImage("lawnmower.left")),
			up: generate(assetLoader.getImage("lawnmower.up")),
			right: generate(assetLoader.getImage("lawnmower.right")),
			accelDown: generate(assetLoader.getImage("lawnmowerAccel.down")),
			accelLeft: generate(assetLoader.getImage("lawnmowerAccel.left")),
			accelUp: generate(assetLoader.getImage("lawnmowerAccel.up")),
			accelRight: generate(assetLoader.getImage("lawnmowerAccel.right")),
			flamesDown: generate(assetLoader.getImage("lawnmowerFlames.down")),
			flamesLeft: generate(assetLoader.getImage("lawnmowerFlames.left")),
			flamesUp: generate(assetLoader.getImage("lawnmowerFlames.up")),
			flamesRight: generate(assetLoader.getImage("lawnmowerFlames.right")),
		};
		super({ x: x, y: y }, MOWER_BACK_WIDTH, MOWER_HEIGHT, { offsetY: 14, width: MOWER_BACK_WIDTH, height: MOWER_HEIGHT / 2 }, 60, 2, animations, "down");
		this.speed = 500;
		this.canCollideWithTypes.add('playerProjectile');
		this.vel = { x: 0, y: 0 };
		this.attackTimer = MOWER_ATTACK_DELAY;
		this.target = null;
		this.attacking = false;
		this.facing = FACE.down;
	}

	update(dt) {
		this.currentAnimation.update(dt);
		if (this.attacking) {
			if (this.currentAnimation.id.startsWith("lawnmowerFlames")) {
				if (!this.currentAnimation.playing) {
					switch(this.facing) {
					case FACE.down:
						this.changeAnimation(this.animations.down);
						break;
					case FACE.left:
						this.changeAnimation(this.animations.left);
						break;
					case FACE.up:
						this.changeAnimation(this.animations.up);
						break;
					case FACE.right:
						this.changeAnimation(this.animations.right);
						break;
					}
				}
			} else {
				this.pos.x += Math.round(this.vel.x * dt);
				this.pos.y += Math.round(this.vel.y * dt);
				this.attacking = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y) > MOWER_ATTACK_DISTANCE;
			}
		} else if (this.attackTimer <= 0) {
			let dist, minDist = Number.MAX_SAFE_INTEGER;
			let closestPlayer = null;
			const desiredVel = { x: 0, y: 0 };
			// find closest player
			for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
				dist = Math.hypot(player.pos.x - this.pos.x, player.pos.y - this.pos.y);
				if (dist < minDist) {
					minDist = dist;
					closestPlayer = player;
				}
			}
			this.target = Object.assign({}, closestPlayer.pos);
			this.attacking = true;
			this.attackTimer = Math.random() * (2 - 0.75) + 0.75;
			desiredVel.x = this.target.x - this.pos.x;
			desiredVel.y = this.target.y - this.pos.y;
			if (desiredVel.y > 0) {
				this.changeAnimation(this.animations.flamesDown);
				this.facing = FACE.down;
			} else if (desiredVel.y < 0) {
				this.changeAnimation(this.animations.flamesUp);
				this.facing = FACE.up;
			}
			if (desiredVel.x > Math.abs(desiredVel.y)) {
				this.changeAnimation(this.animations.flamesRight);
				this.facing = FACE.right;
			} else if (desiredVel.x < 0 && Math.abs(desiredVel.x) > Math.abs(desiredVel.y)) {
				this.facing = FACE.left;
				this.changeAnimation(this.animations.flamesLeft);
			}
			const mag = Math.hypot(desiredVel.x, desiredVel.y);
			this.vel.x = this.speed * desiredVel.x / mag;
			this.vel.y = this.speed * desiredVel.y / mag;
		} else {
			if (!this.currentAnimation.id.startsWith("lawnmowerAccel")) {
				switch(this.facing) {
				case FACE.down:
					this.changeAnimation(this.animations.accelDown);
					break;
				case FACE.left:
					this.changeAnimation(this.animations.accelLeft);
					break;
				case FACE.up:
					this.changeAnimation(this.animations.accelUp);
					break;
				case FACE.right:
					this.changeAnimation(this.animations.accelRight);
					break;
				}
			}
			this.attackTimer -= dt;
		}
		super.update(dt);
	}

	dt(dt) {
		this.attacking = false;
		super.onTopWallCollision(dt);
	}

	onLeftWallCollision(dt) {
		this.attacking = false;
		super.onLeftWallCollision(dt);
	}

	onBottomWallCollision(dt) {
		this.attacking = false;
		super.onBottomWallCollision(dt);
	}

	onRightWallCollision(dt) {
		this.attacking = false;
		super.onRightWallCollision(dt);
	}
}

class EnemyBullet extends Entity {
	constructor(posX, posY, dirX, dirY, velX, velY, anim) {
		super('enemyProjectile');
		this.canCollideWithTypes.add('player');
		this.collider.width = 3;
		this.collider.height = 3;
		this.reset(posX, posY, dirX, dirY, velX, velY);
		this.anim = anim;
		if (this.anim) this.anim.playing = true;
	}

	reset(posX, posY, dirX, dirY, velX, velY) {
		super.reset();
		this.pos = { x: posX, y: posY };
		this.vel = {
			x: dirX * 500 + velX,
			y: dirY * 500 + velY
		};
	}

	update(dt) {
		super.update(dt);
		if (this.anim) this.anim.update(dt);
		const vel = {
			x: this.vel.x * dt,
			y: this.vel.y * dt
		};
		if (Math.abs(vel.x) > 0 && Math.abs(vel.y) > 0) {
			vel.x *= Math.SQRT1_2;
			vel.y *= Math.SQRT1_2;
		}
		this.pos.x += Math.round(vel.x);
		this.pos.y += Math.round(vel.y);
		this.collider.x = this.pos.x - 1;
		this.collider.y = this.pos.y - 1;
		if (this.pos.x < 0 || this.pos.x > canvasData.canvas.width || this.pos.y < 0 || this.pos.y > canvasData.canvas.height) {
			this.die();
		}
	}

	draw() {
		super.draw();
		if (this.anim) {
			this.anim.draw(canvasData.context, this.pos.x-2, this.pos.y-2);
		} else {
			canvasData.context.fillStyle = 'white';
			canvasData.context.fillRect(this.pos.x - 2, this.pos.y - 2, 4, 4);
		}
	}
}

const FRIDGE_WIDTH = 32;
const FRIDGE_HEIGHT = 48;
const FRIDGE_ATTACK_DELAY = 5 / 4;
const FRIDGE_PROJECTILE_ATTACK_TIME = 1;
const FRIDGE_PROJECTILE_ATTACK_DELAY = 1 / 2;
const FRIDGE_PROJECTILE_ATTACK_AFTER_TURNS = 3;
const FRIDGE_SHOT_DELAY = 1 / 10;

export class FridgeBoss extends Enemy {
	constructor(x, y) {
		const animations = {
			wake: generate(assetLoader.getImage("fridge.wake")),
			idlel: generate(assetLoader.getImage("fridge.idlel")),
			idler: generate(assetLoader.getImage("fridge.idler")),
			idlem: generate(assetLoader.getImage("fridge.idlem")),
			shootl: generate(assetLoader.getImage("fridge.shootl")),
			shootr: generate(assetLoader.getImage("fridge.shootr")),
			shootm: generate(assetLoader.getImage("fridge.shootm")),
			aimltr: generate(assetLoader.getImage("fridge.aim.ltr")),
			aimltm: generate(assetLoader.getImage("fridge.aim.ltm")),
			aimmtl: generate(assetLoader.getImage("fridge.aim.mtl")),
			aimmtr: generate(assetLoader.getImage("fridge.aim.mtr")),
			aimrtl: generate(assetLoader.getImage("fridge.aim.rtl")),
			aimrtm: generate(assetLoader.getImage("fridge.aim.rtm")),
		};
		super({ x: x, y: y }, FRIDGE_WIDTH, FRIDGE_HEIGHT, { offsetY: 0, width: FRIDGE_WIDTH, height: FRIDGE_HEIGHT }, 100, 2, animations, "idlel");
		this.speed = 150;
		this.canCollideWithTypes.add('playerProjectile');
		this.vel = { x: 0, y: 0 };

		this.target = null;

		this.attacking = false;
		this.attackTimer = FRIDGE_ATTACK_DELAY;

		this.projectileAttacking = false;
		this.projectileAttackTimer = FRIDGE_PROJECTILE_ATTACK_TIME;

		this.projectileAttackAfterTurns = FRIDGE_PROJECTILE_ATTACK_AFTER_TURNS;

		this.shotTimer = 0;
	}

	update(dt) {
		this.currentAnimation.update(dt);

		if (this.projectileAttacking) {
			if (this.shotTimer <= 0) {
				var desiredVel = { x: 0, y: 0 };
				desiredVel.x = this.target.x - this.pos.x;
				desiredVel.y = this.target.y - this.pos.y;
				var mag = Math.hypot(desiredVel.x, desiredVel.y);

				if (mag === NaN) mag = 0;

				if (mag) {
					this.vel.x = this.speed * desiredVel.x / mag;
					this.vel.y = this.speed * desiredVel.y / mag;
				} else {
					this.vel.x = 0;
					this.vel.y = 0;
				}

				entitiesManager.spawn(EnemyBullet, this.pos.x + this.width / 2, this.pos.y + this.height / 2, 0, 0, this.vel.x, this.vel.y, 
					generate(assetLoader.getImage("icecube.dflt")));
				this.shotTimer = FRIDGE_SHOT_DELAY;
			}
			else {
				this.shotTimer -= dt;
			}

			this.projectileAttackTimer -= dt;
			if (this.projectileAttackTimer <= 0) {
				this.projectileAttacking = false;
			}
		}
		else if (this.attacking) {
			this.pos.x += Math.round(this.vel.x * dt);
			this.pos.y += Math.round(this.vel.y * dt);

			this.attacking = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y) > MOWER_ATTACK_DISTANCE;
		}
		else if (this.attackTimer <= 0) {
			this.vel.x = 0;
			this.vel.y = 0;

			let dist, minDist = Number.MAX_SAFE_INTEGER;
			let closestPlayer = null;

			const desiredVel = { x: 0, y: 0 };

			// find closest player
			for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
				dist = Math.hypot(player.pos.x - this.pos.x, player.pos.y - this.pos.y);
				if (dist === NaN) dist = 0;
				if (dist < minDist) {
					minDist = dist;
					closestPlayer = player;
				}
			}

			this.target = Object.assign({}, closestPlayer.pos);

			if (this.projectileAttackAfterTurns > 0) {
				this.attacking = true;
				this.attackTimer = Math.random() * (3 / 4 - 1 / 2) + 1 / 2;

				desiredVel.x = this.target.x - this.pos.x;
				desiredVel.y = this.target.y - this.pos.y;
				const mag = Math.hypot(desiredVel.x, desiredVel.y);

				if (mag === NaN) mag = 0;

				if (mag) {
					this.vel.x = this.speed * desiredVel.x / mag;
					this.vel.y = this.speed * desiredVel.y / mag;
				} else {
					this.vel.x = 0;
					this.vel.y = 0;
				}

				this.projectileAttackAfterTurns--;
			}
			else {
				this.projectileAttacking = true;
				this.projectileAttackTimer = FRIDGE_PROJECTILE_ATTACK_TIME;
				this.projectileAttackAfterTurns = FRIDGE_PROJECTILE_ATTACK_AFTER_TURNS;
			}
		}
		else {
			this.attackTimer -= dt;
		}

		if (this.vel.y > 0) {
			this.currentAnimation = this.animations.idlem;
		}
		else if (this.vel.y < 0) {
			this.currentAnimation = this.animations.idlem;
		}

		if (this.vel.x > Math.abs(this.vel.y)) {
			this.currentAnimation = this.animations.idler;
		}
		else if (this.vel.x < 0 && Math.abs(this.vel.x) > Math.abs(this.vel.y)) {
			this.currentAnimation = this.animations.idlel;
		}
		super.update(dt);
	}

	onTopWallCollision(dt) {
		this.attacking = false;
		super.onTopWallCollision(dt);
	}

	onLeftWallCollision(dt) {
		this.attacking = false;
		super.onLeftWallCollision(dt);
	}

	onBottomWallCollision(dt) {
		this.attacking = false;
		super.onBottomWallCollision(dt);
	}

	onRightWallCollision(dt) {
		this.attacking = false;
		super.onRightWallCollision(dt);
	}
}
