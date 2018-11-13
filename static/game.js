//@ts-check

var socket = io('localhost:5000');
socket.on('message', function(data) {
	console.log(data);
	socket.emit('message', 'and hi 2u!');
});

var movement = {
	up: false,
	down: false,
	left: false,
	right: false
}
document.addEventListener('keydown', function (event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = true;
			break;
		case 87: // W
			movement.up = true;
			break;
		case 68: // D
			movement.right = true;
			break;
		case 83: // S
			movement.down = true;
			break;
	}
});
document.addEventListener('keyup', function (event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = false;
			break;
		case 87: // W
			movement.up = false;
			break;
		case 68: // D
			movement.right = false;
			break;
		case 83: // S
			movement.down = false;
			break;
	}
});

socket.emit('new player');
setInterval(function () {
	socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var carImg = new Image();
carImg.src = 'static/car1.png';


socket.on('state', function (players) {
	context.clearRect(0, 0, 800, 600);
	context.fillStyle = 'green';
	for (var id in players) {
		var player = players[id];
		context.save();
		context.translate(player.x, player.y);
		context.rotate(player.direction + 3.14*0.5);
		context.translate(-16, -16);
		context.drawImage(carImg, 0, 0);
		context.restore();
	}
});