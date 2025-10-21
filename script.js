const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let level = 1;
let lives = 3;
let basketWidth = 80;
let basketHeight = 20;
let basketX = canvas.width / 2 - basketWidth / 2;
let basketY = canvas.height - basketHeight - 10;
let basketSpeed = 7;
let balls = [];
let ballSpeed = 2;
let gameInterval;
let isGameOver = false;

// Keyboard control
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", e => {
  if(e.key === "ArrowRight") rightPressed = true;
  if(e.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", e => {
  if(e.key === "ArrowRight") rightPressed = false;
  if(e.key === "ArrowLeft") leftPressed = false;
});

// Mouse control
document.addEventListener("mousemove", e => {
  let rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  basketX = mouseX - basketWidth/2;
  if(basketX < 0) basketX = 0;
  if(basketX + basketWidth > canvas.width) basketX = canvas.width - basketWidth;
});

function spawnBall() {
  const x = Math.random() * (canvas.width - 20);
  balls.push({x: x, y: 0, radius: 10, color: `hsl(${Math.random()*360},70%,60%)`});
}

function drawBasket() {
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
}

function drawBalls() {
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  });
}

function moveBasket() {
  if(rightPressed && basketX + basketWidth < canvas.width) basketX += basketSpeed;
  if(leftPressed && basketX > 0) basketX -= basketSpeed;
}

function updateBalls() {
  balls.forEach((ball, index) => {
    ball.y += ballSpeed;

    // Catch
    if(ball.y + ball.radius >= basketY &&
       ball.x >= basketX && ball.x <= basketX + basketWidth) {
      score++;
      balls.splice(index,1);
      scoreEl.textContent = score;
      if(score % 10 === 0) levelUp();
    }

    // Missed
    if(ball.y + ball.radius > canvas.height) {
      lives--;
      livesEl.textContent = lives;
      balls.splice(index,1);
      if(lives === 0) gameOver();
    }
  });
}

function levelUp() {
  level++;
  levelEl.textContent = level;
  ballSpeed += 0.5;
  basketWidth = Math.max(40, basketWidth - 5);
}

function draw() {
  if(isGameOver) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBasket();
  drawBalls();
  moveBasket();
  updateBalls();
  requestAnimationFrame(draw);
}

function startGame() {
  score = 0;
  level = 1;
  lives = 3;
  basketWidth = 80;
  ballSpeed = 2;
  isGameOver = false;
  scoreEl.textContent = score;
  levelEl.textContent = level;
  livesEl.textContent = lives;
  balls = [];
  gameOverScreen.style.display = "none";
  draw();
  gameInterval = setInterval(spawnBall, 1000);
}

function gameOver() {
  isGameOver = true;
  clearInterval(gameInterval);
  finalScore.textContent = score;
  gameOverScreen.style.display = "block";
}

restartBtn.addEventListener("click", startGame);

// Auto-start
startGame();
