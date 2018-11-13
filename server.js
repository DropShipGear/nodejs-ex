//@ts-check

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);


var gamePath = __dirname + '/static';
app.set('port', 8080);
app.use('/static', express.static(gamePath));

// Routing
app.get('/', function (request, response) {
	response.sendFile(path.join(gamePath, 'TitleScreen.html'));
});
app.get('/index.html', function (request, response) {
	response.sendFile(path.join(gamePath, 'index.html'));
});
// Starts the server.
server.listen(8080,'0.0.0.0', function () {
	console.log('Starting server on port 8080');
});




var players = {};
io.on('connection', function (socket)
{
	socket.on('message', function (data)
	{
		console.log(data);
	});
	socket.on('new player', function ()
	{
		players[socket.id] =
		{
			x: 300,
			y: 300,
			direction: 0,
			speed:0,
		};
	});
	socket.on('movement', function (data) {
		var player = players[socket.id] || {};
		if (data.left) {
			player.direction -= 5 * 6.28 / 360;
			while (player.direction < -3.14)
				player.direction += 6.28;
		}
		if (data.up) {
			player.speed += 1;
			if (player.speed > 100)
				player.speed = 100;
		}
		if (data.right) {
			player.direction += 5 * 6.28 / 360;
			while (player.direction > 3.14)
				player.direction -= 6.28;
		}
		if (data.down) {
			player.speed -= 1;
			if (player.speed < 0)
				player.speed = 0;
		}
	});
});

var updatePlayer = function (player) {
	let x = Math.cos(player.direction);
	let y = Math.sin(player.direction);

	player.x += player.speed / 20 * x;
	player.y += player.speed / 20 * y;

	if (player.x < 0)
		player.x = 0;
	if (player.x > 800)
		player.x = 800;
	if (player.y < 0)
		player.y = 0;
	if (player.y > 600)
		player.y = 600;
}

setInterval(function () {
	for (var player in players) {
		var obj = players[player];
		updatePlayer(obj);
	}
	io.sockets.emit('state', players);
}, 1000 / 60);