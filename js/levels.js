import {canvasData} from './globals.js';
import { Grid } from './grid.js';
import { Entity } from './entity.js';
import { BroomEnemy, ShovelEnemy } from './enemies.js';
import { FridgeBoss, LawnMowerBoss, TVBoss, WasherBoss } from './bosses.js';

const HGRA = "higrass_a";
const LGRB = "lograss_b";
const FTLL = "fence_tll";
const FTLU = "fence_tlu";
const FBLL = "fence_bll";
const FBLU = "fence_blu";
const FTRL = "fence_trl";
const FTRU = "fence_tru";
const FBRL = "fence_brl";
const FBRU = "fence_bru";
const FCTA = "fence_t_a";
const FCTB = "fence_t_b";
const FNCL = "fence_l";
const FNCR = "fence_r";
const FCBA = "fence_b_a";
const FCBB = "fence_b_b";
const GTTL = "fence_gate_tl";
const GTTR = "fence_gate_tr";
const GTLL = "fence_gate_ll";
const GTLU = "fence_gate_lu";
const GTRL = "fence_gate_rl";
const GTRU = "fence_gate_ru";
const PVRA = "paver_a";
const PVRB = "paver_b";
const PVRC = "paver_c";
const PVRD = "paver_d";
const NOOP = "undefined";
const TILE = "kitchen_tile";
const TILL = "kitchen_tile_l";
const TILR = "kitchen_tile_r";
const TITL = "kitchen_tile_tl";
const TILT = "kitchen_tile_t";
const MCWV = "microwave";
const TEAP = "teapot";
const KWLL = "kwall_l";
const KWLT = "kwall_t";
const KTLU = "kwall_tl_u";
const KWRU = "kwall_r_u";
const KWRM = "kwall_r_m";
const KWRL = "kwall_r_l";
const KWIN = "kwindow";
const STOV = "stove";
const FRDG = "fridge.sleep";
const BWLU = "beige_wall_l_u";
const BWTU = "beige_wall_t_u";
const BTRU = "beige_wall_tr_u";
const BWLR = "beige_wall_r";
const BWRU = "beige_wall_r_u";
const BWRM = "beige_wall_r_m";
const BWRL = "beige_wall_r_l";
const BWLL = "beige_wall_l";
const BWTL = "beige_wall_tl";
const BWTR = "beige_wall_tr";
const CTCL = "counter_cl";
const SINK = "sink";
const CTRT = "counter_t";
const CTTR = "counter_tr";
const CTTL = "counter_tl";
const CTRL = "counter_l";
const CTLB = "counter_lb";
const CHRL = "chair_l";
const CHRR = "chair_r";
const TABL = "table";
const CBWL = "cab_drawer_l";
const CBWW = "cab_drawer";
const CBDL = "cab_door_l";
const CBDR = "cab_door_r";
const CBPN = "cab_panel";

const SIZE = 16;
const WIDTH = 20;
const HEIGHT = 15;

const LVL1_BG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	entries: [
		FTLL, FCTA, FCTB, FCTA, FCTA, FCTB, FCTA, FCTA, GTTL, PVRA, PVRB, GTTR, FCTA, FCTB, FCTA, FCTA, FCTB, FCTA, FCTB, FTRL,
		HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, PVRC, PVRD, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		PVRB, PVRC, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, PVRB, PVRD,
		PVRA, PVRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, PVRA, PVRC,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, LGRB, HGRA, HGRA,
		HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, PVRB, PVRC, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA,
		HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, PVRD, PVRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA, HGRA,
	],
});

const LVL1_MID_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
});
LVL1_MID_GRID.set("wateringCan", 17, 0);

const LVL1_FG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	properties: { fg: true },
	entries: [
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FBLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FBRU,
		GTLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, GTRU,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		FTLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FTRU,
		GTLL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, GTRL,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FNCL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FNCR,
		FBLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FTRU, NOOP, NOOP, FTLU, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, FBRU,
		FBLL, FCBA, FCBA, FCBB, FCBA, FCBB, FCBA, FCBA, FBRL, NOOP, NOOP, FBLL, FCBA, FCBB, FCBA, FCBA, FCBB, FCBA, FCBA, FBRL,
	],
});

const LVL2_BG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	entries: [
		KWLL, KTLU, KWLT, KWIN, NOOP, KWLT, KWLT, STOV, NOOP, KWLT, KWLT, KWLT, KWRM, TILL, TILR, BWLU, BWTU, BWTU, BTRU, BWLR,
		KWLL, CTCL, CTRT, SINK, NOOP, CTRT, CTTR, NOOP, NOOP, CTTL, CTTR, TILE, TILE, TILL, TILR, CHRL, TABL, NOOP, CHRR, BWLR,
		KWLL, CTRL, CBWL, CBDL, CBDR, CBDL, CBDR, NOOP, NOOP, CBWW, CBWW, TILE, TILE, TILL, TILE, NOOP, NOOP, NOOP, NOOP, BWLR,
		KWLL, CTRL, TITL, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILT, TILE, TILE, TILE, TILE, TILE, TILR, BWLR,
		KWRU, CTRL, TILL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILR, BWRU,
		KWRM, CTLB, TILL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILR, BWRM,
		KWRL, CBPN, TILL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILR, BWRL,
		TILT, TILT, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILT,
		BWTL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWTR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
		BWLL, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, TILE, BWLR,
	],
});

const LVL2_MID_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
});
LVL2_MID_GRID.set(MCWV, 2, 0);
LVL2_MID_GRID.set(FRDG, 11, 0);
LVL2_MID_GRID.set(TEAP, 6, 0);
LVL2_MID_GRID.set("cauldron", 9, 0);
LVL2_MID_GRID.set("potion_cluster_b", 5, 0);
LVL2_MID_GRID.set("potion_cluster_a", 1, 0);
LVL2_MID_GRID.set("potion_black_o", 1, 3);

const LVL2_FG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	properties: { fg: true },
	entries: [
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
	],
});

const CARP = "lr_carpet";
const CRPL = "lr_carpet_l";
const CRPT = "lr_carpet_t";
const CRPR = "lr_carpet_r";
const CRTL = "lr_carpet_tl";
const CRTR = "lr_carpet_tr";

const LWLT = "lr_wall_t";
const LWTL = "lr_wall_tl";
const LWTR = "lr_wall_tr";
const LWLR = "lr_wall_r";
const LWLL = "lr_wall_l";
const LTLC = "lr_wall_tlc";
const LBLC = "lr_wall_blc";
const LTRC = "lr_wall_trc";
const LBRC = "lr_wall_brc";
const LAND = "lr_landing";
const DOOR = "lr_door";
const LRWD = "lr_window";
const LAMP = "lamp";
const TELE = "tv";
const LCHR = "lr_chair";
const STBL = "side_table";
const BKCS = "bookcase";
const BKCL = "bookcase_l";
const BKCR = "bookcase_r";
const PLNT = "plant";
const CTRK = "coatrack";

const LVL3_BG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	entries: [
		LWLL, LWTL, LWLT, LWLT, LRWD, NOOP, LWLT, LWLT, LWLT, DOOR, NOOP, LWLT, LWLT, LRWD, NOOP, LWLT, LWLT, LWLT, LWTR, LWLR,
		LWLL, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, LWLR,
		LWLL, CRTL, CRPT, CRPT, CRPT, CRPT, CRPT, CRPT, CRPT, LAND, NOOP, CRPT, CRPT, CRPT, CRPT, CRPT, CRPT, CRPT, CRTR, LWLR,
		LWLL, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, LWLR,
		LTLC, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, LTRC,
		NOOP, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, NOOP,
		NOOP, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, NOOP,
		CRPT, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPT,
		LBLC, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, LBRC,
		LWLL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, LWLR,
		LWLL, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, LWLR,
		LWLL, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, LWLR,
		LWLL, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, LWLR,
		LWLL, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, LWLR,
		LWLL, CRPL, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CARP, CRPR, LWLR,
	],
});

const LVL3_MID_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
});
LVL3_MID_GRID.set(PLNT, 1, 1);
LVL3_MID_GRID.set(LCHR, 2, 1);
LVL3_MID_GRID.set(STBL, 4, 1);
LVL3_MID_GRID.set(BKCS, 7, 0);
LVL3_MID_GRID.set(CTRK, 11, 0);
LVL3_MID_GRID.set(TELE, 13, 1);
LVL3_MID_GRID.set(LCHR, 15, 1);
LVL3_MID_GRID.set(LAMP, 17, 0);
LVL3_MID_GRID.set(BKCL, 1, 10);
LVL3_MID_GRID.set(BKCR, 18, 10);

const LVL3_FG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	properties: { fg: true },
	entries: [
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
		NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP, NOOP,
	],
});

const LTLa = "laundry_tile_a";
const LTaT = "laundry_tile_a_t";
const LTaR = "laundry_tile_a_r";
const LTaL = "laundry_tile_a_l";
const LaTL = "laundry_tile_a_ttl";

const LTLb = "laundry_tile_b";
const LTbT = "laundry_tile_b_t";
const LTbL = "laundry_tile_b_l";
const LTbR = "laundry_tile_b_r";
const LbRT = "laundry_tile_b_rtt";

const LTLc = "laundry_tile_c";
const LTcT = "laundry_tile_c_t";
const LTcL = "laundry_tile_c_l";

const UWLL = "laundry_wall_l";
const UWBL = "laundry_wall_bl";
const UWTL = "laundry_wall_tl";
const UWLT = "laundry_wall_t";
const UTTL = "laundry_wall_ttl";
const ULTT = "laundry_wall_ltt";
const UTTR = "laundry_wall_ttr";
const URTT = "laundry_wall_rtt";
const UWLR = "laundry_wall_r";
const BTTR = "laundry_bwall_ttr";
const BRTB = "laundry_bwall_rtb";

const TWLT = "laundry_twall_t";
const TWRT = "laundry_twall_rtt";

const LCTL = "laundry_ctr_ttl";
const LCL_ = "laundry_ctr_l";
const LCLT = "laundry_ctr_ltt";
const LCT_ = "laundry_ctr_t";
const LCTR = "laundry_ctr_ttr";
const LCRT = "laundry_ctr_rtt";

const CBLS = "laundry_cab_lside";
const CBLD = "laundry_cab_ldoor";
const CBRD = "laundry_cab_rdoor";
const CBSH = "laundry_cab_shelf";
const CBOP = "laundry_cab_open";

const LVL4_BG_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
	entries: [
		UWLL, UTTL, UWLT, UWLT, UWLT, UWLT, ULTT, LTcL, LTbR, UTTR, UWLT, UWLT, UWLT, UWLT, UWLT, UWLT, UWLT, UWLT, URTT, UWLR,
		UWLL, LCTL, LCT_, LCT_, LCT_, LCT_, LCRT, LTbL, LTaR, LCTR, LCT_, LCRT, TWLT, TWLT, TWLT, TWLT, TWLT, TWLT, TWRT, UWLR,
		UWLL, LCL_, CBLD, CBSH, NOOP, CBLD, CBRD, LTcL, LTbR, CBLD, LTbT, LTcT, LTbT, LTcT, LTbT, LTcT, LTbT, LTcT, LbRT, UWLR,
		UWLL, LCL_, LaTL, LTbT, LTaT, LTbT, LTaT, LTLb, LTLa, LTbT, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTaR, UWLR,
		UWBL, LCL_, LTbL, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTbR, BTTR,
		NOOP, LCLT, LTaL, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTaR, NOOP,
		NOOP, CBLS, LTbL, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTbR, NOOP,
		LTaT, LTbT, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTbT,
		UWTL, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, BRTB,
		UWLL, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, UWLR,
		UWLL, LTcL, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTbR, UWLR,
		UWLL, LTbL, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTaR, UWLR,
		UWLL, LTcL, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTbR, UWLR,
		UWLL, LTbL, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTLa, LTLb, LTaR, UWLR,
		UWLL, LTcL, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTLb, LTLc, LTbR, UWLR,
	],
});

const LVL4_MID_GRID = new Grid({
	width: WIDTH,
	height: HEIGHT,
});
LVL4_MID_GRID.set(CBOP, 10, 2);
LVL4_MID_GRID.set("wash_dryer", 12, 0);
LVL4_MID_GRID.set("laundry_sink", 5, 0);
LVL4_MID_GRID.set("laundry_rack", 15, 0);
LVL4_MID_GRID.set("laundry_basket", 17, 1);
LVL4_MID_GRID.set("laundry_basket", 11, 0);
LVL4_MID_GRID.set("mop", 18, 0);
LVL4_MID_GRID.set("potion_yellow_o", 9, 0);
LVL4_MID_GRID.set("potion_cluster_a", 10, 0);
LVL4_MID_GRID.set("potion_cluster_b", 1, 3);
LVL4_MID_GRID.set("potion_yellow_o", 1, 2);
LVL4_MID_GRID.set("potion_purple_o", 1, 1);

export const LEVELS = [
	{
		name: "Level 1", loaded: false, complete: false,
		grids: [LVL1_BG_GRID, LVL1_MID_GRID, LVL1_FG_GRID],
		waves: [
			// {
			// 	spawners: [
			// 		{ cls: BroomEnemy, x: 20, y: 10, amount: 10 },
			// 		{ cls: BroomEnemy, x: 20, y: 200, amount: 10 },
			// 		{ cls: BroomEnemy, x: 300, y: 10, amount: 10 },
			// 		{ cls: BroomEnemy, x: 300, y: 200, amount: 10 },
			// 	],
			// 	timeOut: 10,
			// },
			// {
			// 	spawners: [
			// 		{ cls: BroomEnemy, x: 100, y: 10, amount: 12 },
			// 		{ cls: BroomEnemy, x: 100, y: 220, amount: 12 },
			// 		{ cls: BroomEnemy, x: 10, y: 100, amount: 12 },
			// 		{ cls: BroomEnemy, x: 300, y: 100, amount: 12 },
			// 	],
			// 	timeOut: 10,
			// },
		],
		initialEnemies: [
			{ cls: ShovelEnemy, x: 302, y: 101 },
			{ cls: ShovelEnemy, x: 304, y: 103 },
			{ cls: ShovelEnemy, x: 305, y: 105 },
			{ cls: ShovelEnemy, x: 301, y: 107 },
			{ cls: ShovelEnemy, x: 303, y: 99 },
			{ cls: ShovelEnemy, x: 305, y: 97 },
			{ cls: ShovelEnemy, x: 299, y: 95 },
			{ cls: ShovelEnemy, x: 295, y: 92 },
			{ cls: ShovelEnemy, x: 293, y: 104 }
		],
		unwalkables: [],
		boss: { cls: LawnMowerBoss, x: 110, y: 30 }
	},
	{
		name: "Level 2", loaded: false, complete: false,
		grids: [LVL2_BG_GRID, LVL2_MID_GRID, LVL2_FG_GRID],
		initialEnemies: [
			/*
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  {cls: BroomEnemy, x: 300, y: 200},
		  */
		],
		waves: [
			{
				spawners: [
					{cls: BroomEnemy, x: SIZE*20, y: SIZE*6,  amount: 20},
					{cls: BroomEnemy, x: 0, y: SIZE*6,  amount: 20},
					{cls: BroomEnemy, x: SIZE*14, y: 0,  amount: 20},
					{cls: BroomEnemy, x: SIZE*12, y: SIZE*20,  amount: 20},
				],
				timeOut: Infinity,
			},
		],
		unwalkables: [
			{x: 0, y: 0, width: SIZE*11, height: SIZE*2},
			{x: SIZE*15, y: 0, width: SIZE*4, height: SIZE*2},
			{x: SIZE*19, y: 0, width: SIZE, height: SIZE*6},
			{x: 0, y: SIZE*2, width: SIZE*2, height: SIZE*4},
			{x: 0, y: SIZE*8, width: SIZE, height: SIZE*7},
			{x: SIZE*19, y: SIZE*8, width: SIZE, height: SIZE*7},
		],
		boss: { cls: FridgeBoss, x: 110, y: 100 }
	},
	{
		name: "Level 3", loaded: false, complete: false,
		grids: [LVL3_BG_GRID, LVL3_MID_GRID, LVL3_FG_GRID],
		initialEnemies: [
		],
		waves: [
			{
				spawners: [
				],
				timeOut: Infinity,
			},
		],
		unwalkables: [
			{x: 0, y: 0, width: SIZE*5, height: SIZE*2},
			{x: SIZE*5, y: 0, width: SIZE*2, height: SIZE},
			{x: SIZE*7, y: 0, width: SIZE*2, height: SIZE*2},
			{x: SIZE*9, y: 0, width: SIZE*2, height: SIZE},
			{x: SIZE*11, y: 0, width: SIZE*8, height: SIZE*2},
			{x: SIZE*20, y: 0, width: SIZE, height: SIZE*6},
			{x: 0, y: SIZE*2, width: SIZE, height: SIZE*4},
			{x: 0, y: SIZE*8, width: SIZE, height: SIZE*2},
			{x: 0, y: SIZE*10, width: SIZE*1.5, height: SIZE*4},
			{x: 0, y: SIZE*13, width: SIZE, height: SIZE*2},
			{x: SIZE*20, y: SIZE*8, width: SIZE, height: SIZE*2},
			{x: SIZE*18.5, y: SIZE*10, width: SIZE*1.5, height: SIZE*4},
			{x: SIZE*20, y: SIZE*13, width: SIZE, height: SIZE*2},
		],
		boss: { cls: TVBoss, x: 110, y: 100 }
	},
	{
		name: "Level 4", loaded: false, complete: false,
		grids: [LVL4_BG_GRID, LVL4_MID_GRID],
		initialEnemies: [
		],
		waves: [
			{
				spawners: [
				],
				timeOut: Infinity,
			},
		],
		unwalkables: [
			{x: 0, y: 0, width: SIZE*7, height: SIZE*2},
			{x: SIZE*9, y: 0, width: SIZE*3, height: SIZE*2},
			{x: SIZE*15, y: 0, width: SIZE*4, height: SIZE*2},
			{x: SIZE*20, y: 0, width: SIZE, height: SIZE*6},
			{x: 0, y: SIZE*2, width: SIZE*2, height: SIZE*4},
			{x: 0, y: SIZE*8, width: SIZE, height: SIZE*7},
			{x: SIZE*20, y: SIZE*8, width: SIZE, height: SIZE*7},
		],
		boss: { cls: WasherBoss, x: 110, y: 100 }
	},
];


export class UnWalkable extends Entity {
	constructor(spec) {
		const x = spec.x;
		const y = spec.y;
		const width = spec.width;
		const height = spec.height;
		super("unwalkable", {x: x, y: y}, width, height, {x: x, y: y, width: width, height: height}, Infinity);
		this.canCollideWithTypes.add("player");
		this.canCollideWithTypes.add("enemy");
	}

	reset(spec) {
		this.pos.x = this.collider.x = spec.x;
		this.pos.y = this.collider.y = spec.y;
		this.width = this.collider.width = spec.width;
		this.height = this.collider.height = spec.height;
	}

	draw() {
		if (window.debugMode) {
			canvasData.context.fillStyle = 'cyan';
			canvasData.context.fillRect(this.collider.x, this.collider.y, this.collider.width, this.collider.height);
		}
	}
}
