// 添加BOM头确保UTF-8编码
// 游戏配置
const config = {
    gridSize: 20,
    initialSpeed: 200,
    speedIncrease: 5
};

// 游戏状态
let snake = [];
let food = null;
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop = null;
let currentSpeed = config.initialSpeed;

// 获取Canvas上下文
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gridWidth = canvas.width / config.gridSize;
const gridHeight = canvas.height / config.gridSize;

// 初始化游戏
function initGame() {
    snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    currentSpeed = config.initialSpeed;
    generateFood();
    updateScore();
}

// 生成食物
function generateFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        // 确保食物不会生成在蛇身上
        if (!snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            break;
        }
    }
}

// 更新分数
function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('final-score').textContent = score;
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('game-over').style.display = 'block';
}

// 检查碰撞
function checkCollision(head) {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }
    // 检查自身碰撞
    return snake.some((segment, index) => {
        if (index === 0) return false;
        return segment.x === head.x && segment.y === head.y;
    });
}

// 移动蛇
function moveSnake() {
    direction = nextDirection;
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (checkCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        currentSpeed = Math.max(50, currentSpeed - config.speedIncrease);
        clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, currentSpeed);
        generateFood();
        updateScore();
    } else {
        snake.pop();
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize - 1,
            config.gridSize - 1
        );
    });

    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(
        food.x * config.gridSize,
        food.y * config.gridSize,
        config.gridSize - 1,
        config.gridSize - 1
    );
}

// 游戏步骤
function gameStep() {
    moveSnake();
    draw();
}

// 开始游戏
function startGame() {
    document.getElementById('game-over').style.display = 'none';
    clearInterval(gameLoop);
    initGame();
    gameLoop = setInterval(gameStep, currentSpeed);
}

// 触摸控制
document.getElementById('up-btn').addEventListener('touchstart', () => handleDirection('up'));
document.getElementById('down-btn').addEventListener('touchstart', () => handleDirection('down'));
document.getElementById('left-btn').addEventListener('touchstart', () => handleDirection('left'));
document.getElementById('right-btn').addEventListener('touchstart', () => handleDirection('right'));

// 键盘控制
document.addEventListener('keydown', (event) => {
    const newDirection = keyMap[event.key];
    if (!newDirection) return;
    handleDirection(newDirection);
});

function handleDirection(newDirection) {
    const keyMap = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right'
    };

    const newDirection = keyMap[event.key];
    if (!newDirection) return;

    // 防止180度转向
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };

    if (opposites[newDirection] !== direction) {
        nextDirection = newDirection;
    }
    event.preventDefault();
});

// 初始化游戏
startGame();