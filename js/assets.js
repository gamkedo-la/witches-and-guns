import { Fmt } from "./fmt.js";
import {MOWER_FRONT_WIDTH, MOWER_BACK_WIDTH, MOWER_SIDE_WIDTH, MOWER_HEIGHT, TV_WIDTH, TV_HEIGHT, WASHER_WIDTH, WASHER_HEIGHT, WASHER_OPEN_WIDTH} from "./bosses.js";
import {SHOVEL_WIDTH, SHOVEL_HEIGHT} from "./enemies.js";

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 32;
const BROOM_WIDTH = 14;
const BROOM_HEIGHT = 26;
const BROOM_ATTACK_WIDTH = 28;
const BOOK_WIDTH = 17;
const BOOK_HEIGHT = 16;

const assetDefs = {
  images: [
	{id: "player1", src: "./images/julhilde.png", subids: [
	  { id: "player1.down", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: 0, yoffset: 0},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player1.left", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player1.up", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player1.right", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player1.downB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: 0, yoffset: 0},
	  ]},
	  { id: "player1.leftB", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: 0},
	  ]},
	  { id: "player1.upB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: 0},
	  ]},
	  { id: "player1.rightB", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: 0},
	  ]},
	  { id: "player1.crying", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: 0},
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: PLAYER_HEIGHT},
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: PLAYER_HEIGHT*2},
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player1.select", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: 0},
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: PLAYER_HEIGHT},
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: PLAYER_HEIGHT*2},
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: PLAYER_HEIGHT*3},
	  ]},
	]},
	{id: "player2", src: "./images/jameshilde.png", subids: [
	  { id: "player2.down", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: 0, yoffset: 0},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player2.left", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player2.up", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player2.right", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player2.downB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: 0, yoffset: 0},
	  ]},
	  { id: "player2.leftB", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: 0},
	  ]},
	  { id: "player2.upB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*2 + 10, yoffset: 0},
	  ]},
	  { id: "player2.rightB", kind: "anim", width: PLAYER_WIDTH + 3, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*3 + 10, yoffset: 0},
	  ]},
	  { id: "player2.crying", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: 0},
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: PLAYER_HEIGHT},
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: PLAYER_HEIGHT*2},
		{duration: 100, xoffset: PLAYER_WIDTH*5, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player2.select", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: 0},
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: PLAYER_HEIGHT},
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: PLAYER_HEIGHT*2},
		{duration: 130, xoffset: PLAYER_WIDTH*6, yoffset: PLAYER_HEIGHT*3},
	  ]},
	]},
	{id: "broomEnemy", src: "./images/broom-enemy.png", subids: [
	  { id: "broom.walkRight", kind: "anim", width: BROOM_WIDTH, height: BROOM_HEIGHT, frames: [
		  { duration: 200, xoffset: 0, yoffset: BROOM_HEIGHT*0},
		  { duration: 200, xoffset: 0, yoffset: BROOM_HEIGHT*1},
		  { duration: 200, xoffset: 0, yoffset: BROOM_HEIGHT*2},
	  ]},
	  { id: "broom.walkLeft", kind: "anim", width: BROOM_WIDTH, height: BROOM_HEIGHT, frames: [
		{ duration: 200, xoffset: 0, yoffset: BROOM_HEIGHT*3},
		{ duration: 200, xoffset: 0, yoffset: BROOM_HEIGHT*4},
		{ duration: 200, xoffset: 0, yoffset: BROOM_HEIGHT*5},
	]},
	  { id: "broom.attackRight", kind: "anim", width: BROOM_ATTACK_WIDTH, height: BROOM_HEIGHT, frames: [
		  { duration: 100, xoffset: BROOM_WIDTH, yoffset: BROOM_HEIGHT*0},
		  { duration: 200, xoffset: BROOM_WIDTH, yoffset: BROOM_HEIGHT*1},
		  { duration: 100, xoffset: BROOM_WIDTH, yoffset: BROOM_HEIGHT*2},
		  { duration: 50, xoffset: BROOM_WIDTH, yoffset: BROOM_HEIGHT*3},
		  { duration: 200, xoffset: BROOM_WIDTH, yoffset: BROOM_HEIGHT*4},
		  { duration: 50, xoffset: BROOM_WIDTH, yoffset: BROOM_HEIGHT*5},
	  ]},
	  { id: "broom.attackLeft", kind: "anim", width: BROOM_ATTACK_WIDTH, height: BROOM_HEIGHT, frames: [
		{ duration: 100, xoffset: BROOM_WIDTH + BROOM_ATTACK_WIDTH, yoffset: BROOM_HEIGHT*0},
		{ duration: 200, xoffset: BROOM_WIDTH + BROOM_ATTACK_WIDTH, yoffset: BROOM_HEIGHT*1},
		{ duration: 100, xoffset: BROOM_WIDTH + BROOM_ATTACK_WIDTH, yoffset: BROOM_HEIGHT*2},
		{ duration: 50, xoffset: BROOM_WIDTH + BROOM_ATTACK_WIDTH, yoffset: BROOM_HEIGHT*3},
		{ duration: 200, xoffset: BROOM_WIDTH + BROOM_ATTACK_WIDTH, yoffset: BROOM_HEIGHT*4},
		{ duration: 50, xoffset: BROOM_WIDTH + BROOM_ATTACK_WIDTH, yoffset: BROOM_HEIGHT*5},
	  ]},
	]},
	{id: "shovelEnemy", src: "./images/shovel-enemy.png", subids: [
	  {id: "shovel.idle", kind: "anim", width: SHOVEL_WIDTH, height: SHOVEL_HEIGHT, frames: [
		{duration: 1, xoffset: 0, yoffset: 0},
	  ]},
	  {id: "shovel.bendLeft", kind: "anim", width: SHOVEL_WIDTH, height: SHOVEL_HEIGHT, loop: false, frames: [
		{duration: 60, xoffset: 0, yoffset: SHOVEL_HEIGHT},
		{duration: 300, xoffset: 0, yoffset: SHOVEL_HEIGHT * 2},
		{duration: 50, xoffset: 0, yoffset: SHOVEL_HEIGHT * 3},
		{duration: 60, xoffset: 0, yoffset: SHOVEL_HEIGHT * 4},
	  ]},
	  {id: "shovel.bendRight", kind: "anim", width: SHOVEL_WIDTH, height: SHOVEL_HEIGHT, loop: false, frames: [
		{duration: 60, xoffset: SHOVEL_WIDTH, yoffset: SHOVEL_HEIGHT},
		{duration: 300, xoffset: SHOVEL_WIDTH, yoffset: SHOVEL_HEIGHT * 2},
		{duration: 50, xoffset: SHOVEL_WIDTH, yoffset: SHOVEL_HEIGHT * 3},
		{duration: 60, xoffset: 0, yoffset: SHOVEL_HEIGHT * 4},
	  ]},
	  {id: "shovel.jump", kind: "anim", width: SHOVEL_WIDTH, height: SHOVEL_HEIGHT, loop: false, frames: [
		{duration: 30, xoffset: 0, yoffset: SHOVEL_HEIGHT * 5},
		{duration: 5000, xoffset: 0, yoffset: SHOVEL_HEIGHT * 6},
	  ]},
	  {id: "shovel.land", kind: "anim", width: SHOVEL_WIDTH, height: SHOVEL_HEIGHT, loop: false, frames: [
		{duration: 100, xoffset: 0, yoffset: SHOVEL_HEIGHT * 7},
	  ]},
		]
	}, {
		  id: "bookEnemy", src: "./images/book-enemy.png", subids: [
			  {
				  id: "book.walkDown", kind: "anim", width: BOOK_WIDTH, height: BOOK_HEIGHT, frames: [
					  {duration: 200, xoffset: BOOK_WIDTH * 0, yoffset: BOOK_HEIGHT * 0},
					  {duration: 200, xoffset: BOOK_WIDTH * 0, yoffset: BOOK_HEIGHT * 1}
				  ]
			  },
			  {
				  id: "book.walkRight", kind: "anim", width: BOOK_WIDTH, height: BOOK_HEIGHT, frames: [
					  {duration: 200, xoffset: BOOK_WIDTH * 1, yoffset: BOOK_HEIGHT * 0},
					  {duration: 200, xoffset: BOOK_WIDTH * 1, yoffset: BOOK_HEIGHT * 1}
				  ]
			  },
			  {
				  id: "book.walkUp", kind: "anim", width: BOOK_WIDTH, height: BOOK_HEIGHT, frames: [
					  {duration: 200, xoffset: BOOK_WIDTH * 2, yoffset: BOOK_HEIGHT * 0},
					  {duration: 200, xoffset: BOOK_WIDTH * 2, yoffset: BOOK_HEIGHT * 1}
				  ]
			  },
			  {
				  id: "book.walkLeft", kind: "anim", width: BOOK_WIDTH, height: BOOK_HEIGHT, frames: [
					  {duration: 200, xoffset: BOOK_WIDTH * 3, yoffset: BOOK_HEIGHT * 0},
					  {duration: 200, xoffset: BOOK_WIDTH* 3, yoffset: BOOK_HEIGHT * 1}
				  ]
			  },
		  ]
	},
	{
	  id: "deathAnim", src: "./images/deathpoof.png", subids: [
		{id: "poof", kind: "anim", width: 23, height: 32, loop: false, frames: [
		  {duration: 100, xoffset: 0, yoffset: 0},
		  {duration: 60, xoffset: 0, yoffset: 32},
		  {duration: 60, xoffset: 0, yoffset: 32*2},
		  {duration: 100, xoffset: 0, yoffset: 32*3},
		]},
	  ],
	},
	{id: "title", src: "./images/title3.png", "kind": "sprite"},
	{id: "pentagram", src: "./images/pentagram.png", "kind": "sprite"},
	{id: "crystalball", src: "./images/crystal ball.png", "kind": "sprite"},
	{id: "necro", src: "./images/Necronomicon.png", "kind": "sprite"},
	{id: "cauldron2", src: "./images/cauldron.png", "kind": "sprite"},
	{id: "potion", src: "./images/potion.png", "kind": "sprite"},
	{id: "floorTile", src: "./images/tiles/dungeon-floor.png"},
	{id: "wateringCan", src: "./images/tiles/watering-can.png"},
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
	{id: "kitchen_art", src: "./images/tiles/kitchenart.png", subids: [
	  {id: "kwall_l", kind: "sprite", width: 16, height: 16, 		xoffset: 16*0, yoffset: 16*0},
	  {id: "kwall_tl_u", kind: "sprite", width: 16, height: 16, 	xoffset: 16*1, yoffset: 16*0},
	  {id: "kwall_t", kind: "sprite", width: 16, height: 16, 		xoffset: 16*5, yoffset: 16*0},
	  {id: "kwall_r_u", kind: "sprite", width: 16, height: 16, 		xoffset: 16*0, yoffset: 16*4},
	  {id: "kwall_r_m", kind: "sprite", width: 16, height: 16, 		xoffset: 16*0, yoffset: 16*5},
	  {id: "kwall_r_l", kind: "sprite", width: 16, height: 16, 		xoffset: 16*0, yoffset: 16*6},
	  {id: "microwave", kind: "anim", width: 16, height: 16*2, frames: [
		{ duration: 500, xoffset: 16*21, yoffset: 16*0},
		{ duration: 500, xoffset: 16*22, yoffset: 16*0 },
	  ]},
	  {id: "teapot", kind: "anim", width: 32, height: 32, frames: [
		{ duration: 100, xoffset: 16*23, yoffset: 16*0},
		{ duration: 100, xoffset: 16*25, yoffset: 16*0 },
		{ duration: 100, xoffset: 16*27, yoffset: 16*0 },
		{ duration: 100, xoffset: 16*29, yoffset: 16*0 },
	  ]},
	  {id: "kwindow", kind: "sprite", width: 32, height: 16, 		xoffset: 16*3, yoffset: 16*0},
	  {id: "stove", kind: "sprite", width: 16*2, height: 16*3, 		xoffset: 16*7, yoffset: 16*0},
	  {id: "fridge", kind: "sprite", width: 16*2, height: 16*3, 	xoffset: 16*11, yoffset: 16*0},
	  {id: "kitchen_tile", kind: "sprite", width: 16, height: 16, 	xoffset: 16*3, yoffset: 16*4},
	  {id: "kitchen_tile_l", kind: "sprite", width: 16, height: 16,	xoffset: 16*13, yoffset: 16*0},
	  {id: "kitchen_tile_r", kind: "sprite", width: 16, height: 16,	xoffset: 16*14, yoffset: 16*0},
	  {id: "kitchen_tile_tl", kind: "sprite", width: 16, height: 16,	xoffset: 16*2, yoffset: 16*3},
	  {id: "kitchen_tile_t", kind: "sprite", width: 16, height: 16,	xoffset: 16*3, yoffset: 16*3},
	  {id: "beige_wall_l_u", kind: "sprite", width: 16, height: 16,	xoffset: 16*15, yoffset: 16*0},
	  {id: "beige_wall_t_u", kind: "sprite", width: 16, height: 16,	xoffset: 16*16, yoffset: 16*0},
	  {id: "beige_wall_tr_u", kind: "sprite", width: 16, height: 16,	xoffset: 16*18, yoffset: 16*0},
	  {id: "beige_wall_r", kind: "sprite", width: 16, height: 16,	xoffset: 16*19, yoffset: 16*0},
	  {id: "beige_wall_r_u", kind: "sprite", width: 16, height: 16,	xoffset: 16*19, yoffset: 16*4},
	  {id: "beige_wall_r_m", kind: "sprite", width: 16, height: 16,	xoffset: 16*19, yoffset: 16*5},
	  {id: "beige_wall_r_l", kind: "sprite", width: 16, height: 16,	xoffset: 16*19, yoffset: 16*6},
	  {id: "beige_wall_l", kind: "sprite", width: 16, height: 16,	xoffset: 16*0, yoffset: 16*9},
	  {id: "beige_wall_tl", kind: "sprite", width: 16, height: 16,	xoffset: 16*0, yoffset: 16*8},
	  {id: "beige_wall_tr", kind: "sprite", width: 16, height: 16,	xoffset: 16*19, yoffset: 16*8},
	  {id: "counter_cl", kind: "sprite", width: 16, height: 16,		xoffset: 16*1, yoffset: 16*1},
	  {id: "counter_t", kind: "sprite", width: 16, height: 16,		xoffset: 16*5, yoffset: 16*1},
	  {id: "counter_tr", kind: "sprite", width: 16, height: 16,		xoffset: 16*6, yoffset: 16*1},
	  {id: "counter_tl", kind: "sprite", width: 16, height: 16,		xoffset: 16*9, yoffset: 16*1},
	  {id: "counter_l", kind: "sprite", width: 16, height: 16,		xoffset: 16*1, yoffset: 16*2},
	  {id: "counter_lb", kind: "sprite", width: 16, height: 16,		xoffset: 16*1, yoffset: 16*5},
	  {id: "sink", kind: "sprite", width: 16*2, height: 16,			xoffset: 16*3, yoffset: 16*1},
	  {id: "chair_l", kind: "sprite", width: 16, height: 16*2,		xoffset: 16*15, yoffset: 16*1},
	  {id: "chair_r", kind: "sprite", width: 16, height: 16*2,		xoffset: 16*18, yoffset: 16*1},
	  {id: "table", kind: "sprite", width: 16*2, height: 16*2,		xoffset: 16*16, yoffset: 16*1},
	  {id: "cab_drawer_l", kind: "sprite", width: 16, height: 16,	xoffset: 16*2, yoffset: 16*2},
	  {id: "cab_drawer", kind: "sprite", width: 16, height: 16,		xoffset: 16*9, yoffset: 16*2},
	  {id: "cab_door_l", kind: "sprite", width: 16, height: 16,		xoffset: 16*3, yoffset: 16*2},
	  {id: "cab_door_r", kind: "sprite", width: 16, height: 16,		xoffset: 16*4, yoffset: 16*2},
	  {id: "cab_panel", kind: "sprite", width: 16, height: 16,		xoffset: 16*10, yoffset: 16*2},
	  {id: "cauldron", kind: "sprite", width: 16, height: 32,		xoffset: 16*21, yoffset: 16*2},
	]},
	{id: "fridge-boss-anim", src: "./images/fridge-boss-anim.png", subids: [
	  {id: "fridge.sleep", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 10000, xoffset: 0, yoffset: 0},
		{duration: 80, xoffset: 32*1, yoffset: 0},
		{duration: 80, xoffset: 32*2, yoffset: 0},
		{duration: 80, xoffset: 32*1, yoffset: 0},
	  ]},
	  {id: "fridge.wake", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 120, xoffset: 32*1, yoffset: 0},
		{duration: 120, xoffset: 32*2, yoffset: 0},
		{duration: 120, xoffset: 32*3, yoffset: 0},
		{duration: 120, xoffset: 32*4, yoffset: 0},
		{duration: 120, xoffset: 32*5, yoffset: 0},
		{duration: 120, xoffset: 32*6, yoffset: 0},
		{duration: 120, xoffset: 32*7, yoffset: 0},
		{duration: 120, xoffset: 32*8, yoffset: 0},
		{duration: 120, xoffset: 32*9, yoffset: 0},
		{duration: 120, xoffset: 32*10, yoffset: 0},
		{duration: 120, xoffset: 32*11, yoffset: 0},
	  ]},
	  {id: "fridge.idlel", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 1, xoffset: 32*13, yoffset: 0},
	  ]},
	  {id: "fridge.shootl", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*14, yoffset: 0},
		{duration: 80, xoffset: 32*15, yoffset: 0},
		{duration: 80, xoffset: 32*14, yoffset: 0},
	  ]},
	  {id: "fridge.idlem", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 1, xoffset: 32*16, yoffset: 0},
	  ]},
	  {id: "fridge.shootm", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*17, yoffset: 0},
		{duration: 80, xoffset: 32*18, yoffset: 0},
		{duration: 80, xoffset: 32*17, yoffset: 0},
	  ]},
	  {id: "fridge.idler", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 1, xoffset: 32*20, yoffset: 0},
	  ]},
	  {id: "fridge.shootr", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*21, yoffset: 0},
		{duration: 80, xoffset: 32*22, yoffset: 0},
		{duration: 80, xoffset: 32*21, yoffset: 0},
	  ]},
	  {id: "fridge.aim.ltr", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*12, yoffset: 0},
		{duration: 80, xoffset: 32*16, yoffset: 0},
		{duration: 80, xoffset: 32*19, yoffset: 0},
		{duration: 80, xoffset: 32*20, yoffset: 0},
	  ]},
	  {id: "fridge.aim.rtl", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*19, yoffset: 0},
		{duration: 80, xoffset: 32*16, yoffset: 0},
		{duration: 80, xoffset: 32*12, yoffset: 0},
		{duration: 80, xoffset: 32*13, yoffset: 0},
	  ]},
	  {id: "fridge.aim.ltm", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*12, yoffset: 0},
		{duration: 80, xoffset: 32*16, yoffset: 0},
	  ]},
	  {id: "fridge.aim.rtm", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*19, yoffset: 0},
		{duration: 80, xoffset: 32*16, yoffset: 0},
	  ]},
	  {id: "fridge.aim.mtl", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*12, yoffset: 0},
		{duration: 80, xoffset: 32*13, yoffset: 0},
	  ]},
	  {id: "fridge.aim.mtr", kind: "anim", width: 16*2, height: 16*3, frames: [
		{duration: 80, xoffset: 32*19, yoffset: 0},
		{duration: 80, xoffset: 32*20, yoffset: 0},
	  ]},
	]},
	{id: "lawnmower", src: "./images/lawnmower.png", subids: [
	  {id: "lawnmower.down", kind: "anim", width: MOWER_FRONT_WIDTH, height: MOWER_HEIGHT, frames: [
		{duration: 1, xoffset: 0, yoffset: 0}
	  ]},
	  {id: "lawnmower.left", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, frames: [
		{duration: 1, xoffset: MOWER_FRONT_WIDTH, yoffset: 0}
	  ]},
	  {id: "lawnmower.up", kind: "anim", width: MOWER_BACK_WIDTH, height: MOWER_HEIGHT, frames: [
		{duration: 1, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: 0}
	  ]},
	  {id: "lawnmower.right", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, frames: [
		{duration: 1, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: 0}
	  ]},
	  {id: "lawnmowerAccel.down", kind: "anim", width: MOWER_FRONT_WIDTH, height: MOWER_HEIGHT, loop: true, frames: [
		{duration: 30, xoffset: 0, yoffset: MOWER_HEIGHT*2},
		{duration: 30, xoffset: 0, yoffset: MOWER_HEIGHT*3},
		{duration: 30, xoffset: 0, yoffset: MOWER_HEIGHT*4},
	  ]},
	  {id: "lawnmowerAccel.left", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, loop: true, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*2},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*3},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*4},
	  ]},
	  {id: "lawnmowerAccel.up", kind: "anim", width: MOWER_BACK_WIDTH, height: MOWER_HEIGHT, loop: true, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*2},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*3},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*4},
	  ]},
	  {id: "lawnmowerAccel.right", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, loop: true, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*2},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*3},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*4},
	  ]},
	  {id: "lawnmowerFlames.down", kind: "anim", width: MOWER_FRONT_WIDTH, height: MOWER_HEIGHT, loop: false, frames: [
		{duration: 30, xoffset: 0,  yoffset: MOWER_HEIGHT*5},
		{duration: 30, xoffset: 0,  yoffset: MOWER_HEIGHT*6},
		{duration: 30, xoffset: 0,  yoffset: MOWER_HEIGHT*7},
		{duration: 60, xoffset: 0,  yoffset: MOWER_HEIGHT*8},
		{duration: 100, xoffset: 0, yoffset: MOWER_HEIGHT*9},
		{duration: 60, xoffset: 0,  yoffset: MOWER_HEIGHT*10},
		{duration: 100, xoffset: 0, yoffset: MOWER_HEIGHT*11},
		{duration: 100, xoffset: 0, yoffset: MOWER_HEIGHT*12},
	  ]},
	  {id: "lawnmowerFlames.left", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, loop: false, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*5},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*6},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*7},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*8},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*9},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*10},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*11},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*12},
	  ]},
	  {id: "lawnmowerFlames.up", kind: "anim", width: MOWER_BACK_WIDTH, height: MOWER_HEIGHT, loop: false, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*5},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*6},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*7},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*8},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*9},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*10},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*11},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*12},
	  ]},
	  {id: "lawnmowerFlames.right", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, loop: false, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*5},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*6},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*7},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*8},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*9},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*10},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*11},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH + MOWER_BACK_WIDTH, yoffset: MOWER_HEIGHT*12},
	  ]},
	]},
	{id: "tv", src: "./images/tv-boss.png", subids: [
		{id: "tv.idle", kind: "anim", width: TV_WIDTH, height: TV_HEIGHT, loop: true, frames: [
			{duration: 100, xoffset: TV_WIDTH*0, yoffset: 0},
			{duration: 100, xoffset: TV_WIDTH*1, yoffset: 0},
			{duration: 100, xoffset: TV_WIDTH*2, yoffset: 0},
			{duration: 100, xoffset: TV_WIDTH*3, yoffset: 0},
			{duration: 100, xoffset: TV_WIDTH*2, yoffset: 0},
			{duration: 100, xoffset: TV_WIDTH*1, yoffset: 0},
			{duration: 100, xoffset: TV_WIDTH*0, yoffset: 0},
		]},
		{id: "tv.att", kind: "anim", width: TV_WIDTH, height: TV_HEIGHT, loop: true, frames: [
			{duration: 50, xoffset: TV_WIDTH*0, yoffset: TV_HEIGHT},
			{duration: 50, xoffset: TV_WIDTH*1, yoffset: TV_HEIGHT},
			{duration: 50, xoffset: TV_WIDTH*2, yoffset: TV_HEIGHT},
			{duration: 50, xoffset: TV_WIDTH*3, yoffset: TV_HEIGHT},
			{duration: 50, xoffset: TV_WIDTH*2, yoffset: TV_HEIGHT},
			{duration: 50, xoffset: TV_WIDTH*1, yoffset: TV_HEIGHT},
			{duration: 50, xoffset: TV_WIDTH*0, yoffset: TV_HEIGHT},
		]},
	]},
	{id: "washer", src: "./images/washingmachine.png", subids: [
	  {id: "washer.idle", kind: "anim", width: WASHER_WIDTH, height: WASHER_HEIGHT, frames: [
		{duration: 1, xoffset: 0, yoffset: 0},
	  ]},
	  {id: "washer.preJump", kind: "anim", width: WASHER_WIDTH, height: WASHER_HEIGHT, loop: false, frames: [
		{duration: 60, xoffset: 0, yoffset: WASHER_HEIGHT},
		{duration: 200, xoffset: 0, yoffset: WASHER_HEIGHT*2},
		{duration: 60, xoffset: 0, yoffset: WASHER_HEIGHT*3},
		{duration: 100, xoffset: 0, yoffset: WASHER_HEIGHT*4},
	  ]},
	  {id: "washer.jump", kind: "anim", width: WASHER_WIDTH, height: WASHER_HEIGHT, loop: false, frames: [		
		{duration: 80, xoffset: 0, yoffset: WASHER_HEIGHT*5},
		{duration: 100, xoffset: 0, yoffset: WASHER_HEIGHT*6},
		{duration: 100, xoffset: 0, yoffset: WASHER_HEIGHT*7},
	  ]},
	  {id: "washer.stomp", kind: "anim", width: WASHER_WIDTH, height: WASHER_HEIGHT, loop: false, frames: [
		{duration: 90, xoffset: 0, yoffset: WASHER_HEIGHT*8},
		{duration: 160, xoffset: 0, yoffset: WASHER_HEIGHT*9},
		{duration: 40, xoffset: 0, yoffset: WASHER_HEIGHT*10},
	  ]},
	  {id: "washer.open", kind: "anim", width: WASHER_OPEN_WIDTH, height: WASHER_HEIGHT, loop: false, frames: [
		{duration: 60, xoffset: WASHER_WIDTH, yoffset: WASHER_HEIGHT},
		{duration: 200, xoffset: WASHER_WIDTH, yoffset: WASHER_HEIGHT*2},
		{duration: 40, xoffset: WASHER_WIDTH, yoffset: WASHER_HEIGHT*3},
		{duration: 60, xoffset: WASHER_WIDTH, yoffset: WASHER_HEIGHT*4},
		{duration: 100, xoffset: WASHER_WIDTH, yoffset: WASHER_HEIGHT*5},
	  ]},
	  {id: "washer.close", kind: "anim", width: WASHER_OPEN_WIDTH, height: WASHER_HEIGHT, loop: false, frames: [
		{duration: 60, xoffset: WASHER_WIDTH, yoffset: WASHER_HEIGHT*5},
		{duration: 100, xoffset: WASHER_WIDTH, yoffset: WASHER_HEIGHT*6},
	  ]},
	]},
	{id: "health", src: "./images/health.png", subids: [
	  { id: "health.dflt", kind: "anim", width: 12, height: 16, frames: [
		  { duration: 1, xoffset: 0, yoffset: 0 },
	  ]},
	]},
	{id: "pickUpsSheet", src: "./images/pickups.png", subids: [
	  { id: "spreadGun", kind: "anim", width: 12, height: 12, frames: [
		{duration: 1, xoffset: 0, yoffset: 0},
	  ]},
	  { id: "laserGun", kind: "anim", width: 12, height: 12, frames: [
		{duration: 1, xoffset: 12, yoffset: 0},
	  ]},
	]},
	{id: "projectilesSheet", src: "./images/projectiles.png", subids: [
	  { id: "bulletR", kind: "anim", width: 19, height: 9, frames: [
		{duration: 1, xoffset: 0, yoffset: 0},
	  ]},
	  { id: "bulletL", kind: "anim", width: 19, height: 9, frames: [
		{duration: 1, xoffset: 0, yoffset: 9},
	  ]},
	  { id: "bulletD", kind: "anim", width: 9, height: 19, frames: [
		{duration: 1, xoffset: 5, yoffset: 18},
	  ]},
	  { id: "bulletU", kind: "anim", width: 9, height: 19, frames: [
		{duration: 1, xoffset: 5, yoffset: 18 + 19},
	  ]},
	  { id: "spread", kind: "anim", width: 14, height: 12, frames: [
		{duration: 1, xoffset: 44, yoffset: 0},
	  ]},
	  { id: "laserR", kind: "anim", width: 25, height: 10, frames: [
		{duration: 1, xoffset: 19, yoffset: 0},
	  ]},
	  { id: "laserL", kind: "anim", width: 25, height: 10, frames: [
		{duration: 1, xoffset: 19, yoffset: 10},
	  ]},
	  { id: "laserD", kind: "anim", width: 10, height: 25, frames: [
		{duration: 1, xoffset: 26, yoffset: 20},
	  ]},
	  { id: "laserU", kind: "anim", width: 10, height: 25, frames: [
		{duration: 1, xoffset: 26, yoffset: 45},
	  ]},
	]},
	{id: "icecube", src: "./images/icecube.png", subids: [
	  { id: "icecube.dflt", kind: "anim", width: 4, height: 4, frames: [
		  { duration: 50, xoffset: 0, yoffset: 0 },
		  { duration: 50, xoffset: 4, yoffset: 0 },
		  { duration: 50, xoffset: 8, yoffset: 0 },
		  { duration: 50, xoffset: 12, yoffset: 0 },
	  ]},
	]},
	{id: "lrart", src: "./images/tiles/lrart.png", subids: [
	  {id: "lr_carpet", kind: "sprite", width: 16, height: 16, 		xoffset: 16*2, yoffset: 16*3},
	  {id: "lr_carpet_tl", kind: "sprite", width: 16, height: 16, 	xoffset: 16*1, yoffset: 16*2},
	  {id: "lr_carpet_t", kind: "sprite", width: 16, height: 16, 	xoffset: 16*2, yoffset: 16*2},
	  {id: "lr_carpet_tr", kind: "sprite", width: 16, height: 16, 	xoffset: 16*18, yoffset: 16*2},
	  {id: "lr_carpet_l", kind: "sprite", width: 16, height: 16, 	xoffset: 16*1, yoffset: 16*3},
	  {id: "lr_carpet_r", kind: "sprite", width: 16, height: 16, 	xoffset: 16*18, yoffset: 16*3},
	  {id: "lr_wall_t", kind: "sprite", width: 16, height: 32, 		xoffset: 16*2, yoffset: 16*0},
	  {id: "lr_wall_tl", kind: "sprite", width: 16, height: 32, 	xoffset: 16*1, yoffset: 16*0},
	  {id: "lr_wall_l", kind: "sprite", width: 16, height: 16, 		xoffset: 16*0, yoffset: 16*0},
	  {id: "lr_wall_tr", kind: "sprite", width: 16, height: 32, 	xoffset: 16*18, yoffset: 16*0},
	  {id: "lr_wall_r", kind: "sprite", width: 16, height: 16, 		xoffset: 16*19, yoffset: 16*0},
	  {id: "lr_wall_tlc", kind: "sprite", width: 16, height: 48, 	xoffset: 16*0, yoffset: 16*4},
	  {id: "lr_wall_blc", kind: "sprite", width: 16, height: 16, 	xoffset: 16*0, yoffset: 16*8},
	  {id: "lr_wall_trc", kind: "sprite", width: 16, height: 48, 	xoffset: 16*19, yoffset: 16*4},
	  {id: "lr_wall_brc", kind: "sprite", width: 16, height: 16, 	xoffset: 16*19, yoffset: 16*8},
	  {id: "lr_landing", kind: "sprite", width: 32, height: 16, 	xoffset: 16*6, yoffset: 16*2},
	  {id: "lr_door", kind: "sprite", width: 32, height: 32, 		xoffset: 16*6, yoffset: 16*0},
	  {id: "lr_window", kind: "sprite", width: 32, height: 32, 		xoffset: 16*9, yoffset: 16*0},
	  {id: "lr_chair", kind: "sprite", width: 32, height: 32, 		xoffset: 16*22, yoffset: 16*2},
	  {id: "side_table", kind: "sprite", width: 16, height: 32, 	xoffset: 16*24, yoffset: 16*2},
	  {id: "plant", kind: "sprite", width: 16, height: 32, 			xoffset: 16*25, yoffset: 16*2},
	  {id: "bookcase", kind: "sprite", width: 32, height: 48, 		xoffset: 16*20, yoffset: 16*4},
	  {id: "bookcase_l", kind: "sprite", width: 16, height: 64, 	xoffset: 16*22, yoffset: 16*4},
	  {id: "bookcase_r", kind: "sprite", width: 16, height: 64, 	xoffset: 16*23, yoffset: 16*4},
	  {id: "coatrack", kind: "sprite", width: 32, height: 48, 		xoffset: 16*26, yoffset: 16*2},
	  {id: "lamp", kind: "anim", width: 32, height: 48, frames: [
		  { duration: 3000, xoffset: 16*28, yoffset: 0 },
		  { duration: 3000, xoffset: 16*30, yoffset: 0 },
	  ]},
	  {id: "tv", kind: "anim", width: 32, height: 32, frames: [
		  { duration: 500, xoffset: 16*20, yoffset: 0 },
		  { duration: 500, xoffset: 16*22, yoffset: 0 },
		  { duration: 500, xoffset: 16*24, yoffset: 0 },
		  { duration: 500, xoffset: 16*26, yoffset: 0 },
	  ]},
	]},
	{id: "laundry_art", src: "./images/tiles/laundry_art.png", subids: [
	  {id: "laundry_wall_l", kind: "sprite", width: 16, height: 16, 		xoffset: 16*0, yoffset: 16*0},
	  {id: "laundry_wall_bl", kind: "sprite", width: 16, height: 48, 		xoffset: 16*0, yoffset: 16*4},
	  {id: "laundry_wall_tl", kind: "sprite", width: 16, height: 48, 		xoffset: 16*0, yoffset: 16*8},
	  {id: "laundry_wall_t", kind: "sprite", width: 16, height: 16, 		xoffset: 16*2, yoffset: 16*0},
	  {id: "laundry_wall_ttl", kind: "sprite", width: 16, height: 16, 		xoffset: 16*1, yoffset: 16*0},
	  {id: "laundry_wall_ltt", kind: "sprite", width: 16, height: 16, 		xoffset: 16*6, yoffset: 16*0},
	  {id: "laundry_wall_ttr", kind: "sprite", width: 16, height: 16, 		xoffset: 16*9, yoffset: 16*0},
	  {id: "laundry_wall_rtt", kind: "sprite", width: 16, height: 16, 		xoffset: 16*18, yoffset: 16*0},
	  {id: "laundry_wall_r", kind: "sprite", width: 16, height: 16, 		xoffset: 16*19, yoffset: 16*0},
	  {id: "laundry_bwall_ttr", kind: "sprite", width: 16, height: 48, 		xoffset: 16*19, yoffset: 16*4},
	  {id: "laundry_bwall_rtb", kind: "sprite", width: 16, height: 16, 		xoffset: 16*19, yoffset: 16*8},
	  {id: "laundry_twall_t", kind: "sprite", width: 16, height: 16, 		xoffset: 16*12, yoffset: 16*1},
	  {id: "laundry_twall_rtt", kind: "sprite", width: 16, height: 16, 		xoffset: 16*18, yoffset: 16*1},
	  {id: "laundry_tile_a", kind: "sprite", width: 16, height: 16, 		xoffset: 16*4, yoffset: 16*5},
	  {id: "laundry_tile_a_t", kind: "sprite", width: 16, height: 16, 		xoffset: 16*0, yoffset: 16*7},
	  {id: "laundry_tile_a_r", kind: "sprite", width: 16, height: 16, 		xoffset: 16*8, yoffset: 16*1},
	  {id: "laundry_tile_a_l", kind: "sprite", width: 16, height: 16, 		xoffset: 16*2, yoffset: 16*5},
	  {id: "laundry_tile_a_ttl", kind: "sprite", width: 16, height: 16, 	xoffset: 16*2, yoffset: 16*3},
	  {id: "laundry_tile_b", kind: "sprite", width: 16, height: 16, 		xoffset: 16*4, yoffset: 16*4},
	  {id: "laundry_tile_b_t", kind: "sprite", width: 16, height: 16, 		xoffset: 16*1, yoffset: 16*7},
	  {id: "laundry_tile_b_l", kind: "sprite", width: 16, height: 16, 		xoffset: 16*2, yoffset: 16*4},
	  {id: "laundry_tile_b_r", kind: "sprite", width: 16, height: 16, 		xoffset: 16*8, yoffset: 16*0},
	  {id: "laundry_tile_b_rtt", kind: "sprite", width: 16, height: 16,		xoffset: 16*18, yoffset: 16*2},
	  {id: "laundry_tile_c", kind: "sprite", width: 16, height: 16, 		xoffset: 16*3, yoffset: 16*4},
	  {id: "laundry_tile_c_t", kind: "sprite", width: 16, height: 16, 		xoffset: 16*13, yoffset: 16*2},
	  {id: "laundry_tile_c_l", kind: "sprite", width: 16, height: 16, 		xoffset: 16*7, yoffset: 16*0},
	  {id: "laundry_ctr_ttl", kind: "sprite", width: 16, height: 16, 		xoffset: 16*1, yoffset: 16*1},
	  {id: "laundry_ctr_l", kind: "sprite", width: 16, height: 16, 			xoffset: 16*1, yoffset: 16*2},
	  {id: "laundry_ctr_ltt", kind: "sprite", width: 16, height: 16, 		xoffset: 16*1, yoffset: 16*5},
	  {id: "laundry_ctr_t", kind: "sprite", width: 16, height: 16, 			xoffset: 16*2, yoffset: 16*1},
	  {id: "laundry_ctr_rtt", kind: "sprite", width: 16, height: 16, 		xoffset: 16*6, yoffset: 16*1},
	  {id: "laundry_ctr_ttr", kind: "sprite", width: 16, height: 16, 		xoffset: 16*9, yoffset: 16*1},
	  {id: "laundry_cab_lside", kind: "sprite", width: 16, height: 16, 		xoffset: 16*1, yoffset: 16*6},
	  {id: "laundry_cab_ldoor", kind: "sprite", width: 16, height: 16, 		xoffset: 16*2, yoffset: 16*2},
	  {id: "laundry_cab_rdoor", kind: "sprite", width: 16, height: 16, 		xoffset: 16*6, yoffset: 16*2},
	  {id: "laundry_cab_shelf", kind: "sprite", width: 32, height: 16, 		xoffset: 16*3, yoffset: 16*2},
	  {id: "laundry_cab_open", kind: "sprite", width: 32, height: 16, 		xoffset: 16*25, yoffset: 16*0},
	  {id: "wash_dryer", kind: "sprite", width: 48, height: 48, 			xoffset: 16*20, yoffset: 16*0},
	  {id: "laundry_sink", kind: "sprite", width: 32, height: 32,			xoffset: 16*23, yoffset: 16*0},
	  {id: "laundry_rack", kind: "sprite", width: 32, height: 48,			xoffset: 16*27, yoffset: 16*0},
	  {id: "laundry_basket", kind: "sprite", width: 16, height: 32,			xoffset: 16*29, yoffset: 16*0},
	  {id: "mop", kind: "sprite", width: 16, height: 48,					xoffset: 16*30, yoffset: 16*0},
	  {id: "potion_purple_o", kind: "sprite", width: 16, height: 32,		xoffset: 16*20, yoffset: 16*3},
	  {id: "potion_green_o", kind: "sprite", width: 16, height: 16,			xoffset: 16*21, yoffset: 16*3},
	  {id: "potion_blue_o", kind: "sprite", width: 16, height: 16,			xoffset: 16*21, yoffset: 16*4},
	  {id: "potion_red_o", kind: "sprite", width: 16, height: 32,			xoffset: 16*22, yoffset: 16*3},
	  {id: "potion_black_o", kind: "sprite", width: 16, height: 32,			xoffset: 16*23, yoffset: 16*3},
	  {id: "potion_yellow_o", kind: "sprite", width: 16, height: 32,		xoffset: 16*24, yoffset: 16*3},
	  {id: "potion_cluster_a", kind: "sprite", width: 16, height: 32,		xoffset: 16*20, yoffset: 16*5},
	  {id: "potion_cluster_b", kind: "sprite", width: 16, height: 32,		xoffset: 16*21, yoffset: 16*5},

	]},
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
			subids: assetDef.subids || [],
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
		if (value.type === "images") {
		  const asset = {img: value.asset, kind: "sprite", id: value.id};
		  this.assets[value.type][value.id] = asset;
		  for (const spec of value.subids) {
			const subasset = Object.assign({}, spec)
			subasset.img = value.asset;
			//console.log("subasset: " + Fmt.ofmt(subasset));
		    this.assets[value.type][subasset.id] = subasset;
		  }
		} else {
		  this.assets[value.type][value.id] = value.asset;
		}
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
