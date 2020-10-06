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
	this.currentState = {
	  up: false,
	  down: false,
	  left: false,
	  right: false,
	  shootUp: false,
	  shootDown: false,
	  shootLeft: false,
	  shootRight: false,
	  start: false,
	  credits: false,
	  mute: false,
	  debug: false,
	  pause: false
	};
	this.previousState = Object.assign({}, this.currentState);
  }
}

const ALLOW_DEFAULT = ['F12'];

export class KeyboardAndMouseInput extends PlayerInput {
  constructor() {
	super();
	this.name = 'Keyboard & Mouse';
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
	case "Enter":
	  this.currentState.start = state;
	  break;
	case "KeyQ":
	  this.currentState.debug = state;
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


export class GamepadInput extends PlayerInput {
  constructor(gamepad) {
	super();
	this.gamepad = gamepad;
	this.name = `Gamepad ${gamepad.index}`;
	this.heldButtons = new Set();
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
	if (this.gamepad.axes.length >= 2) {
	  this.currentState.left = this.gamepad.axes[0] < -DEADZONE;
	  this.currentState.right = this.gamepad.axes[0] > DEADZONE;
	  this.currentState.up = this.gamepad.axes[1] < -DEADZONE;
	  this.currentState.down = this.gamepad.axes[1] > DEADZONE;
	}
	if (this.gamepad.axes.length >= 4) {
	  this.currentState.shootLeft = this.gamepad.axes[2] < -DEADZONE;
	  this.currentState.shootRight = this.gamepad.axes[2] > DEADZONE;
	  this.currentState.shootUp = this.gamepad.axes[3] < -DEADZONE;
	  this.currentState.shootDown = this.gamepad.axes[3] > DEADZONE;
	}
	this.gamepad.buttons.forEach((button, i) => {
	  if (button == 1.0 || (typeof(button) == "object" && button.pressed)) {
		this.currentState.start = !this.heldButtons.has(i);
		this.heldButtons.add(i);
	  } else {
		this.heldButtons.delete(i);
	  }
	});
  }
}


class InputManager {
  constructor() {
	// TODO: move to SPOT
	this.listeners = {
	  any: [],
	  start: [],
	  pause: [],
	  mute: [],
	  credits: [],
	  debug: [],
	  left: [],
	  right: [],
	  up: [],
	  down: [],
	  left: [],
	  right: [],
	  shootUp: [],
	  shootDown: [],
	  shootLeft: [],
	  shootRight: [],
	  dash: [],
	  gamepadConnected: [],
	  gamepadDisconnected: []
	};
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
		  for (const func of this.listeners[event]) {
			func(input);
		  }
		}
	  }
	  input.update(dt);
	}
  }
}

export const inputManager = new InputManager();
