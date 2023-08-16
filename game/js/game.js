const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
const keys = [];

const player = {
    x : 75,
    y : 300,
    width : 133.7,
    height : 135.7,
    frameX : 0,
    frameY : 0,
    speed : 4,  
    moving : false,
    health : 1000,
    damage : 15
};

const enemy = {
    x : 600,
    y : 300,
    width : 133.7,
    height : 135.7,
    frameX : 0,
    frameY : 0,
    speed : 4,  
    moving : false,
    health : 1000,
    damage : 15
};

// Adding the sprites images and the background
const playerSprite = new Image();
playerSprite.src = "img/fighter3.png";
const background = new Image();
background.src = "img/background1.jpeg";
const enemySprite = new Image();
enemySprite.src = "img/enemy.png";

// Adding health trackers
let healthTrackerPlayer = document.getElementById('healthPlayer');
let healthTrackerEnemy = document.getElementById('healthEnemy');

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX , sY, sW, sH, dX, dY, dW, dH);
}         


window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    if (keys[81] || keys[68] || keys[90] || keys[83] || keys[82]) {
        player.moving = true;
    }
    if (keys[37] || keys[39] || keys[32] || keys[38] || keys[40]) {
        enemy.moving = true;
    }
});

window.addEventListener("keyup", function(e) {
    delete keys[e.keyCode];
    player.moving = false;
    enemy.moving = false;
});


function movePlayer() {
    // Player side
    // Go left (left arrow)
    if (keys[81] && player.x > 0) {
        player.x -= player.speed;
        player.frameY = 2;
    }
    // Go right (right arrow)
    if (keys[68] && player.x < canvas.width) {
        player.x += player.speed;
        player.frameY = 0;
    }
    // Go right faster (down arrow)
    if (keys[90] && player.x < canvas.width) {
        player.x += player.speed + 10;
        player.frameY = 2;
    }
    // Go left faster (top arrow)
    if (keys[83] && player.x > 0) {
        player.x -= player.speed + 10;
        player.frameY = 2;
    }
    // Attack SPACE
    if (keys[82] && player.x < canvas.width - player.speed) {
        // player.x += player.speed;
        player.frameY = 1;
        if (player.x > enemy.x - 15 && player.x < enemy.x + 15 && player.frameX > 1) {
            enemy.health -= player.damage;
            console.log(enemy.health);
        }
    }

    // Enemy side
    // Go left Q
    if (keys[37] && enemy.x > 0) {
        enemy.x -= enemy.speed;
        enemy.frameY = 0;
    }
    // Go right D
    if (keys[39] && enemy.x < canvas.width) {
        enemy.x += enemy.speed;
        enemy.frameY = 2;
    }
    // Go left faster Z
    if (keys[38] && enemy.x > 0) {
        enemy.x -= enemy.speed + 10;
        enemy.frameY = 0;
    }
    // Go right faster S
    if (keys[40] && enemy.x < canvas.width) {
        enemy.x += enemy.speed + 10;
        enemy.frameY = 2;
    }
    // Attack R
    if (keys[32] && enemy.x < canvas.width - enemy.speed) {
        enemy.frameY = 1;
        if (enemy.x > player.x - 10 && enemy.x < player.x + 10 && enemy.frameX > 1) {
            player.health -= enemy.damage;
            console.log(player.health);
        }
    }
}

// Make the sprites move
function handlePlayerFrame() {
    if (player.frameX < 5 && player.moving) player.frameX++
    else player.frameX = 0;

    if (enemy.frameX < 5 && enemy.moving) enemy.frameX++
    else enemy.frameX = 0;
}

let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        drawSprite(enemySprite, enemy.width * enemy.frameX, enemy.height * enemy.frameY, enemy.width, enemy.height, enemy.x, enemy.y, enemy.width, enemy.height);
        movePlayer();
        handlePlayerFrame();
        healthTrackerPlayer.innerHTML = player.health;
        healthTrackerEnemy.innerHTML = enemy.health;
        if (player.health > 800) {
            healthTrackerPlayer.style.backgroundColor = "rgb(60,179,113)";
        } else if (player.health > 350) {
            healthTrackerPlayer.style.backgroundColor = "rgb(193, 134, 24)";
        } else {
            healthTrackerPlayer.style.backgroundColor = "rgb(175, 46, 46)";
        }

        if (enemy.health > 800) {
            healthTrackerEnemy.style.backgroundColor = "rgb(60,179,113)";
        } else if (enemy.health > 350) {
            healthTrackerEnemy.style.backgroundColor = "rgb(193, 134, 24)";
        } else {
            healthTrackerEnemy.style.backgroundColor = "rgb(175, 46, 46)";
        }

        if (player.health < 0) {
            document.querySelector(".game-over").style.display = "block";
            document.querySelector(".score").innerHTML = `the player on the left won with ${enemy.health} hp remaining`;
            player.damage = 0;
            enemy.damage = 0;
        }
        if (enemy.health < 0) {
            document.querySelector(".game-over").style.display = "block";
            document.querySelector(".score").innerHTML = `the player on the right won with ${player.health} hp remaining`;
            player.damage = 0;
            enemy.damage = 0;
        }
    }

}
startAnimating(10);



