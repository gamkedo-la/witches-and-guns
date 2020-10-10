import {Animation} from './animation.js';
import {Entity, entitiesManager} from './entity.js';
import {canvasData} from './globals.js';


export class Enemy extends Entity {
  constructor(x, y) {
	super('enemy');
	this.hp = 1;
	this.speed = 50;
	this.width = 14;
	this.height = 26;
	this.needsCollisionCheck = true;
	this.canCollideWithTypes.add('playerProjectile');
	this.collider.width = 14;
	this.collider.height = 14;
	// TODO: facing
	this.animations = {
	  walk: new Animation("broomEnemy", 200, [0, 1, 2], 0, 0, this.width, this.height)
	};
	this.pos = {x: x, y: y};
	this.vel = {x: 0, y: 0};
	this.currentAnimation = this.animations.walk;
	this.currentAnimation.play();
	this.attackDistance = 20;
	this.steerTimer = Math.random()*0.5 + 0.5;
  }

  draw() {
	if (canvasData.context) {
	  this.currentAnimation.draw(canvasData.context, this.pos.x, this.pos.y);
	}
	super.draw();
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

	  if (this.pos.x < 0) {
		this.pos.x = 0;
	  }
	  if (this.pos.y < 0) {
		this.pos.y = 0;
	  }
	  if (this.pos.x > canvasData.canvas.width - this.width) {
		this.pos.x = canvasData.canvas.width - this.width;
	  }
	  if (this.pos.y > canvasData.canvas.height - this.height) {
		this.pos.y = canvasData.canvas.height - this.height;
	  }
	}
	super.update(dt);
  }

  collide(entity) {
	switch(entity.type) {
	case "playerProjectile":
	  this.die();
	}
  }
}
