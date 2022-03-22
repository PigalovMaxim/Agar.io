const canv = document.getElementById('canv');
const ctx = canv.getContext('2d');
clearField();
const socket = io('http://localhost:3000');

let keyAPressed = false;
let keyDPressed = false;
let keySPressed = false;
let keyWPressed = false;
let player = { x: Math.random() * 600 - 50, y: Math.random() * 600 - 50 }
document.addEventListener('keydown', (e) => {
  if (e.key === 'a') keyAPressed = true;
  if (e.key === 'd') keyDPressed = true;
  if (e.key === 's') keySPressed = true;
  if (e.key === 'w') keyWPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'a') keyAPressed = false;
  if (e.key === 'd') keyDPressed = false;
  if (e.key === 's') keySPressed = false;
  if (e.key === 'w') keyWPressed = false;
});

document.getElementById('start_game').addEventListener('click', function () {
  const nick = document.getElementById('login_input').value;
  const playerX = player.x;
  const playerY = player.y;
  socket.emit('login', { nick, playerX, playerY });
  setInterval(start, 100);
});

socket.on('getScene', arr => drawPlayers(arr));

function start() {
  clearField();
  drawPlayer(player.x, player.y, 25, '#ff0000');
  update();
}

function clearField() {
  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.rect(0, 0, 600, 600);
  ctx.fill();
}

function drawPlayer(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function update() {
  if (keyAPressed) {
    player.x -= 3;
  } else if (keyDPressed) {
    player.x += 3;
  }
  if (keyWPressed) {
    player.y -= 3;
  } else if (keySPressed) {
    player.y += 3;
  }
  socket.emit('move', { x: player.x, y: player.y });
}

function drawPlayers(players) {
  players.forEach(value => {
    drawPlayer(value.x, value.y, value.radius, value.color);
  });
}
