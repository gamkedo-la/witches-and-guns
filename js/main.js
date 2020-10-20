import {canvasData} from './globals.js';
import {assetLoader} from './assets.js';
import {inputManager} from './input.js';
import {currentScene} from './scenes.js';

//WARM UP: This would be a good place to put
//a practice commit.  Just add a comment like
//this one and then commit it! :)

let dt = 0, last = timestamp();
const UPDATE_STEP = 1/60;
window.debugMode = false;

function runGameStep(browserTimeStamp) {
  dt += Math.min(1, (browserTimeStamp - last)/1000);
  while(dt > UPDATE_STEP) {
	dt -= UPDATE_STEP;
	currentScene.update(UPDATE_STEP);
  }
  currentScene.draw();
  last = browserTimeStamp;
  window.requestAnimationFrame(runGameStep);
}

function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

window.onload = function() {
  canvasData.canvas = document.getElementById(canvasData.id);
  canvasData.context = canvasData.canvas.getContext('2d');
  inputManager.initialize();
  assetLoader.loadAssets().then(startGame);
};

function startGame(values) {
  currentScene.init();
  window.requestAnimationFrame(runGameStep);
}


