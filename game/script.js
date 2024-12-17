const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const tileSize = 20; // Size of each grid tile
let snake = [{ x: 200, y: 200 }]; // Starting position of the snake
let direction = { x: 0, y: 0 }; // Initial movement (neutral)
let fruit = { x: 0, y: 0 }; // Fruit position
let score = 0;
let gameRunning = true;

// Initialize the fruit's position
placeFruit();

function placeFruit() {
    fruit.x = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
    fruit.y = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lime";
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);

        if (index === 0) {
            // Draw eyes on the snake's head
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 3, 0, Math.PI * 2); // Left eye
            ctx.arc(segment.x + 14, segment.y + 6, 3, 0, Math.PI * 2); // Right eye
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(segment.x + 6, segment.y + 6, 1.5, 0, Math.PI * 2); // Left pupil
            ctx.arc(segment.x + 14, segment.y + 6, 1.5, 0, Math.PI * 2); // Right pupil
            ctx.fill();
        }
    });
}

function drawFruit() {
    ctx.fillStyle = "orange"; // Mango color
    ctx.beginPath();
    ctx.arc(fruit.x + tileSize / 2, fruit.y + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function updateSnake() {
    if (direction.x === 0 && direction.y === 0) return; // Don't update if the snake hasn't moved yet

    const head = {
        x: snake[0].x + direction.x * tileSize,
        y: snake[0].y + direction.y * tileSize,
    };

    // Check for collisions with the walls or itself
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameRunning = false;
        alert(`Game Over! Your score: ${score}`);
        resetGame();
        return;
    }

    // Check for collision with the fruit
    if (head.x === fruit.x && head.y === fruit.y) {
        score++;
        placeFruit();
    } else {
        snake.pop(); // Remove the tail if no fruit is eaten
    }

    snake.unshift(head); // Add the new head
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 }; // Reset direction to neutral
    score = 0;
    gameRunning = true;
    placeFruit();
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawFruit();
    updateSnake();
    drawSnake();
}

// Change snake direction based on arrow key presses
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Run the game loop every 100ms
setInterval(gameLoop, 100);
