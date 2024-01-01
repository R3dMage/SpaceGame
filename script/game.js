
function game(){
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
	this.height = 720;
	this.levelTracker = new levelTracker();
	this.background = new background(25, this.height, this.width);
	this.background.initialize();
	this.gameCanvas = document.getElementById('gameCanvas');
	this.ctx = this.gameCanvas.getContext('2d');
	this.gameCanvas.top = 150;
	this.gameCanvas.width = this.width + 110;
	this.gameCanvas.height = this.height;
	this.sideStatus = new sideStatusDisplay(500, 0, 110, 720);

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
		this.levelTracker = new levelTracker();
		this.kills = 0;
		this.score = 0;
		this.lives = 5;
		this.frameNumber = 0;
		this.player = new player();
		this.gameState = 'Run';
	}

	this.playGame = function(){
		// let X = Math.random() * 1000;
		// if(this.enemies.length < 5 && X > 990 ){
		// 	this.enemies.push(new swooper((Math.random() * 400 + 100), Math.random() * 50, this.level, this.level));
		// }
		this.levelTracker.Process(this.frameNumber, this.enemies);

		// Handle dead player
		if( this.lives <= 0 && !this.player.Exploding ){
				this.gameState = 'GameOver';
				this.currentGameOverDelay = this.frameNumber + this.gameOverDelay;
		}

		this.moveObjects();
		this.checkForCollisions();
		this.drawObjects();
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

	this.checkForCollisions = function(){
		let missilesToRemove = [];
		let enemyProjectilesToRemove = [];
		let enemiesToRemove = [];
		let powerupsToRemove = [];
		let explosionsToRemove = [];

		for (let i = 0; i < this.missiles.length; i++){
			for (let j = 0; j < this.enemies.length; j++){
				// Check if player hit any bad guys!
				if (this.enemies[j].isDead())
					continue;

				if (this.missiles[i].loc.CollidedWith(this.enemies[j].loc)){
					this.enemies[j].Health -= this.missiles[i].weight;
					missilesToRemove.push(i);

					if (this.enemies[j].isDead()){
					// The enemy player hit has died. Get Points!
						this.score += this.enemies[j].Weight * 100;
						this.explosions.push(new kaboom(this.enemies[j].loc.X + this.enemies[j].loc.Width / 2, this.enemies[j].loc.Y, 15));
						if (this.levelTracker.levelNumber > 1 && Math.random() > 0.9){
							this.powerups.push(new powerup(this.enemies[j].loc.X, this.enemies[j].loc.Y));
						}
						this.kills += 1;
					}
				}
			}

			if(this.missiles[i].endDuration())
				missilesToRemove.push(i);
		}

		for (let i = 0; i < this.enemies.length; i++){
			// Check if player collided with a bad guy
			if (this.enemies[i].isDead())
				continue;

			if( !this.player.Invincible && this.enemies[i].loc.CollidedWith( this.player.loc) ){
				if (this.player.Shields > 0){
								this.player.Invincible = true;
								this.player.Shields -= 1;
						}
						else{
								// Some sort of player hit animation
								this.player.Exploding = true;
								this.player.Invincible = true;
								this.player.died();
								this.lives -= 1;
						}
			}
			if (this.enemies[i].canShoot()){
				let projectile = this.enemies[i].getProjectile(this.player.loc);
				this.enemyProjectiles.push(projectile);
			}
			// If enemy gets to the bottom stop thinking about him
			if (this.enemies[i].loc.Y > 720)
				enemiesToRemove.push(i);
		}

		for(let i = 0; i < this.enemyProjectiles.length; i++){
			if(this.enemyProjectiles[i].loc.CollidedWith(this.player.loc)){
				if (this.player.Shields > 0){
					this.player.Invincible = true;
					this.player.Shields -= 1;
				}
				else{
					this.player.Exploding = true;
					this.player.Invincible = true;
					this.player.died();
					this.lives -= 1;
				}
				enemyProjectilesToRemove.push(i);
			}

			if(this.enemyProjectiles[i].endDuration())
				enemyProjectilesToRemove.push(i);
		}

		for (let i = 0; i < this.explosions.length; i++){
			if(this.explosions[i].Done)
				explosionsToRemove.push(i);
		}

		for (let i = 0; i < this.powerups.length; i++){
			if( this.powerups[i].loc.CollidedWith( this.player.loc) ){
				switch(this.powerups[i].Letter){
				case 'M':
					this.player.WeaponWeight += 1;
					break;
				case 'D':
					this.player.DualCannon = true;
					break;
				case 'S':
					this.player.Shields += 1;
					break;
				}
				powerupsToRemove.push(i);
				break;
			}
			if( this.powerups[i].loc.Y > 720 ){
				powerupsToRemove.push(i);
			}
		}

		missilesToRemove.forEach((element) => this.missiles.splice(element, 1));
		enemyProjectilesToRemove.forEach((element) => this.enemyProjectiles.splice(element, 1));
		powerupsToRemove.forEach((element) => this.powerups.splice(element, 1));
		explosionsToRemove.forEach((element) => this.explosions.splice(element, 1));
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