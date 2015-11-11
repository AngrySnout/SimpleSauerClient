var startupmillis = Date.now();
var gamemillis = 0;
var lastTime = 0;
var isPaused = false;
var gameSpeed = 100;

function totalmillis() {
	return Date.now()-startupmillis;
}
exports.totalmillis = totalmillis

function lastmillis() {
	if (!isPaused) {
		gamemillis += ((Date.now()-lastTime)*gameSpeed)/100;
		lastTime = Date.now();
	}
	return gamemillis;
}
exports.lastmillis = lastmillis

function resetGamemillis() {
	gamemillis = 0;
	lastTime = Date.now();
	lastmillis();
}
exports.resetGamemillis = resetGamemillis

function gamePausedChanged(val) {
	if (!val) lastTime = Date.now();
	lastmillis();
	isPaused = val;
}
exports.gamePausedChanged = gamePausedChanged

function gameSpeedChanged(val) {
	lastmillis();
	gameSpeed = val;
}
exports.gameSpeedChanged = gameSpeedChanged
