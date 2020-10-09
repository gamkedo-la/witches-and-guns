import {Enemy} from './enemies.js';
import {canvasData} from './globals.js';
import {imageLoader} from './assets.js';
import {inputManager} from './input.js';
import {Player} from './player.js';
import {entitiesManager} from './entity.js';

export let currentScene;

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

class Scene {
  constructor() {
  }

  init() {
  }

  reset() {
	return this;
  }

  draw() {
  }

  update(dt) {
	inputManager.update(dt);
  }

  switchTo(scene) {
	inputManager.reset();
	console.log('%s - SWITCHING TO', timestamp(), scene);
	currentScene = scene;
	currentScene.reset();
  }
}

class AttractModeScene extends Scene {
  reset() {
	inputManager.reset();
	inputManager.on(['start'], controller => {
	  this.switchTo(SCENES.select);
	});
	inputManager.on('credits', () => {
	  this.switchTo(SCENES.credits);
	});
	return super.reset();
  }

  draw() {
	canvasData.context.fillStyle = 'rgb(0, 64, 88)';
	canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
	canvasData.context.fillStyle = 'white';
	canvasData.context.fillText('ATTRACT MODE, HIT KEY TO START PLAYING', 10, canvasData.canvas.height/2);
  }

  update(dt) {
	super.update(dt);
  }
}


class PlayerSelectScene extends Scene {
  constructor() {
	super();
	this.slots = [
	  {
		input: null,
		avatar: 'Julhilde',
		selected: false,
	  },
	  {
		input: null,
		avatar: 'Calixto',
		selected: false,
	  },
	];
	this.skippedGamePadStart = false;
  }

  selectSlot(slot, otherSlot, input) {
	slot.selected = true;
	const oldInput = slot.input;
	slot.input = input;
	if (otherSlot.input == slot.input) {
	  otherSlot.input = oldInput;
	  otherSlot.selected = oldInput != null;
	}
  }
  
  reset() {
	this.skippedGamePadStart = false;
	this.slots[0].input = inputManager.primaryControl;
	console.log('SET PRIMARY CONTROL', this.slots[0].input);
	this.slots[0].selected = true;
	inputManager.on('gamepadConnected', (gamepad) => {
	  for (const slot of this.slots) {
		if (!slot.selected) {
		  slot.selected = true;
		  slot.input = gamepad;
		  return;
		}
	  }
	});				
	inputManager.on('left', (controller) => {
	  this.selectSlot(this.slots[0], this.slots[1], controller);
	});
	inputManager.on('right', (controller) => {
	  this.selectSlot(this.slots[1], this.slots[0], controller);
	});

	inputManager.on('start', (controller) => {
	  if (controller.name.startsWith('Gamepad') && controller == inputManager.primaryControl && !this.skippedGamePadStart) {
		this.skippedGamePadStart = true;
		return;
	  }
	  // find slot with this controller
	  const matchingSlots = this.slots.filter(slot => slot.input === controller);
	  if (matchingSlots.length) {
		const selectedSlots = this.slots.filter(slot => slot.selected);
		for (let i=0; i<selectedSlots.length; i++) {
		  const controller = selectedSlots[i].input;
		  const player = entitiesManager.spawn(Player, controller);
		  controller.player = player;
		}
		this.switchTo(SCENES.game);
	  } else {
		for (const slot of this.slots.filter(slot => !slot.selected)) {
		  slot.input = controller;
		  slot.selected = true;
		  break;
		}
	  }
	});
	return super.reset();
  }

  update(dt) {
	super.update(dt);
  }

  draw() {
	canvasData.context.fillStyle = 'rgb(0, 64, 88)';
	canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
	canvasData.context.fillStyle = 'white';
	const margin = 5;
	const slotWidth = canvasData.canvas.width/this.slots.length - margin;
	this.slots.forEach((slot, i) => {
	  canvasData.context.lineWidth = 10;
	  canvasData.context.strokeStyle = slot.selected ? 'lime' : 'orange';	  
	  canvasData.context.strokeRect(i*slotWidth + margin, margin, (i+1)*slotWidth - margin, canvasData.canvas.height - margin);
	  if (slot.input != null) {
		canvasData.context.fillStyle = 'white';
		canvasData.context.fillText(slot.input.name, 50 + Math.round(canvasData.canvas.width/2)*i , Math.round(canvasData.canvas.height/2)); //+ i*(canvasData.canvas.width/2), canvasData.height/2);
	  }
	});
	// TODO: draw portraits
	// TODO: draw control icons
  }
}

const MAX_ENEMIES = 20;
class GameScene extends Scene {
  // level loading here?
  constructor() {
	super();
	for (let i=0; i<MAX_ENEMIES; i++) {
	  entitiesManager.spawn(Enemy, 100, 100);
	}
	entitiesManager.onCollision('playerProjectile', 'enemy', (projectile, enemy) => {
	  enemy.hurt(projectile.damage);
	  projectile.die();
	});
  }

  update(dt) {
	super.update(dt);
	entitiesManager.update(dt);
  }

  draw() {
	const floorTileImg = imageLoader.getImage("floorTile");
	for (let x=0; x<canvasData.canvas.width; x+=floorTileImg.width) {
	  for (let y=0; y<canvasData.canvas.height; y+=floorTileImg.height) {
		canvasData.context.drawImage(floorTileImg, x, y);
	  }
	}
	entitiesManager.draw();
  }
}

class GameOverScene extends Scene {
}

class CreditsScene extends Scene {
}

export const SCENES = {
  // TODO: load scene?
  attract: new AttractModeScene(),
  select: new PlayerSelectScene(),
  game: new GameScene(),
  gameOver: new GameOverScene(),
  credits: new CreditsScene()
};
currentScene = SCENES.attract;
currentScene.reset();
