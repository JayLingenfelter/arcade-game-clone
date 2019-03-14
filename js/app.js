//This variable describes three states for the game
//0 = Unstarted, 1 = Running, 2 = Ended
var running = 1;
// Enemies our player must avoid
var Enemy = function(beginX, beginY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = beginX;
    this.y = beginY;
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
    if (running != 2 && this.x > ctx.canvas.width) {
      // Check if the game is running and if the enemy is right
      // of the bounds of the canvas, set the enemy to the left
      this.x = -100;
      // Defines a randomized speed greater than zero for each
      // enemy moving left to right
      this.speed = 80*Math.floor(Math.random()*5 + 1);
    }
    this.checkCollisions();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function detects overlap between the player and enemies
Enemy.prototype.checkCollisions = function() {
  var enemyRightX = this.x + 55;
  var enemyLeftX = this.x - 55;
  var enemyTopY = this.y - 55;
  var enemyBottomY = this.y + 55;
  // Defines visual bounds of the enemy sprite and resets the
  // player avatar if its position is inside those bounds
  if (player.x < enemyRightX && player.x > enemyLeftX && player.y < enemyBottomY && player.y > enemyTopY) {
    player.resetPosition();
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(dt) {
  this.beginX = 200;
  this.x = this.beginX;
  this.beginY = 300;
  this.y = this.beginY;
  this.status = 'rest';
  this.sprite = 'images/char-boy.png';

}

// Checks to see if the player sprite is in the end
// area before each move, then moves
Player.prototype.update = function(dt) {
    this.endGame(this.y);
    this.move(dt)
  }

// Render function to draw the player sprite
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

// Returns a move state for each valid keypress,
// to be used by move()
Player.prototype.handleInput = function(key) {
  switch(key) {
    case('up'):
      this.status = 'moveUp';
      break;
    case('down'):
      this.status = 'moveDown';
      break;
    case('left'):
      this.status = 'moveLeft';
      break;
    case('right'):
      this.status = 'moveRight';
      break;
    default:
      this.status = 'rest';
  }
}

// Takes the move state returned by handleInput(),
// checks if the player is inside the legal play
// area, and if so moves the sprite
Player.prototype.move = function(dt) {
  if (this.status === 'moveUp' && this.y > -10) {
    this.y -= dt * 150;
  }
  if (this.status === 'moveDown' && this.y < ctx.canvas.height - 220) {
    this.y += dt * 150;
  }
  if (this.status === 'moveRight' && this.x < ctx.canvas.width - 100) {
    this.x += dt * 150;
  }
  if (this.status === 'moveLeft' && this.x > 0) {
    this.x -= dt * 150;
  }
}

// Resets the player avatar to the start position
Player.prototype.resetPosition = function() {
  this.x = this.beginX;
  this.y = this.beginY;
}

// Puts the app in the end state, ceasing enemy spawn,
// and pops up an alert announcing the end
Player.prototype.endGame = function() {
  if (this.y <= -10) {
    running = 2;
    alert('You did it! Refresh to try again!');
    this.resetPosition();
  } else {
    running = 1;
  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(-50, 60, 300),
                  new Enemy(-50, 140, 400),
                  new Enemy(-50, 230, 200),]
player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Listens for keyup after valid keydowns to stop the player
// from moving when they aren't trying to
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'rest',
        38: 'rest',
        39: 'rest',
        40: 'rest'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
