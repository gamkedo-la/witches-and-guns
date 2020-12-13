import {Animation} from './animation.js';
import { assetLoader } from './assets.js';
import {DeathPoof, Entity, entitiesManager, DEFAULT_DAMAGE} from './entity.js';
import {canvasData} from './globals.js';
import { generate } from './view.js';


export class Enemy extends Entity {
  constructor(initialPos, width, height, collider, hp, damage, animations, initialAnimation) {
	super("enemy", initialPos, width, height, collider, hp, damage, animations, initialAnimation);
  }

  die() {
	entitiesManager.spawn(DeathPoof, this);
	super.die();
  }
}


export class Attack extends Entity {
  constructor(parent, offset, width, height) {
	super("enemyAttack", {x: parent.pos.x - offset.x, y: parent.pos.y - offset.y}, 0, 0, {width: width, height: height}, 1, 1);
	this.offset = offset;
	this.parent = parent;
	this.canCollideWithTypes.add("player");
  }


  reset(parent, offset, width, height) {
	super.reset(parent.pos.x + offset.x, parent.pos.y + offset.y);
	this.parent = parent;
	this.offset = offset;
	this.damage = DEFAULT_DAMAGE;
	this.collider.x = this.pos.x;
	this.collider.y = this.pos.y;
	this.collider.width = width;
	this.collider.height = height;
  }

  draw() {
	  if (this.alive && window.debugMode) {
		canvasData.context.fillStyle = 'red';
		canvasData.context.fillRect(this.pos.x, this.pos.y, this.collider.width, this.collider.height);
	  }
  }

  performActions(dt) {
	super.performActions(dt);
	this.pos.x = this.parent.pos.x + this.offset.x;
	this.pos.y = this.parent.pos.y + this.offset.y;
  }

  update(dt) {
	if (!this.parent.alive) {
	  this.die();
	} else {
	  super.update(dt);
	}
  }
}

const BROOM_WIDTH = 14;
const BROOM_HEIGHT = 26;
const BROOM_ATTACK_WIDTH = 28;
const BROOM_HEADBUTT_FRAME = 4;

export class BroomEnemy extends Enemy {
  constructor(x, y) {
	const animations = {
	  walkRight: generate(assetLoader.getImage("broom.walkRight")),
	  walkLeft: generate(assetLoader.getImage("broom.walkLeft")),
	  attackRight: generate(assetLoader.getImage("broom.attackRight")),
	  attackLeft: generate(assetLoader.getImage("broom.attackLeft")),
	  //walk: new Animation("broomEnemy", 200, [0, 1, 2], 0, 0, BROOM_WIDTH, BROOM_HEIGHT),
	  //attack: new Animation("broomEnemy", [100, 200, 100, 50, 200, 50], [0, 1, 2, 3, 4, 5], BROOM_WIDTH, 0, BROOM_ATTACK_WIDTH, BROOM_HEIGHT)
	};
	animations.attackRight.loop = animations.attackLeft.loop = false;

	super({x: x, y: y}, BROOM_WIDTH, BROOM_HEIGHT, {width: 14, height: 14}, 1, 1, animations, "walkRight");
	this.speed = 50;
	this.canCollideWithTypes.add('playerProjectile');
	// TODO: facing
	this.dir = {x: 1, y: 0};
	this.vel = {x: 0, y: 0};
	this.attackDistance = 20;
	this.steerTimer = Math.random()*0.5 + 0.5;
	this.headButt = entitiesManager.spawn(Attack, this, 0, 0, BROOM_ATTACK_WIDTH - 8, BROOM_HEIGHT/4);
	console.log(this);
  }

  performActions(dt) {
	let dist, minDist = Number.MAX_SAFE_INTEGER;
	this.currentAnimation.update(dt);
	let closestPlayer = null;
	const steer = {x: 0, y: 0};
	// find closest player
	for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
	  dist = Math.hypot(player.pos.x - this.pos.x, player.pos.y - this.pos.y);
	  if (dist < minDist) {
		minDist = dist;
		closestPlayer = player;
	  }
	}
	if (this.steerTimer <= 0) {
	  // Steering vehicle behavior, based on https://natureofcode.com/book/chapter-6-autonomous-agents/
	  const desiredVel = {x: 0, y: 0};
	  if (closestPlayer === null) {
		console.error('Could not find player closest to %s', this);
		this.currentAnimation.stop();
	  } else {
		desiredVel.x = closestPlayer.pos.x - this.pos.x;
		desiredVel.y = closestPlayer.pos.y - this.pos.y;
		const mag = Math.hypot(desiredVel.x, desiredVel.y);
		desiredVel.x = this.speed*desiredVel.x/mag;
		desiredVel.y = this.speed*desiredVel.y/mag;
	  }
	  steer.x = desiredVel.x - this.vel.x;
	  steer.y = desiredVel.y - this.vel.y;
	  this.steerTimer = Math.random()*0.5 + 1;
	} else {
	  this.steerTimer -= dt;
	}

	if (minDist < this.attackDistance && !this.attacking) {
		this.dir.x = (closestPlayer.pos.x - this.pos.x);
		const attack = (this.dir.x > 0) ? this.animations.attackRight : this.animations.attackLeft;
		this.changeAnimation(attack);

		let deltaX = (this.pos.x - closestPlayer.pos.x);
		let offsetX = this.width/2 + (deltaX > 0 ? -BROOM_ATTACK_WIDTH : 0);
		this.headButt.reset(this, {x: offsetX, y: BROOM_HEIGHT/4}, BROOM_ATTACK_WIDTH, BROOM_HEIGHT/4);
	}

	if (this.attacking) {
	  // Attack lasts as much as the actual frame of animation where the broom is attacking
	  if (this.currentAnimation.currentFrameIndex == BROOM_HEADBUTT_FRAME) {
		this.headButt.alive = true;
	  }

	  // Transition back to walk when attack completes
	  if (!this.currentAnimation.playing) {
		this.headButt.alive = false;
		if (this.dir.x >= 0) this.changeAnimation(this.animations.walkRight);
		else this.changeAnimation(this.animations.walkLeft);
	  }
	} else {
	  // move towards player
	  this.vel.x += steer.x;
	  this.vel.y += steer.y;
	  this.pos.x += Math.round(this.vel.x*dt);
	  this.pos.y += Math.round(this.vel.y*dt);

	  if (steer.x != 0) this.dir.x = steer.x;
	  if (steer.y != 0) this.dir.y = steer.y;

	  if (this.dir.x >= 0) this.changeAnimation(this.animations.walkRight);
	  else this.changeAnimation(this.animations.walkLeft);
	}
	super.performActions(dt);
  }

  die() {
	if (this.headButt && this.headButt.alive) {
	  this.headButt.die();
	}
	super.die();
  }

  reset(x, y) {
	super.reset(x, y);
	this.headButt = entitiesManager.spawn(Attack, this, 0, 0, BROOM_ATTACK_WIDTH - 8, BROOM_HEIGHT/4);
  }

  get attacking() {
	  return (this.currentAnimation == this.animations.attackLeft || this.currentAnimation == this.animations.attackRight);
  }
}


export const JUMP_GRAVITY = 300;

export class JumpAttackEnemy extends Enemy {
  constructor(initialPos, width, height, collider, hp, damage, animations, initialAnimation, jumpSpeed, attackDelay, maxJumpDist, preJumpAnimPrefix, jumpAnimId, landAnimId) {
	super(initialPos, width, height, collider, hp, damage, animations, initialAnimation);
	this.target = null;
	this.jumping = false;
	this.attacking = false;
	this.attack = null;
	this.jumpSpeed = jumpSpeed;
	this.jumpTimer = this.attackDelay = attackDelay;
	this.maxJumpDist = maxJumpDist;
	this.preJumpAnimPrefix = preJumpAnimPrefix;
	this.jumpAnimId = jumpAnimId;
	this.landAnimId = landAnimId;
	this.vel = {x: 0, y: 0};
  }

  findTarget() {
	let closestPlayer = null;
	let dist, minDist = Number.MAX_SAFE_INTEGER;
	for (const player of entitiesManager.getLiveForType("player")) {
	  dist = Math.hypot(player.pos.x - this.pos.x, player.pos.y - this.pos.y);
	  if (dist < minDist) {
		minDist = dist;
		closestPlayer = player;
	  }
	}
	if (dist > this.maxJumpDist) {
	  const angle = Math.atan2(closestPlayer.pos.x, closestPlayer.pos.y) + Math.random()*(Math.PI/3);
	  const signX = Math.sign(closestPlayer.pos.x - this.pos.x);
	  const signY = Math.sign(closestPlayer.pos.y - this.pos.y);
	  this.target = {
		x: Math.round(this.pos.x + signX*Math.cos(angle)*this.maxJumpDist),
		y: Math.round(this.pos.y + signY*Math.sin(angle)*this.maxJumpDist)
	  };
	} else {
	  this.target = {
		x: closestPlayer.pos.x + Math.floor(Math.random() * 5 - 2),
		y: closestPlayer.pos.y + Math.floor(Math.random() * 5 - 2)
	  };
	}
  }

  getPreJumpAnim() {
	throw new Error("Not implemented");
  }

  update(dt) {	
	this.currentAnimation.update(dt);
	super.update(dt);
	if (this.jumping) {
	  if (this.currentAnimation.id.startsWith(this.preJumpAnimPrefix)) {
	  	if (!this.currentAnimation.playing) {
		  this.changeAnimation(this.animations[this.jumpAnimId]);
		}
	  } else {
		this.vel.y += JUMP_GRAVITY*dt;
		this.pos.x += Math.round(this.vel.x*dt);
		this.pos.y += Math.round(this.vel.y*dt);
		this.attacking = this.vel.y > 0;
		this.jumping = !(this.attacking && this.pos.y > this.target.y);
	  }
	} else if (this.jumpTimer <= 0) {
	  this.findTarget();
	  const preJumpAnim = this.getPreJumpAnim();
	  if (this.currentAnimation != preJumpAnim) {
		this.changeAnimation(preJumpAnim);
	  }
	  this.jumping = true;
	  this.vel.y = -this.jumpSpeed;
	  this.vel.x = Math.sign(this.target.x - this.pos.x) * this.jumpSpeed/2;
	  this.jumpTimer = this.attackDelay;
	} else {
	  if (this.currentAnimation === this.animations[this.jumpAnimId]) {
		this.changeAnimation(this.animations[this.landAnimId]);
	  } else if (this.currentAnimation === this.animations[this.landAnimId] && !this.currentAnimation.playing) {
		this.changeAnimation(this.animations.idle);
	  }
	  this.attacking = false;
	  this.vel.x = 0;
	  this.vel.y = 0;
	  this.jumpTimer -= dt;
	}
	if (this.attacking) {
	  if (this.attack === null) {
		this.attack = entitiesManager.spawn(Attack, this, {x: 0, y: this.height/2}, this.width, this.height/2);
	  }
	} else if (this.attack !== null) {
	  this.attack.die();
	  this.attack = null;
	}
  }
}

export const SHOVEL_WIDTH = 16;
export const SHOVEL_HEIGHT = 24;
const SHOVEL_ATTACK_DELAY = 3 / 4;
const SHOVEL_MAX_JUMP_DIST = 48;
const SHOVEL_JUMP_SPEED = 120;

export class ShovelEnemy extends JumpAttackEnemy {
  constructor(x, y) {
	const animations = {
	  idle: generate(assetLoader.getImage("shovel.idle")),
	  bendLeft: generate(assetLoader.getImage("shovel.bendLeft")),
	  bendRight: generate(assetLoader.getImage("shovel.bendRight")),
	  jump: generate(assetLoader.getImage("shovel.jump")),
	  land: generate(assetLoader.getImage("shovel.land")),
	};
	super({x: x, y: y}, SHOVEL_WIDTH, SHOVEL_HEIGHT, {width: 12, height: 14}, 1, 1, animations, "idle", SHOVEL_JUMP_SPEED, SHOVEL_ATTACK_DELAY, SHOVEL_MAX_JUMP_DIST, "shovel.bend", "jump", "land");
  }

  draw() {
	super.draw();
	if (this.target) {
	  canvasData.context.fillStyle = 'red';
	  canvasData.context.arc(this.target.x, this.target.y, 2, 0, Math.PI);
	}
  }

  getPreJumpAnim() {
	return this.target.x > this.pos.x ? this.animations.bendLeft : this.animations.bendRight;
  }
}

export class FlyingBookEnemy extends Enemy {
	constructor(x, y) {
		const animations = {
			walkUp: generate(assetLoader.getImage("book.walkUp")),
			walkRight: generate(assetLoader.getImage("book.walkRight")),
			walkDown: generate(assetLoader.getImage("book.walkDown")),
			walkLeft: generate(assetLoader.getImage("book.walkLeft"))
		};
		animations.walkDown.loop = animations.walkDown.loop = false;

		super({x: x, y: y}, BROOM_WIDTH, BROOM_HEIGHT, {width: 14, height: 14}, 1, 1, animations, "walkRight");
		this.speed = 50;
		this.canCollideWithTypes.add('playerProjectile');

		this.dir = {x: 1, y: 0};
		this.vel = {x: 0, y: 0};
		this.attackDistance = 20;
		this.steerTimer = Math.random()*0.5 + 0.5;
		this.headButt = entitiesManager.spawn(Attack, this, 0, 0, BROOM_ATTACK_WIDTH - 8, BROOM_HEIGHT/4);
		console.log(this);
	}

	performActions(dt) {
		let dist, minDist = Number.MAX_SAFE_INTEGER;
		this.currentAnimation.update(dt);
		let closestPlayer = null;
		const steer = {x: 0, y: 0};
		// find closest player
		for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
			dist = Math.hypot(player.pos.x - this.pos.x, player.pos.y - this.pos.y);
			if (dist < minDist) {
				minDist = dist;
				closestPlayer = player;
			}
		}
		if (this.steerTimer <= 0) {
			// Steering vehicle behavior, based on https://natureofcode.com/book/chapter-6-autonomous-agents/
			const desiredVel = {x: 0, y: 0};
			if (closestPlayer === null) {
				console.error('Could not find player closest to %s', this);
				this.currentAnimation.stop();
			} else {
				desiredVel.x = closestPlayer.pos.x - this.pos.x;
				desiredVel.y = closestPlayer.pos.y - this.pos.y;
				const mag = Math.hypot(desiredVel.x, desiredVel.y);
				desiredVel.x = this.speed*desiredVel.x/mag;
				desiredVel.y = this.speed*desiredVel.y/mag;
			}
			steer.x = desiredVel.x - this.vel.x;
			steer.y = desiredVel.y - this.vel.y;
			this.steerTimer = Math.random()*0.5 + 1;
		} else {
			this.steerTimer -= dt;
		}

		// move
		this.vel.x += steer.x;
		this.vel.y += steer.y;
		this.pos.x += Math.round(this.vel.x * dt);
		this.pos.y += Math.round(this.vel.y * dt);

		if (steer.x != 0) this.dir.x = steer.x;
		if (steer.y != 0) this.dir.y = steer.y;

		if (this.dir.x >= 0) {
				this.changeAnimation(this.animations.walkRight);
		} else {
				this.changeAnimation(this.animations.walkLeft);
		}
		super.performActions(dt);
	}

	die() {
		if (this.headButt && this.headButt.alive) {
			this.headButt.die();
		}
		super.die();
	}

	get attacking() {
		return (this.currentAnimation == this.animations.attackLeft || this.currentAnimation == this.animations.attackRight);
	}
}
