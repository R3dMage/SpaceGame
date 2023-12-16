// Vital Game variables
var width = 500,
 height = 720,
 gLoop,
 gameState = 'PreRun',
 Score = 0;
 Lives = 5;
 Level = 1;
 Kills = 0;
 
var Enemies = [];
var Missiles = [];
var Explosions = [];
var PowerUps = [];
var howManyCircles = 4, circles = [];

// Get the context from off the page!
 c = document.getElementById('c'),
 ctx = c.getContext('2d');

c.top = 150;
c.width = width + 110;
c.height = height;
Player = new player();

var clear = function(){
	ctx.fillStyle = '#000000';
	ctx.beginPath();
	ctx.rect(0,0, width, height);
	ctx.closePath();
	ctx.fill();
	};

function pad(num) {
		var s = num+"";
		while (s.length < 10) s = "0" + s;
		return s;
}

KeyboardController({37: function() {Player.setPosition(Player.loc.X - 8, Player.loc.Y);},
					38: function() {Player.setPosition(Player.loc.X, Player.loc.Y - 8);},
					39: function() {Player.setPosition(Player.loc.X + 8, Player.loc.Y);},
					40: function() {Player.setPosition(Player.loc.X, Player.loc.Y + 8);}},20);

function PlayerShoot(){
	if(!Player.Exploding){
		if(Player.DualCannon){
			Missiles.push(new missile(Player.loc.X + 2, Player.loc.Y, Player.WeaponWeight, 0, Player.WaveCannon));
			Missiles.push(new missile(Player.loc.X + 12, Player.loc.Y, Player.WeaponWeight, 0, Player.WaveCannon));
		}
		else
			Missiles.push(new missile(Player.loc.X + 8, Player.loc.Y, Player.WeaponWeight, 0, Player.WaveCannon));
	}
}

function StartGame(){
	Enemies.splice(0, Enemies.length);
	Missiles.splice(0, Enemies.length);
	Kills = 0;
	Score = 0;
	Lives = 5;
	Level = 1;
	Player = new player();
	gameState = 'Run';
}

function HandlePowerUps(powerup, idx, array){
	powerup.move();
	powerup.draw();
	
	if( powerup.loc.CollidedWith( Player.loc) ){
		switch(powerup.Letter){
		case 'M':
			Player.WeaponWeight += 1;
			break;
		case 'D':
			Player.DualCannon = true;
			break;
		case 'S':
			Player.Shields += 1;
			break;
		case 'W':
			Player.WaveCannon = true;
			break;
		}
		PowerUps.splice(idx,1);
	}
	if( powerup.loc.Y > 720 )
		PowerUps.splice(idx,1);
}

function HandleKabooms(explosion, idx, array){
	explosion.draw();
	if(explosion.Done)
		Explosions.splice(idx,1);
}

function HandleMissiles(missile, idx, array){
	missile.move();
	missile.draw();

	for (var i = 0; i < Enemies.length; i++){
		// Check if player hit any bad guys!
		if (missile.loc.CollidedWith(Enemies[i].loc)){
			Enemies[i].Health -= missile.Weight;
			if (Enemies[i].Health <= 0){
			// The enemy player hit has died. Get Points!
				Score += Enemies[i].Weight * 100;
				Explosions.push(new kaboom(Enemies[i].loc.X + Enemies[i].loc.Width / 2, Enemies[i].loc.Y, 15));
				if (Enemies[i].PowerUp){
					PowerUps.push(new powerup(Enemies[i].loc.X, Enemies[i].loc.Y));
				}
				Enemies.splice(i, 1);
				Missiles.splice(idx, 1);
				Kills += 1;
			}
		}
	}
	
	// Check if bad guy shot the player!
	if( missile.Direction != 0 && missile.loc.CollidedWith( Player.loc) ){
		// Some sort of player hit animation
		Player.Exploding = true;
		Player.Invincible = true;
		Player.died();
		Lives -= 1;
	}
	
	if (missile.EndDuration())
		Missiles.shift();
}

function HandleEnemies(enemy, idx, array){
	enemy.move();
	enemy.draw();
	// Check if player collided with a bad guy
	if( !Player.Invincible && enemy.loc.CollidedWith( Player.loc) ){
		if (Player.Shields > 0){
						Player.Invincible = true;
						Player.Shields -= 1;
				}
				else{
						// Some sort of player hit animation
						Player.Exploding = true;
						Player.Invincible = true;
						Player.died();
						Lives -= 1;
				}
	}
	if (enemy.fire()){
		//Missiles.push(new missile(enemy.loc.X + (enemy.loc.getX1()/2), enemy.loc.getY1(), enemy.Weight, 1))
	}
	// If enemy gets to the bottom stop thinking about him
	if (enemy.loc.Y > 720)
		Enemies.shift();
}

function DrawStatus(){
// Draw the status on the top of the screen
	ctx.font = "15px Arial";
	ctx.textAlign = 'right';
	ctx.fillStyle = "White";
	ctx.fillText("Score: " + pad(Score),490,15);
	ctx.textAlign = 'center';
	ctx.fillText("Lives: " + Lives, 250, 15);
	ctx.textAlign = 'left';
	ctx.fillText('Level: ' + Level, 0, 15);
}

function PlayGame(sidePanel){
	clear();
	X = Math.random() * 1000;
	if(Enemies.length < 5 && X > 990 ){
		Enemies.push(new swooper((Math.random() * 400 + 100), Math.random() * 50, Level, Level));
	}
	
// Handle all the drawing on the screen
	MoveCircles(Level); 
	DrawCircles();
	Missiles.forEach(HandleMissiles);
	Enemies.forEach(HandleEnemies);
	Explosions.forEach(HandleKabooms);
	PowerUps.forEach(HandlePowerUps);
	Player.draw();
	
	DrawStatus();
	sidePanel.draw(ctx, Player, true);
// Handle Level Ups
	if( Kills > Level * 10 )
			Level += 1;
// Handle dead player
	if( Lives <= 0 && !Player.Exploding ){
			gameState = 'GameOver';
	}
}

function PreGame(sidePanel){
	clear();
	ctx.fillStyle = "Green";
	ctx.font = "40px Arial";
	ctx.textAlign = 'center';
	ctx.fillText("Alien Attack!", 500/2, 200);
	
	ctx.font = '10px Arial';
	ctx.fillText('Press SPACE to play',250, 500);
	
	MoveCircles(1); 
	DrawCircles();
	sidePanel.draw(ctx, Player, true);
}

function GameOver(){
	// Find out if we need to record users initials for highscore list
	// If so we need to run that function
	clear();
	ctx.fillStyle = "Green";
	ctx.font = "40px Arial";
	ctx.textAlign = 'center';
	ctx.fillText("GAME OVER!", 500/2, 200);
	
	ctx.font = '10px Arial';
	ctx.fillText('Press SPACE to play',250, 500);
	
	MoveCircles(1); 
	DrawCircles();
	sidePanel.draw(ctx, Player, false);
}

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

var GameLoop = function(){
	switch (gameState){
	case "PreRun":
			PreGame(sideStatus);
				break;
	case "Run":
			PlayGame(sideStatus);
				break;
	case "GameOver":
			GameOver(sideStatus);
				break;
	}
	gLoop = setTimeout(GameLoop, 1000 / 50);
}

sideStatus = new sideStatusDisplay(500, 0, 110, 720);
DisplayHighScores();
initCircles();
GameLoop();