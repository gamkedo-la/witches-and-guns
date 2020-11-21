import { assetLoader } from './assets.js';
import { Entity, entitiesManager } from './entity.js';
import { generate } from './view.js';
import { Animation } from './animation.js';
import { Attack, Enemy, JumpAttackEnemy } from './enemies.js';
import { canvasData } from './globals.js';

export const MOWER_FRONT_WIDTH = 39;
export const MOWER_BACK_WIDTH = 37;
export const MOWER_SIDE_WIDTH = 59;
export const MOWER_HEIGHT = 62;
const MOWER_ATTACK_DELAY = 3 / 4;
const MOWER_ATTACK_DISTANCE = 16;
const FACE = { down: 0, left: 1, right: 2, up: 3 };

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
		this.attack = null;
	}

	update(dt) {
		this.currentAnimation.update(dt);
		if (this.attacking) {
			if (this.attack === null || !this.attack.alive) {
				let offset = { 0: 0 }, width, height;
				switch (this.facing) {
					case FACE.down:
						width = 35;
						height = 36;
						offset = { x: 2, y: 26 };
						break;
					case FACE.left:
						width = 39;
						height = 24;
						offset = { x: 0, y: 36 };
						break;
					case FACE.up:
						this.changeAnimation(this.animations.up);
						width = 35;
						height = 36;
						offset = { x: 2, y: 26 };
						break;
					case FACE.right:
						width = 39;
						height = 24;
						offset = { x: 21, y: 36 };
						break;
				}
				this.attack = entitiesManager.spawn(Attack, this, offset, width, height);
				this.attack.damage = 3;
			}
			if (this.currentAnimation.id.startsWith("lawnmowerFlames")) {
				if (!this.currentAnimation.playing) {
					switch (this.facing) {
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
				if (this.attack !== null && this.attack.alive) {
					this.attack.pos.x += Math.round(this.vel.x * dt);
					this.attack.pos.y += Math.round(this.vel.y * dt);
				}
				this.attacking = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y) > MOWER_ATTACK_DISTANCE;
			}
		} else if (this.attackTimer <= 0) {
			if (this.currentAnimation.id.startsWith("lawnmowerFlames")) {
				if (!this.currentAnimation.playing) {
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
						this.facing = FACE.down;
					} else if (desiredVel.y < 0) {
						this.facing = FACE.up;
					}
					if (desiredVel.x > Math.abs(desiredVel.y)) {
						this.facing = FACE.right;
					} else if (desiredVel.x < 0 && Math.abs(desiredVel.x) > Math.abs(desiredVel.y)) {
						this.facing = FACE.left;
					}
					const mag = Math.hypot(desiredVel.x, desiredVel.y);
					this.vel.x = this.speed * desiredVel.x / mag;
					this.vel.y = this.speed * desiredVel.y / mag;
				}
			} else if (!this.attacking) {
				switch (this.facing) {
					case FACE.down:
						this.changeAnimation(this.animations.flamesDown);
						break;
					case FACE.left:
						this.changeAnimation(this.animations.flamesLeft);
						break;
					case FACE.up:
						this.changeAnimation(this.animations.flamesUp);
						break;
					case FACE.right:
						this.changeAnimation(this.animations.flamesRight);
						break;
				}
			}
		} else {
			if (this.attack) {
				this.attack.die();
			}
			if (!this.currentAnimation.id.startsWith("lawnmowerAccel")) {
				switch (this.facing) {
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
			x: (dirX * 500.0) + velX,
			y: (dirY * 500.0) + velY
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
			this.anim.draw(canvasData.context, this.pos.x - 2, this.pos.y - 2);
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
		this.speed = 150.0;
		this.canCollideWithTypes.add('playerProjectile');
		this.vel = { x: 0, y: 0 };

		this.target = null;

		this.attacking = false;
		this.attackTimer = FRIDGE_ATTACK_DELAY;

		this.projectileAttacking = false;
		this.projectileAttackTimer = FRIDGE_PROJECTILE_ATTACK_TIME;
		this.projectileAttackIndex = 0;

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

				var sequenceVelX = [
					this.speed,
					this.speed,
					0,
					-this.speed,
					-this.speed,
					-this.speed,
					0,
					this.speedaas
				];
				var sequenceVelY = [
					0,
					this.speed,
					this.speed,
					this.speed,
					0,
					-this.speed,
					-this.speed,
					-this.speed,
				];
				var anims = [
					this.animations.aimltm,
					this.animations.aimltr,
					this.animations.aimltm,
					this.animations.aimmtl,
					this.animations.aimmtr,
					this.animations.aimrtl,
					this.animations.aimrtm,
					this.animations.aimrtl,
				]
				this.vel.x = sequenceVelX[this.projectileAttackIndex];
				this.vel.y = sequenceVelY[this.projectileAttackIndex];
				this.currentAnimation = anims[this.projectileAttackIndex];

				this.projectileAttackIndex++;
				if (this.projectileAttackIndex >= sequenceVelX.length)
					this.projectileAttackIndex = 0;

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
				this.projectileAttackIndex = 0;
			}
		}
		else if (this.attacking) {
			this.pos.x += Math.round(this.vel.x * dt);
			this.pos.y += Math.round(this.vel.y * dt);

			this.attacking = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y) > TV_ATTACK_DISTANCE;
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

export const TV_WIDTH = 64;
export const TV_HEIGHT = 40;
const TV_ATTACK_DELAY = 3;
const TV_ATTACK_DISTANCE = 20;

export class TVBoss extends Enemy {
	constructor(x, y) {
		const animations = {
			idle: generate(assetLoader.getImage("tv.idle")),
			att: generate(assetLoader.getImage("tv.att"))
		};
		super({ x: x, y: y }, TV_WIDTH, TV_HEIGHT, { width: TV_WIDTH, height: TV_HEIGHT }, 100, 2, animations, "idle");
		this.speed = 300;
		this.canCollideWithTypes.add('playerProjectile');
		this.vel = { x: 0, y: 0 };
		this.attackTimer = TV_ATTACK_DELAY;
		this.target = null;
		this.attacking = false;
		this.attack = null;
	}

	update(dt) {
		if(!this.currentAnimation.playing) this.currentAnimation.play();
		this.currentAnimation.update(dt);

		if (this.attacking) {
			this.pos.x += Math.round(this.vel.x * dt);
			this.pos.y += Math.round(this.vel.y * dt);

			this.attacking = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y) > TV_ATTACK_DISTANCE;

			this.currentAnimation = this.animations.att;
		}
		else if (this.attackTimer <= 0) {
			this.vel.x = 0;
			this.vel.y = 0;

			let dist, minDist = Number.MAX_SAFE_INTEGER;
			let closestPlayer = null;

			const desiredVel = { x: 0, y: 0 };

			// find closest player
			for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
				dist = Math.hypot(pplayer.pos.x - this.pos.x, player.pos.y - this.pos.y);
				if (dist === NaN) dist = 0;
				if (dist < minDist) {
					minDist = dist;
					closestPlayer = player;
				}
			}

			this.target = Object.assign({}, closestPlayer.pos);

			this.attacking = true;
			this.attackTimer = TV_ATTACK_DELAY - (Math.random() * 1.0);

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
		}
		else {
			this.currentAnimation = this.animations.idle;
			this.attackTimer -= dt;
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

export const WASHER_WIDTH = 51;
export const WASHER_OPEN_WIDTH = 69;
export const WASHER_HEIGHT = 67;
const WASHER_ATTACK_DELAY = 3 / 4;
const WASHER_MAX_JUMP_DIST = 48;
const WASHER_JUMP_SPEED = 120;


export class WasherBoss extends JumpAttackEnemy {
  constructor(x, y) {
	const animations = {
	  'idle': generate(assetLoader.getImage("washer.idle")),
	  'preJump': generate(assetLoader.getImage("washer.preJump")),
	  'jump': generate(assetLoader.getImage("washer.jump")),
	  'stomp': generate(assetLoader.getImage("washer.stomp")),
	  'open': generate(assetLoader.getImage("washer.open")),
	  'close': generate(assetLoader.getImage("washer.close")),
	};
	super({ x: x, y: y }, WASHER_WIDTH, WASHER_HEIGHT, { width: WASHER_WIDTH, height: WASHER_HEIGHT }, 100, 2, animations, "idle", WASHER_JUMP_SPEED, WASHER_ATTACK_DELAY, WASHER_MAX_JUMP_DIST, "washer.preJump", "jump", "stomp");
  }

  getPreJumpAnim() {
	return this.animations.preJump;
  }
}
