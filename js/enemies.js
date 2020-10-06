import {Animation} from './animation.js';
import {Entity, entitiesManager} from './entity.js';
import {canvasData} from './globals.js';
import {imageLoader} from './assets.js';


export class Enemy extends Entity {
  constructor(x, y) {
	super('enemy');
	this.hp = 1;
	this.speed = 80;
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
	this.attackDistance = 10;
	this.disperseTimer = 1;
  }

  draw() {
	if (canvasData.context) {
	  this.currentAnimation.draw(canvasData.context, this.pos.x, this.pos.y);
	}
	super.draw();
  }

  update(dt) {
	this.currentAnimation.update(dt);
	if (this.disperseTimer > 0) {
	  const disperseVel = {x: Math.random()*this.speed,  y: Math.random()*this.speed};
	  this.disperseTimer -= dt;
	  this.pos.x += Math.round(disperseVel.x*dt);
	  this.pos.y += Math.round(disperseVel.y*dt);
	  return;
	}
	// find closest player
	let closestPlayer = null;
	let dist, minDist = Number.MAX_SAFE_INTEGER;
	for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
	  dist = Math.sqrt(Math.pow(player.pos.x - this.pos.x, 2) + Math.pow(player.pos.y - this.pos.y, 2));
	  if (dist < minDist) {
		minDist = dist;
		closestPlayer = player;
	  }
	}
	if (closestPlayer === null) {
	  // console.error('Could not find player closest to %s', this);
	  return;
	}
	if (minDist < this.attackDistance) {
	  // attack!
	} else {
	  // move towards it at some speed
	  const dir = {
		x: closestPlayer.pos.x - this.pos.x,
		y: closestPlayer.pos.y - this.pos.y
	  };
	  const mag = Math.sqrt(Math.pow(dir.x, 2) + Math.pow(dir.y, 2));
	  dir.x = dir.x/mag;
	  dir.y = dir.y/mag;
	  const vel = {
		x: dt*this.speed*dir.x,
		y: dt*this.speed*dir.y
	  };
	  if (Math.abs(vel.x) > 0 && Math.abs(vel.y) > 0) {
		vel.x *= Math.SQRT1_2;
		vel.y *= Math.SQRT1_2;
	  }
	  this.pos.x += Math.round(vel.x*(Math.random() + 1));
	  this.pos.y += Math.round(vel.y*(Math.random() + 1));
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
