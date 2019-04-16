// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // make enemies loop to left side of canvas after reaching canvas.width
    if (this.x >= 505) {
        this.x = 0;
    }

    // Check for collision with enemies or barrier-walls
    checkCollision(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
}

// Draw the player on the screen, required method for game
// Display score
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    displayScoreLevel(score, gameLevel);
};

Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left') {
        player.x -= player.speed;
    }
    if (keyPress == 'up') {
        player.y -= player.speed - 20;
    }
    if (keyPress == 'right') {
        player.x += player.speed;
    }
    if (keyPress == 'down') {
        player.y += player.speed - 20;
    }
    console.log('keyPress is: ' + keyPress);
};

// Function to display player's score
var displayScoreLevel = function(aScore, aLevel) {
    // add player score and level to div element
    scoreLevelDiv.innerHTML = 'Score: ' + aScore + ' - ' + 'Level: ' + aLevel + '/20' ;
};

var checkCollision = function(anEnemy) {
    // check for collision between enemy and player
    if (
        player.y + 131 >= anEnemy.y + 90
        && player.x + 25 <= anEnemy.x + 88
        && player.y + 73 <= anEnemy.y + 135
        && player.x + 76 >= anEnemy.x + 11) {
        errorSound.play();
        player.x = 202.5;
        player.y = 383;

        // decrease number of lives
        lives[gameOverCount].classList.remove("fa","fa-heart");
        lives[gameOverCount].classList.add("fa","fa-heart-o");
        gameOverCount++;

        // if the game is over, freze the screen by disable keys listener and remove enemies
        if (gameOverCount===3){

          allEnemies.length = 0;
           if(confirm('Game Over :(!!\nDo you want to try again?'))
           {
             window.location.reload();
           }else{
             // if the user press cancel then disable the screen
            document.removeEventListener('keydown', keysListener );
           }
         }
    }

    // check for player reaching top of canvas and winning the game
    // if player wins, add 1 to the score and level
    // pass score as an argument to the increaseDifficulty function
    if (player.y + 63 <= 0) {
        player.x = 202.5;
        player.y = 383;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        if (gameLevel === 20)
        {
          winSound.play();
          alert("YOU WIN, CONGRATULATIONS 🎉🎉!");

        }

        score += 3;
        gameLevel += 1;
        newLevelSound.play();
        increaseDifficulty(score);
    }

    // check if player runs into left, bottom, or right canvas walls
    // prevent player from moving beyond canvas wall boundaries
    if (player.y > 383 ) {
        player.y = 383;
    }
    if (player.x > 402.5) {
        player.x = 402.5;
    }
    if (player.x < 2.5) {
        player.x = 2.5;
    }
};

// Increase number of enemies on screen based on player's score
var increaseDifficulty = function(numEnemies) {
    // remove all previous enemies on canvas
    allEnemies.length = 0;

    // load new set of enemies
    for (var i = 0; i <= numEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);
        allEnemies.push(enemy);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Enemy randomly placed vertically within section of canvas
// Declare new score , gameLevel , sounds and lives variables
let allEnemies = [];
let player = new Player(202.5, 383, 50);
let score = 0;
let gameLevel = 1;
let scoreLevelDiv = document.getElementById("game-status");
let gameOverCount = 0;
let errorSound = new sound("sounds/bounce.mp3");
let winSound = new sound("sounds/Ta Da.mp3");
let newLevelSound = new sound("sounds/Decapitation.mp3");
let lives = document.querySelectorAll('li');

// add sound effect to the game, reference: 'https://www.w3schools.com/graphics/game_sound.asp'
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// create initial enemies
for (var i = 0; i < 2; i++) {
  var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);
  allEnemies.push(enemy);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', keysListener );

function keysListener(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}
