export { GridView, Sprite, generate };

import { assetLoader } from './assets.js';
import { Animation } from './animation.js';
import { Fmt } from './fmt.js';

class GridView {
    constructor(grid) {
        this._views = [];
        this.properties = Object.assign({}, grid.properties);
        // translate world grid to view grid
        for (let j=0; j<grid.height; j++) {
            for (let i=0; i<grid.width; i++) {
                const spec = assetLoader.getImage(grid.get(i,j));
                const x = i*16;
                const y = j*16;
                if (spec) {
                    spec.play = true;
                    spec.x = x;
                    spec.y = y;
                    const view = generate(spec);
                    if (view) this._views.push(view);
                }
            }
        }
    }

    update(dt) {
        for (const view of this._views) {
            if (view.update) view.update(dt);
        }
    }

    draw(ctx) {
        for (const view of this._views) {
            view.draw(ctx);
        }
    }

}

class Sprite {
	constructor(spec) {
		this._id = spec.id;
        this._img = spec.img;
        this._x = spec.x || 0;
        this._y = spec.y || 0;
		this._xoffset = spec.xoffset || 0;
		this._yoffset = spec.yoffset || 0;
		this._width = spec.width || this.img.width;
        this._height = spec.height || this.img.height;
	}

	get img() {
		return this._img;
	}

	draw(ctx, x=0, y=0) {
		if (!this._img) return;
		ctx.drawImage(this._img, this._xoffset, this._yoffset, this._width, this._height, this._x + x, this._y + y, this._width, this._height);
	}

	toString() {
		return "[Sprite:" + this._id + "]";
	}
}

function generate(spec) {
    if (!spec) return undefined;
    if (spec.kind === "anim") {
        return new Animation(spec);
    } else {
        return new Sprite(spec);
    }
}
