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
