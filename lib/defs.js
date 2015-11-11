exports.MSG_TYPES =
[
    'N_CONNECT', 'N_SERVINFO', 'N_WELCOME', 'N_INITCLIENT', 'N_POS', 'N_TEXT', 'N_SOUND', 'N_CDIS',
    'N_SHOOT', 'N_EXPLODE', 'N_SUICIDE',
    'N_DIED', 'N_DAMAGE', 'N_HITPUSH', 'N_SHOTFX', 'N_EXPLODEFX',
    'N_TRYSPAWN', 'N_SPAWNSTATE', 'N_SPAWN', 'N_FORCEDEATH',
    'N_GUNSELECT', 'N_TAUNT',
    'N_MAPCHANGE', 'N_MAPVOTE', 'N_TEAMINFO', 'N_ITEMSPAWN', 'N_ITEMPICKUP', 'N_ITEMACC', 'N_TELEPORT', 'N_JUMPPAD',
    'N_PING', 'N_PONG', 'N_CLIENTPING',
    'N_TIMEUP', 'N_FORCEINTERMISSION',
    'N_SERVMSG', 'N_ITEMLIST', 'N_RESUME',
    'N_EDITMODE', 'N_EDITENT', 'N_EDITF', 'N_EDITT', 'N_EDITM', 'N_FLIP', 'N_COPY', 'N_PASTE', 'N_ROTATE', 'N_REPLACE', 'N_DELCUBE', 'N_REMIP', 'N_NEWMAP', 'N_GETMAP', 'N_SENDMAP', 'N_CLIPBOARD', 'N_EDITVAR',
    'N_MASTERMODE', 'N_KICK', 'N_CLEARBANS', 'N_CURRENTMASTER', 'N_SPECTATOR', 'N_SETMASTER', 'N_SETTEAM',
    'N_BASES', 'N_BASEINFO', 'N_BASESCORE', 'N_REPAMMO', 'N_BASEREGEN', 'N_ANNOUNCE',
    'N_LISTDEMOS', 'N_SENDDEMOLIST', 'N_GETDEMO', 'N_SENDDEMO',
    'N_DEMOPLAYBACK', 'N_RECORDDEMO', 'N_STOPDEMO', 'N_CLEARDEMOS',
    'N_TAKEFLAG', 'N_RETURNFLAG', 'N_RESETFLAG', 'N_INVISFLAG', 'N_TRYDROPFLAG', 'N_DROPFLAG', 'N_SCOREFLAG', 'N_INITFLAGS',
    'N_SAYTEAM',
    'N_CLIENT',
    'N_AUTHTRY', 'N_AUTHKICK', 'N_AUTHCHAL', 'N_AUTHANS', 'N_REQAUTH',
    'N_PAUSEGAME', 'N_GAMESPEED',
    'N_ADDBOT', 'N_DELBOT', 'N_INITAI', 'N_FROMAI', 'N_BOTLIMIT', 'N_BOTBALANCE',
    'N_MAPCRC', 'N_CHECKMAPS',
    'N_SWITCHNAME', 'N_SWITCHMODEL', 'N_SWITCHTEAM',
    'N_INITTOKENS', 'N_TAKETOKEN', 'N_EXPIRETOKENS', 'N_DROPTOKENS', 'N_DEPOSITTOKENS', 'N_STEALTOKENS',
    'N_SERVCMD',
    'N_DEMOPACKET',
    'NUMMSG'
];

exports.MSG_TYPES_N =
{
	"N_CONNECT": 0, "N_SERVINFO": 1, "N_WELCOME": 2, "N_INITCLIENT": 3,
	"N_POS": 4, "N_TEXT": 5, "N_SOUND": 6, "N_CDIS": 7, "N_SHOOT": 8,
	"N_EXPLODE": 9, "N_SUICIDE": 10, "N_DIED": 11, "N_DAMAGE": 12,
	"N_HITPUSH": 13, "N_SHOTFX": 14, "N_EXPLODEFX": 15, "N_TRYSPAWN": 16,
	"N_SPAWNSTATE": 17, "N_SPAWN": 18, "N_FORCEDEATH": 19, "N_GUNSELECT": 20,
	"N_TAUNT": 21, "N_MAPCHANGE": 22, "N_MAPVOTE": 23, "N_TEAMINFO": 24,
	"N_ITEMSPAWN": 25, "N_ITEMPICKUP": 26, "N_ITEMACC": 27, "N_TELEPORT": 28,
	"N_JUMPPAD": 29, "N_PING": 30, "N_PONG": 31, "N_CLIENTPING": 32,
	"N_TIMEUP": 33, "N_FORCEINTERMISSION": 34, "N_SERVMSG": 35,
	"N_ITEMLIST": 36, "N_RESUME": 37, "N_EDITMODE": 38, "N_EDITENT": 39,
	"N_EDITF": 40, "N_EDITT": 41, "N_EDITM": 42, "N_FLIP": 43, "N_COPY": 44,
	"N_PASTE": 45, "N_ROTATE": 46, "N_REPLACE": 47, "N_DELCUBE": 48,
	"N_REMIP": 49, "N_NEWMAP": 50, "N_GETMAP": 51, "N_SENDMAP": 52,
	"N_CLIPBOARD": 53, "N_EDITVAR": 54, "N_MASTERMODE": 55, "N_KICK": 56,
	"N_CLEARBANS": 57, "N_CURRENTMASTER": 58, "N_SPECTATOR": 59,
	"N_SETMASTER": 60, "N_SETTEAM": 61, "N_BASES": 62, "N_BASEINFO": 63,
	"N_BASESCORE": 64, "N_REPAMMO": 65, "N_BASEREGEN": 66, "N_ANNOUNCE": 67,
	"N_LISTDEMOS": 68, "N_SENDDEMOLIST": 69, "N_GETDEMO": 70, "N_SENDDEMO": 71,
	"N_DEMOPLAYBACK": 72, "N_RECORDDEMO": 73, "N_STOPDEMO": 74,
	"N_CLEARDEMOS": 75, "N_TAKEFLAG": 76, "N_RETURNFLAG": 77, "N_RESETFLAG": 78,
	"N_INVISFLAG": 79, "N_TRYDROPFLAG": 80, "N_DROPFLAG": 81, "N_SCOREFLAG": 82,
	"N_INITFLAGS": 83, "N_SAYTEAM": 84, "N_CLIENT": 85, "N_AUTHTRY": 86,
	"N_AUTHKICK": 87, "N_AUTHCHAL": 88, "N_AUTHANS": 89, "N_REQAUTH": 90,
	"N_PAUSEGAME": 91, "N_GAMESPEED": 92, "N_ADDBOT": 93, "N_DELBOT": 94,
	"N_INITAI": 95, "N_FROMAI": 96, "N_BOTLIMIT": 97, "N_BOTBALANCE": 98,
	"N_MAPCRC": 99, "N_CHECKMAPS": 100, "N_SWITCHNAME": 101, "N_SWITCHMODEL": 102,
	"N_SWITCHTEAM": 103, "N_INITTOKENS": 104, "N_TAKETOKEN": 105,
	"N_EXPIRETOKENS": 106, "N_DROPTOKENS": 107, "N_DEPOSITTOKENS": 108,
	"N_STEALTOKENS": 109, "N_SERVCMD": 110, "N_DEMOPACKET": 111, "NUMMSG": 112
};

exports.MSG_SIZES =               // size inclusive message token, 0 for variable or not-checked sizes
[
    0, 0, 1, 0, 0, 0, 2, 2,
    0, 0, 1,
    5, 6, 7, 0, 4,
    1, 4, 3, 2,
    2, 1,
    0, 0, 0, 2, 2, 3,
    2, 2, 2,
    2, 1,
    0, 0, 0,
    2, 1, 6, 6, 6, 4, 4, 4, 5, 7, 4, 1, 2, 1, 0, 0,
    2, 0, 1, 0, 3, 0, 0,
    0, 0, 0, 1, 6, 2,
    1, 0, 2, 0,
    3, 2, 1, 2,
    3, 4, 6, 3, 1, 7, 0, 0,
    0,
    0,
    0, 0, 0, 0, 0,
    0, 0,
    2, 1, 0, 2, 2, 2,
    0, 1,
    0, 2, 0,
    0, 2, 0, 0, 2, 0,
    0,
    0
];

exports.SAUERBRATEN_LANINFO_PORT = 28784;
exports.SAUERBRATEN_SERVER_PORT = 28785;
exports.SAUERBRATEN_SERVINFO_PORT = 28786;
exports.SAUERBRATEN_MASTER_PORT = 28787;
exports.PROTOCOL_VERSION = 259;            // bump when protocol changes
exports.DEMO_VERSION = 1;                  // bump when demo format changes
exports.DEMO_MAGIC = "SAUERBRATEN_DEMO";

exports.MAXNAMELEN = 15;
exports.MAXTEAMLEN = 4;

var DISC_REASONS = { 'DISC_NONE': 0, 'DISC_EOP': 1, 'DISC_LOCAL': 2, 'DISC_KICK': 3, 'DISC_MSGERR': 4, 'DISC_IPBAN': 5, 'DISC_PRIVATE': 6, 'DISC_MAXCLIENTS': 7, 'DISC_TIMEOUT': 8, 'DISC_OVERFLOW': 9, 'DISC_PASSWORD': 10, 'DISC_NUM': 11 };
exports.DISC_REASONS = DISC_REASONS;

var DISC_REASON_DESC = [ "end of packet", "server is in local mode", "kicked/banned", "message error", "ip is banned", "server is in private mode", "server FULL", "connection timed out", "overflow", "invalid password" ];
exports.DISC_REASON_DESC = DISC_REASON_DESC;

exports.masterModes = [
  'auth',      		// -1
  'open',         // 0
  'veto',         // 1
  'locked',       // 2
  'private',      // 3
  'password'	    // 4
];

exports.masterModeColors = {
  'auth': "lightgray",
  'open': "lightgreen",
  'veto': "yellow",
  'locked': "yellow",
  'private': "red",
  'password': "red"
};

exports.playerStates = [
  'CS_ALIVE',					// 0
  'CS_DEAD',					// 1
  'CS_SPAWNING',			// 2
  'CS_LAGGED',				// 3
  'CS_EDITING',				// 4
  'CS_SPECTATOR'			// 5
];

exports.playerStatesN = {
  'CS_ALIVE': 0,				// 0
  'CS_DEAD': 1,					// 1
  'CS_SPAWNING': 2,			// 2
  'CS_LAGGED': 3,				// 3
  'CS_EDITING': 4,			// 4
  'CS_SPECTATOR': 5			// 5
};

exports.gameModes = [
	'ffa',
	'coop',
	'teamplay',
	'insta',
	'instateam',
	'effic',
	'efficteam',
	'tac',
	'tacteam',
	'capture',
	'regencapture',
	'ctf',
	'instactf',
	'protect',
	'instaprotect',
	'hold',
	'instahold',
	'efficctf',
	'efficprotect',
	'effichold',
	'collect',
	'instacollect',
	'efficcollect'
];

exports.gameModesI = {
	'ffa': {},
	'coop': {},
	'teamplay': { 'teamMode': true },
	'insta': { 'instaMode': true },
	'instateam': { 'teamMode': true, 'instaMode': true },
	'effic': { 'efficMode': true },
	'efficteam': { 'teamMode': true, 'efficMode': true },
	'tac': {},
	'tacteam': { 'teamMode': true },
	'capture': { 'teamMode': true, 'flagMode': true },
	'regencapture': { 'teamMode': true, 'flagMode': true },
	'ctf': { 'teamMode': true, 'flagMode': true },
	'instactf': { 'teamMode': true, 'instaMode': true, 'flagMode': true },
	'protect': { 'teamMode': true, 'flagMode': true },
	'instaprotect': { 'teamMode': true, 'instaMode': true, 'flagMode': true },
	'hold': { 'teamMode': true, 'flagMode': true },
	'instahold': { 'teamMode': true, 'instaMode': true, 'flagMode': true },
	'efficctf': { 'teamMode': true, 'efficMode': true, 'flagMode': true },
	'efficprotect': { 'teamMode': true, 'efficMode': true, 'flagMode': true },
	'effichold': { 'teamMode': true, 'efficMode': true, 'flagMode': true },
	'collect': { 'teamMode': true, 'flagMode': true },
	'instacollect': { 'teamMode': true, 'instaMode': true, 'flagMode': true },
	'efficcollect': { 'teamMode': true, 'efficMode': true, 'flagMode': true },
};

function ItemStat (add, max, sound, name, icon, info) {
	this.add = add;
	this.max = max;
	this.sound = sound;
	this.name = name;
	this.icon = icon;
	this.info = info;
}
exports.itemStats = [	new ItemStat(10,    30,    'S_ITEMAMMO',   "SG",	'HICON_SG',							'GUN_SG'), 
											new ItemStat(20,    60,    'S_ITEMAMMO',   "CG",	'HICON_CG',							'GUN_CG'), 
											new ItemStat(5,     15,    'S_ITEMAMMO',   "RL",	'HICON_RL',							'GUN_RL'),
											new ItemStat(5,     15,    'S_ITEMAMMO',   "RI",	'HICON_RIFLE', 					'GUN_RIFLE'),
											new ItemStat(10,    30,    'S_ITEMAMMO',   "GL",	'HICON_GL', 						'GUN_GL'),
											new ItemStat(30,    120,   'S_ITEMAMMO',   "PI",	'HICON_PISTOL',					'GUN_PISTOL'),
											new ItemStat(25,    100,   'S_ITEMHEALTH', "H",		'HICON_HEALTH'),
											new ItemStat(10,    1000,  'S_ITEMHEALTH', "MH",	'HICON_HEALTH'),
											new ItemStat(100,   100,   'S_ITEMARMOUR', "GA",	'HICON_GREEN_ARMOUR',		'A_GREEN'),
											new ItemStat(200,   200,   'S_ITEMARMOUR', "YA",	'HICON_YELLOW_ARMOUR',	'A_YELLOW'),
											new ItemStat(20000, 30000, 'S_ITEMPUP',    "Q", 	'HICON_QUAD') ]

exports.MAXRAYS = 20;
exports.EXP_SELFDAMDIV = 2;
exports.EXP_SELFPUSH = 2.5;
exports.EXP_DISTSCALE = 1.5;

function GunInfo (sound, attackdelay, damage, spread, projspeed, kickamount, range, rays, hitpush, exprad, ttl, name, file, part) {
	this.sound = sound;
	this.attackdelay = attackdelay;
	this.damage = damage;
	this.spread = spread;
	this.projspeed = projspeed;
	this.kickamount = kickamount;
	this.range = range;
	this.rays = rays;
	this.hitpush = hitpush;
	this.exprad = exprad;
	this.ttl = ttl;
	this.name = name;
}
exports.guns = [	new GunInfo('S_PUNCH1',    250,  50,   0,   0,  0,   14,  1,  80,  0,    0, "fist",            "fist",   0 ),
									new GunInfo('S_SG',       1400,  10, 400,   0, 20, 1024, 20,  80,  0,    0, "shotgun",         "shotg",  0 ),
									new GunInfo('S_CG',        100,  30, 100,   0,  7, 1024,  1,  80,  0,    0, "chaingun",        "chaing", 0 ),
									new GunInfo('S_RLFIRE',    800, 120,   0, 320, 10, 1024,  1, 160, 40,    0, "rocketlauncher",  "rocket", 0 ),
									new GunInfo('S_RIFLE',    1500, 100,   0,   0, 30, 2048,  1,  80,  0,    0, "rifle",           "rifle",  0 ),
									new GunInfo('S_FLAUNCH',   600,  90,   0, 200, 10, 1024,  1, 250, 45, 1500, "grenadelauncher", "gl",     0 ),
									new GunInfo('S_PISTOL',    500,  35,  50,   0,  7, 1024,  1,  80,  0,    0, "pistol",          "pistol", 0 ),
									new GunInfo('S_FLAUNCH',   200,  20,   0, 200,  1, 1024,  1,  80, 40,    0, "fireball",        null,     'PART_FIREBALL1' ),
									new GunInfo('S_ICEBALL',   200,  40,   0, 120,  1, 1024,  1,  80, 40,    0, "iceball",         null,     'PART_FIREBALL2' ),
									new GunInfo('S_SLIMEBALL', 200,  30,   0, 640,  1, 1024,  1,  80, 40,    0, "slimeball",       null,     'PART_FIREBALL3' ),
									new GunInfo('S_PIGR1',     250,  50,   0,   0,  1,   12,  1,  80,  0,    0, "bite",            null,     0 ),
									new GunInfo(-1,            0, 	120,   0,   0,  0,    0,  1,  80, 40,    0, "barrel",          null,     0 ) ];


exports.MAXCLIENTS = 128                 // DO NOT set this any higher
exports.MAXTRANS = 5000                  // max amount of data to swallow in 1 go

exports.DISC_REASONS = { 'DISC_NONE': 0, 'DISC_EOP': 1, 'DISC_LOCAL': 2, 'DISC_KICK': 3, 'DISC_MSGERR': 4, 'DISC_IPBAN': 5, 'DISC_PRIVATE': 6, 'DISC_MAXCLIENTS': 7, 'DISC_TIMEOUT': 8, 'DISC_OVERFLOW': 9, 'DISC_PASSWORD': 10, 'DISC_NUM': 11 };
