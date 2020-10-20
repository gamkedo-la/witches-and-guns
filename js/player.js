import {Animation} from './animation.js';
import {Entity, entitiesManager} from './entity.js';
import {canvasData} from './globals.js';
import {assetLoader} from './assets.js';
import {inputManager} from './input.js';


const SPEED = 110;
const SHOTSPEED = 320;
const SHOTTIME = 1/12;


class Bullet extends Entity {
  constructor(posX, posY, dirX, dirY, velX, velY) {
	super('playerProjectile');
	this.canCollideWithTypes.add('enemy');
	this.collider.width = 3;
	this.collider.height = 3;
	this.reset(posX, posY, dirX, dirY, velX, velY);
  }

  reset(posX, posY, dirX, dirY, velX, velY) {
	super.reset();
	this.pos = {x: posX, y: posY};
	this.vel = {
	  x: dirX*SHOTSPEED + velX,
	  y: dirY*SHOTSPEED + velY
	};
  }

  update(dt) {
	super.update(dt);
	const vel = {
	  x: this.vel.x*dt,
	  y: this.vel.y*dt
	};
	if (Math.abs(vel.x) > 0 && Math.abs(vel.y) > 0) {
	  vel.x *= Math.SQRT1_2;
	  vel.y *= Math.SQRT1_2;
	}
	this.pos.x += Math.round(vel.x);
	this.pos.y += Math.round(vel.y);
	this.collider.x = this.pos.x - 1;
	this.collider.y = this.pos.y - 1;
	if (this.pos.x < 0 || this.pos.x > canvasData.canvas.width || this.pos.y < 0 || this.pos.y > canvasData.canvas.height) {
	  this.die();
	}
  }

  draw() {
	super.draw();
	canvasData.context.fillStyle = 'white';
	canvasData.context.fillRect(this.pos.x - 2, this.pos.y - 2, 4, 4);
  }
}

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 32;
const PLAYER_ANIMATIONS = {
  down: new Animation("player", 150, [0, 1, 2, 3], 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  left: new Animation("player", 150, [0, 1, 2, 3], PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  up: new Animation("player", 150, [0, 1, 2, 3], 2*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  right: new Animation("player", 150, [0, 1, 2, 3], 3*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  downB: new Animation("player", 150, [3, 2, 1, 0], 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  leftB: new Animation("player", 150, [3, 2, 1, 0], PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  upB: new Animation("player", 150, [3, 2, 1, 0], 2*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT),
  rightB: new Animation("player", 150, [3, 2, 1, 0], 3*PLAYER_WIDTH, 0, PLAYER_WIDTH, PLAYER_HEIGHT)
};
export class Player extends Entity {
  constructor(controller, x, y, initialAnimation="right") {
	super("player", {x: x, y: y}, PLAYER_WIDTH, PLAYER_HEIGHT, {width: 12, height: 24}, 10, 1, PLAYER_ANIMATIONS, initialAnimation);
	//this.lives = 3;
	this.reset(controller, x, y);
  }

  reset(controller, x=0, y=0) {
	super.reset();
	this.controller = controller;
	this.hp = 10;
	this.shotTimer = 0;
	this.resetPosition(x, y);
  }

  resetPosition(x, y) {
	this.pos =  {x: x, y: y};
	this.vel = {x: 0, y: 0};
	this.aim = {x: 0, y: 0};
  }

  get alive() { return this.lives > 0; }
  set alive(val) { this.lives = val ? 3 : 0; }

  draw() {
	if (canvasData.context) {
	  // TODO: make animation objects draw to their own canvas and return an image here
	  this.currentAnimation.draw(canvasData.context, this.pos.x, this.pos.y);
	}
	super.draw();
  }

  move(dt) {
	if (!this.controller) {
	  return;
	}

	this.vel.x = this.vel.y = 0;

	if (this.controller.currentState.up) {
	  this.vel.y += -SPEED;
	}
	if (this.controller.currentState.down) {
	  this.vel.y += SPEED;
	}
	if (this.controller.currentState.left) {
	  this.vel.x += -SPEED;
	}
	if (this.controller.currentState.right) {
	  this.vel.x += SPEED;
	}

	if (Math.abs(this.vel.x) > 0 && Math.abs(this.vel.y) > 0) {
	  this.vel.x *= Math.sqrt(0.8);
	  this.vel.y *= Math.sqrt(0.8);
	}

	this.pos.x += Math.round(this.vel.x * dt);
	this.pos.y += Math.round(this.vel.y * dt);
  }

  onTopWallCollision(dt) {
	super.onTopWallCollision(dt);
	this.vel.y = 0;
  }

  onLeftWallCollision(dt) {
	super.onLeftWallCollision(dt);
	this.vel.x = 0;
  }

  onBottomWallCollision(dt) {
	super.onBottomWallCollision(dt);
	this.vel.y = 0;
  }
  
  onRightWallCollision(dt) {
	super.onRightWallCollision(dt);
	this.vel.x = 0;
  }
  
  shoot(dt) {
	if (!this.controller) {
	  return;
	}

	if (this.controller.currentState.shootUp) {
	  this.aim.y = -1;
	} else 	if (this.controller.currentState.shootDown) {
	  this.aim.y = 1;
	} else {
	  this.aim.y = 0;
	}
	if (this.controller.currentState.shootLeft) {
	  this.aim.x = -1;
	} else if (this.controller.currentState.shootRight) {
	  this.aim.x = 1;
	} else {
	  this.aim.x = 0;
	}
	if (this.shotTimer <= 0 && (this.controller.currentState.shootUp || this.controller.currentState.shootDown || this.controller.currentState.shootLeft || this.controller.currentState.shootRight)) {//((this.aim.x != 0 || this.aim.y != 0) && this.shotTimer <= 0) {
	  this.shotTimer = SHOTTIME;
	  // Using player center as origin of bullets
	  // TODO: define/find "gun position"
	  entitiesManager.spawn(Bullet, this.pos.x + this.width/2, this.pos.y + this.height/2, this.aim.x, this.aim.y, this.vel.x, this.vel.y);
	  // TODO: May want to have a central place for audio so we can mute/volume control from there 
	  if (!window.mute) {
		  assetLoader.getSound("shoot").play();
	  }
	} else {
	  this.shotTimer -= dt;
	}
  }

  animate(dt) {
	const oldAnimation = this.currentAnimation;
	if (this.aim.y > 0) {
	  this.currentAnimation = this.vel.y >= 0 ? this.animations.down : this.animations.downB;
	} else if (this.aim.y < 0) {
	  this.currentAnimation = this.vel.y <= 0 ? this.animations.up : this.animations.upB;
	} else {
	  if (this.vel.y > 0) {
		this.currentAnimation = this.animations.down;
	  } else if (this.vel.y < 0) {
		this.currentAnimation = this.animations.up;
	  }
	}
	if (this.aim.x > 0) {
	  this.currentAnimation = this.vel.x >= 0 ? this.animations.right : this.animations.rightB;
	} else if (this.aim.x < 0) {
	  this.currentAnimation = this.vel.x <= 0 ? this.animations.left : this.animations.leftB;
	} else {
	  if (this.vel.x > 0 && this.aim.y == 0) {
		this.currentAnimation = this.animations.right;
	  } else if (this.vel.x < 0 && this.aim.y == 0) {
		this.currentAnimation = this.animations.left;
	  }
	} 
	if (this.currentAnimation != oldAnimation) {
	  this.currentAnimation.reset();
	}
	if (this.vel.x != 0 || this.vel.y != 0) {
	  this.currentAnimation.play();
	} else {
	  this.currentAnimation.stop();
	}
	this.currentAnimation.update(dt);
  }
  
  update(dt) {
	if (this.controller) {
	  this.controller.update(dt);
	}
	this.move(dt);
	this.shoot(dt);
	this.animate(dt);
	super.update(dt);
  }

  die() {
	  if (this.lives > 1) {
		  this.lives--;
		  this.reset(this.controller, canvasData.canvas.width/2, canvasData.canvas.height/2);
	  } else {
		entitiesManager.kill(this);
	  }
  }
}
