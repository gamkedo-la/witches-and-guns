import { assetLoader } from './assets.js';
import { canvasData } from './globals.js';
import { Entity, entitiesManager } from './entity.js';


const SHOTSPEED = 320;

class Bullet extends Entity {
	constructor(posX, posY, dirX, dirY, velX, velY) {
		super('playerProjectile');
		this.canCollideWithTypes.add('enemy');
		this.collider.width = 3;
		this.collider.height = 3;
		this.reset(posX, posY, dirX, dirY, velX, velY);
	}

	reset(posX, posY, dirX, dirY, velX, velY) {
		super.reset();
		this.pos = { x: posX, y: posY };
		this.vel = {
			x: dirX * SHOTSPEED + velX,
			y: dirY * SHOTSPEED + velY
		};
	}

	update(dt) {
		super.update(dt);
		const vel = {
			x: this.vel.x * dt,
			y: this.vel.y * dt
		};
		if (Math.abs(vel.x) > 0 && Math.abs(vel.y) > 0) {
			vel.x *= Math.SQRT1_2;
			vel.y *= Math.SQRT1_2;
		}
		this.pos.x += Math.round(vel.x);
		this.pos.y += Math.round(vel.y);
		this.collider.x = this.pos.x - 1;
		this.collider.y = this.pos.y - 1;
		if (this.pos.x < 0 || this.pos.x > canvasData.canvas.width || this.pos.y < 0 || this.pos.y > canvasData.canvas.height) {
			this.die();
		}
	}

	draw() {
		super.draw();
		canvasData.context.fillStyle = 'white';
		canvasData.context.fillRect(this.pos.x - 2, this.pos.y - 2, 4, 4);
	}
}

function getPositionForGun(player) {
	// Using player center as origin of bullets
	// TODO: define/find "gun position"
	return {
		x: player.pos.x + player.width / 2,
		y: player.pos.y + player.height / 2
	};
}


export const GUNS = {
	basic: {
		shotTime: 1 / 12,
		timeOut: Infinity,
		soundId: "shoot",
		bulletSpawner: (origin, dir, vel) => {
			entitiesManager.spawn(Bullet, origin.x, origin.y, dir.x, dir.y, vel.x, vel.y);
		}
	},
};

export class Gun extends Entity {
	constructor(player, spec) {
		super("weapon", getPositionForGun(player), 10, 10, {width: 10, height: 10});
		this.player = player;
		this.shotTime = spec.shotTime;
		this.timer = spec.shotTime;
		this.timeOut = spec.timeout;
		this.spawnBullets = spec.bulletSpawner;
		this.soundId = spec.soundId || "shoot";
	}

	reset(player, spec) {
		const position = getPositionForGun(player);
		super.reset(position.x, position.y);
		this.player = player;
		this.shotTime = spec.shotTime;
		this.timer = spec.shotTime;
	}

	shoot(aim) {
		if (this.timer <= 0) {
			this.timer = this.shotTime;
			this.spawnBullets({x: this.pos.x, y: this.pos.y}, aim, this.player.vel);
			// TODO: May want to have a central place for audio so we can mute/volume control from there 
			if (!window.mute) {
				assetLoader.getSound(this.soundId).play();
			}
		}
	}

	update(dt) {
		this.pos = getPositionForGun(this.player);
		this.timer -= dt;
		super.update(dt);
	}
}
