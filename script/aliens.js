var SwooperState = {
	SWOOP   :  0,
	RUSH    :  1,
	RETREAT :  2};

var PredatorState = {
	SHOOT :0,
	WAIT  :1,
	MOVE  :2};
	
function swooper(x, y, health, weight){
	this.loc = new position(x, y, 40, 15);
	this.readyToShoot = false;
	this.health = health;
	this.weight = weight;
	this.state = SwooperState.SWOOP;
	this.moveRight = true;
	this.color = '8844FF'
	let randomX = (Math.random() * 10) + 80;
	this.posX = this.loc.x + randomX;
	this.negX = this.loc.x - randomX;
	this.origY = this.loc.y;
	this.origX = this.loc.x;
	this.swoop = 0;
	this.swoopMax = Math.random() * 10;

	this.draw = function(ctx){
		if (this.health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.x, this.loc.y, this.loc.width, this.loc.height);
			return;
		}

		var drawX = this.loc.x + 25;
		var drawY = this.loc.y;
		this.color = WeightChart(this.health);

		ctx.beginPath();
		ctx.moveTo(drawX - 25, drawY);
		ctx.lineTo(drawX, drawY + 10);
		ctx.lineTo(drawX + 25, drawY);
		ctx.lineTo(drawX - 25, drawY);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.canShoot = function(){
		return this.readyToShoot;
	}

	this.move = function(){
		if (this.isDead())
			return;

		switch(this.state){
			case SwooperState.SWOOP:
				if (this.moveRight){
					if (this.loc.getX1() < this.posX &&
						this.loc.getX1() < 500)
						this.loc.x += 5;
					else{
						this.moveRight = false;
						this.swoop += 1;
					}
				}
				else{
					if (this.loc.x > this.negX &&
						this.loc.x > 10)
						this.loc.x -= 5;
					else{
						this.moveRight = true;
						this.swoop += 1;
					}
				}
				if(this.swoop >= this.swoopMax &&
					this.loc.x > this.origX - 10 &&
					this.loc.x < this.origX + 10){
					this.swoop = 0;
					this.state = SwooperState.RUSH;
				}
				break;
			case SwooperState.RUSH:
				this.loc.y += 15;
				if (this.loc.y > this.origY + 300){
					this.origY += 100;
					if (this.loc.y > 600)
						this.origY = 50;
					this.state = SwooperState.RETREAT;
				}
				break;
			case SwooperState.RETREAT:
				this.loc.y -= 5;
				if (this.loc.y <= this.origY)
					this.state = SwooperState.SWOOP;
				break;
			}
	}

	this.isDead = function(){
		if (this.health <= 0)
			return true;
		
		return false;
	}
}

function demon(x, y, health, weight) {
	this.loc = new position(x, y, 20, 25);
	this.health = health;
	this.weight = weight;
	this.readyToShoot = false;
	this.isDead = false;
	
	this.proximity = 25;	
	let X = Math.random() * 500;
	let Y = Math.random() * 500;	
	this.destination = new position(X, Y, 0, 0);
	this.slope = (this.destination.y - this.loc.y) / (this.destination.x - this.loc.x);
	this.increment = (this.destination.x - this.loc.x) / 50;

	this.move = function(){
		if (this.isDead())
			return;

		//let increment = (this.destination.x - this.loc.x) / 50;
		this.loc.x = this.increment + this.loc.x;
		this.loc.y = this.loc.y + this.slope * this.increment;

		if (this.inProximityOfDestination() || this.isOutofBounds()){
			this.destination = this.getDestination();
			this.slope = (this.destination.y - this.loc.y) / (this.destination.x - this.loc.x);
			this.increment = (this.destination.x - this.loc.x) / 50;
		}
	}

	this.draw = function(ctx){
		if (this.health <= 0)
			return;

		if (debugCollisions){
			ctx.strokeStyle = 'White';
			ctx.strokeRect(this.loc.x, this.loc.y, this.loc.width, this.loc.height);
			return;
		}

		this.color = WeightChart(this.health);

		ctx.beginPath();
		ctx.moveTo(this.loc.x + this.loc.width / 2, this.loc.y);
		ctx.lineTo(this.loc.x + this.loc.width, this.loc.y + this.loc.height / 2);
		ctx.lineTo(this.loc.x + this.loc.width / 2, this.loc.y + this.loc.height);
		ctx.lineTo(this.loc.x, this.loc.y + this.loc.height / 2);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.canShoot = function(){
		return this.readyToShoot;
	}

	this.isDead = function(){
		if (this.health <= 0)
			return true;
		
		return false;
	}

	this.getDestination = function(){
		let X = Math.random() * 500;
		if (X < 10)
			X = 10;
		else if (X > 490)
			X = 490;
		let Y = Math.random() * 700;
		if (Y < 10)
			Y = 10;
		else if (Y > 700)
			Y = 700;
		return new position(X, Y, 0, 0);
	}

	this.isOutofBounds = function(){
		if (this.loc.x < 0 || this.loc.x > 500 || this.loc.y < 0 || this.loc.y > 700)
			return true;
		
		return false;
	}

	this.inProximityOfDestination = function(){
		if (this.loc.x - this.destination.x < this.proximity && this.loc.y - this.destination.y < this.proximity)
			return true;
		
		return false;
	}
}

function predator (x, y, health, weight, playerPositionProvider) {
	this.loc = new position(x, y, 20, 25);
	this.health = health;
	this.weight = weight;
	this.playerPositionProvider = playerPositionProvider;
	this.state = PredatorState.MOVE;

	this.proximity = 25;	
	let randomX = Math.random() * 500;
	let randomY = Math.random() * 100;	
	this.destination = new position(randomX, randomY, 0, 0);
	this.incrementX = (this.destination.x - this.loc.x) / 50;
	this.incrementY = (this.destination.y - this.loc.y) / 50;

	this.shotWait = 0;
	this.waitTime = 25;

	this.shootTime = 1 + Math.floor(weight / 5);
	this.currentShootTime = 0;

	this.move = function(){
		if (this.isDead())
			return;

		switch(this.state){
			case PredatorState.SHOOT:
				this.currentShootTime += 1;
				if (this.currentShootTime >= this.shootTime){
					this.currentShootTime = 0;
					this.state = PredatorState.WAIT;
				}
				break;
			case PredatorState.WAIT:
				this.shotWait += 1;
				if (this.shotWait >= this.waitTime){
					this.shotWait = 0;
					this.state = PredatorState.MOVE;
				}
				break;
			case PredatorState.MOVE:
				this.loc.x = this.incrementX + this.loc.x;
				this.loc.y = this.incrementY + this.loc.y;

				if (this.inProximityOfDestination() || this.isOutofBounds()){
					this.destination = this.getDestination();
					this.incrementX = (this.destination.x - this.loc.x) / 50;
					this.incrementY = (this.destination.y - this.loc.y) / 50;
					this.state = PredatorState.SHOOT;
					this.readyToShoot = true;
				}
				break;
		}
	}

	this.draw = function(ctx){ 
		if (this.health <= 0) 
			return; 
 
		if (debugCollisions){ 
			ctx.strokeStyle = 'White'; 
			ctx.strokeRect(this.loc.x, this.loc.y, this.loc.width, this.loc.height); 
			return; 
		} 
 
		let targetAngle = this.getAngle();
		this.color = WeightChart(this.health); 
 
		ctx.save(); 
		ctx.translate(this.loc.centerX(), this.loc.centerY()); 
		ctx.rotate(targetAngle) 
 
		third = this.loc.height / 2 - this.loc.height / 3; 
 
		ctx.beginPath(); 
		ctx.moveTo(0, -this.loc.height / 2); 
		ctx.lineTo(this.loc.width / 2, -third); 
		ctx.lineTo(0, this.loc.height / 2); 
		ctx.lineTo(-this.loc.width / 2, -third); 
		ctx.closePath(); 
		ctx.fillStyle = this.color; 
		ctx.fill(); 
 
		ctx.restore(); 
	}

	this.getAngle = function(){
		let playerLocation = playerPositionProvider.getPlayerPosition();
		let diffX = playerLocation.x - this.loc.centerX();
		let diffY = playerLocation.y - this.loc.centerY();
		return -Math.atan2(diffX,diffY);
	}

	this.isDead = function(){
		if (this.health <= 0)
			return true;
		
		return false;
	}

	this.canShoot = function(){
		return this.state == PredatorState.SHOOT;
		if (this.state == PredatorState.SHOOT){
			return true;
		}
		return false;
	}

	this.getProjectile = function(playerLoc){
		let speed = 15;
		let X = this.loc.centerX();
		let Y = this.loc.centerY();

		let incrementX = (playerLoc.x - X) / 25;
		let incrementY = (playerLoc.y - Y) / 25;

		let target = new position(playerLoc.x, playerLoc.y, 0, 0)

		return new missile(X + incrementX, Y + incrementY, target, speed, this.weight);
	}

	this.getDestination = function(){
		let newDestination = this.destination;
		while(this.distanceFromPoint(newDestination.x, newDestination.y) < this.proximity){
			let randomX = Math.random() * 500;
		if (randomX < 10)
			randomX = 10;
		else if (randomX > 490)
			randomX = 490;
		let randomY = Math.random() * 700;
		if (randomY < 10)
			randomY = 10;
		else if (randomY > 700)
			randomY = 700;

		newDestination = new position(randomX, randomY, 0, 0);
		}
		
		return newDestination;
	}

	this.isOutofBounds = function(){
		if (this.loc.x < 0 || this.loc.x > 500 || this.loc.y < 0 || this.loc.y > 700)
			return true;
		
		return false;
	}

	this.inProximityOfDestination = function(){
		if (this.distanceFromPoint(this.destination.x, this.destination.y) < this.proximity)
			return true;
		
		return false;
	}

	this.distanceFromPoint = function(x, y){
		let distance = Math.sqrt(Math.pow(this.loc.x - x, 2) + Math.pow(this.loc.y - y, 2));
		return distance;
	}
}