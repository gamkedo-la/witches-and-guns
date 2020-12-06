import { assetLoader } from './assets.js';
import { canvasData } from './globals.js';
import { generate } from './view.js';
import { Entity, entitiesManager } from './entity.js';


const SHOTSPEED = 320;
const BULLET_SPRITE_SPECS = {
	bullet: {up: "bulletU", left: "bulletL", down: "bulletD", right: "bulletR"},
	spread: {up: "spread", left: "spread", down: "spread", right: "spread"},
	laser: {up: "laserU", left: "laserL", down: "laserD", right: "laserR"},
};

class Bullet extends Entity {
	constructor(posX, posY, dirX, dirY, velX, velY, hp, spriteId) {
		const collider = {width: 4,	height: 2, offsetX: 5, offsetY: 3};
		super('playerProjectile', {x: posX, y: posY}, 19, 9, collider, hp, 1);
		this.canCollideWithTypes.add('enemy');
		this.collider.width = 3;
		this.collider.height = 3;
		this.reset(posX, posY, dirX, dirY, velX, velY, hp, spriteId);
	}

	generateAnimations(iconId) {
		this.animations = {};
		for (const [dir, imageId] of Object.entries(BULLET_SPRITE_SPECS[iconId])) {
			this.animations[dir] = generate(assetLoader.getImage(imageId));
		}
	}

	reset(posX, posY, dirX, dirY, velX, velY, hp, spriteId) {
		super.reset();
		this.pos = { x: posX, y: posY };
		this.vel = {
			x: dirX * SHOTSPEED + velX,
			y: dirY * SHOTSPEED + velY
		};
		this.hp = hp;
		this.generateAnimations(spriteId);
		this.currentAnimation = this.animations.right;
		if (this.vel.x == 0) {
			this.changeAnimation(this.vel.y > 0 ? this.animations.down : this.animations.up);
		} else {
			this.changeAnimation(this.vel.x > 0 ? this.animations.right : this.animations.left);
		}
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
	}

	onTopWallCollision(dt) {
		this.die();
	}

	onLeftWallCollision(dt) {
		this.die();
	}

	onBottomWallCollision(dt) {
		this.die();
	}

	onRightWallCollision(dt) {
		this.die();
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
		ammo: Infinity,
		bulletSprite: "bullet",
		soundId: "shoot",
		bulletSpawner: (origin, dir, vel) => {
			entitiesManager.spawn(Bullet, origin.x, origin.y, dir.x, dir.y, vel.x, vel.y, 1, "bullet");
		}
	},
	spread: {
		shotTime: 1 / 10,
		ammo: 50,
	    soundId: "shoot",
	    iconId: "spreadGun",
		bulletSpawner: (origin, dir, vel) => {
			const angle = Math.atan2(dir.x, -dir.y) - Math.PI/2;
			const spreadAngle = Math.PI/16;
			entitiesManager.spawn(Bullet, origin.x, origin.y, Math.cos(angle - 2*spreadAngle), Math.sin(angle - 2*spreadAngle), vel.x, vel.y, 1, "spread");
			entitiesManager.spawn(Bullet, origin.x, origin.y, Math.cos(angle - spreadAngle), Math.sin(angle - spreadAngle), vel.x, vel.y, 1, "spread");
			entitiesManager.spawn(Bullet, origin.x, origin.y, Math.cos(angle + spreadAngle), Math.sin(angle + spreadAngle), vel.x, vel.y, 1, "spread");
			entitiesManager.spawn(Bullet, origin.x, origin.y, Math.cos(angle + 2*spreadAngle), Math.sin(angle + 2*spreadAngle), vel.x, vel.y, 1, "spread");
		}
	},
	laser: {
		shotTime: 1 / 6,
		ammo: 100,
		bulletSprite: "bullet",
		soundId: "shoot",
		iconId: "laserGun",
		bulletSpawner: (origin, dir, vel) => {
			entitiesManager.spawn(Bullet, origin.x, origin.y, dir.x, dir.y, vel.x, vel.y, Infinity, "laser");
		}
	},
};

export class Gun extends Entity {
	constructor(player, spec) {
		super("gun", getPositionForGun(player), 10, 10, {width: 10, height: 10});
		this.reset(player, spec);
	}

	reset(player, spec) {
		const position = getPositionForGun(player);
		super.reset(position.x, position.y);
		this.player = player;
		this.shotTime = spec.shotTime;
	  	this.spawnBullets = spec.bulletSpawner;
		this.timer = spec.shotTime;
	  	this.soundId = spec.soundId || "shoot";
		this.ammo = spec.ammo;
	}

	shoot(aim) {
		if (this.timer <= 0) {
			this.timer = this.shotTime;
			this.spawnBullets({x: this.pos.x, y: this.pos.y}, aim, this.player.vel);
			// TODO: May want to have a central place for audio so we can mute/volume control from there 
			if (!window.mute) {
				assetLoader.getSound(this.soundId).play();
			}
			this.ammo--;
		}
	}

	update(dt) {
		if (this.ammo < 0) {
			this.die();
			this.player.setBasicGun();
		}
		this.pos = getPositionForGun(this.player);
		this.timer -= dt;
		super.update(dt);
	}
}
