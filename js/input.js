import {canvasData} from './globals.js';
const DEADZONE = 0.20;

// TODO: move this to utilities.js
function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

class PlayerInput {
  constructor() {
	this.player = null;
	this.reset();
  }

  update(dt) {
	this.previousState = Object.assign({}, this.currentState);
  }

  reset() {
	this.currentState = {};
	for (const event of INPUT_EVENTS) {
	  this.currentState[event] = false;
	}
	this.previousState = Object.assign({}, this.currentState);
  }
}

const ALLOW_DEFAULT = ['F12'];

export class KeyboardAndMouseInput extends PlayerInput {
  constructor() {
	super();
	this.name = 'Keyboard & Mouse';
	this.cntrls1 = 'Move: WASD or Arrows'
	this.cntrls2 = 'Shoot: Mouse'
	this.cntrls3 = 'Dash: Spacebar'
	this.mouseButtonHeld = false;
	this.mousePos = {x: null, y: null};
	// TODO: set up mouse input here for shooting and dashing
    document.addEventListener("keydown", event => {
	  if (event.defaultPrevented) {
		return;
	  }
	  if (!ALLOW_DEFAULT.includes(event.code)) {
		event.preventDefault();
	  }
	  this.flipState(event.code, true);
	});
	document.addEventListener("keyup", event => {
	  if (event.defaultPrevented) {
		return;
	  }
	  event.preventDefault();
	  this.flipState(event.code, false);
	});
	
	canvasData.canvas.addEventListener("mousemove", event => {
	  this.updateMousePos(event);
	});
	canvasData.canvas.addEventListener("mousedown", event => {
	  this.mouseButtonHeld = true;
	});
	canvasData.canvas.addEventListener("mouseup", event => {
	  this.mouseButtonHeld = false;
	});
  }

  updateMousePos(event) {
	const rect = event.target.getBoundingClientRect();
	const scale = {
	  x: event.target.width/rect.width,
	  y: event.target.height/rect.height
	};
	const root = document.documentElement;
	this.mousePos.x = scale.x*(event.clientX - rect.left - root.scrollLeft);
	this.mousePos.y = scale.y*(event.clientY - rect.top - root.scrollTop);
  }
  
  flipState(code, state) {
  	switch(code) {
	case "ArrowUp":
	case "KeyW":
	  this.currentState.up = state;
	  break;
	case "ArrowDown":
	case "KeyS":
	  this.currentState.down = state;
	  break;
	case "ArrowLeft":
	case "KeyA":
	  this.currentState.left = state;
	  break;
	case "ArrowRight":
	case "KeyD":
	  this.currentState.right = state;
	  break;
	case "KeyC":
	  this.currentState.credits = state;
	  break;
	case "KeyP":
	  this.currentState.pause = state;
	  break;
	case "KeyM":
	  this.currentState.mute = state;
	  break;
	case "Enter":
	  this.currentState.start = state;
    break;
  case "Space":
    this.currentState.dash = state;
    break;    
  case "KeyQ":
	  this.currentState.debug = state;
    break;
  }
	if (code.startsWith("Digit")) {
	  const number = Number(code.slice("Digit".length));
	  if (number > 0) {
		this.currentState[`warpToLevel${number}`] = state;
	  }
	}
  }

  update(dt) {
	super.update(dt);
	if (this.mouseButtonHeld) {
	  if (this.player != null) {
		const playerCenter = {
		  x: Math.round(this.player.x + this.player.width/2),
		  y: Math.round(this.player.y + this.player.height/2)
		};
		this.currentState.shootLeft = this.mousePos.x < this.player.pos.x - 1;
		this.currentState.shootRight = this.mousePos.x > this.player.pos.x + this.player.width + 1;
		this.currentState.shootUp = this.mousePos.y < this.player.pos.y - 1;
		this.currentState.shootDown = this.mousePos.y > this.player.pos.y + this.player.height + 1;
	  }
	} else {
	  this.currentState.shootLeft = false;
	  this.currentState.shootRight = false;
	  this.currentState.shootUp = false;
	  this.currentState.shootDown = false;
	}
  }
}


//Gamepad button indexes, assuming Xbox layout
const PAD_A = 0;
const PAD_B = 1;
const PAD_X = 2;
const PAD_Y = 3;
const PAD_LB = 4;
const PAD_RB = 5;
const PAD_LT = 6;
const PAD_RT = 7;
const PAD_BACK = 8;
const PAD_START = 9;
const PAD_L3 = 10;
const PAD_R3 = 11;
const PAD_UP = 12;
const PAD_DOWN = 13;
const PAD_LEFT = 14;
const PAD_RIGHT = 15;

export class GamepadInput extends PlayerInput {
  constructor(gamepad) {
	super();
	this.gamepad = gamepad;
	this.name = `Gamepad ${gamepad.index}`;
	this.pressedButtons = new Set();
	this.heldButtons = new Set();
	this.releasedButtons = new Set();
	console.log('%s - CONNECTED %s', timestamp(), gamepad);
  }

  update(dt) {
	const foundGamePads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
	for (const gamepad of foundGamePads) {
	  if (gamepad.index === this.gamepad.index) {
		this.gamepad = gamepad;
		break;
	  }
	}

	super.update(dt);
	this.pressedButtons.clear();
	this.releasedButtons.clear();

	this.gamepad.buttons.forEach((button, i) => {
	  if (button == 1.0 || (typeof(button) == "object" && button.pressed)) {
		//Pressed only if not held last update
		if (!this.heldButtons.has(i)) this.pressedButtons.add(i);
		this.heldButtons.add(i);
	  } else {
		//Released only if held last udpate
		if (this.heldButtons.has(i)) this.releasedButtons.add(i);
		this.heldButtons.delete(i);
	  }
	});
	
	if (this.gamepad.axes.length >= 2) {
	  this.currentState.left = (this.gamepad.axes[0] < -DEADZONE) || this.heldButtons.has(PAD_LEFT);
	  this.currentState.right = (this.gamepad.axes[0] > DEADZONE) || this.heldButtons.has(PAD_RIGHT);
	  this.currentState.up = (this.gamepad.axes[1] < -DEADZONE) || this.heldButtons.has(PAD_UP);
	  this.currentState.down = (this.gamepad.axes[1] > DEADZONE) || this.heldButtons.has(PAD_DOWN);
	}
	if (this.gamepad.axes.length >= 4) {
	  this.currentState.shootLeft = (this.gamepad.axes[2] < -DEADZONE) || this.heldButtons.has(PAD_X);
	  this.currentState.shootRight = (this.gamepad.axes[2] > DEADZONE) || this.heldButtons.has(PAD_B);
	  this.currentState.shootUp = (this.gamepad.axes[3] < -DEADZONE) || this.heldButtons.has(PAD_Y);
	  this.currentState.shootDown = (this.gamepad.axes[3] > DEADZONE) || this.heldButtons.has(PAD_A);
	}

	this.currentState.start = this.pressedButtons.has(PAD_START);
	this.currentState.dash = this.heldButtons.has(PAD_LB);
  }
}

const INPUT_EVENTS = [
  "start",
  "pause",
  "mute",
  "credits",
  "debug",
  "left",
  "right",
  "up",
  "down",
  "left",
  "right",
  "shootUp",
  "shootDown",
  "shootLeft",
  "shootRight",
  "dash",
  "gamepadConnected",
  "gamepadDisconnected",
  "warpToLevel1",
  "warpToLevel2",
  "warpToLevel3",
  "warpToLevel4",
  "warpToLevel5",
  "warpToLevel6",
  "warpToLevel7",
  "warpToLevel8",
  "warpToLevel9",
];

class InputManager {
  constructor() {
	this.listeners = {};
	for (const event of INPUT_EVENTS) {
	  this.listeners[event] = [];
	}
	this.controls = {};
	this.defaultControl = null;
	this.primaryControl = null;
  }

  initialize() {
	this.controls.keyboardAndMouse = new KeyboardAndMouseInput();
	this.defaultControl = this.controls.keyboardAndMouse;

	window.addEventListener("gamepadconnected", event => {
	  const controlId = `gamepad${event.gamepad.index}`;
	  if (typeof(this.controls[controlId]) === "undefined") {
		this.controls[controlId] = new GamepadInput(event.gamepad);
		for (const func of this.listeners.gamepadConnected) {
		  func(this.controls[controlId]);
		}
	  }
	});
	window.addEventListener("gamepaddisconnected", event => {
	  const controlId = `gamepad${event.gamepad.index}`;
	  if (typeof(this.controls[controlId]) != "undefined") {
		this.controls[controlId] = new GamepadInput(event.gamepad);
		for (const func of this.listeners.gamepadDisconnected) {
		  func(this.controls[controlId]);
		}
		delete this.controls[controlId];
	  }
	});
  }

  reset() {
	for (const event in this.listeners) {
	  this.listeners[event] = [];
	}
	this.on(["start", "gamepadConnected"], controller => {
	  if (this.primaryControl === null) {
		this.primaryControl = controller;
	  }
	});
	this.on("debug", controller => {
	  window.debugMode = !window.debugMode;
	  console.log('Debug mode %s', window.debugMode ? "enabled" : "disabled");
	});
	for (const input of Object.values(this.controls)) {
	  input.reset();
	}
	this.on("mute", controller => {
		window.mute = !window.mute;
	  });

	this.on("pause", controller => {
		window.pauseGame();
	});
  }

  on(eventNames, func) {
	if (typeof(eventNames) === "string" || eventNames instanceof String) {
	  eventNames = [eventNames];
	}
	for (const eventName of eventNames) {
	  this.listeners[eventName].push(func);
	}
  }

  update(dt) {
	for (const input of Object.values(this.controls)) {
	  for (const [event, state] of Object.entries(input.currentState)) {
		if (state && !input.previousState[event]) {
		  const listeners = this.listeners[event] || [];
		  for (const func of listeners) {
			func(input);
		  }
		}
	  }
	  input.update(dt);
	}
  }
}

export const inputManager = new InputManager();
