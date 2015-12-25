var util = require('util');
var EventEmitter = require('events');
var dgram = require('dgram');
var net = require('net');
var enet = require("enet");
var fs = require("fs");

var defs = require("./defs");
var time = require("./time");
var stream = require("./stream");

exports.defs = defs;
exports.time = time;
exports.stream = stream;

function Client(opts) {
	EventEmitter.call(this);
	
	if (!opts.host) {
		this.emit("error", new Error("host not provided"));
		return;
	}
	if (!opts.port) opts.port = 28785;
	if (!opts.playerName) opts.playerName = "unnamed";
	if (!opts.password) opts.password = "";
	
	var self = this;
	
	var addr = new enet.Address(opts.host, opts.port);

	this.client = {};
	this.remote = {};

	this.players = [];
	
	this.sendPacket = function (chan, packet) {
		if (this.remote.peer) this.remote.peer.send(chan, packet);
	}
	
	var tbuffer = new Buffer(defs.MAXTRANS);
	
	this.sendf = function (chan, format) {
		var cura = 2;
		var i = 0;
		var reliable = false;
		
		if (format[0] == 'r') {
			reliable = true;
			i++;
		}
		
		var st = new stream.Stream(tbuffer, 0);
		
		for (; i < format.length; i++) {
			if (format[i] == 'v') {
				var n = arguments[cura++];
				for (var j = 0; j < n; j++) st.putInt(arguments[cura++]);
			} else if (format[i] == 'i') {
				var n = format[i+1];
				if (isNaN(n)) n = 1;
				else {
					n = parseInt(n);
					i++;
				}
				for (var j = 0; j < n; j++) st.putInt(arguments[cura++]);
			} else if (format[i] == 'f') {
				var n = format[i+1];
				if (isNaN(n)) n = 1;
				else {
					n = parseInt(n);
					i++;
				}
				for (var j = 0; j < n; j++) st.putFloat(arguments[cura++]);
			} else if (format[i] == 's') st.putString(arguments[cura++]);
			else if (format[i] == 'm') {
				var n = arguments[cura++];
				st.put(arguments[cura++], n);
			}
		}
		
		var packet = new enet.Packet(st.finalize(), reliable? enet.PACKET_FLAG.RELIABLE: null);
		this.sendPacket(chan, packet);
	}

	this.getPlayer = function (cn) {
		while (cn > this.players.length-1) this.players.push(null);
		if (!this.players[cn]) this.players[cn] = { "suicides": 0, "teamkills": 0, "acc": 0, "deaths": 0, "ip": 0, "country": "" };
		return this.players[cn];
	}

	this.on("packet.N_SERVINFO", function (st) {
		this.client.clientnum = st.getInt();
		this.client.name = opts.playerName;
		var player = this.getPlayer(this.client.clientnum);
		player.clientnum = this.client.clientnum;
		player.name = opts.playerName;
		player.playermodel = 0;
		
		var protocol = st.getInt();
		if (protocol != defs.PROTOCOL_VERSION) {
			self.emit("error", new Error("Server uses a different protocol version - client: "+defs.PROTOCOL_VERSION+", server: "+protocol));
			return;
		}
		this.client.sid = st.getInt();
		this.remote.haspw = st.getInt();
		if (this.remote.haspw) {
			self.emit("warning", "This server is password protected");
		}
		this.remote.desc = st.getString();
		this.remote.servauth = st.getString();
		this.sendf(1, "risisss", defs.MSG_TYPES_N.N_CONNECT, opts.playerName, 0, opts.password, "", "");
	});

	this.addPlayer = function (cn) {
		while (cn > this.players.length-1) this.players.push(null);
		if (!this.players[cn]) this.players[cn] = { "suicides": 0, "teamkills": 0, "acc": 0, "deaths": 0, "ip": 0, "country": "" };
		return this.players[cn];
	}

	this.on("packet.N_WELCOME", function (st) {
		if (this.client.connected) return;
		this.client.connected = true;
		this.remote.connected = true;
		this.client.ping = 0;
		self.emit("connect");
		self.emit("info", "connected");
	});

	this.on("packet.N_MAPCHANGE", function (st) {
		this.remote.map = st.getString();
		this.remote.mode = st.getInt();
		this.remote.notgotitems = st.getInt();
		
		this.remote.flags = [ {}, {}, {} ];
		this.remote.scores = [ 0, 0, 0 ];
		
		// TODO: game reset
		this.emit("info", "map changed to " + defs.gameModes[this.remote.mode] + " " + this.remote.map);
		this.emit("mapchange", this.remote.map, defs.gameModes[this.remote.mode]);
	});
	
	this.timeLeft = function () {
		return parseInt((this.remote.endtime-time.lastmillis())/1000);
	}

	this.on("packet.N_TIMEUP", function (st) {
		this.remote.timeup = st.getInt();
		this.remote.endtime = this.remote.timeup*1000;
		time.resetGamemillis();
		this.emit("timeup", this.timeLeft());
	});

	this.on("packet.N_ITEMLIST", function (st) {
		this.remote.sents = [];
		for (;;) {
			var i = st.getInt();
			if (i == -1) break;
			this.remote.sents.push(st.getInt());
		}
	});

	this.on("packet.N_CURRENTMASTER", function (st) {
		this.remote.mastermode = st.getInt();
		for (;;) {
			var i = st.getInt();
			if (i < 0) break;
			this.getPlayer(i).priv = st.getInt();
		}
	});

	this.on("packet.N_PAUSEGAME", function (st) {
		this.remote.paused = st.getInt();
		time.gamePausedChanged(this.remote.paused);
		this.emit("pausedChanged", this.remote.paused, st.getInt());
	});

	this.on("packet.N_GAMESPEED", function (st) {
		this.remote.gamespeed = st.getInt();
		time.gameSpeedChanged(this.remote.gamespeed);
		this.emit("gamespeedChanged", this.remote.gamespeed, st.getInt());
	});

	this.on("packet.N_TEAMINFO", function (st) {
		if (!this.remote.teams) this.remote.teams = {};
		for (;;) {
			var tn = st.getString();
			if (tn == "") break;
			this.remote.teams[tn] = st.getInt();
		}
	});

	this.on("packet.N_SETTEAM", function (st) {
		var player = this.getPlayer(st.getInt());
		if (player) player.team = st.getString();
		else st.getString();
		var reason = st.getInt();
		if (reason == 0 || reason == 1) this.emit("info", player.name + (reason==0? " switched to team ": " forced to team ") + player.team);
		this.emit("setteam", player, player.team);
	});

	this.on("packet.N_FORCEDEATH", function (st) {
		this.getPlayer(st.getInt()).state = defs.playerStatesN.CS_DEAD;
	});

	this.on("packet.N_INITCLIENT", function (st) {
		var clientnum = st.getInt();
		var player = this.addPlayer(clientnum);
		player.clientnum = clientnum;
		player.name = st.getString();
		player.team = st.getString();
		player.playermodel = st.getInt();
		this.emit("info", "join: "+player.name);
		this.emit("playerconnected", player);
	});

	this.on("packet.N_INITAI", function (st) {
		var clientnum = st.getInt();
		var player = this.getPlayer(clientnum);
		player.clientnum = clientnum;
		player.ownernum = st.getInt();
		player.aitype = st.getInt();
		player.skill = st.getInt();
		player.playermodel = st.getInt();
		player.name = st.getString();
		player.team = st.getString();
		this.emit("info", "join: "+player.name);
		this.emit("aiconnected", player);
	});

	this.parseState = function (player, st, resume) {
		if (!player) return;
		if (resume) {
			player.state = st.getInt();
			player.frags = st.getInt();
			player.flags = st.getInt();
			player.quadmillis = st.getInt();
		}
		player.lifesequence = st.getInt();
		player.health = st.getInt();
		player.maxhealth = st.getInt();
		player.armour = st.getInt();
		player.armourtype = st.getInt();
		player.gun = st.getInt();
		player.ammo = [0, 0, 0, 0, 0, 0];
		for (var i = 0; i < 6; i++) {
			player.ammo[i] = st.getInt();
		}
	}

	this.on("packet.N_SPAWNSTATE", function (st) {
		var player = this.getPlayer(st.getInt());
		this.parseState(player, st, false);
		player.state = defs.playerStatesN.CS_ALIVE;
	});

	this.on("packet.N_CLIENTPING", function (st, player) {
		if (!player) return;
		player.ping = st.getInt();
	});

	this.parseResume = function (st) {
		for (;;) {
			var cn = st.getInt();
			if (st.overread() || cn < 0) break;
			this.parseState(this.getPlayer(cn), st, true);
		}
	}

	this.on("packet.N_WELCOME.N_RESUME", this.parseResume);
	this.on("packet.N_RESUME", this.parseResume);

	this.on("packet.N_PONG", function (st) {
		if (!this.client.ping) this.client.ping = 0;
		this.client.ping = ((this.client.ping*5)+(time.totalmillis()-st.getInt()))/6;
		this.sendf(1, "rii", defs.MSG_TYPES_N.N_CLIENTPING, this.client.ping);
	});

	var lastmsgmillis = 0;
	
	this.pingRemote = function () {
		if (!self.remote.connected) return;
		self.sendf(1, "rii", defs.MSG_TYPES_N.N_PING, time.totalmillis());
		
		if (opts.stayInSpec && self.getPlayer(self.client.clientnum).state != defs.playerStatesN.CS_SPECTATOR) self.sendf(1, "riii", defs.MSG_TYPES_N.N_SPECTATOR, self.client.clientnum, 1);
		
		if (self.timeLeft <= 0) self.emit("intermission");
		
		if (time.totalmillis() - lastmsgmillis > 30000) self.disconnect();
	}
	this.pingHandle = setInterval(this.pingRemote, 250);

	this.on("packet.N_TEXT", function (st, player) {
		var text = st.getString();
		this.emit("info", player.name + ": " + text);
		this.emit("say", player, text);
	});

	this.on("packet.N_SAYTEAM", function (st, player) {
		var text = st.getString();
		this.emit("info", player.name + ": " + text);
		this.emit("sayteam", player, text);
	});

	this.on("packet.N_FORCEDEATH", function (st) {
		var player = this.getPlayer(st.getInt());
		player.state = defs.playerStatesN.CS_DEAD;
		this.emit("forcedeath", player);
	});

	this.on("packet.N_SWITCHNAME", function (st, player) {
		var oldname = player.name;
		player.name = st.getString();
		this.emit("switchname", player, oldname, player.name);
	});

	this.on("packet.N_SWITCHMODEL", function (st, player) {
		player.playermodel = st.getInt();
		this.emit("switchmodel", player, player.playermodel);
	});

	this.on("packet.N_CDIS", function (st) {
		var cn = st.getInt();
		var player = this.getPlayer(cn);
		this.emit("info", "leave: "+player.name);
		this.emit("playerdisconnected", player);
		if (this.players[cn]) this.players[cn] = null;
	});

	this.on("packet.N_SPAWN", function (st, player) {
		this.parseState(player, st, false);
		if (!player) return;
		player.state = defs.playerStatesN.CS_SPAWNING;
		this.emit("spawn", player);
	});

	/*this.on("packet.N_SHOTFX", function (st) {
		var player = this.getPlayer(st.getInt());
		console.log(player.name + " fired a shot of " + defs.guns[st.getInt()].name);
		// TODO
	});

	this.on("packet.N_EXPLODEFX", function (st) {
		var player = this.getPlayer(st.getInt());
		console.log(player.name + " blew up a shot of " + defs.guns[st.getInt()].name);
		// TODO
	});*/

	this.on("packet.N_DAMAGE", function (st) {
		var target = this.getPlayer(st.getInt());
		var attacker = this.getPlayer(st.getInt());
		var damage = st.getInt();
		var armour = st.getInt();
		var health = st.getInt();
		
		if (!target || !attacker) return;
		
		target.armour = armour;
		target.health = health;
		
		this.emit("damaged", attacker, target, damage);
	});
	
	this.on("packet.N_DIED", function (st) {
		var victim = this.getPlayer(st.getInt());
		var killer = this.getPlayer(st.getInt());
		
		killer.frags = st.getInt();
		if (killer.team && this.remote.teams) this.remote.teams[killer.team] = st.getInt();
		
		victim.state = defs.playerStatesN.CS_DEAD;
		victim.deaths += 1;
		
		this.emit("info", killer.name + " fragged " + victim.name);
		this.emit("died", victim, killer);
	});

	this.on("packet.N_GUNSELECT", function (st, player) {
		if (!player) return;
		player.gunselect = st.getInt();
		this.emit("gunselect", player, defs.guns[player.gunselect].name);
	});

	this.on("packet.N_TAUNT", function (st, player) {
		if (!player) return;
		this.emit("taunt", player);
	});

	/*this.on("packet.N_ITEMSPAWN", function (st) {
		// TODO
	});*/

	this.on("packet.N_SERVMSG", function (st) {
		var msg = stream.filterString(st.getString());
		this.emit("info", msg);
		this.emit("servmsg", msg);
	});

	this.on("packet.N_SENDDEMOLIST", function (st) {
		var n = st.getInt();
		var demos = []
		for (var i = 0; i < n; i++) {
			demos.push(st.getString());
		}
		this.emit("senddemolist", demos);
		if (n <= 0) this.emit("info", "no demos available");
		else {
			var res = "";
			for (var i = 0; i < n; i++) {
				res += i+1;
				res += ". "+demos[i]+(i==n-1? "": "\n");
			}
			this.emit("info", res);
		}
	});

	this.on("packet.N_MASTERMODE", function (st) {
		var mm = st.getInt();
		this.emit("mastermode", mm);
		this.emit("info", "mastermode is "+defs.masterModes[mm+1]+" ("+mm+")");
	});
	
	this.on("packet.N_EDITMODE", function (st, player) {
		var val = st.getInt();
		if (!player) return;
		if (val) {
			player.editstate = player.state;
			player.state = defs.playerStatesN.CS_EDITING;
		} else {
			player.state = player.editstate;
		}
	});

	this.on("packet.N_SPECTATOR", function (st) {
		var player = this.getPlayer(st.getInt());
		if (!player) return;
		if (st.getInt()) player.state = defs.playerStatesN.CS_SPECTATOR;
		else player.state = defs.playerStatesN.CS_DEAD;
		this.emit("spectator", player);
	});

	this.on("packet.N_SERVCMD", function (st) {
		var text = st.getString();
		this.emit("servmsg", text);
	});
	
	var flagteams = [ "good", "evil" ];
	var teamnames = [ "", "good", "evil" ];

	this.on("packet.N_INITFLAGS", function (st) {
		this.remote.scores = [ 0, st.getInt(), st.getInt() ];
		var nflags = st.getInt();
		this.remote.flags = [];
		for (var i = 0; i < nflags; i++) {
			this.remote.flags.push({});
			var flag = this.remote.flags[this.remote.flags.length-1];
			flag.version = st.getInt();
			flag.spawnindex = st.getInt();
			flag.owner = st.getInt();
			flag.invistime = st.getInt();
			if (flag.owner < 0) {
				flag.droptime = st.getInt();
				if (flag.droptime) {
					flag.droploc = [ st.getInt(), st.getInt(), st.getInt() ];
				}
			}
		}
	});
	
	this.on("packet.N_DROPFLAG", function (st) {
    var player = this.getPlayer(st.getInt());
		var flag = st.getInt();
		var version = st.getInt();
		st.getInt(); st.getInt(); st.getInt();
		if (flag >= this.remote.flags.length || defs.gameModes[this.remote.mode].indexOf("ctf") < 0) return;
		
		if ((player.team == "good" && flag == 1) || (player.team == "evil" && flag == 0)) flagteams = [ "good", "evil" ];
		else flagteams = [ "evil", "good" ];
		
		this.remote.flags[flag].version = version;
		this.remote.flags[flag].droptime = 1;
		
		this.emit("info", player.name + " dropped " + (flagteams[flag]==this.getPlayer(this.client.clientnum).team? "your flag": "the enemy flag"));
		this.emit("dropflag", player, flagteams[flag]);
	});
	
	this.on("packet.N_SCOREFLAG", function (st) {
    var player = this.getPlayer(st.getInt());
		var relayflag = st.getInt();
		var relayversion = st.getInt();
		var goalflag = st.getInt();
		var goalversion = st.getInt();
		var goalspawn = st.getInt();
		var team = st.getInt();
		var score = st.getInt();
		var flags = st.getInt();
				
		if (defs.gameModes[this.remote.mode].indexOf("ctf") < 0) {
			this.emit("info", player.name + " scored for " + (player.team==this.getPlayer(this.client.clientnum).team? "your team": "the enemy team"));
			this.emit("scoreflag", player, -1);
			return;
		}
		if (goalflag >= this.remote.flags.length || relayflag >= this.remote.flags.length) return;
		
		if ((player.team == "good" && relayflag == 1) || (player.team == "evil" && relayflag == 0)) flagteams = [ "good", "evil" ];
		else flagteams = [ "evil", "good" ];

		this.remote.scores[team] = score;
		player.flags = flags;
		this.remote.flags[relayflag].droptime = 0;
		this.remote.flags[relayflag].version = relayversion;
		this.remote.flags[goalflag].droptime = 0;
		this.remote.flags[goalflag].version = goalversion;
		
		this.emit("info", player.name + " scored for " + (flagteams[goalflag]==this.getPlayer(this.client.clientnum).team? "your team": "the enemy team"));
		this.emit("scoreflag", player, flagteams[team]);
		
    if (score >= 10) this.emit("info", (flagteams[goalflag]==this.getPlayer(this.client.clientnum).team? "your team": "the enemy team") + " captured 10 flags");
	});
	
	this.on("packet.N_RETURNFLAG", function (st) {
    var player = this.getPlayer(st.getInt());
		var flag = st.getInt();
		var version = st.getInt();
		if (flag >= this.remote.flags.length || defs.gameModes[this.remote.mode].indexOf("ctf") < 0) return;
		
		if ((player.team == "good" && flag == 1) || (player.team == "evil" && flag == 0)) flagteams = [ "good", "evil" ];
		else flagteams = [ "evil", "good" ];
		
		this.remote.flags[flag].version = version;
		this.remote.flags[flag].droptime = 0;
		
		this.emit("info", player.name + " returned " + (flagteams[flag]==this.getPlayer(this.client.clientnum).team? "your flag": "the enemy flag"));
		this.emit("returnflag", player, flagteams[flag]);
	});
	
	this.on("packet.N_TAKEFLAG", function (st) {
    var player = this.getPlayer(st.getInt());
		var flag = st.getInt();
		var version = st.getInt();
		if (flag >= this.remote.flags.length || defs.gameModes[this.remote.mode].indexOf("ctf") < 0) return;
		
		if ((player.team == "good" && flag == 1) || (player.team == "evil" && flag == 0)) flagteams = [ "good", "evil" ];
		else flagteams = [ "evil", "good" ];
		
		this.remote.flags[flag].version = version;
		
		this.emit("info", player.name + (this.remote.flags[flag].droptime? " took ": " stole ") + (flagteams[flag]==this.getPlayer(this.client.clientnum).team? "your flag": "the enemy flag"));
		this.remote.flags[flag].droptime = 0;
		this.emit("takeflag", player, flagteams[flag]);
	});
	
	this.on("packet.N_RESETFLAG", function (st) {
		var flag = st.getInt();
		var version = st.getInt();
		st.getInt();
		var team = st.getInt();
		var score = st.getInt();
		if (flag >= this.remote.flags.length || defs.gameModes[this.remote.mode].indexOf("ctf") < 0) return;
		
		if ((teamnames[team] == "good" && flag == 0) || (teamnames[team] == "evil" && flag == 1)) flagteams = [ "good", "evil" ];
		else flagteams = [ "evil", "good" ];
		
		this.remote.scores[team] = score;
		this.remote.flags[flag].version = version;
		this.remote.flags[flag].droptime = 0;
		
		
		this.emit("info", (flagteams[flag]==this.getPlayer(this.client.clientnum).team? "your flag": "the enemy flag") + " reset");
		this.emit("resetflag", flagteams[flag]);
	});
	
	this.parseMessages = function (player, st, channel) {
		if (channel == 1) {
			if (player) st.getInt();
			var type;
			do {
				type = st.getInt();
				
				if (defs.MSG_TYPES[type] == "N_CLIENT") {
					this.parseMessages(this.getPlayer(st.getInt()), st, channel);
					break;
				} else {
					if (!this.listeners("packet."+defs.MSG_TYPES[type]).length) break;
					
					//console.log("packet."+defs.MSG_TYPES[type], type, st.remaining());
					this.emit("packet."+defs.MSG_TYPES[type], st, player);
				}
			} while (!st.overread());
		} else if (channel == 2) {
			var type = st.getInt();
			if (defs.MSG_TYPES[type] == "N_SENDDEMO") {
				var demoname = ""+time.totalmillis()+".ogz";
				if (this.gettingdemo) {
					demoname = this.gettingdemo.replace(/[^A-Za-z0-9]/g, "_") + ".dmo";
					delete this.gettingdemo;
				}
				fs.writeFile(demoname, st.buffer.slice(st.offset), "binary");
				this.emit("info", "received demo \"" + demoname + "\"");
			} else if (defs.MSG_TYPES[type] == "N_SENDMAP") {
				fs.writeFile(demoname, st.buffer.slice(st.offset), "binary");
			}
		}
	}
	
	this.listDemos = function () {
		this.emit("info", "listing demos...");
		this.sendf(1, "ri", defs.MSG_TYPES_N.N_LISTDEMOS);
	}
	
	this.getDemo = function (n, name) {
		if(n<=0) this.emit("info", "getting demo...");
		else this.emit("info", "getting demo " + n + "...");
		if (name) this.gettingdemo = name;
		this.sendf(1, "rii", defs.MSG_TYPES_N.N_GETDEMO, n);
	}
	
	this.changeName = function (newname) {
		// TODO
	}
	
	this.changeModel = function (newmodrl) {
		// TODO
	}
	
	this.say = function (text) {
		this.sendf(1, "ris", defs.MSG_TYPES_N.N_TEXT, text);
		this.emit("info", this.client.name + ": " + text);
	}
	
	this.sayTeam = function (text) {
		this.sendf(1, "ris", defs.MSG_TYPES_N.N_SAYTEAM, text);
		this.emit("info", this.client.name + ": " + text);
	}
	
	enet.createClient({peers: 2, channels: 3, down: 0, up: 0}, function(err, host) {
		if (err) {
			self.emit("error", new Error("Could not create client"));
			return;
		}
	
		host.on("connect", function (peer, data) {
			self.remote.peer = peer;
			self.remote.host = host;
			
			peer.on("message", function (packet, channel) {
				lastmsgmillis = time.totalmillis();
				var st = new stream.Stream(packet.data(), 0);
				self.parseMessages(null, st, channel);
			});
			
			peer.on("disconnect", function (packet, channel) {
				self.emit("disconnect", packet);
				
				if (self.pingHandle) {
					clearInterval(self.pingHandle);
					self.pingHandle = null;
				}
				if (self.extinfoHandle) {
					clearInterval(self.extinfoHandle);
					self.extinfoHandle = null;
				}
				
				if (self.remote.host) self.remote.host.destroy();
				if (peer == self.remote.peer) delete self.remote.peer;
				self.remote.connected = false;
				self.client.connected = false;
			});
		});

		host.connect(addr, 3, 0, function (err, peer) {
			if (err) {
				console.error(err);
				return;
			}
		});
	});
	
	if (opts.extInfo) {
		var socket;
		this.pollserver = function () {
			if (!socket) socket = dgram.createSocket('udp4');
			try {
				var query = new Buffer(3);
				query.writeUInt8(0x00, 0);
				query.writeUInt8(0x01, 1);
				query.writeUInt8(0xFF, 2);

				socket.on('message', function (data) {
					var st = new stream.Stream(data, 3);
					var ack = st.getInt();
					var ver = st.getInt();
					var iserr = st.getInt();
					if (ack != -1 || ver != 105 || iserr != 0) return;
					
					var resptype = st.getInt();
					
					if (resptype != -11) return;
					
					var player = self.getPlayer(st.getInt());
					if (!player) return;
					
					st.getInt(); st.getString(); st.getString(); st.getInt(); st.getInt();
					player.deaths = st.getInt();
					//player.kpd = util.round2(player.frags/Math.max(player.deaths, 1));
					player.tks = st.getInt();
					player.acc = st.getInt();
					st.getInt(); st.getInt(); st.getInt(); st.getInt(); st.getInt();
					
					var ipbuf = new Buffer(4);
					st.buffer.copy(ipbuf, 0, st.offset, st.offset+3);
					st.offset += 3;
					ipbuf[3] = 0;
					player.ip = ipbuf.readUInt32BE(0);
				});
				
				socket.on('error', function (err) {
					socket.close();
					socket = null;
				});
				
				socket.send(query, 0, 3, opts.port+1,  opts.host);
				
				var closeSocket = function() {
					if (socket != null) {
						socket.close();
						socket = null;
					}
				}
				
				setTimeout(closeSocket, 2000)
			} catch(err) {
				console.log('server query failed with uncaught error: ', err);
				if (socket != null) {
					socket.close();
					socket = null;
				}
			}
		}
		this.extinfoHandle = setInterval(this.pollserver, 10000);
		this.pollserver();
	}
	
	this.disconnect = function () {
		if (this.remote.peer) this.remote.peer.disconnect(0);
		else self.emit("disconnect");
		self.emit("info", "disconnected");
	}
	
	this.on("disconnect", function () {
		if (self.pingHandle) {
			clearInterval(self.pingHandle);
			self.pingHandle = null;
		}
		if (self.extinfoHandle) {
			clearInterval(self.extinfoHandle);
			self.extinfoHandle = null;
		}
	});
}

util.inherits(Client, EventEmitter);
exports.Client = Client;

function ServerBrowser(opts) {
	EventEmitter.call(this);

	self = this;
	this.servers = [];
	
	this.updateMaster = function () {
		try {
			var success = false;

			var socket = net.connect(opts.masterPort||28787, opts.masterHost||"sauerbraten.org", function() {
					socket.write('list\n');
			});
			
			socket.on('data', function(data) {
				self.servers = [];
				var serverlist = data.toString().split('\n');
				for (var i = 0; i < serverlist.length; i++) {
					var ts = serverlist[i].split(' ');
					if (ts.length == 3 && ts[0] == 'addserver') {
						self.servers.push({"host": ts[1], "port": Number(ts[2])});
					}
				}
				self.emit("update", self.servers);
				success = true;
				socket.end();
			});
			
			socket.on('end', function() {
				if (!success) self.emit("error", new Error("Master server connection failed"));
			});
			
			socket.on('error', function(err) {
				self.emit("error", new Error("Error polling masterserver"));
			});
		} catch(err) {
			self.emit("error", new Error("Error polling masterserver"));
		}
	}
	
	if (opts.masterPollInterval) {
		if (opts.masterPollInterval > 0) var masterHandle = setInterval(this.updateMaster, opts.masterPollInterval);
		this.updateMaster();
	}
	
	this.pingServers = function () {
		
	}
	
	if (opts.serverPingInterval) {
		if (opts.serverPingInterval > 0) var pingHandle = setInterval(this.update, opts.serverPingInterval);
		this.pingServers();
	}
	
	this.disconnect = function () {
		clearInterval(masterHandle);
		clearInterval(pingHandle);
	}
}

util.inherits(ServerBrowser, EventEmitter);
exports.ServerBrowser = ServerBrowser;
