import { Fmt } from "./fmt.js";
import {MOWER_FRONT_WIDTH, MOWER_BACK_WIDTH, MOWER_SIDE_WIDTH, MOWER_HEIGHT} from "./bosses.js";

const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 32;
const BROOM_WIDTH = 14;
const BROOM_HEIGHT = 26;
const BROOM_ATTACK_WIDTH = 28;

const assetDefs = {
  images: [
	{id: "player", src: "./images/julhilde.png", subids: [
	  { id: "player.down", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: 0, yoffset: 0},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player.left", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player.up", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player.right", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: 0},
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: PLAYER_HEIGHT*3},
	  ]},
	  { id: "player.downB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: 0, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: 0, yoffset: 0},
	  ]},
	  { id: "player.leftB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH, yoffset: 0},
	  ]},
	  { id: "player.upB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*2, yoffset: 0},
	  ]},
	  { id: "player.rightB", kind: "anim", width: PLAYER_WIDTH, height: PLAYER_HEIGHT, frames: [
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: PLAYER_HEIGHT*3},
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: PLAYER_HEIGHT*2},
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: PLAYER_HEIGHT*1},
		  {duration: 150, xoffset: PLAYER_WIDTH*3, yoffset: 0},
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
	  {id: "lawnmowerFlames.down", kind: "anim", width: MOWER_FRONT_WIDTH, height: MOWER_HEIGHT, frames: [
		{duration: 30, xoffset: 0,  yoffset: MOWER_HEIGHT*5},
		{duration: 30, xoffset: 0,  yoffset: MOWER_HEIGHT*6},
		{duration: 30, xoffset: 0,  yoffset: MOWER_HEIGHT*7},
		{duration: 60, xoffset: 0,  yoffset: MOWER_HEIGHT*8},
		{duration: 100, xoffset: 0, yoffset: MOWER_HEIGHT*9},
		{duration: 60, xoffset: 0,  yoffset: MOWER_HEIGHT*10},
		{duration: 100, xoffset: 0, yoffset: MOWER_HEIGHT*11},
		{duration: 100, xoffset: 0, yoffset: MOWER_HEIGHT*12},
	  ]},
	  {id: "lawnmowerFlames.left", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*5},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*6},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*7},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*8},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*9},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH,  yoffset: MOWER_HEIGHT*10},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*11},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH, yoffset: MOWER_HEIGHT*12},
	  ]},
	  {id: "lawnmowerFlames.up", kind: "anim", width: MOWER_BACK_WIDTH, height: MOWER_HEIGHT, frames: [
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*5},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*6},
		{duration: 30, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*7},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*8},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*9},
		{duration: 60, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*10},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*11},
		{duration: 100, xoffset: MOWER_FRONT_WIDTH + MOWER_SIDE_WIDTH, yoffset: MOWER_HEIGHT*12},
	  ]},
	  {id: "lawnmowerFlames.right", kind: "anim", width: MOWER_SIDE_WIDTH, height: MOWER_HEIGHT, frames: [
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
	{id: "health", src: "./images/health.png", subids: [
	  { id: "health.dflt", kind: "anim", width: 12, height: 16, frames: [
		  { duration: 1, xoffset: 0, yoffset: 0 },
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
