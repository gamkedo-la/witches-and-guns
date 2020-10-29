import {Entity} from './entity.js';
import {canvasData} from './globals.js';


class PickUp extends Entity {
  constructor(width, height, animations, initialAnimation, timeout) {
	const initialPos = {
	  x: Math.floor(Math.random()*(canvasData.canvas.width - width)),
	  y: Math.floor(Math.random()*(canvasData.canvas.height - height))
	};
	const collider = Object.assign({width: width, height: height}, initialPos);
	super("pickup", initialPos, width, height, collider, 1, 0, animations, initialAnimation);
	this.canCollideWithTypes.add("player");
	this.timeout = timeout;
	this.timer = 0;
  }

  apply(player) {
	// implement in subclasses!
  }

  update(dt) {
	super.update(dt);
	this.timer += dt;
	if (this.timer >= this.timeout) {
	  this.die();
	}
  }

  reset() {
	super.reset(
	  Math.floor(Math.random()*(canvasData.canvas.width - this.width)),
	  Math.floor(Math.random()*(canvasData.canvas.height - this.height))
	);
	this.alive = true;
	this.timer = 0;
  }
}

class HealthPickUp extends PickUp {
  constructor() {
	const animations = [];
	super(12, 12, animations, null, 4);
  }

  draw() {
	if (this.alive) {
	  canvasData.context.fillStyle = 'red';
	  canvasData.context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	}
  }

  apply(player) {
	super.apply(player);
	player.heal(2);
  }
}

export const PICKUP_TYPES = [HealthPickUp];
export const PICKUP_CHANCE = 0.005;
