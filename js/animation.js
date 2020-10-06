import {imageLoader} from './assets.js';

export class Animation {
  constructor(sheetId, frameTime, frames, xOffset, yOffset, frameWidth, frameHeight) {
	this.sheetId = sheetId;
	this.frameTime = frameTime/1000;
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
	ctx.drawImage(imageLoader.getImage(this.sheetId),
				  this.xOffset*this.frameWidth, (this.yOffset + this.frames[this.currentFrameIndex])*this.frameHeight,
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
	this.timer += dt;
	if (this.timer >= this.frameTime) {
	  this.timer = 0;
	  if (this.currentFrameIndex >= this.frames.length - 1) {
		this.currentFrameIndex = 0;
	  } else {
		this.currentFrameIndex++;
	  }
	}
  }
}
