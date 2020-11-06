import {Animation} from './animation.js';
import { assetLoader } from './assets.js';
import {Entity, entitiesManager, DEFAULT_DAMAGE} from './entity.js';
import {canvasData} from './globals.js';
import { generate } from './view.js';


export class Enemy extends Entity {
  constructor(initialPos, width, height, collider, hp, damage, animations, initialAnimation) {
	super("enemy", initialPos, width, height, collider, hp, damage, animations, initialAnimation);
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
	this.collider.width = width;
	this.collider.height = height;
  }

  draw() {
	  if (this.alive && window.debugMode) {
		canvasData.context.fillStyle = 'red';
		canvasData.context.fillRect(this.x, this.y, this.collider.width, this.collider.height);
	  }
  }

  get x() { return this.parent.pos.x + this.offset.x; }
  get y() { return this.parent.pos.y + this.offset.y; }
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

  update(dt) {
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
	super.update(dt);
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
