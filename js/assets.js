const assetDefs = {
  images: [
	{id: "player", src: "./images/julhilde.png"},
	{id: "broomEnemy", src: "./images/broom-enemy.png"},
	{id: "floorTile", src: "./images/tiles/dungeon-floor.png"}
  ],
  // .mp3 and .ogg are required for sounds, and src should not have extension
  sounds: [
	{id: "shoot", src: "./sounds/shoot"},
  ]
};

const probeAudio = new Audio();
const audioFormat = probeAudio.canPlayType("audio/mp3") == "probably" ? "mp3" : "ogg";

class SoundOverLaps {
  constructor(filePath, onload) {
	this.filePath = filePath;
	this.soundIndex = 0;
	this.sounds = [this.getAudio(), this.getAudio()];
	this.sounds[this.soundIndex].addEventListener('canplay', onload);
  }

  getAudio(file) {
	return new Audio(`${this.filePath}.${audioFormat}`);
  }

  play() {
	  //WARM UP: Check status of inputManager.controls.keyboardAndMouse.currentState.mute
	  //to see if the sound should be played
	if (!this.sounds[this.soundIndex].paused) {
	  this.sounds.splice(this.soundIndex, 0, this.getAudio());
	}
	this.sounds[this.soundIndex].currentTime = 0;
	this.sounds[this.soundIndex].play();
	this.soundIndex = (++this.soundIndex) % this.sounds.length;
  }
}

class AssetLoader {
  constructor() {
	this.assets = {images: {}, sounds: {}};
	this.assetDefs = [];
	for (const [type, assets] of Object.entries(assetDefs)) {
	  for (const asset of assets) {
		asset.type = type;
		this.assetDefs.push(asset);
	  }
	}
  }

  loadAssets() {
	return Promise.all(this.assetDefs.map(assetDef => {
	  return new Promise((resolve, reject) => {
		if (assetDef.type == "images") {
		  const image = new Image();
		  image.onload = () => resolve({
			id: assetDef.id,
			asset: image,
			type: assetDef.type
		  });
		  image.onerror = () => reject(image);
		  image.src = assetDef.src;
		} else if (assetDef.type == "sounds") {
		  const sound = new SoundOverLaps(assetDef.src, () => resolve({
			id: assetDef.id,
			asset: sound,
			type: assetDef.type
		  }));
		}
	  });
	})).then(values => {
	  values.forEach(value => {
		this.assets[value.type][value.id] = value.asset;
	  });
	  Object.freeze(this.assets);
	});
  }

  getImage(id) {
	return this.assets.images[id];
  }

  getSound(id) {
	return this.assets.sounds[id];
  }
}
export const assetLoader = new AssetLoader();
