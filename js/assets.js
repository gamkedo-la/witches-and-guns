const assetDefs = {
  images: [
	{id: "player", src: "./images/julhilde.png"},
	{id: "broomEnemy", src: "./images/broom-enemy.png"},
	{id: "floorTile", src: "./images/tiles/dungeon-floor.png"},
	{id: "fence_b_a", src: "./images/tiles/fence_b_a.png"},
	{id: "fence_b_b", src: "./images/tiles/fence_b_b.png"},
	{id: "fence_bll", src: "./images/tiles/fence_bll.png"},
	{id: "fence_blu", src: "./images/tiles/fence_blu.png"},
	{id: "fence_brl", src: "./images/tiles/fence_brl.png"},
	{id: "fence_bru", src: "./images/tiles/fence_bru.png"},
	{id: "fence_l", src: "./images/tiles/fence_l.png"},
	{id: "fence_r", src: "./images/tiles/fence_r.png"},
	{id: "fence_t_a", src: "./images/tiles/fence_t_a.png"},
	{id: "fence_t_b", src: "./images/tiles/fence_t_b.png"},
	{id: "fence_tll", src: "./images/tiles/fence_tll.png"},
	{id: "fence_tlu", src: "./images/tiles/fence_tlu.png"},
	{id: "fence_trl", src: "./images/tiles/fence_trl.png"},
	{id: "fence_tru", src: "./images/tiles/fence_tru.png"},
	{id: "fence_gate_ll", src: "./images/tiles/fence_gate_ll.png"},
	{id: "fence_gate_lu", src: "./images/tiles/fence_gate_lu.png"},
	{id: "fence_gate_rl", src: "./images/tiles/fence_gate_rl.png"},
	{id: "fence_gate_ru", src: "./images/tiles/fence_gate_ru.png"},
	{id: "fence_gate_tl", src: "./images/tiles/fence_gate_tl.png"},
	{id: "fence_gate_tr", src: "./images/tiles/fence_gate_tr.png"},
	{id: "higrass_a", src: "./images/tiles/higrass_a.png"},
	{id: "higrass_b", src: "./images/tiles/higrass_b.png"},
	{id: "higrass_c", src: "./images/tiles/higrass_c.png"},
	{id: "higrass_d", src: "./images/tiles/higrass_d.png"},
	{id: "lograss_a", src: "./images/tiles/lograss_a.png"},
	{id: "lograss_b", src: "./images/tiles/lograss_b.png"},
	{id: "lograss_c", src: "./images/tiles/lograss_c.png"},
	{id: "lograss_d", src: "./images/tiles/lograss_d.png"},
	{id: "paver_a", src: "./images/tiles/paver_a.png"},
	{id: "paver_b", src: "./images/tiles/paver_b.png"},
	{id: "paver_c", src: "./images/tiles/paver_c.png"},
	{id: "paver_d", src: "./images/tiles/paver_d.png"},
	{id: "kitchen_tile", src: "./images/tiles/kitchen_tile.png"},
	{id: "lawnmower", src: "./images/lawnmower.png"},
	{id: "health", src: "./images/health.png"}
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
