import {Animation} from './animation.js';
import {Entity, entitiesManager} from './entity.js';
import {canvasData} from './globals.js';


export class Enemy extends Entity {
  constructor(initialPos, width, height, collider, hp, damage, animations, initialAnimation) {
	super("enemy", initialPos, width, height, collider, hp, damage, animations, initialAnimation);
  }
}


const BROOM_WIDTH = 14;
const BROOM_HEIGHT = 26;

export class BroomEnemy extends Enemy {
  constructor(x, y) {
	const animations = {
	  walk: new Animation("broomEnemy", 200, [0, 1, 2], 0, 0, BROOM_WIDTH, BROOM_HEIGHT)
	};
	super({x: x, y: y}, BROOM_WIDTH, BROOM_HEIGHT, {width: 14, height: 14}, 1, 1, animations, "walk");
	this.speed = 50;
	this.needsCollisionCheck = true;
	this.canCollideWithTypes.add('playerProjectile');
	// TODO: facing
	this.vel = {x: 0, y: 0};
	this.attackDistance = 20;
	this.steerTimer = Math.random()*0.5 + 0.5;
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
	  } else {
		desiredVel.x = closestPlayer.pos.x - this.pos.x;
		desiredVel.y = closestPlayer.pos.y - this.pos.y;
		const mag = Math.sqrt(Math.pow(desiredVel.x, 2) + Math.pow(desiredVel.y, 2));
		desiredVel.x = this.speed*desiredVel.x/mag;
		desiredVel.y = this.speed*desiredVel.y/mag;
	  }
	  steer.x = desiredVel.x - this.vel.x;
	  steer.y = desiredVel.y - this.vel.y;
	  this.steerTimer = Math.random()*0.5 + 1;
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
	super.update(dt);
  }
}


