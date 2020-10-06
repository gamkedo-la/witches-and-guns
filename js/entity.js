import {canvasData} from './globals.js';

class EntitiesManager {
  constructor() {
	this.liveEntities = new Set();
	this.deadEntities = new Set();
	this.collisionListeners = {};
  }

  // TODO: implement entity recycling
  add(entity) {
	console.log('Add live entity', entity);
	this.liveEntities.add(entity);
  }

  kill(entity) {
	this.deadEntities.add(entity);
	this.liveEntities.delete(entity);
  }

  onCollision(type1, type2, func) {
	if (typeof(this.collisionListeners[type1+type2]) == "undefined") {
	  this.collisionListeners[type1+type2] = [func];
	} else {
	  this.collisionListeners[type1+type2].push(func);
	}
  }

  update(dt) {
	for (const entity of this.liveEntities) {
	  entity.update(dt);
	}
	for (const entity1 of this.liveEntities) {
	  if (entity1.needsCollisionCheck) {
		for (const entity2 of this.liveEntities) {
		  if (entity1 !== entity2 && entity2.needsCollisionCheck &&
			  entity1.canCollideWithTypes.has(entity2.type) &&
			  entity1.collider.x < entity2.collider.x + entity2.collider.width &&
			  entity1.collider.x + entity1.collider.width > entity2.collider.x &&
			  entity1.collider.y < entity2.collider.y + entity2.collider.height &&
			  entity1.collider.y + entity1.collider.height > entity2.collider.y) {
			const listeners = this.collisionListeners[entity1.type + entity2.type];
			if (typeof(listeners) != "undefined") {
			  for (const func of listeners) {
				if (entity1.alive && entity2.alive) {
				  func(entity1, entity2);
				}
			  }
			}
		  }
		}
	  }
	}
  }

  spawn(cls, ...args) {
	const available = [...this.deadEntities].filter(e => e instanceof cls);
	let entity;
	if (available.length) {
	  entity = available[0];
	  this.deadEntities.delete(entity);
	  entity.reset(...args);
	} else {
	  entity = new cls(...args);
	}
	entity.alive = true;
	this.add(entity);
	return entity;
  }
  
  draw() {
	for (const entity of this.liveEntities) {
	  entity.draw();
	}
  }
}

export const entitiesManager = new EntitiesManager();


const DEFAULT_HP = 10;
const DEFAULT_DAMAGE = 1;

export class Entity {
  constructor(type) {
	this.pos = {x: 0, y: 0};
	this.width = 0;
	this.height = 0;
	this.type = type;
	this.needsCollisionCheck = false;
	this.collider = {x: 0, y: 0, width: 0, height: 0};
	this.canCollideWithTypes = new Set();
	this.hp = DEFAULT_HP;
	this.damage = DEFAULT_DAMAGE;
	this.alive = false;
  }

  die() {
	this.alive = false;
	entitiesManager.kill(this);
  }

  hurt(damage) {
	this.hp -= damage;
	if (this.hp <= 0) {
	  this.die();
	}
  }
  
  reset() {
  }

  update(dt) {
	this.collider.x = this.pos.x + (this.width - this.collider.width)/2;
	this.collider.y = this.pos.y + (this.height - this.collider.height)/2;
  }

  draw() {
	if (window.debugMode && (this.collider.width > 0 || this.collider.height > 0)) {
	  canvasData.context.lineWidth = 1;
	  canvasData.context.strokeStyle = 'magenta';
	  canvasData.context.strokeRect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
	}
  }
}
