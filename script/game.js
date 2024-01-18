
function game(){
	this.lastLevel = 15;
	this.score = 0;
	this.lives = 5;
	this.kills = 0;
	this.frameNumber = 0;
	this.gameOverDelay = 100;
	this.currentGameOverDelay = 0;
	this.player = new player();
	this.enemies = [];
	this.missiles = [];
	this.enemyProjectiles = [];
	this.explosions = [];
	this.powerups = [];
	this.gLoop;
	this.gameState = 'PreRun';
	this.width = 500;
	this.height = 750;
	this.levelTracker = new levelTracker(this.lastLevel);
	this.background = new background(25, this.height, this.width);
	this.background.initialize();
	this.gameCanvas = document.getElementById('gameCanvas');
	this.ctx = this.gameCanvas.getContext('2d');
	this.gameCanvas.top = 150;
	this.gameCanvas.width = this.width + 110;
	this.gameCanvas.height = this.height;
	this.sideStatus = new sideStatusDisplay(500, 0, 110, 750);

	this.clear = function(){
		this.ctx.fillStyle = '#000000';
		this.ctx.beginPath();
		this.ctx.rect(0,0, this.width, this.height);
		this.ctx.closePath();
		this.ctx.fill();
		
	}

	this.preGame = function(){
		this.clear();
		this.ctx.fillStyle = "Green";
		this.ctx.font = "40px Arial";
		this.ctx.textAlign = 'center';
		this.ctx.fillText("Alien Attack!", 500/2, 200);
		
		this.ctx.font = '20px Arial';
		this.ctx.fillText('Shoot to start',250, 500);
		
		this.background.move(1);
		this.background.draw(this.ctx);
		this.sideStatus.draw(this.ctx, this.player, true);
	
	}

	this.startGame = function(){
		this.enemies.splice(0, this.enemies.length);
		this.missiles.splice(0, this.enemies.length);
		this.levelTracker = new levelTracker(this.lastLevel);
		this.kills = 0;
		this.score = 0;
		this.lives = 5;
		this.frameNumber = 0;
		this.player = new player();
		this.gameState = 'Run';
	}

	this.playGame = function(){	
		this.levelTracker.update(this.frameNumber, this.enemies);
		this.player.update();

		this.moveObjects();
		this.update();
		this.drawObjects();

		// Handle dead player
		if( this.lives <= 0 && !this.player.exploding ){
				this.gameState = 'GameOver';
				this.currentGameOverDelay = this.frameNumber + this.gameOverDelay;
		}

		if( this.levelTracker.victoryConditionsMet())
		{
			this.gameState = 'Victory';
		}
	}

	this.moveObjects = function(){
		this.background.move(this.levelTracker.levelNumber);

		for (let i = 0; i < this.missiles.length; i++){
			this.missiles[i].move();
		}

		for (let i = 0; i < this.enemyProjectiles.length; i++){
			this.enemyProjectiles[i].move();
		}

		for (let i = 0; i < this.enemies.length; i++){
			this.enemies[i].move();
		}

		for (let i = 0; i < this.powerups.length; i++){
			this.powerups[i].move();
		}
	}

	this.update = function(){
		this.updateMissiles();
		this.updateEnemies();
		this.updateEnemyProjectiles();
		this.updateExplosions();
		this.updatePowerUps();		
	}

	this.updateMissiles = function(){
		let missilesToRemove = [];

		for (let i = 0; i < this.missiles.length; i++){
			for (let j = 0; j < this.enemies.length; j++){
				// Check if player hit any bad guys!
				if (this.enemies[j].isDead())
					continue;

				if (this.missiles[i].loc.collidedWith(this.enemies[j].loc)){
					this.enemies[j].health -= this.missiles[i].weight;
					missilesToRemove.push(i);

					if (this.enemies[j].isDead()){
					// The enemy player hit has died. Get Points!
						this.score += this.enemies[j].weight * 100;
						this.explosions.push(new kaboom(this.enemies[j].loc.x + this.enemies[j].loc.width / 2, this.enemies[j].loc.y, 15));
						if (this.levelTracker.levelNumber > 1 && Math.random() > 0.9){
							this.powerups.push(new powerup(this.enemies[j].loc.x, this.enemies[j].loc.y));
						}
						this.kills += 1;
					}
				}
			}

			if(this.missiles[i].endDuration())
				missilesToRemove.push(i);
		}
		
		missilesToRemove.forEach((element) => this.missiles.splice(element, 1));
	}

	this.updateEnemies = function(){
		for (let i = 0; i < this.enemies.length; i++){
			// Check if player collided with a bad guy
			if (this.enemies[i].isDead())
				continue;

			if( !this.player.invincible && this.enemies[i].loc.collidedWith( this.player.loc) ){
				if (this.player.shields > 0){
						this.player.invincible = true;
						this.player.shields -= 1;
				}
				else{
						// Some sort of player hit animation
						this.player.exploding = true;
						this.player.invincible = true;
						this.player.died();
						this.lives -= 1;
				}
			}

			if (this.enemies[i].canShoot()){
				let projectile = this.enemies[i].getProjectile(this.player.loc);
				this.enemyProjectiles.push(projectile);
			}
		}
	}

	this.updateEnemyProjectiles = function(){
		let enemyProjectilesToRemove = [];

		for(let i = 0; i < this.enemyProjectiles.length; i++){
			if(!this.player.invincible && this.enemyProjectiles[i].loc.collidedWith(this.player.loc)){
				if (this.player.shields > 0){
					this.player.invincible = true;
					this.player.shields -= 1;
				}
				else{
					this.player.exploding = true;
					this.player.invincible = true;
					this.player.died();
					this.lives -= 1;
				}
				enemyProjectilesToRemove.push(i);
			}

			if(this.enemyProjectiles[i].endDuration())
				enemyProjectilesToRemove.push(i);
		}

		enemyProjectilesToRemove.forEach((element) => this.enemyProjectiles.splice(element, 1));
	}

	this.updateExplosions = function(){
		let explosionsToRemove = [];

		for (let i = 0; i < this.explosions.length; i++){
			if(this.explosions[i].Done)
				explosionsToRemove.push(i);
		}
		
		explosionsToRemove.forEach((element) => this.explosions.splice(element, 1));
	}

	this.updatePowerUps = function(){
		let powerupsToRemove = [];

		for (let i = 0; i < this.powerups.length; i++){
			if( this.powerups[i].loc.collidedWith( this.player.loc) ){
				this.player.processPowerUp(this.powerups[i].letter);
				powerupsToRemove.push(i);
			}
			if( this.powerups[i].loc.y > 720 ){
				powerupsToRemove.push(i);
			}
		}

		powerupsToRemove.forEach((element) => this.powerups.splice(element, 1));
	}

	this.drawObjects = function(){
		this.clear();
		this.background.draw(this.ctx);

		for (let i = 0; i < this.missiles.length; i++){
			this.missiles[i].draw(this.ctx);
		}

		for (let i = 0; i < this.enemyProjectiles.length; i++){
			this.enemyProjectiles[i].draw(this.ctx);
		}

		for (let i = 0; i < this.enemies.length; i++){
			this.enemies[i].draw(this.ctx);
		}

		for (let i = 0; i < this.powerups.length; i++){
			this.powerups[i].draw(this.ctx);
		}

		for (let i = 0; i < this.explosions.length; i++){
			this.explosions[i].draw(this.ctx);
		}

		this.player.draw(this.ctx);

		this.drawStatus(this.ctx);
		this.sideStatus.draw(this.ctx, this.player, true);
	}

	this.gameOver = function(){
		// Find out if we need to record users initials for highscore list
		// If so we need to run that function
		this.clear(this.ctx);
		this.ctx.fillStyle = "Green";
		this.ctx.font = "40px Arial";
		this.ctx.textAlign = 'center';
		this.ctx.fillText("GAME OVER!", 500/2, 200);
		
		if (this.frameNumber > this.currentGameOverDelay){
			this.ctx.font = '20px Arial';
			this.ctx.fillText('Shoot to start',250, 500);
		}
		
		this.background.move(1);
		this.background.draw(this.ctx);
		this.sideStatus.draw(this.ctx, this.player, false);
	
	}

	this.victoryScreen = function(){
		this.clear(this.ctx);
		this.ctx.fillStyle = "Green";
		this.ctx.font = "40px Arial";
		this.ctx.textAlign = 'center';
		this.ctx.fillText("VICTORY!", 500/2, 200);
		
		if (this.frameNumber > this.currentGameOverDelay){
			this.ctx.font = '20px Arial';
			this.ctx.fillText('Refresh to play again',250, 500);
		}
		
		this.background.move(1);
		this.background.draw(this.ctx);
		this.sideStatus.draw(this.ctx, this.player, false);
	}

	this.drawStatus = function(ctx){
		ctx.fillStyle = "White";
		ctx.font = "15px Arial";
		ctx.textAlign = 'right';
		ctx.fillText("Score: " + pad(this.score), 490, 15);
		ctx.textAlign = 'center';
		ctx.fillText("Lives: " + this.lives, 250, 15);
		ctx.textAlign = 'left';
		ctx.fillText("Level: " + this.levelTracker.levelNumber, 0, 15);

		if(this.levelTracker.showLevelUp()){
			ctx.fillStyle = "Yellow";
			ctx.font = "40px Arial";
			ctx.textAlign = 'center';
			ctx.fillText("Level Up!", 500/2, 200);
		}
	}

	this.playerShoot = function(event){
		if (event == "onkeyup")
		{
			this.player.resetShootDelay();
			return;
		}

		if(this.player.canShoot(this.frameNumber)){
			let projectiles = this.player.getProjectiles();
			projectiles.forEach((element) => this.missiles.push(element));
		}
	
	}

	this.spacePressed = function(event){
		switch(this.gameState){
		case 'PreRun':
			this.startGame();
			break;
		case 'Run':
			this.playerShoot(event);
			break;
		case 'GameOver':
			if (this.frameNumber > this.currentGameOverDelay)
				this.startGame();
			break;
		}
	}

	this.gameLoop = function(){
		this.frameNumber += 1;
		switch (this.gameState){
		case "PreRun":
			this.preGame();
			break;
		case "Run":
			this.playGame();
			break;
		case "GameOver":
			this.gameOver();
			break;
		case "Victory":
			this.victoryScreen();
			break;
		}
	}
}

function pad(num) {
		var s = num+"";
		while (s.length < 10) s = "0" + s;
		return s;
}

KeyboardController({37: function() {theGame.player.moveLeft();},
					38: function() {theGame.player.moveUp();},
					39: function() {theGame.player.moveRight();},
					40: function() {theGame.player.moveDown();},
					32: function(event) {theGame.spacePressed(event)}},20);

function DisplayHighScores(){
	Request = new XMLHttpRequest();
	Request.open("POST","GetScore.php",true);
	Request.send();
	Request.onreadystatechange=function(){
		document.getElementById("highscores").innerHTML=Request.responseText;
	}
}

function RecordHighScore(){
	Request = new XMLHttpRequest();
	Request.open("POST","LogScore.php",true);
	Request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	Request.send("name=" + Name + "&score=" + Score);
}

var debugCollisions = false;
var theGame = new game();

var Loop = function(){
	theGame.gameLoop();	
	gloop = setTimeout(Loop, 1000 / 50);
}

Loop();