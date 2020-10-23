import {entitiesManager} from './entity.js';
import {Animation} from './animation.js';
import {Enemy} from './enemies.js';


const MOWER_FRONT_WIDTH = 39;
const MOWER_HEIGHT = 62;
const MOWER_BACK_WIDTH = 37;
const MOWER_SIDE_WIDTH = 59;

export class LawnMowerBoss extends Enemy {
  constructor(x, y) {
	const animations = {
	  down:  new Animation("lawnmower", 1, [0], 0, 0, MOWER_FRONT_WIDTH, MOWER_HEIGHT),
	  left: new Animation("lawnmower", 1, [0], MOWER_FRONT_WIDTH, 0, MOWER_SIDE_WIDTH, MOWER_HEIGHT),
	  up: new Animation("lawnmower", 1, [0], MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + 1, 0, MOWER_BACK_WIDTH, MOWER_HEIGHT),
	  right: new Animation("lawnmower", 1, [0], MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, 0, MOWER_SIDE_WIDTH, MOWER_HEIGHT)
	};
	super({x: x, y: y}, MOWER_BACK_WIDTH, MOWER_HEIGHT, {offsetY: 14, width: MOWER_BACK_WIDTH, height: MOWER_HEIGHT/2}, 60, 2, animations, "down");
	this.speed = 120;
	this.canCollideWithTypes.add('playerProjectile');
	this.vel = {x: 0, y: 0};
	this.attackDistance = 10;
	this.steerTimer = 1/3;
  }

  update(dt) {
	let dist, minDist = Number.MAX_SAFE_INTEGER;
	this.currentAnimation.update(dt);
	let closestPlayer = null;
	const steer = {x: 0, y: 0};
	// find closest player
	for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
	  dist = Math.sqrt(Math.pow(player.pos.x - this.pos.x, 2) + Math.pow(player.pos.y - this.pos.y, 2));
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
	  this.steerTimer = 1/3;
	} else {
	  this.steerTimer -= dt;
	}
	if (minDist < this.attackDistance) {
	  // attack!
	} else {
	  // move towards player
	  this.vel.x += steer.x;
	  this.vel.y += steer.y;
	  this.pos.x += Math.round(this.vel.x*dt);
	  this.pos.y += Math.round(this.vel.y*dt);
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
}
