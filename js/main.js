import {canvasData} from './globals.js';
import {assetLoader} from './assets.js';
import {inputManager} from './input.js';
import {currentScene} from './scenes.js';

//WARM UP: This would be a good place to put
//a practice commit.  Just add a comment like
//this one and then commit it! :)

//Test comment! Will remove

let dt = 0, last = timestamp();
const UPDATE_STEP = 1/60;
window.debugMode = false;
window.mute = false;
window.paused = false;

function runGameStep(browserTimeStamp) {
  dt += Math.min(1, (browserTimeStamp - last) / 1000);
  if (window.paused) {
    //just continue to listen to input only
    while (dt > UPDATE_STEP) {
      dt -= UPDATE_STEP;
      inputManager.update(dt);
    }
    //TODO display some paused game overlay
  } else {
    while (dt > UPDATE_STEP) {
      dt -= UPDATE_STEP;
      currentScene.update(UPDATE_STEP);
    }
    currentScene.draw();
  }
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

window.pauseGame = function(){
  //TODO add some cooldown e.g. 300ms: handle if both players press pause button at almost the same time
  window.paused = !window.paused;
  console.log("paused game: "+window.paused)
}


