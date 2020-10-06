export const imageLoader = new (function() {
  const imageDefs = [
	// image defs here: {id: "name", src: "./images/image.png"},
	{id: "player", src: "./images/julhilde.png"},
	{id: "broomEnemy", src: "./images/broom-enemy.png"},
	{id: "floorTile", src: "./images/tiles/dungeon-floor.png"}
  ];
  const images = {};
  this.loadImages = function() {
	return Promise.all(imageDefs.map(imageDef => {
	  return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve({id: imageDef.id, image: image});
		image.onerror = () => reject(image);
		image.src = imageDef.src;
	  });
	})).then(values => {
	  values.forEach(value => {
		images[value.id] = value.image;
	  });
	  Object.freeze(images);
	});
  };
  this.getImage = id => images[id];
  this.getAllImages = () => images;
})();
