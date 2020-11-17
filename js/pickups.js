import {Animation} from "./animation.js";
import { Entity, entitiesManager } from "./entity.js";
import {canvasData} from './globals.js';
import { generate } from './view.js';
import {assetLoader} from './assets.js';
import { Gun, GUNS } from "./guns.js";


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
	const animations = {
	  default: generate(assetLoader.getImage("health.dflt")),
	};
	super(12, 16, animations, "default", 4);
  }

  apply(player) {
	super.apply(player);
	player.heal(2);
  }
}


function getRandomGunSpec() {
  const specs = Object.values(GUNS).filter(s => s.hasOwnProperty("iconId"));
  return specs[Math.floor(Math.random() * specs.length)];
}

class GunPickUp extends PickUp {
	constructor() {
	  const spec = getRandomGunSpec();
	  const animations = {
		default: generate(assetLoader.getImage(spec.iconId))
	  };
	  super(12, 12, animations, "default", 5);
	  this.spec = spec;
  }

  reset() {
	this.spec = getRandomGunSpec();
	this.animations = {
	  default: generate(assetLoader.getImage(this.spec.iconId))
	};
	super.reset();
  }

  apply(player) {
	super.apply(player);
	player.gun = entitiesManager.spawn(Gun, player, this.spec);
  }
}

export const PICKUP_TYPES = [HealthPickUp, GunPickUp];
export const PICKUP_CHANCE = 0.005;
