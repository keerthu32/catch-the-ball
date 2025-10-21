const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

let score = 0, level = 1, lives = 3;
let basketWidth = 80, basketHeight = 20, basketX, basketY;
let basketSpeed = 7;
let balls = [];
let ballSpeed = 2;
let gameInterval, isGameOver = false;

// Resize canvas for mobile & desktop
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth*0.95, 600);
    canvas.height = Math.min(window.innerHeight*0.6, 500);
    basketY = canvas.height - basketHeight - 10;
    if(!basketX) basketX = canvas.width/2 - basketWidth/2;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Keyboard control
let rightPressed = false, leftPressed = false;
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
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth/2;
    basketX = Math.max(0, Math.min(canvas.width - basketWidth, basketX));
});

// Touch control
canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    basketX = e.touches[0].clientX - rect.left - basketWidth/2;
    basketX = Math.max(0, Math.min(canvas.width - basketWidth, basketX));
}, {passive:false});

// Spawn balls
function spawnBall() {
    const x = Math.random() * (canvas.width - 20);
    balls.push({x: x, y: 0, radius: 10, color: `hsl(${Math.random()*360},70%,60%)`});
}

// Draw basket
function drawBasket() {
    ctx.fillStyle = "#ff5722";
    ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
}

// Draw balls
function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
        ctx.fillStyle = ball.color;
        ctx.fill();
    });
}

// Move basket with keyboard
function moveBasket() {
    if(rightPressed) basketX = Math.min(canvas.width - basketWidth, basketX + basketSpeed);
    if(leftPressed) basketX = Math.max(0, basketX - basketSpeed);
}

// Update balls
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

        // Miss
        if(ball.y + ball.radius > canvas.height) {
            lives--;
            livesEl.textContent = lives;
            balls.splice(index,1);
            if(lives === 0) gameOver();
        }
    });
}

// Level up
function levelUp() {
    level++;
    levelEl.textContent = level;
    ballSpeed += 0.5;
    basketWidth = Math.max(40, basketWidth - 5);
}

// Draw game
function draw() {
    if(isGameOver) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBasket();
    drawBalls();
    moveBasket();
    updateBalls();
    requestAnimationFrame(draw);
}

// Start game
function startGame() {
    score = 0; level = 1; lives = 3;
    basketWidth = 80; ballSpeed = 2; isGameOver = false;
    scoreEl.textContent = score;
    levelEl.textContent = level;
    livesEl.textContent = lives;
    balls = [];
    basketX = canvas.width/2 - basketWidth/2;
    gameOverScreen.style.display = "none";

    draw();
    const spawnInterval = window.innerWidth < 768 ? 1500 : 1000;
    clearInterval(gameInterval);
    gameInterval = setInterval(spawnBall, spawnInterval);
}

// Game over
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScore.textContent = score;
    gameOverScreen.style.display = "flex";
}

// Restart
restartBtn.addEventListener("click", startGame);

// Auto-start
startGame();
