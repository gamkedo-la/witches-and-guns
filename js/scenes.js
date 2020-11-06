import { assetLoader } from './assets.js';
import { canvasData } from './globals.js';
import { entitiesManager } from './entity.js';
import { inputManager } from './input.js';
import { BroomEnemy } from './enemies.js';
import { FridgeBoss, LawnMowerBoss } from './bosses.js';
import { Player } from './player.js';
import { Grid } from './grid.js';
import { PICKUP_CHANCE, PICKUP_TYPES } from './pickups.js';
import { GridView } from './view.js';
import { Fmt } from './fmt.js';

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
		canvasData.context.fillText('ATTRACT MODE, HIT "ENTER" KEY TO START PLAYING', 10, canvasData.canvas.height / 2);
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
				for (let i = 0; i < selectedSlots.length; i++) {
					const controller = selectedSlots[i].input;
					const player = entitiesManager.spawn(Player, controller, i * (canvasData.canvas.width - 20), canvasData.canvas.height / 2, i == 0 ? "right" : "left");
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
		});
		// TODO: draw portraits
		// TODO: draw control icons
	}
}

const HGRA = "higrass_a";
const LGRB = "lograss_b";
const FTLL = "fence_tll";
const FTLU = "fence_tlu";
const FBLL = "fence_bll";
const FBLU = "fence_blu";
const FTRL = "fence_trl";
const FTRU = "fence_tru";
const FBRL = "fence_brl";
const FBRU = "fence_bru";
const FCTA = "fence_t_a";
const FCTB = "fence_t_b";
const FNCL = "fence_l";
const FNCR = "fence_r";
const FCBA = "fence_b_a";
const FCBB = "fence_b_b";
const GTTL = "fence_gate_tl";
const GTTR = "fence_gate_tr";
const GTLL = "fence_gate_ll";
const GTLU = "fence_gate_lu";
const GTRL = "fence_gate_rl";
const GTRU = "fence_gate_ru";
const PVRA = "paver_a";
const PVRB = "paver_b";
const PVRC = "paver_c";
const PVRD = "paver_d";
const NOOP = "undefined";
const TILE = "kitchen_tile";
const TILL = "kitchen_tile_l";
const TILR = "kitchen_tile_r";
const TITL = "kitchen_tile_tl";
const TILT = "kitchen_tile_t";
const MCWV = "microwave";
const TEAP = "teapot";
const KWLL = "kwall_l";
const KWLT = "kwall_t";
const KTLU = "kwall_tl_u";
const KWRU = "kwall_r_u";
const KWRM = "kwall_r_m";
const KWRL = "kwall_r_l";
const KWIN = "kwindow";
const STOV = "stove";
const FRDG = "fridge.sleep";
const BWLU = "beige_wall_l_u";
const BWTU = "beige_wall_t_u";
const BTRU = "beige_wall_tr_u";
const BWLR = "beige_wall_r";
const BWRU = "beige_wall_r_u";
const BWRM = "beige_wall_r_m";
const BWRL = "beige_wall_r_l";
const BWLL = "beige_wall_l";
const BWTL = "beige_wall_tl";
const BWTR = "beige_wall_tr";
const CTCL = "counter_cl";
const SINK = "sink";
const CTRT = "counter_t";
const CTTR = "counter_tr";
const CTTL = "counter_tl";
const CTRL = "counter_l";
const CTLB = "counter_lb";
const CHRL = "chair_l";
const CHRR = "chair_r";
const TABL = "table";
const CBWL = "cab_drawer_l";
const CBWW = "cab_drawer";
const CBDL = "cab_door_l";
const CBDR = "cab_door_r";
const CBPN = "cab_panel";

const SIZE = 16;
const WIDTH = 20;
const HEIGHT = 15;

const LVL1_BG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	entries: [
		FTLL, FCTA, FCTB, FCTA, FCTA, FCTB, FCTA, FCTA, GTTL, PVRA, PVRB, GTTR, FCTA, FCTB, FCTA, FCTA, FCTB, FCTA, FCTB, FTRL,
		HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, PVRC, PVRD, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		PVRB, PVRC, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, PVRB, PVRD,
		PVRA, PVRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, PVRA, PVRC,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, PVRB, PVRC, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA,
		HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, PVRD, PVRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA,
	],
});

const LVL1_FG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	properties: { fg: true },
	entries: [
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FBLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FBRU,
		GTLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, GTRU,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		FTLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FTRU,
		GTLL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, GTRL,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FBLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FTRU, NOOP, NOOP, FTLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FBRU,
		FBLL, FCBA, FCBA, FCBB, FCBA, FCBB, FCBA, FCBA, FBRL, NOOP, NOOP, FBLL, FCBA, FCBB, FCBA, FCBA, FCBB, FCBA, FCBA, FBRL,
	],
});

const LVL2_BG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	entries: [
		KWLL, KTLU, KWLT, KWIN, NOOP, KWLT, KWLT, STOV, NOOP, KWLT, KWLT, KWLT, KWRM, TILL, TILR, BWLU, BWTU, BWTU, BTRU, BWLR,
		KWLL, CTCL, NOOP, SINK, NOOP, CTRT, CTTR, NOOP, NOOP, CTTL, CTTR, TILE, TILE, TILL, TILR, CHRL, TABL, NOOP, CHRR, BWLR,
		KWLL, CTRL, CBWL, CBDL, CBDR, CBDL, CBDR, NOOP, NOOP, CBWW, CBWW, TILE, TILE, TILL, TILE, NOOP, NOOP, NOOP, NOOP, BWLR,
		KWLL, CTRL, TITL, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILE, TILE, TILE, TILE, TILE, TILR, BWLR,
		KWRU, CTRL, TILL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILR, BWRU,
		KWRM, CTLB, TILL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILR, BWRM,
		KWRL, CBPN, TILL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILR, BWRL,
		TILT, TILT, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILT,
		BWTL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWTR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
	],
});

const LVL2_MID_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
});
LVL2_MID_GRID.set(MCWV, 2, 0);
LVL2_MID_GRID.set(FRDG, 11, 0);
LVL2_MID_GRID.set(TEAP, 6, 0);

const LVL2_FG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	properties: { fg: true },
	entries: [
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
	],
});

const LEVELS = [
	{
		name: "Level 1", loaded: false, complete: false,
		grids: [LVL1_BG_GRID, LVL1_FG_GRID],
		waves: [
			// {
			// 	spawners: [
			// 		{ cls: BroomEnemy, x: 20, y: 10, amount: 10 },
			// 		{ cls: BroomEnemy, x: 20, y: 200, amount: 10 },
			// 		{ cls: BroomEnemy, x: 300, y: 10, amount: 10 },
			// 		{ cls: BroomEnemy, x: 300, y: 200, amount: 10 },
			// 	],
			// 	timeOut: 10,
			// },
			// {
			// 	spawners: [
			// 		{ cls: BroomEnemy, x: 100, y: 10, amount: 12 },
			// 		{ cls: BroomEnemy, x: 100, y: 220, amount: 12 },
			// 		{ cls: BroomEnemy, x: 10, y: 100, amount: 12 },
			// 		{ cls: BroomEnemy, x: 300, y: 100, amount: 12 },
			// 	],
			// 	timeOut: 10,
			// },
		],
		initialEnemies: [
			// { cls: BroomEnemy, x: 300, y: 100 },
			// { cls: BroomEnemy, x: 300, y: 100 },
			// { cls: BroomEnemy, x: 300, y: 100 }
		],
		boss: { cls: LawnMowerBoss, x: 110, y: 30 }
	},
	{
		name: "Level 2", loaded: false, complete: false,
		grids: [LVL2_BG_GRID, LVL2_MID_GRID, LVL2_FG_GRID],
		initialEnemies: [
			/*
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  */
		],
		waves: [
			{
				spawners: [
					//{cls: BroomEnemy, x: 20, y: 10,  amount: 2},
					////{cls: BroomEnemy, x: 20, y: 200,  amount: 20},
					//{cls: BroomEnemy, x: 300, y: 10,  amount: 20},
					//{cls: BroomEnemy, x: 300, y: 200,  amount: 20},
				],
				timeOut: Infinity,
			},
		],
		boss: { cls: FridgeBoss, x: 110, y: 100 }
	}
];
class GameScene extends Scene {
	constructor() {
		super();
		this.levelIndex = 0;
		entitiesManager.onCollision('playerProjectile', 'enemy', (projectile, enemy) => {
			enemy.hurt(projectile.damage);
			projectile.die();
		});
		entitiesManager.onCollision('enemyProjectile', 'player', (projectile, player) => {
			player.hurt(projectile.damage);
			projectile.die();
		});
		entitiesManager.onCollision('enemyAttack', 'player', (attack, player) => {
			player.hurt(attack.damage);
			attack.damage = 0;
		});
		entitiesManager.onCollision("pickup", "player", (pickup, player) => {
			pickup.apply(player);
			pickup.die();
		});
		this.waveTimeOut = Infinity;
		this.boss = null;
	}

	loadLevel() {
		const currentLevel = LEVELS[this.levelIndex];
		this.gridViews = currentLevel.grids.map((grid)=> new GridView(grid));
		for (const enemyDef of currentLevel.initialEnemies) {
			entitiesManager.spawn(enemyDef.cls, enemyDef.x, enemyDef.y);
		}
		this.waves = Array.from(currentLevel.waves);
		currentLevel.loaded = true;
	}

	update(dt) {
		const currentLevel = LEVELS[this.levelIndex];
		if (currentLevel.loaded) {
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
					// load next level
					if (this.levelIndex < LEVELS.length - 1) {
						this.levelIndex++;
					}
				}
			} else {
				// core gameplay
				if (1 - Math.random() < PICKUP_CHANCE) {
					entitiesManager.spawn(PICKUP_TYPES[Math.floor(Math.random() * PICKUP_TYPES.length)]);
				}
			}
		} else {
			this.loadLevel();
		}
		this.waveTimeOut -= dt;
		super.update(dt);
		entitiesManager.update(dt);
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
		this.gridViews.forEach( (gview) => { if (!gview.properties.fg) gview.draw(canvasData.context)} );
		entitiesManager.draw();
		// draw foreground tiles (in front of entities)
		this.gridViews.forEach( (gview) => { if (gview.properties.fg) gview.draw(canvasData.context)} );
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
