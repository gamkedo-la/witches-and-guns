import { assetLoader } from './assets.js';
import { canvasData } from './globals.js';
import { entitiesManager } from './entity.js';
import { inputManager } from './input.js';

import { Player } from './player.js';
import { PICKUP_CHANCE, PICKUP_TYPES } from './pickups.js';
import { generate, GridView } from './view.js';
import { Fmt } from './fmt.js';
import { LEVELS, UnWalkable } from "./levels.js";
import { AuthorLine, CreditLine, creditsData } from "./credits.js";
import { Util } from './util.js';
import { Boss } from "./bosses.js";

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
		entitiesManager.reset();
		inputManager.reset();
		inputManager.on(['start'], controller => {
			this.switchTo(SCENES.select);
		});
		inputManager.on('credits', () => {
			this.switchTo(SCENES.credits);
		});
		return super.reset();
	}

	setup() {
		if (this.titleSprite) return;
		this.titleSprite = generate(assetLoader.getImage("title"));
		this.textAlpha = 1;
		this.textAlphaTTL = 1;
		this.textFadeOut = true;
		this.bgSprites = [
			generate(assetLoader.getImage("necro")),
			generate(assetLoader.getImage("pentagram")),
			generate(assetLoader.getImage("crystalball")),
			generate(assetLoader.getImage("cauldron2")),
			generate(assetLoader.getImage("potion")),
		];
		this.bgx = Math.floor(Math.random() * canvasData.canvas.width);
		this.bgy = Math.floor(Math.random() * canvasData.canvas.height);
		this.bgi = 0;
		this.bgAlpha = 0;
		this.bgTTL = 1.5;
		this.bgFadeOut = false;
	}

	draw() {
		this.setup();
		// background
		canvasData.context.fillStyle = 'rgb(30, 17, 36)';
		canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
		// bg sprites
		const sprite = this.bgSprites[this.bgi];
		const x = this.bgx - (sprite.width*.5);
		const y = this.bgy - (sprite.height*.5);
		// WARNING -- setting global alpha, make sure it it set back
		canvasData.context.globalAlpha = this.bgAlpha;
		sprite.draw(canvasData.context, x, y);
		canvasData.context.globalAlpha = 1;
		// title
		this.titleSprite.draw(canvasData.context);
		// enter text
		canvasData.context.fillStyle = 'rgb(153,229,80, ' + this.textAlpha + ')';
		canvasData.context.textAlign = 'center';
		canvasData.context.fillText('HIT "ENTER" KEY TO START PLAYING', canvasData.canvas.width/2, canvasData.canvas.height * .96);
	  	canvasData.context.fillText('HIT "C" KEY TO SEE CREDITS', canvasData.canvas.width/2, canvasData.canvas.height * 0.91);
		canvasData.context.textAlign = 'left';
	}

	update(dt) {
		super.update(dt);
		// text fade
		if (this.textFadeOut) {
			this.textAlpha -= dt/this.textAlphaTTL;
			if (this.textAlpha <= 0) {
				this.textAlpha = 0;
				this.textFadeOut = false;
			}
		} else {
			this.textAlpha += dt/this.textAlphaTTL;
			if (this.textAlpha >= 1) {
				this.textAlpha = 1;
				this.textFadeOut = true;
			}
		}
		// sprite fade
		if (this.bgFadeOut) {
			this.bgAlpha -= dt/this.bgTTL;
			if (this.bgAlpha <= 0) {
				this.bgAlpha = 0;
				this.bgFadeOut = false;
				// next image and pos
				this.bgi++;
				this.bgx = Math.floor(Math.random() * canvasData.canvas.width);
				this.bgy = Math.floor(Math.random() * canvasData.canvas.height);
				if (this.bgi >= this.bgSprites.length) this.bgi = 0;
			}
		} else {
			this.bgAlpha += dt/this.bgTTL;
			if (this.bgAlpha >= 1) {
				this.bgAlpha = 1;
				this.bgFadeOut = true;
			}
		}
	}
}


class PlayerSelectScene extends Scene {
	constructor() {
		super();
		this.slots = [
			{
				input: null,
				sprite: "player1.select",
				animation: null,
				selected: false,
			},
			{
				input: null,
				sprite: "player2.select",
				animation: null,
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
				for (let i = 0; i < this.slots.length; i++) {
					if (this.slots[i].selected) {
						const controller = this.slots[i].input;
						const player = entitiesManager.spawn(Player, controller, i * (canvasData.canvas.width - 20), canvasData.canvas.height / 2 - 20, "player" + (i + 1), i == 0 ? "right" : "left");
						player.lives = 3;
						controller.player = player;
					}
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
		for (const slot of this.slots) {
			if (slot.animation !== null) {
				slot.animation.update(dt);
			}
		}
	}

	draw() {
		canvasData.context.fillStyle = 'rgb(0, 64, 88)';
		canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
		canvasData.context.fillStyle = 'white';
		const margin = 5;
		const slotWidth = canvasData.canvas.width / this.slots.length - margin;
		this.slots.forEach((slot, i) => {
			canvasData.context.lineWidth = 10;
			canvasData.context.strokeStyle = slot.selected ? 'lime' : 'orange';
			canvasData.context.strokeRect(i * slotWidth + margin, margin, (i + 1) * slotWidth - margin, canvasData.canvas.height - margin);
			if (slot.input != null) {
				canvasData.context.fillStyle = 'white';
				canvasData.context.fillText(slot.input.name, 50 + Math.round(canvasData.canvas.width / 2) * i, Math.round(canvasData.canvas.height / 2)); //+ i*(canvasData.canvas.width/2), canvasData.height/2);
				canvasData.context.fillText(slot.input.cntrls1, 30 + Math.round(canvasData.canvas.width / 2) * i, Math.round(canvasData.canvas.height / 2 + 30));
				canvasData.context.fillText(slot.input.cntrls2, 30 + Math.round(canvasData.canvas.width / 2) * i, Math.round(canvasData.canvas.height / 2 + 60));
				canvasData.context.fillText(slot.input.cntrls3, 30 + Math.round(canvasData.canvas.width / 2) * i, Math.round(canvasData.canvas.height / 2 + 90));
			}
			if (slot.animation === null) {
				slot.animation = generate(assetLoader.getImage(slot.sprite));
				slot.animation.play();
			}
			slot.animation.draw(canvasData.context, canvasData.canvas.width/4 + i*canvasData.canvas.width/2, 50);
		});
	}
}

const LEVEL_COMPLETE_MESSAGE_TIMEOUT = 3;
const GAME_OVER_TIMEOUT = 3;
class GameScene extends Scene {
	constructor() {
		super();
		entitiesManager.onCollision('playerProjectile', 'enemy', (projectile, enemy) => {
			enemy.hurt(projectile.damage);
			projectile.hurt(1);
		});
		entitiesManager.onCollision('enemyProjectile', 'player', (projectile, player) => {
			player.hurt(projectile.damage);
			projectile.die();
		});
		entitiesManager.onCollision('enemyAttack', 'player', (attack, player) => {
			if (!(player.invincible || player.crying)) {
				player.hurt(attack.damage);
				attack.damage = 0;
			}
		});
		entitiesManager.onCollision("pickup", "player", (pickup, player) => {
			pickup.apply(player);
			pickup.die();
		});
		entitiesManager.onCollision("unwalkable", "player", (unwalkable, player) => {
			const horizontalCollision = player.collider.x + player.collider.width > unwalkable.collider.x + unwalkable.collider.width || player.collider.x < unwalkable.collider.x;
			const verticalCollision = player.collider.y + player.collider.height > unwalkable.collider.y + unwalkable.collider.height || player.collider.y < unwalkable.collider.y;
			if (horizontalCollision) {
				player.pos.x = player.prevPos.x;
				player.vel.x = 0;
			}
			if (verticalCollision) {
				player.pos.y = player.prevPos.y;
				player.vel.y = 0;
			}
		});
	  	entitiesManager.onCollision("unwalkable", "enemy", (unwalkable, enemy) => {
			if (enemy instanceof Boss) {
				return;
			}
			const horizontalCollision = enemy.collider.x + enemy.collider.width > unwalkable.collider.x + unwalkable.collider.width || enemy.collider.x < unwalkable.collider.x;
			const verticalCollision = enemy.collider.y + enemy.collider.height > unwalkable.collider.y + unwalkable.collider.height || enemy.collider.y < unwalkable.collider.y;
			if (horizontalCollision) {
				enemy.pos.x = enemy.prevPos.x;
				enemy.vel.x = 0;
			}
			if (verticalCollision) {
				enemy.pos.y = enemy.prevPos.y;
				enemy.vel.y = 0;
			}
		});
		this.reset();
	}

	setUpInput() {
		for (let i=0; i<LEVELS.length; i++) {
			inputManager.on(`warpToLevel${i+1}`, (controller) => {
				LEVELS[this.levelIndex].loaded = false;
				LEVELS[this.levelIndex].started = false;
				this.waveTimeOut = Infinity;
				this.boss = null;
				this.levelIndex = i;
			});
		}
	}

	reset() {
		this.setUpInput();
		this.levelIndex = 0;
		this.waveTimeOut = Infinity;
		this.boss = null;
		this.gameOverTimer = 0;
		this.levelCompleteTimer = 0;
		for (const level of LEVELS) {
			level.loaded = false;
			level.complete = false;
			level.started = false;
		}
		return super.reset();
	}

	loadLevel() {
		const currentLevel = LEVELS[this.levelIndex];
		const players = entitiesManager.getLiveForType("player");
		currentLevel.started = false;
		currentLevel.complete = false;
		for (const entityType of ["enemy", "enemyProjectile", "playerProjectile", "enemyAttack", "pickup", "gun", "unwalkable"]) {
			for (const entity of entitiesManager.getLiveForType(entityType)) {
				entity.die();
			}
		}
		for (const player of players) {
			player.reset(player.controller, player.initialPos.x, player.initialPos.y, player.spriteId);
			player.setBasicGun();
		}
		this.gridViews = currentLevel.grids.map((grid) => new GridView(grid));
		for (const enemyDef of currentLevel.initialEnemies) {
			entitiesManager.spawn(enemyDef.cls, enemyDef.x, enemyDef.y);
		}
		for (const unwalkableDef of currentLevel.unwalkables) {
			entitiesManager.spawn(UnWalkable, unwalkableDef);
		}
		this.waves = Array.from(currentLevel.waves);
		currentLevel.loaded = true;
		this.boss = null;
		this.levelCompleteTimer = 0;
	}

	update(dt) {
		super.update(dt);
		const currentLevel = LEVELS[this.levelIndex];
		if (currentLevel.loaded) {
			if (currentLevel.started) {
				// update grids
				this.gridViews.forEach((gview) => gview.update(dt));
				const liveEnemies = [...entitiesManager.liveEntities].filter(e => e.type == "enemy");
				if (this.waveTimeOut <= 0 || liveEnemies.length <= 0) {
					if (this.waves.length > 0) {
						console.log("Loading new wave");
						const wave = this.waves.shift();
						this.waveTimeOut = wave.timeOut;
						for (const spawner of wave.spawners) {
							Array(spawner.amount).fill().forEach(() => {
								entitiesManager.spawn(spawner.cls, spawner.x, spawner.y);
							});
						}
					} else if (liveEnemies.length <= 0 && this.boss == null) {
						// BOSS BATTLE!
						this.boss = entitiesManager.spawn(currentLevel.boss.cls, currentLevel.boss.x, currentLevel.boss.y);
					} else if (this.boss != null && !this.boss.alive) {
						LEVELS[this.levelIndex].complete = true;
						if (this.levelCompleteTimer >= LEVEL_COMPLETE_MESSAGE_TIMEOUT + (this.levelIndex >= LEVELS.length - 1 ? 2 : 0)) {
							// load next level
							if (this.levelIndex < LEVELS.length - 1) {
								LEVELS[this.levelIndex].loaded = false;
								this.levelIndex++;
								this.loadLevel();
							} else {
								this.switchTo(SCENES.credits);
							}
						} else {
							this.levelCompleteTimer += dt;
						}
					}
				} else {
					// core gameplay
					if (entitiesManager.getLiveForType("player").length <= 0) {
						if (this.gameOverTimer > GAME_OVER_TIMEOUT) {
							this.switchTo(SCENES.gameOver);
						}
						this.gameOverTimer += dt;
					}
					if (1 - Math.random() < PICKUP_CHANCE) {
						entitiesManager.spawn(PICKUP_TYPES[Math.floor(Math.random() * PICKUP_TYPES.length)]);
					}
				}
			} else {
				currentLevel.started = !entitiesManager.getLiveForType("player").map(player => player.enteringStage).reduce((acc, cv) => acc && cv, true);
			}
			entitiesManager.update(dt);
		} else {
			this.loadLevel();
		}
		this.waveTimeOut -= dt;
	}

	draw() {
		const currentLevel = LEVELS[this.levelIndex];
		if (!currentLevel.loaded) {
			canvasData.context.fillStyle = 'rgb(0, 64, 88)';
			canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
			canvasData.context.fillStyle = 'white';
			canvasData.context.fillText('LOADING ...', 10, canvasData.canvas.height / 2);
			return;
		}
		// draw background tiles
		this.gridViews.forEach((gview) => { if (!gview.properties.fg) gview.draw(canvasData.context) });
		entitiesManager.draw();
		// draw foreground tiles (in front of entities)
		this.gridViews.forEach((gview) => { if (gview.properties.fg) gview.draw(canvasData.context) });
		const lifeBar = { width: 50, height: 10 };

		for (const player of [...entitiesManager.liveEntities].filter(e => e.type == "player")) {
			let x = 10, y = 10;
			canvasData.context.fillStyle = "red";
			canvasData.context.fillRect(10, 10, lifeBar.width, lifeBar.height);
			canvasData.context.fillStyle = "green";
			canvasData.context.fillRect(10, 10, lifeBar.width * (player.hp / 10), lifeBar.height);

			x += lifeBar.width;
			y += lifeBar.height / 2;

			const lv = document.createElement('canvas');
			let sprite = player.currentAnimation;
			const width = sprite.width;
			const height = sprite.height;

			lv.context = lv.getContext('2d');
			lv.width = width;
			lv.height = height;

			sprite.draw(lv.context, 0, 0);
			canvasData.context.drawImage(lv, x, y - height / 4, width / 2, height / 2);

			x += width / 2;

			canvasData.context.fillStyle = 'white';
			canvasData.context.textBaseline = 'middle';
			canvasData.context.fillText('x' + player.lives, x, y);
		}
		if (currentLevel.complete) {
			canvasData.context.save();
			canvasData.context.textAlign = "center";
			if (this.levelIndex >= LEVELS.length - 1) {
				canvasData.context.font = "bold 24px sans";
				canvasData.context.fillStyle = "red";
				canvasData.context.fillText("CONGRATULATIONS!!", canvasData.canvas.width / 2, canvasData.canvas.height / 2);
				canvasData.context.font = "bold 18px sans";
				canvasData.context.fillText("You finished the game!!", canvasData.canvas.width / 2, canvasData.canvas.height / 2 + 30);
			} else {
				canvasData.context.font = "bold 20px sans";
				canvasData.context.fillStyle = "purple";
				canvasData.context.fillText("LEVEL COMPLETE!", canvasData.canvas.width / 2, canvasData.canvas.height / 2);
			}
			canvasData.context.restore();
		}
	}
}

const GAMEOVER_TIMEOUT = 3;

class GameOverScene extends Scene {
	reset() {
		this.timer = 0;
		return super.reset();
	}

	update(dt) {
		super.update(dt);
		if (this.timer >= GAMEOVER_TIMEOUT) {
			this.switchTo(SCENES.attract);
		} else {
			this.timer += dt;
		}
	}

	draw() {
		canvasData.context.save();
		canvasData.context.fillStyle = "rgb(0, 64, 88)";
		canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
		canvasData.context.textAlign = "center";
		canvasData.context.fillStyle = "white";
		canvasData.context.fillText("GAME OVER!", canvasData.canvas.width / 2, canvasData.canvas.height / 2);
		canvasData.context.restore();
	}
}


const TIME_BETWEEN_CREDIT_LINES = 1/4;

class CreditsScene extends Scene {
	*generateLines() {
		for (const [author, credits] of Object.entries(creditsData)) {
			yield entitiesManager.spawn(AuthorLine, author, TIME_BETWEEN_CREDIT_LINES);
			for (let i=0; i<credits.length; i++) {
				const timeTilNextLine = TIME_BETWEEN_CREDIT_LINES;
				yield entitiesManager.spawn(CreditLine, credits[i], i == credits.length - 1 ? timeTilNextLine*2 : timeTilNextLine);
			}
		}
	}

	update(dt) {
		super.update(dt);
		if (this.timer >= this.timeTilNextLine) {
			const line = this.lines.next().value;
			if (typeof(line) != "undefined") {
				this.timer = 0;
				this.timeTilNextLine = line.timeTilNextLine;
			}
		}
		this.timer += dt;
		for (const line of entitiesManager.getLiveForType("credit")) {
			line.update(dt);
		}
		if (entitiesManager.getLiveForType("credit").length <= 0) {
			this.switchTo(SCENES.attract);
		}
	}

	reset() {
		inputManager.on(['start'], controller => {
			this.switchTo(SCENES.attract);
		});
		this.timer = TIME_BETWEEN_CREDIT_LINES;
		this.timeTilNextLine = TIME_BETWEEN_CREDIT_LINES;
		for (const line of entitiesManager.getLiveForType("credit")) {
			line.die();
		}
		for (const player of entitiesManager.getLiveForType("player")) {
			player.die();
		}
		this.lines = this.generateLines();
		return super.reset();
	}

	draw() {
		super.draw();
		canvasData.context.save();
		canvasData.context.fillStyle = 'rgb(0, 64, 88)';
		canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
		canvasData.context.restore();
		for (const line of entitiesManager.getLiveForType("credit")) {
			line.draw();
		}
	}
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
