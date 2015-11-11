/*
	A Sauerbraten client example.
	This program (should prompt the user) for a server host/ip and player name, connects to it, and prints server info messages.
*/

var simpleSauerClient = require("../index.js");

/*
	Create and instance of Client.
	Pass an object opts as an argument, which can have the following keys:
		host: String - IP of the server to connect to (required).
		port: Number - port number of the server to connect to (28785 by default).
		password: String - password of the server connecting to (empty by default).
		playerName: String - player name to use ("unnamed" by default).
		stayInSpec: Boolean - go to spectator automatically if unspectated (false by default).
		extInfo: Boolean - ping the server for extinfo (false by default).
*/
var sauerClient = new simpleSauerClient.Client({
											"host": "46.101.249.112",
											"port": 30000,
											"password": "",
											"playerName": "MySauerBot",
											"stayInSpec": true,
											"extInfo": true });

/*
	Print error, warning, and log events.
	warning and log events include server, frag, join/leave, ... messages.
*/
sauerClient.on("error", console.log);
sauerClient.on("warning", console.log);
sauerClient.on("info", console.log);
sauerClient.on("log", console.log);

/*
	Reply to greeting.
	After receiving a chat message, if the message contains "Hello mysauerbot",
	"hello, MySauerBot", or any combinations of these words, reply with
	"Hello, [player.name]!".
*/
sauerClient.on("say", function (player, text) {
	var ltext = text.toLowerCase();
	if (ltext.indexOf("mysauerbot" >) -1 && ltext.indexOf("hello" >) -1) {
		sauerClient.say("Hello, " + player.name + "!");
	}
});

/*
	Disconnect from the server before exiting.
*/
process.on("SIGINT", function() {
	sauerClient.disconnect();
	setTimeout(function () {
		process.exit();
	}, 500);
});
