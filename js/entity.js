import {canvasData} from './globals.js';
import { assetLoader } from './assets.js';
import { generate } from './view.js';

class EntitiesManager {
  constructor() {
	this.liveEntities = new Set();
	this.deadEntities = new Set();
	this.collisionListeners = {};
  }

  // TODO: implement entity recycling
  add(entity) {
	//console.log('Add live entity', entity);
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
	  for (const entity2 of this.liveEntities) {
		if (entity1 !== entity2 &&
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

  getLiveForType(type) {
	return [...this.liveEntities].filter(e => e.type == type);
  }
}

export const entitiesManager = new EntitiesManager();


const DEFAULT_HP = 10;
export const DEFAULT_DAMAGE = 1;

export class Entity {
  constructor(type, initialPos, width, height, collider, hp=DEFAULT_HP, damage=DEFAULT_DAMAGE, animations={}, initialAnimation='') {
	this.pos = Object.assign({}, initialPos);
	this.prevPos = Object.assign({}, this.pos);
	this.width = width;
	this.height = height;
	this.type = type;
	this.collider = Object.assign({x: 0, y: 0, offsetX: 0, offsetY: 0}, collider);
	this.canCollideWithTypes = new Set();
	this.hp = hp;
	this.maxHp = hp;
	this.damage = damage;
	this.alive = false;
	this.animations = animations;
	this.currentAnimation = this.animations[initialAnimation] || null;
	if (this.currentAnimation) {
	  this.currentAnimation.play();
	}
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

  heal(health) {
	this.hp += health;
	if (this.hp > this.maxHp) {
	  this.hp = this.maxHp;
	}
  }
  
  reset(x, y) {
	this.pos.x = x;
	this.pos.y = y;
	this.hp = this.maxHp;
  }

  onTopWallCollision(dt) {
  }

  onLeftWallCollision(dt) {
  }

  onBottomWallCollision(dt) {
  }
  
  onRightWallCollision(dt) {
  }

  performActions(dt) {
  }

  update(dt) {
	Object.assign(this.prevPos, this.pos);
	this.performActions(dt);
	if (this.pos.x < 0) {
	  this.pos.x = 0;
	  this.onLeftWallCollision(dt);
	}
	if (this.pos.y < 0) {
	  this.pos.y = 0;
	  this.onTopWallCollision(dt);
	}
	if (this.pos.x > canvasData.canvas.width - this.width) {
	  this.pos.x = canvasData.canvas.width - this.width;
	  this.onRightWallCollision(dt);
	}
	if (this.pos.y > canvasData.canvas.height - this.height) {
	  this.pos.y = canvasData.canvas.height - this.height;
	  this.onBottomWallCollision(dt);
	}
	this.collider.x = this.pos.x + (this.width - this.collider.width)/2 + this.collider.offsetX;
	this.collider.y = this.pos.y + (this.height - this.collider.height)/2 + this.collider.offsetY;
  }

  draw() {
	if (this.currentAnimation) {
	  this.currentAnimation.draw(canvasData.context, this.pos.x, this.pos.y);
	};
	if (window.debugMode && (this.collider.width > 0 || this.collider.height > 0)) {
		//WARM UP: when we make changes to the context state maching
		//it usually a good idea to wrap those calls in context.save()/context.restore()
		//calls, so here is a good spot to practice that.
	  canvasData.context.lineWidth = 1;
	  canvasData.context.strokeStyle = 'magenta';
	  canvasData.context.strokeRect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
	}
  }

  changeAnimation(animation) {
	if (this.currentAnimation != animation) {
		this.currentAnimation.stop();
		this.currentAnimation.currentFrameIndex = 0;
		this.currentAnimation = animation;
		this.currentAnimation.play();
	}
  }
}

export class DeathPoof extends Entity {
  constructor(deadEntity) {
	const animations = {poof: generate(assetLoader.getImage("poof"))};
	super("poof", {x: deadEntity.pos.x, y: deadEntity.pos.y}, 0, 0, {width: 23, height: 32}, 1, 1, animations, "poof");
	this.reset(deadEntity);
  }

  reset(deadEntity) {
	super.reset(deadEntity.pos.x, deadEntity.pos.y);
	this.currentAnimation.reset();
	this.currentAnimation.play();
  }

  update(dt) {
	super.update(dt);
	this.currentAnimation.update(dt);
	if (!this.currentAnimation.playing) {
	  this.die();
	}
  }
}
