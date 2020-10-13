import {assetLoader} from './assets.js';

export class Animation {
  // frame times should be in ms
  constructor(sheetId, frameTimes, frames, xOffset, yOffset, frameWidth, frameHeight) {
	this.sheetId = sheetId;

	if (frameTimes instanceof Array) {
	  this.frameTimes = frameTimes;
	} else { // assume it's a number
	  this.frameTimes = Array(frames.length).fill(frameTimes);
	}
	// TODO: throw error if frames is empty list
	this.frames = frames;
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	this.reset();
  }

  reset() {
	this.timer = 0;
	this.playing = false;
	this.currentFrameIndex = 0;
  }
  
  draw(ctx, x, y) {
	ctx.drawImage(assetLoader.getImage(this.sheetId),
				  this.xOffset, this.yOffset + this.frames[this.currentFrameIndex]*this.frameHeight,
				  this.frameWidth, this.frameHeight,
				  x, y,
				  this.frameWidth, this.frameHeight);
  }

  play() {
	this.playing = true;
  }

  stop() {
	this.playing = false;
  }

  update(dt) {
	if (!this.playing) {
	  return;
	}
	const frameTime = this.frameTimes[this.currentFrameIndex]/1000;
	this.timer += dt;
	if (this.timer >= frameTime) {
	  this.timer = 0;
	  if (this.currentFrameIndex >= this.frames.length - 1) {
		this.currentFrameIndex = 0;
	  } else {
		this.currentFrameIndex++;
	  }
	}
  }
}
