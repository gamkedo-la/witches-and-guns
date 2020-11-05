import { assetLoader } from './assets.js';
import {entitiesManager} from './entity.js';
import { generate } from './view.js';
import {Animation} from './animation.js';
import {Enemy} from './enemies.js';


export const MOWER_FRONT_WIDTH = 39;
export const MOWER_BACK_WIDTH = 37;
export const MOWER_SIDE_WIDTH = 59;
export const MOWER_HEIGHT = 62;
const MOWER_ATTACK_DELAY = 3/4;
const MOWER_ATTACK_DISTANCE = 16;

export class LawnMowerBoss extends Enemy {
  constructor(x, y) {
	const animations = {
	  down:  generate(assetLoader.getImage("lawnmower.down")),
	  left: generate(assetLoader.getImage("lawnmower.left")),
	  up: generate(assetLoader.getImage("lawnmower.up")),
	  right: generate(assetLoader.getImage("lawnmower.right"))
	};
	super({x: x, y: y}, MOWER_BACK_WIDTH, MOWER_HEIGHT, {offsetY: 14, width: MOWER_BACK_WIDTH, height: MOWER_HEIGHT/2}, 60, 2, animations, "down");
	this.speed = 500;
	this.canCollideWithTypes.add('playerProjectile');
	this.vel = {x: 0, y: 0};
	this.attackTimer = MOWER_ATTACK_DELAY;
	this.target = null;
	this.attacking = false;
  }

  update(dt) {
	this.currentAnimation.update(dt);
	if (this.attacking) {
	  this.pos.x += Math.round(this.vel.x*dt);
	  this.pos.y += Math.round(this.vel.y*dt);
	  this.attacking = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y) > MOWER_ATTACK_DISTANCE;
	} else if (this.attackTimer <= 0) {
	  this.vel.x = 0;
	  this.vel.y = 0;
	  let dist, minDist = Number.MAX_SAFE_INTEGER;
	  let closestPlayer = null;
	  const desiredVel = {x: 0, y: 0};
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
	  this.attackTimer = Math.random()*(3/4 - 1/2) + 1/2;
	  desiredVel.x = this.target.x - this.pos.x;
	  desiredVel.y = this.target.y - this.pos.y;
	  const mag = Math.hypot(desiredVel.x, desiredVel.y);
	  this.vel.x = this.speed*desiredVel.x/mag;
	  this.vel.y = this.speed*desiredVel.y/mag;
	} else {
	  this.attackTimer -= dt;
	}
	if (this.vel.y > 0) {
	  this.currentAnimation = this.animations.down;
	} else if (this.vel.y < 0) {
 	  this.currentAnimation = this.animations.up;
	}
	if (this.vel.x > Math.abs(this.vel.y)) {
	  this.currentAnimation = this.animations.right;
	} else if (this.vel.x < 0 && Math.abs(this.vel.x) > Math.abs(this.vel.y)) {
	  this.currentAnimation = this.animations.left;
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

const FRIDGE_WIDTH = 32;
const FRIDGE_HEIGHT = 48;
const FRIDGE_ATTACK_DELAY = 5/4;

export class FridgeBoss extends Enemy {
  constructor(x, y) {
	const animations = {
	  wake:  generate(assetLoader.getImage("fridge.wake")),
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
	super({x: x, y: y}, FRIDGE_WIDTH, FRIDGE_HEIGHT, {offsetY: 0, width: FRIDGE_WIDTH, height: FRIDGE_HEIGHT}, 100, 2, animations, "idlel");
	this.speed = 150;
	this.canCollideWithTypes.add('playerProjectile');
	this.vel = {x: 0, y: 0};
	this.attackTimer = FRIDGE_ATTACK_DELAY;
	this.target = null;
	this.attacking = false;
  }

  update(dt) {
	this.currentAnimation.update(dt);
	if (this.attacking) {
	  this.pos.x += Math.round(this.vel.x*dt);
	  this.pos.y += Math.round(this.vel.y*dt);
	  this.attacking = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y) > MOWER_ATTACK_DISTANCE;
	} else if (this.attackTimer <= 0) {
	  this.vel.x = 0;
	  this.vel.y = 0;
	  let dist, minDist = Number.MAX_SAFE_INTEGER;
	  let closestPlayer = null;
	  const desiredVel = {x: 0, y: 0};
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
	  this.attacking = true;
	  this.attackTimer = Math.random()*(3/4 - 1/2) + 1/2;
	  desiredVel.x = this.target.x - this.pos.x;
	  desiredVel.y = this.target.y - this.pos.y;
	  const mag = Math.hypot(desiredVel.x, desiredVel.y);
	  if (mag === NaN) mag = 0;
	  if (mag) {
		this.vel.x = this.speed*desiredVel.x/mag;
		this.vel.y = this.speed*desiredVel.y/mag;
	  } else {
		this.vel.x = 0;
		this.vel.y = 0;
	  }
	} else {
	  this.attackTimer -= dt;
	}
	if (this.vel.y > 0) {
	  this.currentAnimation = this.animations.idlem;
	} else if (this.vel.y < 0) {
 	  this.currentAnimation = this.animations.idlem;
	}
	if (this.vel.x > Math.abs(this.vel.y)) {
	  this.currentAnimation = this.animations.idler;
	} else if (this.vel.x < 0 && Math.abs(this.vel.x) > Math.abs(this.vel.y)) {
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
