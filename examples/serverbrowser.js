/*
	Server browser exsample.
	Gets server list from master server, prints it, and exits.
*/

var simpleSauerClient = require("../index.js");

/*
	Create a ServerBrowser instance.
	Pass an object opts as an argument, which can have the following keys:
		masterPollInterval: Number - how often (in ms) to update the list from the master server (0 by default, set to 0 to not update automatically, set to a negative value to update only once).
		serverPingInterval: Number - how often (in ms) to ping servers on the list (0 by default, set to 0 to not ping servers automatically).
		masterHost: String - host name of the master server ("sauerbraten.org" by default).
		masterPort: Number - port number of the master server (28787 by default).
*/
var serverBrowser = new simpleSauerClient.ServerBrowser({"masterPollInterval": 600000, "serverPingInterval": 5000});

/*
	In case of an error, print it on the console.
*/
serverBrowser.on("error", console.log);

/*
	When a new server list is received, print it, and exit the program.
*/
serverBrowser.on("update", function (servers) {
	for (var i = 0; i < servers.length; i++) {
		console.log(servers[i].host, servers[i].port);
	}
	serverBrowser.disconnect();
	process.exit();
});
