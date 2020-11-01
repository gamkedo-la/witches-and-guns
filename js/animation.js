import { Util } from './util.js';

export class Animation {
  // frame times should be in ms
  constructor(spec) {
	this.id = spec.id;
	this.img = spec.img;
	this.frames = spec.frames;
	this.xOffset = spec.xOffset;
	this.yOffset = spec.yOffset;
	this.width = spec.width;
	this.height = spec.height;
	this.x = Util.objKeyValue(spec, "x", 0);
	this.y = Util.objKeyValue(spec, "y", 0);
	this.loop = Util.objKeyValue(spec, "loop", true);
	this.reset();
	this.playing = Util.objKeyValue(spec, "play", false);
  }

  reset() {
	this.timer = 0;
	this.playing = false;
	this.currentFrameIndex = 0;
  }
  
  draw(ctx, x=0, y=0) {
	if (this.frames.length) {
	  const frame = this.frames[this.currentFrameIndex];
	  ctx.drawImage(this.img, frame.xoffset, frame.yoffset, this.width, this.height, this.x+x, this.y+y, this.width, this.height);
	} else {
	  console.error("Found animation without frames! %s (%s)", this.id, this.img);
	  ctx.fillStyle = "red";
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	}
  }

  play() {
	this.playing = true;
  }

  stop() {
	this.playing = false;
  }

  update(dt) {
	if (!(this.playing  && typeof(this.frames) != "undefined" && this.frames.length)) {
	  return;
	}
	const frame = this.frames[this.currentFrameIndex];
	const frameTime = frame.duration/1000;
	this.timer += dt;
	if (this.timer >= frameTime) {
	  this.timer = 0;
	  if (this.currentFrameIndex >= this.frames.length - 1) {
		this.currentFrameIndex = 0;
		if (!this.loop) this.stop();
	  } else {
		this.currentFrameIndex++;
	  }
	}
  }
}
