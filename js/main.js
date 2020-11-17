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
window.mute = false;
window.paused = false;
let pauseCooldownEndTime = 0;

function runGameStep(browserTimeStamp) {
  dt += Math.min(1, (browserTimeStamp - last) / 1000);
  if (window.paused) {
    //just continue to listen to input only
    while (dt > UPDATE_STEP) {
      dt -= UPDATE_STEP;
      inputManager.update(dt);
    }
  } else {
    while (dt > UPDATE_STEP) {
      dt -= UPDATE_STEP;
      currentScene.update(UPDATE_STEP);
    }
  }
  //we draw the scene also when paused, so the transparent overlay is really transparent
  currentScene.draw();
  if (window.paused) {
    drawPauseOverlay();
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
  //using a short cooldown after pausing the game,
  //so smashing the pause button in a hurry or by both players at almost the same time does not unpause unintentionally
  let currentTime = timestamp();
  if(pauseCooldownEndTime <= currentTime){
    window.paused = !window.paused;
    console.log("paused game: " + window.paused)
    if(window.paused){
      // for pausing again a very short cooldown is enough, so players can almost instantly return to the pause screen
      pauseCooldownEndTime = currentTime + 150;
    } else if(!window.paused){
      // it could harm the game if the players accidently unpause the game immediately, so using a bit longer pause
      pauseCooldownEndTime = currentTime + 250;
    }
  } else {
    console.log("pause button was smashed");
  }
}

function drawPauseOverlay() {
  canvasData.context.fillStyle = 'rgba(0, 0, 0, .5)';
  canvasData.context.fillRect(0, 0, canvasData.canvas.width, canvasData.canvas.height);
  canvasData.context.fillStyle = 'white';
  canvasData.context.fillText('Paused', 10, canvasData.canvas.height / 2);
}


