SimpleSauerClient
=================

Partial Sauerbraten client implementation in JavaScript.    
This project is incomplete and contains bugs.  
Currently, only basic modes, team modes, and ctf modes are supported.

## Installation

`npm install AngrySnout/SimpleSauerClient --save`  
`var simpleSauerClient = require('SimpleSauerClient');`

## Client usage

`var sauerClient = new simpleSauerClient.Client(opts);`  
Creates a new instance of a Client.  
`opts` is an object that can have the following properties:
- `host`: String - IP of the server to connect to (required).
- `port`: Number - port number of the server to connect to (28785 by default).
- `password`: String - password of the server connecting to (empty by default).
- `playerName`: String - player name to use ("unnamed" by default).
- `stayInSpec`: Boolean - go to spectator automatically if unspectated (false by default).
- `extInfo`: Boolean - ping the server for extinfo (false by default).

### Client methods:

- `Client.sendf(chan, format, arguments...)`  
	Sends a formatted packet to the server (you won't need this for most applications).
	
- `Client.getPlayer(cn)`  
    Returns player object from client number.

- `Client.timeLeft()`  
    Returns time left in seconds.

- `Client.listDemos()`  
    Sends a list demos request to the server. To read the response check `Client.on('senddemolist', function)`.

- `Client.getDemo(n, name)`  
    Get the demo number 'n' and save it in a file 'name'. Note that 'n' starts from 1, ie the first demo received in 'senddemolist' corresponds to number 1.

- `Client.changeName(newname)`  
    To be implemented.

- `Client.changeModel(newmodrl)`  
    To be implemented.

- `Client.say(text)`  
    Say 'text' in chat.

- `Client.sayTeam(text)`  
    Say 'text' in team chat.
	
### Client events:
The Client emits a number of events. To listen to them, use `Client.on('event', function(...) {...})`, just like you would on any EventEmitter.  
For every packet received, an event with the name 'packet.N_NAME', where N_NAME is the name of the packet, as defined in 'game.h', is triggered with an argument of type 'Stream' (see Streams below for more info). You should only listen to these events if you know what you're doing, or if you want to extend the client beyond what this project provides.

- `Client.on('error', function (error) {...})`  
    Emitted in case of a fatal error.

- `Client.on('warning', function (text) {...})`  
    Emitted in case of a warning, for example if the server is password protectd.

- `Client.on('info', function (text) {...})`  
    Emitted in case of game info, for example, server messages and player joins/quits.

- `Client.on('connect', function () {...})`  
    Emitted when successfully connected to the server.

- `Client.on('disconnect', function (packet) {...})`  
    Emitted when disconnected from the server.

- `Client.on('mapchange', function (mapName, modeName) {...})`  
    Emitted when the map is changed.

- `Client.on('timeup', function (timeLeft) {...})`  
    Emitted when the time left has changed, for example, when a new game starts or overtime begins.

- `Client.on('pausedChanged', function (isPaused, cn) {...})`  
    Emitted when the game is paused or unpaused.

- `Client.on('gamespeedChanged', function (gameSpeed, cn) {...})`  
    Emitted when gamespeed has changed.

- `Client.on('setteam', function (player, teamName) {...})`  
    Emitted when a player's team has changed.

- `Client.on('playerconnected', function (player) {...})`  
    Emitted when a new player has joined.

- `Client.on('aiconnected', function (player) {...})`  
    Emitted when a game bot has joined.

- `Client.on('intermission', function () {...})`  
    Emitted when intermission starts.

- `Client.on('say', function (player, text) {...})`  
    Emitted when a chat message is received.

- `Client.on('sayteam', function (player, text) {...})`  
    Emitted when a team chat message is received.

- `Client.on('forcedeath', function (player) {...})`  
    Emitted when a player has been forced to death.

- `Client.on('switchname', function (player, oldName, newName) {...})`  
    Emitted when a player's name is changed.

- `Client.on('switchmodel', function (player, newModel) {...})`  
    Emitted when a player's game model is changed.

- `Client.on('playerdisconnected', function (player) {...})`  
    Emitted when a player has disconnected.

- `Client.on('spawn', function (player) {...})`  
    Emitted when a player spawns.

- `Client.on('died', function (player) {...})`  
    Emitted when a player dies.

- `Client.on('gunselect', function (player, gunName) {...})`  
    Emitted when a player's selected gun is changed.

- `Client.on('taunt', function (player) {...})`  
    Emitted when a player taunts.

- `Client.on('servmsg', function (text) {...})`  
    Emitted when a server message is received. The same message is sent to the 'info' event.

- `Client.on('senddemolist', function (demoList) {...})`  
    Emitted when a demo list is received, after sending using `Client.listDemos()`.

- `Client.on('mastermode', function (masterModeNum) {...})`  
    Emitted when master mode is changed.

- `Client.on('spectator', function (player) {...})`  
    Emitted when when a player has been spectated/unspectated.

- `Client.on('dropflag', function (player, teamName) {...})`  
    Emitted when a player drops the flag (note: this, and other flag events, will only work as expected in CTF modes).

- `Client.on('scoreflag', function (player, teamName) {...})`  
    Emitted when a player has scored the flag.

- `Client.on('returnflag', function (player, teamName) {...})`  
    Emitted when a player has returned the flag.

- `Client.on('takeflag', function (player, teamName) {...})`  
    Emitted when a player has stolen/taken the flag.

- `Client.on('resetflag', function (teamName) {...})`  
    Emitted when a team's flag resets.

## ServerBrowser usage:
The server browser implementation is incomplete. Right now it only allows for obtaining the server list from the master server.  
`var serverBrowser = new simpleSauerClient.ServerBrowser(opts);`  
Creates a new ServerBrowser instance.  
`opts` is an object that can have the following properties:
- `masterPollInterval`: Number - how often (in ms) to update the list from the master server (0 by default, set to 0 to not update automatically, set to a negative value to update only once).
- `serverPingInterval`: Number - how often (in ms) to ping servers on the list (0 by default, set to 0 to not ping servers automatically).
- `masterHost`: String - host name of the master server ("sauerbraten.org" by default).
- `masterPort`: Number - port number of the master server (28787 by default).

### ServerBrowser methods:

- `ServerBrowser.updateMaster()`  
    Manually update server list from master server.

### ServerBrowser events:

- `ServerBrowser.on('error', function (error) {...})`  
    Emitted in case of an error.

- `ServerBrowser.on('update', function (serverList) {...})`  
    Emitted when a new server list is received. serverList is an array of objects, each containing a host and port properties.

## stream usage:
stream provides a number of utility functions for working with cube strings and network streams.

### stream functions:

- `simpleSauerClient.stream.filterString(text)`
    Returns a string stripped from format characters ('\f').

- `simpleSauerClient.stream.cube2colorHTML(text)`
    Returns text as colored HTML.

- `var stream = simpleSauerClient.stream.Stream(buffer, offset)`
    Create and instance of a Stream. Streams help communicate with Sauerbraten's network protocol. If you want to create a write buffer, pass `new Buffer(simpleSauerClient.defs.MAXTRANS)` ('simpleSauerClient.defs.MAXTRANS' is 5000 by default) for 'buffer' and 0 for 'offset'.

### Stream methods:

- `Stream.getInt()`
    Reads an integer.

- `Stream.putInt(number)`
    Writes and integer.

- `Stream.getString()`
    Reads a string.

- `Stream.putString()`
    Writes a string.

- `Stream.remaining()`
    Returns length of data remaining in buffer.

- `Stream.overread()`
    Returns true of the end of the buffer is reached.

- `Stream.finalize()`
    Returns a sliced/trimmed buffer.

## License

The MIT License (MIT)  
Copyright (c) 2015 AngrySnout
